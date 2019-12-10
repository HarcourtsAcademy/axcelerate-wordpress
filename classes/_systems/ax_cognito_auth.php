<?php

if (!defined('ABSPATH')) {
    die('-1');
}

if (!class_exists('AX_Cognito_Auth')) {

    class AX_Cognito_Auth
    {
        public function __construct()
        {
            self::register_ajax_events();

        }

        public static function register_ajax_events()
        {

            add_action('wp_ajax_ax_validate_access_token', 'AX_Cognito_Auth::ax_ajax_validate_access_token');
            add_action('wp_ajax_nopriv_ax_validate_access_token', 'AX_Cognito_Auth::ax_ajax_validate_access_token');

        }

        public static function store_state_hash($config_id, $course_id, $instance_id, $type, $url)
        {

            $time = current_time('mysql');
            $state_hash = wp_hash($config_id . '-' . $course_id . '-' . $instance_id . '-' . $type . '-' . $time);

            set_transient(
                $state_hash,
                array(
                    'config_id' => $config_id,
                    'course_id' => $course_id,
                    'instance_id' => $instance_id,
                    'type' => $type,
                    'url' => $url,
                ),
                3 * DAY_IN_SECONDS
            );
            return $state_hash;
        }

        public static function get_status_from_hash($state_hash)
        {
            if (!empty($state_hash)) {
                $data = get_transient($state_hash);
                return $data;
            }

        }

        public static function ax_validate_access_token($accessToken = "")
        {
            $AxcelerateAPI = new AxcelerateAPI();

            $test = array(
                "accessToken" => is_array($accessToken) ? $accessToken['jwtToken'] : $accessToken,
            );

            $login = $AxcelerateAPI->callResource($test, 'user/login', 'POST');
            error_log(print_r($login, true));
            if (isset($login->error)) {
                return false;
            }
            return (array) $login;

        }
        public static function ax_run_session_setup($contactID, $loginResponse)
        {
            //AX_Session_Security::startSession();

            $IP = $_SERVER['REMOTE_ADDR'];
            $sessionStored = AX_Session_Security::setupSession($contactID, $IP);

            $sessions_enabled = get_option('ax_global_login', 0) == 1;

            if ($sessions_enabled) {
                $_SESSION['AXTOKEN'] = $loginResponse['AXTOKEN'];
                $_SESSION['CONTACTID'] = $loginResponse['CONTACTID'];
                $_SESSION['UNAME'] = $loginResponse['USERNAME'];
                $_SESSION['ROLETYPE'] = $loginResponse['ROLETYPEID'];
                $_SESSION['EXPIRES'] = time() + (60 * 60);
            }

            return $sessionStored;

        }

        public static function ax_ajax_validate_access_token()
        {

            $accessToken = $_REQUEST['access_token'];

            $hasAccess = self::ax_validate_access_token($accessToken);
            $loginStatus = array(
                'logged_in' => false,
                'logged_in_token' => '',
            );
            error_log(print_r($hasAccess, true));
            if (isset($hasAccess)) {
                if ($hasAccess['CONTACTID']) {

                    $loginStatus['logged_in'] = true;
                    $loginStatus['logged_in_token'] = $hasAccess['AXTOKEN'];
                    $loginStatus['logged_in_contact'] = $hasAccess['CONTACTID'];
                    $loginStatus['logged_in_role'] = $hasAccess['ROLETYPEID'];

                    $session = self::ax_run_session_setup($hasAccess['CONTACTID'], $hasAccess);
                    $loginStatus['session'] = $session;

                }
            }
            echo json_encode($loginStatus);

            die();
        }

    }
}
