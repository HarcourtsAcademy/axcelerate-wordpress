<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */
class AX_Settings_Tab_Enrolment_Resumption {
	private $enroller_enrolment_resumption_settings_key = 'axip_enroller_resumption_settings';
	const enroller_enrolment_resumption_settings_key = 'axip_enroller_resumption_settings';
	function __construct() {
	}
	function register_settings() {
		add_settings_section ( 'section_enroller_resumption', __ ( 'Enrolment Resumption', 'axip' ), array (
				&$this,
				'section_enroller_resumption_desc'
		), self::enroller_enrolment_resumption_settings_key );
		
		
		/*
		 * Enrolment Notifications
		 */
		register_setting ( self::enroller_enrolment_resumption_settings_key, 'ax_enrol_notifications_active' );
		add_settings_field ( 'ax_enrol_notifications_active', __ ( 'Resumption Enabled:', 'axip' ), array (
				&$this,
				'field_enrol_notifications_active'
		), self::enroller_enrolment_resumption_settings_key, 'section_enroller_resumption' );
		
		
		
		/*
		 * Templates
		 */
		register_setting ( self::enroller_enrolment_resumption_settings_key, 'ax_enrol_resumption_template_id', array (
				&$this,
				'sanitize_parse_number'
		) );
		
		add_settings_field ( 'ax_enrol_resumption_template_id', __ ( 'Template ID:', 'axip' ), array (
				&$this,
				'field_enrol_resumption_template_id'
		), self::enroller_enrolment_resumption_settings_key, 'section_enroller_resumption' );
		
		
		register_setting ( self::enroller_enrolment_resumption_settings_key, 'ax_enrol_resumption_debug_mode' );
			
			add_settings_field ( 'ax_enrol_resumption_debug_mode', __ ( 'Debug Mode:', 'axip' ), array (
					&$this,
					'debug_mode_display'
			), self::enroller_enrolment_resumption_settings_key, 'section_enroller_resumption' );
		
		
		
		
			
		

		
		
	}
	
	function setupNotificationSchedule($notifications_active = false){
		
		if($notifications_active){
			AX_Enrolments::setupReminderTasks();
			echo '<div class="notice notice-success is-dismissible"><h4>Enrolment Notifications Scheduled Every 2 hours, starting in 2 minutes.</h4></div>';
		}
		else{
			AX_Enrolments::clearReminderTasks();
			echo '<div class="notice is-dismissible notice-info"><h4>Notifications Schedule Cleared.</h4></div>';
		}
	}
	function field_enrol_notifications_active(){
		$optVal = get_option ( 'ax_enrol_notifications_active' );
		$optActive = !empty($optVal);
		
		self::setupNotificationSchedule($optActive);
		
		if (! $optActive) {
			$optVal = 0;
			update_option ( 'ax_enrol_notifications_active', $optVal );
		}
		$options = array (
				0 => "Not Enabled",
				1 => "Enabled"
		);
		echo '<select name="ax_enrol_notifications_active">';
		foreach ( $options as $key => $value ) {
			if ($key == $optVal) {
				echo '<option value="' . $key . '" selected="selected">' . $value . '</option>';
			} else {
				echo '<option value="' . $key . '">' . $value . '</option>';
			}
		}
		echo '</select>';
		
	}
	

	
	function debug_mode_display(){
		$debugVal = get_option ( 'ax_enrol_resumption_debug_mode' );
		$debugActive = !empty($debugVal);
		if (! $debugActive) {
			$debugVal = 0;
			update_option ( 'ax_enrol_resumption_debug_mode', $debugVal );
		}
		else{
			AX_Enrolments::sendReminders();
		}
		$options = array (
				0 => "Not Enabled",
				1 => "Enabled"
		);
		echo '<select name="ax_enrol_resumption_debug_mode">';
		foreach ( $options as $key => $value ) {
			if ($key == $debugVal) {
				echo '<option value="' . $key . '" selected="selected">' . $value . '</option>';
			} else {
				echo '<option value="' . $key . '">' . $value . '</option>';
			}
		}
		echo '</select>';
		echo '<p><em>Bypass the last hour check - allowing notifications to be sent immediately. Notifications will run when this page is refreshed.</em></p>';
	}
	
	function sanitize_parse_number($option){
		//sanitize
		$option = intval(sanitize_text_field($option), 10);
	
		return $option;
	}

	function field_enrol_resumption_template_id() {
		$opt = get_option ( 'ax_enrol_resumption_template_id' );
		echo '<input type="number" name="ax_enrol_resumption_template_id" value="'.$opt.'" />';
		echo '<p><em>Template ID of the template (within aXcelerate) that you wish to use for notifications to students on abandoned/incomplete enrolments.</em></p>';
		echo '<p><em>The string [Online Enrolment Link] within the template will be replaced by a URL to continue with the Enrolment.</em></p>';
		
	}
	
	function section_enroller_resumption_desc() {
		echo '<p>Resumption of Enrolment - Enable Notifications to students who have started, but not completed online enrolment. Notifications will be checked/sent every 2 hours.</p>';
		echo '<p>If the enrolment has been updated within the last hour the notification will not be sent, to prevent spam. Only one notification per enrolment will be generated.</p>';
	}

}
