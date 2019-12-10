<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */
class AX_Settings_Tab_Course_List {
	const course_list_setting_key = 'axip_course_list_settings';
	function __construct() {
	}
	function register_settings() {
		register_setting ( self::course_list_setting_key, 'ax_course_list_layout' );
		register_setting ( self::course_list_setting_key, 'ax_course_rich_cards' );
		register_setting ( self::course_list_setting_key, 'ax_course_list_default_style' );
		
		register_setting ( self::course_list_setting_key, 'ax_course_list_images_description' );
		
		register_setting ( self::course_list_setting_key, 'ax_course_list_tile_color_1' );
		register_setting ( self::course_list_setting_key, 'ax_course_list_tile_color_2' );
		register_setting ( self::course_list_setting_key, 'ax_course_list_tile_columns' );
		
		register_setting ( self::course_list_setting_key, 'ax_course_list_details_link' );
		register_setting ( self::course_list_setting_key, 'ax_course_terminology_w' );
		register_setting ( self::course_list_setting_key, 'ax_course_terminology_p' );
		register_setting ( self::course_list_setting_key, 'ax_course_terminology_el' );
		

		register_setting ( self::course_list_setting_key, 'ax_course_list_details_pageid_w' );
		register_setting ( self::course_list_setting_key, 'ax_course_list_details_pageid_p' );

		add_settings_section ( 'section_course', __ ( 'Course List (Shotcode) Settings', 'axip' ), array (
				&$this,
				'section_course_list_desc' 
		), self::course_list_setting_key );
		
		add_settings_field ( 'ax_course_list_layout', __ ( 'Course List Layout:', 'axip' ), array (
				&$this,
				'field_course_list_layout' 
		), self::course_list_setting_key, 'section_course' );
		add_settings_field ( 'ax_course_list_default_style', __ ( 'Course List Default Style:', 'axip' ), array (
				&$this,
				'field_course_list_default_style' 
		), self::course_list_setting_key, 'section_course' );
		
		add_settings_field ( 'ax_course_rich_cards', __ ( 'Add Google Rich Cards:', 'axip' ), array (
				&$this,
				'field_ax_course_rich_cards'
		), self::course_list_setting_key, 'section_course' );
		
		
		add_settings_field ( 'ax_course_list_images_description', __ ( 'Show images in the description:', 'axip' ), array (
				&$this,
				'field_course_list_images_description' 
		), self::course_list_setting_key, 'section_course' );
		
		add_settings_field ( 'ax_course_list_tile_color_1', __ ( 'Course List Tile Color 1:', 'axip' ), array (
				&$this,
				'field_course_list_tile_color_1' 
		), self::course_list_setting_key, 'section_course' );
		
		add_settings_field ( 'ax_course_list_tile_color_2', __ ( 'Course List Tile Color 2:', 'axip' ), array (
				&$this,
				'field_course_list_tile_color_2' 
		), self::course_list_setting_key, 'section_course' );
		
		add_settings_field ( 'ax_course_list_tile_columns', __ ( 'Tile Columns:', 'axip' ), array (
				&$this,
				'field_course_list_tile_columns' 
		), self::course_list_setting_key, 'section_course' );
		
		add_settings_field ( 'ax_course_list_details_link', __ ( 'Course List Details Link:', 'axip' ), array (
				&$this,
				'field_course_list_details_link' 
		), self::course_list_setting_key, 'section_course' );
		add_settings_field ( 'ax_course_terminology_el', __ ( 'Terminology ELearning:', 'axip' ), array (
				&$this,
				'field_course_terminology_el' 
		), self::course_list_setting_key, 'section_course' );
		add_settings_field ( 'ax_course_terminology_w', __ ( 'Terminology Workshop:', 'axip' ), array (
				&$this,
				'field_course_terminology_w' 
		), self::course_list_setting_key, 'section_course' );
		add_settings_field ( 'ax_course_terminology_p', __ ( 'Terminology Program:', 'axip' ), array (
				&$this,
				'field_course_terminology_p' 
		), self::course_list_setting_key, 'section_course' );
	}
	function field_course_list_default_style() {
		$style = get_option ( 'ax_course_list_default_style' );
		if (empty ( $style )) {
			$style = 'ax-standard';
			update_option ( 'ax_course_list_default_style', $style );
		}
		$options = array (
				"ax-no-style" => "No CSS Styling",
				"ax-tile" => "Standard Tile Format",
				"ax-list" => "Standard List Format",
				"ax-list-image" => "List with Left Image" 
		);
		echo '<select name="ax_course_list_default_style">';
		foreach ( $options as $key => $value ) {
			if ($key == $style) {
				echo '<option value="' . $key . '" selected="selected">' . $value . '</option>';
			} else {
				echo '<option value="' . $key . '">' . $value . '</option>';
			}
		}
		echo '</select>';
	}
	function field_ax_course_rich_cards() {
		$optVal = get_option ( 'ax_course_rich_cards' );
		if (empty ( $optVal )) {
			$optVal = 0;
			update_option ( 'ax_course_rich_cards', $optVal );
		}
		$options = array (
				0 => "No",
				1 => "Yes",
		);
		echo '<select name="ax_course_rich_cards">';
		foreach ( $options as $key => $value ) {
			if ($key == $optVal) {
				echo '<option value="' . $key . '" selected="selected">' . $value . '</option>';
			} else {
				echo '<option value="' . $key . '">' . $value . '</option>';
			}
		}
		echo '</select>';
	}
	
	function field_course_list_images_description() {
		$style = get_option ( 'ax_course_list_images_description' );
		if (empty ( $style )) {
			$style = 'ax-show-images';
			update_option ( 'ax_course_list_images_description', $style );
		}
		$options = array (
				"ax-show-images" => "Show Images",
				"ax-hide-images" => "Hide images in the description block." 
		);
		echo '<select name="ax_course_list_images_description">';
		foreach ( $options as $key => $value ) {
			if ($key == $style) {
				echo '<option value="' . $key . '" selected="selected">' . $value . '</option>';
			} else {
				echo '<option value="' . $key . '">' . $value . '</option>';
			}
		}
		echo '</select>';
		echo '<p><em>For use with the ax_course_image shortcode, will hide images in the description body, but not those set through the shortcode. May not work if the ax-course-list-description class has been changed.</em></p>';
	}
	function field_course_list_tile_color_1() {
		wp_enqueue_style ( 'wp-color-picker' );
		wp_enqueue_script ( 'ax-setting-helper', plugins_url ( '/js/ax_setting_helper.js', AXIP_PLUGIN_NAME ), array (
				'jquery',
				'wp-color-picker' 
		), '', true );
		$color1 = get_option ( 'ax_course_list_tile_color_1' );
		
		if (empty ( $color1 )) {
			$color1 = '';
		}
		echo '<input name="ax_course_list_tile_color_1" type="text" class="color-picker" value="' . $color1 . '">';
	}
	function field_course_list_tile_color_2() {
		wp_enqueue_style ( 'wp-color-picker' );
		wp_enqueue_script ( 'ax-setting-helper', plugins_url ( '/js/ax_setting_helper.js', AXIP_PLUGIN_NAME ), array (
				'jquery',
				'wp-color-picker' 
		), '', true );
		
		$color2 = get_option ( 'ax_course_list_tile_color_2' );
		if (empty ( $color2 )) {
			$color2 = '';
		}
		echo '<input name="ax_course_list_tile_color_2" type="text" class="color-picker" value="' . $color2 . '">';
	}
	function field_course_list_tile_columns() {
		$columns = get_option ( 'ax_course_list_tile_columns' );
		if (empty ( $columns )) {
			$columns = '3';
		}
		
		$options = array (
				"1" => "1",
				"2" => "2",
				"3" => "3",
				"4" => "4" 
		);
		echo '<select name="ax_course_list_tile_columns">';
		foreach ( $options as $key => $value ) {
			if ($key == $columns) {
				echo '<option value="' . $key . '" selected="selected">' . $value . '</option>';
			} else {
				echo '<option value="' . $key . '">' . $value . '</option>';
			}
		}
		echo '</select>';
	}

	function field_course_list_details_link() {
		$selected1 = 0;
		$page1 = get_option('ax_course_list_details_pageid_w');
		if(!empty($page1)){
			$selected1 = $page1;
		}
		
		$dropDownSettings = array (
				'depth' => 0,
				'child_of' => 0,
				'selected' => $selected1,
				'echo' => 1,
				'name' => 'ax_course_list_details_pageid_w',
				'show_option_none' => __( '— Select —' ),
				'show_option_no_change' => null,
				'option_none_value' => null 
		);
		echo '<div><label style="display:block">Workshop</label>';
		wp_dropdown_pages($dropDownSettings);

		$selected2 = 0;
		$page2 = get_option('ax_course_list_details_pageid_p');
		if(!empty($page2)){
			$selected2 = $page2;
		}

		echo '</div>';
		$dropDownSettings = array (
			'depth' => 0,
			'child_of' => 0,
			'selected' => $selected2,
			'echo' => 1,
			'name' => 'ax_course_list_details_pageid_p',
			'show_option_none' => __( '— Select —' ),
			'show_option_no_change' => null,
			'option_none_value' => null 
		);
		echo '<div><label style="display:block">Qualification</label>';
		wp_dropdown_pages($dropDownSettings);
		echo '</div>';


		echo '<div><em style="display:block; margin-top: 20px;">Legacy Setting - the above will take precedence.</em>';
		$details_link = get_option ( 'ax_course_list_details_link' );
		if (empty ( $details_link )) {
			$details_link = '/course-details/';
			update_option ( 'ax_course_list_details_link', $details_link );
		}
		echo '<input type="text" name="ax_course_list_details_link" value="'.$details_link.'" /></div>';

	
	}



/*
	function field_course_list_details_link() {
	
*/
	function field_course_terminology_w() {
		$terminology = get_option ( 'ax_course_terminology_w' );
		if (empty ( $terminology )) {
			$terminology = 'Workshop';
			update_option ( 'ax_course_terminology_w', $terminology );
		}
		?>
<input type="text" name="ax_course_terminology_w"
	value="<?php echo $terminology ?>" />
<?php
	}
	function field_course_terminology_p() {
		$terminology = get_option ( 'ax_course_terminology_p' );
		if (empty ( $terminology )) {
			$terminology = 'Program';
			update_option ( 'ax_course_terminology_p', $terminology );
		}
		?>
<input type="text" name="ax_course_terminology_p"
	value="<?php echo $terminology ?>" />
<?php
	}
	function field_course_terminology_el() {
		$terminology = get_option ( 'ax_course_terminology_el' );
		if (empty ( $terminology )) {
			$terminology = 'ELearning';
			update_option ( 'ax_course_terminology_el', $terminology );
		}
		?>
<input type="text" name="ax_course_terminology_el"
	value="<?php echo $terminology ?>" />
<?php
	}
	function field_course_list_layout() {
		$content = get_option ( 'ax_course_list_layout' );
		
		if (empty ( $content )) {
			
			$template = '<div class="ax-course-list-record ax-standard">
				<div class="ax-course-thumb">[ax_course_image]</div>
				<div class="ax-course-list-record-body">
					<h2 class="ax-course-name">[ax_course_name][ax_course_stream]</h2>
					<h3 class="ax-course-code">[ax_course_code]</h3>
					<div class="ax-course-list-description">[ax_course_short_description]</div>
					<div class="ax-course-list-link">[ax_details_page_link]</div>
				</div>
			</div>';
			
			$content = $template;
			update_option ( 'ax_course_list_layout', $content );
		}
		$editor_id = 'ax_course_list_layout';
		wp_editor ( $content, $editor_id );
	}
	function section_course_list_desc() {
		echo 'This section allows customisation of the course list shortcode template.';
	}
}
