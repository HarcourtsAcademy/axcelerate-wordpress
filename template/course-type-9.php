<?php

// FILE NOTES:
//
// Filename: course-type-9.php
// Course Training Categories List

/*
|--------------------------------------------------------------------------
| PAGE INFORMATION
|--------------------------------------------------------------------------

This page provides a list of courses category types.

*/

/*
|--------------------------------------------------------------------------
| PAGE TYPE = Course Training Categories
|--------------------------------------------------------------------------
*/

/*--------------------------------------------*
 * Securing the plugin
 *--------------------------------------------*/

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/*--------------------------------------------*/

	/*########### GET Course Listing Settings ############*/
                
    global $AxcelerateAPI;
    $axip_course_list_page = get_post_meta( $post->ID, '_axip_course_list_page', true );
    $axip_main_listheader = get_post_meta( $post->ID, '_axip_main_listheader', true );
    
	$axip_course_list_page_link = get_permalink($axip_course_list_page);
    
    $courseCategories = $AxcelerateAPI->getCourseCategory();
    print_r (get_post_meta( $post ));
    
    /*sort Training Categories alphabetically*/
    usort($courseCategories, function ($a, $b){
    	return strcasecmp($a->AREA, $b->AREA);
    });
    
  	
/*
|--------------------------------------------------------------------------
| Website Starts here ->
|--------------------------------------------------------------------------
*/

    echo "<div class='ax-list-page ax-wrap'>";
    	echo "<div class='ax-list-header'><h2>". $axip_main_listheader . "</h2></div>";
    	echo "<div class='ax-post-content'>";
    		echo do_shortcode(apply_filters( 'the_content',$post->post_content));
    	echo "</div>";
    
		echo "<div class='ax-training-categories'>";
    		foreach($courseCategories as $key => $categories) {
    		
    		$area = "$categories->AREA";
    		
    		if (strpos($axip_course_list_page_link, '?') !== false) {
    			echo "<div class='ax-training-category'><h3><a href='". $axip_course_list_page_link ."&trainingCategory=" .rawurlencode($area) . "'>". $area . "</a></h3></div>";
    		}
    		else{
    			echo "<div class='ax-training-category'><h3><a href='".$axip_course_list_page_link ."?trainingCategory=". rawurlencode( $area ). "'>". $area . "</a></h3></div>";
    		}
    		
  
    		
    	}
		echo "</div>";
	echo "</div>";
    // ------------------------------------------------------------------------------- Drop Down Categories ------------------------------------------------------------------------------- //

?>