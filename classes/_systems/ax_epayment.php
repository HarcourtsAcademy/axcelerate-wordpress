<?php

/**
 * Epayment Service
 *
 * @category  Axcelerate
 * @package   Axcelerate_Integration_Plugin
 * @author    Original Author @author Rob Bisson <rob.bisson@axcelerate.com.au>
 * @copyright 2017-2018 aXcelerate
 */

defined('ABSPATH') or die();

/* -------------------------------------------- */

/**
 * EPayment service to simplify actions such as verifying current status of epayment.
 *
 * @category  Axcelerate
 * @package   Axcelerate_Integration_Plugin
 * @author    Rob Bisson <rob.bisson@axcelerate.com.au>
 * @copyright 2017-2018 aXcelerate
 * @since     Class available since Release 2.8.14
 */

class AX_EPayment_Service
{

    /**
     * Get the status of an enrolment from the enrolment hash.
     *
     * @param [string] $enrolmentHash - The hash representing the enrolment
     *
     * @return [array] The current status
     * @author Rob Bisson <rob.bisson@axcelerate.com.au>
     */
    public static function getCurrentStatus($enrolmentHash, $expectedProcessID, $forceEnrolmentHash = true)
    {
        $AxcelerateAPI = new AxcelerateAPI();

        $ePayStatusParams = array();

        if ($forceEnrolmentHash) {
            $expectedProcessID = $enrolmentHash;
        }

        $enrolmentData = AX_Enrolments::getEnrolmentByID($enrolmentHash);
        if (!empty($enrolmentData)) {
            if (key_exists('epayment_submission_data', $enrolmentData)) {
                $processID = $enrolmentData['epayment_submission_data']['process'];

                if ($forceEnrolmentHash) {
                    $processID = $enrolmentHash;
                }

                // If the URL variable for process id is different than the internal, and the original hash then use it.
                // May represent having 2 windows open and completing in the first.
                // May prove unneeded if this is handled by DS
                /*
                if (!empty($expectedProcessID)) {
                if ($processID !== $expectedProcessID && $enrolmentHash !== $expectedProcessID) {

                if (key_exists('process_history', $enrolmentData)) {
                if (in_array($expectedProcessID, $enrolmentData['process_history'])) {
                //This is an old ID, EG someone hit back or something similar.
                //Should still use the process ID from above, rather than this line.
                } else {

                $processID = $expectedProcessID;
                }
                }

                error_log(
                'Unexpected process ID mismatch: '
                . $expectedProcessID .' URL, differs from '
                . $processID .' INTERNAL'
                );
                //$processID = $expectedProcessID;
                //this should not be added -
                //if the url is diff then it may be an older one or maybe something else... may have to track these...
                }
                }
                 */

                $ePayStatusParams['process'] = $processID;

                $enrolmentStatus = $AxcelerateAPI->callResource(array(), '/accounting/external/debit_success/process/' . $processID, 'GET');
                // error_log(print_r($enrolmentStatus, true));
                if (!empty($enrolmentStatus)) {

                    if ($enrolmentStatus instanceof stdClass) {
                        if (!empty($enrolmentStatus->STATUS)) {

                            //If the process ID has been refreshed before, and the status is UNBEGUN, then use the original hash to grab the "load" token
                            if ('UNBEGUN' === $enrolmentStatus->STATUS && key_exists('process_history', $enrolmentData)) {
                                return self::getCurrentStatus($enrolentHash, $enrolentHash, true);
                            }

                            if ("PAYMENT_METHOD_PRESENT" === $enrolmentStatus->STATUS) {
                                if (isset($enrolmentStatus->REQUIREINITIALPAYMENT) && !empty($enrolmentStatus->REQUIREINITIALPAYMENT)) {
                                    error_log(print_r(array('error' => true, 'message' => 'Error found with initial payment', 'detail' => $enrolmentStatus), true));
                                    $enrolmentStatus->STATUS = 'DECLINED'; // Set to Declined status. this will then kick into the resume function;
                                }
                            }

                            return $enrolmentStatus;
                        }
                    }
                } else {
                    return array('error' => $enrolmentStatus);
                }
            } else {

                // checking to see if an existing process exists:

                $enrolmentStatus = $AxcelerateAPI->callResource(array(), '/accounting/external/debit_success/process/' . $expectedProcessID, 'GET');
                // error_log(print_r($enrolmentStatus, true));
                if (!empty($enrolmentStatus)) {

                    if ($enrolmentStatus instanceof stdClass) {
                        if (!empty($enrolmentStatus->STATUS)) {

                            //If the process ID has been refreshed before, and the status is UNBEGUN, then use the original hash to grab the "load" token
                            if ('UNBEGUN' === $enrolmentStatus->STATUS && key_exists('process_history', $enrolmentData)) {
                                return self::getCurrentStatus($enrolentHash, $enrolentHash, true);
                            }

                            if ("PAYMENT_METHOD_PRESENT" === $enrolmentStatus->STATUS) {
                                if (isset($enrolmentStatus->REQUIREINITIALPAYMENT) && !empty($enrolmentStatus->REQUIREINITIALPAYMENT)) {
                                    error_log(print_r(array('error' => true, 'message' => 'Error found with initial payment', 'detail' => $enrolmentStatus), true));
                                    $enrolmentStatus->STATUS = 'DECLINED'; // Set to Declined status. this will then kick into the resume function;
                                }
                            }

                            return $enrolmentStatus;
                        }
                    }
                } else {
                    return array('error' => $enrolmentStatus);
                }
            }

        }
        return array('error' => $enrolmentStatus);

    }
    /**
     * Determine what the next course of action is, and return.
     *
     * @param [string] $enrolmentHash The hash representing the enrolment
     * @param [array]  $enrolmentData The enrolment data
     *
     * @return [array||null] array containing the next action.
     * @author Rob Bisson <rob.bisson@axcelerate.com.au>
     */
    public static function checkStatusAndNextAction($enrolmentHash, $expectedProcessID)
    {
        $enrolmentData = AX_Enrolments::getEnrolmentByID($enrolmentHash);
        $AxcelerateAPI = new AxcelerateAPI();
        $enrolmentStatus = self::getCurrentStatus($enrolmentHash, $expectedProcessID);

        if (key_exists('error', $enrolmentStatus)) {
            error_log(print_r($enrolmentStatus, true));
            return null;
        } else {
            $status = $enrolmentStatus->STATUS;

            if ("COMPLETE" == $status || "CHARGED" == $status || "PAYMENT_METHOD_PRESENT" == $status) {

                $callbackURL = $enrolmentData['epayment_response_data']['CALLBACK'];
                if (!empty($callbackURL)) {
                    $args = parse_url($callbackURL, PHP_URL_QUERY);
                    if (!empty($args)) {
                        $callbackURL = $callbackURL . '&ax_custom=';
                    } else {
                        $callbackURL = $callbackURL . '?ax_custom=';
                    }
                    $callbackURL = $callbackURL . $enrolmentData['epayment_submission_data']['passthrough']
                        . '&ax_p=' . $enrolmentData['epayment_submission_data']['process'];
                }

                return array('epayment_redirect_success' => $callbackURL);
            } elseif ("RUNING" == $status || "PAYMENT_METHOD_MISSING" == $status) {
                //An existing request is currently identified as active.
                //Reject this, but add a button to "check again" which reloads the page?

                $ePayParams = $enrolmentData['epayment_submission_data'];

                $ePayParams['callback'] = $enrolmentData['epayment_response_data']['CALLBACK'];

                $oldID = $ePayParams['process'];

                if (!empty($ePayParams['ruleID'])) {
                    $ePayParams['termID'] = $ePayParams['ruleID'];
                }
                $epayResponse = $AxcelerateAPI->callResource($ePayParams, '/accounting/external/debit_success/paymentrecord', 'POST');

                if ($epayResponse instanceof stdClass) {
                    if (!empty($epayResponse->error)) {
                        return array('epayment_failure' => true, 'epayment_error' => $epayResponse->resultBody);
                    } else {
                        //Update stored process id.
                        AX_Enrolments::updateEnrolmentWithoutRefresh($enrolmentHash, $enrolmentData);
                        //Currently this always throws an error :( See what we can fix!
                        if (!empty($epayResponse->REDIRECT)) {
                            return array('epayment_redirect_resume' => $epayResponse->REDIRECT);
                        }
                    }
                }

                return array('epayment_running' => true);
            } elseif ("FAILED" == $status || 'DECLINED' == $status) {

                $ePayParams = $enrolmentData['epayment_submission_data'];

                $ePayParams['callback'] = $enrolmentData['epayment_response_data']['CALLBACK'];

                $oldID = $ePayParams['process'];

                // need a new process ID...
                // Time is not the best option here. Instead we need to check the previous process and then update.
                $processID = wp_hash($enrolmentHash . '_' . 1);
                $ePayParams['process'] = $processID;

                //Store the previous process ID in the history
                if (key_exists('process_history', $enrolmentData)) {
                    $oldIDs = $enrolmentData['process_history'];
                    $processCount = count($oldIDs);
                    //Get a new hash that won't conflict
                    $processID = wp_hash($enrolmentHash . '_' . $processCount + 1);

                    $oldIDs = array_push($oldIDs, $oldID);
                    $enrolmentData['process_history'] = $oldIDs;

                } else {
                    $enrolmentData['process_history'] = array($oldID);
                }
                $enrolmentData['epayment_submission_data']['process'] = $processID;

                $epayResponse = $AxcelerateAPI->callResource($ePayParams, '/accounting/external/debit_success/paymentrecord', 'POST');

                if ($epayResponse instanceof stdClass) {
                    if (!empty($epayResponse->error)) {
                        return array('epayment_failure' => true, 'epayment_error' => $epayResponse->resultBody);
                    } else {
                        //Update stored process id.
                        AX_Enrolments::updateEnrolmentWithoutRefresh($enrolmentHash, $enrolmentData);

                        if (!empty($epayResponse->REDIRECT)) {
                            return array('epayment_redirect_resume' => $epayResponse->REDIRECT);
                        }
                    }
                }
                //revert to error if broken.
                return array('epayment_failure' => true, 'epayment_error' => $epayResponse->resultBody);
            } elseif ('UNBEGUN' == $status) {
                //This should never occur.
                return array('epayment_failure' => true, 'epayment_error' => $epayResponse->resultBody, 'message' => "Incorrect API response detected.");

            } elseif ('FATAL' == $status) {
                error_log(print_r($epayResponse, true));
                return array('epayment_failure' => true, 'epayment_error' => $epayResponse->resultBody);
            } else {
                error_log(print_r($epayResponse, true));
                return array('epayment_failure' => true, 'epayment_error' => $epayResponse->resultBody);
            }
        }
    }

    public static function checkStatusAndConfirmEnrolment($enrolmentHash, $axP)
    {

        $enrolmentData = AX_Enrolments::getEnrolmentByID($enrolmentHash);

        $epaymentEnrolment = false;
        $response = array();
        if (!empty($enrolmentData)) {
            if (key_exists('method', $enrolmentData)) {
                if ("epayment" == $enrolmentData['method']) {
                    $epaymentEnrolment = true;
                }
            }
        }
        if ($epaymentEnrolment) {
            $successful = true;
            $errorMessage = "";
            $status = self::checkStatusAndNextAction($enrolmentHash, $axP);

            if (!empty($status)) {
                if (key_exists('epayment_redirect_success', $status)) {
                    $confirm = AX_Enrolments::confirmEnrolment($enrolmentHash);
                    if (!empty($confirm)) {
                        $enrolmentData['confirmed_enrolments'] = $confirm;
                        $response['success'] = true;
                        //TODO: add success messsageees!
                    }
                } elseif (key_exists('epayment_failure', $status)) {
                    $successful = false;
                    $response['success'] = false;
                    $errorMessage = "An error has occurred with your payment which prevents resumption of the enrolment process.";
                    $response['message'] = $errorMessage;
                    if (key_exists('epayment_error', $status)) {
                        if ($status['epayment_error'] instanceof stdClass) {
                            if (!empty($status['epayment_error']->MESSAGES)) {
                                $response['details'] = $status['epayment_error']->MESSAGES;
                                $response['status'] = 'epayment_error';
                            }
                        }
                    }

                } elseif (key_exists('epayment_redirect_resume', $status)) {
                    $successful = false;
                    $response['success'] = false;
                    $url = $status['epayment_redirect_resume'];
                    $response['message'] = 'An incomplete enrolment has been found.';
                    if (empty($url)) {
                        $url = get_permalink();
                    }
                    $response['redirect_url'] = $url;
                    $response['status'] = 'epayment_redirect_resume';

                } else {
                    error_log(print_r($status, true));

                    $response['success'] = false;

                    $response['message'] = 'Unexpected Error';
                    if (empty($url)) {
                        $url = get_permalink();
                    }

                    $response['status'] = 'epayment_failure';
                }
            }
            return $response;

        } else {
            return $response;
        }
    }

}
