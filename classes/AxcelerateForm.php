<?php

/*--------------------------------------------*
 * Securing the plugin
 *--------------------------------------------*/

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/*--------------------------------------------*/

if (!class_exists('AxcelerateForm')) {

    class AxcelerateForm {
        
	public $_SubmitResponse = null;
		
        public function __construct() {
            

	    	add_action('init',array($this,'axip_clear_cookie'));
        
        }
 
	function axip_clear_cookie() {
	    
	    if (isset($_COOKIE['axip_payerID'])) {
		 unset($_COOKIE['axip_payerID']);
		 setcookie('axip_payerID', '', time() - 3600); 
	    }
	    if (isset($_COOKIE['axip_payerName'])) {
		 unset($_COOKIE['axip_payerName']);
		 setcookie('axip_payerName', '', time() - 3600); 
	    }	    
	    if (isset($_COOKIE['axip_numOfStudents'])) {
		 unset($_COOKIE['axip_numOfStudents']);
		 setcookie('axip_numOfStudents', '', time() - 3600); 
	    }		    
	    if (isset($_COOKIE['axip_includePayer'])) {
		 unset($_COOKIE['axip_includePayer']);
		 setcookie('axip_includePayer', '', time() - 3600); 
	    }		    
	    
	    if (isset($_COOKIE['studenContactIDs'])) {
		 unset($_COOKIE['studenContactIDs']);
		 setcookie('studenContactIDs', '', time() - 3600); 
	    }		    
	    
	    if (isset($_COOKIE['axip_numOfStudents'])) {
		 unset($_COOKIE['axip_numOfStudents']);
		 setcookie('axip_numOfStudents', '', time() - 3600); 
	    }		    

	    if (isset($_COOKIE['axip_stepNumber'])) {
		 unset($_COOKIE['axip_stepNumber']);
		 setcookie('axip_stepNumber', '', time() - 3600); 
	    }		    		
		
	    if (isset($_COOKIE['axip_courseCost'])) {
		 unset($_COOKIE['axip_courseCost']);
		 setcookie('axip_courseCost', '', time() - 3600); 
	    }
	    if (isset($_COOKIE['axip_allow_multiple'])) {
	    	unset($_COOKIE['axip_allow_multiple']);
	    	setcookie('axip_allow_multiple', '', time() - 3600);
	    }
	    if (isset($_COOKIE['axip_allow_returning_users'])) {
	    	unset($_COOKIE['axip_allow_returning_users']);
	    	setcookie('axip_allow_returning_users', '', time() - 3600);
	    }
	    if (isset($_COOKIE['axip_category_option'])) {
	    	unset($_COOKIE['axip_category_option']);
	    	setcookie('axip_category_option', '', time() - 3600);
	    }
	    if (isset($_COOKIE['axip_studyReason'])) {
	    	unset($_COOKIE['axip_studyReason']);
	    	setcookie('axip_studyReason', '', time() - 3600);
	    }
	    if (isset($_COOKIE['axip_payment_option'])) {
	    	unset($_COOKIE['axip_payment_option']);
	    	setcookie('axip_payment_option', '', time() - 3600);
	    }

	    
	}
	
        
    
    } // end of class
   
    $AxcelerateForm = new AxcelerateForm();
}
