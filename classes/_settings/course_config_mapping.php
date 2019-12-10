<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined('ABSPATH') or die('No script kiddies please!');

/* -------------------------------------------- */
class AX_Settings_Tab_Course_Config_Mapping
{
    private $course_config_mapping_setting_key = 'axip_course_config_mapping_settings';
    const course_config_mapping_setting_key = 'axip_course_config_mapping_settings';
    public function __construct()
    {
    }
    public function register_settings()
    {
        /**
         * * Add Course Mapping Configuration Settings **
         */

        add_settings_section('section_course_config_map', __('Course (Config) Mapping Settings', 'axip'), array(
            &$this,
            'section_mapping_desc',
        ), self::course_config_mapping_setting_key);

        register_setting(self::course_config_mapping_setting_key, 'ax_course_config_mapping_settings');
        add_settings_field('ax_course_config_mapping_settings', __('Course Mapping Configuration:', 'axip'), array(
            &$this,
            'field_mapping_table',
        ), self::course_config_mapping_setting_key, 'section_course_config_map');
    }

    public function section_mapping_desc()
    {
        echo 'This section allows for custom mapping rules for courses, at the Enrolment Widget level.';
        echo '<p><em>These mapping rules will take precedence over other settings - but are not required to be set.</em></p>';
    }

    public function field_mapping_table()
    {
        $VERSION = constant('AXIP_PLUGIN_VERSION');
        if ($VERSION === null) {
            $VERSION = time();
        }
        $Settings_Plugin = new Settings_API_Tabs_AXIP_Plugin();
        $Settings_Plugin->ax_deregister_load_general_scripts();

        $mapping_settings = get_option('ax_course_config_mapping_settings');
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

        //ADD CONFIG SEARCH

        $enrollerWidgetSettings = get_option('ax_enroller_widget_settings');
        if (!empty($enrollerWidgetSettings)) {
            $data = json_decode($enrollerWidgetSettings, true, 10);

            $mapArray2 = array();

            foreach ($data as $key => $value) {
                $tempArray = array(
                    'ID' => $key,
                    'CONFIG_ID' => $key,
                    'MAP_KEY' => $key,
                );
                if (!empty($value['config_name'])) {
                    $tempArray['CONFIG_NAME'] = $value['config_name'];
                } else {
                    $tempArray['CONFIG_NAME'] = "Config_ID: " . $key;
                }
                array_push($mapArray2, $tempArray);

            }

            /* Load Scripts */
            wp_register_script('course-config-mapping', plugins_url('/enrollerWidget/course-config-mapping.js', AXIP_PLUGIN_NAME), array(), $VERSION);
            wp_enqueue_script('course-config-mapping');
            wp_localize_script('course-config-mapping', 'course_config_vars', array(
                'mapping_settings' => $mapping_settings,
                'mapping_list_1' => $mapArray1,
                'mapping_list_2' => $mapArray2,
            ));

            wp_register_style('course_mapping', plugins_url('/enrollerWidget/mapping-widget.css', AXIP_PLUGIN_NAME), array(), $VERSION);
            wp_enqueue_style('course_mapping');

            ?>
				<div id="course_mapping_holder">
					<div id="ax_mapping_widget_holder"></div>
					<input type="hidden" id="ax_course_config_mapping_settings" name="ax_course_config_mapping_settings" value="<?php echo htmlspecialchars($mapping_settings) ?>" />
				</div>
			<?php
}
    }

}