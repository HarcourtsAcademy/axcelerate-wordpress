<?php

if (!defined('ABSPATH')) {
    exit;
}

class AX_Test_Debitsuccess
{
    public function __construct()
    {
        // we aren't self registering ajax. That's being done from the features file.
    }

    public static function register_ajax_actions()
    {

        // This function is not public - so don't add a public action.
        add_action('wp_ajax_ax_run_ds_tests', 'AX_Test_Debitsuccess::ajax_run_ds_tests');

    }

    public static function ajax_run_ds_tests()
    {

        $noncePass = false;

        if (isset($_POST['setting_nonce'])) {
            if (wp_verify_nonce($_POST['setting_nonce'], 'ax_settings')) {
                $noncePass = true;
            }
        }
        $Response = array(
            'ax_ds_flag_test' => array('status' => false, 'message' => ""),
            'ax_ds_terms_test' => array('status' => false, 'message' => ""),
            'ax_ds_credential_test' => array('status' => false, 'message' => "Credentials are not valid/set."),
        );
        if ($noncePass) {

            $flagCheck = self::run_test_ax_settings_check();
            if ($flagCheck) {
                $Response['ax_ds_flag_test'] = array('status' => true, 'message' => "");
            }

            $credentialCheck = self::run_test_ds_credential_check();
            if ($credentialCheck) {
                $Response['ax_ds_credential_test'] = array('status' => true, 'message' => "");
            }

            $termsCheck = self::run_test_ax_terms_check();
            if ($termsCheck) {
                $Response['ax_ds_terms_test'] = array('status' => true, 'message' => "");
            }

            $configs = self::get_all_configs();

            $configChecks = self::run_test_config_check($configs);
            $Response = array_merge($Response, $configChecks);
            $redirectChecks = self::run_test_redirect_check($configs);
            $Response = array_merge($Response, $redirectChecks);

            $resumption = self::run_test_wp_settings_check();
            $Response = array_merge($Response, $resumption);

            echo json_encode($Response);
            die();

        }
    }

    public static function run_test_resumption_check()
    {
        $settings = array(
            'ax_resumption_setting_test' => array('status' => 'warning', 'message' => "No resumption setting enabled."),
            'ax_resumption_template_test' => array('status' => false, 'message' => ""),
        );

        // Resumption setting.
        $resumption = $optVal = get_option('ax_enrol_notifications_active');

        if (!empty($resumption)) {
            // Not strictly needed.
            $settings['ax_resumption_setting_test'] = array('status' => true, 'message' => "");
        }

        $opt = get_option('ax_enrol_resumption_template_id');

        if (!empty($opt)) {
            $AxApi = new AxcelerateAPI();
            $contacts = $AxApi->callResource(array('displayLength' => 1), 'contacts', 'GET');
            if (is_array($contacts)) {
                if (isset($contacts[0]->CONTACTID)) {
                    $templateContent = $AxApi->callResource(array('planID' => $opt, 'contactID' => $contacts[0]->CONTACTID), 'template', 'GET');

                    if (is_object($templateContent)) {
                        if (isset($templateContent->error)) {
                            $settings['ax_resumption_template_test'] = array('status' => false, 'message' => "Error Retrieving Template");
                        }
                    } else {
                        $content = $templateContent[0]->CONTENT;
                        if (strpos($content, '[Online Enrolment Link]') !== false) {
                            $settings['ax_resumption_template_test'] = array('status' => true, 'message' => "");
                        } else {
                            $settings['ax_resumption_template_test'] = array('status' => false, 'message' => "Template missing [Online Enrolment Link].");
                        }

                    }

                }
            }

        } else {
            $settings['ax_resumption_template_test'] = array('status' => 'warning', 'message' => "No template set. Templates Recommended");
        }

        return $settings;

    }
    public static function run_test_wp_settings_check()
    {

        $settings = self::run_test_resumption_check();

        return $settings;
    }

    public static function run_test_ax_settings_check()
    {

        $checkForFlag = self::checkForFlags(array('debitsuccess'));

        $checkForFlag[0] = (array) $checkForFlag[0];
        if ($checkForFlag[0]['OPTIONVALUE']) {
            return true;
        }

        return false;
    }

    public static function run_test_ds_credential_check()
    {
        $AxApi = new AxcelerateAPI();
        $dsCredentials = $AxApi->callResource(array(), 'accounting/external/debit_success/checkcredentials', 'GET');
  
        return $dsCredentials;
    }

    public static function run_test_ax_terms_check()
    {
        $AxApi = new AxcelerateAPI();

        $terms = $AxApi->callResource(array('amount' => 1), 'accounting/external/debit_success/term/search', 'GET');

        $hasTerms = false;

        if (is_object($terms)) {
            if (isset($terms->TERM)) {
                if (is_array($terms->TERM)) {
                    foreach ($terms->TERM as $term) {
                        $hasTerms = true;
                        break;
                    }
                }
            }
        }

        return $hasTerms;

    }

    public static function get_all_configs()
    {
        $enrollerWidgetSettings = get_option('ax_enroller_widget_settings');
        $mapping_settings = get_option('ax_config_comp_mapping_settings');
        $mapped = json_decode($mapping_settings, true, 10);
        $redirectPostID = get_option('ax_enrol_event_redirect_url');
        $configArray = array();
        $url = "";
        if (isset($redirectPostID)) {
            $url = esc_url(get_permalink($redirectPostID));
        }

        if (!empty($enrollerWidgetSettings)) {
            $data = json_decode($enrollerWidgetSettings, true, 10);

            foreach ($data as $key => $value) {
                $tempArray = array(
                    'ID' => $key,
                    'CONFIG_ID' => $key,
                    'MAP_LINK' => $url,
                    'MAP_PAGE_ID' => $redirectPostID,
                    'CONFIG' => $value,
                );
                if (!empty($value['config_name'])) {
                    $tempArray['CONFIG_NAME'] = $value['config_name'];
                } else {
                    $tempArray['CONFIG_NAME'] = "Config_ID: " . $key;
                }
                $hasRedirectURL = false;
                if (isset($mapped[$tempArray['CONFIG_ID']])) {
                    $config = $mapped[$tempArray['CONFIG_ID']];
                    if (!empty($config)) {
                        $url = esc_url(get_permalink($config["PAGE_ID"]));
                        $tempArray['MAP_LINK'] = $url;
                        $tempArray['MAP_PAGE_ID'] = $config["PAGE_ID"];
                        $hasRedirectURL = true;
                    }
                }

                array_push($configArray, $tempArray);

            }
        }

        return $configArray;
    }
    public static function run_test_config_check($configs)
    {
        $configResponses = array();
        foreach ($configs as $config) {
            $configResponses['ax_ds_config_test_' . $config['CONFIG_ID']] = 'pending';
            $hasBilling = false;
            $hasDS = false;
            if (isset($config['CONFIG'])) {
                $fullConfig = $config['CONFIG'];
                if (key_exists('enroller_steps', $fullConfig)) {
                    $steps = $fullConfig['enroller_steps'];
                    if (isset($steps['billing'])) {
                        $hasBilling = true;
                        if (isset($steps['billing']['paymentMethods'])) {
                            if (isset($steps['billing']['paymentMethods']['VALUES'])) {
                                $paymentMethods = $steps['billing']['paymentMethods']['VALUES'];

                                foreach ($paymentMethods as $key => $method) {

                                    if ('epayment' === $method['VALUE']) {

                                        $hasDS = true;
                                    }
                                }
                            }
                        }

                    }
                }

            }
            if ($hasBilling && $hasDS) {
                $status = array('status' => 'success', 'message' => "");
            } elseif ($hasBilling && !$hasDS) {
                $status = array('status' => 'error', 'message' => "Billing step present, but DS is not enabled.");

            } else {
                $status = array('status' => 'warning', 'message' => "No Billing Step - not valid for enrolment.");

            }
            $configResponses['ax_ds_config_test_' . $config['CONFIG_ID']] = $status;
        }

        return $configResponses;
    }

    public static function check_post_enrol_event($postID)
    {
        $post = get_post($postID);
        if (is_object($post)) {
            $content = $post->post_content;
            if (strpos($content, 'ax_enrol_event') !== false) {
                return array('status' => 'success', 'message' => "");
            } else {
                return array('status' => 'error', 'message' => "No [ax_enrol_event] shortcode. Enrolments will not be confirmed");

            }
        } else {
            return array('status' => 'error', 'message' => "Page set is invalid, or no longer exists.");

        }

    }
    public static function run_test_redirect_check($configs)
    {
        $redirectChecks = array();
        $redirectPostID = get_option('ax_enrol_event_redirect_url');
        $url = '';

        if (!empty($redirectPostID)) {
            $redirectChecks['ax_ds_landing_test_default'] = self::check_post_enrol_event($redirectPostID);

        } else {
            $redirectChecks['ax_ds_landing_test_default'] = array('status' => 'error', 'message' => "No Default Page Set.");
        }

        foreach ($configs as $config) {
            if (!empty($config['MAP_PAGE_ID'])) {
                $redirectChecks['ax_ds_landing_test_' . $config['CONFIG_ID']] = self::check_post_enrol_event($config['MAP_PAGE_ID']);
            } else {
                $redirectChecks['ax_ds_landing_test_' . $config['CONFIG_ID']] = array('status' => 'warning', 'message' => "No Redirect Page Set.");
            }
        }
        return $redirectChecks;

    }

    public static function checkForFlags($flagsArray = array())
    {
        $settings = (array) get_option('axip_general_settings');
        /*confirm tokens exist*/
        if (!empty($settings['api_token']) && !empty($settings['webservice_token'])) {
            $AxApi = new AxcelerateAPI();
            $narrowedFlags = array();
            $flags = $AxApi->callResource(array(), 'flags', 'GET');

            if ($flags) {
                foreach ($flags as $flagrow) {
                    if (self::checkFlag($flagrow, $flagsArray)) {
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

    private static function checkFlag($flag, $flagsToCheckFor)
    {
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
