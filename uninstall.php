<?php

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

//if uninstall not called from WordPress exit
if ( !defined( 'WP_UNINSTALL_PLUGIN' ) )
    exit();

$option_name = 'Axcelerate_Integration_Plugin';

delete_option( $option_name );

// For site options in multisite
delete_site_option( $option_name );

//drop a custom db table
global $wpdb;
$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}wp_" );

?>
