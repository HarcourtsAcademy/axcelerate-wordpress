<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */

if (! class_exists ( 'AX_Shopping_Cart_SC' )) {
	class AX_Shopping_Cart_SC {
		function __construct() {

			add_shortcode( 'ax_add_to_cart', array(&$this, 'ax_add_to_cart_handler' ));
			add_shortcode( 'ax_shopping_cart_list' ,array(&$this, 'ax_shopping_cart_handler' ) );
			
			add_shortcode( 'ax_shopping_cart_count', array(&$this, 'ax_shopping_cart_count_handler' ));

			add_shortcode( 'ax_shopping_cart_cost', array(&$this, 'ax_shopping_cart_cost_handler' ));
			
			
		}

		public function ax_add_to_cart_handler($atts =array(), $content = null){
			$default_stylesheet = plugins_url ( '/css/ax-standard.css', AXIP_PLUGIN_NAME );
			wp_register_style ( 'ax-standard', $default_stylesheet ,array());
			wp_enqueue_style ( 'ax-standard' );
			
			
			self::loadScripts();
			
			$html = '';
			extract( shortcode_atts( array(
					'course_id' => '',
					'course_type' => '',
					'instance_id'=> '',
					'button_text'=>'Add To Cart',
					'class_to_add'=>'',
					'cost'=>'',
					'course_name'=>'',
					'course_location'=>'',
					'course_date'=>'',
					'custom_css'=>'',
					'vacancy'=>'',
					'vacancy_0_text'=>'Fully Booked',
			), $atts ) );
			
			$currentCart = json_decode( stripslashes(AX_Shopping_Cart::getCookie()), true);
			$defaultText = $button_text;
			if(!empty($currentCart)){
				if(!empty($currentCart[$instance_id . '_' . $course_type])){
					$class_to_add .=' added';
					$button_text = 'In Cart';
				}
			}
			
			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_course_button_link');
				$class_to_add = $class_to_add .' '. $css;
			}
			if($vacancy === 0 || $vacancy === '0'){
				$class_to_add = 'disabled novacancy';
				if(!empty ($css)){
					$class_to_add = $class_to_add. ' '. $css;
				}
				$button_text = $vacancy_0_text;
			}
			
			$html = '<div class="ax-course-button ax-cart-add">';
			$html .= '<a 
						class="'.$class_to_add.' button" 
						data-instance_id="'.$instance_id.'" 
						data-course_type="'.$course_type.'" 
						data-course_name="'.$course_name.'" 
						data-course_location="'.$course_location.'" 
						data-course_id="'.$course_id.'" 
						data-course_date="'.$course_date.'" 
						data-course_cost="'.$cost.'"
						data-default_text="'.$defaultText.'" 
					>';
			$html = $html . '<span>'. $button_text . '</span></a>';
			
			
			$html = $html . '</div>';
			
			return do_shortcode($html);
		}
		
		
		
		public function  ax_shopping_cart_handler ($atts =array(), $content = null) {
			/*load JS scripts*/
			self::loadScripts();
			
			$default_stylesheet = plugins_url ( '/css/ax-standard.css', AXIP_PLUGIN_NAME );

			
			extract( shortcode_atts( array(
					'template' => '',
					'style'=> '',
					'combine_tables'=>'true',
					'custom_css'=>'',
					'class_to_add'=>'',
					'show_removed'=>0,
		
			), $atts ) );
			
			
			
			if(empty($style)){
				//Check for an option override.
				$style = get_option('ax_course_instance_default_style');
			}
			if(empty($style)){
				$style = 'ax-standard';
			}
		
			wp_register_style ( 'ax-standard', $default_stylesheet ,array());
			wp_enqueue_style ( 'ax-standard' );
			
			$show_removed_css = 'tr.ax-cart-removed{display:none;}';
			if($show_removed === 1 || $show_removed === '1'){
				$show_removed_css = 'tr.ax-cart-removed{display:inherit;}';
			}
			wp_add_inline_style ( 'ax-standard', $show_removed_css );
			

			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_shopping_cart');
				$class_to_add = $class_to_add .' '. $css;
			}
		
			$html = '<div class="ax-shopping-cart-list '. $style .' '.$class_to_add.'">';
		
			if(empty($template)){
				$template = get_option('ax_shopping_cart_template');
		
			}
			$as_table = false;
			if(!empty($content)){
				$template = $content;

			}
			if(empty ($template)){
				$template = '<table>
								<thead>
									<tr>
										<td>Name</td>
										<td>Date</td>
										<td>Location</td>
										<td>Cost</td>
										<td></td>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>[ax_course_name]</td>
										<td>[ax_course_instance_datedescriptor]</td>
										<td>[ax_course_instance_location]</td>
										<td style="text-align:right;">$[ax_course_instance_cost]</td>
										<td>[ax_add_to_cart]</td>
									</tr>
								</tbody>
								<tfoot>
									<tr>
										<td></td>
										<td></td>
										<td></td>
										<td style="text-align:right;">[ax_shopping_cart_cost]</td>
										<td></td>
									</tr>
								</tfoot>
							</table>';
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
					
					preg_match_all('#<tfoot>.*?</tfoot>#is', $template, $footer);
					$template = preg_replace('#<tfoot>.*?</tfoot>#is', '', $template);
					
					$html = $html . '<table>';
					if(!empty($header)){
						$html = $html.$header[0][0];
					}
					$as_table = true;
				}
			}
		
			
			$course_instance_array = $currentCart = json_decode( stripslashes(AX_Shopping_Cart::getCookie()), false);
			if(!empty($course_instance_array)){
				foreach ( $course_instance_array as $key => $row ) {
				
					$tempTemplate = $template;
					$baseParams = 'course_id=' . $row->course_id . ' course_type=' . $row->course_type . ' instance_id=' . $row->instance_id;
				
						
					$tempTemplate = str_replace ( '[ax_course_name', '[ax_course_name ' . $baseParams . ' course_name=' . '' . urlencode ( ! empty ( $row->course_name ) ? $row->course_name : ' ' ) . '  in_course_block=true ', $tempTemplate );
						
				
					/* Course Instance Shortcodes */
					if (!empty($row->course_location)){
						$tempTemplate = str_replace ( '[ax_course_instance_location', '[ax_course_instance_location ' . $baseParams . ' location=' . urlencode ( ! empty ( $row->course_location ) ? $row->course_location : ' ' ) . ' in_course_block=true ', $tempTemplate );
					}
					if (!empty($row->course_date)){
						$tempTemplate = str_replace ( '[ax_course_instance_datedescriptor', '[ax_course_instance_datedescriptor ' . $baseParams . ' date_descriptor=' . urlencode ( ! empty ( $row->course_date ) ? $row->course_date : ' ' ) . ' in_course_block=true ', $tempTemplate );
					}
						
				
					$tempTemplate = str_replace ( '[ax_course_instance_cost', '[ax_course_instance_cost ' . $baseParams . ' cost=' . (! empty ( $row->course_cost ) ? $row->course_cost : 0) . ' in_course_block=true ', $tempTemplate );
				
					$tempTemplate = str_replace ( '[ax_course_button_link', '[ax_course_button_link ' . $baseParams, $tempTemplate );
				
					/* Shopping Cart */
				
					$shoppingCartParams = $baseParams . ' cost=' . (! empty ( $row->course_cost ) ? $row->course_cost : 0) . ' course_name=' . '' . urlencode ( ! empty ( $row->course_name ) ? $row->course_name : ' ' ) . ' course_location=' . '' . urlencode ( ! empty ( $row->course_location ) ? $row->course_location : ' ' );
					if (! empty ( $row->course_date )) {
						$shoppingCartParams .= ' course_date=' . urlencode ( $row->course_date );
					}
					$tempTemplate = str_replace ( '[ax_add_to_cart', '[ax_add_to_cart ' . $shoppingCartParams, $tempTemplate );
				
						
				
					$html = $html . $tempTemplate;
				}
			}
			
			if($as_table){
				if(!empty($header)){
					$html = $html.$footer[0][0];
				}
				
				$html = $html . '</tbody></table>';
			}
		
			$html = $html . '</div>';
		
			return urldecode(do_shortCode($html));
		
		}
		
		public function  ax_shopping_cart_count_handler ($atts) {
		
            $cookie = $currentCart = json_decode( stripslashes(AX_Shopping_Cart::getCookie()), true);
            $count = 0;
            if(!empty($cookie)){
                $count = count( $cookie );
            }
			
			extract( shortcode_atts( array(
					'custom_css'=>'',
					'class_to_add'=>'',
					'wrap_tag'=>'div',
					'count'=>$count,
					'extra_text'=> 'Course(s)',
			), $atts ) );
		
			$html = '<span class="ax-cart-count">';
			
			$html .= $count;
			if(!empty($extra_text)){
				$html .= ' '. $extra_text;	
			}
			$html .= '</span>';
			
			/*check for empty preset value and to see if it has been added through a course block*/
			
			
			
			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax_shopping_cart_count');
				$class_to_add = $class_to_add .' '. $css;
			}
			if(!empty($wrap_tag)){
				$html = '<' . $wrap_tag . ' class="ax-shopping-cart '.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
		
			}
		
			// Return the Course Name
			return urldecode($html);
		
		}
		
		public function  ax_shopping_cart_cost_handler($atts) {

            $cookie = $currentCart = json_decode(stripslashes(AX_Shopping_Cart::getCookie()), true);
            $totalCost = 0;
            if (!empty($cookie)) {
                $count = count($cookie);
                if ($count > 0) {
                    foreach ($cookie as $key => $value) {
                        if (!empty($value['cost'])) {
                            $cost = floatval($value['cost']);
                        } else if (!empty($value['course_cost'])) {
                            $cost = floatval($value['course_cost']);
                        } else {
                            $cost = 0;
                        }

                        $totalCost += $cost;
                    }
                }
            }
			
			

			extract( shortcode_atts( array(
					'custom_css'=>'',
					'class_to_add'=>'',
					'wrap_tag'=>'div',
					'cost'=>$totalCost,
			), $atts ) );
				
			$html = '<span class="ax-cart-total">Total: $' .  number_format (floatval($cost), 2, ".", ",") . '</span>'; 
			
			/*check for empty preset value and to see if it has been added through a course block*/
				
				
				
			if(!empty($custom_css)){
				$AxcelerateShortcode = new AxcelerateShortcode();
				$css = $AxcelerateShortcode->ax_decode_custom_css($custom_css, $atts, 'ax-shopping-cart_cost');
				$class_to_add = $class_to_add .' '. $css;
			}
			if(!empty($wrap_tag)){
				$html = '<' . $wrap_tag . ' class="ax-shopping-cart '.$class_to_add.'">' . $html . '</' . $wrap_tag . '>';
		
			}
		
			// Return the Course Name
			return urldecode($html);
		
		}
		
		public function loadScripts(){
			$VERSION = constant ( 'AXIP_PLUGIN_VERSION' );
			if ($VERSION === null) {
				$VERSION = time ();
			}
			/*grap js script from the js directory in _shortcodes*/
			wp_register_script ( 'ax-cart', plugins_url ( 'js/sc_cart_buttons.js', __FILE__ ), array (
					'jquery' 
			), $VERSION );
			wp_enqueue_script ( 'ax-cart' );
			
			wp_localize_script ( 'ax-cart', 'default_vars', array (
					'ajaxURL' => admin_url ( 'admin-ajax.php' ) 
			) );
		}

		
	}
	$AX_Shopping_Cart_SC = new AX_Shopping_Cart_SC();
	
	if(class_exists ( 'WPBakeryShortCode' ) && class_exists('AX_VC_PARAMS') && class_exists ( 'WPBakeryShortCodesContainer' )){
		vc_map ( array (
				"name" => __ ( "aX Add To Cart", "axcelerate" ),
				"base" => "ax_add_to_cart",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				"description"=>__ ( "Add To Cart Button", "axcelerate" ),
				"content_element" => true,
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
						AX_VC_PARAMS::$AX_VC_LINK_TEXT,
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
						AX_VC_PARAMS::$AX_VC_0_VACANCY_TEXT,
							
							
				)
		) );
		class WPBakeryShortCode_aX_Add_To_Cart extends WPBakeryShortCode {
		}
		
		
		vc_map ( array (
				"name" => __ ( "aX Shopping Cart List", "axcelerate" ),
				"base" => "ax_shopping_cart_list",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				"description"=>__ ( "Leave empty to use the default template.", "axcelerate" ),
				"content_element" => true,
				"show_settings_on_create" => true,
				//"is_container" => true,
				"as_parent"=>array('except'=> 'ax_course_details,ax_course_list,ax_course_instance_list', 'only'=>''),
		
				"category" => array (
						'aX Parent Codes',
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
										'Tiled Layout' => 'ax-tile'
								),
								'description' => __ ( 'Layout Style' )
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
		class WPBakeryShortCode_aX_Shopping_Cart_List extends WPBakeryShortCodesContainer {}
		
		vc_map ( array (
				"name" => __ ( "aX Shopping Cart Count", "axcelerate" ),
				"base" => "ax_shopping_cart_count",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				"content_element" => true,
				"description"=>__ ( "Dynamically updating cart count.", "axcelerate" ),
				"show_settings_on_create" => true,
				"is_container"=>false,
				"as_parent"=>array('only'=>''),
					
				"category" => array (
						'aX Util',
				),
				'params' => array (
							
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
						AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
		
				)
		) );
		class WPBakeryShortCode_aX_Shopping_Cart_Count extends WPBakeryShortCode {}
		
		vc_map ( array (
				"name" => __ ( "aX Shopping Cart Cost", "axcelerate" ),
				"base" => "ax_shopping_cart_cost",
				"icon"=>plugin_dir_url(AXIP_PLUGIN_NAME) . 'images/ax_icon.png',
				"content_element" => true,
				"description"=>__ ( "Dynamically updating Cart Cost.", "axcelerate" ),
				"show_settings_on_create" => true,
				"is_container"=>false,
				"as_parent"=>array('only'=>''),
					
				"category" => array (
						'aX Util',
				),
				'params' => array (
							
						AX_VC_PARAMS::$AX_VC_CUSTOM_CSS_PARAM,
						AX_VC_PARAMS::$AX_VC_ADD_CSS_CLASS_PARAM,
						AX_VC_PARAMS::$AX_VC_WRAPPER_TAG_PARAM,
		
				)
		) );
		class WPBakeryShortCode_aX_Shopping_Cart_Cost extends WPBakeryShortCode {}
		
	}
	
	
	
	
}
