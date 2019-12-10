<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */
if (! class_exists ( 'AX_Shopping_Cart' )) {
	class AX_Shopping_Cart {
		public function __construct() {
			$cart = get_option('ax_shopping_cart');
			if(!empty($cart)){
				if($cart === 'enabled'){
					add_filter('wp_nav_menu_items',array($this, 'nav_menu_hook'), 10, 2);
					self::loadScripts();
					
				}
			}
			
			
			
		}
		public function loadScripts(){
			$VERSION = constant ( 'AXIP_PLUGIN_VERSION' );
			if ($VERSION === null) {
				$VERSION = time ();
			}
			/*grap js script from the js directory in _shortcodes*/
			wp_register_script ( 'ax-cart', plugins_url ( '/classes/_shortcodes/js/sc_cart_buttons.js', AXIP_PLUGIN_NAME ), array (
					'jquery'
			), $VERSION );
			wp_enqueue_script ( 'ax-cart' );
				
			wp_localize_script ( 'ax-cart', 'default_vars', array (
					'ajaxURL' => admin_url ( 'admin-ajax.php' )
			) );
		}
		public function setCookie(){
			 setcookie( 'ax_shop_cart', 'bob', 30 * DAYS_IN_SECONDS, COOKIEPATH, COOKIE_DOMAIN );
		}
		public static function getCookie(){
			
			if(isset($_COOKIE['ax_shop_cart'])){
				return $_COOKIE['ax_shop_cart'];
			}
			else{
				return '';
			}
		}
		
		
		//Hook into wp_nav_menu_items to display the "cart" count etc
		function nav_menu_hook($items, $args){
			if(property_exists($args, 'theme_location')){
				$menus_selected = get_option('ax_shopping_cart_menus');
				if(in_array($args->theme_location, $menus_selected)){
					wp_enqueue_style ( 'dashicons' );
					$cartURL = get_option('ax_shopping_cart_url');
						
					if(!empty($cartURL)){
						$cartURL = esc_url(get_permalink($cartURL));
					}
					$icon= 'dashicon-cart';
					$iconType = 'font';
					$iconFont = 'dashicon';
					if(isset($_COOKIE['ax_shop_cart'])){
						$cookie = json_decode( stripslashes( self::getCookie() ), true );
						$count = count( $cookie );
					}
					else{
						$cookie = array();
						$count = 0;
					}
					$totalCost = 0;
					if($count > 0){
						foreach ($cookie as $key=> $value){
							if(!empty($value['cost'])){
								$cost = floatval($value['cost']);
							}
							else if(!empty($value['course_cost'])){
								$cost = floatval($value['course_cost']);
							}
							else{
								$cost = 0;
							}
								
							$totalCost += $cost;
						}
					}
					
					$totalCostString = "$ " .  number_format (floatval($totalCost), 2, ".", ",") ; 
					$items.='
					<li class="ax-shopping-cart menu-item menu-item-has-children submenu" >
						<a style="padding-right:2.5em;">
						<span class="ax-cart-count" style="display:inline-block;padding-right:0;">'
							.$count.
							'</span><span class="dashicons dashicons-cart" style="display:inline-block;"></span>
						</a>
						<ul class="sub-menu">
							<li><a href="#" class="ax-cart-total">Total: '
									.$totalCostString.
									'</a></li>
							<li>
								<a href="'.$cartURL.'">Checkout</a>
							</li>
							<li>
								<a class="ax_empty_cart" style="cursor:pointer;">Empty Cart</a>
							</li>
						</ul>
					</li>';
				}
			}
			
			
			return $items;
		}
		//If a cart page doesnt exist push it in?
		
		//Register script to update when new item added? Add this from here or add it via the button code. Inclined to say add it here so that the code is always there.
		
		//Register ajax listener to perform action.
		public static function setupTasks() {
		}
		public static function clearTasks() {
		}
	}
}