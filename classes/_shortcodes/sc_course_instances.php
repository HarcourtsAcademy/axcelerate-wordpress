<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */

if (! class_exists ( 'AX_Course_Instances' )) {
	class AX_Course_Instances {
		function __construct() {
			/**** Course Instance Shortcodes ****/
			
			add_shortcode( 'ax_course_instance_list', array(&$this, 'ax_course_instance_list_handler' ));
			add_shortcode( 'ax_course_instance_name', array(&$this, 'ax_course_instance_name_handler' ));
			add_shortcode( 'ax_course_instance_location', array(&$this, 'ax_course_instance_location_handler' ));
			add_shortcode( 'ax_course_instance_startdate', array(&$this, 'ax_course_instance_startdate_handler' ));
			add_shortcode( 'ax_course_instance_starttime', array(&$this, 'ax_course_instance_starttime_handler' ));
			add_shortcode( 'ax_course_instance_finishdate', array(&$this, 'ax_course_instance_finishdate_handler' ));
			add_shortcode( 'ax_course_instance_finishtime', array(&$this, 'ax_course_instance_finishtime_handler' ));
			add_shortcode( 'ax_course_instance_vacancy', array(&$this, 'ax_course_instance_vacancy_handler' ));
			add_shortcode( 'ax_course_instance_cost', array(&$this, 'ax_course_instance_cost_handler' ));
			add_shortcode( 'ax_course_instance_datedescriptor', array(&$this, 'ax_course_instance_datedescriptor_handler' ));
			
			
			
			
		}
		
		public function  ax_course_instance_list_handler ($atts =array(), $content = null) {
			$default_stylesheet = plugins_url ( '/css/ax-standard.css', AXIP_PLUGIN_NAME );
			$AxcelerateAPI = new AxcelerateAPI();
			extract( shortcode_atts( array(
					'template' => '',
					'training_cat'=> '',
					'course_type'=> '',
					'search_term'=>'',
					'style'=> '',
					'location'=>'',
					'state'=>'',
					'domain_id'=>'',
					'course_id'=>'',
					'instance_id'=>'',
					'combine_tables'=>'true',
					'custom_css'=>'',
					'class_to_add'=>'',
					'venue_restriction'=>'',
					'delivery_location_restriction'=>'',
					'show_full_instances'=>false,
		
		
		
			), $atts ) );
		
			global $post;
			if(empty($style)){
				//Check for an option override.
				$style = get_option('ax_course_instance_default_style');
			}
			if(empty($style)){
				$style = 'ax-standard';
			}
			if(!empty($show_full_instances)){
				if($show_full_instances === true || $show_full_instances === 'true'){
					$show_full_instances = true;
				}
				else if ($show_full_instances === '1' || $show_full_instances === 1){
					$show_full_instances = true;
				}
				else{
					$show_full_instances = false;
				}
			}
		
			wp_register_style ( 'ax-standard', $default_stylesheet ,array());
			wp_enqueue_style ( 'ax-standard' );
		
		
			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_instance_list');
				$class_to_add = $class_to_add .' '. $css;
			}
		
			$html = '<div class="ax-course-instance-list '. $style .' '.$class_to_add.'">';
		
			if(empty($template)){
				if(strtolower($course_type) == 'w'){
					$template = get_option('ax_course_instance_layout_w');
				}
				else{
					$template = get_option('ax_course_instance_layout_p');
				}
		
			}
			$as_table = false;
			if(!empty($content)){
				$template = $content;
					
					
			}
		
		
			/*Strip extra table and tbody tags to ensure that the content gets set to 1 row*/
			if(!empty ($combine_tables)){
		
				if(strpos($template, '<table') !== false){
					/*preg_match('#</?table(\s[^>]*)?>#i', $template, $matches);*/
		
					$template = preg_replace('#</?table(\s[^>]*)?>#i', '', $template);
					$template = preg_replace('#</?tbody(\s[^>]*)?>#i', '', $template);
		
					/*check for headers and if present remove all the extra headers*/
					preg_match_all('#<thead>.*?</thead>#is', $template, $header);
					$template = preg_replace('#<thead>.*?</thead>#is', '', $template);
					$html = $html . '<table>';
					if(!empty($header)){
						$html = $html.$header[0][0];
					}
					$as_table = true;
				}
			}

		

			$MonthsToCheckP = get_option('ax_course_instance_months_search_p', "-6");
			$MonthsToCheckW = get_option('ax_course_instance_months_search_w', "-1");
			/*Search Params*/
			$params = array (
					'displayLength' => 2000,
					'startDate_min' => date ( 'Y-m-d', strtotime ( "-6 months" ) ),
					'startDate_max' => '2100-01-01',
					'finishDate_min' => date ( 'Y-m-d' ),
					'finishDate_max' => '2100-01-01',
					'enrolmentOpen' => 1,
					'sortColumn' =>9,
					'sortDirection'=> 'asc'
			);

			if(empty($course_type)){
				if(!empty ($_REQUEST['course_type'])){
					$course_type = $_REQUEST['course_type'];
				}
				else if(!empty ($_REQUEST['type'])){
					$course_type = $_REQUEST['type'];
				}
				else if(!empty ($_REQUEST['ctype'])){
					$course_type = $_REQUEST['ctype'];
				}
				else{
					$course_ref = $custom_content = get_post_meta ( $post->ID, 'course_ref' );
					if (! empty ( $course_ref )) {
						$refSplit = explode ( '_', $course_ref [0] );
						$course_type = $refSplit [1];
					
					}
				}
			}
			
			$cListParams = array();
			if(! empty ($training_cat)){
				$params["trainingCategory"] = $training_cat;
				$cListParams["trainingArea"] = $training_cat;
			}
			if(! empty ($course_type)){
				$params["type"] = $course_type;
				$cListParams["type"] = $course_type;
				
				if( strtolower($course_type) == 'p'){
					$params['sortColumn'] = 11;

					if(!empty($MonthsToCheckP)){
						$params["startDate_min"] =  date ( 'Y-m-d', strtotime ( $MonthsToCheckP . " months" ) );
					}
				}
				else{
					if(!empty($MonthsToCheckW)){
						$params["startDate_min"] =  date ( 'Y-m-d', strtotime ( $MonthsToCheckW . " months" ) );
					}
				}
				
				
			}


			if(! empty ($search_term)){
				$params["searchTerm"] = $search_term;
			}
			if(! empty ($location)){
				$params["location"] = $location;
			}
			if(! empty ($state)){
				$params["state"] = $state;
			}
			if(! empty ($domain_id)){
				$params["domainID"] = $domain_id;
			}
			if(! empty ($course_id)){
				$params["ID"] = $course_id;
				$cListParams["ID"] = $course_id;
			}
			if(!empty($delivery_location_restriction)){
				$params["deliveryLocationID"] = intval($delivery_location_restriction);
			}
			if(!empty($venue_restriction)){
				$params["venueContactID"] = intval($venue_restriction);
			}
			
			if(! empty ($instance_id)){
				$params["instanceID"] = $instance_id;
			}
			if(empty ($instance_id)){
				$instance_ref = $custom_content = get_post_meta ( $post->ID, 'instance_ref' );	
				if (! empty ( $instance_ref )) {
					$refSplit = explode ( '_', $instance_ref [0] );
					$instance_id = $refSplit [0];
					$course_type = $refSplit [1];
					$params["instanceID"] = $instance_id;
					$params["type"] = $course_type;
					$cListParams["type"] = $course_type;
			
				}
			}
			
			
			$params["displayLength"] = 100;
			$cListParams["displayLength"] = 200;
		
			/* Call /courses to get a list to compare against */ 
			$courseList = $AxcelerateAPI->callResource($cListParams, '/courses', 'GET');
		
			$courseListRef = array();
			/* Flattern list to get an ID ref list */
			if(!empty($courseList)){
				foreach($courseList as $courseRow){
					if(key_exists('ID', $courseRow)){
						$courseListRef[$courseRow->ID . '_' . $courseRow->TYPE] = $courseRow;
					}
				}
			}
			
			$course_instance_array = $AxcelerateAPI->callResource ( $params, 'course/instance/search', 'POST' );
		
		
			if(empty ($template)){
				$template = '<table>';
				$template = $template . '<thead><tr>';
				$template = $template .     '
					 <td>Name</td>
					<td>Course Start Date</td>
					<td>Course End Date</td>
					<td>Cost</td>
					<td></td>';
				$template = $template .'</tr></thead>';
					
				$template = $template .     '<tbody><tr>';
				$template = $template . '
					<td>[ax_course_instance_name]</td>
					<td>[ax_course_instance_startdate]</td>
					<td>[ax_course_instance_finishdate]</td>
					<td>$[ax_course_instance_cost]</td>
					<td>[ax_course_button_link button_text=Enrol link_mode=url]</td>';
		
				$template = $template . '</tr></tbody></table>';
				
			}
			$instanceProccessed = array();
			foreach ( $course_instance_array as $row ) {
				
				if(key_exists($row->INSTANCEID, $instanceProccessed)){
					//skip
				}
				else{
					$instanceProccessed [$row->INSTANCEID] = true;
					$addCourse = false;
					if (key_exists ( 'TYPE', $row )) {
						$addCourse = true;
						if ($row->TYPE == 'w') {
							if ($row->PARTICIPANTVACANCY > 0 && $row->ENROLMENTOPEN) {
                                
                                //Update vacancy if grouped courses are in play.
                                $vacancy = self::get_updated_vacancy($row);
                                $row->PARTICIPANTVACANCY = $vacancy;
                                if($vacancy < 1 && !$show_full_instances){
                                    $addCourse = false;
                                }
                                else{
                                    $addCourse = true;
                                }
								
							} else if($show_full_instances){
								$addCourse = true;
								
							} else {
								$addCourse = false;
							}
						}
						else if(empty($row->ENROLMENTOPEN) && key_exists ( 'ENROLMENTOPEN', $row )){
							$addCourse = false;
						}
							
						if ($addCourse) {

							$tempTemplate = $template;
							$baseParams = 'course_id=' . $row->ID . ' course_type=' . $row->TYPE . ' instance_id=' . $row->INSTANCEID;
		
							$tempTemplate = str_replace ( '[ax_course_code', '[ax_course_code ' . $baseParams . ' course_code=' . urlencode ( !empty($row->CODE)?$row->CODE:' ' ) . ' in_course_block=true ', $tempTemplate );
							$tempTemplate = str_replace ( '[ax_course_name', '[ax_course_name ' . $baseParams . ' course_name='.'' . urlencode ( !empty($row->COURSENAME)?$row->COURSENAME:' ' ) . '  in_course_block=true ', $tempTemplate );
							$tempTemplate = str_replace ( '[ax_course_type', '[ax_course_type ' . $baseParams, $tempTemplate );
		
							/* Course Instance Shortcodes */
							$tempTemplate = str_replace ( '[ax_course_instance_name', '[ax_course_instance_name ' . $baseParams . ' instance_name=' . urlencode (  !empty($row->NAME)?$row->NAME:' ' ) . ' in_course_block=true ', $tempTemplate );
		
							$tempTemplate = str_replace ( '[ax_course_instance_startdate', '[ax_course_instance_startdate ' . $baseParams . ' start_date=' . urlencode ( !empty($row->STARTDATE)?$row->STARTDATE:' ' ) . ' in_course_block=true ', $tempTemplate );
							$tempTemplate = str_replace ( '[ax_course_instance_finishdate', '[ax_course_instance_finishdate ' . $baseParams . ' finish_date=' . urlencode ( !empty($row->FINISHDATE)?$row->FINISHDATE:' ' ) . ' in_course_block=true ', $tempTemplate );
		
							if (! empty ( $row->STREAMNAME )) {
								$tempTemplate = str_replace ( '[ax_course_stream', '[ax_course_stream ' . ' course_stream=' . urlencode ( !empty($row->STREAMNAME)?$row->STREAMNAME:' ' ) . ' in_course_block=true ', $tempTemplate );
							}
							$tempTemplate = str_replace ( '[ax_course_instance_location', '[ax_course_instance_location ' . $baseParams . ' location=' . urlencode ( !empty($row->LOCATION)?$row->LOCATION:' ' ) . ' in_course_block=true ', $tempTemplate );
							if ($row->TYPE == 'w') {
								
								$tempTemplate = str_replace ( '[ax_course_instance_vacancy', '[ax_course_instance_vacancy ' . $baseParams . ' vacancy=' . (!empty($row->PARTICIPANTVACANCY)?$row->PARTICIPANTVACANCY:0) . ' in_course_block=true ', $tempTemplate );
									
								$tempTemplate = str_replace ( '[ax_course_instance_starttime', '[ax_course_instance_starttime ' . $baseParams . ' start_date=' . urlencode ( !empty($row->STARTDATE)?$row->STARTDATE:' ' ) . ' in_course_block=true ', $tempTemplate );
								$tempTemplate = str_replace ( '[ax_course_instance_finishtime', '[ax_course_instance_finishtime ' . $baseParams . ' finish_date=' . urlencode ( !empty($row->FINISHDATE)?$row->FINISHDATE:' ' ) . ' in_course_block=true ', $tempTemplate );
									
								if (! empty ( $row->DATEDESCRIPTOR )) {
									$tempTemplate = str_replace ( '[ax_course_instance_datedescriptor', '[ax_course_instance_datedescriptor ' . $baseParams . ' date_descriptor=' . urlencode (!empty($row->DATEDESCRIPTOR)?$row->DATEDESCRIPTOR:' ' ) . ' in_course_block=true ', $tempTemplate );
								} else {
									$tempTemplate = str_replace ( '[ax_course_instance_datedescriptor', '[ax_course_instance_datedescriptor ' . $baseParams . ' in_course_block=true ', $tempTemplate );
								}
							}
		
							$tempTemplate = str_replace ( '[ax_course_instance_cost', '[ax_course_instance_cost ' . $baseParams . ' cost=' . (!empty($row->COST)?$row->COST:0) . ' in_course_block=true ', $tempTemplate );
		
		
							
							/*Shopping Cart*/
							
							$shoppingCartParams = $baseParams 
													. ' cost=' . (!empty($row->COST)?$row->COST:0) 
													. ' course_name='.'' . urlencode ( !empty($row->COURSENAME)?$row->COURSENAME:' ' ) 
													. ' course_location=' .''. urlencode ( !empty($row->LOCATION)?$row->LOCATION:' ' );
							
							if($row->TYPE == 'w'){
								$vacancy = !empty($row->PARTICIPANTVACANCY)?$row->PARTICIPANTVACANCY:0;
								/*if for some reason enrolmentopen is set to false then set vacancy to 0*/
								if(empty($row->ENROLMENTOPEN)){
									$vacancy = 0;
								}
								$shoppingCartParams .= ' vacancy='.$vacancy;
								$tempTemplate = str_replace ( '[ax_course_button_link', '[ax_course_button_link ' . $baseParams .' vacancy='.$vacancy, $tempTemplate );
							}
							else{
								$tempTemplate = str_replace ( '[ax_course_button_link', '[ax_course_button_link ' . $baseParams , $tempTemplate );
							}
							if(! empty ( $row->DATEDESCRIPTOR)){
								$shoppingCartParams .= ' course_date=' .urlencode ($row->DATEDESCRIPTOR );
							}
							else if(!empty($row->STARTDATE)){
								$date = date('d/m/Y', strtotime($row->STARTDATE)) .' - '. date('d/m/Y', strtotime($row->FINISHDATE));
								$shoppingCartParams .= ' course_date=' .urlencode ($date);
							}
							$tempTemplate = str_replace('[ax_add_to_cart', '[ax_add_to_cart '.$shoppingCartParams , $tempTemplate);
		
							/**
							 * ** Upwards Shortcodes - Get Course Details / Course list if used - prevent_loop included to stop endless loops ***
							 */
							$tempTemplate = str_replace ( '[ax_course_details', '[ax_course_details ' . $baseParams . ' prevent_loop=true', $tempTemplate );
		
							/**
							 * ** potential to add this later - but should not be needed for anything ***
							 */
							// $tempTemplate = str_replace ( 'ax_course_list', 'ax_course_list ' . $baseParams, $tempTemplate );
							
							$html = $html . $tempTemplate;
						}
							
					}
						
						
				}
			}
			if($as_table){
				$html = $html . '</tbody></table>';
					
				//$html = $html . "<script>jQuery(function($){ $('.ax-course-instance-list table thead:not(:first-of-type)').remove(); });</script>";
			}
		
			$html = $html . '</div>';
		
			return urldecode(do_shortCode($html));
		
        }
        
        /**
         * Helper function to check for grouped vacancy values.
         *
         * @param [struct] $instance
         * @return int
         * @author Rob Bisson <rob.bisson@axcelerate.com.au>
         */
        public function get_updated_vacancy($instance)
        {
            $vacancy = $instance->PARTICIPANTVACANCY;
            if (!empty($instance->GROUPEDCOURSEID) && !empty($instance->GROUPEDCOURSEISSIMULTANEOUS)) {
               
                $groupMax = $instance->GROUPEDMAXPARTICIPANTS;
                $groupCurrent = $instance->GROUPEDPARTICIPANTS;
                if ($groupCurrent < $groupMax && $vacancy > 0) {
                    if ($vacancy > ($groupMax - $groupCurrent)) {
                        $vacancy = $groupMax - $groupCurrent;
                    }
                } else {
                    $vacancy = 0;
                }
            }
            return $vacancy;
        }
		
		/*****Course Instance Shortcodes *****/
		/* ax_course_instance_name*/
		
		
		public function  ax_course_instance_name_handler ($atts) {
		
			$AxcelerateAPI = new AxcelerateAPI();
		
			extract( shortcode_atts( array(
					'course_id' => '',
					'course_type' => '',
					'instance_id'=> '',
					'instance_name'=> '',
					'in_course_block'=>'',
					'custom_css'=>'',
					'class_to_add'=>'',
					'wrap_tag'=>'',
			), $atts ) );
		
			$html = '';
			if(empty($instance_name) && empty($in_course_block) && !empty($instance_id)){
				$params = array(
						'id' => $course_id,
						'type' => $course_type,
						'instanceID '=> $instance_id,
							
				);
				$courseData = $AxcelerateAPI->callResource($params, '/course/instance/search', 'POST');
				if(!empty($courseData)){
					$html = $courseData[0]->NAME;
				}
				
			}
			else if(empty($instance_id)){
				$html = '';
			}
			else{
				$html = $instance_name;
			}
		
			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_instance_name');
				$class_to_add = $class_to_add .' '. $css;
			}
			if(!empty($wrap_tag)){
				$html = '<' . $wrap_tag . ' class="'.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
		
			}
			// Return the Course Name
			return urldecode($html);
		
		}
		/* ax_course_instance_location*/
		
		public function  ax_course_instance_location_handler ($atts) {
		
			$AxcelerateAPI = new AxcelerateAPI();
		
			extract( shortcode_atts( array(
					'course_id' => '',
					'course_type' => '',
					'instance_id'=> '',
					'location'=> '',
					'in_course_block'=>'',
					'custom_css'=>'',
					'class_to_add'=>'',
					'wrap_tag'=>'',
			), $atts ) );
		
			$html = '';
			/*check for empty preset value and to see if it has been added through a course block*/
			if(empty($location) && empty($in_course_block) && !empty($instance_id)){
				$params = array(
						'id' => $course_id,
						'type' => $course_type,
						'instanceID '=> $instance_id,
				);
				$courseData = $AxcelerateAPI->callResource($params, '/course/instance/search', 'POST');
				if(!empty($courseData)){
					$html = $courseData[0]->LOCATION;
				}
			}
			else if(empty($instance_id)){
				$html = '';
			}
			else{
				$html = $location;
			}
		
			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_instance_location');
				$class_to_add = $class_to_add .' '. $css;
			}
			if(!empty($wrap_tag)){
				$html = '<' . $wrap_tag . ' class="'.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
		
			}
			// Return the Course Name
			return urldecode($html);
		
		}
		/*ax_course_instance_startdate */
		
		public function  ax_course_instance_startdate_handler ($atts) {
		
			$AxcelerateAPI = new AxcelerateAPI();
		
			extract( shortcode_atts( array(
					'course_id' => '',
					'course_type' => '',
					'instance_id'=> '',
					'start_date'=> '',
					'in_course_block'=>'',
					'custom_css'=>'',
					'class_to_add'=>'',
					'wrap_tag'=>'',
			), $atts ) );
		
			$html = '';
			$tempStartDate = urldecode($start_date);
			/*check for empty preset value and to see if it has been added through a course block*/
			if(empty($start_date) && empty($in_course_block) && !empty($instance_id)){
				$params = array(
						'id' => $course_id,
						'type' => $course_type,
						'instanceID '=> $instance_id,
				);
				$courseData = $AxcelerateAPI->callResource($params, '/course/instance/search', 'POST');
				if(!empty($courseData)){
					$html = date('d/m/Y', strtotime($courseData[0]->STARTDATE));
				}
				
			}
			else if(empty($instance_id)){
				$html = '';
			}
			else if(empty($tempStartDate) || urldecode($start_date) == " "){

				$html = "";
			}
			else{
				$html = date('d/m/Y', strtotime(urldecode($start_date)));;
			}
			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_instance_startdate');
				$class_to_add = $class_to_add .' '. $css;
			}
			if(!empty($wrap_tag)){
				$html = '<' . $wrap_tag . ' class="'.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
		
			}
		
			// Return the Course Name
			return urldecode($html);
		
		}
		/*ax_course_instance_starttime */
		
		public function  ax_course_instance_starttime_handler ($atts) {
		
			$AxcelerateAPI = new AxcelerateAPI();
		
			extract( shortcode_atts( array(
					'course_id' => '',
					'course_type' => '',
					'instance_id'=> '',
					'start_date'=> '',
					'in_course_block'=>'',
					'custom_css'=>'',
					'class_to_add'=>'',
					'wrap_tag'=>'',
			), $atts ) );
		
			$html = '';
			/*check for empty preset value and to see if it has been added through a course block*/
			if(empty($course_instance_startdate) && empty($in_course_block) && !empty($instance_id)){
				$params = array(
						'id' => $course_id,
						'type' => $course_type,
						'instanceID '=> $instance_id,
				);
				$courseData = $AxcelerateAPI->callResource($params, '/course/instance/search', 'POST');
				if(!empty($courseData)){
					$html = date('h:i a', strtotime($courseData[0]->STARTDATE));
				}
			}
			else if(empty($instance_id)){
				$html = '';
			}
			else{
				$html = date('h:i a', strtotime(urldecode($start_date)));;
			}
			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_instance_starttime');
				$class_to_add = $class_to_add .' '. $css;
			}
			if(!empty($wrap_tag)){
				$html = '<' . $wrap_tag . ' class="'.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
		
			}
		
			// Return the Course Name
			return urldecode($html);
		
		}
		
		/*ax_course_instance_finishdate */
		public function  ax_course_instance_finishdate_handler ($atts) {
		
			$AxcelerateAPI = new AxcelerateAPI();
		
			extract( shortcode_atts( array(
					'course_id' => '',
					'course_type' => '',
					'instance_id'=> '',
					'finish_date'=> '',
					'in_course_block'=>'',
					'custom_css'=>'',
					'class_to_add'=>'',
					'wrap_tag'=>'',
			), $atts ) );
		
			$html = '';
			
			$tempFinish = urldecode($finish_date);
			/*check for empty preset value and to see if it has been added through a course block*/
			if(empty($finish_date) && empty($in_course_block) && !empty($instance_id)){
				$params = array(
						'id' => $course_id,
						'type' => $course_type,
						'instanceID '=> $instance_id,
				);
				$courseData = $AxcelerateAPI->callResource($params, '/course/instance/search', 'POST');
				if(!empty($courseData)){
					$html = date('d/m/Y', strtotime($courseData[0]->FINISHDATE));
				}
			}
			else if(empty($instance_id)){
				$html = '';
			}
		else if(empty($tempFinish) || urldecode($finish_date) == " "){

				$html = "";
			}
			else{
				$html = date('d/m/Y', strtotime(urldecode($finish_date)));;
			}
			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_instance_finishdate');
				$class_to_add = $class_to_add .' '. $css;
			}
			if(!empty($wrap_tag)){
				$html = '<' . $wrap_tag . ' class="'.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
		
			}
		
			// Return the Course Name
			return urldecode($html);
		
		}
		/*ax_course_instance_finishtime */
		
		public function  ax_course_instance_finishtime_handler ($atts) {
		
			$AxcelerateAPI = new AxcelerateAPI();
		
			extract( shortcode_atts( array(
					'course_id' => '',
					'course_type' => '',
					'instance_id'=> '',
					'finish_date'=> '',
					'in_course_block'=>'',
					'custom_css'=>'',
					'class_to_add'=>'',
					'wrap_tag'=>'',
			), $atts ) );
		
			$html = '';
			/*check for empty preset value and to see if it has been added through a course block*/
			if(empty($finish_date) && empty($in_course_block) && !empty($instance_id)){
				$params = array(
						'id' => $course_id,
						'type' => $course_type,
						'instanceID '=> $instance_id,
				);
				
				$courseData = $AxcelerateAPI->callResource($params, '/course/instance/search', 'POST');
				$html = date('h:i a', strtotime($courseData->FINISHDATE));
			}
			else if(empty($instance_id)){
				$html = '';
			}
			else{
				$html = date('h:i a', strtotime(urldecode($finish_date)));;
			}
			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_instance_finishtime');
				$class_to_add = $class_to_add .' '. $css;
			}
			if(!empty($wrap_tag)){
				$html = '<' . $wrap_tag . ' class="'.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
		
			}
		
			// Return the Course Name
			return urldecode($html);
		
		}
		/*ax_course_instance_datedescriptor*/
		public function  ax_course_instance_datedescriptor_handler ($atts) {
		
			$AxcelerateAPI = new AxcelerateAPI();
		
			extract( shortcode_atts( array(
					'course_id' => '',
					'course_type' => '',
					'instance_id'=> '',
					'date_descriptor'=> '',
					'in_course_block'=>'',
					'custom_css'=>'',
					'class_to_add'=>'',
					'wrap_tag'=>'',
			), $atts ) );
		
			$html = '';
			if(empty($date_descriptor) && empty($in_course_block) && !empty($instance_id)){
				$params = array(
						'id' => $course_id,
						'type' => $course_type,
						'instanceID '=> $instance_id,
		
				);
				$courseData = $AxcelerateAPI->callResource($params, '/course/instance/search', 'POST');
				if(!empty($courseData)){
					$html = $courseData[0]->DATEDESCRIPTOR;
				}
			}
			else if(empty($instance_id)){
				$html = '';
			}
			else{
				$html = $date_descriptor;
			}
			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_instance_datedescriptor');
				$class_to_add = $class_to_add .' '. $css;
			}
			if(!empty($wrap_tag)){
				$html = '<' . $wrap_tag . ' class="'.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
		
			}
		
			// Return the Course Name
			return urldecode($html);
		
		}
		
		/*ax_course_instance_vacancy*/
		
		public function  ax_course_instance_vacancy_handler ($atts) {
		
			$AxcelerateAPI = new AxcelerateAPI();
		
			extract( shortcode_atts( array(
					'course_id' => '',
					'course_type' => '',
					'instance_id'=> '',
					'vacancy'=> '',
					'in_course_block'=>'',
					'custom_css'=>'',
					'class_to_add'=>'',
					'wrap_tag'=>'',
			), $atts ) );
		
			$html = '';
			if(empty($vacancy) && empty($in_course_block) && !empty($instance_id)){
				$params = array(
						'id' => $course_id,
						'type' => $course_type,
						'instanceID '=> $instance_id,
		
				);
				$courseData = $AxcelerateAPI->callResource($params, '/course/instance/search', 'POST');
				if(!empty($courseData)){
                    $vacancy = $courseData[0]->PARTICIPANTVACANCY;
                    if($course_type == 'w'){
                        $vacancy = self::get_updated_vacancy($courseData[0]);
                    }
					$html = $vacancy;
				}
			}
			else if(empty($instance_id)){
				$html = '';
			}
			else{
				$html = $vacancy;
			}
			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_instance_vacancy');
				$class_to_add = $class_to_add .' '. $css;
			}
			if(!empty($wrap_tag)){
				$html = '<' . $wrap_tag . ' class="'.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
		
			}
		
			// Return the Course Name
			return urldecode($html);
		
		}
		
		/*ax_course_instance_cost*/
		public function  ax_course_instance_cost_handler ($atts) {
		
			$AxcelerateAPI = new AxcelerateAPI();
		
			extract( shortcode_atts( array(
					'course_id' => '',
					'course_type' => '',
					'instance_id'=> '',
					'cost'=> '',
					'in_course_block'=>'',
					'custom_css'=>'',
					'class_to_add'=>'',
					'wrap_tag'=>'',
			), $atts ) );
		
			$html = '';
			if(empty($cost) && empty($in_course_block) && !empty($instance_id)){
				$params = array(
						'id' => $course_id,
						'type' => $course_type,
						'instanceID '=> $instance_id,
		
				);
				$courseData = $AxcelerateAPI->callResource($params, '/course/instance/search', 'POST');
				if(!empty($courseData)){
					$html = number_format (floatval($courseData[0]->COST), 2, ".", ",");
				}
			}
			else if(empty($instance_id)){
				$html = '';
			}
			else{
				$html = number_format (floatval($cost), 2, ".", ",");
			}
			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_instance_cost');
				$class_to_add = $class_to_add .' '. $css;
			}
			if(!empty($wrap_tag)){
				$html = '<' . $wrap_tag . ' class="'.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
		
			}
		
		
			// Return the Course Name
			return urldecode($html);
		
		}
		
		function loadScripts() {

			
		}
		function loadStyles() {
			$VERSION = constant ( 'AXIP_PLUGIN_VERSION' );
			if ($VERSION === null) {
				$VERSION = time ();
			}
			
			wp_enqueue_style ( 'dashicons' );
		}

		
	}
	$AX_Course_Instances = new AX_Course_Instances();
	
	if(class_exists ( 'WPBakeryShortCode' ) && class_exists('AX_VC_PARAMS') && class_exists ( 'WPBakeryShortCodesContainer' )){
		vc_map ( array (
				"name" => __ ( "aX Course Instance List", "axcelerate" ),
				"base" => "ax_course_instance_list",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				"description"=>__ ( "Leave empty to use the default template.", "axcelerate" ),
				"content_element" => true,
				"show_settings_on_create" => true,
				//"is_container" => true,
				"as_parent"=>array('except'=> 'ax_course_list,ax_course_instance_list', 'only'=>''),
		
				"category" => array (
						'aX Parent Codes', 'aX Course Detail',
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
										'Tiled Layout' => 'ax-tile',
										'Modern Layout' => 'ax-modern'
								),
								'description' => __ ( 'Layout Style' )
						),
						
						AX_VC_PARAMS::$AX_VC_SHOW_FULL_INSTANCES,
						AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
						AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
						AX_VC_PARAMS::$AX_VC_INSTANCEID,
						array(
								'type' => 'textfield',
									
								'heading' => __ ( 'Search Term' ),
								'param_name' => 'search_term',
								"description" => __("Search Term, input a text string to filter results.", 'axcelerate'),
								"group"=>'Filters'
						),
						array(
								'type' => 'textfield',
									
								'heading' => __ ( 'Domain ID' ),
								'param_name' => 'domain_id',
								"description" => __("Domain ID, input a domain ID (numeric) to filter results.", 'axcelerate'),
								"group"=>'Filters'
						),
						array(
								'type' => 'textfield',
		
								'heading' => __ ( 'Location' ),
								'param_name' => 'location',
								"description" => __("Location, Input a location string to filter results.", 'axcelerate'),
								"group"=>'Filters'
						),
						AX_VC_PARAMS::$AX_VC_DL_LOCATION_RESTRICTION_PARAM,
						AX_VC_PARAMS::$AX_VC_VENUE_RESTRICTION_PARAM,
						array(
								'type' => 'textfield',
		
								'heading' => __ ( 'State' ),
								'param_name' => 'state',
								"description" => __("State, Input a State string to filter results.", 'axcelerate'),
								"group"=>'Filters'
						),
		
						array(
								'type' => 'dropdown',
		
								'heading' => __ ( 'Combine Tables' ),
								'param_name' => 'combine_tables',
								'value' => array (
										'Individual/No tables' => false,
										'Combine Tables' => true,
								),
						),
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM
				)
		) );
		class WPBakeryShortCode_aX_Course_Instance_List extends WPBakeryShortCodesContainer {}
		
		
		vc_map ( array (
				"name" => __ ( "aX Instance Name", "axcelerate" ),
				"base" => "ax_course_instance_name",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				"content_element" => true,
				"description"=>__ ( "Instance Name", "axcelerate" ),
				"show_settings_on_create" => true,
				"is_container"=>false,
				"as_parent"=>array('only'=>''),
					
				"category" => array (
						'aX Course Instances',
				),
				'params' => array (
						AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
						AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
						AX_VC_PARAMS::$AX_VC_INSTANCEID,
							
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
						AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
		
				)
		) );
		class WPBakeryShortCode_aX_Course_Instance_Name extends WPBakeryShortCode {}
		vc_map ( array (
				"name" => __ ( "aX Instance Location", "axcelerate" ),
				"base" => "ax_course_instance_location",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				"content_element" => true,
				"description"=>__ ( "Instance Location", "axcelerate" ),
				"show_settings_on_create" => true,
				"is_container"=>false,
				"as_parent"=>array('only'=>''),
					
				"category" => array (
						'aX Course Instances',
				),
				'params' => array (
						array(
								'type' => 'dropdown',
		
								'heading' => __ ( 'Course Type' ),
								'param_name' => 'course_type',
								'value' => array (
										'Dynamic' => '',
										'Workshop' => 'w',
								),
						),
						AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
						AX_VC_PARAMS::$AX_VC_INSTANCEID,
		
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
						AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
		
				)
		) );
		
		class WPBakeryShortCode_aX_Instance_Location extends WPBakeryShortCode {}
		vc_map ( array (
				"name" => __ ( "aX Instance Startdate", "axcelerate" ),
				"base" => "ax_course_instance_startdate",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				"content_element" => true,
				"description"=>__ ( "Instance Start Date", "axcelerate" ),
				"show_settings_on_create" => true,
				"is_container"=>false,
				"as_parent"=>array('only'=>''),
					
				"category" => array (
						'aX Course Instances',
				),
				'params' => array (
						AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
						AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
						AX_VC_PARAMS::$AX_VC_INSTANCEID,
		
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
						AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
		
				)
		) );
		
		class WPBakeryShortCode_aX_Course_Instance_Startdate extends WPBakeryShortCode {}
		vc_map ( array (
				"name" => __ ( "aX Instance Starttime", "axcelerate" ),
				"base" => "ax_course_instance_starttime",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				"content_element" => true,
				"description"=>__ ( "(Workshop Only) Instance Start Time", "axcelerate" ),
				"show_settings_on_create" => true,
				"is_container"=>false,
				"as_parent"=>array('only'=>''),
					
				"category" => array (
						'aX Course Instances',
				),
				'params' => array (
						array(
								'type' => 'dropdown',
		
								'heading' => __ ( 'Course Type' ),
								'param_name' => 'course_type',
								'value' => array (
										'Dynamic' => '',
										'Workshop' => 'w',
								),
						),
						AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
						AX_VC_PARAMS::$AX_VC_INSTANCEID,
		
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
						AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
		
				)
		) );
		class WPBakeryShortCode_aX_Course_Instance_Starttime extends WPBakeryShortCode {}
		
		vc_map ( array (
				"name" => __ ( "aX Instance Finishdate", "axcelerate" ),
				"base" => "ax_course_instance_finishdate",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				"content_element" => true,
				"description"=>__ ( "Instance Finish Date", "axcelerate" ),
				"show_settings_on_create" => true,
				"is_container"=>false,
				"as_parent"=>array('only'=>''),
					
				"category" => array (
						'aX Course Instances',
				),
				'params' => array (
						AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
						AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
						AX_VC_PARAMS::$AX_VC_INSTANCEID,
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
						AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
		
				)
		) );
		class WPBakeryShortCode_aX_Course_Instance_Finishdate extends WPBakeryShortCode {}	
		
		vc_map ( array (
				"name" => __ ( "aX Instance Finishtime", "axcelerate" ),
				"base" => "ax_course_instance_finishtime",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				"content_element" => true,
				"description"=>__ ( "(Workshop Only) Instance Finish Time", "axcelerate" ),
				"show_settings_on_create" => true,
				"is_container"=>false,
				"as_parent"=>array('only'=>''),
					
				"category" => array (
						'aX Course Instances',
				),
				'params' => array (
						array(
								'type' => 'dropdown',
		
								'heading' => __ ( 'Course Type' ),
								'param_name' => 'course_type',
								'value' => array (
										'Dynamic' => '',
										'Workshop' => 'w',
								),
						),
						AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
						AX_VC_PARAMS::$AX_VC_INSTANCEID,
		
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
						AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
		
				)
		) );
		class WPBakeryShortCode_aX_Course_Instance_Finishtime extends WPBakeryShortCode {
		}
		
		vc_map ( array (
				"name" => __ ( "aX Instance Vacancy", "axcelerate" ),
				"base" => "ax_course_instance_vacancy",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				"content_element" => true,
				"description"=>__ ( "(Workshop Only) Instance Vacancy", "axcelerate" ),
				"show_settings_on_create" => true,
				"is_container"=>false,
				"as_parent"=>array('only'=>''),
					
				"category" => array (
						'aX Course Instances',
				),
				'params' => array (
						array(
								'type' => 'dropdown',
		
								'heading' => __ ( 'Course Type' ),
								'param_name' => 'course_type',
								'value' => array (
										'Dynamic' => '',
										'Workshop' => 'w',
								),
						),
						AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
						AX_VC_PARAMS::$AX_VC_INSTANCEID,
		
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
						AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
		
				)
		) );
		class WPBakeryShortCode_aX_Course_Instance_Vacancy extends WPBakeryShortCode {
		}
		
		vc_map ( array (
				"name" => __ ( "aX Instance Cost", "axcelerate" ),
				"base" => "ax_course_instance_cost",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				"content_element" => true,
				"description"=>__ ( "Instance Cost - Does not include currency symbol", "axcelerate" ),
				"show_settings_on_create" => true,
				"is_container"=>false,
				"as_parent"=>array('only'=>''),
					
				"category" => array (
						'aX Course Instances',
				),
				'params' => array (
						AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
						AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
						AX_VC_PARAMS::$AX_VC_INSTANCEID,
		
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
						AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
		
				)
		) );
		class WPBakeryShortCode_aX_Course_Instance_Cost extends WPBakeryShortCode {
		}
		
		vc_map ( array (
				"name" => __ ( "aX Instance Date Descriptor", "axcelerate" ),
				"base" => "ax_course_instance_datedescriptor",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				"content_element" => true,
				"description"=>__ ( "(Workshop Only) Instance Date Descriptor", "axcelerate" ),
				"show_settings_on_create" => true,
				"is_container"=>false,
				"as_parent"=>array('only'=>''),
					
				"category" => array (
						'aX Course Instances',
				),
				'params' => array (
						array(
								'type' => 'dropdown',
		
								'heading' => __ ( 'Course Type' ),
								'param_name' => 'course_type',
								'value' => array (
										'Dynamic' => '',
										'Workshop' => 'w',
								),
						),
						AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
						AX_VC_PARAMS::$AX_VC_INSTANCEID,
		
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
						AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
		
				)
		) );
		class WPBakeryShortCode_aX_Course_Instance_Datedescriptor extends WPBakeryShortCode {
		}
		
		
	}
}
