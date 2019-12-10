<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */

if (! class_exists ( 'AX_Course_Details' )) {
	class AX_Course_Details {
		function __construct() {

			add_shortcode( 'ax_course_details', array(&$this, 'ax_course_details_handler' ) );
			add_shortcode( 'ax_course_outline', array(&$this, 'ax_course_outline_handler' ) );
			add_shortcode( 'ax_course_element_image1', array(&$this, 'ax_course_element_image1_handler' ) );
			add_shortcode( 'ax_course_element_image2', array(&$this, 'ax_course_element_image2_handler' ) );
			add_shortcode( 'ax_course_element_introduction', array(&$this, 'ax_course_element_introduction_handler' ) );
			
			add_shortcode( 'ax_course_element_target_audience', array(&$this, 'ax_course_element_target_audience_handler' ) );
			add_shortcode( 'ax_course_element_content', array(&$this, 'ax_course_element_content_handler' ) );
			add_shortcode( 'ax_course_element_learning_outcomes', array(&$this, 'ax_course_element_learning_outcomes_handler' ) );
			add_shortcode( 'ax_course_element_learning_methods', array(&$this, 'ax_course_element_learning_methods_handler' ) );
			add_shortcode( 'ax_course_element_program_benefits', array(&$this, 'ax_course_element_program_benefits_handler' ) );
			
			
		}
		
		
		public function ax_course_details_handler ($atts = array(), $content = null){

			$default_stylesheet = plugins_url ( '/css/ax-standard.css', AXIP_PLUGIN_NAME );
			$AxcelerateAPI = new AxcelerateAPI();
			extract( shortcode_atts( array(
					'template' => '',
					'course_id'=>'',
					'course_type'=> '',
					'style'=> '',
					'teminology_w'=> '',
					'teminology_p'=> '',
					'teminology_el'=> '',
					'enrol_config_id'=>'',
					'prevent_loop'=>'',
					'custom_css'=>'',
					'class_to_add'=>'',
		
			), $atts ) );
			global $post;
			if(empty($style)){
				//Check for an option override.
				$style = get_option('ax_course_detail_default_style');
			}
			if(empty($style)){
				$style = 'ax-standard';
			}
			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_details');
				$style = $style .' '. $css;
			}
			if(!empty ($class_to_add)){
				$style = $style . ' '. $class_to_add;
			}
			wp_register_style ( 'ax-standard', $default_stylesheet ,array());
			wp_enqueue_style ( 'ax-standard' );
		
			$html = '<div class="ax-course-details '. $style .'">';
		
		
			
						
			if(empty($teminology_w)){
				$teminology_w = get_option('ax_course_terminology_w');
			}
			if(empty($teminology_p)){
				$teminology_p = get_option('ax_course_terminology_p');
			}
			if(empty($teminology_el)){
				$teminology_el = get_option('ax_course_terminology_el');
			}
		
			$mapping_table = get_option('ax_course_mapping');
		
		
		
		
		
			/*Search Params*/
			$params = array();
			if(! empty ($course_id)){
				$params["ID"] = $course_id;
			}
			else{
				if(!empty ($_REQUEST['course_id'])){
					$params["ID"] = $_REQUEST['course_id'];
				}
				else if(!empty ($_REQUEST['cid'])){
					$params["ID"] = $_REQUEST['cid'];
				}
				else if(!empty ($_REQUEST['ID'])){
					$params["ID"] = $_REQUEST['ID'];
				}
				else if(!empty ($_REQUEST['id'])){
					$params["ID"] = $_REQUEST['id'];
				}
				else{
					$course_ref = $custom_content = get_post_meta ( $post->ID, 'course_ref' );
					if (! empty ( $course_ref )) {
						$refSplit = explode ( '_', $course_ref [0] );
						$course_id = $refSplit [0];
						$params["ID"] = $course_id;
					}
					
				}
		
				if(!empty($params["ID"])){
					$course_id = $params["ID"];
				}
					
					
			}
		
			
			if(! empty ($course_type)){
				$params["type"] = $course_type;
			}
			else{
				if(!empty ($_REQUEST['course_type'])){
					$params["type"] = $_REQUEST['course_type'];
				}
				else if(!empty ($_REQUEST['type'])){
					$params["type"] = $_REQUEST['type'];
				}
				else if(!empty ($_REQUEST['ctype'])){
					$params["type"] = $_REQUEST['ctype'];
				}
				else{
					$course_ref = $custom_content = get_post_meta ( $post->ID, 'course_ref' );
					if (! empty ( $course_ref )) {
						$refSplit = explode ( '_', $course_ref [0] );
						$course_type = $refSplit [1];
						$params["type"] = $course_type;
					}
				}

					
				if(!empty($params["type"])){
					$course_type = $params["type"];
				}
					
					
			}
	
		
			if(empty($template)){
				if(strtolower($course_type) == 'w'){
					$template = get_option('ax_course_detail_layout_w');
				}
				else{
					$template = get_option('ax_course_detail_layout_p');
				}
		
			}
		
			if(!empty($content)){
				$template = $content;
			}
		
			if(!empty($params["type"]) && !empty($params["ID"])){
				$courseDetail = $AxcelerateAPI->callResource($params, '/course/detail', 'GET');
			}
			else{
				return '';
			}
			if(!empty($courseDetail) && empty($courseDetail->error)){
				if(empty ($template)){
					$template = $template. '<h2>[ax_course_code]: [ax_course_name] [ax_course_stream]</h2>';
						
					$template = $template. '<div class="ax-cd-description">[ax_course_short_description]</div>';
					$template = $template. '<div class="ax-cd-image">[ax_course_element_image1]</div>';
					$template = $template . '<div class="ax-cd-introduction"><h2>Introduction:</h2>[ax_course_element_introduction]</div>';
					$template = $template . '<div class="ax-cd-target"><h2>Target Audience:</h2>[ax_course_element_target_audience]</div>';
					$template = $template. '<div class="ax-cd-image">[ax_course_element_image2]</div>';
					$template = $template . '<div class="ax-cd-learning-outcomes"><h2>Learning Outcomes:</h2>[ax_course_element_learning_outcomes]</div>';
					$template = $template . '<div class="ax-cd-learning-methods"><h2>Learning Methods:</h2>[ax_course_element_learning_methods]</div>';
						
					$template = $template . '<div class="ax-cd-program-benefits"><h2>Program Benefits:</h2>[ax_course_element_program_benefits]</div>';
					$template = $template . '<div class="ax-cd-content"><h2>Content:</h2>[ax_course_element_content]</div>';
						
				}
					
					
					
				/*Add Extra data to the sub shortcodes - if present*/
				$extraParams = ' ';
					
				if(!empty($teminology_w)){
					$extraParams = $extraParams. 'teminology_w='.urlencode ($teminology_w) .' ';
				}
				if(!empty($teminology_p)){
					$extraParams = $extraParams. 'teminology_p='.urlencode ($teminology_p) .' ';
				}
				if(!empty($teminology_el)){
					$extraParams = $extraParams. 'teminology_el='.urlencode ($teminology_el) .' ';
				}
				$baseParams = 'course_id='. $courseDetail->ID . ' course_type='. $course_type . $extraParams;
					
				$template = str_replace('[ax_course_code', '[ax_course_code '.$baseParams. ' course_code='. urlencode ($courseDetail->CODE) .' ' , $template);
				$template = str_replace('[ax_course_code', '[ax_course_code '.$baseParams. ' course_cost='. $courseDetail->COST .' ' , $template);
				$template = str_replace('[ax_course_name', '[ax_course_name '.$baseParams. ' course_name='. urlencode ($courseDetail->NAME) .' ' , $template);
				$template = str_replace('[ax_course_stream', '[ax_course_stream '.$baseParams, $template);
				$template = str_replace('[ax_course_type', '[ax_course_type '.$baseParams , $template);
				$template = str_replace('[ax_course_short_description', '[ax_course_short_description '.$baseParams. ' in_course_block=true short_description='. urlencode($courseDetail->DESCRIPTION) .' ' , $template);
				$template = str_replace('[ax_course_outline', '[ax_course_outline '.$baseParams. ' course_outline='. urlencode ($courseDetail->OUTLINE) . ' ' , $template);
					
				$template = str_replace('[ax_course_image', '[ax_course_image '.$baseParams. ' in_course_block=true short_description='. urlencode($courseDetail->DESCRIPTION) .' ' , $template);
					
				/*detect if Course Details was called from Course Instances, if so, do not call course instances and loop*/
				if(!empty($prevent_loop)){
					$template = str_replace('[ax_course_instance_list', 'LOOP ERROR: SHORTCODE TRIMMED TO PREVENT ENDLESS LOOP - USE AN ENCLOSING SHORTCODE FOR AX_COURSE DETAILS WITHOUT AX_COURSE_INSTANCE_LIST',$template);
				}
				else{
					/*add [ to the front to ensure attrs are only added to opening shortcode*/
					$template = str_replace('[ax_course_instance_list', '[ax_course_instance_list '. $baseParams, $template);
				}
					
				/*detect if the enrol widget included has a config_id already*/
				if(strpos($template, 'config_id')){
					$template = str_replace('[ax_enrol_widget', '[ax_enrol_widget '.$baseParams, $template);
					$template = str_replace('[ax_enquiry_widget', '[ax_enquiry_widget '.$baseParams, $template);
				}
				else{
					$template = str_replace('[ax_enrol_widget', '[ax_enrol_widget '.$baseParams . ' config_id=' . $enrol_config_id, $template);
					$template = str_replace('[ax_enquiry_widget', '[ax_enquiry_widget '.$baseParams . ' config_id=' . $enrol_config_id, $template);
				}
					
					
				/*button links*/
				$template = str_replace('[ax_course_button_link', '[ax_course_button_link '.$baseParams, $template);
					
				if(strtolower($course_type) == 'w'){
					$elements = $courseDetail->OUTLINEELEMENTS;
					if(!empty ($elements)){
						$eContent = $elements->CONTENT;
						if(!empty($eContent)){
							$template = str_replace('[ax_course_element_content', '[ax_course_element_content '.$baseParams. ' course_element_content='. urlencode (implode('|',$elements->CONTENT)) .' ' , $template);
						}
						$eContent = $elements->INTRODUCTION;
						if(!empty($eContent)){
							$template = str_replace('[ax_course_element_introduction', '[ax_course_element_introduction '.$baseParams. ' course_element_introduction='. urlencode ($elements->INTRODUCTION) .' ' , $template);
						}
						$eContent = $elements->IMAGES;
						if(!empty($eContent)){
							if(array_key_exists(0, $elements->IMAGES)){
								$template = str_replace('[ax_course_element_image1', '[ax_course_element_image1 '.$baseParams. ' course_element_image1='. urlencode ($elements->IMAGES[0]) .' ' , $template);
							}
							if(array_key_exists(1, $elements->IMAGES)){
								$template = str_replace('[ax_course_element_image2', '[ax_course_element_image2 '.$baseParams. ' course_element_image2='. urlencode ($elements->IMAGES[1]) .' ' , $template);
							}
						}
						$eContent = $elements->TARGETAUDIENCE;
						if(!empty($eContent)){
							$template = str_replace('[ax_course_element_target_audience', '[ax_course_element_target_audience '.$baseParams. ' course_element_target_audience='. urlencode ($elements->TARGETAUDIENCE) .' ' , $template);
						}
						$eContent = $elements->LEARNINGOUTCOMES;
						if(!empty($eContent)){
							$template = str_replace('[ax_course_element_learning_outcomes', '[ax_course_element_learning_outcomes '.$baseParams. ' course_element_learning_outcomes='. urlencode (implode('|',$elements->LEARNINGOUTCOMES)) .' ' , $template);
						}
						$eContent = $elements->LEARNINGMETHODS;
						if(!empty($eContent)){
							$template = str_replace('[ax_course_element_learning_methods', '[ax_course_element_learning_methods '.$baseParams. ' course_element_learning_methods='. urlencode ($elements->LEARNINGMETHODS ).' ' , $template);
						}
						$eContent = $elements->PROGRAMBENEFITS;
						if(!empty($eContent)){
							$template = str_replace('[ax_course_element_program_benefits', '[ax_course_element_program_benefits '.$baseParams. ' course_element_program_benefits='. urlencode (implode('|',$elements->PROGRAMBENEFITS)) .' ' , $template);
						}
					}
						
				}
					
				$html = $html . '<script> jQuery(function($){ $(".ax-course-details").find("div:empty").hide();jQuery(".ax-course-details").find("div > h2").closest("div").addClass("no-content").find("*:not(h2), div").parent("div").removeClass("no-content");jQuery("div.no-content").hide(); });</script>';
		
				$html = $html . $template;
					
				$html = $html . '</div>';
					
				return urldecode(do_shortCode($html));
			}
			else{
				return '';
			}
		
		}
		public function  ax_course_outline_handler ($atts) {
			$AxcelerateAPI = new AxcelerateAPI();
			extract( shortcode_atts( array(
					'course_id' => '',
					'course_type' => '',
					'course_outline'=> '',
					'custom_css'=>'',
					'class_to_add'=>'',
					'wrap_tag'=>'',
			), $atts ) );
		
			$html = '';
			if(empty($course_outline)){
				$params = array(
						'id' => $course_id,
						'type' => $course_type,
				);
				$courseData = $AxcelerateAPI->callResource($params, '/course/detail', 'GET');
					
				$html = $courseData->OUTLINE;
		
			}
			else{
				$html = $course_outline;
		
			}
		
			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_outline');
				$class_to_add = $class_to_add .' '. $css;
			}
			if(!empty($wrap_tag)){
				$html = '<' . $wrap_tag . ' class="'.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
		
			}
			return urldecode($html);
		
		}
		
		
		/* Accepts array as string separated by | */
		public function  ax_course_element_content_handler ($atts) {
			$AxcelerateAPI = new AxcelerateAPI();
			extract( shortcode_atts( array(
					'course_id' => '',
					'course_type' => '',
					'course_element_content'=> '',
					'custom_css'=>'',
					'class_to_add'=>'',
					'wrap_tag'=>'',
			), $atts ) );
		
			$html = '';
			$contentArray = array();
			if(strtolower($course_type) == 'w'){
				if(!empty($course_element_content)){
					$contentArray = explode("|", urldecode($course_element_content));
				}
				if(empty($course_element_content)){
					$params = array(
							'id' => $course_id,
							'type' => $course_type,
					);
					$courseData = $AxcelerateAPI->callResource($params, '/course/detail', 'GET');
					$contentArray = $courseData->OUTLINEELEMENTS->CONTENT;
		
				}
				if(!empty ($contentArray)){
					$html = $html . '<ul class="ax-course-content-list">';
					foreach($contentArray as $content){
						$html = $html . '<li class="ax-course-content-list-record">'. $content . '</li>';
					}
					$html = $html . '</ul>';
				}
			}
			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_element_content');
				$class_to_add = $class_to_add .' '. $css;
			}
			if(!empty($wrap_tag)){
				$html = '<' . $wrap_tag . ' class="'.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
		
			}
			return urldecode($html);
		
		}
		
		/* Accepts array as string separated by | */
		public function  ax_course_element_learning_outcomes_handler ($atts) {
			$AxcelerateAPI = new AxcelerateAPI();
			extract( shortcode_atts( array(
					'course_id' => '',
					'course_type' => '',
					'course_element_learning_outcomes'=> '',
					'custom_css'=>'',
					'class_to_add'=>'',
					'wrap_tag'=>'',
			), $atts ) );
		
			$html = '';
			$contentArray = array();
			if(strtolower($course_type) == 'w'){
				if(!empty($course_element_learning_outcomes)){
					$contentArray = explode("|", urldecode($course_element_learning_outcomes));
				}
				if(empty($course_element_learning_outcomes)){
					$params = array(
							'id' => $course_id,
							'type' => $course_type,
					);
					$courseData = $AxcelerateAPI->callResource($params, '/course/detail', 'GET');
					$contentArray = $courseData->OUTLINEELEMENTS->LEARNINGOUTCOMES;
		
				}
				if(!empty ($contentArray)){
					$html = $html . '<ul class="ax-course-content-list">';
					foreach($contentArray as $content){
						$html = $html . '<li class="ax-course-content-list-record">'. $content . '</li>';
					}
					$html = $html . '</ul>';
				}
			}
			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_element_learning_outcomes');
				$class_to_add = $class_to_add .' '. $css;
			}
			if(!empty($wrap_tag)){
				$html = '<' . $wrap_tag . ' class="'.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
		
			}
			return urldecode($html);
		
		}
		
		/* Accepts array as string separated by | */
		public function  ax_course_element_program_benefits_handler ($atts) {
			$AxcelerateAPI = new AxcelerateAPI();
			extract( shortcode_atts( array(
					'course_id' => '',
					'course_type' => '',
					'course_element_program_benefits'=> '',
					'custom_css'=>'',
					'class_to_add'=>'',
					'wrap_tag'=>'',
			), $atts ) );
		
			$html = '';
			$contentArray = array();
			if(strtolower($course_type) == 'w'){
				if(!empty($course_element_program_benefits)){
					$contentArray = explode("|", urldecode($course_element_program_benefits));
				}
				if(empty($course_element_program_benefits)){
					$params = array(
							'id' => $course_id,
							'type' => $course_type,
					);
					$courseData = $AxcelerateAPI->callResource($params, '/course/detail', 'GET');
					$contentArray = $courseData->OUTLINEELEMENTS->PROGRAMBENEFITS;
		
				}
				if(!empty ($contentArray)){
					$html = $html . '<ul class="ax-course-content-list">';
					foreach($contentArray as $content){
						$html = $html . '<li class="ax-course-content-list-record">'. $content . '</li>';
					}
					$html = $html . '</ul>';
				}
			}
			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_element_program_benefits');
				$class_to_add = $class_to_add .' '. $css;
			}
			if(!empty($wrap_tag)){
				$html = '<' . $wrap_tag . ' class="'.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
		
			}
			return urldecode($html);
		
		}
		
		
		public function  ax_course_element_introduction_handler ($atts) {
			$AxcelerateAPI = new AxcelerateAPI();
			extract( shortcode_atts( array(
					'course_id' => '',
					'course_type' => '',
					'course_element_introduction'=> '',
					'custom_css'=>'',
					'class_to_add'=>'',
					'wrap_tag'=>'',
			), $atts ) );
		
			$html = '';
			if(strtolower($course_type) == 'w'){
				if(empty($course_element_introduction)){
					$params = array(
							'id' => $course_id,
							'type' => $course_type,
					);
					$courseData = $AxcelerateAPI->callResource($params, '/course/detail', 'GET');
					$course_element_introduction = $courseData->OUTLINEELEMENTS->INTRODUCTION;
		
				}
				if(!empty ($course_element_introduction)){
					$html = $html . '<div class="ax-course-introduction">';
					$html = $html . $course_element_introduction;
					$html = $html . '</div>';
				}
			}
			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_element_introduction');
				$class_to_add = $class_to_add .' '. $css;
			}
			if(!empty($wrap_tag)){
				$html = '<' . $wrap_tag . ' class="'.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
		
			}
			return urldecode($html);
		
		}
		
		public function  ax_course_element_target_audience_handler ($atts) {
			$AxcelerateAPI = new AxcelerateAPI();
			extract( shortcode_atts( array(
					'course_id' => '',
					'course_type' => '',
					'course_element_target_audience'=> '',
					'custom_css'=>'',
					'class_to_add'=>'',
					'wrap_tag'=>'',
			), $atts ) );
		
			$html = '';
			if(strtolower($course_type) == 'w'){
				if(empty($course_element_target_audience)){
					$params = array(
							'id' => $course_id,
							'type' => $course_type,
					);
					$courseData = $AxcelerateAPI->callResource($params, '/course/detail', 'GET');
					$course_element_target_audience = $courseData->OUTLINEELEMENTS->TARGETAUDIENCE;
		
				}
				if(!empty ($course_element_target_audience)){
					$html = $html . '<div class="ax-course-introduction">';
					$html = $html . $course_element_target_audience;
					$html = $html . '</div>';
				}
			}
			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_element_target_audience');
				$class_to_add = $class_to_add .' '. $css;
			}
			if(!empty($wrap_tag)){
				$html = '<' . $wrap_tag . ' class="'.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
		
			}
			return urldecode($html);
		
		}
		
		public function  ax_course_element_learning_methods_handler ($atts) {
			$AxcelerateAPI = new AxcelerateAPI();
			extract( shortcode_atts( array(
					'course_id' => '',
					'course_type' => '',
					'course_element_learning_methods'=> '',
					'custom_css'=>'',
					'class_to_add'=>'',
					'wrap_tag'=>'',
			), $atts ) );
		
			$html = '';
			if(strtolower($course_type) == 'w'){
				if(empty($course_element_learning_methods)){
					$params = array(
							'id' => $course_id,
							'type' => $course_type,
					);
					$courseData = $AxcelerateAPI->callResource($params, '/course/detail', 'GET');
					$course_element_learning_methods = $courseData->OUTLINEELEMENTS->LEARNINGMETHODS;
		
				}
				if(!empty ($course_element_learning_methods)){
					$html = $html . '<div class="ax-course-introduction">';
					$html = $html . $course_element_learning_methods;
					$html = $html . '</div>';
				}
			}
			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_element_learning_methods');
				$class_to_add = $class_to_add .' '. $css;
			}
			if(!empty($wrap_tag)){
				$html = '<' . $wrap_tag . ' class="'.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
		
			}
			return urldecode($html);
		
		}
		
		
		
		public function  ax_course_element_image1_handler ($atts) {
			$AxcelerateAPI = new AxcelerateAPI();
			extract( shortcode_atts( array(
					'course_id' => '',
					'course_type' => '',
					'course_element_image1'=> '',
					'custom_css'=>'',
					'class_to_add'=>'',
					'wrap_tag'=>'',
			), $atts ) );
		
			$html = '';
			if(strtolower($course_type) == 'w'){
				if(empty($course_element_image1)){
					$params = array(
							'id' => $course_id,
							'type' => $course_type,
					);
					$courseData = $AxcelerateAPI->callResource($params, '/course/detail', 'GET');
					if(!empty($courseData->OUTLINEELEMENTS->IMAGES)){
						$html = $courseData->OUTLINEELEMENTS->IMAGES[0];
						if(! empty($html)){
							$html = '<img src="'.$html . '" class="ax-course-image" />';
						}
					}
		
						
				}
				else{
					$html = '<img src="'.$course_element_image1 . '" class="ax-course-image" />';
						
				}
			}
			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_element_image1');
				$class_to_add = $class_to_add .' '. $css;
			}
			if(!empty($wrap_tag)){
				$html = '<' . $wrap_tag . ' class="'.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
		
			}
			return urldecode($html);
		
		}
		public function  ax_course_element_image2_handler ($atts) {
			$AxcelerateAPI = new AxcelerateAPI();
			extract( shortcode_atts( array(
					'course_id' => '',
					'course_type' => '',
					'course_element_image2'=> '',
					'custom_css'=>'',
					'class_to_add'=>'',
					'wrap_tag'=>'',
			), $atts ) );
		
			$html = '';
			if(strtolower($course_type) == 'w'){
				if(empty($course_element_image2)){
					$params = array(
							'id' => $course_id,
							'type' => $course_type,
					);
					$courseData = $AxcelerateAPI->callResource($params, '/course/detail', 'GET');
					if(!empty($courseData->OUTLINEELEMENTS->IMAGES)){
						$html = $courseData->OUTLINEELEMENTS->IMAGES[1];
						if(! empty($html)){
							$html = '<img src="'.$html . '" class="ax-course-image" />';
						}
					}
		
						
				}
				else{
					$html = '<img src="'.$course_element_image2 . '" class="ax-course-image" />';
						
				}
			}
			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_element_image2');
				$class_to_add = $class_to_add .' '. $css;
			}
			if(!empty($wrap_tag)){
				$html = '<' . $wrap_tag . ' class="'.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
		
			}
			return urldecode($html);
		
		}
		
	}
	$AX_Course_Details = new AX_Course_Details();
	
	if(class_exists ( 'WPBakeryShortCode' ) && class_exists('AX_VC_PARAMS') && class_exists ( 'WPBakeryShortCodesContainer' )){
		vc_map ( array (
				"name" => __ ( "aX Course Details", "axcelerate" ),
				"base" => "ax_course_details",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				"description"=>__ ( "Leave empty to use the default template.", "axcelerate" ),
				"content_element" => true,
				"show_settings_on_create" => true,
				//"is_container" => true,
				//is_container will cause the SC to not be selectable in some cases
				"as_parent"=>array('except'=> 'ax_course_list,ax_course_details', 'only'=>''),
				//"as_child"=>array('except'=> 'ax_course_list,ax_course_details', 'only'=>''),
				'js_view'=>'VcColumnView',
				"category" => array (
						'aX Parent Codes',
				),
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
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
						AX_VC_PARAMS::$AX_VC_COURSEID_PARAM
				)
		) );
		class WPBakeryShortCode_aX_Course_Details extends WPBakeryShortCodesContainer {
		}
		vc_map ( array (
				"name" => __ ( "aX Course Full Outline", "axcelerate" ),
				"base" => "ax_course_outline",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				"content_element" => true,
				"description"=>__ ( "Full Course Outline - Use for Programs", "axcelerate" ),
				"show_settings_on_create" => true,
				"is_container"=>false,
				"as_parent"=>array('only'=>''),
					
				"category" => array (
						'aX Course Detail',
				),
				'params' => array (
						AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
						AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
						AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
				)
		) );
		class WPBakeryShortCode_aX_Course_Outline extends WPBakeryShortCode {
		}
		vc_map ( array (
				"name" => __ ( "aX Course Outline Element Image 1", "axcelerate" ),
				"base" => "ax_course_element_image1",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				"content_element" => true,
				"description"=>__ ( "(Workshop Only) Outline Image", "axcelerate" ),
				"show_settings_on_create" => true,
				"is_container"=>false,
				"as_parent"=>array('only'=>''),
				'js_view'=>'VcIconElementView_Backend',
				"category" => array (
						'aX Course Detail',
				),
				'params' => array (
						AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
						AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
						AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
				)
		) );
		class WPBakeryShortCode_aX_Course_Element_Image_1 extends WPBakeryShortCode {
		}
		vc_map ( array (
				"name" => __ ( "aX Course Outline Element Image 2", "axcelerate" ),
				"base" => "ax_course_element_image2",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				"content_element" => true,
				"description"=>__ ( "(Workshop Only) Outline Image", "axcelerate" ),
				"show_settings_on_create" => true,
				"is_container"=>false,
				"as_parent"=>array('only'=>''),
					
				"category" => array (
						'aX Course Detail',
				),
				'params' => array (
						AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
						AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
						AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
				)
		) );
		class WPBakeryShortCode_aX_Course_Element_Image_2 extends WPBakeryShortCode {
		}
		vc_map ( array (
				"name" => __ ( "aX Course Outline Element Introduction", "axcelerate" ),
				"base" => "ax_course_element_introduction",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				"content_element" => true,
				"description"=>__ ( "(Workshop Only) Course Introduction", "axcelerate" ),
				"show_settings_on_create" => true,
				"is_container"=>false,
				"as_parent"=>array('only'=>''),
					
				"category" => array (
						'aX Course Detail',
				),
				'params' => array (
						AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
						AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
						AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
				)
		) );
		class WPBakeryShortCode_aX_Course_Element_Introduction extends WPBakeryShortCode {
		}
		vc_map ( array (
				"name" => __ ( "aX Course Outline Element Target Audience", "axcelerate" ),
				"base" => "ax_course_element_target_audience",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				"content_element" => true,
				"description"=>__ ( "(Workshop Only) Course Audience", "axcelerate" ),
				"show_settings_on_create" => true,
				"is_container"=>false,
				"as_parent"=>array('only'=>''),
					
				"category" => array (
						'aX Course Detail',
				),
				'params' => array (
						AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
						AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
						AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
				)
		) );
		class WPBakeryShortCode_aX_Course_Element_Target_Audience extends WPBakeryShortCode {
		}
		vc_map ( array (
				"name" => __ ( "aX Course Outline Element Content", "axcelerate" ),
				"base" => "ax_course_element_content",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				"content_element" => true,
				"description"=>__ ( "(Workshop Only) Course Content", "axcelerate" ),
				"show_settings_on_create" => true,
				"is_container"=>false,
				"as_parent"=>array('only'=>''),
					
				"category" => array (
						'aX Course Detail',
				),
				'params' => array (
						AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
						AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
						AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
				)
		) );
		class WPBakeryShortCode_aX_Course_Element_Content extends WPBakeryShortCode {
		}
		vc_map ( array (
				"name" => __ ( "aX Course Outline Element Learning Outcomes", "axcelerate" ),
				"base" => "ax_course_element_learning_outcomes",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				"content_element" => true,
				"description"=>__ ( "(Workshop Only) Course Learning Outcomes", "axcelerate" ),
				"show_settings_on_create" => true,
				"is_container"=>false,
				"as_parent"=>array('only'=>''),
					
				"category" => array (
						'aX Course Detail',
				),
				'params' => array (
						AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
						AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
						AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
				)
		) );
		class WPBakeryShortCode_aX_Course_Element_Learning_Outcomes extends WPBakeryShortCode {
		}
		vc_map ( array (
				"name" => __ ( "aX Course Outline Element Learning Methods", "axcelerate" ),
				"base" => "ax_course_element_learning_methods",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				"content_element" => true,
				"description"=>__ ( "(Workshop Only) Course Learning Methods", "axcelerate" ),
				"show_settings_on_create" => true,
				"is_container"=>false,
				"as_parent"=>array('only'=>''),
					
				"category" => array (
						'aX Course Detail',
				),
				'params' => array (
						AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
						AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
						AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
				)
		) );
		class WPBakeryShortCode_aX_Course_Element_Learning_Methods extends WPBakeryShortCode {
		}
		vc_map ( array (
				"name" => __ ( "aX Course Outline Element Program Benefits", "axcelerate" ),
				"base" => "ax_course_element_program_benefits",
				"icon" => plugin_dir_url ( __FILE__ ) . '../images/ax_icon.png',
				"content_element" => true,
				"description" => __ ( "(Workshop Only) Course Benefits", "axcelerate" ),
				"show_settings_on_create" => true,
				"is_container" => false,
				"as_parent" => array (
						'only' => '' 
				),
				
				"category" => array (
						'aX Course Detail' 
				),
				'params' => array (
						AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
						AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
						AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM 
				) 
		) );
		class WPBakeryShortCode_aX_Course_Element_Program_Benefits extends WPBakeryShortCode {
		}
		
		
		
		
	}
}
