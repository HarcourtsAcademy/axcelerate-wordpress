<?php
if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}
if (class_exists('WP_Widget')){
	class ax_course_search_widget extends WP_Widget {
	
		/**
		 * Sets up the widgets name etc
		 */
		public function __construct() {
			$widget_ops = array(
					'classname' => 'ax_course_search_widget',
					'description' => 'aXcelerate Course Search Widget',
			);
			parent::__construct( 'ax_course_search_widget', 'aX Course Search Widget', $widget_ops );
		}
	
		/**
		 * Outputs the content of the widget
		 *
		 * @param array $args
		 * @param array $instance
		 */
		public function widget( $args, $instance ) {
			// outputs the content of the widget
			$scArgs = '';
			if(!empty ($instance['search_url'])){
				$scArgs = $scArgs . ' ' . 'search_url=' . $instance['search_url'];
			}
			echo $args['before_widget'];
			echo  do_shortcode('<div class="widget_search">[ax_search_form' . $scArgs . ']</div>');
			echo $args['after_widget'];
		}
	
		/**
		 * Outputs the options form on admin
		 *
		 * @param array $instance The widget options
		 */
		 public function form( $instance ) {
		 	// outputs the options form on admin
		 	$searchURL = ! empty( $instance['search_url'] ) ? $instance['search_url'] : '';
		 	?>
			<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'search_url' ) ); ?>"><?php esc_attr_e( 'Search URL:', 'text_domain' ); ?></label> 
			<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'search_url' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'search_url' ) ); ?>" type="text" value="<?php echo esc_attr( $searchURL ); ?>">
			</p>
			
			<?php 
			
		}
	
		/**
		 * Processing widget options on save
		 *
		 * @param array $new_instance The new options
		 * @param array $old_instance The previous options
		 */
		public function update( $new_instance, $old_instance ) {
			// processes widget options to be saved
			$instance = array();
			$instance['search_url'] = ( ! empty( $new_instance['search_url'] ) ) ? strip_tags( $new_instance['search_url'] ) : '';
			
			return $instance;
		}
	}
	function register_ax_course_search_widget() {
		
		register_widget( 'ax_course_search_widget' );
	}
	add_action( 'widgets_init', 'register_ax_course_search_widget' );
}