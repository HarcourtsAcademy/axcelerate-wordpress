<?php

/**
 * Enrolment Service
 */

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
if (!defined('ABSPATH')) {
    die('-1');
}

/* -------------------------------------------- */

/**
 * Enrolments for Enrolment Resumption.
 *
 * @author Rob Bisson <rob.bisson@axcelerate.com.au>
 */
class AX_Course_Instance_v2
{
    public function __construct()
    {

        add_action('init', 'AX_Course_Instance_v2::register_ajax_actions');
    }
    public static function register_ajax_actions()
    {

        add_action('wp_ajax_course_instance_v2', 'AX_Course_Instance_v2::ajax_course_instance_v2');
        add_action('wp_ajax_nopriv_course_instance_v2', 'AX_Course_Instance_v2::ajax_course_instance_v2');

        add_action('wp_ajax_instance_items_v2', 'AX_Course_Instance_v2::ajax_instance_items_v2');
        add_action('wp_ajax_nopriv_instance_items_v2', 'AX_Course_Instance_v2::ajax_instance_items_v2');

        
    }

    public static function ajax_course_instance_v2()
    {
        $instanceID = $_REQUEST['instance_id'];
        $courseType = $_REQUEST['course_type'];

        
        $Results = self::get_course_instance($instanceID, $courseType);
       
        if (!empty($Results)) {
            echo json_encode($Results);
        } else {
            echo json_encode(array("error" => true));
        }

        die();
    }
    public static function get_course_instance($instanceID = 0, $courseType = "w")
    {
        $AxcelerateAPI = new AxcelerateAPI();

        if (!empty($instanceID)) {
            $courseParams = array("instanceID" => $instanceID, "type" => $courseType, "fields" => "all");
            $response = $AxcelerateAPI->callResource($courseParams, "v2/course/instances", "GET");
            if (is_object($response)) {
                if ($response->INSTANCEID) {
                    return $response;
                }
            }
        }
        return null;
    }
    public static function ajax_instance_items_v2()
    {
        $instanceID = $_REQUEST['instance_id'];
        $courseType = $_REQUEST['course_type'];

        if("w" === $courseType){
            $response = self::get_instance_items($instanceID, $courseType);
  
            if(is_array($response)){
                echo json_encode($response);
            }
            else{
                echo json_encode(array("error" => true));
            }
        }
        else{
            echo json_encode(array());
        }
        die();
    }
    public static function get_instance_items($instanceID = 0, $courseType='w')
    {
        $AxcelerateAPI = new AxcelerateAPI();

        if (!empty($instanceID)) {
            $courseParams = array("instanceID" => $instanceID, "type" => $courseType, "fields" => "all");
           
            $response = $AxcelerateAPI->callResource($courseParams, "v2/course/instances/w/" . $instanceID . "/items", "GET");
            error_log(print_r($response, true));
            if (is_array($response)) {
                return $response;
            }
            else{
                error_log(print_r($response, true));
            }

        }
        return null;
    }
}
$AX_Course_Instance_v2 = new AX_Course_Instance_v2();