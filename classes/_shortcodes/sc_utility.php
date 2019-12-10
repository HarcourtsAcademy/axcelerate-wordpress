<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */

if (! class_exists ( 'AX_Utility_Codes' )) {
    class AX_Utility_Codes
    {
        function __construct()
        {


            add_shortcode( 'ax_course_button_link', array(&$this, 'ax_course_button_link_handler' ) );
            
            add_shortcode( 'ax_search_form', array(&$this, 'ax_search_form_handler' ));
        }
        public function ax_course_button_link_handler($atts)
        {
            extract( shortcode_atts( array(
                    'course_id' => '',
                    'course_type' => '',
                    'link_url'=> '',
                    'link_mode'=>'url',
                    'instance_id'=> '',
                    'button_text'=>'Enquire/Enrol',
                    'class_to_add'=>'',
                    'custom_css'=>'',
                    'vacancy'=>'',
                    'vacancy_threshold'=>'',
                    'vacancy_text'=>'',
                    'vacancy_class'=>'',
                    'vacancy_0_class'=>'',
                    'vacancy_0_text'=>'Fully Booked',
            ), $atts ) );
        
            if (class_exists('WPBakeryShortCodesContainer')) {
                if (strpos($link_url, 'url:') !== false) {
                    $fullLink = vc_build_link( $link_url );
                    $link_url = $fullLink['url'];
                } else {
                    $link_url = urldecode($link_url);
                }
            } else {
                $link_url = urldecode($link_url);
            }
            $link_url = sanitize_text_field($link_url);
        
        
        
            if (!empty($custom_css)) {
                $AxcelerateShortcode = new AxcelerateShortcode();
                $css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_button_link');
                $class_to_add = $class_to_add .' '. $css;
            }
            
            $noVacancy = false;
            
            if (!empty($vacancy) && !empty($vacancy_threshold)) {
                $vacancy = intval($vacancy);
                $vacancy_threshold = intval($vacancy_threshold);
                if ($vacancy <= $vacancy_threshold) {
                    $class_to_add = $vacancy_class;
                    if (!empty ($css)) {
                        $class_to_add = $class_to_add. ' '. $css;
                    }
                    $button_text = $vacancy_text;
                }
            } elseif ($vacancy === 0 || $vacancy === '0') {
                $class_to_add = $vacancy_0_class;
                if (!empty ($css)) {
                    $class_to_add = $class_to_add. ' '. $css;
                }
                $button_text = $vacancy_0_text;
                $noVacancy = true;
            }
        
            $html = '<div class="ax-course-button">';
            if ($link_mode == 'url') {
                $urlparams = '?course_id='. $course_id . '&course_type=' . $course_type;
                if (!empty ($instance_id)) {
                    $urlparams = $urlparams . '&instance_id='. $instance_id;
                }
                $html = $html . '<a class="'.$class_to_add.' button" ';
                if ($noVacancy) {
                    $html .= ' disabled="disabled"';
                } else {
                    $html .= 'href="'.$link_url . $urlparams .'"';
                }
                $html = $html   .'>';
                $html = $html . '<span>'. $button_text . '</span></a>';
            } elseif ($link_mode == "form") {
                $html = $html . '<form action="'.$link_url.'" method="POST">';
                $html = $html . '<input type="hidden" name="course_id" value="'.$course_id .'">';
                $html = $html . '<input type="hidden" name="course_type" value="'.$course_type .'">';
                if (!empty ($instance_id)) {
                    $html = $html . '<input type="hidden" name="instance_id" value="'.$instance_id .'">';
                }
        
                $html = $html . '<button type="submit" class="button '.$class_to_add.'"';
                if ($noVacancy) {
                    $html .= ' disabled="disabled"';
                }
                $html .= '>'.$button_text.'</button>';
                $html = $html .'</form>';
            }
        
            $html = $html . '</div>';
        
        
        
            return urldecode($html);
        }
        
        
        
        
        public function ax_search_form_handler($atts)
        {
            extract( shortcode_atts( array(
                    'ax_s' => '',
                    'search_url' => '',
                    'as_widget'=>false,
                    'custom_css'=>'',
                    'class_to_add'=>'',
                    'wrap_tag'=>'',
            ), $atts ) );
            $currentSearch = get_query_var('ax_s');
        
            if (class_exists('WPBakeryShortCodesContainer')) {
                if (strpos($search_url, 'url:') !== false) {
                    $fullLink = vc_build_link( $search_url );
                    $search_url = $fullLink['url'];
                }
            }
            $html = '<form role="search" method="get" class="search-form" action="' . $search_url . '">
				<label>
					<span class="screen-reader-text">' . _x ( 'Search for:', 'label' ) . '</span>
		        	<input
						type="search"
						class="search-field"
		           		placeholder="' . esc_attr_x ( 'Search …', 'placeholder' ) . '"
		            	name="ax_s"
		            	title="' . esc_attr_x ( 'Search for:', 'label' ) . '"
						value="' . $currentSearch . '"
					/>
		    	</label>
		    	<input
						type="submit"
						class="search-submit"
		        		value="' . esc_attr_x ( 'Search', 'submit button' ) . '"
				/>
			</form>';
            if (!empty($custom_css)) {
                $AxcelerateShortcode = new AxcelerateShortcode();
                $css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_search_form');
                $class_to_add = $class_to_add .' '. $css;
            }
            if (!empty ($as_widget)) {
                $html = '<div class="widget widget_search '.$class_to_add .'">' . $html .'</div>';
            }
        
            if (!empty($wrap_tag)) {
                $html = '<' . $wrap_tag . ' class="'.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
            }
            return $html;
        }
    }
    $AX_Utility_Codes = new AX_Utility_Codes();
    
    if (class_exists ( 'WPBakeryShortCode' ) && class_exists('AX_VC_PARAMS') && class_exists ( 'WPBakeryShortCodesContainer' )) {
        vc_map ( array (
                "name" => __ ( "aX Course Search", "axcelerate" ),
                "base" => "ax_search_form",
                "icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
                "content_element" => true,
                "description"=>__ ( "Course Search Box", "axcelerate" ),
                "show_settings_on_create" => true,
                "is_container"=>false,
                "as_parent"=>array('only'=>''),
        
                "category" => array (
                        'aX Parent Codes',
                ),
                'params' => array (
                        array(
                                'type' => 'dropdown',
        
                                'heading' => __ ( 'Display As Widget' ),
                                'param_name' => 'as_widget',
                                'value' => array (
                                        'No Widget Classes' => '',
                                        'Add Widget Classes' => true,
                                ),
                                "description" => __("Add WP Widget Classes - which may change appearance", 'axcelerate'),
                        ),
                        array(
                                'type' => 'vc_link',
        
                                'heading' => __ ( 'URL' ),
                                'param_name' => 'search_url',
                                "description" => __("URL of the page to perform the search against. Leave blank for current page.", 'axcelerate'),
                        ),
                        AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
                        AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
                        AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
        
                )
        ) );
        class WPBakeryShortCode_aX_Search_Form extends WPBakeryShortCode
        {
        }
        
        vc_map ( array (
                "name" => __ ( "aX Course Button Link", "axcelerate" ),
                "base" => "ax_course_button_link",
                "icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
                "content_element" => true,
                "description"=>__ ( "Course Or Instance Specific Button", "axcelerate" ),
                "show_settings_on_create" => true,
                "is_container"=>false,
                "as_parent"=>array('only'=>''),
                    
                "category" => array (
                        'aX Course Detail',
                        'aX Course Instances'
                ),
                'params' => array (
                        AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
                        AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
                        AX_VC_PARAMS::$AX_VC_INSTANCEID,
                        AX_VC_PARAMS::$AX_VC_LINK_URL,
                        AX_VC_PARAMS::$AX_VC_LINK_TEXT,
                        array(
                                'type' => 'dropdown',
                                    
                                'heading' => __ ( 'Link Mode' ),
                                'param_name' => 'link_mode',
                                'value' => array (
                                        'URL Params' => 'url',
                                        'Hidden Form' => 'form',
                                ),
                                'group'=>'Link Settings',
                        ),
                        AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
                        AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
                        
                        AX_VC_PARAMS::$AX_VC_VACANCY_THRESHOLD_COUNT,
                        AX_VC_PARAMS::$AX_VC_VACANCY_THRESHOLD_TEXT,
                        AX_VC_PARAMS::$AX_VC_VACANCY_THRESHOLD_CLASS,
                        AX_VC_PARAMS::$AX_VC_0_VACANCY_TEXT,
                        AX_VC_PARAMS::$AX_VC_0_VACANCY_CLASS,
                        
                            
                            
                )
        ) );
        class WPBakeryShortCode_aX_Course_Button_Link extends WPBakeryShortCode
        {
        }
        
        
    }
}
