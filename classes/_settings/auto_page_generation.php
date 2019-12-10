<?php

/*
 * --------------------------------------------*
 * Securing the plugin
 * --------------------------------------------
 */
defined ( 'ABSPATH' ) or die ( 'No script kiddies please!' );

/* -------------------------------------------- */
class AX_Settings_Tab_Auto_Generation
{

    const auto_generation_key = 'axip_auto_generation_settings';
    const WORKSHOP = 'w';
    const PROGRAM = 'p';
    function __construct()
    {
    }
    function register_settings()
    {
       
        add_settings_section ( 'section_auto_generate', __ ( 'Auto Generate', 'axip' ), array (
            &$this,
            'section_auto_gen_desc'
        ), self::auto_generation_key );
        register_setting ( self::auto_generation_key, 'ax_auto_generate_run' );

        add_settings_field ( 'ax_auto_generate_run', __ ( 'Auto Generate:', 'axip' ), array (
            &$this,
            'auto_generate_content'
        ), self::auto_generation_key, 'section_auto_generate' );
    }

    function section_auto_gen_desc()
    {
        wp_register_style ( 'ax_auto_gen', plugins_url ( '/css/ax-auto-gen.css', AXIP_PLUGIN_NAME ), array (), AXIP_PLUGIN_VERSION );
        wp_enqueue_style ( 'ax_auto_gen' );
        echo 'These settings allow for quick generation of Posts/Pages using the standard templates set up via the Course List and by combining Course Details and Course Instances.';
        echo '<h2><em>Note: Clicking Create Pages will generate posts that will have to be cleaned up prior to this being run again.</h2><h2>You must review your settings pages prior to running the Create function.</em></h2>';
    }

    function auto_generate_content()
    {
        
        echo
        '<div class="auto_generate">';

        $runBefore = get_option('ax_auto_generate_run');

        if (!empty($runBefore)) {
            echo
                '<div class="run-before-disclaimer">
                    <h3> This tool has been run previously. Make sure to review your templates and pages prior to continuing</h3>
                </div>';
        }

        echo
            '<div class="inner-auto-holder">
                '
                .
                self::renderCollapsibleBlock('agCourseList', 'Create Course List Page', self::renderCourseListContent(), true).
                self::renderCollapsibleBlock('agCourseDetailW', 'Create Details Page (Workshop)', self::renderCourseDetailContent(self::WORKSHOP), true).
                self::renderCollapsibleBlock('agCourseDetailP', 'Create Details Page (Qualification)', self::renderCourseDetailContent(self::PROGRAM), true).
                self::renderCollapsibleBlock('agCourseEnrolW', 'Create Enrolment Page (Workshop)', self::renderCourseEnrolmentContent(self::WORKSHOP), true).
                self::renderCollapsibleBlock('agCourseEnrolP', 'Create Enrolment Page (Qualification)', self::renderCourseEnrolmentContent(self::PROGRAM), true).
                self::renderCollapsibleBlock('agCourseEnquireW', 'Create Enquiry Page (Workshop)', self::renderEnquiryContent(self::WORKSHOP), true).
                self::renderCollapsibleBlock('agCourseEnquireP', 'Create Enquiry Page (Qualification)', self::renderEnquiryContent(self::PROGRAM), true)

                .'
            </div>';

        echo
        '</div>';

        echo '<div class="ag_auto_gen_submit">
            <button class=" button button-primary" id="ag_submit" >Create Pages</button>
        </div>';
    }

    function renderCollapsibleBlock($blockID = "", $blockTitle = "", $blockContent = "", $collapsed = true)
    {
        echo '<div class="ag-collapsible-outer">';
        echo
            '<div id="'.$blockID.'" name="'.$blockID.'" class="ag-collapse-header">
            <label class="ax-checkbox">
                <input id="'.$blockID.'_checkbox" name="'.$blockID.'_checkbox" type="checkbox" checked="checked">
                <span></span>
                <div class="ag-collapse-label">'.$blockTitle.'</div>
            </label><div id="'.$blockID.'_control" class="ag-collapse-chevron button button-primary">Options</div>
                
            </div>';
            $collapsed_class = "ax-collapseable closed";
        if (!$collapsed) {
            $collapsed_class = 'ax-collapseable open';
        }
        
        echo
            '<div id="'.$blockID.'_collapsible" class="'.$collapsed_class .'" >
                '.$blockContent.'
            </div>';

            echo '</div>';
    }

    function renderCourseListContent()
    {
        // Options
        $content = "";
        // Style
        $content.= '<div><label>List Style:</label>'.self::renderStyleSelectorCourse('ag_course_list_style') .'</div>';
        // Page Title
        
        $content .= '<div><label >Page Title: </label><input id="ag_course_list_title" name="ag_course_list_title" value="Course List"/></div>';
        
        //Update setting?

        //Post status
        $content .= '<div><label >Post Status:</label>';
        $content .= self::getPostStatusSelector('ag_course_list_status').'</div>';
        
        //Post type
        $content .= '<div><label >Post Type:</label>';
        $content .= self::getPostTypesSelector('ag_course_list_type') .'</div>';

        $content .= '<div><label >Update CL Settings:<input type="checkbox" checked="checked"  name="ag_cl_update" id="ag_cl_update"/><span></label> </div>';
        return $content;
    }
    function renderCourseDetailContent($course_type = WORKSHOP)
    {
        // Options
        $content = "";
        // Style
        $content.= '<div><label>List Style:</label>'.self::renderStyleSelectorDetails('ag_course_detail_style_'.$course_type) .'</div>';
        // Page Title
        
        $title = "Course Details";
        if ($course_type == self::PROGRAM) {
            $title = "Qualification Details";
        }
        $content .= '<div><label >Page Title: </label><input value="'.$title.'" id="ag_course_detail_title_'.$course_type.'" name="ag_course_detail_title_'.$course_type.'" /></div>';
        
        //Update setting?

        //Post status
        $content .= '<div><label >Post Status:</label>';
        $content .= self::getPostStatusSelector('ag_course_detail_status_'.$course_type).'</div>';
        
        //Post type
        $content .= '<div><label >Post Type:</label>';
        $content .= self::getPostTypesSelector('ag_course_detail_type_'.$course_type) .'</div>';

        $content .= '<div><label>Update Template:<input type="checkbox" checked="checked" name="ag_cd_template_update_'.$course_type.'" id="ag_cd_template_update_'.$course_type.'"/><span></label> </div>';
        return $content;
    }
    function renderCourseEnrolmentContent($course_type = WORKSHOP)
    {
        $content = "";

        
        // Page Title
        $title = "Course Enrol";
        if ($course_type == self::PROGRAM) {
            $title = "Qualification Enrol";
        }
        $content .= '<div><label >Page Title: </label><input value="'.$title.'" id="ag_enrol_title_'.$course_type.'" name="ag_enrol_title_'.$course_type.'"/></div>';
        
        //Update setting?

        //Post status
        $content .= '<div><label >Post Status:</label>';
        $content .= self::getPostStatusSelector('ag_enrol_status_'.$course_type).'</div>';
        
        //Post type
        $content .= '<div><label >Post Type:</label>';
        $content .= self::getPostTypesSelector('ag_enrol_type_'.$course_type) .'</div>';
        $content .= '<div><label >Config:</label>';
        $content .= self::renderConfigSelector('ag_enrol_config_'.$course_type) .'</div>';
       
        return $content;
    }
    function renderEnquiryContent($course_type = WORKSHOP)
    {
        $content = "";
        
                
        // Page Title
        $title = "Course Enquiry";
        if ($course_type == self::PROGRAM) {
            $title = "Qualification Enquiry";
        }
                $content .= '<div><label >Page Title: </label><input value="'.$title.'" id="ag_enquire_title_'.$course_type.'" name="ag_enquire_title_'.$course_type.'" /></div>';
                
                //Update setting?
        
                //Post status
                $content .= '<div><label >Post Status:</label>';
                $content .= self::getPostStatusSelector('ag_enquire_status_'.$course_type).'</div>';
                
                //Post type
                $content .= '<div><label >Post Type:</label>';
                $content .= self::getPostTypesSelector('ag_enquire_type_'.$course_type) .'</div>';
                $content .= '<div><label >Config:</label>';
                $content .= self::renderConfigSelector('ag_enquire_config_'.$course_type) .'</div>';
               
                return $content;
    }

    function getPostStatusSelector($selectorID = "")
    {
        $statuses = get_post_statuses();
        $select = '<select id="'.$selectorID.'" name="'.$selectorID.'">';
        foreach ($statuses as $key => $value) {
            if ($key == 'publish') {
                $select .= '<option value="'.$key.'" selected="selected" >'.$value.'</option>';
            } else {
                $select .= '<option value="'.$key.'" >'.$value.'</option>';
            }
        }
        $select .='</select>';
        return $select;
    }
    function getPostTypesSelector($selectorID = "")
    {
        

        $types = get_post_types('', 'objects');
        
        $select = '<select id="'.$selectorID.'" name="'.$selectorID.'">';
        foreach ($types as $post_type) {
            if ($post_type->name == 'page') {
                $select .= '<option value="'.$post_type->name.'" selected="selected" >'.$post_type->label.'</option>';
            } else {
                $select .= '<option value="'.$post_type->name.'" >'.$post_type->label.'</option>';
            }
        }
        $select .='</select>';
        return $select;
    }
    function renderConfigSelector($selectorID = "")
    {

        $enrollerWidgetSettings = get_option ( 'ax_enroller_widget_settings' );
        if (!empty($enrollerWidgetSettings)) {
            $data = json_decode($enrollerWidgetSettings, true, 10);
            
            $select = '<select id="'.$selectorID.'" name="'.$selectorID.'">';
        
            foreach ($data as $key => $value) {
                $label = "Config_ID: ". $key;
                if (!empty($value['config_name'])) {
                    $label = $value['config_name'];
                }
                $select .= '<option value="'.$key.'" >'.$label.'</option>';
            }

            $select .='</select>';
            return $select;
        }
        return '<em>Set up your configs first. </em>';
    }


    function renderStyleSelectorCourse($selectorID = "")
    {
        $style = 'ax-list';
        $options = array (
            "ax-no-style" => "No CSS Styling",
            "ax-tile" => "Standard Tile Format",
            "ax-list" => "Standard List Format",
            "ax-list-image" => "List with Left Image"
        );
        $select = '<select id="'.$selectorID.'" name="'.$selectorID.'">';
        foreach ($options as $key => $value) {
            if ($key == $style) {
                $select.= '<option value="' . $key . '" selected="selected">' . $value . '</option>';
            } else {
                $select.= '<option value="' . $key . '">' . $value . '</option>';
            }
        }
        $select.= '</select>';
        return $select;
    }

    function renderStyleSelectorDetails($selectorID = "")
    {
        $style = 'ax-list';
        $options = array (
            "ax-no-style" => "No CSS Styling",
            "ax-tile" => "Standard Tile Format",
            "ax-list" => "Standard List Format",
           
        );
        $select = '<select id="'.$selectorID.'" name="'.$selectorID.'">';
        foreach ($options as $key => $value) {
            if ($key == $style) {
                $select.= '<option value="' . $key . '" selected="selected">' . $value . '</option>';
            } else {
                $select.= '<option value="' . $key . '">' . $value . '</option>';
            }
        }
        $select.= '</select>';
        return $select;
    }
}
