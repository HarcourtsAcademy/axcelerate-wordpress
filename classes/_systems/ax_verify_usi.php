<?php
defined('ABSPATH') or die();

if (!class_exists('AX_Verify_USI')) {
    class AX_Verify_USI
    {
        public function __construct()
        {
            add_action('init', 'AX_Verify_USI::register_ajax_actions');
        }

        public static function verify_usi($contactID)
        {
            $AxcelerateAPI = new AxcelerateAPI();

            if (!empty($contactID)) {
                $Request = $AxcelerateAPI->callResource(array(), '/contact/verifyUSI/' . $contactID, "POST");

                if (is_object($Request)) {
                    $response = (array) $Request;

                    if (key_exists('USI_VERIFIED', $response)) {
                        if (!empty($response['USI_VERIFIED'])) {
                            return array('success' => true, "verified" => true);
                        } else {
                            $response['DATA'] = (array)  $response['DATA'];
                            if(key_exists('usiStatus', $response['DATA'])){
                                if("Valid" !== $response['DATA']['usiStatus']){
                                    return array('success' => true, "verified" => false, 'message' => 'USI Verification Failed. The USI is invalid.');
                                }
                            }
                            return array('success' => true, "verified" => false, 'message' => 'Details cannot be confirmed, please ensure that all details match the information that was recorded when generating your USI.');
                        }
                    }
                }
            }

            return array("success" => false, "error" => true, "message"=>"An unexpected error occurred. Please check your details are correct.");
        }

        public static function ajax_verify_usi()
        {
            if (defined('AXIP_NONCE_GENERATION')) {
                if (true == AXIP_NONCE_GENERATION) {
                    check_ajax_referer(
                        'ax_enroller',
                        'security'
                    );
                }
            }
            // don't need the contact session checks, as no identifying info is returned.
            $contactID;
            if (isset($_REQUEST['contact_id'])) {
                $contactID = $_REQUEST['contact_id'];
            }
            if (isset($contactID)) {
                $response = self::verify_usi($contactID);

                echo json_encode($response);
                die();
            }
            die();
        }

        public static function register_ajax_actions()
        {
            add_action('wp_ajax_ax_verify_usi', 'AX_Verify_USI::ajax_verify_usi');
            add_action('wp_ajax_nopriv_ax_verify_usi', 'AX_Verify_USI::ajax_verify_usi');
        }

    }

    $AX_Validate_USI = new AX_Verify_USI();
}
