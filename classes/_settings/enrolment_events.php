<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */
class AX_Settings_Tab_Enrol_Events {
	private $enroller_enrolment_events_settings_key = 'axip_enroller_events_settings';
	const enroller_enrolment_events_settings_key = 'axip_enroller_events_settings';
	function __construct() {
		
		
	}
	function register_settings() {
		add_settings_section ( 'section_enroller_events', __ ( 'Enrolment Events', 'axip' ), array (
				&$this,
				'section_enroller_events_desc'
		), self::enroller_enrolment_events_settings_key);
		
		register_setting ( self::enroller_enrolment_events_settings_key, 'ax_enrol_event_action' );
		
		add_settings_field ( 'ax_enrol_event_action', __ ( 'Enrolment Event:', 'axip' ), array (
				&$this,
				'field_enroller_event_action'
		), self::enroller_enrolment_events_settings_key, 'section_enroller_events' );
		
		register_setting ( self::enroller_enrolment_events_settings_key, 'ax_enrol_event_redirect_url' );
		add_settings_field ( 'ax_enrol_event_redirect_url', __ ( 'Default Enrolment Redirect Page:', 'axip' ), array (
				&$this,
				'field_enrol_event_redirect_url'
		), self::enroller_enrolment_events_settings_key, 'section_enroller_events');

		register_setting ( self::enroller_enrolment_events_settings_key, 'ax_enquiry_event_redirect_url' );
		add_settings_field ( 'ax_enquiry_event_redirect_url', __ ( 'Default Enquiry Redirect Page:', 'axip' ), array (
				&$this,
				'field_enquiry_event_redirect_url'
		), self::enroller_enrolment_events_settings_key, 'section_enroller_events');
	
		register_setting ( self::enroller_enrolment_events_settings_key, 'ax_config_comp_mapping_settings' );
		add_settings_field ( 'ax_config_comp_mapping_settings', __ ( 'Config Completion Mapping:', 'axip' ), array (
				&$this,
				'field_mapping_table'
		), self::enroller_enrolment_events_settings_key, 'section_enroller_events' );
		
		
		register_setting ( self::enroller_enrolment_events_settings_key, 'ax_enrol_event_success_content' );
		add_settings_field ( 'ax_enrol_event_success_content', __ ( 'Enrolment Success Content:', 'axip' ), array (
				&$this,
				'field_enroller_event_success_content'
		), self::enroller_enrolment_events_settings_key, 'section_enroller_events' );
		
		
		
		
	}
	
	function field_enroller_event_action() {
		$action = get_option ( 'ax_enrol_event_action' );
		if (empty ( $action )) {
			$action = 'no_action';
			update_option ( 'ax_enrol_event_action', $action );
		}
		$options = array (
				"no_action"=>"Take no action.",
				"redirect"=>"Redirect on enrolment completion",
				"hide_and_display" => "Hide widget and display success content",
		);
		echo '<select name="ax_enrol_event_action">';
		foreach ( $options as $key => $value ) {
			if ($key == $action) {
				echo '<option value="' . $key . '" selected="selected">' . $value . '</option>';
			} else {
				echo '<option value="' . $key . '">' . $value . '</option>';
			}
		}
		echo '</select>';
	}
	function field_enrol_event_redirect_url($args) {
		$selected = 0;
		$page = get_option('ax_enrol_event_redirect_url');
		if(!empty($page)){
			$selected = $page;
		}
		
		$dropDownSettings = array (
				'depth' => 0,
				'child_of' => 0,
				'selected' => $selected,
				'echo' => 1,
				'name' => 'ax_enrol_event_redirect_url',
				'show_option_none' => __( '— Select —' ),
				'show_option_no_change' => null,
				'option_none_value' => null 
		);
		wp_dropdown_pages($dropDownSettings);
	}
	function field_enquiry_event_redirect_url($args) {
		$selected = 0;
		$page = get_option('ax_enquiry_event_redirect_url');
		if(!empty($page)){
			$selected = $page;
		}
		
		$dropDownSettings = array (
				'depth' => 0,
				'child_of' => 0,
				'selected' => $selected,
				'echo' => 1,
				'name' => 'ax_enquiry_event_redirect_url',
				'show_option_none' => __( '— Select —' ),
				'show_option_no_change' => null,
				'option_none_value' => null 
		);
		wp_dropdown_pages($dropDownSettings);
	}
	function field_enroller_event_success_content() {
		echo '<p><em>Define the format of the success message to be displayed upon successfully completing enrolment.</em></p>';
		echo '<p><em>Used with the "Hide and Show Message" Action Setting.</em></p>';
		$content = get_option ( 'ax_enrol_event_success_content' );
		
		if (empty ( $content )) {
				
				
			$template =
			'<div class="aligncenter enrolment-success"><h2>Thank you For Enrolling!</h2><h2>Confirmation details will be emailed through to you.</h2></div>';
		
			$content = $template;
			update_option ( 'ax_enrol_event_success_content', $content );
		}
		$editor_id = 'ax_enrol_event_success_content';
		wp_editor ( $content, $editor_id );
	}
	
	
	function section_enroller_events_desc() {
		echo 'This section allows for the setting of actions that will be triggered on the successful completion of an enrolment.';
	}
	
	
	function field_mapping_table() {
		

		echo '<p><em>Map specific Enrolment Widget Configurations to Pages.</em></p>';
		$VERSION = constant('AXIP_PLUGIN_VERSION');
		if($VERSION === null){
			$VERSION = time();
		}
		$Settings_Plugin = new Settings_API_Tabs_AXIP_Plugin ();
		$Settings_Plugin->ax_deregister_load_general_scripts();
		
		$Settings_Plugin->ax_load_settings_helper();
	
		$mapping_settings = get_option ( 'ax_config_comp_mapping_settings' );
		/* Build a Post Array and a Course Array for passing to the Mapping Widget */
		
		/*get Config list*/
		$enrollerWidgetSettings = get_option ( 'ax_enroller_widget_settings' );
		$data = json_decode($enrollerWidgetSettings, true, 10);
	
		$mapArray1 = array ();

		foreach ( $data as $key=> $value) {
			$tempArray = array (
					'ID' => $key,
					'MAP_KEY' => $key
			);
			if(!empty($value['config_name'])){
				$tempArray['NAME'] = $value['config_name'];
			}
			else{
				$tempArray['NAME'] = "Config_ID: ". $key;
			}
			array_push ( $mapArray1, $tempArray );
	
	
		}

		$postsArray = get_posts ( array (
				'post_type' => 'any',
				'numberposts' => - 1
		) );
		$mapArray2 = array ();
		foreach ( $postsArray as $row ) {
			$tempArray = array (
					'ID' => $row->ID,
					'MAP_KEY' => $row->ID,
					'TITLE' => $row->post_title,
					'URL' => parse_url ( get_permalink ( $row->ID ), PHP_URL_PATH )
			);
			array_push ( $mapArray2, $tempArray );
		}
	
		/* Load Scripts */
		wp_register_script ( 'config-mapping', plugins_url ( '/enrollerWidget/config-comp-mapping.js', AXIP_PLUGIN_NAME ), array (), $VERSION );
		wp_enqueue_script ( 'config-mapping' );
		wp_localize_script ( 'config-mapping', 'config_comp_vars', array (
				'mapping_settings' => $mapping_settings,
				'mapping_list_1' => $mapArray1,
				'mapping_list_2' => $mapArray2
		) );
	
		wp_register_style ( 'course_mapping', plugins_url ( '/enrollerWidget/mapping-widget.css', AXIP_PLUGIN_NAME ), array (), $VERSION );
		wp_enqueue_style ( 'course_mapping' );
	
		?>
				<div id="course_mapping_holder">
					<div id="ax_mapping_widget_holder"></div>
					<input type="hidden" id="ax_config_comp_mapping_settings" name="ax_config_comp_mapping_settings" value="<?php echo htmlspecialchars($mapping_settings) ?>" />
				</div>
				<?php
			}
}
