<script type="text/javascript">
    jQuery('.nav-tabs a').attr('data-toggle', 'tab');
</script>

<?php

	$locationInformation 		= get_query_var('state');
	$locationInformationCity 	= get_query_var('location');

/*
|--------------------------------------------------------------------------
| PAGE INFORMATION
|--------------------------------------------------------------------------

This page provides a list of courses based on the selected area on the previous page using a query string.

File: LOCATIONDETAILS
File Information: File Location detals page, lists courses based on the select option 

*/

/*
|--------------------------------------------------------------------------
| PAGE TYPE = State Course Listings
|--------------------------------------------------------------------------
*/

	/*--------------------------------------------*
	 * Securing the plugin
	 *--------------------------------------------*/
	
	defined( 'ABSPATH' ) or die( 'No script kiddies please!' );
	
	/*--------------------------------------------*/	
	
	/*###########GET Course Listing Settings############*/
                
    global $AxcelerateAPI;        

	$axip_course_type 				= get_post_meta( $post->ID, '_axip_course_type', true );
	$axip_main_listheader 			= get_post_meta( $post->ID, '_axip_main_listheader', true );
	$axip_usesub_listheader 		= get_post_meta( $post->ID, '_axip_usesub_listheader', true );
	$axip_sub_listheader 			= get_post_meta( $post->ID, '_axip_sub_listheader', true );
	$axip_include_course_summary 	= get_post_meta( $post->ID, '_axip_include_course_summary', true );
	$axip_results_drilldown_pages 	= get_post_meta( $post->ID, '_axip_results_drilldown_pages', true );
	
	$axip_empty_message 			= get_post_meta( $post->ID, '_axip_empty_message', true );
	
	$axip_empty_message 			= (!empty($axip_empty_message)?$axip_empty_message:'No courses found');

    $q = get_query_var('q');
    
/*
|--------------------------------------------------------------------------
| Website Starts here ->
|--------------------------------------------------------------------------
*/

	$locationInfo = $_POST['locationInfo'];

	echo "<div style='padding:10px 10px 10px 10px; margin-left: 1cm;' align='center'>";
		echo "<h1 class='nav-tabs'>Courses at $locationInfo</h1><br /><br />";
	
	    if(empty($q)) {
	
	    	//$course = $AxcelerateAPI->getCourses($axip_course_type);
	     	$course = $AxcelerateAPI->getLocationCourses($type, $displayLength, $locationInfo);
	
	    }
			
		$courseGroup = array();
	
		foreach($course as $row) {
	    
			$courseGroup[$row->LOCATION][] = $locationInfo;
	
		}
	
		if (empty($course)) {
	
			echo "There are no courses in $locationInfo at this point of time.";
		}
	
			
		foreach ($course as $key => $courseData) {
			echo "<a href='coursedetails/?cid=$courseData->ID&ctype=w'>$courseData->NAME</a>";
			//echo "<a href='?ax-page=details&cid=$courseData->ID&ctype=w'>$courseData->NAME</a>";
			echo "<br />";
			echo "<br />";
	
		}
	echo "</div>";
?>
