<?php

/**
 * Enrolment Service
 */

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined('ABSPATH') or die('No script kiddies please!');

/* -------------------------------------------- */

/**
 * Enrolments for Enrolment Resumption.
 *
 * @author Rob Bisson <rob.bisson@axcelerate.com.au>
 */
class AX_Enrolments
{

    /**
     * Constructor
     *
     * @author Rob Bisson <rob.bisson@axcelerate.com.au>
     */
    public function __construct()
    {
        add_action('init', 'AX_Enrolments::register_ajax_actions');
    }
    public static function register_ajax_actions()
    {

        add_action('wp_ajax_send_reminder_by_reference', 'AX_Enrolments::ajax_send_reminders_reference_lookup');
        add_action('wp_ajax_nopriv_send_reminder_by_reference', 'AX_Enrolments::ajax_send_reminders_reference_lookup');

        add_action('wp_ajax_has_enrolment_by_reference', 'AX_Enrolments::ajax_has_existing_enrolment');
        add_action('wp_ajax_nopriv_has_enrolment_by_reference', 'AX_Enrolments::ajax_has_existing_enrolment');

        add_action('wp_ajax_flag_others_redundant_by_reference', 'AX_Enrolments::ajax_flag_others_redundant');
        add_action('wp_ajax_nopriv_flag_others_redundant_by_reference', 'AX_Enrolments::ajax_flag_others_redundant');

    }
    /**
     * WP Events hook
     *
     * @return void
     */
    public static function registerEventHooks()
    {
        add_action('ax_send_enrolment_reminders', array('AX_Enrolments', 'sendReminders'));
    }
    /**
     * WP Cron events.
     *
     * @return void
     */
    public static function setupReminderTasks()
    {
        wp_clear_scheduled_hook('ax_send_enrolment_reminders');

        if (!wp_next_scheduled('ax_send_enrolment_reminders')) {
            wp_schedule_event(time() + (2), '2_hourly', 'ax_send_enrolment_reminders');
        }
    }
    /**
     * ClearReminderTasks
     *
     * @return void
     */
    public static function clearReminderTasks()
    {
        wp_clear_scheduled_hook('ax_send_enrolment_reminders');
    }

    /**
     * Get all Enrolments currently in the DB, with name and value
     *
     * @return void
     * @author Rob Bisson<rob.bisson@axcelerate.com.au>
     */
    public static function getEnrolments()
    {
        global $wpdb;
        /* in performance mode limit to the most recent 100 enrolments*/
        $performance = constant('AXIP_ER_PERFORMANCE_ENABLED') === true;

        if ($performance) {
            $sql = "SELECT `option_name` AS `name`, `option_value` AS `value`
			FROM  $wpdb->options
			WHERE `option_name` LIKE '%transient_ax_enrol%'
			ORDER BY `option_id` DESC
			LIMIT 200";
        } else {
            $sql = "SELECT `option_name` AS `name`, `option_value` AS `value`
			FROM  $wpdb->options
			WHERE `option_name` LIKE '%transient_ax_enrol%'";
        }

        $results = $wpdb->get_results($sql);
        return $results;
    }

    public static function store_enrolment_hash_reference($enrolmentHash, $contactID, $instanceID, $courseType)
    {

        $enrolmentRef = 'ax_ref_' . $contactID . '_' . $instanceID . '_' . $courseType;

        $existing = self::get_enrolment_hash_reference($enrolmentRef);
        if (is_array($existing)) {
            $length = count($existing);
            $found = false;
            if ($length > 0) {
                foreach ($existing as $enrolment) {

                    if ($enrolment['enrolment_hash'] === $enrolmentHash) {
                        $found = true;
                    }
                }
            }
            if (!$found) {
                array_push($existing, array(
                    "enrolment_hash" => $enrolmentHash,
                    "time" => current_time('mysql'),
                ));
            }
            set_transient($enrolmentRef, $existing, 5 * DAY_IN_SECONDS);
        } else {
            set_transient($enrolmentRef, array(array(
                "enrolment_hash" => $enrolmentHash,
                "time" => current_time('mysql'),
            )), 5 * DAY_IN_SECONDS);
        }
    }

    public static function ajax_send_reminders_reference_lookup()
    {
        $contactID = $_REQUEST['contact_id'];
        $instanceID = $_REQUEST['instance_id'];
        $courseType = $_REQUEST['course_type'];
        $enrolmentHash;
        if (isset($_REQUEST['enrolment_hash'])) {
            $enrolmentHash = $_REQUEST['enrolment_hash'];
        }

        if (!empty($contactID) && !empty($instanceID) && !empty($courseType)) {
            $existingEnrolments = self::lookup_existing_enrolments($contactID, $instanceID, $courseType);
            if (is_array($existingEnrolments)) {
                $invoiced = array();
                $toRemind = array();
                foreach ($existingEnrolments as $enrolment) {

                    if (key_exists('invoice_id', $enrolment)) {
                        if (!empty($enrolment['invoice_id'])) {
                            array_push($invoiced, $enrolment);
                        }
                    }
                    if (isset($enrolmentHash) && !empty($enrolmentHash)) {
                        // send reminder for the following!
                        // this check is mainly to ensure that "completed" and similar enrolments are not sent.
                        if ($enrolment['enrolment_hash'] !== $enrolmentHash) {
                            if (key_exists('method', $enrolment)) {
                                if ($enrolment['method'] == 'initial') {
                                    array_push($toRemind, $enrolment['enrolment_hash']);

                                } elseif ($enrolment['method'] == 'epayment') {
                                    array_push($toRemind, $enrolment['enrolment_hash']);
                                }
                            } elseif (key_exists('enrolments', $enrolment)) {
                                array_push($toRemind, $enrolment['enrolment_hash']);
                            }
                            // if not in the enrolments state, or method state, there's no point in "resuming" so don't send
                        }
                        // if the enrolment hash is equal then it's already active.

                    } else {
                        if (key_exists('method', $enrolment)) {
                            if ($enrolment['method'] == 'initial') {
                                array_push($toRemind, $enrolment['enrolment_hash']);
                            } elseif ($enrolment['method'] == 'epayment') {
                                array_push($toRemind, $enrolment['enrolment_hash']);
                            }
                        } elseif (key_exists('enrolments', $enrolment)) {
                            array_push($toRemind, $enrolment['enrolment_hash']);
                        }
                        // if not in the enrolments state, or method state, there's no point in "resuming" so don't send

                    }
                }

                if (count($invoiced) == 1) {
                    self::sendReminder($invoiced[0]['enrolment_hash']);
                } else {
                    foreach ($toRemind as $enrolmentHash) {
                        self::sendReminder($enrolmentHash);
                    }
                }
            }
        }
        echo json_encode(array('reminders_sent' => true));
        die();
    }

    public static function ajax_has_existing_enrolment()
    {
        $contactID = $_REQUEST['contact_id'];
        $instanceID = $_REQUEST['instance_id'];
        $courseType = $_REQUEST['course_type'];
        $enrolmentHash;
        if (isset($_REQUEST['enrolment_hash'])) {
            $enrolmentHash = $_REQUEST['enrolment_hash'];
        }

        if (!empty($contactID) && !empty($instanceID) && !empty($courseType)) {
            // find the enrolments
            $existingEnrolments = self::lookup_existing_enrolments($contactID, $instanceID, $courseType);

            error_log(print_r($existingEnrolments, true));

            if (is_array($existingEnrolments)) {
                if (count($existingEnrolments) > 0) {

                    $notSame = false;
                    $invoiced = array();
                    // check to see what state enrolments are in
                    // if enrolment hash is passed check for different enrolment attempts.
                    foreach ($existingEnrolments as $enrolment) {
                        $enrolmentIsForContact = true;
                        if (key_exists('enrolments', $enrolment)) {
                            $contactIDFound = false;
                            foreach ($enrolment['enrolments'] as $enrolContactID => $enrolObj) {
                                if ($enrolContactID == $contactID) {
                                    $contactIDFound = true;
                                }
                            }
                            if (!$contactIDFound) {
                                $enrolmentIsForContact = false;
                            }
                        }

                        if ($enrolmentIsForContact) {
                            if (key_exists('invoice_id', $enrolment)) {

                                if ($enrolment['invoice_id'] !== 0 && $enrolment['invoice_id'] !== "0") {
                                    array_push($invoiced, $enrolment);
                                }
                            }
                            if (!empty($enrolmentHash)) {
                                if ($enrolment['enrolment_hash'] !== $enrolmentHash) {

                                    if (key_exists('method', $enrolment)) {

                                        if ($enrolment['method'] == 'initial') {
                                            $notSame = true;
                                        } elseif ($enrolment['method'] == 'epayment') {
                                            $notSame = true;
                                        }
                                    } elseif (key_exists('enrolments', $enrolment)) {
                                        $notSame = true;
                                    } else {
                                        $enrolment['redundant'] = true;
                                        // flag it so it will get skipped in resumption checks.
                                        self::updateEnrolmentWithoutRefresh($enrolment['enrolment_hash'], $enrolment);
                                    }
                                }
                            }
                        }
                    }
                    if (!empty($enrolmentHash)) {
                        if ($notSame) {
                            if (count($invoiced) > 0) {
                                echo json_encode(array("enrolments" => true, 'has_invoice' => true));
                                die();
                            } else {
                                echo json_encode(array("enrolments" => true));
                                die();
                            }

                        }
                    } else {
                        if (count($invoiced) > 0) {
                            echo json_encode(array("enrolments" => true, 'has_invoice' => true));
                            die();
                        } else {
                            echo json_encode(array("enrolments" => true));
                            die();
                        }
                    }
                }
            }
        }

        echo json_encode(array("enrolments" => false));
        die();

    }
    /**
     * Function to find any other enrolment records, and flag them as "redundant"
     * This will prevent notifications going out.
     *
     * Only flags them if the user is the same as the user on the enrolment record.
     *
     * @return void
     * @author Rob Bisson <rob.bisson@axcelerate.com.au>
     */
    public static function ajax_flag_others_redundant()
    {
        $contactID = $_REQUEST['contact_id'];
        $userContactID = $_REQUEST['user_contact_id'];
        $instanceID = $_REQUEST['instance_id'];
        $courseType = $_REQUEST['course_type'];
        $enrolmentHash;
        if (isset($_REQUEST['enrolment_hash'])) {
            $enrolmentHash = $_REQUEST['enrolment_hash'];
        }
        if (!empty($contactID) && !empty($instanceID) && !empty($courseType)) {
            // find the enrolments
            $existingEnrolments = self::lookup_existing_enrolments($contactID, $instanceID, $courseType);
            foreach ($existingEnrolments as $enrolment) {
                if ($enrolment['enrolment_hash'] !== $enrolmentHash) {
                    if ($enrolment['user_contact_id'] . "" !== $userContactID . "") {
                        //if method exists don't flag it, as enrolment will be broken.
                        if (!key_exists('method', $enrolment)) {
                            $enrolment['redundant'] = true;
                            self::updateEnrolmentWithoutRefresh($enrolment['enrolment_hash'], $enrolment);
                        }

                    }
                }
            }

        }
        echo json_encode(array("done" => false));
        die();

    }

    public static function lookup_existing_enrolments($contactID, $instanceID, $courseType)
    {
        $enrolments = self::lookup_enrolment_hash($contactID, $instanceID, $courseType);
        if (!empty($enrolments)) {
            $fullEnrolments = array();
            foreach ($enrolments as $enrolment) {
                $fullE = self::getEnrolmentByID($enrolment['enrolment_hash']);
                if (!empty($fullE)) {
                    if (!key_exists('redundant', $fullE)) {
                        if (!key_exists('method', $fullE)) {
                            array_push($fullEnrolments, $fullE);
                        } elseif (key_exists('method', $fullE)) {
                            if ('initial' === $fullE['method'] || 'epayment' === $fullE) {
                                array_push($fullEnrolments, $fullE);
                            }

                        } elseif (key_exists('enrolments', $fullE)) {
                            array_push($fullEnrolments, $fullE);
                        } elseif (!key_exists('is_enquiry', $fullE)) {
                            array_push($fullEnrolments, $fullE);
                        }
                    }

                }
            }
            if (count($fullEnrolments) > 0) {
                return $fullEnrolments;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    public static function lookup_enrolment_hash($contactID, $instanceID, $courseType)
    {
        $enrolmentRef = 'ax_ref_' . $contactID . '_' . $instanceID . '_' . $courseType;
        if (!empty($contactID) && !empty($instanceID) && !empty($courseType)) {
            return self::get_enrolment_hash_reference($enrolmentRef);
        }
        return null;

    }

    public static function get_enrolment_hash_reference($enrolmentReference)
    {
        $enrolments = get_transient($enrolmentReference);

        if (is_array($enrolments)) {
            if (!empty($enrolments[0])) {
                return $enrolments;
            }
        }
        return array();
    }
    /**
     * Get enrolment transient either by transient name, or full option string
     * Returns Null if expired or not found.
     * @author Rob Bisson <rob.bisson@axcelerate.com.au>
     *
     * @param string $enrolmentID - Enrolment hash to retrieve
     * @return void
     *
     */
    public static function getEnrolmentByID($enrolmentID = '')
    {
        if (!empty($enrolmentID)) {
            /*clean any extra values to ensure that the ID is correct*/
            $enrolmentID = str_replace('_transient_', '', $enrolmentID);
            $enrolmentID = str_replace('ax_enrol_', '', $enrolmentID);

            $enrolment = get_transient('ax_enrol_' . $enrolmentID);
            if ($enrolment) {
                /*add enrolment hash in case it isn't present*/
                $enrolment['enrolment_hash'] = $enrolmentID;
                return $enrolment;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
    /**
     * Process Enrolment data and retrieve a contact list.
     * @param array $enrolmentData
     * @return boolean
     */
    public static function getEnrolmentContactList($enrolmentData = array())
    {
        if (!empty($enrolmentData)) {
            $contactList = array();
            if (!empty($enrolmentData['enrolments'])) {
                foreach ($enrolmentData['enrolments'] as $key => $value) {
                    $contact = array(
                        'CONTACTID' => $key,
                        'GIVENNAME' => $value['CONTACT_NAME'],
                    );
                    array_push($contactList, $contact);
                }
            }
            return $contactList;
        } else {
            return false;
        }
    }

    /**
     * Update an existing valid enrolment transient withought refreshing the expiry date through update_option
     * Accepts enrolment ID in plain hash, hash + 'ax_enrol_' and the full option name
     * @param string $enrolmentID
     * @param array $data
     */
    public static function updateEnrolmentWithoutRefresh($enrolmentID = '', $data = array())
    {
        if (!empty($enrolmentID)) {
            /*clean any extra values to ensure that the ID is correct*/
            $enrolmentID = str_replace('_transient_', '', $enrolmentID);
            $enrolmentID = str_replace('ax_enrol_', '', $enrolmentID);

            update_option('_transient_ax_enrol_' . $enrolmentID, $data);
        }
    }

    /**
     * This function will return still active (not timed out) Enrolments.
     * It will also clear the DB of any inactive enrolments.
     */
    public static function getActiveEnrolments()
    {
        $enrolments = self::getEnrolments();
        $active = array();
        foreach ($enrolments as $enrol) {
            $enrolment = self::getEnrolmentByID($enrol->name);
            if (!empty($enrolment)) {
                array_push($active, $enrolment);
            }
        }
        return $active;
    }

    /**
     * Filters the results down, eliminating any that have been "Confirmed"
     */
    public static function getIncompleteEnrolments()
    {
        $activeEnrolments = self::getActiveEnrolments();
        $filteredArray = array();
        if ($activeEnrolments) {
            foreach ($activeEnrolments as $enrolment) {

                if (!key_exists('redundant', $enrolment)) {
                    /*Eliminate any confirmations*/
                    if (key_exists('method', $enrolment)) {
                        /*Will need an alternative way to detect completion maybe*/
                        if ($enrolment['method'] == "initial") {
                            array_push($filteredArray, $enrolment);
                        }
                        if ($enrolment['method'] == "epayment") {
                            array_push($filteredArray, $enrolment);
                        }
                    } else {
                        /*prevent enquiries from being sent, and skip any enrolments that have been marked "redundant"*/
                        if (!key_exists('is_enquiry', $enrolment)) {

                            array_push($filteredArray, $enrolment);
                        }
                    }
                }

            }
        }

        return $filteredArray;
    }

    /**
     * Undocumented function
     *
     * @return void
     * @author Rob Bisson <rob.bisson@axcelerate.com.au>
     */
    public static function enrolmentsToBeMailed()
    {
        $incompleteEnrolments = self::getIncompleteEnrolments();
        $filteredArray = array();
        if ($incompleteEnrolments) {
            foreach ($incompleteEnrolments as $enrolment) {
                /*Eliminate any confirmations*/
                if (!key_exists('mailed', $enrolment)) {
                    if (key_exists('time', $enrolment)) {
                        $time = $enrolment['time'];
                        $debugVal = get_option('ax_enrol_resumption_debug_mode');

                        if (!empty($debugVal)) {
                            array_push($filteredArray, $enrolment);
                        } else {
                            /*make sure that the enrolment was not updated in the last hour, ensure that the email is not sent mid enrolment*/
                            $time = strtotime($time);
                            $offsetTime = strtotime(current_time('mysql')) - 60 * 60;

                            if ($time < $offsetTime) {
                                array_push($filteredArray, $enrolment);
                            }
                        }
                    }
                }
            }
        }

        return $filteredArray;
    }

    /**
     * Undocumented function
     *
     * @return void
     * @author Rob Bisson <rob.bisson@axcelerate.com.au>
     */
    public static function sendReminders()
    {
        $reminders_enabled = get_option('ax_enrol_notifications_active');
        /*Reminders Enabled is either 0 or 1, so check to see if empty*/
        if (!empty($reminders_enabled)) {
            $templateID = get_option('ax_enrol_resumption_template_id');
            $enrolments = self::enrolmentsToBeMailed();

            if ($enrolments) {
                foreach ($enrolments as $enrolment) {
                    $enrolmentHash = $enrolment['enrolment_hash'];
                    $contactID = intval($enrolment['user_contact_id'], 10);
                    if (!empty($templateID)) {
                        self::_sendReminderTemplate($enrolmentHash, $enrolment, $contactID, intval($templateID, 10));
                    } else {
                        self::_sendReminderNoTemplate($enrolmentHash, $enrolment, $contactID);
                    }
                }
            }
        }
    }

    /**
     * Send a single enrolment reminder
     *
     * @param string $enrolmentHash
     * @return void
     * @author Rob Bisson <rob.bisson@axcelerate.com.au>
     */
    public static function sendReminder($enrolmentHash = "")
    {
        $enrolment = self::getEnrolmentByID($enrolmentHash);

        $templateID = get_option('ax_enrol_resumption_template_id');
        $contactID = intval($enrolment['user_contact_id'], 10);

        if (!empty($templateID)) {
            self::_sendReminderTemplate($enrolmentHash, $enrolment, $contactID, intval($templateID, 10));
        } else {
            self::_sendReminderNoTemplate($enrolmentHash, $enrolment, $contactID);
        }

    }

    /**
     * Undocumented function
     *
     * @param string $fullEnrolmentHash
     * @param integer $contactID
     * @param string $content
     * @return void
     * @author Rob Bisson <rob.bisson@axcelerate.com.au>
     */
    private static function _sendGeneratedTemplate($fullEnrolmentHash = '', $contactID = 0, $content = '')
    {
        $AxcelerateAPI = new AxcelerateAPI();

        $finalParams = array(
            'contactID' => $contactID,
            'content' => (string) $content,
            'subject' => 'Incomplete Online Booking',
        );

        $Response = $AxcelerateAPI->callResource($finalParams, '/template/email', 'POST');

        $debugVal = get_option('ax_enrol_resumption_debug_mode');

        if (!empty($debugVal)) {
            echo '<div class="notice notice-success is-dismissible"><h4>';

            var_dump($Response);

            echo '</h4></div>';
        }

        if (!empty($Response->SUCCESSCOUNT)) {
            if ($Response->SUCCESSCOUNT === 1) {
                $enrolment = self::getEnrolmentByID($fullEnrolmentHash);
                $enrolment['mailed'] = true;
                self::updateEnrolmentWithoutRefresh($fullEnrolmentHash, $enrolment);
            }
        }
    }

    /**
     *
     * @param string $fullEnrolmentHash
     * @param array $enrolment
     * @param number $contactID
     * @param number $templateID
     */
    private static function _sendReminderTemplate($fullEnrolmentHash = '', $enrolment = array(), $contactID = 0, $templateID = 0)
    {
        $AxcelerateAPI = new AxcelerateAPI();
        //Generate template content
        $params = array(
            'planID' => $templateID,
            'contactID' => $contactID,
        );
        $resumeEnrolmentLink = $enrolment['page_url'];
        $args = parse_url($resumeEnrolmentLink, PHP_URL_QUERY);

        $resumptionHash = 'enrolment=' . $enrolment['enrolment_hash'];
        if (strpos($args, $resumptionHash) > -1) {
            $resumeEnrolmentLink = $resumeEnrolmentLink;
        } elseif (!empty($args)) {
            $resumeEnrolmentLink = $resumeEnrolmentLink . '&' . $resumptionHash;
        } else {
            $resumeEnrolmentLink = $resumeEnrolmentLink . '?' . $resumptionHash;
        }

        $templateContent = $AxcelerateAPI->callResource($params, '/template', 'GET');
        $sendEmail = true;
        $content = '';
        if (!empty($templateContent)) {
            if ($templateContent) {
                if ($templateContent instanceof stdClass) {
                    if (!empty($templateContent->error)) {

                        if (true === WP_DEBUG) {
                            try {
                                error_log(print_r(array('params' => $params, 'response' => $templateContent), true));
                            } catch (Exception $e) {

                            }

                        }
                        $details = "";
                        if ($templateContent->resultBody instanceof stdClass) {
                            if (!empty($templateContent->resultBody->DETAILS)) {
                                $details = $templateContent->resultBody->DETAILS;
                            }
                        }
                        $PLAN_ERROR = "The planID passed is invalid and does not match any templates in this account.";
                        if (!empty($details) && strpos($details, 'planID') === false) {
                            $sendEmail = false; // The contact ID was the reason for failure. Don't try to send the email as it will error.
                            error_log(print_r(array('params' => $params, 'response' => $templateContent, 'sendEmail' => $sendEmail), true));
                        } else {
                            /*use transient to deactivate the email notification if one has been sent in the last 2 hours*/
                            $errorNotification = get_transient('ax_error_reminder_template');
                            if (empty($errorNotification)) {
                                set_transient('ax_error_reminder_template', true, 2 * HOUR_IN_SECONDS);
                                $users = get_users('role=Administrator');
                                try {
                                    wp_mail(
                                        $users[0]->user_email,
                                        'Enrolment Notification Template',
                                        'Your Enrolment notification template is no longer available. Please review your Enrolment Resumption Settings'
                                    );
                                } catch (\Throwable $th) {
                                    //throw $th;
                                }
                            }

                        }

                    }
                } else {
                    if (!empty($templateContent[0]->CONTENT)) {
                        $content = $templateContent[0]->CONTENT;
                    }
                }
            }
        }

        if ($sendEmail) {
            if (empty($content)) {
                self::_sendReminderNoTemplate($fullEnrolmentHash, $enrolment, $contactID);
            } else {
                $content = str_replace('[Online Enrolment Link]', $resumeEnrolmentLink, $content);
                //Send template
                self::_sendGeneratedTemplate($fullEnrolmentHash, $contactID, $content);
            }
        }

    }

    /**
     *
     * @param string $enrolmentHash
     * @param array $enrolment
     * @param number $contactID
     */
    private static function _sendReminderNoTemplate($enrolmentHash = '', $enrolment = array(), $contactID = 0)
    {
        $resumeEnrolmentLink = $enrolment['page_url'];
        $resumeEnrolmentLink = $enrolment['page_url'];
        $args = parse_url($resumeEnrolmentLink, PHP_URL_QUERY);

        $resumptionHash = 'enrolment=' . $enrolment['enrolment_hash'];
        if (strpos($args, $resumptionHash) > -1) {
            $resumeEnrolmentLink = $resumeEnrolmentLink;
        } elseif (!empty($args)) {
            $resumeEnrolmentLink = $resumeEnrolmentLink . '&' . $resumptionHash;
        } else {
            $resumeEnrolmentLink = $resumeEnrolmentLink . '?' . $resumptionHash;
        }

        $content = "<p>You have partially completed an enrolment via " . esc_url(home_url()) . ".</p>";
        $content = $content . "<p>You can resume your enrolment here " . esc_url($resumeEnrolmentLink) . "</p>";

        self::_sendGeneratedTemplate($enrolmentHash, $contactID, $content);
    }

    public static function confirmEnrolment($enrolmentHash = "")
    {
        //Enrolment widget stores enrolments in contact -> instances
        //Widget converts this to instance -> contacts for enrolment
        //likely that we can use contact -> instances here.
        if (!empty($enrolmentHash)) {
            $enrolmentData = self::getEnrolmentByID($enrolmentHash);

            if (!empty($enrolmentData)) {

                if (key_exists('method', $enrolmentData)) {
                    $method = $enrolmentData['method'];
                    if ('initial' == $method) {
                        //Why you going through here? You should be in the EW

                    } elseif ('epayment' == $method) {
                        $confirmed = self::_loopEnrolment($enrolmentData['enrolments'], $enrolmentData['invoice_id']);

                        if (key_exists('error', $confirmed)) {

                        } else {
                            //Update the stored data - change method so that it will not trigger again.
                            $enrolmentData['method'] = "confirmed";
                            $enrolmentData['enrolment_complete'] = true;
                            self::updateEnrolmentWithoutRefresh($enrolmentHash, $enrolmentData);
                        }
                        return $confirmed;
                    } elseif ('payment_flow' == $method) {
                        $tentative_confirm = !empty($enrolmentData['tentative_confirm']);

                        $log = array(
                            'enrolment_hash' => $enrolmentHash,
                            'tentative' => $tentative_confirm,
                        );
                        error_log(print_r($log, true));
                        $confirmed = self::_loopEnrolment($enrolmentData['enrolments'], $enrolmentData['invoice_id'], $tentative_confirm);

                        if (key_exists('error', $confirmed)) {

                        } else {
                            //Update the stored data - change method so that it will not trigger again.
                            $enrolmentData['method'] = "confirmed";
                            $enrolmentData['enrolment_complete'] = true;
                            self::updateEnrolmentWithoutRefresh($enrolmentHash, $enrolmentData);
                        }
                        return $confirmed;
                    }
                }
            }
        }
        return null;
    }

    private static function _loopEnrolment($enrolmentList, $invoiceID, $tentative_confirm = false)
    {
        $error = false;
        $enrolmentsCompleted = array();
        $errors = array();
        //Loop over the list of contacts to grab the instance lists.
        foreach ($enrolmentList as $contactID => $instance) {
            //Loop over the instance lists to grab the individual enrolments.
            foreach ($instance as $instanceID => $enrolment) {
                //skip the contact name object.
                if ("CONTACT_NAME" !== $instanceID) {
                    $enrolled = self::_enrolIndividual($enrolment, $invoiceID, $tentative_confirm);
                    if (key_exists('error', $enrolled)) {
                        $error = true;
                        array_push($errors, $enrolled);
                    }
                    array_push($enrolmentsCompleted, $enrolled);
                }

            }

        }
        if (!empty($error)) {
            return array('error' => true, 'enrolments' => $enrolmentsCompleted);
        }
        return $enrolmentsCompleted;
        //TODO: update enrolment data!

    }

    private static function _enrolIndividual($enrolment, $invoiceID, $tentative_confirm)
    {
        $enrolment = (array) $enrolment;

        if (!empty($invoiceID)) {
            $enrolment['invoiceID'] = $invoiceID;
            $enrolment['generateInvoice'] = 1;
        }

        $enrolCopy = $enrolment;
        if (key_exists('suppressNotifications', $enrolment)) {
            unset($enrolment['suppressNotifications']);
        }

        if ($tentative_confirm) {
            $enrolment['tentative'] = true;
        } else if (key_exists('tentative', $enrolment)) {
            unset($enrolment['tentative']);
        }

        if (key_exists('discountIDList', $enrolment)) {
            unset($enrolment['discountIDList']);
        }
        if (key_exists('cost', $enrolment)) {
            unset($enrolment['cost']);
        }
        if (key_exists('originalCost', $enrolment)) {
            unset($enrolment['originalCost']);
        }
        try {
            unset($enrolment['NAME']);
            unset($enrolment['DATESDISPLAY']);
            unset($enrolment['COURSENAME']);
        } catch (Exception $e) {
            error_log(print_r($e, true));
        }
        $AxcelerateAPI = new AxcelerateAPI();

        //TODO: Should this first check the status of the enrolment in aX before attempting confirmation
        if ($enrolment['type'] !== 'el') {
            $existingEnrolment = $AxcelerateAPI->callResource(
                array(
                    'instanceID' => $enrolment['instanceID'],
                    'type' => $enrolment['type'],
                    'contactID' => $enrolment['contactID'],
                ),
                '/course/enrolments',
                'GET'
            );
            if ($existingEnrolment instanceof stdClass) {
                if (!empty($existingEnrolment->error)) {
                    $message = 'An error occurred';
                    if (!empty($existingEnrolment->resultBody)) {
                        if (!empty($existingEnrolment->resultBody->MESSAGES)) {
                            $message = $existingEnrolment->resultBody->MESSAGES;
                        }
                    }

                    error_log(print_r($existingEnrolment, true));
                    return array(
                        'contactID' => $enrolment['contactID'],
                        'error' => true,
                        'message' => $message,
                        'instanceID' => $enrolment['instanceID'],
                    );
                }
            } else {
                if (!empty($existingEnrolment[0])) {
                    if (!empty($existingEnrolment[0]->CONTACTID)) {
                        $status = $existingEnrolment[0]->STATUS;
                        $status = strtolower($status);
                        $log = array(
                            'contact_id' => $existingEnrolment[0]->CONTACTID,
                            'status' => $status,

                        );

                        if (key_exists('tentative', $enrolment)) {
                            $log['tentative_enrolment'] = $enrolment['tentative'];
                        }

                        error_log(print_r($log, true));

                        if ('tentative' !== $status) {

                            return array(
                                'contactID' => $enrolment['contactID'],
                                'already_enrolled' => true,
                                'instanceID' => $enrolment['instanceID'],
                            );
                        }
                    }
                }
            }
        }

        //error_log(print_r($enrolment, true));
        $Response = $AxcelerateAPI->callResource($enrolment, '/course/enrol', 'POST');
        //error_log(print_r($Response, true));
        if ($Response instanceof stdClass) {
            error_log(print_r($Response, true));
            if (!empty($Response->error)) {
                $message = 'An error occurred';
                if (!empty($Response->resultBody)) {
                    if (!empty($Response->resultBody->MESSAGES)) {
                        $message = $Response->resultBody->MESSAGES;
                    }
                }
                return array(
                    'contactID' => $enrolment['contactID'],
                    'error' => true,
                    'message' => $message,
                    'instanceID' => $enrolment['instanceID'],
                    'original' => $enrolCopy,
                );

            } elseif (!empty($Response->CONTACTID)) {

                $noteDeets = array(
                    'noteCodeID' => 88,
                    'noteTypeID' => 88,
                    'contactID' => $enrolment['contactID'],

                );
                $noteDeets['contactNote'] = '<p>Course Enrolment - Confirmation</p>';
                $dateString = date_format(new DateTime(), 'd/m/Y H:i:s');

                $noteDeets['contactNote'] .= "<p>Time: <b>" . $dateString . "</b></p>";
                $noteDeets['contactNote'] .= "<p>Method: Confirmation</p>";
                $noteDeets['contactNote'] .= "<p>InstanceID: " . $enrolment['instanceID'] . "</p>";
                $noteDeets['contactNote'] .= "<p>Type: " . $enrolment['type'] . "</p>";
                $Note = $AxcelerateAPI->callResource($noteDeets, '/contact/note', 'POST');

                return array(
                    'contactID' => $Response->CONTACTID,
                    'response' => $Response,
                    'instanceID' => $enrolment['instanceID'],
                    'original' => $enrolCopy,
                );
            }
            else{
                error_log(print_r($Response, true));
            }
        }

    }
}
