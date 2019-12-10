<?php
if (!defined('ABSPATH')) {
    die('-1');
}

/**
 * 
 * @author robbisson
 * Class Holds Shared Shortcode Parameters for Visual Composer.
 * Access by AX_VC_PARAMS::PARAMNAME
 *
 */
class AX_VC_PARAMS
{
    public static $AX_VC_COURSE_TYPE_PARAM = array(
        'type' => 'dropdown',
        'heading' => 'Course Type',
        'param_name' => 'course_type',
        'value' => array(
            'Dynamic' => '',
            'Workshop' => 'w',
            'Program' => 'p',
            'eLearning' => 'el',
        ),
        'admin_label' => true,

    );
    public static $AX_VC_COURSE_TYPE_W_P = array(
        'type' => 'dropdown',
        'heading' => 'Course Type',
        'param_name' => 'course_type',
        'value' => array(
      
            'Workshop' => 'w',
            'Program' => 'p',
     
        ),
        'admin_label' => true,

    );

    public static $AX_VC_WORKSHOP_VENUES = array(
        'type' => 'dropdown',
        'heading' => 'Venues not Locations( Workshops)',
        'param_name' => 'workshop_venues',
        'value' => array(
            'No' => 0,
            'Yes' => 1,
        )
    );
    public static $AX_VC_CONFIG_ID = array(
        'type' => 'textfield',
        'heading' => 'Config ID',
        'admin_label' => true,
        'param_name' => 'config_id',
        "description" => "Configuration ID from the Enroller Configuration Tool.",
    );


    public static $AX_VC_WORKSHOP_DISPLAY = array(
        'type' => 'dropdown',
        'heading' => 'Display Workshops',
        'param_name' => 'workshop_display',
        'value' => array(
            'No' => 0,
            'Yes' => 1,
        )
    );
    public static $AX_VC_PROGRAM_DISPLAY = array(
        'type' => 'dropdown',
        'heading' => 'Display Program',
        'param_name' => 'program_display',
        'value' => array(
            'No' => 0,
            'Yes' => 1,
        )
    );
    public static $AX_VC_ELEARNING_DISPLAY = array(
        'type' => 'dropdown',
        'heading' => 'Display ELearning',
        'param_name' => 'elearning_display',
        'value' => array(
            'No' => 0,
            'Yes' => 1,
        )
    );
    public static $AX_VC_COURSEID_PARAM = array(
        'type' => 'textfield',
        'heading' => 'Course ID',
        'param_name' => 'course_id',
        "description" => "Course ID, Leave blank for dynamic.",
        'admin_label' => true,

    );
    public static $AX_VC_INSTANCEID = array(
        'type' => 'textfield',

        'heading' => 'Instance ID',
        'param_name' => 'instance_id',
        "description" => "Instance ID, Leave blank for dynamic or embedding within a parent shortcode.",
        'admin_label' => true,
    );
    public static $AX_VC_LOCATION_RESTRICTION_PARAM = array(
        'type' => 'textfield',
        'heading' => 'Location Restriction',
        'param_name' => 'location_restriction',
        "description" => "Filter all (Workshop) Course Searches to a single Location String.",
        "group" => 'Filters'

    );
    public static $AX_VC_DL_LOCATION_RESTRICTION_PARAM = array(
        'type' => 'textfield',
        'heading' => 'Delivery Location Restriction',
        'param_name' => 'delivery_location_restriction',
        "description" => "Filter all (Program) Course Searches to a single Delivery Location. <br />NOTE: Uses Delivery Location ID - not Name",
        "group" => 'Filters'

    );
    public static $AX_VC_VENUE_RESTRICTION_PARAM = array(
        'type' => 'textfield',
        'heading' => 'Venue Restriction',
        'param_name' => 'venue_restriction',
        "description" => "Filter all (Workshop) Course Searches to a single Venue. <br />NOTE: Uses Venue Contact ID - not Name.",
        "group" => 'Filters'

    );

    public static $AX_VC_EXTRA_TEXT = array(
        'type' => 'textfield',
        'heading' => 'Extra Text',
        'param_name' => 'extra_text',
        "description" => "Append the returned value with additional text",

    );


    public static $AX_VC_WRAPPER_TAG_PARAM = array(
        'type' => 'dropdown',
        'heading' => 'Wrapper Tag',
        'param_name' => 'wrap_tag',
        'value' => array(
            'No Tag' => '',
            'Div' => 'div',
            'H1' => 'h1',
            'H2' => 'h2',
            'H3' => 'h3',
            'H4' => 'h4',
            'H5' => 'h5',
            'H6' => 'h6',
            'Paragraph' => 'p',
            'Span' => 'span',

        ),
        'group' => 'Design options',
    );
    public static $AX_VC_HEADING_WRAPPER_TAG = array(
        'type' => 'dropdown',
        'heading' => 'Heading Wrapper Tag',
        'param_name' => 'heading_wrap_tag',
        'value' => array(
            'No Tag' => '',
            'Div' => 'div',
            'H1' => 'h1',
            'H2' => 'h2',
            'H3' => 'h3',
            'H4' => 'h4',
            'H5' => 'h5',
            'H6' => 'h6',
            'Paragraph' => 'p',
            'Span' => 'span',

        ),
        'group' => 'Design options',
    );
    

    public static $AX_VC_CUSTOM_CSS_PARAM = array(
        'type' => 'css_editor',
        'heading' => 'Css',
        'param_name' => 'custom_css',
        'group' => 'Design options',
    );

    public static $AX_VC_ADD_CSS_CLASS_PARAM = array(
        'type' => 'textfield',
        'heading' => 'CSS Class',
        'param_name' => 'class_to_add',
        'group' => 'Design options',
        'description' => 'CSS Classes to add to Wrapper. Separate with Space.'
    );

    public static $AX_VC_LINK_ADD_CLASS_PARAM = array(
        'type' => 'textfield',
        'heading' => 'Link Class',
        'param_name' => 'link_class',
        'group' => 'Link Settings',
        'description' => 'CSS Classes to add to Link. Separate with Space.'
    );

    public static $AX_VC_LINK_TEXT = array(
        'type' => 'textfield',
        'heading' => 'Link Text',
        'param_name' => 'link_text',
        'description' => 'Button/Link Text',
        'group' => 'Link Settings',
        'admin_label' => true,
    );

    /**** VACANCY ****/
    public static $AX_VC_VACANCY_THRESHOLD_TEXT = array(
        'type' => 'textfield',
        'heading' => 'Threshold Vacancy Text',
        'param_name' => 'vacancy_text',
        'description' => 'Text to show when the available vacancy is at or below threshold.',
        'group' => 'Link Settings',

    );

    public static $AX_VC_0_VACANCY_TEXT = array(
        'type' => 'textfield',
        'heading' => 'No Vacancy Text',
        'param_name' => 'vacancy_0_text',
        'description' => 'Text to show when there is no vacancy',
        'group' => 'Link Settings',

    );

    public static $AX_VC_VACANCY_THRESHOLD_CLASS = array(
        'type' => 'textfield',
        'heading' => 'Vacancy Threshold CSS',
        'param_name' => 'vacancy_class',
        'group' => 'Link Settings',
        'description' => 'CSS Classes to add to Link when the available vacancy is at or below threshold. Separate with Space.'
    );

    public static $AX_VC_0_VACANCY_CLASS = array(
        'type' => 'textfield',
        'heading' => 'No Vacancy CSS',
        'param_name' => 'vacancy_0_class',
        'group' => 'Link Settings',
        'description' => 'CSS Classes to add to Link when there is no vacancy. Separate with Space.'
    );

    public static $AX_VC_VACANCY_THRESHOLD_COUNT = array(
        'type' => 'textfield',
        'heading' => 'Vacancy Threshold',
        'param_name' => 'vacancy_threshold',
        'description' => 'At this threshold, apply the threshold class/text. Numeric',
        'group' => 'Link Settings',

    );

    public static $AX_VC_SHOW_FULL_INSTANCES = array(
        'type' => 'dropdown',
        'heading' => 'Show Full Instances',
        'param_name' => 'show_full_instances',
        'value' => array(
            'No' => 0,
            'Yes' => 1,
        ),
        'description' => 'Toggle Display of Instances that have no spaces Available.',
        'admin_label' => true,
    );

    /**** VACANCY ****/

    public static $AX_VC_LINK_URL = array(
        'type' => 'vc_link',
        'heading' => "Link URL",
        'param_name' => 'link_url',
        "description" => "URL to load when clicking the button / form target",
        'group' => 'Link Settings'
    );

    public static $AX_VC_DRILLDOWN_URL = array(
        'type' => 'textfield',
        'heading' => 'Drilldown URL',
        'param_name' => 'drilldown_url',
        'group' => 'Link Settings',
        'description' => 'Default URL to load when clicking button/link.'
    );

    /**** DOMAIN ****/
    public static $AX_VC_DOMAINID_PARAM = array(
        'type' => 'textfield',
        'heading' => 'Domain ID',
        'param_name' => 'domain_id',
        "description" => "Domain ID, Leave blank for dynamic.",
        'admin_label' => true,


    );

    public static $AX_VC_SHOW_EMPTY_DOMAINS = array(
        'type' => 'dropdown',
        'heading' => 'Show Courses with no Domain',
        'param_name' => 'show_empty_domains',
        'value' => array(
            'Show' => 1,
            'Hide' => 0
        ),
        'description' => 'Toggle if instances with no set domain will be displayed.',
        'admin_label' => false,
    );
 



    /**** FILTERS ****/
    public static $AX_VC_FILTER_VENUE_ID = array(
        'type' => 'textfield',
        'heading' => 'Venue ID Restrictions',
        'param_name' => 'filter_venue_id',
        "description" => "Filter all (Workshop) Venue lists to specific venues. Comma separated list.<br />NOTE: Uses Venue Contact ID - not Name.",
        "group" => 'Filters'

    );
    public static $AX_VC_FILTER_DELIVERY_ID = array(
        'type' => 'textfield',
        'heading' => 'Delivery Location ID Restrictions',
        'param_name' => 'filter_delivery_id',
        "description" => "Filter all (Program) Delivery Location lists to specific Locations. Comma separated list.<br />NOTE: Uses Delivery Location ID - not Name.",
        "group" => 'Filters'

    );
    public static $AX_VC_FILTER_LOCATION_STRING = array(
        'type' => 'textfield',
        'heading' => 'Location (string) Restrictions',
        'param_name' => 'filter_location',
        "description" => "Filter all (Workshop) Location lists to specific locations. Comma separated list.<br />NOTE: Must Match Location Exactly.",
        "group" => 'Filters'
    );

    public static $AX_VC_FILTER_COURSE_IDS = array(
        'type' => 'textfield',
        'heading' => 'Filter Courses',
        'param_name' => 'course_list_filter',
        "description" => "Filter Courses to display (Comma separated list of IDs)<p>Use the exclusive options to switch filtering type.</p>",
        "group" => 'Filters'
    );
    public static $AX_VC_FILTER_DOMAIN_IDS = array(
        'type' => 'textfield',
        'heading' => 'Filter Domains',
        'param_name' => 'domain_list_filter',
        "description" => "Filter Domains to display (Comma separated list of IDs)<p>Use the exclusive options to switch filtering type.</p>",
        "group" => 'Filters'
    );

    public static $AX_VC_COURSEID_FILTER = array(
        'type' => 'textfield',
        'heading' => 'Course ID Filter',
        'param_name' => 'course_filter',
        "description" => "Filter to a single Course ID",
        'admin_label' => true,

    );
    public static $AX_VC_DOMAINID_FILTER = array(
        'type' => 'textfield',
        'heading' => 'Domain ID Filter',
        'param_name' => 'domain_filter',
        "description" => "Filter to a single Domain ID",
        'admin_label' => true,

    );
    public static $AX_VC_WORKSHOP_DEFAULT_RANGE = array(
        'type' => 'dropdown',
        'heading' => 'Workshop Default Range',
        'param_name' => 'workshop_default_period',
        'value' => array(
            '1 Month' => 1,
            '2 Months' => 2,
            '3 Months' => 3,
        )
    );

    /***** FILTER OPTIONS *****/
    public static $AX_VC_COURSE_FILTER_EXCLUDE = array(
        'type' => 'dropdown',
        'heading' => 'Exclude/Include Courses',
        'param_name' => 'course_filter_exclude',
        'value' => array(
            'Exclude' => 1,
            'Include' => 0
        ),
        
        'description' => 'Toggle if the Course List filter will Include, or exclude courses.',
        'admin_label' => false,
        "group" => 'Filters'
    );

    public static $AX_VC_DOMAIN_FILTER_EXCLUDE = array(
        'type' => 'dropdown',
        'heading' => 'Exclude/Include Domains',
        'param_name' => 'domain_filter_exclude',
        'value' => array(
            'Exclude' => 1,
            'Include' => 0
        ),
        'description' => 'Toggle if the Domain List filter will Include, or exclude domains.',
        'admin_label' => false,
        "group" => 'Filters'
    );
    public static $AX_VC_SHOW_DOMAIN_SELECT = array(
        'type' => 'dropdown',
        'heading' => 'Hide the Domain Select',
        'param_name' => 'hide_domains',
        'value' => array(
            'Show' => 0,
            'Hide' => 1
        ),
        'description' => 'Toggle if the domain select filter is displayed.',
        'admin_label' => false,
        
    );

    public static $AX_VC_SHOW_COURSE_SELECT = array(
        'type' => 'dropdown',
        'heading' => 'Hide the Course Select',
        'param_name' => 'hide_courses',
        'value' => array(
            'Show' => 0,
            'Hide' => 1
        ),
        'description' => 'Toggle if the Course select filter is displayed.',
        'admin_label' => false,
    );


    /***** TERMINOLOGY *****/
    public static $AX_VC_TERMINOLOGY_WORKSHOP = array(
        'type' => 'textfield',
        'heading' => 'Terminology Workshop',
        'param_name' => 'terminology_w',
        'group' => 'Terminology'
    );
    public static $AX_VC_TERMINOLOGY_PROGRAM = array(
        'type' => 'textfield',
        'heading' => 'Terminology Program',
        'param_name' => 'terminology_p',
        'group' => 'Terminology'
    );
    public static $AX_VC_TERMINOLOGY_ELEARNING = array(
        'type' => 'textfield',
        'heading' => 'Terminology ELearning',
        'param_name' => 'terminology_el',
        'group' => 'Terminology'
    );

    public static $AX_VC_SHOPPING_CART = array(
        'type' => 'dropdown',
        'heading' => 'Is Shopping Cart',
        'param_name' => 'shopping_cart',
        'value' => array(
            'No' => 0,
            'Yes' => 1,
        )
    );
    public static $AX_VC_TERMINOLOGY_COURSE = array(
        'type' => 'textfield',
        'heading' => 'Terminology Course',
        'param_name' => 'terminology_course',
        'group' => 'Terminology'
    );
    public static $AX_VC_TERMINOLOGY_DOMAIN = array(
        'type' => 'textfield',
        'heading' => 'Terminology Domain',
        'param_name' => 'terminology_domain',
        'group' => 'Terminology'
    );
}



