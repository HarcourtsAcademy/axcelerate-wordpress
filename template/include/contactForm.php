<?php
/*--------------------------------------------*
 * Securing the plugin
 *--------------------------------------------*/

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/*--------------------------------------------*/

	global $axip_contact_personal, $axip_avetmiss_additional, $formSettings,$courseType,$instanceID,$learningActivity, $AxcelerateAPI;
	
    $axip_given_name 						= (!empty($axip_contact_personal['_axip_given_name'])?$axip_contact_personal['_axip_given_name']:'2');				
    $axip_middle_name 						= (!empty($axip_contact_personal['_axip_middle_name'])?$axip_contact_personal['_axip_middle_name']:'');
    $axip_preferred_name 					= (!empty($axip_contact_personal['_axip_preferred_name'])?$axip_contact_personal['_axip_preferred_name']:'');
    $axip_last_name 						= (!empty($axip_contact_personal['_axip_last_name'])?$axip_contact_personal['_axip_last_name']:'2');
    $axip_email 							= (!empty($axip_contact_personal['_axip_email'])?$axip_contact_personal['_axip_email']:'2');
    $axip_dob 								= (!empty($axip_contact_personal['_axip_dob'])?$axip_contact_personal['_axip_dob']:'');
    
    $axip_usi	 							= (!empty($axip_contact_personal['_axip_usi'])?$axip_contact_personal['_axip_usi']:'');
    $axip_city_of_birth	 					= (!empty($axip_contact_personal['_axip_city_of_birth'])?$axip_contact_personal['_axip_city_of_birth']:'');
    
    $axip_lui	 							= (!empty($axip_contact_personal['_axip_lui'])?$axip_contact_personal['_axip_lui']:'');
    $axip_sex	 							= (!empty($axip_contact_personal['_axip_sex'])?$axip_contact_personal['_axip_sex']:'');
    $axip_home_phone 						= (!empty($axip_contact_personal['_axip_home_phone'])?$axip_contact_personal['_axip_home_phone']:'');;
    $axip_postal_address 					= (!empty($axip_contact_personal['_axip_postal_address'])?$axip_contact_personal['_axip_postal_address']:'');
    $axip_street_address 					= (!empty($axip_contact_personal['_axip_street_address'])?$axip_contact_personal['_axip_street_address']:'');
    $axip_organisation 						= (!empty($axip_contact_personal['_axip_organisation'])?$axip_contact_personal['_axip_organisation']:'');

    $axip_industry_of_employment 			= (!empty($axip_contact_personal['_axip_industry_of_employment'])?$axip_contact_personal['_axip_industry_of_employment']:'');
    $axip_occupation_identifier 			= (!empty($axip_contact_personal['_axip_occupation_identifier'])?$axip_contact_personal['_axip_occupation_identifier']:'');
    
    $axip_position	 						= (!empty($axip_contact_personal['_axip_position'])?$axip_contact_personal['_axip_position']:'');
    $axip_work_phone 						= (!empty($axip_contact_personal['_axip_work_phone'])?$axip_contact_personal['_axip_work_phone']:'');
    $axip_mobile_phone 						= (!empty($axip_contact_personal['_axip_mobile_phone'])?$axip_contact_personal['_axip_mobile_phone']:'');
    $axip_fax	 							= (!empty($axip_contact_personal['_axip_fax'])?$axip_contact_personal['_axip_fax']:'');
    
    $axip_study_reason_nat	 	        	= (!empty($axip_avetmiss_additional['_axip_study_reason_nat'])?$axip_avetmiss_additional['_axip_study_reason_nat']:'');
    $axip_study_reason_wa	 	        	= (!empty($axip_avetmiss_additional['_axip_study_reason_wa'])?$axip_avetmiss_additional['_axip_study_reason_wa']:'');
    
    $axip_emergency_contact	 	        	= (!empty($axip_avetmiss_additional['_axip_emergency_contact'])?$axip_avetmiss_additional['_axip_emergency_contact']:'');
    $axip_citizenship_status 	        	= (!empty($axip_avetmiss_additional['_axip_citizenship_status'])?$axip_avetmiss_additional['_axip_citizenship_status']:'');
    $axip_employment	 					= (!empty($axip_avetmiss_additional['_axip_employment'])?$axip_avetmiss_additional['_axip_employment']:'');
    $axip_language		 					= (!empty($axip_avetmiss_additional['_axip_language'])?$axip_avetmiss_additional['_axip_language']:'');
    $axip_education_status	 	       		= (!empty($axip_avetmiss_additional['_axip_education_status'])?$axip_avetmiss_additional['_axip_education_status']:'');
    $axip_disability_status	 	        	= (!empty($axip_avetmiss_additional['_axip_disability_status'])?$axip_avetmiss_additional['_axip_disability_status']:'');
    $axip_aboriginal_tsi_status             = (!empty($axip_avetmiss_additional['_axip_aboriginal_tsi_status'])?$axip_avetmiss_additional['_axip_aboriginal_tsi_status']:'');
    $axip_contact_source	 	        	= (!empty($axip_avetmiss_additional['_axip_contact_source'])?$axip_avetmiss_additional['_axip_contact_source']:'');
    $axip_contact_source_array				=  $AxcelerateAPI->getContactSources();    
    
	$axip_success_message 		 			= $formSettings['_axip_success_message'];
	$axip_multipage_contact_form 	        = $formSettings['_axip_multipage_contact_form'];
	$axip_entrolment_closed_message         = $formSettings['_axip_entrolment_closed_message'];
	
	$axip_allow_multiple_signup 	        = $formSettings['_axip_allow_multiple_signup'];
	$axip_allow_returning_users 	        = $formSettings['_axip_allow_returning_users'];
	$axip_returning_user_method 			= $formSettings['_axip_returning_user_method'];
	
	$axip_add_category_method				= $formSettings['_axip_add_category_method'];
	$axip_contact_categories				= $formSettings['_axip_contact_categories'];
	$axip_category_option_label				= $formSettings['_axip_category_option_label'];
	
	$axip_headertext 						= $formSettings['_axip_headertext'];
	$axip_use_iframe 						= $formSettings['_axip_use_iframe'];
	$axip_clientId 							= $formSettings['_axip_clientId'];		
	$axip_captcha_display 					= $formSettings['_axip_captcha_display'];
	
	$axip_settings              			= get_option('axip_general_settings');
	$axip_training_organisation				= $axip_settings['axip_training_organisation'];
        
        global $stateArray,$AVETMISScountryArray,$AVETMISSlanguages,$genderArray,$citizenship_statusArray,$language_fluency_array,$studyReasonNationalArray,$studyReasonWAArray,
        $boolArray,$education_status_array,$employement_status_array,$IndigenousStatusArray,$contactSourceArray,$DisabilitiesArray,$education_prior_array,$occupationIdentifierArray,$industryOfEmploymentArray;

	global $AxcelerateForm,$axipCookie;

?>
<h2 class="StepTitle">Student Details</h2>
<div class="enrolment_steps">
	
        <div id="contact_error"></div>	
        <?php
                $formType = 'enrolment';
                require_once(AXIP_PLUGIN_DIR.'template/include/_form.php');
        ?>

</div>



