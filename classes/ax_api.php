<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */

/*
 * |--------------------------------------------------------------------------
 * | MAIN CLASS
 * |--------------------------------------------------------------------------
 */

if (! class_exists ( 'AxcelerateAPI' )) {
	class AxcelerateAPI {
		private $_ApiUrl = '';
		public $_ApiBaseUrl = '';
		private $_apiToken = '';
		private $_wsToken = '';
		private $_options = '';
		private $_results = '';
		
		/*
		 * --------------------------------------------*
		 * Constructor
		 * --------------------------------------------
		 */
		
		/**
		 * Initializes the plugin
		 */
		public function __construct() {
			$axip_settings = get_option ( 'axip_general_settings' );
			$this->_apiToken = $axip_settings ['api_token'];
			$this->_wsToken = $axip_settings ['webservice_token'];
			$this->_ApiBaseUrl = $axip_settings ['webservice_base_path'];
		}
		
		/**
		 *  Make a request to the API. The method defaults to GET, but could be "PUT/POST"
		 * 	This will always return the data in an object.
		 * @param array $params - The data/params for the API call.
		 * @param string $method (optional) - method to use.
		 * @param string $axtoken (optional) - used for calling the API as a user not as the WS user.
		 * @param string $data - Extra variable that was defined but never used anywhere. Just use $params.
		 * @param array $headers - Extra variable that is always overwritten. Ignore it.
		 * @param bool $returnAsArray - Don't ever use true here, it will just break something...
		 */
		private function request($params = array(), $method = "GET", $axtoken = null, $data = null, $headers = array(), $returnAsArray = false ) {
            $method = strtoupper($method);
			$use_staging = false;
			$use_prod = false;
			if(key_exists('use_staging', $params) ){
				$use_staging = $params['use_staging'];
				unset($params['use_staging']);
			}
			
			if(key_exists('use_prod', $params)){
				$use_prod = $params['use_prod'];
				unset($params['use_prod']);
			}
			
			/* Set Query Params if the method is GET*/
			if(strtolower($method) == "get"){
				$qstring = http_build_query ( $params, '', '&' );
					
				$ApiUrl = $this->_ApiBaseUrl . "/" . $this->_ApiUrl . (! empty ( $qstring ) ? '?' . $qstring : '');
				if((bool)$use_staging){
					$ApiUrl = 'https://stg.axcelerate.com.au/api/'. $this->_ApiUrl . (! empty ( $qstring ) ? '?' . $qstring : '');
				}
				else if((bool)$use_prod){
					$ApiUrl = 'https://api.axcelerate.com.au/api/'. $this->_ApiUrl . (! empty ( $qstring ) ? '?' . $qstring : '');
				}
				
			}
			else{
				$ApiUrl = $this->_ApiBaseUrl . "/" . $this->_ApiUrl;
				if((bool)$use_staging){
					$ApiUrl = 'https://stg.axcelerate.com.au/api/'. $this->_ApiUrl;
				}
				else if((bool)$use_prod){
					$ApiUrl = 'https://api.axcelerate.com.au/api/'. $this->_ApiUrl;
				}
			}
			$ApiUrl = preg_replace('/([^:])(\/{2,})/', '$1/', $ApiUrl);
			
			
			$headers = array (
					'APIToken' => $this->_apiToken,
					'WSToken' => $this->_wsToken ,
					'WPTOKEN'=>true,
			);
			
			if(!empty($axtoken)){
				$headers = array (
						'APIToken' => $this->_apiToken,
						'AXTOKEN' => $axtoken,
						'WPTOKEN'=>true,
				);
			}

			/* Check for null $data and populate with data from $params if it is*/
			if($data == null){
				$data = null;
				/*Only poplulate data if not performing a get request, URL vars already added for get requests*/
				if($params != null && strtolower($method) != "get"){
					$data = $params;
				}
			}
			else{
				/*Not sure why this is being encoded, however it will never actually be used from what I can tell*/
				$data = json_encode ( $data );
			}
			
			
			$args = array (
					'method' => $method,
					'timeout' => 50,
					'redirection' => 5,
					'httpversion' => '1.1',
					'blocking' => true,
					'sslverify' => false,
					'headers' => $headers,
					'body' => $data,
					'cookies' => array () 
			);
			
			
			if ($method == 'POST' || $method == 'PUT') {
				
				$result = wp_remote_post ( $ApiUrl, $args );
			} 

			else {
				
				$result = wp_remote_get ( $ApiUrl, $args );
			}
			if (! is_wp_error ( $result )) {
				
				$resultResponse = $result ['response'];
				
				if ($resultResponse ['code'] == 200) {
					$resultBody = $result ['body'];
					
					$resultResponse = json_decode ( $resultBody, $returnAsArray );
					$this->_results = $resultResponse;
				} 

				else {
					
					$resultBody = json_decode ( trim ( $result ['body'] ), $returnAsArray );
					
					
					$resultResponse = array (
							'error' => $resultResponse ['code'],
							'message' => $resultResponse ['message'],
							'resultBody' => $resultBody
					);
					
					$this->_results = ( object ) $resultResponse;
				}
			} 

			else {
				
				$apiresponseStr = array ();
				
				foreach ( $result->errors as $code => $error ) :
					$apiresponseStr [] = implode ( ' : ', array (
							'code' => $code,
							'message' => $error [0] 
					) );
				endforeach
				;
				
				$resultResponse = array (
						'error' => '1',
						'response' => implode ( ', ', $apiresponseStr ) 
				);
				
				$errStr = implode ( ' : ', $resultResponse );
				
				$this->_results = ( object ) $resultResponse;
			}
		}
		
		/* ===================================================== */
		
		/*call resource with params*/
		public function callResource($params, $endpoint, $method){
			/*Staging override for testing enrolment widget site upgrades*/
			
			/*WP-154: Caching similar calls for short periods.*/
			$key = '';

			if(constant('AXIP_CACHING_ENABLED') === true){
				
				if($endpoint == 'courses' || $endpoint == '/courses'){
					$key = 'ax_course_'. sanitize_text_field(implode('_', $params));
				}
				else if ($endpoint == '/course/detail' || $endpoint == 'course/detail'){
					$key = 'ax_detail_'. sanitize_text_field(implode('_', $params));
				}
				else if($endpoint == '/report/field' || $endpoint == 'report/field'){
					$key = 'ax_report_field_'. sanitize_text_field(implode('_', $params));
				}
				else if($endpoint == '/course/locations' || $endpoint == 'course/locations'){
					$key = 'ax_c_locations_'. sanitize_text_field(implode('_', $params));
				}
				else if($endpoint == '/contact/sources' || $endpoint == 'contact/sources'){
					$key = 'ax_csources_'. sanitize_text_field(implode('_', $params));
				}
				else if($endpoint == '/customFields' || $endpoint == 'customFields'){
					$key = 'ax_customf_'. sanitize_text_field(implode('_', $params));
				}
				else if($endpoint == '/venues' || $endpoint == 'venues'){
					$key = 'ax_venues_'. sanitize_text_field(implode('_', $params));
				}
				else if($endpoint == '/course/deliveryLocations' || $endpoint== 'course/deliveryLocations'){
					$key = 'ax_delivery_loc' .sanitize_text_field(implode('_', $params));
				}
				
				
				if(!empty($key)){
					$result = get_transient($key);
					if(!empty($result)){
						return $result;
					}
				}
			}
			
			$useStaging = get_option('ax_staging_override');
			if(!empty($useStaging) && $useStaging != 'false'){
				$params['use_staging'] = $useStaging;
			}
			
			$this->_ApiUrl = $endpoint;
			
			$this->request ( $params, $method );
		
			if(constant('AXIP_CACHING_ENABLED') === true){
				if(!empty($key)){
					if(is_object($this->_results) && ! is_array($this->_results)){
						if(! property_exists($this->_results, 'error') ){
							set_transient($key, $this->_results, 10*MINUTE_IN_SECONDS );
						}
					}
					
					
				}
			}
			return $this->_results;
		}
		
		public function callResourceAX($params, $endpoint, $method, $axtoken){
			/*Staging override for testing enrolment widget site upgrades*/
			$useStaging = get_option('ax_staging_override');	
			if(!empty($useStaging)){
				$params['use_staging'] = $useStaging;
			}
			$this->_ApiUrl = $endpoint;
			$this->request ( $params, $method,$axtoken );
			return $this->_results;
		}
		
		
		
		
		
		/* =================== Course Service ================== */
		
		/*
		 * @param string $type : all, p, w, el (optional - default all )
		 * @param int $displayLength (optional - default 200 )
		 */
		public function getCourses($type = 'all', $displayLength = 200) {
			$this->_ApiUrl = 'course';
			$params = array (
					'type' => $type,
					'displayLength' => $displayLength 
			);
			$this->request ( $params );
			
			return $this->_results;
		}
		
		/*
		 * @param string $searchterm (Mandatory)
		 * @param int $displayLength (optional - default 200 )
		 *
		 */
		public function searchCourses($searchterm, $displayLength = 200) {
			$this->_ApiUrl = 'course';
			$params = array (
					'searchterm' => $searchterm,
					'displayLength' => $displayLength 
			);
			$this->request ( $params );
			
			return $this->_results;
		}
		
		/*
		 * @param string $trainingArea (Mandatory)
		 * @param int $displayLength (optional - default 200 )
		 *
		 */
		public function searchCoursesByCat($trainingArea, $displayLength = 200) {
			$this->_ApiUrl = 'courses';
			$params = array (
					'trainingArea' => $trainingArea,
					'displayLength' => $displayLength 
			);
			$this->request ( $params );
			
			return $this->_results;
		}
		
		/*
		 * @param date $monthFrom
		 * @param date $monthTo
		 * @param string $year
		 * @param string $location
		 * @param string $type
		 */
		public function getCalendarData($monthFrom, $monthTo, $year, $location, $type) {
			$this->_ApiUrl = 'course/calendar';
			$params = array (
					'monthFrom' => $monthFrom,
					'monthTo' => $monthTo,
					'year' => $year,
					'location' => $location,
					'type' => $type 
			);
			$this->request ( $params );
			
			return $this->_results;
		}
		public function getLocations() {
			$this->_ApiUrl = 'course/locations';
			$params = array (
					'public' => '1',
					'onlyFuture' => '1' 
			);
			$this->request ( $params );
			
			return $this->_results;
		}
		
		/*
		 * @param int $id - Course ID (Mandatory)
		 * @param int $type - Course Type (Mandatory)
		 */
		public function getCourseDetails($id, $type) {
			$this->_ApiUrl = 'course/detail';
			$params = array (
					'id' => $id,
					'type' => $type 
			);
			$this->request ( $params );
			
			return $this->_results;
		}
		
		/*
		 * @param int $id - course id
		 * @param string $type : all, p, w, el (optional - default all )
		 * @param int $sortDirection (optional - default asc )
		 */
		public function getCourseInstances($id, $type, $sortDirection = 'asc') {
			$this->_ApiUrl = 'course/instances';
			$params = array (
					'id' => $id,
					'type' => $type,
					'sortDirection' => $sortDirection 
			);
			$this->request ( $params );
			
			
			
			return $this->_results;
		}
		
		/*
		 * @param int $instanceID - course instance ID
		 * @param string $type : all, p, w, el (optional - default all )
		 */
		public function getCourseInstanceDetails($instanceID, $type) {
			$this->_ApiUrl = 'course/instance/detail';
			$params = array (
					'instanceID' => $instanceID,
					'type' => $type 
			);
			$this->request ( $params );
			
			return $this->_results;
		}
		
		/*
		 * @param int $contactID
		 * @param int $instanceID - course instance ID
		 * @param int $payerID
		 * @param string $type : all, p, w, el (optional - default all )
		 * @param int $invoiceID
		 */
		public function enrolContact($contactID, $instanceID, $payerID, $type, $invoiceID, $StudyReasonID = null, $discountCost = null, $discountIDList = null, $generateInvoice = 1, $finCodeID=null) {
			$contactsList = explode ( ',', $contactID );
			
			if (count ( $contactsList ) > 1) {
				$this->_ApiUrl = 'course/enrolMultiple';
			} else {
				$this->_ApiUrl = 'course/enrol';
			}
			
			$params = array (
					'contactID' => $contactID,
					'instanceID' => $instanceID,
					'payerID' => $payerID,
					'type' => $type,
					'invoiceID' => $invoiceID,
					'generateInvoice' => $generateInvoice 
			);
			
			if (! empty ( $discountCost )) {
				$params ['cost'] = $discountCost;
			}
			if (! empty ( $discountIDList )) {
				$params ['discountIDList'] = $discountIDList;
			}
			if (! empty ( $StudyReasonID )) {
				$params ['StudyReasonID'] = $StudyReasonID;
			}
			
			if (! empty ( $finCodeID )) {
				$params ['finCodeID'] = $finCodeID;
			}
			
			
			$axip_settings = get_option ( 'axip_general_settings' );
			$axip_finalise_invoice		= $axip_settings['axip_finalise_invoice'];
			
			if($axip_finalise_invoice == 0){
				$params['finaliseInvoice'] = 0;
			}
			else{
				$params['finaliseInvoice'] = 1;
			}
			
			
			
			$this->request ( $params, 'POST' );
			
			return $this->_results;
		}
		
		/*
		 * @param int $contactID
		 * @param int $noteCodeID
		 * @param string $comments
		 * @param string $type : all, p, w, el (optional - default all )
		 * @param int $ID
		 * @param string $emailTo
		 */
		public function enquireForContact($contactID, $noteCodeID, $comments, $type, $ID, $emailTo) {
			$this->_ApiUrl = 'course/enquire';
			$params = array (
					'contactID' => $contactID,
					'noteCodeID' => $noteCodeID,
					'comments' => $comments,
					'type' => $type,
					'ID' => $ID,
					'emailTo' => $emailTo 
			);
			$this->request ( $params, 'POST' );
			
			return $this->_results;
		}
		
		/* ===================================================== */
		/* ============= Training Category Service ============= */
		public function getCourseCategory() {
			$this->_ApiUrl = 'trainingCategories';
			$params = array ();
			$this->request ( $params );
			
			return $this->_results;
		}
		
		/* ===================================================== */
		/* =================== State Service =================== */
		
		// Parameter SstateID parsing the state information to the API to gather the search results. Wade 1st Nov 2015.
		// Does not work, was a prototype for filtering that was ditched.
		public function getStateCourses($type, $state) {
			$this->_ApiUrl = 'course/instance/search';
			$params = array (
					'type' => $type,
					'state' => $state 
			);
			$this->reqest ( $params );
			
			return $this->_results;
		}
		
		/* ===================================================== */
		/* =================== Training Cat Search Service =================== */
		
		// Instance Search by Training Cat - TODO Replace all these with single method?
		public function searchByTrainingCat($type, $trainingCat) {
			$this->_ApiUrl = 'course/instance/search';
			$params = array (
					'type' => $type,
					'trainingCategory' => $trainingCat 
			);
			$this->reqest ( $params );
			
			return $this->_results;
		}
		
		/* ===================================================== */
		/* ============= Training Categories Service =========== */
		public function getTrainingCatAndLocation($type = 'all', $trainingCategory, $location) {
			$this->_ApiUrl = 'course/instance/search';
			$params = array (
					'type' => $type,
					'displayLength' => 200 
			);
			if (! empty ( $trainingCategory )) {
				$params ['trainingCategory'] = $trainingCategory;
			}
			if (! empty ( $location )) {
				$params ['location'] = $location;
			}
			
			$this->request ( $params, 'POST' );
			
			return $this->_results;
		}
		public function getTrainingCatCourses($type = 'all', $displayLength = 200, $locationCat) {
			$this->_ApiUrl = 'course/instance/search';
			$params = array (
					'type' => $type,
					'displayLength' => $displayLength,
					'trainingCategory' => $locationCat 
			);
			$this->request ( $params, 'POST' );
			
			return $this->_results;
		}
		
		/* ===================================================== */
		/* ============= Attendance Service ==================== */
		public function getAttendance($type = 'all', $instanceID) {
			$this->_ApiUrl = 'course/instance/search';
			$params = array (
					'type' => $type,
					'instanceID' => $instanceID 
			);
			$this->request ( $params, 'POST' );
			
			return $this->_results;
		}
		
		/* ===================================================== */
		/* =================== Location Service ================ */
		public function getLocationCourses($type = 'all', $displayLength = 200, $location) {
			$this->_ApiUrl = 'course/instance/search';
			$params = array (
					'type' => $type,
					'displayLength' => $displayLength,
					'location' => $location 
			);
			$this->request ( $params, 'POST' );
			
			return $this->_results;
		}
		
		/* ===================================================== */
		/* =================== Venue Service =================== */
		public function getCourseVenueDetails($venueID) {
			$this->_ApiUrl = 'venues';
			$params = array (
					'venueID' => $venueID 
			);
			$this->request ( $params );
			
			return $this->_results;
		}
		
		/* ===================================================== */
		/* =================== Contact Service ================= */
		
		/*
		 * @param array $formData
		 */
		public function createContact($formData) {
			$this->_ApiUrl = 'contact';
			$params = $formData;
			$this->request ( $params, 'POST' );
			
			return $this->_results;
		}
		
		/*
		 * @param string $email
		 * @param string $password
		 *
		 */
		public function lookupUser($email, $password) {
			$this->_ApiUrl = 'contacts';
			$params = array (
					'emailAddress' => $email,
					'Password' => $password 
			);
			$this->request ( $params );
			
			return $this->_results;
		}
		public function userLogin($username, $password) {
			$this->_ApiUrl = 'user/login';
			$params = array (
					'username' => $username,
					'Password' => $password 
			);
			$this->request ( $params, 'POST' );
			
			return $this->_results;
		}
		public function userReset($username, $email) {
			$this->_ApiUrl = 'user/forgotPassword';
			$params = array (
					'username' => $username,
					'email' => $email 
			);
			$this->request ( $params, 'POST' );
			
			return $this->_results;
		}
		public function createUser($username, $contactID) {
			$this->_ApiUrl = 'user';
			$params = array (
					'username' => $username,
					'contactid' => $contactID 
			);
			$this->request ( $params, 'POST' );
			
			return $this->_results;
		}
		public function getContactSources() {
			$this->_ApiUrl = 'contact/sources';
			$params = array ();
			$this->request ( $params );
			
			return $this->_results;
		}
		
		/* ===================================================== */
		/* =================== Enrolment Service ================ */
		
		/*
		 * @param string $learningActivity - course type
		 * @param int $learningActivityID - instance id
		 * @param int $contactID
		 * @param string $data - optional
		 */
		public function createEnrolmentRequest($learningActivity, $learningActivityID, $contactID, $data = '') {
			$this->_ApiUrl = 'enrolment/request';
			$params = array (
					'learningActivity' => $learningActivity,
					'learningActivityID' => $learningActivityID,
					'contactID' => $contactID,
					'data' => $data 
			);
			$this->request ( $params, 'POST' );
			
			return $this->_results;
		}
		
		/*
		 * @param int $enrolmentGUID
		 */
		public function refreshEnrolmentStatus($enrolmentGUID) {
			$this->_ApiUrl = 'enrolment/request';
			$params = array (
					'enrolmentGUID' => $enrolmentGUID 
			);
			$this->request ( $params );
			
			return $this->_results;
		}
		
		/* =================== Payment Service ================ */
		public function processPayment($paymentAmount, $contactID, $payerID, $instanceID, $type, $nameOnCard, $cardNumber, $cardType, $cardCCV, $expiryMonth, $expiryYear, $customerIP, $finCodeID) {
			$this->_ApiUrl = 'payment';
			/* TODO: revisit this when we add the concept of a deposit/initial payment */
			$params = array (
					'paymentAmount' => $paymentAmount,
					'totalAmount' => $paymentAmount,
					'contactID' => $contactID,
					'payerID' => $payerID,
					'instanceID' => $instanceID,
					'type' => $type,
					'nameOnCard' => $nameOnCard,
					'cardNumber' => $cardNumber,
					'cardType' => $cardType,
					'cardCCV' => $cardCCV,
					'expiryMonth' => $expiryMonth,
					'expiryYear' => $expiryYear,
					'customerIP' => $customerIP 
			);
			
			$axip_settings = get_option ( 'axip_general_settings' );
			$axip_finalise_invoice		= $axip_settings['axip_finalise_invoice'];
			
			if($axip_finalise_invoice == 0){
				$params['finaliseInvoice'] = 0;
			}
			else{
				$params['finaliseInvoice'] = 1;
			}
			
			
			if (! empty ( $finCodeID )) {
				$params['finCodeID'] = $finCodeID;
			}
			$this->request ( $params, 'POST' );
			
			return $this->_results;
		}
		
		/* =================== Discount Service ================ */
		
		/*
		 * @param string $status - discount status
		 * @param int $discountTypeID - 1 Early Bird; 2 Membership; 3 Category; 4 Organisation; 5 Group Discount; 6 Promo Code; 7 Concession;
		 * @param string $type - Course Type
		 * @param int $instanceID - instance ID
		 */
		public function getDiscountsInstance($status, $discountTypeID, $type, $instanceID) {
			$this->_ApiUrl = 'discounts';
			$params = array (
					'status' => $status,
					'discountTypeID' => $discountTypeID,
					'type' => $type,
					'instanceID' => $instanceID 
			);
			$this->request ( $params, 'GET' );
			return $this->_results;
		}
		
		/*
		 * @param string $status - discount status
		 * @param int $discountTypeID - 1 Early Bird; 2 Membership; 3 Category; 4 Organisation; 5 Group Discount; 6 Promo Code; 7 Concession;
		 * @param string $type - Course Type
		 * @param int $ID - Course ID
		 */
		public function getDiscountsCourse($status, $discountTypeID, $type, $ID) {
			$this->_ApiUrl = 'discounts';
			$params = array (
					'status' => $status,
					'discountTypeID' => $discountTypeID,
					'type' => $type,
					'ID' => $ID 
			);
			$this->request ( $params, 'GET' );
			return $this->_results;
		}
		public function calculateDiscount($contactID, $type, $instanceID, $originalPrice, $groupBookingSize = null, $promoCode = null, $ConcessionDiscountIDs = null) {
			$this->_ApiUrl = 'course/discounts';
			$params = array (
					'contactID' => $contactID,
					'type' => $type,
					'instanceID' => $instanceID,
					'originalPrice' => $originalPrice 
			);
			/* Check for null values */
			if (! empty ( $groupBookingSize )) {
				$params ['GroupBookingSize'] = $groupBookingSize;
			}
			if (! empty ( $promoCode )) {
				$params ['promoCode'] = $promoCode;
			}
			if (! empty ( $ConcessionDiscountIDs )) {
				$params ['concessionDiscountIDs'] = $ConcessionDiscountIDs;
			} else {
				$params ['concessionDiscountIDs'] = 0;
			}
			$this->request ( $params, 'GET' );
			return $this->_results;
		}
		public function getContact($contactID){
			$this->_ApiUrl = 'contacts/';
			$params = array(
				'contactID' => $contactID,		
			);
			$this-> request($params, "GET");
			return $this->_results;
		}
	
		private function errorLog($err) {
			error_log ( $err );
		}
		
		/*
		 * |--------------------------------------------------------------------------
		 * | This is the end of this file, Wade 29th Sept 2015.
		 * | Note: Its has been tested working.
		 * |--------------------------------------------------------------------------
		 */
		
		// End of "private function request"
	}
	
	// End of "class AxcelerateAPI"
}

// End of "if (!class_exists('AxcelerateAPI'))"
