<?php

// FILE NOTES:
//
// Filename: course-type-6.php
// This is the Calendar Template Page.

/*--------------------------------------------*
 * Securing the plugin
 *--------------------------------------------*/

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/*--------------------------------------------*/

global $AxcelerateAPI;

	    $axip_calendar_use_iframe = get_post_meta( $post->ID, '_axip_calendar_use_iframe', true );
	    $axip_calendar_clientId = get_post_meta( $post->ID, '_axip_calendar_clientId', true );
	    $axip_calendar_short_course_color = get_post_meta( $post->ID, '_axip_calendar_short_course_color', true );
	    $axip_calendar_programs_color = get_post_meta( $post->ID, '_axip_calendar_programs_color', true );
	    $axip_calendar_use_location = get_post_meta( $post->ID, '_axip_calendar_use_location', true );
	    $axip_calendar_type = get_post_meta( $post->ID, '_axip_calendar_type', true );
	    $axip_calendar_drilldown_page = get_post_meta( $post->ID, '_axip_calendar_drilldown_page', true );
            
?>

<script type="text/javascript">
    <!--
    
    jQuery(function($){
    	
    	jQuery(document)
		.ajaxStart(function () {
			if(jQuery('#axjaxLoader').length){
				jQuery('#axjaxLoader').remove();
			}
			var loader = jQuery('<div id="axjaxLoader"></div>');
			var loaderImg = jQuery('<img src="/wp-includes/images/spinner-2x.gif"></img>');
			loader.css({
				'height': jQuery(window).height(),
				'width': jQuery(window).width(),
				'z-index': 999999,
				position:'absolute',
				background:"rgba(255, 255, 255, 0.5)",
				left: 0,
				top: 0,
				}
			);
			loaderImg.css({
			"vertical-align":"middle",
			"margin":"auto",
			"border-radius":"1em",
			"top": "50%",
			"position":"fixed",
			"left": "50%",
			"right": "50%"				});
			loader.append(loaderImg);
			jQuery('body').append(loader);
			loader.show();
			
						})
		.ajaxStop(function () {
			/*call a function to hide a loader*/
			jQuery('#axjaxLoader').hide();
		});
		jQuery(document).trigger('ajaxStart');
		

        
        var location;
        $("#location").change(function(){
            location = $("#location").val();
            $('#axip-course-calendar').fullCalendar( 'removeEvents' );
            $('#axip-course-calendar').fullCalendar( 'refetchEvents' ); 
        });
    
        $("#axip-course-calendar").fullCalendar({
            header: { left: 'prev,next today', center: 'title',right: 'month,agendaWeek,agendaDay'	}, //  right: 'month,agendaWeek,agendaDay'
            editable: false,
			buttonText:{
				    today:    'Today',
				    month:    'Month',
				    week:     'Week',
				    day:      'Day'
				},
                            timeFormat:'hh:mm a', // Remove time display on days. Default was: 'h(:mm)t'. If but back, recommend: 'h(:mm)tt'
                            titleFormat:{
                                week:'D MMM YYYY'
                                },
                            columnFormat:{
                                week:'ddd D/M'
                                },                                
                                
                            <?php if($axip_calendar_type == 'na'){ ?>
                                eventSources: [
                                { events: function(start, end, timezone, callback) { clearLocations(); if(callback) callback(); } },	
                                {
                                        //get Non-Accredited events from aXcelerate
                                        color: '<?php echo $axip_calendar_short_course_color; ?>',
                                        backgroundColor: 'white',
                                        textColor: '<?php echo $axip_calendar_short_course_color; ?>',
                                        borderColor: '<?php echo $axip_calendar_short_course_color; ?>',
                                        events: function(start, end, timezone, callback) {
                                            
                                            var data = {};
                                                data.action	= 'axip_getcalendar_action';
                                                data.type	= 'na';
                                                data.year 	= moment(start).format('YYYY');
                                                data.monthFrom 	= moment(start).format('M');
                                                data.monthTo 	= moment(end).format('M');
                                                data.location   = location; 
                                            
                                            $.ajax({type: "POST", url: '<?php echo admin_url( 'admin-ajax.php' ); ?>', dataType: 'JSON', data: data,
                                            success: function(doc) {
											   var events = [];
											   $.each(doc,function(i,row) {												   
												   events.push(row);
											   });
											   
											   refreshLocations(events);										
												 if ( typeof(events.ERROR) === "undefined" )
												 callback(events);			   
                                                }
                                            });	
                                        }
                                }
                                ],    
                        <?php } elseif($axip_calendar_type == 'a'){ ?>
                                eventSources: [
                                { events: function(start, end, timezone, callback) { clearLocations(); if(callback) callback(); } },	
                                {
                                        //get Accredited events from aXcelerate
                                        color: '<?php echo $axip_calendar_programs_color; ?>',
                                        backgroundColor: 'white',
                                        textColor: '<?php echo $axip_calendar_programs_color; ?>',
                                        borderColor: '<?php echo $axip_calendar_programs_color; ?>',
                                        events: function(start, end, timezone, callback) {
                                            
                                            var data = {};
                                                data.action	= 'axip_getcalendar_action';
                                                data.type	= 'a';
                                                data.year 	= moment(start).format('YYYY');
                                                data.monthFrom 	= moment(start).format('M');
                                                data.monthTo 	= moment(end).format('M');
                                                data.location   = location;
                                            
                                            $.ajax({type: "POST", url: '<?php echo admin_url( 'admin-ajax.php' ); ?>', dataType: 'JSON', data: data,
                                            success: function(doc) {

											   var events = [];
											   $.each(doc,function(i,row) {												   
												   events.push(row);
											   });											   
											   refreshLocations(events);											   									   
												 if ( typeof(events.ERROR) === "undefined" )
												 callback(events);
				
                                                }
                                            });	
                                        }
                                }
                                ],    
						<?php } elseif($axip_calendar_type == 'all'){ ?>
                                eventSources: [
                                { events: function(start, end, timezone, callback) { clearLocations(); if(callback) callback(); } },	
                                {
                                        //get Non-Accredited events from aXcelerate
                                        color: '<?php echo $axip_calendar_short_course_color; ?>',
                                        backgroundColor: 'white',
                                        textColor: '<?php echo $axip_calendar_short_course_color; ?>',
                                        borderColor: '<?php echo $axip_calendar_short_course_color; ?>',
                                        events: function(start, end, timezone, callback) {
                                            
                                            var data = {};
                                                data.action	= 'axip_getcalendar_action';
                                                data.type	= 'na';
                                                data.year 	= moment(start).format('YYYY');
                                                data.monthFrom 	= moment(start).format('M');
                                                data.monthTo 	= moment(end).format('M');
                                                data.location   = location;
                                            
                                            $.ajax({type: "POST", url: '<?php echo admin_url( 'admin-ajax.php' ); ?>', dataType: 'JSON', data: data,
                                            success: function(doc) {
											   var events = [];
											   $.each(doc,function(i,row) {												   
												   events.push(row);
											   });
											   
											   refreshLocations(events);										
												 if ( typeof(events.ERROR) === "undefined" )
												 callback(events);			   
                                                }
                                            });	
                                        }
                                },
                                {
                                        //get Accredited events from aXcelerate
                                        color:	'<?php echo $axip_calendar_programs_color; ?>',
                                        backgroundColor: 'white',
                                        textColor: '<?php echo $axip_calendar_programs_color; ?>',
                                        borderColor: '<?php echo $axip_calendar_programs_color; ?>',
                                        events: function(start, end, timezone, callback) {
                                            
                                            var data = {};
                                                data.action	= 'axip_getcalendar_action';
                                                data.type	= 'a';
                                                data.year 	= moment(start).format('YYYY');
                                                data.monthFrom 	= moment(start).format('M');
                                                data.monthTo 	= moment(end).format('M');
                                                data.location   = location;
                                            
                                            $.ajax({type: "POST", url: '<?php echo admin_url( 'admin-ajax.php' ); ?>', dataType: 'JSON', data: data,
                                            success: function(doc) {

                                                var events = [];
                                                $.each(doc,function(i,row) {
                                                    
                                                        events.push(row);
                                                });											   
                                                refreshLocations(events);											   									   
                                                      if ( typeof(events.ERROR) === "undefined" )
                                                      callback(events);
				
                                                }
                                            });	
                                        }
                                }								
                                ],    
						<?php } ?>
							   eventClick: function(event) {
								   if(typeof(event.courseID) != "undefined"){
									   //change aXcelerate activity type to (new) type code
									   if (event.type == "Non-accredited") { type = "w"; }
									   if (event.type == "Accredited") { type = "w"; }
									   if (event.type == "e-learning") { type = "el"; }
									   <?php if(!empty($axip_calendar_drilldown_page)){ ?>
										var courseUrl  = '<?php echo add_query_arg( array('cid' => '#CID','ctype'=>'#CTYPE'), get_permalink($axip_calendar_drilldown_page) ) ?>';
										
										courseUrl = courseUrl.replace('#CID',event.courseID);
										courseUrl = courseUrl.replace('#CTYPE',type);
										window.location = courseUrl;
										
										<?php }	?>		
								   }
								   return false;
							   }						
                            
            });
        
        function clearLocations() { 
                // clear all but the first option (all) and the one currently selected
                $('#axip_location option:not(:selected)').hide();
                $('#axip_location option:eq(0)').show();
        }
        function refreshLocations(r) {
                for ( var i = 0; i < r.length; i++ )
                    if ( typeof( r[i].location) != "undefined" )
                            $('#axip_location').find('option[value=' +r[i].location+ ']').show();
                    else
                            // This means locations are not part of the return struct yet. show all
                            $('#axip_location').find('option').show();
        }
    
      });
    //-->
</script>

<div class="ax-wrap ax-page-calendar">
<?php if(!empty($axip_calendar_use_iframe) && !empty($axip_calendar_clientId)){ ?>

<!-- <iframe src="https://admin.axcelerate.com.au/public/dataContent.cfm?pageContents=calendar&L=<?php echo $axip_calendar_clientId; ?>&withoutTemplate=1" frameborder="0" width="100%" height="500"></iframe>  -->
<iframe src="https://admin.axcelerate.com.au/public/dataContent.cfm?pageContents=calendar&L=<?php echo $axip_calendar_clientId; ?>&withoutTemplate=1" width="100%" height="500"></iframe>

<?php }else{ ?>

    <?php if(!empty($axip_calendar_use_location)){
        
       $locations = $AxcelerateAPI->getLocations();
       
       sort($locations);

        ?>
		<div class="calendarLocation">
			<label for="location">Location:</label>
                        <input list="axip_locations" id="location" name="location">
                            
                       <datalist id="axip_locations">                            
                            <?php foreach($locations as $loc): ?>
                            <option value="<?php echo $loc; ?>"><?php echo $loc; ?></option>
                            <?php endforeach; ?>
                        </select>
                        
                        
                </div>
    <?php } ?>

    <div id='axip-course-calendar' style="padding: 20px 20px 20px 20px;"></div>
    
	<!--- Display legend if getting both accredited and non --->
	<?php if($axip_calendar_type == 'all'){ ?>
		<div class="ax-calendar-legend" style="margin-top:10px; margin-bottom: 20px; margin-left: 20px; font-size:0.8em;">Legend:
			<span style="margin-left:8px; padding: 5px; color: #fff; background-color:<?php echo !empty($axip_calendar_programs_color)?$axip_calendar_programs_color:'#ccc'; ?>; display:inline-block;">Accredited</span>
			<span style="padding: 5px; color: #fff; background-color:<?php echo !empty($axip_calendar_programs_color)?$axip_calendar_short_course_color:'#ccc'; ?>; display:inline-block;">Non-accredited</span>
		</div>
	<?php } ?>
<?php } ?>

</div>
