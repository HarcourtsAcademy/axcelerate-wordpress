<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */
class AX_Post_Enrolments {
	public function __construct() {
		
	}
	public static function registerEventHooks(){
		add_action('ax_review_post_enrol_status', array('AX_Post_Enrolments', 'processPostEnrolments'));
	}
	public static function setupReminderTasks(){
		wp_clear_scheduled_hook('ax_review_post_enrol_status');
		
		if (! wp_next_scheduled ( 'ax_review_post_enrol_status' )) {
			wp_schedule_event(time()+(4), '2_hourly', 'ax_review_post_enrol_status');
		}
		
	}
	public static function clearReminderTasks(){
		wp_clear_scheduled_hook('ax_review_post_enrol_status');

	}
	
	/*
	 * Get all Enrolments currently in the DB, with name and value
	 * */
	public static function getPostEnrolments(){
		global $wpdb;
		/* in performance mode limit to the most recent 100 enrolments*/
		
		$ER_PERFORMANCE = constant('AXIP_ER_PERFORMANCE_ENABLED') === true;
		
		if($ER_PERFORMANCE){
			$sql = "SELECT `option_name` AS `name`, `option_value` AS `value`
			FROM  $wpdb->options
			WHERE `option_name` LIKE '%transient_ax_post_enrol_%'
			ORDER BY `option_id` DESC 
			LIMIT 100";
		}
		else{
			$sql = "SELECT `option_name` AS `name`, `option_value` AS `value`
			FROM  $wpdb->options
			WHERE `option_name` LIKE '%transient_ax_post_enrol_%'";
		}
		
		$results = $wpdb->get_results( $sql );
		return $results;
	}
	
	/**
	 * Get enrolment transient either by transient name, or full option string. 
	 * Returns Null if expired or not found.
	 * @param string $enrolmentID
	 */
	public static function getPostEnrolByID($enrolmentID = ''){
		if(!empty($enrolmentID)){
			/*clean any extra values to ensure that the ID is correct*/
			$enrolmentID = str_replace('_transient_', '', $enrolmentID);
			$enrolmentID = str_replace('ax_post_enrol_', '', $enrolmentID);
			
			$enrolment = get_transient('ax_post_enrol_' .$enrolmentID);
			if($enrolment){
				/*add enrolment hash in case it isn't present*/
				$enrolment['post_enrol_hash'] = $enrolmentID;
				return $enrolment;
			}
			else{
				return null;
			}
		}
		else{
			return null;
		}
	}
	

	public static function deletePostEnrolById($enrolmentID = ''){
		if(!empty($enrolmentID)){
			/*clean any extra values to ensure that the ID is correct*/
			$enrolmentID = str_replace('_transient_', '', $enrolmentID);
			$enrolmentID = str_replace('ax_post_enrol_', '', $enrolmentID);
				
			delete_transient('ax_post_enrol_' .$enrolmentID);
		}
	}

	/**
	 * This function will return still active (not timed out) Enrolments.
	 * It will also clear the DB of any inactive enrolments.
	 */
	public static function getActivePostEnrolments(){
		$enrolments = self::getPostEnrolments();
		$active = array();
		foreach ( $enrolments as $enrol ){
			$enrolment = self::getPostEnrolByID($enrol->name);
			if(!empty($enrolment)){
				array_push($active, $enrolment);
			}
		}
		return $active;
		
	}
	
	public static function getEnrolmentConfigurations(){
		$enrollerWidgetSettings = get_option ( 'ax_enroller_widget_settings' );
		$data = json_decode($enrollerWidgetSettings, true);
		return $data;
	}
	/**
	 * Returns an array of required fields, along with their field definitions.
	 * Removes any required fields that also have an option to be "not specified"
	 * @param array $enrolmentConfiguration
	 */
	public static function getConfigRequiredFields($enrolmentConfiguration = array()){
		$required_fields = array();
		if($enrolmentConfiguration){
			
			if(!empty($enrolmentConfiguration['enroller_steps'])){
				$enroller_steps = $enrolmentConfiguration['enroller_steps'];
				foreach ($enroller_steps as $step){
					if($step["TYPE"] == 'contact-update'){
						if($step['FIELDS']){
							foreach ($step['FIELDS'] as $key=>$value){

								if(key_exists('REQUIRED', $value)){
									if(!empty($value['REQUIRED'])){
										$hasNull = false;
										/*if the field has a "not specified" empty string value ignore it*/
										if(!empty($value['VALUES'])){
											foreach($value['VALUES'] as $valueItem){

												if($valueItem['VALUE'] == ""){
													$hasNull =true;
												}
											}
										}
										if(! $hasNull){
											$required_fields[$key] = $value;
										}
									}
									
								}
							}
						}

					}
				}
			}
			
			return $required_fields;
		}
		else{
			return false;
		}
	}
	
	/**
	 * Validate a contact record against a set of required fields.
	 * @param array $contactRecord
	 * @param array $required_fields
	 * @return boolean
	 */
	public static function contactRecordComplete($contactRecord=array(), $required_fields=array()){
		$complete = true;
		$fieldsNotSet = array();
		
		/*check for empty array*/
		if($required_fields){
			foreach ($required_fields as $key=>$field){
				if(property_exists($contactRecord,$key)){
					$value = $contactRecord->$key;
					
					if(! isset($value)){
						$complete = false;

						/*terminate the check, no need to continue*/
						break;
					}
				}
			}
		}
		
		return $complete;
	}
	public static function processPostEnrolments() {
		$enrolments = self::getActivePostEnrolments ();
		$configurations = self::getEnrolmentConfigurations();

		$AxcelerateAPI = new AxcelerateAPI ();
		$debugMode = get_option('ax_post_enrol_debug_mode');
		$completeField = get_option ( 'ax_post_enrol_status_field' );
		$returnURLField = get_option ( 'ax_post_enrol_url_field' );
		$clearAfterUpdate = get_option('ax_post_enrol_always_clear');
		
		if (! empty ( $completeField ) && ! empty ( $returnURLField )) {
			$requiredReference = array ();
			/* make sure the configs and enrolments aren't empty arrays */
			if ($configurations && $enrolments) {
				/* create a config required fields reference */
				foreach ( $configurations as $config_id => $config ) {
					$requiredReference [$config_id] = self::getConfigRequiredFields ( $config );
				}
				foreach ( $enrolments as $post_enrolment ) {
					$contactID = intval ( $post_enrolment ['user_contact_id'], 10 );
					$config_id = intval ( $post_enrolment ['config_id'], 10 );

					$contactData = $AxcelerateAPI->callResource ( array (
							'contactID' => $contactID 
					), '/contact/' . $contactID, 'GET' );
					$complete = self::contactRecordComplete ( $contactData, $requiredReference [$config_id] );
					
					if ($complete) {
						$status = "complete";
					} else {
						$status = "incomplete";
					}
					if(!empty($post_enrolment['return_url'])){
						$returnUrl = $post_enrolment['return_url'];
					}
					else{
						$returnUrl = $post_enrolment['url_without_string'];
					}
					$params = array (
							$returnURLField => $returnUrl,
							$completeField => $status
					);
					$Update = $AxcelerateAPI->callResource ( $params, '/contact/' . $contactID, 'PUT' );
					
					if ($Update) {
						if (! empty ( $Update->CONTACTID )) {
							if ($complete) {
								self::deletePostEnrolById($post_enrolment['post_enrol_hash']);
							}
							else if (!empty($clearAfterUpdate)){
								/*if this setting is enabled, always clear the update*/
								self::deletePostEnrolById($post_enrolment['post_enrol_hash']);
							}
							if(!empty($debugMode)){
								echo '<div class="notice notice-success is-dismissible"><h4>';
								echo($Update->CONTACTID . ' - '. 'Updated status: '. $status);
								echo '</h4></div>';
							}
						}

					}
				}
			}
		}
	}
	
}