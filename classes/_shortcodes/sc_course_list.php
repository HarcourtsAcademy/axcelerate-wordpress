<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */

if (! class_exists ( 'AX_Course_List' )) {
    class AX_Course_List
    {
        
        function __construct()
        {
            add_shortcode( 'ax_course_list', array(&$this, 'ax_course_list_handler' ) );
            add_shortcode( 'ax_course_name', array(&$this, 'ax_course_name_handler' ) );
            add_shortcode( 'ax_course_code', array(&$this, 'ax_course_code_handler' ) );
            add_shortcode( 'ax_course_stream', array(&$this, 'ax_course_stream_handler' ) );
            add_shortcode( 'ax_course_type', array(&$this, 'ax_course_type_handler' ) );
            add_shortcode( 'ax_course_short_description', array(&$this, 'ax_course_short_description_handler' ) );
            add_shortcode( 'ax_details_page_link', array(&$this, 'ax_details_page_link_handler' ) );
            add_shortcode( 'ax_course_image', array(&$this, 'ax_course_image_handler' ) );
        }
        
        /*Course List ShortCodes*/
        public function ax_course_list_handler($atts = array(), $content = null)
        {
            
            $generalSettings = (array)get_option('axip_general_settings');
            $currentSearch = get_query_var('ax_s', '');
            $trainingCat = get_query_var('training_cat', '');
            $googleCards = get_option('ax_course_rich_cards') == 1;
            $default_stylesheet = plugins_url ( '/css/ax-standard.css', AXIP_PLUGIN_NAME );
            $AxcelerateAPI = new AxcelerateAPI();
            $defaultDisplayLength = 100;
            $maxDisplayLength = 500;
            extract( shortcode_atts( array(
                    'template' => '',
                    'training_cat'=> '',
                    'course_type'=> '',
                    'search_term'=>'',
                    'style'=> '',
                    'details_link'=>'',
                    'teminology_w'=> '',
                    'teminology_p'=> '',
                    'teminology_el'=> '',
                    "no_search"=>false,
                    'custom_css'=>'',
                    'class_to_add'=>'',
                    'display_length' => '',
        
            ), $atts ) );
        
            if (empty($no_search)) {
                /*If a search call has come through then replace the filters with the search*/
                if (!empty($currentSearch)) {
                    $search_term = $currentSearch;
                }
                if (!empty($trainingCat)) {
                    $training_cat = $trainingCat;
                }
            }
        
            if (empty($style)) {
                //Check for an option override.
                $style = get_option('ax_course_list_default_style');
            }
            if (empty($style)) {
                $style = '';
            }
        
            if (!empty($custom_css)) {
                $AxcelerateShortcode = new AxcelerateShortcode();
                $css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_list');
                $class_to_add = $class_to_add .' '. $css;
            }
        
            $imagesDisplay = get_option('ax_course_list_images_description');
            if (!empty($imagesDisplay)) {
                $style = $style.' '.$imagesDisplay;
            }
        
            wp_register_style ( 'ax-standard', $default_stylesheet, array());
            wp_enqueue_style ( 'ax-standard' );
        
            $color1 = get_option('ax_course_list_tile_color_1');
            $color2 = get_option('ax_course_list_tile_color_2');
            if (!empty($color1)) {
                $tileCss = "div.ax-tile div.ax-course-list-record:nth-child(odd){ background:". $color1 .";}";
                wp_add_inline_style( 'ax-standard', $tileCss );
            }
            if (!empty($color2)) {
                $tileCss2 = "div.ax-tile div.ax-course-list-record:nth-child(even){background:" . $color2 . ";}";
                wp_add_inline_style( 'ax-standard', $tileCss2 );
            }
        
            $columns = get_option('ax_course_list_tile_columns');
            if (!empty($columns)) {
                $width = '32%';
                if ($columns == '1') {
                    $width = '95%';
                }
                if ($columns == '2') {
                    $width = '48%';
                }
                if ($columns == '3') {
                    $width = '32%';
                }
                if ($columns == '4') {
                    $width = '23%';
                }
                $tileWidth = "div.ax-tile div.ax-course-list-record{width:" . $width . ";}";
                wp_add_inline_style( 'ax-standard', $tileWidth );
            }
        
        
            $html = '<div class="ax-course-list '. $style .' '. $class_to_add .'">';
            if (empty($template)) {
                $template = get_option('ax_course_list_layout');
            }
            if (!empty ($content)) {
                $template = $content;
            }
          
            
        
            if (empty($teminology_w)) {
                $teminology_w = get_option('ax_course_terminology_w');
            }
            if (empty($teminology_p)) {
                $teminology_p = get_option('ax_course_terminology_p');
            }
            if (empty($teminology_el)) {
                $teminology_el = get_option('ax_course_terminology_el');
            }
        
            $mapping_table = json_decode(get_option('ax_course_mapping_settings'), $assoc = true);
                
            /*Search Params*/
            $params = array();
            if (! empty ($training_cat)) {
                $params["trainingArea"] = $training_cat;
            }
            if (! empty ($course_type)) {
                $params["type"] = $course_type;
            }
            if (! empty ($search_term)) {
                $params["searchTerm"] = $search_term;
            }
            if (! empty ($display_length) && $display_length <= $maxDisplayLength) {
                $params["displayLength"] = $display_length;
            } else {
                $params["displayLength"] = $defaultDisplayLength;
            }
            $params["isActive"] = 1;
            
            $courseList = $AxcelerateAPI->callResource($params, '/courses', 'GET');
        
            if (empty ($template)) {
                $template = '<div class="ax-course-list-record '.$style .'">';
                $template .= '<h2>[ax_course_code]: [ax_course_name] [ax_course_stream]</h2>';
                $template .= '<div class="ax-course-list-description">[ax_course_short_description]</div>';
                $template .= '<div class="ax-course-list-link">[ax_details_page_link]</div>';
                $template .= '</div>';
            }
        
        
            /*Add Extra data to the sub shortcodes - if present*/
            $extraParams = ' ';
           
        
            if (!empty($teminology_w)) {
                $extraParams = $extraParams. 'teminology_w='.urlencode($teminology_w) .' ';
            }
            if (!empty($teminology_p)) {
                $extraParams = $extraParams. 'teminology_p='.urlencode($teminology_p) .' ';
            }
            if (!empty($teminology_el)) {
                $extraParams = $extraParams. 'teminology_el='.urlencode($teminology_el) .' ';
            }
        
            if ($googleCards) {
                $courseListJSON = array();
            }
            $trainingName = $generalSettings['axip_training_organisation'];
            
            foreach ($courseList as $row) {
                $tempTemplate = $template;
                $baseParams = 'course_id='. $row->ID . ' course_type='. $row->TYPE . $extraParams;
                    
                $link_override = $details_link;

        
                if (!empty($mapping_table)) {
                    if (!empty($mapping_table[$row->ID . '_'. $row->TYPE])) {
                        $link_override = $mapping_table[$row->ID . '_'. $row->TYPE]["PAGE"];
                    }
                }

                if (empty($link_override)) {
                    $setting_link = get_option('ax_course_list_details_link');
                    if (!empty($setting_link)) {
                        $link_override = get_option('ax_course_list_details_link');
                        
                    }
                    $detailPageID = 0;
                    if ($row->TYPE == 'w') {
                        $detailPageID = get_option('ax_course_list_details_pageid_w');
                    }
                    if ($row->TYPE == 'p') {
                        $detailPageID = get_option('ax_course_list_details_pageid_p');
                    }
                    if (!empty($detailPageID)) {
                        $link_override = get_permalink($detailPageID);
                    }
                }

                $tempTemplate = str_replace('[ax_course_code', '[ax_course_code '.$baseParams. ' course_code='. urlencode($row->CODE) .' ', $tempTemplate);
                $tempTemplate = str_replace('[ax_course_name', '[ax_course_name '.$baseParams. ' course_name='. urlencode($row->NAME) .' ', $tempTemplate);
                $tempTemplate = str_replace('[ax_course_stream', '[ax_course_stream '.$baseParams. ' course_stream='. urlencode($row->STREAMNAME) .' ', $tempTemplate);
                $tempTemplate = str_replace('[ax_course_type', '[ax_course_type '.$baseParams, $tempTemplate);
                $tempTemplate = str_replace('[ax_course_short_description', '[ax_course_short_description '.$baseParams. ' in_course_block=true short_description='. urlencode($row->SHORTDESCRIPTION) .' ', $tempTemplate);
                    
                $tempTemplate = str_replace('[ax_course_image', '[ax_course_image '.$baseParams. ' in_course_block=true short_description='. urlencode($row->SHORTDESCRIPTION) .' ', $tempTemplate);
                    
                $tempTemplate = str_replace('[ax_details_page_link', '[ax_details_page_link '.$baseParams. ' detail_link='. urlencode($link_override) .' ', $tempTemplate);
                $tempTemplate = str_replace('[ax_course_button_link', '[ax_course_button_link '.$baseParams. ' link_url='. urlencode($link_override) .' ', $tempTemplate);
                $html = $html . $tempTemplate;
        
        
                if ($googleCards) {
                    /*Convert Relative Links to Absolute*/
                    $cardURL = $link_override;
                    if (strpos($cardURL, 'http') == false) {
                        $cardURL = home_url($cardURL) ;
                    }
                    $combinedName = $row->CODE. ': ' . $row->NAME;
                    $provider = array(
                            "@type"=> 'Organization',
                            "name"=>$trainingName,
                            "sameAs"=>home_url('', 'https'),
                    );
                    $courseJSON = array(
                            "@context"=> "http://schema.org",
                            "@type"=> "Course",
                            "name"=> $combinedName,
                            "description"=>strip_tags(empty($row->SHORTDESCRIPTION)?'':$row->SHORTDESCRIPTION),
                            "url"=>$cardURL . '?course_id=' .$row->ID . '&course_type=' . $row->TYPE
                    );
                    $courseJSON['provider'] = $provider;
                    
                    $courseListJSON[] =  $courseJSON;
                }
            }
        
            $html = $html . '</div>';
            
            if ($googleCards) {
                $newHtml = '<script type="application/ld+json">';
                
                $newHtml .=   str_replace( '\/', '/', json_encode( $courseListJSON ) );
                    
                $newHtml .= '</script>';
                
                return urldecode(do_shortCode($html)) . $newHtml;
            } else {
                return urldecode(do_shortCode($html));
            }
        }
        
        public function ax_course_name_handler($atts)
        {
        
            $AxcelerateAPI = new AxcelerateAPI();
            extract( shortcode_atts( array(
                    'course_id' => '',
                    'course_type' => '',
                    'course_name'=> '',
                    'custom_css'=>'',
                    'class_to_add'=>'',
                    'wrap_tag'=>'',
            ), $atts ) );
        
            $html = '';
            if (empty($course_name)) {
                $params = array(
                        'id' => $course_id,
                        'type' => $course_type,
                );
                if (!empty($course_id)) {
                    $courseData = $AxcelerateAPI->callResource($params, '/course/detail', 'GET');
                    $html = $courseData->NAME;
                }
            } else {
                $html = $course_name;
            }
        
            if (!empty($custom_css)) {
                $AxcelerateShortcode = new AxcelerateShortcode();
                $css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_name');
                $class_to_add = $class_to_add .' '. $css;
            }
            if (!empty($wrap_tag)) {
                $html = '<' . $wrap_tag . ' class="'.$class_to_add.'">'.$html . '</' . $wrap_tag . '>';
            }
            // Return the Course Name
            return urldecode($html);
        }
        public function ax_course_image_handler($atts)
        {
            $AxcelerateAPI = new AxcelerateAPI();
            extract( shortcode_atts( array(
                    'course_id' => '',
                    'course_type' => '',
                    'short_description'=> '',
                    'in_course_block'=>'',
                    'custom_css'=>'',
                    'class_to_add'=>'',
                    'wrap_tag'=>'',
            ), $atts ) );
        
            $html = '';
            //check to see if the description was passed through, or it's in a course block and the API was already checked.
            if (empty($short_description) && empty($in_course_block)) {
                $params = array(
                        'id' => $course_id,
                        'type' => $course_type,
                );
                $courseData = $AxcelerateAPI->callResource($params, '/course/detail', 'GET');
                if (!empty($courseData->DESCRIPTION)) {
                    $description = $courseData->DESCRIPTION;
                }
            } else {
                $description = urldecode($short_description);
            }
        
            preg_match_all('#<img.*?>#is', $description, $img);
            if (!empty($img[0])) {
                $html = $html.$img[0][0];
            }
            if (!empty($custom_css)) {
                $AxcelerateShortcode = new AxcelerateShortcode();
                $css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_image');
                $class_to_add = $class_to_add .' '. $css;
            }
            if (!empty($wrap_tag)) {
                $html = '<' . $wrap_tag . ' class="'.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
            }
        
            return urldecode($html);
        }
        public function ax_course_stream_handler($atts)
        {
            $AxcelerateAPI = new AxcelerateAPI();
        
            extract( shortcode_atts( array(
                    'course_id' => '',
                    'course_type' => '',
                    'course_stream'=> '',
                    'custom_css'=>'',
                    'class_to_add'=>'',
                    'wrap_tag'=>'',
            ), $atts ) );
        
            $html = '';
            if (empty($course_stream)) {
                // TODO: Do API Call and get Data
            } else {
                $html = $course_stream;
            }
        
            if (!empty($custom_css)) {
                $AxcelerateShortcode = new AxcelerateShortcode();
                $css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_stream');
                $class_to_add = $class_to_add .' '. $css;
            }
            if (!empty($wrap_tag)) {
                $html = '<' . $wrap_tag . ' class="'.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
            }
        
            // Return the Course Name
            return urldecode($html);
        }
        public function ax_course_code_handler($atts)
        {
            $AxcelerateAPI = new AxcelerateAPI();
            extract( shortcode_atts( array(
                    'course_id' => '',
                    'course_type' => '',
                    'course_code'=> '',
                    'custom_css'=>'',
                    'class_to_add'=>'',
                    'wrap_tag'=>'',
            ), $atts ) );
        
            $html = '';
            if (empty($course_code)) {
                $params = array(
                        'id' => $course_id,
                        'type' => $course_type,
                );
                $courseData = $AxcelerateAPI->callResource($params, '/course/detail', 'GET');
                $html = $courseData->CODE;
            } else {
                $html = $course_code;
            }
            if (!empty($custom_css)) {
                $AxcelerateShortcode = new AxcelerateShortcode();
                $css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_code');
                $class_to_add = $class_to_add .' '. $css;
            }
            if (!empty($wrap_tag)) {
                $html = '<' . $wrap_tag . ' class="'.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
            }
        
            // Return the Course Name
            return urldecode($html);
        }
        public function ax_course_type_handler($atts)
        {
            $AxcelerateAPI = new AxcelerateAPI();
            extract( shortcode_atts( array(
                    'course_id' => '',
                    'course_type' => '',
                    'teminology_w'=> 'Workshop',
                    'teminology_p'=> 'Program',
                    'teminology_el'=> 'eLearning',
                    'custom_css'=>'',
                    'class_to_add'=>'',
                    'wrap_tag'=>'',
            ), $atts ) );
        
            $html = '';
        
            //TODO: Add Options.
            if (! empty($course_type)) {
                if (strtolower($course_type) == 'w') {
                    $html = $teminology_w;
                } elseif (strtolower($course_type) == 'p') {
                    $html = $teminology_p;
                } elseif (strtolower($course_type) == 'el') {
                    $html = $teminology_el;
                }
            }
            if (!empty($custom_css)) {
                $AxcelerateShortcode = new AxcelerateShortcode();
                $css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_type');
                $class_to_add = $class_to_add .' '. $css;
            }
            if (!empty($wrap_tag)) {
                $html = '<' . $wrap_tag . ' class="'.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
            }
            // Return the Course Name
            return urldecode($html);
        }
        public function ax_course_short_description_handler($atts)
        {
            $AxcelerateAPI = new AxcelerateAPI();
            extract( shortcode_atts( array(
                    'course_id' => '',
                    'course_type' => '',
                    'short_description'=> '',
                    'in_course_block'=>'',
                    'hide_images'=>'',
                    'custom_css'=>'',
                    'class_to_add'=>'',
                    'wrap_tag'=>'',
            ), $atts ) );
        
            $html = '';
            //check to see if the description was passed through, or it's in a course block and the API was already checked.
            if (empty($short_description) && empty($in_course_block)) {
                $params = array(
                        'id' => $course_id,
                        'type' => $course_type,
                );
                $courseData = $AxcelerateAPI->callResource($params, '/course/detail', 'GET');
                if (!empty($courseData->DESCRIPTION)) {
                    $html = $courseData->DESCRIPTION;
                }
            } else {
                $html = $short_description;
            }
        
            if (!empty($hide_images)) {
                $html = preg_replace('#<img[^>]+\>#i', '', urldecode($html));
            }
        
            if (!empty($custom_css)) {
                $AxcelerateShortcode = new AxcelerateShortcode();
                $css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_short_description');
                $class_to_add = $class_to_add .' '. $css;
            }
            if (!empty($wrap_tag)) {
                $html = '<' . $wrap_tag . ' class="'.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
            }
            return urldecode($html);
        }
        public function ax_details_page_link_handler($atts)
        {
            $AxcelerateAPI = new AxcelerateAPI();
            extract( shortcode_atts( array(
                    'course_id' => '',
                    'course_type' => '',
                    'type_w_detail_link'=> '',
                    'type_p_detail_link'=> '',
                    'type_el_detail_link'=> '',
                    'detail_link'=> '',
                    'link_text'=>'Find Out More',
                    'custom_css'=>'',
                    'class_to_add'=>'',
                    'wrap_tag'=>'',
            ), $atts ) );
        
            $html = '';
            if (empty($course_type)) {
                /* If there is no course type, not much can be done*/
            } else {
                if (! empty($detail_link)) {
                    $html = $detail_link;
                } elseif (strtolower($course_type) == 'w') {
                    $html = $type_w_detail_link;
                } elseif (strtolower($course_type) == 'p') {
                    $html = $type_p_detail_link;
                } elseif (strtolower($course_type) == 'el') {
                    $html = $type_el_detail_link;
                }
            }

        
            $html = '<a class="ax-course-detail-link '.$class_to_add .'" href="'.$detail_link . '?course_id=' . $course_id . '&course_type=' . $course_type.'" >';
            $html = $html . $link_text ."</a>";
            // Return the Course Name
            if (!empty($custom_css)) {
                $AxcelerateShortcode = new AxcelerateShortcode();
                $css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_details_page_link');
                $class_to_add = $class_to_add .' '. $css;
            }
            if (!empty($wrap_tag)) {
                $html = '<' . $wrap_tag . ' class="'.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
            }
            return urldecode($html);
        }
    }
    $AX_Course_List = new AX_Course_List();
    
    if (class_exists ( 'WPBakeryShortCode' ) && class_exists('AX_VC_PARAMS') && class_exists ( 'WPBakeryShortCodesContainer' )) {
        vc_map ( array (
                "name" => __ ( "aX Course List", "axcelerate" ),
                "base" => "ax_course_list",
                "icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
                "description"=>__ ( "Leave empty to use the default template.", "axcelerate" ),
                "content_element" => true,
                "show_settings_on_create" => true,
                "as_parent"=>array('except'=> 'ax_course_list,ax_course_details,ax_course_instance_list', 'only'=>''),
                //"as_child"=>array('except'=> 'ax_course_list,ax_course_details,ax_course_instance_list', 'only'=>''),
                //"is_container" => true,
                "category" => array (
                        'aX Parent Codes',
                ),
                'js_view'=>'VcColumnView',
                'params' => array (
                        array (
                                'type' => 'dropdown',
        
                                'heading' => __ ( 'Style' ),
                                'param_name' => 'style',
                                'value' => array (
                                        'Default'=>'',
                                        'Standard Layout' => 'ax-standard',
                                        'Tiled Layout' => 'ax-tile'
                                ),
                                'description' => __ ( 'Layout Style' )
                        ),
                        AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
                        array(
                                'type' => 'dropdown',
                                    
                                'heading' => __ ( 'No Search Filtering' ),
                                'param_name' => 'no_search',
                                'value' => array (
                                        'Allow Search Filtering' => '',
                                        'No Search Filtering' => true,
                                ),
                                "description" => __("Allow URL params (ax_s & training_cat) to set the training category, or search term for the course list.", 'axcelerate'),
                        ),
                        AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
                        array(
                                'type' => 'textfield',
                                    
                                'heading' => __ ( 'Training Category' ),
                                'param_name' => 'training_cat',
                                "description" => __("Filter the Course List by Training Category", 'axcelerate'),
                                "group"=>'Filters',
                                'admin_label'=>true,
                        ),
                        array(
                                'type' => 'textfield',
                                    
                                'heading' => __ ( 'Search Term' ),
                                'param_name' => 'search_term',
                                "description" => __("Filter the Course List by Training Category", 'axcelerate'),
                                "group"=>'Filters'
                        ),
                        AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
                        AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
                ),
                    
        ) );
        class WPBakeryShortCode_aX_Course_List extends WPBakeryShortCodesContainer
        {
        }
        
        vc_map ( array (
                "name" => __ ( "aX Course Name", "axcelerate" ),
                "base" => "ax_course_name",
                "icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
                "content_element" => true,
                "description"=>__ ( "Course Name - Plain Text", "axcelerate" ),
                "show_settings_on_create" => true,
                "is_container"=>false,
                "as_parent"=>array('only'=>''),
                "category" => array (
                        'aX Course Detail',
                        'aX Course List',
                        'aX Course Instances'
                ),
                'params' => array (
                        AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
                        AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
                        AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
                        AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
                        AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
                )
        ) );
        class WPBakeryShortCode_aX_Course_Name extends WPBakeryShortCode
        {
        }
        
        
        vc_map ( array (
                "name" => __ ( "aX Course Code", "axcelerate" ),
                "base" => "ax_course_code",
                "icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
                "content_element" => true,
                "description"=>__ ( "Course Code - Plain Text", "axcelerate" ),
                "show_settings_on_create" => true,
                "is_container"=>false,
                "as_parent"=>array('only'=>''),
                "category" => array (
                        'aX Course Detail',
                        'aX Course List',
                        'aX Course Instances'
                ),
                'params' => array (
                        AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
                        AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
                        AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
                        AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
                        AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
                )
        ) );
        class WPBakeryShortCode_aX_Course_Code extends WPBakeryShortCode
        {
        }
        
        vc_map ( array (
                "name" => __ ( "aX Course Stream", "axcelerate" ),
                "base" => "ax_course_stream",
                "description"=>__ ( "(Program Only) Course Stream", "axcelerate" ),
                "icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
                "content_element" => true,
                "show_settings_on_create" => true,
                "is_container"=>false,
                "as_parent"=>array('only'=>''),
                "category" => array (
                        'aX Course Detail',
                        'aX Course List',
                        'aX Course Instances'
                ),
                'params' => array (
                        AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
                        AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
                        AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
                        AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
                        AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
                )
        ) );
        class WPBakeryShortCode_aX_Course_Stream extends WPBakeryShortCode
        {
        }
        
        vc_map ( array (
                "name" => __ ( "aX Course Type", "axcelerate" ),
                "base" => "ax_course_type",
                "icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
                "content_element" => true,
                "description"=>__ ( "Course Type - Uses Terminology Settings", "axcelerate" ),
                "show_settings_on_create" => true,
                "is_container"=>false,
                "as_parent"=>array('only'=>''),
                "category" => array (
                        'aX Course Detail',
                        'aX Course List',
                        'aX Course Instances'
                ),
                'params' => array (
                        AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
                        AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
                        AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
                        AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
                        AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
                )
        ) );
        class WPBakeryShortCode_aX_Course_Type extends WPBakeryShortCode
        {
        }
        
        vc_map ( array (
                "name" => __ ( "aX Course Short Description", "axcelerate" ),
                "base" => "ax_course_short_description",
                "icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
                "content_element" => true,
                "description"=>__ ( "Course Description - Any HTML Returned", "axcelerate" ),
                "show_settings_on_create" => true,
                "is_container"=>false,
                "as_parent"=>array('only'=>''),
                "category" => array (
                        'aX Course Detail',
                        'aX Course List',
                ),
                'params' => array (
                        AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
                        array(
                                'type' => 'dropdown',
                                    
                                'heading' => __ ( 'Hide Images' ),
                                'param_name' => 'hide_images',
                                'value' => array (
                                        'Display Images' => '',
                                        'Hide Images' => true,
                                ),
                        ),
                        AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
                        AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
                        AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
                        AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
                )
        ) );
        class WPBakeryShortCode_aX_Course_Short_Description extends WPBakeryShortCode
        {
        }
        
        vc_map ( array (
                "name" => __ ( "aX Course Details Link", "axcelerate" ),
                "base" => "ax_details_page_link",
                "icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
                "content_element" => true,
                "description"=>__ ( "Course Specific Link / Mapped Link", "axcelerate" ),
                "show_settings_on_create" => true,
                "is_container"=>false,
                "as_parent"=>array('only'=>''),
                "category" => array (
                        'aX Course List',
                ),
                'params' => array (
                        AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
                        AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
                        array(
                                'type' => 'textfield',
                                    
                                'heading' => __ ( 'Link Text' ),
                                'param_name' => 'link_text',
                                "description" => __("Text for the Link.", 'axcelerate'),
                        ),
                        AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
                        AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
                        AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
                            
                )
        ) );
        class WPBakeryShortCode_aX_Details_Page_Link extends WPBakeryShortCode
        {
        }
        
        vc_map ( array (
                "name" => __ ( "aX Course Image", "axcelerate" ),
                "base" => "ax_course_image",
                "icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
                "content_element" => true,
                "description"=>__ ( "Extract an Image from the Course Description", "axcelerate" ),
                "show_settings_on_create" => true,
                "is_container"=>false,
                "as_parent"=>array('only'=>''),
                    
                "category" => array (
                        'aX Course List',
                        'aX Course Detail'
                ),
                'params' => array (
                        AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
                        AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
                        AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
                        AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
                        AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
                )
        ) );
        class WPBakeryShortCode_aX_Course_Image extends WPBakeryShortCode
        {
        }
        
    }
}
