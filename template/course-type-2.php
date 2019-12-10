<?php

// FILE NOTES:
//
// Filename: course-type-2.php
/*
 * Course Details Page - bookings table
 */

/*--------------------------------------------*
 * Securing the plugin
 *--------------------------------------------*/

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/*--------------------------------------------*/

 global $AxcelerateAPI;
 
	$ID 						= get_query_var('cid');
	$TYPE 						= get_query_var('ctype');
	$axip_enquire_button		= get_post_meta( $post->ID, '_axip_enquire_button', true );
	$axip_enquire_button_page	= get_post_meta( $post->ID, '_axip_enquire_button_page', true );
	

	if(!empty($ID) && !empty($TYPE)) {

		$course = $AxcelerateAPI->getCourseDetails($ID,$TYPE);		       
                     
		if(!empty($course)) {
			 
			echo '<div class="ax-details-page ax-wrap">';
			echo '<div id="maincontentouter" class="innerpages">';
			echo '<div id="ax-listings" class="ax-course-detail-listings">';
			  
			if(!empty($course->NAME)) {			
				echo '<h1 class="ax-course-title">'.$course->NAME.'</h1>';	
			}
				
			if(!empty($course->CODE)) {			
				echo '<p class="ax-course-code"><label>CODE:</label> '.$course->CODE.'</p>';	
			}
				
			if(!empty($course->COST)) {			
				echo '<p  class="ax-course-cost"><label>COST:</label> '.ax_money_format($course->COST).'</p>';	
			}				
				
			if(!empty($course->OUTLINE)) {			
				echo '<p  class="ax-course-outline">'.$course->OUTLINE.'</p>';	
			}
				
			/*
			if(!empty($course->DESCRIPTION)) {			
				echo '<p  class="ax-course-desc">'.$course->DESCRIPTION.'</p>';	
			}				
			*/

			$courseInstances = $AxcelerateAPI->getCourseInstances($cid,$ctype);
				
			if(count($courseInstances) && empty($courseInstances->error)) {
				 
				$axip_instance_drilldown_page 	= get_post_meta( $post->ID, '_axip_instance_drilldown_page', true );
			 	$axip_instance_header 		 	= get_post_meta( $post->ID, '_axip_instance_header', true );
			 	$axip_button_text 	 			= get_post_meta( $post->ID, '_axip_button_text', true );
			 	$axip_booking_closed_text		= get_post_meta( $post->ID, '_axip_booking_closed_text', true );
			 	$axip_action_method  			= get_post_meta( $post->ID, '_axip_action_method', true );
			 	$axip_instance_display  		= get_post_meta( $post->ID, '_axip_instance_display', true );
			 	$axip_price_display  			= get_post_meta( $post->ID, '_axip_price_display', true );

		    	if($axip_instance_display != 2 && $ctype != 'el') {
			   
			   		echo (!empty($axip_instance_header)?'<h2 class="ax-instance-title">'.$axip_instance_header.'</h2>':'');

?>
		<div align="center" style="margin-bottom: 10px;">				 
			<table id="table" class="table">
			
					<tr>
						<th>Course</th>
						<th>Location</th>
						<?php if(!empty($axip_price_display)){ echo '<th>Cost</th>'; } ?>
			
						<th>Date</th>
						 <!--
						<td style="vertical-align:middle; text-align: center;" align="center"><h3>Participants</h3></td>
						<td style="vertical-align:middle; text-align: center;" align="center"><h3>Available Seats</h3></td>		
						-->
						<?php if($axip_instance_display == 0){ echo '<th></th>'; }?>				
					</tr>
			
				<?php foreach($courseInstances as $key=>$row){ ?>		
			
					<tr class="row_<?php echo $key; ?>>">
						<td style="vertical-align:middle;"><?php echo $row->NAME; ?></td>
						<td style="vertical-align:middle;"><?php echo $row->LOCATION; ?></td>
						<?php 
							if(!empty($axip_price_display)){ 
						?>
								<td style="vertical-align:middle;"><?php echo ax_money_format($row->COST); ?></td>
							<?php } ?>
						<td style="vertical-align:middle;"><?php echo $row->DATEDESCRIPTOR; ?></td>
						
						<!-- 
						<td style="vertical-align:middle; text-align: center;" align="center"><?php //echo $row->PARTICIPANTS;?></td>
					  	<?php 
					  	
					  		$Max 				= $row->MAXPARTICIPANTS;
					  		$CurrentStudents 	= $row->PARTICIPANTS;
					  		$AvailableSeats		= $Max-$CurrentStudents;
					  		
					  	?>
					  	<td style="vertical-align:middle; text-align: center;" align="center"><?php //echo $AvailableSeats;?></td>	
						
						-->
						
						<?php 
							if($axip_instance_display == 0){ 
						?>
						<td style="vertical-align:middle; text-align: center;" align="center">
							<?php if(!empty($row->PARTICIPANTS) && !empty($row->MAXPARTICIPANTS) && $row->PARTICIPANTS >= $row->MAXPARTICIPANTS){ ?>
								
								<button class="bookings_closed btn btn-primary disabled" disabled> <?php echo (!empty($axip_booking_closed_text)?$axip_booking_closed_text:'Fully Booked'); ?></button>
			  
							<?php } elseif($row->ENROLMENTOPEN == 1){ ?>
			  
								<form action="<?php echo get_permalink($axip_instance_drilldown_page); ?>" method="<?php echo $axip_action_method; ?>">
									<input type="hidden" name="ID" value="<?php echo $cid; ?>"/>
									<input type="hidden" name="instanceID" value="<?php echo $row->INSTANCEID; ?>"/>
									<input type="hidden" name="type" value="<?php echo $ctype; ?>"/>
									<input type="hidden" name="newenrolment" value="1"/>
			
									<button type="submit" name="" class='btn btn-primary' value="<?php echo (!empty($axip_button_text)?$axip_button_text:'Book Now'); ?>">
									<?php echo (!empty($axip_button_text)?$axip_button_text:'Book Now'); ?></button>
					   			</form>
					  
					  		<?php } else { ?>
			
								<button class="bookings_closed btn btn-primary disabled" disabled> <?php echo (!empty($axip_booking_closed_text)?$axip_booking_closed_text:'Fully Booked'); ?></button>
			
					  		<?php } ?>				  
					  	</td>
						<?php } ?>  
				  	
					</tr>
			
				<?php } ?>
			
			</table>
		</div>
	<?php } ?>		 

<?php }
	
echo '</div>';

}

echo do_shortcode(apply_filters( 'the_content',$post->post_content));

}

echo '</div></div>';
if(!empty($axip_enquire_button)){
	echo '<div class="_enquiryArea">';
	echo do_shortcode('[axcelerate_enquiry button_text="Enquire" action_page="' . $axip_enquire_button_page . '" action_method="GET"]');	
	echo '</div>';
}
		
?>