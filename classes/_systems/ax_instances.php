<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */
class AX_Instances {
	public function __construct() {
		
	}
	public static function registerEventHooks(){
		
	}
	public static function setupTasks(){
		
		
	}
	public static function clearTasks(){
	
	
	
	}
	
	/*
	 * Get all Enrolments currently in the DB, with name and value
	 * */
	public static function getInstancesToCreate(){
		global $wpdb;
		/* in performance mode limit to the most recent 100 enrolments*/
		$sql = "SELECT `option_name` AS `name`, `option_value` AS `value`
		FROM  $wpdb->options
		WHERE `option_name` LIKE '%transient_ax_instance_%'
		ORDER BY `option_id` DESC
		LIMIT 100";
		
		$results = $wpdb->get_results( $sql );
		return $results;
	}
	public static function getCleanedInstances(){
		$instances = self::getInstancesToCreate();
		if($instances){
		
			foreach ($instances as $instance){
				$instanceData = unserialize($instance->value);
				$instance->value = $instanceData;
			}
		}
		return $instances;
	}
	

	/**
	 * 
	 * @param string $instance_key
	 * @param array $instance_data
	 */
	public static function storeInstance($instance_key = '', $instance_data = array()){
		
	}
	/**
	 * Delete transient record for the instance.
	 * @param string $instance_key
	 */
	public static function clearInstance($instance_key = ''){
		if(!empty($instance_key)){
			delete_transient($instance_key);
		}
	}
	
}