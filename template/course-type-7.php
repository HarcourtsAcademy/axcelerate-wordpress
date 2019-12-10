<script type="text/javascript">
    jQuery('.nav-tabs a').attr('data-toggle', 'tab');
</script>
<?php

/*
|--------------------------------------------------------------------------
| PAGE INFORMATION
|--------------------------------------------------------------------------

This page provides a list of courses based on the selected area on the previous page using a query string.

*/

/*
|--------------------------------------------------------------------------
| PAGE TYPE = States Listing
|--------------------------------------------------------------------------
*/

/*--------------------------------------------*
 * Securing the plugin
 *--------------------------------------------*/

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/*--------------------------------------------*/

	/*########### GET Course Listing Settings ############*/
                
    global $AxcelerateAPI;        

	$axip_course_type 				= get_post_meta( $post->ID, '_axip_course_type', true );
	$axip_main_listheader 			= get_post_meta( $post->ID, '_axip_main_listheader', true );
	$axip_usesub_listheader 		= get_post_meta( $post->ID, '_axip_usesub_listheader', true );
	$axip_sub_listheader 			= get_post_meta( $post->ID, '_axip_sub_listheader', true );
	$axip_include_course_summary 	= get_post_meta( $post->ID, '_axip_include_course_summary', true );
	
	$axip_empty_message 			= get_post_meta( $post->ID, '_axip_empty_message', true );
	
	//$axip_results_drilldown_pages 	= get_post_meta( $post->ID, '_axip_results_drilldown_pages', true );
	$axip_results_drilldown_pages 	= get_post_meta( $post->ID, '_axip_results_drilldown_pages', true );
	$axip_location_course_page 		= get_post_meta( $post->ID, '_axip_location_course_page', true );

	$axip_empty_message = (!empty($axip_empty_message)?$axip_empty_message:'No courses found');

    $q = get_query_var('q');

/*
|--------------------------------------------------------------------------
| Website Starts here ->
|--------------------------------------------------------------------------
*/

    // ------------------------------------------------------------------------------- Drop Down Locations ------------------------------------------------------------------------------- //
	// START
	echo "<div style='padding: 10px 10px 10px 10px; background-color: white;' align='center'>";
		echo "<b class='nav-tabs'>Locations</b><br /><br />";
		
		//var_dump($axip_pagetype, $course_pages_ARR, $_course_pages);
	    
	    if(empty($q)) {
	    	$courseLocations = $AxcelerateAPI->getLocations($axip_course_type); 
	    }
	    
	    else {
	    	$courseLocations = $AxcelerateAPI->getLocations($q); 
	    }
	
	    sort($courseLocations);
	    $locationdetailsPage = $axip_pagetype[8];
			
		$courseCategoryGroup = array();
		//echo "<form method='POST' action='./?ax-page=locationdetails'>";
		echo "<form method='POST' action='../locationdetails'>";
	
			echo "<select name='locationInfo' style='width: 300px; display: inline-block !important;' class='form-control'>";
	
				foreach($courseLocations as $catRowDrop) {
	
			    	$courseCategoryGroup[$catRowDrop][] = $catRowDrop;
					
			    	//asort($catRowDrop);
	
					print_r("<option name='$catRowDrop' id='locationInfo' value='$catRowDrop'>$catRowDrop</option>");
	
				}
	
			echo "</select>";
	
			echo "<input name='submitButton' type='submit' class='btn btn-primary' style='margin-left: 50px;'></input>";
	
	    	echo "<br />";    	
	    	echo "<br />";
		echo "</form>";
	echo "</div>";

	// END
    // ------------------------------------------------------------------------------- Drop Down Locations ------------------------------------------------------------------------------- //

?>
