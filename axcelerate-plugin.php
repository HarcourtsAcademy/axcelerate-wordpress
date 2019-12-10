<?php

/*
|--------------------------------------------------------------------------
| START Plugin Details
|--------------------------------------------------------------------------

Plugin Name: aXcelerate Integration Plugin
Plugin URI: http://www.axcelerate.com.au/
Description: aXcelerate Wordpress Integration Plugin
Version: 2.9.07.1
Author: aXcelerate
Website: http://www.axcelerate.com.au
License: Copyright aXcelerate 2019+.
Text Domain: axcelerate-integration-plugin

|--------------------------------------------------------------------------
| END Plugin Details
|--------------------------------------------------------------------------
 */

// error_reporting(0);

/*--------------------------------------------*
 * Securing the plugin
 *--------------------------------------------*/

defined('ABSPATH') or die('No script kiddies please!');

/*--------------------------------------------*
 * Other Requirements and Addons
 *--------------------------------------------*/

define('AXIP_PLUGIN_NAME', plugin_basename(__FILE__));
define('AXIP_PLUGIN_DIR', dirname(__FILE__) . DIRECTORY_SEPARATOR);
define('AXIP_PLUGIN_VERSION', '2.9.07.1');
define('AXIP_CAPTCHA_PATH', plugins_url('lib/really-simple-captcha/tmp/', __FILE__));

define('AXIP_NONCE_GENERATION', true);
define('AXIP_SESSION_GENERATION', true);

define('AXIP_PLUGIN_URL', plugins_url('', __FILE__));

/*--------------------------------------------*
 * Adding the API
 *--------------------------------------------*/
include_once 'classes/ax_api.php';

/**
 * Initializes the API Class
 */

$AxcelerateAPI = new AxcelerateAPI();

include_once 'classes/ax_ajax.php';
include_once 'classes/common.php';
include_once 'classes/AxcelerateForm.php';
include_once 'classes/axip_course_post_type.php';
include_once 'classes/settings.php';

include_once 'classes/_shortcodes/ax_shortcode_base.php';

include_once 'classes/_systems/ax_complex_course_search.php';
include_once 'classes/_systems/ax_course_instance_v2.php';
include_once 'classes/_systems/ax_enrolments.php';
include_once 'classes/_systems/ax_payment_flow.php';

include_once 'classes/_systems/ax_verify_usi.php';

include_once 'classes/_systems/ax_feature_test.php';

include_once 'classes/_systems/ax_cognito_auth.php';

include_once 'classes/_systems/validate.php';

if (!class_exists('Axcelerate_Integration_Plugin')) {

    class Axcelerate_Integration_Plugin
    {

        const DEBUGMODE = false;
        const DEBUGEMAIL = 'rob.bisson@axcelerate.com.au';
        const DBDATEFORMAT = 'Y-m-d';

        /**
         * @var Axcelerate_Integration_Plugin
         */

        private static $_instance = null;

        /**
         * Get Axcelerate_Integration_Plugin object
         *
         * @return Axcelerate_Integration_Plugin
         */

        public static function getInstance()
        {

            if (self::$_instance == null) {
                self::$_instance = new Axcelerate_Integration_Plugin();
            }

            return self::$_instance;
        }

        private function __construct()
        {

            /*Add error checking function to the shutdown call to run on php execution finish*/
            add_action('shutdown', array($this, 'log_shutdown_error'));

            register_activation_hook(AXIP_PLUGIN_NAME, array(&$this, 'pluginActivate'));
            register_deactivation_hook(AXIP_PLUGIN_NAME, array(&$this, 'pluginDeactivate'));
            register_uninstall_hook(AXIP_PLUGIN_NAME, array('axcelerate-integration-plugin', 'pluginUninstall'));

            ## Register plugin widgets
            add_action('init', array($this, 'load_axip_transl'));

            add_action('init', array($this, 'handle_cognito'));

            add_action('plugins_loaded', array(&$this, 'pluginLoad'));
            add_action('plugins_loaded', array(&$this, 'widgetsRegistration'));
            add_action('wp_loaded', array(&$this, 'wpLoaded'));

            if (is_admin()) {
                add_action('admin_enqueue_scripts', array(&$this, 'adminLoadScripts'));
                add_action('admin_enqueue_scripts', array(&$this, 'adminLoadStyles'));
                add_action('admin_enqueue_scripts', array(&$this, 'loadLegacyStyles'));
                add_action('admin_enqueue_scripts', array(&$this, 'loadLegacyScripts'));
            } else {
                add_action('wp_enqueue_scripts', array(&$this, 'siteLoadScripts'));
                add_action('wp_enqueue_scripts', array(&$this, 'siteLoadStyles'));
                add_action('wp_enqueue_scripts', array(&$this, 'loadLegacyStyles'));
                add_action('wp_enqueue_scripts', array(&$this, 'loadLegacyScripts'));
            }

            //Enables shortcode use in text widgets
            add_filter('widget_text', 'do_shortcode');

            include_once 'classes/_systems/ax_session_security.php';
            if (class_exists('AX_Session_Security')) {
                AX_Session_Security::setupPHPSession();
            }
            include 'plugin-update-checker/plugin-update-checker.php';
            $MyUpdateChecker = Puc_v4_Factory::buildUpdateChecker(
                'https://wp-update.axcelerate.com.au/wp-update-server/?action=get_metadata&slug=ax_plugin', //Metadata URL.
                __FILE__, //Full path to the main plugin file.
                'ax_plugin' //Plugin slug. Usually it's the same as the name of the directory.
            );
        }

        public function log_shutdown_error()
        {
            $error = error_get_last();
            if ($error) {
                /*Log and email on fatal errors - unless in debugmode in which case log all*/
                if ($error['type'] == E_ERROR || Axcelerate_Integration_Plugin::DEBUGMODE) {
                    error_log(print_r($error, true));
                    try {
                        wp_mail(Axcelerate_Integration_Plugin::DEBUGEMAIL, 'FATAL ERROR WP', print_r($error, true));
                    } catch (\Throwable $th) {
                        //throw $th;
                    }
                }
            }
        }

        public function load_axip_transl()
        {

            load_plugin_textdomain('axcelerate-integration-plugin', false, dirname(plugin_basename(__FILE__)) . '/languages/');
            if (class_exists('AX_Enrolments')) {
                AX_Enrolments::register_ajax_actions();
            }

            if (class_exists('AX_Payment_Flow')) {
                $AX_Payment_Flow = new AX_Payment_Flow();
            }
            if (class_exists('AX_Cognito_Auth')) {
                $AX_Cognito_Auth = new AX_Cognito_Auth();

            }

        }

        public function handle_cognito()
        {

            $url_path = trim(parse_url(add_query_arg(array()), PHP_URL_PATH), '/');

            /*Handle loading cognito redirect page */
            if (strpos($url_path, 'cognito_redirect') > 0) {
                // load the file if exists
                include_once "template/cognito_redirect.php";
                exit();

            }
        }

        ##
        ## Loading Scripts and Styles
        ##

        public function loadLegacyStyles()
        {
            $loadLegacy = get_option('axip_load_legacy', 1);

            if (!empty($loadLegacy)) {
                wp_register_style('fullcalendar-style', plugins_url('css/fullcalendar.min.css', __FILE__));
                wp_enqueue_style('fullcalendar-style');

                /*
                wp_register_style('bootstrap-datepicker', plugins_url('css/bootstrap-datepicker.min.css', __FILE__));
                wp_enqueue_style( 'bootstrap-datepicker' );
                 */

                wp_register_style('axip-style', plugins_url('css/axip-style.less', __FILE__));
                wp_enqueue_style('axip-style');

                add_filter('style_loader_tag', array(&$this, 'axip_style_loader_tag_function'));
            }
        }

        public function loadLegacyScripts()
        {
            $axip_settings = get_option('axip_general_settings');
            $loadLegacy = get_option('axip_load_legacy', 1);

            if (!empty($loadLegacy)) {
                $javascriptVersion = AXIP_PLUGIN_VERSION;
                wp_enqueue_script(
                    'jquery', plugins_url('js/jquery-2.0.0.min.js', __FILE__),
                    array('jquery'), $javascriptVersion
                );

                wp_enqueue_script(
                    'bootstrap', plugins_url('js/bootstrap.min.js', __FILE__),
                    array('jquery'), $javascriptVersion
                );

                wp_enqueue_script(
                    'lesscss', plugins_url('js/less.min.js', __FILE__),
                    array('jquery'), $javascriptVersion
                );
                /* wp_enqueue_script (
                'bootstrap-datepicker', plugins_url('js/bootstrap-datepicker.min.js', __FILE__),
                array('jquery','bootstrap'), $javascriptVersion
                ); */

                wp_enqueue_script(
                    'jquery-validate', plugins_url('js/jquery.validate.min.js', __FILE__),
                    array('jquery'), $javascriptVersion
                );

                wp_enqueue_script(
                    'jquery-smartWizard', plugins_url('js/jquery.smartWizard.js', __FILE__),
                    array('jquery'), $javascriptVersion
                );

                wp_enqueue_script(
                    'js-cookie', plugins_url('js/js.cookie.js', __FILE__),
                    array('jquery'), $javascriptVersion
                );

                wp_enqueue_script(
                    'moment', plugins_url('js/moment.min.js', __FILE__),
                    array('jquery'), $javascriptVersion
                );

                wp_enqueue_script(
                    'fullcalendar', plugins_url('js/fullcalendar.min.js', __FILE__),
                    array('jquery', 'moment'), $javascriptVersion
                );

                wp_enqueue_script(
                    'axip-script', plugins_url('js/axip_script.js', __FILE__),
                    array('jquery', 'jquery-validate', 'moment', 'fullcalendar'), $javascriptVersion
                );
                wp_enqueue_script(
                    'axip-discounts', plugins_url('js/discounts.js', __FILE__),
                    array('jquery'), $javascriptVersion
                );
                wp_register_style('axip-template-style', plugins_url('css/style.css', __FILE__));
                wp_enqueue_style('axip-template-style');

                $custom_css = $axip_settings['custom_css'];

                wp_add_inline_style('axip-style', $custom_css);
            } else {
                wp_register_style('axip-template-style', plugins_url('css/style.css', __FILE__));
                wp_enqueue_style('axip-template-style');

                $custom_css = $axip_settings['custom_css'];

                wp_add_inline_style('axip-template-style', $custom_css);
            }

        }
        public function adminLoadStyles()
        {

        }

        public function adminLoadScripts()
        {
        }

        public function siteLoadStyles()
        {

        }

        public function siteLoadScripts()
        {

            wp_register_script('ax-analytics', plugins_url('/classes/_shortcodes/js/analytics.js', AXIP_PLUGIN_NAME), array());
        }

        public function axip_style_loader_tag_function($tag)
        {

            ## Modifies regular stylesheet properties to use "less". Wade, 22 SEP 2015.
            return preg_replace("/='stylesheet' id='axip-style-css'/", "='stylesheet/less' id='axip-style-css'", $tag);
        }

        ##
        ## Widgets initializations
        ##

        public function widgetsRegistration()
        {
            include_once 'classes/_wp_widgets/wpw_search_widget.php';
        }

        ##
        ## Plugin Activation and Deactivation
        ##

        /**
         * Activate plugin
         * @return void
         */

        public function pluginActivate()
        {

            /*Add hook to catch fatal errors on activation*/
            add_action('shutdown', array($this, 'deactivate_on_error'));

            ## This is where the automation of page creation should go. Wade, 22 SEP 2015.

            self::pluginUpgrade();
        }

        /**
         * Temporary Error Detection to disable the plugin if a fatal error is thrown.
         */
        public function deactivate_on_error()
        {
            remove_action('shutdown', array($this, 'deactivate_on_error'));
            $error = error_get_last();
            if ($error) {
                /*Log and email on fatal errors - unless in debugmode in which case log all*/
                if ($error['type'] == E_ERROR || Axcelerate_Integration_Plugin::DEBUGMODE) {
                    error_log(print_r($error, true));
                    try {
                        wp_mail(Axcelerate_Integration_Plugin::DEBUGEMAIL, 'FATAL ERROR WP', print_r($error, true));
                    } catch (\Throwable $th) {
                        //throw $th;
                    }
                }
                if ($error['type'] == E_ERROR) {
                    $plugin = plugin_basename(__FILE__);
                    deactivate_plugins($plugin);
                }
            }
        }

        /**
         * Deactivate plugin
         * @return void
         */
        public function pluginDeactivate()
        {
        }

        /**
         * Add code here if a plugin update requires settings or options to be modified. Runs once when Plugin is activated
         */
        public function pluginUpgrade()
        {

            /**
             * WP-158 Update to Enroller Colors
             * upgrading from prior to v2807
             **/
            $colors = get_option('ax_enrol_w_colours');
            if ($colors) {
                /*if the new key doesn't exist then it hasn't been updated*/
                if (!key_exists('ax_tf_hc', $colors)) {
                    if (!empty($colors['ax_hc'])) {
                        $colors['ax_tf_hc'] = $colors['ax_hc'];
                    }
                    if (!empty($colors['ax_hcb'])) {
                        $colors['ax_tf_hcb'] = $colors['ax_hcb'];
                    }
                    if (!empty($colors['ax_hct'])) {
                        $colors['ax_tf_hct'] = $colors['ax_hct'];
                    }
                    update_option('ax_enrol_w_colours', $colors);
                }
            }
            $axip_settings = get_option('axip_general_settings');
            if (!empty($axip_settings)) {
                if (!empty($axip_settings['webservice_base_path'])) {
                    $url = $axip_settings['webservice_base_path'];
                    if (strpos($url, 'stg.axcelerate') !== false) {
                        $url = "https://stg.axcelerate.com.au/api/";
                    } elseif (strpos($url, 'admin.axcelerate') !== false) {
                        $url = "https://api.axcelerate.com.au/api/";
                    } elseif (strpos($url, 'api.axcelerate') !== false) {
                        $url = "https://api.axcelerate.com.au/api/";
                    } elseif (strpos($url, 'tst.axcelerate') !== false) {
                        $url = "https://tst.axcelerate.com.au/api/";
                    }

                    $axip_settings['webservice_base_path'] = $url;
                    update_option('axip_general_settings', $axip_settings);
                }
            }
            $loadLegacy = get_option('axip_load_legacy');
            if ($loadLegacy !== "1" && $loadLegacy !== "0" && !$loadLegacy) {
                update_option('axip_load_legacy', "1");
            }

        }

        public function pluginUninstall()
        {
        }

        public function pluginLoad()
        {
            $settings_api_tabs_axip_plugin = new Settings_API_Tabs_AXIP_Plugin;
        }

        /**
         * Called once WP, and all plugins, are fully loaded.
         */
        public function wpLoaded()
        {
            /*Setup Schedules*/

            /*Old Captcha, moved to WP_loaded so that all other plugins are loaded first.*/
            if (!class_exists('ReallySimpleCaptcha')) {
                include_once dirname(__FILE__) . '/lib/really-simple-captcha/really-simple-captcha.php';
            }

            /**
             * Add Cron intervals for use with event calendar
             *
             * @param [type] $schedules
             * @return void
             * @author Rob Bisson <rob.bisson@axcelerate.com.au>
             */
            function ax_add_cron_interval($schedules)
            {
                $schedules['2_hourly'] = array(
                    'interval' => 60 * 60 * 2,
                    'display' => esc_html__('Every Other Hour'),
                );
                $schedules['ax_weekly'] = array(
                    'interval' => 60 * 60 * 24 * 7,
                    'display' => esc_html__('Once a Week'),
                );

                return $schedules;
            }
            add_filter('cron_schedules', 'ax_add_cron_interval');

            /*This loads the class files always - without need to include elsewhere*/
            include_once 'classes/_systems/ax_event_calendar.php';

            /*Load Shortcodes in the new updated framework*/
            self::loadShortcodes();

            include_once 'classes/_systems/ax_instances.php';

            /*Load Enrolment Notification system*/

            include_once 'classes/_systems/ax_post_enrolment.php';

            if (class_exists('AX_Events_Calendar')) {
                AX_Events_Calendar::registerEventHooks();
            }
            if (class_exists('AX_Enrolments')) {
                AX_Enrolments::registerEventHooks();
            }
            if (class_exists('AX_Post_Enrolments')) {
                AX_Post_Enrolments::registerEventHooks();
            }
            include_once 'classes/_systems/ax_epayment.php';

            include_once 'classes/_systems/ax_shopping_cart.php';
            $cart = new AX_Shopping_Cart();

            include_once 'classes/_systems/ax_auto_page_generation.php';

            function add_query_vars_filter($vars)
            {
                $vars[] = "ax_s";
                $vars[] = "course_id";
                $vars[] = "instance_id";
                $vars[] = "course_type";
                $vars[] = "training_cat";
                $vars[] = "enrolment";
                $vars[] = "enable_debug";
                $vars[] = "ax_custom";
                $vars[] = "ax_p";
                $vars[] = "ok";
                $vars[] = "ref";
                $vars[] = "state_hash";

                return $vars;
            }

            //Add custom query vars
            add_filter('query_vars', 'add_query_vars_filter');
            self::testingEnvironment();
            self::cachingSettings();
            self::resumptionPerformance();

            include_once 'classes/_systems/transient_cleanup.php';

            AX_Transient_Cleanup::registerEventHooks();
            AX_Transient_Cleanup::setupReminderTasks();
            AX_Validate::checkAccess(false);
        }
        public function loadShortcodes()
        {
            include_once 'classes/_shortcodes/ax_visual_composer.php';
            include_once 'classes/_shortcodes/sc_course_list.php';
            include_once 'classes/_shortcodes/sc_course_search_ajax.php';
            include_once 'classes/_shortcodes/sc_course_details.php';
            include_once 'classes/_shortcodes/sc_course_instances.php';
            include_once 'classes/_shortcodes/sc_course_instances_summary.php';
            include_once 'classes/_shortcodes/sc_enrol_events.php';
            include_once 'classes/_shortcodes/sc_utility.php';
            include_once 'classes/_shortcodes/sc_enroller_widget.php';
            include_once 'classes/_shortcodes/sc_enquiry_widget.php';
            include_once 'classes/_shortcodes/sc_shopping_cart.php';
            include_once 'classes/_shortcodes/sc_login_form.php';
            include_once 'classes/_shortcodes/sc_complex_course_search.php';
        }

        public function testingEnvironment()
        {
            $settings = (array) get_option('axip_general_settings');
            $environment = $settings['webservice_base_path'];
            $testing_env = false;
            if (!empty($environment)) {
                if (strpos($environment, 'tst.axcelerate') !== false) {
                    $testing_env = true;
                } elseif (strpos($environment, 'stg.axcelerate') !== false) {
                    $testing_env = true;
                }
            }
            define('AXIP_TESTING_ENVIRONMENT', $testing_env);
        }

        public function cachingSettings()
        {

            $caching = get_option('ax_caching_enabled');
            $cachingEnabled = false;
            if (!empty($caching)) {
                if ($caching == "caching_enabled") {
                    $cachingEnabled = true;
                }
            }
            define('AXIP_CACHING_ENABLED', $cachingEnabled);
        }
        public function resumptionPerformance()
        {

            $performance = get_option('ax_resumption_performance');
            $pEnabled = false;
            if (!empty($performance)) {
                if ($performance == "performance_enabled") {
                    $pEnabled = true;
                }
            }
            define('AXIP_ER_PERFORMANCE_ENABLED', $pEnabled);
        }
        // The following 2 closing curly braces close this class and the if loop before it.
    }

}

//instantiate the class
if (class_exists('Axcelerate_Integration_Plugin')) {
    $Axcelerate_Integration_Plugin = Axcelerate_Integration_Plugin::getInstance();
}
