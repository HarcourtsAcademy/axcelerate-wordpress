<?php
if (!defined('ABSPATH')) {
    die('-1');
}

/**
 * Complex course instance search.
 *
 *
 * Js file to control
 *
 * Script register
 *
 * Data table instantiation
 *
 * Ajax to search courses
 *
 * Filter Control
 *
 * (Should controls be established in shortcode? or should they instead be a settings page?)
 * 1: can have multiple setups
 * 1: could implement a new framework for editor?
 * 2: could use a "config" option / JS config tool?
 * 2: easier to find setup? / better control over it
 *
 *
 * Caching: How to handle.
 *
 *
 * Should the search be hooked directly up to the API, or should it instead search local data.
 *
 * Local data concerns:
 *
 * - Lot of API calls required / potentially huge dataset.
 * -
 *
 *
 *
 *
 *
 */
if (!class_exists('AX_Complex_Course_Search')) {

    /**
     * Complex Course Search
     *
     * @author Rob Bisson <rob.bisson@axcelerate.com.au>
     */
    class AX_Complex_Course_Search
    {
        public function __construct()
        {

            add_shortcode('ax_complex_course_search', array(&$this, 'complex_course_search_handler'));

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

        public function complex_course_search_handler($atts = array(), $content = null)
        {
            self::load_datatable_scripts();
            $venues = AX_Course_Search_Service::get_venue_filter_list();

            // TODO: TERMINOLOGY DOMAIN / COURSE?

            $args = shortcode_atts(
                array(
                    'course_list_filter' => array(), // List of course IDs(comma separated)
                    'course_filter' => 0, // Filter to a single course ID.
                    'domain_list_filter' => array(), // List of Domain IDs
                    'hide_courses' => false, // Hide the courses select menu
                    'hide_domains' => false, // Hide the domain select menu
                    'domain_filter' => 0, // Filter to a single domain
                    'course_filter_exclude' => true, // Exclude / ONLY courses from filter list
                    'domain_filter_exclude' => true, // Exclude / ONLY domains from filter list
                    'drilldown_url' => "", // URL to launch to. Supports relative/absolute etc
                    'show_empty_domains' => true, // Show courses that have no domain
                    'course_type' => 'w', // Show this course type
                    'terminology_course' => 'Course', // Terminology for course
                    'terminology_domain' => 'Domain', // Terminology for domain,
                    'workshop_default_period' => 1,
                ),
                $atts
            );

            $course_type = $args['course_type'];
            //Normalise binary.

            if (!is_array($args['course_list_filter'])) {
                $args['course_list_filter'] = urldecode($args['course_list_filter']);
            }
            if (!is_array($args['domain_list_filter'])) {
                $args['domain_list_filter'] = urldecode($args['domain_list_filter']);
            }

            $args['hide_courses'] = self::binary_normalise($args['hide_courses']);

            $args['hide_domains'] = self::binary_normalise($args['hide_domains']);

            $args['course_filter_exclude'] = self::binary_normalise($args['course_filter_exclude']);
            $args['domain_filter_exclude'] = self::binary_normalise($args['domain_filter_exclude']);

            $args['show_empty_domains'] = self::binary_normalise($args['show_empty_domains']);

            $html = '<div class="ax-complex-course-search" style="width:100%; max-width:90vW">';
            $html .= '<div class="ax-complex-course-search-controls">';

            if ($args['domain_filter'] !== 0 && !empty($args['domain_filter'])) {
                $html .= '<input id="ax_complex_domain" type="hidden" value="' . $args['domain_filter'] . '">';
            } else {
                if (!is_array($args['domain_list_filter'])) {
                    $args['domain_list_filter'] = explode(',', $args['domain_list_filter']);
                    if (!is_array($args['domain_list_filter'])) {
                        $args['domain_list_filter'] = array();
                    }
                    foreach ($args['domain_list_filter'] as $value) {
                        $value = trim($value);
                        $value = intval($value);
                    }
                }
                $domains = self::render_domain_select(urldecode($args['terminology_domain']), $args['domain_list_filter'], $args['domain_filter_exclude']);
                if (!$args['hide_domains']) {
                    $html .= $domains['html'];
                }

            }

            if ($args['course_filter'] !== 0 && !empty($args['course_filter'])) {

                $html .= '<input id="ax_complex_course" type="hidden" value="' . $args['course_filter'] . '">';
            } else {
                if (!is_array($args['course_list_filter'])) {
                    $args['course_list_filter'] = explode(',', $args['course_list_filter']);
                    if (!is_array($args['course_list_filter'])) {
                        $args['course_list_filter'] = array();

                    }

                    $argNew = array();
                    foreach ($args['course_list_filter'] as $value) {

                        $value = trim($value);
                        $value = intval($value);
                        array_push($argNew, $value);
                    }
                    $args['course_list_filter'] = $argNew;
                }

                $coursesFiltered = self::render_course_select($course_type, urldecode($args['terminology_course']), $args['course_list_filter'], $args['course_filter_exclude']);

                if (!$args['hide_courses']) {
                    $html .= $coursesFiltered['html'];
                }

            }

            $html .= self::render_datepicker();

            $html .= self::render_course_id();

            $html .= '<div class="input-group" style="justify-content:flex-end"><button class="btn btn-primary" style="padding-left:5em; padding-right:5em" id="ax_complex_search">Search</button></div>';

            $html .= '</div>'; //controls
            $html .= '<table id="ax_course_search_table" style="width:100%" ></table>';

            $html .= '</div>';

            // Tooltip error.
            $html .= '<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>';

            $coursesFiltered = isset($coursesFiltered) ? $coursesFiltered['courses'] : new ArrayObject();

            $domains = isset($domains) ? $domains['domains'] : array();

            self::load_course_search_scripts($args, $venues, $domains, $coursesFiltered);

            return $html;
        }

        public static function render_course_id()
        {
            $tip = 'Course codes are a alphanumeric set of numbers and letters provided by training organisations for both public and private courses.';

            $html = '<div class="input-group">';
            $html .= '<div class="input-group-prepend"><span class="input-group-text">Course ID</span></div>';
            $html .= '<input id="ax_complex_instance_id" name="ax_complex_instance_id" class="form-control" placeholder="Enter Course ID" type="text">';
            $html .= '<div class="input-group-append" data-toggle="tooltip" data-placement="right" title="' . $tip . '"><span class="input-group-text"> ? </span></div>';
            $html .= '</div>';
            return $html;
        }
        public static function render_datepicker()
        {
            $html = '<div class="input-group input-daterange" >';
            $html .= '<div class="input-group-prepend"><span class="input-group-text">Date Range</span></div>';
            $html .= '<input id="ax_complex_start_date" name="ax_complex_start_date" class="form-control" placeholder="dd/mm/yyyy" type="text">';
            $html .= '<div class="input-group-addon">to</div>';
            $html .= '<input id="ax_complex_finish_date" name="ax_complex_finish_date" class="form-control" placeholder="dd/mm/yyyy" type="text">';

            $html .= '</div>';

            return $html;

        }

        public static function render_domain_select($terminology, $domainFilter, $exclude)
        {

            $Domains = AX_Course_Search_Service::get_domain_filter_list();
            $filteredDomains = array();
            $html = "";
            if (count($Domains) > 0) {
                $html = '<select class="custom-select" id="ax_complex_domain">';
                $html .= '<option selected>Select ' . $terminology . '</option>';
                foreach ($Domains as $id => $domain) {
                    if (!in_array($id, $domainFilter) && $exclude) {
                        $html .= '<option value="' . $id . '">' . $domain->DOMAINNAME . '</option>';
                        array_push($filteredDomains, $id);
                    } else if (in_array($id, $domainFilter) && !$exclude) {
                        $html .= '<option value="' . $id . '">' . $domain->DOMAINNAME . '</option>';
                        array_push($filteredDomains, $id);
                    }

                }

                $html .= '</select>';

            }
            return array('html' => $html, 'domains' => $filteredDomains);
        }

        public static function render_course_select($course_type, $terminology, $courseFilter, $exclude)
        {

            $Courses = AX_Course_Search_Service::get_course_filter_list($course_type);

            $filteredCourses = array();
            $html = "";
            if (count($Courses) > 0) {
                $html = '<select class="custom-select" id="ax_complex_course">';
                $html .= '<option selected>Select ' . $terminology . '</option>';
                foreach ($Courses as $id => $course) {
                    if (!in_array($id, $courseFilter) && $exclude) {
                        $html .= '<option value="' . $id . '">' . $course->NAME . ' (' . $course->CODE . ')</option>';
                        $filteredCourses[$id] = $course;
                    } elseif (in_array($id, $courseFilter) && !$exclude) {
                        $html .= '<option value="' . $id . '">' . $course->NAME . ' (' . $course->CODE . ')</option>';
                        $filteredCourses[$id] = $course;
                    }

                }

                $html .= '</select>';

            }

            return array('html' => $html, 'courses' => $filteredCourses);

        }
        public static function load_datatable_scripts()
        {
            wp_dequeue_script('dataTables');
            wp_deregister_script('dataTables');
            wp_deregister_style('dataTables');

            wp_register_script(
                'dataTables',
                'https://cdn.datatables.net/v/bs4-4.0.0/dt-1.10.16/r-2.2.1/datatables.min.js',
                array('jquery'),
                AXIP_PLUGIN_VERSION
            );
            wp_enqueue_script('dataTables');

            wp_register_style('dataTables', 'https://cdn.datatables.net/v/bs4-4.0.0/dt-1.10.16/r-2.2.1/datatables.min.css', array(), AXIP_PLUGIN_VERSION);
            wp_enqueue_style('dataTables');
            wp_register_style('bootstrap-datepicker', 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.8.0/css/bootstrap-datepicker3.min.css', array(), AXIP_PLUGIN_VERSION);
            wp_enqueue_style('bootstrap-datepicker');

            wp_register_script(
                'bootstrap-datepicker',
                'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.8.0/js/bootstrap-datepicker.min.js',
                array('jquery'),
                AXIP_PLUGIN_VERSION
            );
            wp_enqueue_script('bootstrap-datepicker');

        }

        public static function load_course_search_scripts($args, $venues, $domains, $courses)
        {
            wp_register_script(
                'ax-course-search',
                plugins_url('js/sc_complex_course_search.js', __FILE__),
                array('jquery'),
                AXIP_PLUGIN_VERSION
            );
            wp_enqueue_script('ax-course-search');
            wp_localize_script('ax-course-search', 'ax_course_vars', array(
                'ajaxURL' => admin_url('admin-ajax.php'),
                'venues' => $venues,
                'drilldown_url' => urldecode($args['drilldown_url']),
                'domains' => $domains,
                'courses' => $courses,
                'show_empty_domains' => $args['show_empty_domains'],
                'course_type' => $args['course_type'],
                'workshop_default_period' => $args['workshop_default_period'],
            ));

            $default_stylesheet = plugins_url('/css/ax-standard.css', AXIP_PLUGIN_NAME);
            wp_register_style('ax-standard', $default_stylesheet, array());
            wp_enqueue_style('ax-standard');
        }

    }
    $AX_Complex_Course_Search = new AX_Complex_Course_Search();

    if (class_exists('WPBakeryShortCode') && class_exists('AX_VC_PARAMS') && class_exists('WPBakeryShortCodesContainer')) {
        vc_map(array(
            "name" => __("aX Complex CI Search", "axcelerate"),
            "base" => "ax_complex_course_search",
            "icon" => plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
            "description" => __("Leave empty to use the default template.", "axcelerate"),
            "content_element" => true,
            "show_settings_on_create" => true,
            "is_container" => false,
            "as_parent" => array('except' => 'ax_course_list,ax_course_details,ax_course_instance_list', 'only' => ''),
            //"as_child"=>array('except'=> 'ax_course_list,ax_course_details,ax_course_instance_list', 'only'=>''),
            //"is_container" => true,
            "category" => array(
                'aX Parent Codes',
            ),
            'params' => array(
                AX_VC_PARAMS::$AX_VC_DRILLDOWN_URL,
                AX_VC_PARAMS::$AX_VC_COURSE_TYPE_W_P,
                AX_VC_PARAMS::$AX_VC_COURSEID_FILTER,
                AX_VC_PARAMS::$AX_VC_DOMAINID_FILTER,
                AX_VC_PARAMS::$AX_VC_SHOW_EMPTY_DOMAINS,

                AX_VC_PARAMS::$AX_VC_SHOW_COURSE_SELECT,
                AX_VC_PARAMS::$AX_VC_FILTER_COURSE_IDS,
                AX_VC_PARAMS::$AX_VC_COURSE_FILTER_EXCLUDE,
                AX_VC_PARAMS::$AX_VC_WORKSHOP_DEFAULT_RANGE,

                AX_VC_PARAMS::$AX_VC_SHOW_DOMAIN_SELECT,
                AX_VC_PARAMS::$AX_VC_FILTER_DOMAIN_IDS,
                AX_VC_PARAMS::$AX_VC_DOMAIN_FILTER_EXCLUDE,

                AX_VC_PARAMS::$AX_VC_TERMINOLOGY_COURSE,
                AX_VC_PARAMS::$AX_VC_TERMINOLOGY_DOMAIN,

            ),
        ));
        class WPBakeryShortCode_aX_Complex_CI_Search extends WPBakeryShortCode
        {
        }
    }
}
