jQuery(document).ready(function($) {
    var FIELD_LIST = {
        course_type_p_w: {
            type: "listbox",
            name: "course_type",
            label: "Course Type",
            tooltip: "Set Course Type",
            values: [
                { text: "Workshops", value: "w" },
                { text: "Programs/Qualifications", value: "p" }
            ]
        },
        drilldown_url: {
            type: "textbox",
            multiline: false,
            name: "drilldown_url",
            label: "Drilldown URL",
            tooltip: "Default URL to load when clicking button/link."
        },
        course_filter: {
            type: "textbox",
            multiline: false,
            name: "course_filter",
            label: "Course ID Filter",
            tooltip: "Filter to a single course"
        },
        domain_filter: {
            type: "textbox",
            name: "domain_filter",
            label: "Domain ID Filter",
            tooltip: "Set a Domain ID to filter by (not text)"
        },
        show_empty_domains: {
            type: "listbox",
            name: "show_empty_domains",
            label: "Show Empty Domains",
            tooltip: "Show / Hide instances with no domain",
            values: [{ text: "Show", value: 1 }, { text: "Hide", value: 0 }]
        },
        hide_courses: {
            type: "listbox",
            name: "hide_courses",
            label: "Show Course Select",

            values: [{ text: "Show", value: 0 }, { text: "Hide", value: 1 }]
        },
        hide_domains: {
            type: "listbox",
            name: "hide_domains",
            label: "Show Domain Select",
            tooltip: "Show Domain Select",
            values: [{ text: "Show", value: 0 }, { text: "Hide", value: 1 }]
        },

        course_list_filter: {
            type: "textbox",
            multiline: false,
            name: "course_list_filter",
            label: "Filter Courses",
            tooltip:
                "Filter Courses to display (Comma separated list of IDs).  Use the exclusive options to switch filtering type."
        },
        domain_list_filter: {
            type: "textbox",
            multiline: false,
            name: "domain_list_filter",
            label: "Filter Domains",
            tooltip:
                "Filter Domains to display (Comma separated list of IDs).  Use the exclusive options to switch filtering type."
        },
        course_filter_exclude: {
            type: "listbox",
            name: "course_filter_exclude",
            label: "Exclude/Include Courses",
            tooltip: "Toggle if the Course List filter will Include, or exclude courses.",
            values: [{ text: "Exclude", value: 1 }, { text: "Include", value: 0 }]
        },
        domain_filter_exclude: {
            type: "listbox",
            name: "domain_filter_exclude",
            label: "Exclude/Include Domains",
            tooltip: "Toggle if the Domain List filter will Include, or exclude Domains.",
            values: [{ text: "Exclude", value: 1 }, { text: "Include", value: 0 }]
        },
        terminology_domain:{
            type: "textbox",
            multiline: false,
            name: "terminology_domain",
            label: "Terminology Domain",
            tooltip: "Override Default terminology for Domain"
        },
        terminology_course:{
            type: "textbox",
            multiline: false,
            name: "terminology_course",
            label: "Terminology Course",
            tooltip: "Override Default terminology for Course"
        },
        workshop_default_period: {
            type: "listbox",
            name: "workshop_default_period",
            label: "Workshop Default Range",
            tooltip: "Default search range for workshops",
            values: [{ text: "1 Month", value: 1 }, { text: "2 Months", value: 2 }, { text: "3 Months", value: 3 }]
        },
    };

    function isEmpty(data) {
        var empty = true;
        if (data !== null) {
            if (data !== "") {
                empty = false;
            }
        }
        return empty;
    }

    tinymce.create("tinymce.plugins.axcelerate", {
        /**
         * Initializes the plugin, this will be executed after the plugin has been created.
         * This call is done before the editor instance has finished it's initialization so use the onInit event
         * of the editor instance to intercept that event.
         *
         * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
         * @param {string} url Absolute URL to where the plugin is located.
         */

        init: function(ed, url) {
            // Register buttons - trigger above command when clicked

            ed.addButton("axcelerate_legacy_shortcodes", {
                type: "menubutton",
                text: "Legacy aX Shortcodes",
                icon: false,
                menu: [
                    {
                        text: "Enquiry",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 720 < width ? 720 : width;
                            W = W - 80;
                            H = H - 84;
                            tb_show(
                                "Axcelerate Enquiry button Settings",
                                "#TB_inline?width=" +
                                    W +
                                    "&height=" +
                                    H +
                                    "&inlineId=axcelerate_enquiry_shortcode_dialog"
                            );
                        }
                    },
                    {
                        text: "Enrolment",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 720 < width ? 720 : width;
                            W = W - 80;
                            H = H - 84;
                            tb_show(
                                "Axcelerate Enrollment button Settings",
                                "#TB_inline?width=" +
                                    W +
                                    "&height=" +
                                    H +
                                    "&inlineId=axcelerate_enrolment_shortcode_dialog"
                            );
                        }
                    },
                    {
                        text: "Search",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 720 < width ? 720 : width;
                            W = W - 80;
                            H = H - 84;
                            tb_show(
                                "Axcelerate Search Settings",
                                "#TB_inline?width=" +
                                    W +
                                    "&height=" +
                                    H +
                                    "&inlineId=axcelerate_search_shortcode_dialog"
                            );
                        }
                    }
                ]
            });

            ed.addButton("axcelerate_utility_shortcodes", {
                type: "menubutton",
                text: "aX Utility Shortcodes",
                icon: false,
                menu: [
                    {
                        text: "aX Login Form",
                        onclick: function() {
                            ed.insertContent("[ax_login_form]");
                        }
                    },
                    {
                        text: "aX Course Search",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "listbox",
                                    multiline: true,
                                    name: "as_widget",
                                    label: "Add Widget Classes",
                                    tooltip:
                                        "Add WP Widget CSS Classes to the generated search form",
                                    values: [
                                        { text: "No Widget Classes", value: "", selected: true },
                                        { text: "Add Widget Classes", value: true }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "search_url",
                                    label: "Search URL",
                                    tooltip:
                                        "URL of the page to perform the search against. Leave blank for current page."
                                }
                            ];

                            ed.windowManager.open({
                                title: "aXcelerate Course Search",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (key != "template_override") {
                                            if (!isEmpty(value)) {
                                                extraOptions +=
                                                    " " + key + "=" + encodeURIComponent(value);
                                            }
                                        }
                                    });

                                    ed.insertContent("[ax_search_form" + extraOptions + "]");
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "aX Enrol Event",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "class_to_add",
                                    label: "CSS Classes",
                                    tooltip: "CSS Classes to add to Wrapper. Separate with Space."
                                }
                            ];

                            ed.windowManager.open({
                                title: "aX Enrol Event",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (key != "template_override") {
                                            if (!isEmpty(value)) {
                                                extraOptions +=
                                                    " " + key + "=" + encodeURIComponent(value);
                                            }
                                        }
                                    });

                                    ed.insertContent("[ax_enrol_event" + extraOptions + "]");
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "aX Enrol Event Enrolment List",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "class_to_add",
                                    label: "CSS Classes",
                                    tooltip: "CSS Classes to add to Wrapper. Separate with Space."
                                }
                            ];

                            ed.windowManager.open({
                                title: "aX Enrol Event Enrolment List",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (key != "template_override") {
                                            if (!isEmpty(value)) {
                                                extraOptions +=
                                                    " " + key + "=" + encodeURIComponent(value);
                                            }
                                        }
                                    });

                                    ed.insertContent(
                                        "[ax_enrol_event_enrolments_list" + extraOptions + "]"
                                    );
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "Enrolment/Enquiry Widget",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "location_restriction",
                                    label: "Location restriction",
                                    tooltip:
                                        "Limit Enrolment widget to locations containing this string."
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "delivery_location_restriction",
                                    label: "Delivery Location ID",
                                    tooltip: "Restrict Programs to a single delivery location."
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "venue_restriction",
                                    label: "Venue ID Restriction",
                                    tooltip: "Restrict Workshops to a single Venue ID."
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "instance_id",
                                    label: "Instance ID",
                                    tooltip: "The ID of the Course Instance"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Set Course Type",
                                    values: [
                                        {
                                            text:
                                                "Dynamic - When used within an encolsing top level shortcode",
                                            value: ""
                                        },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "listbox",
                                    name: "shopping_cart",
                                    label: "Is Shopping Cart",
                                    tooltip: "Enables Sshopping Cart Processing",
                                    values: [{ text: "No", value: 0 }, { text: "Yes", value: 1 }]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "config_id",
                                    label: "Enrolment Widget Config",
                                    tooltip: "The Configuration to be loaded into the widget"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Enrolment Widget",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent("[ax_enrol_widget " + extraOptions + "]");
                                },
                                width: W,
                                height: H
                            });
                        }
                    },

                    {
                        text: "Enquiry Widget",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "instance_id",
                                    label: "Instance ID",
                                    tooltip: "The ID of the Course Instance"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Set Course Type",
                                    values: [
                                        {
                                            text:
                                                "Dynamic - When used within an encolsing top level shortcode",
                                            value: ""
                                        },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "config_id",
                                    label: "Enrolment Widget Config",
                                    tooltip: "The Configuration to be loaded into the widget"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Enquiry Widget",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent("[ax_enquiry_widget " + extraOptions + "]");
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "Complex Course Search",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            ed.windowManager.open({
                                title: "aXcelerate Complex Course Search",
                                body: [
                                    FIELD_LIST.drilldown_url,
                                    FIELD_LIST.course_type_p_w,
                                    FIELD_LIST.course_filter,
                                    FIELD_LIST.workshop_default_period,
                                    FIELD_LIST.domain_filter,
                                    FIELD_LIST.hide_courses,
                                    FIELD_LIST.course_list_filter,
                                    FIELD_LIST.course_filter_exclude,
                                    FIELD_LIST.terminology_course,
                                    FIELD_LIST.hide_domains,
                                    FIELD_LIST.domain_list_filter,
                                    FIELD_LIST.domain_filter_exclude, 
                                    FIELD_LIST.show_empty_domains,
                                    FIELD_LIST.terminology_domain
                                ],
                                onsubmit: function(e) {
                                 
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent("[ax_complex_course_search " + extraOptions + "]");
                                },
                                width: W,
                                height: H
                            });
                        }
                    },

                    {
                        text: "AJAX Course Search",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "listbox",
                                    name: "workshop_display",
                                    label: "Display Workshops",
                                    values: [{ text: "No", value: 0 }, { text: "Yes", value: 1 }]
                                },
                                {
                                    type: "listbox",
                                    name: "program_display",
                                    label: "Display Program",
                                    values: [{ text: "No", value: 0 }, { text: "Yes", value: 1 }]
                                },
                                {
                                    type: "listbox",
                                    name: "elearning_display",
                                    label: "Display ELearning",
                                    values: [{ text: "No", value: 0 }, { text: "Yes", value: 1 }]
                                },
                                {
                                    type: "listbox",
                                    name: "workshop_venues",
                                    label: "Venues not Locations( Workshops)",
                                    values: [{ text: "No", value: 0 }, { text: "Yes", value: 1 }]
                                },

                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "filter_venue_id",
                                    label: "Filter Venues",
                                    tooltip:
                                        "Filter all (Workshop) Venue lists to specific venues. Comma separated list.<br />NOTE: Uses Venue Contact ID - not Name."
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "filter_delivery_id",
                                    label: "Filter Location ID",
                                    tooltip:
                                        "Filter all (Program) Delivery Location lists to specific Locations. Comma separated list.<br />NOTE: Uses Delivery Location ID - not Name."
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "filter_location",
                                    label: "Location (string) Restrictions",
                                    tooltip:
                                        "Filter all (Workshop) Location lists to specific locations. Comma separated list.<br />NOTE: Must Match Location Exactly."
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "drilldown_url",
                                    label: "Drilldown URL",
                                    tooltip: "Default URL to load when clicking button/link."
                                },

                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "link_text",
                                    label: "Link Text",
                                    tooltip: "Enrol Link Text - Defaults to Enrol Now."
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "link_class",
                                    label: "Link CSS Class",
                                    tooltip: "CSS Classes to add to Link. Separate with Space"
                                }
                            ];

                            ed.windowManager.open({
                                title: "aXcelerate Ajax Course Search",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent("[ax_course_ajax " + extraOptions + "]");
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "aX Shopping Cart List",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "class_to_add",
                                    label: "CSS Classes",
                                    tooltip: "CSS Classes to add to Wrapper. Separate with Space."
                                }
                            ];

                            ed.windowManager.open({
                                title: "aX Shopping Cart List",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (key != "template_override") {
                                            if (!isEmpty(value)) {
                                                extraOptions +=
                                                    " " + key + "=" + encodeURIComponent(value);
                                            }
                                        }
                                    });

                                    ed.insertContent("[ax_shopping_cart_list" + extraOptions + "]");
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "aX Shopping Cart Count",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "class_to_add",
                                    label: "CSS Classes",
                                    tooltip: "CSS Classes to add to Wrapper. Separate with Space."
                                }
                            ];

                            ed.windowManager.open({
                                title: "aX Shopping Cart Cout",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (key != "template_override") {
                                            if (!isEmpty(value)) {
                                                extraOptions +=
                                                    " " + key + "=" + encodeURIComponent(value);
                                            }
                                        }
                                    });

                                    ed.insertContent(
                                        "[ax_shopping_cart_count" + extraOptions + "]"
                                    );
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "aX Shopping Cart Cost",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "class_to_add",
                                    label: "CSS Classes",
                                    tooltip: "CSS Classes to add to Wrapper. Separate with Space."
                                }
                            ];

                            ed.windowManager.open({
                                title: "aX Shopping Cart Cost",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (key != "template_override") {
                                            if (!isEmpty(value)) {
                                                extraOptions +=
                                                    " " + key + "=" + encodeURIComponent(value);
                                            }
                                        }
                                    });

                                    ed.insertContent("[ax_shopping_cart_cost" + extraOptions + "]");
                                },
                                width: W,
                                height: H
                            });
                        }
                    }
                ]
            });

            ed.addButton("ax_course_list_shortcodes", {
                type: "menubutton",
                text: "aX Course List",
                icon: false,
                menu: [
                    {
                        text: "Full Course List",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Adjusting these settings will override the defaults set in the aXcelerate Integration Settings.",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "listbox",
                                    multiline: true,
                                    name: "template_override",
                                    label: "Course Detail Template",
                                    tooltip: "Override the default template",
                                    values: [
                                        { text: "Use the Default", value: "", selected: true },
                                        { text: "Override", value: "1" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "training_cat",
                                    label: "Training Category Filter",
                                    tooltip: "Restrict results to a training category"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Restrict List to Course Type",
                                    values: [
                                        { text: "All", value: "all", selected: true },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "listbox",
                                    name: "no_search",
                                    label: "Allow Search Filtering",
                                    tooltip:
                                        "Allow training categories or search terms to be passed through URL params.",
                                    values: [
                                        {
                                            text: "Allow Search Filtering",
                                            value: "",
                                            selected: true
                                        },
                                        { text: "No Search Filtering", value: true }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "search_term",
                                    label: "Search Term Filter",
                                    tooltip: "Restrict results by a search Term"
                                },
                                {
                                    type: "listbox",
                                    name: "style",
                                    label: "Style",
                                    tooltip: "Override the default Style",
                                    values: [
                                        { text: "Standard Tile", value: "ax-tile", selected: true },
                                        { text: "Standard List", value: "ax-list" },
                                        { text: "List with Images", value: "ax-list-image" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "details_link",
                                    label: "Course Details Page Link",
                                    tooltip: "Override the default Course Details Page"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "teminology_w",
                                    label: "Terminology Workshop",
                                    tooltip: "Override Default terminology for Workshops"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "teminology_p",
                                    label: "Terminology Program Override",
                                    tooltip: "Override Default terminology for Programs"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "teminology_el",
                                    label: "Terminology eLearning Override",
                                    tooltip: "Override Default terminology for Elearning"
                                }
                            ];

                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Course List - Full",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (key != "template_override") {
                                            if (!isEmpty(value)) {
                                                extraOptions +=
                                                    " " + key + "=" + encodeURIComponent(value);
                                            }
                                        }
                                    });

                                    if (e.data.template_override == 1) {
                                        ed.insertContent(
                                            "[ax_course_list" + extraOptions + "][/ax_course_list]"
                                        );
                                    } else {
                                        ed.insertContent("[ax_course_list" + extraOptions + "]");
                                    }
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "Course Name",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;

                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },

                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Restrict List to Course Type",
                                    values: [
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_name",
                                    label: "Course Name Override",
                                    tooltip: "Enforce the name, removing the API call"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Course Name",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent("[ax_course_name" + extraOptions + "]");
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "Course Image",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;

                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "infobox",
                                    text: "Will Parse the Course Short Description for an Image",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },

                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Restrict List to Course Type",
                                    values: [
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "short_description",
                                    label: "Short Description Override",
                                    tooltip: "Enforce the short description, removing the API call"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Course Image",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent("[ax_course_image" + extraOptions + "]");
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "(P) Course Stream",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Restrict List to Course Type",
                                    values: [
                                        {
                                            text:
                                                "Dynamic - When used within an encolsing top level shortcode",
                                            value: ""
                                        },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_stream",
                                    label: "Course Stream Override",
                                    tooltip: "Enforce the Stream, removing the API call"
                                }
                            ];

                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Course Stream",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent("[ax_course_stream" + extraOptions + "]");
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "Course Code",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Restrict List to Course Type",
                                    values: [
                                        {
                                            text:
                                                "Dynamic - When used within an encolsing top level shortcode",
                                            value: ""
                                        },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_code",
                                    label: "Course Code Override",
                                    tooltip: "Enforce the Code, removing the API call"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Course Code",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent("[ax_course_code" + extraOptions + "]");
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "Course Type",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Restrict to Course Type",
                                    values: [
                                        { text: "No Restriction", value: "" },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "teminology_w",
                                    label: "Terminology Workshop",
                                    tooltip: "Override Default terminology for Workshops"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "teminology_p",
                                    label: "Terminology Program Override",
                                    tooltip: "Override Default terminology for Programs"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "teminology_el",
                                    label: "Terminology eLearning Override",
                                    tooltip: "Override Default terminology for Elearning"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Course Type",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent("[ax_course_type" + extraOptions + "]");
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "Course Short Description",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Restrict List to Course Type",
                                    values: [
                                        {
                                            text:
                                                "Dynamic - When used within an encolsing top level shortcode",
                                            value: ""
                                        },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "listbox",
                                    name: "hide_images",
                                    label: "Hide Images",
                                    tooltip: "Hide Images in the short description",
                                    values: [
                                        { text: "Display Images", value: "" },
                                        { text: "Hide Images", value: true }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: true,
                                    name: "short_description",
                                    label: "Course Short Description Override",
                                    tooltip: "Enforce the Description, removing the API call"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Course Short Description",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent(
                                        "[ax_course_short_description" + extraOptions + "]"
                                    );
                                },
                                width: W,
                                height: H
                            });
                        }
                    },

                    {
                        text: "Course Details Link",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Restrict List to Course Type",
                                    values: [
                                        {
                                            text:
                                                "Dynamic - When used within an encolsing top level shortcode",
                                            value: ""
                                        },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "link_text",
                                    label: "Link Text",
                                    tooltip: "Link Text"
                                },
                                {
                                    type: "textbox",
                                    name: "class_to_add",
                                    multiline: false,
                                    label: "CSS Class",
                                    tooltip: "Add CSS class to button"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Details Link",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent("[ax_details_page_link" + extraOptions + "]");
                                },
                                width: W,
                                height: H
                            });
                        }
                    }
                ]
            });

            ed.addButton("ax_course_detail_shortcodes", {
                type: "menubutton",
                text: "aX Course Details",
                icon: false,
                menu: [
                    {
                        text: "Full Course Details",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;

                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Adjusting these settings will override the defaults set in the aXcelerate Integration Settings.",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "listbox",
                                    multiline: true,
                                    name: "template_override",
                                    label: "Course Detail Template",
                                    tooltip: "Override the default template",
                                    values: [
                                        { text: "Use the Default", value: "", selected: true },
                                        { text: "Override", value: "1" }
                                    ]
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Restrict List to Course Type",
                                    values: [
                                        {
                                            text: "Dynamic - passed through query parameters",
                                            value: "",
                                            selected: true
                                        },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course to be displayed"
                                },
                                /*
                                            {
                                                type:'listbox',
                                                name:'style',
                                                label:'Style',
                                                tooltip:'Override the default Style',
                                                values:[
                                                        { text:'Standard Tile', value:'ax-tile', selected:true },
                                                        { text:'Standard List', value:'ax-list', },
                                                        ]
                                            },*/
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "teminology_w",
                                    label: "Terminology Workshop",
                                    tooltip: "Override Default terminology for Workshops"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "teminology_p",
                                    label: "Terminology Program Override",
                                    tooltip: "Override Default terminology for Programs"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "teminology_el",
                                    label: "Terminology eLearning Override",
                                    tooltip: "Override Default terminology for Elearning"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "enrol_config_id",
                                    label: "Enroller Config ID",
                                    tooltip:
                                        "The enrolment configuration to use in the enrolment Widget"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Course Details - Full",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (key != "template_override") {
                                            if (!isEmpty(value)) {
                                                extraOptions +=
                                                    " " + key + "=" + encodeURIComponent(value);
                                            }
                                        }
                                    });
                                    if (e.data.template_override == 1) {
                                        ed.insertContent(
                                            "[ax_course_details" +
                                                extraOptions +
                                                "][/ax_course_details]"
                                        );
                                    } else {
                                        ed.insertContent("[ax_course_details" + extraOptions + "]");
                                    }
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "Course Name",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Restrict List to Course Type",
                                    values: [
                                        {
                                            text:
                                                "Dynamic - When used within an encolsing top level shortcode",
                                            value: ""
                                        },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_name",
                                    label: "Course Name Override",
                                    tooltip: "Enforce the name, removing the API call"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Course Name",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent("[ax_course_name" + extraOptions + "]");
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "(P) Course Stream",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Restrict List to Course Type",
                                    values: [
                                        {
                                            text:
                                                "Dynamic - When used within an encolsing top level shortcode",
                                            value: ""
                                        },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_stream",
                                    label: "Course Stream Override",
                                    tooltip: "Enforce the Stream, removing the API call"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Course Stream",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent("[ax_course_stream" + extraOptions + "]");
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "Course Code",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Restrict List to Course Type",
                                    values: [
                                        {
                                            text:
                                                "Dynamic - When used within an encolsing top level shortcode",
                                            value: ""
                                        },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_code",
                                    label: "Course Code Override",
                                    tooltip: "Enforce the Code, removing the API call"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Course Code",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent("[ax_course_code" + extraOptions + "]");
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "Course Type",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Restrict to Course Type",
                                    values: [
                                        { text: "No Restriction", value: "" },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "teminology_w",
                                    label: "Terminology Workshop",
                                    tooltip: "Override Default terminology for Workshops"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "teminology_p",
                                    label: "Terminology Program Override",
                                    tooltip: "Override Default terminology for Programs"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "teminology_el",
                                    label: "Terminology eLearning Override",
                                    tooltip: "Override Default terminology for Elearning"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Course Type",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent("[ax_course_type" + extraOptions + "]");
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "Course Short Description",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Restrict List to Course Type",
                                    values: [
                                        {
                                            text:
                                                "Dynamic - When used within an encolsing top level shortcode",
                                            value: ""
                                        },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: true,
                                    name: "short_description",
                                    label: "Course Short Description Override",
                                    tooltip: "Enforce the Description, removing the API call"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Course Short Description",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent(
                                        "[ax_course_short_description" + extraOptions + "]"
                                    );
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "Course Image",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;

                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "infobox",
                                    text: "Will Parse the Course Short Description for an Image",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },

                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Restrict List to Course Type",
                                    values: [
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "short_description",
                                    label: "Short Description Override",
                                    tooltip: "Enforce the short description, removing the API call"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Course Image",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent("[ax_course_image" + extraOptions + "]");
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "Full Course Outline",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Set Course Type",
                                    values: [
                                        {
                                            text:
                                                "Dynamic - When used within an encolsing top level shortcode",
                                            value: ""
                                        },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: true,
                                    name: "course_outline",
                                    label: "Course Outline Override",
                                    tooltip: "Enforce the Outline, removing the API call"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Course Outline",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent("[ax_course_outline" + extraOptions + "]");
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "(W) Outline Element - Introduction",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Set Course Type",
                                    values: [{ text: "Workshops", value: "w" }]
                                },
                                {
                                    type: "textbox",
                                    multiline: true,
                                    name: "course_element_introduction",
                                    label: "Course Introduction Override",
                                    tooltip: "Enforce the Introduction, removing the API call"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Course Outline Element - Introduction",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent(
                                        "[ax_course_element_introduction" + extraOptions + "]"
                                    );
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "(W) Outline Element - Content",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Set Course Type",
                                    values: [{ text: "Workshops", value: "w" }]
                                },
                                {
                                    type: "textbox",
                                    multiline: true,
                                    name: "course_element_content",
                                    label: "Course Outline Override",
                                    tooltip:
                                        "Enforce the Outline, removing the API call - Separate list items with |"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Course Outline Element - Content",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent(
                                        "[ax_course_element_content" + extraOptions + "]"
                                    );
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "(W) Outline Element - Learning Outcomes",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Set Course Type",
                                    values: [{ text: "Workshops", value: "w" }]
                                },
                                {
                                    type: "textbox",
                                    multiline: true,
                                    name: "course_element_learning_outcomes",
                                    label: "Course Learning Outcomes Override",
                                    tooltip:
                                        "Enforce the Learning Outcomes, removing the API call - Separate list items with |"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Course Outline Element - Learning Outcomes",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent(
                                        "[ax_course_element_learning_outcomes" + extraOptions + "]"
                                    );
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "(W) Outline Element - Program Benefits",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Set Course Type",
                                    values: [{ text: "Workshops", value: "w" }]
                                },
                                {
                                    type: "textbox",
                                    multiline: true,
                                    name: "course_element_program_benefits",
                                    label: "Course Program Benefits Override",
                                    tooltip:
                                        "Enforce the Program Benefits, removing the API call - Separate list items with |"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Course Outline Element - Program Benefits",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent(
                                        "[ax_course_element_program_benefits" + extraOptions + "]"
                                    );
                                },
                                width: W,
                                height: H
                            });
                        }
                    },

                    {
                        text: "(W) Outline Element - Target Audience",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Set Course Type",
                                    values: [{ text: "Workshops", value: "w" }]
                                },
                                {
                                    type: "textbox",
                                    multiline: true,
                                    name: "course_element_target_audience",
                                    label: "Course Target Audience Override",
                                    tooltip: "Enforce the Target Audience, removing the API call"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Course Outline Element - Target Audience",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent(
                                        "[ax_course_element_target_audience" + extraOptions + "]"
                                    );
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "(W) Outline Element - Learning Methods",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Set Course Type",
                                    values: [
                                        {
                                            text:
                                                "Dynamic - When used within an encolsing top level shortcode",
                                            value: ""
                                        },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: true,
                                    name: "course_element_learning_methods",
                                    label: "Course Learning Methods Override",
                                    tooltip: "Enforce the Learning Methods, removing the API call"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Course Outline Element - Learning Methods",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent(
                                        "[ax_course_element_learning_methods " + extraOptions + "]"
                                    );
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "(W) Outline Element - Image 1",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Set Course Type",
                                    values: [
                                        {
                                            text:
                                                "Dynamic - When used within an encolsing top level shortcode",
                                            value: ""
                                        },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_element_image1",
                                    label: "Course Image 1 Link Override",
                                    tooltip: "Enforce an Image link, removing the API call"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Course Outline Element - Image 1",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent(
                                        "[ax_course_element_image1 " + extraOptions + "]"
                                    );
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "(W) Outline Element - Image 2",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Set Course Type",
                                    values: [
                                        {
                                            text:
                                                "Dynamic - When used within an encolsing top level shortcode",
                                            value: ""
                                        },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_element_image2",
                                    label: "Course Image 2 Link Override",
                                    tooltip: "Enforce an Image link, removing the API call"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Course Outline Element - Image 2",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent(
                                        "[ax_course_element_image2 " + extraOptions + "]"
                                    );
                                },
                                width: W,
                                height: H
                            });
                        }
                    },

                    {
                        text: "Enrolment/Enquiry Widget",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "instance_id",
                                    label: "Instance ID",
                                    tooltip: "The ID of the Course Instance"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Set Course Type",
                                    values: [
                                        {
                                            text:
                                                "Dynamic - When used within an encolsing top level shortcode",
                                            value: ""
                                        },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "config_id",
                                    label: "Enrolment Widget Config",
                                    tooltip: "The Configuration to be loaded into the widget"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Enrolment Widget",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent("[ax_enrol_widget " + extraOptions + "]");
                                },
                                width: W,
                                height: H
                            });
                        }
                    },

                    {
                        text: "Enquiry Widget",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID and Type are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "instance_id",
                                    label: "Instance ID",
                                    tooltip: "The ID of the Course Instance"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Set Course Type",
                                    values: [
                                        {
                                            text:
                                                "Dynamic - When used within an encolsing top level shortcode",
                                            value: ""
                                        },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "config_id",
                                    label: "Enrolment Widget Config",
                                    tooltip: "The Configuration to be loaded into the widget"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Enquiry Widget",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent("[ax_enquiry_widget " + extraOptions + "]");
                                },
                                width: W,
                                height: H
                            });
                        }
                    },

                    {
                        text: "Button - For Enquiry/Enrol",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Creates a button that populates with course variables and launches another page.",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },

                                {
                                    type: "textbox",
                                    name: "button_text",
                                    multiline: false,
                                    label: "Button Text",
                                    tooltip: "The Text for the button"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip:
                                        "The ID of the Course - do not use if in a course details block"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip:
                                        "Set Course Type do not use if in a course details block",
                                    values: [
                                        {
                                            text:
                                                "Dynamic - When used within an encolsing top level shortcode",
                                            value: ""
                                        },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "link_url",
                                    label: "URL",
                                    tooltip: "The URL for the form/link to go to."
                                },
                                {
                                    type: "listbox",
                                    name: "link_mode",
                                    label: "Link Mode",
                                    tooltip:
                                        "Set the mode for how the course variables will be passed.",
                                    values: [
                                        { text: "Get - Use URL Vars", value: "url" },
                                        {
                                            text: "Post - Use a hidden form to post data",
                                            value: "form"
                                        }
                                    ]
                                },

                                {
                                    type: "textbox",
                                    name: "class_to_add",
                                    multiline: false,
                                    label: "CSS Class",
                                    tooltip: "Add CSS class to button"
                                },

                                /*VACANCY*/
                                {
                                    type: "textbox",
                                    name: "vacancy_text",
                                    multiline: false,
                                    label: "Threshold Vacancy Text",
                                    tooltip:
                                        "Text to show when the available vacancy is at or below threshold."
                                },
                                {
                                    type: "textbox",
                                    name: "vacancy_0_text",
                                    multiline: false,
                                    label: "No Vacancy Text",
                                    tooltip: "Text to show when fully booked."
                                },
                                {
                                    type: "textbox",
                                    name: "vacancy_class",
                                    multiline: false,
                                    label: "Threshold Vacancy CSS",
                                    tooltip:
                                        "CSS Classes to add to Link when the available vacancy is at or below threshold."
                                },
                                {
                                    type: "textbox",
                                    name: "vacancy_0_class",
                                    multiline: false,
                                    label: "No Vacancy CSS",
                                    tooltip:
                                        "CSS Classes to add to Link when there is no vacancy. Separate with Space."
                                },
                                {
                                    type: "textbox",
                                    name: "vacancy_threshold",
                                    multiline: false,
                                    label: "Vacancy Threshold",
                                    tooltip:
                                        "At this threshold, apply the threshold class/text. Numeric"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Button / Link Shortcode",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent(
                                        "[ax_course_button_link " + extraOptions + "]"
                                    );
                                },
                                width: W,
                                height: H
                            });
                        }
                    }
                ]
            });

            /**** Course Instance Shortcodes***/
            ed.addButton("ax_course_instance_shortcodes", {
                type: "menubutton",
                text: "aX Course Instance",
                icon: false,
                menu: [
                    {
                        text: "Full Instance List",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Adjusting these settings will override the defaults set in the aXcelerate Integration Settings.",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "listbox",
                                    multiline: true,
                                    name: "template_override",
                                    label: "Instance List Template",
                                    tooltip: "Override the default template",
                                    values: [
                                        { text: "Use the Default", value: "", selected: true },
                                        { text: "Override", value: "1" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "training_cat",
                                    label: "Training Category Filter",
                                    tooltip: "Restrict results to a training category"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Restrict List to Course Type",
                                    values: [
                                        { text: "Dyanmic", value: "", selected: true },
                                        { text: "All", value: "all" },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },

                                {
                                    type: "listbox",
                                    name: "show_full_instances",
                                    label: "Show Full Instances",
                                    tooltip:
                                        "Toggle Display of Instances that have no spaces Available.",
                                    values: [
                                        { text: "No", value: 0, selected: true },
                                        { text: "Yes", value: 1 }
                                    ]
                                },

                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "search_term",
                                    label: "Search Term Filter",
                                    tooltip: "Restrict results by a search Term"
                                },
                                {
                                    type: "listbox",
                                    name: "style",
                                    label: "Style",
                                    tooltip: "Override the default Style",
                                    values: [
                                        {
                                            text: "Standard table",
                                            value: "ax-table",
                                            selected: true
                                        }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    name: "location",
                                    label: "Location",
                                    tooltip: "Set a Location Filter"
                                },
                                {
                                    type: "textbox",
                                    name: "state",
                                    label: "State",
                                    tooltip: "Set a State Filter"
                                },
                                {
                                    type: "textbox",
                                    name: "domain_id",
                                    label: "Domain (ID)",
                                    tooltip: "Set a Domain ID to filter by (not text)"
                                },
                                {
                                    type: "textbox",
                                    name: "instance_id",
                                    label: "Instance (ID)",
                                    tooltip:
                                        "Override a dynamic instance ID and filter to a single instance"
                                },
                                {
                                    type: "listbox",
                                    name: "combine_tables",
                                    label: "Combine Tables",
                                    tooltip:
                                        "If tables are used in the template then this setting will combine them into a single table.",
                                    values: [
                                        { text: "Individual/No tables", value: "", selected: true },
                                        { text: "Combine Tables", value: true }
                                    ]
                                }
                            ];

                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Instance List - Full",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (key != "template_override") {
                                            if (!isEmpty(value)) {
                                                extraOptions +=
                                                    " " + key + "=" + encodeURIComponent(value);
                                            }
                                        }
                                    });

                                    if (e.data.template_override == 1) {
                                        ed.insertContent(
                                            "[ax_course_instance_list " +
                                                extraOptions +
                                                "][/ax_course_instance_list]"
                                        );
                                    } else {
                                        ed.insertContent(
                                            "[ax_course_instance_list" + extraOptions + "]"
                                        );
                                    }
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "Course Instance Name",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;

                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID, Type and instance_id are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },

                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "instance_id",
                                    label: "Instance ID",
                                    tooltip: "The ID of the Course Instance"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Restrict List to Course Type",
                                    values: [
                                        { text: "Dynamic", value: "" },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "instance_name",
                                    label: "Instance Name Override",
                                    tooltip: "Enforce the name, removing the API call"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Instance Name",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent(
                                        "[ax_course_instance_name" + extraOptions + "]"
                                    );
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "(W) Course Instance Location",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;

                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID, Type and instance_id are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "infobox",
                                    text: "ONLY AVAILABLE FOR WORKSHOPS",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },

                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "instance_id",
                                    label: "Instance ID",
                                    tooltip: "The ID of the Course Instance"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Restrict List to Course Type",
                                    values: [
                                        { text: "Dynamic", value: "" },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "location",
                                    label: "Location Override",
                                    tooltip: "Enforce the location, removing the API call"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Instance Name",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent(
                                        "[ax_course_instance_location" + extraOptions + "]"
                                    );
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "Course Instance Startdate",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;

                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID, Type and instance_id are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },

                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "instance_id",
                                    label: "Instance ID",
                                    tooltip: "The ID of the Course Instance"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Restrict List to Course Type",
                                    values: [
                                        { text: "Dynamic", value: "" },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "start_date",
                                    label: "Start Date Override",
                                    tooltip:
                                        "Enforce the startdate, removing the API call, Not Recommended"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Instance StartDate",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent(
                                        "[ax_course_instance_startdate" + extraOptions + "]"
                                    );
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "(W) Course Instance StartTime",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;

                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID, Type and instance_id are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "infobox",
                                    text: "ONLY AVAILABLE FOR WORKSHOPS",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "instance_id",
                                    label: "Instance ID",
                                    tooltip: "The ID of the Course Instance"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Restrict List to Course Type",
                                    values: [
                                        { text: "Dynamic", value: "" },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "start_date",
                                    label: "Start Date Override",
                                    tooltip:
                                        "Enforce the startdate, removing the API call, Not Recommended"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Instance Start Time",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent(
                                        "[ax_course_instance_starttime" + extraOptions + "]"
                                    );
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "Course Instance Finishdate",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;

                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID, Type and instance_id are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },

                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "instance_id",
                                    label: "Instance ID",
                                    tooltip: "The ID of the Course Instance"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Restrict List to Course Type",
                                    values: [
                                        { text: "Dynamic", value: "" },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "finish_date",
                                    label: "Finish Date Override",
                                    tooltip:
                                        "Enforce the finishdate, removing the API call, Not Recommended"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Instance FinishDate",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent(
                                        "[ax_course_instance_finishdate" + extraOptions + "]"
                                    );
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "(W) Course Instance FinishTime",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;

                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID, Type and instance_id are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "infobox",
                                    text: "ONLY AVAILABLE FOR WORKSHOPS",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "instance_id",
                                    label: "Instance ID",
                                    tooltip: "The ID of the Course Instance"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Restrict List to Course Type",
                                    values: [
                                        { text: "Dynamic", value: "" },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "finish_date",
                                    label: "Finish Date Override",
                                    tooltip:
                                        "Enforce the finishdate, removing the API call, Not Recommended"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Instance FinishTime",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent(
                                        "[ax_course_instance_finishtime" + extraOptions + "]"
                                    );
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "(W) Course Instance Date Descriptor",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;

                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID, Type and instance_id are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "infobox",
                                    text:
                                        "Only available for workshops, Text Description - not Dates",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "instance_id",
                                    label: "Instance ID",
                                    tooltip: "The ID of the Course Instance"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Restrict List to Course Type",
                                    values: [
                                        { text: "Dynamic", value: "" },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "date_descriptor",
                                    label: "Date Descriptor Override",
                                    tooltip:
                                        "Enforce the Date Descriptor, removing the API call, Not Recommended"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 2);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 2);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Instance Date Descriptor",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent(
                                        "[ax_course_instance_datedescriptor" + extraOptions + "]"
                                    );
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "(W) Course Instance Vacancy",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;

                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID, Type and instance_id are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "infobox",
                                    text: "Only available for workshops, shows remaining spaces.",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "instance_id",
                                    label: "Instance ID",
                                    tooltip: "The ID of the Course Instance"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Restrict List to Course Type",
                                    values: [
                                        { text: "Dynamic", value: "" },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "vacancy",
                                    label: "Vacancy Display Override",
                                    tooltip:
                                        "Enforce the Vacancy display, removing the API call, Not Recommended and has no effect on enrolment"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Instance Vacancy",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent(
                                        "[ax_course_instance_vacancy" + extraOptions + "]"
                                    );
                                },
                                width: W,
                                height: H
                            });
                        }
                    },
                    {
                        text: "Course Instance Cost",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;

                            var body = [
                                {
                                    type: "infobox",
                                    text:
                                        "Outside Template or Top Level Enclosing shortcodes, Course ID, Type and instance_id are Required",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },
                                {
                                    type: "infobox",
                                    text: "Display ONLY - Does not change the Cost",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },

                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip: "The ID of the Course"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "instance_id",
                                    label: "Instance ID",
                                    tooltip: "The ID of the Course Instance"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip: "Restrict List to Course Type",
                                    values: [
                                        { text: "Dynamic", value: "" },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "cost",
                                    label: "Instance Cost Override",
                                    tooltip: "Enforce the Cost, removing the API call"
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Instance Cost",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent(
                                        "[ax_course_instance_cost" + extraOptions + "]"
                                    );
                                },
                                width: W,
                                height: H
                            });
                        }
                    },

                    {
                        text: "Add To Cart Button",
                        onclick: function() {
                            var width = $(window).width(),
                                H = $(window).height(),
                                W = 900 < width ? 900 : width;
                            W = W - 80;
                            H = H - 250;
                            var body = [
                                {
                                    type: "infobox",
                                    text: "Add to Cart Button - for use with shopping cart",
                                    multiline: true,
                                    style: "white-space:normal; max-width:100%;"
                                },

                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "link_text",
                                    label: "Link Text",
                                    tooltip: "Enrol Link Text - Defaults to Add To Cart"
                                },
                                {
                                    type: "textbox",
                                    multiline: false,
                                    name: "course_id",
                                    label: "Course ID",
                                    tooltip:
                                        "The ID of the Course - do not use if in a course details block"
                                },
                                {
                                    type: "listbox",
                                    name: "course_type",
                                    label: "Course Type",
                                    tooltip:
                                        "Set Course Type do not use if in a course details block",
                                    values: [
                                        {
                                            text:
                                                "Dynamic - When used within an encolsing top level shortcode",
                                            value: ""
                                        },
                                        { text: "Workshops", value: "w" },
                                        { text: "Programs/Qualifications", value: "p" },
                                        { text: "eLearning", value: "el" }
                                    ]
                                },

                                {
                                    type: "textbox",
                                    name: "class_to_add",
                                    multiline: false,
                                    label: "CSS Class",
                                    tooltip: "Add CSS class to button"
                                },

                                /*VACANCY*/

                                {
                                    type: "textbox",
                                    name: "vacancy_0_text",
                                    multiline: false,
                                    label: "No Vacancy Text",
                                    tooltip: "Text to show when fully booked."
                                }
                            ];
                            if (parseInt(tinymce.majorVersion) < 4) {
                                body.splice(0, 1);
                            } else if (parseInt(tinymce.majorVersion) == 4) {
                                if (parseFloat(tinymce.minorVersion) < 4.1) {
                                    body.splice(0, 1);
                                }
                            }
                            ed.windowManager.open({
                                title: "aXcelerate Add to Cart Button",
                                body: body,
                                onsubmit: function(e) {
                                    var extraOptions = "";
                                    $.each(e.data, function(key, value) {
                                        if (!isEmpty(value)) {
                                            extraOptions +=
                                                " " + key + "=" + encodeURIComponent(value);
                                        }
                                    });
                                    ed.insertContent("[ax_add_to_cart " + extraOptions + "]");
                                },
                                width: W,
                                height: H
                            });
                        }
                    }
                ]
            });
        },

        /**
         * Creates control instances based in the incomming name. This method is normally not
         * needed since the addButton method of the tinymce.Editor class is a more easy way of adding buttons
         * but you sometimes need to create more complex controls like listboxes, split buttons etc then this
         * method can be used to create those.
         *
         * @param {String} n Name of the control to create.
         * @param {tinymce.ControlManager} cm Control manager to use inorder to create new control.
         * @return {tinymce.ui.Control} New control instance or null if no control was created.
         */
        createControl: function(n, cm) {
            return null;
        },

        /**
         * Returns information about the plugin as a name/value array.
         * The current keys are longname, author, authorurl, infourl and version.
         *
         * @return {Object} Name/value array containing information about the plugin.
         */
        getInfo: function() {
            return {
                longname: "Axcelerate",
                author: "Yogesh",
                version: "0.2"
            };
        }
    });

    // Register our TinyMCE plugin
    // first parameter is the button ID1
    // second parameter must match the first parameter of the tinymce.create() function above
    tinymce.PluginManager.add("axcelerate_enquiry", tinymce.plugins.axcelerate);

    //====================Enquiry shortcode=============================

    var enquiry_form = $("#axcelerate_enquiry_shortcode_dialog");
    var enquiry_table = enquiry_form.find("table");
    // handles the click event of the submit button
    enquiry_form.find("#axcelerate_enquiry-submit").click(function() {
        // defines the options and their default values
        // again, this is not the most elegant way to do this
        // but well, this gets the job done nonetheless
        var options = {
            button_text: "",
            action_page: "",
            action_method: ""
        };
        var shortcode = "[axcelerate_enquiry";

        for (var index in options) {
            var value = enquiry_table.find("#axcelerate_enquiry-" + index).val();

            // attaches the attribute to the shortcode only if it's different from the default value
            if (value !== options[index]) shortcode += " " + index + '="' + value + '"';
        }

        shortcode += "]";

        // inserts the shortcode into the active editor
        tinyMCE.activeEditor.execCommand("mceInsertContent", 0, shortcode);

        // closes Thickbox
        tb_remove();
    });

    //====================Enrollment shortcode=============================

    var enrolment_form = $("#axcelerate_enrolment_shortcode_dialog");
    var enrolment_table = enrolment_form.find("table");
    // handles the click event of the submit button
    enrolment_form.find("#axcelerate_enrolment-submit").click(function() {
        // defines the options and their default values
        // again, this is not the most elegant way to do this
        // but well, this gets the job done nonetheless
        var options = {
            button_text: "",
            action_page: "",
            action_method: ""
        };
        var shortcode = "[axcelerate_enrolment";

        for (var index in options) {
            var value = enrolment_table.find("#axcelerate_enrolment-" + index).val();

            // attaches the attribute to the shortcode only if it's different from the default value
            if (value !== options[index]) shortcode += " " + index + '="' + value + '"';
        }

        shortcode += "]";

        // inserts the shortcode into the active editor
        tinyMCE.activeEditor.execCommand("mceInsertContent", 0, shortcode);

        // closes Thickbox
        tb_remove();
    });

    //====================search shortcode=============================

    var search_form = $("#axcelerate_search_shortcode_dialog");
    var search_table = search_form.find("table");
    // handles the click event of the submit button
    search_form.find("#axcelerate_search-submit").click(function() {
        // defines the options and their default values
        // again, this is not the most elegant way to do this
        // but well, this gets the job done nonetheless
        var options = {
            alignment: "",
            title: "",
            button_text: "",
            action_page: ""
        };
        var shortcode = "[axcelerate_search";

        for (var index in options) {
            var value = search_table.find("#axcelerate_search-" + index).val();

            // attaches the attribute to the shortcode only if it's different from the default value
            if (value !== options[index]) shortcode += " " + index + '="' + value + '"';
        }

        shortcode += "]";

        // inserts the shortcode into the active editor
        tinyMCE.activeEditor.execCommand("mceInsertContent", 0, shortcode);

        // closes Thickbox
        tb_remove();
    });
});
