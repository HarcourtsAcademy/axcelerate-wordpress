<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */

if (! class_exists ( 'AX_Course_Search_AJAX' )) {
	class AX_Course_Search_AJAX {
		function __construct() {
			add_shortcode( 'ax_course_ajax', array(&$this, 'ax_course_ajax_handler' ) );
		}
		
		function ax_course_ajax_handler($atts=array(), $content=null){
			$default_stylesheet = plugins_url ( '../../css/ax-standard.css', __FILE__ );
			
			extract( shortcode_atts( array(
					'style'=> '',
					'teminology_w'=> '',
					'teminology_p'=> '',
					'teminology_el'=> '',
					'workshop_display'=>false,
					'workshop_venues'=>false,
					'program_display'=>false,
					'elearning_display'=>false,
					'heading'=>'Find a Course',
					'heading_wrap_tag'=>'h3',
					'drilldown_url'=>'',
					'link_class'=>'',
					'link_text'=>'Enrol Now',
					'custom_css'=>'',
					'class_to_add'=>'',
					'filter_delivery_id'=>'',
					'filter_venue_id'=>'',
					'filter_location'=>'',
			
			), $atts ) );
			if(!empty($filter_delivery_id)){
				$filter_delivery_id = explode(',', $filter_delivery_id);
			}
			else{
				$filter_delivery_id = array();
			}
			if(!empty($filter_venue_id)){
				$filter_venue_id = explode(',', $filter_venue_id);
			}
			else{
				$filter_venue_id = array();
			}
			if(!empty($filter_location)){
				$filter_location = explode(',', $filter_location);
			}
			else{
				$filter_location = array();
			}

			
			/*bool correction*/
			if ( $workshop_display === 'false' ) { $workshop_display = false; }
			$workshop_display = (bool) $workshop_display;
			if ( $workshop_venues === 'false' ) { $workshop_venues = false; }
			$workshop_venues = (bool) $workshop_venues;
			if ( $program_display === 'false' ) { $program_display = false; }
			$program_display = (bool) $program_display;
			if ( $elearning_display === 'false' ) { $elearning_display = false; }
			$elearning_display = (bool) $elearning_display;
			
			
			if(empty($teminology_w)){
				$teminology_w = get_option('ax_course_terminology_w');
			}
			if(empty($teminology_p)){
				$teminology_p = get_option('ax_course_terminology_p');
			}
			if(empty($teminology_el)){
				$teminology_el = get_option('ax_course_terminology_el');
			}	
			if(empty($style)){
				$style = 'ax-standard';
			}
			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_ajax');
				$style = $style .' '. $css;
			}
			if(!empty ($class_to_add)){
				$style = $style . ' '. $class_to_add;
			}
			wp_register_style ( 'ax-standard', $default_stylesheet ,array());
			wp_enqueue_style ( 'ax-standard' );
			
			$this->loadScripts();
			$this->loadStyles();
			
			$returnObject = '';
			$returnObject = $returnObject. '<div class="ax-course-search-ajax ' . $style . '">';
			$returnObject = $returnObject. '<'.$heading_wrap_tag.'>'.$heading.'</'.$heading_wrap_tag.'>';
			
			$returnObject = $returnObject. $this->courseTypeSelect($workshop_display, $program_display, $elearning_display,
					$teminology_w, $teminology_p, $teminology_el);
			
			if(!empty($workshop_display)){
				if(!empty($workshop_venues)){
					$returnObject = $returnObject. $this->venuesSelect ($filter_venue_id);
				}
				else{
					$returnObject = $returnObject. $this->locationSelect ($filter_location);
				}

			}
			if(!empty($program_display)){
				$returnObject = $returnObject. $this->deliveryLocationSelect ($filter_delivery_id);
			}
			
			$returnObject = $returnObject. '<a style="display:none" data-default-url="'.urldecode($drilldown_url).'" class="ax-course-search-link '.$link_class.'">'.$link_text.'</a>';
			
			$returnObject = $returnObject. '</div>';
			
			
			return $returnObject;
			
			
			//Load in Course Type Selector
			
			//Load in Course Lists
			
			//(JS FILE) on course selection load in locations (course instance search, with locations populated.
			
			//On Location selected - Display filtered list of instances for that location.
			
		}
		
		function courseTypeSelect($workshop_display, $program_display, $elearning_display, $teminology_w, $teminology_p, $teminology_el){
			/*if only one type is allowed then add a hidden input field instead*/
			$selectList = '';
			if($workshop_display && !$program_display && !$elearning_display){
				$selectList = '<input type="hidden" class="ax-type-select" style="display:none" value="w">';
			}
			else if($program_display && !$workshop_display && !$elearning_display){
				$selectList = '<input type="hidden" class="ax-type-select" style="display:none" value="p">';
			}
			else if($elearning_display && !$workshop_display && !$program_display){
				$selectList = '<input type="hidden" class="ax-type-select" style="display:none" value="el">';
			}
			else if($elearning_display || $workshop_display || $program_display){
				$selectList = '<select class="ax-type-select" data-placeholder="Select Course Type">';
				if($workshop_display){ $selectList= $selectList. '<option value="w">'.$teminology_w.'</option>';}
				if($program_display){ $selectList= $selectList. '<option value="p">'.$teminology_p.'</option>';}
				if($elearning_display){ $selectList= $selectList. '<option value="el">'.$teminology_el.'</option>';}
				$selectList = $selectList.'</select>';
			}
			else{
				$selectList = '<input type="hidden" class="ax-type-select" style="display:none">';
			}
		
			return $selectList;
		}
		function locationSelect($filterArray = array()){
			$API = new AxcelerateAPI();
			$params = array('public'=>true, 'onlyFuture'=>true);
			$loc_array = $API->callResource ( $params, 'course/locations', 'GET' );
			$selectList = '<div class="ax-location-filter ax-workshop-filter" style="display:none;"><select class="ax-location-select" data-type="location"  style="display:none" data-placeholder="Select Location">';
			$selectList = $selectList. '<option></option>';
			if(!empty($loc_array)){
				foreach ($loc_array as $location){
					$location = htmlspecialchars($location);
					if($filterArray){
				
						if(in_array($location, $filterArray)){
							$opt = '<option value="'.$location.'" >'. $location .'</option>';
							$selectList = $selectList . $opt;
						}
					}
					else{
						$opt = '<option value="'.$location.'" >'. $location .'</option>';
						$selectList = $selectList . $opt;
					}
				}
			}
			$selectList = $selectList.'</select></div>';
			return $selectList;
			
		}
		function venuesSelect($filterArray = array()){
			$API = new AxcelerateAPI();	
			$params = array('displayLength'=>2000);
			$venues_array = $API->callResource ( $params, 'venues', 'POST' );
			$selectList = '<div class="ax-location-filter ax-workshop-filter" style="display:none;"><select class="ax-venue-select" data-type="venue" data-placeholder="Select Location">';
			$selectList = $selectList. '<option></option>';
			if(!empty($venues_array)){
				if(key_exists('CONTACTID', $venues_array[0])){
					foreach ($venues_array as $venue){
						/*if filterArray is not false (empty) then use it to filter the select list*/
						if($filterArray){
							if(in_array($venue->CONTACTID, $filterArray)){
								$opt = '<option value="'.$venue->CONTACTID.'" >'. $venue->NAME .'</option>';
								$selectList = $selectList . $opt;
							}
						}
						else{
							$opt = '<option value="'.$venue->CONTACTID.'" >'. $venue->NAME .'</option>';
							$selectList = $selectList . $opt;
						}
						
						
					}
				}
			}
			$selectList = $selectList.'</select></div>';
			return $selectList;
			
		}
		function deliveryLocationSelect($filterArray = array()){
			$API = new AxcelerateAPI();
			$params = array('active'=>true);
			$delivery_locations = $API->callResource ( $params, 'course/deliveryLocations', 'GET' );
			$selectList = '<div class="ax-location-filter ax-program-filter" style="display:none;"><select class="ax-delivery-select" data-type="delivery" data-placeholder="Select Location">';
			$selectList = $selectList. '<option></option>';
			if(!empty($delivery_locations)){
				if(!empty($delivery_locations[0])){
					foreach ($delivery_locations as $dl){
						/*if filterArray is not false (empty) then use it to filter the select list*/
						if($filterArray){
							if(in_array($dl->ID, $filterArray)){
								$opt = '<option value="'.$dl->ID.'" >'. $dl->NAME .'</option>';
								$selectList = $selectList . $opt;
							}
						}
						else{
							$opt = '<option value="'.$dl->ID.'" >'. $dl->NAME .'</option>';
							$selectList = $selectList . $opt;
						}
						
					}
				}
			}
			$selectList = $selectList.'</select></div>';
			return $selectList;
		}
		function loadScripts() {
			$VERSION = constant ( 'AXIP_PLUGIN_VERSION' );
			if ($VERSION === null) {
				$VERSION = time ();
			}
			$axip_settings = (array)get_option ( 'axip_general_settings' );
			$environmentURL = $axip_settings ['webservice_base_path'];
			$api_token = $axip_settings ['api_token'];
			
			wp_register_script ( 'chosen', plugins_url ( '../../enrollerWidget/chosen/chosen.jquery.js', __FILE__ ), array (
					'jquery'
			), $VERSION );
			wp_enqueue_script ( 'chosen' );
			
			
			wp_register_script ( 'enroller-api', plugins_url ( '../../enrollerWidget/widget/enroller-api-functions.js', __FILE__ ), array (
					'jquery'
			), $VERSION );
			wp_enqueue_script ( 'enroller-api' );
			
			wp_localize_script ( 'enroller-api', 'enroller_default_vars', array (
					'ajaxURL' => admin_url ( 'admin-ajax.php' ),
					'ax_url' => $environmentURL,
					'api_token' => $api_token
			)
					);
			
			
			wp_register_script ( 'enroller-defaults', plugins_url ( '../../enrollerWidget/widget/enroller-defaults.js', __FILE__ ), array (
					'jquery'
			), $VERSION );
			wp_enqueue_script ( 'enroller-defaults' );
			
			
			wp_localize_script ( 'enroller-defaults', 'enroller_default_vars', array (
					'ajaxURL' => admin_url ( 'admin-ajax.php' ),
					'ax_url' => $environmentURL,
					'api_token' => $api_token
			)
					);
			$mapping_table = json_decode(get_option('ax_course_mapping_settings'), $assoc= true);
			wp_register_script ( 'ajax-cs', plugins_url ( 'js/sc_course_search_ajax.js', __FILE__ ), array (
					'jquery', 'enroller-defaults'
			), $VERSION );
			wp_enqueue_script ( 'ajax-cs' );
			wp_localize_script ( 'ajax-cs', 'ajax_cs_vars', array ( 'mapping' => $mapping_table) );
			
		}
		function loadStyles(){
			$VERSION = constant ( 'AXIP_PLUGIN_VERSION' );
			if ($VERSION === null) {
				$VERSION = time ();
			}
			wp_register_style ( 'chosen', plugins_url ( '../../enrollerWidget/chosen/chosen.css', __FILE__ ), array (), $VERSION );
			wp_enqueue_style ( 'chosen' );
			wp_enqueue_script ( 'chosen' );
			wp_register_style ( 'chosen-b', plugins_url ( '../../enrollerWidget/chosen/wp-chosen.css', __FILE__ ), array (), $VERSION );
			wp_enqueue_style ( 'chosen-b' );
			
			wp_enqueue_style( 'dashicons' );
		}
		function register_ajax_functions(){
			add_action( 'wp_ajax_action_name', array(&$this, 'ajax_handler' ) );
			add_action( 'wp_ajax_action_name', array(&$this, 'ajax_handler' ) );
		}
		function ajax_handler(){
			
		}
		
	}
	$AX_Course_Search_AJAX = new AX_Course_Search_AJAX();
}

if(class_exists ( 'WPBakeryShortCodesContainer' )){
	mapShortcode_VC();
}



function mapShortcode_VC(){
	if(class_exists ( 'WPBakeryShortCode' ) && class_exists('AX_VC_PARAMS')){
		vc_map ( array (
				"name" => __ ( "aX Course Search AJAX", "axcelerate" ),
				"base" => "ax_course_ajax",
				"icon"=>plugin_dir_url(__FILE__) . '../../images/ax_icon.png',
				"content_element" => true,
				"description"=>__ ( "Dynamic Course Selector Tool", "axcelerate" ),
				"show_settings_on_create" => true,
				"is_container"=>false,
				"as_parent"=>array('only'=>''),
		
				"category" => array (
						'aX Util','aX Parent Codes'
				),
				'params' => array (

						AX_VC_PARAMS::$AX_VC_WORKSHOP_DISPLAY,
						AX_VC_PARAMS::$AX_VC_WORKSHOP_VENUES,
						AX_VC_PARAMS::$AX_VC_PROGRAM_DISPLAY,
						AX_VC_PARAMS::$AX_VC_ELEARNING_DISPLAY,
						AX_VC_PARAMS::$AX_VC_LINK_TEXT,
						AX_VC_PARAMS::$AX_VC_DRILLDOWN_URL,
						AX_VC_PARAMS::$AX_VC_TERMINOLOGY_WORKSHOP,
						AX_VC_PARAMS::$AX_VC_TERMINOLOGY_PROGRAM,
						AX_VC_PARAMS::$AX_VC_TERMINOLOGY_ELEARNING,
						AX_VC_PARAMS::$AX_VC_LINK_ADD_CLASS_PARAM,
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
						AX_VC_PARAMS::$AX_VC_HEADING_WRAPPER_TAG,
						AX_VC_PARAMS::$AX_VC_FILTER_VENUE_ID,
						AX_VC_PARAMS::$AX_VC_FILTER_DELIVERY_ID,
						AX_VC_PARAMS::$AX_VC_FILTER_LOCATION_STRING,
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
				)
		) );
		class WPBakeryShortCode_ax_Course_AJAX extends WPBakeryShortCode {
		}
	}
	
	
		
}