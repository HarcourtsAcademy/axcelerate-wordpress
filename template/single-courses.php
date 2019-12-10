<?php

/**
 * The Template for displaying all single posts press Release.
 */

/*--------------------------------------------*
 * Securing the plugin
 *--------------------------------------------*/

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/*--------------------------------------------*/

get_header(); ?>

	<div id="primary" class="site-content">
		<div id="content" role="main">
			<div id="container">

<?php 

$axip_pagetype  = get_post_meta( $post->ID, '_axip_pagetype', true );

if(!empty($axip_pagetype)) {

		require_once(AXIP_PLUGIN_DIR.'template/course-type-'.$axip_pagetype.'.php');

}

else {
		
		while ( have_posts() ) : the_post();
		
				the_content();
		endwhile;
}

?>
	
	</div>
		</div><!-- #content -->
	</div><!-- #primary -->
	
<?php //get_sidebar(); ?>

<?php get_footer(); ?>