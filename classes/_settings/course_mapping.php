<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined('ABSPATH') or die('No script kiddies please!');

/* -------------------------------------------- */
class AX_Settings_Tab_Course_Mapping
{
    private $course_mapping_setting_key = 'axip_course_mapping_settings';
    const course_mapping_setting_key = 'axip_course_mapping_settings';
    public function __construct()
    {
    }
    public function register_settings()
    {
        /**
         * * Add Course Mapping Configuration Settings **
         */

        add_settings_section('section_course_map', __('Course Mapping Settings', 'axip'), array(
            &$this,
            'section_mapping_desc',
        ), self::course_mapping_setting_key);

        register_setting(self::course_mapping_setting_key, 'ax_course_mapping_settings');
        add_settings_field('ax_course_mapping_settings', __('Course Mapping Configuration:', 'axip'), array(
            &$this,
            'field_mapping_table',
        ), self::course_mapping_setting_key, 'section_course_map');
    }

    public function section_mapping_desc()
    {
        echo 'This section allows for custom mapping of courses from a Full Course List to specific pages/posts. Courses and a list of pages have automatically been retrieved. If Courses do not display check your API credentials.';
        echo '<p><em>These mapping rules will take precedence over other settings, and will enable creation of dedicated pages for Courses. Used when The Events Calendar integration creates new Events to determine if an existing page/post should be cloned.</em></p>';
    }

    public function field_mapping_table()
    {
        $VERSION = constant('AXIP_PLUGIN_VERSION');
        if ($VERSION === null) {
            $VERSION = time();
        }
        $Settings_Plugin = new Settings_API_Tabs_AXIP_Plugin();
        $Settings_Plugin->ax_deregister_load_general_scripts();

        $mapping_settings = get_option('ax_course_mapping_settings');
        /* Build a Post Array and a Course Array for passing to the Mapping Widget */
        $AxcelerateAPI = new AxcelerateAPI();
        $courseList = $AxcelerateAPI->callResource(array(
            "displayLength" => 9999,
        ), '/courses', 'GET');
        $mapArray1 = array();

        foreach ($courseList as $row) {
            $tempArray = array(
                'ID' => $row->ID,
                'MAP_KEY' => $row->ID . '_' . $row->TYPE,
                'NAME' => $row->NAME,
            );
            if (!empty($row->STREAMNAME)) {
                $tempArray['NAME'] = $tempArray['NAME'] . '(' . $row->STREAMNAME . ')';
            }
            array_push($mapArray1, $tempArray);

        }

        $postsArray = get_posts(array(
            'post_type' => 'any',
            'numberposts' => -1,
        ));
        $mapArray2 = array();
        foreach ($postsArray as $row) {
            $tempArray = array(
                'ID' => $row->ID,
                'MAP_KEY' => $row->ID,
                'TITLE' => $row->post_title,
                'URL' => parse_url(get_permalink($row->ID), PHP_URL_PATH),
            );
            array_push($mapArray2, $tempArray);
        }

        /* Load Scripts */
        wp_register_script('course-mapping', plugins_url('/enrollerWidget/course-mapping.js', AXIP_PLUGIN_NAME), array(), $VERSION);
        wp_enqueue_script('course-mapping');
        wp_localize_script('course-mapping', 'course_map_vars', array(
            'mapping_settings' => $mapping_settings,
            'mapping_list_1' => $mapArray1,
            'mapping_list_2' => $mapArray2,
        ));

        wp_register_style('course_mapping', plugins_url('/enrollerWidget/mapping-widget.css', AXIP_PLUGIN_NAME), array(), $VERSION);
        wp_enqueue_style('course_mapping');

        ?>
			<div id="course_mapping_holder">
				<div id="ax_mapping_widget_holder"></div>
				<input type="hidden" id="ax_course_mapping_settings" name="ax_course_mapping_settings" value="<?php echo htmlspecialchars($mapping_settings) ?>" />
			</div>
			<?php
}
}
