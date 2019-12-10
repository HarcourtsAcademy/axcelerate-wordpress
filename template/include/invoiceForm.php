<?php
/*--------------------------------------------*
 * Securing the plugin
 *--------------------------------------------*/

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/*--------------------------------------------*/

global $instanceID,$courseType,$axipCookie;

$numOfStudents              = (!empty($axipCookie['axip_numOfStudents'])?$axipCookie['axip_numOfStudents']:1);
$includePayer               = $axipCookie['axip_includePayer'];
$payerID                    = $axipCookie['axip_payerID'];
$payerName                  = $axipCookie['axip_payerName'];
$studenContactIDs           = $axipCookie['studenContactIDs'];
$axip_num_enrol_students    = (!empty($axipCookie['axip_numOfStudents'])?$axipCookie['axip_numOfStudents']:1);
$paymentAmount              = $axipCookie['axip_courseCost'];

$paymentAmount              = $paymentAmount * $numOfStudents;

$courseName                 = urldecode($axipCookie['axip_courseName']);

$axip_settings              = get_option('axip_general_settings');
$payment_option             = $axip_settings['payment_options'];
$discountsAvailable			= $axip_settings['axip_discounts_available'];

?>

<h2 class="StepTitle">Invoice</h2>
<div class="enrolment_steps">
   <form id="axip_invoiceForm">
    <p><?php echo __('Payment and Invoicing'); ?></p>

 
    <ul>
        
        <?php if(isset($payerName)) { ?>
        <li><?php echo __('Payer Name: '); ?> <?php echo urldecode($payerName); ?> </li>
        <?php }?>
	<li class="axip_course_cost"><?php echo __('Amount: '); ?> <?php echo ax_money_format($paymentAmount); ?></li>
    </ul>
    <?php if($discountsAvailable == 1){ ?>
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
    
    <?php if(($payment_option=="both" || $payment_option=="payment") && $paymentAmount > "0"){ ?>
    <div class="form-group">
      <label class="mandatory" for="axip_invoice"><?php echo __('Please select an invoicing option'); ?></label>
            <select class="form-control" name="invoice" id="axip_invoice" required>
               <option value=''><?php echo __('-- Please select --'); ?></option>
               <option value='invOnly'><?php echo __('Send an invoice only'); ?></option>
               <?php if(($payment_option=="both" || $payment_option=="payment") && $paymentAmount > 0){ ?>
                <option value='payNinv'><?php echo __('Pay by credit card and send tax invoice/receipt'); ?></option>
               <?php } ?>
           </select>
    </div>
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
        var axip_invoiceForm = $('#axip_invoiceForm').validate();
    });
</script>
