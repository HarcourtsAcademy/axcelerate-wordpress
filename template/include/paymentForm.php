<?php
/*--------------------------------------------*
 * Securing the plugin
 *--------------------------------------------*/

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/*--------------------------------------------*/
global $cardTypeArrayAMEX, $cardTypeArrayDefault,$courseType,$instanceID,$axipCookie,$formSettings;


$numOfStudents 				= $axipCookie['axip_numOfStudents'];
$includePayer 				= $axipCookie['axip_includePayer'];
$payerID 					= $axipCookie['axip_payerID'];
$payerName 					= $axipCookie['axip_payerName'];
$studenContactIDs 			= $axipCookie['studenContactIDs'];
$axip_num_enrol_students 	= $axipCookie['axip_numOfStudents'];
$paymentAmount 				= $axipCookie['axip_courseCost'];
$axip_success_message		= $axipCookie['axip_success_message'];

$category_option			= $axipCookie['axip_category_option'];

$paymentAmount 				= $paymentAmount * $numOfStudents;
$axip_settings              = get_option('axip_general_settings');
$payment_option             = $axip_settings['payment_options'];
$discountsAvailable			= $axip_settings['axip_discounts_available'];
$cardTypes 					= $axip_settings['axip_card_types'];


$axip_add_financecode_override = $formSettings['_axip_add_financecode_override'];

$axip_financecode_default = $formSettings['_axip_financecode_default'];
$axip_financecode_category = $formSettings['_axip_financecode_category'];


?>

<h2 class="StepTitle">Payment</h2>
<div class="enrolment_steps">

    <form id="axip_paymentForm">
        
        <div class="alert alert-danger" role="alert" style="display: none;" id="axip_payment_error"></div>    
       
            <ul>
                <li>Payer Name : <?php echo urldecode($payerName); ?> </li>
                <li class="axip_course_cost">Amount : <?php echo ax_money_format($paymentAmount); ?></li>
            </ul>
            
           	<?php 
           	/* Check to see if the paymentOption is "payment" and the discount fields were thus not added by invoiceForm.php*/
           	if($discountsAvailable == 1 && $payment_option=="payment"){ ?>
		    	<div id="axip_discounts_holder">
		    		<div id="axip_discounts_concessions_holder" style="display:none">
		    			<h4><?php echo __('Concessions Available: '); ?></h4>
						<div class="form-group" id="concessions"></div>
					</div>
					<div class="form-group" id="promo">
						<label for="axip_promo_code">PromoCode:</label>
		  				<input type="text" class="form-control" id="axip_promo_code">
					</div>
					<button type="button" class="btn btn-primary" id="calculate_discounts" data-discounts-retrieved="0">Calculate Discount</button>
				</div>
    <?php } ?>
            
                        
        <div class="form-group">
            <label label-default="" class="control-label mandatory">Card Type</label>
            <div class="controls">
                <select class="form-control" name="cardType">
                    <?php 
                    if($cardTypes == 1){
                    	foreach($cardTypeArrayAMEX as $key=>$row){
                        	echo '<option value="'.$key.'">'.$row.'</option>';
                    	}
                    }
                    else{
                    	foreach($cardTypeArrayDefault as $key=>$row){
                        	echo '<option value="'.$key.'">'.$row.'</option>';
                    	}
                    }?>
                </select>
            </div>
        </div>
                    
                    <div class="form-group">
                        <label label-default="" class="control-label mandatory">Card Holder's Name</label>
                        <div class="controls">
                            <input class="form-control" pattern="\w+ \w+.*" name="nameOnCard" title="Please enter first and last name" required="required" type="text">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label label-default="" class="control-label mandatory">Card Number</label>
                        <div class="controls">
                            <div class="row">
                                <div class="col-md-12">
                                    <input class="form-control" autocomplete="off" name="cardNumber" title="Please enter 16-digit card number" required="required" type="text">
                                </div>
             
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label label-default="" class="control-label mandatory">Card Expiry Date</label>
                        <div class="controls">
                            <div class="row">
                                <div class="col-lg-6">
                                    <select class="form-control" name="expiryMonth">
                                    
                                    	<option value="01">January</option>
                                    	<option value="02">February</option>
                                    	<option value="03">March</option>
                                    	<option value="04">April</option>
                                    	<option value="05">May</option>
                                    	<option value="06">June</option>
                                    	<option value="07">July</option>
                                    	<option value="08">August</option>
                                    	<option value="09">September</option>
                                    	<option value="10">October</option>
                                    	<option value="11">November</option>
                                    	<option value="12">December</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <select class="form-control" name="expiryYear">
                                        <?php
                                         $currentYear = date("Y");
                                         for($y=$currentYear;$y<= $currentYear+20; $y++){
                                            echo '<option value="'.$y.'">'.$y.'</option>';
                                         }                                
                                        ?>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label label-default="" class="control-label mandatory">Card CVV</label>
                        <div class="controls">
                            <div class="row">
                                <div class="col-md-4">
                                    <input class="form-control" name="cardCCV" autocomplete="off" maxlength="3" pattern="\d{3}" title="Three digits at back of your card" required="" type="text">
                                </div>
                                <div class="col-md-8"></div>
                            </div>
                        </div>
                    </div>     
        
            <input type="hidden" name="payerID" id="payerID" value="<?php echo $payerID;  ?>"  />
            <input type="hidden" name="studenContactIDs" id="studenContactIDs" value="<?php echo $studenContactIDs; ?>"  />
            <input type="hidden" name="paymentAmount" id="paymentAmount" value="<?php echo $paymentAmount; ?>" />
            <input type="hidden" name="instanceID" id="instanceID" value="<?php echo $instanceID; ?>"  />
            <input type="hidden" name="courseType" id="courseType" value="<?php echo $courseType; ?>" />
            <input type="hidden" name="action" id="action" value="axip_payment_action" />
            <?php if($axip_add_financecode_override == "override_category") {
            	if($category_option == 1){?>
            		<input type="hidden" name="finCodeID" id="finCodeID" value="<?php echo $axip_financecode_category;  ?>"  />
            	
            	<?php } else if($category_option == 0){ ?>
            		<input type="hidden" name="finCodeID" id="finCodeID" value="<?php echo $axip_financecode_default;  ?>"  />
            	<?php } ?>
            <?php } ?>
            <?php if($axip_add_financecode_override == "override_default") {?>
            	
            	<input type="hidden" name="finCodeID" id="finCodeID" value="<?php echo $axip_financecode_default;  ?>"  />
            	
            <?php } ?>
             
            </form>

</div>

<script type="text/javascript">
	
    jQuery(function($){
    	discountsAvailable = <?php echo $discountsAvailable?> == 1;
    	if (discountsAvailable){
			concessions = Cookies.get('axip_numOfStudents') == 1;
			discounts.action.setupDiscountDisplay(concessions, true, 
					<?php echo $instanceID?>, '<?php echo $courseType?>', '<?php echo admin_url( 'admin-ajax.php' ); ?>') ;
			if(jQuery.active < 1){
				jQuery("#calculate_discounts").trigger( "click" );
			}
			else{
				jQuery(document).one('ajaxStop', function(){
					jQuery("#calculate_discounts").trigger( "click" );
				});
			}
    	}
        $('#axip_paymentForm').validate({
            submitHandler: function() {
				data = $('#axip_paymentForm').serialize();
				discountsAvailable = <?php echo $discountsAvailable?> == 1;
				axip_success_message = "<?php echo  $axip_success_message ?>";

				var students 			= Cookies.get('axip_numOfStudents');
			    if (typeof students == 'undefined'){
					students = 1;
				    }
				if(discountsAvailable)
				{
					
					discountsData = jQuery('#axip_discounts_holder').data('discounts');
					if (typeof discountsData != 'undefined'){
						cost = discountsData.REVISEDPRICE * students;
						$('#axip_paymentForm #paymentAmount').val(cost);
						data = $('#axip_paymentForm').serializeArray();
						
						discountIDList = discounts.action.getDiscountsApplied();
						data.push({name: 'discountIDList', value: discountIDList });
						
						studyReason = Cookies.get('axip_studyReason');
						if(typeof studyReason != 'undefined'){
							data.push({name: 'StudyReasonID', value: studyReason });
						}
						
						
						discountCost = discountsData.REVISEDPRICE;
						data.push({name: 'discountCost', value: discountCost });
						data = $.param(data);
						
					}
					else{
						
						
						studyReason = Cookies.get('axip_studyReason');
						if(typeof studyReason != 'undefined'){
							data = $('#axip_paymentForm').serializeArray();
							data.push({name: 'StudyReasonID', value: studyReason });
							data = $.param(data);
						}
					}
				}
				else{
					studyReason = Cookies.get('axip_studyReason');
					if(typeof studyReason != 'undefined'){
						data = $('#axip_paymentForm').serializeArray();
						data.push({name: 'StudyReasonID', value: studyReason });

						data = $.param(data);
					}
					
				}
				$.ajax({
					type: "POST",
					url: '<?php echo admin_url( 'admin-ajax.php' ); ?>',
					dataType: 'JSON',
					data: data,
					beforeSend: function( xhr ) {
						$("#axip_ajaxLoader").show();
					},
					success: function(result) {
						$("#axip_ajaxLoader").hide();
						if (typeof result.payment.STATUS == 'undefined' || result.payment.STATUS == false ) {

							/*Likely to have thrown an error, process and build error message*/
							var errorMessage = "";
							if (typeof result.payment.MESSAGE != 'undefined' ) {
								errorMessage += result.payment.MESSAGE;
								if(typeof result.payment.resultBody != 'undefined'){
									if(typeof result.payment.resultBody.MESSAGES != 'undefined'){
										errorMessage += "<br/>" + result.payment.resultBody.MESSAGES;
									}
									if(typeof result.payment.resultBody.DETAILS != 'undefined'){
										errorMessage += "<br />" + typeof result.payment.resultBody.DETAILS;
									}
								}
							}
							if (typeof result.payment.message != 'undefined' ) {
								errorMessage += result.payment.message;
								if(typeof result.payment.resultBody != 'undefined'){
									if(typeof result.payment.resultBody.MESSAGES != 'undefined'){
										errorMessage += "<br/>" + result.payment.resultBody.MESSAGES;
									}
									if(typeof result.payment.resultBody.DETAILS != 'undefined'){
										errorMessage += "<br />" + result.payment.resultBody.DETAILS;
									}
								}
							}
							if(errorMessage == ""){
								$("#axip_payment_error").show().html("An unknown error occurred with your payment, please contact us to complete your booking.");
							}
							else{
								$("#axip_payment_error").show().html(errorMessage);
							}
						}
						else if(result.payment.STATUS == true && typeof result.payment.INVOICEID != 'undefined'){
							/*Payment has been successful - check for any issues with enrol*/
							errorMessage = "Your payment was successful but there was an error with your enrolment, please contact us to complete your booking";
							if(typeof result.enrolment != 'undefined'){
								if(typeof result.enrolment.resultBody != 'undefined'){
									if(typeof result.enrolment.resultBody.ERROR != 'undefined'){
										if(result.enrolment.resultBody.ERROR){
											
											errorMessage += "<br/>" + result.enrolment.resultBody.DETAILS;
											errorMessage += "<br/>" + result.enrolment.resultBody.MESSAGES;
											$("#axip_payment_error").show().html(errorMessage);
										}
										else{
											$('#axip_enrol_response').show();
											$('#axip_enrol_response').find('.alert').removeClass(function(){
												return this.className.split(' ').filter(function(className) {
													return className.match(/alert-\D/)}).join(' ');
												}).addClass('alert-success').html(result.payment.MESSAGE + '<br/>' + axip_success_message);
											$('#enrolment_wizard').hide();
										}
									
									}
									
								}
								else if( typeof result.enrolment.INVOICEID != 'undefined'){
									$('#axip_enrol_response').show();
									$('#axip_enrol_response').find('.alert').removeClass(function(){
										return this.className.split(' ').filter(function(className) {
											return className.match(/alert-\D/)}).join(' ');
										}).addClass('alert-success').html(result.payment.MESSAGE + '<br/>' + axip_success_message);
									$('#enrolment_wizard').hide();

								}
								else{
									$("#axip_payment_error").show().html(errorMessage);
								}
								
							}
							else{
								/*No enrolment details were found in response - assume error*/
								$("#axip_payment_error").show().html(errorMessage);
							}
							
						

						}
					}
				});          
            }
        });    
            
    });
</script>