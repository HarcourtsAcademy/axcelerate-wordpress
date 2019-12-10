<?php
/**
 * Validate File
 */
defined('ABSPATH') or die('No script kiddies please!');

/**
 *
 */
class AX_Validate
{
    public function __construct()
    {
    }

    public static function checkAccess()
    {
        $temporaryAccess = get_transient('ax_wp_temp_access');
        $disableAccess = get_option('ax_wp_disable');

        if (!empty($disableAccess)) {
            self::disableAccess();
        }

        /*if temp access has not been set at all*/
        if ($temporaryAccess === false) {
            self::validateAccess();
        }
    }
    public static function validateAccess()
    {
        $flags = self::retrieveFlags();
        $wordpress = false;

        if ($flags) {
            foreach ($flags as $flag) {
                if ($flag['REFERENCENAME'] == "wordpress_plugin") {
                    $wordpress = true;
                    if ($flag['OPTIONVALUE']) {
                        self::grantTemporaryAccess();
                    } else {
                        self::disableAccess();
                    }
                }
            }
        } else {
            /*either no flags were found, or there was an error*/
            self::grantRestrictedAccess();
        }
        /*Double check to determine if the WP flag was found*/
        if (!$wordpress) {
            self::grantRestrictedAccess();
        }
    }
    private static function grantTemporaryAccess()
    {
        /*check flags every 7 days*/
        set_transient('ax_wp_temp_access', true, 7 * DAY_IN_SECONDS);
    }

    private static function grantRestrictedAccess()
    {
        /*allow access for 1 day, to set tokens*/
        set_transient('ax_wp_temp_access', true, 1 * DAY_IN_SECONDS);
    }
    private static function disableAccess()
    {
        if (is_admin()) {
            add_action('admin_notices', array('AX_Validate', 'notify'));
        }
        /*send notification to Administrator*/
        $users = get_users('role=Administrator');

        try {
            wp_mail($users[0]->user_email, 'aXcelerate Integration Plugin', "The aXcelerate integration plugin has been disabled due to trial expiry. Contact aXcelerate to set up a new trial or get full access.");
        } catch (\Throwable $th) {
            //throw $th;
        }

        /*Deactivate Plugin*/
        $plugin = AXIP_PLUGIN_NAME;
        deactivate_plugins($plugin);
    }
    public static function notify()
    {
        echo '<div class="notice notice-error is-dismissible"><h4>aXcelerate Plugin has been disabled - Contact aXcelerate to set up a new trial or get full access.</h4></div>';
    }

    public static function retrieveFlags()
    {
        $settings = (array) get_option('axip_general_settings');
        /*confirm tokens exist*/
        if (!empty($settings['api_token']) && !empty($settings['webservice_token'])) {
            $AxApi = new AxcelerateAPI();
            $narrowedFlags = array();
            $flags = $AxApi->callResource(array('use_prod' => true), 'flags', 'GET');

            if ($flags) {
                foreach ($flags as $flagrow) {
                    if (self::checkFlag($flagrow)) {
                        $narrowedFlags[] = (array) $flagrow;
                    }
                }

                return $narrowedFlags;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    private static function checkFlag($flag)
    {
        $flagsToCheckFor = array('wordpress_plugin');
        $flag = (array) $flag;
        if ($flag) {
            if (!empty($flag["REFERENCENAME"])) {
                return in_array($flag['REFERENCENAME'], $flagsToCheckFor);
            }
            return false;
        } else {
            return false;
        }
    }
}
