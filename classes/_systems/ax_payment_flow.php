<?php

defined('ABSPATH') or die();

class AX_Payment_Flow
{

    public function __construct()
    {
        self::register_ajax_actions();
    }

    public static function register_ajax_actions()
    {
        add_action('wp_ajax_ax_payment_flow_form', 'AX_Payment_Flow::ajax_payment_flow_form');
        add_action('wp_ajax_nopriv_ax_payment_flow_form', 'AX_Payment_Flow::ajax_payment_flow_form');
        add_action('wp_ajax_ax_payment_flow_begin', 'AX_Payment_Flow::ajax_payment_flow_begin');
        add_action('wp_ajax_nopriv_ax_payment_flow_begin', 'AX_Payment_Flow::ajax_payment_flow_begin');

        add_action('wp_ajax_ax_select_plan', 'AX_Payment_Flow::ajax_select_plan');
        add_action('wp_ajax_nopriv_ax_select_plan', 'AX_Payment_Flow::ajax_select_plan');

    }

    public static function ajax_payment_flow_form()
    {
        $invoiceGUID = $_REQUEST['invoice_guid'];
        $enrolment_hash = $_REQUEST['enrolment_hash'];

        $redirectPostID = get_option('ax_enrol_event_redirect_url');
        $url = '';

        $provider = $_REQUEST['provider'];
        if (!empty($redirectPostID)) {
            $url = esc_url(get_permalink($redirectPostID));
        }

        $enrolmentData = AX_Enrolments::getEnrolmentByID($enrolment_hash);
        $enrolmentData['payment_flow'] = 'form_requested';

        $enrolmentData['payment_flow_data'] = array();
        $enrolmentData['payment_flow_data']['enrol_url'] = $_REQUEST['redirect_url'] . '?enrolment=' . $enrolment_hash;
        $enrolmentData['payment_flow_data']['isEZ'] = $provider === 'ezypay';
        // $enrolmentData['method'] = 'payment_flow';

        // not using method as it does not happen before the method executes.

        // need to "flag" the enrolment as having started this process

        $AxcelerateAPI = new AxcelerateAPI();

        $params = array(
            "reference" => $enrolment_hash,
            "invoiceGUID" => $invoiceGUID,
            "redirectURL" => $_REQUEST['redirect_url'] . '?enrolment=' . $enrolment_hash,
        );

        if (!empty($url)) {
            $params['redirectURL'] = $url . '?enrolment=' . $enrolment_hash;
        }
        $enrolmentData['payment_flow_data']['passthrough'] = $params['redirectURL'];

        AX_Enrolments::updateEnrolmentWithoutRefresh($enrolment_hash, $enrolmentData);
        $Response = $AxcelerateAPI->callResource($params, '/accounting/ecommerce/payment/form/' . $provider, 'GET');

        echo json_encode($Response);
        die();

    }

    public static function ajax_payment_flow_begin()
    {

        $enrolment_hash = $_REQUEST['enrolment_hash'];

        $enrolmentData = AX_Enrolments::getEnrolmentByID($enrolment_hash);
        if (!empty($enrolmentData)) {
            $enrolmentData['payment_flow'] = 'flow_begun';
            $enrolmentData['method'] = 'payment_flow';

            if (!empty($_REQUEST['tentative_confirm'])) {
                $enrolmentData['tentative_confirm'] = $_REQUEST['tentative_confirm'] === 'tentative';
            }
            $log = array(
                'enrolment_hash' => $enrolment_hash,
                'tentative' => $_REQUEST['tentative_confirm'] === 'tentative',
            );
            error_log(print_r($log, true));
            AX_Enrolments::updateEnrolmentWithoutRefresh($enrolment_hash, $enrolmentData);

        }
        echo json_encode(array('complete' => true));
        die();

    }

    public static function ajax_select_plan()
    {
        $AxcelerateAPI = new AxcelerateAPI();

        $planID = $_REQUEST['payment_plan_id'];
        $reference = $_REQUEST['reference'];
        $invoiceGUID = $_REQUEST['invoice_guid'];

        $callbackURL = $_REQUEST['callback'];

        $enrolmentData = AX_Enrolments::getEnrolmentByID($reference);

        $enrolmentData['ezypay_plan_selected'] = $planID;
        AX_Enrolments::updateEnrolmentWithoutRefresh($reference, $enrolmentData);
        $redirectPostID = get_option('ax_enrol_event_redirect_url');
        $url = '';

        if (!empty($redirectPostID)) {
            $url = esc_url(get_permalink($redirectPostID));
        }

        $ePayParams = array(
            'termID' => $planID,
            'reference' => $reference,
            'invoiceGUID' => $invoiceGUID,
            'callback' => $callbackURL,
        );

        if (!empty($url)) {
            $ePayParams['callback'] = $url . '?enrolment=' . $reference;
        }

        $epayResponse = $AxcelerateAPI->callResource($ePayParams, '/accounting/ecommerce/ezypay/paymentrecord', 'POST');

        echo json_encode(array('response' => $epayResponse));
        die();
    }

    public static function confirmEnrolment($enrolment_hash)
    {
        $enrolmentData = AX_Enrolments::getEnrolmentByID($enrolment_hash);

        if (!empty($enrolmentData)) {
            $confirm = AX_Enrolments::confirmEnrolment($enrolmentHash);
            if (!empty($confirm)) {
                return array("success" => true);

            }

        } else {
            return array("error" => true, "error_type" => 'missing_enrolment');
        }

    }

    public static function checkStatusEzyPay($enrolment_hash)
    {
        $AxcelerateAPI = new AxcelerateAPI();
        $enrolmentStatus = $AxcelerateAPI->callResource(array(), '/accounting/ecommerce/ezypay/ref/' . $enrolment_hash, 'GET');
        if (!empty($enrolmentStatus)) {

            if ($enrolmentStatus instanceof stdClass) {
                if (!empty($enrolmentStatus->STATUS)) {
                    return $enrolmentStatus;
                }
            }
        } else {
            return array('error' => $enrolmentStatus);
        }
        return $enrolmentStatus;
    }

    public static function checkStatus($enrolment_hash)
    {
        $AxcelerateAPI = new AxcelerateAPI();
        $Response = $AxcelerateAPI->callResource(array(), '/accounting/ecommerce/payment/ref/' . $enrolment_hash, 'GET');

        return $Response;

    }
    public static function checkStatusAndConfirm($enrolment_hash, $status)
    {
        $successful = false;
        $enrolmentData = AX_Enrolments::getEnrolmentByID($enrolment_hash);
        if (!empty($enrolmentData['payment_flow_data']['isEZ'])) {

            $statusObj = self::checkStatusEzyPay($enrolment_hash);

            if (!empty($statusObj->STATUS)) {
                if ($statusObj->STATUS === "CHARGED") {

                    $successful = true;
                }
            }
        } else {
            $statusObj = self::checkStatus($enrolment_hash);
        }

        if (!empty($enrolmentData)) {
            if ($successful || !empty($statusObj->RESULT->OK)) {
                $confirm = AX_Enrolments::confirmEnrolment($enrolment_hash);

                if (!empty($confirm)) {
                    $enrolmentData['confirmed_enrolments'] = $confirm;
                    $response['success'] = true;
                    //TODO: add success messsageees!
                }

                return array('success' => true, 'message' => 'Enrolment Found');
            } else {
                return array(
                    'success' => false,
                    'status' => 'epayment_redirect_resume',
                    'message' => 'Incomplete Enrolment Found: ',
                    'error_content' => $statusObj->RESULT->ERROR->MSG,
                    'redirect_url' => $enrolmentData['payment_flow_data']['enrol_url'],
                );
            }
        }
        return array(
            'success' => false,
        );
    }

    public static function checkStatusAndNextAction($enrolment_hash, $status, $ref)
    {
        $enrolmentData = AX_Enrolments::getEnrolmentByID($enrolment_hash);

        if (!empty($enrolmentData)) {
            if (empty($status)) {
                return array("error" => true, "error_type" => 'missing_status');
            } else if ($status === "false") {
                return array("error" => true, "error_type" => 'failed');
            } else {
                $callbackURL = $enrolmentData['payment_flow_data']['passthrough'];
                return array('epayment_redirect_success' => $callbackURL);

            }

        } else {
            return array("error" => true, "error_type" => 'missing_enrolment');
        }

    }

}
