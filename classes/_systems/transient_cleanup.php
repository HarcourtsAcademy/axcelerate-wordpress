<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */
class AX_Transient_Cleanup {
	public function __construct() {
	}
	/**
	 * Gets all transients older than the specified time string and removes them from the DB.
	 * Safemode uses the get_transient WP function
	 * Non-safe uses DB query.
	 * 
	 * @param string $older_than
	 * @param string $safemode
	 * @return boolean|array
	 */
	
	public static function registerEventHooks(){
		add_action('ax_transient_cleanup', array('AX_Transient_Cleanup', 'purge_transients'));
	}
	public static function setupReminderTasks(){
		if (! wp_next_scheduled ( 'ax_transient_cleanup' )) {
			wp_schedule_event(time()+(10), 'ax_weekly', 'ax_transient_cleanup');
		}
	
	}
	public static function purge_transients($older_than = '3 days', $safemode = true) {
			global $wpdb;
			$older_than_time = strtotime('-' . $older_than);
			if ($older_than_time > time() || $older_than_time < 1) {
				return false;
			}
			$transients = $wpdb->get_col(
					$wpdb->prepare( "
							SELECT REPLACE(option_name, '_transient_timeout_', '') AS transient_name
							FROM {$wpdb->options}
							WHERE option_name LIKE '\_transient\_timeout\__%%'
							AND option_value < %s
							", $older_than_time)
					);
			if ($safemode) {
				foreach($transients as $transient) {
					get_transient($transient);
				}
			} else {
				$options_names = array();
				foreach($transients as $transient) {
					$options_names[] = '_transient_' . $transient;
					$options_names[] = '_transient_timeout_' . $transient;
				}
				if ($options_names) {
					$options_names = array_map(array($wpdb, 'escape'), $options_names);
					$options_names = "'". implode("','", $options_names) ."'";
	
					$result = $wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name IN ({$options_names})" );
					if (!$result) {
						return false;
					}
				}
			}
			return $transients;
		}
		
}