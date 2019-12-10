<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */
class AX_Settings_Tab_Post_Enrolment {
	private $post_enrolment_settings_key = 'axip_post_enrolment_settings';
	const post_enrolment_settings_key = 'axip_post_enrolment_settings';
	function __construct() {
	}
	function register_settings() {
		add_settings_section ( 'section_post_enrolment', __ ( 'Post Enrolment', 'axip' ), array (
				&$this,
				'section_post_enrolment_desc'
		), self::post_enrolment_settings_key );
		
		
		/*
		 * Enrolment Notifications
		 */
		register_setting ( self::post_enrolment_settings_key, 'ax_post_enrolment_active' );
		add_settings_field ( 'ax_post_enrolment_active', __ ( 'Post Enrolment Enabled:', 'axip' ), array (
				&$this,
				'field_enrol_notifications_active'
		), self::post_enrolment_settings_key, 'section_post_enrolment' );


		register_setting ( self::post_enrolment_settings_key, 'ax_post_enrol_status_field' );
		
		add_settings_field ( 'ax_post_enrol_status_field', __ ( 'Status Field:', 'axip' ), array (
				&$this,
				'field_post_enrol_status_field'
		), self::post_enrolment_settings_key, 'section_post_enrolment' );
		
		
		register_setting ( self::post_enrolment_settings_key, 'ax_post_enrol_url_field' );
		
		add_settings_field ( 'ax_post_enrol_url_field', __ ( 'URL Field:', 'axip' ), array (
				&$this,
				'field_post_enrol_url_field'
		), self::post_enrolment_settings_key, 'section_post_enrolment' );
		register_setting ( self::post_enrolment_settings_key, 'ax_post_enrol_debug_mode' );
		
		add_settings_field ( 'ax_post_enrol_debug_mode', __ ( 'Debug Mode:', 'axip' ), array (
				&$this,
				'debug_mode_display' 
		), self::post_enrolment_settings_key, 'section_post_enrolment' );
		
		register_setting ( self::post_enrolment_settings_key, 'ax_post_enrol_always_clear' );
		
		add_settings_field ( 'ax_post_enrol_always_clear', __ ( 'Always Clear:', 'axip' ), array (
				&$this,'field_always_clear'
			), self::post_enrolment_settings_key, 'section_post_enrolment' );
		
			
			
		

		
		
	}
	
	function setupPostEnrolmentSchedule($active = false){
		
		if($active){
			AX_Post_Enrolments::setupReminderTasks();
			echo '<div class="notice notice-success is-dismissible"><h4>Post Enrolment Updates Scheduled Every 2 hours, starting in 2 minutes.</h4></div>';
		}
		else{
			AX_Post_Enrolments::clearReminderTasks();
			echo '<div class="notice is-dismissible notice-info"><h4>Post Enrolment Schedule Cleared.</h4></div>';
		}
	}
	function field_enrol_notifications_active(){
		$optVal = get_option ( 'ax_post_enrolment_active' );
		$optActive = !empty($optVal);
		self::setupPostEnrolmentSchedule($optActive);
		
		if (! $optActive) {
			$optVal = 0;
			update_option ( 'ax_post_enrolment_active', $optVal );
		}
		$options = array (
				0 => "Not Enabled",
				1 => "Enabled"
		);
		echo '<select name="ax_post_enrolment_active">';
		foreach ( $options as $key => $value ) {
			if ($key == $optVal) {
				echo '<option value="' . $key . '" selected="selected">' . $value . '</option>';
			} else {
				echo '<option value="' . $key . '">' . $value . '</option>';
			}
		}
		echo '</select>';
		
	}
	
	function field_always_clear(){
		$optVal = get_option ( 'ax_post_enrol_always_clear' );
		$optActive = !empty($optVal);
	
		if (! $optActive) {
			$optVal = 0;
			update_option ( 'ax_post_enrol_always_clear', $optVal );
		}
		$options = array (
				0 => "Not Enabled",
				1 => "Enabled"
		);
		echo '<select name="ax_post_enrol_always_clear">';
		foreach ( $options as $key => $value ) {
			if ($key == $optVal) {
				echo '<option value="' . $key . '" selected="selected">' . $value . '</option>';
			} else {
				echo '<option value="' . $key . '">' . $value . '</option>';
			}
		}
		echo '</select>';
		echo '<p><em>Only ever check a contact once per update. Incomplete and Complete statuses will both trigger removal of the record from the WP database.</em></p>';
	
	}
	
	function debug_mode_display(){
		$debugVal = get_option ( 'ax_post_enrol_debug_mode' );
		$debugActive = !empty($debugVal);
		if (! $debugActive) {
			$debugVal = 0;
			update_option ( 'ax_post_enrol_debug_mode', $debugVal );
		}
		else{
			AX_Post_Enrolments::processPostEnrolments();
		}
		$options = array (
				0 => "Not Enabled",
				1 => "Enabled"
		);
		echo '<select name="ax_post_enrol_debug_mode">';
		foreach ( $options as $key => $value ) {
			if ($key == $debugVal) {
				echo '<option value="' . $key . '" selected="selected">' . $value . '</option>';
			} else {
				echo '<option value="' . $key . '">' . $value . '</option>';
			}
		}
		echo '</select>';
		echo '<p><em>Run the post enrolment check when this page is refreshed and display the contacts updated.</em></p>';
	}
	
	function sanitize_parse_number($option){
		//sanitize
		$option = intval(sanitize_text_field($option), 10);
	
		return $option;
	}

	function field_post_enrol_status_field() {
		
		$axcelerateAPI = new AxcelerateAPI();
		
		$customFields = $axcelerateAPI->callResource(array(
				"linkTo"=>'contact'
		), '/customFields', 'GET');

		$opt = get_option ( 'ax_post_enrol_status_field' );
		if($customFields){
			echo '<select name="ax_post_enrol_status_field" >';
			foreach ($customFields as $field){
				$optionValue = 'CUSTOMFIELD_'. strtoupper($field->VARIABLENAME);
				if($optionValue == $opt){
					echo '<option value="'.$optionValue.'" selected="selected">'. $field->LABEL .'</option>';
				}
				else{
					echo '<option value="'.$optionValue.'">'. $field->LABEL .'</option>';
				}
				
			}
			echo '</select>';
		}
		
		echo '<p><em>Contact Custom Field that will store the status. Needs to accept "incomplete" and "complete" values.</em></p>';
			}
	function field_post_enrol_url_field() {
		$opt = get_option ( 'ax_post_enrol_url_field' );
		$axcelerateAPI = new AxcelerateAPI();
		
		$customFields = $axcelerateAPI->callResource(array(
				"linkTo"=>'contact'
		), '/customFields', 'GET');


		if($customFields){
			echo '<select name="ax_post_enrol_url_field" >';
			foreach ($customFields as $field){
				$optionValue = 'CUSTOMFIELD_'. strtoupper($field->VARIABLENAME);
				if($optionValue == $opt){
					echo '<option value="'.$optionValue.'" selected="selected">'. $field->LABEL .'</option>';
				}
				else{
					echo '<option value="'.$optionValue.'">'. $field->LABEL .'</option>';
				}
				
			}
			echo '</select>';
		}
		echo '<p><em>Contact Custom Field that will store the return URL.</em></p>';
	
	}
	
	function section_post_enrolment_desc() {
		echo '<p>Update Status field in axcelerate when updating contacts through a "post enrolment" Enroller Widget.</p>';
		echo '<p>Post Enrolment Widgets are Enroller Widgets that are loaded after full completion of enrolment to allow the capture of additional data. The Post Enrolment Settings allow specific fields to be updated in aXcelerate in order for automated workflow triggers to be run based on the status.</p>';

	}

}
