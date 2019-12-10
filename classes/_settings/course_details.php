<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */
class AX_Settings_Tab_Course_Details {

	const course_detail_setting_key = 'axip_course_detail_settings';
	function __construct() {
	}
	function register_settings() {
		register_setting ( self::course_detail_setting_key, 'ax_course_detail_layout_w' );
		register_setting ( self::course_detail_setting_key, 'ax_course_detail_layout_p' );
		register_setting ( self::course_detail_setting_key, 'ax_course_detail_default_style' );
		
		add_settings_section ( 'section_course_detail', __ ( 'Course Details (Shortcode) Settings', 'axip' ), array (
				&$this,
				'section_course_detail_desc'
		), self::course_detail_setting_key );
		
		add_settings_field ( 'ax_course_detail_default_style', __ ( 'Course Detail Style:', 'axip' ), array (
				&$this,
				'field_course_detail_default_style'
		), self::course_detail_setting_key, 'section_course_detail' );
		add_settings_field ( 'ax_course_detail_layout_w', __ ( 'Course Detail Workshop Layout:', 'axip' ), array (
				&$this,
				'field_course_detail_layout_w'
		), self::course_detail_setting_key, 'section_course_detail' );
		add_settings_field ( 'ax_course_detail_layout_p', __ ( 'Course Detail Program Layout:', 'axip' ), array (
				&$this,
				'field_course_detail_layout_p'
		), self::course_detail_setting_key, 'section_course_detail' );
		
	}
	function field_course_detail_layout_w() {
		$content = get_option ( 'ax_course_detail_layout_w' );
		$terminology = get_option ( 'ax_course_terminology_w', 'Workshop' );
		$template = "";
		if (empty ( $content )) {
	
			$template = $template . '<h2 class="ax-course-name">[ax_course_name] [ax_course_stream]</h2>';
			$template = $template . '<div class="ax-course-code">[ax_course_code]</div>';

			$template = $template . '<div class="ax-cd-image">[ax_course_element_image1]</div>';

			$template = $template . '<div class="ax-cd-description">[ax_course_short_description]</div>';
		
			$template = $template . '<div class="ax-cd-introduction"><h2>Introduction:</h2>[ax_course_element_introduction]</div>';
			$template = $template . '<div class="ax-cd-target"><h2>Target Audience:</h2>[ax_course_element_target_audience]</div>';
			$template = $template . '<div class="ax-cd-image">[ax_course_element_image2]</div>';
			$template = $template . '<div class="ax-cd-learning-outcomes"><h2>Learning Outcomes:</h2>[ax_course_element_learning_outcomes]</div>';
			$template = $template . '<div class="ax-cd-learning-methods"><h2>Learning Methods:</h2>[ax_course_element_learning_methods]</div>';
				
			$template = $template . '<div class="ax-cd-program-benefits"><h2>Program Benefits:</h2>[ax_course_element_program_benefits]</div>';
			$template = $template . '<div class="ax-cd-content"><h2>Content:</h2>[ax_course_element_content]</div>';

			$template = $template .'[ax_course_button_link button_text=Enquire link_mode=url  link_url=/course-enquiry/ class_to_add=enquiry%20button]<hr />';
			
			$template = $template.'<h2>Upcoming [ax_course_type]s</h2>[ax_course_instance_list show_full_instances=1 style=ax-table]';

			$content = $template;
			update_option ( 'ax_course_detail_layout_w', $content );
		}
		$editor_id = 'ax_course_detail_layout_w';
		wp_editor ( $content, $editor_id );
	}
	function field_course_detail_layout_p() {
		$terminology = get_option ( 'ax_course_terminology_p', 'Classe' );
		$content = get_option ( 'ax_course_detail_layout_p' );
		$template = "";
		if (empty ( $content )) {
	
			$template = $template . '<h2 class="ax-course-name">[ax_course_name] [ax_course_stream]</h2>';
			$template = $template . '<div class="ax-course-code">[ax_course_code]</div>';

			$template = $template . '<div class="ax-cd-description">[ax_course_short_description]</div>';
			$template = $template . '<div class="ax-cd-outline">[ax_course_outline]</div>';

			$template = $template .'[ax_course_button_link button_text=Enquire link_mode=url link_url=/course-enquiry/ class_to_add=enquiry%20button]<hr />';

			$template = $template.'<h2>Upcoming [ax_course_type]s</h2>[ax_course_instance_list show_full_instances=1 style=ax-table]';
				
			$content = $template;
			update_option ( 'ax_course_detail_layout_p', $content );
		}
		$editor_id = 'ax_course_detail_layout_p';
		wp_editor ( $content, $editor_id );
	}



	function field_course_detail_default_style() {
		$style = get_option ( 'ax_course_detail_default_style' );
		if (empty ( $style )) {
			$style = 'ax-standard';
			update_option ( 'ax_course_detail_default_style', $style );
		}
		$options = array (
				"ax-no-style"=>"No CSS Styling",
				"ax-tile" => "Standard Tile Format",
				"ax-list" => "Standard List Format"
		);
		echo '<select name="ax_course_detail_default_style">';
		foreach ( $options as $key => $value ) {
			if ($key == $style) {
				echo '<option value="' . $key . '" selected="selected">' . $value . '</option>';
			} else {
				echo '<option value="' . $key . '">' . $value . '</option>';
			}
		}
		echo '</select>';
	}
	
	function section_course_detail_desc() {
		echo 'This section allows customisation of the default course detail shortcode template.';
		echo '<p><span style="font-weight:600; font-size:1.1em;">This template will not have an Instance/Enrolment Widget by default.</span><br />';
		echo 'Add an Enrolment Widget, Enquiry Button or Instance List to the template to ensure you can enquire/enrol from a details page.</p>';
	}

}
