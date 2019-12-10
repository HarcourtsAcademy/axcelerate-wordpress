<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined('ABSPATH') or die('No script kiddies please!');

/* -------------------------------------------- */
class Settings_API_Tabs_AXIP_Plugin
{

    /*
     * For easier overriding we declared the keys
     * here as well as our tabs array which is populated
     * when registering settings
     */
    private $general_settings_key = 'axip_general_settings';
    private $addon_settings_key = 'axip_addon_settings';
    private $enroller_settings_key = 'axip_enroller_settings';
    private $enrol_colours_settings_key = 'axip_enrol_colours_settings';
    private $course_list_setting_key = 'axip_course_list_settings';
    private $course_detail_setting_key = 'axip_course_detail_settings';
    private $course_instances_key = 'axip_course_instance_settings';
    private $course_mapping_setting_key = 'axip_course_mapping_settings';
    private $course_config_mapping_setting_key = 'axip_course_config_mapping_settings';

    private $enroller_enrolment_events_settings_key = 'axip_enroller_events_settings';
    private $enroller_enrolment_resumption_settings_key = 'axip_enroller_resumption_settings';
    private $axip_performance_settings_key = 'axip_performance_settings';
    private $event_calendar_setting_key = 'axip_event_calendar_settings';
    private $post_enrolment_settings_key = 'axip_post_enrolment_settings';
    private $shopping_cart_settings_key = 'axip_shopping_cart_settings';


    private $cognito_signin_settings_key = 'axip_cognito_signin_settings';

    private $auto_generation_key = 'axip_auto_generation_settings';
    private $feature_test_key = 'axip_feature_test_settings';

    private $plugin_options_key = 'axip_plugin_options';
    private $plugin_settings_tabs = array();

    /*
     * Fired during plugins_loaded (very very early),
     * so don't miss-use this, only actions and filters,
     * current ones speak for themselves.
     */
    public function __construct()
    {
        add_action('admin_init', array(
            &$this,
            'register_general_settings',
        ));
        add_action('addon_init', array(
            &$this,
            'addon_settings_key',
        ));

        add_action('admin_menu', array(
            &$this,
            'add_admin_menus',
        ));
    }

    /*
     * Registers the general settings via the Settings API,
     * appends the setting to the tabs array of the object.
     */
    public function register_general_settings()
    {

        $this->plugin_settings_tabs[$this->general_settings_key] = __('General', 'axip');
        require_once '_settings/legacy.php';
        $legacy = new AX_Settings_Tab_Legacy();
        $legacy->register_settings();

        /**
         * * Add Course List Settings **
         */
        $this->plugin_settings_tabs[$this->course_list_setting_key] = __('Course List', 'axip');
        require_once '_settings/course_list.php';
        $Course_List = new AX_Settings_Tab_Course_List();
        $Course_List->register_settings();

        /**
         * * Course Details Page Settings **
         */
        $this->plugin_settings_tabs[$this->course_detail_setting_key] = __('Course Details', 'axip');
        require_once '_settings/course_details.php';
        $Course_Details = new AX_Settings_Tab_Course_Details();
        $Course_Details->register_settings();

        /**
         * * Course Instance Settings **
         */
        $this->plugin_settings_tabs[$this->course_instances_key] = __('Course Instances', 'axip');
        require_once '_settings/course_instances.php';
        $Course_Details = new AX_Settings_Tab_Course_Instances();
        $Course_Details->register_settings();

        /**
         * Course Mapping
         */
        $this->plugin_settings_tabs[$this->course_mapping_setting_key] = __('Course Mapping', 'axip');
        require_once '_settings/course_mapping.php';
        $mappingSettings = new AX_Settings_Tab_Course_Mapping();
        $mappingSettings->register_settings();

        /**
         * Add Course Config Mapping
         */
        $this->plugin_settings_tabs[$this->course_config_mapping_setting_key] = __('Course (Config) Mapping', 'axip');
        require_once '_settings/course_config_mapping.php';
        $mappingSettings = new AX_Settings_Tab_Course_Config_Mapping();
        $mappingSettings->register_settings();

        /**
         * * Add Enroller Widget Configuration Settings **
         */
        $this->plugin_settings_tabs[$this->enroller_settings_key] = __('Enroller', 'axip');
        require_once '_settings/enroller_widget.php';
        $Course_Details = new AX_Settings_Tab_Enroller();
        $Course_Details->register_settings();

        /**
         * Enroller Colours
         */
        $this->plugin_settings_tabs[$this->enrol_colours_settings_key] = __('Enroller Colours', 'axip');
        require_once '_settings/enroller_colours.php';
        $Enroller_Colours = new AX_Settings_Tab_Enroller_Colours();
        $Enroller_Colours->register_settings();

        /**
         * Enrolment Resumption
         */
        $this->plugin_settings_tabs[$this->enroller_enrolment_resumption_settings_key] = __('Enrolment Resumption', 'axip');
        require_once '_settings/enrolment_resumption.php';
        $Enrol_Resume = new AX_Settings_Tab_Enrolment_Resumption();
        $Enrol_Resume->register_settings();

        /**
         * ENROLMENT EVENTS
         */
        $this->plugin_settings_tabs[$this->enroller_enrolment_events_settings_key] = __('Enroller Events', 'axip');
        require_once '_settings/enrolment_events.php';
        $EnrolEvents = new AX_Settings_Tab_Enrol_Events();
        $EnrolEvents->register_settings();

        /**
         * Post Enrolment Notifications
         */
        $this->plugin_settings_tabs[$this->post_enrolment_settings_key] = __('Post Enrolment', 'axip');
        require_once '_settings/post_enrolment.php';
        $Post_Enrol = new AX_Settings_Tab_Post_Enrolment();
        $Post_Enrol->register_settings();

        /**
         * Shopping Cart
         */
        $this->plugin_settings_tabs[$this->shopping_cart_settings_key] = __('Shopping Cart', 'axip');
        require_once '_settings/shopping_cart.php';
        $ShoppingCart = new AX_Settings_Tab_Shopping_Cart();
        $ShoppingCart->register_settings();

        /**
         * Performance Settings
         */
        $this->plugin_settings_tabs[$this->axip_performance_settings_key] = __('Performance Settings', 'axip');
        require_once '_settings/performance.php';
        $Performance_Settings = new AX_Settings_Tab_Performance();
        $Performance_Settings->register_settings();

        /**
         * EVENT CALENDAR INTEGRATION
         */
        if (class_exists('Tribe__Events__API')) {
            $this->plugin_settings_tabs[$this->event_calendar_setting_key] = __('Event Calendar Integration', 'axip');
            require_once '_settings/event_calendar.php';
            $Event_Calendar = new AX_Settings_Tab_Events_Calendar();
            $Event_Calendar->register_settings();
        }



        /**
         * Cognito Settings
         */
        $this->plugin_settings_tabs[$this->cognito_signin_settings_key] = __('Cognito Settings', 'axip');
        require_once '_settings/cognito_signin.php';
        $Cognito = new AX_Settings_Tab_Cognito();
        $Cognito->register_settings();



        /**
         * * Auto Gen Settings **
         */
        $this->plugin_settings_tabs[$this->auto_generation_key] = __('Auto Generate', 'axip');
        require_once '_settings/auto_page_generation.php';
        $Auto_Gen = new AX_Settings_Tab_Auto_Generation();
        $Auto_Gen->register_settings();

        /**
         * * Feature Test Settings **
         */
        $this->plugin_settings_tabs[$this->feature_test_key] = __('Feature Test', 'axip');
        require_once '_settings/feature_testing.php';
        $Feat_Test = new AX_Settings_Tab_Feature_Test();
        $Feat_Test->register_settings();

    }

    /*
     * The following methods provide descriptions
     * for their respective sections, used as callbacks
     * with add_settings_section
     */

    public function section_enqiry_button_desc()
    {
        echo __('The enrol button only works if added on a page with a "Course Detail Display" content object. The enqure button can be on any page. If on a course specific page (such as Detail Display or the Course List) it will set the equiry against that specific course type.');
    }
    public function section_enrol_button_desc()
    {
        echo __('The enrol button only works if added on a page with a "Course Detail Display" content object. The enqure button can be on any page. If on a course specific page (such as Detail Display or the Course List) it will set the equiry against that specific course type.');
    }

    public function section_search_desc()
    {
    }

    public function ax_deregister_load_general_scripts()
    {
        if (is_admin()) {
            /* deregister and dequeue existing scripts */
            wp_dequeue_script('dataTables');
            wp_deregister_script('dataTables');
            wp_dequeue_style('dataTables');
            wp_deregister_style('dataTables');

            wp_deregister_script('jquery.mobile');
            $this->ax_load_settings_general_scripts();
        }
    }

    public function ax_load_style()
    {
        $VERSION = constant('AXIP_PLUGIN_VERSION');
        if ($VERSION === null) {
            $VERSION = time();
        }
        wp_register_style('ax-settings', plugins_url('../css/ax-settings.css', __FILE__), array(), $VERSION);
        wp_enqueue_style('ax-settings');
    }
    public function ax_load_settings_general_scripts()
    {
        $VERSION = constant('AXIP_PLUGIN_VERSION');
        if ($VERSION === null) {
            $VERSION = time();
        }

        wp_register_script('dataTables', plugins_url('../enrollerWidget/DataTables/datatables.js', __FILE__), array(
            'jquery',
        ), $VERSION);
        wp_enqueue_script('dataTables');

        wp_register_script('dataTables_ReOrder', plugins_url('../enrollerWidget/DataTables/dataTables.rowReorder.min.js', __FILE__), array(
            'jquery',
            'dataTables',
        ), $VERSION);
        wp_enqueue_script('dataTables_ReOrder');
        wp_register_style('dataTables_org', plugins_url('../enrollerWidget/DataTables/datatables.css', __FILE__), array(), $VERSION);
        wp_enqueue_style('dataTables_org');

        wp_register_script('pre_init', plugins_url('../enrollerWidget/pre_init.js', __FILE__), array(
            'jquery',
        ), $VERSION);
        wp_enqueue_script('pre_init');

        wp_register_script('jquery.mobile', plugins_url('../enrollerWidget/jquery.mobile-1.4.5/jquery.mobile-1.4.5.js', __FILE__), array(
            'jquery',
            'pre_init',
        ), $VERSION);
        wp_enqueue_script('jquery.mobile');
        wp_register_style('jqm', plugins_url('../enrollerWidget/jquery.mobile-1.4.5/jquery.mobile-1.4.5.css', __FILE__), array(), $VERSION);
        // wp_enqueue_style ( 'jqm' );

        self::ax_load_chosen();
    }

    public function ax_load_chosen()
    {
        wp_dequeue_script('chosen');
        wp_dequeue_style('chosen');
        wp_deregister_script('chosen');
        wp_deregister_style('chosen');

        $VERSION = constant('AXIP_PLUGIN_VERSION');
        if ($VERSION === null) {
            $VERSION = time();
        }
        wp_register_script('chosen', plugins_url('../enrollerWidget/chosen/chosen.jquery.js', __FILE__), array(
            'jquery',
        ), $VERSION);
        wp_enqueue_script('chosen');
        wp_register_style('chosen', plugins_url('../enrollerWidget/chosen/chosen.css', __FILE__), array(), $VERSION);
        wp_enqueue_style('chosen');

        wp_register_style('chosen-b', plugins_url('../enrollerWidget/chosen/wp-chosen.css', __FILE__), array(), $VERSION);
        wp_enqueue_style('chosen-b');
    }
    public function ax_load_settings_helper()
    {
        wp_enqueue_style('wp-color-picker');
        wp_enqueue_script('ax-setting-helper', plugins_url('../js/ax_setting_helper.js', __FILE__), array(
            'jquery',
            'wp-color-picker',
        ), '', true);
    }

    /*
     * Called during admin_menu, adds an options
     * page under Settings called My Settings, rendered
     * using the plugin_options_page method.
     */
    public function add_admin_menus()
    {
        add_menu_page(__('Axcelerate Integration Plugin', 'axip'), __('Axcelerate Integration Plugin', 'axip'), 'manage_options', $this->plugin_options_key, array(
            &$this,
            'plugin_options_page',
        ), plugin_dir_url(__FILE__) . '../images/ax_icon_sm.png', 2);
        add_submenu_page($this->plugin_options_key, __('Axcelerate Integration Plugin', 'axip'), __('General', 'axip'), 'manage_options', $this->plugin_options_key, array(
            &$this,
            'plugin_options_page',
        ));
        add_submenu_page($this->plugin_options_key, __('Axcelerate Integration Plugin', 'axip'), __('Course List', 'axip'), 'manage_options', $this->course_list_setting_key, array(
            &$this,
            'plugin_options_course_list',
        ));
        add_submenu_page(
            $this->plugin_options_key,
            __('Axcelerate Integration Plugin', 'axip'),
            __('Course Details', 'axip'),
            'manage_options',
            $this->course_detail_setting_key,
            array(&$this, 'plugin_options_course_details')
        );
        add_submenu_page(
            $this->plugin_options_key,
            __('Axcelerate Integration Plugin', 'axip'),
            __('Course Instances', 'axip'),
            'manage_options',
            $this->course_instances_key,
            array(&$this, 'plugin_options_course_instances')
        );
        add_submenu_page(
            $this->plugin_options_key,
            __('Axcelerate Integration Plugin', 'axip'),
            __('Course Mapping', 'axip'),
            'manage_options',
            $this->course_mapping_setting_key,
            array(&$this, 'plugin_options_course_course_mapping')
        );

        add_submenu_page(
            $this->plugin_options_key,
            __('Axcelerate Integration Plugin', 'axip'),
            __('Course (Config) Mapping', 'axip'),
            'manage_options',
            $this->course_config_mapping_setting_key,
            array(&$this, 'plugin_options_course_course_config_mapping')
        );

        add_submenu_page(
            $this->plugin_options_key,
            __('Axcelerate Integration Plugin', 'axip'),
            __('Enroller', 'axip'),
            'manage_options',
            $this->enroller_settings_key,
            array(&$this, 'plugin_options_course_enroller')
        );
        add_submenu_page(
            $this->plugin_options_key,
            __('Axcelerate Integration Plugin', 'axip'),
            __('Enroller Colours', 'axip'),
            'manage_options',
            $this->enrol_colours_settings_key,
            array(&$this, 'plugin_options_course_enroller_colours')
        );
        add_submenu_page(
            $this->plugin_options_key,
            __('Axcelerate Integration Plugin', 'axip'),
            __('Enrolment Resumption', 'axip'),
            'manage_options',
            $this->enroller_enrolment_resumption_settings_key,
            array(&$this, 'plugin_options_enrolment_resumption')
        );
        add_submenu_page(
            $this->plugin_options_key,
            __('Axcelerate Integration Plugin', 'axip'),
            __('Enrolment Events', 'axip'),
            'manage_options',
            $this->enroller_enrolment_events_settings_key,
            array(&$this, 'plugin_options_enrolment_events')
        );

        add_submenu_page(
            $this->plugin_options_key,
            __('Axcelerate Integration Plugin', 'axip'),
            __('Post Enrolment', 'axip'),
            'manage_options',
            $this->post_enrolment_settings_key,
            array(&$this, 'plugin_options_post_enrolment')
        );

        add_submenu_page(
            $this->plugin_options_key,
            __('Axcelerate Integration Plugin', 'axip'),
            __('Shopping Cart', 'axip'),
            'manage_options',
            $this->shopping_cart_settings_key,
            array(&$this, 'plugin_options_shopping_cart')
        );

        add_submenu_page(
            $this->plugin_options_key,
            __('Axcelerate Integration Plugin', 'axip'),
            __('Performance Settings', 'axip'),
            'manage_options',
            $this->axip_performance_settings_key,
            array(&$this, 'plugin_options_performance')
        );

        if (class_exists('Tribe__Events__API')) {
            add_submenu_page(
                $this->plugin_options_key,
                __('Axcelerate Integration Plugin', 'axip'),
                __('The Events Calendar', 'axip'),
                'manage_options',
                $this->event_calendar_setting_key,
                array(&$this, 'plugin_options_event_calendar')
            );
        }

        add_submenu_page(
            $this->plugin_options_key,
            __('Axcelerate Integration Plugin', 'axip'),
            __('Auto Generate', 'axip'),
            'manage_options',
            $this->auto_generation_key,
            array(&$this, 'plugin_options_auto_generate')
        );

        add_submenu_page(
            $this->plugin_options_key,
            __('Axcelerate Integration Plugin', 'axip'),
            __('Feature Test', 'axip'),
            'manage_options',
            $this->feature_test_key,
            array(&$this, 'plugin_options_feature_test')
        );

    }
    public function plugin_options_course_list()
    {
        $this->plugin_options_page($this->course_list_setting_key);
    }
    public function plugin_options_course_details()
    {
        $this->plugin_options_page($this->course_detail_setting_key);
    }
    public function plugin_options_course_instances()
    {
        $this->plugin_options_page($this->course_instances_key);
    }
    public function plugin_options_course_enroller()
    {
        $this->plugin_options_page($this->enroller_settings_key);
    }
    public function plugin_options_course_enroller_colours()
    {
        $this->plugin_options_page($this->enrol_colours_settings_key);
    }
    public function plugin_options_enrolment_events()
    {
        $this->plugin_options_page($this->enroller_enrolment_events_settings_key);
    }

    public function plugin_options_course_course_mapping()
    {
        $this->plugin_options_page($this->course_mapping_setting_key);
    }
    public function plugin_options_course_course_config_mapping()
    {
        $this->plugin_options_page($this->course_config_mapping_setting_key);
    }
    public function plugin_options_event_calendar()
    {
        $this->plugin_options_page($this->event_calendar_setting_key);
    }

    public function plugin_options_auto_generate()
    {
        $this->plugin_options_page($this->auto_generation_key);
    }

    public function plugin_options_feature_test()
    {
        $this->plugin_options_page($this->feature_test_key);
    }

    public function plugin_options_enrolment_resumption()
    {
        $this->plugin_options_page($this->enroller_enrolment_resumption_settings_key);
    }
    public function plugin_options_post_enrolment()
    {
        $this->plugin_options_page($this->post_enrolment_settings_key);
    }
    public function plugin_options_shopping_cart()
    {
        $this->plugin_options_page($this->shopping_cart_settings_key);
    }

    public function plugin_options_performance()
    {

        $this->plugin_options_page($this->axip_performance_settings_key);
    }

    public function plugin_tab_extra($tab, $current_tab)
    {

        if ($current_tab !== $this->course_mapping_setting_key && $current_tab !== $this->course_config_mapping_setting_key
            && $current_tab !== $this->enroller_enrolment_events_settings_key
            && $current_tab !== $this->enroller_settings_key) {
            self::ax_load_chosen();
            self::ax_load_settings_helper();
        }
        $nonce = wp_create_nonce('ax_enroller');
        echo '<script>window._wp_nonce = "' . $nonce . '";</script>';

        $settingNonce = wp_create_nonce('ax_settings');
        echo '<script>window._ax_setting_nonce = "' . $settingNonce . '";</script>';
    }

    /*
     * Plugin Options page rendering goes here, checks
     * for active tab and replaces key with the related
     * settings key. Uses the plugin_options_tabs method
     * to render the tabs.
     */
    public function plugin_options_page($tab = '')
    {
        self::ax_load_style();
        if (!empty($tab)) {
            $_GET['tab'] = $tab;
        } else {
            $tab = isset($_GET['tab']) ? $_GET['tab'] : $this->general_settings_key;
        }
        $requiresSubmit = true;
        $doesNotRequireSubmit = array($this->auto_generation_key, $this->feature_test_key);
        if(in_array($tab, $doesNotRequireSubmit)){
            $requiresSubmit = false;
        }

        $current_tab = isset($_GET['tab']) ? $_GET['tab'] : $this->general_settings_key;

        global $wp_settings_sections, $wp_settings_fields;

        ?>


        <div class="wrap">
            <h2></h2>
            <div class="ax-settings-tab">

                <?php self::plugin_tab_extra($tab, $current_tab)?>

                <form method="post" action="options.php" class="ax-setting-page">
                    <div class="ax-settings-body">
                        <div class="settings-top-bar">
                            <?php 
                                $section = (array) $wp_settings_sections[$tab];
                                echo '<h2>' . reset($section)['title'] . '</h2>';
                                if($requiresSubmit){
                                    submit_button('Save Changes', 'primary', 'submit', false,array('data-enhance'=>'false'));
                                }
                                   
                             
                            ?>
                        </div>
                        <div class="ax-settings-body-inner">
                            <?php $this->plugin_options_tabs($current_tab);?>
                            <div class="ax-setting-right">
                                <?php wp_nonce_field('update-options');?>
                                <div class="ax-setting-inner">
                                    <?php settings_fields( $tab );?>
                                    <?php do_settings_sections($tab);?>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            <div>
        </div>


        </div> <!--Extra div because ?-->

<?php

    }

    /*
     * Renders our tabs in the plugin options page,
     * walks through the object's tabs array and prints
     * them one by one. Provides the heading for the
     * plugin_options_page method.
     */
    public function plugin_options_tabs($current_tab)
    {

        echo '<h2 class="ax-setting-nav nav-tab-wrapper">';

        foreach ($this->plugin_settings_tabs as $tab_key => $tab_caption) {

            $active = $current_tab == $tab_key ? 'nav-tab-active' : '';

            echo '<a class="nav-tab ' . $active . '" href="?page=' . $this->plugin_options_key . '&tab=' . $tab_key . '">' . $tab_caption . '</a>';
        }

        echo '</h2>';

    }

};
