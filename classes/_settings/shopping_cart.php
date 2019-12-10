<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */
class AX_Settings_Tab_Shopping_Cart {
	private $shopping_cart_settings_key = 'axip_shopping_cart_settings';
	const shopping_cart_settings_key = 'axip_shopping_cart_settings';
	function __construct() {
		
		
	}
	function register_settings() {
		add_settings_section ( 'section_shop_cart', __ ( 'Shopping Cart', 'axip' ), array (
				&$this,
				'section_shop_cart_desc'
		), self::shopping_cart_settings_key);
		
		register_setting ( self::shopping_cart_settings_key, 'ax_shopping_cart' );
		
		add_settings_field ( 'ax_shopping_cart', __ ( 'Shopping Cart:', 'axip' ), array (
				&$this,
				'field_ax_shopping_cart'
		), self::shopping_cart_settings_key, 'section_shop_cart' );
		
		register_setting ( self::shopping_cart_settings_key, 'ax_shopping_cart_url' );
		add_settings_field ( 'ax_shopping_cart_url', __ ( 'Shopping Cart Page:', 'axip' ), array (
				&$this,
				'field_ax_shopping_cart_url'
		), self::shopping_cart_settings_key, 'section_shop_cart');
	
		register_setting ( self::shopping_cart_settings_key, 'ax_shopping_cart_menus' );
		add_settings_field ( 'ax_shopping_cart_menus', __ ( 'Add Cart to Menus:', 'axip' ), array (
				&$this,
				'field_ax_shopping_cart_menus'
		), self::shopping_cart_settings_key, 'section_shop_cart');
		
		register_setting ( self::shopping_cart_settings_key, 'ax_shopping_cart_template' );
		add_settings_field ( 'ax_shopping_cart_template', __ ( 'Template For Cart List:', 'axip' ), array (
				&$this,
				'field_ax_shopping_cart_template'
		), self::shopping_cart_settings_key, 'section_shop_cart');
		
		
		
		
	}
	
	function field_ax_shopping_cart() {
		$optVal = get_option ( 'ax_shopping_cart' );

		if (empty ( $optVal )) {
			$optVal = 'disabled';
			update_option ( 'ax_shopping_cart', $optVal );
		}
		$options = array (
				"disabled"=>"Disabled",
				"enabled"=>"Enabled",
		);
		echo '<select name="ax_shopping_cart">';
		foreach ( $options as $key => $value ) {
			if ($key == $optVal) {
				echo '<option value="' . $key . '" selected="selected">' . $value . '</option>';
			} else {
				echo '<option value="' . $key . '">' . $value . '</option>';
			}
		}
		echo '</select>';
	}
	function field_ax_shopping_cart_url($args) {
		
		$selected = 0;
		$page = get_option('ax_shopping_cart_url');
		if(!empty($page)){
			$selected = $page;
		}
		
		$dropDownSettings = array (
				'depth' => 0,
				'child_of' => 0,
				'selected' => $selected,
				'echo' => 1,
				'name' => 'ax_shopping_cart_url',
				'show_option_none' => __( '— Select —' ),
				'show_option_no_change' => null,
				'option_none_value' => null 
		);
		wp_dropdown_pages($dropDownSettings);
	}
	function field_ax_shopping_cart_menus($args) {
		$navMenus = get_registered_nav_menus();

		$selected = get_option('ax_shopping_cart_menus');

		if(empty($selected)){
			$selected = array();
		}
		
		echo '<select name="ax_shopping_cart_menus[]" multiple="multiple">';
		foreach ( $navMenus as $key => $value ) {
			if (in_array($key, $selected)) {
				echo '<option value="' . $key . '" selected="selected">' . $value . '</option>';
			} else {
				echo '<option value="' . $key . '">' . $value . '</option>';
			}
		}
		echo '</select>';
		
	}
	
	function field_ax_shopping_cart_template() {
		$content = get_option ( 'ax_shopping_cart_template' );
		if (empty ( $content )) {
			$template = '<table>
			<thead>
			<tr>
			<td>Name</td>
			<td>Date</td>
			<td>Location</td>
			<td style="text-align:right;" >Cost</td>
			<td></td>
			</tr>
			</thead>
			<tbody>
			<tr>
			<td>[ax_course_name]</td>
			<td>[ax_course_instance_datedescriptor]</td>
			<td>[ax_course_instance_location]</td>
			<td style="text-align:right;" >$[ax_course_instance_cost]</td>
			<td>[ax_add_to_cart]</td>
			</tr>
			</tbody>
			<tfoot>
			<tr>
			<td></td>
			<td></td>
			<td></td>
			<td style="text-align:right;" >[ax_shopping_cart_cost]</td>
			<td></td>
			</tr>
			</tfoot>
			</table>';
	
			$content = $template;
			update_option ( 'ax_shopping_cart_template', $content );
		}
		$editor_id = 'ax_shopping_cart_template';
		wp_editor ( $content, $editor_id );
	}
	
	function save_nav_menus($args){

		return($args);
	}
	
	function section_shop_cart_desc() {
		echo 'This section allows for the configuration of the shopping cart functionality.';
		echo '<p><span style="font-weight:600; font-size:1.1em;">The page created to host the Shopping cart should have one of the following:</span><br /></p>';
		echo '<ul style="padding-left:1.5em; list-style:circle;">';
		echo '<li>An Enrolment Widget with the "shopping_cart" attribute enabled.</li>';
		echo '<li>A Shopping Cart List Shortcode and a separate "Checkout" button/link to another page with an embedded Enrolment Widget with the "shopping_cart" attribute enabled.</li>';
		echo '</ul>';
	}
	
	
	
}
