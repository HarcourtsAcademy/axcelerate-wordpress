<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */
class AX_Settings_Tab_Enroller_Colours {
	private $enrol_colours_settings_key = 'axip_enrol_colours_settings';
	const enrol_colours_settings_key = 'axip_enrol_colours_settings';
	function __construct() {
	}
	function register_settings() {
		/**
		 * * Add Enrol Widget Colours Settings **
		 */
		add_settings_section ( 'section_enrol_colours', __ ( 'Enrolment Widget Colour Overrides', 'axip' ), array (
				&$this,
				'section_enrol_colour_desc' 
		), self::enrol_colours_settings_key );
		
		register_setting ( self::enrol_colours_settings_key, 'ax_enrol_w_colours' );
		
		add_settings_field ( 'ax_ew', __ ( 'EW Container Background:', 'axip' ), array (
				&$this,
				'field_enrol_w_colours' 
		), self::enrol_colours_settings_key, 'section_enrol_colours', array (
				'fieldName' => 'ax_ew',
				'description' => 'Generally Should only be used with the Default, or Navy style.' 
		) );
		
		add_settings_field ( 'ax_smd', __ ( 'Step Menu - Disabled Colour:', 'axip' ), array (
				&$this,
				'field_enrol_w_colours' 
		), self::enrol_colours_settings_key, 'section_enrol_colours', array (
				'fieldName' => 'ax_smd',
				'description' => '' 
		) );
		
		add_settings_field ( 'ax_smdb', __ ( 'Step Menu - Disabled Border:', 'axip' ), array (
				&$this,
				'field_enrol_w_colours' 
		), self::enrol_colours_settings_key, 'section_enrol_colours', array (
				'fieldName' => 'ax_smdb',
				'description' => '' 
		) );
		
		add_settings_field ( 'ax_smdt', __ ( 'Step Menu - Disabled Text:', 'axip' ), array (
				&$this,
				'field_enrol_w_colours' 
		), self::enrol_colours_settings_key, 'section_enrol_colours', array (
				'fieldName' => 'ax_smdt',
				'description' => '' 
		) );
		
		add_settings_field ( 'ax_smh', __ ( 'Step Menu Link Hover', 'axip' ), array (
				&$this,
				'field_enrol_w_colours' 
		), self::enrol_colours_settings_key, 'section_enrol_colours', array (
				'fieldName' => 'ax_smh',
				'description' => '' 
		) );
		
		add_settings_field ( 'ax_smhb', __ ( 'Step Menu Link Hover Boder', 'axip' ), array (
				&$this,
				'field_enrol_w_colours' 
		), self::enrol_colours_settings_key, 'section_enrol_colours', array (
				'fieldName' => 'ax_smhb',
				'description' => '' 
		) );
		
		add_settings_field ( 'ax_smht', __ ( 'Step Menu Link Hover Text', 'axip' ), array (
				&$this,
				'field_enrol_w_colours' 
		), self::enrol_colours_settings_key, 'section_enrol_colours', array (
				'fieldName' => 'ax_smht',
				'description' => '' 
		) );
		
		add_settings_field ( 'ax_pc', __ ( 'Primary Button Colour:', 'axip' ), array (
				&$this,
				'field_enrol_w_colours' 
		), self::enrol_colours_settings_key, 'section_enrol_colours', array (
				'fieldName' => 'ax_pc',
				'description' => '' 
		) );
		
		add_settings_field ( 'ax_pcb', __ ( 'Primary Button Border:', 'axip' ), array (
				&$this,
				'field_enrol_w_colours' 
		), self::enrol_colours_settings_key, 'section_enrol_colours', array (
				'fieldName' => 'ax_pcb',
				'description' => '' 
		) );
		
		add_settings_field ( 'ax_pct', __ ( 'Primary Button Text:', 'axip' ), array (
				&$this,
				'field_enrol_w_colours' 
		), self::enrol_colours_settings_key, 'section_enrol_colours', array (
				'fieldName' => 'ax_pct',
				'description' => '' 
		) );
		
		add_settings_field ( 'ax_hc', __ ( 'Hover Colour:', 'axip' ), array (
				&$this,
				'field_enrol_w_colours' 
		), self::enrol_colours_settings_key, 'section_enrol_colours', array (
				'fieldName' => 'ax_hc',
				'description' => '' 
		) );
		
		add_settings_field ( 'ax_hcb', __ ( 'Hover C Border:', 'axip' ), array (
				&$this,
				'field_enrol_w_colours' 
		), self::enrol_colours_settings_key, 'section_enrol_colours', array (
				'fieldName' => 'ax_hcb',
				'description' => '' 
		) );
		
		add_settings_field ( 'ax_hct', __ ( 'Hover C Text:', 'axip' ), array (
				&$this,
				'field_enrol_w_colours' 
		), self::enrol_colours_settings_key, 'section_enrol_colours', array (
				'fieldName' => 'ax_hct',
				'description' => '' 
		) );
		
		/*WP-158*/
		add_settings_field ( 'ax_tf_hc', __ ( 'Input Field Hover Colour:', 'axip' ), array (
				&$this,
				'field_enrol_w_colours'
		), self::enrol_colours_settings_key, 'section_enrol_colours', array (
				'fieldName' => 'ax_tf_hc',
				'description' => ''
		) );
		
		add_settings_field ( 'ax_tf_hcb', __ ( 'Input Field Hover C Border:', 'axip' ), array (
				&$this,
				'field_enrol_w_colours'
		), self::enrol_colours_settings_key, 'section_enrol_colours', array (
				'fieldName' => 'ax_tf_hcb',
				'description' => ''
		) );
		
		add_settings_field ( 'ax_tf_hct', __ ( 'Input Field Hover C Text:', 'axip' ), array (
				&$this,
				'field_enrol_w_colours'
		), self::enrol_colours_settings_key, 'section_enrol_colours', array (
				'fieldName' => 'ax_tf_hct',
				'description' => ''
		) );
		
		
	}
	function field_enrol_w_colours($args) {
		$fieldName = $args ['fieldName'];
		
		
		$colors = get_option ( 'ax_enrol_w_colours' );
		$fieldCol = '';
		if (! empty ( $colors )) {
			if (key_exists ( $fieldName, $colors )) {
				$fieldCol = $colors [$fieldName];
			}
		}
		echo '<input name="ax_enrol_w_colours[' . $fieldName . ']" type="text" class="color-picker" value="' . $fieldCol . '">';
		if (! empty ( $args ['description'] )) {
			echo '<p><em>' . $args ['description'] . '</em></p>';
		}
	}
	function section_enrol_colour_desc() {
		echo 'This section allows for colour overrides to be set for the Enrolment Widget';
	}
}
