<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */
class Axip_Course_Post_Type {
	public $_course_pages = array ();
	function __construct() {
		add_action ( 'init', array (
				$this,
				'axip_course_custom_init' 
		) );
		
		add_action ( 'add_meta_boxes', array (
				$this,
				'add_meta_box' 
		) );
		add_action ( 'save_post', array (
				$this,
				'save' 
		) );
		
		add_filter ( 'single_template', array (
				$this,
				'axip_course_single_template' 
		) );
		add_filter ( 'query_vars', array (
				$this,
				'add_custom_query_var' 
		) );
	}
	function add_custom_query_var($vars) {
		$vars [] = "cid";
		$vars [] = "ctype";
		$vars [] = "q";
		return $vars;
	}
	function axip_course_custom_init() {
		$labels = array (
				'name' => 'aX Pages',
				'singular_name' => 'aX Page',
				'add_new' => 'Add New',
				'add_new_item' => 'Add New aX Page',
				'edit_item' => 'Edit aX Page',
				'new_item' => 'New aX Page',
				'all_items' => 'All aX Pages',
				'view_item' => 'View aX Page',
				'search_items' => 'Search aX Pages',
				'not_found' => 'No courses found',
				'not_found_in_trash' => 'No courses found in Trash',
				'parent_item_colon' => '',
				'menu_name' => 'aX Pages' 
		);
		
		$args = array (
				'labels' => $labels,
				'public' => true,
				'publicly_queryable' => true,
				'show_ui' => true,
				'show_in_menu' => true,
				'query_var' => true,
				'rewrite' => array (
						'slug' => 'ax-course' 
				),
				'capability_type' => 'post',
				'has_archive' => true,
				'hierarchical' => false,
				'menu_position' => null,
				'supports' => array (
						'title',
						'editor',
						'thumbnail' 
				) 
		);
		
		register_post_type ( 'ax-page', $args );
	}
	public function axip_course_single_template($single) {
		global $wp_query, $post;
		
		/* Checks for single template by post type */
		
		if ($post->post_type == "ax-page") {
			
			if (file_exists ( AXIP_PLUGIN_DIR . '/template/single-courses.php' )) {
				return AXIP_PLUGIN_DIR . '/template/single-courses.php';
			}
		}
		
		return $single;
	}
	
	/**
	 * Adds the meta box container.
	 */
	public function add_meta_box() {
		add_meta_box ( 'axip_pagetype_meta_box', __ ( 'Page Type', 'axip' ), array (
				$this,
				'render_pagetype_meta_box_content' 
		), 'ax-page', 'side', 'default' );
		
		add_meta_box ( 'axip_course_list_meta_box', __ ( 'Course List Settings', 'axip' ), array (
				$this,
				'render_course_list_meta_box_content' 
		), 'ax-page', 'advanced', 'high' );
		
		add_meta_box ( 'axip_course_detail_meta_box', __ ( 'Course List Detail Settings', 'axip' ), array (
				$this,
				'render_meta_box_content' 
		), 'ax-page', 'advanced', 'high' );
		
		add_meta_box ( 'axip_training_cat_list_meta_box', __ ( 'Training Category List Settings', 'axip' ), array (
				$this,
				'render_training_cat_list_meta_box_content' 
		), 'ax-page', 'advanced', 'high' );
		
		add_meta_box ( 'axip_enquiry_form_meta_box', __ ( 'Settings for Enquiry Form', 'axip' ), array (
				$this,
				'render_enqiry_form_content' 
		), 'ax-page', 'advanced', 'high' );
		
		add_meta_box ( 'axip_enrolment_form_meta_box', __ ( 'Settings for Enrolment Form', 'axip' ), array (
				$this,
				'render_enrolment_form_content' 
		), 'ax-page', 'advanced', 'high' );

		add_meta_box ( 'axip_course_calendar_meta_box', __ ( 'Settings for the Course Calendar', 'axip' ), array (
				$this,
				'render_course_calendar_content' 
		), 'ax-page', 'advanced', 'high' );
	}
	
	/**
	 * Save the meta when the post is saved.
	 *
	 * @param int $post_id
	 *        	The ID of the post being saved.
	 */
	public function save($post_id) {
		if (isset ( $post_id ) && count ( $_POST )) {
			
			if ('ax-page' == $_POST ['post_type']) {
				
				$axip_pagetype = $_POST ['axip_pagetype'];
				
				update_post_meta ( $post_id, '_axip_pagetype', $axip_pagetype );
				
				if ($axip_pagetype == 1) {
					
					// ######## Course List Settings Save ########
					
					$axip_course_type = sanitize_text_field ( $_POST ['axip_course_type'] );
					$axip_main_listheader = sanitize_text_field ( $_POST ['axip_main_listheader'] );
					$axip_usesub_listheader = sanitize_text_field ( $_POST ['axip_usesub_listheader'] );
					$axip_sub_listheader = ($_POST ['axip_sub_listheader']);
					$axip_include_course_summary = sanitize_text_field ( $_POST ['axip_include_course_summary'] );
					$axip_empty_message = ($_POST ['axip_empty_message']);
					$axip_results_drilldown_pages = ($_POST ['axip_results_drilldown_pages']);
					
					$axip_socialmedia_facebook = ($_POST ['axip_socialmedia_facebook']);
					$axip_socialmedia_twitter = ($_POST ['axip_socialmedia_twitter']);
					$axip_socialmedia_linkedin = ($_POST ['axip_socialmedia_linkedin']);
					
					$axip_display_categories = ($_POST ['axip_display_categories']);
					$axip_display_locations = ($_POST ['axip_display_locations']);
					$axip_training_categories_all_courses = ($_POST ['axip_training_categories_all_courses']);
					
					$axip_training_category_filter = ($_POST ['axip_training_category_filter']);
					
					update_post_meta ( $post_id, '_axip_course_type', $axip_course_type );
					update_post_meta ( $post_id, '_axip_main_listheader', $axip_main_listheader );
					update_post_meta ( $post_id, '_axip_usesub_listheader', $axip_usesub_listheader );
					update_post_meta ( $post_id, '_axip_sub_listheader', $axip_sub_listheader );
					update_post_meta ( $post_id, '_axip_include_course_summary', $axip_include_course_summary );
					update_post_meta ( $post_id, '_axip_empty_message', $axip_empty_message );
					update_post_meta ( $post_id, '_axip_results_drilldown_pages', $axip_results_drilldown_pages );
					
					update_post_meta ( $post_id, '_axip_socialmedia_facebook', $axip_socialmedia_facebook );
					update_post_meta ( $post_id, '_axip_socialmedia_twitter', $axip_socialmedia_twitter );
					update_post_meta ( $post_id, '_axip_socialmedia_linkedin', $axip_socialmedia_linkedin );
					
					/* Category and location filters */
					update_post_meta ( $post_id, '_axip_display_categories', $axip_display_categories );
					update_post_meta ( $post_id, '_axip_display_locations', $axip_display_locations );
					update_post_meta ( $post_id, '_axip_training_categories_all_courses', $axip_training_categories_all_courses );
					
					update_post_meta ( $post_id, '_axip_training_category_filter', $axip_training_category_filter );
				} 

				elseif ($axip_pagetype == 2) {
					
					// ######## Course List Detail Settings Save ########
					
					$axip_instance_drilldown_page = sanitize_text_field ( $_POST ['axip_instance_drilldown_page'] );
					$axip_instance_header = sanitize_text_field ( $_POST ['axip_instance_header'] );
					$axip_button_text = sanitize_text_field ( $_POST ['axip_button_text'] );
					$axip_action_method = sanitize_text_field ( $_POST ['axip_action_method'] );
					$axip_instance_display = sanitize_text_field ( $_POST ['axip_instance_display'] );
					$axip_price_display = sanitize_text_field ( $_POST ['axip_price_display'] );
					$axip_enquire_button = sanitize_text_field ( $_POST ['axip_enquire_button'] );
					$axip_enquire_button_page = sanitize_text_field ( $_POST ['axip_enquire_button_page'] );
					$axip_booking_closed_text = sanitize_text_field ( $_POST ['axip_booking_closed_text'] );
					
					update_post_meta ( $post_id, '_axip_instance_drilldown_page', $axip_instance_drilldown_page );
					update_post_meta ( $post_id, '_axip_instance_header', $axip_instance_header );
					update_post_meta ( $post_id, '_axip_button_text', $axip_button_text );
					update_post_meta ( $post_id, '_axip_action_method', $axip_action_method );
					update_post_meta ( $post_id, '_axip_instance_display', $axip_instance_display );
					update_post_meta ( $post_id, '_axip_price_display', $axip_price_display );
					update_post_meta ( $post_id, '_axip_enquire_button', $axip_enquire_button );
					update_post_meta ( $post_id, '_axip_enquire_button_page', $axip_enquire_button_page );
					update_post_meta ( $post_id, '_axip_booking_closed_text', $axip_booking_closed_text );
				} 

				elseif ($axip_pagetype == 3) {
					
					// ######## Enquiry Form Save ########
					
					$nameKey = 1;
					
					// $axip_allow_custom_fields = sanitize_text_field( $_POST['axip_allow_custom_fields_'.$nameKey] );
					$axip_given_name = (! empty ( $_POST ['axip_given_name_' . $nameKey] ) ? sanitize_text_field ( $_POST ['axip_given_name_' . $nameKey] ) : 2);
					$axip_middle_name = sanitize_text_field ( $_POST ['axip_middle_name_' . $nameKey] );
					$axip_preferred_name = sanitize_text_field ( $_POST ['axip_preferred_name_' . $nameKey] );
					$axip_last_name = (! empty ( $_POST ['axip_last_name_' . $nameKey] ) ? sanitize_text_field ( $_POST ['axip_last_name_' . $nameKey] ) : 2);
					$axip_email = (! empty ( $_POST ['axip_email_' . $nameKey] ) ? sanitize_text_field ( $_POST ['axip_email_' . $nameKey] ) : 2);
					$axip_dob = sanitize_text_field ( $_POST ['axip_dob_' . $nameKey] );
					
					$axip_usi = sanitize_text_field ( $_POST ['axip_usi_' . $nameKey] );
					$axip_city_of_birth = sanitize_text_field ( $_POST ['axip_city_of_birth_' . $nameKey] );
					
					$axip_lui = sanitize_text_field ( $_POST ['axip_lui_' . $nameKey] );
					$axip_sex = sanitize_text_field ( $_POST ['axip_sex_' . $nameKey] );
					$axip_home_phone = sanitize_text_field ( $_POST ['axip_home_phone_' . $nameKey] );
					$axip_postal_address = sanitize_text_field ( $_POST ['axip_postal_address_' . $nameKey] );
					$axip_street_address = sanitize_text_field ( $_POST ['axip_street_address_' . $nameKey] );
					$axip_organisation = sanitize_text_field ( $_POST ['axip_organisation_' . $nameKey] );
					$axip_position = sanitize_text_field ( $_POST ['axip_position_' . $nameKey] );
					$axip_work_phone = sanitize_text_field ( $_POST ['axip_work_phone_' . $nameKey] );
					$axip_mobile_phone = sanitize_text_field ( $_POST ['axip_mobile_phone_' . $nameKey] );
					$axip_fax = sanitize_text_field ( $_POST ['axip_fax_' . $nameKey] );
					
					$axip_occupation_identifier = sanitize_text_field ( $_POST ['axip_occupation_identifier_' . $nameKey] );
					$axip_industry_of_employment = sanitize_text_field ( $_POST ['axip_industry_of_employment_' . $nameKey] );
					
					$axip_contact_personal = array(
		/* 			'_axip_allow_custom_fields'=> $axip_allow_custom_fields, */
					'_axip_given_name' => $axip_given_name,
							'_axip_middle_name' => $axip_middle_name,
							'_axip_preferred_name' => $axip_preferred_name,
							'_axip_last_name' => $axip_last_name,
							'_axip_email' => $axip_email,
							'_axip_dob' => $axip_dob,
							'_axip_usi' => $axip_usi,
							'_axip_city_of_birth' => $axip_city_of_birth,
							'_axip_lui' => $axip_lui,
							'_axip_sex' => $axip_sex,
							'_axip_home_phone' => $axip_home_phone,
							'_axip_postal_address' => $axip_postal_address,
							'_axip_street_address' => $axip_street_address,
							'_axip_organisation' => $axip_organisation,
							'_axip_occupation_identifier' => $axip_occupation_identifier,
							'_axip_industry_of_employment' => $axip_industry_of_employment,
							'_axip_position' => $axip_position,
							'_axip_work_phone' => $axip_work_phone,
							'_axip_mobile_phone' => $axip_mobile_phone,
							'_axip_fax' => $axip_fax 
					);
					
					update_post_meta ( $post_id, '_axip_enquiry_contact_personal', $axip_contact_personal );
					
					$axip_emergency_contact = sanitize_text_field ( $_POST ['axip_emergency_contact_' . $nameKey] );
					$axip_citizenship_status = sanitize_text_field ( $_POST ['axip_citizenship_status_' . $nameKey] );
					$axip_employment = sanitize_text_field ( $_POST ['axip_employment_' . $nameKey] );
					$axip_language = sanitize_text_field ( $_POST ['axip_language_' . $nameKey] );
					$axip_education_status = sanitize_text_field ( $_POST ['axip_education_status_' . $nameKey] );
					$axip_disability_status = sanitize_text_field ( $_POST ['axip_disability_status_' . $nameKey] );
					$axip_aboriginal_tsi_status = sanitize_text_field ( $_POST ['axip_aboriginal_tsi_status_' . $nameKey] );
					$axip_contact_source = sanitize_text_field ( $_POST ['axip_contact_source_' . $nameKey] );
					
					$axip_avetmiss_additional = array (
							'_axip_emergency_contact' => $axip_emergency_contact,
							'_axip_citizenship_status' => $axip_citizenship_status,
							'_axip_employment' => $axip_employment,
							'_axip_language' => $axip_language,
							'_axip_education_status' => $axip_education_status,
							'_axip_disability_status' => $axip_disability_status,
							'_axip_aboriginal_tsi_status' => $axip_aboriginal_tsi_status,
							'_axip_contact_source' => $axip_contact_source 
					)
					;
					
					update_post_meta ( $post_id, '_axip_enquiry_avetmiss_additional', $axip_avetmiss_additional );
					
					$axip_headertext = sanitize_text_field ( $_POST ['enquiry_settings'] ['axip_headertext'] );
					$axip_use_iframe = sanitize_text_field ( $_POST ['enquiry_settings'] ['axip_use_iframe'] );
					$axip_clientId = sanitize_text_field ( $_POST ['enquiry_settings'] ['axip_clientId'] );
					$axip_captcha_display = sanitize_text_field ( $_POST ['enquiry_settings'] ['axip_captcha_display'] );
					$axip_success_message = sanitize_text_field ( $_POST ['enquiry_settings'] ['axip_success_message'] );
					$axip_multipage_contact_form = sanitize_text_field ( $_POST ['enquiry_settings'] ['axip_multipage_contact_form'] );
					$axip_enquiry_noteid = sanitize_text_field ( $_POST ['enquiry_settings'] ['axip_enquiry_noteid'] );
					$axip_enquiry_email_list = sanitize_text_field ( $_POST ['enquiry_settings'] ['axip_enquiry_email_list'] );
					
					$axip_enquiry_formsettings = array (
							'_axip_headertext' => $axip_headertext,
							'_axip_use_iframe' => $axip_use_iframe,
							'_axip_clientId' => $axip_clientId,
							'_axip_captcha_display' => $axip_captcha_display,
							'_axip_success_message' => $axip_success_message,
							'_axip_multipage_contact_form' => $axip_multipage_contact_form,
							'_axip_enquiry_noteid' => $axip_enquiry_noteid,
							'_axip_enquiry_email_list' => $axip_enquiry_email_list 
					);
					
					update_post_meta ( $post_id, '_axip_enquiry_formsettings', $axip_enquiry_formsettings );
				} 

				elseif ($axip_pagetype == 4) {
					
					// ######## Enrolment Form Save ########
					
					$nameKey = 2;
					//TODO
					$axip_enroller_widget_config_id = sanitize_text_field ( $_POST ['enrolment_settings'] ['axip_enroller_widget_config_id'] );
					
					
					
					
					
					/* $axip_allow_custom_fields = sanitize_text_field( $_POST['axip_allow_custom_fields_'.$nameKey] ); */
					$axip_given_name = (! empty ( $_POST ['axip_given_name_' . $nameKey] ) ? sanitize_text_field ( $_POST ['axip_given_name_' . $nameKey] ) : 2);
					$axip_middle_name = sanitize_text_field ( $_POST ['axip_middle_name_' . $nameKey] );
					$axip_preferred_name = sanitize_text_field ( $_POST ['axip_preferred_name_' . $nameKey] );
					$axip_last_name = (! empty ( $_POST ['axip_last_name_' . $nameKey] ) ? sanitize_text_field ( $_POST ['axip_last_name_' . $nameKey] ) : 2);
					$axip_email = (! empty ( $_POST ['axip_email_' . $nameKey] ) ? sanitize_text_field ( $_POST ['axip_email_' . $nameKey] ) : 2);
					$axip_dob = sanitize_text_field ( $_POST ['axip_dob_' . $nameKey] );
					
					$axip_usi = sanitize_text_field ( $_POST ['axip_usi_' . $nameKey] );
					$axip_city_of_birth = sanitize_text_field ( $_POST ['axip_city_of_birth_' . $nameKey] );
					
					$axip_lui = sanitize_text_field ( $_POST ['axip_lui_' . $nameKey] );
					$axip_sex = sanitize_text_field ( $_POST ['axip_sex_' . $nameKey] );
					$axip_home_phone = sanitize_text_field ( $_POST ['axip_home_phone_' . $nameKey] );
					$axip_postal_address = sanitize_text_field ( $_POST ['axip_postal_address_' . $nameKey] );
					$axip_street_address = sanitize_text_field ( $_POST ['axip_street_address_' . $nameKey] );
					$axip_organisation = sanitize_text_field ( $_POST ['axip_organisation_' . $nameKey] );
					$axip_position = sanitize_text_field ( $_POST ['axip_position_' . $nameKey] );
					$axip_work_phone = sanitize_text_field ( $_POST ['axip_work_phone_' . $nameKey] );
					$axip_mobile_phone = sanitize_text_field ( $_POST ['axip_mobile_phone_' . $nameKey] );
					$axip_fax = sanitize_text_field ( $_POST ['axip_fax_' . $nameKey] );
					
					$axip_occupation_identifier = sanitize_text_field ( $_POST ['axip_occupation_identifier_' . $nameKey] );
					$axip_industry_of_employment = sanitize_text_field ( $_POST ['axip_industry_of_employment_' . $nameKey] );
					
					$axip_contact_personal = array(
			    	/* '_axip_allow_custom_fields'=> $axip_allow_custom_fields, */
			    	'_axip_given_name' => $axip_given_name,
							'_axip_middle_name' => $axip_middle_name,
							'_axip_preferred_name' => $axip_preferred_name,
							'_axip_last_name' => $axip_last_name,
							'_axip_email' => $axip_email,
							'_axip_dob' => $axip_dob,
							'_axip_usi' => $axip_usi,
							'_axip_city_of_birth' => $axip_city_of_birth,
							'_axip_lui' => $axip_lui,
							'_axip_sex' => $axip_sex,
							'_axip_home_phone' => $axip_home_phone,
							'_axip_postal_address' => $axip_postal_address,
							'_axip_street_address' => $axip_street_address,
							'_axip_organisation' => $axip_organisation,
							'_axip_occupation_identifier' => $axip_occupation_identifier,
							'_axip_industry_of_employment' => $axip_industry_of_employment,
							'_axip_position' => $axip_position,
							'_axip_work_phone' => $axip_work_phone,
							'_axip_mobile_phone' => $axip_mobile_phone,
							'_axip_fax' => $axip_fax 
					);
					
					update_post_meta ( $post_id, '_axip_enrolment_contact_personal', $axip_contact_personal );
					$axip_study_reason_nat = sanitize_text_field ( $_POST ['axip_study_reason_nat_' . $nameKey] );
					$axip_study_reason_wa = sanitize_text_field ( $_POST ['axip_study_reason_wa_' . $nameKey] );
					$axip_emergency_contact = sanitize_text_field ( $_POST ['axip_emergency_contact_' . $nameKey] );
					$axip_citizenship_status = sanitize_text_field ( $_POST ['axip_citizenship_status_' . $nameKey] );
					$axip_employment = sanitize_text_field ( $_POST ['axip_employment_' . $nameKey] );
					$axip_language = sanitize_text_field ( $_POST ['axip_language_' . $nameKey] );
					$axip_education_status = sanitize_text_field ( $_POST ['axip_education_status_' . $nameKey] );
					$axip_disability_status = sanitize_text_field ( $_POST ['axip_disability_status_' . $nameKey] );
					$axip_aboriginal_tsi_status = sanitize_text_field ( $_POST ['axip_aboriginal_tsi_status_' . $nameKey] );
					$axip_contact_source = sanitize_text_field ( $_POST ['axip_contact_source_' . $nameKey] );
					
					$axip_avetmiss_additional = array (
							'_axip_emergency_contact' => $axip_emergency_contact,
							'_axip_citizenship_status' => $axip_citizenship_status,
							'_axip_study_reason_nat' => $axip_study_reason_nat,
							'_axip_study_reason_wa' => $axip_study_reason_wa,
							'_axip_employment' => $axip_employment,
							'_axip_language' => $axip_language,
							'_axip_education_status' => $axip_education_status,
							'_axip_disability_status' => $axip_disability_status,
							'_axip_aboriginal_tsi_status' => $axip_aboriginal_tsi_status,
							'_axip_contact_source' => $axip_contact_source 
					);
					
					update_post_meta ( $post_id, '_axip_enrolment_avetmiss_additional', $axip_avetmiss_additional );
					
					$axip_success_message = sanitize_text_field ( $_POST ['enrolment_settings'] ['axip_success_message'] );
					$axip_multipage_contact_form = sanitize_text_field ( $_POST ['enrolment_settings'] ['axip_multipage_contact_form'] );
					$axip_entrolment_closed_message = sanitize_text_field ( $_POST ['enrolment_settings'] ['axip_entrolment_closed_message'] );
					$axip_allow_multiple_signup = sanitize_text_field ( $_POST ['enrolment_settings'] ['axip_allow_multiple_signup'] );
					$axip_allow_returning_users = sanitize_text_field ( $_POST ['enrolment_settings'] ['axip_allow_returning_users'] );
					$axip_returning_user_method = sanitize_text_field ( $_POST ['enrolment_settings'] ['axip_returning_user_method'] );
					$axip_headertext = sanitize_text_field ( $_POST ['enrolment_settings'] ['axip_headertext'] );
					$axip_use_iframe = sanitize_text_field ( $_POST ['enrolment_settings'] ['axip_use_iframe'] );
					$axip_clientId = sanitize_text_field ( $_POST ['enrolment_settings'] ['axip_clientId'] );
					$axip_captcha_display = sanitize_text_field ( $_POST ['enrolment_settings'] ['axip_captcha_display'] );
					
					$axip_add_category_method = sanitize_text_field ( $_POST ['enrolment_settings'] ['axip_add_category_method'] );
					$axip_add_financecode_override = sanitize_text_field ( $_POST ['enrolment_settings'] ['axip_add_financecode_override'] );
					$axip_contact_categories = sanitize_text_field ( $_POST ['enrolment_settings'] ['axip_contact_categories'] );
					$axip_category_option_label = sanitize_text_field ( $_POST ['enrolment_settings'] ['axip_category_option_label'] );
					$axip_financecode_default = sanitize_text_field ( $_POST ['enrolment_settings'] ['axip_financecode_default'] );
					$axip_financecode_category = sanitize_text_field ( $_POST ['enrolment_settings'] ['axip_financecode_category'] );
					
					$axip_enrolment_formsettings = array (
							'_axip_success_message' => $axip_success_message,
							'_axip_multipage_contact_form' => $axip_multipage_contact_form,
							'_axip_entrolment_closed_message' => $axip_entrolment_closed_message,
							'_axip_allow_multiple_signup' => $axip_allow_multiple_signup,
							'_axip_allow_returning_users' => $axip_allow_returning_users,
							'_axip_returning_user_method' => $axip_returning_user_method,
							'_axip_headertext' => $axip_headertext,
							'_axip_use_iframe' => $axip_use_iframe,
							'_axip_clientId' => $axip_clientId,
							'_axip_captcha_display' => $axip_captcha_display,
							'_axip_add_category_method' => $axip_add_category_method,
							'_axip_contact_categories' => $axip_contact_categories,
							'_axip_add_financecode_override' => $axip_add_financecode_override,
							'_axip_financecode_default' => $axip_financecode_default,
							'_axip_financecode_category' => $axip_financecode_category,
							'_axip_category_option_label' => $axip_category_option_label,
							'_axip_enroller_widget_config_id' => $axip_enroller_widget_config_id,
					)
					;
					
					update_post_meta ( $post_id, '_axip_enrolment_formsettings', $axip_enrolment_formsettings );
				} 

				

				elseif ($axip_pagetype == 6) {
					
					$axip_calendar_use_iframe = sanitize_text_field ( $_POST ['axip_calendar_use_iframe'] );
					$axip_calendar_clientId = sanitize_text_field ( $_POST ['axip_calendar_clientId'] );
					$axip_calendar_short_course_color = sanitize_text_field ( $_POST ['axip_calendar_short_course_color'] );
					$axip_calendar_programs_color = sanitize_text_field ( $_POST ['axip_calendar_programs_color'] );
					$axip_calendar_use_location = sanitize_text_field ( $_POST ['axip_calendar_use_location'] );
					$axip_calendar_type = sanitize_text_field ( $_POST ['axip_calendar_type'] );
					$axip_calendar_drilldown_page = sanitize_text_field ( $_POST ['axip_calendar_drilldown_page'] );
					
					update_post_meta ( $post_id, '_axip_calendar_use_iframe', $axip_calendar_use_iframe );
					update_post_meta ( $post_id, '_axip_calendar_clientId', $axip_calendar_clientId );
					update_post_meta ( $post_id, '_axip_calendar_short_course_color', $axip_calendar_short_course_color );
					update_post_meta ( $post_id, '_axip_calendar_programs_color', $axip_calendar_programs_color );
					update_post_meta ( $post_id, '_axip_calendar_use_location', $axip_calendar_use_location );
					update_post_meta ( $post_id, '_axip_calendar_type', $axip_calendar_type );
					update_post_meta ( $post_id, '_axip_calendar_drilldown_page', $axip_calendar_drilldown_page );
				} 

				elseif ($axip_pagetype == 7) {
					
					$axip_location_page = sanitize_text_field ( $_POST ['axip_location_page'] );
					
					update_post_meta ( $post_id, '_axip_location_page', $axip_location_page );
				}				

				// Adds the connection from WP to the tempalte file 'template/course-type-8.php',
				
				elseif ($axip_pagetype == 8) {
					
					$axip_location_course_page = sanitize_text_field ( $_POST ['axip_location_course_page'] );
					
					update_post_meta ( $post_id, '_axip_location_course_page', $axip_location_course_page );
				} 

				elseif ($axip_pagetype == 9) {
					
					$axip_training_categories_page = sanitize_text_field ( $_POST ['axip_training_categories_page'] );
					$axip_course_list_page = sanitize_text_field ( $_POST ['axip_course_list_page'] );
					$axip_main_listheader = sanitize_text_field ( $_POST ['axip_main_listheader'] );
					
					update_post_meta ( $post_id, '_axip_training_categories_page', $axip_training_categories_page );
					update_post_meta ( $post_id, '_axip_course_list_page', $axip_course_list_page );
					update_post_meta ( $post_id, '_axip_main_listheader', $axip_main_listheader );
				} 

				elseif ($axip_pagetype == 10) {
					
					$axip_training_categories_details_page = sanitize_text_field ( $_POST ['axip_training_categories_details_page'] );
					
					update_post_meta ( $post_id, '_axip_training_categories_details_page', $axip_training_categories_details_page );
					
					$axip_course_type = sanitize_text_field ( $_POST ['axip_course_type'] );
					$axip_main_listheader = sanitize_text_field ( $_POST ['axip_main_listheader'] );
					$axip_usesub_listheader = sanitize_text_field ( $_POST ['axip_usesub_listheader'] );
					$axip_sub_listheader = ($_POST ['axip_sub_listheader']);
					$axip_include_course_summary = sanitize_text_field ( $_POST ['axip_include_course_summary'] );
					$axip_empty_message = ($_POST ['axip_empty_message']);
					$axip_results_drilldown_pages = ($_POST ['axip_results_drilldown_pages']);
					
					$axip_socialmedia_facebook = ($_POST ['axip_socialmedia_facebook']);
					$axip_socialmedia_twitter = ($_POST ['axip_socialmedia_twitter']);
					$axip_socialmedia_linkedin = ($_POST ['axip_socialmedia_linkedin']);
					
					$axip_display_categories = ($_POST ['axip_display_categories']);
					
					update_post_meta ( $post_id, '_axip_course_type', $axip_course_type );
					update_post_meta ( $post_id, '_axip_main_listheader', $axip_main_listheader );
					update_post_meta ( $post_id, '_axip_usesub_listheader', $axip_usesub_listheader );
					update_post_meta ( $post_id, '_axip_sub_listheader', $axip_sub_listheader );
					update_post_meta ( $post_id, '_axip_include_course_summary', $axip_include_course_summary );
					update_post_meta ( $post_id, '_axip_empty_message', $axip_empty_message );
					update_post_meta ( $post_id, '_axip_results_drilldown_pages', $axip_results_drilldown_pages );
					
					update_post_meta ( $post_id, '_axip_socialmedia_facebook', $axip_socialmedia_facebook );
					update_post_meta ( $post_id, '_axip_socialmedia_twitter', $axip_socialmedia_twitter );
					update_post_meta ( $post_id, '_axip_socialmedia_linkedin', $axip_socialmedia_linkedin );
					
					update_post_meta ( $post_id, '_axip_display_categories', $axip_display_categories );
				} 

				elseif ($axip_pagetype == 14) {
					
					$axip_search_page = sanitize_text_field ( $_POST ['axip_search_page'] );
					$axip_results_drilldown_pages = ($_POST ['axip_results_drilldown_pages']);
					
					$axip_course_type = sanitize_text_field ( $_POST ['axip_course_type'] );
					
					update_post_meta ( $post_id, '_axip_search_page', $axip_search_page );
					update_post_meta ( $post_id, '_axip_results_drilldown_pages', $axip_results_drilldown_pages );
					
					update_post_meta ( $post_id, '_axip_course_type', $axip_course_type );
				}
			}
		}
	}
	
	/*
	 * Page type meta
	 */
	public function render_pagetype_meta_box_content($post) {
		
		// Get Course pages
		$course_pages_ARR = array ();
		
		$course_pages = get_posts ( array (
				'post_type' => 'ax-page',
				'post_status' => 'publish',
				'numberposts' => - 1 
		) );
		
		// echo '<pre>';
		// print_r($course_pages);
		// echo '</pre>';
		
		if (count ( $course_pages )) {
			
			foreach ( $course_pages as $course ) {
				
				$axip_pagetype = get_post_meta ( $course->ID, '_axip_pagetype', true );
				$course_pages_ARR [$axip_pagetype] [] = array (
						'ID' => $course->ID,
						'title' => $course->post_title 
				);
			}
		}
		
		$this->_course_pages = $course_pages_ARR;
		
		$pagetype_options = array (
				'0' => 'Choose Page Type',
				'1' => 'Course Listing Page',
				'2' => 'Course Details Page',
				'3' => 'Enquiry Form',
				'4' => 'Enrolment Form',
				'6' => 'Course Calendar',
				'9' => 'Training Cat List' 
		);
		
		$axip_pagetype = get_post_meta ( $post->ID, '_axip_pagetype', true );
		
		echo '<div class="axip-pagetype">';
		echo '<label for="axip_pagetype">Page type</label>';
		
		echo '<select style="width:20em" name="axip_pagetype" id="axip_pagetype">';
		
		foreach ( $pagetype_options as $key => $value ) {
			
			echo '<option value="' . $key . '" ' . selected ( $axip_pagetype, $key, false ) . '>' . $value . '</option>';
		}
		
		echo '</select>';
		echo '</div>';
		
		echo '<style text="text/css">
				.axip-course-container ul>li{margin-bottom:15px;} .axip-course-container label{margin-bottom:5px; display:block; font-weight:bold;}
				ul.axip-inner{list-style:disc inside none;} ul.axip-inner li{margin-bottom:5px;}
				#axip_course_list_meta_box,#axip_course_detail_meta_box,#axip_enquiry_form_meta_box,
				#axip_enrolment_form_meta_box,#axip_enrolment_request_form_meta_box,#axip_course_calendar_meta_box, #axip_training_cat_list_meta_box{display:none;}
			   </style>';
		
		echo '<script type="text/javascript">' . 

		"var axip_pagetype ='" . $axip_pagetype . "'" . ';
		
		jQuery(function($){
	
			$("#axip_pagetype").change(function(){
	
				var pagetype = $(this).val();
				
				$("#axip_course_list_meta_box,#axip_course_detail_meta_box,#axip_enquiry_form_meta_box,#axip_enrolment_form_meta_box,#axip_enquiry_request_form_meta_box,#axip_course_calendar_meta_box,#axip_training_cat_list_meta_box").hide();
				
				if(pagetype == "1"){
				
					$("#axip_course_list_meta_box").slideDown(\'slow\');
				}
				else if(pagetype == "2"){
				
					$("#axip_course_detail_meta_box").slideDown(\'slow\');
		
				}
				else if(pagetype == "3"){
				
					$("#axip_enquiry_form_meta_box").slideDown(\'slow\');
		
				}
				else if(pagetype == "4"){
				
					$("#axip_enrolment_form_meta_box").slideDown(\'slow\');
		
				}			
				else if(pagetype == "6"){
				
					$("#axip_course_calendar_meta_box").slideDown(\'slow\');
				}
				else if(pagetype == "9"){
				
					$("#axip_training_cat_list_meta_box").slideDown(\'slow\');
				}	
				
				else if(pagetype == "13"){
				
					$("#axip_course_list_meta_box").slideDown(\'slow\');
				}				
				
		 	});
		 	
		 	if(axip_pagetype == 1){
				$("#axip_course_list_meta_box").show();
			}
			else if(axip_pagetype == 2){
				$("#axip_course_detail_meta_box").show();			
			}
			else if(axip_pagetype == 3){
				$("#axip_enquiry_form_meta_box").show();			
			}			
			else if(axip_pagetype == 4){
				$("#axip_enrolment_form_meta_box").show();			
			}	
			else if(axip_pagetype == 6){
				$("#axip_course_calendar_meta_box").show();			
			}
			else if(axip_pagetype == 9){
				
				$("#axip_training_cat_list_meta_box").show();
			}
			
		 	else if(axip_pagetype == 13){
				$("#axip_course_list_meta_box").show();
			}

		});
		
		</script>';
	}
	
	/**
	 * Render Meta Box content.
	 *
	 * @param WP_Post $post
	 *        	The post object.
	 */
	public function render_meta_box_content($post) {
		$axip_instance_drilldown_page = get_post_meta ( $post->ID, '_axip_instance_drilldown_page', true );
		$axip_instance_header = get_post_meta ( $post->ID, '_axip_instance_header', true );
		$axip_button_text = get_post_meta ( $post->ID, '_axip_button_text', true );
		$axip_action_method = get_post_meta ( $post->ID, '_axip_action_method', true );
		$axip_instance_display = get_post_meta ( $post->ID, '_axip_instance_display', true );
		$axip_price_display = get_post_meta ( $post->ID, '_axip_price_display', true );
		$axip_enquire_button = get_post_meta ( $post->ID, '_axip_enquire_button', true );
		$axip_enquire_button_page = get_post_meta ( $post->ID, '_axip_enquire_button_page', true );
		$axip_booking_closed_text = get_post_meta ( $post->ID, '_axip_booking_closed_text', true );
		
		$axip_instance_header = (! empty ( $axip_instance_header ) ? $axip_instance_header : 'Upcoming');
		$axip_button_text = (! empty ( $axip_button_text ) ? $axip_button_text : 'Book Now');
		$axip_instance_button_page = (! empty ( $axip_instance_button_page ) ? $axip_instance_button_page : '0');
		
		$course_enrolment_pages = (! empty ( $this->_course_pages [4] ) ? $this->_course_pages [4] : array ());
		
		echo '<div class="axip-course-container">';
		echo '<ul>';
		echo '<li>';
		echo '<label for="axip_instance_drilldown_page">';
		echo __ ( 'Instance Listings - Enrolment Drilldown Page ', 'axip' );
		echo '</label> ';
		echo '<select style="width:20em" id="axip_instance_drilldown_page" name="axip_instance_drilldown_page">';
		echo '<option value="">Choose page</option>';
		
		foreach ( $course_enrolment_pages as $page ) {
			echo '<option value="' . $page ['ID'] . '" ' . selected ( $axip_instance_drilldown_page, $page ['ID'], false ) . '>' . $page ['title'] . '</option>';
		}
		
		echo '</select>';
		echo ' <em>' . __ ( 'The absolute page that users should go to when clicking the "book now" links. It should have a "Course Enrolment Form" content object.' ) . '</em>';
		echo '</li>';
		
		echo '<li>';
		echo '<label for="axip_header">';
		echo __ ( 'Instance Listings - Header ', 'axip' );
		echo '</label> ';
		echo '<input type="text" style="width:20em" id="axip_instance_header" name="axip_instance_header" value="' . esc_attr ( $axip_instance_header ) . '"  />';
		echo ' <em>' . __ ( 'The name of the header	to include for instances.' ) . '</em>';
		echo '</li>';
		
		echo '<li>';
		echo '<label for="axip_button_text">';
		echo __ ( 'Instance Listings - Button Text ', 'axip' );
		echo '</label> ';
		echo '<input type="text" style="width:20em" id="axip_button_text" name="axip_button_text" value="' . esc_attr ( $axip_button_text ) . '"  />';
		echo ' <em>' . __ ( 'The text to use on the button to book into instances.' ) . '</em>';
		echo '</li>';
		
		echo '<li>';
		echo '<label for="axip_booking_closed_text">';
		echo __ ( 'Instance Listings - Booking Closed Text', 'axip' );
		echo '</label> ';
		echo '<input type="text" style="width:20em" id="axip_booking_closed_text" name="axip_booking_closed_text" value="' . esc_attr ( $axip_booking_closed_text ) . '"  />';
		echo ' <em>' . __ ( 'Displayed when the instance is closed for bookings' ) . '</em>';
		echo '</li>';
		
		$action_method_options = array (
				'POST',
				'GET' 
		);
		echo '<li>';
		echo '<label for="axip_action_method">';
		echo __ ( 'Instance Listings - Action Method ', 'axip' );
		echo '</label> ';
		echo '<select style="width:20em" id="axip_action_method" name="axip_action_method">';
		
		foreach ( $action_method_options as $value ) {
			
			echo '<option value="' . $value . '" ' . selected ( $axip_action_method, $value ) . '>' . $value . '</option>';
		}
		
		echo '</select>';
		
		echo ' <em>' . __ ( 'POST or GET form action with POST all is hidden and nice, but with GET you can copy and email the URL' ) . '</em>';
		echo '</li>';
		
		$booking_button_options = array (
				'0' => 'Display Instances and Booking Buttons',
				'1' => 'Display Instances Only',
				'2' => 'Don\'t Display Both' 
		);
		
		echo '<li>';
		echo '<label for="axip_instance_display">';
		echo __ ( 'Instance Display Options - Instances / Booking Buttons ', 'axip' );
		echo '</label> ';
		
		echo '<select style="width:20em" id="axip_instance_display" name="axip_instance_display">';
		
		foreach ( $booking_button_options as $key => $value ) {
			
			echo '<option value="' . $key . '" ' . selected ( $axip_instance_display, $key ) . '>' . $value . '</option>';
		}
		
		echo '</select>';
		
		echo '</li>';
		
		$price_display_options = array (
				'0' => 'Don\'t Display Prices',
				'1' => 'Display Prices' 
		);
		
		echo '<li>';
		echo '<label for="axip_price_display">';
		echo __ ( 'Instance Display Options - Instance Prices Display ', 'axip' );
		echo '</label> ';
		
		echo '<select style="width:20em" id="axip_price_display" name="axip_price_display">';
		foreach ( $price_display_options as $key => $value ) {
			echo '<option value="' . $key . '" ' . selected ( $axip_price_display, $key ) . '>' . $value . '</option>';
		}
		echo '</select>';
		
		echo '</li>';
		echo '<li>';
		echo '<label for="axip_enquire_button">';
		echo __ ( 'Add Enquire Button', 'axip' );
		echo '</label> ';
		echo '<input type="checkbox" id="axip_enquire_button" name="axip_enquire_button" value="1" ' . checked ( $axip_enquire_button, 1, false ) . '  />';
		echo '</li>';
		echo '<li>';
		echo '<label for="axip_enquire_button_page">';
		echo __ ( 'Enquire Page ID', 'axip' );
		echo '</label> ';
		echo '<input type="text" style="width:20em" id="axip_enquire_button_page" name="axip_enquire_button_page" value="' . esc_attr ( $axip_enquire_button_page ) . '"  />';
		echo '</li>';
		
		echo '</ul>';
		echo '</div>';
	}
	public function render_course_list_meta_box_content($post) {
		$axip_course_type = get_post_meta ( $post->ID, '_axip_course_type', true );
		$axip_main_listheader = get_post_meta ( $post->ID, '_axip_main_listheader', true );
		$axip_usesub_listheader = get_post_meta ( $post->ID, '_axip_usesub_listheader', true );
		$axip_sub_listheader = get_post_meta ( $post->ID, '_axip_sub_listheader', true );
		$axip_include_course_summary = get_post_meta ( $post->ID, '_axip_include_course_summary', true );
		$axip_empty_message = get_post_meta ( $post->ID, '_axip_empty_message', true );
		$axip_results_drilldown_pages = get_post_meta ( $post->ID, '_axip_results_drilldown_pages', true );
		$axip_display_categories = get_post_meta ( $post->ID, '_axip_display_categories', true );
		$axip_display_locations = get_post_meta ( $post->ID, '_axip_display_locations', true );
		$axip_training_categories_all_courses = get_post_meta ( $post->ID, '_axip_training_categories_all_courses', true );
		
		$axip_training_category_filter = get_post_meta ( $post->ID, '_axip_training_category_filter', true );
		
		$course_type_options = array (
				"p" => "Programs (Classes and Qualifications)",
				"w" => "Short Courses (Workshops)",
				"el" => "E-Learning Courses",
				"all" => "All" 
		);
		
		$usesub_listheader_options = array (
				"0" => "Never use subheaders",
				"1" => "Use only if needed",
				"2" => "Always use subheaders" 
		);
		
		$course_details_pages = (! empty ( $this->_course_pages [2] ) ? $this->_course_pages [2] : array ());
		;
		
		echo '<div class="axip-course-container">';
		echo '<ul>';
		echo '<li>';
		echo '<label for="axip_course_type">';
		echo __ ( 'Course types to display', 'axip' );
		echo '</label> ';
		
		echo '<select style="width:20em" name="axip_course_type" id="axip_course_type">';
		foreach ( $course_type_options as $key => $value ) {
			echo '<option value="' . $key . '" ' . ($axip_course_type == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
		}
		echo '</select>';
		echo '</li>';
		
		echo '<li>';
		echo '<label for="axip_main_listheader">';
		echo __ ( 'Main List Header', 'axip' );
		echo '</label> ';
		echo '<input type="text" style="width:20em" id="axip_main_listheader" name="axip_main_listheader" value="' . esc_attr ( $axip_main_listheader ) . '"  />';
		echo '</li>';
		
		echo '<li>';
		echo '<label for="axip_usesub_listheader">';
		echo __ ( 'Use Sub Headers (Group by type)', 'axip' );
		echo '</label> ';
		echo '<select style="width:20em" name="axip_usesub_listheader" id="axip_usesub_listheader">';
		
		foreach ( $usesub_listheader_options as $key => $value ) {
			echo '<option value="' . $key . '" ' . ($axip_usesub_listheader == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
		}
		
		echo '</select>';
		echo '</li>';
		
		echo '<li>';
		echo '<label for="axip_sub_listheader">';
		echo __ ( 'Sub Headers (if applicable)', 'axip' );
		echo '</label> ';
		
		echo '<ul>
				<li><input type="text" style="width:20em" value="' . (isset ( $axip_sub_listheader ['w'] ) ? $axip_sub_listheader ['w'] : '') . '" name="axip_sub_listheader[w]" /> <em>Short Courses</em></li>
				<li><input type="text" style="width:20em" value="' . (isset ( $axip_sub_listheader ['p'] ) ? $axip_sub_listheader ['p'] : '') . '" name="axip_sub_listheader[p]" /> <em>Programs</em></li>
				<li><input type="text" style="width:20em" value="' . (isset ( $axip_sub_listheader ['el'] ) ? $axip_sub_listheader ['el'] : '') . '" name="axip_sub_listheader[el]" /> <em>E-Learning</em></li>
			  </ul>';
		
		echo '</li>';
		
		echo '<li>';
		echo '<label for="axip_include_course_summary">';
		echo __ ( 'Include Course Summary', 'axip' );
		echo '</label> ';
		echo '<input type="checkbox" id="axip_include_course_summary" name="axip_include_course_summary" value="1" ' . checked ( $axip_include_course_summary, 1, false ) . '  />';
		echo '</li>';
		
		echo '<li>';
		echo '<label for="axip_empty_message">';
		echo __ ( 'Empty Message', 'axip' );
		echo '</label> ';
		
		echo '<textarea style="width:30em" id="axip_empty_message" name="axip_empty_message"  />' . ($axip_empty_message) . '</textarea>';
		
		echo '<br/><em>' . __ ( 'A message to display if the service returns no results. Can be HTML. Leave blank to display nothing.' ) . '</em>';
		echo '</li>';
		
		echo '<li>';
		echo '<label for="axip_results_drilldown_pages">';
		echo __ ( 'Results Drilldown Pages', 'axip' );
		echo '</label> ';
		
		$axip_results_drilldown_default = (isset ( $axip_results_drilldown_pages ['default'] ) ? $axip_results_drilldown_pages ['default'] : '');
		$axip_results_drilldown_course = (isset ( $axip_results_drilldown_pages ['w'] ) ? $axip_results_drilldown_pages ['w'] : '');
		$axip_results_drilldown_programs = (isset ( $axip_results_drilldown_pages ['p'] ) ? $axip_results_drilldown_pages ['p'] : '');
		$axip_results_drilldown_eLearning = (isset ( $axip_results_drilldown_pages ['el'] ) ? $axip_results_drilldown_pages ['el'] : '');
		
		echo '<p>' . __ ( 'The absolute pages that users should go to when clicking the course links. You can specify one default or individual result pages depending on course type. They should have a "Course Detail Display" content object' ) . '</p>';
		echo '<ul>';
		echo '		<li>
				    <select style="width:20em" name="axip_results_drilldown_pages[default]">
					<option value="">Choose course details page</option>';
		foreach ( $course_details_pages as $page ) {
			echo '<option value="' . $page ['ID'] . '" ' . selected ( $axip_results_drilldown_default, $page ['ID'], false ) . '>' . $page ['title'] . '</option>';
		}
		echo '		    </select><em>Default</em>
				</li>';
		
		echo '		<li>
				    <select style="width:20em" name="axip_results_drilldown_pages[w]">
					<option value="">Choose course details page</option>';
		foreach ( $course_details_pages as $page ) {
			echo '<option value="' . $page ['ID'] . '" ' . selected ( $axip_results_drilldown_course, $page ['ID'], false ) . '>' . $page ['title'] . '</option>';
		}
		echo '		    </select><em>Short Courses</em>
				</li>';
		
		echo '		<li>
				    <select style="width:20em" name="axip_results_drilldown_pages[p]">
					<option value="">Choose course details page</option>';
		foreach ( $course_details_pages as $page ) {
			echo '<option value="' . $page ['ID'] . '" ' . selected ( $axip_results_drilldown_programs, $page ['ID'], false ) . '>' . $page ['title'] . '</option>';
		}
		echo '		    </select><em>Programs</em>
				</li>';
		
		echo '		<li>
				    <select style="width:20em" name="axip_results_drilldown_pages[el]">
					<option value="">Choose course details page</option>';
		foreach ( $course_details_pages as $page ) {
			echo '<option value="' . $page ['ID'] . '" ' . selected ( $axip_results_drilldown_eLearning, $page ['ID'], false ) . '>' . $page ['title'] . '</option>';
		}
		echo '		    </select><em>E-Learning</em>
				</li>';
		
		echo '<li>';
		echo '<label for="axip_training_category_filter">';
		echo __ ( 'Filter List by Training Category', 'axip' );
		echo '</label> ';
		echo '<p>' . __ ( 'Always filter on a specific Training Category. Will not work in conjunction with the below filters.' ) . '</p>';
		echo '<input type="text" style="width:20em" id="axip_training_category_filter" name="axip_training_category_filter" value="' . esc_attr ( $axip_training_category_filter ) . '"  />';
		echo '</li>';
		
		echo '<li>';
		echo __ ( '<p>The following filters (when used) will only display Courses which have active instances available for enrolment</p>', 'axip' );
		echo '<label for="axip_display_categories">';
		echo __ ( 'Display Category Filter', 'axip' );
		echo '</label> ';
		echo '<input type="checkbox" id="axip_display_categories" name="axip_display_categories" value="1" ' . checked ( $axip_display_categories, 1, false ) . '  />';
		echo '</li>';
		echo '<li>';
		echo '<label for="axip_display_locations">';
		echo __ ( 'Display Locations Filter', 'axip' );
		echo '</label> ';
		echo '<input type="checkbox" id="axip_display_locations" name="axip_display_locations" value="1" ' . checked ( $axip_display_locations, 1, false ) . '  />';
		echo '</li>';
		echo '<li>';
		echo '<label for="axip_training_categories_all_courses">';
		echo __ ( 'Display All Courses When filtering by Category', 'axip' );
		echo __ ( '<p>Enables category filter and displays all courses, not just those with instances. Note this will disable location filtering</p>', 'axip' );
		echo '</label> ';
		echo '<input type="checkbox" id="axip_training_categories_all_courses" name="axip_training_categories_all_courses" value="1" ' . checked ( $axip_training_categories_all_courses, 1, false ) . '  />';
		echo '</li>';
		
		echo '	</ul>';
		
		echo '</li>';
		
		echo '</ul>';
		
		echo '</div>';
	}
	
	/* Training Category List */
	public function render_training_cat_list_meta_box_content($post) {
		$axip_course_list_page = get_post_meta ( $post->ID, '_axip_course_list_page', true );
		$axip_main_listheader = get_post_meta ( $post->ID, '_axip_main_listheader', true );
		
		$course_list_pages = (! empty ( $this->_course_pages [1] ) ? $this->_course_pages [1] : array ());
		;
		
		echo '<div class="axip-course-container">';
		echo '<ul>';
		
		echo '<li>';
		echo '<label for="axip_main_listheader">';
		echo __ ( 'Main List Header', 'axip' );
		echo '</label> ';
		echo '<input type="text" style="width:20em" id="axip_main_listheader" name="axip_main_listheader" value="' . esc_attr ( $axip_main_listheader ) . '"  />';
		echo '</li>';
		echo '<li>';
		echo '<label for="axip_course_list_page">';
		echo __ ( 'Course List Drilldown Page', 'axip' );
		echo '</label> ';
		
		echo '<p>' . __ ( 'The absolute page that users should go to when clicking the training Category links.' ) . '</p>';
		echo '		<li>
				    <select style="width:20em" name="axip_course_list_page">
					<option value="">Choose course list page</option>';
		foreach ( $course_list_pages as $page ) {
			echo '<option value="' . $page ['ID'] . '" ' . selected ( $axip_course_list_page, $page ['ID'], false ) . '>' . $page ['title'] . '</option>';
		}
		echo '		    </select><em>Course List</em>
				</li>';
		
		echo '</ul>';
		
		echo '</div>';
	}
	
	/*
	 * Enquiry form
	 */
	public function render_enqiry_form_content($post) {
		$formSettings = get_post_meta ( $post->ID, '_axip_enquiry_formsettings', true );
		
		if (isset ( $formSettings ['_axip_headertext'] )) {
			$axip_headertext = $formSettings ['_axip_headertext'];
			$axip_use_iframe = $formSettings ['_axip_use_iframe'];
			$axip_clientId = $formSettings ['_axip_clientId'];
			$axip_captcha_display = $formSettings ['_axip_captcha_display'];
			
			$axip_success_message = $formSettings ['_axip_success_message'];
			$axip_multipage_contact_form = $formSettings ['_axip_multipage_contact_form'];
			$axip_enquiry_noteid = $formSettings ['_axip_enquiry_noteid'];
			$axip_enquiry_email_list = $formSettings ['_axip_enquiry_email_list'];
		}
		
		$captcha_display_options = $user_iframe_options = array (
				'no' => 'No',
				'yes' => 'Yes' 
		);
		
		echo '<div class="axip-course-container">';
		echo '<ul>';
		echo '<li>';
		echo '<label for="axip_headertext">';
		echo __ ( 'Header Text', 'axip' );
		echo '</label> ';
		echo '<input type="text" style="width:20em" id="axip_headertext" name="enquiry_settings[axip_headertext]" value="' . esc_attr ( $axip_headertext ) . '"  />';
		echo '</li>';
		
		echo '<li>';
		echo '<label for="axip_use_iframe">';
		echo __ ( 'Use old iFrame (temporary!)', 'axip' );
		echo '</label> ';
		
		echo '<select style="width:20em" name="enquiry_settings[axip_use_iframe]" id="axip_use_iframe">';
		foreach ( $user_iframe_options as $key => $value ) {
			echo '<option value="' . $key . '" ' . ($axip_use_iframe == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
		}
		echo '</select> ';
		
		echo 'ClientID';
		echo '<input type="text" style="width:20em" id="axip_clientId" name="enquiry_settings[axip_clientId]" value="' . esc_attr ( $axip_clientId ) . '"  />';
		echo '<br/><em>These values are temporary only. It uses an iFrame for booking rather than a local form. This is to cover legacy features not yet implemented in our API\'s</em>';
		
		echo '<h4>IMPORTANT NOTES:</h4>';
		
		echo '<ul class="axip-inner">';
		echo '<li><strong>If yes is selected none of the other settings below apply</strong></li>';
		echo '<li>iFrame will only points to your <strong>LIVE environment</strong></li>';
		echo '<li><strong>Bookings</strong> only work for <strong>workshops</strong> (type=w)</li>';
		echo '<li><strong>Enquires</strong> will use the iframes only for <strong>non-general enquires</strong> (eg enquiry on a course or program)</li>';
		echo '</ul>';
		
		echo '</li>';
		
		echo '<li>';
		echo '<label for="axip_captcha_display">';
		echo __ ( 'Captcha Display:', 'axip' );
		echo '</label> ';
		
		echo '<select style="width:20em" name="enquiry_settings[axip_captcha_display]" id="axip_captcha_display">';
		foreach ( $captcha_display_options as $key => $value ) {
			echo '<option value="' . $key . '" ' . ($axip_captcha_display == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
		}
		echo '</select> ';
		echo '</li>';
		
		echo '</ul>';
		
		$this->_axip_meta_helper ( 1, '_axip_enquiry_contact_personal', 1, $post->ID );
		
		$this->_axip_meta_helper ( 2, '_axip_enquiry_avetmiss_additional', 1, $post->ID );
		
		$multipage_field_options = array (
				0 => 'No- keep all fields on one page',
				1 => 'Yes - Splits into 2 pages' 
		);
		$allow_multiple_signup_options = array (
				0 => 'No',
				1 => 'Yes - up to 10 people' 
		);
		$allow_returning_users_options = array (
				0 => 'No - only new users',
				1 => 'Yes - both new and returning users' 
		);
		
		echo '<ul>';
		echo '<li>';
		echo '<label for="axip_success_message">';
		echo __ ( 'Success Message', 'axip' );
		echo '</label> ';
		echo '<input type="text" style="width:20em" id="axip_success_message" name="enquiry_settings[axip_success_message]" value="' . esc_attr ( $axip_success_message ) . '"  />';
		echo ' <em>The message to display to the on the successful submission.</em>';
		echo '</li>';
		
		echo '<li>';
		echo '<label for="axip_multipage_contact_form">';
		echo __ ( 'Multipage Contact Form', 'axip' );
		echo '</label> ';
		
		echo '<select style="width:20em" name="enquiry_settings[axip_multipage_contact_form]" id="axip_multipage_contact_form">';
		foreach ( $multipage_field_options as $key => $value ) {
			echo '<option value="' . $key . '" ' . ($axip_multipage_contact_form == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
		}
		echo '</select>';
		
		echo ' <em>The payment form (if applicable) will always be on a seperate page.</em>';
		echo '</li>';
		
		echo '<li>';
		echo '<label for="axip_enquiry_noteid">';
		echo __ ( 'Note ID', 'axip' );
		echo '</label> ';
		echo '<input type="text" style="width:20em" id="axip_enquiry_noteid" name="enquiry_settings[axip_enquiry_noteid]" value="' . esc_attr ( $axip_enquiry_noteid ) . '"  />';
		echo ' <em>(Enquiry only) This is the axcelerate ID for the note type you wish to set against web enquires that come through.</em>';
		echo '</li>';
		
		echo '<li>';
		echo '<label for="axip_enquiry_email_list">';
		echo __ ( 'Email List', 'axip' );
		echo '</label> ';
		echo '<input type="text" style="width:20em" id="axip_enquiry_email_list" name="enquiry_settings[axip_enquiry_email_list]" value="' . esc_attr ( $axip_enquiry_email_list ) . '"  />';
		echo ' <em>(Enquiry only) This is a comma separated list of emails to notify when an enquiry is sent. The email is generated from axcelerate.</em>';
		echo '</li>';
		echo '</ul>';
		echo '</div>';
	}
	
	/*
	 * Enrolment form
	 */
	public function render_enrolment_form_content($post) {
		$formSettings = get_post_meta ( $post->ID, '_axip_enrolment_formsettings', true );
		
		if (isset ( $formSettings ['_axip_headertext'] )) {
			$axip_headertext = $formSettings ['_axip_headertext'];
			$axip_use_iframe = $formSettings ['_axip_use_iframe'];
			$axip_clientId = $formSettings ['_axip_clientId'];
			$axip_captcha_display = $formSettings ['_axip_captcha_display'];
			
			$axip_success_message = $formSettings ['_axip_success_message'];
			$axip_multipage_contact_form = $formSettings ['_axip_multipage_contact_form'];
			$axip_entrolment_closed_message = $formSettings ['_axip_entrolment_closed_message'];
			$axip_allow_multiple_signup = $formSettings ['_axip_allow_multiple_signup'];
			$axip_allow_returning_users = $formSettings ['_axip_allow_returning_users'];
			$axip_returning_user_method = $formSettings ['_axip_returning_user_method'];
			
			$axip_add_category_method = $formSettings ['_axip_add_category_method'];
			$axip_contact_categories = $formSettings ['_axip_contact_categories'];
			$axip_category_option_label = $formSettings ['_axip_category_option_label'];
			
			$axip_add_financecode_override = $formSettings ['_axip_add_financecode_override'];
			$axip_financecode_default = $formSettings['_axip_financecode_default'];
			$axip_financecode_category = $formSettings['_axip_financecode_category'];
			
			
			$axip_enroller_widget_config_id = $formSettings['_axip_enroller_widget_config_id'];
			
			// $axip_allow_custom_fields = $formSettings['_axip_allow_custom_fields'];
		}
		
		$captcha_display_options = $user_iframe_options = array (
				'no' => 'No',
				'yes' => 'Yes' 
		);
		$axip_add_category_method_options = array (
				'no_category' => 'None',
				'all_category' => 'Add Categories for all Contacts',
				'option_category' => 'Add categories based on a question' 
		);
		$axip_add_financecode_method_options = array (
				'no_override' => 'No Override (Use course Default)',
				'override_default' => 'Override with Default Value',
				'override_category' => 'Override based on Category Question'
		);
		
		
		echo '<div class="axip-course-container">';
		echo '<ul>';
		
		
		/* Enrolment Widget Setting - disables all other settings */
		echo '<li>';
		echo '<h1>New Enrolment Widget</h1>';
		echo '<label for="axip_enroller_widget_config_id">';
		echo __ ( 'Enrolment Widget Config ID', 'axip' );
		echo '</label> ';
		echo '<input type="text" style="width:20em" id="axip_headertext" name="enrolment_settings[axip_enroller_widget_config_id]" value="' . esc_attr ( $axip_enroller_widget_config_id ) . '"  />';
		echo '<h3>This setting disables all other settings - see the configuration tool in aXcelerate Integration Settings</h3>';
		echo '</li>';
		
		echo '<hr>';
		echo '<li><br/></li>';
		
		
		
		
		
		
		
		
		echo '<li>';
		echo '<label for="axip_headertext">';
		echo __ ( 'Header Text', 'axip' );
		echo '</label> ';
		echo '<input type="text" style="width:20em" id="axip_headertext" name="enrolment_settings[axip_headertext]" value="' . esc_attr ( $axip_headertext ) . '"  />';
		echo '</li>';
		
		echo '<li>';
		echo '<label for="axip_use_iframe">';
		echo __ ( 'Use old iFrame (temporary!)', 'axip' );
		echo '</label> ';
		
		echo '<select style="width:20em" name="enrolment_settings[axip_use_iframe]" id="axip_use_iframe">';
		
		foreach ( $user_iframe_options as $key => $value ) {
			
			echo '<option value="' . $key . '" ' . ($axip_use_iframe == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
		}
		
		echo '</select> ';
		
		echo 'ClientID';
		echo '<input type="text" style="width:20em" id="axip_clientId" name="enrolment_settings[axip_clientId]" value="' . esc_attr ( $axip_clientId ) . '"  />';
		echo '<br/><em>These values are temporary only. It uses an iFrame for booking rather than a local form. This is to cover legacy features not yet implemented in our API\'s</em>';
		
		echo '<h4>IMPORTANT NOTES:</h4>';
		
		echo '<ul class="axip-inner">';
		echo '<li><strong>If yes is selected none of the other settings below apply</strong></li>';
		echo '<li>iFrame will only points to your <strong>LIVE environment</strong></li>';
		echo '<li><strong>Bookings</strong> only work for <strong>workshops</strong> (type=w)</li>';
		echo '<li><strong>Enquires</strong> will use the iframes only for <strong>non-general enquires</strong> (eg enquiry on a course or program)</li>';
		echo '</ul>';
		
		echo '</li>';
		
		/*
		 * $allow_custom_fields_options = array(0=>'No',1=>'Yes');
		 *
		 * echo '<li>';
		 * echo '<label for="axip_allow_custom_fields">';
		 * echo __( 'Allow Custom Fields', 'axip' );
		 * echo '</label> ';
		 * echo '<select style="width:20em" name="enrolment_settings[axip_allow_custom_fields]" id="axip_allow_custom_fields">';
		 * foreach($allow_custom_fields_options as $key=>$value){
		 * echo '<option value="'.$key.'" '. ($axip_allow_custom_fields ==$key?'selected="selected"':'').' >'.$value.'</option>';
		 * }
		 * echo '</select>';
		 * echo ' <em>Custom field information.</em>';
		 * echo '</li>';
		 */
		
		echo '<li>';
		echo '<label for="axip_captcha_display">';
		echo __ ( 'Captcha Display:', 'axip' );
		echo '</label> ';
		
		echo '<select style="width:20em" name="enrolment_settings[axip_captcha_display]" id="axip_captcha_display">';
		
		foreach ( $captcha_display_options as $key => $value ) {
			
			echo '<option value="' . $key . '" ' . ($axip_captcha_display == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
		}
		
		echo '</select> ';
		echo '</li>';
		
		echo '<li>';
		echo '<label for="axip_add_category_method">';
		echo __ ( 'Add Contact Categories:', 'axip' );
		echo '</label> ';
		
		echo '<select style="width:20em" name="enrolment_settings[axip_add_category_method]" id="axip_add_category_method">';
		foreach ( $axip_add_category_method_options as $key => $value ) {
			echo '<option value="' . $key . '" ' . ($axip_add_category_method == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
		}
		echo '</select>';
		
		echo '<label for="axip_contact_categories">';
		echo __ ( 'Categories to add', 'axip' );
		echo '</label> ';
		echo '<input type="text" style="width:20em" id="axip_contact_categories" name="enrolment_settings[axip_contact_categories]" value="' . esc_attr ( $axip_contact_categories ) . '"  />';
		echo ' <em>Contact Categories to be added - separated by comma. Note you must use the numeric Category ID, not the Name or code.</em>';
		
		echo '<label for="axip_category_option_label">';
		echo __ ( 'Category Question:', 'axip' );
		echo '</label> ';
		echo '<input type="text" style="width:20em" id="axip_category_option_label" name="enrolment_settings[axip_category_option_label]" value="' . esc_attr ( $axip_category_option_label ) . '"  />';
		echo ' <em>Label/Question to be displayed with a Yes or No response from student booking.</em>';
		
		echo '</li>';
		
		/*ADD FINANCE CODE BASED ON CATEGORY*/
		echo '<li>';
		echo '<label for="axip_add_financecode_override">';
		echo __ ( 'Override Finance Codes', 'axip' );
		echo '</label> ';
		
		echo '<select style="width:20em" name="enrolment_settings[axip_add_financecode_override]" id="axip_add_financecode_override">';
		foreach ( $axip_add_financecode_method_options as $key => $value ) {
			echo '<option value="' . $key . '" ' . ($axip_add_financecode_override == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
		}
		echo '</select>';
		echo ' <em>This setting will override the default finance code used for enrolments, used in conjunction with the Add Categories based on a question setting. Please note the Override Based on a Category will Disable the Returning Users Function.</em>';
		
		echo '<label for="axip_financecode_default">';
		echo __ ( 'Finance Code Override (default)', 'axip' );
		echo '</label> ';
		echo '<input type="text" style="width:20em" id="axip_financecode_default" name="enrolment_settings[axip_financecode_default]" value="' . esc_attr ( $axip_financecode_default ) . '"  />';
		echo ' <em>Used as the default finance code, or if the category question is answered with a No, when using overrides. Must be FinCodeID (numeric) and not Finance Code.</em>';
		
		echo '<label for="axip_financecode_category">';
		echo __ ( 'Finance Code Override (Category)', 'axip' );
		echo '</label> ';
		echo '<input type="text" style="width:20em" id="axip_financecode_category" name="enrolment_settings[axip_financecode_category]" value="' . esc_attr ( $axip_financecode_category ) . '"  />';
		echo ' <em>When Using the Finance Code Override Category, this will be used in conjunction with "Yes" on the add category question.Must be FinCodeID (numeric) and not Finance Code</em>';
		
		echo '</li>';
		
		
		
		
		echo '</ul>';
		
		$this->_axip_meta_helper ( 1, '_axip_enrolment_contact_personal', 2, $post->ID );
		
		$this->_axip_meta_helper ( 2, '_axip_enrolment_avetmiss_additional', 2, $post->ID );
		
		$multipage_field_options = array (
				0 => 'No- keep all fields on one page',
				1 => 'Yes - Splits into 2 pages' 
		);
		$allow_multiple_signup_options = array (
				0 => 'No',
				1 => 'Yes - up to 10 people' 
		);
		$allow_returning_users_options = array (
				0 => 'No - only new users',
				1 => 'Yes - both new and returning users' 
		);
		$axip_returning_user_method_options = array (
				'Contact' => 'Contacts',
				'User' => 'aXcelerate User Account' 
		);
		
		echo '<ul>';
		echo '<li>';
		echo '<label for="axip_success_message">';
		echo __ ( 'Success Message', 'axip' );
		echo '</label> ';
		echo '<input type="text" style="width:20em" id="axip_success_message" name="enrolment_settings[axip_success_message]" value="' . esc_attr ( $axip_success_message ) . '"  />';
		echo ' <em>The message to display to the on the successful submission.</em>';
		echo '</li>';
		
		echo '<li>';
		echo '<label for="axip_multipage_contact_form">';
		echo __ ( 'Multipage Contact Form', 'axip' );
		echo '</label> ';
		
		echo '<select style="width:20em" name="enrolment_settings[axip_multipage_contact_form]" id="axip_multipage_contact_form">';
		foreach ( $multipage_field_options as $key => $value ) {
			echo '<option value="' . $key . '" ' . ($axip_multipage_contact_form == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
		}
		echo '</select>';
		
		echo ' <em>The payment form (if applicable) will always be on a seperate page.</em>';
		echo '</li>';
		
		echo '<li>';
		echo '<label for="axip_entrolment_closed_message">';
		echo __ ( 'Enrolment Closed Message', 'axip' );
		echo '</label> ';
		echo '<input type="text" style="width:20em" id="axip_entrolment_closed_message" name="enrolment_settings[axip_entrolment_closed_message]" value="' . esc_attr ( $axip_entrolment_closed_message ) . '"  />';
		echo ' <em>The message to display to the user us enrolments are closed, either for the system or for the particular course.</em>';
		echo '</li>';
		
		echo '<li>';
		echo '<label for="axip_allow_multiple_signup">';
		echo __ ( 'Allow Multiple Signup', 'axip' );
		echo '</label> ';
		
		echo '<select style="width:20em" name="enrolment_settings[axip_allow_multiple_signup]" id="axip_allow_multiple_signup">';
		foreach ( $allow_multiple_signup_options as $key => $value ) {
			echo '<option value="' . $key . '" ' . ($axip_allow_multiple_signup == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
		}
		echo '</select>';
		
		echo ' <em>Allows someone (eg a manager) to book more than one participant, including themselves if they wish</em>';
		echo '</li>';
		
		echo '<li>';
		echo '<label for="axip_allow_returning_users">';
		echo __ ( 'Allow Returning Users', 'axip' );
		echo '</label> ';
		
		echo '<select style="width:20em" name="enrolment_settings[axip_allow_returning_users]" id="axip_allow_returning_users">';
		foreach ( $allow_returning_users_options as $key => $value ) {
			echo '<option value="' . $key . '" ' . ($axip_allow_returning_users == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
		}
		echo '</select>';
		
		echo ' <em>Users can set a password and then return by entering their email and password. Note: If a new user enters a name and email that matches an existing user, it will book this existing user, but no personal details will be overridden.</em>';
		echo '</li>';
		echo '<li>';
		echo '<select style="width:20em" name="enrolment_settings[axip_returning_user_method]" id="axip_returning_user_method">';
		foreach ( $axip_returning_user_method_options as $key => $value ) {
			echo '<option value="' . $key . '" ' . ($axip_returning_user_method == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
		}
		echo '</select>';
		echo ' <em>Determines how the returning User option functions - aXcelerate User account can be used in conjunction with aXcelerate User accounts, such as those generated for the aXcelerate Learner Portal. A system setting "Auto Generate Learners" can be used to create these on student enrolment.</em>';
		
		echo '</li>';
		
		echo '</ul>';
		echo '</div>';
	}
	
	
	/*
	 * Course Calendar
	 */
	public function render_course_calendar_content($post) {
		$course_details_pages = (! empty ( $this->_course_pages [2] ) ? $this->_course_pages [2] : array ());
		
		$user_iframe_options = array (
				'no' => 'No',
				'yes' => 'Yes' 
		);
		
		$axip_calendar_use_iframe = get_post_meta ( $post->ID, '_axip_calendar_use_iframe', true );
		$axip_calendar_clientId = get_post_meta ( $post->ID, '_axip_calendar_clientId', true );
		$axip_calendar_short_course_color = get_post_meta ( $post->ID, '_axip_calendar_short_course_color', true );
		$axip_calendar_programs_color = get_post_meta ( $post->ID, '_axip_calendar_programs_color', true );
		$axip_calendar_use_location = get_post_meta ( $post->ID, '_axip_calendar_use_location', true );
		$axip_calendar_type = get_post_meta ( $post->ID, '_axip_calendar_type', true );
		$axip_calendar_drilldown_page = get_post_meta ( $post->ID, '_axip_calendar_drilldown_page', true );
		
		echo '<div class="axip-course-container">';
		echo '<h4>The Training Calendar</h4>';
		echo '<ul>';
		echo '<li>';
		echo '<label for="axip_calendar_use_iframe">';
		echo __ ( 'Use old iFrame (temporary!)', 'axip' );
		echo '</label> ';
		
		echo '<select style="width:20em" name="axip_calendar_use_iframe" id="axip_calendar_use_iframe">';
		foreach ( $user_iframe_options as $key => $value ) {
			echo '<option value="' . $key . '" ' . ($axip_calendar_use_iframe == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
		}
		echo '</select> ';
		
		echo 'ClientID';
		echo '<input type="text" style="width:20em" id="axip_calendar_clientId" name="axip_calendar_clientId" value="' . esc_attr ( $axip_calendar_clientId ) . '"  />';
		echo '<br/><em>These values are temporary only. It uses an iFrame for booking rather than a local form. This is to cover legacy features not yet implemented in our API\'s</em>';
		
		echo '<h4>IMPORTANT NOTES:</h4>';
		
		echo '<ul class="axip-inner">';
		echo '<li><strong>If yes is selected none of the other settings below apply. Settings come from your axcelerate settings.</strong></li>';
		echo '<li>iFrame will <strong>only</strong> points to your <strong>LIVE environment</strong></li>';
		echo '</ul>';
		
		echo '</li>';
		
		echo '<li>';
		echo '<label for="axip_calendar_short_course_color">';
		echo __ ( 'Short Course (w) Color', 'axip' );
		echo '</label> ';
		echo '<input type="text" style="width:20em" id="axip_calendar_short_course_color" name="axip_calendar_short_course_color" value="' . esc_attr ( $axip_calendar_short_course_color ) . '"  />';
		echo '</li>';
		
		echo '<li>';
		echo '<label for="axip_programs_color">';
		echo __ ( 'Programs (p) Color', 'axip' );
		echo '</label> ';
		echo '<input type="text" style="width:20em" id="axip_calendar_programs_color" name="axip_calendar_programs_color" value="' . esc_attr ( $axip_calendar_programs_color ) . '"  />';
		echo '</li>';
		
		echo '<li>';
		echo '<label for="axip_calendar_use_location">';
		echo __ ( 'Use Locations', 'axip' );
		echo '</label> ';
		echo '<input type="radio" id="axip_use_location_1" name="axip_calendar_use_location"  ' . checked ( $axip_calendar_use_location, 1, false ) . ' value="1"  /> Yes <br/>';
		echo '<input type="radio" id="axip_use_location_2" name="axip_calendar_use_location"  ' . checked ( $axip_calendar_use_location, 0, false ) . ' value="0"  /> No <br/>';
		echo '</li>';
		
		echo '<li>';
		echo '<label for="axip_calendar_type">';
		echo __ ( 'Type', 'axip' );
		echo '</label> ';
		echo '<input type="radio" id="axip_calendar_type_1" name="axip_calendar_type"  ' . checked ( $axip_calendar_type, 'a', false ) . ' value="a"  /> Accredited <br/>';
		echo '<input type="radio" id="axip_calendar_type_2" name="axip_calendar_type"  ' . checked ( $axip_calendar_type, 'na', false ) . ' value="na"  /> Non-accredited <br/>';
		echo '<input type="radio" id="axip_calendar_type_3" name="axip_calendar_type"  ' . checked ( $axip_calendar_type, 'all', false ) . ' value="all"  /> All';
		echo '</li>';
		
		echo '<li>';
		echo '<label for="axip_calendar_drilldown_page">';
		echo __ ( 'Results Drilldown page', 'axip' );
		echo '</label> ';
		
		echo ' <select style="width:20em" name="axip_calendar_drilldown_page" id="axip_calendar_drilldown_page">
					<option value="">Choose course details page</option>';
		foreach ( $course_details_pages as $page ) {
			echo '<option value="' . $page ['ID'] . '" ' . selected ( $axip_calendar_drilldown_page, $page ['ID'], false ) . '>' . $page ['title'] . '</option>';
		}
		echo '</select>';
		echo ' <em>The absolute page that users should go to when clicking the course links. It should have a "Course Detail Display" content object.</em>';
		echo '</li>';
		
		echo '</ul>';
		echo '</div>';
	}
	
	/*
	 * Common helper
	 */
	public function _axip_meta_helper($type, $meta_key, $nameKey, $post_id) {
		$contact_field_options = array (
				0 => 'Not displayed',
				1 => 'Displayed but not required',
				2 => 'Displayed and required' 
		);
		$contact_field_usi_options = array (
				0 => 'Not displayed',
				1 => 'Displayed but not required',
				2 => 'Displayed and required',
				3 => 'Displayed Not Required and Disclaimer',
				4 => 'Displayed Required and Disclaimer' 
		);
		
		if ($type == 1) {
			
			$axip_contact_personal = get_post_meta ( $post_id, $meta_key, true );
			
			/* $axip_allow_custom_fields = (!empty($axip_contact_personal['_axip_allow_custom_fields'])?$axip_contact_personal['_axip_allow_custom_fields']:''); */
			$axip_given_name = (! empty ( $axip_contact_personal ['_axip_given_name'] ) ? $axip_contact_personal ['_axip_given_name'] : '2');
			$axip_middle_name = (! empty ( $axip_contact_personal ['_axip_middle_name'] ) ? $axip_contact_personal ['_axip_middle_name'] : '');
			$axip_preferred_name = (! empty ( $axip_contact_personal ['_axip_preferred_name'] ) ? $axip_contact_personal ['_axip_preferred_name'] : '');
			$axip_last_name = (! empty ( $axip_contact_personal ['_axip_last_name'] ) ? $axip_contact_personal ['_axip_last_name'] : '2');
			$axip_email = (! empty ( $axip_contact_personal ['_axip_email'] ) ? $axip_contact_personal ['_axip_email'] : '2');
			$axip_dob = (! empty ( $axip_contact_personal ['_axip_dob'] ) ? $axip_contact_personal ['_axip_dob'] : '');
			
			$axip_usi = (! empty ( $axip_contact_personal ['_axip_usi'] ) ? $axip_contact_personal ['_axip_usi'] : '');
			$axip_city_of_birth = (! empty ( $axip_contact_personal ['_axip_city_of_birth'] ) ? $axip_contact_personal ['_axip_city_of_birth'] : '');
			
			$axip_lui = (! empty ( $axip_contact_personal ['_axip_lui'] ) ? $axip_contact_personal ['_axip_lui'] : '');
			$axip_sex = (! empty ( $axip_contact_personal ['_axip_sex'] ) ? $axip_contact_personal ['_axip_sex'] : '');
			$axip_home_phone = (! empty ( $axip_contact_personal ['_axip_home_phone'] ) ? $axip_contact_personal ['_axip_home_phone'] : '');
			;
			$axip_postal_address = (! empty ( $axip_contact_personal ['_axip_postal_address'] ) ? $axip_contact_personal ['_axip_postal_address'] : '');
			$axip_street_address = (! empty ( $axip_contact_personal ['_axip_street_address'] ) ? $axip_contact_personal ['_axip_street_address'] : '');
			$axip_organisation = (! empty ( $axip_contact_personal ['_axip_organisation'] ) ? $axip_contact_personal ['_axip_organisation'] : '');
			$axip_position = (! empty ( $axip_contact_personal ['_axip_position'] ) ? $axip_contact_personal ['_axip_position'] : '');
			$axip_work_phone = (! empty ( $axip_contact_personal ['_axip_work_phone'] ) ? $axip_contact_personal ['_axip_work_phone'] : '');
			$axip_mobile_phone = (! empty ( $axip_contact_personal ['_axip_mobile_phone'] ) ? $axip_contact_personal ['_axip_mobile_phone'] : '');
			$axip_fax = (! empty ( $axip_contact_personal ['_axip_fax'] ) ? $axip_contact_personal ['_axip_fax'] : '');
			
			$axip_industry_of_employment = (! empty ( $axip_contact_personal ['_axip_industry_of_employment'] ) ? $axip_contact_personal ['_axip_industry_of_employment	'] : '');
			$axip_occupation_identifier = (! empty ( $axip_contact_personal ['_axip_occupation_identifier'] ) ? $axip_contact_personal ['_axip_occupation_identifier'] : '');
			
			echo '<h4>Contact and Personal Details (Page 1)</h4>';
			echo '<ul>';
			
			echo '<li>';
			echo '<label for="axip_given_name_' . $nameKey . '">';
			echo __ ( 'Given Name', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_given_name_' . $nameKey . '" id="axip_given_name_' . $nameKey . '" disabled="disabled">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_given_name == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_middle_name_' . $nameKey . '">';
			echo __ ( 'Middle Name', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_middle_name_' . $nameKey . '" id="axip_middle_name_' . $nameKey . '">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_middle_name == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_preferred_name_' . $nameKey . '">';
			echo __ ( 'Preferred Name', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_preferred_name_' . $nameKey . '" id="axip_preferred_name_' . $nameKey . '">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_preferred_name == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_last_name_' . $nameKey . '">';
			echo __ ( 'Last Name', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_last_name_' . $nameKey . '" id="axip_last_name_' . $nameKey . '"  disabled="disabled">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_last_name == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_email_' . $nameKey . '">';
			echo __ ( 'Email', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_email_' . $nameKey . '" id="axip_email_' . $nameKey . '"  disabled="disabled">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_email == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_dob_' . $nameKey . '">';
			echo __ ( 'Date of Birth', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_dob_' . $nameKey . '" id="axip_dob_' . $nameKey . '">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_dob == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_usi_' . $nameKey . '">';
			echo __ ( 'USI', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_usi_' . $nameKey . '" id="axip_usi_' . $nameKey . '">';
			foreach ( $contact_field_usi_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_usi == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo ' <em>Disclaimer options will add an additional block of text below the USI field explaining that they are granting permission to the RTO to Verify/Create a USI.</em>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_city_of_birth_' . $nameKey . '">';
			echo __ ( 'City of Birth', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_city_of_birth_' . $nameKey . '" id="axip_city_of_birth_' . $nameKey . '">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_city_of_birth == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			// NO LUI field for enrolment request
			if ($nameKey != 3) {
				
				echo '<li>';
				echo '<label for="axip_lui_' . $nameKey . '">';
				echo __ ( 'LUI', 'axip' );
				echo '</label> ';
				echo '<select style="width:20em" name="axip_lui_' . $nameKey . '" id="axip_dob_' . $nameKey . '">';
				foreach ( $contact_field_options as $key => $value ) {
					echo '<option value="' . $key . '" ' . ($axip_lui == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
				}
				echo '</select>';
				echo '</li>';
			}
			
			echo '<li>';
			echo '<label for="axip_sex_' . $nameKey . '">';
			echo __ ( 'Sex', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_sex_' . $nameKey . '" id="axip_dob_' . $nameKey . '">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_sex == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_home_phone_' . $nameKey . '">';
			echo __ ( 'Home Phone', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_home_phone_' . $nameKey . '" id="axip_home_phone_' . $nameKey . '">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_home_phone == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_postal_address_' . $nameKey . '">';
			echo __ ( 'Postal Address', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_postal_address_' . $nameKey . '" id="axip_postal_address_' . $nameKey . '">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_postal_address == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_street_address_' . $nameKey . '">';
			echo __ ( 'Street Address', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_street_address_' . $nameKey . '" id="axip_street_address_' . $nameKey . '">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_street_address == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_organisation_' . $nameKey . '">';
			echo __ ( 'Organisation', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_organisation_' . $nameKey . '" id="axip_organisation_' . $nameKey . '">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_organisation == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_industry_of_employment_' . $nameKey . '">';
			echo __ ( 'Industry', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_industry_of_employment_' . $nameKey . '" id="axip_industry_of_employment_' . $nameKey . '">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_industry_of_employment == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_occupation_identifier_' . $nameKey . '">';
			echo __ ( 'Occupation Identifier', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_occupation_identifier_' . $nameKey . '" id="axip_occupation_identifier_' . $nameKey . '">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_occupation_identifier == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_position_' . $nameKey . '">';
			echo __ ( 'Position', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_position_' . $nameKey . '" id="axip_position_' . $nameKey . '">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_position == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_work_phone_' . $nameKey . '">';
			echo __ ( 'Work Phone', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_work_phone_' . $nameKey . '" id="axip_work_phone_' . $nameKey . '">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_work_phone == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_mobile_phone_' . $nameKey . '">';
			echo __ ( 'Mobile Phone', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_mobile_phone_' . $nameKey . '" id="axip_mobile_phone_' . $nameKey . '">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_mobile_phone == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_fax_' . $nameKey . '">';
			echo __ ( 'Fax', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_fax_' . $nameKey . '" id="axip_fax_' . $nameKey . '">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_fax == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			echo '</ul>';
		} 

		else if ($type == 2) {
			
			$axip_avetmiss_additional = get_post_meta ( $post_id, $meta_key, true );
			
			$axip_emergency_contact = (! empty ( $axip_avetmiss_additional ['_axip_emergency_contact'] ) ? $axip_avetmiss_additional ['_axip_emergency_contact'] : '');
			$axip_citizenship_status = (! empty ( $axip_avetmiss_additional ['_axip_citizenship_status'] ) ? $axip_avetmiss_additional ['_axip_citizenship_status'] : '');
			$axip_employment = (! empty ( $axip_avetmiss_additional ['_axip_employment'] ) ? $axip_avetmiss_additional ['_axip_employment'] : '');
			$axip_language = (! empty ( $axip_avetmiss_additional ['_axip_language'] ) ? $axip_avetmiss_additional ['_axip_language'] : '');
			$axip_education_status = (! empty ( $axip_avetmiss_additional ['_axip_education_status'] ) ? $axip_avetmiss_additional ['_axip_education_status'] : '');
			$axip_disability_status = (! empty ( $axip_avetmiss_additional ['_axip_disability_status'] ) ? $axip_avetmiss_additional ['_axip_disability_status'] : '');
			$axip_aboriginal_tsi_status = (! empty ( $axip_avetmiss_additional ['_axip_aboriginal_tsi_status'] ) ? $axip_avetmiss_additional ['_axip_aboriginal_tsi_status'] : '');
			$axip_contact_source = (! empty ( $axip_avetmiss_additional ['_axip_contact_source'] ) ? $axip_avetmiss_additional ['_axip_contact_source'] : '');
			$axip_study_reason_nat = (! empty ( $axip_avetmiss_additional ['_axip_study_reason_nat'] ) ? $axip_avetmiss_additional ['_axip_study_reason_nat'] : '');
			$axip_study_reason_wa = (! empty ( $axip_avetmiss_additional ['_axip_study_reason_wa'] ) ? $axip_avetmiss_additional ['_axip_study_reason_wa'] : '');
			
			echo '<h4>AVETMISS and additional Details (Page 2)</h4>';
			echo '<ul>';
			
			echo '<li>';
			echo '<label for="axip_study_reason_nat_' . $nameKey . '">';
			echo __ ( 'Study Reason National', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_study_reason_nat_' . $nameKey . '" id="axip_study_reason_nat_' . $nameKey . '">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_study_reason_nat == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo ' <em>Displays National study reasons - should not be used with Study Reason WA. Only for Enrolment Form.</em>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_study_reason_wa_' . $nameKey . '">';
			echo __ ( 'Study Reason WA', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_study_reason_wa_' . $nameKey . '" id="axip_study_reason_wa_' . $nameKey . '">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_study_reason_wa == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo ' <em>Displays WA Study Reasons - should not be used with Study Reason NAT. Only for Enrolment Form.</em>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_emergency_contact_' . $nameKey . '">';
			echo __ ( 'Emergency Contact', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_emergency_contact_' . $nameKey . '" id="axip_emergency_contact_' . $nameKey . '">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_emergency_contact == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_citizenship_status_' . $nameKey . '">';
			echo __ ( 'Citizenship Status', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_citizenship_status_' . $nameKey . '" id="axip_citizenship_status_' . $nameKey . '">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_citizenship_status == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_employment_' . $nameKey . '">';
			echo __ ( 'Employment', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_employment_' . $nameKey . '" id="axip_employment_' . $nameKey . '">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_employment == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_language_' . $nameKey . '">';
			echo __ ( 'Language', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_language_' . $nameKey . '" id="axip_language_' . $nameKey . '">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_language == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_education_status_' . $nameKey . '">';
			echo __ ( 'Education Status', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_education_status_' . $nameKey . '" id="axip_education_status_' . $nameKey . '">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_education_status == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_disability_status_' . $nameKey . '">';
			echo __ ( 'Disability Status', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_disability_status_' . $nameKey . '" id="axip_disability_status_' . $nameKey . '">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_disability_status == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_aboriginal_tsi_status_' . $nameKey . '">';
			echo __ ( 'Aboriginal/TSI status', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_aboriginal_tsi_status_' . $nameKey . '" id="axip_aboriginal_tsi_status_' . $nameKey . '">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_aboriginal_tsi_status == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			echo '<li>';
			echo '<label for="axip_contact_source_' . $nameKey . '">';
			echo __ ( 'Contact Source', 'axip' );
			echo '</label> ';
			echo '<select style="width:20em" name="axip_contact_source_' . $nameKey . '" id="axip_contact_source_' . $nameKey . '">';
			foreach ( $contact_field_options as $key => $value ) {
				echo '<option value="' . $key . '" ' . ($axip_contact_source == $key ? 'selected="selected"' : '') . ' >' . $value . '</option>';
			}
			echo '</select>';
			echo '</li>';
			
			echo '</ul>';
		}
	}
}

$Axip_Course_Post_Type = new Axip_Course_Post_Type ();
