<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */
class AX_Settings_Tab_Events_Calendar
{
    private $event_calendar_setting_key = 'axip_event_calendar_settings';
    
    /*Defaults */
	const ec_venue_offset = 180;
	const ec_location_offset = 60;
	const ec_update_w_offset = 600;
	const ec_update_p_offset = 1200;
	const ec_delivery_location_offset = 300;
	
    /*     End Defaults 
    const ec_venue_offset = 1;
    const ec_location_offset = 1;
    const ec_update_w_offset = 40;
    const ec_update_p_offset = 40;
    const ec_delivery_location_offset = 1;
	*/
    function __construct()
    {
    }
    function register_settings()
    {
        add_settings_section ( 'section_event_cal', __ ( 'The Events Calendar Integration Settings', 'axip' ), array (
                &$this,
                'section_event_cal_desc'
        ), $this->event_calendar_setting_key );
        
        
        
        register_setting ( $this->event_calendar_setting_key, 'ax_event_calendar_setting_w' );
        add_settings_field ( 'ax_event_calendar_setting_w', __ ( 'Events Calendar Workshops:', 'axip' ), array (
                &$this,
                'field_event_calendar_w'
        ), $this->event_calendar_setting_key, 'section_event_cal' );
        
        register_setting ( $this->event_calendar_setting_key, 'ax_event_calendar_w_venues' );
        add_settings_field ( 'ax_event_calendar_w_venues', __ ( 'Use Workshop Venues:', 'axip' ), array (
                &$this,
                'field_event_calendar_w_venues'
        ), $this->event_calendar_setting_key, 'section_event_cal' );
        
        register_setting ( $this->event_calendar_setting_key, 'ax_event_calendar_w_filter' );
        add_settings_field ( 'ax_event_calendar_w_filter', __ ( 'Workshop Training Category Filter :', 'axip' ), array (
                &$this,
                'field_event_calendar_w_filter'
        ), $this->event_calendar_setting_key, 'section_event_cal' );
        
        register_setting ( $this->event_calendar_setting_key, 'ax_event_calendar_setting_p' );
        add_settings_field ( 'ax_event_calendar_setting_p', __ ( 'Events Calendar Programs:', 'axip' ), array (
                &$this,
                'field_event_calendar_p'
        ), $this->event_calendar_setting_key, 'section_event_cal' );
        
        register_setting ( $this->event_calendar_setting_key, 'ax_event_calendar_p_filter' );
        add_settings_field ( 'ax_event_calendar_p_filter', __ ( 'Qualification Training Category Filter', 'axip' ), array (
                &$this,
                'field_event_calendar_p_filter'
        ), $this->event_calendar_setting_key, 'section_event_cal' );

        register_setting ( $this->event_calendar_setting_key, 'ax_event_calendar_update_events' );
        add_settings_field ( 'ax_event_calendar_update_events', __ ( 'Update Existing Events', 'axip' ), array (
                &$this,
                'field_update_events'
        ), $this->event_calendar_setting_key, 'section_event_cal' );

        register_setting ( $this->event_calendar_setting_key, 'ax_event_calendar_complex_dates' );
        add_settings_field ( 'ax_event_calendar_complex_dates', __ ( 'Use Complex Dates', 'axip' ), array (
                &$this,
                'field_complex_dates'
        ), $this->event_calendar_setting_key, 'section_event_cal' );

    }

    function section_event_cal_desc()
    {
        echo __ ( 'Integrates with the Event Calendar plugin. This will add course Instances as Events that will appear in the event calendar.');
        echo __ ( '<p>Qualifications are treated as full day events. Setting the status to disabled will turn off the scheduled update function, and additionally clear any existing courses.</p>');
        echo __ ( '<p>By default the calendar update function will run once an hour, checking for any new courses and adding them. This can be adjusted through the use of plugins such as WP Crontrol</p>');
    
        echo __ ( '<p>If Course Mapping settings have been defined, the Events created will clone both post-content and post-meta-data from the mapped Post/Page.</p>');
    }
    function eventCalendarActivation($courseType = 'all')
    {
    
        /*Add a 30second (min) delayed call to retrieve the courses to ensure venues are setup*/
        if ($courseType =='all') {
            if (! wp_next_scheduled ( 'event_cal_update' )) {
                wp_schedule_event(time()+(10), 'hourly', 'event_cal_update');
                echo '<div class="notice notice-success is-dismissible">Events Calendar: Fetch Instance Task Created, Instances will be retrieved in 10 seconds, and every subsequent hour.</div>';
            }
        } elseif ($courseType == 'w') {
            if (! wp_next_scheduled ( 'event_cal_fetch_venues_l' )) {
                wp_schedule_event(time()+self::ec_location_offset, 'daily', 'event_cal_fetch_venues_l');
            }
            
            if (! wp_next_scheduled ( 'event_cal_fetch_venues_v' )) {
                wp_schedule_event(time()+self::ec_venue_offset, 'daily', 'event_cal_fetch_venues_v');
            }
            
            
            if (! wp_next_scheduled ( 'event_cal_update_w' )) {
                wp_schedule_event(time()+self::ec_update_w_offset, 'hourly', 'event_cal_update_w');
                echo '<div class="notice notice-success is-dismissible"><h3>Events Calendar: Fetch Workshop Task Created, Instances will be retrieved in 10 minutes, and every subsequent hour.</h3></div>';
            }
        } elseif ($courseType == 'p') {
            if (! wp_next_scheduled('event_cal_fetch_venues_dl')) {
                wp_schedule_event(time()+self::ec_delivery_location_offset, 'daily', 'event_cal_fetch_venues_dl');
            }
            
            if (! wp_next_scheduled ( 'event_cal_update_p' )) {
                wp_schedule_event(time()+self::ec_update_p_offset, 'hourly', 'event_cal_update_p');
                echo '<div class="notice notice-success is-dismissible"><h3>Events Calendar: Fetch Program Task Created, Instances will be retrieved in 20 minutes, and every subsequent hour.</h3></div>';
            }
        }
    }
    function eventCalendarDeactivation($courseType = 'all')
    {
        if ($courseType =='all') {
            wp_schedule_single_event(time(), 'event_cal_cleanup');
            echo '<div class="notice is-dismissible notice-info"><h4>Events Calendar: Cleanup Task Created, All Workshop/Program Events will be cleared.</h4></div>';
        } elseif ($courseType == 'w') {
            wp_schedule_single_event(time(), 'event_cal_cleanup_w');
            echo '<div class="notice is-dismissible notice-info"><h4>Events Calendar: Cleanup Task Created, Any Workshop Events will be cleared.</h4></div>';
        } elseif ($courseType == 'p') {
            wp_schedule_single_event(time(), 'event_cal_cleanup_p');
            echo '<div class="notice is-dismissible notice-info"><h4>Events Calendar: Cleanup Task Created, Any Program Events will be cleared.</h4></div>';
        }
    }
    function field_update_events()
    {
        echo '<select name="ax_event_calendar_update_events" style="width:20em">';
        $options = array (
            "disabled" => "Do Not Update Events",
            "enabled" => "Update Events",
        );
        $currentSetting = get_option('ax_event_calendar_update_events', 'disabled');
        foreach ($options as $key => $value) {
            if ($key == $currentSetting) {
                echo '<option value="' . $key . '" selected="selected">' . $value . '</option>';
            } else {
                echo '<option value="' . $key . '">' . $value . '</option>';
            }
        }
        echo '</select>';
        echo'<div style="display:block"><em>Note: Enabling this setting will update events if their location, cost or time changes. This will however require additional server processing. If these fields will rarely change, keep this setting disabled.</em></div>';
    }

    function field_complex_dates()
    {
        echo '<select name="ax_event_calendar_complex_dates" style="width:20em">';
        $options = array (
            "disabled" => "Do Not Use Complex Dates",
            "enabled" => "Use Complex Dates",
        );
        $currentSetting = get_option('ax_event_calendar_complex_dates', 'disabled');
        foreach ($options as $key => $value) {
            if ($key == $currentSetting) {
                echo '<option value="' . $key . '" selected="selected">' . $value . '</option>';
            } else {
                echo '<option value="' . $key . '">' . $value . '</option>';
            }
        }
        echo '</select>';
        echo'<div style="display:block"><em>Enables processing of complex dates on workshops, to create individual event listings for each complex date, rather than a single listing.</em></div>';
        
    }


    function field_event_calendar_w()
    {
        wp_clear_scheduled_hook('event_cal_update');
        wp_clear_scheduled_hook('event_cal_update_w');
        wp_clear_scheduled_hook('event_cal_fetch_venues_l');
        wp_clear_scheduled_hook('event_cal_fetch_venues_v');
        
        
        wp_clear_scheduled_hook('cleanup_invalid_events_w');
        wp_clear_scheduled_hook('event_cal_create_instances');
    
        echo '<div class="notice is-dismissible notice-info"><h4>Events Calendar: Any Previously Scheduled Fetch/Update Tasks have been cleared.</h4></div>';
        if (class_exists('Tribe__Events__API')) {
            $currentSetting = get_option('ax_event_calendar_setting_w');
            if ($currentSetting == 'enabled') {
                $this->eventCalendarActivation('w');
            } else {
                wp_clear_scheduled_hook('event_cal_update_w');
                $this->eventCalendarDeactivation('w');
                $currentSetting = 'disabled';
            }
                
            $options = array (
                    "enabled" => "Event Calendar Integration Enabled",
                    "disabled" => "Event Calendar Integration Disabled"
            );
            echo '<select name="ax_event_calendar_setting_w" style="width:20em">';
            foreach ($options as $key => $value) {
                if ($key == $currentSetting) {
                    echo '<option value="' . $key . '" selected="selected">' . $value . '</option>';
                } else {
                    echo '<option value="' . $key . '">' . $value . '</option>';
                }
            }
            echo '</select>';
        }
    }
    
    function field_event_calendar_w_venues()
    {
    
    
        
        if (class_exists('Tribe__Events__API')) {
            $optVal = get_option ( 'ax_event_calendar_w_venues' );
            $optActive = !empty($optVal);
        
            if (! $optActive) {
                $optVal = "disabled";
                update_option ( 'ax_event_calendar_w_venues', $optVal );
            }
            $options = array (
                    "enabled" => "Use Venue if Present",
                    "disabled" => "Always Use Location"
            );
            echo '<select name="ax_event_calendar_w_venues" style="width:20em">';
            foreach ($options as $key => $value) {
                if ($key == $optVal) {
                    echo '<option value="' . $key . '" selected="selected">' . $value . '</option>';
                } else {
                    echo '<option value="' . $key . '">' . $value . '</option>';
                }
            }
            echo '</select>';
        }
    }
    function field_event_calendar_p()
    {
        wp_clear_scheduled_hook('event_cal_update');
        wp_clear_scheduled_hook('event_cal_update_p');
        wp_clear_scheduled_hook('event_cal_fetch_venues_dl');

        wp_clear_scheduled_hook('cleanup_invalid_events_p');
        wp_clear_scheduled_hook('event_cal_create_instances');
       
        
        if (class_exists('Tribe__Events__API')) {
            $currentSetting = get_option('ax_event_calendar_setting_p');
            if ($currentSetting == 'enabled') {
                $this->eventCalendarActivation('p');
                //add_action('event_cal_update_p', array($this, 'event_calendar_update_p'));
            } else {
                wp_clear_scheduled_hook('event_cal_update_p');
                $this->eventCalendarDeactivation('p');
                $currentSetting = 'disabled';
            }
    
            $options = array (
                    "enabled" => "Event Calendar Integration Enabled",
                    "disabled" => "Event Calendar Integration Disabled"
            );
            echo '<select name="ax_event_calendar_setting_p" style="width:20em">';
            foreach ($options as $key => $value) {
                if ($key == $currentSetting) {
                    echo '<option value="' . $key . '" selected="selected">' . $value . '</option>';
                } else {
                    echo '<option value="' . $key . '">' . $value . '</option>';
                }
            }
            echo '</select>';
        }
    }
    
    function field_event_calendar_w_filter()
    {
        $optVal = get_option ( 'ax_event_calendar_w_filter' );
        ?>
                <input style="width:20em" type="text" name="ax_event_calendar_w_filter" value="<?php echo $optVal ?>" />
            <?php
            echo '<em>If specified, will filter courses down to specified Categories only. Use commas to specify multiple categories.</em>';
    }
    function field_event_calendar_p_filter()
    {
        $optVal = get_option ( 'ax_event_calendar_p_filter' );
        ?>
        <input style="width:20em" type="text" name="ax_event_calendar_p_filter" value="<?php echo $optVal ?>" />
        <?php
        echo '<em>If specified, will filter courses down to specified Categories only. Use commas to specify multiple categories.</em>';
    }
}
