<style type="text/css">
div.swMain#enrolment_wizard {
	background-color: white;
	padding: 10px 10px 10px 10px;
}
</style>

<?php

// FILE NOTES:
//
// Filename: course-type-4.php
// This is the enrolment / SmartWizard page. 30th Nov 2015, Wade.

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */

global $AxcelerateAPI, $courseType, $instanceID, $paymentAmount, $learningActivity, $formSettings;

$instanceID = (! empty ( $_REQUEST ['instanceID'] ) ? sanitize_text_field ( $_REQUEST ['instanceID'] ) : sanitize_text_field ( $_REQUEST ['cinstanceID'] ));
$courseType = (! empty ( $_REQUEST ['type'] ) ? sanitize_text_field ( $_REQUEST ['type'] ) : sanitize_text_field ( $_REQUEST ['ctype'] ));
$ID = (! empty ( $_REQUEST ['ID'] ) ? sanitize_text_field ( $_REQUEST ['ID'] ) : sanitize_text_field ( $_REQUEST ['cID'] ));
$newenrolment = sanitize_text_field ( $_REQUEST ['newenrolment'] );

$invoiceID = sanitize_text_field ( $_REQUEST ['invoiceID'] );

$axip_settings = get_option ( 'axip_general_settings' );
$discountsAvailable = (! empty ( $axip_settings ['axip_discounts_available'] ) ? $axip_settings ['axip_discounts_available'] : 0);
$formSettings = get_post_meta ( $post->ID, '_axip_enrolment_formsettings', true );

$axip_enroller_widget_config_id = $formSettings ['_axip_enroller_widget_config_id'];

if(! empty($axip_enroller_widget_config_id ) || $axip_enroller_widget_config_id == '0'){
	if( empty ( $instanceID ) ){
		$instanceID = 0;
	}

	$enroller_shortcode = "[ax_enrol_widget config_id=". $axip_enroller_widget_config_id ." course_id=". $ID. " instance_id=". $instanceID . " type=". $courseType ."]";
	echo '<div class="ax-wrap ax-enrol-page">';
	echo do_shortcode ( apply_filters ( 'the_content', $post->post_content ) );
	echo do_shortcode ($enroller_shortcode);
	echo '</div>';
}
else{
	if (! empty ( $courseType ) && ! empty ( $instanceID )) {
	
		$formSettings = get_post_meta ( $post->ID, '_axip_enrolment_formsettings', true );
	
		$axip_success_message = (! empty ( $formSettings ['_axip_success_message'] ) ? $formSettings ['_axip_success_message'] : 'Thank you. We will get back to you as soon as possible.');
		$axip_multipage_contact_form = $formSettings ['_axip_multipage_contact_form'];
		$axip_entrolment_closed_message = (! empty ( $formSettings ['_axip_entrolment_closed_message'] ) ? $formSettings ['_axip_entrolment_closed_message'] : 'Enrolment closed!');
		$axip_allow_multiple_signup = $formSettings ['_axip_allow_multiple_signup'];
		$axip_allow_returning_users = $formSettings ['_axip_allow_returning_users'];
		$axip_returning_user_method = $formSettings ['_axip_returning_user_method'];
	
		$axip_headertext = $formSettings ['_axip_headertext'];
		$axip_use_iframe = $formSettings ['_axip_use_iframe'];
		$axip_clientId = $formSettings ['_axip_clientId'];
		$axip_captcha_display = $formSettings ['_axip_captcha_display'];
	
		/*Returning Users is not allowed with finance code category overrides*/
		$axip_add_financecode_override = (! empty($formSettings ['_axip_add_financecode_override'] ) ? $formSettings ['_axip_add_financecode_override'] : "no_override");
		if($axip_add_financecode_override == "override_category"){
			$axip_allow_returning_users = 0;
		}
		$axip_financecode_default = (! empty($formSettings ['_axip_financecode_default'] ) ? $formSettings ['_axip_financecode_default'] : 0);
		$axip_financecode_category = (! empty($formSettings ['_axip_financecode_category'] ) ? $formSettings ['_axip_financecode_category'] : 0);
	
		// multi bookings are not available for non-workshop enrolments
	
		if ($courseType != 'w') {
			$axip_allow_multiple_signup = 0;
		}
	
		// else {
		// $axip_allow_multiple_signup = 0;
		// }
	
		$course = $AxcelerateAPI->getCourseInstanceDetails ( $instanceID, $courseType );
	
		$paymentAmount = $course->COST;
	
		$axip_settings = get_option ( 'axip_general_settings' );
		$payment_option = $axip_settings ['payment_options'];
	
		// course code need
		echo '<div class="ax-wrap ax-enrol-page">';
		echo '<div class="ax-enrol-header">';
		echo '<h2>' . get_the_title () . '</h2>';
	
		echo '<h4>' . __ ( 'Course: ' ) . $course->NAME . '</h4>';
		echo '</div>';
		if ($course->ENROLMENTOPEN != 1 || $payment_option == "none") {
			// enrolment closed
	
			if ($payment_option == "none") {
				echo "<p><strong>Online Bookings Unavailable</strong></p>";
			}
	
			?>
	<div class="alert alert-danger" role="alert"><?php echo $axip_entrolment_closed_message; ?></div>
	<?php
		} 
	
		else {
			if ($paymentAmount <= 0) {
				$payment_option = 'free';
			}
			$wizardSteps = array (
					'blank' 
			);
			
			if ($axip_allow_returning_users != 0) {
				if ($axip_returning_user_method == 'User') {
					$wizardSteps [] = 'User';
				} else {
					
					$wizardSteps [] = 'Login';
				}
			}
			
			if ($axip_allow_multiple_signup != 0) {
				$wizardSteps [] = 'Register';
			}
			
			$wizardSteps [] = 'Student Details';
			
			if (($payment_option == "both" || $payment_option == "invoice")) {
				$wizardSteps [] = 'Invoice';
			}
			
			if (($payment_option == "both" || $payment_option == "payment") && $paymentAmount > 0) {
				$wizardSteps [] = 'Payment';
			}
			
			?>
	
	<script type="text/javascript">
				    jQuery(function($){
						var axip_new_user;
						var num_enrol_students;
						var firstContactIsPayerOnly = false;				
						$(document).on("click","#axip_new_user",function(e){
							 axip_new_user = 1;
							 $("#enrolment_wizard").smartWizard('goForward');
						});
						$(document).on('click','#calculate_discounts' , function(){
							numberOfStudents = parseInt(Cookies.get('axip_numOfStudents'));
							var params ={};
							if(numberOfStudents > 1){
								params = discounts.action.buildGroupBookingParams('<?php echo $courseType; ?>','<?php echo $instanceID; ?>', '<?php echo $paymentAmount; ?>', numberOfStudents);
							}
							else{
								params = discounts.action.buildConcessionParams('<?php echo $courseType; ?>','<?php echo $instanceID; ?>', '<?php echo $paymentAmount; ?>'); 
							}
							discounts.action.calculateDiscountCall(params, '<?php echo admin_url( 'admin-ajax.php' ); ?>');
						
						});
	
	
						Cookies.set('axip_current_wizard_page',"<?php echo ($axip_multipage_contact_form == 1?1:0); ?>");
						Cookies.set('axip_multipage_contact_form',"<?php echo ($axip_multipage_contact_form == 1?1:0); ?>");
						Cookies.set('axip_wizardSteps',"<?php echo count($wizardSteps)-1; ?>");
						Cookies.set('axip_courseCost',"<?php echo ($paymentAmount); ?>");
						Cookies.set('axip_payment_option',"<?php echo ($payment_option); ?>");
						Cookies.set('axip_allow_multiple',"<?php echo ($axip_allow_multiple_signup); ?>");
						Cookies.set('axip_allow_returning_users',"<?php echo ($axip_allow_returning_users); ?>");
						Cookies.set('axip_returning_user_method',"<?php echo ($axip_returning_user_method); ?>");
						Cookies.set('axip_success_message', "<?php echo $axip_success_message ?>");
						
					    $("#enrolment_wizard").smartWizard({
							transitionEffect:'slide',
							contentCache:false,
							hideButtonsOnDisabled: true,
							includePreviousButton:false,
							onLeaveStep:leaveAStepCallback,
							onShowStep:loadStep,
							onFinish:onFinishCallback,
							keyNavigation: false,
							noForwardJumping: true,
							contentURL:'<?php echo admin_url( 'admin-ajax.php' ); ?>',
							contentURLData:contentURLDataCallback,
							
						});
	
						
	
					    /*
					     * Loading all the step content from ajax
					     *
					     */
						
					    function contentURLDataCallback(step){
							
							var stepName =$('#step-'+step).find('h2.StepTitle').html();
							
							return {data:{
									'step_number':step,
									'action':'axip_getwizard_content',
									'stepName':stepName,
									'postID':<?php echo $post->ID; ?>,
									'paymentAmount':<?php echo $paymentAmount ?>,
									'data':<?php echo json_encode($_REQUEST); ?>,
									//'cookie': encodeURIComponent(document.cookie)
									'cookie': (document.cookie)
								}
							};
						
					    }
					    function ajaxComplete(){
					    	if(jQuery.active < 1){
					    		$("#axip_ajaxLoader").hide();
							}
							else{
								$(document).one('ajaxStop', function(){
									ajaxComplete();
								});
							}
						}
					    function loadStep(obj, context){
					    	ajaxComplete();
					    	
					    	var stepName =$('#step-'+context.toStep).find('h2.StepTitle').html();
					    	var stepNumber = context.toStep;
					    	var step = $('#step-'+stepNumber);
					    	if(stepName == 'Student Details'){
						    	step.on('input, change', function(){
							    	
						    		checkRequiredFieldsComplete(stepNumber);
						    	});
						    	step.on('keyup', function(){
						    		checkRequiredFieldsComplete(stepNumber);
						    	});
						    	checkRequiredFieldsComplete(stepNumber);
						    	var axip_multipage_contact_form = Cookies.get('axip_multipage_contact_form');
						    	if(axip_multipage_contact_form == 1){
							    	if($('.multipageNext').length){
							    		$('.multipageNext').show();
								    }
							    	else{
							    		var multiPageButton = $('.buttonNext').clone();
										multiPageButton.addClass('multipageNext');
										multiPageButton.insertBefore( $('.buttonNext') );
										multiPageButton.on('click', function(e){
											e.preventDefault();
											if($('#axip_form_enrolment').valid()){
												console.log('should be showing next');
												Cookies.set('axip_current_wizard_page', 2);
												$("#axip_page_1").hide();
												$("#axip_page_2").show();	
											}
										});
								    }
							    	
							    }
						    }
					    	else{
						    	$('.multipageNext').remove();
					    	}
	
						    if(stepName == "invoice" || stepName == "payment"){
						    	discountsAvailable = <?php echo $discountsAvailable?> == 1;
								if(discountsAvailable){
									var numOfStudents = Cookies.get('axip_numOfStudents');
									displayConcessions = numOfStudents == 1;
									setupDiscountDisplay(displayConcessions, true);	
									
														    
								}
						    }
						}
						function checkRequiredFieldsComplete(stepNumber){
							console.log('checking fields');
							var step = $('#step-'+stepNumber);
							step.data('next-button-enable', true);
							step.find('#axip_page_1:visible, #axip_page_2:visible').find('select[required]:visible, textarea[required]:visible, input[required]:visible').each(function(){
								if( $(this).val() == null || $(this).val() == ""){
	
									step.data('next-button-enable', false);
									$(this).valid();
								}
								else{
									if($(this).attr('type') == 'date'){
										var id = $(this).attr('id');
										$('#' + id + '-error').hide();
									}
								}
							});
							if( step.data('next-button-enable') ){
								$('.buttonNext').show();
							}
							else{
								$('.buttonNext').hide();
							}
							var axip_multipage_contact_form = Cookies.get('axip_multipage_contact_form');
					    	if(axip_multipage_contact_form == 1){
								var current_page = Cookies.get('axip_current_wizard_page');
								if (current_page == 1){
					    			$('.buttonNext').hide();
					    			if( step.data('next-button-enable') ){
					    				$('.multipageNext').show();
					    			}
								}
								else{
									$('.multipageNext').hide();
								}
					    		
						    }
							
							
						}
						function multipage_contact_form_handler(stepNumber){
							var axip_multipage_contact_form = Cookies.get('axip_multipage_contact_form');
							var current_page = Cookies.get('axip_current_wizard_page');
							if (current_page == 1 && axip_multipage_contact_form == 1){
								if( $('#axip_form_enrolment').valid() ){
									Cookies.set('axip_current_wizard_page', 2);
									$("#axip_page_1").hide();
									$("#axip_page_2").show();	
								}
	
							}
						}
					    	
					     function leaveAStepCallback(obj, context){
						
							var stepName =$('#step-'+context.fromStep).find('h2.StepTitle').html();		
							Cookies.set('axip_stepNumber',context.fromStep);
							
							if (stepName == 'Login' || stepName == 'User') {
								
								var payerID = Cookies.get('axip_payerID');
								
								if (axip_new_user  == 1) {
									return true;
								}
								
								if (typeof payerID !== "undefined") {
									return true;
								}
								
								var loginData={};
								if( stepName == 'User' )
								{
									loginData.action   = 'axip_user_login';
									loginData.username = jQuery('#username').val();
								}
								else
								{
									loginData.action   = 'axip_login_action';
								}
								
							
								loginData.email    = $('#email').val();
								loginData.password = $('#password').val();
								
							    $.ajax({
									type: "POST",
									url: '<?php echo admin_url( 'admin-ajax.php' ); ?>',
									dataType: 'JSON',
									data: loginData,
									beforeSend: function( xhr ) {
										$("#axip_ajaxLoader").show();
									},
									success: function(result) {
										var contactData;
	
										
										if( stepName == 'User' )
										{
											contactData = result;
											if(contactData.STATUS == 'Error')
											{
												result.error = true;
											}
											
										}
										else
										{
											contactData = result[0];
										}
										
										$("#axip_ajaxLoader").hide();		
										
										if (result.length == 0) {
	
										    $("#axip_login_error").html('Invalid login details').show();
										    									
										}
	
										else if(result.error){
	
											if(result.resultBody != undefined)
											{
										     	$("#axip_login_error").html(result.resultBody.DETAILS).show();
										    }
											else
											{
												 $("#axip_login_error").html('Invalid login details').show();
											}
	
										}
	
										else{
	
										  // set cookie
								
											Cookies.set('axip_payerID', contactData.CONTACTID);
											if( stepName != 'User' )
											{
												Cookies.set('axip_payerName', contactData.GIVENNAME+' '+contactData.SURNAME);
											}
										  	axip_allow_multiple = Cookies.get('axip_allow_multiple');
	
										  	/*Returning user and multiple enrol is disabled - skip entering details*/
										  	if(axip_allow_multiple == 0)
										  	{
										  		Cookies.set('axip_numOfStudents', 1);
										  		var studenContactIDs = Cookies.get('studenContactIDs');
	
												if (typeof studenContactIDs == 'undefined') {
												    var contactids = [];
												    contactids.push(contactData.CONTACTID);
												    Cookies.set('studenContactIDs', contactids.join(','));
	
	
												    payment_option = Cookies.get('axip_payment_option');
												    paymentAmount= Cookies.get(' axip_courseCost');
												    
												    /*free payments and contact is defined - perform the enrolment*/
										     		if(payment_option=="free" || paymentAmount == 0) {
							                      		enrolCourse('free'); //perform the enrolment
							                      		$('.buttonNext').hide();
							                      		return false;
							    					}
										     		else
										     		{
										     			$("#enrolment_wizard").smartWizard('goToStep', 3);
										     			setupDiscountDisplay(true, true);
										     		}
												}
											}
										  	else
											{
										  		$("#enrolment_wizard").smartWizard('goForward');
										  	}
										  
										}
										
									}
	
								});
							
							}
	
							else if (stepName == 'Register') {
								
								var numOfStudents 		= $('#numOfStudents').val();
								var includePayer 		= $('#includePayer').val();
		
								Cookies.set('axip_numOfStudents', numOfStudents);
								Cookies.set('axip_includePayer', includePayer);
								var payerID = Cookies.get('axip_payerID');
								
								/*Check to see if the first contact should be a payer - will already be set if returning*/
								if (typeof payerID == 'undefined')
								{
									firstContactIsPayerOnly = includePayer == 0;
									if($("#step-2 .StepTitle").text() == "Student Details"){
										$("#step-2 .StepTitle").hide();
										$("<h2 id='temp-title'></h2").insertAfter('#step-2 .StepTitle');
										$("#temp-title").append("Enter Your Own Details");
									}
									else if($("#step-3 .StepTitle").text() == "Student Details"){
										$("#step-3 .StepTitle").hide();
										$("<h2 id='temp-title'></h2").insertAfter('#step-3 .StepTitle');
										$("#temp-title").append("Enter Your Own Details");
									}
									
								}
								
								/*If only enroling 1 student and it is the payer and you are a returning user*/
								if (numOfStudents == 1 && includePayer == 1 && typeof payerID != 'undefined') {
									var studenContactIDs = Cookies.get('studenContactIDs');
	
									if (typeof studenContactIDs == 'undefined') {
									    var contactids = [];
									    contactids.push(payerID);
							     		Cookies.set('studenContactIDs', contactids.join(','));
	
							     		payment_option = Cookies.get('axip_payment_option');
							     		paymentAmount= Cookies.get(' axip_courseCost');
							     		
							     		/*free payments and contact is defined - perform the enrolment*/
							     		if(payment_option=="free" || paymentAmount == 0) {
				                      		enrolCourse('free'); //perform the enrolment
				                      		$('.buttonNext').hide();
				                      		return false;
				    					}
							     		else
							     		{
							     			
							     			$("#enrolment_wizard").smartWizard('goToStep', 4);
							     			return false;
							     		}
									}
									
									return true;
								}
								else if(includePayer == 1 && typeof payerID != 'undefined' &&  numOfStudents > 1)
								{
									/*If enroling a payer, returning user AND more than 1 student being enrolled*/
									/*payer has been identified by logging in*/
									var studenContactIDs = Cookies.get('studenContactIDs');
									
									if (typeof studenContactIDs == 'undefined') {
									    var contactids = [];
									    contactids.push(payerID);
							     		Cookies.set('studenContactIDs', contactids.join(','));
							     		
							     	}
									 return true;
								}
								/*Not including the payer, or no returning user*/
								else{
									
								    return true;    
								}
									
								//code
							}
							else if (stepName == 'Student Details') {
								
								
								/*At this point if a returning user who is included in payment 
								has been sent through there will be a contact in the cookie - so only an additional student will be created*/
								var studenContactIDs = Cookies.get('studenContactIDs');
								var studyReason = null;
								
								if(jQuery('#axip_study_reason_nat').length){
									studyReason = jQuery('#axip_study_reason_nat').val();
								}
								else if(jQuery('#axip_study_reason_wa').length){
									studyReason = jQuery('#axip_study_reason_wa').val();
								}
								if(studyReason != null && studyReason != ""){
									Cookies.set('axip_studyReason', studyReason);
								}
								
								
								if (typeof studenContactIDs == 'undefined') {
								    var contactids = [];
								}
								else{
								    var contactids = studenContactIDs.split(',');    
								}
	
								var numOfStudents = Cookies.get('axip_numOfStudents');
								var includePayer = $('#includePayer').val();
								
								var axip_multipage_contact_form = Cookies.get('axip_multipage_contact_form');
								var num_contacts = contactids.length;
	
								
								var payerID = Cookies.get('axip_payerID');
								
								if(firstContactIsPayerOnly){
									$("#temp-title").hide();
									$("#step-3 .StepTitle").show();
	
									/*Generate Learner account for Payer to use with returning user option*/
									if(Cookies.get('axip_allow_returning_users') == 1 && Cookies.get('axip_returning_user_method') == 'User' && typeof payerID != 'undefined'){
										name = Cookies.get('axip_payerName').split(' ').join('_');
										var userCreateData = {};
										userCreateData.action = 'axip_user_create_action';
										userCreateData.contactID = payerID;
										userCreateData.username = name;
										$.ajax({
												type: "POST",
												url: '<?php echo admin_url( 'admin-ajax.php' ); ?>',
												dataType: 'JSON',
												data: userCreateData,
												beforeSend: function( xhr ) {
												},
												success: function(result) {
													}
										});
										
									}
									
									
								}
								/*New student - no multiple, or this would be set*/
								if (typeof numOfStudents =="undefined") {
																	
									if (includePayer == 0) {
										numOfStudents = parseInt(numOfStudents);
									}
									else{
									    num_enrol_students = 1;
									    numOfStudents = 1;
									}
									
									Cookies.set('axip_numOfStudents', numOfStudents);
									
								}
								var current_page = Cookies.get('axip_current_wizard_page');
	
								/*handles if it's time to switch to the next step*/
								if (parseInt(numOfStudents) <= num_contacts) {
								     return true;
								}
								
								if (current_page == 1 && axip_multipage_contact_form == 1){
									console.log('should be showing next');
									if($('#axip_form_enrolment').valid()){
										console.log('should be showing next');
										Cookies.set('axip_current_wizard_page', 2);
										$("#axip_page_1").hide();
										$("#axip_page_2").show();	
									}
									return false;
								}
								else {								   
	
									payment_option = Cookies.get('axip_payment_option');
									if(payment_option == 'free'){
										/*Don't need to submit the form - the "Finish" button will handle it*/
									}
									else {
										$('#axip_form_enrolment').submit();
										
									}
	
									
								}
																    
								
	
							}
	
							else if (stepName == 'Invoice') {
	
								var invoice = $("#axip_invoice").val();	
								
								if ($('#axip_invoiceForm').valid()) {
	
								    if (invoice == 'payNinv') {
	
								    	discountsAvailable = <?php echo $discountsAvailable?> == 1;
										if(discountsAvailable)
										{
								    	//continue to the payment step
									    	jQuery('#axip_discounts_holder').insertAfter('#axip_paymentForm ul');
									    	revisedPriceHolder = jQuery('#axip_revised_price');
									    	if(revisedPriceHolder.length)
									    	{
									    		revisedPriceHolder.insertAfter('#axip_paymentForm .axip_course_cost');
									    	}
									    	else
									    	{
									    		revisedPrice = jQuery('<li id="axip_revised_price" />');
									    		revisedPrice.insertAfter('#axip_paymentForm .axip_course_cost');
										    }
										}
									    return true;
								    }
	
								    else if (invoice == 'invOnly') {							    
									    //No payment needed - so action the enrolment
									    enrolCourse('invoice');
									    return false;	
								    }
								}
	
	
							}
		
						}
	
						/*When finish button is pressed run the following*/
						function onFinishCallback(objs, context){
							var stepName =$('#step-'+context.fromStep).find('h2.StepTitle').html();
	
							/*Finish button is on the invoice step - meaning no payment needed*/
							if (stepName == 'Invoice') {
							    if ($('#axip_invoiceForm').valid()) {
									enrolCourse('invoice');
							    }
	
							}
							/*free bookings need to handle the submit of the detail here*/
							else if (stepName == 'Student Details') {
								axip_allow_multiple = Cookies.get('axip_allow_multiple');
								 payment_option = Cookies.get('axip_payment_option');
								if(payment_option == 'free')
								{
									 $('#axip_form_enrolment').submit();	
								}
								else
								{
									//should not have a finish button
								}
							   
							}						
	
							else{
							    $('#axip_paymentForm').submit();
							   
							    //alert("Thankyou for Registering");
							}
	
						}
	
						function setupDiscountDisplay(displayConcessions, displayPromoCode){
							/*Creation of Contacts Complete, display discount options.*/
							discounts.action.setupDiscountDisplay(displayConcessions, displayPromoCode, 
							<?php echo $instanceID?>, '<?php echo $courseType?>', '<?php echo admin_url( 'admin-ajax.php' ); ?>') ;
						}
						
						function enrolCourse(bookingType){
	
							console.log("attempting to enrol...");
	
						    var enrolData			= {};
						    
						    var studenContactIDs	= Cookies.get('studenContactIDs');
						    var payerID 			= Cookies.get('axip_payerID');
						    var students 			= Cookies.get('axip_numOfStudents');
						    if (typeof students == 'undefined'){
								students = 1;
							    }
						    enrolData.action   		= 'axip_enrolCourse_action';
						    enrolData.contactID 	= studenContactIDs;
						    enrolData.payerID 		= payerID;
						    enrolData.instanceID 	= '<?php echo $instanceID; ?>';
						    enrolData.courseType 	= '<?php echo $courseType; ?>';
						    enrolData.invoiceID 	= 0;
							
							/*override for free bookings*/
							if(bookingType == 'free'){
								enrolData.generateInvoice = 0;
							}
							else
							{
								discountsAvailable = <?php echo $discountsAvailable?> == 1;
								if(discountsAvailable)
								{
									discountsData = jQuery('#axip_discounts_holder').data('discounts');
									if (typeof discountsData != 'undefined'){
										cost = discountsData.REVISEDPRICE * students;
										enrolData.discountIDList = discounts.action.getDiscountsApplied();
										enrolData.discountCost = discountsData.REVISEDPRICE;
									} 
								}
								var financeOverride = "<?php echo $axip_add_financecode_override?>";
								var financeOverrideDefault = "<?php echo $axip_financecode_default?>";
								var financeOverrideCategory = "<?php echo $axip_financecode_category?>";
								if(financeOverride != null){
									if(financeOverride == "override_category"){
										var categorySelected = Cookies.get('axip_category_option');
										if(categorySelected != null){
											if(categorySelected == 1 && financeOverrideCategory != null  && financeOverrideCategory != "0"){
												enrolData.finCodeID = parseInt(financeOverrideCategory, 10);
											}
											else if (categorySelected == 0 && financeOverrideDefault != null  && financeOverrideDefault != "0"){
												enrolData.finCodeID = parseInt(financeOverrideDefault, 10);
											}
	
										}
									}
									else if (financeOverride == "override_default"){
										if ( financeOverrideDefault != null && financeOverrideDefault != "0" ){
											enrolData.finCodeID = parseInt(financeOverrideDefault, 10);
										}
									}
								}
	
								
							}
							studyReason = Cookies.get('axip_studyReason')
							if(typeof studyReason != 'undefined'){
								enrolData.StudyReasonID = studyReason;
							}
							
						    $.ajax({
								type: "POST",
								url: '<?php echo admin_url( 'admin-ajax.php' ); ?>',
								dataType: 'JSON',
								data: enrolData,
								beforeSend: function( xhr ) {
									$("#axip_ajaxLoader").show();
								},
								success: function(result) {
									console.log(result);
									$("#axip_ajaxLoader").hide();
									//if (typeof result !=="undefined" && typeof result.MSG !="undefined") {
	
									if (result && typeof result !=="undefined" && typeof result.MSG !=="undefined") {
	
									    $('#axip_enrol_response').show();                              
									    $('#axip_enrol_response').find('.alert').removeClass(function(){
										return this.className.split(' ').filter(function(className) {
										return className.match(/alert-\D/)}).join(' ');
									    }).addClass('alert-danger').html(result.MSG);
	
									}
	
									else if(result && typeof result.error !== 'undefined'){
	
									    $('#axip_enrol_response').show();                              
									    $('#axip_enrol_response').find('.alert').removeClass(function(){
	
											return this.className.split(' ').filter(function(className) {
	
												return className.match(/alert-\D/)}).join(' ');
										    
										}).addClass('alert-danger').html(result.resultBody.MESSAGES);
	
									}
	
									else if(result && typeof result.INVOICEID !== 'undefined'){
									
										$('#axip_enrol_response').show();                              
										$('#axip_enrol_response').find('.alert').removeClass(function(){
	
										    	return this.className.split(' ').filter(function(className) {
	
										    		return className.match(/alert-\D/)}).join(' ');
	
	
										}).addClass('alert-success').html("<?php echo $axip_success_message; ?>");										
										$('#enrolment_wizard').hide();										
									
									}
									else if (result && typeof result[0] !== 'undefined')
									{
										if(typeof result[0].INVOICEID !== 'undefined')
										{
											$('#axip_enrol_response').show();                              
											$('#axip_enrol_response').find('.alert').removeClass(function(){
	
										    		return this.className.split(' ').filter(function(className) {
	
										    			return className.match(/alert-\D/)}).join(' ');
	
											}).addClass('alert-success').html("<?php echo $axip_success_message; ?>");										
											$('#enrolment_wizard').hide()
									}
									}
								   
								}
	
							});
							    
						}
	
	
				
						
					});
			    </script>
	
	<!-- Tabs -->
	
	<div id="axip_enrol_response" style="display: none;">
		<div class="alert alert-success"></div>
	</div>
	
	<div id="enrolment_wizard" class="swMain">
	
		<p class="overlay" id="axip_ajaxLoader" style="display: none;">
			<img src="<?php echo AXIP_PLUGIN_URL.'/images/loader.gif'; ?>"
				alt="loading...">
		</p>
	
		<ul>
				    
				<?php
			
			foreach ( $wizardSteps as $step => $stepName ) {
				
				if ($step != 0) {
					
					?> 
				
				    <li><a href="#step-<?php echo $step; ?>"> <span
					class="stepNumber"><?php echo $step; ?></span> <span
					class="stepDesc">
					   Step <?php echo $step; ?><br /> <small><?php echo $stepName; ?></small>
				</span>
			</a></li>
				<?php } } ?>
	
	  			</ul>
			    
			    
	  			<?php
			
			foreach ( $wizardSteps as $step => $stepName ) {
				if ($step != 0) {
					?> 
				
				<div id="step-<?php echo $step; ?>">
			<h2 class="StepTitle"><?php echo $stepName; ?></h2>
			<div class="enrolment_steps"></div>
		</div>
				
				<?php  } } ?>
			
			</div>
	
	<!-- End SmartWizard Content -->
	
	<?php
		}
		echo '<div class="ax-post-content">';
		echo do_shortcode ( apply_filters ( 'the_content', $post->post_content ) );
		echo '</div>';
		echo '</div>';
	}
}
?>
