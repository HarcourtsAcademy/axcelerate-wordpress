<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */
class AX_Settings_Tab_Course_Instances
{

    const course_instances_key = 'axip_course_instance_settings';
    function __construct()
    {
    }
    function register_settings()
    {
        register_setting ( self::course_instances_key, 'ax_course_instance_layout_w' );
        register_setting ( self::course_instances_key, 'ax_course_instance_layout_p' );
        register_setting ( self::course_instances_key, 'ax_course_instance_default_style' );
        register_setting ( self::course_instances_key, 'ax_course_instance_months_search_p' );
        register_setting ( self::course_instances_key, 'ax_course_instance_months_search_w' );
        
        add_settings_section ( 'section_course_instance', __ ( 'Course Instance List (Shortcode) Settings', 'axip' ), array (
                &$this,
                'section_course_instance_desc'
        ), self::course_instances_key );
        
        add_settings_field ( 'ax_course_instance_default_style', __ ( 'Course Instance Style:', 'axip' ), array (
                &$this,
                'field_course_instance_default_style'
        ), self::course_instances_key, 'section_course_instance' );
        
        /*

        add_settings_field ( 'ax_course_instance_months_search_w', __ ( 'Workshop - Newer than', 'axip' ), array (
            &$this,
            'field_ax_course_instance_months_search_w'
        ), self::course_instances_key, 'section_course_instance' );

        */


        add_settings_field ( 'ax_course_instance_months_search_p', __ ( 'Program - Newer than:', 'axip' ), array (
        &$this,
        'field_ax_course_instance_months_search_p'
        ), self::course_instances_key, 'section_course_instance' );



        add_settings_field ( 'ax_course_instance_layout_w', __ ( 'Course Instance Workshop Layout:', 'axip' ), array (
                &$this,
                'field_course_instance_layout_w'
        ), self::course_instances_key, 'section_course_instance' );
        add_settings_field ( 'ax_course_instance_layout_p', __ ( 'Course Instance Program Layout:', 'axip' ), array (
                &$this,
                'field_course_instance_layout_p'
        ), self::course_instances_key, 'section_course_instance' );
    }

    /***** wp-113 *****/
    
    function field_course_instance_layout_w()
    {
        $content = get_option ( 'ax_course_instance_layout_w' );
        if (empty ( $content )) {
            $template = '<table>';
            $template = $template . '<thead><tr><td>Name</td><td>Date</td><td>Time</td><td>Location</td><td>Available Spaces</td><td>Cost</td><td></td></tr></thead>';
                
            $template = $template .     '<tbody><tr>';
            $template = $template . '<td>[ax_course_instance_name]</td>
				<td>[ax_course_instance_datedescriptor]</td>
				<td>[ax_course_instance_starttime] - [ax_course_instance_finishtime]</td>
				<td>[ax_course_instance_location]</td>
				<td>[ax_course_instance_vacancy]</td>
				<td>$[ax_course_instance_cost]</td>
				<td>[ax_course_button_link button_text=Enrol link_mode=url link_url=/course-enrol/]</td>';
    
            $template = $template . '</tr></tbody></table>';
    
            $content = $template;
            update_option ( 'ax_course_instance_layout_w', $content );
        }
        $editor_id = 'ax_course_instance_layout_w';
        wp_editor ( $content, $editor_id );
    }


    function field_course_instance_layout_p()
    {
        $content = get_option ( 'ax_course_instance_layout_p' );
        if (empty ( $content )) {
            $template = '<table>';
            $template = $template . '<thead><tr>';
            $template = $template .     '
		 		<td>Name</td>
				<td>Course Start Date</td>
				<td>Course End Date</td>
				<td>Cost</td>
				<td></td>';
            $template = $template .'</tr></thead>';
                
            $template = $template .     '<tbody><tr>';
            $template = $template . '
				<td>[ax_course_instance_name]</td>
				<td>[ax_course_instance_startdate]</td>
				<td>[ax_course_instance_finishdate]</td>
				<td>$[ax_course_instance_cost]</td>
				<td>[ax_course_button_link button_text=Enrol link_mode=url link_url=/course-enrol/]</td>';
    
            $template = $template . '</tr></tbody></table>';
    
            $content = $template;
            update_option ( 'ax_course_instance_layout_p', $content );
        }
        $editor_id = 'ax_course_instance_layout_p';
        wp_editor ( $content, $editor_id );
    }
    
    function field_course_instance_default_style()
    {
        $style = get_option ( 'ax_course_instance_default_style' );
        if (empty ( $style )) {
            $style = 'ax-table';
            update_option ( 'ax_course_instance_default_style', $style );
        }
        $options = array (
                "ax-no-style"=>"No CSS Styling",
                "ax-table" => "Standard table Format",
        );
        echo '<select name="ax_course_instance_default_style">';
        foreach ($options as $key => $value) {
            if ($key == $style) {
                echo '<option value="' . $key . '" selected="selected">' . $value . '</option>';
            } else {
                echo '<option value="' . $key . '">' . $value . '</option>';
            }
        }
        echo '</select>';
    }

    function field_ax_course_instance_months_search_w()
    {
        $style = get_option('ax_course_instance_months_search_w');
        if (empty ( $style )) {
            $style = '-1';
            update_option ( 'ax_course_instance_months_search_w', $style );
        }
        $options = array (
                "-1"=>"Previous Month",
                "-2" => "Past 2 Months",
        );
        echo '<select name="ax_course_instance_months_search_w">';
        foreach ($options as $key => $value) {
            if ($key == $style) {
                echo '<option value="' . $key . '" selected="selected">' . $value . '</option>';
            } else {
                echo '<option value="' . $key . '">' . $value . '</option>';
            }
        }
        echo '</select>';
        echo '<p><em>Show instances newer than this setting. Note - while this setting changes the search terms, workshops close enrolment before or on the start date. It is unlikely that these courses will be returned.</em></p>';
    }

    function field_ax_course_instance_months_search_p()
    {

        $wOpt = get_option('ax_course_instance_months_search_w');
        if (empty ( $wOpt )) {
            $wOpt = '-1';
            update_option ( 'ax_course_instance_months_search_w', $wOpt );
        }

        $pOpt = get_option ( 'ax_course_instance_months_search_p' );
        if (empty ( $pOpt )) {
            $pOpt = '-6';
            update_option ( 'ax_course_instance_months_search_p', $pOpt );
        }
        $options = array (
                "-1"=>"Previous Month",
                "-6" => "Past 6 Months",
                "-12" => "Past 12 Months",
                "-18" => "Past 18 Months",
                "-24" => "Past 24 Months",
                "-36" => "Past 36 Months",
        );
        echo '<select name="ax_course_instance_months_search_p">';
        foreach ($options as $key => $value) {
            if ($key == $pOpt) {
                echo '<option value="' . $key . '" selected="selected">' . $value . '</option>';
            } else {
                echo '<option value="' . $key . '">' . $value . '</option>';
            }
        }
        echo '</select>';
        echo '<p><em>Show instances newer than this setting.</em></p>';
    }

    
    


    function section_course_instance_desc()
    {
        echo 'This section allows customisation of the course instance shortcode template.';
        echo '<p><span style="font-weight:600; font-size:1.1em;">It is important to set the URL for your default enrolment page. </span><br />';
        echo 'Replace the existing button shortcode with a new shortcode through the provided editor and set the URL to your enquiry or enrolment page depending on what you offer. It is easiest to do this through Text mode rather than visual.</p>';
    }
}
