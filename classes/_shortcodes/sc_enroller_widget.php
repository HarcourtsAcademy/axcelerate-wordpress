<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined('ABSPATH') or die('No script kiddies please!');

/* -------------------------------------------- */

if (!class_exists('AX_Enrol_Widget_Shortcode')) {
    class AX_Enrol_Widget_Shortcode
    {
        public function __construct()
        {
            add_shortcode('ax_enrol_widget', array(
                &$this,
                'ax_sc_enroller_widget',
            ));
        }

        public function ax_sc_enroller_widget($atts)
        {
            self::axcelerate_enrolment_widget_scripts();
            $testing = constant('AXIP_TESTING_ENVIRONMENT') === true;

            if (empty($_SERVER['HTTPS']) && !$testing) {
                return '<h3>The Enrolment Widget requires that the website has a Security Certificate</h3>';
            }
            $VERSION = constant('AXIP_PLUGIN_VERSION');
            if ($VERSION === null) {
                $VERSION = time();
            }
            $AxcelerateAPI = new AxcelerateAPI();
            $a = shortcode_atts(array(
                'config_id' => 0,
                'course_id' => 0,
                'instance_id' => 0,
                'type' => '',
                'course_type' => '',
                'discounts_available' => 0,
                'suppress_email' => false,
                'custom_css' => '',
                'class_to_add' => '',
                'enrolment_hash' => '',
                'location_restriction' => '',
                'delivery_location_restriction' => '',
                'venue_restriction' => '',
                'shopping_cart' => false,
            ), $atts);
            $axip_settings = get_option('axip_general_settings');
            $config_widget_settings = get_option('ax_enroller_widget_settings');
            $discountsAvailable = $axip_settings['axip_discounts_available'];
            $environmentURL = $axip_settings['webservice_base_path'];
            $api_token = $axip_settings['api_token'];

            //ADD MAPPING RULES CHECK

            if (!is_admin()) {

                $ccSurchage = 0;
                $payment_flow = false;
                $axSettings = $AxcelerateAPI->callResource(array(), '/settings', 'GET');

                if (!empty($axSettings)) {
                    if (is_array($axSettings)) {
                        if (!empty($axSettings[0]->CCSURCHARGE)) {
                            $ccSurchage = $axSettings[0]->CCSURCHARGE / 100;
                        }
                        if (!empty($axSettings[0]->PAYMENTGATEWAYID)) {
                            if ($axSettings[0]->PAYMENTGATEWAYID === 6) {
                                $payment_flow = true;
                            }
                        }
                    }
                }

                /***** PROCESS URL PARAMS *****/
                global $post;

                $processed = self::process_url_params_and_attrs($a, $post);

                $type = $processed['type'];
                $course_id = $processed['course_id'];
                $instance_id = $processed['instance_id'];
                $location_restriction = $processed['location_restriction'];
                $delivery_location_restriction = $processed['delivery_location_restriction'];
                $venue_restriction = $processed['venue_restriction'];

                $config_id = $a['config_id'];
                if ($processed['config_id'] !== -1) {
                    $config_id = $processed['config_id'];
                }
                if ($course_id !== 0 && !empty($type)) {
                    $mapped_config = identifyEnrolmentConfig($course_id, $type);

                    if (!empty($mapped_config) || $mapped_config === 0) {
                        $config_id = $mapped_config;
                    }
                }

                $user_ip = $_SERVER['REMOTE_ADDR'];

                if (empty($processed['state_hash'])) {
                    $actual_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
                    $state_hash = AX_Cognito_Auth::store_state_hash($config_id, $course_id, $instance_id, $type, $actual_link);
                } else {
                    $state_hash = $processed['state_hash'];
                }

                $additionalData = self::preload_lists();

                $settings = array(
                    'ajaxURL' => admin_url('admin-ajax.php'),
                    'config_settings' => $config_widget_settings,
                    'config_id' => $config_id,
                    'course_id' => $course_id,
                    'instance_id' => $instance_id,
                    'type' => $type,
                    'discounts_available' => $discountsAvailable,
                    'suppress_email' => $a['suppress_email'],
                    'cc_surcharge' => $ccSurchage,
                    'location_restriction' => $location_restriction,
                    'delivery_location_restriction' => $delivery_location_restriction,
                    'venue_restriction' => $venue_restriction,
                    'user_ip' => $user_ip,
                    'state_hash' => $state_hash,
                    'payment_flow' => $payment_flow ? 1 : 0,
                    'country_list' => $additionalData['country'],
                    'language_list' => $additionalData['language'],

                );

                /*Shopping Cart. Check setting enabled before proceeding*/
                $cart = get_option('ax_shopping_cart');
                if (!empty($cart)) {
                    if ($cart === "enabled") {
                        if (!empty($a['shopping_cart'])) {
                            if ($a['shopping_cart'] === true || $a['shopping_cart'] === 'true' || $a['shopping_cart'] == 1) {
                                $cart = json_decode(stripslashes(AX_Shopping_Cart::getCookie()), true);
                                if (!empty($cart)) {
                                    if (count($cart) > 0) {
                                        $settings['cart_course_override'] = $cart;
                                    }
                                }
                            }
                        }
                    }
                }

                /**
                 * WP-338 - Multi course override.
                 */
                if (!empty($_REQUEST['course_id_1'])) {
                    $multiCourse = self::parse_course_url_params($_REQUEST, 1);
                    if (!empty($multiCourse) && $multiCourse) {
                        $settings['cart_course_override'] = $multiCourse;
                    }
                }

                if (empty($a['enrolment_hash'])) {
                    $enrolment_hash = get_query_var('enrolment');

                } else {
                    $enrolment_hash = $enrolment_hash;
                }
                $enable_enrol_hash = get_option('ax_enroller_enrolment_hashes');

                $axP = get_query_var('ax_p');
                if (!empty($axP)) {
                    //If the ePayment process var is set then process hashes.
                    $enrolment_hash = $axP;
                    $enable_enrol_hash = true;
                }

                $extraOptions = array();
                if (!empty($enable_enrol_hash)) {
                    if (!empty($enrolment_hash)) {
                        $extraOptions = $this->process_enrolment_hash($enrolment_hash);

                        /* Handle any ePayment resumption links. ePayment cannot be resubmitted with different rules */

                        $settings = array_merge($settings, $extraOptions);
                    }
                }

                $loginStatus = self::check_login_status();

                $settings['login_status'] = $loginStatus;

                $cognito = get_option('ax_cognito_enabled', 'cognito_disabled');

                if ('cognito_enabled' === $cognito) {
                    $settings['cognito_enabled'] = true;
                    $settings['cognito_client'] = get_option('ax_cognito_client_id');
                    $settings['cognito_redir_url'] = get_option('ax_cognito_redirect_url', get_site_url(null, 'cognito_redirect', null));
                }

                // Localise Scripts.
                wp_localize_script('enroller-api', 'enroller_default_vars', array(
                    'ajaxURL' => admin_url('admin-ajax.php'),
                    'ax_url' => $environmentURL,
                    'api_token' => $api_token,
                ));

                wp_localize_script('enroller-defaults', 'enroller_default_vars', array(
                    'ajaxURL' => admin_url('admin-ajax.php'),
                    'ax_url' => $environmentURL,
                    'api_token' => $api_token,
                ));

                wp_localize_script('after_init', 'after_init_vars', $settings);

                self::ax_localise_css();

                $class_to_add = $a['class_to_add'];
                if (!empty($a['custom_css'])) {
                    $AxcelerateShortcode = new AxcelerateShortcode();
                    $css = $AxcelerateShortcode->ax_decode_custom_css($a['custom_css'], $a, 'ax_enrol_widget');
                    $class_to_add = $class_to_add . ' ' . $css;
                }

                $html = '<style> .ui-page { position: relative; display: block;} div.enroller-content{overflow:visible !important;} </style><div class="enroller-content ' . $class_to_add . '" data-role="page" ><div id="enroller"></div></div>';

                $html .= self::handle_debitsuccess_action($extraOptions);

                $enrol_action = get_option('ax_enrol_event_action');

                if ($enrol_action == 'hide_and_display') {
                    $content = get_option('ax_enrol_event_success_content');
                    $html = $html . '<div style="display:none" id="enroller_success">' . $content . '</div>';
                }

                if (empty($_SERVER['HTTPS'])) {
                    $html = '<div class="https-warning" style="background:#ee3c26; padding: 1em; text-align:center"><h1 style="color:#fff">This website does not have a security certificate.</h1><h1 style="color:#fff">Please do not enter personally identifying information into the Enrolment Form.</h1></div>' . $html;
                }
                $nonce = wp_create_nonce('ax_enroller');
                $html = $html . '<script>window._wp_nonce = "' . $nonce . '"</script>';

                if (key_exists('ax_session', $extraOptions)) {
                    $html = $html . '<script>window.ax_session = {session_id:"' . $extraOptions['ax_session'] . '"};</script>';
                }

                return $html;
            }

        }

        public static function process_url_params_and_attrs($a, $post)
        {
            $type = '';
            $course_id = 0;
            $config_id = -1;
            $instance_id = 0;
            $location_restriction = '';
            $delivery_location_restriction = '';
            $venue_restriction = '';
            $state_hash = '';

            if (!empty($a['course_type'])) {
                $type = $a['course_type'];
            } elseif (!empty($a['type'])) {
                $type = $a['type'];
            } else {
                if (!empty($_REQUEST['course_type'])) {
                    $type = $_REQUEST['course_type'];
                } elseif (!empty($_REQUEST['type'])) {
                    $type = $_REQUEST['type'];
                } elseif (!empty($_REQUEST['TYPE'])) {
                    $type = $_REQUEST['TYPE'];
                } elseif (!empty($_REQUEST['ctype'])) {
                    $type = $_REQUEST['ctype'];
                } else {
                    $course_ref = $custom_content = get_post_meta($post->ID, 'course_ref');
                    if (!empty($course_ref)) {
                        $refSplit = explode('_', $course_ref[0]);
                        $type = $refSplit[1];
                    }
                }
            }

            if (!empty($a['course_id'])) {
                $course_id = $a['course_id'];
            } else {
                if (!empty($_REQUEST['course_id'])) {
                    $course_id = $_REQUEST['course_id'];
                } elseif (!empty($_REQUEST['ID'])) {
                    $course_id = $_REQUEST['ID'];
                } elseif (!empty($_REQUEST['id'])) {
                    $course_id = $_REQUEST['id'];
                } elseif (!empty($_REQUEST['cid'])) {
                    $course_id = $_REQUEST['cid'];
                } else {
                    $course_ref = $custom_content = get_post_meta($post->ID, 'course_ref');
                    if (!empty($course_ref)) {
                        $refSplit = explode('_', $course_ref[0]);
                        $course_id = $refSplit[0];
                    }
                }
            }

            if (!empty($a['instance_id'])) {
                $instance_id = $a['instance_id'];
            } else {
                if (!empty($_REQUEST['instance_id'])) {
                    $instance_id = $_REQUEST['instance_id'];
                } elseif (!empty($_REQUEST['instanceID'])) {
                    $instance_id = $_REQUEST['instanceID'];
                } elseif (!empty($_REQUEST['instanceid'])) {
                    $instance_id = $_REQUEST['instanceid'];
                } elseif (!empty($_REQUEST['cinstanceID'])) {
                    $instance_id = $_REQUEST['cinstanceID'];
                } else {
                    $instance_ref = $custom_content = get_post_meta($post->ID, 'instance_ref');
                    if (!empty($instance_ref)) {
                        $refSplit = explode('_', $instance_ref[0]);
                        $instance_id = $refSplit[0];
                    }
                }
            }
            if (!empty($a['location_restriction'])) {
                $location_restriction = $a['location_restriction'];
            } else {
                if (!empty($_REQUEST['location_restriction'])) {
                    $location_restriction = $_REQUEST['location_restriction'];
                }
            }

            if (!empty($a['delivery_location_restriction'])) {
                $delivery_location_restriction = $a['delivery_location_restriction'];
            } else {
                if (!empty($_REQUEST['delivery_location_restriction'])) {
                    $delivery_location_restriction = $_REQUEST['delivery_location_restriction'];
                }
            }

            if (!empty($a['venue_restriction'])) {
                $venue_restriction = $a['venue_restriction'];
            } else {
                if (!empty($_REQUEST['venue_restriction'])) {
                    $venue_restriction = $_REQUEST['venue_restriction'];
                }
            }

            if (!empty($a['state_hash'])) {
                $state_hash = $a['state_hash'];
            } else {
                if (!empty($_REQUEST['state_hash'])) {
                    $state_hash = $_REQUEST['state_hash'];
                }
            }

            if (!empty($state_hash)) {
                $state = AX_Cognito_Auth::get_status_from_hash($state_hash);
                if ($state !== false) {
                    $type = $state['type'];
                    $course_id = $state['course_id'];
                    $instance_id = $state['instance_id'];
                    $config_id = $state['config_id'];
                }
            }

            return array(
                'type' => $type,
                'course_id' => $course_id,
                'config_id' => $config_id,
                'instance_id' => $instance_id,
                'location_restriction' => $location_restriction,
                'delivery_location_restriction' => $delivery_location_restriction,
                'venue_restriction' => $venue_restriction,
                'state_hash' => $state_hash,
            );

        }

        public static function handle_debitsuccess_action($extraOptions)
        {
            $html = "";
            if (key_exists('epayment_redirect_resume', $extraOptions) || key_exists('epayment_redirect_success', $extraOptions)) {
                if (key_exists('epayment_redirect_resume', $extraOptions)) {
                    $url = $extraOptions['epayment_redirect_resume'];

                } else {
                    $url = $extraOptions['epayment_redirect_success'];
                }

                $html .= '<script>

                jQuery(function($){
                    setTimeout(function(){
                        $.mobile.loading("show", {
                            text: "Locating your enrolment. Please wait while we redirect you.",
                            textVisible: true,
                            theme: "b",
                            textonly: false
                        });
                    }, 100);

                    setTimeout(function(){
                        var url = "' . $url . '";
                        $.mobile.loading("hide");
                        if(window.location != url && url !== ""){
                            window.location = url;
                        }

                    }, 1000);

                });</script>';

            } elseif (key_exists('epayment_failure', $extraOptions)) {
                $errorMessage
                = '<div>
                    <h3>Could not resume enrolment.</h3>
                    <p>An error has occurred with your payment which prevents resumption of the enrolment process.</p>
                    <p>Please contact our office to resolve the issue.</p>
                </div>';
                $html .= $errorMessage;
            } elseif (key_exists('epayment_running', $extraOptions)) {
                $errorMessage
                = '<div>
                    <h3>Active Payment Request Found.</h3>
                    <p>An active payment request has been flagged for this enrolment.</p>
                    <p>Please complete the open request, or if the request has been closed reload this window to try again.</p>
                    <p>If this issue persists please get in touch with our office to resolve the probelm.</p>
                </div>';
                $html .= $errorMessage;
            }
            return $html;

        }
        /**
         * TODO: // break this up into the following:
         *
         * Process
         *
         * Process ePayment
         *
         * Process Session / contacts
         *
         * Check User login // provide credentials.
         *
         * Process miscelaneous?
         *
         */

        public static function process_enrolment_contacts($enrolmentData)
        {
            $contact_options = array();

            $userContact = null;
            /* Load Contacts */
            if (!empty($enrolmentData['user_contact_id'])) {
                $contact_options['user_contact_id'] = intval($enrolmentData['user_contact_id']);
                $contact_options['contact_id'] = intval($enrolmentData['user_contact_id']);
                $userContact = $contact_options['user_contact_id'];
            }
            /*load in contact_id if it exists in enrolment data*/
            if (!empty($enrolmentData['contact_id'])) {
                $contact_options['contact_id'] = intval($enrolmentData['contact_id']);
                if (empty($userContact)) {
                    $userContact = $contact_options['contact_id'];
                }
            }

            if (key_exists('ax_session', $enrolmentData)) {
                $contact_options['ax_session'] = $enrolmentData['ax_session'];
            } else {
                if (defined('AXIP_SESSION_GENERATION')) {
                    if (true == AXIP_SESSION_GENERATION) {
                        $IP = $_SERVER['REMOTE_ADDR'];

                        $session = AX_Session_Security::setupSession($userContact, $IP);

                        if (is_array($session)) {
                            $enrolment['ax_session'] = $session['session_id'];
                            $contact_options['ax_session'] = $session['session_id'];
                            $enrolmentData['ax_session'] = $session['session_id'];

                            if ($contact_options['contact_id'] !== $userContact) {
                                AX_Session_Security::addAllowedContacts($enrolmentData['ax_session'], array(array(
                                    'CONTACTID' => $extraOptions['contact_id'],
                                )));
                            }
                        }
                    }
                }
            }

            $contactList = AX_Enrolments::getEnrolmentContactList($enrolmentData);
            if (!empty($contactList)) {
                $contact_options['contact_list'] = $contactList;

                if (key_exists('ax_session', $enrolmentData)) {
                    //Make sure the allowed contacts are specified (in case of resuming user);
                    AX_Session_Security::addAllowedContacts($enrolmentData['ax_session'], $contactList);
                }
            }

            return $contact_options;
        }

        public static function process_enrolment_debitsuccess($enrolmentData)
        {
            $ds_options = array();
            $axP = get_query_var('ax_p');
            $ds_options = AX_EPayment_Service::checkStatusAndNextAction($enrolmentData['enrolment_hash'], $axP);
            return $ds_options;
        }

        public static function process_enrolment_payment_flow($enrolmentData)
        {

            $status = get_query_var('ok');
            $ref = get_query_var('ref');

            if ($status === "false" || empty($status)) {
                return array('incomplete' => true);
            }

            $opts = AX_Payment_Flow::checkStatusAndNextAction($enrolmentData['enrolment_hash'], $status, $ref);

            return $opts;
        }

        public static function check_login_status()
        {
            $session = session_id();

            $loginStatus = array(
                'logged_in' => false,
                'logged_in_token' => '',
            );

            if (!empty($session)) {

                if (!empty($_SESSION["AXTOKEN"]) && $_SESSION['EXPIRES'] > time()) {
                    $loginStatus['logged_in'] = true;
                    $loginStatus['logged_in_token'] = $_SESSION['AXTOKEN'];
                    $loginStatus['logged_in_contact'] = $_SESSION['CONTACTID'];
                    $loginStatus['logged_in_role'] = $_SESSION['ROLETYPE'];
                }
            }

            return $loginStatus;
        }

        public function process_enrolment_hash($enrolment_hash = '')
        {
            $extraOptions = array();

            if (!empty($enrolment_hash)) {
                $enrolmentData = AX_Enrolments::getEnrolmentByID($enrolment_hash);

                if (!empty($enrolmentData)) {
                    $contact_options = self::process_enrolment_contacts($enrolmentData);
                    $extraOptions = array_merge($extraOptions, $contact_options);

                    if (key_exists('allow_public_inhouse', $enrolmentData)) {
                        if ($enrolmentData['allow_public_inhouse'] == 'inhouse') {
                            $extraOptions['allow_public_inhouse'] = 'inhouse';
                        }
                    }

                    if (key_exists('ezypay_plan_selected', $enrolmentData)) {
                        $extraOptions['ezypay_plan_selected'] = $enrolmentData['ezypay_plan_selected'];
                    }

                    if (key_exists('item_list', $enrolmentData)) {
                        $extraOptions['item_list'] = $enrolmentData['item_list'];
                    }
                    if (key_exists('payment_flow', $enrolmentData)) {
                        if ($enrolmentData['payment_flow'] == 'flow_begun') {

                            $opts = self::process_enrolment_payment_flow($enrolmentData);

                            if (key_exists('incomplete', $opts)) {
                                $enrolmentData['method'] = 'initial';
                            } else {
                                if (!empty($opts)) {
                                    $extraOptions = array_merge($opts, $extraOptions);
                                }
                            }
                        }
                    }
                    /*If the enrolment has a method key, and thus has passed the initial status update*/
                    if (key_exists('method', $enrolmentData)) {
                        if ($enrolmentData['method'] == 'initial') {
                            $enrolmentData['enrolment_hash'] = $enrolment_hash;

                            //check if there was an error on previous enrolment - for the time being may need to disable enrolment on error,
                            //until invoicing issue resolved
                            if (key_exists('errors', $enrolmentData)) {
                                if ($enrolmentData['errors'] === 'false' || $enrolmentData['errors'] === false) {
                                    if (!empty($enrolmentData['payer_id'])) {
                                        $extraOptions['payer_id'] = intval($enrolmentData['payer_id']);
                                    }
                                    if (!empty($enrolmentData['invoice_id'])) {
                                        $extraOptions['invoice_id'] = intval($enrolmentData['invoice_id']);
                                    }
                                    if (!empty($enrolmentData['enrolments'])) {
                                        $extraOptions['multiple_courses'] = $enrolmentData['enrolments'];
                                        $extraOptions['skip_to_step'] = 'billing';
                                    }
                                    if (!empty($enrolmentData['course'])) {
                                        $extraOptions['course'] = $enrolmentData['course'];
                                    }
                                }
                            }
                        } elseif ($enrolmentData['method'] == 'epayment') {
                            $ds_options = self::process_enrolment_debitsuccess($enrolmentData);
                            $enrolmentData['enrolment_complete'] = true;

                            unset($enrolmentData['enrolments']); //Don't really need to do this but will anyway.
                            if (!empty($ds_options)) {
                                $extraOptions = array_merge($ds_options, $extraOptions);
                            }
                        }
                    } elseif (key_exists('enrolments', $enrolmentData)) {
                        /*Multiple Enrolment Data Exists, this data set would have been created from a Group Booking Step*/
                        if (!empty($enrolmentData['payer_id'])) {
                            $extraOptions['payer_id'] = intval($enrolmentData['payer_id']);
                        }
                        $extraOptions['multiple_courses'] = $enrolmentData['enrolments'];
                        $extraOptions['skip_to_step'] = 'groupBooking';
                        if (!empty($enrolmentData['course'])) {
                            $extraOptions['course'] = $enrolmentData['course'];
                        }
                    } else {
                        /*if the enrolment has not yet reached the "method" stage - and thus may only have a course and contact data, no enrolments*/
                        if (!empty($enrolmentData['payer_id'])) {
                            $extraOptions['payer_id'] = intval($enrolmentData['payer_id']);
                        }
                        if (!empty($enrolmentData['course'])) {
                            $extraOptions['course'] = $enrolmentData['course'];
                        }
                        $extraOptions['skip_to_step'] = 'review';
                    }

                    if (!empty($enrolmentData['config_id'])) {
                        if (empty($enrolmentData['enrolment_complete'])) {
                            $extraOptions['config_id'] = $enrolmentData['config_id'];
                        }
                    }
                }

                $extraOptions['enrolment_hash'] = $enrolment_hash;
            }

            return $extraOptions;
        }

        public static function preload_lists()
        {
            $AxcelerateAPI = new AxcelerateAPI();
            $countryList = array();

            $storedCL = get_transient('ax_country_list');
            if ($storedCL === false) {
                $countryCall = $AxcelerateAPI->callResource(array('fieldReference' => "contactsaggregates.countryofcitizencode"), '/report/field', 'GET');
                if (!empty($countryCall) && is_object($countryCall)) {
                    if (isset($countryCall->VALUEOPTIONS)) {
                        $countryList = $countryCall->VALUEOPTIONS;
                        set_transient('ax_country_list', $countryList, 2 * DAY_IN_SECONDS);
                    }
                }
            } else {
                $countryList = $storedCL;
            }

            $languageList = array();
            $storedLL = get_transient('ax_language_list');
            if ($storedLL === false) {
                $langCall = $AxcelerateAPI->callResource(array('fieldReference' => "contactsaggregates.mainlanguagecode"), '/report/field', 'GET');
                if (!empty($langCall) && is_object($langCall)) {
                    if (isset($langCall->VALUEOPTIONS)) {
                        $languageList = $langCall->VALUEOPTIONS;
                        set_transient('ax_language_list', $languageList, 2 * DAY_IN_SECONDS );
                    }
                }
            } else {
                $languageList = $storedLL;
            }
            return array('country' => $countryList, 'language' => $languageList);
        }

        /**
         * TODO:
         * break this up /rename
         *
         * processing URL / Request
         *
         * Process Short Code Attr?
         *
         * Check Cart
         *
         * EPayment Render
         *
         * extract JS to separate script?
         *
         */

        /**
         *
         * @param array $atts
         */
        public static function axcelerate_enrolment_widget_scripts()
        {
            $VERSION = constant('AXIP_PLUGIN_VERSION');
            if ($VERSION === null) {
                $VERSION = time();
            }

            wp_dequeue_script('dataTables');
            wp_deregister_script('dataTables');
            wp_dequeue_style('dataTables');
            wp_deregister_style('dataTables');
            wp_dequeue_script('chosen');
            wp_dequeue_style('chosen');
            wp_deregister_script('chosen');
            wp_deregister_style('chosen');
            wp_dequeue_script('jquery-ui-datepicker');
            wp_deregister_script('jquery-ui-datepicker');
            wp_dequeue_style('jquery-ui-datepicker');
            wp_deregister_style('jquery-ui-datepicker');

            wp_register_script('dataTables', plugins_url('/enrollerWidget/DataTables/datatables.js', AXIP_PLUGIN_NAME), array(
                'jquery',
            ), $VERSION);
            wp_enqueue_script('dataTables');
            wp_register_style('dataTables', plugins_url('/enrollerWidget/DataTables/datatables.css', AXIP_PLUGIN_NAME), array(), $VERSION);
            wp_enqueue_style('dataTables');

            wp_register_script('chosen', plugins_url('/enrollerWidget/chosen/chosen.jquery.js', AXIP_PLUGIN_NAME), array(
                'jquery',
            ), $VERSION);
            wp_enqueue_script('chosen');
            wp_register_style('chosen', plugins_url('/enrollerWidget/chosen/chosen.css', AXIP_PLUGIN_NAME), array(
                'dataTables',
            ), $VERSION);
            wp_enqueue_style('chosen');

            /**** WP-184 ****/
            $wpVer = get_bloginfo('version');

            if (version_compare($wpVer, '4.2') >= 0) {
                wp_register_script('flashcanvas', plugins_url('/enrollerWidget/jsignature/flashcanvas.js', AXIP_PLUGIN_NAME), array('jquery'), $VERSION);
                wp_enqueue_script('flashcanvas');
                wp_script_add_data('flashcanvas', 'conditional', 'lt IE 9');
            }

            wp_register_script('jsignature', plugins_url('/enrollerWidget/jsignature/jSignature.min.noconflict.js', AXIP_PLUGIN_NAME), array('jquery'), $VERSION);
            wp_enqueue_script('jsignature');

            /**** END WP-184 ****/

            wp_register_script('pre_init', plugins_url('/enrollerWidget/pre_init.js', AXIP_PLUGIN_NAME), array(
                'jquery',
            ), $VERSION);
            wp_enqueue_script('pre_init');

            wp_register_style('jquery-ui-datepicker', plugins_url('/enrollerWidget/jqmDatepicker/jquery.mobile.datepicker.css', AXIP_PLUGIN_NAME), array(
                'chosen',
            ), $VERSION);
            wp_enqueue_style('jquery-ui-datepicker');

            wp_register_script('jquery-ui-datepicker', plugins_url('/enrollerWidget/jqmDatepicker/jquery.ui.datepicker.js', AXIP_PLUGIN_NAME), array(
                'jquery',
                'pre_init',
            ), $VERSION);
            wp_enqueue_script('jquery-ui-datepicker');

            wp_deregister_script('jquery.mobile');
            wp_register_script('jquery.mobile', plugins_url('/enrollerWidget/jquery.mobile-1.4.5/jquery.mobile-1.4.5.js', AXIP_PLUGIN_NAME), array(
                'jquery',
                'pre_init',
            ), $VERSION);
            wp_enqueue_script('jquery.mobile');

            wp_register_script('jquery.mobile.datepicker', plugins_url('/enrollerWidget/jqmDatepicker/jquery.mobile.datepicker.js', AXIP_PLUGIN_NAME), array(
                'jquery',
                'jquery.mobile',
            ), $VERSION);
            wp_enqueue_script('jquery.mobile.datepicker');

            wp_register_style('jqm', plugins_url('/enrollerWidget/jquery.mobile-1.4.5/jquery.mobile-1.4.5.css', AXIP_PLUGIN_NAME), array(), $VERSION);
            wp_enqueue_style('jqm');

            wp_register_style('ew_base', plugins_url('/enrollerWidget/widget/css/wp_enroller_compat.css', AXIP_PLUGIN_NAME), array(), $VERSION);
            wp_enqueue_style('ew_base');

            wp_register_script('enroller-api', plugins_url('/enrollerWidget/widget/enroller-api-functions.js', AXIP_PLUGIN_NAME), array(
                'jquery',
            ), $VERSION);
            wp_enqueue_script('enroller-api');

            $ax_google_maps_api_key = get_option('ax_google_maps_api_key', "");

            if (!empty($ax_google_maps_api_key)) {
                wp_register_script('google-maps', 'https://maps.googleapis.com/maps/api/js?key=' . $ax_google_maps_api_key . '&libraries=places', array(), $VERSION);
                wp_enqueue_script('google-maps');
                wp_register_script('render-address', plugins_url('/enrollerWidget/widget/render-address.js', AXIP_PLUGIN_NAME), array(
                    'jquery', 'jquery.mobile',
                ), $VERSION);
                wp_enqueue_script('render-address');
            }

            wp_register_script('enroller-defaults', plugins_url('/enrollerWidget/widget/enroller-defaults.js', AXIP_PLUGIN_NAME), array(
                'jquery',
            ), $VERSION);
            wp_enqueue_script('enroller-defaults');

            wp_register_script('render-invoice', plugins_url('/enrollerWidget/widget/render-invoice.js', AXIP_PLUGIN_NAME), array(
                'jquery', 'jquery.mobile',
            ), $VERSION);
            wp_enqueue_script('render-invoice');

            wp_register_script('enrol-base', plugins_url('/enrollerWidget/widget/enrol-widget-base.js', AXIP_PLUGIN_NAME), array(
                'jquery',
                'enroller-defaults',
                'pre_init',
                'jquery.mobile',
            ), $VERSION);
            wp_enqueue_script('enrol-base');
            wp_register_script('enroller-widget', plugins_url('/enrollerWidget/widget/enroller-widget.js', AXIP_PLUGIN_NAME), array(
                'jquery',
                'enroller-defaults',
                'pre_init',
                'jquery.mobile',
                'enrol-base',
            ), $VERSION);
            wp_enqueue_script('enroller-widget');
            /*
             * wp_register_style ( 'enroller', plugins_url ( '/enrollerWidget/widget/enroller.css', AXIP_PLUGIN_NAME ), array('chosen', 'dataTables', 'jqm'), $VERSION );
             * wp_enqueue_style ( 'enroller' );
             */
            wp_register_script('after_init', plugins_url('/enrollerWidget/after_init.js', AXIP_PLUGIN_NAME), array(
                'jquery',
                'enroller-defaults',
                'pre_init',
                'jquery.mobile',
                'enroller-widget',
            ), $VERSION);
            wp_enqueue_script('after_init');

        }
        public static function parse_course_url_params($request, $index)
        {
            $response = array();
            if (!empty($request['course_id_' . $index])) {
                $courseID = $request['course_id_' . $index];
                $instanceID = $request['instance_id_' . $index];
                $courseType = $request['course_type_' . $index];
                if (!empty($courseID) && !empty($instanceID) && !empty($courseType)) {
                    $response[$instanceID . "_" . $courseType] = array(
                        'course_id' => $courseID,
                        'instance_id' => $instanceID,
                        'course_type' => $courseType,
                    );
                }

            }

            if (!empty($request['course_id_' . ($index + 1)])) {
                return array_merge($response, self::parse_course_url_params($request, $index + 1));
            } else {
                return $response;

            }
        }
        public static function ax_localise_css()
        {
            $default_stylesheet = plugins_url('/css/ax-standard.css', AXIP_PLUGIN_NAME);
            wp_register_style('ax-standard', $default_stylesheet, array());
            wp_enqueue_style('ax-standard');
            $colors = get_option('ax_enrol_w_colours');

            $ax_pc = '';
            $ax_pcb = '';
            $ax_pct = '';
            $ax_hc = '';
            $ax_hcb = '';
            $ax_hct = '';

            $ax_tf_hc = '';
            $ax_tf_hcb = '';
            $ax_tf_hct = '';

            if (!empty($colors)) {
                extract($colors);
            }

            $css = "div.enroller-widget a.ui-btn-active.ui-btn,
			div.enroller-widget div.ui-btn-active.ui-btn,
			div.enroller-widget button.ui-btn-active.ui-btn,
			div.enroller-widget li.ui-btn-active.ui-btn,
			div.enroller-widget-popup li.ui-btn-active.ui-btn,
			div.enroller-widget-popup div.enroller-field-holder .enroller-save-button{";
            if (!empty($ax_pc)) {
                $css = $css . "background-color: $ax_pc ;";
            }
            if (!empty($ax_pcb)) {
                $css = $css . "border-color: $ax_pcb ;";
                $css = $css . "border-right-color: $ax_pcb ;";
            }
            if (!empty($ax_pct)) {
                $css = $css . "color: $ax_pct ;";
            }

            $css = $css . "}";
            if (!empty($ax_pcb)) {
                $css = $css . "div.enroller-widget div.enroller-step-menu .ui-btn.ui-btn-active{border-left-color: $ax_pcb;}";
            }

            $css = $css . "div.enroller-widget div.enroller-field-label.enroller-field-selected,
					div.enroller-widget div.enroller-field-label.enroller-field-selected span,
				div.enroller-widget-popup div.enroller-field-label.enroller-field-selected,
				div.enroller-widget div.enroller-widget-popup div.enroller-field-label.enroller-field-selected,
				div.enroller-widget .enroller-field-holder.ui-mini .chosen-choices:hover:not(:focus):not(.no-hover),
				div.enroller-widget a.ui-btn:hover:not(:focus):not(.no-hover),
				div.enroller-widget li.ui-btn:hover:not(:focus):not(.no-hover),
				div.enroller-widget label.ui-btn:hover:not(:focus):not(.no-hover),
				div.enroller-widget a.ui-btn-active.ui-btn:hover:not(:focus):not(.no-hover),
				div.enroller-widget button.ui-btn:hover:not(:focus):not(.no-hover),
				div.enroller-widget .dataTables_wrapper .dataTables_paginate .paginate_button:hover:not(:focus):not(.no-hover),
				div.enroller-widget .dataTables_wrapper .dataTables_paginate .paginate_button.current:hover:not(:focus):not(.no-hover),
				div.enroller-widget table.dataTable th:hover:not(:focus):not(.no-hover),
				div.enroller-widget .chosen-container .chosen-results li.highlighted,
				div.ui-datepicker .chosen-container .chosen-results li.highlighted,
				div.ui-datepicker table.ui-datepicker-calendar td:hover,
				div.ui-datepicker table.ui-datepicker-calendar td:hover a,
				div.enroller-widget-popup div.enroller-field-holder .enroller-save-button:hover{";

            if (!empty($ax_hc)) {
                $css = $css . "background-color: $ax_hc ;";
            }
            if (!empty($ax_hcb)) {
                $css = $css . "border-color: $ax_hcb ;";
            }
            if (!empty($ax_hct)) {
                $css = $css . "color: $ax_hct ;";
            }
            $css = $css . "}";

            $css = $css . " div.enroller-widget .ui-btn.ui-input-text:hover:not(:focus):not(.no-hover),
				.enroller-field-holder .controlgroup-textinput:hover:not(:focus):not(.no-hover),
				div.enroller-widget div.ui-btn:not(.enroller-field-label):hover:not(:focus):not(.no-hover),
				div.enroller-widget a.ui-btn.chosen-single:hover:not(:focus):not(.no-hover),
				div.enroller-widget div.enroller-text-field:hover:not(:focus):not(.no-hover),
				div.enroller-widget .ui-input-text:hover:not(:focus):not(.no-hover),
				div.enroller-widget .enroller-field-holder .controlgroup-textinput:hover:not(:focus):not(.no-hover){";

            if (!empty($ax_tf_hc)) {
                $css = $css . "background-color: $ax_tf_hc ;";
            }
            if (!empty($ax_tf_hcb)) {
                $css = $css . "border-color: $ax_tf_hcb ;";
            }
            if (!empty($ax_tf_hct)) {
                $css = $css . "color: $ax_tf_hct ;";
            }

            $css = $css . "}";

            $css = $css . "div.enroller-widget div.enroller-step-menu .ui-btn.ui-disabled{";
            if (!empty($ax_smd)) {
                $css = $css . "background-color: $ax_smd ;";
            }
            if (!empty($ax_smdb)) {
                $css = $css . "border-color: $ax_smdb ;";
            }
            if (!empty($ax_smdt)) {
                $css = $css . "color: $ax_smdt ;";
            }
            $css = $css . "}";

            $css = $css . "div.enroller-widget{";
            if (!empty($ax_ew)) {
                $css = $css . "background-color: $ax_ew ;";
            }
            if (!empty($ax_ewb)) {
                $css = $css . "border-color: $ax_ewb ;";
            }
            $css = $css . "}";

            $css = $css . "div.enroller-widget div.enroller-step-menu a.enroller-menu-link:hover:not(:focus):not(.no-hover){";
            if (!empty($ax_smh)) {
                $css = $css . "background-color: $ax_smh ;";
            }
            if (!empty($ax_smhb)) {
                $css = $css . "border-color: $ax_smhb ;";
            }
            if (!empty($ax_smht)) {
                $css = $css . "color: $ax_smht ;";
            }
            $css = $css . "}";

            wp_add_inline_style('ax-standard', $css);
        }
    }

    $AX_Enrol_Widget_Shortcode = new AX_Enrol_Widget_Shortcode();
    if (class_exists('WPBakeryShortCode') && class_exists('AX_VC_PARAMS') && class_exists('WPBakeryShortCodesContainer')) {
        vc_map(array(
            "name" => __("aX Enrolment Widget", "axcelerate"),
            "base" => "ax_enrol_widget",
            "icon" => plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
            "content_element" => true,
            "description" => __("Enrolment Widget - Use for Enrol / Enquire", "axcelerate"),
            "show_settings_on_create" => true,
            "is_container" => false,
            "as_parent" => array('only' => ''),

            "category" => array(
                'aX Course Detail',
                'Content',
            ),
            'params' => array(
                AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
                AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
                AX_VC_PARAMS::$AX_VC_INSTANCEID,
                AX_VC_PARAMS::$AX_VC_CONFIG_ID,
                AX_VC_PARAMS::$AX_VC_LOCATION_RESTRICTION_PARAM,
                AX_VC_PARAMS::$AX_VC_DL_LOCATION_RESTRICTION_PARAM,
                AX_VC_PARAMS::$AX_VC_VENUE_RESTRICTION_PARAM,

                AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
                AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,

            ),
        ));
        class WPBakeryShortCode_aX_Enrol_Widget extends WPBakeryShortCode
        {
        }

    }

    function identifyEnrolmentConfig($course_id, $course_type)
    {
        $configMapping = get_option('ax_course_config_mapping_settings');
        if (!empty($configMapping)) {
            $data = json_decode($configMapping, true, 10);
            $id = $course_id . "_" . $course_type;

            if (!empty($data[$id])) {
                return $data[$id]["CONFIG_ID"];
            }
        }
        return null;
    }
}
