<style>
table td tr {

border: none !important;

}

h3.sd-title {

display: none !important;

}

</style>

<?php

/*--------------------------------------------*
 * Securing the plugin
 *--------------------------------------------*/

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/*--------------------------------------------*/

// FILE NOTES:
//
// Filename: course-type-14.php
// Course Search Box.

	/*###########GET Course Listing Settings############*/
                
    global $AxcelerateAPI;     

	$axip_course_type 				= get_post_meta( $post->ID, '_axip_course_type', true );
	$axip_main_listheader 			= get_post_meta( $post->ID, '_axip_main_listheader', true );
	$axip_usesub_listheader 		= get_post_meta( $post->ID, '_axip_usesub_listheader', true );
	$axip_sub_listheader 			= get_post_meta( $post->ID, '_axip_sub_listheader', true );
	$axip_include_course_summary 	= get_post_meta( $post->ID, '_axip_include_course_summary', true );
	$axip_empty_message 			= get_post_meta( $post->ID, '_axip_empty_message', true );
	$axip_results_drilldown_pages 	= get_post_meta( $post->ID, '_axip_results_drilldown_pages', true );
	
	$axip_empty_message = (!empty($axip_empty_message)?$axip_empty_message:'No courses found');
    
	$q = get_query_var('q');

    if(empty($q)) {
    	$course = $AxcelerateAPI->getCourses($axip_course_type); 
    }
    else {
    	$course = $AxcelerateAPI->searchCourses($q); 
    }
		
	$courseGroup = array();

	foreach($course as $row) {
    	$courseGroup[$row->TYPE][] = $row;
	}
	
	echo '<div class="ax-list-page ax-wrap" style="padding-top: 50px;">';
	
		echo "<form method='POST' action='$axip_results_drilldown_pages\?q=$searchTerm'>";
			
			echo "<input name='$searchTerm' id='searchTerm' type='text' value='$searchTerm'></input>";
			
			echo "<input name='submitButton' type='submit' class='btn btn-primary' style='margin-left: 50px;'></input>";
		
		echo "</form>";
	
	echo "</div>";
    // END
	// ------------------------------------------------------------------------------- Course Listings  ----------------------------------------------------------------------------------- //
	?>
