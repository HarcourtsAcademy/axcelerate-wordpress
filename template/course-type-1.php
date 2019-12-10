<?php

/*--------------------------------------------*
 * Securing the plugin
 *--------------------------------------------*/

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/*--------------------------------------------*/

// FILE NOTES:
//
// Filename: course-type-1.php
// Course Listing

	/*###########GET Course Listing Settings############*/
                
    global $AxcelerateAPI;     
	$axip_course_type 						= get_post_meta( $post->ID, '_axip_course_type', true );
	$axip_main_listheader 					= get_post_meta( $post->ID, '_axip_main_listheader', true );
	$axip_usesub_listheader 				= get_post_meta( $post->ID, '_axip_usesub_listheader', true );
	$axip_sub_listheader 					= get_post_meta( $post->ID, '_axip_sub_listheader', true );
	$axip_include_course_summary 			= get_post_meta( $post->ID, '_axip_include_course_summary', true );
	$axip_empty_message 					= get_post_meta( $post->ID, '_axip_empty_message', true );
	$axip_results_drilldown_pages 			= get_post_meta( $post->ID, '_axip_results_drilldown_pages', true );
	$axip_training_categories_page 			= get_post_meta( $post->ID, '_axip_training_categories_page', true );
	$axip_training_categories_details_page 	= get_post_meta( $post->ID, '_axip_training_categories_details_page', true );
	$axip_display_categories				= get_post_meta( $post->ID, '_axip_display_categories', true );
	$axip_display_locations					= get_post_meta( $post->ID, '_axip_display_locations', true );
	$axip_training_categories_all_courses	= get_post_meta( $post->ID, '_axip_training_categories_all_courses', true );
	$axip_training_category_filter 			= get_post_meta( $post->ID, '_axip_training_category_filter', true );

	$axip_empty_message = (!empty($axip_empty_message)?$axip_empty_message:'No courses found');
	
    $q = get_query_var('q');

    if(empty($q)) {
    	$course = $AxcelerateAPI->getCourses($axip_course_type); 
    }
    else {
    	$course = $AxcelerateAPI->searchCourses($q);
    }
    if(!empty($_REQUEST["trainingCategory"]) OR !empty($_REQUEST["locationInfo"])) {
    	$trainingCat = $_REQUEST["trainingCategory"];
    	$locationInfo = $_REQUEST["locationInfo"];
    	$instanceList = array();
    	$IDList = array();
    	$courseDetailList = array();
    	if(!empty($axip_training_categories_all_courses))
    	{
    		if(isset($trainingCat)){
    			//do the course search with the Training Cat
    			$course = $AxcelerateAPI->searchCoursesByCat($trainingCat);
    			
    		}
    	}
    	else
    	{
	    	//check to see if either is set, if none then perform default
	    	if(isset($trainingCat) OR isset($locationInfo)) {
	    
	    		//make sure that if one is not set it is set to empty string
	    		if(!isset($trainingCat)) {
	    			$trainingCat = "";
	    		}
	    		if(!isset($locationInfo)) {
	    			$locationInfo = "";
	    		}
	    		$trainingCat = rawurldecode($trainingCat);
	    		//do the course/instance/search with the Training Cat
	    		$instanceList = $AxcelerateAPI->getTrainingCatAndLocation('all',$trainingCat,$locationInfo);
	    
	    		//with the results: loop over and pull out the ID (build array?)
	    		foreach($instanceList as $instance) {
	    			//add as key value pairs
	    			$IDList[$instance->ID] = $instance->TYPE;
	    		}
	    		//loop over ID array and call /course/detail
	    
	    		foreach($IDList as $ID => $type) {
	    			
	    			$courseDetails = $AxcelerateAPI->getCourseDetails($ID, $type);
	    			$courseDetails->TYPE = $type;
	    			array_push($courseDetailList, $courseDetails);
	    			
	    		}
	
	    		$course = $courseDetailList;
	    	}
    	}
    } //End post method
     
    /*Always filter to a specific Category*/
    if(!empty($axip_training_category_filter)){
    	$axip_display_categories = "";
    	$axip_display_locations = "";
    	$axip_training_categories_all_courses = "";
    	$course = $AxcelerateAPI->searchCoursesByCat($axip_training_category_filter);
    }
    
    
	$courseGroup = array();
	
	foreach($course as $row) {
    
    	$courseGroup[$row->TYPE][] = $row;

	}
	
	$courseId = array();
	$courseGroupId = array_unique($courseId);
	
	foreach($course as $row) {
	
		$courseId[$row->ID][] = $row;
	
	}

	
	echo "<div class='ax-list-page ax-wrap'>"; //1
	
	// ------------------------------------------------------------------------------- Drop Down Categories ------------------------------------------------------------------------------- //
	// START
	if(!empty($axip_display_categories) || !empty($axip_display_locations) || !empty($axip_training_categories_all_courses)) {
		
	
		// Course Types drop down form
		echo "<div id='ax-course-filter' class='ax-course-filter'>";
		echo "<form method='POST' action=''>";
		
		if(!empty($axip_display_categories) || !empty($axip_training_categories_all_courses)) {
		
			echo "<div class='ax-course-filter-category'>";
			echo "<b class='nav-tabs'>Category</b>";
			
			$courseCategories 		= $AxcelerateAPI->getCourseCategory();
		
			print_r (get_post_meta( $post ));
			
			sort($courseCategories);
			
			
			if(!empty($axip_display_locations)){
				echo "<select name='trainingCategory'  class='form-control'>";
			}
			else{
				echo "<select name='trainingCategory'  class='form-control' onchange='this.form.submit()'>";
			}
			echo "<option id='trainingCategory' value=''>Please Select</option>";
			foreach($courseCategories as $key => $categories) {
					
				//$courseCategoryGroup[$catRowDrop][] = $catRowDrop;
			
				//asort($catRowDrop);
			
				$area = "$categories->AREA";
					
				print_r("<option name='$area' id='trainingCategory' value='$area'>$area</option>");
					
			}
				
			echo "</select>";
		
			
			
			echo "</div>";
		}
		
		// END
		// ------------------------------------------------------------------------------- Drop Down Categories ------------------------------------------------------------------------------- //
		// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ //
		// ------------------------------------------------------------------------------- Drop Down Locations ------------------------------------------------------------------------------- //
		// START
		if(!empty($axip_display_locations) && empty($axip_training_categories_all_courses)) {
			
		
			echo "<div class='ax-course-filter-location'>";
			echo "<b class='nav-tabs'>Location</b>";
			 
			if(empty($q)) {
				$courseLocations = $AxcelerateAPI->getLocations($axip_course_type);
			}
			 
			else {
				$courseLocations = $AxcelerateAPI->getLocations($q);
			}
			
			sort($courseLocations);

				
			$courseCategoryGroup = array();
			
			//echo "<form method='POST' action='../lc-details'>";
			if(!empty($axip_display_categories) || !empty($axip_training_categories_all_courses)) {
				echo "<select name='locationInfo' class='form-control'>";
			}
			else{
				echo "<select name='locationInfo' class='form-control' onchange='this.form.submit()'>";
			}
			
			echo "<option id='locationInfo' value=''>Please Select</option>";
			foreach($courseLocations as $catRowDrop) {
			
				$courseCategoryGroup[$catRowDrop][] = $catRowDrop;
			
				print_r("<option name='$catRowDrop' id='locationInfo' value='$catRowDrop'>$catRowDrop</option>");
			
			}
			
			echo "</select>";	
		
			echo "</div>";
		}
		echo "<div class='ax-course-filter-submit'>";
		if(!empty($axip_display_locations) && !empty($axip_display_categories)) {
			echo "<input name='submitButton' type='submit' class='btn btn-primary' style=''></input>";
		}
		else{
			echo "<noscript><input name='submitButton' type='submit' class='btn btn-primary' style=''></input></noscript>";
		}
		
		echo "</div>";
		echo "</form>";
		echo "</div>";
	
	}
	// END
	
	// ------------------------------------------------------------------------------- Drop Down Locations ------------------------------------------------------------------------------- //

	
	
	// ------------------------------------------------------------------------------- Course Listings  ----------------------------------------------------------------------------------- //	
	// START
	
	
	
	//echo "<p style='display: none;'>";
	//echo get_the_ID();
	//echo "</p>";
	
	if(!empty($axip_main_listheader)) {		
		echo '<h1 class="ax-list-heading">'.$axip_main_listheader.'</h1>';			
	}
	
	if(!empty($axip_include_course_summary)) {
		echo do_shortcode(apply_filters( 'the_content',$post->post_content));	
	}
	
	if(!count($course)) {
		
		if(!empty($axip_empty_message)) echo '<div class="ax-noData" align="center" style="align: center;">'.$axip_empty_message.'</div>';
		
	}

	else {
	
		if(empty($course->ERROR)) {
		
			foreach($courseGroup as $courseType=>$course) {
					    		    
				if(!empty($axip_usesub_listheader) && isset($axip_sub_listheader[$courseType])) {
						
						echo '<h2 class="ax-course-title">'.$axip_sub_listheader[$courseType].'</h2>';
						
				}	
	?>
		<!--- Removed the line below so the table is more compatible with themes 'width="100%"'. Wade, 22 SEP 2015. -->
		<div align="center"> <!-- 2 -->
			<table id="course_list" >
				<tbody>				
					<?php
					/*Add the link to the details page if using Default*/
						foreach($course as $row) {
					?>		
						<tr>						
							<td style="border: none !important;">
								<h2 class="ax-course-title"><a href="<?php
								
								/*build the links to each detail page*/
								$course_detail_page = '';
								if(!empty($axip_results_drilldown_pages[$row->TYPE])) {
									$course_detail_page = get_permalink($axip_results_drilldown_pages[$row->TYPE]);
								}
								
								elseif(!empty($axip_results_drilldown_pages['default'])) {
									$course_detail_page = get_permalink($axip_results_drilldown_pages['default']);
								}
								$course_detail_page = add_query_arg( array('cid' => $row->ID,'ctype'=>$row->TYPE), $course_detail_page );
								echo $course_detail_page;
								
								?>">
								<?php if($row->TYPE == "p"){ echo "<span class='ax-course-code'>". $row->CODE ." - </span>";} ?>
								<?php echo $row->NAME;?>
								<?php if(!empty($row->STREAMNAME)){ echo "<span class='ax-course-stream'> (". $row->STREAMNAME .")</span>";} ?>
								</a></h2>
								<div> <!-- 3 -->
									<?php 
									if(!empty($row->DESCRIPTION)){
										echo $row->SHORTDESCRIPTION . $row->DESCRIPTION;
									}
									else{
										echo $row->SHORTDESCRIPTION;
									}
									
									?>
								</div> <!-- 3 -->
								<br />
							</td>
						</tr>
					<?php	} ?>
				</tbody>
			</table>
		</div> <!-- 2 -->
		<?php	} ?>
	
		<?php } ?>

    <?php } 
    // END
	// ------------------------------------------------------------------------------- Course Listings  ----------------------------------------------------------------------------------- //
	echo '</div> <!-- 1 -->';
    ?>
	