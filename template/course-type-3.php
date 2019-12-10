<?php

// FILE NOTES:
//
// Filename: course-type-3.php
// Course Enquiry Page

/*--------------------------------------------*
 * Securing the plugin
 *--------------------------------------------*/

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/*--------------------------------------------*/
	global $AxcelerateAPI;
    $formSettings                       = get_post_meta( $post->ID, '_axip_enquiry_formsettings', true );
    
    $axip_headertext                    = $formSettings['_axip_headertext'];
    $axip_use_iframe                    = $formSettings['_axip_use_iframe'];
    $axip_clientId                      = $formSettings['_axip_clientId'];
    $axip_captcha_display 	            = $formSettings['_axip_captcha_display'];
    
    $axip_success_message               = (!empty($formSettings['_axip_success_message'])?$formSettings['_axip_success_message']:'Thank you. We will get back to you as soon as possible.');
    $axip_multipage_contact_form        = $formSettings['_axip_multipage_contact_form'];	
    $axip_enquiry_noteid                = $formSettings['_axip_enquiry_noteid'];
    $axip_enquiry_email_list            = $formSettings['_axip_enquiry_email_list'];
    
    $courseType                         = sanitize_text_field( $_REQUEST['type'] );
    $ID                                 = sanitize_text_field( $_REQUEST['ID'] );

    $axip_contact_personal 	            = get_post_meta( $post->ID, '_axip_enquiry_contact_personal', true );
    
    $axip_given_name 	                = (!empty($axip_contact_personal['_axip_given_name'])?$axip_contact_personal['_axip_given_name']:'2');				
    $axip_middle_name 	                = (!empty($axip_contact_personal['_axip_middle_name'])?$axip_contact_personal['_axip_middle_name']:'');
    $axip_preferred_name 	            = (!empty($axip_contact_personal['_axip_preferred_name'])?$axip_contact_personal['_axip_preferred_name']:'');
    $axip_last_name 	                = (!empty($axip_contact_personal['_axip_last_name'])?$axip_contact_personal['_axip_last_name']:'2');
    $axip_email 		                = (!empty($axip_contact_personal['_axip_email'])?$axip_contact_personal['_axip_email']:'2');
    $axip_dob 		                    = (!empty($axip_contact_personal['_axip_dob'])?$axip_contact_personal['_axip_dob']:'');
    $axip_usi	 	                    = (!empty($axip_contact_personal['_axip_usi'])?$axip_contact_personal['_axip_usi']:'');
    $axip_lui	 	                    = (!empty($axip_contact_personal['_axip_lui'])?$axip_contact_personal['_axip_lui']:'');
    $axip_sex	 	                    = (!empty($axip_contact_personal['_axip_sex'])?$axip_contact_personal['_axip_sex']:'');
    $axip_home_phone 	                = (!empty($axip_contact_personal['_axip_home_phone'])?$axip_contact_personal['_axip_home_phone']:'');;
    $axip_postal_address 	            = (!empty($axip_contact_personal['_axip_postal_address'])?$axip_contact_personal['_axip_postal_address']:'');
    $axip_street_address 	            = (!empty($axip_contact_personal['_axip_street_address'])?$axip_contact_personal['_axip_street_address']:'');
    $axip_organisation 	                = (!empty($axip_contact_personal['_axip_organisation'])?$axip_contact_personal['_axip_organisation']:'');
    $axip_position	 	                = (!empty($axip_contact_personal['_axip_position'])?$axip_contact_personal['_axip_position']:'');
    $axip_work_phone 	                = (!empty($axip_contact_personal['_axip_work_phone'])?$axip_contact_personal['_axip_work_phone']:'');
    $axip_mobile_phone 	                = (!empty($axip_contact_personal['_axip_mobile_phone'])?$axip_contact_personal['_axip_mobile_phone']:'');
    $axip_fax	 	                    = (!empty($axip_contact_personal['_axip_fax'])?$axip_contact_personal['_axip_fax']:'');
    
    $axip_city_of_birth					= (!empty($axip_contact_personal['_axip_city_of_birth'])?$axip_contact_personal['_axip_city_of_birth']:'');
    
    $axip_avetmiss_additional           = get_post_meta( $post->ID, '_axip_enquiry_avetmiss_additional', true );
            
    $axip_emergency_contact	 	        = (!empty($axip_avetmiss_additional['_axip_emergency_contact'])?$axip_avetmiss_additional['_axip_emergency_contact']:'');
    $axip_citizenship_status 	        = (!empty($axip_avetmiss_additional['_axip_citizenship_status'])?$axip_avetmiss_additional['_axip_citizenship_status']:'');
    $axip_employment	 	            = (!empty($axip_avetmiss_additional['_axip_employment'])?$axip_avetmiss_additional['_axip_employment']:'');
    $axip_language		 	            = (!empty($axip_avetmiss_additional['_axip_language'])?$axip_avetmiss_additional['_axip_language']:'');
    $axip_education_status	 	        = (!empty($axip_avetmiss_additional['_axip_education_status'])?$axip_avetmiss_additional['_axip_education_status']:'');
    $axip_disability_status	 	        = (!empty($axip_avetmiss_additional['_axip_disability_status'])?$axip_avetmiss_additional['_axip_disability_status']:'');
    $axip_aboriginal_tsi_status 	    = (!empty($axip_avetmiss_additional['_axip_aboriginal_tsi_status'])?$axip_avetmiss_additional['_axip_aboriginal_tsi_status']:'');
    $axip_contact_source	 	        = (!empty($axip_avetmiss_additional['_axip_contact_source'])?$axip_avetmiss_additional['_axip_contact_source']:'');
    $axip_contact_source_array				=  $AxcelerateAPI->getContactSources();
    
    
    global $stateArray,$AVETMISScountryArray,$AVETMISSlanguages,$genderArray,$citizenship_statusArray,$language_fluency_array,$boolArray,$education_status_array,$employement_status_array,$IndigenousStatusArray,$contactSourceArray,$DisabilitiesArray,$education_prior_array;

    global $AxcelerateForm;

?>

<div class="ax-wrap">

	<?php echo do_shortcode(apply_filters( 'the_content',$post->post_content)); ?>
<div id="axip_api_response" style="display: none;"><div class="alert alert-success"></div></div>

<?php

    $formType = 'enquiry';
                
    require_once(AXIP_PLUGIN_DIR.'template/include/_form.php');

if(!empty($axip_multipage_contact_form)) {
    
?>

<script type="text/javascript">
    Cookies.set('axip_multipage_contact_form',1);
</script>

<?php } ?>

</div>





