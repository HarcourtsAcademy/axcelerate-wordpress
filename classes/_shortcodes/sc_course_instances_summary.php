<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */

if (! class_exists ( 'AX_Course_Instance_Summary' )) {
	class AX_Course_Instance_Summary {
		function __construct() {
			add_shortcode( 'ax_course_instance_summary', array(&$this, 'ax_course_instance_summary_handler' ) );
			add_shortcode( 'ax_cis_duration', array(&$this, 'ax_course_instance_summary_duration_handler' ) );
			add_shortcode( 'ax_cis_count', array(&$this, 'ax_course_instance_summary_count_handler' ) );
			add_shortcode( 'ax_cis_location_count', array(&$this, 'ax_course_instance_summary_location_count_handler' ) );
			add_shortcode( 'ax_cis_cost', array(&$this, 'ax_course_instance_summary_cost_handler' ) );

		}
		
		function ax_course_instance_summary_handler($atts=array(), $content=null){
			$default_stylesheet = plugins_url ( '/css/ax-standard.css', AXIP_PLUGIN_NAME );

			extract( shortcode_atts( array(
					'custom_css'=>'',
					'class_to_add'=>'',
					'location_restriction'=>'',
					'delivery_location_restriction'=>'',
					'workshop_venues'=>'',
					'course_id'=>0,
					'course_type'=>'',
					
			
			), $atts ) );
			
			if(empty($course_id)){
				$course_id=get_query_var('course_id');
			}
			if(empty($course_type)){
				$course_type=get_query_var('course_type');
			}
			if(empty($course_type)){
				$course_type=get_query_var('type');
			}

			if(empty($style)){
				$style = 'ax-standard';
			}
			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_instance_summary');
				$style = $style .' '. $css;
			}
			if(!empty ($class_to_add)){
				$style = $style . ' '. $class_to_add;
			}
			wp_register_style ( 'ax-standard', $default_stylesheet ,array());
			wp_enqueue_style ( 'ax-standard' );
			if(!empty ($course_id) && !empty($course_type)){
				$params = array (
						'displayLength' => 500,
						'startDate_max' => '2100-01-01',
						'finishDate_min' => date ('Y-m-d' ),
						'finishDate_max' => '2100-01-01',
						'enrolmentOpen' => 1,
						'ID'=>$course_id,
						'TYPE'=>$course_type,
				);
				
				if($course_type == 'w'){
					$params['startDate_min'] = date ( 'Y-m-d', strtotime ( "-1 month" ) );
				}
				else{
					$params['startDate_min'] = date ( 'Y-m-d', strtotime ( "-6 months" ) );
				}
				if(!empty($delivery_location_restriction)){
					$params["deliveryLocationID"] = intval($delivery_location_restriction);
				}
				if(!empty($venue_restriction)){
					$params["venueContactID"] = intval($venue_restriction);
				}
				if(! empty ($location)){
					$params["location"] = $location;
				}
				
				
				$instances = $this->getCourseInstances($params);
				$summary = $this->summariseInstances($instances);
			}
			else{
				return '';
			}
			$returnObject = '';
			$returnObject = $returnObject. '<div class="ax-course-summary ' . $style . '">';
	
			if(!empty($content)){
				$content = str_replace('[ax_course_code', '[ax_course_code course_code='. urlencode ($summary['code']) .' ' , $content);
					
					$duration = join('|', $summary['duration']);
					$content = str_replace('[ax_cis_duration', '[ax_cis_duration duration='. urlencode ($duration) .' ' , $content);
					
					$count = $summary['count'];
					$content = str_replace('[ax_cis_count', '[ax_cis_count count='. $summary['count'] .' ' , $content);
					$locations = join('|', $summary['location']);
					$content = str_replace('[ax_cis_location_count', '[ax_cis_location_count locations='. urlencode ($locations) .' ' , $content);
					$costs = join('|', $summary['cost']);
					$content = str_replace('[ax_cis_cost', '[ax_cis_cost cost='. urlencode ($costs) .' ' , $content);
				
				
				
			}
			$returnObject = $returnObject . $content;
			
			$returnObject = $returnObject. '</div>';
			
			
			return do_shortcode($returnObject);
			
			
			//Load in Course Type Selector
			
			//Load in Course Lists
			
			//(JS FILE) on course selection load in locations (course instance search, with locations populated.
			
			//On Location selected - Display filtered list of instances for that location.
			
		}
		
		function ax_course_instance_summary_duration_handler($atts=array(), $content=null){
			extract( shortcode_atts( array(
					'duration'=> '',
			), $atts ) );
			
			if(!empty ($duration)){
				$duration = urldecode($duration);
				$duration = explode('|', $duration);
			}
			else{
				return $duration;
			}
			$content = '';
			$i = 0;
			foreach ($duration as $durRecord){
				$content = $content. '<p>'.$durRecord.'</p>';
				$i++;
			}
			
			return $content;
			
		}
		
		function ax_course_instance_summary_count_handler($atts=array(), $content=null){
			extract( shortcode_atts( array(
					'count'=> '',
					'extra_text'=> '',
			), $atts ) );
			$content = '';
			$content = $content.$count;
			
			if(!empty($extra_text)){
				$content = $content . ' '. $extra_text;
			}
			
				
			return $content;
			
		}
		function ax_course_instance_summary_cost_handler($atts=array(), $content=null){
			extract( shortcode_atts( array(
					'cost'=> '',
					'extra_text'=> '',
			), $atts ) );
			if(!empty ($cost)){
				$cost = urldecode($cost);
				$cost = explode('|', $cost);
			}
			else{
				return $cost;
			}
			$content = '';
			$i = 0;
			foreach ($cost as $costRecord){
				$content = $content. '<p>$ '.$costRecord.' '. $extra_text.'</p>';
				$i++;
			}

			return $content;
				
		}
		function ax_course_instance_summary_location_count_handler($atts=array(), $content=null){
			extract( shortcode_atts( array(
					'locations'=> '',
					'extra_text'=> 'Locations',
			), $atts ) );
			if(!empty ($locations)){
				$locations = urldecode($locations);
				$locations = explode('|', $locations);
			}
			else{
				return '0 ' . $extra_text;
			}
			$content = '';
			
			$content = $content. '<p>'.count($locations).' '. $extra_text.'</p>';
		
			return $content;
				
		}
		
		
		function getCourseInstances($params = array()){
			$API = new AxcelerateAPI();
			
			
			$instances = $API->callResource($params, '/course/instance/search', 'POST');
			if(!empty($instances) && is_array($instances)){
				if(!empty ($instances[0])){
					if(!empty($instances[0]->ID)){
						return $instances;
					}
				}
			}
			
			return array();
		}
		function summariseInstances($instances= array()){
			/*check for empty array*/
			$durationArray = array();
			$count = 0;
			$locationArray = array();
			$costArray = array();
			$code = '';
			if($instances){
				foreach($instances as $instance){
					$count++;
					$duration = $instance->DURATION;
					$cost = $instance->COST;
					if(!empty($instance->CODE)){
						$code = $instance->CODE;
					}
					if($instance->TYPE == 'p'){
						$location =$instance->DELIVERYLOCATIONID;
					}
					else{
						if(!empty($instance->VENUECONTACTID )){
							$location = $instance->VENUECONTACTID;
						}
						else{
							if(!empty($instance->LOCATION)){
								$location = $instance->LOCATION;
							}
							else{
								$location = 1;
							}
						}
					}
					if(!empty($location)){
						if( ! in_array($location, $locationArray) ){
							$locationArray[] = $location;
						}
					}
					if(!empty($duration)){
						if( ! in_array($duration, $durationArray) ){
							$durationArray[] = $duration;
						}
					}
					
					if(!empty($cost) || $cost === 0){
						if( ! in_array($cost, $costArray) ){
							$costArray[] = $cost;
						}
					}
				}
			}
			
			return array(
					'duration'=>$durationArray,
					'count'=>$count,
					'location'=>$locationArray,
					'cost'=>$costArray,
					'code'=>$code,
			);
		}

		
	}
	$AX_Course_Instance_Summary = new AX_Course_Instance_Summary();
	
	if(class_exists ( 'WPBakeryShortCode' ) && class_exists('AX_VC_PARAMS') && class_exists ( 'WPBakeryShortCodesContainer' )){
		vc_map ( array (
				"name" => __ ( "aX Course Instance Summary", "axcelerate" ),
				"base" => "ax_course_instance_summary",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				//"content_element" => true,
				"description"=>__ ( "Summarise Course Information", "axcelerate" ),
				"show_settings_on_create" => false,
				//"is_container"=>true,
				"as_parent"=>array('only'=>''),
				//"js_view"=>'VcBackendTtaTabsView',
				'js_view'=>'VcRowView',
				"category" => array (
						'aX Parent Codes','aX Course Detail',
				),
				'params' => array (
						AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
						AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
						AX_VC_PARAMS::$AX_VC_LOCATION_RESTRICTION_PARAM,
						AX_VC_PARAMS::$AX_VC_DL_LOCATION_RESTRICTION_PARAM,
						
						AX_VC_PARAMS::$AX_VC_VENUE_RESTRICTION_PARAM,			
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
				),
				"default_content" =>'
					[vc_row_inner]
						[vc_column_inner width="1/6"]
							[vc_icon icon_fontawesome="fa fa-tag" color="black" align="center"]
							[ax_course_code]
						[/vc_column_inner]
						[vc_column_inner width="1/6"]
							[vc_icon align="center" icon_fontawesome="fa fa-calendar-check-o" color="black"]
							[ax_cis_duration]
						[/vc_column_inner]
						[vc_column_inner width="1/6"]
							[vc_icon icon_fontawesome="fa fa-calendar" color="black" align="center"]
							[ax_cis_count]
						[/vc_column_inner]
						[vc_column_inner width="1/6"]
							[vc_icon icon_fontawesome="fa fa-map-marker" color="black" align="center"]
							[ax_cis_location_count extra_text="Location(s)"]
						[/vc_column_inner]
						[vc_column_inner width="1/6"]
							[vc_icon icon_fontawesome="fa fa-usd" color="black" align="center"]
							[ax_cis_cost extra_text="Incl. GST"]
						[/vc_column_inner]
					[/vc_row_inner]

				',
		) );
		class WPBakeryShortCode_aX_Course_Instance_Summary extends WPBakeryShortCodesContainer {
		}
		
		
		
		/*Summary Duration*/
		vc_map ( array (
				"name" => __ ( "aX CIS Duration", "axcelerate" ),
				"base" => "ax_cis_duration",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				//"content_element" => true,
				"description"=>__ ( "Summarise Course Information", "axcelerate" ),
				"show_settings_on_create" => false,

				"as_parent"=>array('only'=>''),
				//"js_view"=>'VcBackendTtaTabsView',

				"category" => array (
						'aX Course Summary'
				),
				'params' => array (
		
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
				),
		) );
		class WPBakeryShortCode_aX_CIS_Duration extends WPBakeryShortCode {
		}
		
		/*Summary Count*/
		vc_map ( array (
				"name" => __ ( "aX CIS Count", "axcelerate" ),
				"base" => "ax_cis_count",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				//"content_element" => true,
				"description"=>__ ( "Summarise Course Information", "axcelerate" ),
				"show_settings_on_create" => false,
		
				"as_parent"=>array('only'=>''),
				//"js_view"=>'VcBackendTtaTabsView',
		
				"category" => array (
						'aX Course Summary'
				),
				'params' => array (
						AX_VC_PARAMS::$AX_VC_EXTRA_TEXT,
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
						
				),
		) );
		class WPBakeryShortCode_aX_CIS_Count extends WPBakeryShortCode {
		}
		
		/*Summary Location Count*/
		vc_map ( array (
				"name" => __ ( "aX CIS Location Count", "axcelerate" ),
				"base" => "ax_cis_location_count",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				//"content_element" => true,
				"description"=>__ ( "Summarise Course Information", "axcelerate" ),
				"show_settings_on_create" => false,
		
				"as_parent"=>array('only'=>''),
				//"js_view"=>'VcBackendTtaTabsView',
		
				"category" => array (
						'aX Course Summary'
				),
				'params' => array (
						AX_VC_PARAMS::$AX_VC_EXTRA_TEXT,
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
					
				),
		) );
		class WPBakeryShortCode_aX_CIS_Location_Count extends WPBakeryShortCode {
		}
		/*Summary Cost*/
		vc_map ( array (
				"name" => __ ( "aX CIS Cost", "axcelerate" ),
				"base" => "ax_cis_cost",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				//"content_element" => true,
				"description"=>__ ( "Summarise Course Information", "axcelerate" ),
				"show_settings_on_create" => false,
		
				"as_parent"=>array('only'=>''),
				//"js_view"=>'VcBackendTtaTabsView',
		
				"category" => array (
						'aX Course Summary',
				),
				'params' => array (
						AX_VC_PARAMS::$AX_VC_EXTRA_TEXT,
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
					
				),
		) );
		class WPBakeryShortCode_aX_CIS_Cost extends WPBakeryShortCode {
		}
	}
}
