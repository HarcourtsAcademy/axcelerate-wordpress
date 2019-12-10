<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */
class AX_Settings_Tab_Performance {
	private $axip_performance_settings = 'axip_performance_settings';
	const axip_performance_settings_key = 'axip_performance_settings';
	function __construct() {
	}
	function register_settings() {
		add_settings_section ( 'section_performance', __ ( 'Performance Settings', 'axip' ), array (
				&$this,
				'section_performance_desc'
		), self::axip_performance_settings_key );
		
		
		register_setting ( self::axip_performance_settings_key, 'ax_caching_enabled' );
		add_settings_field ( 'ax_caching_enabled', __ ( 'API Call Caching:', 'axip' ), array (
				&$this,
				'field_caching_enabled'
		), self::axip_performance_settings_key, 'section_performance' );
		
		
		register_setting ( self::axip_performance_settings_key, 'ax_resumption_performance' );
		add_settings_field ( 'ax_resumption_performance', __ ( 'Query Restriction:', 'axip' ), array (
				&$this,
				'field_resumption_performance'
		), self::axip_performance_settings_key, 'section_performance' );
		
		
		
		if(class_exists ( 'Tribe__Events__API' )){

			register_setting ( self::axip_performance_settings_key, 'ax_event_cal_delayed_creation' );
			add_settings_field ( 'ax_event_cal_delayed_creation', __ ( 'Events Calendar - Split API Calls and Event Creation:', 'axip' ), array (
					&$this,
					'field_event_cal_delayed_creation'
			), self::axip_performance_settings_key, 'section_performance' );
		}
	}
	
	function field_resumption_performance(){
		$optVal = get_option ( 'ax_resumption_performance' );
		$optActive = !empty($optVal);
	
	
		if (! $optActive) {
			$optVal = "performance_enabled";
			update_option ( 'ax_resumption_performance',$optVal );
		}
		$options = array (
				"performance_enabled" => "Performance Mode enabled",
				"no_limit" => "Unlimited Enrolments"
		);
		echo '<select name="ax_resumption_performance">';
		foreach ( $options as $key => $value ) {
			if ($key == $optVal) {
				echo '<option value="' . $key . '" selected="selected">' . $value . '</option>';
			} else {
				echo '<option value="' . $key . '">' . $value . '</option>';
			}
		}
		echo '</select>';
		echo '<p><em>Limits the maximum number of enrolments checked (Enrolment Resumption and Post Enrolment) each cycle to the last 100 entered.</em></p>';
		echo '<p><em>Recommended if using shared hardware, or if 48 hr enrolment volume exceeds 100.</em></p>';
	
	
	}
	
	function field_caching_enabled(){
		$optVal = get_option ( 'ax_caching_enabled' );
		$optActive = !empty($optVal);
	
	
		if (! $optActive) {
			$optVal = "caching_enabled";
			update_option ( 'ax_caching_enabled',$optVal );
		}
		$options = array (
				"caching_enabled" => "Caching enabled",
				"no_limit" => "No Caching"
		);
		echo '<select name="ax_caching_enabled">';
		foreach ( $options as $key => $value ) {
			if ($key == $optVal) {
				echo '<option value="' . $key . '" selected="selected">' . $value . '</option>';
			} else {
				echo '<option value="' . $key . '">' . $value . '</option>';
			}
		}
		echo '</select>';
		echo '<p><em>Caches regularly used - but not regularly updated data for 10min.</em></p>';
		echo '<p><em>Data includes Course Lists, contact sources, venues, locations and similar data.</em></p>';

	
	
	}
	
	function field_event_cal_delayed_creation(){
		
		$optVal = get_option ( 'ax_event_cal_delayed_creation' );
		$optActive = !empty($optVal);
	
	
		if (! $optActive) {
			$optVal = "enabled";
			update_option ( 'ax_event_cal_delayed_creation',$optVal );
		}
		$options = array (
				"enabled" => "Delay Creation",
				"disabled" => "Create With API Call"
		);
		echo '<select name="ax_event_cal_delayed_creation">';
		foreach ( $options as $key => $value ) {
			if ($key == $optVal) {
				echo '<option value="' . $key . '" selected="selected">' . $value . '</option>';
			} else {
				echo '<option value="' . $key . '">' . $value . '</option>';
			}
		}
		echo '</select>';
		echo '<p><em>Separates the event creation from API calls to smooth out the performance impact of Events Calendar updates and also breaks up event creation into blocks of 20 instances.</em></p>';
		echo '<p><em>Will reduce the liklihood of hitting "Entry Processes" caps on shared hosting or slowdown from bulk event creation.</em></p>';

	
	
	
	}
	
	
	function section_performance_desc() {
		echo '<p>Settings to assist with performance and reducing API requests.</p>';
	}


}
