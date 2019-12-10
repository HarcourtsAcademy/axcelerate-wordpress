<?php

if (!defined('ABSPATH')) {
    die('-1');
}

class AX_Events_Calendar
{
    public function __construct()
    {
    }
    public static function registerEventHooks()
    {
        if (class_exists('Tribe__Events__API')) {
            //TEMP FIX FOR EVENTS CALENDAR MESSING UP CURRENCY
            add_filter('tribe_reverse_currency_position', function () {
                return null;
            });
            add_action('event_cal_update', array('AX_Events_Calendar', 'event_calendar_update'));
            add_action('event_cal_update_w', array('AX_Events_Calendar', 'event_calendar_update_w'));
            add_action('event_cal_update_p', array('AX_Events_Calendar', 'event_calendar_update_p'));
            add_action('event_cal_cleanup', array('AX_Events_Calendar', 'event_calendar_cleanup'));
            add_action('event_cal_cleanup_w', array('AX_Events_Calendar', 'event_calendar_cleanup_w'));
            add_action('event_cal_cleanup_p', array('AX_Events_Calendar', 'event_calendar_cleanup_p'));

            add_action('event_cal_fetch_venues_l', array('AX_Events_Calendar', 'event_calendar_venues_l'));
            add_action('event_cal_fetch_venues_v', array('AX_Events_Calendar', 'event_calendar_venues_v'));
            add_action('event_cal_fetch_venues_dl', array('AX_Events_Calendar', 'event_calendar_venues_dl'));


            add_action('cleanup_invalid_events_w', array('AX_Events_Calendar', 'cleanup_invalid_workshops'));
            add_action('event_cal_create_instances', array('AX_Events_Calendar', 'create_instances'));
            add_action('event_cal_process_instances_w', array('AX_Events_Calendar', 'process_instances_cron_w'));
            add_action('event_cal_process_instances_p', array('AX_Events_Calendar', 'process_instances_cron_p'));
            add_action('cleanup_invalid_events_p', array('AX_Events_Calendar', 'cleanup_invalid_programs'));

            $settingP = get_option('ax_event_calendar_setting_p');
            $settingW = get_option('ax_event_calendar_setting_w');
            if (!empty($settingP) || !empty($settingW)) {
                wp_register_style('ax_event_cal', plugins_url('/css/ax-event-calendar.css', AXIP_PLUGIN_NAME), array(), AXIP_PLUGIN_VERSION);
                wp_enqueue_style('ax_event_cal');
                wp_enqueue_script('ec_helper', plugins_url('/js/ax-event-cal-helper.js', AXIP_PLUGIN_NAME), array('jquery', 'the-events-calendar'), AXIP_PLUGIN_VERSION, true);
            }
        }
    }
    public static function log_error($errorDetails)
    {
        try {
            error_log(print_r($errorDetails, true));
            wp_mail(Axcelerate_Integration_Plugin::DEBUGEMAIL, 'EventsCal Error:', print_r($errorDetails, true));
        } catch (Exception $e) {
        }


    }

    public static function event_calendar_update()
    {
        self::register_course_instances();
    }
    public static function event_calendar_update_w()
    {
        self::register_course_instances('w');
    }
    public static function event_calendar_update_p()
    {
        self::create_venues('program');
        self::register_course_instances('p');
    }

    public static function event_calendar_cleanup()
    {
        self::clear_course_instances();
    }
    public static function event_calendar_cleanup_w()
    {
        self::clear_course_instances('w');
    }
    public static function event_calendar_cleanup_p()
    {
        self::clear_course_instances('p');
    }

    public static function event_calendar_venues_v()
    {
        self::create_venues('workshop');
    }
    public static function event_calendar_venues_l()
    {
        self::create_venues('location');
    }
    public static function event_calendar_venues_dl()
    {
        self::create_venues('delivery-location');
    }

    public static function cleanup_invalid_workshops()
    {
        self::cleanup_invalid_events('w');
    }
    public static function cleanup_invalid_programs()
    {
        self::cleanup_invalid_events('p');
    }
    public static function process_instances_cron_w()
    {
        $course_instances = get_transient('ax_course_instances_w');
        if (!empty($course_instances)) {
            if ($course_instances) {
                self::process_instances($course_instances, 'w');
            }
        }

    }
    public static function process_instances_cron_p()
    {
        $course_instances = get_transient('ax_course_instances_p');
        if (!empty($course_instances)) {
            if ($course_instances) {
                self::process_instances($course_instances, 'p');
            }
        }
    }

    public static function create_venues($venueType = 'workshop')
    {
        $VENUEID = 'ax_venue_id';
        $VENUETYPE = 'ax_venue_type';

        if (class_exists('Tribe__Events__API')) {
            try {
                $Tribe__Events__API = new Tribe__Events__API();
                $AxcelerateAPI = new AxcelerateAPI();

                $mappingArray = self::get_venue_mapping();

                if ($venueType == 'workshop') {
                    $params = array('displayLength' => 2000);
                    $venues_array = $AxcelerateAPI->callResource($params, 'venues', 'POST');

                    if (is_array($venues_array)) {
                        if (count($venues_array) > 0) {
                            foreach ($venues_array as $axVenue) {
                                if (key_exists('CONTACTID', $axVenue)) {
                                    $axVenueID = $axVenue->CONTACTID . '_w';
                                /*Check to see if venue is not already in WP*/
                                    if (empty($mappingArray[$axVenueID])) {
                                        $venueData = self::venue_data_v($axVenue);
                                        self::create_venue($axVenueID, 'workshop', $venueData);
                                    }
                                }
                            }
                        }
                    } else {
                        if (is_object($venues_array)) {
                            self::log_error($venues_array);
                        }
                    }
                } elseif ($venueType == 'location') {
                    $params = array('public' => true, 'onlyFuture' => true);
                    $venues_array = $AxcelerateAPI->callResource($params, 'course/locations', 'GET');
                    if (is_array($venues_array)) {
                        if (count($venues_array) > 0) {
                            foreach ($venues_array as $axVenue) {
                                $axVenueTitle = urlencode($axVenue);
                                $axVenueID = $axVenueTitle . '_l';

                                if (empty($mappingArray[$axVenueID]) && empty($mappingArray[$axVenueTitle])) {
                                    $venueData = self::venue_data_l($axVenue);
                                    self::create_venue($axVenueID, 'location', $venueData);
                                }
                            }
                        }
                    } else {
                        if (is_object($venues_array)) {
                            self::log_error($venues_array);
                        }
                    }

                } elseif ($venueType == "delivery-location") {
                    $params = array('active' => true);
                    $venues_array = $AxcelerateAPI->callResource($params, 'course/deliveryLocations', 'GET');
                    if (is_array($venues_array)) {
                        if (count($venues_array) > 0) {
                            foreach ($venues_array as $axVenue) {
                                $venue = (array)$axVenue;
                                if (!empty($venue['ID'])) {
                                    $venueID = $venue['ID'] . '_dl';
                                    if (empty($mappingArray[$venueID])) {
                                        $venueData = self::venue_data_dl($venue);
                                        self::create_venue($venueID, 'delivery-location', $venueData);
                                    }
                                }
                            }
                        }
                    } else {
                        if (is_object($venues_array)) {
                            self::log_error($venues_array);
                        }
                    }
                }
            } catch (Exception $e) {
                self::log_error($e);
            }
        }
    }
    /**
     *
     * @return $mappingArray[]
     */
    public static function get_venue_mapping()
    {
        try {
            if (class_exists('Tribe__Events__API')) {
                $VENUEID = 'ax_venue_id';
                $VENUETYPE = 'ax_venue_type';
                $Tribe__Events__API = new Tribe__Events__API();
                $currentVenues = tribe_get_venues(false, 5000);
                $mappingArray = array();
                foreach ($currentVenues as $venueRecord) {
                    if (!empty($venueRecord->$VENUEID)) {
                        $mappingArray[$venueRecord->$VENUEID] = $venueRecord;
                
                        /*add Extra row for possible (but unlikely) location to venue matchup*/
                        $mappingArray[urlencode($venueRecord->post_title)] = $venueRecord;
                    }
                }
                return $mappingArray;
            } else {
                return array();
            }
        } catch (Exception $e) {
            self::log_error($e);
            return array();
        }
    }


    public static function venue_data_l($venueRecord)
    {
        $venueData = array();

        if (!empty($venueRecord)) {
            $venueData['Venue'] = $venueRecord;
            $venueData['Country'] = 'Australia';
            $venueData['Address'] = $venueRecord;
        }


        return $venueData;
    }

    public static function venue_data_v($venueRecord)
    {
        $venueData = array();

        if (!empty($venueRecord)) {
            $venueData['Country'] = 'Australia';
            $venueData['Address'] = $venueRecord->SADDRESS1 . ', ' . $venueRecord->SADDRESS2;
            $venueData['City'] = $venueRecord->SCITY;
            $venueData['State'] = $venueRecord->SSTATE;
            $venueData['Province'] = $venueRecord->SSTATE;
            $venueData['Zip'] = $venueRecord->SPOSTCODE;

            $venueName = '';
            if (!empty($venueRecord->NAME)) {
                $venueName = $venueName . $venueRecord->NAME . ':';
            }
            if (!empty($venueRecord->SADDRESS1)) {
                $venueName = $venueName . ' ' . $venueData['Address'];
            }
            if (!empty($venueRecord->SCITY)) {
                $venueName = $venueName . ' ' . $venueData['City'];
            }
            if (!empty($venueRecord->SSTATE)) {
                $venueName = $venueName . ' ' . $venueData['State'];
            }
            if (!empty($venueRecord->SPOSTCODE)) {
                $venueName = $venueName . ' ' . $venueData['Zip'];
            }

            $venueData['Venue'] = $venueName;
        }


        return $venueData;
    }

    public static function venue_data_dl($venueRecord)
    {
        $venueData = array();

        if (!empty($venueRecord)) {
            $venueData['Country'] = $venueRecord['COUNTRY'];

            $venueData['City'] = $venueRecord['CITY'];
            $venueData['State'] = $venueRecord['STATE'];
            $venueData['Province'] = $venueRecord['STATE'];
            $venueData['Zip'] = $venueRecord['POSTCODE'];

            $venueAddress = '';
            if (!empty($venueRecord['BUILDINGNAME'])) {
                $venueAddress = $venueAddress . $venueRecord['BUILDINGNAME'] . ' ';
            }
            if (!empty($venueRecord['UNITNO'])) {
                $venueAddress = $venueAddress . $venueRecord['UNITNO'] . '/';
            }
            if (!empty($venueRecord['STREETNO'])) {
                $venueAddress = $venueAddress . $venueRecord['STREETNO'] . ' ';
            }
            if (!empty($venueRecord['STREETNAME'])) {
                $venueAddress = $venueAddress . $venueRecord['STREETNAME'];
            }
            $venueData['Address'] = $venueAddress;

            $venueData['Venue'] = $venueRecord['NAME'];
        }


        return $venueData;
    }
    public static function create_venue($venueID, $venueType, $venueData)
    {
        if (class_exists('Tribe__Events__API')) {
            $Tribe__Events__API = new Tribe__Events__API();
            $newPostID = tribe_create_venue($venueData);
            $VENUEID = 'ax_venue_id';
            $VENUETYPE = 'ax_venue_type';
            add_post_meta($newPostID, $VENUEID, $venueID);
            add_post_meta($newPostID, $VENUETYPE, $venueType);
            return $newPostID;
        } else {
            return null;
        }
    }


    /**
     *
     * @param string $courseType
     */
    public static function clear_course_instances($courseType = 'all')
    {
        try {
            if (class_exists('Tribe__Events__API')) {
                /* EVENT CLEANUP FOR TESTING PURPOSES */
                $alreadySet = tribe_get_events(array(
                    'posts_per_page' => 5000
                ));
                $pagesExist = array();
                foreach ($alreadySet as $event) {
                    if (!empty($event->instance_ref)) {
                        $refSplit = explode('_', $event->instance_ref);
                        if ($courseType == 'all' || $courseType == strtolower($refSplit[1])) {
                            wp_delete_post($event->ID);
                        }
                    }
                }
            }
        } catch (Exception $e) {
            self::log_error($e);
        }
    }

    public static function get_courses($array, $params)
    {
        $AxcelerateAPI = new AxcelerateAPI();
        $coursesArray = $AxcelerateAPI->callResource($params, 'courses/', 'GET');
        if (is_array($coursesArray)) {
            if (count($coursesArray) > 0) {
                foreach ($coursesArray as $crow) {
                    $array[$crow->ID . '_' . $crow->TYPE] = $crow;
                }
            }

            return $array;
        } else {
            self::log_error($coursesArray);
        }
        return $array;

    }


    public static function retrieve_course_instances($params, $offset)
    {
        $AxcelerateAPI = new AxcelerateAPI();
        $params['offset'] = $offset;
        $course_instance_array = $AxcelerateAPI->callResource($params, 'course/instance/search', 'POST');
        if (is_array($course_instance_array)) {
            $count = count($course_instance_array);

            if ($count > 0) {
                $last = $course_instance_array[$count - 1];
                if (($offset + $count) < $last->COUNT) {
                    $course_instance_array = array_merge($course_instance_array, self::retrieve_course_instances($params, $offset + $count));
                }
            }
            return $course_instance_array;
        } elseif (is_object($course_instance_array)) {
            
            self::log_error($course_instance_array);
        }
        return array();


    }



    /**
     *
     * @param string $courseType
     */
    public static function register_course_instances($courseType = 'all')
    {
        try {
            if (class_exists('Tribe__Events__API')) {
                //TODO: Consider if this should be updated further.
                if (function_exists('set_time_limit')) {
                    @set_time_limit(300);
                }
                $AxcelerateAPI = new AxcelerateAPI();
                $params = array(
                    'displayLength' => 500,
                    'type' => $courseType,

                    'startDate_max' => '2100-01-01',
                    'finishDate_min' => date('Y-m-d'),
                    'finishDate_max' => '2100-01-01',
                    'enrolmentOpen' => 1
                );
                if ($courseType == 'w') {
                    $params['startDate_min'] = date('Y-m-d', strtotime("-1 month"));
                } else {
                    $params['startDate_min'] = date('Y-m-d', strtotime("-6 months"));
                }
                $course_instance_array = array();
               
                
                $tcFilterW = get_option('ax_event_calendar_w_filter');
                $tcFilterP = get_option('ax_event_calendar_p_filter');
                if (!empty($tcFilterP) && $courseType == 'p') {
                    $trainingCats = explode(',', $tcFilterP);

                    foreach ($trainingCats as $trainingCategory) {
                        $params['trainingCategory'] = $trainingCategory;
                        $tc_course_instance = self::retrieve_course_instances($params, 0);
                        $course_instance_array = array_merge($course_instance_array, $tc_course_instance);

                    }
                } else if (!empty($tcFilterW) && $courseType == 'w') {
                    $trainingCats = explode(',', $tcFilterW);

                    foreach ($trainingCats as $trainingCategory) {
                        $params['trainingCategory'] = $trainingCategory;
                        $tc_course_instance = self::retrieve_course_instances($params, 0);
                        $course_instance_array = array_merge($course_instance_array, $tc_course_instance);
                    }

                } else {
                    $course_instance_array = self::retrieve_course_instances($params, 0);
                }




                set_transient('ax_course_instances_' . $courseType, $course_instance_array, 30 * MINUTE_IN_SECONDS);

                if (!wp_next_scheduled('event_cal_process_instances_' . $courseType)) {
                    wp_schedule_single_event(time() + 1 * 60, 'event_cal_process_instances_' . $courseType);
                }

                //self::process_instances($course_instance_array, $courseType);

            }
        } catch (Exception $e) {
            self::log_error($e);
        }
    }

    /**
     * Process instances, determine if events already exist and create if they do not
     *
     * @param [array] $course_instance_array
     * @param [string] $courseType
     * @return void
     * @author Rob Bisson <rob.bisson@axcelerate.com.au>
     */
    public static function process_instances($course_instance_array, $courseType)
    {
        if (class_exists('Tribe__Events__API')) {
            if (function_exists('set_time_limit')) {
                @set_time_limit(300);
            }
            $eventCalDelayed = get_option('ax_event_cal_delayed_creation');

            $Tribe__Events__API = new Tribe__Events__API();


            $venueMode = get_option('ax_event_calendar_w_venues');
            if (!empty($venueMode)) {
                $venueMode = $venueMode === "enabled";
            }

            $alreadySet = tribe_get_events(
                array(
                    'posts_per_page' => 500
                )
            );

            $pagesExist = array();
            foreach ($alreadySet as $event) {
                if (!empty($event->complex_ref)) {
                    $refSplit = explode('_', $event->instance_ref);
                    $pagesExist[$event->complex_ref] = array(
                        'found' => false,
                        'exists' => true,
                        'page_id' => $event->ID,
                        'type' => $refSplit[1],
                        'event' => $event
                    );
                } else if (!empty($event->instance_ref)) {
                    $refSplit = explode('_', $event->instance_ref);
                    $pagesExist[$event->instance_ref] = array(
                        'found' => false,
                        'exists' => true,
                        'page_id' => $event->ID,
                        'type' => $refSplit[1],
                        'event' => $event
                    );
                } else {
                    //Another type of event found.
                }
            }


            $mapping_settings = json_decode(get_option('ax_course_mapping_settings'), true);

            $cparams = array(
                'displayLength' => 1000,
                'current' => 1,
                'type' => $courseType
            );
            
            /*Get Courses*/

            /*** TRAINING CATEGORY FILTERS ***/
            $tcFilterW = get_option('ax_event_calendar_w_filter');
            $tcFilterP = get_option('ax_event_calendar_p_filter');

            $idRefArray = array();

            if ($courseType == 'w') {
                if (!empty($tcFilterW)) {
                    $trainingCats = explode(',', $tcFilterW);

                    foreach ($trainingCats as $trainingCategory) {
                        $cparams['trainingArea'] = $trainingCategory;
                        $idRefArray = self::get_courses($idRefArray, $cparams);

                    }
                } else {
                    $idRefArray = self::get_courses($idRefArray, $cparams);
                }
            } elseif ($courseType == 'p') {
                if (!empty($tcFilterP)) {
                    $trainingCats = explode(',', $tcFilterP);
                    foreach ($trainingCats as $trainingCategory) {
                        $cparams['trainingArea'] = $trainingCategory;

                        $idRefArray = self::get_courses($idRefArray, $cparams);

                    }
                } else {
                    $idRefArray = self::get_courses($idRefArray, $cparams);
                }
            } else {
                if (!empty($tcFilterW)) {
                    $trainingCats = explode(',', $tcFilterW);
                    foreach ($trainingCats as $trainingCategory) {
                        $cparams['trainingArea'] = $trainingCategory;
                        $idRefArray = self::get_courses($idRefArray, $cparams);
                    }
                }
                if (!empty($tcFilterP)) {
                    $trainingCats = explode(',', $tcFilterP);
                    foreach ($trainingCats as $trainingCategory) {
                        $cparams['trainingArea'] = $trainingCategory;
                        $idRefArray = self::get_courses($idRefArray, $cparams);
                    }
                }

                if (empty($tcFilterW) && empty($tcFilterP)) {
                    $idRefArray = self::get_courses($idRefArray, $cparams);
                }
            }



            $taxonomy = TribeEvents::TAXONOMY;
            $terminologyW = 'Workshop';
            $terminologyP = "Program";
            $tWopt = get_option('ax_course_terminology_w');
            $tPopt = get_option('ax_course_terminology_p');

            if (!empty($tWopt)) {
                $terminologyW = $tWopt;
            }
            if (!empty($tPopt)) {
                $terminologyP = $tPopt;
            }

            if ($catTermW = get_term_by('name', $terminologyW, $taxonomy)) {
                $catTermWID = $catTermW->term_id;
            } else {
                $inserted_term = wp_insert_term($terminologyW, $taxonomy);
                if (!is_wp_error($inserted_term)) {
                    $catTermWID = $inserted_term['term_id'];
                }
            }

            if ($catTermP = get_term_by('name', $terminologyP, $taxonomy)) {
                $catTermPID = $catTermP->term_id;
            } else {
                $inserted_term = wp_insert_term($terminologyP, $taxonomy);
                if (!is_wp_error($inserted_term)) {
                    $catTermPID = $inserted_term['term_id'];
                }
            }


            $updateExisting = get_option('ax_event_calendar_update_events', 'disabled') == 'enabled';
            /*Venues*/
            $venueMapping = self::get_venue_mapping();
            
            /*
             * Including the do_shortcode call here will result in substantial slowdown
             * Replace this method with a pre instance search course list call and map the content to the instance.
             */
            foreach ($course_instance_array as $row) {
            
            /*Check here to eliminate the need to go through this block if enrolment is closed*/
                if (!empty($row->ENROLMENTOPEN)) {
                    $eventExists = !empty($pagesExist[$row->INSTANCEID . '_' . $row->TYPE]);
                    if ($eventExists) {
                    /*check that for the type being searched the course exists*/

                    //FLAGS THE INSTANCE AS NOT TO BE REMOVED
                        if ($row->TYPE == $courseType) {
                            if (!empty($idRefArray[$row->ID . '_' . $row->TYPE])) {
                                $pagesExist[$row->INSTANCEID . '_' . $row->TYPE]['found'] = true;
                            }
                        }
                    }

                    if (!empty($idRefArray[$row->ID . '_' . $row->TYPE]) && $row->TYPE != 'el' && (!$eventExists || ($updateExisting && $eventExists))) {

                        $newEvent = self::processInstance($row, $venueMode);
                    
                    /* Check the mapping settings for an existing page and Clone the content */
                        if (!empty($mapping_settings[$row->ID . '_' . $row->TYPE])) {
                            $orgPostID = $mapping_settings[$row->ID . '_' . $row->TYPE]['PAGE_ID'];
                            $mappingID = $row->ID . '_' . $row->TYPE;
                            $newEvent['ax_mapping_rule'] = $mappingID . "_" . $orgPostID;

                            $post = get_post($orgPostID);
                            $newEvent['post_content'] = $post->post_content;

                        //wp_mail(Axcelerate_Integration_Plugin::DEBUGEMAIL, 'Updating Event', json_encode($newEvent ['ax_mapping_rule']));


                            $custom_field_keys = get_post_custom_keys($orgPostID);
                            foreach ($custom_field_keys as $key => $value) {
                                $newEvent[$value] = $post->$value;
                            }
                        }

                        if (!empty($row->ENROLMENTOPEN)) {
                            $update = false;

                            if ($eventExists) {

                                $currentRecord = $pagesExist[$row->INSTANCEID . '_' . $row->TYPE];

                                $crResponse = self::processExistingPage($newEvent, $currentRecord, $update);
                                $update = $crResponse['update'];
                                $newEvent = $crResponse['event'];


                            }
                        //wp_mail(Axcelerate_Integration_Plugin::DEBUGEMAIL, 'Event dump', json_encode($newEvent));
                            $complexDates = get_option('ax_event_calendar_complex_dates', 'disabled') === 'enabled';
                     
                        //Check to see if complex dates is empty or not.
                            if ($row->TYPE == "w") {
                                if ($row->COMPLEXDATES && $complexDates) {
                                    if (!empty($pagesExist[$row->INSTANCEID . '_' . $row->TYPE])) {
                                        $pagesExist[$row->INSTANCEID . '_' . $row->TYPE]['found'] = false; // flag base event to be removed
                                    }
                                    foreach ($row->COMPLEXDATES as $complexDate) {
                                        $complexUpdate = false;

                                        $rowCopy = $row;
                                        $rowCopy->STARTDATE = $complexDate->DATE . " " . $complexDate->STARTTIME;
                                        $rowCopy->FINISHDATE = $complexDate->DATE . " " . $complexDate->ENDTIME;
                                        if (!empty($complexDate->LOCATION)) {
                                            $rowCopy->LOCATION = $complexDate->LOCATION;
                                        }
                                        if (!empty($complexDate->VENUECONTACTID)) {
                                            $rowCopy->VENUECONTACTID = $complexDate->VENUECONTACTID;
                                        }
                                        $newComplexEvent = self::processInstance($rowCopy, $venueMode);
                                        $complex_ref = $rowCopy->INSTANCEID . '_' . $rowCopy->TYPE . '_' . urlencode($rowCopy->STARTDATE);
                                        if (!empty($pagesExist[$complex_ref])) {
                                            $pagesExist[$complex_ref]['found'] = true;
                                            $record = $pagesExist[$complex_ref];
                                            $compResponse = self::processExistingPage($newComplexEvent, $record, $complexUpdate);

                                            $complexUpdate = $compResponse['update'];
                                            $newComplexEvent = $compResponse['event'];
                                            $eventExists = true;

                                        } else {
                                            $eventExists = false;
                                        }
                                        $newComplexEvent['complex_ref'] = $complex_ref;



                                        if ($complexUpdate || !$eventExists) {
                                            $existingID = null;
                                            if ($complexUpdate) {
                                                $existingID = $record['page_id'];
                                            }
                                        //Store the complex id in meta...
                                            self::storeEventObject($rowCopy, $newComplexEvent, $complexUpdate, $existingID, $catTermWID, $catTermPID, $taxonomy);
                                        //wp_mail(Axcelerate_Integration_Plugin::DEBUGEMAIL, 'Event dump', json_encode($newComplexEvent));
                                        }

                                    }
                                } else {
                                    if (!$eventExists || $update) {
                                        $existingID = null;
                                        if ($update) {
                                            $existingID = $pagesExist[$row->INSTANCEID . '_' . $row->TYPE]['page_id'];
                                        }
                                    //wp_mail(Axcelerate_Integration_Plugin::DEBUGEMAIL, 'Event dump', json_encode($newEvent));
                                        self::storeEventObject($row, $newEvent, $update, $existingID, $catTermWID, $catTermPID, $taxonomy);
                                    }
                                }

                            } else {
                                if (!$eventExists || $update) {
                                    $existingID = null;
                                    if ($update) {
                                        $existingID = $pagesExist[$row->INSTANCEID . '_' . $row->TYPE]['page_id'];
                                    }
                                //wp_mail(Axcelerate_Integration_Plugin::DEBUGEMAIL, 'Event dump', json_encode($newEvent));
                                    self::storeEventObject($row, $newEvent, $update, $existingID, $catTermWID, $catTermPID, $taxonomy);
                                }
                            }

                        //$example = [{"DATE":"2017-11-16","STARTTIME":"09:30:00","ENDTIME":"13:00:00","TRAINERCONTACTID":4744,"LOCATION":null,"ROOMID":0,"VENUECONTACTID":null,"STATE":null},{"DATE":"2017-11-14","STARTTIME":"09:30:00","ENDTIME":"13:00:00","TRAINERCONTACTID":4744,"LOCATION":null,"ROOMID":0,"VENUECONTACTID":null,"STATE":null}];


                        }
                    }
                }
            }
        /*if in delayed mode then schedule task to create instances*/
            if ($eventCalDelayed == 'enabled') {
                if (!wp_next_scheduled('event_cal_create_instances')) {
                    wp_schedule_single_event(time() + 1 * 60, 'event_cal_create_instances');
                }
            }

        /*Set Temporary Database Record for $pageExists in order to facilitate cleaning*/
            set_transient('ax_course_cleanup_' . $courseType, $pagesExist, 30 * MINUTE_IN_SECONDS);
            if ($courseType == 'w') {
                wp_schedule_single_event(time() + 20 * 60, 'cleanup_invalid_events_w');
            } elseif ($courseType == 'p') {
                wp_schedule_single_event(time() + 20 * 60, 'cleanup_invalid_events_p');
            }
        } else {
        //Event Calendar does not exist - so don't do any of the above!;
        }
    }

    /**
     * Undocumented function
     *
     * @param [type] $row
     * @param [type] $event
     * @param [type] $update
     * @param [type] $existingID
     * @return void
     * @author Rob Bisson <rob.bisson@axcelerate.com.au>
     */
    public static function storeEventObject($row, $newEvent, $update, $existingID, $catTermWID, $catTermPID, $taxonomy)
    {
        $eventCalDelayed = get_option('ax_event_cal_delayed_creation');
        if ($eventCalDelayed == 'enabled') {
            if ($row->TYPE == 'w') {
                $terms = $catTermWID;
            } else {
                $terms = $catTermPID;
            }
            $trial = array(
                'event' => $newEvent,
                'terms' => $terms,
                'course_ref' => $row->ID . '_' . $row->TYPE,
                'instance_ref' => $row->INSTANCEID . '_' . $row->TYPE,
                'update_existing' => $update,
            );

            if ($update) {
                $trial['existing_id'] = $existingID;
            }

            if (!empty($newEvent['complex_ref'])) {
                $trial['complex_ref'] = $newEvent['complex_ref'];
                set_transient('ax_instance_' . $newEvent['complex_ref'], $trial, 10 * MINUTE_IN_SECONDS); //Complex ID DB
            } else {
                set_transient('ax_instance_' . $row->INSTANCEID . '_' . $row->TYPE, $trial, 10 * MINUTE_IN_SECONDS);
            }
        } else {
            if ($update) {
                $newPostID = tribe_update_event($existingID, $newEvent);

            } else {
                $newPostID = tribe_create_event($newEvent);

            }

            if (!empty($newPostID)) {
                if ($row->TYPE == 'w') {
                    wp_set_object_terms($newPostID, intval($catTermWID, 10), $taxonomy, true);
                } elseif ($row->TYPE == 'p') {
                    wp_set_object_terms($newPostID, intval($catTermPID, 10), $taxonomy, true);
                }
                update_post_meta($newPostID, 'course_ref', $row->ID . '_' . $row->TYPE, true);
                update_post_meta($newPostID, 'instance_ref', $row->INSTANCEID . '_' . $row->TYPE, true);
                if(key_exists('EncodedTime', $newEvent)){
                    update_post_meta($newPostID, 'encoded_time', $newEvent['EncodedTime'], true);
                }
                
                update_post_meta($newPostID, 'ax_cost', $newEvent['ax_cost'], true);
                if (!empty($newEvent['ax_mapping_rule'])) {
                    update_post_meta($newPostID, 'ax_mapping_rule', $newEvent['ax_mapping_rule'], true);
                }
                if (!empty($newEvent['complex_ref'])) {
                    update_post_meta($newPostID, 'complex_ref', $newEvent['complex_ref'], true);
                }
            }
        }
    }
    /**
     * Process an existing page to determine if it should be updated
     *
     * @param [array]   $newEvent      Event
     * @param [array]   $currentRecord Page
     * @param [boolean] $update        boolean flag
     * 
     * @return void
     * @author Rob Bisson <rob.bisson@axcelerate.com.au>
     */
    public static function processExistingPage($newEvent, $currentRecord, $update)
    {

        $venueID = $newEvent['Venue']['VenueID'] . "";
        $currentRecordMeta = get_post_meta($currentRecord['page_id']);
        if (!empty($currentRecordMeta)) {
            if ($currentRecordMeta['_EventVenueID'][0] !== $venueID) {
                $newEvent['venue_diff'] = true;
                $update = true;
            }
            $post_title = $currentRecord['event']->post_title;
            if (urlencode($post_title) !== urlencode($newEvent['post_title'])) {
                $newEvent['name_diff'] = true;
                $update = true;
            }
            if(key_exists('encoded_time', $currentRecordMeta)){
                if (!empty($currentRecordMeta['encoded_time'][0])) {

                    if ($currentRecordMeta['encoded_time'][0] !== $newEvent["EncodedTime"]) {
    
                        $newEvent['time_diff'] = true;
                        $update = true;
                    }
                } elseif (!empty($newEvent["EncodedTime"])) {
                    $newEvent['time_diff'] = true;
    
                    $update = true;
                }
            }
            elseif(key_exists('EncodedTime', $newEvent)){
                if (!empty($newEvent["EncodedTime"])) {
                    $newEvent['time_diff'] = true;
    
                    $update = true;
                }
            }
            

            if (!empty($currentRecordMeta['ax_cost'])) {
                if (!empty($currentRecordMeta['ax_cost'][0])) {
                    $newCost = $newEvent["ax_cost"] . "";
                    if ($currentRecordMeta['ax_cost'][0] !== $newCost) {
                        $newEvent['cost_diff'] = true;
                        $newEvent['compared_cost'] = $currentRecordMeta['ax_cost'][0];
                        $newEvent['stringified_cost'] = $newCost;
                        $update = true;
                    }
                } elseif (!empty($newEvent["ax_cost"])) {
                    $newEvent['no_cost'] = true;
                    $update = true;
                }
            } elseif (!empty($newEvent["ax_cost"])) {
                $newEvent['no_cost'] = true;

                $update = true;
            }
            if (!empty($currentRecordMeta['ax_mapping_rule'])) {
                if (!empty($currentRecordMeta['ax_mapping_rule'][0])) {
                    $newEvent['existing_map'] = $currentRecordMeta['ax_mapping_rule'][0];
                    if ($currentRecordMeta['ax_mapping_rule'][0] !== $newEvent["ax_mapping_rule"]) {
                        $newEvent['map_rule_a'] = true;
                        $update = true;
                    }
                } elseif (!empty($newEvent["ax_mapping_rule"])) {
                    $newEvent['map_rule_b'] = true;
                    $update = true;
                }
            } elseif (!empty($newEvent["ax_mapping_rule"])) {
                $newEvent['map_rule_c'] = true;
                $update = true;
            }
        }
        return array(
            'event' => $newEvent,
            'update' => $update
        );
    }


    /**
     * Process an instance and return an event
     *
     * @param [array] $row       Course Instance row
     * @param string  $venueMode Use venues/locations
     * 
     * @return [array] Event
     * @author Rob Bisson <rob.bisson@axcelerate.com.au>
     */
    public static function processInstance($row, $venueMode)
    {

        $workshopContent = get_option('ax_course_detail_layout_w');
        $programContent = get_option('ax_course_detail_layout_p');
        $AxcelerateAPI = new AxcelerateAPI();

        $venueMapping = self::get_venue_mapping();
        
        if ($row->TYPE == 'w') {
            $newEvent = array(
                'EventStartDate' => date('Y-m-d', strtotime($row->STARTDATE)),
                'EventEndDate' => date('Y-m-d', strtotime($row->FINISHDATE)),

                'post_content' => '[ax_course_details course_type=' . $row->TYPE . ' course_id=' . $row->ID . ']' . $workshopContent . '[/ax_course_details]',
                'EventStartHour' => '06',
                'EventStartMinute' => '00',

                'EventStartMeridian' => 'am',
                'EventEndHour' => '11',
                'EventEndMinute' => '00',
                'EventEndMeridian' => 'pm',
                'post_status' => 'publish',
                'post_title' => $row->NAME,
            );

            /*Check if venue mode enabled, and if there is a venue contact present*/
            if ($venueMode && !(empty($row->VENUECONTACTID))) {
                $axVenueID = $row->VENUECONTACTID . '_v';
                if (!empty($venueMapping[$axVenueID])) {
                    $newEvent['Venue'] = array(
                        'VenueID' => $venueMapping[$axVenueID]->ID
                    );
                } else {
                    $venueMapping = self::get_venue_mapping();
                    if (!empty($venueMapping[$axVenueID])) {
                        $newEvent['Venue'] = array(
                            'VenueID' => $venueMapping[$axVenueID]->ID
                        );
                    } else {
                        $venueData = $AxcelerateAPI->callResource(array('CONTACTID' => $row->VENUECONTACTID), 'venues', 'GET');
                        if (is_array($venueData)) {
                            if (count($venueData) > 0) {
                                if (!empty($venueData[0]) && !empty($venueData[0]->CONTACTID)) {
                                    $newVenueID = self::create_venue($axVenueID, 'venue', self::venue_data_v($venueData = $venueData[0]));
                                    $newEvent['Venue'] = array(
                                        'VenueID' => $newVenueID
                                    );
                                }
                            }

                        }

                    }
                }
            } else {
                $axVenueTitle = urlencode($row->LOCATION);
                $axVenueID = $axVenueTitle . '_l';
                if (!empty($venueMapping[$axVenueID])) {
                    $newEvent['Venue'] = array(
                        'VenueID' => $venueMapping[$axVenueID]->ID
                    );
                } elseif (!empty($venueMapping[$axVenueTitle])) {
                    $newEvent['Venue'] = array(
                        'VenueID' => $venueMapping[$axVenueTitle]->ID
                    );
                } else {
                    /*Refresh Venues Array - Avoid duplicates*/
                    $venueMapping = self::get_venue_mapping();
                    if (!empty($venueMapping[$axVenueID])) {
                        $newEvent['Venue'] = array(
                            'VenueID' => $venueMapping[$axVenueID]->ID
                        );
                    } elseif (!empty($venueMapping[$axVenueTitle])) {
                        $newEvent['Venue'] = array(
                            'VenueID' => $venueMapping[$axVenueTitle]->ID
                        );
                    } else {
                        $newVenueID = self::create_venue($axVenueID, 'location', self::venue_data_l($row->LOCATION));
                        $newEvent['Venue'] = array(
                            'VenueID' => $newVenueID
                        );
                    }
                }
            }


            $EventStartHour = date('H', strtotime($row->STARTDATE));
            $EventStartMinute = date('i', strtotime($row->STARTDATE));
            $EventEndHour = date('H', strtotime($row->FINISHDATE));
            $EventEndMinute = date('i', strtotime($row->FINISHDATE));
            $EventStartMeridian = 'am';
            $EventEndMeridian = 'am';

            $newEvent['EncodedTime'] = urlencode($row->STARTDATE) . "_" . urlencode($row->FINISHDATE);


            if (intval($EventStartHour, 10) > 12) {
                $EventStartHour = $EventStartHour - 12;
                $EventStartMeridian = 'pm';
            } elseif (intval($EventStartHour, 10) == 12) {
                $EventStartMeridian = 'pm';
            } elseif (intval($EventStartHour, 10) == 0) {
                $EventStartHour = 12;
            }
            if (intval($EventEndHour, 10) > 12) {
                $EventEndHour = $EventEndHour - 12;
                $EventEndMeridian = 'pm';
            } elseif (intval($EventEndHour, 10) == 12) {
                $EventEndMeridian = 'pm';
            } elseif (intval($EventEndHour, 10) == 0) {
                $EventEndHour = 12;
            }

            if (intval($EventStartHour, 10) == 0 && intval($EventStartMinute, 10) == 0) {
                $newEvent['EventAllDay'] = true;
            } else {
                $newEvent['EventStartHour'] = $EventStartHour;
                $newEvent['EventStartMinute'] = $EventStartMinute;
                $newEvent['EventStartMeridian'] = $EventStartMeridian;

                $newEvent['EventEndHour'] = $EventEndHour;
                $newEvent['EventEndMinute'] = $EventEndMinute;
                $newEvent['EventEndMeridian'] = $EventEndMeridian;
            }


            if (!empty($row->COST)) {
                $newEvent['EventCost'] = $row->COST;
                $newEvent['ax_cost'] = $row->COST;
            } else {
                $newEvent['ax_cost'] = 0;
            }
            if (!empty($idRefArray[$row->ID . '_' . $row->TYPE]->SHORTDESCRIPTION)) {
                $newEvent['post_excerpt'] = $idRefArray[$row->ID . '_' . $row->TYPE]->SHORTDESCRIPTION;
            }
            return $newEvent;
        } elseif ($row->TYPE == 'p') {
            $newEvent = array(
                'EventStartDate' => date('Y-m-d', strtotime($row->STARTDATE)),
                'EventEndDate' => date('Y-m-d', strtotime($row->FINISHDATE)),

                'post_content' => '[ax_course_details course_type=' . $row->TYPE . ' course_id=' . $row->ID . ']' . $programContent . '[/ax_course_details]',
                'EventAllDay' => true,
                'post_status' => 'publish',
                'post_title' => $row->NAME,
                'course_ref' => $row->ID . '_' . $row->TYPE,
            );
            if (!empty($row->COST)) {
                $newEvent['EventCost'] = $row->COST;
                $newEvent['ax_cost'] = $row->COST;
            } else {
                $newEvent['ax_cost'] = 0;
            }
            if (!empty($idRefArray[$row->ID . '_' . $row->TYPE]->SHORTDESCRIPTION)) {
                $newEvent['post_excerpt'] = $idRefArray[$row->ID . '_' . $row->TYPE]->SHORTDESCRIPTION;
            }
            if (!empty($row->DELIVERYLOCATIONID)) {
                $axVenueID = $row->DELIVERYLOCATIONID . '_dl';
                if (!empty($venueMapping[$axVenueID])) {
                    $newEvent['Venue'] = array(
                        'VenueID' => $venueMapping[$axVenueID]->ID
                    );
                } else {
                    /*Refresh Venues Array - Avoid duplicates*/
                    $venueMapping = self::get_venue_mapping();
                    if (!empty($venueMapping[$axVenueID])) {
                        $newEvent['Venue'] = array(
                            'VenueID' => $venueMapping[$axVenueID]->ID
                        );
                    } else {

                        $venueData = $AxcelerateAPI->callResource(array('ID' => $row->DELIVERYLOCATIONID), 'course/deliveryLocation/', 'GET');
                        if (is_object($venueData)) {
                            if (!empty($venueData->ID)) {
                                $venueData = (array)$venueData;
                            } else {
                               self::log_error($venueData);
                            }
                        }
                        if (is_array($venueData)) {
                            $newVenueID = self::create_venue($axVenueID, 'delivery-location', self::venue_data_dl($venueData));
                            $newEvent['Venue'] = array(
                                'VenueID' => $newVenueID
                            );
                        }


                    }
                }
            }
            return $newEvent;
        }

    }

    /**
     *
     * @param string $courseType
     */
    public static function cleanup_invalid_events($courseType = 'all')
    {
        if (function_exists('set_time_limit')) {
            @set_time_limit(300);
        }
        try {
            if (class_exists('Tribe__Events__API')) {
                $pagesExist = get_transient('ax_course_cleanup_' . $courseType);

                if ($pagesExist) {
                    foreach ($pagesExist as $eventRow) {
                        if (empty($eventRow['found'])) {
                            if (strtolower($eventRow['type']) == strtolower($courseType) || strtolower($courseType) == 'all') {
                                /*Check if post exists*/
                                if (!(false === get_post_status($eventRow['page_id']))) {

                                    wp_delete_post($eventRow['page_id']);
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception $e) {
            self::log_error($e);
        }
    }

    /**
     * Creates instances based on database records created under the delayed creation option.
     * Will create a maximum of 20 instances at a time, and cycle every minute creating other instances.
     */
    public static function create_instances()
    {
        if (function_exists('set_time_limit')) {
            @set_time_limit(300);
        }
        $eventCalDelayed = get_option('ax_event_cal_delayed_creation');
        $workshopEnabled = get_option('ax_event_calendar_setting_w') === 'enabled';
        $programEnabled = get_option('ax_event_calendar_setting_p') === 'enabled';

        if (class_exists('Tribe__Events__API')) {
            if ($eventCalDelayed == 'enabled') {
                $taxonomy = TribeEvents::TAXONOMY;
                $anotherCycle = false;
                $instances = AX_Instances::getInstancesToCreate();
                /*check for empty array*/
                if (is_array($instances)) {
                    $countInstances = count($instances);
                    if ($countInstances < 20) {
                        $limit = $countInstances;
                    } else {
                        $limit = 20;
                        $anotherCycle = true;
                    }
                    $i = 0;
                    if ($countInstances > 0) {
                        foreach ($instances as $instance) {
                            $i++;
                            $instanceData = unserialize($instance->value);
                            /*check to make sure that instance creation is enabled for the type.*/
                            $type = explode('_', $instanceData['course_ref'])[1];
                            if ($type === 'w' && !$workshopEnabled) {
                                if (!empty($instanceData['complex_ref'])) {
                                    AX_Instances::clearInstance('ax_instance_' . $instanceData['complex_ref']);
                                } else {
                                    AX_Instances::clearInstance('ax_instance_' . $instanceData['instance_ref']);
                                }

                            } elseif ($type === 'p' && !$programEnabled) {
                                AX_Instances::clearInstance('ax_instance_' . $instanceData['instance_ref']);
                            } else {
                                /*create instance*/

                                if (!empty($instanceData['update_existing'])) {
                                    if (!empty($instanceData['existing_id'])) {
                                        $newPostID = tribe_update_event($instanceData['existing_id'], $instanceData["event"]);
                                        $test = array();
                                        wp_set_object_terms($newPostID, intval($instanceData["terms"], 10), $taxonomy, true);
                                        $test['c'] = update_post_meta($newPostID, 'course_ref', $instanceData["course_ref"]);
                                        $test['i'] = update_post_meta($newPostID, 'instance_ref', $instanceData["instance_ref"]);
                                        if(key_exists('EncodedTime', $instanceData["event"])){
                                            $test['e'] = update_post_meta($newPostID, 'encoded_time', $instanceData["event"]['EncodedTime']);
                                        }
                                       
                                        $test['ax'] = update_post_meta($newPostID, 'ax_cost', $instanceData["event"]['ax_cost']);
                                        if (!empty($instanceData["event"]['ax_mapping_rule'])) {
                                            $test['mr'] = update_post_meta($newPostID, 'ax_mapping_rule', $instanceData["event"]['ax_mapping_rule']);
                                        }
                                        if (!empty($instanceData['complex_ref'])) {
                                            $test['cid'] = update_post_meta($newPostID, 'complex_ref', $instanceData["complex_ref"]);
                                        }
                                        //wp_mail(Axcelerate_Integration_Plugin::DEBUGEMAIL, 'Updating Event', json_encode($instanceData)."||||}|}|}".json_encode($test));
                                    }
                                } else {
                                    $newPostID = tribe_create_event($instanceData["event"]);
                                    wp_set_object_terms($newPostID, intval($instanceData["terms"], 10), $taxonomy, true);
                                    add_post_meta($newPostID, 'course_ref', $instanceData["course_ref"], true);
                                    add_post_meta($newPostID, 'instance_ref', $instanceData["instance_ref"], true);
                                    if(key_exists('EncodedTime', $instanceData["event"])){
                                        add_post_meta($newPostID, 'encoded_time', $instanceData["event"]['EncodedTime'], true);
                                    }
                                    add_post_meta($newPostID, 'ax_cost', $instanceData["event"]['ax_cost'], true);
                                    if (!empty($instanceData["event"]['ax_mapping_rule'])) {
                                        add_post_meta($newPostID, 'ax_mapping_rule', $instanceData["event"]['ax_mapping_rule'], true);
                                    }
                                    if (!empty($instanceData['complex_ref'])) {
                                        add_post_meta($newPostID, 'complex_ref', $instanceData["complex_ref"], true);
                                    }
                                    //wp_mail(Axcelerate_Integration_Plugin::DEBUGEMAIL, 'Updating Event', json_encode($instanceData)."||||}|}|}".json_encode($test));
                                }
                                
        
                                /*clear DB record*/
                                if (!empty($instanceData['complex_ref'])) {
                                    AX_Instances::clearInstance('ax_instance_' . $instanceData['complex_ref']);
                                } else {
                                    AX_Instances::clearInstance('ax_instance_' . $instanceData['instance_ref']);
                                }
                                /*make sure we haven't hit our limit on number of events created*/
                            }
                            if ($i == $limit) {
                                break;
                            }
                        }
                    }
                    
                        
                    /*there were more than 20 instances to create, so add another create task*/
                    if ($anotherCycle) {
                        /*double check one hasn't already been scheduled by another task. The instance list is the same regardless*/
                        if (!wp_next_scheduled('event_cal_create_instances')) {
                            wp_schedule_single_event(time() + 1 * 60, 'event_cal_create_instances');
                        }
                    }
                }
            }
        }
    }
}
