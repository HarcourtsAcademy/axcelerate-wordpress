<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */

?>

<form id="axip_form_<?php echo $formType; ?>"
	name="axip_form_<?php echo $formType; ?>" method="post">

	<div id="axip_page_1">

		<h4><?php echo __("Personal Details"); ?></h4>
  <?php if(!empty($axip_given_name)) { ?>  
    <div class="form-group">
			<label for="axip_given_name"><?php echo __('Given Name'); ?></label>
			<input type="text" class="form-control" id="axip_given_name"
				name="axip_given_name"
				<?php echo ($axip_given_name == 2?'required="required"':''); ?> />
		</div>
  <?php } ?>
  
  <?php if(!empty($axip_preferred_name)) { ?>  
    <div class="form-group">
			<label for="axip_preferred_name"><?php echo __('Preferred Name'); ?></label>
			<input type="text" class="form-control" id="axip_preferred_name"
				name="axip_preferred_name"
				<?php echo ($axip_preferred_name == 2?'required="required"':''); ?> />
		</div>
  <?php } ?>
  
  <?php if(!empty($axip_middle_name)) { ?>  
    <div class="form-group">
			<label for="axip_middle_name"><?php echo __('Middle Name'); ?></label>
			<input type="text" class="form-control" id="axip_middle_name"
				name="axip_middle_name"
				<?php echo ($axip_middle_name == 2?'required="required"':''); ?> />
		</div>
  <?php } ?>
  
  <?php if(!empty($axip_last_name)) { ?>  
    <div class="form-group">
			<label for="axip_last_name"><?php echo __('Last Name'); ?></label> <input
				type="text" class="form-control" id="axip_last_name"
				name="axip_last_name"
				<?php echo ($axip_last_name == 2?'required="required"':''); ?> />
		</div>
  <?php } ?>
  
  <?php if(!empty($axip_dob)) { ?>  
    <div class="form-group">
			<label for="axip_dob"><?php echo __('Date of Birth (dd/mm/yyyy)'); ?></label>
			<input type="date" class="form-control" id="axip_dob"
				placeholder="dd/mm/yyyy" name="axip_dob"
				<?php echo ($axip_dob == 2?'required="required"':''); ?> />
		</div>
  <?php } ?>
  
  <?php if(!empty($axip_usi)) { ?>  
    <div class="form-group">
			<label for="axip_usi"><?php echo __('USI'); ?></label> <input
				type="text" class="form-control" id="axip_usi" name="axip_usi"
				<?php echo (($axip_usi == 2 || $axip_usi == 4)?'required="required"':''); ?> />
		</div>
   	<?php if($axip_usi == 3 || $axip_usi == 4) { ?> 
    <div class="form-group">
			<label name="axip_usi_disclaimer"><?php
				
echo __ ( ' By continuing I authorise ' . $axip_training_organisation . ' to apply, 
      		pursuant to sub-section 9(2) of the Student Identifiers Act 2014, for a USI on my behalf or verify my USI. I have read and I consent to the collection, 
      		use and disclosure of my personal information pursuant to the information detailed at: <a href="https://www.usi.gov.au/students/student-terms-and-conditions">www.usi.gov.au</a>' );
				?></label>
		</div>
     <?php } ?>
  <?php } ?>
  
  
  <?php if(!empty($axip_city_of_birth)) { ?>  
    <div class="form-group">
			<label for="axip_city_of_birth"><?php echo __('City Of Birth'); ?></label>
			<input type="text" class="form-control" id="axip_city_of_birth"
				name="axip_city_of_birth"
				<?php echo ($axip_city_of_birth == 2?'required="required"':''); ?> />
		</div>
  <?php } ?>
  
  <?php if(!empty($axip_lui)) { ?>  
    <div class="form-group">
			<label for="axip_lui"><?php echo __('LUI'); ?></label> <input
				type="text" class="form-control" id="axip_lui" name="axip_lui"
				<?php echo ($axip_lui == 2?'required="required"':''); ?> />
		</div>
  <?php } ?>

  <?php if(!empty($axip_sex)) { ?>  
    <div class="form-group">
			<label for="axip_sex"><?php echo __('Gender'); ?></label> <select
				class="form-control" id="axip_sex" name="axip_sex"
				<?php echo ($axip_sex == 2?'required="required"':''); ?>>
				<option value="">--Please select --</option>
        <?php foreach($genderArray as $key=>$row){ ?>
            <option value="<?php echo $key; ?>"><?php echo $row; ?></option>
        <?php } ?>        
      </select>
		</div>
  <?php } ?>


	<?php if($axip_add_category_method == 'all_category') { ?>
		<input id="axip_categoryids" type="hidden" name="axip_categoryids"
			value="<?php echo $axip_contact_categories?>" />
	<?php } ?>
	
	<?php if($axip_add_category_method == 'option_category') { ?>
	
	
		<div class="form-group">
			<label for="axip_category_option"><?php echo __($axip_category_option_label); ?></label>
			<select class="form-control" id="axip_category_option"
				name="axip_category_option">
				<option value="0">No</option>
				<option value="1">Yes</option>
			</select>
		</div>
		<input id="axip_categoryids" type="hidden" name="axip_categoryids"
			value="<?php echo $axip_contact_categories?>" />
	<?php } ?>



  <?php
		
		if ($axip_allow_returning_users == 1 && empty ( $axipCookie ['axip_payerID'] )) {
			?>
  
  <div id="axip_signup_wrap">
			<h4><?php echo __("Sign-in Details"); ?></h4>
		
		
		<?php if(!empty($axip_email)) { ?>
		  <div class="form-group">
				<label for="axip_email"><?php echo __('Email'); ?></label> <input
					type="email" class="form-control" id="axip_email" name="axip_email"
					<?php echo ($axip_email == 2?'required="required"':''); ?> />
			</div>
		<?php } ?>
		<?php if($axip_returning_user_method != 'User') { ?>
		  <div class="form-group">
				<label for="axip_password"><?php echo __('Password'); ?></label> <input
					type="password" class="form-control" id="axip_password"
					name="axip_password"
					placeholder="A mixture of at least 6 upper, lower case characters, numbers or symbols."
					required="required" />
			</div>

			<div class="form-group">
				<label for="axip_confirm_password"><?php echo __('Confirm password'); ?></label>
				<input type="password" class="form-control"
					id="axip_confirm_password" name="axip_confirm_password"
					placeholder="A mixture of at least 6 upper, lower case characters, numbers or symbols."
					required="required" />
			</div>  
		  <?php } ?>  
    </div>
  <?php } ?>

  <?php
		
		if ($axip_allow_returning_users == 1 && empty ( $axipCookie ['axip_payerID'] )) {
			
			$axip_email = '';
		}
		
		$contact_detail_fields = array_filter ( array (
				$axip_email,
				$axip_organisation,
				$axip_industry_of_employment,
				$axip_occupation_identifier,
				$axip_position,
				$axip_home_phone,
				$axip_mobile_phone,
				$axip_work_phone,
				$axip_fax 
		) );
		
		if (count ( $contact_detail_fields )) {
			?>

  <h4><?php echo __("Contact Details"); ?></h4>
  
  <?php if((!empty($axip_email) && $axip_allow_returning_users == 0) || (!empty($axip_email) && !empty($axipCookie['axip_payerID']))) { ?>  
    <div class="form-group" id="axip_email_wrap">
			<label for="axip_email"><?php echo __('Email'); ?></label> <input
				type="email" class="form-control" id="axip_email" name="axip_email"
				<?php echo ($axip_email == 2?'required="required"':''); ?> />
		</div>

  <?php } ?>
  
  <?php if(!empty($axip_organisation)) { ?>  
    <div class="form-group">
			<label for="axip_organisation"><?php echo __('Organisation'); ?></label>
			<input type="text" class="form-control" id="axip_organisation"
				name="axip_organisation"
				<?php echo ($axip_organisation == 2?'required="required"':''); ?> />
		</div>

  <?php } ?>
  
   <?php if(!empty($axip_industry_of_employment)) { ?>  
   	<div class="form-group">
			<label for="axip_industry_of_employment"><?php echo __('Industry of Employment'); ?></label>
			<select class="form-control axip_industry_of_employment"
				id="axip_industry_of_employment" name="axip_industry_of_employment"
				<?php echo ($axip_industry_of_employment == 2?'required="required"':''); ?>>
				<option value="">--Please select --</option>
        <?php foreach($industryOfEmploymentArray as $key=>$row) { ?>
            <option value="<?php echo $key; ?>"><?php echo $row; ?></option>

        <?php } ?>
        
      </select>

		</div>
  <?php } ?>
  
  <?php if(!empty($axip_occupation_identifier)) { ?>  
   	<div class="form-group">
			<label for="axip_occupation_identifier"><?php echo __('Occupation Type'); ?></label>
			<select class="form-control axip_occupation_identifier"
				id="axip_occupation_identifier" name="axip_occupation_identifier"
				<?php echo ($axip_occupation_identifier == 2?'required="required"':''); ?>>
				<option value="">--Please select --</option>
        <?php foreach($occupationIdentifierArray as $key=>$row) { ?>
            <option value="<?php echo $key; ?>"><?php echo $row; ?></option>

        <?php } ?>
        
      </select>

		</div>
  <?php } ?>
  
  <?php if(!empty($axip_position)) { ?>  
    <div class="form-group">
			<label for="axip_position"><?php echo __('Position'); ?></label> <input
				type="text" class="form-control" id="axip_position"
				name="axip_position"
				<?php echo ($axip_position == 2?'required="required"':''); ?> />
		</div>

  <?php } ?>
  
  <?php if(!empty($axip_home_phone)) { ?>  
    <div class="form-group">
			<label for="axip_home_phone"><?php echo __('Phone'); ?></label> <input
				type="text" class="form-control" id="axip_home_phone"
				name="axip_home_phone"
				<?php echo ($axip_home_phone == 2?'required="required"':''); ?> />
		</div>

  <?php } ?>

  <?php if(!empty($axip_mobile_phone)) { ?>  
    <div class="form-group">
			<label for="axip_mobile_phone"><?php echo __('Mobile'); ?></label> <input
				type="text" class="form-control" id="axip_mobile_phone"
				name="axip_mobile_phone"
				<?php echo ($axip_mobile_phone == 2?'required="required"':''); ?> />
		</div>

  <?php } ?>
    
  <?php if(!empty($axip_work_phone)) { ?>  
    <div class="form-group">
			<label for="axip_work_phone"><?php echo __('Work phone'); ?></label>
			<input type="text" class="form-control" id="axip_work_phone"
				name="axip_work_phone"
				<?php echo ($axip_work_phone == 2?'required="required"':''); ?> />
		</div>

  <?php } ?>  

  <?php if(!empty($axip_fax)) { ?>  
    <div class="form-group">
			<label for="axip_fax"><?php echo __('Fax'); ?></label> <input
				type="text" class="form-control" id="axip_fax" name="axip_fax"
				<?php echo ($axip_fax == 2?'required="required"':''); ?> />
		</div>

  <?php } ?>
  
   <?php } ?>
  
  <?php if(!empty($axip_street_address)) { ?>
  
  <h4><?php echo __("Street Address Details"); ?></h4>

		<div class="form-group">
			<label for="axip_street_address1"><?php echo __('Address line 1'); ?></label>
			<input type="text" class="form-control axip-street-address"
				id="axip_street_address1" name="axip_street_address1"
				<?php echo ($axip_street_address == 2?'required="required"':''); ?> />
		</div>

		<div class="form-group">
			<label for="axip_street_address2"><?php echo __('Address line 2'); ?></label>
			<input type="text" class="form-control" id="axip_street_address2"
				name="axip_street_address2" />
		</div>

		<div class="form-group">
			<label for="axip_street_city"><?php echo __('City/Suburb'); ?></label>
			<input type="text" class="form-control axip-street-address"
				id="axip_street_city" name="axip_street_city"
				<?php echo ($axip_street_address == 2?'required="required"':''); ?> />
		</div>

		<div class="form-group">
			<label for="axip_street_state"><?php echo __('State'); ?></label> <select
				class="form-control axip-street-address" id="axip_street_state"
				name="axip_street_state"
				<?php echo ($axip_street_address == 2?'required="required"':''); ?>>
				<option value="">--Please select --</option>
        <?php foreach($stateArray as $key=>$row) { ?>
            <option value="<?php echo $key; ?>"><?php echo $row; ?></option>

        <?php } ?>        
      
      </select>

		</div>

		<div class="form-group">
			<label for="axip_street_postcode"><?php echo __('Postcode'); ?></label>
			<input type="text" class="form-control" id="axip_street_postcode"
				name="axip_street_postcode"
				<?php echo ($axip_street_address == 2?'required="required"':''); ?> />
		</div>

		<div class="form-group">
			<label for="axip_street_country"><?php echo __('Country'); ?></label>

			<select class="form-control" id="axip_street_country"
				name="axip_street_country"
				<?php echo ($axip_street_address == 2?'required="required"':''); ?>>
				<option value="">--Please select --</option>
        <?php foreach($AVETMISScountryArray as $key=>$row) { ?>
            <option value="<?php echo $row->SHORTNAME; ?>"><?php echo $row->SHORTNAME; ?></option>

        <?php } ?>
        
      </select>

		</div>   

  <?php } ?>
  
  <?php if(!empty($axip_postal_address)) { ?>
 
    <h4><?php echo __("Postal Address Details"); ?></h4>

		<div class="form-group">
			<input type="checkbox" id="same_as_street_address" value="1" /> <label
				for="same_as_street_address"><?php echo __('Same as street address'); ?></label>
		</div>

		<div id="axip_postal_address_wrap">

			<div class="form-group">
				<label for="axip_postal_address1"><?php echo __('Address line 1'); ?></label>
				<input type="text" class="form-control axip-postal-address"
					id="axip_postal_address1" name="axip_postal_address1"
					<?php echo ($axip_postal_address == 2?'required="required"':''); ?> />
			</div>

			<div class="form-group">
				<label for="axip_postal_address2"><?php echo __('Address line 2'); ?></label>
				<input type="text" class="form-control" id="axip_postal_address2"
					name="axip_postal_address2" />
			</div>

			<div class="form-group">
				<label for="axip_postal_city"><?php echo __('City/Suburb'); ?></label>
				<input type="text" class="form-control axip-postal-address"
					id="axip_postal_city" name="axip_postal_city"
					<?php echo ($axip_postal_address == 2?'required="required"':''); ?> />
			</div>

			<div class="form-group">
				<label for="axip_postal_state"><?php echo __('State'); ?></label> <select
					class="form-control axip-postal-address" id="axip_postal_state"
					name="axip_postal_state"
					<?php echo ($axip_postal_address == 2?'required="required"':''); ?>>
					<option value="">--Please select --</option>
        <?php foreach($stateArray as $key=>$row) { ?>
            <option value="<?php echo $key; ?>"><?php echo $row; ?></option>

        <?php } ?>
        
      </select>

			</div>

			<div class="form-group">
				<label for="axip_postal_postcode"><?php echo __('Postcode'); ?></label>
				<input type="text" class="form-control" id="axip_postal_postcode"
					name="axip_postal_postcode" />
			</div>

			<div class="form-group">
				<label for="axip_postal_country"><?php echo __('Country'); ?></label>
				<select class="form-control" id="axip_postal_country"
					name="axip_postal_country">
					<option value="">--Please select --</option>
        <?php foreach($AVETMISScountryArray as $key=>$row) { ?>
            <option value="<?php echo $row->SHORTNAME; ?>"><?php echo $row->SHORTNAME; ?></option>

        <?php } ?>  

      </select>
			</div>
		</div>

  <?php } ?>
  
</div>

	<!-- second page -->

	<div id="axip_page_2">
  
  <?php if($formType != 'enquiry'){ ?>
  	
		<?php if(!empty($axip_study_reason_nat)) { ?>  
			<div class="form-group">
			<label for="axip_study_reason_nat"><?php echo __('Reason For Study'); ?></label>
			<select class="form-control axip_study_reason_nat"
				id="axip_study_reason_nat" name="axip_study_reason_nat"
				<?php echo ($axip_study_reason_nat == 2?'required="required"':''); ?>>
				<option value="">--Please select --</option>
					<?php foreach($studyReasonNationalArray as $key=>$row) { ?>
						<option value="<?php echo $key; ?>"><?php echo $row; ?></option>

					<?php } ?>
        
				</select>

		</div>
		<?php } ?>
		<?php if(!empty($axip_study_reason_wa)) { ?>  
			<div class="form-group">
			<label for="axip_study_reason_wa"><?php echo __('Reason For Study'); ?></label>
			<select class="form-control axip_study_reason_wa"
				id="axip_study_reason_wa" name="axip_study_reason_wa"
				<?php echo ($axip_study_reason_wa == 2?'required="required"':''); ?>>
				<option value="">--Please select --</option>
					<?php foreach($studyReasonWAArray as $key=>$row) { ?>
						<option value="<?php echo $key; ?>"><?php echo $row; ?></option>

					<?php } ?>
        
				</select>

		</div>
		<?php } ?>
	<?php } ?>
  
  <?php if(!empty($axip_emergency_contact)) { ?>
  
    <h4><?php echo __("Emergency Contact Details"); ?></h4>

		<div class="form-group">
			<label for="axip_emergency_contact_name"><?php echo __('Name'); ?></label>
			<input type="text" class="form-control"
				id="axip_emergency_contact_name" name="axip_emergency_contact_name"
				<?php echo ($axip_emergency_contact == 2?'required="required"':''); ?> />
		</div>

		<div class="form-group">
			<label for="axip_emergency_contact_relationship"><?php echo __('Relationship'); ?></label>
			<input type="text" class="form-control"
				id="axip_emergency_contact_relationship"
				name="axip_emergency_contact_relationship"
				<?php echo ($axip_emergency_contact == 2?'required="required"':''); ?> />
		</div>

		<div class="form-group">
			<label for="axip_emergency_contact_phone"><?php echo __('Phone'); ?></label>
			<input type="text" class="form-control"
				id="axip_emergency_contact_phone"
				name="axip_emergency_contact_phone"
				<?php echo ($axip_emergency_contact == 2?'required="required"':''); ?> />
		</div>
    
  <?php } ?>
  
  <?php if(!empty($axip_citizenship_status)) { ?>
  
    <h4><?php echo __("Additional Citizenship Details"); ?></h4>

		<div class="form-group">
			<label for="axip_citizenship_birthcountry"><?php echo __('Country of Birth'); ?></label>
			<select class="form-control" id="axip_citizenship_birthcountry"
				name="axip_citizenship_birthcountry"
				<?php echo ($axip_citizenship_status == 2?'required="required"':''); ?>>
				<option value="">--Please select --</option>
        <?php foreach($AVETMISScountryArray as $key=>$row) { ?>
            <option value="<?php echo $row->SACCCODE; ?>"><?php echo $row->SHORTNAME; ?></option>
        <?php } ?>         
      </select>
		</div>

		<div class="form-group">
			<label for="axip_citizenship_status"><?php echo __('Citizenship Status'); ?></label>
			<select class="form-control" id="axip_citizenship_status"
				name="axip_citizenship_status"
				<?php echo ($axip_citizenship_status == 2?'required="required"':''); ?>>
				<option value="">--Please select --</option>
        <?php foreach($citizenship_statusArray as $key=>$row) { ?>
            <option value="<?php echo $key; ?>"><?php echo $row; ?></option>
        <?php } ?>      
      </select>
		</div>

		<div class="form-group">
			<label for="axip_citizenship_country"><?php echo __('Country of Citizenship'); ?></label>
			<select class="form-control" id="axip_citizenship_country"
				name="axip_citizenship_country"
				<?php echo ($axip_citizenship_status == 2?'required="required"':''); ?>>
				<option value="">--Please select --</option>
        <?php foreach($AVETMISScountryArray as $key=>$row) { ?>
            <option value="<?php echo $row->SACCCODE; ?>"><?php echo $row->SHORTNAME; ?></option>
        <?php } ?>       
      </select>
		</div>
    
  <?php } ?>
  
  <?php if(!empty($axip_language)) { ?>  
    <h4><?php echo __("Additional Language Details"); ?></h4>

		<div class="form-group">
			<label for="axip_language"><?php echo __('Language spoken at home'); ?></label>
			<select class="form-control" id="axip_language" name="axip_language"
				<?php echo ($axip_language == 2?'required="required"':''); ?>>
				<option value="">--Please select --</option>
        <?php foreach($AVETMISSlanguages as $key=>$row) { ?>
            <option value="<?php echo $row->SACCCODE; ?>"><?php echo $row->LANGUAGENAME; ?></option>

        <?php } ?> 

      </select>
		</div>

		<div class="form-group">
			<label for="axip_language_fluency"><?php echo __('How well do you communicate in English?'); ?></label>
			<select class="form-control" id="axip_language_fluency"
				name="axip_language_fluency"
				<?php echo ($axip_language == 2?'required="required"':''); ?>>
				<option value="">--Please select --</option>
        <?php foreach($language_fluency_array as $key=>$row) { ?>
            <option value="<?php echo $key; ?>"><?php echo $row; ?></option>
        <?php } ?>       
      </select>
		</div>

		<div class="form-group">
			<label for="axip_language_assistance"><?php echo __('Is English language assistance required?'); ?></label>
			<select class="form-control" id="axip_language_assistance"
				name="axip_language_assistance"
				<?php echo ($axip_language == 2?'required="required"':''); ?>>
				<option value="">--Please select --</option>
        <?php foreach($boolArray as $key=>$row) { ?>
            <option value="<?php echo $key; ?>"><?php echo $row; ?></option>
        <?php } ?>       
      </select>
		</div>    
    
  <?php } ?>

  <?php if(!empty($axip_education_status)) { ?>
  
    <h4><?php echo __("Educational History"); ?></h4>

		<div class="form-group">
			<label for="axip_education_level"><?php echo __('What is your highest school level completed?'); ?></label>
			<select class="form-control" id="axip_education_level"
				name="axip_education_level"
				<?php echo ($axip_education_status == 2?'required="required"':''); ?>>
				<option value="">--Please select --</option>
        <?php foreach($education_status_array as $key=>$row) { ?>
            <option value="<?php echo $key; ?>"><?php echo $row; ?></option>
        <?php } ?>       
      </select>
		</div>

		<div class="form-group" id="axip_education_level_pair"
			style="display: none;">
			<label for="axip_education_level_year"><?php echo __('In which year did you complete that level? (yyyy)'); ?></label>
			<input type="text" class="form-control"
				name="axip_education_level_year" id="axip_education_level_year"
				required="required" />
		</div>

		<div class="form-group">
			<label for="axip_education_school"><?php echo __('Are you currently attending secondary school?'); ?></label>
			<select class="form-control" id="axip_education_school"
				name="axip_education_school"
				<?php echo ($axip_education_status == 2?'required="required"':''); ?>>
				<option value="">--Please select --</option>
        <?php foreach($boolArray as $key=>$row) { ?>
            <option value="<?php echo $key; ?>"><?php echo $row; ?></option>
        <?php } ?>       
      </select>
		</div>

		<div class="form-group" id="axip_education_school_pair"
			style="display: none;">
			<label for="axip_education_school_name"><?php echo __('If yes please provide the name of the school/institution'); ?></label>
			<input type="text" class="form-control"
				name="axip_education_school_name" id="axip_education_school_name"
				required="required" />
		</div>


		<div class="form-group">
			<label for="axip_education_prior"><?php echo __('Have you successfully completed any higher education?'); ?></label>
			<select class="form-control" id="axip_education_prior"
				name="axip_education_prior"
				<?php echo ($axip_education_status == 2?'required="required"':''); ?>>
				<option value="">--Please select --</option>
        <?php foreach($boolArray as $key=>$row) { ?>
            <option value="<?php echo $key; ?>"><?php echo $row; ?></option>
        <?php } ?>       
      </select>
		</div>

		<div class="form-group" id="axip_education_prior_pair"
			style="display: none;">
			<label><?php echo __('If yes, please indicate below. Select all that apply'); ?></label>
        <?php foreach($education_prior_array as $key=>$row) { ?>
        		<div class="checkbox">
				<label for="axip_education_prior_pair_<?php echo $key; ?>"> <input
					type="checkbox" class="form-control"
					name="axip_education_prior_pair[]"
					id="axip_education_prior_pair_<?php echo $key; ?>"
					value="<?php echo $key; ?>" /> <?php echo $row; ?></label>
			</div>
        <?php } ?>       		
		
	</div>	

  <?php } ?>
  
<?php

$additional_fileds = array_filter ( array (
		$axip_employment,
		$axip_disability_status,
		$axip_aboriginal_tsi_status,
		$axip_contact_source 
) );

if (count ( $additional_fileds )) {
	
	?>

  <h4><?php echo __("Additional Details"); ?></h4>
<?php } ?>
  
  <?php if(!empty($axip_employment)) { ?>
  
    <div class="form-group">
			<label for="axip_employment"><?php echo __('Employment Status'); ?></label>
			<select class="form-control" id="axip_employment"
				name="axip_employment"
				<?php echo ($axip_employment == 2?'required="required"':''); ?>>
				<option value="">--Please select --</option>
        <?php foreach($employement_status_array as $key=>$row){ ?>
            <option value="<?php echo $key; ?>"><?php echo $row; ?></option>
        <?php } ?>       
      </select>
		</div>

  <?php } ?>

  <?php if(!empty($axip_disability_status)) { ?>
  
    <div class="form-group">
			<label for="axip_disability_status"><?php echo __('Do you consider yourself to have a disability, impairment or long term condition?'); ?></label>
			<select class="form-control" id="axip_disability_status"
				name="axip_disability_status"
				<?php echo ($axip_disability_status == 2?'required="required"':''); ?>>
				<option value="">--Please select --</option>
        <?php foreach($boolArray as $key=>$row) { ?>
            <option value="<?php echo $key; ?>"><?php echo $row; ?></option>
        
        <?php } ?>       
      </select>
		</div>

		<div class="form-group" id="axip_disability_status_pair"
			style="display: none;">
			<label><?php echo __('If yes, please indicate below. Select all that apply'); ?></label>
        <?php foreach($DisabilitiesArray as $key=>$row) { ?>
				<div class="checkbox">
				<label for="axip_disability_type_<?php echo $key; ?>"> <input
					type="checkbox" class="form-control" name="axip_disability_type[]"
					id="axip_disability_type_<?php echo $key; ?>"
					value="<?php echo $key; ?>" /> <?php echo $row; ?></label>
			</div>
        
        <?php } ?>       		
		
	</div>

  <?php } ?>
  
  <?php if(!empty($axip_aboriginal_tsi_status)) { ?>
  
    <div class="form-group">
			<label for="axip_aboriginal_tsi_status"><?php echo __('Are you of Aboriginal or Torres Strait Islander origin?'); ?></label>
			<select class="form-control" id="axip_aboriginal_tsi_status"
				name="axip_aboriginal_tsi_status"
				<?php echo ($axip_aboriginal_tsi_status == 2?'required="required"':''); ?>>
				<option value="">--Please select --</option>
        <?php foreach($IndigenousStatusArray as $key=>$row) { ?>
            <option value="<?php echo $key; ?>"><?php echo $row; ?></option>

        <?php } ?> 

      </select>
		</div>
    
  <?php } ?>
  
  <?php if(!empty($axip_contact_source)) { ?>

      <div class="form-group">
			<label for="axip_contact_source"><?php echo __('How did you hear about us?'); ?></label>
			<select class="form-control" id="axip_contact_source"
				name="axip_contact_source"
				<?php echo ($axip_contact_source == 2?'required="required"':''); ?>>
				<option value="">--Please select --</option>
        <?php foreach($axip_contact_source_array as $key=>$row) { ?>
            <option value="<?php echo $row->SOURCECODEID; ?>"><?php echo $row->SOURCE; ?></option>

        <?php } ?>       

      </select>
		</div>    

  <?php } ?>
  
   <?php if($formType == 'enquiry'){ ?>
      <div class="form-group">
			<label for="axip_comments"><?php echo __('COMMENTS'); ?></label>
			<textarea class="form-control" id="axip_comments"
				name="axip_comments"></textarea>
		</div>
      
   <?php } ?>
  
  <?php
		
		if ($axip_captcha_display == 'yes') {
			
			$captcha_instance = new ReallySimpleCaptcha ();
			
			$word = $captcha_instance->generate_random_word ();
			$captchaPrefix = mt_rand ();
			$captcha_image = $captcha_instance->generate_image ( $captchaPrefix, $word );
			?>
  
	<img src="<?php echo AXIP_CAPTCHA_PATH.$captcha_image; ?>"
			alt="captcha" /> <label for="captchaValue" class="mandatory"><?php echo __('Enter Text here'); ?></label>
		<input type="text" name="captchavalue" id="captchaValue"
			required="required" /> <input type="hidden" name="captchaPrefix"
			id="captchaPrefix" value="<?php echo $captchaPrefix;  ?>" />
  
  <?php } ?>
  
  <?php wp_nonce_field('axcelerate_enquiry_form','axcelerate_enquiry_form'); ?>

   <input type="hidden" name="action" value="axip_contact_action" /> <input
			type="hidden" name="learningActivityID" id="learningActivityID"
			value="<?php echo $instanceID; ?>" /> <input type="hidden"
			name="learningActivity" id="learningActivity"
			value="<?php echo $learningActivity[$courseType]; ?>" /> <input
			type="hidden" name="formType" value="<?php echo $formType; ?>" />

	</div>
 
  <?php if($formType == 'enquiry') { ?>
   	<div class="ax-enquire-submit-holder">
		<input type="hidden" name="ID" value="<?php echo $ID; ?>" /> <input
			type="hidden" name="type" value="<?php echo $courseType; ?>" /> <input
			type="hidden" name="noteCodeID"
			value="<?php echo $axip_enquiry_noteid; ?>" /> <input type="hidden"
			name="emailTo" value="<?php echo $axip_enquiry_email_list; ?>" />
		<button type="button" class="btn btn-default" id="next_enquiry"
			name="next_enquiry">Next</button>
		<button type="submit" class="btn btn-primary" id="submit_enquiry"
			name="submit_enquiry">Submit</button>
	</div>
  <?php } ?>
	
	
</form>

<script type="text/javascript">

jQuery(function($){
	
	var axip_multipage_contact_form = Cookies.get('axip_multipage_contact_form');
	if (axip_multipage_contact_form == 1) {
		
		Cookies.set('axip_current_wizard_page',1);
		$("#axip_page_2").hide();
		$("#axip_page_1").slideDown();
		
		$("#submit_enquiry").hide();
	}
	else{
	       $("#submit_enquiry").show();
	       $("#next_enquiry").hide();
	}
	
	 $(document).on("click","#next_enquiry",function(){
	  
	  if($('#axip_form_enquiry').valid()){

	       Cookies.set('axip_current_wizard_page',2);
	       $("#submit_enquiry").show();
	       $("#next_enquiry").hide();
	       $("#next_enquiry").hide();
	       
	       $("#axip_page_2").slideDown();
		     $("#axip_page_1").hide();
	    
	  }
	});
	
	$('#axip_form_enrolment').validate({
		rules: {
		  axip_password: "required",
		  axip_confirm_password: { equalTo: "#axip_password"},
		},
    
		submitHandler: function(form) {

			
			studyReason = null;
			if(jQuery('#axip_study_reason_nat').length){
				studyReason = jQuery('#axip_study_reason_nat').val();
			}
			else if(jQuery('#axip_study_reason_wa').length){
				studyReason = jQuery('#axip_study_reason_wa').val();
			}
			if(studyReason != null && studyReason != ""){
				Cookies.set('axip_studyReason', studyReason);
			}
			var lastContact = null;
			var lastContactCall = new Date();
			if(sessionStorage.last_contact != null){
					lastContact = sessionStorage.last_contact;
					lastContactCall = new Date(sessionStorage.last_contact_call)
			}
			var currentContact = $('#axip_form_enrolment').serialize();

			var sameCall = lastContact === currentContact;
			var timeStamp = new Date();
			timeStamp = timeStamp.setMinutes(timeStamp.getMinutes() -1)

			if(! (sameCall && lastContactCall > timeStamp) ){
				sessionStorage.last_contact_call = new Date();
				sessionStorage.last_contact = currentContact;
				$.ajax({
					type: "POST",
					url: '<?php echo admin_url( 'admin-ajax.php' ); ?>',
					dataType: 'JSON',
					data: $('#axip_form_enrolment').serialize(),
					
	        beforeSend: function( xhr ) {
						$("#axip_ajaxLoader").show();
					},
					
	        success: function(result) {
					  $("#axip_ajaxLoader").hide();
					  var num_enrol_students = Cookies.get('axip_numOfStudents');
					  var axip_stepNumber = Cookies.get('axip_stepNumber');
					  var payerID = Cookies.get('axip_payerID');
					  if (typeof result.error !="undefined" && result.error ==1) {
						   $("#contact_error").html('<div class="alert alert-danger" role="alert">'+result.message+'</div>');
						   $('html, body').animate({
						     scrollTop: $("#contact_error").offset().top
						   }, 2000);
						   $('.buttonNext').show();				
					  }

					  else if (typeof result.contact.error !="undefined" && result.contact.error ==500 ) {
						   $("#contact_error").html('<div class="alert alert-danger" role="alert">'+result.contact.message+'</div>');
						   $('html, body').animate({
						     scrollTop: $("#contact_error").offset().top
						   }, 2000);	
					  }
					  else if ( typeof result.contact.error !="undefined" ) {
						   $("#contact_error").html('<div class="alert alert-danger" role="alert">'+result.contact.message+': ' + result.contact.resultBody.DETAILS + '</div>');
						   $('html, body').animate({
						     scrollTop: $("#contact_error").offset().top
						   }, 2000);	
					  }

					  else if (typeof result.contact !="undefined") {
					      var contactID               	 	= result.contact.CONTACTID;
					      var wizardSteps             		= Cookies.get('axip_wizardSteps');
					      var numOfStudents					= Cookies.get('axip_numOfStudents');
					      var includePayer					= Cookies.get('axip_includePayer');
					      var axip_multipage_contact_form	= Cookies.get('axip_multipage_contact_form');
					      var studenContactIDs				= Cookies.get('studenContactIDs');
					      var payerID						= Cookies.get('axip_payerID');
					      var discountsAvailable 			= Cookies.get('axip_discounts_available');	
					      var contactids;
	    					if (typeof studenContactIDs == 'undefined') {
	    						contactids = [];
	    					}
	    					else {
	    						contactids = studenContactIDs.split(',');
	    					}
	    					/*If the payer is not to be included in the student list - Set the PayerID*/
	    					if(includePayer == 0 && typeof payerID == 'undefined')
	    					{
	    						Cookies.set('axip_payerID', contactID);
								Cookies.set('axip_payerName', $('#axip_given_name').val()+' '+$('#axip_last_name').val());
								if(jQuery('#axip_category_option').length){
	    							Cookies.set('axip_category_option', jQuery('#axip_category_option').val());
	    						}
	    					}
	    					else
	    					{
					  	    	contactids.push(contactID);
					     		Cookies.set('studenContactIDs', contactids.join(','));
	    					}

	    					var num_contacts = contactids.length;
							
	 				       	/*If the PayerID is undefined IE NOT includePayer == 0*/
	    					if (contactids.length == 1 && typeof payerID == 'undefined') {
	    						Cookies.set('axip_payerID', contactID);
	    						Cookies.set('axip_payerName', $('#axip_given_name').val()+' '+$('#axip_last_name').val());
	    						if(jQuery('#axip_category_option').length){
	    							Cookies.set('axip_category_option', jQuery('#axip_category_option').val());
	    						}
	    						
	    					}
						
	    					/*if there are students still to enrol*/
	    					if (numOfStudents > num_contacts && typeof numOfStudents !== 'undefined') {
	    						 
	    						   $("#enrolment_wizard").smartWizard('goToStep', axip_stepNumber);
	    					}
	    					else{

	                  		$payment_option = Cookies.get("axip_payment_option");
	                  		$paymentAmount  = Cookies.get("axip_courseCost");

	                  		if($payment_option=="free" || $paymentAmount == 0) {
	                      		enrolCourse(); //perform the enrolment
	    						  } else {		  
	                    		$("#enrolment_wizard").smartWizard('goForward');
	                    		
	    						  }
	    					}
					  }
	        		}
				});
				
			}
			else{
				console.log('duplicate attempt');
				ajaxComplete();
			}
	
			
			
			
		}
	});

	
	  $('#axip_form_enquiry').validate({

		  submitHandler: function(form) {

		   	$.ajax({
				
          type: "POST",
  				url: '<?php echo admin_url( 'admin-ajax.php' ); ?>',
  				dataType: 'JSON',
  				data: $('#axip_form_enquiry').serialize(),
				
          beforeSend: function( xhr ) {
  					$("#axip_ajaxLoader").show();
  				},				
				
          success: function(result) {
  					
  					$("#axip_ajaxLoader").hide();
  					// Show Default error
  					
  					 if (typeof result.error !="undefined" && result.error ==1) {
  										  
  					  showApiResponse('danger',result.message);
  									  
  					 }
  					 else if (typeof result.contact.error !="undefined") {
  											 
  						showApiResponse('danger',result.contact.message);
  					  
  					 }
  					 else if (typeof result.enquiry.error !="undefined") {
  							showApiResponse('danger',result.enquiry.message);
  					 }
  					 else{
  						showApiResponse('success',"<?php echo $axip_success_message;  ?>");
  						$('#axip_form_enquiry').hide();
  					 }
  				}

			});
		  }
	  });
	
	function showApiResponse(flag,message){
	      
	      var msgWrapper = $("#axip_api_response");
	      
	      msgWrapper.show();
	  
	      msgWrapper.find('.alert').removeClass(function(){
      		return this.className.split(' ').filter(function(className) {
      		  return className.match(/alert-\D/)}).join(' ');
      	}).addClass('alert-'+flag).html(message);
						
	      $('html, body').animate({
		        scrollTop: msgWrapper.offset().top
	      }, 2000);	
	  
	}

  //NRG: I added this here to make my life easier - This was taken from course-type-4.php
  function enrolCourse(){

    console.log("attempting to enrol...");

    var enrolData         = {};
    var studenContactIDs  = Cookies.get('studenContactIDs');
    var payerID           = Cookies.get('axip_payerID');
    
    enrolData.action      = 'axip_enrolCourse_action';
    enrolData.contactID   = studenContactIDs;
    enrolData.payerID     = payerID;
    enrolData.instanceID  = '<?php echo $instanceID; ?>';
    enrolData.courseType  = '<?php echo $courseType; ?>';
    
    enrolData.generateInvoice = 0;

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

        else if(result){
          $('#axip_enrol_response').show();                              
          $('#axip_enrol_response').find('.alert').removeClass(function(){

              return this.className.split(' ').filter(function(className) {

              return className.match(/alert-\D/)}).join(' ');

          }).addClass('alert-success').html("<?php echo $axip_success_message; ?>");

          $('#enrolment_wizard').hide();
          console.log("enrolment completed!");               
        
        }
         
      }

    });
        
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

  	$('#same_as_street_address').change(function() {
		if($(this).is(":checked")) {
			$('.axip-postal-address').attr('required', '');
			$("#axip_postal_address_wrap").hide();
		}
		else{
			$("#axip_postal_address_wrap").show();
			$('.axip-postal-address').attr('required', <?php echo ($axip_postal_address == 2?'"required"':'""'); ?>);
		}
	});
	
	
	$('input[required="required"],select[required="required"]').each(function(){

    	var $this = $(this);			
    	var eleID = $this.attr('id');			
    	$('label[for="'+eleID+'"]').addClass('mandatory');
		
	});

	if($('#axip_dob').prop('type') != 'date'){
		$('label[for="axip_dob"]').text("Date of Birth (yyyy-mm-dd)");
		$('#axip_dob').attr('placeholder','yyyy-mm-dd'); 
		$('#axip_dob').datepicker({
			container:'#axip_page_1',
			widgetParent: '#axip_page_1',
			format:"yyyy-mm-dd"

	});
	}
	
});

	
</script>
