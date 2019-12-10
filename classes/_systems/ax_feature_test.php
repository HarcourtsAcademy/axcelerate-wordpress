<?php

/**
 * Enrolment Service
 */

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
if ( ! defined( 'ABSPATH' ) ) exit;

/* -------------------------------------------- */

/**
 *
 * @author Rob Bisson <rob.bisson@axcelerate.com.au>
 */
class AX_Feature_Tests
{

    public function __construct(){
        add_action('init', 'AX_Feature_tests::register_feature_tests');
    }

    public static function register_feature_tests(){

        include_once "feature_tests/ax_debitsuccess_test.php";


        if (class_exists('AX_Test_Debitsuccess')) {
            AX_Test_Debitsuccess::register_ajax_actions();
        }

    }

}
$AX_Feature_Tests = new AX_Feature_Tests();