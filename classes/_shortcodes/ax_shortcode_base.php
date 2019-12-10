<?php

/*--------------------------------------------*
 * Securing the plugin
 *--------------------------------------------*/

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );


/*--------------------------------------------*/

if(!class_exists('AxcelerateShortcode')) {

class AxcelerateShortcode {
	
	function __construct() {

		## Register shortcodes
		add_shortcode( 'axcelerate_search', array(&$this, 'axcelerate_search_handler' ) );
		add_shortcode( 'axcelerate_enrolment', array(&$this, 'axcelerate_enrolment_handler' ) );
		add_shortcode( 'axcelerate_enquiry', array(&$this, 'axcelerate_enquiry_handler' ) );
		
		
		
		## Register shortcode tinymce buttons
		add_action('init', array(&$this, 'axcelerate_shortcode_button_init' ));

		
		//add_shortcode( 'ax_course_element_outline', array(&$this, 'ax_course_outline_elements_handler' ) );

		/**** See loadShortcodes in axcelerate-plugin for all included shortcodes ****/
		
	}
	
	
	function get_course_pages() {
		
		// Get Course pages				
		$course_pages_ARR = array();				
		$course_pages = get_posts( array('post_type' => 'ax-page','post_status'=>'publish','numberposts' => -1));
	
		if(count($course_pages)) {		
			foreach($course_pages as $course){
				$axip_pagetype  = get_post_meta( $course->ID, '_axip_pagetype', true );
				$course_pages_ARR[$axip_pagetype][] = array('ID'=>$course->ID,'title'=>$course->post_title); 
			}
		}
		
		return $course_pages_ARR;

	}
	
	function axcelerate_shortcode_button_init() {
       
		//Abort early if the user will never see TinyMCE
		if ( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') && get_user_option('rich_editing') == 'true')
		    return;
	  
		//Add a callback to regiser our tinymce plugin   
		add_filter("mce_external_plugins", array(&$this, 'axcelerate_register_tinymce_plugin' )); 
	  
		// Add a callback to add our button to the TinyMCE toolbar
		add_filter('mce_buttons', array(&$this, 'axcelerate_add_tinymce_button' ));
		
		add_filter('in_admin_footer', array($this, 'axcelerate_enquiry_shortcode_dialog' ));
		 
       }
	   
       /**
        * Legacy Shortcode
        * @deprecated 2.8
        **/
	   function axcelerate_enquiry_shortcode_dialog() {
		
		
		$action_method_options = array("GET"=>"GET","POST"=>"POST");
		
		$course_pages_ARR = $this->get_course_pages();
	
		if($course_pages_ARR){
			
			$course_pages = isset($course_pages_ARR[3])?$course_pages_ARR[3]:array();
			$course_list_pages = isset($course_pages_ARR[1])?$course_pages_ARR[1]:array();
			$enrolement_pages = isset($course_pages_ARR[4])?$course_pages_ARR[4]:array();

			$alignment_options = array("LEFT","RIGHT","TOP","BOTTOM");
			?>
		
				<div id="axcelerate_enquiry_shortcode_dialog" style="display: none;">
					<p>The enrol button only works if added on a page with a "Course Detail Display" content object. The enqure button can be on any page. If on a course specific page (such as Detail Display or the Course List) it will set the equiry against that specific course type.</p>
					<table id="axcelerate_enquiry-table" class="form-table">
					<tr>
						<th><label for="axcelerate_enquiry-button_text">Button Text</label></th>
						<td><input type="text" id="axcelerate_enquiry-button_text" name="button_text" value="Enquiry Button" /><br />
						
					</tr>
					<tr>
						<th><label for="axcelerate_enquiry-action_page">Action Page</label></th>
						<td><select name="size" id="axcelerate_enquiry-action_page">
						<?php
						foreach($course_pages as $page){
						?>
							<option value="<?php echo $page['ID']; ?>" ><?php echo $page['title']; ?></option>
						<?php
						}
						?>
	
							
						</select><br />
						<small>The absolute page that has the enrolment form. It should have an "Enrolment Form" or "Enquiry Form" content object.</small></td>
					</tr>
					<tr>
						<th><label for="axcelerate_enquiry-action_method">Action Method</label></th>
						<td><select name="size" id="axcelerate_enquiry-action_method">
						<?php
						foreach($action_method_options as $key=>$value){
						?>
							<option value="<?php echo $key; ?>" ><?php echo $value; ?></option>
						<?php
						}
						?>
							
						</select><br />
						<small>POST or GET form action with POST all is hidden and nice, but with GET you can copy and email the URL.</small></td>
					</tr>
				</table>
				<p class="submit">
					<input type="button" id="axcelerate_enquiry-submit" class="button-primary" value="Insert" name="submit" />
				</p>
				</div>			
				  
				<!-- Enrollment popup -->  
	
				<div id="axcelerate_enrolment_shortcode_dialog" style="display: none;">
					<p>The enrol button only works if added on a page with a "Course Detail Display" content object. The enqure button can be on any page. If on a course specific page (such as Detail Display or the Course List) it will set the equiry against that specific course type.</p>
					<table id="axcelerate_enrolment-table" class="form-table">
					<tr>
						<th><label for="axcelerate_enrolment-button_text">Button Text</label></th>
						<td><input type="text" id="axcelerate_enrolment-button_text" name="button_text" value="Enrol Button" /><br />					
					</tr>
					<tr>
						<th><label for="axcelerate_enrolment-action_page">Action Page</label></th>
						<td><select name="size" id="axcelerate_enrolment-action_page">
						<?php
						foreach($enrolement_pages as $page){
						?>
							<option value="<?php echo $page['ID']; ?>" ><?php echo $page['title']; ?></option>
						<?php
						}
						?>
	
							
						</select><br />
						<small>The absolute page that has the enrolment form. It should have an "Enrolment Form" or "Enquiry Form" content object.</small></td>
					</tr>
					<tr>
						<th><label for="axcelerate_enrolment-action_method">Action Method</label></th>
						<td><select name="size" id="axcelerate_enrolment-action_method">
						<?php
						foreach($action_method_options as $key=>$value){
						?>
							<option value="<?php echo $key; ?>" ><?php echo $value; ?></option>
						<?php
						}
						?>
							
						</select><br />
						<small>POST or GET form action with POST all is hidden and nice, but with GET you can copy and email the URL.</small></td>
					</tr>
				</table>
				<p class="submit">
					<input type="button" id="axcelerate_enrolment-submit" class="button-primary" value="Insert" name="submit" />
				</p>
				</div>
				  
				<!-- Axcelerate search popup -->  
	
				<div id="axcelerate_search_shortcode_dialog" style="display: none;">
					
					<?php print_r($course_pages_ARR); ?>
					<table id="axcelerate_search-table" class="form-table">
					<tr>
						<th><label for="axcelerate_search-alignment">Alignment</label></th>
						<td><select name="size" id="axcelerate_search-alignment">
						<?php
						foreach($alignment_options as $alignment){
						?>
							<option value="<?php echo $alignment; ?>" ><?php echo $alignment; ?></option>
						<?php
						}
						?>
	
						</select>
						</td>
					</tr>
					<tr>
						<th><label for="axcelerate_search-title">Heading</label></th>
						<td><input type="text" id="axcelerate_search-title" name="title" value="search" /><br />
						
					</tr>
	
					<tr>
						<th><label for="axcelerate_search-button_text">Button Text</label></th>
						<td><input type="text" id="axcelerate_search-button_text" name="button_text" value="search" /><br />
						<small>The text for the search button. If left blank, the button will not display. Users can always hit ENTER from the textbox to search.</small>
						
					</tr>
					<tr>
						<th><label for="axcelerate_search-action_page">Action Page</label></th>
						<td><select name="size" id="axcelerate_search-action_page">
						<?php
						foreach($course_list_pages as $page){
						?>
							<option value="<?php echo $page['ID']; ?>" ><?php echo $page['title']; ?></option>
						<?php
						}
						?>
						</select><br />
						<small>The absolute page that will list the search results. It should have a "Course Display" content object.</small></td>
					</tr>
					
				</table>
				<p class="submit">
					<input type="button" id="axcelerate_search-submit" class="button-primary" value="Insert" name="submit" />
				</p>
				</div>
				
			  <?php
		}
		
		
	   }

	//This callback registers our plug-in
	function axcelerate_register_tinymce_plugin($plugin_array) {
		$VERSION = constant('AXIP_PLUGIN_VERSION');
		if($VERSION === null){
			$VERSION = time();
		}
	    $plugin_array['axcelerate_enquiry'] = AXIP_PLUGIN_URL.'/js/axcelerate_tinymce.js?v='.$VERSION;
	    
	    return $plugin_array;
	}

	//This callback adds our button to the toolbar
	function axcelerate_add_tinymce_button($buttons) {
		
		    //Add the button ID to the $button array
	    array_push( $buttons, 'axcelerate_legacy_shortcodes','axcelerate_utility_shortcodes','ax_course_list_shortcodes', 'ax_course_detail_shortcodes', 'ax_course_instance_shortcodes');

	    return $buttons;
	}
	
	
	/**** NEW SHORTCODES ****/
	public function ax_decode_custom_css($custom_css, $atts, $base){
		if(!empty($custom_css)){
			if(class_exists('WPBakeryShortCodesContainer')){
				$css_class = apply_filters( VC_SHORTCODE_CUSTOM_CSS_FILTER_TAG, vc_shortcode_custom_css_class( $custom_css, ' ' ), $base, $atts );
				return $css_class;
			}
		}
		return '';
	}
	
	
	/*
	 * if(!empty($wrap_tag)){
			$html = '<' . $wrap_tag . ' class="'.$class_to_add.'">'.$html . '</' . $wrap_tag . '>';
		}
		
	 */
	
	
	
	
	

	
	
	
	/**** LEGACY SHORTCODES ****/
	
	/**
	 * Legacy Shortcode
	 * @deprecated 2.8
	**/
	public function  axcelerate_enquiry_handler($atts) {

		extract( shortcode_atts( array(
				'button_text' => 'Enquire Now',
				'action_page' => '',
				'action_method' => 'POST'		
		), $atts ) );
		

		$courseType      = sanitize_text_field( $_REQUEST['ctype'] );
		$ID              = sanitize_text_field( $_REQUEST['cid'] );		
		
		if(empty($courseType) || empty($ID)){
    
			$courseType      = sanitize_text_field( $_REQUEST['type'] );
			$ID              = sanitize_text_field( $_REQUEST['ID'] );			
		}

		
		if(empty($courseType)) {
			$courseType = 'general';
		}
		
		if(empty($ID)){
			$ID = 0;
		}		
		
		$html = '';
		
		$html .='<div id="enquire_button_container" class="ax_button_container">
				<form method="'.$action_method.'" action="'.get_permalink($action_page).'">
					<input type="hidden" name="ID" value="'.$ID.'" />
					<input type="hidden" name="type" value="'.$courseType.'" />				
					<input type="submit" id="enrol_button" class="ax_button btn btn-primary" value="'.$button_text.'">
				</form>
				<br />
			</div>';

		return urldecode($html);

	}
	/**
	 * Legacy Shortcode
	 * @deprecated 2.8
	 **/
	public function  axcelerate_enrolment_handler($atts) {

		extract( shortcode_atts( array(
				'button_text' => 'Enrol Now',
				'action_page' => '',
				'action_method' => 'POST',
		), $atts ) );
		
		
		
		$ID   = sanitize_text_field( $_REQUEST['cid'] );
		$type   = sanitize_text_field( $_REQUEST['ctype'] );
		$instanceID   = sanitize_text_field( $_REQUEST['instanceID'] );
		
		// If e-learning, detailID == id
		if($type == 'el' && empty($instanceID) ) {

		   $instanceID = $ID;

		}

		$html = '';
		
		if(!empty($instanceID)) {
			$html .='<div id="enrolment_button_container" class="ax_button_container">
					<form method="'.$action_method.'" action="'.get_permalink($action_page).'">
						<input type="hidden" name="ID" value="'.$ID.'" />
						<input type="hidden" name="type" value="'.$type.'" />
						<input type="hidden" name="instanceID" value="'.$instanceID.'" />
						<input type="hidden" name="newenrolment" value="1" />
						<input type="submit" id="enrolment_button" class="ax_button" value="'.$button_text.'">
					</form>
				</div>';			
		}

		return urldecode($html);
	}	
	/**
	 * Legacy Shortcode
	 * @deprecated 2.8
	 **/
	public function  axcelerate_search_handler($atts) {
		
		extract( shortcode_atts( array(
				'button_text' => 'Search',
				'action_page' => '',
				'title' => 'Course Search',
				'alignment'=>'center'
		), $atts ) );
		$html = '';

		$html .='<div id="enrolment_button_container" class="ax_button_container" style="text-align:'.$alignment.';">';
			
		//	if(!empty($title)){
		//$html .='<h4>'.$title.'</h4>';		
		//	}
				
		$html .='	<form method="GET" action="'.get_permalink($action_page).'">
					<input type="text" style="width: 300px;" name="q" value="" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="submit" id="axip_search" class="btn btn-primary" value="'.$button_text.'">
				</form>
							<br />
			</div>';
			
		return urldecode($html);
		
	}
}

$AxcelerateShortcode = new AxcelerateShortcode();

}
