<?php

/*--------------------------------------------*
 * Securing the plugin
 *--------------------------------------------*/

defined('ABSPATH') or die('No script kiddies please!');

/* -------------------------------------------- */

if (!class_exists('AX_AJAX')) {
    class AX_AJAX
    {
        public function __construct()
        {

            add_action('init', array(&$this, 'axip_ajax_suport'));
        }
        /**
         * Undocumented function
         *
         * @return void
         * @author Rob Bisson <rob.bisson@axcelerate.com.au>
         */
        public function axip_ajax_suport()
        {

            add_action('wp_ajax_axip_getcalendar_action', array(&$this, 'axip_getcalendar_handle'));
            add_action('wp_ajax_nopriv_axip_getcalendar_action', array(&$this, 'axip_getcalendar_handle')); // need this to serve non logged in users

            add_action('wp_ajax_axip_login_action', array(&$this, 'axip_login_handle'));
            add_action('wp_ajax_nopriv_axip_login_action', array(&$this, 'axip_login_handle')); // need this to serve non logged in users

            /*New Login method using actual Users*/
            add_action('wp_ajax_axip_user_login', array(&$this, 'axip_user_login_handle'));
            add_action('wp_ajax_nopriv_axip_user_login', array(&$this, 'axip_user_login_handle')); // need this to serve non logged in users

            add_action('wp_ajax_axip_user_reset_action', array(&$this, 'axip_user_reset_handle'));
            add_action('wp_ajax_nopriv_axip_user_reset_action', array(&$this, 'axip_user_reset_handle')); // need this to serve non logged in users

            add_action('wp_ajax_axip_user_create_action', array(&$this, 'axip_user_create_handle'));
            add_action('wp_ajax_nopriv_axip_user_create_action', array(&$this, 'axip_user_create_handle')); // need this to serve non logged in users

            add_action('wp_ajax_axip_register_action', array(&$this, 'axip_register_handle'));
            add_action('wp_ajax_nopriv_axip_register_handle', array(&$this, 'axip_register_handle')); // need this to serve non logged in users

            add_action('wp_ajax_axip_contact_action', array(&$this, 'axip_contact_handle'));
            add_action('wp_ajax_nopriv_axip_contact_action', array(&$this, 'axip_contact_handle')); // need this to serve non logged in users

            add_action('wp_ajax_axip_payment_action', array(&$this, 'axip_payment_handle'));
            add_action('wp_ajax_nopriv_axip_payment_action', array(&$this, 'axip_payment_handle')); // need this to serve non logged in users

            add_action('wp_ajax_axip_getwizard_content', array(&$this, 'axip_getwizard_content_handle'));
            add_action('wp_ajax_nopriv_axip_getwizard_content', array(&$this, 'axip_getwizard_content_handle'));

            add_action('wp_ajax_axip_enrolCourse_action', array(&$this, 'axip_enrolCourse_handle'));
            add_action('wp_ajax_nopriv_axip_enrolCourse_action', array(&$this, 'axip_enrolCourse_handle'));

            /*Discounts actions*/

            add_action('wp_ajax_axip_getDiscountsInstance_action', array(&$this, 'axip_getDiscountsInstance_handle'));
            add_action('wp_ajax_nopriv_axip_getDiscountsInstance_action', array(&$this, 'axip_getDiscountsInstance_handle')); // need this to serve non logged in users

            add_action('wp_ajax_axip_getDiscountsCourse_action', array(&$this, 'axip_getDiscountsCourse_handle'));
            add_action('wp_ajax_nopriv_axip_getDiscountsCourse_action', array(&$this, 'axip_getDiscountsCourse_handle'));

            add_action('wp_ajax_axip_calculateDiscount_action', array(&$this, 'axip_calculateDiscount_handle'));
            add_action('wp_ajax_nopriv_axip_calculateDiscount_action', array(&$this, 'axip_calculateDiscount_handle'));

            /*Contact Source*/
            add_action('wp_ajax_axip_contact_source_action', array(&$this, 'axip_contact_source_handle'));
            add_action('wp_ajax_nopriv_axip_contact_source_action', array(&$this, 'axip_contact_source_handle')); // need this to serve non logged in users

            add_action('wp_ajax_axip_get_contact_action', array(&$this, 'axip_get_contact_handle'));
            add_action('wp_ajax_nopriv_axip_get_contact_action', array(&$this, 'axip_get_contact_handle'));

            add_action('wp_ajax_callResource', array(&$this, 'axip_callResource_handle'));
            add_action('wp_ajax_nopriv_callResource', array(&$this, 'axip_callResource_handle'));
            add_action('wp_ajax_callResourceFile', array(&$this, 'axip_callResourceFile_handle'));
            add_action('wp_ajax_nopriv_callResourceFile', array(&$this, 'axip_callResourceFile_handle'));

            /*Use passed in AXTOKEN*/
            add_action('wp_ajax_callResourceAX', array(&$this, 'axip_callResourceAX_handle'));
            add_action('wp_ajax_nopriv_callResourceAX', array(&$this, 'axip_callResourceAX_handle'));

            /*store enrolments*/
            add_action('wp_ajax_store_enrolment', array(&$this, 'axip_store_enrolment_handle'));
            add_action('wp_ajax_nopriv_store_enrolment', array(&$this, 'axip_store_enrolment_handle'));

            /*store post enrol*/
            add_action('wp_ajax_store_post_enrolment', array(&$this, 'axip_store_post_enrolment_handle'));
            add_action('wp_ajax_nopriv_store_post_enrolment', array(&$this, 'axip_store_post_enrolment_handle'));

            /*Enrolment Complete*/
            add_action('wp_ajax_enrolment_complete', array(&$this, 'axip_enrolment_complete_handle'));
            add_action('wp_ajax_nopriv_enrolment_complete', array(&$this, 'axip_enrolment_complete_handle'));

            add_action('wp_ajax_cart_add_item', array($this, 'cart_add_item'));
            add_action('wp_ajax_nopriv_cart_add_item', array($this, 'cart_add_item'));

            add_action('wp_ajax_cart_remove_item', array($this, 'cart_remove_item'));
            add_action('wp_ajax_nopriv_cart_remove_item', array($this, 'cart_remove_item'));

            add_action('wp_ajax_cart_get_items', array($this, 'cart_get_items'));
            add_action('wp_ajax_nopriv_cart_get_items', array($this, 'cart_get_items'));

            /*EPAYMENT */
            add_action('wp_ajax_epayment_process', array($this, 'ax_epayment_process'));
            add_action('wp_ajax_nopriv_epayment_process', array($this, 'ax_epayment_process'));

            add_action('wp_ajax_epayment_check_status', array($this, 'ax_epayment_check_status'));
            add_action('wp_ajax_nopriv_epayment_check_status', array($this, 'ax_epayment_check_status'));

            add_action('wp_ajax_epayment_next_step', array($this, 'ax_epayment_next_step'));
            add_action('wp_ajax_nopriv_epayment_next_step', array($this, 'ax_epayment_next_step'));

            /**AUTO GENERATE**/

            add_action('wp_ajax_ax_auto_generate', array($this, 'ax_auto_generate'));
            add_action('wp_ajax_nopriv_ax_auto_generate', array($this, 'ax_auto_generate'));

            add_action('wp_ajax_request_validation_email', array($this, 'axip_request_validation_email'));
            add_action('wp_ajax_nopriv_request_validation_email', array($this, 'axip_request_validation_email'));

            add_action('wp_ajax_ax_confirm_enrolment', array($this, 'axip_confirm_enrolment'));
            add_action('wp_ajax_nopriv_ax_confirm_enrolment', array($this, 'axip_confirm_enrolment'));

            /**NEW LOGIN**/

            add_action('wp_ajax_ax_login', array($this, 'ax_login_handle'));
            add_action('wp_ajax_nopriv_ax_login', array($this, 'ax_login_handle'));

            add_action('wp_ajax_ax_logout', array($this, 'ax_logout_handle'));
            add_action('wp_ajax_nopriv_ax_logout', array($this, 'ax_logout_handle'));

            add_action('wp_ajax_ax_new_contact_user', array($this, 'ax_new_contact_user'));
            add_action('wp_ajax_nopriv_ax_new_contact_user', array($this, 'ax_new_contact_user'));

            add_action('wp_ajax_ax_forgot', array($this, 'ax_forgot_handle'));
            add_action('wp_ajax_nopriv_ax_forgot', array($this, 'ax_forgot_handle'));

            add_action('wp_ajax_ax_check_for_user', array($this, 'check_for_user'));
            add_action('wp_ajax_nopriv_ax_check_for_user', array($this, 'check_for_user'));

            add_action('wp_ajax_ax_trigger_resumption', array($this, 'axip_send_resumption_link'));
            add_action('wp_ajax_nopriv_ax_trigger_resumption', array($this, 'axip_send_resumption_link'));

            add_action('wp_ajax_ax_retrieve_abn_org', array($this, 'ax_retrieve_abn_org'));
            add_action('wp_ajax_nopriv_ax_retrieve_abn_org', array($this, 'ax_retrieve_abn_org'));

            add_action('wp_ajax_ax_update_org_abn', array($this, 'ax_update_org_abn'));
            add_action('wp_ajax_nopriv_ax_update_org_abn', array($this, 'ax_update_org_abn'));

        }

        public function cart_add_item()
        {
            if (defined('AXIP_NONCE_GENERATION')) {
                if (true == AXIP_NONCE_GENERATION) {
                    /* check_ajax_referer(
                'ax_enroller', 'security'
                ); */
                }
            }
            /*note - while on the same page $_COOKIE will not reflect the previous update*/
            if (isset($_COOKIE['ax_shop_cart'])) {
                $cartCookie = json_decode(stripslashes($_COOKIE['ax_shop_cart']), true);
            } else {
                $cartCookie = array();
            }

            $item = $_POST['item'];
            $item_id = $_POST['item_id'];
            if (!empty($_POST['full_cookie'])) {
                $cartCookie = $_POST['full_cookie'];
            }

            if (!in_array($item_id, $cartCookie)) {
                $cartCookie[$item_id] = $item;
            }
            $updatedCookie = json_encode($cartCookie, true);
            setcookie('ax_shop_cart', $updatedCookie, time() + 2 * 60 * 60 * 24, COOKIEPATH, COOKIE_DOMAIN);
            echo $updatedCookie;
            die();
        }

        public function cart_remove_item()
        {
            if (defined('AXIP_NONCE_GENERATION')) {
                if (true == AXIP_NONCE_GENERATION) {
                    /* check_ajax_referer(
                'ax_enroller', 'security'
                ); */
                }
            }
            /*note - while on the same page $_COOKIE will not reflect the previous update*/
            if (isset($_COOKIE['ax_shop_cart'])) {
                $cartCookie = json_decode(stripslashes($_COOKIE['ax_shop_cart']), true);
            } else {
                $cartCookie = array();
            }
            if (!empty($_POST['wipe_cookie'])) {
                $cartCookie = array();
            } else {
                $item = $_POST['item'];
                $item_id = $_POST['item_id'];
                if (!empty($_POST['full_cookie'])) {
                    $cartCookie = $_POST['full_cookie'];
                }
                if (key_exists($item_id, $cartCookie)) {
                    unset($cartCookie[$item_id]);
                }
            }

            $updatedCookie = json_encode($cartCookie, true);
            setcookie('ax_shop_cart', $updatedCookie, time() + 2 * 60 * 60 * 24, COOKIEPATH, COOKIE_DOMAIN);
            echo $updatedCookie;
            die();
        }

        public function cart_get_items()
        {
            if (defined('AXIP_NONCE_GENERATION')) {
                if (true == AXIP_NONCE_GENERATION) {
                    /* check_ajax_referer(
                'ax_enroller', 'security'
                ); */
                }
            }
            /*note - while on the same page $_COOKIE will not reflect the previous update*/
            if (isset($_COOKIE['ax_shop_cart'])) {
                $cartCookie = json_decode(stripslashes($_COOKIE['ax_shop_cart']), true);
            } else {
                $cartCookie = array();
            }

            echo json_encode($cartCookie);
            die();
        }

        public function axip_getwizard_content_handle()
        {

            global $AxcelerateAPI, $courseType, $instanceID, $paymentAmount, $learningActivity, $axipCookie;

            $step_number = sanitize_text_field($_REQUEST["step_number"]);
            $stepName = sanitize_text_field($_REQUEST["stepName"]);
            $postID = sanitize_text_field($_REQUEST["postID"]);

            $data = ($_REQUEST['data']);

            $cookies = urldecode($_REQUEST['cookie']);
            $cookies = explode(';', $cookies);
            $axipCookie = array();

            foreach ($cookies as $cookie) {
                $cdata = explode('=', $cookie);
                $axipCookie[trim($cdata[0])] = trim($cdata[1]);
            }

            $instanceID = sanitize_text_field($data['instanceID']);
            $courseType = sanitize_text_field($data['type']);
            $ID = sanitize_text_field($data['ID']);
            $newenrolment = sanitize_text_field($data['newenrolment']);

            $paymentAmount = sanitize_text_field($_REQUEST["paymentAmount"]);

            global $axip_contact_personal, $axip_avetmiss_additional, $formSettings;

            $formSettings = get_post_meta($postID, '_axip_enrolment_formsettings', true);

            if ($stepName == "Login") {
                require_once AXIP_PLUGIN_DIR . 'template/include/loginForm.php';
            } elseif ($stepName == "User") {
                require_once AXIP_PLUGIN_DIR . 'template/include/userLogin.php';
            } elseif ($stepName == "Register") {
                require_once AXIP_PLUGIN_DIR . 'template/include/signUpForm.php';
            } elseif ($stepName == "Student Details") {
                $axip_contact_personal = get_post_meta($postID, '_axip_enrolment_contact_personal', true);

                $axip_avetmiss_additional = get_post_meta($postID, '_axip_enrolment_avetmiss_additional', true);

                require_once AXIP_PLUGIN_DIR . 'template/include/contactForm.php';
            } elseif ($stepName == "Invoice") {
                require_once AXIP_PLUGIN_DIR . 'template/include/invoiceForm.php';
            } elseif ($stepName == "Payment") {
                require_once AXIP_PLUGIN_DIR . 'template/include/paymentForm.php';
            }

            die();
        }

        public function axip_getcalendar_handle()
        {

            global $AxcelerateAPI;

            $type = $_POST['type'];
            $year = $_POST['year'];
            $monthFrom = $_POST['monthFrom'];
            $monthTo = $_POST['monthTo'];
            $location = $_POST['location'];

            $calendarData = $AxcelerateAPI->getCalendarData($monthFrom, $monthTo, $year, $location, $type);

            echo json_encode($calendarData);

            die();
        }

        public function axip_login_handle()
        {

            global $AxcelerateAPI;

            $email = $_POST['email'];
            $password = $_POST['password'];

            $result = $AxcelerateAPI->lookupUser($email, $password);

            echo json_encode($result);

            die();
        }

        public function axip_user_login_handle()
        {

            global $AxcelerateAPI;

            $username = $_POST['username'];
            $password = $_POST['password'];

            $result = $AxcelerateAPI->userLogin($username, $password);

            echo json_encode($result);

            die();
        }

        public function axip_user_reset_handle()
        {

            global $AxcelerateAPI;

            $username = $_POST['username'];
            $email = $_POST['email'];

            $result = $AxcelerateAPI->userReset($username, $email);

            echo json_encode($result);

            die();
        }

        public function axip_user_create_handle()
        {

            global $AxcelerateAPI;

            $username = $_POST['username'];
            $contactID = $_POST['contactID'];

            $result = $AxcelerateAPI->createUser($username, $contactID);

            echo json_encode($result);

            die();
        }

        public function axip_register_handle()
        {

            global $AxcelerateAPI;

            die();
        }

        /*Discounts*/

        public function axip_getDiscountsInstance_handle()
        {
            global $AxcelerateAPI;

            $status = 'ACTIVE';
            $discountTypeID = $_POST['discountTypeID'];
            $type = $_POST['type'];
            $instanceID = $_POST['instanceID'];

            $result = $AxcelerateAPI->getDiscountsInstance($status, $discountTypeID, $type, $instanceID);

            echo json_encode($result);

            die();
        }

        public function axip_getDiscountsCourse_handle()
        {
            global $AxcelerateAPI;

            $status = 'ACTIVE';
            $discountTypeID = $_POST['discountTypeID'];
            $type = $_POST['type'];
            $ID = $_POST['ID'];

            $result = $AxcelerateAPI->getDiscountsCourse($status, $discountTypeID, $type, $ID);
            echo json_encode($result);

            die();
        }
        public function axip_calculateDiscount_handle()
        {
            global $AxcelerateAPI;

            $contactID = $_POST['contactID'];
            $type = $_POST['type'];
            $instanceID = $_POST['instanceID'];
            $originalPrice = $_POST['originalPrice'];
            $groupBookingSize = $_POST['GroupBookingSize'];
            $promoCode = $_POST['promoCode'];
            $ConcessionDiscountIDs = $_POST['concessionDiscountIDs'];
            $result = $AxcelerateAPI->calculateDiscount($contactID, $type, $instanceID, $originalPrice, $groupBookingSize, $promoCode, $ConcessionDiscountIDs);
            echo json_encode($result);

            die();
        }

        /*Contact Source*/
        public function axip_contact_source_handle()
        {
            global $AxcelerateAPI;

            $result = $AxcelerateAPI->getContactSources();

            echo json_encode($result);

            die();
        }

        public function axip_contact_handle()
        {

            global $AxcelerateAPI;
            if (!session_id()) {
                session_start();
            }
            if (wp_verify_nonce($_POST['axcelerate_enquiry_form'], 'axcelerate_enquiry_form')) {
                // personal details
                $captchaPrefix = sanitize_text_field($_POST['captchaPrefix']);
                $captchavalue = sanitize_text_field($_POST['captchavalue']);

                if (!empty($captchaPrefix)) {
                    $captcha_instance = new ReallySimpleCaptcha();

                    $correct = $captcha_instance->check($captchaPrefix, $captchavalue);

                    if (empty($correct)) {
                        echo json_encode(array('error' => 1, 'message' => 'Please enter the correct Captcha code.'));

                        die(0);
                    }
                }

                $formData = array();
                $formData['givenName'] = sanitize_text_field($_POST['axip_given_name']);
                $formData['middleName'] = sanitize_text_field($_POST['axip_middle_name']);
                $formData['pname'] = sanitize_text_field($_POST['axip_preferred_name']);
                $formData['surname'] = sanitize_text_field($_POST['axip_last_name']);
                $formData['emailAddress'] = sanitize_text_field($_POST['axip_email']);
                $formData['password'] = sanitize_text_field($_POST['axip_password']);

                $formData['dob'] = sanitize_text_field($_POST['axip_dob']);
                $formData['sex'] = sanitize_text_field($_POST['axip_sex']);
                $formData['phone'] = sanitize_text_field($_POST['axip_home_phone']);
                $formData['organisation'] = sanitize_text_field($_POST['axip_organisation']);

                $formData['ANZSCOCode'] = sanitize_text_field($_POST['axip_occupation_identifier']);
                $formData['ANZSICCode'] = sanitize_text_field($_POST['axip_industry_of_employment']);

                $formData['position'] = sanitize_text_field($_POST['axip_position']);
                $formData['wphone'] = sanitize_text_field($_POST['axip_work_phone']);
                $formData['mphone'] = sanitize_text_field($_POST['axip_mobile_phone']);
                $formData['fax'] = sanitize_text_field($_POST['axip_fax']);

                $formData['USI'] = sanitize_text_field($_POST['axip_usi']);
                $formData['cityOfBirth'] = sanitize_text_field($_POST['axip_city_of_birth']);
                $formData['LUInum'] = sanitize_text_field($_POST['axip_lui']);

                // Emergency contact
                $formData['EmergencyContact'] = sanitize_text_field($_POST['axip_emergency_contact_name']);
                $formData['EmergencyContactRelation'] = sanitize_text_field($_POST['axip_emergency_contact_relationship']);
                $formData['EmergencyContactPhone'] = sanitize_text_field($_POST['axip_emergency_contact_phone']);

                // Street address
                $formData['saddress1'] = sanitize_text_field($_POST['axip_street_address1']);
                $formData['saddress2'] = sanitize_text_field($_POST['axip_street_address2']);
                $formData['scity'] = sanitize_text_field($_POST['axip_street_city']);
                $formData['sstate'] = sanitize_text_field($_POST['axip_street_state']);
                $formData['spostcode'] = sanitize_text_field($_POST['axip_street_postcode']);
                $formData['scountry'] = sanitize_text_field($_POST['axip_street_country']);

                if (empty($_POST['same_as_street_address'])) {
                    $formData['address1'] = sanitize_text_field($_POST['axip_street_address1']);
                    $formData['address2'] = sanitize_text_field($_POST['axip_street_address2']);
                    $formData['city'] = sanitize_text_field($_POST['axip_street_city']);
                    $formData['state'] = sanitize_text_field($_POST['axip_street_state']);
                    $formData['postcode'] = sanitize_text_field($_POST['axip_street_postcode']);
                    $formData['country'] = sanitize_text_field($_POST['axip_street_country']);
                } else {
                    $formData['address1'] = sanitize_text_field($_POST['axip_postal_address1']);
                    $formData['address2'] = sanitize_text_field($_POST['axip_postal_address2']);
                    $formData['city'] = sanitize_text_field($_POST['axip_postal_city']);
                    $formData['state'] = sanitize_text_field($_POST['axip_postal_state']);
                    $formData['postcode'] = sanitize_text_field($_POST['axip_postal_postcode']);
                    $formData['country'] = sanitize_text_field($_POST['axip_postal_country']);
                }

                // Citizenship (only country of birth is avetmiss)

                $formData['CountryofBirthID'] = sanitize_text_field($_POST['axip_citizenship_birthcountry']);
                $formData['CountryofCitizenID'] = sanitize_text_field($_POST['axip_citizenship_country']);
                $formData['CitizenStatus'] = sanitize_text_field($_POST['axip_citizenship_status']);

                // Language

                $formData['MainLanguageID'] = sanitize_text_field($_POST['axip_language']);
                $formData['EnglishProficiencyID'] = sanitize_text_field($_POST['axip_language_fluency']);
                $formData['EnglishAssistanceFlag'] = sanitize_text_field($_POST['axip_language_assistance']);

                // Education

                $formData['HighestSchoolLevelID'] = sanitize_text_field($_POST['axip_education_level']);
                $formData['HighestSchoolLevelYear'] = sanitize_text_field($_POST['axip_education_level_year']);
                $formData['AtSchoolFlag'] = (bool) sanitize_text_field($_POST['axip_education_school']);
                $formData['AtSchoolName'] = sanitize_text_field($_POST['axip_education_school_name']);

                /* The following field has no effect via the API
                 * $formData['PriorEducationStatus']      = (bool) sanitize_text_field( $_POST['axip_education_prior'] ) ;
                 */

                /*
                 * If categories exist in the data, and axip_category_option either does not exist or is 1 (YES) then include them.
                 */
                if (isset($_POST['axip_categoryids'])) {
                    if (isset($_POST['axip_category_option'])) {
                        if ($_POST['axip_category_option'] == '1') {
                            $formData['categoryIDs'] = sanitize_text_field($_POST['axip_categoryids']);
                        }
                    } else {
                        $formData['categoryIDs'] = sanitize_text_field($_POST['axip_categoryids']);
                    }
                }

                if (isset($_POST['axip_education_prior_pair']) && is_array($_POST['axip_education_prior_pair'])) {
                    $formData['PriorEducationIDs'] = implode(',', $_POST['axip_education_prior_pair']);
                }

                // Additional Details

                $formData['LabourForceID'] = sanitize_text_field($_POST['axip_employment']);
                $formData['DisabilityFlag'] = sanitize_text_field($_POST['axip_disability_status']);

                if (isset($_POST['axip_disability_type']) && is_array($_POST['axip_disability_type'])) {
                    $formData['DisabilityTypeIDs'] = implode(',', $_POST['axip_disability_type']);
                }

                $formData['IndigenousStatusID'] = sanitize_text_field($_POST['axip_aboriginal_tsi_status']);
                $formData['SourceCodeID'] = sanitize_text_field($_POST['axip_contact_source']);

                $learningActivity = sanitize_text_field($_POST['learningActivity']);
                $learningActivityID = sanitize_text_field($_POST['learningActivityID']);

                $formType = sanitize_text_field($_POST['formType']);

                $formData = array_filter($formData);

                if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > 60)) {
                    session_unset();
                    session_destroy();

                    session_start();
                }

                if (isset($_SESSION['last_contact'])) {
                    $value = $_SESSION['last_contact'];
                } else {
                    $value = '';
                }

                $formToHash = http_build_query($formData);

                if ($formToHash == $value) {
                    echo json_encode(array('error' => 1, 'message' => 'Duplicate Submission', 'form' => $formToHash, 'oldform' => $value));
                } else {
                    $_SESSION['last_contact'] = $formToHash;
                    $_SESSION['LAST_ACTIVITY'] = time();
                    $contactResponse = $AxcelerateAPI->createContact($formData);

                    $Response = array('contact' => $contactResponse);

                    if (isset($contactResponse->CONTACTID) && $formType == "enquiry") {
                        $contactID = $contactResponse->CONTACTID;
                        $noteCodeID = sanitize_text_field($_POST['noteCodeID']);
                        $comments = sanitize_text_field($_POST['axip_comments']);
                        $type = sanitize_text_field($_POST['type']);
                        $ID = sanitize_text_field($_POST['ID']);
                        $emailTo = sanitize_text_field($_POST['emailTo']);

                        $enquiryReponse = $AxcelerateAPI->enquireForContact($contactID, $noteCodeID, $comments, $type, $ID, $emailTo);

                        $Response['enquiry'] = $enquiryReponse;
                    }

                    echo json_encode($Response);
                }
            } else {
                echo json_encode(array('error' => 1, 'message' => 'wrong form'));
            }

            die();
        }

        public function axip_payment_handle()
        {

            global $AxcelerateAPI;

            $paymentAmount = sanitize_text_field($_POST['paymentAmount']);
            $contactID = sanitize_text_field($_POST['studenContactIDs']);
            $payerID = sanitize_text_field($_POST['payerID']);
            $instanceID = sanitize_text_field($_POST['instanceID']);
            $type = sanitize_text_field($_POST['courseType']);
            $nameOnCard = sanitize_text_field($_POST['nameOnCard']);
            $cardNumber = sanitize_text_field($_POST['cardNumber']);
            $cardType = sanitize_text_field($_POST['cardType']);
            $cardCCV = sanitize_text_field($_POST['cardCCV']);
            $expiryMonth = sanitize_text_field($_POST['expiryMonth']);
            $expiryYear = sanitize_text_field($_POST['expiryYear']);

            $customerIP = $_SERVER['REMOTE_ADDR'];

            $discountIDList = null;
            if (isset($_POST['discountIDList'])) {
                $discountIDList = sanitize_text_field($_POST['discountIDList']);
            }
            $discountCost = null;
            if (isset($_POST['discountCost'])) {
                $discountCost = sanitize_text_field($_POST['discountCost']);
            }

            $StudyReasonID = null;
            if (isset($_POST['StudyReasonID'])) {
                $StudyReasonID = $_POST['StudyReasonID'];
            }

            $finCodeID = null;
            if (isset($_POST['finCodeID'])) {
                $finCodeID = $_POST['finCodeID'];
            }

            $Response = array();

            $Response['payment'] = $AxcelerateAPI->processPayment($paymentAmount, $contactID, $payerID, $instanceID, $type, $nameOnCard, $cardNumber, $cardType, $cardCCV, $expiryMonth, $expiryYear, $customerIP, $finCodeID);

            if (!empty($Response['payment']->INVOICEID)) {
                $Response['payment']->STATUS = true;
                $invoiceID = $Response['payment']->INVOICEID;

                $Response['enrolment'] = $AxcelerateAPI->enrolContact($contactID, $instanceID, $payerID, $type, $invoiceID, $StudyReasonID, $discountCost, $discountIDList, $generateInvoice = 1, $finCodeID);
            } else {
                $Response['payment']->STATUS = false;
            }

            echo json_encode($Response);

            die();
        }

        public function axip_enrolCourse_handle()
        {

            global $AxcelerateAPI;

            $contactID = sanitize_text_field($_POST['contactID']);
            $payerID = sanitize_text_field($_POST['payerID']);
            $instanceID = sanitize_text_field($_POST['instanceID']);
            $type = sanitize_text_field($_POST['courseType']);
            $invoiceID = (!empty($_POST['invoiceID']) ? sanitize_text_field($_POST['invoiceID']) : 0);

            $discountIDList = sanitize_text_field($_POST['discountIDList']);
            $discountCost = sanitize_text_field($_POST['discountCost']);

            $generateInvoice = 1;
            $StudyReasonID = null;
            /*use isset for invoice as 0 is treated as empty*/
            if (isset($_POST['generateInvoice'])) {
                $generateInvoice = $_POST['generateInvoice'];
            }
            if (isset($_POST['StudyReasonID'])) {
                $StudyReasonID = $_POST['StudyReasonID'];
            }
            $finCodeID = null;
            if (isset($_POST['finCodeID'])) {
                $finCodeID = $_POST['finCodeID'];
            }

            $Response = $AxcelerateAPI->enrolContact($contactID, $instanceID, $payerID, $type, $invoiceID, $StudyReasonID, $discountCost, $discountIDList, $generateInvoice, $finCodeID);

            echo json_encode($Response);

            die();
        }

        /*New Code for the Enroller Widget*/
        public function axip_callResource_handle()
        {
            global $AxcelerateAPI;
            $params = array();
            $method = $_POST['method'];
            $endpoint = $_POST['endpoint'];

            //if calling via the settings page then bypass the check by validating a special nonce
            //This allows test connection to continue working.
            $settingsPageBypass = false;
            if (isset($_POST['setting_nonce'])) {

                if (wp_verify_nonce($_POST['setting_nonce'], 'ax_settings')) {
                    $settingsPageBypass = true;
                }
            }

            if (defined('AXIP_NONCE_GENERATION')) {
                if (true == AXIP_NONCE_GENERATION) {
                    check_ajax_referer(
                        'ax_enroller',
                        'security'
                    );
                }
            }

            foreach ($_POST as $key => $value) {
                if ($key != "method" && $key != "action" && $key != "endpoint" && $key != "security") {
                    if (is_string($value)) {
                        $params[$key] = stripslashes($value);
                    } else {
                        $params[$key] = $value;
                    }

                }
            }

            if (!empty($_POST['performValidationCheck'])) {
                $checkParams = array();
                $checkParams['emailAddress'] = $params['EMAILADDRESS'];
                $checkParams['displayLength'] = 1;
                $requestValidation = $this->axip_request_validation_email($checkParams, $_POST['enrolment_details']);

                if (!empty($requestValidation)) {
                    echo json_encode($requestValidation);
                    die();
                } else {
                    unset($params['performValidationCheck']);
                    unset($params['enrolment_details']);

                }
            }

            $Response = $AxcelerateAPI->callResource($params, $endpoint, $method);

            if (defined('AXIP_SESSION_GENERATION')) {
                if (true == AXIP_SESSION_GENERATION && empty($_POST['ax_session'])) {
                    if (isset($_SESSION['AXTOKEN']) && isset($_SESSION['CONTACTID'])) {
                        $sessionRecord = AX_Session_Security::setupSession($_SESSION['CONTACTID'], $_SERVER['REMOTE_ADDR']);

                        // Ony update response object if it's not an array.
                        if (is_object($Response)) {
                            $Response->session = $sessionRecord;
                        }

                        $_POST['ax_session'] = $sessionRecord;
                    }
                }
            }

            if (!empty($Response->AXTOKEN)) {

                $sessions_enabled = get_option('ax_global_login', 0) == 1;
                if ($sessions_enabled) {

                    $_SESSION['AXTOKEN'] = $Response->AXTOKEN;
                    $_SESSION['CONTACTID'] = $Response->CONTACTID;
                    $_SESSION['UNAME'] = $Response->USERNAME;
                    $_SESSION['ROLETYPE'] = $Response->ROLETYPEID;
                    $_SESSION['EXPIRES'] = time() + (60 * 60);
                }

            }

            if (defined('AXIP_SESSION_GENERATION')) {
                if (true == AXIP_SESSION_GENERATION && !$settingsPageBypass) {

                    if (empty($_POST['ax_session'])) {
                        $requiresSession = AX_Session_Security::endpointRequireSession($endpoint, $method);
                        //$Response->endPoint = $requiresSession;
                        $IP = $_SERVER['REMOTE_ADDR'];

                        if (!empty($requiresSession)) {

                            //Create new session
                            if ($requiresSession == "/user/login") {

                                if (!empty($Response) && $Response instanceof stdClass) {
                                    if (!empty($Response->CONTACTID)) {
                                        $sessionRecord = AX_Session_Security::setupSession($Response->CONTACTID, $_SERVER['REMOTE_ADDR']);
                                        $Response->session = $sessionRecord;
                                    }
                                }

                            } else if ($requiresSession == "/contact/") {

                                if (!empty($Response) && $Response instanceof stdClass) {
                                    if (!empty($Response->CONTACTID)) {
                                        $sessionRecord = AX_Session_Security::setupSession($Response->CONTACTID, $_SERVER['REMOTE_ADDR']);
                                        $Response->session = $sessionRecord;
                                    }
                                }

                            }
                        } else {
                            $checkEndpoints = AX_Session_Security::endpointRequireCheck($endpoint, $method);
                            if (!empty($checkEndpoints)) {
                                echo json_encode(array());
                                die();
                            }
                        }
                    } else {
                        //Session exists - check that they are allowed access / update access
                        $requiresSession = AX_Session_Security::endpointRequireSession($endpoint, $method, true);
                        if (!empty($requiresSession)) {
                            if ($requiresSession == "/contact/") {
                                if (!empty($Response) && $Response instanceof stdClass) {
                                    if (!empty($Response->CONTACTID)) {
                                        $updateSession = AX_Session_Security::addAllowedContact($_POST['ax_session'], $Response->CONTACTID);
                                    }
                                }
                            } else if ($requiresSession == "/contacts/search") {
                                if (is_array($Response)) {
                                    if ($Response) {
                                        foreach ($Response as $contact) {
                                            if ($contact instanceof stdClass) {
                                                if (!empty($contact->CONTACTID)) {
                                                    $allowed = AX_Session_Security::canSeeContact($_POST['ax_session'], $contact->CONTACTID);

                                                    if (empty($allowed)) {
                                                        echo json_encode(array());
                                                        die();
                                                    }
                                                }

                                            }

                                        }
                                    }
                                }
                            }
                        }

                    }

                }

                echo json_encode($Response);
                die();
            }

        }
        public function axip_checkForExistingContact($params)
        {

            return json_encode($existing);
        }

        public function axip_callResourceAX_handle()
        {

            global $AxcelerateAPI;
            $params = array();
            $method = $_POST['method'];
            $endpoint = $_POST['endpoint'];
            $axtoken = $_POST['AXTOKEN'];

            foreach ($_POST as $key => $value) {
                if ($key != "method" && $key != "action" && $key != "endpoint" && $key != "AXTOKEN") {
                    if (is_string($value)) {
                        $params[$key] = stripslashes($value);
                    } else {
                        $params[$key] = $value;
                    }
                }
            }
            $continue = true;
            if (isset($_POST['AXTOKEN'])) {
                if (empty($_POST['AXTOKEN'])) {
                    self::axip_callResource_handle();
                    $continue = false;
                }
            } else {
                self::axip_callResource_handle();
                $continue = false;
            }
            if ($continue) {

                global $AxcelerateAPI;
                $params = array();
                $method = $_POST['method'];
                $endpoint = $_POST['endpoint'];
                $axtoken = $_POST['AXTOKEN'];

                if (defined('AXIP_NONCE_GENERATION')) {
                    if (true == AXIP_NONCE_GENERATION) {
                        check_ajax_referer(
                            'ax_enroller',
                            'security'
                        );
                    }
                }

                foreach ($_POST as $key => $value) {
                    if ($key != "method" && $key != "action" && $key != "endpoint" && $key != "AXTOKEN" && $key != 'security') {
                        $params[$key] = stripslashes($value);
                    }
                }

                if (!empty($_POST['performValidationCheck'])) {
                    $checkParams = array();
                    $checkParams['emailAddress'] = $params['EMAILADDRESS'];
                    $checkParams['displayLength'] = 1;
                    $test = $this->axip_request_validation_email($checkParams, $params['enrolment_details']);

                    if (!empty($test)) {
                        echo json_encode($test);
                        die();
                    } else {
                        unset($params['performValidationCheck']);
                        unset($params['enrolment_details']);
                        $Response = $AxcelerateAPI->callResourceAX($params, $endpoint, $method, $axtoken);
                        echo json_encode($Response);
                        die();
                    }
                }

                //Mixed thoughts on using the session security here, not really needed.
                //Except maybe in the case of resumption.

                $Response = $AxcelerateAPI->callResourceAX($params, $endpoint, $method, $axtoken);
                echo json_encode($Response);
                die();
            }
        }

        public function axip_callResourceFile_handle()
        {

            global $AxcelerateAPI;
            $params = array();
            $method = $_POST['method'];
            $endpoint = $_POST['endpoint'];

            foreach ($_POST["params"] as $key => $value) {
                if ($key != "method" && $key != "action" && $key != "endpoint") {
                    $params[$key] = $value;
                }
            }

            $Response = $AxcelerateAPI->callResourceFile($params, $endpoint, $method);
            echo json_encode($Response);
            die();
        }

        public function check_for_user()
        {

            if (defined('AXIP_NONCE_GENERATION')) {
                if (true == AXIP_NONCE_GENERATION) {
                    check_ajax_referer(
                        'ax_enroller',
                        'security'
                    );
                }
            }

            $contactID = $_REQUEST['contact_id'];

            global $AxcelerateAPI;

            $Response = $AxcelerateAPI->callResource(array('contactID' => $contactID), 'users', 'POST');

            if (is_object($Response)) {
                error_log(print_r($Response, true));
            } else {
                if (isset($Response[0])) {
                    if (isset($Response[0]->CONTACTID)) {
                        echo json_encode(array('has_user' => true));
                        die();
                    } else {
                        echo json_encode(array('has_user' => false));
                        die();
                    }
                } else {
                    echo json_encode(array('has_user' => false));
                    die();
                }
            }
            echo json_encode(array('error' => true));
            die();
        }

        public function axip_get_contact_handle()
        {
            global $AxcelerateAPI;

            $contactID = sanitize_text_field($_POST['contactID']);

            $Response = $AxcelerateAPI->getContact($contactID);
            echo json_encode($Response);

            die();
        }
        public function axip_store_enrolment_handle()
        {
            $params = array();
            if (defined('AXIP_NONCE_GENERATION')) {
                if (true == AXIP_NONCE_GENERATION) {
                    check_ajax_referer(
                        'ax_enroller',
                        'security'
                    );
                }
            }

            foreach ($_POST as $key => $value) {
                if ($key != "action" && $key != "security") {
                    $params[$key] = $value;
                }
            }

            $user = $params['user_contact_id'];
            $time = current_time('mysql');
            $params['time'] = $time;
            if (!empty($_POST['enrolment_hash'])) {
                $hashedToken = $_POST['enrolment_hash'];
            } else {
                $invoice = 0;
                if (key_exists('invoice_id', $params)) {
                    $invoice = $params['invoice_id'];
                }

                $tokenToHash = $user;
                if (!empty($invoice)) {
                    $tokenToHash = $tokenToHash . '_' . $invoice;
                }

                $hashedToken = wp_hash($tokenToHash . '_' . $time);
            }

            if (!empty($_POST['is_enquiry'])) {
                $params['is_enquiry'] = true;
            }

            if (key_exists('course', $params)) {

                AX_Enrolments::store_enrolment_hash_reference(
                    $hashedToken,
                    $params['contact_id'],
                    $params['course']['INSTANCEID'],
                    $params['course']['TYPE']
                );
            }
            if (key_exists('enrolments', $params)) {
                foreach ($params['enrolments'] as $contactID => $enrolments) {
                    foreach ($enrolments as $key => $enrolment) {
                        if ($key !== "CONTACT_NAME") {
                            AX_Enrolments::store_enrolment_hash_reference(
                                $hashedToken,
                                $contactID,
                                $enrolment['instanceID'],
                                $enrolment['type']
                            );
                        }

                    }
                }
            }

            /* NOTE: Transient IDs can only be 45 characters in length in versions older than 4.3. This will generate 41*/
            set_transient('ax_enrol_' . $hashedToken, $params, 5 * DAY_IN_SECONDS);

            $storedVal = get_transient('ax_enrol_' . $hashedToken);
            $Response = array('TOKEN' => $hashedToken, 'DATA' => $storedVal);
            echo json_encode($Response);
            die();
        }

        public function axip_request_validation_email($checkParams, $enrolmentDetails)
        {
            global $AxcelerateAPI;
            $existing = $AxcelerateAPI->callResource($checkParams, "/contacts/search/", 'GET');

            if (!empty($existing)) {
                $contactID = $existing[0]->CONTACTID;
                $time = current_time('mysql');
                $tokenToHash = $contactID;
                $hashedToken = wp_hash($tokenToHash . '_' . $time);

                $enrolment = array();
                foreach ($enrolmentDetails as $key => $value) {
                    $enrolment[$key] = $value;
                }
                $enrolment['user_contact_id'] = $contactID;
                $enrolment['contact_id'] = $contactID;
                $enrolment['payer_id'] = $contactID;

                if (defined('AXIP_SESSION_GENERATION')) {
                    if (true == AXIP_SESSION_GENERATION) {
                        $IP = $_SERVER['REMOTE_ADDR'];
                        $session = AX_Session_Security::setupSession($contactID, $IP);
                        if (is_array($session)) {
                            $enrolment['ax_session'] = $session['session_id'];
                        }
                    }
                }

                set_transient('ax_enrol_' . $hashedToken, $enrolment, 5 * DAY_IN_SECONDS);
                $storedVal = get_transient('ax_enrol_' . $hashedToken);

                if (!empty($storedVal)) {
                    AX_Enrolments::sendReminder($hashedToken);
                }

                return array('existing_contact' => true);
            }
            return false;

            //Search for contact via email.

            //Create enrolment record with contact id

            //once hash is generated, fire the new send reminder function.

            //Return data to trigger callback/disable form or just alert.

        }

        public function axip_send_resumption_link()
        {
            if (defined('AXIP_NONCE_GENERATION')) {
                if (true == AXIP_NONCE_GENERATION) {
                    check_ajax_referer(
                        'ax_enroller',
                        'security'
                    );
                }
            }

            $enrolment_hash = $_REQUEST['enrolment_hash'];
            if (!empty($enrolment_hash)) {
                AX_Enrolments::sendReminder($enrolment_hash);

                echo json_encode(array('success' => true));
                die();

            } else {
                echo json_encode(array('error' => 'no_hash'));
                die();
            }
        }

        public function axip_store_post_enrolment_handle()
        {
            $params = array();
            if (defined('AXIP_NONCE_GENERATION')) {
                if (true == AXIP_NONCE_GENERATION) {
                    check_ajax_referer(
                        'ax_enroller',
                        'security'
                    );
                }
            }
            foreach ($_POST as $key => $value) {
                if ($key != "action" && $key != "security") {
                    $params[$key] = $value;
                }
            }

            $time = current_time('mysql');
            $params['time'] = $time;
            if (!empty($_POST['post_enrol_hash'])) {
                $hashedToken = $_POST['post_enrol_hash'];
            } else {
                $user = intval($params['user_contact_id'], 10);
                $tokenToHash = $user . '_' . $params['config_id'];
                $hashedToken = wp_hash($tokenToHash);
            }
            /*Check for multiple enrolments*/
            $multi_enrol = false;
            if (!empty($_POST['enrolment_hash'])) {
                $enrolment = AX_Enrolments::getEnrolmentByID($_POST['enrolment_hash']);
                if ($enrolment != null) {
                    $contactList = AX_Enrolments::getEnrolmentContactList($enrolment);
                    if (!empty($contactList)) {
                        $multi_enrol = true;
                        $Response = array();
                        foreach ($contactList as $row) {
                            /*clone array NOT reference*/
                            $newParams = $params;
                            $contactID = intval($row['CONTACTID'], 10);
                            $tokenToHash = $contactID . '_' . $params['config_id'];
                            $newParams['user_contact_id'] = $contactID;
                            if ($contactID == $user) {
                                $newParams['return_url'] = $params['url_with_string'];
                            } else {
                                /*clear the enrolment hash as this contact is not the original enroller*/
                                unset($newParams['enrolment_hash']);
                            }
                            $hashedToken = wp_hash($tokenToHash);
                            set_transient('ax_post_enrol_' . $hashedToken, $newParams, DAY_IN_SECONDS);
                            $storedVal = get_transient('ax_post_enrol_' . $hashedToken);
                            $Response[] = array('TOKEN' => $hashedToken, 'DATA' => $storedVal);
                        }
                    }
                }
            }

            if (!$multi_enrol) {
                set_transient('ax_post_enrol_' . $hashedToken, $params, 2 * DAY_IN_SECONDS);
                $storedVal = get_transient('ax_post_enrol_' . $hashedToken);
                $Response = array('TOKEN' => $hashedToken, 'DATA' => $storedVal);
            }

            /* NOTE: Transient IDs can only be 45 characters in length in versions older than 4.3. This will generate 41*/

            echo json_encode($Response);
            die();
        }

        public function axip_enrolment_complete_handle()
        {
            $params = array();
            if (defined('AXIP_NONCE_GENERATION')) {
                if (true == AXIP_NONCE_GENERATION) {
                    check_ajax_referer(
                        'ax_enroller',
                        'security'
                    );
                }
            }
            foreach ($_POST as $key => $value) {
                if ($key != "action" && $key != "clear_cart" && $key != "security") {
                    $params[$key] = $value;
                }
            }

            if (!empty($_POST['clear_cart'])) {
                setcookie('ax_shop_cart', "", time() - 3600, COOKIEPATH, COOKIE_DOMAIN);
            }

            if (!empty($_POST['enrolment_hash'])) {
                $hashedToken = $_POST['enrolment_hash'];
            }

            /*get WP options for enrolment completion*/
            $action = get_option('ax_enrol_event_action');
            if (empty($action)) {
                $action = 'none';
            }

            $Response = array();
            $Response['ACTION'] = $action;
            if ($action == 'redirect') {
                $redirectPostID = get_option('ax_enrol_event_redirect_url');
                if (isset($_POST['enquiry'])) {
                    if (!empty($_POST['enquiry'])) {
                        $redirectPostID = get_option('ax_enquiry_event_redirect_url');
                    }
                }
                $url = esc_url(get_permalink($redirectPostID));

                if (key_exists('config_id', $params)) {
                    $mapping_settings = get_option('ax_config_comp_mapping_settings');
                    $mapped = json_decode($mapping_settings, true, 10);
                    $config = $mapped[$params['config_id']];
                    if (!empty($config)) {
                        $url = esc_url(get_permalink($config["PAGE_ID"]));
                    }
                }
                $Response['REDIRECT_URL'] = $url . '?enrolment=' . $hashedToken;
            }

            echo json_encode($Response);
            die();
        }
        public function ax_auto_generate()
        {

            if (defined('AXIP_NONCE_GENERATION')) {
                if (true == AXIP_NONCE_GENERATION) {
                    check_ajax_referer(
                        'ax_enroller',
                        'security'
                    );
                }
            }
            $AutoGen = new AX_Auto_Page_Generation();
            $params = array();
            $Response = array();
            foreach ($_POST as $key => $value) {
                if ($key !== "security") {
                    $params[$key] = $value;
                }

            }
            $data = $AutoGen->process_auto_generate_request($params);

            echo json_encode($data);
            die();
        }

        public function ax_epayment_process()
        {
            $redirectPostID = get_option('ax_enrol_event_redirect_url');
            $url = '';

            if (!empty($redirectPostID)) {
                $url = esc_url(get_permalink($redirectPostID));
            }

            if (defined('AXIP_NONCE_GENERATION')) {
                if (true == AXIP_NONCE_GENERATION) {
                    check_ajax_referer(
                        'ax_enroller',
                        'security'
                    );
                }
            }

            if (key_exists('config_id', $_POST)) {
                $mapping_settings = get_option('ax_config_comp_mapping_settings');
                $mapped = json_decode($mapping_settings, true, 10);
                $config = $mapped[$_POST['config_id']];
                if (!empty($config)) {
                    $url = esc_url(get_permalink($config["PAGE_ID"]));
                }
            }
            global $AxcelerateAPI;
            $params = array();
            $method = 'POST';
            $endpoint = '/accounting/external/debit_success/paymentrecord';

            // If none of the URL options above are used this will default back to the URL specified by the widget.
            $params['callback'] = $_POST['callback'];
            if (!empty($url)) {
                $params['callback'] = $url;
            }

            $params['reference'] = stripslashes($_POST['reference']);
            $params['paymentMethod'] = stripslashes($_POST['paymentMethod']);
            $params['termID'] = stripslashes($_POST['termID']);
            $params['passthrough'] = stripslashes($_POST['passthrough']);
            $params['mobileCountryCode'] = stripslashes($_POST['contact_num_code']);
            $params['mobileNr'] = stripslashes($_POST['contact_num']);
            $params['invoiceGUID'] = stripslashes($_POST['invoiceGUID']);

            $params['process'] = stripslashes($_POST['process']);

            //showdebug=true == stop in middle.

            $Response = $AxcelerateAPI->callResource($params, $endpoint, $method);
            if ($Response instanceof stdClass) {
                $Response->CALLBACK = $url;
            }
            echo json_encode($Response);
            die();
        }

        public function ax_login_handle()
        {

            if (defined('AXIP_NONCE_GENERATION')) {
                if (true == AXIP_NONCE_GENERATION) {
                    check_ajax_referer(
                        'ax_login',
                        '_nonce'
                    );
                }
            }
            global $AxcelerateAPI;

            $username = $_POST['username'];
            $password = $_POST['password'];

            $result = $AxcelerateAPI->userLogin($username, $password);

            if (!empty($result)) {
                if (!empty($result->AXTOKEN)) {
                    $sessions_enabled = get_option('ax_global_login', 0) == 1;
                    if ($sessions_enabled) {

                        $_SESSION['AXTOKEN'] = $result->AXTOKEN;
                        $_SESSION['CONTACTID'] = $result->CONTACTID;
                        $_SESSION['UNAME'] = $result->USERNAME;
                        $_SESSION['ROLETYPE'] = $result->ROLETYPEID;
                        $_SESSION['EXPIRES'] = time() + (60 * 60);
                        $result = array('success' => true);
                        echo json_encode($result);
                        die();
                    }
                }

            }

            echo json_encode($result);
            die();
        }

        public function ax_logout_handle()
        {

            session_destroy();
            $result = array('success' => true);
            echo json_encode($result);
            die();
        }

        /**
         * Create contact + user record.
         *
         * @return void
         * @author Rob Bisson <rob.bisson@axcelerate.com.au>
         */
        public function ax_new_contact_user()
        {
            $userFound = false;
            $contactFound = false;

            if (defined('AXIP_NONCE_GENERATION')) {
                if (true == AXIP_NONCE_GENERATION) {
                    check_ajax_referer(
                        'ax_login_create',
                        '_nonce_lc'
                    );
                }
            }
            global $AxcelerateAPI;
            $contactParams = array();
            $contactParams['givenName'] = $_REQUEST['given_name'];
            $contactParams['surname'] = $_REQUEST['surname'];
            $contactParams['emailAddress'] = strtolower($_REQUEST['email_address']);

            //Check for exisiting
            $searchParams = array(
                'emailAddress' => $_REQUEST['email_address'],
            );

            $contactID = 0;
            $existing = $AxcelerateAPI->callResource($searchParams, "/contacts/search/", 'GET');
            if (is_array($existing)) {
                if (!empty($existing[0])) {
                    if (is_object($existing[0])) {
                        if (!empty($existing[0]->CONTACTID)) {
                            $contactID = $existing[0]->CONTACTID;

                            $contactFound = true;
                        }
                    }
                }
            } else {
                echo json_encode($existing);
            }

            if (empty($contactID) || $contactID == 0) {
                $newContact = $AxcelerateAPI->callResource($contactParams, "/contact/", "POST");
                if (is_object($newContact)) {
                    if (!empty($newContact->CONTACTID)) {
                        $contactID = $newContact->CONTACTID;
                    } else {
                        echo json_encode($newContact);
                    }
                }
            } else {
                //This may be uneeded - the user service does this check internally.
                $user = $AxcelerateAPI->callResource(array("contactID" => $contactID), "/users/", "POST");
                if (is_array($user)) {
                    if (!empty($user[0])) {
                        if ($user[0]->CONTACTID === $contactID) {
                            $userFound = true;
                            echo json_encode(array("contact_found" => $contactFound, "user_found" => $userFound));
                            die();
                        }
                    }
                }
            }
            if (!empty($contactID)) {
                $userParams = array(
                    "contactID" => $contactID,
                    "username" => $contactParams['emailAddress'],
                    "password" => $_REQUEST['password'],
                );
                $newUser = $AxcelerateAPI->callResource($userParams, "/user/", "POST");
                if (is_object($newUser)) {
                    if (!empty($newUser->USERID)) {
                        echo json_encode(array("contact_found" => $contactFound, "user_found" => $userFound, "user_created" => true));
                        die();
                    }
                }

                echo json_encode(array("contact_found" => $contactFound, "user_found" => $userFound, "user_created" => false, "user_req" => $newUser));
            }

            die();

        }

        public function ax_retrieve_abn_org()
        {

            if (defined('AXIP_NONCE_GENERATION')) {
                if (true == AXIP_NONCE_GENERATION) {
                    check_ajax_referer(
                        'ax_enroller',
                        'security'
                    );
                }
            }

            global $AxcelerateAPI;
            $orgID = $_REQUEST['org_id'];

            $orgRequest = $AxcelerateAPI->callResource(array(), "/organisation/" . $orgID, "GET");
            if (!empty($orgRequest) && is_object($orgRequest) && !empty($orgRequest->ORGID)) {
                error_log(print_r($orgRequest, true));
                echo json_encode(array(
                    "ORGID" => $orgRequest->ORGID,
                    "ABN" => $orgRequest->ABN,
                ));
            } else {
                echo json_encode(array('not_found' => true));
            }

            die();

        }

        public function ax_update_org_abn()
        {
            if (defined('AXIP_NONCE_GENERATION')) {
                if (true == AXIP_NONCE_GENERATION) {
                    check_ajax_referer(
                        'ax_enroller',
                        'security'
                    );
                }
            }
            global $AxcelerateAPI;
            $orgID = $_REQUEST['org_id'];
            $ABN = $_REQUEST['abn'];

            $orgRequest = $AxcelerateAPI->callResource(array("ABN" => $ABN), "/organisation/" . $orgID, "PUT");

            if (!empty($orgRequest) && is_object($orgRequest) && !empty($orgRequest->ORGID)) {
                error_log(print_r($orgRequest, true));
                echo json_encode(array(
                    "ORGID" => $orgRequest->ORGID,
                    "ABN" => $orgRequest->ABN,
                ));
            } elseif (!empty($orgRequest) && is_array($orgRequest) && !empty($orgRequest[0]->ORGID)) {
                echo json_encode(array(
                    "ORGID" => $orgRequest[0]->ORGID,
                    "ABN" => $orgRequest[0]->ABN,
                ));
            } else {
                echo json_encode(array('not_found' => true));
            }

            die();
        }

        public function ax_forgot_handle()
        {
            global $AxcelerateAPI;
            if (defined('AXIP_NONCE_GENERATION')) {
                if (true == AXIP_NONCE_GENERATION) {
                    check_ajax_referer(
                        'ax_login',
                        '_nonce'
                    );
                }
            }

            $username = $_REQUEST['username'];
            $email = $_REQUEST['email_address'];
            $newUser = null;
            if (!empty($username) && !empty($email)) {
                $newUser = $AxcelerateAPI->callResource(array('username' => $username, 'email' => $email), "/user/forgotPassword", "POST");
                if (is_object($newUser)) {
                    if (!empty($newUser->STATUS)) {
                        if ($newUser->STATUS == 'success') {
                            echo json_encode(array("user_reset" => true));
                            die();
                        }
                    }
                }
            }
            echo json_encode(array('not_found' => true, 'response' => $newUser));
            die();
        }

        public function ax_epayment_check_status()
        {

            $enrolmentHash = $_POST['enrolment_hash'];
            $provider = $_REQUEST['provider'];
            if (empty($provider) || $provider === "debit_success") {
                $status = AX_EPayment_Service::getCurrentStatus($enrolmentHash, $enrolmentHash);
            } else if ($provider === "ezypay") {
                $status = AX_Payment_Flow::checkStatusEzyPay($enrolmentHash);
            }

            echo json_encode($status);
            die();
        }
        public function ax_epayment_next_step()
        {
            $enrolmentHash = $_POST['enrolment_hash'];
            $status = AX_EPayment_Service::checkStatusAndNextAction($enrolmentHash, $enrolmentHash);
            echo json_encode($status);
            die();
        }

        public function axip_confirm_enrolment()
        {
            $axP = $_REQUEST['ax_process_id'];
            $enrolment_hash = $_REQUEST['enrolment_hash'];
            $status = $_REQUEST['status'];
            $method = $_REQUEST['method'];

            if (!empty($method) && $method === 'payment_flow') {
                $confirm = AX_Payment_Flow::checkStatusAndConfirm($enrolment_hash, $status);
                echo json_encode($confirm);
                die();
            } else if (!empty($axP) && !empty($enrolment_hash)) {

                $response = AX_EPayment_Service::checkStatusAndConfirmEnrolment($enrolment_hash, $axP);
                echo json_encode($response);
                die();
            } else {
                echo json_encode(array('error' => true, 'message' => "Missing required data"));
                die();
            }
        }
    }
    $AX_AJAX = new AX_AJAX();
}
