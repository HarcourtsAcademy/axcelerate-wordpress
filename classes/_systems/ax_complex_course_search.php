<?php



if (!defined('ABSPATH')) {
    die('-1');
}

class AX_Course_Search_Service
{
    public function __construct()
    {
        add_action('init', 'AX_Course_Search_Service::register_ajax_actions');
    }


    //TODO: decide if recursion here or in JS is the best option....
    public static function initiate_course_search($searchParams = array(), $offset)
    {
        $AxcelerateAPI = new AxcelerateAPI();
        $searchParams['offset'] = $offset;
        $Request = $AxcelerateAPI->callResource($searchParams, '/course/instance/search', "POST");

        if (is_object($Request)) {
            return array();
        } else {

            $count = count($Request);

            if ($count > 0) {
                $last = $Request[$count - 1];
                if (($offset + $count) < $last->COUNT) {
                    $Request = array_merge($Request, self::initiate_course_search($searchParams, $offset + $count));
                }
            } else {
                return array();
            }
            return $Request;
        }


    }
    public static function process_course_record($courseRecord)
    {
        return $courseRecord;

    }
    public static function filter_course_search_results($searchResults = array(), $courseFilter = array(), $domainFilter = array(), $showEmptyDomain = true, $showCoursesIfFilterEmpty = true)
    {
        $filtered = array();

        if (is_array($searchResults) && count($searchResults) > 0) {
            foreach ($searchResults as $row) {
                $allowed = true;

                if (!empty($courseFilter)) {
                    if (is_array($courseFilter)) {
                        if (count($courseFilter) > 0) {
                            if (!in_array($row->ID, $courseFilter)) {

                                $allowed = false;
                            }
                        }
                    }
                } else if (!$showCoursesIfFilterEmpty) {
                    $allowed = false;
                }

                if (!empty($domainFilter)) {

                    if (is_array($domainFilter)) {
                        if (count($domainFilter) > 0) {
                            // if no domain
                            if (empty($row->DOMAINID)) {
                             
                                //if showemptydomain is false, don't allow the display
                                if (!$showEmptyDomain) {
                                    $allowed = false;
                                }
                            } elseif (!in_array($row->DOMAINID, $domainFilter)) {
                                $allowed = false;
                            }
                        }
                    }
                }

                if ($allowed) {
                    $vacancy = self::get_updated_vacancy($row); // Group Vacancy Check.
                    $row->PARTICIPANTVACANCY = $vacancy;
                    array_push($filtered, self::process_course_record(($row)));
                }
            }
        }


        return $filtered;
    }
    /**
     * TODO:
     * Take params from the request object and set up search params.
     * Call initiate_course_search to retrieve the courses.
     * call the filter function to filter the results based on rules
     * return results
     */
    public static function ajax_course_search()
    {
        $startDate_max = date('Y-m-d', strtotime("+1 month"));
        if(isset($_REQUEST['workshop_default_period'])){
            $startDate_max = date('Y-m-d', strtotime("+".$_REQUEST['workshop_default_period']." month"));
        }
        $params = array(
            'displayLength' => 500,
            'type' => 'w',
            'startDate_min' => date('Y-m-d', strtotime("-1 day")),
            'startDate_max' => $startDate_max,
            'finishDate_min' => date('Y-m-d'),
            'finishDate_max' => '2100-01-01',
            'enrolmentOpen' => 1,


        );
        $courseFilter = isset($_REQUEST['courses']) ? $_REQUEST['courses'] : array();
        $showCoursesIfFilterEmpty = true;
        if (isset($_REQUEST['courses'])) {
            $showCoursesIfFilterEmpty = false;
        }
        $domainFilter = isset($_REQUEST['domains']) ? $_REQUEST['domains'] : "";
        $showEmptyDomains = self::binary_normalise($_REQUEST['show_empty_domains']);

        if (!empty($_REQUEST['course_type'])) {
            if ($_REQUEST['course_type'] == 'p') {
                $params['startDate_min'] = date('Y-m-d', strtotime("-6 months"));
                $params['startDate_max'] = date('Y-m-d', strtotime("+72 months"));
                $params['type'] = 'p';
            }
        }

        if (!empty($_REQUEST['start_date'])) {
            $params['finishDate_min'] = $_REQUEST['start_date'];
            $params['startDate_min'] = $_REQUEST['start_date'];
        }
        if (!empty($_REQUEST['finish_date'])) {
            $params['startDate_max'] = $_REQUEST['finish_date'];
            $endD = strtotime($_REQUEST['finish_date']);
            $endD = date('Y-m-d', strtotime("+1 month", $endD));
            $params['finishDate_max'] = $endD;

            if ($params['type'] == 'p') {
                $endD = strtotime($_REQUEST['finish_date']);
                $endD = date('Y-m-d', strtotime("+72 months", $endD));
                $params['finishDate_max'] = $endD;
            }
        }



        if (!empty($_REQUEST['course_id'])) {
            $params['ID'] = $_REQUEST['course_id'];

        }

        if (!empty($_REQUEST['course_code'])) {
            $params['code'] = $_REQUEST['course_code'];
        }

        if (!empty($_REQUEST['domain_id'])) {
            $params['domainID'] = $_REQUEST['domain_id'];
        }

        if (!empty($_REQUEST['instance_id'])) {
            $instance_only = array(
                'instanceID' => $_REQUEST['instance_id'],
                'everything' => true
            );

            $Results = self::initiate_course_search($instance_only, 0);

            $Results = self::filter_course_search_results($Results);
            // Support ID or instance ID here.
            if (count($Results) == 0) {
                $params['ID'] = $_REQUEST['instance_id'];
                $Results = self::initiate_course_search($params, 0);

                $Results = self::filter_course_search_results($Results, $courseFilter, $domainFilter, $showEmptyDomains, $showCoursesIfFilterEmpty);
            }


        } else {
            $Results = self::initiate_course_search($params, 0);

            $Results = self::filter_course_search_results($Results, $courseFilter, $domainFilter, $showEmptyDomains, $showCoursesIfFilterEmpty);
        }

        echo json_encode($Results);

        die();


    }

    public static function binary_normalise($value)
    {

        if (is_string($value)) {
            if (strcmp($value, 'true') === 0 || strcmp($value, '1') === 0) {
                return true;
            } else if (strcmp($value, 'false') === 0 || strcmp($value, '0') === 0) {
                return false;
            }
        } else {
            if ($value === true || $value === 1) {
                return true;
            } else if ($value === false || $value === 0) {
                return false;
            }
        }

        return $value;
    }


    public static function get_updated_vacancy($instance)
    {
        $vacancy = $instance->PARTICIPANTVACANCY;
        if (!empty($instance->GROUPEDCOURSEID) && !empty($instance->GROUPEDCOURSEISSIMULTANEOUS)) {

            $groupMax = $instance->GROUPEDMAXPARTICIPANTS;
            $groupCurrent = $instance->GROUPEDPARTICIPANTS;
            if ($groupCurrent < $groupMax && $vacancy > 0) {
                if ($vacancy > ($groupMax - $groupCurrent)) {
                    $vacancy = $groupMax - $groupCurrent;
                }
            } else {
                $vacancy = 0;
            }
        }
        return $vacancy;
    }

    public static function retrieve_venues()
    {
        // Pull from DB
        $venues_array = get_transient('ax_venue_complex', array());
        $venueCount = 0;
        if (is_array($venues_array)) {
            $venueCount = count($venues_array);
        }
        // DB empty then

        // Pull from AX
        if ($venueCount == 0) {
            $params = array('displayLength' => 5000);
            $AxcelerateAPI = new AxcelerateAPI();

            $venues_array = $AxcelerateAPI->callResource($params, 'venues', 'GET');

            if (is_object($venues_array)) {
                //This is an error
            } else {
                set_transient('ax_venue_complex', $venues_array, 60 * 12 * MINUTE_IN_SECONDS);
            }
        }
        return $venues_array;

    }

    public static function retrieve_domains()
    {
        // Pull from DB
        $domains_array = get_transient('ax_domains_complex', array());
        $domainCount = 0;
        if (is_array($domains_array)) {
            $domainCount = count($domains_array);
        }
        // DB empty then

        // Pull from AX
        if ($domainCount == 0) {
            $params = array('displayLength' => 2000);
            $AxcelerateAPI = new AxcelerateAPI();

            $domains_array = $AxcelerateAPI->callResource($params, 'domains', 'GET');

            if (is_object($domains_array)) {
                //This is an error
            } else {
                set_transient('ax_domains_complex', $domains_array, 60 * 1 * MINUTE_IN_SECONDS);
            }
        }
        return $domains_array;

    }
    public static function retrieve_locations()
    {

    }

    public static function retrieve_courses($course_type = 'w')
    {
        // Pull from DB


        $courses_array = get_transient('ax_courses_complex_' . $course_type, array());

        $courseCount = 0;
        if (is_array($courses_array)) {
            $courseCount = count($courses_array);
        }
        // DB empty then
 
        // Pull from AX
        if ($courseCount == 0) {
            $params = array('displayLength' => 2000, 'type' => $course_type);
            $AxcelerateAPI = new AxcelerateAPI();

            $courses_array = $AxcelerateAPI->callResource($params, 'courses', 'GET');

            if (is_object($courses_array)) {
                // This is an error
            } else {
                // Transient lasts for 1 hour
                set_transient('ax_courses_complex_' . $course_type, $courses_array, 1 * 10 * MINUTE_IN_SECONDS);
            }
        }

        return $courses_array;

    }
    public static function get_venue_filter_list()
    {
        $refArray = array();
        $venues = self::retrieve_venues();
        foreach ($venues as $venue) {
            $refArray[$venue->CONTACTID] = $venue;
        }

        return $refArray;
    }

    public static function get_course_filter_list($course_type)
    {
        $refArray = array();

        $courses_array = self::retrieve_courses($course_type);
        foreach ($courses_array as $course) {
            $refArray[$course->ID] = $course;
        }

        return $refArray;
    }

    public static function get_domain_filter_list()
    {
        $refArray = array();
        $domains = self::retrieve_domains();
        foreach ($domains as $domain) {
            $refArray[$domain->DOMAINID] = $domain;
        }

        return $refArray;
    }


    public static function register_ajax_actions()
    {
        add_action('wp_ajax_ax_complex_course_search', 'AX_Course_Search_Service::ajax_course_search');
        add_action('wp_ajax_nopriv_ax_complex_course_search', 'AX_Course_Search_Service::ajax_course_search');
    }


}

$AX_ComplexService = new AX_Course_Search_Service();

