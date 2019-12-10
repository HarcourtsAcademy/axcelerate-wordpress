<?php

if (! defined( 'ABSPATH' )) {
    die( '-1' );
}

class AX_Auto_Page_Generation
{
    public function __construct()
    {
    }
    public static function getDomain()
    {
        $sURL    = site_url(); // WordPress function
        $asParts = parse_url( $sURL ); // PHP function
    
        if (! $asParts) {
            wp_die( 'ERROR: Path corrupt for parsing.' ); // replace this with a better error result
        }
    
        $sScheme = $asParts['scheme'];
        $nPort   = $asParts['port'];
        $sHost   = $asParts['host'];
        $nPort   = 80 == $nPort ? '' : $nPort;
        $nPort   = 'https' == $sScheme and 443 == $nPort ? '' : $nPort;
        $sPort   = ! empty( $sPort ) ? ":$nPort" : '';
        $sReturn = $sScheme . '://' . $sHost . $sPort;
    
        return $sReturn;
    }
    public static function process_auto_generate_request($params = array())
    {

        $Response = array();

        $GenerateCourseList = false;
        $GenerateCourseDetailsW = false;
        $GenerateCourseDetailsP = false;
        $GenerateEnrolW = false;
        $GenerateEnrolP = false;
        $GenerateEnquireW = false;
        $GenerateEnquireP = false;

        $siteURL = self::getDomain();

        if (!empty($params["agCourseList_checkbox"])) {
            $GenerateCourseList = $params["agCourseList_checkbox"] == "on";
        }
        if (!empty($params["agCourseDetailW_checkbox"])) {
            $GenerateCourseDetailsW = $params["agCourseDetailW_checkbox"] == "on";
        }
        if (!empty($params["agCourseDetailP_checkbox"])) {
            $GenerateCourseDetailsP = $params["agCourseDetailP_checkbox"] == "on";
        }
        if (!empty($params["agCourseEnrolW_checkbox"])) {
            $GenerateEnrolW = $params["agCourseEnrolW_checkbox"] == "on";
        }
        if (!empty($params["agCourseEnrolP_checkbox"])) {
            $GenerateEnrolP = $params["agCourseEnrolP_checkbox"] == "on";
        }
        if (!empty($params["agCourseEnquireW_checkbox"])) {
            $GenerateEnquireW = $params["agCourseEnquireW_checkbox"] == "on";
        }
        if (!empty($params["agCourseEnquireP_checkbox"])) {
            $GenerateEnquireP = $params["agCourseEnquireP_checkbox"] == "on";
        }

        $CourseListPost = null;

        if ($GenerateCourseList) {
            $CLParams = array(
                'post_content' => '[ax_course_list course_type=all style='.$params["ag_course_list_style"].']',
                'post_title' => $params["ag_course_list_title"],
                'post_status' => $params["ag_course_list_status"],
                'post_type' => $params["ag_course_list_type"]
            );
            
            $CourseListPost = self::create_post($CLParams);
        }

        $CDWPost = null;
        if ($GenerateCourseDetailsW) {
            $CDWParams = array(
                'post_content' => '[ax_course_details course_type=w style='.$params["ag_course_detail_style_w"].']',
                'post_title' => $params["ag_course_detail_title_w"],
                'post_status' => $params["ag_course_detail_status_w"],
                'post_type' => $params["ag_course_detail_type_w"]
            );
            $CDWPost = self::create_post($CDWParams);

            $CDWPostURL = get_permalink($CDWPost['post']);
            $CDWPostURL = str_replace($siteURL, '', $CDWPostURL);
            
            
            if ($params['ag_cl_update']) {
               //TODO: ADD NEW SETTING TO UPDATE

                update_option('ax_course_list_details_pageid_w', $CDWPost['post']);
            }
        }

        $CDPPost = null;
        if ($GenerateCourseDetailsP) {
            $CDPParams = array(
                'post_content' => '[ax_course_details course_type=p style='.$params["ag_course_detail_style_p"].']',
                'post_title' => $params["ag_course_detail_title_p"],
                'post_status' => $params["ag_course_detail_status_p"],
                'post_type' => $params["ag_course_detail_type_p"]
            );
            $CDPPost = self::create_post($CDPParams);
            $CDPPostURL = get_permalink($CDPPost['post']);
            $CDPPostURL = str_replace($siteURL, '', $CDPPostURL);
            
            
            if ($params['ag_cl_update']) {
               //TODO: ADD NEW SETTING TO UPDATE
                update_option('ax_course_list_details_pageid_p', $CDPPost['post']);
            }
        }

        $EWPost = null;
        if ($GenerateEnrolW) {
            $EWParams = array(
                'post_content' => '[ax_enrol_widget config_id='.$params["ag_enrol_config_w"].' ]',
                'post_title' => $params["ag_enrol_title_w"],
                'post_status' => $params["ag_enrol_status_w"],
                'post_type' => $params["ag_enrol_type_w"]
            );
            $EWPost = self::create_post($EWParams);

            $EWPostURL = get_permalink($EWPost['post']);
            $EWPostURL = str_replace($siteURL, '', $EWPostURL);
            
            
            if ($params['ag_cd_template_update_w']) {
                $CDPTemplate = self::add_link_to_instance_template($EWPostURL, 'w');
                self::update_instance_template('w', $CDPTemplate);
            }
        }
        $EPPost = null;
        if ($GenerateEnrolP) {
            $EPParams = array(
                'post_content' => '[ax_enrol_widget config_id='.$params["ag_enrol_config_p"].' ]',
                'post_title' => $params["ag_enrol_title_p"],
                'post_status' => $params["ag_enrol_status_p"],
                'post_type' => $params["ag_enrol_type_p"]
            );
            $EPPost = self::create_post($EPParams);

            $EPPostURL = get_permalink($EPPost['post']);

            $EPPostURL = str_replace($siteURL, '', $EPPostURL);
             
             
            if ($params['ag_cd_template_update_p']) {
                $CDPTemplate = self::add_link_to_instance_template($EPPostURL, 'p');
                    
                self::update_instance_template('p', $CDPTemplate);
            }
        }
        $EQWPost = null;
        if ($GenerateEnquireW) {
            $EQWParams = array(
                'post_content' => '[ax_enquiry_widget config_id='.$params["ag_enquire_config_w"].' ]',
                'post_title' => $params["ag_enquire_title_w"],
                'post_status' => $params["ag_enquire_status_w"],
                'post_type' => $params["ag_enquire_type_w"]
            );
            $EQWPost = self::create_post($EQWParams);
            
            //Get the URL of the post in question
            $EQWPostURL = get_permalink($EQWPost['post']);
            
            //make the URL relative to the root
            $EQWPostURL = str_replace($siteURL, '', $EQWPostURL);
            
            
            if ($params['ag_cd_template_update_w']) {
                $CDPTemplate = self::add_link_to_details_template($EQWPostURL, 'w');
                   
                self::update_detail_template('w', $CDPTemplate);
            }
        }
        $EQPPost = null;
        if ($GenerateEnquireP) {
            $EQPParams = array(
                'post_content' => '[ax_enquiry_widget config_id='.$params["ag_enquire_config_p"].' ]',
                'post_title' => $params["ag_enquire_title_p"],
                'post_status' => $params["ag_enquire_status_p"],
                'post_type' => $params["ag_enquire_type_p"]
            );
            
            //Create the Post
            $EQPPost = self::create_post($EQPParams);
            
            //Get the URL of the post in question
            $EQPPostURL = get_permalink($EQPPost['post']);

            //make the URL relative to the root
            $EQPPostURL = str_replace($siteURL, '', $EQPPostURL);


            if ($params['ag_cd_template_update_p']) {
                $CDPTemplate = self::add_link_to_details_template($EQPPostURL, 'p');
       
                self::update_detail_template('p', $CDPTemplate);
            }
        }

        //TODO: Check each setting;

        //Create Each page

        //Update the templates/URLs

        
        $status = array(
            'course_list' => $CourseListPost,
            'course_detail_w' => $CDWPost,
            'course_detail_p' => $CDPPost,
            'course_enrol_w' => $EWPost,
            'course_enrol_p' => $EPPost,
            'course_enquire_w' => $EQWPost,
            'course_enquire_p' => $EQPPost,
        );

        $message = "";

        if (!empty($CourseListPost)) {
            $message .= "<h4>Course List Creation: " . self::boolToWords($CourseListPost['success']) . '</h4>';
        }
        if (!empty($CDWPost)) {
            $message .= "<h4>Course Detail (W) Creation: " . self::boolToWords($CDWPost['success']) . '</h4>';
        }
        if (!empty($CDPPost)) {
            $message .= "<h4>Course Detail (P) Creation: " . self::boolToWords($CDPPost['success']) . '</h4>';
        }
        if (!empty($EWPost)) {
            $message .= "<h4>Course Enrol (W) Creation: " . self::boolToWords($EWPost['success']) . '</h4>';
        }
        if (!empty($EPPost)) {
            $message .= "<h4>Course Enrol (P) Creation: " . self::boolToWords($EPPost['success']) . '</h4>';
        }
        if (!empty($EQWPost)) {
            $message .= "<h4>Course Enquiry (W) Creation: " . self::boolToWords($EQWPost['success']) . '</h4>';
        }
        if (!empty($EQPPost)) {
            $message .= "<h4>Course Enquiry (P) Creation: " . self::boolToWords($EQPPost['success']) . '</h4>';
        }

        $Response = array('complete'=>true, 'message'=>$message);

        return $Response;
    }

    //TODO:

    // Parse the data sent through

    // Call appropreate sub functions

    // Return result

    public static function boolToWords($bool = false)
    {
        if (!empty($bool)) {
            return "Completed";
        } else {
            return "Not Completed";
        }
    }
    public static function update_detail_template($templateType, $newTemplate)
    {
        if ($templateType == 'w') {
            update_option('ax_course_detail_layout_w', $newTemplate);
        } else {
            update_option('ax_course_detail_layout_p', $newTemplate);
        }
    }
    public static function add_link_to_details_template($url = "", $templateType = 'w')
    {
        $template;

        if ($templateType == 'w') {
            $template = get_option('ax_course_detail_layout_w');
        } else {
            $template = get_option('ax_course_detail_layout_p');
        }
   
        $template = str_replace('[ax_course_button_link', '[ax_course_button_link link_url='. urlencode($url) . ' ', $template);

        return $template;
    }

    public static function update_instance_template($templateType, $newTemplate)
    {
        if ($templateType == 'w') {
            update_option('ax_course_instance_layout_w', $newTemplate);
        } else {
            update_option('ax_course_instance_layout_p', $newTemplate);
        }
    }

    public static function add_link_to_instance_template($url = "", $templateType = 'w')
    {
        $template;

        if ($templateType == 'w') {
            $template = get_option('ax_course_instance_layout_w');
        } else {
            $template = get_option('ax_course_instance_layout_p');
        }
        $template = str_replace('[ax_course_button_link', '[ax_course_button_link link_url='. urlencode($url) . ' ', $template);

        return $template;
    }

    public static function create_post($postData = array())
    {

        $defaults = array(
            'post_author' => $user_id,
            'post_content' => '',
            'post_content_filtered' => '',
            'post_title' => '',
            'post_excerpt' => '',
            'post_status' => 'draft',
            'post_type' => 'post',
            'comment_status' => '',
            'ping_status' => '',
            'post_password' => '',
            'to_ping' =>  '',
            'pinged' => '',
            'post_parent' => 0,
            'menu_order' => 0,
            'guid' => '',
            'import_id' => 0,
            'context' =>''


        );
        $newPost = wp_insert_post($postData);
        if (is_wp_error($newPost)) {
            return array('success'=>false);
        } else {
            return array(
                'success'=>true,
                'post'=>$newPost
            );
        }
    }
}
