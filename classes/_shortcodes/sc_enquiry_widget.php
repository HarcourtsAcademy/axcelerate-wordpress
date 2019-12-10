<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */

if (! class_exists ( 'AX_Enquiry_Widget_Shortcode' )) {
	class AX_Enquiry_Widget_Shortcode {
		function __construct() {
			add_shortcode ( 'ax_enquiry_widget', array (
					&$this,
					'axcelerate_enquiry_widget_scripts' 
			) );
		}
		function process_enrolment_hash($enrolment_hash = '') {
			$extraOptions = array ();
			if (!empty ( $enrolment_hash )) {
				$enrolmentData = AX_Enrolments::getEnrolmentByID ( $enrolment_hash );
				//var_dump(json_encode($enrolmentData));
				if (! empty ( $enrolmentData )) {
					
					/* Load Contacts */
					if (! empty ( $enrolmentData ['user_contact_id'] )) {
						$extraOptions ['user_contact_id'] = intval ( $enrolmentData ['user_contact_id'] );
						$extraOptions ['contact_id'] = $enrolmentData ['user_contact_id'];
					}
					
					$contactList = array ();
					if (! empty ( $enrolmentData ['enrolments'] )) {
						foreach ( $enrolmentData ['enrolments'] as $key => $value ) {
							$contact = array (
									'CONTACTID' => $key,
									'GIVENNAME' => $value ['CONTACT_NAME'] 
							);
							array_push ( $contactList, $contact );
						}
					}
					if (! empty ( $contactList )) {
						$extraOptions ['contact_list'] = $contactList;
					}
					
					/*If the enrolment has a method key, and thus has passed the initial status update*/
					if (key_exists ( 'method', $enrolmentData)) {
						if ($enrolmentData ['method'] == 'initial') {
							$enrolmentData['enrolment_hash'] = $enrolment_hash;
							/*
							 * check if there was an error on previous enrolment - for the time being may need to disable enrolment on error,
							 * until invoicing issue resolved
							 */
							if (key_exists('errors', $enrolmentData)) {
								if($enrolmentData['errors'] === 'false' || $enrolmentData['errors'] === false){
									if (! empty ( $enrolmentData ['payer_id'] )) {
										$extraOptions ['payer_id'] = intval ( $enrolmentData ['payer_id'] );
									}
									if (! empty ( $enrolmentData ['invoice_id'] )) {
										$extraOptions ['invoice_id'] = intval ( $enrolmentData ['invoice_id'] );
									}
									if (! empty ( $enrolmentData ['enrolments'] )) {
										$extraOptions ['multiple_courses'] = $enrolmentData ['enrolments'];
										$extraOptions['skip_to_step'] = 'billing';
									}
									if(!empty($enrolmentData['course'])){
										$extraOptions ['course'] = $enrolmentData ['course'];
									}
								}
								
							}
							
							
						}
					}
					else{
						
						/*if the enrolment has not yet reached the "method" stage - and thus may only have a course and contact data, no enrolments*/
						if (! empty ( $enrolmentData ['payer_id'] )) {
							$extraOptions ['payer_id'] = intval ( $enrolmentData ['payer_id'] );
						}
						if(!empty($enrolmentData['course'])){
							$extraOptions ['course'] = $enrolmentData ['course'];
						}
						$extraOptions['skip_to_step'] = 'review';
					}
				}
				$extraOptions['enrolment_hash'] = $enrolment_hash;
			}
			
			return $extraOptions;
		}
		
		/*running into issues where it doesn't think the array is an array due to type conversion*/
		function cleanNumericValues ($array = array()){
			foreach ($array as $instanceRow){

				foreach($instanceRow as $enrolment){
					//var_dump($enrolment['contactID']);
					//var_dump (json_encode($enrolment));
					//var_dump(json_decode(json_encode($enrolment)));
// 					$enrolment['contactID'] = intval($enrolment['contactID']);
// 					$enrolment['instanceID'] = intval($enrolment['instanceID']);
// 					$enrolment['payerID'] = intval($enrolment['payerID']);
// 					$enrolment['generateInvoice'] = intval($enrolment['generateInvoice']);
// 					$enrolment['cost'] = $enrolment['cost'] + 0;
// 					$enrolment['cost'] = $enrolment['originalCost'] + 0;
					
				}
			}
			return $array;
		}
		/**
		 *
		 * @param array $atts        	
		 */
		function axcelerate_enquiry_widget_scripts($atts) {
			$testing = constant('AXIP_TESTING_ENVIRONMENT') === true;
			
			if (empty($_SERVER['HTTPS']) && !$testing ){
				return '<h3>The Enrolment Widget requires that the website has a Security Certificate</h3>';
			}
			$VERSION = constant ( 'AXIP_PLUGIN_VERSION' );
			if ($VERSION === null) {
				$VERSION = time ();
			}
			$AxcelerateAPI = new AxcelerateAPI ();
			$a = shortcode_atts ( array (
					'config_id' => 0,
					'course_id' => 0,
					'instance_id' => 0,
					'type' => '',
					'course_type' => '',
					'custom_css' => '',
					'class_to_add' => '',
					'enrolment_hash' => '' 
			), $atts );
			$axip_settings = get_option ( 'axip_general_settings' );
			$config_widget_settings = get_option ( 'ax_enroller_widget_settings' );
			$environmentURL = $axip_settings ['webservice_base_path'];
			$api_token = $axip_settings ['api_token'];
			
			if (! is_admin ()) {
				
				
/* 				wp_dequeue_script ( 'dataTables' );
				wp_deregister_script ( 'dataTables' ); */
				wp_dequeue_style ( 'dataTables' );
				wp_deregister_style ( 'dataTables' );
				wp_dequeue_script ( 'chosen' );
				wp_dequeue_style ( 'chosen' );
				wp_deregister_script ( 'chosen' );
				wp_deregister_style ( 'chosen' );
				wp_dequeue_script ( 'jquery-ui-datepicker' );
				wp_deregister_script ( 'jquery-ui-datepicker' );
				wp_dequeue_style ( 'jquery-ui-datepicker' );
				wp_deregister_style ( 'jquery-ui-datepicker' );
/* 				
				wp_register_script ( 'dataTables', plugins_url ( '../../enrollerWidget/DataTables/datatables.js', __FILE__ ), array (
						'jquery' 
				), $VERSION );
				wp_enqueue_script ( 'dataTables' );
				wp_register_style ( 'dataTables', plugins_url ( '../../enrollerWidget/DataTables/datatables.css', __FILE__ ), array (), $VERSION );
				wp_enqueue_style ( 'dataTables' ); */
				
				wp_register_script ( 'chosen', plugins_url ( '../../enrollerWidget/chosen/chosen.jquery.js', __FILE__ ), array (
						'jquery' 
				), $VERSION );
				wp_enqueue_script ( 'chosen' );
				wp_register_style ( 'chosen', plugins_url ( '../../enrollerWidget/chosen/chosen.css', __FILE__ ), array (
 
				), $VERSION );
				wp_enqueue_style ( 'chosen' );
				wp_register_script ( 'pre_init', plugins_url ( '../../enrollerWidget/pre_init.js', __FILE__ ), array (
						'jquery' 
				), $VERSION );
				wp_enqueue_script ( 'pre_init' );
				
				wp_register_style ( 'jquery-ui-datepicker', plugins_url ( '../../enrollerWidget/jqmDatepicker/jquery.mobile.datepicker.css', __FILE__ ), array (
						'chosen' 
				), $VERSION );
				wp_enqueue_style ( 'jquery-ui-datepicker' );
				
				wp_register_script ( 'jquery-ui-datepicker', plugins_url ( '../../enrollerWidget/jqmDatepicker/jquery.ui.datepicker.js', __FILE__ ), array (
						'jquery',
						'pre_init' 
				), $VERSION );
				wp_enqueue_script ( 'jquery-ui-datepicker' );
				
				wp_deregister_script ( 'jquery.mobile' );
				wp_register_script ( 'jquery.mobile', plugins_url ( '../../enrollerWidget/jquery.mobile-1.4.5/jquery.mobile-1.4.5.js', __FILE__ ), array (
						'jquery',
						'pre_init' 
				), $VERSION );
				wp_enqueue_script ( 'jquery.mobile' );
				
				wp_register_script ( 'jquery.mobile.datepicker', plugins_url ( '../../enrollerWidget/jqmDatepicker/jquery.mobile.datepicker.js', __FILE__ ), array (
						'jquery',
						'jquery.mobile' 
				), $VERSION );
				wp_enqueue_script ( 'jquery.mobile.datepicker' );
				
				wp_register_style ( 'jqm', plugins_url ( '../../enrollerWidget/jquery.mobile-1.4.5/jquery.mobile-1.4.5.css', __FILE__ ), array (), $VERSION );
				wp_enqueue_style ( 'jqm' );
				
				wp_register_style ( 'ew_base', plugins_url ( '../../enrollerWidget/widget/css/wp_enroller_compat.css', __FILE__ ), array (), $VERSION );
				wp_enqueue_style ( 'ew_base' );
				
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
				
				wp_register_script ( 'enrol-base', plugins_url ( '../../enrollerWidget/widget/enrol-widget-base.js', __FILE__ ), array (
						'jquery',
						'enroller-defaults',
						'pre_init',
						'jquery.mobile'
				), $VERSION );
				wp_enqueue_script ( 'enrol-base' );
				wp_register_script ( 'enquiry-widget', plugins_url ( '../../enrollerWidget/widget/enquiry-widget.js', __FILE__ ), array (
						'jquery',
						'enroller-defaults',
						'pre_init',
						'jquery.mobile',
						'enrol-base'
				), $VERSION );
				wp_enqueue_script ( 'enquiry-widget' );
				/*
				 * wp_register_style ( 'enroller', plugins_url ( '../../enrollerWidget/widget/enroller.css', __FILE__ ), array('chosen', 'dataTables', 'jqm'), $VERSION );
				 * wp_enqueue_style ( 'enroller' );
				 */
				wp_register_script ( 'after_init', plugins_url ( '../../enrollerWidget/after_init.js', __FILE__ ), array (
						'jquery',
						'enroller-defaults',
						'pre_init',
						'jquery.mobile',
						'enquiry-widget' 
				), $VERSION );
				wp_enqueue_script ( 'after_init' );
				
				/**** WP-184 ****/
				$wpVer = get_bloginfo( 'version' );
				
				
				if(version_compare($wpVer, '4.2') >=0){
					wp_register_script('flashcanvas',  plugins_url ( '../../enrollerWidget/jsignature/flashcanvas.js', __FILE__), array('jquery'), $VERSION);
					wp_enqueue_script('flashcanvas');
					wp_script_add_data('flashcanvas', 'conditional', 'lt IE 9');
				}
				
				wp_register_script('jsignature',  plugins_url ( '../../enrollerWidget/jsignature/jSignature.min.noconflict.js', __FILE__), array('jquery'), $VERSION);
				wp_enqueue_script('jsignature');
				
				
				$type = '';
				$course_id = 0;
				$instance_id = 0;
				if (! empty ( $a ['course_type'] )) {
					$type = $a ['course_type'];
				} else if (! empty ( $a ['type'] )) {
					$type = $a ['type'];
				} else {
					if (! empty ( $_REQUEST ['course_type'] )) {
						$type = $_REQUEST ['course_type'];
					} else if (! empty ( $_REQUEST ['type'] )) {
						$type = $_REQUEST ['type'];
					} else if (! empty ( $_REQUEST ['TYPE'] )) {
						$type = $_REQUEST ['TYPE'];
					} else if (! empty ( $_REQUEST ['ctype'] )) {
						$type = $_REQUEST ['ctype'];
					}
				}
				
				if (! empty ( $a ['course_id'] )) {
					$course_id = $a ['course_id'];
				} else {
					if (! empty ( $_REQUEST ['course_id'] )) {
						$course_id = $_REQUEST ['course_id'];
					} else if (! empty ( $_REQUEST ['ID'] )) {
						$course_id = $_REQUEST ['ID'];
					} else if (! empty ( $_REQUEST ['id'] )) {
						$course_id = $_REQUEST ['id'];
					} else if (! empty ( $_REQUEST ['cid'] )) {
						$course_id = $_REQUEST ['cid'];
					}
				}
				
				if (! empty ( $a ['instance_id'] )) {
					$instance_id = $a ['instance_id'];
				} else {
					if (! empty ( $_REQUEST ['instance_id'] )) {
						$instance_id = $_REQUEST ['instance_id'];
					} else if (! empty ( $_REQUEST ['instanceID'] )) {
						$instance_id = $_REQUEST ['instanceID'];
					} else if (! empty ( $_REQUEST ['instanceid'] )) {
						$instance_id = $_REQUEST ['instanceid'];
					} else if (! empty ( $_REQUEST ['cinstanceID'] )) {
						$instance_id = $_REQUEST ['cinstanceID'];
					} else {
						global $post;
						$instance_ref = $custom_content = get_post_meta ( $post->ID, 'instance_ref' );
						if (! empty ( $instance_ref )) {
							$refSplit = explode ( '_', $instance_ref [0] );
							$instance_id = $refSplit [0];
						}
					}
				}
				
				$settings = array (
						'ajaxURL' => admin_url ( 'admin-ajax.php' ),
						'config_settings' => $config_widget_settings,
						'config_id' => $a ['config_id'],
						'course_id' => $course_id,
						'instance_id' => $instance_id,
						'type' => $type,
						'enquiry_widget' => true,
				);
				
				if (empty ( $a ['enrolment_hash'] )) {
					$enrolment_hash = get_query_var ( 'enrolment' );
				} else {
					$enrolment_hash = $enrolment_hash;
				}

				$loginStatus = AX_Enrol_Widget_Shortcode::check_login_status();
				$settings['login_status'] = $loginStatus;

				$enable_enrol_hash = get_option ( 'ax_enroller_enrolment_hashes' );
				$extraOptions = array ();
				if (! empty ( $enable_enrol_hash )) {
					if (! empty ( $enrolment_hash )) {
						$extraOptions = $this->process_enrolment_hash ( $enrolment_hash );
						//var_dump($extraOptions);
						$settings = array_merge($settings, $extraOptions);
					}
				}
				
				wp_localize_script ( 'after_init', 'after_init_vars', $settings );
				
				$this->ax_localise_css ();
				$class_to_add = $a ['class_to_add'];
				if (! empty ( $a ['custom_css'] )) {
					$AxcelerateShortcode = new AxcelerateShortcode();
					$css = $AxcelerateShortcode->ax_decode_custom_css ( $a ['custom_css'], $a, 'ax_enquiry_widget' );
					$class_to_add = $class_to_add . ' ' . $css;
				}
				
				$html = '<style> ui-page { position: relative; display: block;} </style><div class="enroller-content ' . $class_to_add . '" data-role="page" ><div id="enroller"></div></div>';
				
				$enrol_action = get_option ( 'ax_enrol_event_action' );
				
				if ($enrol_action == 'hide_and_display') {
					$content = get_option ( 'ax_enrol_event_success_content' );
					$html = $html . '<div style="display:none" id="enroller_success">' . $content . '</div>';
				}

				if (empty($_SERVER['HTTPS'])){
					$html = '<div style="background:#ee3c26; padding: 1em; text-align:center"><h1 style="color:#fff">This website does not have a security certificate.</h1><h1 style="color:#fff">Please do not enter personally identifying information into the Enquiry Form.</h1></div>' . $html;
				}
				$nonce = wp_create_nonce('ax_enroller');
				$html = $html. '<script>window._wp_nonce = "'.$nonce.'";</script>';

				return $html;

			}
		}
		function ax_localise_css() {
			$default_stylesheet = plugins_url ( '../../css/ax-standard.css', __FILE__ );
			wp_register_style ( 'ax-standard', $default_stylesheet, array () );
			wp_enqueue_style ( 'ax-standard' );
			$colors = get_option ( 'ax_enrol_w_colours' );
			
			$ax_pc = '';
			$ax_pcb = '';
			$ax_pct = '';
			$ax_hc = '';
			$ax_hcb = '';
			$ax_hct = '';
			if (! empty ( $colors )) {
				extract ( $colors );
			}
			
			$css = "div.enroller-widget a.ui-btn-active.ui-btn,
			div.enroller-widget div.ui-btn-active.ui-btn,
			div.enroller-widget button.ui-btn-active.ui-btn,
			div.enroller-widget li.ui-btn-active.ui-btn,
			div.enroller-widget-popup li.ui-btn-active.ui-btn,
			div.enroller-widget-popup div.enroller-field-holder .enroller-save-button{";
			if (! empty ( $ax_pc )) {
				$css = $css . "background-color: $ax_pc ;";
			}
			if (! empty ( $ax_pcb )) {
				$css = $css . "border-color: $ax_pcb ;";
				$css = $css . "border-right-color: $ax_pcb ;";
			}
			if (! empty ( $ax_pct )) {
				$css = $css . "color: $ax_pct ;";
			}
			
			$css = $css . "}";
			if (! empty ( $ax_pcb )) {
				$css = $css . "div.enroller-widget div.enroller-step-menu .ui-btn.ui-btn-active{border-left-color: $ax_pcb;}";
			}
			
			$css = $css . "div.enroller-widget div.enroller-field-label.enroller-field-selected,
				div.enroller-widget-popup div.enroller-field-label.enroller-field-selected,
				div.enroller-widget div.enroller-widget-popup div.enroller-field-label.enroller-field-selected,
				div.enroller-widget .ui-btn.ui-input-text:hover:not(:focus):not(.no-hover),
				.enroller-field-holder .controlgroup-textinput:hover:not(:focus):not(.no-hover),
				div.enroller-widget .enroller-field-holder.ui-mini .chosen-choices:hover:not(:focus):not(.no-hover),
				div.enroller-widget a.ui-btn:hover:not(:focus):not(.no-hover),
				div.enroller-widget li.ui-btn:hover:not(:focus):not(.no-hover),
	
				div.enroller-widget div.ui-btn:not(.enroller-field-label):hover:not(:focus):not(.no-hover),
				div.enroller-widget a.ui-btn.chosen-single:hover:not(:focus):not(.no-hover),
				div.enroller-widget label.ui-btn:hover:not(:focus):not(.no-hover),
				div.enroller-widget a.ui-btn-active.ui-btn:hover:not(:focus):not(.no-hover),
				div.enroller-widget button.ui-btn:hover:not(:focus):not(.no-hover),
				div.enroller-widget .dataTables_wrapper .dataTables_paginate .paginate_button:hover:not(:focus):not(.no-hover),
				div.enroller-widget .dataTables_wrapper .dataTables_paginate .paginate_button.current:hover:not(:focus):not(.no-hover),
				div.enroller-widget table.dataTable th:hover:not(:focus):not(.no-hover),
				div.enroller-widget .chosen-container .chosen-results li.highlighted,
				div.ui-datepicker .chosen-container .chosen-results li.highlighted,
				div.ui-datepicker table.ui-datepicker-calendar td:hover,
				div.ui-datepicker table.ui-datepicker-calendar td:hover a,
				div.enroller-widget-popup div.enroller-field-holder .enroller-save-button:hover,
				div.enroller-widget div.enroller-text-field:hover:not(:focus):not(.no-hover),
				div.enroller-widget .ui-input-text:hover:not(:focus):not(.no-hover)
	
				div.enroller-widget .enroller-field-holder .controlgroup-textinput:hover:not(:focus):not(.no-hover){
				";
			
			if (! empty ( $ax_hc )) {
				$css = $css . "background-color: $ax_hc ;";
			}
			if (! empty ( $ax_hcb )) {
				$css = $css . "border-color: $ax_hcb ;";
			}
			if (! empty ( $ax_hct )) {
				$css = $css . "color: $ax_hct ;";
			}
			$css = $css . "}";
			
			$css = $css . "div.enroller-widget div.enroller-step-menu .ui-btn.ui-disabled{";
			if (! empty ( $ax_smd )) {
				$css = $css . "background-color: $ax_smd ;";
			}
			if (! empty ( $ax_smdb )) {
				$css = $css . "border-color: $ax_smdb ;";
			}
			if (! empty ( $ax_smdt )) {
				$css = $css . "color: $ax_smdt ;";
			}
			$css = $css . "}";
			
			$css = $css . "div.enroller-widget{";
			if (! empty ( $ax_ew )) {
				$css = $css . "background-color: $ax_ew ;";
			}
			if (! empty ( $ax_ewb )) {
				$css = $css . "border-color: $ax_ewb ;";
			}
			$css = $css . "}";
			
			$css = $css . "div.enroller-widget div.enroller-step-menu a.enroller-menu-link:hover:not(:focus):not(.no-hover){";
			if (! empty ( $ax_smh )) {
				$css = $css . "background-color: $ax_smh ;";
			}
			if (! empty ( $ax_smhb )) {
				$css = $css . "border-color: $ax_smhb ;";
			}
			if (! empty ( $ax_smht )) {
				$css = $css . "color: $ax_smht ;";
			}
			$css = $css . "}";
			
			wp_add_inline_style ( 'ax-standard', $css );
		}
	}
	
	$AX_Enquiry_Widget_Shortcode = new AX_Enquiry_Widget_Shortcode ();
	
	if(class_exists ( 'WPBakeryShortCode' ) && class_exists('AX_VC_PARAMS') && class_exists ( 'WPBakeryShortCodesContainer' )){
		vc_map ( array (
				"name" => __ ( "aX Enquiry Widget", "axcelerate" ),
				"base" => "ax_enquiry_widget",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				"content_element" => true,
				"description"=>__ ( "Enquiry Widget - Use for Enquiry", "axcelerate" ),
				"show_settings_on_create" => true,
				"is_container"=>false,
				"as_parent"=>array('only'=>''),
		
				"category" => array (
						'aX Course Detail',
						'Content'
				),
				'params' => array (
						AX_VC_PARAMS::$AX_VC_COURSE_TYPE_PARAM,
						AX_VC_PARAMS::$AX_VC_COURSEID_PARAM,
						AX_VC_PARAMS::$AX_VC_CONFIG_ID,
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
		
				)
		) );
		class WPBakeryShortCode_aX_Enquiry_Widget extends WPBakeryShortCode {
		}
	}
}