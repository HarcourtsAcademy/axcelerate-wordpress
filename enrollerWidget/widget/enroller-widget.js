jQuery(function($) {
    COURSE_DEFAULTS = {
        INSTANCEID: 0,
        ID: 0,
        TYPE: "p"
    };


    function enhanceAfterAjax(obj, callback){
        if(window.hasEnhanceListener !== true){
            window.hasEnhanceListener = true;
            if (jQuery.active < 1) {
                obj.enhanceWithin();
                window.hasEnhanceListener = false
            }
            else{
                obj.hide();
                $(document).one('ajaxStop', function(){
                    
                    obj.enhanceWithin();
                    obj.show();
                    if(callback!=null){
                        callback();
                    }
                    window.hasEnhanceListener = false
                });
            }
           
        }
    }
    

    /* Enrolment Widget
	 * @widget
	 * 
	 *  UI Options
	 *  
	 * @param {string}	stylesheet - CSS Stylesheet filename - must be in the widget /css directory.
	 * @param {string}	stylesheet_override - CSS Stylesheet URL - overrides stylesheet.
	 * @param {string}	step_layout - Location of the Step Menu. Valid values are: "left", "top"
	 * @param {boolean} selects_as_chosens - Uses Chosens for all Select Menus.
	 * @param {boolean} required_complete_check - Switches the "required-complete" icon to that of complete.
	 * 
	 * Step Options
	 * 
	 * @param {array}	enroller_steps - Defines the steps to be created. Requires - DISPLAY, TYPE. Optionally can specify functions for various actions - depending on step type. fields if the step contains input fields.
	 * @param {array} step_order - defines the steps to be shown and their order. Required
	 * 
	 * Configuration Options
	 * 
	 * @param {boolean} must_complete_required - prevents loading an "enrol" step if there are any incomplete (required fields not completed) steps.
	 * @param {boolean} user_contact_create - When Creating Contacts uses the logged in User's AXTOKEN.
	 * @param {boolean} disable_on_complete - will disable all fields / links when the enrolment is successful, preventing a second enrolment without reloading the widget.
	 * @param {boolean} invoice_on_tentative - will disable/enable invoicing on tentative enrolments
	 * @param {boolean} login_or_create - Will allow a contact to be created rather than login. 
	 * @param {string}	environment - Where the Widget is functioning. Changes logic based on specific environment requirements. Valid are "null", "wordpress".
	 * 
	 * General Variables
	 * 
	 * @param {integer} contact_id - Initial Contact to be selected by the widget - will also update the contact selected if changed after creation
	 * @param {object}	course - Initial course to be selected. Has 3 elements INSTANCEID (numeric instanceID), ID (numeric TYPE ID), TYPE (string - lowercase p, w or el)
	 * @param {integer}	payer_id - Contact ID of the contact to be used as the payer for Invoicing.
	 * @param {numeric}	invoice_id - not currently used. 
	 * @param {float} cost - course cost - cleared when course changed. if null billing will be disabled.
	 * 
	 * Agent Variables
	 * 
	 * @param {integer} agent_id - not currently used
	 * @param {float} agent_commission - specifies the agent commission for use in displaying the commission.
	 * 
	 * Multiple Course Support
	 * 
	 * @param {boolean} agent_multiple - enable/disable multiple agent course selection - requires agentCourses step
	 * @param {object} multiple_courses - keeps a record of the enrolment parameters for selected courses. Structure - ContactID: {InstanceID: {enrolment details}}} - cleared when contact is changed
	 * 
	 * Contact Functions
	 * 
	 * @param {function} get_contact - function for retrieval of contact data to populate fields/names etc. function must accept parameters for the search and a callback function
	 * @param {function} update_contact - function for updating a contact record. function must accept parameters for the update and a callback function
	 * @param {function} add_contact - function for creating a new contact record. function must accept parameters for creation and a callback function
	 * @param {function} search_contacts - function for Wildcard contact searching.
	 * 
	 * User Functions
	 * 
	 * @param {function} user_login - Function to call the API to peform a login action sends params and a callback expecting standard API response
	 * @param {function} create_user - User Creation Function.
	 * @param {function} user_reset - Forgot Password / user reset Function.
	 *
	 * User Variables
	 * 
	 * @param {integer} user_contact_id - ContactID of the user, used for payerID if the user role is set to be the payer
	 * @param {object}	login_roles - Determines which User Roles have access, along with determining if they are classified as Agent, Payer or Student.
	 * 
	 * Course Functions
	 * 
	 * @param {function} get_course_detail - function for retrieval of course details (/course/detail) function must accept parameters for the search and a callback function
	 * @param {function} search_courses - function for the retrieval of course instances. Function must accept parameters for the search and a callback function
	 * @param {function} course_enrol - function for enrolment into a course. Function must accept the following: method (enrol / payment), enrolmentParams(params for enrolment call), paymentParams(params for payment call),  callback
	 * @param {function} course_enquire - function for enquiry into a course or a general enquiry. Params and Callback
	 * 
	 * Enrolment Config
	 * 
	 * @param {string}	enrolment_repsonse_text - Response text to be displayed on successful enrolment
	 * @param {boolean} enquiry_on_tentative - on tentative enrolments this will create an enquiry for the course against the student.
	 * @param {object} surcharge_on - adds surcharge to "Payment Methods" (currently only for payment)
	 * 
	 * Enquiry Config
	 * 
	 * @param {string}	enquiry_repsonse_text - Response text to be displayed on successful enquiry
	 * 
	 * Course Search Settings
	 * 
	 * @param {boolean} advanced_course_seach - bool to show/hide the advanced course search options.
	 * @param {boolean} add_course_selector - Show / Hide the Course Type and Course ID selector.
	 * @param {boolean} user_course_search - Use the AXTOKEN of the logged in user when performing the course search. For Client Portal Support.
	 * 
	 * Portfolio Functions
	 * 
	 * @param {function} add_update_portfolio - Single function to handle both adding or updating portfolio records. Should detect if portfolioID is present and switch between POST and PUT.
	 * @param {function} upload_portfolio - Function to handle uploading files. Should include a progress update function (ajax) and accept Form Data.
	 * @param {function} get_portfolio_file - Legacy function to retrieve documents via the API. Should no longer be needed since API change to temporary link.
	 * @param {function} get_portfolio_checklist - Retrieve a Portfolio Checklist.
	 * @param {function} get_portfolio_contact - Retrieve Portfolio Checklist against contact.
	 * 
	 * Discount Functions
	 * 
	 * @param {function} calculate_discount - function for calculating the discounted value. Function must accept parameters for the search and a callback function
	 * @param {function} get_discounts - function for the retrieval of discounts - setting this to null/not setting this option will disable discount functionality
	 * 
	 * Discount Variables
	 * 
	 * @param {array} discounts_selected - stores the discounts that have been selected for an enrolment. changing the selected course will clear this value.
	 * @param {float} original_cost - set when discounting is used
	 * 
	 * @param {boolean} legacy_enrolment_mode - forces enrolment process to use the legacy enrolment system when paying / invoicing.
	 * @param {boolean} round_to_dollar - Rounds enrolment costs up to the nearest dollar and also rounds surcharges.
	 * */
    $.widget("axcelerate.enroller", $.axcelerate.enrol_base, {
        options: {
            /*config_id used for enrolment completion*/
            config_id: 0,
            /* UI */

            stylesheet: "enroller.css",
            stylesheet_override: null,
            step_layout: "left",
            selects_as_chosens: true,
            required_complete_check: true,
            adjust_field_labels: false,
            show_step_info_block: true,

            /* Steps */
            enroller_steps: null,
            step_order: null,

            /* Configuration Settings */
            must_complete_required: true,
            user_contact_create: false,
            disable_on_complete: true,
            invoice_on_tentative: false,
            login_or_create: false,
            contact_create_only: false,
            environment: null,

            /* General Variables */
            contact_id: 0,
            payer_id: 0,
            course: null,
            invoice_id: 0,
            cost: null,

            /* Agent Variables */
            agent_id: 0,
            agent_commission: 0,
            get_agent_detail: null,

            /* Multiple Course Support */
            multiple_courses: null,
            agent_multiple: false,
            group_booking: false,
            payment_only: null,

            /* Contact Functions */
            get_contact: null,
            update_contact: null,
            add_contact: null,
            search_contacts: null,

            /* User Functions */
            user_login: null,
            create_user: null,
            user_reset: null,
            get_client_organisation: null,

            /* User Variables */
            login_roles: null,
            user_contact_id: 0,

            /* Course Functions */
            get_course_detail: null,
            search_courses: null,
            course_enquire: null,
            course_enrol: null,

            /* Enrolment Config */
            enrolment_repsonse_text:
                "Enrolment was successfully completed. A confirmation will be sent to the student along with an invoice / receipt, if generated.",
            enquiry_on_tentative: true,
            legacy_enrolment_mode: false,
            surcharge_on: null,
            allow_mixed_inhouse_public: false,

            /* Enquiry Config */
            enquiry_response_text: "Your Enquiry was successfully submitted.",
            enquiry_requires_course: false,

            /* Contact Note Functions */

            contact_note: null,

            /* Contact Note Config */

            note_response_text: "Your data was successfully submitted.",

            /* Course Search Settings */
            add_course_selector: true,
            user_course_search: false,
            advanced_course_seach: false,
            training_category: null,
            location_restriction: null,
            delivery_location_restriction: null,
            venue_restriction: null,

            location_filter: false,
            client_course_filter: false,

            /* Portfolio Functions */
            add_update_portfolio: null,
            upload_portfolio: null,
            get_portfolio_file: null,
            get_portfolio_checklist: null,
            get_portfolio_contact: null,

            /* Discounts Functions */
            get_discounts: null,
            calculate_discount: null,

            /* Discount Variables */
            discounts_selected: null,
            original_cost: null,

            round_to_dollar: false,
            allow_free_bookings: false,
            always_free_bookings: false,

            always_suppress_notifications: false,

            force_left: false,

            store_enrol_data: null,
            enrolment_complete: null,
            enrolment_hash: null,

            add_categories: null,
            promo_code: null,

            request_signature: false,

            /***** Terminology Settings *****/

            terminology_student: "Student",
            cost_terminology: "Fee",
            course_terminology: "Course",
            instance_terminology: "Course Instance",
            payer_terminology: "Payer",
            enrolling_terminology: "Enrolling",
            enrol_terminology: "Enrol",
            enrol_invoice_terminology: "Enrol and Send Invoice",
            enrol_payment_terminology: "Pay and Enrol",
            enrol_tentative_terminology: "Enrol Tentatively",
            enrol_direct_debit_terminology: "Enrol ( Direct Debit )",
            enrolment_terminology: "Enrolment",
            payment_method_selector_terminology: "Payment Method",
            invoice_selector_terminology: "Send Invoice",
            cc_payment_selector_terminology: "Credit Card",
            tentative_selector_terminology: "Tentative Enrolment",
            direct_debit_selector_terminology: "Direct Debit",
            ezypay_terminology: 'Payment Plan',

            epayment_terminology: "Debitsuccess",

            /*Cart*/

            cart_course_override: null,
            /*WP-199*/
            contact_search_buttons: true,
            contact_search_button_autocreate: true,

            complete_step_events: false,
            allow_update_payer_details: false,
            payer_address_required: false,

            show_payer: true,

            payer_abn_review:false,
            payer_abn_retrieve:null,
            payer_abn_update:null,


            contact_validation_check: false,

            /***** Select Placeholders *****/
            use_display_select_placeholder: true,

            hide_cost_fields: false,

            /*EPAYMENT*/
            epayment_begin: null,
            epayment_rules: null,
            epayment_rules_ds: null,
            epayment_rules_ez: null,
            ezypay_tentative: false,


            begin_ez_payment_flow:null,
            epayment_fees_ez:null,
            

            lock_ez_plan: false,


            epayment_landing_page: location.protocol + "//" + location.host + location.pathname,
            epayment_status: null,
            epayment_next: null,

            //WP-320
            payment_tentative: false,
            direct_debit_tentative: false,
            invoice_tentative: false,

            //WP-337
            confirm_emails: false,

            //WP-347
            create_user_start: false,

            //WP-348
            allow_inhouse_enrolment: false,
            inhouse_confirm_bookings: false,

            multiple_workshop_override: "no_override",
            payer_australia_only: false,

            //WP-340
            instance_extra_items: null,
            workshop_extra_billable_items: false,
            fetch_invoice: null,

            //WP-372
            check_for_enrolment_hash: null,
            send_reminders_for_enrolment_hash: null,
            flag_others_redundant: null,

            //WP-366
            domain_filter: null,
            show_no_domain: null,
            domain_filter_exclude: null,

            //WP-380
            use_registration_form: false,

            //WP-425
            sync_with_class_schedule: false,


            //WP-442
            payment_flow: false,
            begin_payment_flow: null,
            payment_flow_form: null,

            show_resumption_button: false,
            payer_under_18: null,
            training_org_email:null,
        },

        /*
		 * Constants
		 * */

        /*
		 * User Roles IDs
		 * */
        ADMIN_ID: 1,
        TRAINER_ID: 3,
        LEARNER_ID: 2,
        CLIENT_ID: 4,
        AGENT_ID: 5,

        /*
		 * Widget Creation, Init and Refresh/Destroy functions.
		 * */
        _create: function() {
            enroller = this;
            
            /*Hide payer details and discounting if hiding cost*/
            if (enroller.options.hide_cost_fields == true) {
                enroller.options.show_payer = false;
                enroller.options.get_discounts = null;
            }

            /* Enforce behaviour if show_payer is set to false*/
            if (enroller.options.show_payer == false) {
                enroller.options.allow_update_payer_details = false;
                enroller.options.payer_address_required = false;
            }


            if(enroller.options.enroller_steps.billing != null){
                var paymentMethods = enroller.options.enroller_steps.billing.paymentMethods;
                if(enroller.options.ezypay_plan_selected != null){
                    enroller.options.enroller_steps.billing.paymentMethods.VALUES = [
                        {
                            VALUE: 'ezypay',
                            DISPLAY: enroller.options.ezypay_terminology
                        }
                    ];
                    paymentMethods = enroller.options.enroller_steps.billing.paymentMethods;
                }
                if(paymentMethods.VALUES.length > 0){
                    for (var index = 0; index < paymentMethods.VALUES.length; index++) {
                        var paymentValue = paymentMethods.VALUES[index];
                        
                        // if Debitsuccess enforce required settings.
                        if(paymentValue.VALUE === 'epayment'){
                            enroller.options.payer_address_required = true;
                            enroller.options.payer_australia_only = true;
                            enroller.options.show_payer = true;
                            enroller.options.allow_update_payer_details = true;
                        }
                        
                    }
                }
               
            }

            enroller.element.on("enroller:update_enroller_status", function(e) {
                enroller._updateStepButtons();
            });
            enroller._registerHistoryListener();
            return this._super();
        },

        _registerResize: function() {
            this._super();
            $(window).on("resize", function() {
                var width = enroller.element.outerWidth();
                if (enroller.element.data("loaded") == true && enroller.element.is(":visible")) {
                    if (width < 601) {
                        if (enroller.options.step_layout != "top") {
                            enroller._switchLayout("top");
                        }
                    } else {
                        if (enroller.options.step_layout != "left") {
                            enroller._switchLayout("left");
                        }
                    }
                }
            });
        },
        

        _registerEnrolmentEvents: function() {
            enroller.element.on("enroller:enrolment_status_update", function(event, payload) {
                payload.page_url = window.location.href;
                if (
                    enroller.options.enroller_steps.billing == null ||
                    enroller.options.enroller_steps.review == null
                ) {
                    payload.is_enquiry = 1;
                }
                if (enroller.options.workshop_extra_billable_items === true) {
                    var itemList = enroller.element.data("items_list");
                    if (itemList != null) {
                        payload.item_list = itemList;
                    }
                }

                var allowPublicInhouse = enroller.element.data("allow_public_inhouse");
                if (allowPublicInhouse != null) {
                    payload.allow_public_inhouse = allowPublicInhouse;
                }
                if (enroller.options.store_enrol_data != null) {
                    if (enroller.options.enrolment_hash != null) {
                        payload.enrolment_hash = enroller.options.enrolment_hash;
                    }
                    payload.config_id = enroller.options.config_id;
                    enroller.options.store_enrol_data(payload, function(enrolment_hash) {
                        enroller.options.enrolment_hash = enrolment_hash;
                        enroller.element.trigger("enroller:status_update_complete");
                    });
                } else {
                    enroller.element.trigger("enroller:status_update_complete");
                }
            });

            enroller.element.on('enroller:status_update_complete', function(event, payload){
                if(enroller.options.show_resumption_button === true && enroller.options.enrolment_hash != ''){
                    if(!$('#resume-button').length){
                        var button = enroller._createInputField('resume-button', {
                            DISPLAY: "Send me a Resume Link",
                            TYPE: "button"
                        });

                        button.on('click', function(){
                            enroller.options.trigger_resume_link({enrolment_hash: enroller.options.enrolment_hash}, function(){
                                var closeButton = enroller._createInputField('resume-button', {
                                    DISPLAY: "Continue with Enrolment",
                                    TYPE: "button"
                                });
                                closeButton.on('click', function(){ enroller._dismissAlertOverlay()});
                                var holder = $('<div></div>').append('Resumption Link Sent - Check your Email!').append(closeButton);
                                
                                enroller._displayOverlayNonDismissableAlert('Resume Link Sent', holder, enroller.element);
                                holder.enhanceWithin();
                                
                            });
                        }).css({
                            width: 220,
                            float:'right'
                        });

                        enroller.element.prepend(button);


                    }
                }
            });

            enroller.element.on("enroller:unavailable_course", function(event, payload) {
                if (enroller.options.cart_course_override != null) {
                    if (enroller.options.cart_course_override[payload.instance_id + "_" + payload.type] != null) {
                        delete enroller.options.cart_course_override[payload.instance_id + "_" + payload.type];
                        if ($.isEmptyObject(enroller.options.cart_course_override)) {
                            enroller.options.cart_course_override = null;
                        }
                    }
                    enroller._changeStep("review");
                }
            });
            enroller.element.on("enroller:post_enrol_update", function(event, payload) {
                payload.url_with_string = window.location.href;
                payload.url_without_string = window.location.href.replace(window.location.search, "");
                if (enroller.options.post_enrol_hash != null) {
                    payload.post_enrol_hash = enroller.options.post_enrol_hash;
                }
                if (enroller.options.store_post_enrol_data != null) {
                    enroller.options.store_post_enrol_data(payload, function(post_enrol_data) {
                        if (post_enrol_data != null) {
                            if (post_enrol_data.TOKEN != null) {
                                enroller.options.post_enrol_hash = post_enrol_data.TOKEN;
                            } else if (post_enrol_data[0]) {
                                $.each(post_enrol_data, function(i) {
                                    /*Clear enrolment hash so that it is not used in future update calls*/
                                    enroller.options.enrolment_hash = null;
                                    if (post_enrol_data[i].DATA.user_contact_id != null) {
                                        if (
                                            post_enrol_data[i].DATA.user_contact_id ==
                                            enroller.options.user_contact_id
                                        ) {
                                            enroller.options.post_enrol_hash = post_enrol_data[i].TOKEN;
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            });

            enroller.element.on("enroller:enrolment_complete", function(event, payload) {
                if (payload == null) {
                    payload = {};
                }
                if (enroller.options.request_signature !== true || true) {
                    var allowPublicInhouse = enroller.element.data("allow_public_inhouse");
                    if (allowPublicInhouse == "inhouse") {
                        payload.method = "Inhouse - Confirm";
                    }

                    enroller.element.trigger("enroller:signature_submission", payload);
                }

                if (enroller.options.enrolment_complete != null) {
                    if (enroller.options.enrolment_hash != null) {
                        payload.enrolment_hash = enroller.options.enrolment_hash;
                    }
                    if (enroller.options.cart_course_override != null) {
                        payload.clear_cart = true;
                    }
                    enroller.options.enrolment_complete(payload);
                }
            });

            /*When The user contact id is set, check if a course has already been selected*/
            enroller.element.on("enroller:user_contact_set", function(event, payload) {
                if (enroller.options.post_enrolment_widget == true) {
                    var postEnrolPayload = {};
                    if (enroller.options.enrolment_hash != null) {
                        postEnrolPayload = {
                            user_contact_id: payload.user_contact_id,
                            post_enrolment: true,
                            enrolment_hash: enroller.options.enrolment_hash,
                            config_id: enroller.options.config_id
                        };
                    } else {
                        postEnrolPayload = {
                            user_contact_id: payload.user_contact_id,
                            post_enrolment: true,
                            config_id: enroller.options.config_id
                        };
                    }
                    enroller.element.trigger("enroller:post_enrol_update", postEnrolPayload);
                } else if (enroller.options.enrolment_hash == null) {
                    /*if an instance is selected, fire off the status update*/
                    if (enroller.options.course.INSTANCEID != 0) {
                        enroller.element.trigger("enroller:enrolment_status_update", {
                            user_contact_id: enroller.options.user_contact_id,
                            contact_id: enroller.options.contact_id,
                            payer_id: enroller.options.payer_id,
                            course: enroller.options.course,
                            contact_id: enroller.options.contact_id,
                            config_id: enroller.options.config_id
                        });
                        enroller.element.one("enroller:status_update_complete", function() {
                            // to ensure the hash exists!
                            enroller._checkForEnrolmentHashes();
                        });
                    } else if (
                        enroller.options.enroller_steps.billing == null ||
                        enroller.options.enroller_steps.review == null
                    ) {
                        if (enroller.options.course.ID != 0 && enroller.options.user_contact_id != 0) {
                            enroller.element.trigger("enroller:enrolment_status_update", {
                                user_contact_id: enroller.options.user_contact_id,
                                contact_id: enroller.options.contact_id,
                                payer_id: enroller.options.payer_id,
                                course: enroller.options.course,
                                is_enquiry: true,
                                contact_id: enroller.options.contact_id,
                                config_id: enroller.options.config_id
                            });
                        }
                    }
                }
            });

            enroller.element.on("enroller:signature_submission", function(event, payload) {
                var newParams = {};
                newParams.noteCodeID = 88;
                newParams.noteTypeID = 88;
                newParams.contactID = enroller.options.user_contact_id;
                var currentLocation = window.location;

                /*
				 * Build a custom set of params;
				 * */

                var contactNote = "<p>Course Enrolment from - <b>" + currentLocation + "</b></p>";
                if (enroller.options.user_ip != null && enroller.options.user_ip !== "") {
                    contactNote += "<p>User IP:<b> " + enroller.options.user_ip + "</b></p>";
                }
                var d = new Date();
                var dateString = d.toLocaleString();
                contactNote += "<p>Time: <b>" + dateString + "</b></p>";
                contactNote += "<p>Method: <b>" + payload.method + "</b></p>";

                if (enroller.options.multiple_courses != null) {
                    var enrolments = enroller.options.multiple_courses;
                    contactNote += "<br /><p><b>Enrolments:</b></p><br />";
                    if (!jQuery.isEmptyObject(enrolments)) {
                        $.each(enrolments, function(contactID, enrolmentData) {
                            $.each(enrolmentData, function(instanceID, instanceData) {
                                var courseUrl = "";
                                if (instanceID != "CONTACT_NAME") {
                                    if (instanceData.type === "p") {
                                        courseUrl = "rto/rtoClassDrilldown.cfm?ClassID=" + instanceID;
                                    } else if (instanceData.type == "w") {
                                        courseUrl = "ProgramStatus.cfm?PDataID=" + instanceID;
                                    }
                                    contactNote +=
                                        '<p><a href="Contact_View.cfm?ContactID=' +
                                        contactID +
                                        '">' +
                                        enrolmentData.CONTACT_NAME +
                                        "</a>";
                                    if (courseUrl != "") {
                                        contactNote +=
                                            ' in <a href="' + courseUrl + '">' + instanceData.COURSENAME + "</a>";
                                    }
                                    contactNote += "</p>";
                                    if (instanceData.STUDYREASONID != null) {
                                        contactNote += "<p>StudyReason: (" + instanceData.STUDYREASONID + ")";
                                        if (enroller.options.enroller_steps.enrolOptions != null) {
                                            if (enroller.options.enroller_steps.enrolOptions.FIELDS != null) {
                                                if (
                                                    enroller.options.enroller_steps.enrolOptions.FIELDS
                                                        .STUDYREASONID != null
                                                ) {
                                                    $.each(
                                                        enroller.options.enroller_steps.enrolOptions.FIELDS
                                                            .STUDYREASONID.VALUES,
                                                        function(i, element) {
                                                            if (
                                                                parseInt(element.VALUE) ==
                                                                parseInt(instanceData.STUDYREASONID)
                                                            ) {
                                                                contactNote = contactNote + " " + element.DISPLAY;
                                                            }
                                                        }
                                                    );
                                                }
                                            }
                                        }
                                        contactNote += "</p>";
                                    }
                                }
                            });
                        });
                    }
                }

                if (enroller.options.request_signature && payload.signature != null && payload.signature != "") {
                    contactNote +=
                        "<br /><p><b>Signature:</b></p><br />" + payload.signature + '<hr style="margin:.5em;">';
                }

                newParams.contactNote = contactNote;

                enroller.options.contact_note(newParams, function(response) {});
            });
        },
        _getEnrolmentStatusAndDetails: function() {
            var params = {
                user_contact_id: enroller.options.user_contact_id,
                multiple_courses: enroller.options.multiple_courses,
                invoice_id: enroller.options.invoice_id
            };
        },
        _refreshEnrolmentWizard: function() {
            if (enroller.options.enroller_steps === null) {
                enroller.options.enroller_steps = ENROLLER_STEP_DEFAULTS;
            }
            if (enroller.options.course === null) {
                enroller.options.course = COURSE_DEFAULTS;
            }

            /*
			 * check to ensure contact-update steps have fields defined 
			 * TODO: Further enhance this with more error checking
			 */
            var invalidSteps = [];
            var contactUpdateSteps = [];
            var otherGeneric = [];
            var step_order = [];

            var firstContactType = false;
            // check validity of steps;
            $.each(enroller.options.step_order, function(i, step) {
                if (enroller.options.enroller_steps[step] == null) {
                   // do nothing (dont need to delete it), skip adding it to updated step order
                }
                else{
                    var stepConfig = enroller.options.enroller_steps[step];
                    step_order.push(step);
                    
                    if (stepConfig.TYPE == "contact-update" || stepConfig.TYPE == "custom-step") {
                        if(stepConfig.CONTACT_TYPE && stepConfig.CONTACT_TYPE === 'payer' && !firstContactType){
                            firstContactType = true;
                            stepConfig.FIRST_PAYER = true;
                        }

                        if (stepConfig.FIELDS === undefined || stepConfig.FIELDS === null) {
                            var fieldsList = "_" + step + "Fields";
                            stepConfig.FIELDS = enroller[fieldsList];
                        }
                        if (stepConfig.FIELDS === undefined) {
                            invalidSteps.push(step);
                            step_order.pop();
                        } else {
                            contactUpdateSteps.push(step);
                        }
                    } else if (stepConfig.TYPE == "course-enquiry" || stepConfig.TYPE == "contact-note") {
                        otherGeneric.push(step);
                    }
                    else if(stepConfig.TYPE == "address"){
                        if(stepConfig.FIELDS){
                            delete stepConfig.FIELDS;
                        }
                        contactUpdateSteps.push(step);
    
                    }
                }
               
            });
            enroller.options.step_order = step_order;
            /*remove any invalid steps*/
            if (invalidSteps[0] !== undefined) {
                $.each(invalidSteps, function(i, step) {
                    delete enroller.options.enroller_steps[step];
                });
            }
         

            enroller._displayStepMenu();
            enroller._displaySteps();
            if (enroller.options.enroller_steps.contactSearch != null) {
                enroller._displayContactSearch();
            }
            if (enroller.options.enroller_steps.userLogin != null) {
                enroller._displayUserLogin();
            }

            $.each(contactUpdateSteps, function(i, step) {
                enroller._displayGenericRecordUpdateStep(step);
            });

            if (otherGeneric.length > 0) {
                $.each(otherGeneric, function(i, step) {
                    enroller._displayGenericRecordUpdateStep(step);
                });
            }
            if (enroller.options.enroller_steps.enrolOptions != null) {
                enroller._displayGenericRecordUpdateStep("enrolOptions");
            }

            if (enroller.options.enroller_steps.courses != null) {
                enroller._displayCourseSearch();
            }

            enroller.element.on("submit", "form:not(#payment_flow_form)", function(e) {
                e.preventDefault();
                return false;
            });

            enroller.element.find("form:not(#loginForm)").on("keyup keypress", function(e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode === 13) {
                    e.preventDefault();
                    return false;
                }
            });
        },

        /*
		 * Called on initial creation, or any time the widget is called again without args.
		 */
        _init: function() {
            enroller.element.enhanceWithin();

            if (enroller.options.course.INSTANCEID != 0 || this.options.course.ID != 0) {
                enroller._setOption("course", enroller.options.course);
            }
            /*establish what the first step should be*/
            if (enroller.options.contact_id != 0) {
                /*Determine if this is a post enrolment enroller widget, with a loaded enrolment hash*/
                if (enroller.options.enrolment_hash != null && enroller.options.post_enrolment_widget == true) {
                    var payload = {};
                    if (enroller.options.user_contact_id != null && enroller.options.user_contact_id != 0) {
                        payload.user_contact_id = enroller.options.user_contact_id;
                    } else {
                        payload.user_contact_id = enroller.options.contact_id;
                    }
                    enroller.element.trigger("enroller:user_contact_set", payload);
                }

                enroller._setOption("contact_id", enroller.options.contact_id);
                var selectStepContinue = true;

                if (enroller.options.skip_to_step != null) {
                    if (enroller.options.enroller_steps[enroller.options.skip_to_step] != null) {
                        if (enroller.options.skip_to_step == "billing") {
                            enroller.element.data("billing_enabled", true);

                            enroller.element.data("booking_in_progress", true);
                        }
                        enroller._changeStep(enroller.options.skip_to_step);

                        selectStepContinue = false;
                    } else if (enroller.options.enroller_steps.review != null) {
                        enroller._changeStep("review");
                        selectStepContinue = false;
                    }
                }

                if (selectStepContinue) {
                    if (
                        enroller.options.step_order[0] == "contactSearch" ||
                        enroller.options.step_order[0] == "userLogin"
                    ) {
                        enroller._changeStep(enroller.options.step_order[1]);
                    } else {
                        if (enroller.options.step_order[0] == "courses") {
                            enroller._changeStep(enroller.options.step_order[0]);
                        } else {
                            enroller._changeStep(enroller.options.step_order[0]);
                        }
                    }
                }
            } else {
                enroller._changeStep(enroller.options.step_order[0]);
            }

            enroller.element.enhanceWithin();
            enroller.element.trigger("page_ready");
            $(window).trigger("resize");
        },
        refresh: function() {
            enroller.element.empty();
            enroller._refreshEnrolmentWizard();
            enroller._init();
        },
        _disable: function() {
            enroller.element
                .find("a")
                .prop("disabled", true)
                .addClass("ui-disabled");
            enroller.element
                .find("button")
                .prop("disabled", true)
                .addClass("ui-disabled");
            $(".enroller-menu-link")
                .prop("disabled", true)
                .addClass("ui-disabled");
            enroller.element.find("div.enroller-step").addClass("ui-disabled");
        },
        destroy: function() {
            this.remove();
        },

        /* 
		 * Switch the layout mode 
		 * @param {string} layout - The layout to switch to.
		 * */
        _switchLayout: function(layout) {
            switch (layout) {
                case "top":
                    var menu = enroller.element.find("#enroller_step_menu");

                    if (menu.hasClass("ui-controlgroup")) {
                        enroller.element.find("#enroller_step_menu").controlgroup("option", "type", "horizontal");
                        enroller.options.step_layout = "top";
                        enroller.element.find("#enroller_step_menu").css("display", "block");
                        enroller.element.find(".enroller-layout-left").removeClass("enroller-layout-left");
                        enroller.element.find(".enroller-step:visible").css("display", "block");
                    }
                    break;
                default:
                    var menu = enroller.element.find("#enroller_step_menu");

                    if (menu.hasClass("ui-controlgroup")) {
                        enroller.element.find("#enroller_step_menu").controlgroup("option", "type", "vertical");
                        enroller.options.step_layout = "left";

                        enroller.element.find("#enroller_step_menu").css("display", "table-cell");
                        enroller.element.find("#enroller_step_menu").addClass("enroller-layout-left");
                        enroller.element.find(".enroller-step").addClass("enroller-layout-left");
                        enroller.element.find(".enroller-step:visible").css("display", "table-cell");
                    }
                    break;
            }
        },

        /* 
		 * Option Update Handling 
		 * */

        /*
		 * Triggered whenever an option is updated. 
		 * Note the individual option update methods are called before the Widget "options" reference is updated.
		 * These individual options should not reference enroller.options - nor should they call functions that require those values to be updated.
		 */
        _setOption: function(key, value) {
            /*disable billing if any option is changed, triggering the need to review*/

            this.element.data("billing_enabled", false);

            if (key === "contact_id") {
                this._setContact(value);
            }
            if (key === "payer_id") {
                this._setPayer(value);
            }
            if (key === "course") {
                this._setCourse(value);
            }
            if (key === "invoice_id") {
                this._setInvoice(value);
            }
            if (key === "enroller_steps") {
                this._setEnrollerSteps(value);
            }
            /*if the get_contact function is changed, trigger refresh of contact data*/
            if (key === "get_contact") {
                this._setContact(this.options.contact_id);
            }
            if (key === "cost") {
                this._setCost(value);
            }

            /* Trigger the update to enroller.options */
            this._super(key, value);
            this._updateStepButtons();
        },
        _clearContactData:function(contactType){
            if(!contactType){
                contactType = 'student';
            }
            $.each(enroller.options.enroller_steps, function(key, step) {
                if (step.TYPE == "contact-update" && (step.CONTACT_TYPE == null && contactType === 'student' || step.CONTACT_TYPE === contactType)) {
                    enroller.element.data(key + "_last_params", null);
                }
                if (step.TYPE == "portfolio") {
                    if ($("#" + key + "_step").length) {
                        $("#" + key + "_step").removeData();
                    }
                }

                if (step.FIELDS != null && (step.CONTACT_TYPE == null && contactType === 'student' || step.CONTACT_TYPE === contactType)) {
                    $.each(step.FIELDS, function(key, value) {
                        if ($("#" + key).length) {
                            enroller._updateInputValue($("#" + key), "");
                        }
                        if ($("." + key + "-checkbox").length) {
                            $("." + key + "-checkbox").each(function(i) {
                                element = $(this);
                                enroller._updateInputValue(element, "");
                            });
                        }
                        if ($("." + key + "-modifier").length) {
                            $("." + key + "-modifier").each(function(i) {
                                element = $(this);
                                enroller._updateInputValue(element, "");
                            });
                        }
                    });
                }
            });
        },
        /*
		 * Called whenever the contact_id option is updated. Will refresh all contact related input fields.
		 * Calls the specified retrieveFunction to add data to the form
		 */
        _setContact: function(contactID) {
            if (enroller.element.find(".enroller-error-message").length) {
                enroller.element.find(".enroller-error-message").remove();
            }
            if($('.address-lookup').length){
                $('.address-lookup').val("");
            }
            if (parseInt(contactID) > 0) {
                //$('#contactSearch_menu_link').addClass('enroller-step-complete');

                if (enroller.options.add_categories != null && enroller.options.add_categories != "") {
                    var addCatParams = {
                        CATEGORYIDS: enroller.options.add_categories
                    };
                    if (enroller._update_contact != null) {
                        enroller._update_contact(contactID, addCatParams, function(response) {
                            if (response != null) {
                                if (response.error != null) {
                                    var message = "";
                                    if (response.resultBody != null) {
                                        if (response.resultBody.MESSAGES != null) {
                                            message = message + response.resultBody.MESSAGES + "<br />";
                                        }
                                        if (response.resultBody.DETAILS != null) {
                                            message = message + response.resultBody.DETAILS;
                                        }
                                    }
                                    enroller._alert(message);
                                }
                            }
                        });
                    }
                }

                var params = { contactID: contactID, API: true };

                enroller._clearContactData('student');
                if(contactID === enroller.options.payer_id){
                    enroller._clearContactData('payer');
                }
                if(contactID === enroller.options.user_contact_id){
                    enroller._clearContactData('user');
                }
                
                enroller.element.find("div.enroller-step").data("terms_completed", false);

                if (enroller.options.group_booking != true) {
                    /*clear "selected" courses*/
                    if (enroller.options.multiple_courses != null) {
                        if (enroller.options.multiple_courses[contactID] == null) {
                            enroller.options.multiple_courses = null;
                        }
                    }
                }
                //add axtoken!!!
                var axTokenAll = enroller.element.data("USER_AX_TOKEN");
                if (axTokenAll != null) {
                    axToken = axTokenAll.AXTOKEN;
                    if (axTokenAll.ROLETYPEID === enroller.LEARNER_ID) {
                        enroller.options.get_contact(params, function(data) {
                            enroller._processContactData(data);
                        });
                    } else {
                        enroller.options.get_contact(
                            params,
                            function(data) {
                             
                                enroller._processContactData(data);
                            },
                            axToken
                        );
                    }
                } else {
                    /*update the data based on the retrieveFunction specified during widget creation*/
                    enroller.options.get_contact(params, function(data) {
                        enroller._processContactData(data);
                    });
                }
                if ($(".enroller-terms-action-holder").length) {
                    $(".enroller-terms-action-holder input").prop("checked", false);
                    $(".enroller-terms-action-holder input").trigger("change");
                }
                enroller._resetAllSignatures();
            } else {
                $.each(enroller.options.enroller_steps, function(key, step) {
                    if (step.TYPE == "contact-update") {
                        enroller.element.data(key + "_last_params", null);
                    }
                    if (step.TYPE == "portfolio") {
                        if ($("#" + key + "_step").length) {
                            $("#" + key + "_step").removeData();
                        }
                    }

                    if (step.FIELDS != null) {
                        $.each(step.FIELDS, function(key, value) {
                            if ($("#" + key).length) {
                                enroller._updateInputValue($("#" + key), "");
                            }
                            if ($(key + "-checkbox").length) {
                                enroller._updateInputValue($(key + "-checkbox"), "");
                            }
                            if ($(key + "-modifier").length) {
                                enroller._updateInputValue($(key + "-modifier"), "");
                            }
                        });
                    }
                });
                enroller._resetAllSignatures();
            }
        },
        _setPayer: function(payerID) {

            //TODO: update the payers yo;

            enroller.options.payer_id = payerID;

            enroller._clearContactData('payer');
            var axToken;
            var axTokenAll = enroller.element.data("USER_AX_TOKEN");
            if (axTokenAll != null) {
                if (axTokenAll.ROLETYPEID !== enroller.LEARNER_ID) {
                    axToken = axTokenAll.AXTOKEN;
                }
            }

            
            enroller.options.get_contact({contactID:enroller.options.payer_id}, function(contactData){
          
                if (contactData.CONTACTID === undefined) {
                    if (contactData[0] !== undefined) {
                        if (contactData[0].CONTACTID !== undefined) {
                            contactData = contactData[0];
                        }
                    }
                }
                if(contactData.CONTACTID === undefined){
                    enroller.options.payer_id = 0;
                }
                else{
                    if (enroller._contactAdded) {
                        enroller._contactAdded(contactData);
                    }
                    enroller.element.data('payer_data', contactData);
                    enroller._updateContactFields(contactData, "payer");
                    if (contactData.CONTACTID === enroller.options.user_contact_id) {
                        enroller._updateContactFields(contactData, "user");
                    }
                    if (contactData.CONTACTID === enroller.options.contact_id) {
                        enroller._updateContactFields(contactData);
                    }

                    enroller.element.trigger("enroller:update_enroller_status");
                }

            }, axToken); 



        },
        _setCourse: function(course) {
            var instanceID = course.INSTANCEID;
            var courseID = course.ID;
            var type = course.TYPE;
            if (parseInt(instanceID) > 0) {
                $("#contactSearch_menu_link").addClass("enroller-step-complete");
            }
            /*clear any selected discounts*/
            enroller._setOption("discounts_selected", null);
            enroller._setOption("cost", null);

            /*If no enrolment hash has been generated (and a contact is selected), fire a status update*/
            if (enroller.options.enrolment_hash == null) {
                if (enroller.options.user_contact_id != 0 && parseInt(instanceID) > 0) {
                    var payload = {
                        user_contact_id: enroller.options.user_contact_id,
                        payer_id: enroller.options.payer_id,
                        course: course,
                        config_id: enroller.options.config_id
                    };
                    if (enroller.options.contact_id != 0) {
                        payload.contact_id = enroller.options.contact_id;
                    }
                    enroller.element.trigger("enroller:enrolment_status_update", payload);
                    enroller.element.one("enroller:status_update_complete", function() {
                        // to ensure the hash exists!
                        enroller._checkForEnrolmentHashes();
                    });
                } else if (
                    enroller.options.enroller_steps.billing == null ||
                    enroller.options.enroller_steps.review == null
                ) {
                    if (courseID != 0 && enroller.options.user_contact_id != 0) {
                        var payload = {
                            user_contact_id: enroller.options.user_contact_id,
                            payer_id: enroller.options.payer_id,
                            course: course,
                            is_enquiry: true,
                            config_id: enroller.options.config_id
                        };
                        if (enroller.options.contact_id != 0) {
                            payload.contact_id = enroller.options.contact_id;
                        }
                        enroller.element.trigger("enroller:enrolment_status_update", payload);
                    }
                }
            }
        },

        _setInvoice: function(invoiceID) {},
        _setCost: function(cost) {
            /*cost is temporarily set to null when course is changed*/
            if (cost == null) {
                if (enroller.options.skip_to_step == "billing" && enroller.element.data("booking_in_progress")) {
                } else {
                    enroller.element.data("billing_enabled", false);
                }
            }
        },
        _setEnrollerSteps: function(enroller_steps) {
            $("#enroller_step_menu").remove();
            this._displayStepMenu();
        },
        
        // Centeralised method to handle contact updates.
        _update_contact: function (contactID, contactParams, callback) {

            if (enroller.options.update_contact != null) {
                enroller.options.update_contact(contactID, contactParams, function (data) {
                    
                    if(data != null && data.CONTACTID != null){

                        if(data.CONTACTID === enroller.options.contact_id){
                            enroller._updateContactFields(data);
                        }
                        if(data.CONTACTID === enroller.options.payer_id){
                            enroller._updateContactFields(data, 'payer');
                        }
                        if(data.CONTACTID === enroller.options.user_contact_id){
                            enroller._updateContactFields(data, 'user');
                        }
                        // trigger step menu update;
                        enroller.element.trigger("enroller:update_enroller_status");
                     
                        var usiDat = enroller.element.data('usi_verified');
                        if (usiDat == null) {
                            usiDat = {};
                        }
                        if(data.USI_VERIFIED === true || data.USI_EXEMPTION === true){
                            usiDat[contactID] = true;
                        }
                        else{
                            usiDat[contactID] = false;
                        }
                        enroller.element.data('usi_verified', usiDat);

                        if(enroller.element.data('contact_data') != null){
                            if(enroller.element.data('contact_data').CONTACTID === data.CONTACTID){
                                enroller.element.data('contact_data', data);
                            }
                        }
                        if(enroller.element.data('user_contact_data') != null){
                            if(enroller.element.data('user_contact_data').CONTACTID === data.CONTACTID){
                                enroller.element.data('user_contact_data', data);
                            }
                        }
                      
                        if (enroller.options.payer_id === contactID) {
                            // update payer data.
                            enroller.element.data('payer_data', data);
                            enroller.element.data('payer_data_group', data);
                        }

                        if($("#usi_validation_step").length){
                            $("#usi_validation_step").data('contact_data', null);
                        }

                        if (enroller.options.multiple_courses != null) {
                            if (!$.isEmptyObject(enroller.options.multiple_courses)) {
                                $.each(enroller.options.multiple_courses, function(multipleContactID, enrolments) {
                                    if(contactID === multipleContactID){
                                        enrolments.CONTACT_NAME = data.GIVENNAME + " " + data.SURNAME;
                                    }
                                });
                            }
                        }

                        var possiblePayers = enroller.element.data("possible_payers")
                        if(possiblePayers == null){
                            possiblePayers = {};
                        }
                        possiblePayers[contactID] = {
                            DISPLAY: data.GIVENNAME + " " + data.SURNAME,
                            VALUE: contactID
                        };
                        enroller.element.data("possible_payers",possiblePayers);


                        if(data.CONTACTID === enroller.options.payer_id){
                            if(data.DOB != null){
                                var DOB = new Date(data.DOB);
                        
                                var ageDifMs = Date.now() + (1000 * 60*6*24) - DOB; 
                                var ageDate = new Date(ageDifMs); // miliseconds from epoch
                                var age = Math.abs(ageDate.getUTCFullYear() - 1970)

                                if(age < 18){
                                    enroller.options.payer_under_18 = true;
                                }
                                else if(age >= 18){
                                    enroller.options.payer_under_18 = false;
                                }

                            }
                        }

                    }
                    callback(data);
                });
            }
        },

        /*
		 * Step Menu Functions.
		 */

        /*
		 * Orders and displays the Steps menu
		 * */
        _displayStepMenu: function() {
            var stepMenu = $('<div data-role="controlgroup" />');
            if (enroller.options.step_layout == "left") {
                stepMenu.attr("data-type", "vertical");
            } else {
                stepMenu.attr("data-type", "horizontal");
            }

            stepMenu.attr("id", "enroller_step_menu");
            stepMenu.addClass("enroller-step-menu");

            /*look at the step order and display the valid steps*/
            $.each(enroller.options.step_order, function(i, step) {
                if (enroller.options.enroller_steps[step] != null) {
                    var stepLink = $('<a data-role="button" />');
                    if (enroller.options.enroller_steps[step].DISPLAY != null) {
                        stepLink.append(enroller.options.enroller_steps[step].DISPLAY);
                    } else {
                        stepLink.append(step);
                    }
                    stepLink.attr("id", step + "_menu_link");
                    stepLink.data("step", step);
                    stepLink.addClass("enroller-menu-link");
                    stepLink.on("click", function() {
                        // Only one popup can be open, so make sure to close the tooltip
                        $("#tooltipPop").popup("close");

                        enroller._changeStep(stepLink.data("step"));
                    });

                    stepLink.hover(
                        function(e) {
                            e.stopPropagation();
                            var message = enroller._getStepStatusMessage(step);
                            if (message != "") {
                                enroller._toolTip(stepLink, message);
                            }
                        },
                        function(e) {
                            e.stopPropagation();
                            $("#tooltipPop").popup("close");
                        }
                    );

                    stepMenu.append(stepLink);
                }
            });

            enroller.element.prepend(stepMenu);
        },

        /*
		 * Update the step menu buttons. Sets step completion status.
		 * */
        _updateStepButtons: function() {
            var requiredIcon = "ui-icon-alert";
            var completeIcon = "ui-icon-check";
            var incompleteIcon = "ui-icon-required";

            if (enroller.options.required_complete_check) {
                requiredIcon = "ui-icon-check";
            }
            $.each(enroller.options.enroller_steps, function(key, step) {
                var menuLink = $("#" + key + "_menu_link");
                var toolTipInfo = "";
                var done = false;
                if (step.TERMS != null) {
                    STEPS_WITH_TERMS = ["contact-update", "enrol-details", "review",]; // NOTE: USI validation not included - as it it not needed.
                    if (STEPS_WITH_TERMS.indexOf(step.TYPE) != -1) {
                        menuLink.removeClass(
                            "ui-nodisc-icon ui-icon-check  ui-nodisc-icon ui-icon-required  ui-nodisc-icon ui-icon-alert complete required-complete incomplete"
                        );
                        var termsComplete = enroller.element.find("#" + key + "_step").data("terms_completed");
                        if (termsComplete != true) {
                            menuLink.addClass(incompleteIcon + " incomplete ui-btn-icon-right ui-nodisc-icon");
                            toolTipInfo = "Review and agree to Terms";
                            done = true;
                        }
                    }
                }
                if (!done) {
                    if (step.FIELDS != null) {
                        var anyChanges = enroller._checkForUnsavedChanges(key);
                        enroller._checkStatusAndBuildParams(step.FIELDS, function(
                            params,
                            requiredComplete,
                            complete
                        ) {
                            menuLink.removeClass(
                                "ui-nodisc-icon ui-icon-check  ui-nodisc-icon ui-icon-required  ui-nodisc-icon ui-icon-alert complete required-complete incomplete"
                            );
                            if (requiredComplete && complete && !anyChanges) {
                                menuLink.addClass(completeIcon + " complete ui-btn-icon-right ui-nodisc-icon");
                                toolTipInfo = "Complete";
                            } else if (requiredComplete && !anyChanges) {
                                menuLink.addClass(
                                    requiredIcon + " required-complete ui-btn-icon-right ui-nodisc-icon"
                                );
                                toolTipInfo = "Required Fields Complete";
                            } else {
                                menuLink.addClass(incompleteIcon + " incomplete ui-btn-icon-right ui-nodisc-icon");
                                if (anyChanges) {
                                    toolTipInfo = "Unsaved Changes Detected.";
                                } else {
                                    toolTipInfo = "Required Fields Incomplete";
                                }
                            }
                        });
                    } else if (step.TYPE == "contact-search" || step.TYPE == "user-login") {
                        if (parseInt(enroller.options.contact_id) > 0) {
                            menuLink
                                .removeClass("ui-nodisc-icon ui-icon-required incomplete")
                                .addClass("ui-btn-icon-right ui-nodisc-icon ui-icon-check complete");
                            toolTipInfo = "Complete";
                        } else {
                            menuLink
                                .removeClass(" ui-nodisc-icon ui-icon-check complete")
                                .addClass("ui-btn-icon-right  ui-nodisc-icon ui-icon-required incomplete");
                            toolTipInfo = "No " + enroller.options.terminology_student + " Selected";
                        }
                    } else if (step.TYPE == "courses") {
                        if (parseInt(enroller.options.course.INSTANCEID) > 0) {
                            menuLink
                                .removeClass(" ui-nodisc-icon ui-icon-required incomplete")
                                .addClass("ui-btn-icon-right ui-nodisc-icon ui-icon-check complete");
                            toolTipInfo = "Complete";
                        } else {
                            menuLink
                                .removeClass(" ui-nodisc-icon ui-icon-check complete")
                                .addClass("ui-btn-icon-right  ui-nodisc-icon ui-icon-required incomplete");
                            toolTipInfo = "No Course Selected";
                        }
                    } else if (step.TYPE == "portfolio") {
                        if (parseInt(enroller.options.contact_id) > 0) {
                            if ($("#" + key + "_step").data("completed") == true) {
                                toolTipInfo = "Complete";
                                menuLink
                                    .removeClass(" ui-nodisc-icon ui-icon-required incomplete")
                                    .addClass("ui-btn-icon-right  ui-nodisc-icon ui-icon-check complete");
                            } else if (step.portfolio_optional == true || step.PORTFOLIO_OPTIONAL == true) {
                                menuLink
                                    .removeClass(" ui-nodisc-icon ui-icon-required incomplete")
                                    .addClass("ui-btn-icon-right  ui-nodisc-icon ui-icon-check complete");
                                toolTipInfo = "Optional Step";
                            } else {
                                toolTipInfo = "Required Files Not Provided";
                                menuLink
                                    .removeClass(" ui-nodisc-icon ui-icon-check complete")
                                    .addClass("ui-btn-icon-right  ui-nodisc-icon ui-icon-required incomplete");
                            }
                        } else {
                            toolTipInfo = "No " + enroller.options.terminology_student + " Selected";
                            menuLink
                                .removeClass(" ui-nodisc-icon ui-icon-check complete")
                                .addClass("ui-btn-icon-right  ui-nodisc-icon ui-icon-required incomplete");
                        }
                    } else if (step.TYPE == "review") {
                        if (enroller.stepSelectable("billing")) {
                            toolTipInfo = "Complete";
                        } else if (enroller.options.contact_id == 0) {
                            toolTipInfo = "No " + enroller.options.terminology_student + " Selected";
                        } else if (enroller.options.course.INSTANCEID == 0) {
                            toolTipInfo = "No Course Selected";
                        } else {
                            if (enroller.stepSelectable(key)) {
                                toolTipInfo = "Review Available";
                            }
                        }
                    } else if (step.TYPE == "group-booking" || step.TYPE == "agent-courses") {
                        if (enroller.stepSelectable("billing")) {
                            toolTipInfo = "Complete";
                        } else if (enroller.options.contact_id == 0) {
                            toolTipInfo = "No " + enroller.options.terminology_student + " Selected";
                        } else if (enroller.options.course.INSTANCEID == 0) {
                            toolTipInfo = "No Course Selected";
                        } else {
                            if (enroller.stepSelectable(key)) {
                                toolTipInfo = "Review Available";
                            }
                        }
                    } else if (step.TYPE == "usi-validation"){
                        var usiDat = enroller.element.data('usi_verified');
                        if(enroller.options.contact_id === 0 ||usiDat == null){
                            menuLink.addClass(incompleteIcon + " incomplete ui-btn-icon-right ui-nodisc-icon");
                            toolTipInfo = "Not Verified";
                        }
                        else if(usiDat[enroller.options.contact_id] == true){
                            menuLink
                            .removeClass(incompleteIcon+" ui-nodisc-icon ui-icon-required incomplete")
                            .addClass("ui-btn-icon-right ui-nodisc-icon ui-icon-check complete");
                            toolTipInfo = "Complete";
                        }
                        else{
                            menuLink.addClass(incompleteIcon + " incomplete ui-btn-icon-right ui-nodisc-icon");
                            toolTipInfo = "Not Verified";
                        }
                    }                
                }
                if (toolTipInfo != "") {
                    menuLink.data("TOOLTIP", toolTipInfo);
                }
                if (!enroller.stepSelectable(key)) {
                    menuLink.prop("disabled", true).addClass("ui-disabled");
                } else {
                    menuLink.prop("disabled", false).removeClass("ui-disabled");
                }
            });

            if (enroller.options.step_layout == "left") {
                $("#enroller_step_menu").css("display", "table-cell");
                $("#enroller_step_menu").addClass("enroller-layout-left");
            }
        },

        /***** Shared UI Components. SearchTag: ui_components *****/

        _chosenAddTabStop: function(element) {
            var tabindex = $(element).data("tabindex");
            if (tabindex != null) {
                $(element)
                    .closest("div.enroller-field-holder")
                    .find("input")
                    .attr("tabindex", tabindex)
                    .on("select", function(e) {
                        $(element).trigger("chosen:open");
                    });
            }
        },

        /*
		 * Custom code to work with chosens. 
		 * Creates, then modifies both the UI and behaviour of chosens.
		 * TODO: add specific input type for the "Add new value" chosen, rather than just single-select
		 */
        _displaySetupChosens: function (step) {
            var allowedChosens = ! (/iP(od|hone)/i.test(window.navigator.userAgent) || /IEMobile/i.test(window.navigator.userAgent) || /Windows Phone/i.test(window.navigator.userAgent) || /BlackBerry/i.test(window.navigator.userAgent) || /BB10/i.test(window.navigator.userAgent) || /Android.*Mobile/i.test(window.navigator.userAgent));


            if (allowedChosens) {
                /*override the deselect option for course type*/
                if (step == "courses") {
                    $("#courseType.enroller-select-chosen:not(.chosen-markup)")
                        .addClass("chosen-markup")
                        .chosen({
                            width: "24em",
                            allow_single_deselect: false,
                            disable_search_threshold: 10,
                            placeholder_text_single: "Select",
                            placeholder_text_multiple: "Select"
                        })
                        .show();
                }

                /*generate Chosens. Set the selects to be visible to allow for form notifications for required fields*/
                if (enroller.options.selects_as_chosens) {
                    $("#" + step + "_step .enroller-select-chosen:not(.chosen-markup)")
                        .addClass("chosen-markup")
                        .chosen({
                            width: "24em",
                            allow_single_deselect: true,
                            disable_search_threshold: 10,
                            placeholder_text_single: "Select",
                            placeholder_text_multiple: "Select"
                        })
                        .show();
                    $("#" + step + "_step .enroller-select-chosen").each(function(index, element) {
                        enroller._chosenAddTabStop(element);
                    });
                }
                $("#" + step + "_step .enroller-select-multi:not(.chosen-markup)")
                    .addClass("chosen-markup")
                    .chosen({
                        width: "24em",
                        allow_single_deselect: true,
                        disable_search_threshold: 10,
                        placeholder_text_single: "Select",
                        placeholder_text_multiple: "Select"
                    })
                    .show();

                $(".chosen-single:not(.chosen-markup)").addClass(
                    "ui-btn ui-btn-icon-right ui-alt-icon ui-nodisc-icon ui-icon-carat-d chosen-markup"
                );
                $(".chosen-container-multi .search-field .ui-input-text").removeClass(
                    "ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset ui-focus"
                );

                $(".chosen-results.ui-listview").removeClass("ui-listview");
                $(".chosen-single div b")
                    .closest("div")
                    .remove();
            }

            $(".enroller-search-add .chosen-search input").on("keyup", function(e) {
                input = $(this);
                newValue = input.val();
                noResults = input.closest(".chosen-container").find(".no-results");
                if (noResults.length > 0) {
                    hasMarkup = noResults.hasClass("ui-btn");
                    if (!hasMarkup) {
                        var addResult = $('<div class="add-result" />');
                        addResult.append(noResults.html() + "<br/> Add New");
                        noResults
                            .empty()
                            .append(addResult)
                            .addClass("ui-btn ui-btn-active ui-btn-icon-right ui-icon-nodisc ui-icon-plus");
                        addResult.on("click", function() {
                            var selectMenu = addResult.closest(".enroller-field-holder").find("select");

                            if (selectMenu.data("add_type") != null) {
                                if (selectMenu.data("add_type") == "contact") {
                                    var terminology = selectMenu
                                        .closest(".enroller-field-holder")
                                        .find(".enroller-field-label")
                                        .text();
                                    var contactCreate = enroller._displayContactCreate(function(
                                        contactBasicDetails
                                    ) {
                                        enroller._contactAdded(contactBasicDetails);
                                        selectMenu.val(contactBasicDetails.CONTACTID);
                                        selectMenu.trigger("chosen:updated");
                                    },
                                    terminology);
                                    enroller.element.append(contactCreate).hide();
                                    contactCreate.enhanceWithin();
                                    contactCreate.prepend(
                                        '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>'
                                    );
                                    contactCreate
                                        .popup({
                                            positionTo: "window",
                                            corners: false
                                        })
                                        .popup("open")
                                        .show();

                                    /*correct positioning of poup*/
                                    $("#contactCreate-popup").css({
                                        transform: "translate(-50%, -50%)"
                                    });
                                    $("#contactCreate-screen").css("height", "auto");
                                    $(window).trigger("resize");
                                }
                            } else {
                                var newOption = $('<option value="' + newValue + '" >' + newValue + "</option>");
                                selectMenu.append(newOption);
                                newOption.attr("selected", "selected");
                                selectMenu.trigger("chosen:updated");
                            }
                        });
                    }
                }
            });
        },

        /***** ENROLLER STEPS *****/

        /*
		 * Create and Display holders for the step-content
		 * */
        _displaySteps: function() {
            $.each(enroller.options.enroller_steps, function(key, step) {
                var stepHolder = $("<div />");
                stepHolder.attr("id", key + "_step");
                stepHolder.addClass("enroller-step ui-body ui-body-a");
                stepHolder.addClass(step.TYPE);
                stepHolder.css("display", "none");
                enroller.element.append(stepHolder);

                if (enroller.options.step_layout == "left") {
                    stepHolder.addClass("enroller-layout-left");
                }
            });
        },
        /* 
		 * This will build a standard step and wire up the updateFunction to a save button
		 * Typically has a list of input fields and the save button
		 * Used for Contact Update fields
		 * */
        _displayGenericRecordUpdateStep: function(step) {
            var stepOptions = enroller.options.enroller_steps[step];
            var inputHolder = $("<form />");
            var fields = stepOptions.FIELDS;
        
            if(stepOptions.TYPE === "address"){
                $("#" + step + "_step").append(inputHolder);

                if ($.fn.render_address != null) {
                    var addressOptions = {
                        fieldRenderer: enroller._createInputField,
                        updateField: enroller._updateInputValue,
                        headerRenderer: enroller._createInfoFieldDetailed,
                        required: stepOptions.REQUIRED,
                        attachEventsTo: enroller.element,
                        getInputValue: enroller._getInputValue,
                        countryList: enroller.options.country_list,
                        country_restriction: stepOptions.AUS_ADDRESS ? "au" : ""
                    };

                    if(stepOptions && stepOptions.CONTACT_TYPE && stepOptions.CONTACT_TYPE !== "student"){
                        addressOptions.fieldPrefix = stepOptions.CONTACT_TYPE + '_';
                    } 
                    inputHolder.render_address(addressOptions);

                    fields = inputHolder.render_address('getFieldListWithPrefix');
                    stepOptions.FIELDS = fields;
                }
                else{
                    console.warn('Render address library not present');
                }
                
            }else{
                $("#" + step + "_step").append(inputHolder);
                var index = 0;
                $.each(fields, function(key, field) {
                    index++;
                    var fieldHolder = enroller._createInputField(key, field, index);
    
                    inputHolder.append(fieldHolder);
                });
            }
           

            if(stepOptions && stepOptions.CONTACT_TYPE && stepOptions.CONTACT_TYPE === "payer" && stepOptions.FIRST_PAYER === true){
                
                enroller.element.data("payer_data");

                var placeHolder = $('<div/>').addClass('payer-change');
                $("#" + step + "_step").prepend(placeHolder);
                // going to have to find a way to render on this step mounting....
            }

            /*Top Blurb*/

            if (stepOptions.BLURB_TOP != null && stepOptions.BLURB_TOP != "") {
                var blurbT = enroller._createBlurb(stepOptions.BLURB_TOP);

                $("#" + step + "_step").prepend(blurbT);
            }
            if (stepOptions.HEADER) {
                var headerInfo = {
                    INFO_ONLY: true,
                    TYPE: "header",
                    DISPLAY: stepOptions.HEADER
                };
                $("#" + step + "_step").prepend(
                    enroller._createInfoFieldDetailed(step + "_step_header", headerInfo)
                );
            }
            /*Bottom Blurb*/
            if (stepOptions.BLURB_BOTTOM != null && stepOptions.BLURB_BOTTOM != "") {
                var blurbB = enroller._createBlurb(stepOptions.BLURB_BOTTOM);
                $("#" + step + "_step").append(blurbB);
            }

            var saveButtonHolder = enroller._createInformationField("Save", "");
            saveButtonHolder
                .find("div.enroller-field-label")
                .text("")
                .css("background", "transparent")
                .css("border", "none");
            saveButtonHolder.find("div.enroller-text-field").remove();

            var saveButtonText = "Save";

            if (stepOptions.BUTTON_TEXT != null) {
                saveButtonText = stepOptions.BUTTON_TEXT;
            }

            var saveButton = $(
                '<button class="enroller-save-button ui-btn-active" type="submit" name="submit" data-role="button"></button>'
            );
            saveButton.text(saveButtonText);
            saveButtonHolder.append(saveButton);
            saveButton.on("click", function() {
                if (enroller.element.find(".enroller-error-message").length) {
                    enroller.element.find(".enroller-error-message").remove();
                }

                
                enroller._checkStatusAndBuildParams(fields, function(
                    params,
                    requiredComplete,
                    complete,
                    incompleteFields
                ) {
                    enroller.element.find(".enroller-incomplete-field").removeClass("enroller-incomplete-field");
                    var contactID = enroller.options.contact_id;

                    if(stepOptions && stepOptions.CONTACT_TYPE){
                        if(stepOptions.CONTACT_TYPE === 'payer' && enroller.options.payer_id > 0){
                            contactID = enroller.options.payer_id;
                        }
                        else if(stepOptions.CONTACT_TYPE === 'user' && enroller.options.user_contact_id > 0){
                            contactID = enroller.options.user_contact_id;
                        }
                        var updated = {};
                        $.each(params, function(key, value){
                            updated[enroller._removeFieldContactType(key)] = value;
                        });
                        params = updated;
                    }

                    if (incompleteFields.length > 0) {
                        $.each(incompleteFields, function(i) {
                            enroller._markFieldIncomplete(incompleteFields[i], fields[incompleteFields[i]]);
                        });
                    }
                    if(stepOptions.TYPE === "address" && stepOptions.REQUIRED){
                        if(params.POBOX == "" && (params.STREETNAME ==="" || params.STREETNO === "")){
                            requiredComplete = false;
                            enroller._displayError(
                                "STREETNAME",
                                "PO Box or Street Address details must be specified."
                            );
                        }
                        if(params.SPOBOX == "" && (params.SSTREETNAME ==="" ||params.SSTREETNO === "")){
                            requiredComplete = false;
                            enroller._displayError(
                                "SSTREETNAME",
                                "PO Box or Street Address details must be specified."
                            );
                        }
                    }
                 
                    if (stepOptions.TYPE == "contact-update" || stepOptions.TYPE === "address") {
                        
                        enroller._update_contact(contactID, params, function(response) {
                            if (response != null) {
                                if (response.error != null) {
                                    var message = "";
                                    if (response.resultBody != null) {
                                        if (response.resultBody.MESSAGES != null) {
                                            message = message + response.resultBody.MESSAGES + "<br />";
                                        }
                                        if (response.resultBody.DETAILS != null) {
                                            message = message + response.resultBody.DETAILS;
                                        }
                                    }

                                    if (response.error == 412) {
                                        if (response.resultBody.FIELDNAMES != null) {
                                            var fieldNames = response.resultBody.FIELDNAMES.split(",");
                                            if (fieldNames.length > 0) {
                                                for (var i in fieldNames) {
                                                    var field = fieldNames[i];
                                                    var tempMessage = message.split(",")[i];
                                                    var fieldID = field.toUpperCase();
                                                    enroller._markFieldIncomplete(fieldID, fields[fieldID]);
                                                    enroller._scrollToElement("#" + fieldID, function() {
                                                        if ($("#" + fieldID).length) {
                                                            $("#" + fieldID).focus();
                                                        }

                                                        //enroller._alert(message);
                                                    });
                                                    enroller._displayError(fieldID, tempMessage);
                                                }
                                            }
                                        }
                                    } else {
                                        enroller._alert(message);
                                    }
                                } else {
                                    enroller.element.data(step + "_last_params", params);

                                    if (enroller.options.post_enrolment_widget == true) {
                                        var postEnrolPayload = {
                                            user_contact_id: contactID,
                                            post_enrolment: true,
                                            config_id: enroller.options.config_id
                                        };

                                        if (enroller.options.enrolment_hash != null) {
                                            postEnrolPayload.enrolment_hash = enroller.options.enrolment_hash;
                                        }
                                        enroller.element.trigger("enroller:post_enrol_update", postEnrolPayload);

                                        
                                    }
                                    if (requiredComplete) {
                                        enroller._changeStep(enroller._getNextStep(step));
                                    } else {
                                        /*TODO: Update to add class to all incomplete fields*/
                                        if (incompleteFields.length > 0) {
                                            if ($("#" + incompleteFields[0]).length) {
                                                enroller._scrollToElement("#" + incompleteFields[0]);
                                                $("#" + incompleteFields[0]).focus();
                                            } else {
                                                enroller._scrollToElement("." + incompleteFields[0]);
                                                $("." + incompleteFields[0]).focus();
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    } else if (stepOptions.TYPE == "enrol-details") {
                        enroller.element.data(step + "_last_params", params);
                        enroller.element.data("enrol_advanced", params);
                        /*values have changed so disable billing so that the user is forced through the review step*/
                        enroller.element.data("billing_enabled", false);

                        if (enroller.options.multiple_courses != null) {
                            enroller._alert(
                                "This will not apply unless you review the selected courses and update them."
                            );
                        }
                        if (requiredComplete) {
                            enroller._changeStep(enroller._getNextStep(step));
                        } else {
                            if (incompleteFields.length > 0) {
                                enroller._scrollToElement("#" + incompleteFields[0]);
                                if ($("#" + incompleteFields[0]).length) {
                                    $("#" + incompleteFields[0]).focus();
                                }
                            }
                        }
                    } else if (stepOptions.TYPE == "course-enquiry") {
                        enroller.element.data(step + "_last_params", params);
                        if (requiredComplete) {
                            enroller._sendEnquiry(params, step);
                        } else {
                            if (incompleteFields.length > 0) {
                                enroller._scrollToElement("#" + incompleteFields[0]);
                                if ($("#" + incompleteFields[0]).length) {
                                    $("#" + incompleteFields[0]).focus();
                                }
                            }
                        }
                    } else if (stepOptions.TYPE == "contact-note") {
                        enroller.element.data(step + "_last_params", params);
                        if (requiredComplete) {
                            enroller._sendNote(params, step);
                        } else {
                            if (incompleteFields.length > 0) {
                                enroller._scrollToElement("#" + incompleteFields[0]);
                                if ($("#" + incompleteFields[0]).length) {
                                    $("#" + incompleteFields[0]).focus();
                                }
                            }
                        }
                    } else {
                        if (stepOptions.updateFunction != null) {
                            var context = window;
                            var func = stepOptions.updateFunction;

                            if (stepOptions.updateFunction.indexOf(".") > -1) {
                                var namespaces = stepOptions.updateFunction.split(".");
                                func = namespaces.pop();
                                for (var i = 0; i < namespaces.length; i++) {
                                    context = window[namespaces[i]];
                                }
                            }

                            /*evaluate the text string for the updateFunction and run it if present*/
                            if (typeof context[func] === "function") {
                                context[func](contactID, params, function() {
                                    enroller.element.data(step + "_last_params", params);
                                    /*do something on success*/
                                    if (requiredComplete) {
                                        enroller._changeStep(enroller._getNextStep(step));
                                    }
                                });
                            }
                        }
                    }
                    if (complete && requiredComplete) {
                        enroller.element.data(step + "_complete", "complete");
                    } else if (requiredComplete) {
                        enroller.element.data(step + "_complete", "required_complete");
                    } else {
                        enroller.element.data(step + "_complete", "incomplete");
                        if (incompleteFields.length > 0) {
                            enroller._scrollToElement("#" + incompleteFields[0]);
                            if ($("#" + incompleteFields[0]).length) {
                                $("#" + incompleteFields[0]).focus();
                            }
                        }
                    }
                });
            });
            $("#" + step + "_step :input").change(function() {
                $("#" + step + "_step").data("changed", true);
            });
            inputHolder.append(saveButtonHolder);

            if (stepOptions.TERMS != null) {
                var terms = enroller._createTerms(stepOptions.TERMS);
                saveButton.addClass("ui-disabled").prop("disabled", true);
                terms[0].insertBefore(saveButtonHolder);
                terms[1].insertBefore(saveButtonHolder);
            }

            enroller._displaySetupChosens(step);
        },

        _displayCompleteStep: function() {
            var step = "complete";
            $("#" + step + "_step").empty();
            var stepOptions = enroller.options.enroller_steps[step];

            var message = enroller._enrolmentResponse(true, {});
            $("#" + step + "_step").append(message);
            /*Top Blurb*/

            if (stepOptions.BLURB_TOP != null && stepOptions.BLURB_TOP != "") {
                var blurbT = enroller._createBlurb(stepOptions.BLURB_TOP);

                $("#" + step + "_step").prepend(blurbT);
            }
            if (stepOptions.HEADER) {
                var headerInfo = {
                    INFO_ONLY: true,
                    TYPE: "header",
                    DISPLAY: stepOptions.HEADER
                };
                $("#" + step + "_step").prepend(
                    enroller._createInfoFieldDetailed(step + "_step_header", headerInfo)
                );
            }
            /*Bottom Blurb*/
            if (stepOptions.BLURB_BOTTOM != null && stepOptions.BLURB_BOTTOM != "") {
                var blurbB = enroller._createBlurb(stepOptions.BLURB_BOTTOM);
                $("#" + step + "_step").append(blurbB);
            }

            enroller._displaySetupChosens(step);
            if (enroller.options.complete_step_events == true) {
                enroller.element.trigger("enroller:enrolment_complete", {
                    user_contact_id: enroller.options.user_contact_id,
                    method: "complete_step",
                    enrolments: enroller.options.multiple_courses,
                    payer_id: enroller.options.payer_id,
                    invoice_id: enroller.options.invoice_id,
                    config_id: enroller.options.config_id
                });
            }
        },

        /* USER_LOGIN STEP */

        _userLoginContactCreated: function(contactBasicDetails) {
            enroller._contactAdded(contactBasicDetails);
            enroller._setOption("contact_id", contactBasicDetails.CONTACTID);
            enroller._setOption("payer_id", contactBasicDetails.CONTACTID);
            enroller._changeStep(enroller._getNextStep("userLogin"));
            enroller.options.user_contact_id = contactBasicDetails.CONTACTID;
            enroller.element.trigger("enroller:user_contact_set", {
                user_contact_id: enroller.options.user_contact_id
            });
        },
        _displayUserLogin: function() {
            var contact_create_only = enroller.options.contact_create_only;
            if (enroller.options.login_or_create) {
                var modeSwitchHolder = $('<div data-role="controlgroup" data-type="horizontal" />');
                modeSwitchHolder.append(
                    $(
                        '<a class="enroller-login-switch ui-btn ui-btn-icon-right ui-alt-icon ui-nodisc-icon ui-icon-plus ui-btn-active enroller-create-contact" data-mode="contact">New ' +
                            enroller.options.terminology_student +
                            "</a>"
                    ).data("mode", "contact")
                );
                modeSwitchHolder.append(
                    $(
                        '<a class="enroller-login-switch ui-btn ui-btn-icon-right ui-alt-icon ui-nodisc-icon ui-icon-user">Returning ' +
                            enroller.options.terminology_student +
                            "</a>"
                    ).data("mode", "login")
                );
                $("#userLogin_step").append(modeSwitchHolder);
                modeSwitchHolder.on("click", "a", function(e) {
                    var element = $(this);
                    if (element.data("mode") == "contact") {
                        $("#userLogin_step #loginForm").hide();
                        $("#userLogin_step #forgotPassHolder").hide();
                        $("#userLogin_step #contactForm").show();
                        var contactCreate = enroller._displayContactCreate(
                            function(contactBasicDetails) {
                                /*WP-347*/
                                if (enroller.options.create_user_start == true) {
                                    // TODO: Go through this function, or alternatively ?
                                    // Login after creating, or
                                    enroller.options.create_user(
                                        {
                                            username: contactBasicDetails.EMAILADDRESS,
                                            contactID: contactBasicDetails.CONTACTID
                                        },
                                        function(response) {
                                            if (response.USERID != null) {
                                                enroller._userLoginContactCreated(contactBasicDetails);
                                            } else {
                                                if (response.ERROR) {
                                                    if (
                                                        response.MESSAGES.indexOf(
                                                            "already exists in this account"
                                                        ) > 0
                                                    ) {
                                                        enroller._alert(
                                                            "<p>An existing record with that email was found.</p>" +
                                                                "<p>Please use the login option to continue your enrolment.</p>",
                                                            "info",
                                                            "Existing Record Found"
                                                        );
                                                    }
                                                }
                                            }
                                        }
                                    );
                                } else {
                                    enroller._userLoginContactCreated(contactBasicDetails);
                                }
                            },
                            null,
                            true
                        );
                        $("#userLogin_step #contactForm").append(contactCreate);
                        contactCreate
                            .find(".enroller-create-contact-button")
                            .addClass("ui-btn enroller-save-button ui-btn-active");
                        contactCreate.enhanceWithin();
                    } else if (element.data("mode") == "login") {
                        $("#userLogin_step #contactForm").hide();
                        $("#userLogin_step #forgotPassHolder").hide();
                        $("#userLogin_step #loginForm").show();
                    }
                    modeSwitchHolder.find(".ui-btn-active").removeClass("ui-btn-active");
                    element.addClass("ui-btn-active");
                });
                modeSwitchHolder.controlgroup();

                var contactCreateHolder = $('<form id="contactForm" />');
                $("#userLogin_step").append(contactCreateHolder);
            }

            var fields = {
                USERNAME: {
                    DISPLAY: "Username",
                    TYPE: "text",
                    REQUIRED: "required",
                    MAXLENGTH: 100
                },
                PASSWORD: { DISPLAY: "Password", TYPE: "password", REQUIRED: "required" }
            };

            var inputHolder = $('<form id="loginForm" />');
            $("#userLogin_step").append(inputHolder);

            $.each(fields, function(key, field) {
                var fieldHolder = enroller._createInputField(key, field);

                inputHolder.append(fieldHolder);
            });
            var loginHolder = enroller._createInformationField("Login", "");
            loginHolder.find("div.enroller-text-field").remove();
            loginHolder
                .find("div.enroller-field-label")
                .text("")
                .css("background", "transparent")
                .css("border", "none");

            var loginButton = $(
                '<button class="enroller-save-button ui-btn ui-btn-active" type="submit" name="submit" data-role="button">Login</button>'
            );
            loginHolder.append(loginButton);
            inputHolder.append(loginHolder);
            loginButton.on("click", function() {
                enroller._checkStatusAndBuildParams(fields, function(params, requiredComplete, complete) {
                    if (requiredComplete) {
                        if (enroller.options.user_login != null) {
                            enroller.options.user_login(params, function(userData) {
                                if (userData.STATUS == null) {
                                    enroller._alert("An Error occurred on Login, Please try again.");
                                } else {
                                    if (userData.STATUS == "success") {
                                        enroller._setUserRoleAndAccess(userData);
                                    } else if (
                                        userData.AXTOKEN != null &&
                                        userData.ROLETYPEID != null &&
                                        userData.USERID != null
                                    ) {
                                        enroller._setUserRoleAndAccess(userData);
                                    } else {
                                        enroller._alert(userData.MESSAGE);
                                    }
                                }
                            });
                        } else {
                            enroller._alert("An Error occurred on Login, Please try again.");
                        }
                    }
                });
            });
            var forgotHolder = enroller._createInformationField("Forgot Password", "");
            forgotHolder.find("div.enroller-text-field").remove();
            forgotHolder
                .find("div.enroller-field-label")
                .text("")
                .css("background", "transparent")
                .css("border", "none");

            var forgotButton = $(
                '<button class="enroller-save-button ui-btn" data-role="button" name="forgot" type="button">Forgot Password</button>'
            );
            forgotHolder.append(forgotButton);
            inputHolder.append(forgotHolder);
            forgotButton.on("click", function() {
                $("#userLogin_step #forgotPassHolder").show();
                $("#userLogin_step #loginForm").hide();
            });

            var forgotPassHolder = $('<form id="forgotPassHolder" />');
            $("#userLogin_step").append(forgotPassHolder);
            forgotPassHolder.hide();

            var fieldsFPW = {
                RESET_UNAME: { DISPLAY: "Username", TYPE: "text", REQUIRED: "required" },
                RESET_EMAIL: { DISPLAY: "Email Address", TYPE: "email", REQUIRED: "required" }
            };
            $.each(fieldsFPW, function(key, field) {
                var fieldHolder = enroller._createInputField(key, field);

                forgotPassHolder.append(fieldHolder);
            });

            var resetHolder = enroller._createInformationField("Reset Password", "");
            resetHolder.find("div.enroller-text-field").remove();
            resetHolder
                .find("div.enroller-field-label")
                .text("")
                .css("background", "transparent")
                .css("border", "none");

            var resetButton = $(
                '<button class="enroller-save-button ui-btn-active ui-btn" type="submit" name="submit" data-role="button">Reset Password</button>'
            );
            resetHolder.append(resetButton);
            forgotPassHolder.append(resetHolder);

            resetButton.on("click", function() {
                enroller._checkStatusAndBuildParams(fieldsFPW, function(params, requiredComplete, complete) {
                    if (requiredComplete) {
                        if (enroller.options.user_reset != null) {
                            var newParams = {};
                            newParams.USERNAME = params.RESET_UNAME;
                            newParams.EMAIL = params.RESET_EMAIL;

                            enroller.options.user_reset(newParams, function(resetData) {
                                if (resetData.STATUS == null) {
                                    if (resetData.ERROR == true) {
                                        if (resetData.DETAILS != null) {
                                            enroller._alert(
                                                "An error occurred on reset, please check your details and try again.<br/><br/>" +
                                                    resetData.DETAILS
                                            );
                                        }
                                    } else {
                                        enroller._alert(
                                            "An error occurred on reset, please check your details and try again."
                                        );
                                    }
                                } else {
                                    if (resetData.STATUS == "success") {
                                        enroller._alert(
                                            "Your password has been reset, you will recieve an email with instructions for updating your password."
                                        );
                                        $("#userLogin_step .enroller-login-switch.ui-icon-user").trigger("click");
                                    } else {
                                        enroller._alert(resetData.MSG);
                                    }
                                }
                            });
                        } else {
                            enroller._alert("An error occurred on reset, please check your details and try again.");
                        }
                    }
                });
            });

            if (!enroller.options.login_or_create) {
                if ($("#contactForm").length) {
                    $("#contactForm").hide();
                    modeSwitchHolder.hide();
                }
            } else if (contact_create_only) {
                $("#userLogin_step #loginForm").hide();
                $("#userLogin_step #forgotPassHolder").hide();
                modeSwitchHolder.find("a.enroller-create-contact").trigger("click");
                modeSwitchHolder.hide();
            } else {
                $("#userLogin_step #loginForm").hide();
                $("#userLogin_step #forgotPassHolder").hide();
                modeSwitchHolder.find("a.enroller-create-contact").trigger("click");
            }

            var stepOptions = enroller.options.enroller_steps.userLogin;
            /*Top Blurb*/
            if (stepOptions.BLURB_TOP != null && stepOptions.BLURB_TOP != "") {
                var blurbT = enroller._createBlurb(stepOptions.BLURB_TOP);

                $("#userLogin_step").prepend(blurbT);
            }
            if (stepOptions.HEADER) {
                var headerInfo = {
                    INFO_ONLY: true,
                    TYPE: "header",
                    DISPLAY: stepOptions.HEADER
                };
                $("#userLogin_step").prepend(
                    enroller._createInfoFieldDetailed("userLogin_step_header", headerInfo)
                );
            }
            /*Bottom Blurb*/
            if (stepOptions.BLURB_BOTTOM != null && stepOptions.BLURB_BOTTOM != "") {
                var blurbB = enroller._createBlurb(stepOptions.BLURB_BOTTOM);
                $("#userLogin_step").append(blurbB);
            }
        },

        _displayContactSearch: function() {
            var contactOptions = enroller.options.enroller_steps.contactSearch;
            enroller._createContactList();
        },
        _createContactList: function() {
            /*WP-199*/
            var addModeHolder = $('<div class="enroller-contact-mode-holder ui-grid-a"></div>');
            var selfHolder = $('<div class="ui-block-a"></div>');
            var otherHolder = $('<div class="ui-block-b"></div>');

            var searchModeHolder = $('<div class="enroller-search-mode"></div>');

            var selfButton = $(
                '<a data-role="button" class="ui-btn-active enroller-save-button ui-nodisc-icon ui-btn ui-icon-plus ui-btn-icon-right" >' +
                    enroller.options.enrolling_terminology +
                    " Myself</a>"
            );

            var otherButton = $(
                '<a data-role="button" class="ui-btn-active enroller-save-button ui-nodisc-icon ui-btn ui-icon-plus ui-btn-icon-right" >' +
                    enroller.options.enrolling_terminology +
                    " Someone Else</a>"
            );
            addModeHolder.append(selfHolder.append(selfButton)).append(otherHolder.append(otherButton));
            $("#contactSearch_step").append(addModeHolder);
            /*End WP-199*/

            var searchAddHolder = $(
                '<div data-role="controlgroup" data-type="horizontal" class="enroller-contact-searchadd ui-nodisc-icon" />'
            );
            var contactListHolder = $('<div class="enroller-contact-list-hold" />');
            var cList = $(
                '<ul id="cList" data-role="listview" data-filter="true" data-inset="true" data-input="#cListFilter" />'
            );
            var filter = $(
                '<input id="cListFilter" data-type="search" data-wrapper-class=" ui-btn controlgroup-textinput" placeholder="Search ' +
                    enroller.options.terminology_student +
                    's" />'
            );
            var addNew = $(
                '<a data-role="button" class="ui-btn-active enroller-save-button enroller-create-contact-button ui-nodisc-icon ui-btn ui-icon-plus ui-btn-icon-right" >Add New ' +
                    enroller.options.terminology_student +
                    "</a>"
            );

            contactListHolder.append(cList);
            searchAddHolder.append(filter).append(addNew);

            $("#contactSearch_step").append(searchModeHolder.append(contactListHolder));

            addNew.on("click", function(e) {
                var contactCreate = enroller._displayContactCreate(function(contactBasicDetails) {
                    enroller._setOption("contact_id", contactBasicDetails.CONTACTID);
                    enroller._changeStep(enroller._getNextStep("contactSearch"));

                    enroller._contactAdded(contactBasicDetails);
                });
                contactCreate.insertAfter($("#contactSearch_step")).hide();
                contactCreate.enhanceWithin();
                contactCreate.prepend(
                    '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>'
                );
                contactCreate
                    .popup({
                        positionTo: "window",
                        corners: false
                    })
                    .popup("open")
                    .show();
                /*correct positioning of poup*/
                $("#contactCreate-popup").css({
                    transform: "translate(-50%, -50%)"
                });

                $("#contactCreate-screen").css("height", "auto");
                $(window).trigger("resize");
            });
            searchModeHolder.prepend(searchAddHolder);

            /*WP-199*/
            selfButton.on("click", function(e) {
                if (enroller.options.contact_id > 0) {
                    enroller._changeStep(enroller._getNextStep("contactSearch"));
                } else if (enroller.options.user_contact_id != null && enroller.options.user_contact_id > 0) {
                    enroller._setOption("contact_id", enroller.options.user_contact_id);
                    enroller._changeStep(enroller._getNextStep("contactSearch"));
                }
            });

            otherHolder.on("click", function(e) {
                addModeHolder.hide();
                searchModeHolder.show();

                if (enroller.options.contact_search_button_autocreate == true) {
                    addNew.trigger("click");
                }
            });
            /*check to see which mode should display*/
            if (enroller.options.enroller_steps.contactSearch.contactList != null) {
                if ($.isArray(enroller.options.enroller_steps.contactSearch.contactList)) {
                    if (enroller.options.enroller_steps.contactSearch.contactList.length > 1) {
                        searchModeHolder.show();
                        addModeHolder.hide();
                    } else {
                        searchModeHolder.hide();
                    }
                } else {
                    searchModeHolder.hide();
                }
            } else {
                searchModeHolder.hide();
            }

            /*if the override setting is on false then switch back - for cases where dynamic contact search may be better than loading create by default*/
            if (enroller.options.contact_search_buttons == false) {
                searchModeHolder.show();
                addModeHolder.hide();
            }
            /*End WP-199*/
            /*Prepopulated list*/
            if (enroller.options.enroller_steps.contactSearch.contactList != null) {
                if (enroller.options.enroller_steps.contactSearch.contactList.length > 1) {
                    filter.data("prepopulated_list", true);
                    var contacts = enroller.options.enroller_steps.contactSearch.contactList;
                    $.each(contacts, function(i, contact) {
                        var listElement = enroller._createContactListItem(contact);
                        cList.append(listElement);
                    });
                } else if (enroller.options.enroller_steps.contactSearch.contactList.length == 1) {
                    enroller._contactAdded(enroller.options.enroller_steps.contactSearch.contactList[0]);
                }
            }
            if (filter.data("prepopulated_list") != true) {
                filter.data("prepopulated_list", false);
                enroller._setupContactSearch(filter);
            }

            cList.listview({
                autodividers: true,
                autodividersSelector: function(li) {
                    if (
                        $(li)
                            .find(".list-surname")
                            .text() === ""
                    ) {
                        return $(li)
                            .find(".list-given-name")
                            .text()
                            .slice(0, 1)
                            .toUpperCase();
                    }
                    return $(li)
                        .find(".list-surname")
                        .text()
                        .slice(0, 1)
                        .toUpperCase();
                }
            });
            cList.listview().listview("refresh");

            /*Top Blurb*/
            var stepOptions = enroller.options.enroller_steps.contactSearch;
            if (stepOptions.BLURB_TOP != null && stepOptions.BLURB_TOP != "") {
                var blurbT = enroller._createBlurb(stepOptions.BLURB_TOP);

                addModeHolder.prepend(blurbT);
            }
            if (stepOptions.HEADER) {
                var headerInfo = {
                    INFO_ONLY: true,
                    TYPE: "header",
                    DISPLAY: stepOptions.HEADER
                };
                $("#contactSearch_step").prepend(
                    enroller._createInfoFieldDetailed("contactSearch_step_header", headerInfo)
                );
            }

            if (stepOptions.BLURB_INNER != null) {
                var blurbI = enroller._createBlurb(stepOptions.BLURB_INNER);

                searchModeHolder.prepend(blurbI);
            }
            /*Bottom Blurb*/
            if (stepOptions.BLURB_BOTTOM != null && stepOptions.BLURB_BOTTOM != "") {
                var blurbB = enroller._createBlurb(stepOptions.BLURB_BOTTOM);
                $("#contactSearch_step").append(blurbB);
            }
        },
        _createContactListItem: function(contact) {
            var preferredName = null;
            var listElement, firstName, surname, organisation;
            listElement = $('<li id="' + contact.CONTACTID + '"></li>');
            if (contact.GIVENNAME == null) {
                contact.GIVENNAME = "";
            }
            if (contact.SURNAME == null) {
                contact.SURNAME = "";
            }
            firstName = $('<span class="list-given-name">' + contact.GIVENNAME + " </span>");

            surname = $('<span class="list-surname">' + contact.SURNAME + "</span>");

            if (contact.PREFERREDNAME == null) {
                contact.PREFERREDNAME = "";
            }

            if (contact.ORGANISATION != null && contact.ORGANISATION != "") {
                if ($(window).width() > 600) {
                    organisation = $('<span class="list-organisation"> - ' + contact.ORGANISATION + "</span>");
                } else {
                    organisation = $('<br/><span class="list-organisation">' + contact.ORGANISATION + "</span>");
                }
            } else {
                organisation = "";
            }
            listElement.on("click", function() {
                enroller._setOption("contact_id", contact.CONTACTID);

                enroller._changeStep(enroller._getNextStep("contactSearch"));
            });

            if (contact.PREFERREDNAME !== undefined) {
                if (!$.isEmptyObject(contact.PREFERREDNAME)) {
                    preferredName = $('<span class="list-preferred">' + contact.PREFERREDNAME + " </span>");
                    firstName = $('<span class="list-given-name"> (' + contact.GIVENNAME + ")</span>");
                }
            }
            if (contact.PREFERREDNAME != null && contact.PREFERREDNAME != "") {
                listElement.prepend(preferredName);
                listElement.append(surname);
                listElement.append(firstName);
            } else {
                listElement.append(firstName);
                listElement.append(surname);
            }

            listElement.append(organisation);

            var hiddenName = $(
                '<span style="display:none;">' +
                    " " +
                    contact.GIVENNAME +
                    " " +
                    contact.SURNAME +
                    " " +
                    contact.ORGANISATION +
                    " " +
                    contact.PREFERREDNAME +
                    " " +
                    contact.SURNAME +
                    " " +
                    contact.ORGANISATION +
                    " " +
                    contact.GIVENNAME +
                    " " +
                    contact.PREFERREDNAME +
                    " " +
                    contact.SURNAME +
                    " " +
                    contact.ORGANISATION +
                    " " +
                    contact.SURNAME +
                    " " +
                    contact.GIVENNAME +
                    "</span>"
            );
            listElement.append(hiddenName);
            listElement.addClass("ui-btn ui-btn-icon-right ui-alt-icon ui-nodisc-icon ui-icon-carat-r");
            return listElement;
        },
        _refreshContactList: function(contacts, searchInput) {
            searchInput = $(searchInput);
            var step = searchInput.closest("div.enroller-step");
            var cList = step.find("div.enroller-contact-list-hold ul");
            cList.empty();

            contacts = enroller._sortContactResults(contacts);

            $.each(contacts, function(i, contact) {
                var record = enroller._createContactListItem(contact);
                cList.append(record);
                enroller._contactAdded(contact);
            });

            cList.listview({
                autodividers: true,
                autodividersSelector: function(li) {
                    if (
                        $(li)
                            .find(".list-surname")
                            .text() === ""
                    ) {
                        return $(li)
                            .find(".list-given-name")
                            .text()
                            .slice(0, 1)
                            .toUpperCase();
                    }
                    return $(li)
                        .find(".list-surname")
                        .text()
                        .slice(0, 1)
                        .toUpperCase();
                }
            });
            cList.listview().listview("refresh");
        },

        /* Contact Search Functions */
        _setupContactSearch: function(searchInput) {
            var enroller = this;
            searchInput = $(searchInput);

            /*delay function to prevent multiple searches being executed*/
            function debounce(fn, delay) {
                var timer = null;
                return function() {
                    var context = this,
                        args = arguments;
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        fn.apply(context, args);
                    }, delay);
                };
            }

            /*Add Input Listner for typing/paste/autofill*/
            searchInput.on(
                "input",
                debounce(function(event) {
                    var searchTerm = searchInput.val();
                    var time = new Date();
                    var makeCall = true;
                    if ($(searchInput).data("last_search") != null) {
                        if (searchTerm == $(searchInput).data("last_search")) {
                            makeCall = false;
                        }
                    }
                    if (makeCall) {
                        var searchParams = { search: searchTerm };
                        enroller._getContacts(searchParams, time, searchInput);
                    }
                }, 1000)
            );
            /*Add Input Listener for Enter Key*/
            searchInput.keypress(function(event) {
                var searchTerm = searchInput.val();
                if (event.which == 13) {
                    var time = new Date();
                    var searchParams = { search: searchTerm };
                    enroller._getContacts(searchParams, time, searchInput);
                }
            });
        },
        _getContacts: function(searchParams, time, searchInput) {
            var axToken = null;

            /*Verify that we have an AXTOKEN for the user in order to use with the contact searches. If we don't then we can't search*/
            var axTokenAll = enroller.element.data("USER_AX_TOKEN");
            var loginStepComplete = $("#userLogin_menu_link").hasClass("complete");
            if (axTokenAll == null) {
                if (!loginStepComplete) {
                    enroller._alert(
                        "Contact Searching is not available without logging in. Please ensure that you login before searching."
                    );
                } else {
                    /*User has selected the "New Student Tab*/
                }
            } else {
                /*if the user is a learner then do not do the search. They should still be able to add contacts and select them*/
                if (axTokenAll.ROLETYPEID != enroller.LEARNER_ID) {
                    axToken = axTokenAll.AXTOKEN;
                    enroller.options.search_contacts(
                        searchParams,
                        function(results) {
                            /*
						 * check when the search was initiated. 
						 * If it was initiated after an earlier request, but took more time then ignore
						 * */
                            var requestTime = $(searchInput).data("request_time");
                            if (requestTime == null) {
                                requestTime = new Date();
                                requestTime.setMinutes(requestTime.getMinutes() - 5);
                            }
                            if (requestTime != null) {
                                requestTime = new Date(requestTime);
                                if (time > requestTime) {
                                    $(searchInput).data("last_search", searchParams.search);
                                    $(searchInput).data("request_time", time);

                                    enroller._refreshContactList(results, searchInput);
                                }
                            }
                        },
                        axToken
                    );
                } else {
                    /*set the contact list to empty array - as it may be null*/
                    enroller.options.enroller_steps.contactSearch.contactList = [];
                }
            }
        },

        _sortContactResults: function(results) {
            results.sort(function(a, b) {
                aSurname = a.SURNAME === "" ? a.GIVENNAME.toUpperCase() : a.SURNAME.toUpperCase();
                bSurname = b.SURNAME === "" ? b.GIVENNAME.toUpperCase() : b.SURNAME.toUpperCase();
                if (aSurname < bSurname) return -1;
                if (aSurname > bSurname) return 1;
                return 0;
            });
            return results;
        },

        /* COURSE_SEARCH_STEP */

        _displayCourseSearch: function() {
            var courseOptions = enroller.options.enroller_steps.courses;
            var terminologyOverride = enroller.options.enroller_steps.courses.COURSE_TYPES != null;
            var qualificationName = "Qualifications";
            var workshopName = "Workshops";
            var eLearningName = "eLearning";
            var courseTypeHolder = $('<div class="enroller-course-selector-holder"></div>');

            var courseTypeSelectParams = {
                DISPLAY: enroller.options.course_terminology + " Type",
                VALUES: [
                    {
                        DISPLAY: "Qualifications",
                        VALUE: "p"
                    },
                    {
                        DISPLAY: "Workshops",
                        VALUE: "w"
                    },
                    {
                        DISPLAY: "E Learning",
                        VALUE: "el"
                    }
                ],
                TYPE: "select"
            };

            var qualFound = false;
            var workshopFound = false;
            var elFound = false;
            if (terminologyOverride) {
                courseTypeSelectParams.VALUES = enroller.options.enroller_steps.courses.COURSE_TYPES;
                $.each(courseTypeSelectParams.VALUES, function(i, courseType) {
                    if (courseType.VALUE == "p") {
                        qualFound = true;
                        qualificationName = courseType.DISPLAY;
                    } else if (courseType.VALUE == "w") {
                        workshopName = courseType.DISPLAY;
                        workshopFound = true;
                    } else if (courseType.value == "el") {
                        eLearningName = courseType.DISPLAY;
                        elFound = true;
                    }
                });
            }

            var courseTypeSelector = enroller._createInputField("courseType", courseTypeSelectParams);
            $("#courses_step").prepend(courseTypeHolder);

            courseTypeSelector.find("select").on("change", function(e) {
                var selectedType = $(this).val();
                if (selectedType == "w") {
                    $(".enroller-qualifications").hide();
                    $(".enroller-workshoptypes").show();
                    $(".enroller-locations").show();
                } else if (selectedType == "p") {
                    $(".enroller-qualifications").show();
                    $(".enroller-workshoptypes").hide();
                    $(".enroller-locations").hide();
                } else {
                    $(".enroller-qualifications").hide();
                    $(".enroller-workshoptypes").hide();
                    $(".enroller-locations").hide();
                }
            });

            courseTypeHolder.append(courseTypeSelector);

            if (!enroller.options.add_course_selector) {
                courseTypeHolder.hide();
            }

            if (enroller.options.selects_as_chosens) {
                courseTypeSelector.find("select").attr({
                    "data-enhance": false,
                    "data-role": "none"
                });
            }
            if (workshopFound) {
                courseTypeSelector.find("select").val("w");
            } else if (qualFound) {
                courseTypeSelector.find("select").val("p");
            } else if (elFound) {
                courseTypeSelector.find("select").val("el");
            }

            if (enroller.options.selects_as_chosens) {
                courseTypeSelector
                    .find("select")
                    .trigger("chosen:updated")
                    .trigger("change");
            } else {
                courseTypeSelector
                    .find("select")
                    .selectmenu()
                    .selectmenu("refresh")
                    .trigger("change");
            }

            courseOptions.retrieveQualificationsList(function(qualList) {
                var qualListParam = {
                    DISPLAY: qualificationName,
                    VALUES: qualList,
                    TYPE: "search-select"
                };
                var qualListField = enroller._createInputField("qualList", qualListParam);
                qualListField.addClass("enroller-qualifications");
                qualListField.insertAfter(courseTypeSelector);
                qualListField.find("select").val("");
                $("#courses_step").enhanceWithin();
                enroller._displaySetupChosens("courses");
            });
            courseOptions.retrieveWorkshopTypesList(function(workshopList) {
                var workshopListFieldParam = {
                    DISPLAY: workshopName,
                    VALUES: workshopList,
                    TYPE: "search-select"
                };
                var workshopListField = enroller._createInputField("workshopList", workshopListFieldParam);
                workshopListField.addClass("enroller-workshoptypes");
                workshopListField.insertAfter(courseTypeSelector);
                workshopListField.hide();
                workshopListField.find("select").val("");
                $("#courses_step").enhanceWithin();
                enroller._displaySetupChosens("courses");
            });

            if (enroller.options.location_filter) {
                courseOptions.get_locations(function(locations) {
                    var locArray = [];
                    if (locations != null) {
                        $.each(locations, function(i, location) {
                            var temp = { DISPLAY: location, VALUE: location };
                            locArray.push(temp);
                        });
                        var locListParam = {
                            DISPLAY: "Location",
                            VALUES: locArray,
                            TYPE: "search-select"
                        };
                        var locList = enroller._createInputField("locations", locListParam);
                        locList.addClass("enroller-locations");
                        locList.insertAfter(courseTypeSelector);
                        if (enroller.options.add_course_selector) {
                            locList.hide();
                        }
                        locList.find("select").val("");
                        $("#courses_step").enhanceWithin();
                        enroller._displaySetupChosens("courses");
                    }
                });
            }

            /*CLIENT COURSE FILTERING*/
            if (enroller.options.client_course_filter) {
                var filterOptions = {
                    DISPLAY: "Organisation Courses",
                    TYPE: "select",
                    VALUES: [
                        { DISPLAY: "Show Organisation Courses", VALUE: "inhouse_show" },
                        { DISPLAY: "Show Public Courses", VALUE: "inhouse_hide" }
                    ]
                };
                var clientFilter = enroller._createInputField("clientFilter", filterOptions);
                clientFilter.insertAfter(courseTypeSelector);

                clientFilter.find("select").on("change", function(e) {
                    var selectedFilter = $(this).val();

                    if ((selectedFilter = "inhouse_show")) {
                        enroller.element.find("#courseDataTable").data("inhouse_only", true);
                    } else {
                        enroller.element.find("#courseDataTable").data("inhouse_only", false);
                    }
                });
                enroller._updateInputValue(clientFilter.find("select"), "inhouse_show");
            }

            var controls = enroller._displayCourseInstanceSearchControls();
            $("#courses_step").append(controls);
            $("#courseSearchSubmit").on("click", function(e) {
                $("#courseDataTableHolder").remove();
                enroller._displayCourseInstanceSearch(false);
            });
            $("#courses_step").keyup(function(event) {
                if (event.which === 13) {
                    $("#courseDataTableHolder").remove();
                    enroller._displayCourseInstanceSearch(false);
                }
            });

            $("#courses_step").enhanceWithin();

            if (courseOptions.BLURB_TOP != null) {
                var blurbT = enroller._createBlurb(courseOptions.BLURB_TOP);

                $("#courses_step").prepend(blurbT);
            }
            if (courseOptions.HEADER) {
                var headerInfo = {
                    INFO_ONLY: true,
                    TYPE: "header",
                    DISPLAY: courseOptions.HEADER
                };
                $("#courses_step").prepend(enroller._createInfoFieldDetailed("courses_step_header", headerInfo));
            }
        },
        _initiateCourseSearch: function() {
            enroller._updateCourseSearchSelects();

            if ($("#courseDataTableHolder").length) {
                $("#courseSearchSubmit").trigger("click");
            } else {
                enroller._displayCourseInstanceSearch(true);
            }
        },

        _updateCourseSearchSelects: function() {
            var course = enroller.options.course;

            if (course != null) {
                if (course.TYPE != null) {
                    if (course.ID != null) {
                        if (course.TYPE == "w") {
                            if (enroller.options.selects_as_chosens) {
                                $("#courseType")
                                    .trigger("chosen:updated")
                                    .trigger("change");
                            }
                            if (parseInt(course.ID) > 0) {
                                $("#courseType").val("w");
                                $("#workshopList").val(course.ID);
                                if (enroller.options.selects_as_chosens) {
                                    $("#workshopList").trigger("chosen:updated");
                                }
                            }
                        } else if (course.TYPE == "p") {
                            if (enroller.options.selects_as_chosens) {
                                $("#courseType")
                                    .trigger("chosen:updated")
                                    .trigger("change");
                            }
                            if (parseInt(course.ID) > 0) {
                                $("#courseType").val("p");
                                $("#qualList").val(course.ID);
                                if (enroller.options.selects_as_chosens) {
                                    $("#qualList").trigger("chosen:updated");
                                }
                            }
                        } else if (course.TYPE == "el") {
                            $("#courseType").val("el");
                            if (enroller.options.selects_as_chosens) {
                                $("#courseType")
                                    .trigger("chosen:updated")
                                    .trigger("change");
                            }
                        }
                    }
                }
            }
        },

        _displayCourseInstanceSearch: function(initial) {
            var courseOptions = enroller.options.enroller_steps.courses;
            var continueSearch = true;
            if ($("#courseDataTableHolder").length) {
                $("#courseDataTableHolder").remove();
            }
            $("#courses_step").append('<div id="courseDataTableHolder" />');

            var searchParams = enroller._getCourseSearchParams(initial);

            /* Override for user based searching. Uses the user AX Token
			 * If the user is a Client User then it will use OrgID and Everything Param.
			 */
            if (enroller.options.user_course_search == true) {
                var axTokenAll = enroller.element.data("USER_AX_TOKEN");
                if (axTokenAll != null) {
                    searchParams.AXTOKEN = axTokenAll.AXTOKEN;
                    if (axTokenAll.ROLETYPEID == enroller.CLIENT_ID) {
                        var searchAsOrg = true;
                        if (enroller.options.client_course_filter == true) {
                            if (enroller.element.find("#clientFilter").length) {
                                var showInhouse = enroller.element.find("#clientFilter").val();
                                if (showInhouse == "inhouse_show") {
                                    searchAsOrg = true;
                                } else {
                                    searchAsOrg = false;
                                }
                            }
                        }
                        if (searchAsOrg) {
                            var userContactData = enroller.element.data("user_contact_data");
                            if (userContactData != null) {
                                if (userContactData.ORGID != null) {
                                    searchParams.orgIDTree = userContactData.ORGID;
                                    searchParams.everything = 1;
                                }
                            } else {
                                continueSearch = false;
                                enroller._confirmContactIsInAccount(axTokenAll.CONTACTID, function(contactData) {
                                    enroller.element.data("user_contact_data", contactData);
                                    enroller._displayCourseInstanceSearch(initial);
                                });
                            }
                        } else {
                            searchParams.PUBLIC = 1;
                        }
                    } else if (
                        axTokenAll.ROLETYPEID == enroller.AGENT_ID ||
                        axTokenAll.ROLETYPEID == enroller.ADMIN_ID
                    ) {
                        searchParams.everything = 1;
                    } else {
                        searchParams.PUBLIC = 1;
                    }
                } else {
                    searchParams.PUBLIC = 1;
                }
            } else {
                searchParams.PUBLIC = 1;
            }

            // DOMAINS WP-366

            if (enroller.options.domain_filter != null) {
                searchParams.domain_filter = enroller.options.domain_filter;
            }
            if (enroller.options.domain_filter_exclude != null) {
                searchParams.domain_filter_exclude = enroller.options.domain_filter_exclude;
            }
            if (enroller.options.show_no_domain != null) {
                searchParams.show_no_domain = enroller.options.show_no_domain;
            }

            if (continueSearch) {
                enroller.options.search_courses(searchParams, function(courseData) {
                    if (initial) {
                        enroller._updateCourseSearchSelects();
                    }
                    $("#courseDataTableHolder").append('<table id="courseDataTable" />');
                    /* Insert check here to detect the width of the table and hide columns as needed*/
                    /* Add additional columns and adjust "priority"*/
                    var columns = [];
                    if (courseOptions.COLUMNS != null) {
                        columns = courseOptions.COLUMNS;
                        $.each(columns, function(index, columnData) {
                            if (columnData.data == "COURSENAME") {
                                columnData.title = enroller.options.course_terminology;
                                columnData.className = columnData.className + " left-align";
                            } else if (columnData.data == "NAME") {
                                columnData.title = enroller.options.instance_terminology;
                                columnData.className = columnData.className + " left-align";
                            } else if (columnData.data == "DISPLAYPRICE") {
                                columnData.title = enroller.options.cost_terminology;
                                columnData.className = columnData.className + " right-align";
                                if (enroller.options.hide_cost_fields) {
                                    columnData.visible = false;
                                }
                            }
                        });
                    } else {
                        columns = [
                            {
                                title: "Code",
                                data: "CODE",
                                className: "priority-4"
                            },
                            {
                                title: enroller.options.course_terminology,
                                data: "COURSENAME",
                                className: "priority-1 left-align"
                            },
                            {
                                title: enroller.options.instance_terminology,
                                data: "NAME",
                                className: "priority-4 left-align"
                            },

                            {
                                title: "Start Date",
                                data: "STARTDATE",
                                orderData: 4,
                                className: "priority-3"
                            },
                            {
                                title: "Start_Date_SORT",
                                data: "STARTDATE_SORT",
                                visible: false,
                                className: "priority-0"
                            },
                            {
                                title: "Finish Date",
                                data: "FINISHDATE",
                                orderData: 6,
                                className: "priority-4"
                            },
                            {
                                title: "Finish_Date_SORT",
                                data: "FINISHDATE_SORT",
                                visible: false,
                                className: "priority-0"
                            },
                            {
                                title: "Location",
                                data: "LOCATION",
                                className: "priority-3"
                            },
                            {
                                title: "InstanceID",
                                data: "INSTANCEID",
                                visible: false,
                                className: "priority-0"
                            },
                            {
                                title: "Vacancy",
                                data: "PARTICIPANTVACANCY",
                                className: "priority-2"
                            },
                            {
                                title: enroller.options.cost_terminology,
                                data: "DISPLAYPRICE",
                                className: "priority-1 right-align",
                                visible: enroller.options.hide_cost_fields != true
                            },

                            {
                                title: "Select",
                                data: "SELECT",
                                className: "priority-1"
                            },
                            {
                                title: "Public",
                                data: "PUBLIC",
                                visible: false,
                                className: "priority-0"
                            }
                        ];
                    }

                    var courseLookup = {};
                    $.each(courseData, function(i, instance) {
                        instance = enroller._modifyInstanceData(instance);
                        courseLookup[instance.INSTANCEID] = instance;
                    });

                    $("#courses_step").data("currentCourses", courseLookup);
                    var courseTable = $("#courseDataTable").DataTable({
                        data: courseData,
                        columns: columns,
                        createdRow: function(row, data, index) {
                            if (!enroller.options.allow_mixed_inhouse_public) {
                                var allowPublicInhouse = enroller.element.data("allow_public_inhouse");
                                if (allowPublicInhouse != null) {
                                    if (data.TYPE == "w" && data.PUBLIC == 0 && allowPublicInhouse != "inhouse") {
                                        $(row).addClass("enroller-course-disallowed");
                                    } else if (allowPublicInhouse == "inhouse") {
                                        $(row).addClass("enroller-course-disallowed");
                                    }
                                }
                            }
                        }
                    });

                    if (courseOptions.BLURB_BOTTOM != null && courseOptions.BLURB_BOTTOM != "") {
                        var blurbB = enroller._createBlurb(courseOptions.BLURB_BOTTOM);
                        $("#courseDataTableHolder").append(blurbB);
                    }
                    $("#courseDataTable").on("click", "a", function(e) {
                        var link = $(this);

                        var allowPublicInhouse = enroller.element.data("allow_public_inhouse");
                        /*false is restricted to public*/

                        if (enroller.options.allow_mixed_inhouse_public) {
                            enroller._setOption("course", {
                                INSTANCEID: link.data("instanceid"),
                                TYPE: link.data("coursetype"),
                                ID: link.data("courseid")
                            });

                            enroller.element.data(
                                "selected_instance",
                                $("#courses_step").data("currentCourses")[link.data("instanceid")]
                            );

                            enroller._setOption("cost", enroller.element.data("selected_instance").COST);

                            enroller._changeStep(enroller._getNextStep("courses"));
                        } else if (allowPublicInhouse == "inhouse") {
                            if (link.data("coursetype") == "w" && link.data("public") == 0) {
                                enroller._setOption("course", {
                                    INSTANCEID: link.data("instanceid"),
                                    TYPE: link.data("coursetype"),
                                    ID: link.data("courseid")
                                });

                                enroller.element.data(
                                    "selected_instance",
                                    $("#courses_step").data("currentCourses")[link.data("instanceid")]
                                );

                                enroller._setOption("cost", enroller.element.data("selected_instance").COST);

                                enroller._changeStep(enroller._getNextStep("courses"));
                            } else {
                                enroller._alert(
                                    "You have previously selected a Organisation Inhouse (Group Priced) Workshop for enrolment.<br/><br/>Complete enrolment into this course before attempting to enrol into public instances."
                                );
                            }
                        } else if (allowPublicInhouse == "public") {
                            if (link.data("coursetype") == "w" && link.data("public") == 0) {
                                enroller._alert(
                                    "You have previously selected a Public Course for enrolment.<br/><br/>Complete enrolment into this course before attempting to enrol into Organisation Inhouse (Group Priced) Workshop instances."
                                );
                            } else {
                                enroller._setOption("course", {
                                    INSTANCEID: link.data("instanceid"),
                                    TYPE: link.data("coursetype"),
                                    ID: link.data("courseid")
                                });

                                enroller.element.data(
                                    "selected_instance",
                                    $("#courses_step").data("currentCourses")[link.data("instanceid")]
                                );

                                enroller._setOption("cost", enroller.element.data("selected_instance").COST);

                                enroller._changeStep(enroller._getNextStep("courses"));
                            }
                        } else {
                            if (link.data("coursetype") == "w" && link.data("public") == 0) {
                                allowPublicInhouse = "inhouse";
                            } else {
                                allowPublicInhouse = "public";
                            }
                            enroller.element.data("allow_public_inhouse", allowPublicInhouse);

                            enroller._setOption("course", {
                                INSTANCEID: link.data("instanceid"),
                                TYPE: link.data("coursetype"),
                                ID: link.data("courseid")
                            });

                            enroller.element.data(
                                "selected_instance",
                                $("#courses_step").data("currentCourses")[link.data("instanceid")]
                            );

                            enroller._setOption("cost", enroller.element.data("selected_instance").COST);

                            enroller._changeStep(enroller._getNextStep("courses"));
                        }
                    });
                    $(window).trigger("resize");
                    $(".dataTables_length, .dataTables_filter").hide();
                });
            }
        },
        _getCourseSearchParams: function(initial) {
            var courseOptions = enroller.options.enroller_steps.courses;
            var step = $("#courses_step");

            var params = {};
            if (initial) {
                params.type = "p";

                params.startDate_min = enroller._dateTransform(new Date().setMonth(new Date().getMonth() - 12));
                params.finishDate_min = enroller._dateTransform(new Date());
                params.startDate_max = enroller._dateTransform(new Date().setMonth(new Date().getMonth() + 72));
                params.finishDate_max = enroller._dateTransform(new Date().setMonth(new Date().getMonth() + 72));
                if (enroller.options.course != null) {
                    if (enroller.options.course.TYPE != null) {
                        params.type = enroller.options.course.TYPE;
                    }
                    if (enroller.options.course.ID != null) {
                        if (parseInt(enroller.options.course.ID) > 0) {
                            params.ID = enroller.options.course.ID;
                        } else {
                            var type = $("#courseType").val();

                            if (type != null && type != "") {
                                params.type = type;
                            }
                        }
                    }
                    if (enroller.options.course.INSTANCEID != null) {
                        if (parseInt(enroller.options.course.INSTANCEID) > 0) {
                            params.INSTANCEID = enroller.options.course.INSTANCEID;
                        }
                    }
                }
            } else {
                var datesOverridden = false;
                if ($("#startDate").val() !== "" && $("#startDate").val() != null) {
                    params.startDate_min = $("#startDate").val();
                    params.finishDate_min = $("#startDate").val();
                    datesOverridden = true;
                } else {
                    params.startDate_min = enroller._dateTransform(new Date().setMonth(new Date().getMonth() - 12));
                    params.finishDate_min = enroller._dateTransform(new Date());
                }
                if ($("#finishDate").val() !== "" && $("#finishDate").val() != null) {
                    params.startDate_max = $("#finishDate").val();
                    params.finishDate_max = $("#finishDate").val();
                    datesOverridden = true;
                } else {
                    params.startDate_max = enroller._dateTransform(new Date().setMonth(new Date().getMonth() + 72));
                    params.finishDate_max = enroller._dateTransform(
                        new Date().setMonth(new Date().getMonth() + 72)
                    );
                }
                params.type = $("#courseType").val();
                if (params.type == "w") {
                    if ($("#workshopList").val() !== "" && $("#workshopList").val() !== null) {
                        params.ID = $("#workshopList").val();
                    }
                    /*set a shorter date range for workshops*/
                    if (!datesOverridden) {
                        params.startDate_min = enroller._dateTransform(
                            new Date().setMonth(new Date().getMonth() - 1)
                        );
                        params.finishDate_min = enroller._dateTransform(new Date());
                        params.startDate_max = enroller._dateTransform(
                            new Date().setMonth(new Date().getMonth() + 3)
                        );
                        params.finishDate_max = enroller._dateTransform(
                            new Date().setMonth(new Date().getMonth() + 6)
                        );
                    }
                } else if (params.type == "p") {
                    if ($("#qualList").val() !== "" && $("#qualList").val() !== null) {
                        params.ID = $("#qualList").val();
                    }
                } else if (params.type == "el") {
                } else {
                    params.type = "all";
                }
                if ($("#courseSearchBox").val() !== "") {
                    params.NAME = $("#courseSearchBox").val();
                }
            }

            if (enroller.options.training_category != null && enroller.options.training_categroy != "") {
                params.trainingCategory = enroller.options.training_category;
            }

            if (
                enroller.options.venue_restriction != null &&
                enroller.options.venue_restriction != "" &&
                params.type == "w"
            ) {
                params.venueContactID = enroller.options.venue_restriction;
            }
            if (
                enroller.options.delivery_location_restriction != null &&
                enroller.options.delivery_location_restriction != "" &&
                params.type == "p"
            ) {
                params.deliveryLocationID = enroller.options.delivery_location_restriction;
            }
            /*combine check for location restriction and location filter*/
            if (
                enroller.options.location_restriction != null &&
                enroller.options.location_restriction != "" &&
                params.type == "w"
            ) {
                params.location = enroller.options.location_restriction;
            } else if (enroller.options.location_filter && params.type == "w") {
                params.location = $("#locations").val();
            }
            return params;
        },
        _displayCourseInstanceSearchControls: function() {
            var controlHolder = $(
                '<div data-role="controlgroup" data-mini="false" data-type="horizontal" class="enroller-field-holder" />'
            );
            controlHolder.attr("id", "courseSearchControls").addClass("enroller-search-course-controls");

            var searchBox = $(
                '<input type="search" id="courseSearchBox" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="Search ' +
                    enroller.options.course_terminology +
                    's" />'
            );

            controlHolder.append(searchBox);

            var searchButton = $(
                '<a id="courseSearchSubmit" data-role="button" class="ui-btn-active ui-icon-search">Search</a>'
            );

            controlHolder.append(searchButton);

            if (enroller.options.advanced_course_seach) {
                var collapseDiv = $(
                    '<div data-role="collapsible" class="enroller-course-adv-search" data-collapsed="true" data-corners="true" />'
                );

                collapseDiv
                    .css("float", "left")
                    .css("clear", "none")
                    .css("margin", 0);
                collapseDiv.append("<h6>Advanced</h6>");

                var advancedHolder = $(
                    '<div data-role="controlgroup" data-mini="false" data-type="horizontal" class="enroller-field-holder enroller-course-advanced"/>'
                );

                collapseDiv.append(advancedHolder);

                var startDateField = { DISPLAY: "Start Date", TYPE: "date" };
                var finishDateField = { DISPLAY: "Finish Date", TYPE: "date" };
                advancedHolder.append(enroller._createInputField("startDate", startDateField));
                advancedHolder.append(enroller._createInputField("finishDate", finishDateField));

                var collapseHolder = enroller._createInformationField("Advanced Options", "placeholder");
                collapseHolder.find("div.enroller-text-field").remove();
                collapseHolder
                    .find("div.enroller-field-label")
                    .css("background", "transparent")
                    .css("border", "none");
                collapseHolder.append(collapseDiv);

                return [collapseHolder, controlHolder];
            } else {
                return controlHolder;
            }
        },
        _modifyInstanceData: function(instance) {
            /*instance.NAME = '<a data-coursetype="'+ instance.TYPE + '" data-courseid="'+ instance.ID + '" data-instanceid="'+ instance.INSTANCEID + '" data-public="'+ instance.PUBLIC +'">' + instance.NAME + '</a>';*/
            instance.SELECT =
                '<a class="ui-btn enroller-course-select ui-shadow ui-btn-icon-right ui-alt-icon ui-nodisc-icon ui-icon-carat-r ui-mini" data-coursetype="' +
                instance.TYPE +
                '" data-public="' +
                instance.PUBLIC +
                '" data-courseid="' +
                instance.ID +
                '" data-instanceid="' +
                instance.INSTANCEID +
                '">Select</a>';

            if (instance.COURSENAME == null) {
                instance.COURSENAME = instance.NAME;
            }
            if (instance.STARTDATE != null) {
                instance.STARTDATE_SORT = instance.STARTDATE;
                instance.STARTDATE = enroller._dateShortFormat(new Date(instance.STARTDATE.replace(/-/g, "/")));
            } else {
                instance.STARTDATE_SORT = "";
                instance.STARTDATE = "";
            }

            if (instance.FINISHDATE != null) {
                instance.FINISHDATE_SORT = instance.FINISHDATE;
                instance.FINISHDATE = enroller._dateShortFormat(new Date(instance.FINISHDATE.replace(/-/g, "/")));
            } else {
                instance.FINISHDATE_SORT = instance.FINISHDATE;
                instance.FINISHDATE = "";
            }
            if (instance.COST !== null) {
                instance.DISPLAYPRICE = enroller._currencyDisplayFormat(instance.COST);
            } else {
                instance.DISPLAYPRICE = "Not Set";
            }

            if (instance.TYPE == "p") {
                instance.PARTICIPANTVACANCY = "-";
                instance.LOCATION = "-";
            }

            if (instance.TYPE != "w") {
                if (instance.STARTDATE != null && instance.STARTDATE != "") {
                    var datesDisplay = instance.STARTDATE;
                    if (instance.STARTDATE == instance.FINISHDATE) {
                        datesDisplay = instance.STARTDATE;
                    } else if (instance.FINISHDATE != null && instance.FINISHDATE != "") {
                        datesDisplay = datesDisplay + " - " + instance.FINISHDATE;
                    }
                    instance.DATESDISPLAY = datesDisplay;
                }
            } else {
                instance.DATESDISPLAY = instance.DATEDESCRIPTOR;
            }
            return instance;
        },

        /* PORTFOLIO_STEP*/

        /*
		 * Creates/Displays the portfolio step. Not pregenerated, only available if contact_id is set.
		 * @param {string} stepID - The ID of the step to load.
		 * */
        _displayPortfolioStep: function(stepID) {
            var step = $("#" + stepID + "_step");
            if (step.length) {
                step.empty();
            }
            var params = {};
            step.append($('<div class="enroller-portfolio-holder"></div>'));

            var checklist;
            var checklistSettings = enroller.options.enroller_steps[stepID];

            if (step.data("checklist") != null) {
                checklist = step.data("checklist");
                var buttonText =
                    checklistSettings.BUTTON_TEXT != null
                        ? checklistSettings.BUTTON_TEXT != ""
                            ? checklistSettings.BUTTON_TEXT
                            : "Continue"
                        : "Continue";
                var continueButton = $(
                    '<button class="enroller-save-button ui-btn-icon-right ui-icon-arrow-r ui-btn ui-disabled ui-btn-active" style="border-radius:.3em" data-role="button">' +
                        buttonText +
                        "</button>"
                );
                continueButton.on("click", function() {
                    var next = enroller._getNextStep(stepID);
                    if (enroller.stepSelectable(next)) {
                        enroller._changeStep(next);
                    } else {
                        if (enroller.options.step_order.indexOf("review")) {
                            enroller._changeStep("review");
                        }
                    }
                });

                var checklistPoints = enroller._createPortfolioPointsUI(checklist);
                step.prepend(checklistPoints);
                var holder = $('<div class="enroller-portfolio-head"/>');
                step.find(".enroller-portfolio-holder").prepend(holder);

                if (checklistSettings.HEADER && checklistSettings.HEADER != "") {
                    var headerInfo = {
                        INFO_ONLY: true,
                        TYPE: "header",
                        DISPLAY: checklistSettings.HEADER
                    };
                    enroller._createInfoFieldDetailed("step_header", headerInfo).insertAfter(holder);
                }
                checklistPoints.append(continueButton);

                if (checklistSettings.BLURB_TOP != null) {
                    var blurbT = enroller._createBlurb(checklistSettings.BLURB_TOP);
                    holder.prepend(blurbT);
                }

                if (checklistSettings != null) {
                    if (checklistSettings.ISCRICOS == true || checklistSettings.ISCRICOS == "1") {
                        params = {
                            contactID: enroller.options.contact_id,
                            isCRICOS: true
                        };
                    } else if (checklistSettings.PORTFOLIOCHECKLISTID != null) {
                        params = {
                            contactID: enroller.options.contact_id,
                            portfolioChecklistID: checklistSettings.PORTFOLIOCHECKLISTID
                        };
                    }
                    enroller.options.get_portfolio_contact(params, function(data) {
                        if (data != null) {
                            if (data[0] != null) {
                                $.each(data, function(i, portfolioItem) {
                                    if (portfolioItem.PORTFOLIOID == 0) {
                                        portfolioItem.PORTFOLIOID = "_" + i;
                                    }
                                    var pItem = enroller._createPortfolioItemUI(portfolioItem, stepID);
                                    step.find(".enroller-portfolio-holder").append(pItem);
                                });
                                enroller._displaySetupChosens(stepID);
                                enroller._setupPortfolioDataTables(stepID);

                                step.enhanceWithin();
                            }
                        }
                    });
                }
            } else {
                /*get Checklist*/
                /*retrigger step*/
                if (checklistSettings != null) {
                    if (checklistSettings.ISCRICOS == true || checklistSettings.ISCRICOS == "1") {
                        params.isCricos = true;
                    } else if (checklistSettings.PORTFOLIOCHECKLISTID != null) {
                        params.portfolioChecklistID = checklistSettings.PORTFOLIOCHECKLISTID;
                    }
                }
                enroller.options.get_portfolio_checklist(params, function(checklist) {
                    if (checklist.ERROR == true) {
                        step.data("completed", true);
                        var messageDiv = $('<div style="padding: 2em"></div>');
                        messageDiv.append(
                            "There was an issue retrieving the Required Document Checklist - The step has been marked as complete."
                        );
                        step.append(messageDiv);
                        enroller._updateStepButtons();
                    } else {
                 
                        step.data("checklist", checklist);
                        $.each(checklist.TYPES, function(i, type) {
                            step.data("portfolio_type_" + type.PORTFOLIOTYPEID, false);
                            step.data("portfolio_type_" + type.PORTFOLIOTYPEID + "_value", type.POINTS);
                        });
                        enroller._displayPortfolioStep(stepID);
                    }
                });
            }

            /*Top Blurb*/

            /*Bottom Blurb*/
            if (checklistSettings.BLURB_BOTTOM != null && checklistSettings.BLURB_BOTTOM != "") {
                var blurbB = enroller._createBlurb(checklistSettings.BLURB_BOTTOM);
                step.append(blurbB);
            }
        },
        _createPortfolioPointsUI: function(portfolioChecklist) {
            //var points = enroller._createInformationField("Points", 0);
            if (parseInt(portfolioChecklist.POINTSREQUIRED) > 0) {
                var points = enroller._createBlurb(
                    "You are required to upload " +
                        portfolioChecklist.POINTSREQUIRED +
                        " points of documentation / evidence.<br/>" +
                        'You currently have <span class="points_holder">0/' +
                        portfolioChecklist.POINTSREQUIRED +
                        "</span>"
                );
                points.attr("id", "checklist_" + portfolioChecklist.PORTFOLIOCHECKLISTID);
                return points.addClass("points ui-icon-required").removeClass("ui-icon-info");
            } else {
                var points = enroller._createBlurb(
                    "You are required to upload all the listed items of documentation / evidence.<br/>"
                );
                points.attr("id", "checklist_" + portfolioChecklist.PORTFOLIOCHECKLISTID);
                return points.addClass("points ui-icon-required").removeClass("ui-icon-info");
            }
        },
        _updatePortfolioPoints: function(stepID, portfolioTypeID) {
            var step = $("#" + stepID + "_step");

            var checklist = step.data("checklist");
      
            var complete = true;
            var points = 0;
            $.each(checklist.TYPES, function(i, type) {
                if (step.data("portfolio_type_" + type.PORTFOLIOTYPEID)) {
                    points += type.POINTS;
                } else {
                    complete = false;
                }
            });
            var pointsHolder = $("#checklist_" + checklist.PORTFOLIOCHECKLISTID);
            if (parseInt(checklist.POINTSREQUIRED) > 0) {
                pointsHolder.find(".points_holder").text(points + "/" + checklist.POINTSREQUIRED);
                if (points >= checklist.POINTSREQUIRED) {
                    pointsHolder.removeClass("ui-icon-required").addClass("ui-icon-check complete");
                    pointsHolder.find(".ui-disabled").removeClass("ui-disabled");
                    step.data("completed", true);
                    enroller._updateStepButtons();
                }
            } else {
                if (complete) {
                    pointsHolder.removeClass("ui-icon-required").addClass("ui-icon-check complete");
                    pointsHolder.find(".ui-disabled").removeClass("ui-disabled");
                    step.data("completed", true);
                    enroller._updateStepButtons();
                }
            }
        },
        _createPortfolioItemUI: function(portfolioItem, stepID) {
            var step = $("#" + stepID + "_step");

            var stepSettings = enroller.options.enroller_steps[stepID];
            var pointValue = 0;
            pointValue = step.data("portfolio_type_" + portfolioItem.PORTFOLIOTYPEID + "_value");

            var portfolioUI = $('<form method="post" enctype="multipart/form-data"></form>');
            portfolioUI.data("portfolioID", portfolioItem.PORTFOLIOID);
            portfolioUI.data("portfolioTypeID", portfolioItem.PORTFOLIOTYPEID);
            portfolioUI.attr("id", portfolioItem.PORTFOLIOID);
            portfolioUI.data("contactID", portfolioItem.CONTACTID);

            portfolioUI.append(
                enroller._createInfoFieldDetailed("Name", {
                    DISPLAY: portfolioItem.PORTFOLIOTYPENAME,
                    TYPE: "information"
                })
                //enroller._createInformationField("Name", portfolioItem.PORTFOLIOTYPENAME)
            );
            var type = portfolioItem.PORTFOLIOTYPE.toLowerCase();
            var PREFIX = "";
            switch (type) {
                case "qualification":
                    PREFIX = "QUAL_";
                    break;
                case "registration":
                    PREFIX = "REG_";
                    break;
                case "membership":
                    PREFIX = "MEMBER_";
                    break;
                case "licence":
                    PREFIX = "LICENCE_";
                    break;
                case "other":
                default:
                    PREFIX = "OTHER_";
                    break;
            }

            if (stepSettings[PREFIX + "TYPE"] != false) {
                portfolioUI.append(enroller._createInformationField("Type", portfolioItem.PORTFOLIOTYPE));
            }

            if (stepSettings[PREFIX + "VALUE"] != false && pointValue != 0) {
                portfolioUI.append(enroller._createInformationField("Point Value", pointValue));
            }
            if (stepSettings[PREFIX + "NUMBER"] != false) {
                portfolioUI.append(
                    enroller
                        ._createInputField(portfolioItem.PORTFOLIOID + "_NUMBER", {
                            DISPLAY: "Number",
                            TYPE: "text"
                        })
                        .attr("name", "NUMBER")
                );
            }

            if (stepSettings[PREFIX + "ISSUEDBY"] != false) {
                portfolioUI.append(
                    enroller
                        ._createInputField(portfolioItem.PORTFOLIOID + "_ISSUEDBY", {
                            DISPLAY: "Issued By",
                            TYPE: "text"
                        })
                        .attr("name", "ISSUEDBY")
                );
            }
            if (stepSettings[PREFIX + "DATEISSUED"] != false) {
                portfolioUI.append(
                    enroller
                        ._createInputField(portfolioItem.PORTFOLIOID + "_DATEISSUED", {
                            DISPLAY: "Issued Date",
                            TYPE: "date"
                        })
                        .attr("name", "DATEISSUED")
                );
            }
            if (stepSettings[PREFIX + "DATEEXPIRES"] != false) {
                portfolioUI.append(
                    enroller
                        ._createInputField(portfolioItem.PORTFOLIOID + "_DATEEXPIRES", {
                            DISPLAY: "Expiry Date",
                            TYPE: "date"
                        })
                        .attr("name", "DATEEXPIRES")
                );
            }

            if (stepSettings[PREFIX + "DETAILS"] != false) {
                portfolioUI.append(
                    enroller
                        ._createInputField(portfolioItem.PORTFOLIOID + "_DETAILS", {
                            DISPLAY: "Details",
                            TYPE: "text"
                        })
                        .attr("name", "DETAILS")
                );
            }

            if (portfolioItem.PORTFOLIOTYPE == "Registration" && stepSettings[PREFIX + "REGISTRATION"] != false) {
                portfolioUI.append(
                    enroller
                        ._createInputField(portfolioItem.PORTFOLIOID + "_REGISTRATION", {
                            DISPLAY: "Registration",
                            TYPE: "text"
                        })
                        .attr("name", "REGISTRATION")
                );
            }
            if (portfolioItem.PORTFOLIOTYPE == "Qualification") {
                if (stepSettings[PREFIX + "NAME"] != false) {
                    portfolioUI.append(
                        enroller
                            ._createInputField(portfolioItem.PORTFOLIOID + "_NAME", {
                                DISPLAY: "Name",
                                TYPE: "text"
                            })
                            .attr("name", "NAME")
                    );
                }

                if (stepSettings[PREFIX + "SPECIALITY"] != false) {
                    portfolioUI.append(
                        enroller
                            ._createInputField(portfolioItem.PORTFOLIOID + "_SPECIALITY", {
                                DISPLAY: "Speciality",
                                TYPE: "text"
                            })
                            .attr("name", "SPECIALITY")
                    );
                }

                if (stepSettings[PREFIX + "STARTDATE"] != false) {
                    portfolioUI.append(
                        enroller
                            ._createInputField(portfolioItem.PORTFOLIOID + "_STARTDATE", {
                                DISPLAY: "StartDate",
                                TYPE: "date"
                            })
                            .attr("name", "STARTDATE")
                    );
                }

                var statusSelect = {
                    DISPLAY: "Status",
                    TYPE: "select",
                    VALUES: [
                        { DISPLAY: "Completed", VALUE: "completed" },
                        { DISPLAY: "Commenced", VALUE: "Commenced" },
                        { DISPLAY: "Attended", VALUE: "Attended" },
                        { DISPLAY: "Suspended", VALUE: "Suspended" },
                        { DISPLAY: "Canceled", VALUE: "Canceled" },
                        { DISPLAY: "Withdrawn", VALUE: "Withdrawn" },
                        { DISPLAY: "Pending", VALUE: "Pending" }
                    ]
                };
                if (stepSettings[PREFIX + "STATUS"] != false) {
                    portfolioUI.append(
                        enroller
                            ._createInputField(portfolioItem.PORTFOLIOID + "_STATUS", statusSelect)
                            .attr("name", "STATUS")
                    );
                }
            }

            if (portfolioItem.FILES[0] != null) {
                var filesTable = enroller._createFilesTable(portfolioItem.FILES);
                portfolioUI.append(filesTable);

                step.data("portfolio_type_" + portfolioItem.PORTFOLIOTYPEID, true);
                filesTable.find("table").data("portfolioID", portfolioItem.PORTFOLIOID);
                enroller._updatePortfolioPoints(stepID, portfolioItem.PORTFOLIOTYPEID);
            }

            var importField = enroller._createfileImportField("Attach File", "addFile");
            portfolioUI.append(importField);

            var uploadHolder = enroller._createInformationField("Upload Record", "");
            uploadHolder.find("div.enroller-text-field").remove();
            uploadHolder
                .find("div.enroller-field-label")
                .text("")
                .css("background", "transparent")
                .css("border", "none");
            var uploadButton = $(
                '<a class="ui-btn ui-btn-active enroller-portfolio-upload ui-btn-icon-right ui-alt-icon ui-nodisc-icon ui-icon-upload">Upload or Update</a>'
            );
            var progress = $('<progress class="enroller-portfolio-progress" value="0" max="100"></progress>');
            progress.attr("id", portfolioItem.PORTFOLIOID + "_progress");
            uploadButton.on("click", function() {
                progress.show();
                uploadButton.hide();
                enroller._updatePortfolioAndUpload($("#" + portfolioItem.PORTFOLIOID));
            });

            uploadHolder.append(uploadButton);
            uploadHolder.append(progress);
            progress.hide();
            portfolioUI.append(uploadHolder);

            /*
			 * update the fields with the data from the portfolio items. no component is in the UI so no need to refresh
			 * */
            $.each(portfolioItem, function(key, value) {
                if (portfolioUI.find("#" + portfolioItem.PORTFOLIOID + "_" + key).length) {
                    var field = portfolioUI.find("#" + portfolioItem.PORTFOLIOID + "_" + key);
                    field.attr("name", key);
                    if (value != "" && value != null) {
                        enroller._updateInputValue(field, value);
                    }
                }
            });

            return portfolioUI;
        },
        _createFilesTable: function(files) {
            var filesHolder = enroller._createInformationField("Current Files", "");

            var filesTable = $('<table class="enroller-file-table"></table>');
            filesHolder.find("div.enroller-text-field").append(filesTable);

            var columns = [
                { title: "File Name", data: "FILENAME", className: "file-name" },
                { title: "portfolioDocID", data: "PORTFOLIODOCID", visible: false },
                { title: "", data: "ACTION" }
            ];

            $.each(files, function(i, file) {
                var splitName = file.FILENAME.split(".");
                var extension = splitName[splitName.length - 1];
                if (file.TEMPORARYACCESSURL != null) {
                    file.ACTION =
                        '<a data-portfoliodocid="' +
                        file.PORTFOLIODOCID +
                        '" href="' +
                        file.TEMPORARYACCESSURL +
                        '"';
                    file.ACTION += ' target="_blank"';
                    file.ACTION += ' data-extension="' + extension + '" class="enroller-file-download ';
                    file.ACTION +=
                        'ui-btn ui-btn-icon-notext ui-alt-icon ui-nodisc-icon ui-icon-download">Download</a>';
                } else {
                    file.ACTION =
                        '<a data-portfoliodocid="' +
                        file.PORTFOLIODOCID +
                        '" data-extension="' +
                        extension +
                        '" class="enroller-file-download ui-btn ui-btn-icon-notext ui-alt-icon ui-nodisc-icon ui-icon-download">Download</a>';
                }
            });
            filesTable.data("table_columns", columns);
            filesTable.data("table_data", files);

            return filesHolder;
        },
        _setupPortfolioDataTables: function(stepID) {
            var step = $("#" + stepID + "_step");
            step.find(".enroller-file-table:not(.dataTable)")
                .addClass("compact")
                .each(function() {
                    var table = $(this);
                    table.DataTable({
                        columns: table.data("table_columns"),
                        data: table.data("table_data"),
                        searching: false,
                        orderable: false,
                        info: false,
                        paging: false
                    });

                    table.closest(".enroller-text-field").addClass("enroller-file-table-holder");
                });
            step.find(".enroller-file-download").on("click", function() {
                var dLink = $(this);
                if (dLink.attr("href") != null) {
                    /*do nothing, it's already a link*/
                } else {
                    var docID = dLink.data("portfoliodocid");
                    var portfolioID = dLink.closest(".enroller-file-table").data("portfolioID");
                    var extension = dLink.data("extension");
                    var params = {
                        contactID: enroller.options.contact_id,
                        portfolioID: portfolioID,
                        portfolioDocID: docID
                    };
                    enroller.options.get_portfolio_file(params, function(data) {
                        var mimeType = enroller._getMimeType(extension);
                        if (mimeType == null) {
                            mimeType = "";
                        }

                        var open = window.open("data:" + mimeType + ";base64, " + data.FILE);
                        if (open == null) {
                            enroller._alert("A popup blocker is preventing the download");
                        }
                    });
                }
            });
        },
        _getMimeType: function(extension) {
            var extensions = {
                pdf: "application/pdf",
                zip: "application/zip",
                jpg: "image/jpeg",
                jpeg: "image/jpeg",
                png: "image/png",
                tiff: "image/tiff",
                xls: "application/vnd.ms-excel"
            };
            if (enroller.options.file_types != null) {
                extensions = enroller.options.file_types;
            }

            return extensions[extension];
        },
        _updatePortfolioAndUpload: function(form) {
            var formData = new FormData();
            var uploading = false;
            var portfolioID = $(form).data("portfolioID");
            var newPortfolioRecord = false;
            var params = {};
            if ((portfolioID + "").charAt(0) == "_") {
                newPortfolioRecord = true;
            } else {
                params.portfolioID = portfolioID;
            }
            params.portfolioTypeID = $(form).data("portfolioTypeID");
            params.contactID = $(form).data("contactID");

            var fieldsList = [];
            $(form)
                .find("input")
                .each(function(i) {
                    var field = $(this);
                    if (field.attr("name") != "addFile") {
                        if (field.val() != null && field.val() != "") {
                            params[field.attr("name")] = field.val();
                        }
                    }
                });

            var fileInput = $(form).find(".enroller-file-input input");
            if (fileInput.val() !== "" && fileInput.val() != null) {
                formData.append("addFile", $(form).find(".enroller-file-input input")[0].files[0]);
                uploading = true;
            }

            formData.append("contactID", params.contactID);
            enroller.options.add_update_portfolio(params, function(response) {
                formData.append("portfolioID", response.PORTFOLIOID);

                if (!uploading) {
                    /*
					 * Refresh Form.
					 * */
                    var newUI = enroller._createPortfolioItemUI(response, enroller.element.data("current_step"));

                    newUI.insertAfter($(form));
                    enroller._displaySetupChosens(enroller.element.data("current_step"));
                    enroller._setupPortfolioDataTables(enroller.element.data("current_step"));
                    $(form)
                        .closest("div")
                        .enhanceWithin();

                    $(form).remove();
                } else {
                    function performUpload(formData, token) {
                        enroller.options.upload_portfolio(
                            formData,
                            function(response) {
                                enroller._uploadSuccess(response);

                                /* 
							 * Create a new form and UI for the updated portfolio then remove the old.
							 * This way it will both handle records with no files and those with.
							 */
                                var newUI = enroller._createPortfolioItemUI(
                                    response,
                                    enroller.element.data("current_step")
                                );
                                newUI.insertAfter($(form));

                                enroller._displaySetupChosens(enroller.element.data("current_step"));
                                enroller._setupPortfolioDataTables(enroller.element.data("current_step"));
                                $(form)
                                    .closest("div")
                                    .enhanceWithin();

                                $(form).remove();
                            },
                            function(current, max) {
                                $(form)
                                    .find("progress")
                                    .attr({ value: current, max: max });
                            },
                            token
                        );
                    }

                    /* For Wordpress, get User Token before uploading, that way the file can be uploaded correctly */

                    var require_axtoken = false;
                    if (enroller.options.environment == "wordpress") {
                        require_axtoken = true;
                    }
                    if (require_axtoken) {
                        var tokenData = enroller.element.data("AX_TOKEN");
                        if(tokenData == null){
                            var userData = enroller.element.data("USER_AX_TOKEN");
                            if(userData!= null && userData.CONTACTID == enroller.options.contact_id){
                                tokenData = userData;
                                enroller.element.data("AX_TOKEN", tokenData);
                            }
                        }
                        if (tokenData != null) {
                            var tokens = tokenData;
                            /*if the user is any one of the following roles then do the call, else set the token to null and create a user*/
                            if (tokens.CONTACTID == enroller.options.contact_id) {
                                performUpload(formData, tokens.AXTOKEN);
                            } else if (
                                tokens.ROLETYPEID == 1 ||
                                tokens.ROLETYPEID == 5 ||
                                tokens.ROLETYPEID == 4
                            ) {
                                performUpload(formData, tokens.AXTOKEN);
                            } else {
                                enroller.element.data("AX_TOKEN", null);
                            }
                        }
                        /*Check to see if there are login credentials for the student stored, else attempt to create a user for them*/
                        if (enroller.element.data("AX_TOKEN") == null) {

                            if (enroller.options.check_for_user != null) {

                                // Note: users query is cached for 2min. clearing tokens on a new user is likely to go :(
                                enroller.options.check_for_user({contact_id:enroller.options.contact_id}, function (response) {
                                    if (response.has_user === true) {
                                        if (enroller.element.data("temp_user_credentials") != null && enroller.element.data("temp_user_credentials").CONTACTID == enroller.options.contact_id) {
                                            var contactID = enroller.options.contact_id;
                                            if (enroller.options.user_contact_id != 0) {
                                                contactID = enroller.options.user_contact_id;
                                            }
                                            enroller._getTemporaryToken(contactID, function (tokens) { 
                                                if (tokens.CONTACTID == enroller.options.contact_id) {
                                                    performUpload(formData, tokens.AXTOKEN);
                                                } else if (
                                                    tokens.ROLETYPEID == 1 ||
                                                    tokens.ROLETYPEID == 5 ||
                                                    tokens.ROLETYPEID == 4
                                                ) {
                                                    performUpload(formData, tokens.AXTOKEN);
                                                }
                                            });
                                        }
                                        else {
                                            if(enroller.options.contact_id === enroller.options.user_contact_id){
                                                var message = enroller._createInputField('info', {
                                                    DISPLAY: "A user account has been detected for you, and is required to be used when uploading files. Please login below to continue.",
                                                    TYPE: "info_expandable",
                                                    INFO_ONLY: true
                                                })
                                                enroller._userLoginPopup(message, function (loggedIn) {
                                                    if (loggedIn != null && loggedIn.cancelled === true) {
                                                        var step = enroller.element.data("current_step")
                                                        enroller._changeStep(step);
                                                    }
                                                    else if (loggedIn != null && loggedIn.AXTOKEN != null) {
                                                        if(loggedIn.CONTACTID === enroller.options.contact_id){
                                                            enroller._dismissAlertOverlay();
                                                            enroller.element.data('AX_TOKEN', loggedIn);
                                                            enroller._updatePortfolioAndUpload(form);
                                                        }
                                                        else{
                                                            enroller._dismissAlertOverlay();
                                                            enroller._setUserRoleAndAccess(loggedIn);
                                                        }
                                                    }

                                                });
                                            }
                                            else{
                                                enroller._alert('Unfortunately you cannot upload for another user after resuming.');
                                                 // cannot prompt for this user as it's someone else!.
                                            }
                                          
                                        }
                                    }
                                    else if (response.error !== true) {
                                        enroller._createUser(
                                            enroller.options.contact_id,
                                            function (data) {
                                                if (data != null) {
                                                    if (data.USERID != null) {
                                                        enroller._getTemporaryToken(enroller.options.contact_id, function (
                                                            tokens
                                                        ) {
                                                            if (tokens.CONTACTID == enroller.options.contact_id) {
                                                                performUpload(formData, tokens.AXTOKEN);
                                                            } else if (
                                                                tokens.ROLETYPEID == 1 ||
                                                                tokens.ROLETYPEID == 5 ||
                                                                tokens.ROLETYPEID == 4 ||
                                                                tokens.ROLETYPEID == 2
                                                            ) {
                                                                performUpload(formData, tokens.AXTOKEN);
                                                            }
                                                        });
                                                    }
                                                }
                                            },
                                            null
                                        );
                                    }
                                });
                            }
                        }
                    } else {
                        performUpload(formData);
                    }
                }
            });
        },
        _uploadSuccess: function(apiResponse) {},

        /* ENQUIRY_STEP */
        /*
		 * Enquiry Step Send Function.
		 * 
		 * */
        _sendEnquiry: function(params, step) {
            var stepOptions = enroller.options.enroller_steps[step];
            var newParams = {};
            /*
			 * Check to determine if this should be a Course Enquiry
			 * */
            if (parseInt(enroller.options.course.ID) > 0) {
                newParams.ID = enroller.options.course.ID;
                newParams.type = enroller.options.course.TYPE;
            }
            /* if there is no noteCodeID then set to SYSTEM NOTE */
            if (stepOptions.noteCodeID == null) {
                newParams.noteCodeID = 88;
            } else {
                newParams.noteCodeID = stepOptions.noteCodeID;
            }
            if (stepOptions.emailTo != null) {
                newParams.emailTo = stepOptions.emailTo;
            }
            newParams.contactID = enroller.options.contact_id;
            var currentLocation = window.location.hostname;

            /*
			 * See if the step is using a basic comments field, or alternatively build a custom set of params;
			 * */
            if (params.COMMENTS != null) {
                newParams.COMMENTS = "Enquiry from - " + currentLocation + "<br/>" + params.COMMENTS;
            } else {
                var comments = "Enquiry from - " + currentLocation + "<br/>";
                $.each(params, function(key, inputVal) {
                    comments =
                        comments + stepOptions.FIELDS[key].DISPLAY.replace(/\\/g, "") + ": " + inputVal + "<br/>";
                });

                newParams.COMMENTS = comments;
            }

            if (enroller.options.enrolment_hash != null) {
                var enrolHash = "<br />Enrolment Hash: " + enroller.options.enrolment_hash;
                newParams.COMMENTS = newParams.COMMENTS + enrolHash;
            }

            enroller.options.course_enquire(newParams, function(enquiryResponse) {
                if (enquiryResponse.SUCCESS != null) {
                    var response = enroller._enquiryResponse(enquiryResponse.SUCCESS, enquiryResponse);
                    response.addClass("enroller-enquiry-response");
                    $("#" + step + "_step").append(response);
                    enroller._updateStepButtons();
                    var nextStep = enroller._getNextStep(step);
                    if (nextStep == enroller.options.step_order[0]) {
                        /*complete*/
                    } else {
                        if (enquiryResponse.SUCCESS) {
                            enroller._changeStep(nextStep);
                        }
                    }
                }
            });
        },

        /* CONTACT_NOTE_STEP */
        /*
		 * Note Step Send Function.
		 * 
		 * */
        _sendNote: function(params, step) {
            var stepOptions = enroller.options.enroller_steps[step];
            var newParams = {};

            /* if there is no noteCodeID then set to SYSTEM NOTE */
            if (stepOptions.noteCodeID == null) {
                newParams.noteCodeID = 88;
                newParams.noteTypeID = 88;
            } else {
                newParams.noteCodeID = stepOptions.noteCodeID;
                newParams.noteTypeID = stepOptions.noteCodeID;
            }
            if (stepOptions.emailTo != null) {
                newParams.emailNote = stepOptions.emailTo;
            }
            newParams.contactID = enroller.options.contact_id;
            if(stepOptions.CONTACT_TYPE && stepOptions.CONTACT_TYPE === 'payer'){
                newParams.contactID = enroller.options.payer_id;
            }
            if(stepOptions.CONTACT_TYPE && stepOptions.CONTACT_TYPE === 'user'){
                newParams.contactID = enroller.options.user_contact_id;
            }
            var currentLocation = window.location.hostname;

            /*
			 * Build a custom set of params;
			 * */

            var contactNote = "Contact Note from - " + currentLocation + "<br/>";
            $.each(params, function(key, inputVal) {
                var contactType = 'student';
                if(stepOptions.CONTACT_TYPE){
                    contactType = stepOptions.CONTACT_TYPE;
                }
                var updatedKey = enroller._renameField(key, contactType);
                
                contactNote =
                    contactNote + stepOptions.FIELDS[updatedKey].DISPLAY.replace(/\\/g, "") + ": " + inputVal + "<br/>";
            });

            newParams.contactNote = contactNote;

            enroller.options.contact_note(newParams, function(response) {
                if (response.STATUS != null) {
                    var responseDisplay = enroller._contactNoteResponse(response.STATUS == "success", response);
                    responseDisplay.addClass("enroller-note-response");
                    $("#" + step + "_step").append(responseDisplay);
                    enroller._updateStepButtons();
                    var nextStep = enroller._getNextStep(step);
                    if (nextStep == enroller.options.step_order[0]) {
                        /*complete*/
                    } else {
                        if (response.STATUS == "success") {
                            enroller._changeStep(nextStep);
                        }
                    }
                }
            });
        },

        /* REVIEW_STEP */

        _reviewStepInstanceDataCheck: function() {
            var instanceData = enroller.element.data("selected_instance");
            if (instanceData != null) {
                return true;
            } else {
                var overrideParams = null;
                /*No Instance Data set - will need to be retrieved*/
                if (enroller.options.allow_inhouse_enrolment == true) {
                    overrideParams = {
                        instanceID: enroller.options.course.INSTANCEID,
                        type: enroller.options.course.TYPE,
                        everything: 1
                    };
                }
                if (enroller.options.multiple_courses == null) {
                    enroller.element.data("allow_public_inhouse", null);
                }

                enroller._fetchAndUpdateInstanceData(function(updatedInstanceData) {
                    /*add displayPrice and alter name as it is expected*/
                    updatedInstanceData = enroller._modifyInstanceData(updatedInstanceData);

                    enroller.element.data("selected_instance", updatedInstanceData);
                    enroller._displayReviewStep();
                    return false;
                }, overrideParams);
            }
            return false;
        },

        _reviewStepContactDataCheck: function() {
            var contactData = enroller.element.data("contact_data");

            if (contactData != null) {
                return true;
            } else {
                /*No contact data - fetch it then rerun _displayReviewStep*/

                var params = {
                    contactID: enroller.options.contact_id,
                    API: true
                };
                enroller._fetchAndUpdateContactData(params, function(updatedContactData) {
                    enroller.element.data("contact_data", updatedContactData);
                    enroller._displayReviewStep();
                    return false;
                });
                return false;
            }
        },
        _reviewCheckInstanceVacancy: function(instanceData) {
            var instanceVacancy = {
                available: true,
                reason: ""
            };
            var groupedIDs = enroller.element.data("grouped_ids");
            if (groupedIDs == null) {
                groupedIDs = {};
            }

            if (instanceData.TYPE == "w" && instanceData.PARTICIPANTVACANCY >= 1) {
                var hasgroup = false;
                if (instanceData.GROUPEDCOURSEID != null && instanceData.GROUPEDCOURSEISSIMULTANEOUS === true) {
                    hasgroup = true;
                    if (groupedIDs[instanceData.GROUPEDCOURSEID] != null) {
                        if (groupedIDs[instanceData.GROUPEDCOURSEID].indexOf(instanceData.INSTANCEID) < 0) {
                            groupedIDs[instanceData.GROUPEDCOURSEID].push(instanceData.INSTANCEID);
                        }
                    } else {
                        groupedIDs[instanceData.GROUPEDCOURSEID] = [instanceData.INSTANCEID];
                    }
                }
                enroller.element.data("grouped_ids", groupedIDs);
                /*If using multiple courses then make sure that the number of students selected does not exceed capacity*/
                if (enroller.options.multiple_courses != null) {
                    var instanceList = enroller._flatternMultipleEnrolments();

                    var contacts = 0;
                    var instanceTotals = {};
                    $.each(instanceList, function(i) {
                        instanceTotals[instanceList[i].INSTANCEID] = instanceList[i].CONTACTS.length;
                        if (instanceList[i].INSTANCEID == instanceData.INSTANCEID) {
                            contacts = instanceList[i].CONTACTS.length;
                        }
                    });

                    if (hasgroup) {
                        if (groupedIDs[instanceData.GROUPEDCOURSEID].length > 1) {
                            var spaces = instanceData.GROUPEDMAXPARTICIPANTS - instanceData.GROUPEDPARTICIPANTS;
                            $.each(groupedIDs[instanceData.GROUPEDCOURSEID], function(i) {
                                var g_instance_id = groupedIDs[instanceData.GROUPEDCOURSEID][i];
                                if (g_instance_id !== instanceData.instance_id) {
                                    spaces = spaces - instanceTotals[g_instance_id];
                                }
                            });
                            if (spaces == 0) {
                                return { available: false, reason: "no_spaces" };
                            }
                        }
                    }
                    if (contacts >= instanceData.PARTICIPANTVACANCY) {
                        instanceVacancy.available = false;
                        instanceVacancy.reason = "multiple_limit";
                        return instanceVacancy;
                    } else {
                        return instanceVacancy;
                    }
                } else {
                    return instanceVacancy;
                }
            } else if (instanceData.TYPE != "w") {
                return instanceVacancy;
            } else {
                instanceVacancy.available = false;
                instanceVacancy.reason = "no_spaces";
                return instanceVacancy;
            }
        },
        _createPayerDetailBlock: function(location, payerData, onUpdate) {
            if ($("#payer_details").length) {
                $("#payer_details")
                    .closest("div.enroller-info-field-Details")
                    .remove();
            }
            var payerDetailsHolder = $(
                '<div id="payer_details" data-corners="true" data-role="collapsible" data-collapsed="true" data-iconpos="right">'
            );
            payerDetailsHolder.append("<h3>" + enroller.options.payer_terminology + " Details</h3>");
            payerDetailsHolder.attr("data-collapsed-icon", "carat-d").attr("data-expanded-icon", "carat-u");

            var block = enroller._createInformationField("Details", payerDetailsHolder, true);
            $(location).append(block);

            var placeholderABN = $('<div/>').addClass('abn-placeholder');
            $(location).append(placeholderABN);

            var org = {
                TYPE: "text",
                DISPLAY: "Organisation",
                MAXLENGTH: 250
            };

            var payerOrg = enroller._createInputField("payer_organisation", org);
            $(payerDetailsHolder).append(payerOrg);
            enroller._updateInputValue($("#payer_organisation"), payerData.ORGANISATION);

            var phoneDiv = $('<div class="enroller-fieldgroup"></div>');
            if (enroller.options.payer_address_required == true) {
                phoneDiv.addClass("required");
            }
            payerDetailsHolder.append(phoneDiv);
            var phone = {
                TYPE: "text",
                DISPLAY: "Home Phone",
                MAXLENGTH: 20
            };

            var payer_phone = enroller._createInputField("payer_phone", phone);
            phoneDiv.append(payer_phone);
            enroller._updateInputValue($("#payer_phone"), payerData.PHONE);

            var mobile = {
                DISPLAY: "Mobile",
                TYPE: "text",

                MAXLENGTH: "10",
                PATTERN: "[0-9]{10}",
                TITLE: "Mobile numbers must be numeric, 10 characters and contain no spaces."
            };

            var payer_mobile = enroller._createInputField("payer_mobile", mobile);
            phoneDiv.append(payer_mobile);

            enroller._updateInputValue($("#payer_mobile"), payerData.MOBILEPHONE);

            var workPhone = {
                TYPE: "text",
                DISPLAY: "Work Phone",
                MAXLENGTH: 20
            };

            var payer_workphone = enroller._createInputField("payer_workphone", workPhone);
            phoneDiv.append(payer_workphone);
            enroller._updateInputValue($("#payer_workphone"), payerData.WORKPHONE);

            var addressDiv = $('<div class="enroller-fieldgroup"></div>');
            if (enroller.options.payer_address_required == true) {
                addressDiv.addClass("required");
            }
            payerDetailsHolder.append(addressDiv);
            var poBox = {
                TYPE: "text",
                DISPLAY: "Postal delivery information (PO box)",
                MAXLENGTH: 22
            };
            var payer_poBox = enroller._createInputField("payer_pobox", poBox);
            addressDiv.append(payer_poBox);
            addressDiv.append("<hr />");
            enroller._updateInputValue($("#payer_pobox"), payerData.POBOX);

            var building = {
                TYPE: "text",
                DISPLAY: "Building/Property Name",
                MAXLENGTH: 50
            };
            var payer_bname = enroller._createInputField("payer_buildingname", building);
            addressDiv.append(payer_bname);
            enroller._updateInputValue($("#payer_buildingname"), payerData.BUILDINGNAME);

            var streetNo = {
                TYPE: "text",
                DISPLAY: "Street or Lot Number",
                MAXLENGTH: 15
            };
            var payer_streetNo = enroller._createInputField("payer_streetno", streetNo);
            addressDiv.append(payer_streetNo);
            enroller._updateInputValue($("#payer_streetno"), payerData.STREETNO);

            var streetName = {
                TYPE: "text",
                DISPLAY: "Street Name",
                MAXLENGTH: 70
            };
            var payer_streetName = enroller._createInputField("payer_streetname", streetName);
            addressDiv.append(payer_streetName);
            enroller._updateInputValue($("#payer_streetname"), payerData.STREETNAME);

            var city = {
                TYPE: "text",
                DISPLAY: "Suburb, Locality or Town",
                MAXLENGTH: 50,
                REQUIRED: enroller.options.payer_address_required == true
            };
            var payer_city = enroller._createInputField("payer_city", city);
            payerDetailsHolder.append(payer_city);
            enroller._updateInputValue($("#payer_city"), payerData.CITY); //

            var STATE = {
                TYPE: "select",
                DISPLAY: "State",
                VALUES: [
                    { DISPLAY: "NSW", VALUE: "NSW" },
                    { DISPLAY: "VIC", VALUE: "VIC" },
                    { DISPLAY: "QLD", VALUE: "QLD" },
                    { DISPLAY: "SA", VALUE: "SA" },
                    { DISPLAY: "WA", VALUE: "WA" },
                    { DISPLAY: "TAS", VALUE: "TAS" },
                    { DISPLAY: "NT", VALUE: "NT" },
                    { DISPLAY: "ACT", VALUE: "ACT" }
                ],
                REQUIRED: enroller.options.payer_address_required == true
            };

            if (enroller.options.payer_australia_only === false) {
                STATE.VALUES = STATE.VALUES.concat([
                    { DISPLAY: "Other Australian Territory", VALUE: "OTH" },
                    { DISPLAY: "Overseas", VALUE: "OVS" }
                ]);
            }

            var payer_state = enroller._createInputField("payer_state", STATE);
            payerDetailsHolder.append(payer_state);
            enroller._updateInputValue($("#payer_state"), payerData.STATE);

            var postcode = {
                TYPE: "text",
                DISPLAY: "Postcode",
                MAXLENGTH: 10,
                REQUIRED: enroller.options.payer_address_required == true
            };
            var payer_postcode = enroller._createInputField("payer_postcode", postcode);
            payerDetailsHolder.append(payer_postcode);
            enroller._updateInputValue($("#payer_postcode"), payerData.POSTCODE);

            var PAYERCOUNTRY = {
                TYPE: "select",
                DISPLAY: "Country",
                VALUES: enroller.options.country_list,
                REQUIRED: enroller.options.payer_address_required == true
            };
            if (enroller.options.payer_australia_only === true) {
                PAYERCOUNTRY.VALUES = [
                    {
                        DISPLAY: "Australia",
                        VALUE: "1101"
                    }
                ];
            }
            var payer_country = enroller._createInputField("payer_country", PAYERCOUNTRY);
            payerDetailsHolder.append(payer_country);
            enroller._updateInputValue($("#payer_country"), payerData.COUNTRYID);

            var payerButton = {
                DISPLAY: "Update " + enroller.options.payer_terminology + " Details",
                TYPE: "button"
            };
            if (enroller.options.show_payer == true) {
                $(payerDetailsHolder).append(enroller._createInputField("update_payer", payerButton));
                $("#update_payer")
                    .off()
                    .on("click", function() {
                        if ($(location).find(".enroller-error-message").length) {
                            $(location)
                                .find(".enroller-error-message")
                                .remove();
                        }
                        if ($(location).find(".enroller-incomplete-field").length) {
                            $(location)
                                .find(".enroller-incomplete-field")
                                .removeClass("enroller-incomplete-field");
                        }
                        var continueUpdate = true;
                        var payerUpdateParams = {
                            buildingname: enroller._getInputValue("payer_buildingname", building),
                            pobox: enroller._getInputValue("payer_pobox", poBox),
                            state: enroller._getInputValue("payer_state", STATE),
                            streetno: enroller._getInputValue("payer_streetno", streetNo),
                            streetname: enroller._getInputValue("payer_streetname", streetName),
                            city: enroller._getInputValue("payer_city", city),
                            postcode: enroller._getInputValue("payer_postcode", postcode),
                            countryid: enroller._getInputValue("payer_country", PAYERCOUNTRY),
                            phone: enroller._getInputValue("payer_phone", phone),
                            mobilePhone: enroller._getInputValue("payer_mobile", mobile),
                            workPhone: enroller._getInputValue("payer_workphone", workPhone)
                        };

                        if (enroller.options.payer_australia_only === true) {
                            payerUpdateParams.countryid = 1101;
                        }

                        if (payerUpdateParams.city == "") {
                            if (enroller.options.payer_address_required == true) {
                                enroller._markFieldIncomplete("payer_city", city);
                                continueUpdate = false;
                            }
                        }
                        if (payerUpdateParams.postcode == "") {
                            if (enroller.options.payer_address_required == true) {
                                enroller._markFieldIncomplete("payer_postcode", postcode);
                                continueUpdate = false;
                            }
                        }
                        if (payerUpdateParams.state == "") {
                            if (enroller.options.payer_address_required == true) {
                                enroller._markFieldIncomplete("payer_state", STATE);
                                continueUpdate = false;
                            }
                        }
                        if (payerUpdateParams.countryid == "") {
                            if (enroller.options.payer_address_required == true) {
                                enroller._markFieldIncomplete("payer_country", PAYERCOUNTRY);
                                continueUpdate = false;
                            }
                        }

                        if (
                            payerUpdateParams.pobox == "" &&
                            (payerUpdateParams.streetname == "" || payerUpdateParams.streetno == "")
                        ) {
                            if (enroller.options.payer_address_required == true) {
                                continueUpdate = false;
                                enroller._displayError(
                                    "update_payer",
                                    "PO Box or Street Address details must be specified."
                                );
                            }
                        } else if (
                            payerUpdateParams.phone == "" &&
                            payerUpdateParams.mobilePhone == "" &&
                            payerUpdateParams.workPhone == ""
                        ) {
                            continueUpdate = false;
                            enroller._displayError("update_payer", "At least 1 contact number must be specified.");
                        } else if (!continueUpdate) {
                            enroller._displayError("update_payer", "Please complete the required fields.");
                        }

                        var organisation = enroller._getInputValue("payer_organisation", org);
                        if (organisation != "") {
                            payerUpdateParams.organisation = organisation;
                        }

                        if (continueUpdate) {
                            enroller._update_contact(payerData.CONTACTID, payerUpdateParams, function(
                                response
                            ) {
                                if (response != null) {
                                    if (response.error != null) {
                                        var message = "";
                                        if (response.resultBody != null) {
                                            if (response.resultBody.MESSAGES != null) {
                                                message = message + response.resultBody.MESSAGES + "<br />";
                                            }
                                            if (response.resultBody.DETAILS != null) {
                                                message = message + response.resultBody.DETAILS;
                                            }
                                        }

                                        if (response.error == 412) {
                                            if (response.resultBody.FIELDNAMES != null) {
                                                var fieldNames = response.resultBody.FIELDNAMES.split(",");
                                                if (fieldNames.length > 0) {
                                                    for (var i in fieldNames) {
                                                        var field = fieldNames[i];
                                                        var tempMessage = message.split(",")[i];
                                                        var fieldID = field.toUpperCase();
                                                        enroller._markFieldIncomplete(fieldID, fields[fieldID]);
                                                        enroller._scrollToElement("#" + fieldID, function() {
                                                            if ($("#" + fieldID).length) {
                                                                $("#" + fieldID).focus();
                                                            }

                                                            //enroller._alert(message);
                                                        });
                                                        enroller._displayError(fieldID, tempMessage);
                                                    }
                                                }
                                            }
                                        } else {
                                            enroller._alert(message);
                                        }
                                    } else {
                                        enroller.element.data("payer_data", response);
                                        if (onUpdate != null) {
                                            onUpdate();
                                        }
                                    }
                                }
                            });
                        }
                    });
            }
        },

        _reviewStepDiscountsBlock: function(location, instance_id, course_id, course_type) {
            var promoCodeID = "promoCode";
            if (instance_id != null) {
                promoCodeID = promoCodeID + "_" + instance_id;
            }
            $(location).append(enroller._createInputField(promoCodeID, { DISPLAY: "Promo Code", TYPE: "text" }));

            // Holder for applied discounts
            var discountBlock = $('<div class="enroller-discount-block"></div>');

            // Promo Code box
            if (enroller.options.promo_code != null && enroller.options.promo_code != "") {
                $(location)
                    .find("#" + promoCodeID)
                    .val(enroller.options.promo_code);
            }

            // Available Concessions
            var concessionBlock = $('<div class="enroller-concession-block"></div>');
            $(location).append(concessionBlock);
            var overrideParams = null;
            if (course_id != null && course_type != null && instance_id != null) {
                var overrideParams = {
                    status: "ACTIVE",
                    discountTypeID: 7,
                    type: course_type,
                    instanceID: instance_id,
                    ID: course_id
                };
            }
            enroller._getConcessions(function(discounts) {
                if (instance_id != null) {
                    enroller._displayConcessions(discounts, concessionBlock, instance_id);
                } else {
                    enroller._displayConcessions(discounts, concessionBlock);
                }
            }, overrideParams);

            // Check for Discount Button
            var calcButtonID = "calculate";
            if (instance_id != null) {
                calcButtonID = calcButtonID + "_" + instance_id;
            }
            var calculateButton = enroller._createInputField(calcButtonID, {
                DISPLAY: "Recalculate Discounts",
                TYPE: "button"
            });
            calculateButton.find("a").addClass("ui-btn-icon-right ui-icon-recycle");

            $(location).append(calculateButton);
            $(location).append(discountBlock);
            return discountBlock;
        },

        _generatePayersList: function(payerData) {
            var possiblePayers = {};

            if (enroller.element.data("possible_payers") != null) {
                possiblePayers = enroller.element.data("possible_payers");
            }
            //Check for multiple enrolments, if available and add them as options in the dropdown
            if (enroller.options.multiple_courses != null) {
                if (!$.isEmptyObject(enroller.options.multiple_courses)) {
                    $.each(enroller.options.multiple_courses, function(contactID, enrolments) {
                        
                        if (possiblePayers[contactID] == null) {
                            possiblePayers[contactID] = {
                                DISPLAY: enrolments.CONTACT_NAME,
                                VALUE: contactID
                            };
                        }
                    });
                }
            }
            //Add current user to dropdown
            var userContactData = enroller.element.data("user_contact_data");
            if (userContactData != null) {
                if (userContactData.GIVENNAME == null) {
                    userContactData.GIVENNAME = "";
                }
                if (userContactData.SURNAME == null) {
                    userContactData.SURNAME = "";
                }
                if (possiblePayers[userContactData.CONTACTID] == null) {
                    possiblePayers[userContactData.CONTACTID] = {
                        DISPLAY: userContactData.GIVENNAME + " " + userContactData.SURNAME,
                        VALUE: userContactData.CONTACTID
                    };
                }
            }
            //Add Current student to dropdown

            if (enroller.options.contact_id != 0) {
                if (possiblePayers[enroller.options.contact_id] == null) {
                    var contactData = enroller.element.data("contact_data");
                    if (contactData != null) {
                        possiblePayers[enroller.options.contact_id] = {
                            DISPLAY: contactData.GIVENNAME + " " + contactData.SURNAME,
                            VALUE: enroller.options.contact_id
                        };
                    }
                }
            }
            //Add current Payer to dropdown
            if (payerData != null) {
                if (payerData.GIVENNAME == null) {
                    payerData.GIVENNAME = "";
                }
                if (payerData.SURNAME == null) {
                    payerData.SURNAME = "";
                }
                if (possiblePayers[payerData.CONTACTID] == null) {
                    possiblePayers[payerData.CONTACTID] = {
                        DISPLAY: payerData.GIVENNAME + " " + payerData.SURNAME,
                        VALUE: payerData.CONTACTID
                    };
                }
            }
            enroller.element.data("possible_payers", possiblePayers);

            var payerList = [];
            $.each(possiblePayers, function(contact_id, payerData) {
                payerList.push(payerData);
            });

            return payerList;
        },

        _payerChangeBlock:function(payerData, location, postIDKey, callback, showDetails){
            var payerList = enroller._generatePayersList(payerData);
            var idKey = postIDKey != null ? postIDKey :'';

            var payerElement = {
                DISPLAY: enroller.options.payer_terminology,
                VALUES: payerList,
                TYPE: "select",
                TOOLTIP: "You can change who the Invoice/Reciept will be created for here."
            };

            $(location).append(enroller._createInputField("payer_id" +idKey, payerElement));
            var payerButton = {
                DISPLAY: "Or Add New " + enroller.options.payer_terminology,
                TYPE: "button",
                TOOLTIP: "Add a new " + enroller.options.payer_terminology + " that isn't in the above list"
            };

            if (enroller.options.allow_update_payer_details == true && showDetails !== false) {
                enroller._createPayerDetailBlock(location, payerData, enroller._displayReviewStep);
            }

            $(location).append(enroller._createInputField("newPayer"+ idKey, payerButton));

            $("#newPayer"+idKey).on("click", function() {
                var contactCreate = enroller._displayContactCreate(function(contactBasicDetails) {
                    enroller._setOption("payer_id", contactBasicDetails.CONTACTID);
                    enroller._contactAdded(contactBasicDetails);

                    setTimeout(function(){
                        callback();
                    },100);

                }, enroller.options.payer_terminology);
                contactCreate.insertAfter($(location).closest('.enroller-step')).hide();
                contactCreate.enhanceWithin();
                contactCreate.prepend(
                    '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>'
                );
                contactCreate
                    .popup({
                        positionTo: "window",
                        corners: false
                    })
                    .popup("open")
                    .show();
                /*correct positioning of poup*/
                $("#contactCreate-popup").css({
                    transform: "translate(-50%, -50%)"
                });
                $("#contactCreate-screen").css("height", "auto");
                $(window).trigger("resize");
            });

            $("#payer_id" +idKey).val(payerData.CONTACTID);

            $("#payer_id"+idKey).on("change", function(e) {
                if ($(this).val() != null && $(this).val() != "") {
                    enroller._setOption("payer_id", parseInt($(this).val()));

                    setTimeout(function(){
                        callback();
                    }, 100);
                    
                }
            });
        },
        
        _reviewStepCourseInfoBlock: function(contactData, instanceData, location, addCourseInfo, addContactName) {
            /*** WP-187 Review redesign ***/

            if (addCourseInfo == true) {
                //outlne
                /*will call API and get course details*/
                if (enroller.options.get_course_detail !== null) {
                    enroller._displayCourseInformation();
                }
            }

            // Header Course Information
            var ciHeader = {
                DISPLAY: enroller.options.enrolment_terminology + " Details",
                TYPE: "information",
                INFO_ONLY: true
            };
            $(location).append(enroller._createInputField("ci_header", ciHeader));
            // Instance Name

            $(location).append(
                enroller._createInformationField(enroller.options.instance_terminology, instanceData.NAME)
            );

            // Student Name
            if (addContactName == true) {
                if (contactData.GIVENNAME == null) {
                    contactData.GIVENNAME = "";
                }
                if (contactData.SURNAME == null) {
                    contactData.SURNAME = "";
                }
                $(location).append(
                    enroller._createInformationField(
                        enroller.options.terminology_student,
                        contactData.GIVENNAME + " " + contactData.SURNAME
                    )
                );
            }

            /* WP-200 */
            var continueProcess = true;
            var payerData = enroller.element.data("payer_data");
            if (payerData == null) {
                if (enroller.options.payer_id != 0) {
                    enroller._confirmContactIsInAccount(enroller.options.payer_id, function(data) {
                        enroller.element.data("payer_data", data);
                        enroller._displayReviewStep();
                        continueProcess = false;
                    });
                } else {
                    /*should never get here, but use the payer check to force payer to be set if needed*/
                    enroller._reviewStepPayerCheck();
                    return false;
                }
            }

            /*Only run this block if payer data has been set, and if show_payer is enabled*/
            if (!$("#payer_id").length && continueProcess && enroller.options.show_payer != false) {
                enroller._payerChangeBlock(payerData, location, "", enroller._displayReviewStep, true);
                enroller._displaySetupChosens("review");
            }

            // Dates

            if (instanceData.TYPE != "w") {
                if (instanceData.STARTDATE != null && instanceData.STARTDATE != "") {
                    var datesDisplay = instanceData.STARTDATE;
                    if (instanceData.STARTDATE == instanceData.FINISHDATE) {
                        datesDisplay = instanceData.STARTDATE;
                    } else if (instanceData.FINISHDATE != null && instanceData.FINISHDATE != "") {
                        datesDisplay = datesDisplay + " - " + instanceData.FINISHDATE;
                    }
                    $(location).append(enroller._createInformationField("Date(s)", datesDisplay));
                }
            } else {
                $(location).append(enroller._createInformationField("Date(s)", instanceData.DATEDESCRIPTOR));
            }
            $(location).append('<div style="height:1em;" />');
            // Location

            if (instanceData.TYPE == "w") {
                $(location).append(enroller._createInformationField("Location", instanceData.LOCATION));
            }
            // Header Course Fees
            var feeHeader = {
                DISPLAY: enroller.options.course_terminology + " Fees",
                TYPE: "information",
                INFO_ONLY: true
            };
            if (enroller.options.hide_cost_fields != true) {
                $(location).append(enroller._createInputField("fee_header", feeHeader));
            }

            // Fee
            var costDisplay = enroller._createInformationField(
                enroller.options.cost_terminology,
                instanceData.DISPLAYPRICE
            );
            if (enroller.options.hide_cost_fields != true) {
                costDisplay.addClass("enroller-cost-holder");
                $(location).append(costDisplay);
            }
        },

        _reviewStepExtraItems: function(instanceID, courseType, callback) {
            if (enroller.options.instance_extra_items != null && courseType === "w") {
                enroller.options.instance_extra_items({ course_type: "w", instance_id: instanceID }, function(
                    response
                ) {
                    if (response != null && Array.isArray(response)) {
                        // Store data for reference in GB etc
                        var items = enroller.element.data("items_list");
                        if (items == null) {
                            items = {};
                        }
                        for (var index = 0; index < response.length; index++) {
                            var item = response[index];
                            items[item.DEFAULTBOOKINGITEMID] = item;
                        }
                        enroller.element.data("items_list", items);
                        callback(response);
                    } else {
                        callback([]);
                    }
                });
            } else {
                callback([]);
            }
        },

        _reviewStepABNCheck: function(){
            var orgCheckPass = true;
            if( enroller.options.payer_abn_review === true){
                var orgData = enroller.element.data('payer_org_data');
                var payerData = enroller.element.data("payer_data");
       
                if(orgData && payerData && orgData.ORGID === payerData.ORGID){
                   return true;
                }
                else if(payerData && payerData.ORGID){
                    orgCheckPass = false;
                    if(enroller.options.payer_abn_retrieve){
                        enroller.options.payer_abn_retrieve({org_id: payerData.ORGID}, function(data){
                 
                            enroller.element.data('payer_org_data', data);
                            enroller._displayReviewStep();
                        })
                    }
                    
                    
                }
                else if(!payerData){
                    return false;
                }

            }
            return orgCheckPass;
        },

        _reviewStepOrgABNBlock:function(location){
            var orgData = enroller.element.data('payer_org_data');
            var payerData = enroller.element.data("payer_data");
            if(payerData && payerData.ORGID){
                if(orgData && orgData.ABN){
                    $(location).append(enroller._createInputField('payerABN', { DISPLAY: "Organisation ABN", TYPE: "text", TOOLTIP:'Please contact us if this ABN is incorrect.', PATTERN:"[0-9]{11}", TITLE: "ABN must be a valid 11 digit number",MAXLENGTH: 11 }));
                    $('#payerABN').val(orgData.ABN);
                    $('#payerABN').attr('disabled', true);
    
                }
                else{
                    $(location).append(enroller._createInputField('payerABN', { DISPLAY: "Organisation ABN", TYPE: "text",PATTERN:"[0-9]{11}", TITLE: "ABN must be a valid 11 digit number", MAXLENGTH: 11 }));
                }
            }
           
        },

        _reviewStepPayerCheck: function() {
            if (enroller.options.payer_id == 0) {
                var axTokenAll = enroller.element.data("USER_AX_TOKEN");
                var userCData = enroller.element.data("user_contact_data");
                if (axTokenAll != null) {
                    /*if the logged in user is a client or a learner set the payer to them initially*/
                    if (
                        axTokenAll.ROLETYPEID == enroller.CLIENT_ID ||
                        axTokenAll.ROLETYPEID == enroller.LEARNER_ID
                    ) {
                        enroller.options.payer_id = axTokenAll.CONTACTID;
                    } else {
                        enroller.options.payer_id = enroller.options.contact_id;
                    }

                    /*If client then check for an organisation payer*/
                    if (axTokenAll.ROLETYPEID == enroller.CLIENT_ID) {
                        if (userCData != null) {
                            if (userCData.ORGID != null) {
                                enroller.options.get_client_organisation(userCData.ORGID, function(orgData) {
                                    if (orgData.PAYERCONTACTID != null) {
                                        if (parseInt(orgData.PAYERCONTACTID) > 0) {
                                            enroller._setOption("payer_id", orgData.PAYERCONTACTID);
                                            enroller._displayReviewStep();
                                            return false;
                                        } else {
                                            enroller._displayReviewStep();
                                            return false;
                                        }
                                    }
                                });
                            }
                        } else {
                            enroller._confirmContactIsInAccount(axTokenAll.CONTACTID, function(contactData) {
                                enroller.element.data("user_contact_data", contactData);
                                enroller._displayReviewStep();
                                return false;
                            });
                        }
                    } else {
                        enroller._displayReviewStep();
                        return false;
                    }
                } else {
                    if (userCData != null) {
                        enroller.options.payer_id = userCData.CONTACTID;
                        enroller._displayReviewStep();
                        return false;
                    } else {
                        enroller.options.payer_id = enroller.options.contact_id;
                        enroller._displayReviewStep();
                        return false;
                    }
                }

                return false;
            } else {
                return true;
            }
        },
        _dismissAlertOverlay: function() {
            var alertID = "ax_enroller_overlay_alert";
            if ($("#" + alertID).length) {
                $("#" + alertID).remove();
            }
        },
        _displayOverlayNonDismissableAlert: function(title, content, location) {
            var alertID = "ax_enroller_overlay_alert";
            if ($("#" + alertID).length) {
                $("#" + alertID).remove();
            }
            var alertContainer = $("<div></div>").attr("id", alertID);
            alertContainer.css({
                height: "100%",
                width: "100%",
                top: 0,
                left: 0,
                "z-index": 999999,
                position: "absolute",
                background: "#77777777"
            });
            var contentOuter = $('<ul data-role="listview"></ul>');
            contentOuter.css({
                "max-width": "100%",
                margin: "auto",
                width: location!=null ?$(location).innerWidth() - 100 :400,
                position: "relative",
                top: "35%"
            });
            contentOuter.append($('<li data-role="list-divider"></li>').append(title));
            contentOuter.append($("<li></li>").append(content));
            alertContainer.append(contentOuter);
            if(location == null){
                alertContainer.insertAfter(enroller.element);
            }
            else{
                $(location).append(alertContainer);
            }
           
            alertContainer.enhanceWithin();
        },

        _checkForEnrolmentHashes: function(checkParamOverride) {
            if (enroller.options.check_for_enrolment_hash != null) {
                var checkParams = {
                    contact_id: enroller.options.contact_id,
                    instance_id: enroller.options.course.INSTANCEID,
                    course_type: enroller.options.course.TYPE
                };
                if (checkParamOverride) {
                    checkParams.instance_id = checkParamOverride.instance_id;
                    checkParams.course_type = checkParamOverride.course_type;
                }
                var checkedBefore = enroller.element.data("check_enrolment_hashes");
                var thisEnrol =
                    checkParams.contact_id + "_" + checkParams.instance_id + "_" + checkParams.course_type;
                if (checkedBefore != null) {
                    if (checkedBefore[thisEnrol] != null) {
                        return;
                    }
                }

                if (enroller.options.enrolment_hash != null && enroller.options.enrolment_hash !== "") {
                    checkParams.enrolment_hash = enroller.options.enrolment_hash;
                }
                enroller.options.check_for_enrolment_hash(checkParams, function(result) {
                    checkedBefore = enroller.element.data("check_enrolment_hashes");
                    if (checkedBefore == null) {
                        checkedBefore = {};
                    }
                    checkedBefore[thisEnrol] = true;
                    enroller.element.data("check_enrolment_hashes", checkedBefore);

                    if (result.enrolments === true) {
                        // Other enrolments for this contact into this instance have been found! YAY.

                        var container = $("<div></div>");
                        var message = $(
                            "<p>It looks like an existing enrolment attempt for this course exists. </p>"
                        );
                        var message2 = $(
                            "<p>Would you like to resume your enrolment? You will recieve an email with a link to continue from the point you left off.</p>"
                        );
                        var messageInvoice = $("<p>An existing invoice was found. Please Resume to continue.</p>");
                        $.each([message, message2, messageInvoice], function(i, message) {
                            $(message).css({
                                "font-size": 14,
                                "white-space": "normal",
                                "text-shadow": "none"
                            });
                        });

                        container.append(message);
                        container.append(message2);
                        var buttonResume = $(
                            '<a data-role="button" data-mini="true" class="ui-btn-active" href="#">Resume</a>'
                        );
                        container.append(buttonResume);

                        buttonResume.on("click", function() {
                            enroller.options.send_reminders_for_enrolment_hash(checkParams, function() {
                                enroller.element.hide(100);

                                enroller._displayOverlayNonDismissableAlert(
                                    "Enrolment Attempt Found",
                                    '<p style="white-space:normal; font-size:14px">Reminders have been sent. Check your email for your resumption link!</p>'
                                );
                                var content = $("#ax_enroller_overlay_alert")
                                    .contents()
                                    .clone();
                                $("<div></div>")
                                    .append(content)
                                    .css({ padding: 20 })
                                    .insertAfter(enroller.element);
                                setTimeout(enroller._dismissAlertOverlay, 5000);
                            });
                        });
                        var buttonCancel = $(
                            '<a data-role="button" data-mini="true" href="#">Continue with this enrolment</a>'
                        );
                        buttonCancel.on("click", function() {
                            var confirm = window.confirm("This is not reccommended, are you sure?");
                            if (enroller.options.flag_others_redundant !== null && confirm) {
                                checkParams.user_contact_id = enroller.options.user_contact_id;
                                enroller.options.flag_others_redundant(checkParams, function() {
                                    enroller._dismissAlertOverlay();
                                });
                            }
                        });
                        if (result.has_invoice !== true) {
                            container.append(buttonCancel);
                        } else {
                            container.append(messageInvoice);
                            enroller._checkInvoiceStatus(
                                {
                                    contactID: checkParams.contact_id,
                                    type: checkParams.course_type,
                                    instanceID: checkParams.instance_id
                                },
                                function(alreadyInvoiced) {
                                    if (!alreadyInvoiced) {
                                        container.append(buttonCancel);
                                        enroller._displayOverlayNonDismissableAlert(
                                            "Enrolment Attempt Found",
                                            container
                                        );
                                    }
                                },
                                false
                            );
                        }

                        enroller._displayOverlayNonDismissableAlert("Enrolment Attempt Found", container);
                    }
                });
            }
        },
        /**
         * ItemSelected: null|boolean; Null = not set yet, true/false = selected
         */
        _createItemField: function(item, index, itemSelected, enrolRef) {
            var display = enroller._currencyDisplayFormat(item.DEFAULTPRICE);
            if (item.REQUIRED) {
                display = display + " (Required)";
            }
            var itemObj = {
                TYPE: "checkbox",
                DISPLAY: item.ITEMDESCRIPTION,
                VALUES: [
                    {
                        VALUE: item.DEFAULTBOOKINGITEMID,
                        DISPLAY: display
                    }
                ]
            };
            var field = enroller._createInputField(
                enrolRef + "_extra_item_" + item.DEFAULTBOOKINGITEMID,
                itemObj,
                index
            );
            if (item.REQUIRED) {
                //field.addClass('selected disabled');
                field.find("input").attr("checked", true);
                field.find("input").attr("disabled", true);
            }

            if ((item.DEFAULTSELECTED && itemSelected !== false) || itemSelected === true) {
                //field.addClass('selected');
                field.find("input").attr("checked", true);
            }
            return field;
        },
        _generateExtraItemsDisplay: function(itemData, contactID, instanceID, courseType, onUpdate) {
            var selected = enroller.element.data("extra_items_selected");
            if (selected == null) {
                selected = {};
                enroller.element.data("extra_items_selected", {});
            }
            var enrolRef = contactID + "_" + instanceID + "_" + courseType;
            var selectedItems = selected[enrolRef];
            var fields = [];
            if (itemData != null && itemData.length > 0) {
                for (var index = 0; index < itemData.length; index++) {
                    var element = itemData[index];
                    var itemSelected = null;
                    if (selectedItems != null) {
                        if (selectedItems[element.DEFAULTBOOKINGITEMID] === true) {
                            itemSelected = true;
                        } else if (selectedItems[element.DEFAULTBOOKINGITEMID] === false) {
                            itemSelected = false;
                        } else if (element.DEFAULTSELECTED || element.REQUIRED) {
                            selectedItems[element.DEFAULTBOOKINGITEMID] = true;
                            itemSelected = true;
                        }
                    } else {
                        selectedItems = {};
                        if (element.DEFAULTSELECTED) {
                            selectedItems[element.DEFAULTBOOKINGITEMID] = true;
                        }
                    }
                    var field = enroller._createItemField(element, index, itemSelected, enrolRef);

                    fields.push(field);
                }
                selected[enrolRef] = selectedItems;
                enroller.element.data("extra_items_selected", selected);

                var headerInfo = {
                    INFO_ONLY: true,
                    TYPE: "header",
                    DISPLAY: "Extra Items:"
                };

                var holder = $("<div ></div>").attr("id", "extra_items_" + enrolRef);
                holder.on("change", "input", function(e) {
                    var target = $(e.target);
                    var itemID = target
                        .attr("id")
                        .split("_")
                        .pop();
                    var currentSelected =
                        enroller.element.data("extra_items_selected") != null
                            ? enroller.element.data("extra_items_selected")
                            : {};
                    var currentEnrolment = currentSelected[enrolRef];
                    currentEnrolment[itemID] = target.is(":checked");
                    currentSelected[enrolRef] = currentEnrolment; // For safety;
                    enroller.element.data("extra_items_selected", currentSelected);
                    if (onUpdate != null) {
                        onUpdate();
                    }
                });
                holder.append(enroller._createInfoFieldDetailed("step_header", headerInfo));
                holder.append(fields);
                return holder;
            }
            return null;
        },

        _displayFirstPayerStep:function(stepID){
            var payerData = enroller.element.data("payer_data");
            
            if(!payerData){
                if(enroller.options.payer_id === enroller.options.contact_id){
                    payerData = enroller.element.data("contact_data");
                    if(payerData){
                        enroller._displayFirstPayerStep(stepID)
                    }
                    else{
                        enroller._setPayer(enroller.options.payer_id);
                        if(jQuery.active > 0 ){
                            $(document).one("ajaxStop", function() {
                                enroller._displayFirstPayerStep(stepID)
                            });
                       }
                       else{
                            enroller._displayFirstPayerStep(stepID)
                       }
                    }
                 
                }
                else if(enroller.options.payer_id === 0){
                    enroller.options.payer_id = enroller.options.contact_id;
                    enroller._displayFirstPayerStep(stepID)
                }
                else{
                    enroller._setPayer(enroller.options.payer_id);
                    if(jQuery.active > 0 ){
                        $(document).one("ajaxStop", function() {
                            enroller._displayFirstPayerStep(stepID)
                        });
                   }
                   else{
                        enroller._displayFirstPayerStep(stepID)
                   }
                }
            }
            else{
                if(enroller.options.payer_id === 0){
                    enroller.options.payer_id = enroller.options.contact_id;
                }
                if(payerData.CONTACTID !== enroller.options.payer_id){
                    enroller.element.data("payer_data", null);
                    enroller._displayFirstPayerStep(stepID);
                    return;
                }
                var location = $('.payer-change');
    
                if(location.length){
                    location.empty();
    
                    enroller._payerChangeBlock(payerData, location, "_fp", function(){
                       if(jQuery.active > 0 ){
                            $(document).one("ajaxStop", function() {
                                enroller._displayFirstPayerStep(stepID)
                            });
                       }
                       else{
                            enroller._displayFirstPayerStep(stepID)
                       }
                       
                    }, false);
                    enroller._displaySetupChosens(stepID);
                    location.enhanceWithin();
    
                }
                else{
                    console.warn('Missing payer change placeholder');
                }
            }
            
           
            

        },
        /* REVIEW_STEP_UI */
        _displayReviewStep: function() {

            enroller._scrollToElement('.enroller-content', function(){});

            
            /*if using shopping cart functionality, switch the step creation logic*/
            if (enroller.options.cart_course_override != null) {
                enroller._displayCartReviewStep();
            } else {
                $("#review_step").empty();
                $("#review_step").hide();
                var selectedCourse = $(
                    '<div class="ui-btn ui-text-left ui-corner-all enroller-course-heading"></div>'
                );

                var stepOptions = enroller.options.enroller_steps.review;

                /*Top Blurb*/
                var payerCheckPass = enroller._reviewStepPayerCheck();

                if (enroller.element.data("payer_data") == null && payerCheckPass) {
                    payerCheckPass = false;
                    if (enroller.options.payer_id != 0) {
                        enroller._confirmContactIsInAccount(enroller.options.payer_id, function(data) {
                            enroller.element.data("payer_data", data);

                            enroller._displayReviewStep();
                        });
                    }
                } else if (enroller.element.data("payer_data") !== null && payerCheckPass) {
                    if (enroller.options.payer_id != 0) {
                        if (enroller.options.payer_id != enroller.element.data("payer_data").CONTACTID) {
                            payerCheckPass = false;
                            enroller._confirmContactIsInAccount(enroller.options.payer_id, function(data) {
                                enroller.element.data("payer_data", data);

                                enroller._displayReviewStep();
                            });
                        }
                    }
                }
         
           
                if (payerCheckPass && enroller._reviewStepABNCheck()) {
                    if (stepOptions.BLURB_TOP != null && stepOptions.BLURB_TOP != "") {
                        var blurbT = enroller._createBlurb(stepOptions.BLURB_TOP);
                        $("#review_step").append(blurbT);
                    }

                    if (stepOptions.HEADER) {
                        var headerInfo = {
                            INFO_ONLY: true,
                            TYPE: "header",
                            DISPLAY: stepOptions.HEADER
                        };
                        $("#review_step").prepend(
                            enroller._createInfoFieldDetailed("review_step_header", headerInfo)
                        );
                    }

                    var instanceData = enroller.element.data("selected_instance");
                    var contactData = enroller.element.data("contact_data");

                    /*Ensure that we check to ensure that the data exists and is the right contact*/
                    if (enroller._reviewStepContactDataCheck()) {
                        if (contactData.CONTACTID !== enroller.options.contact_id) {
                            /*wipe data and use the check to retrieve fresh data*/
                            enroller.element.data("contact_data", null);
                            enroller._reviewStepContactDataCheck();
                        } else {
                            /*contact ID is correct and we have contact Data*/
                            if (enroller._reviewStepInstanceDataCheck()) {
                                if (instanceData.INSTANCEID !== enroller.options.course.INSTANCEID) {
                                    /*wipe data and use the check to retrieve fresh data*/
                                    enroller.element.data("selected_instance", null);
                                    enroller._reviewStepInstanceDataCheck();
                                } else {
                                    var continueReview = true;
                                    var extraItems;
                                    if (
                                        enroller.options.workshop_extra_billable_items === true &&
                                        enroller.options.course.TYPE === "w"
                                    ) {
                                        var extraItemData = enroller.element.data("extra_item_data");
                                        var instanceRef =
                                            enroller.options.course.INSTANCEID + "_" + enroller.options.course.TYPE;

                                        if (extraItemData == null) {
                                            extraItemData = {};
                                            continueReview = false;
                                        } else if (extraItemData[instanceRef] === undefined) {
                                            continueReview = false;
                                        }

                                        if (!continueReview) {
                                            //enroller.element.data('extra_item_data', { [instanceRef]: null });
                                            enroller._reviewStepExtraItems(
                                                enroller.options.course.INSTANCEID,
                                                enroller.options.course.TYPE,
                                                function(response) {
                                                    if (response && response.error == null) {
                                                        var extraItemsUpdate = {};
                                                        extraItemsUpdate[instanceRef] = response;
                                                        enroller.element.data("extra_item_data", extraItemsUpdate);
                                                    } else {
                                                        var extraItemsUpdate = {};
                                                        extraItemsUpdate[instanceRef] = null;
                                                        enroller.element.data("extra_item_data", extraItemsUpdate);
                                                        //enroller._displayReviewStep();
                                                    }
                                                    enroller._displayReviewStep();
                                                }
                                            );
                                        } else {
                                            extraItems = enroller._generateExtraItemsDisplay(
                                                extraItemData[instanceRef],
                                                enroller.options.contact_id,
                                                enroller.options.course.INSTANCEID,
                                                enroller.options.course.TYPE,
                                                null
                                            );
                                        }
                                    }
                                    if (continueReview) {
                                        enroller._setOption("cost", instanceData.COST);
                                        enroller._setOption("original_cost", instanceData.COST);
                                        $("#review_step").append(selectedCourse);
                                        $(selectedCourse).prepend(
                                            enroller.options.course_terminology +
                                                ": " +
                                                instanceData.COURSENAME +
                                                "<br />"
                                        );

                                        enroller._reviewStepCourseInfoBlock(
                                            contactData,
                                            instanceData,
                                            "#review_step",
                                            true,
                                            true
                                        );


                                      

                                        if( enroller.options.payer_abn_review === true){
                                            var abnLocation = $('#review_step').find('.abn-placeholder');
                                            if(abnLocation){
                                                enroller._reviewStepOrgABNBlock(abnLocation);
                                            }
                                            else{
                                                enroller._reviewStepOrgABNBlock("#review_step");
                                            }
                                            
                                        }


                                        var discountsAvail =
                                            instanceData.PUBLIC == true ||
                                            enroller.options.allow_mixed_inhouse_public == true;
                                        // Applied Discounts
                                        if (enroller.options.get_discounts != null && discountsAvail) {
                                            var discountBlock = enroller._reviewStepDiscountsBlock("#review_step");

                                            $("#calculate").on("click", function(e) {
                                                e.preventDefault();
                                                var concessions = enroller._getSelectedConcessions();
                                                enroller._calculateDiscount(concessions, function(discounts) {
                                                    enroller._displayOrUpdateDiscountDisplay(
                                                        discounts,
                                                        discountBlock
                                                    );
                                                    $(location).enhanceWithin();
                                                });
                                            });

                                            enroller._calculateDiscount(null, function(discounts) {
                                                enroller._displayOrUpdateDiscountDisplay(discounts, discountBlock);
                                                $("#review_step").enhanceWithin();
                                            });
                                        }

                                        if (extraItems != null) {
                                            $("#review_step").append(extraItems);
                                            //extraItems.enhanceWithin();
                                        }

                                        //$("#review_step").enhanceWithin();

                                        // Enrolment Status block
                                        var headerInfo = {
                                            INFO_ONLY: true,
                                            TYPE: "information",
                                            DISPLAY: "Enrolment Progress"
                                        };
                                        var header = enroller._createInfoFieldDetailed("enrolStatus", headerInfo);
                                        $("#review_step").append(header);
                                        var portfolioCompleted = true;
                                        var allCompleted = true;

                                        var headerRequired = false;
                                        var stepInfoBlock = $('<div></div>').addClass('step-info-block');
                                        if(enroller.options.show_step_info_block == true){
                                            $("#review_step").append(stepInfoBlock);
                                        }
                                        $.each(enroller.options.step_order, function(i, step) {
                                            var stepDetails = enroller.options.enroller_steps[step];
                                            var stepInfo = null;
                                            if (
                                                stepDetails.TYPE == "contact-update" ||
                                                stepDetails.TYPE == "contact-note" ||
                                                stepDetails.TYPE == "enrol-details" ||
                                                stepDetails.TYPE == "course-enquiry"
                                            ) {
                                                headerRequired = true;
                                                var anyChanges = enroller._checkForUnsavedChanges(step);
                                                enroller._checkStatusAndBuildParams(stepDetails.FIELDS, function(
                                                    params,
                                                    requiredComplete,
                                                    complete
                                                ) {
                                                    if (complete && requiredComplete && !anyChanges) {
                                                        stepInfo = enroller._createInformationField(
                                                            stepDetails.DISPLAY,
                                                            "Complete"
                                                        );
                                                    } else if (requiredComplete && !anyChanges) {
                                                        stepInfo = enroller._createInformationField(
                                                            stepDetails.DISPLAY,
                                                            "Required Complete"
                                                        );
                                                    } else {
                                                        stepInfo = enroller._createInformationField(
                                                            stepDetails.DISPLAY,
                                                            "Incomplete"
                                                        );
                                                        if (enroller.options.must_complete_required) {
                                                            allCompleted = false;
                                                        }
                                                    }
                                                });
                                            }
                                            if (enroller.options.enroller_steps[step].TYPE == "portfolio") {
                                                headerRequired = true;
                                                /*add logic to determine if */
                                                if ($("#" + step + "_step").data("completed")) {
                                                    stepInfo = enroller._createInformationField(
                                                        stepDetails.DISPLAY,
                                                        "Complete"
                                                    );
                                                } else if (
                                                    enroller.options.enroller_steps[step].portfolio_optional ==
                                                        true ||
                                                    enroller.options.enroller_steps[step].PORTFOLIO_OPTIONAL == true
                                                ) {
                                                    stepInfo = enroller._createInformationField(
                                                        stepDetails.DISPLAY,
                                                        "Complete"
                                                    );
                                                } else {
                                                    portfolioCompleted = false;
                                                    stepInfo = enroller._createInformationField(
                                                        stepDetails.DISPLAY,
                                                        "Incomplete"
                                                    );
                                                }
                                            }

                                            if (enroller.options.enroller_steps[step].TYPE == "usi-validation") {
                                                var usiDat = enroller.element.data('usi_verified');
                                                if (usiDat == null) {
                                                    allCompleted = false;
                                                }
                                                else if (usiDat[enroller.options.contact_id] !== true) {
                                                    allCompleted = false;
                                                }
                                            }


                                            if (enroller.options.show_step_info_block != true) {
                                                stepInfo = null;
                                                headerRequired = false;
                                            }
                                            if (stepInfo != null && enroller.options.show_step_info_block == true) {
                                                stepInfoBlock.append(stepInfo);
                                                stepInfo
                                                    .find(".enroller-info-text")
                                                    .addClass("enroller-step-status");
                                                /* Hover too buggy - Remove
                                                    stepInfo.find('.enroller-info-text').hover(
                                                        function(e) {
                                                            e.stopPropagation();
                                                            var message = enroller._getStepStatusMessage(
                                                                step
                                                            );
                                                            if (message != "") {
                                                                enroller._toolTip(stepInfo, message);
                                                            }
                                                        },
                                                        function(e) {
                                                            e.stopPropagation();
                                                            $("#tooltipPop").popup("close");
                                                        }
                                                    );
                                                    */
                                            }
                                        });

                                        if (!headerRequired) {
                                            header.hide();
                                        }

                                        var continueButton = $(
                                            '<button class="enroller-save-button ui-btn-icon-right ui-icon-arrow-r ui-btn ui-btn-active" data-role="button">Continue ' +
                                                enroller.options.enrolment_terminology +
                                                "</button>"
                                        );

                                        var continueHolder = enroller._createInformationField(
                                            "Continue Enrolment",
                                            ""
                                        );
                                        continueHolder.find("div.enroller-text-field").remove();
                                        continueHolder
                                            .find("div.enroller-field-label")
                                            .text("")
                                            .css("background", "transparent")
                                            .css("border", "none");
                                        continueHolder.css("margin-top", "3em");

                                        continueButton.on("click", function() {
                                            var payerDataCheck = true;
                                            if (
                                                enroller.options.payer_address_required == true &&
                                                enroller.options.allow_update_payer_details == true
                                            ) {
                                                if (enroller.element.data("payer_data") != null) {
                                                    var pData = enroller.element.data("payer_data");
                                                    var streetName =
                                                        pData.STREETNAME == null || pData.STREETNAME == "";
                                                    var streetNo = pData.STREETNO == null || pData.STREETNO == "";
                                                    var pobox = pData.POBOX == null || pData.POBOX == "";
                                                    var country = pData.COUNTRYID == null || pData.COUNTRYID == "";
                                                    var state = pData.STATE == null || pData.STATE == "";
                                                    if (enroller.options.payer_australia_only === true) {
                                                
                                                        var ausStates = ['NSW', 'VIC',"QLD", "SA", "WA", "TAS", "NT", "ACT"];
                                                        if (pData.COUNTRYID + "" !== "1101") {
                                                            country = true;
                                                        }
                                                        if(!state  && ausStates.indexOf(pData.STATE) === -1){
                                                            state = true; // did not pass
                                                        }
                                                    }

                                                    if (((streetName || streetNo) && pobox) ||  country || state) {
                                                        payerDataCheck = false;
                                                        if ($("#payer_details").length) {
                                                            $("#payer_details a").trigger("click");
                                                            enroller._displayError(
                                                                "payer_details",
                                                                "Payer address details are required"
                                                            );
                                                        }
                                                        enroller._scrollToElement("#payer_details", function() {});
                                                    }
                                                }
                                            }
                                            if (payerDataCheck) {
                                                if (portfolioCompleted && allCompleted) {

                                                 
                                                    if( enroller.options.payer_abn_review === true && $('#payerABN').length >-1){
                                                        var abn = $('#payerABN').val();
                                                        var disabledAbn = $('#payerABN').attr('disabled');
                                                        if(!disabledAbn && abn != null && abn !== ""){
                                                            var valid = enroller._regexIsValid('[0-9]{11}', abn);
                                                            if(!valid){
                                                              
                                                                enroller._scrollToElement("#payerABN", function() {});
                                                            }
                                                            else{
                                                                var payerOrg = enroller.element.data('payer_org_data');
                                                                if(enroller.options.payer_abn_update && payerOrg && payerOrg.ORGID){
                                                                    enroller.options.payer_abn_update({
                                                                        org_id: payerOrg.ORGID,
                                                                        abn:abn
                                                                    }, function(data){
                                                                        if(data && data.ORGID){
                                                                            enroller.element.data('payer_org_data', null);
                                                                            enroller._reviewContinue();
                                                                        }
                                                                    })
                                                                }
                                                            }
                                                        }
                                                        else{
                                                            enroller._reviewContinue();
                                                        }
                                                        
                                                    }
                                                    else{
                                                        enroller._reviewContinue();
                                                    }
                                                } else {
                                                    /*use billing to force the widget to select an incomplete step*/
                                                    enroller._changeStep("billing");
                                                }
                                            }
                                        });
                                        if (enroller.options.step_order.indexOf("billing") > 0) {
                                            var instanceVacancy = enroller._reviewCheckInstanceVacancy(
                                                instanceData
                                            );
                                            enroller._checkForEnrolmentHashes();

                                            if (instanceVacancy.available == true) {
                                                $("#review_step").append(continueHolder.append(continueButton));
                                            } else if (instanceVacancy.reason == "no_spaces") {
                                                continueHolder = enroller._createInformationField(
                                                    "Continue",
                                                    "No Spaces Remain"
                                                );
                                                $("#review_step").append(continueHolder);
                                                enroller._alert("There are no remaining spaces on this course.");
                                            } else if (instanceVacancy.reason == "multiple_limit") {
                                                continueHolder = enroller._createInformationField(
                                                    "Continue",
                                                    "No Spaces Remain"
                                                );
                                                $("#review_step").append(continueHolder);
                                                enroller._alert(
                                                    "You've reached the available spaces for this course."
                                                );
                                            }

                                            if (
                                                instanceVacancy.available == false &&
                                                (enroller.options.group_booking == true ||
                                                    enroller.options.agent_multiple == true) &&
                                                enroller.options.multiple_courses != null
                                            ) {
                                                var continueOther = $(
                                                    '<button class="enroller-save-button ui-btn-icon-right ui-icon-arrow-r ui-btn ui-btn-active" data-role="button">Continue Previous ' +
                                                        enroller.options.enrolment_terminology +
                                                        "</button>"
                                                );

                                                var conOtherHolder = enroller._createInformationField(
                                                    "Continue Other",
                                                    ""
                                                );
                                                conOtherHolder.find("div.enroller-text-field").remove();
                                                conOtherHolder
                                                    .find("div.enroller-field-label")
                                                    .text("")
                                                    .css("background", "transparent")
                                                    .css("border", "none");
                                                conOtherHolder.css("margin-top", "3em");
                                                continueOther.on("click", function() {
                                                    if (enroller.options.group_booking == true) {
                                                        enroller._changeStep("groupBooking");
                                                    } else if (enroller.options.agent_multiple == true) {
                                                        enroller._changeStep("agentCourses");
                                                    }
                                                });
                                                var blurbConOther = enroller._createBlurb(
                                                    "You cannot enrol this " +
                                                        enroller.options.terminology_student +
                                                        " into the selected " +
                                                        enroller.options.instance_terminology +
                                                        ", but other " +
                                                        enroller.options.enrolment_terminology +
                                                        "(s) remain valid. Click the button below to continue with those " +
                                                        enroller.options.enrolment_terminology +
                                                        "(s)."
                                                );

                                                $("#review_step").append(blurbConOther);
                                                $("#review_step").append(conOtherHolder.append(continueOther));
                                            }

                                            if (instanceVacancy.available) {
                                                if (stepOptions.TERMS != null) {
                                                    var terms = enroller._createTerms(stepOptions.TERMS);
                                                    continueButton.addClass("ui-disabled").prop("disabled", true);
                                                    terms[0].insertBefore(continueHolder);
                                                    terms[1].insertBefore(continueHolder);
                                                }
                                            }
                                        }

                                        /*Bottom Blurb*/
                                        if (stepOptions.BLURB_BOTTOM != null && stepOptions.BLURB_BOTTOM != "") {
                                            var blurbB = enroller._createBlurb(stepOptions.BLURB_BOTTOM);
                                            $("#review_step").append(blurbB);
                                        }
                                        enhanceAfterAjax($("#review_step"));
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },

        /*Cart Review Step*/

        _displayCartReviewStep: function() {
            $("#review_step").empty();
            var stepOptions = enroller.options.enroller_steps.review;
            var canEnrol = true;

            /*check a payer has been set*/
            var payerCheckPass = enroller._reviewStepPayerCheck();

            if (enroller.element.data("payer_data") == null && payerCheckPass) {
                payerCheckPass = false;
                if (enroller.options.payer_id != 0) {
                    enroller._confirmContactIsInAccount(enroller.options.payer_id, function(data) {
                        enroller.element.data("payer_data", data);
                        enroller._displayReviewStep();
                    });
                }
            } else if (payerCheckPass && enroller.element.data("payer_data") != null) {
                if (enroller.options.payer_id != 0) {
                    if (enroller.options.payer_id != enroller.element.data("payer_data").CONTACTID) {
                        enroller._confirmContactIsInAccount(enroller.options.payer_id, function(data) {
                            enroller.element.data("payer_data", data);
                            enroller._displayReviewStep();
                        });
                    }
                }
            }

            if (payerCheckPass && enroller._reviewStepABNCheck()) {
                if (stepOptions.BLURB_TOP != null && stepOptions.BLURB_TOP != "") {
                    var blurbT = enroller._createBlurb(stepOptions.BLURB_TOP);
                    $("#review_step").append(blurbT);
                }
                if (stepOptions.HEADER) {
                    var headerInfo = {
                        INFO_ONLY: true,
                        TYPE: "header",
                        DISPLAY: stepOptions.HEADER
                    };
                    $("#review_step").prepend(enroller._createInfoFieldDetailed("review_step_header", headerInfo));
                }

                /*check we have information about the contact being enrolled*/
                var contactData = enroller.element.data("contact_data");
                if (enroller._reviewStepContactDataCheck()) {
                    if (contactData.CONTACTID !== enroller.options.contact_id) {
                        /*wipe data and use the check to retrieve fresh data*/
                        enroller.element.data("contact_data", null);
                        enroller._reviewStepContactDataCheck();
                    } else {
                        /*Perform async API calls to get data for all the instances selected
						 * nescessary to ensure we don't book someone into a course that has since filled 
						 * Use referenced object passed to each async call to confirm completion */
                        var callsToComplete = {};
                        var noMoreToCheck = true;
                        var firstCourse = true;
                        var runEnhance = true;
                        $.each(enroller.options.cart_course_override, function(identifier, courseData) {
                            var instanceData = enroller.element.data("instance_" + identifier);

                            /* Add the first course as the selected course
							 * This avoids issues progressing with the courses step (if present) being incomplete*/
                            if (firstCourse) {
                                enroller.options.course = {
                                    INSTANCEID: parseInt(courseData.instance_id),
                                    ID: parseInt(courseData.course_id),
                                    TYPE: courseData.course_type
                                };
                                firstCourse = false;
                            }

                            if (instanceData == null) {
                                if (firstCourse) {
                                    if (enroller.options.multiple_courses == null) {
                                        enroller.element.data("allow_public_inhouse", null);
                                    }
                                }
                                var overrideParams = {
                                    startDate_min: "2000-01-01",
                                    startDate_max: "2030-01-01",
                                    finishDate_min: "2000-01-01",
                                    finishDate_max: "2030-01-01",
                                    INSTANCEID: courseData.instance_id,
                                    TYPE: courseData.course_type
                                };
                                if (enroller.options.allow_inhouse_enrolment == true) {
                                    overrideParams.everything = 1;
                                }
                                callsToComplete[identifier] = false;
                                noMoreToCheck = false;
                                enroller._fetchAndUpdateInstanceData(function(updatedInstanceData) {
                                    /*add displayPrice and alter name as it is expected*/
                                    updatedInstanceData = enroller._modifyInstanceData(updatedInstanceData);
                                    enroller.element.data("instance_" + identifier, updatedInstanceData);
                                    callsToComplete[identifier] = true;
                                    function continueLoading() {
                                        var allComplete = true;

                                        if (!$.isEmptyObject(callsToComplete)) {
                                            $.each(callsToComplete, function(key, complete) {
                                                if (!complete) {
                                                    allComplete = false;
                                                }
                                            });
                                        }
                                        if (allComplete) {
                                            enroller._displayReviewStep();
                                        }
                                    }
                                    continueLoading();
                                }, overrideParams);
                            }
                        });

                        if (noMoreToCheck) {
                            /** Able to enrol Check **/
                            var portfolioCompleted = true;
                            var allCompleted = true;
                            $.each(enroller.options.step_order, function(i, step) {
                                var stepDetails = enroller.options.enroller_steps[step];
                                //var stepInfo = null;
                                if (
                                    stepDetails.TYPE == "contact-update" ||
                                    stepDetails.TYPE == "contact-note" ||
                                    stepDetails.TYPE == "enrol-details" ||
                                    stepDetails.TYPE == "course-enquiry"
                                ) {
                                    var anyChanges = enroller._checkForUnsavedChanges(step);
                                    enroller._checkStatusAndBuildParams(stepDetails.FIELDS, function(
                                        params,
                                        requiredComplete,
                                        complete
                                    ) {
                                        if (complete && requiredComplete && !anyChanges) {
                                            //stepInfo =enroller._createInformationField(stepDetails.DISPLAY, "Complete");
                                        } else if (requiredComplete && !anyChanges) {
                                            //stepInfo = enroller._createInformationField(stepDetails.DISPLAY, "Required Complete");
                                        } else {
                                            //stepInfo = enroller._createInformationField(stepDetails.DISPLAY, "Incomplete");
                                            if (enroller.options.must_complete_required) {
                                                allCompleted = false;
                                            }
                                        }
                                    });
                                }
                                if (enroller.options.enroller_steps[step].TYPE == "portfolio") {
                                    /*add logic to determine if */
                                    if ($("#" + step + "_step").data("completed")) {
                                        //stepInfo = enroller._createInformationField(stepDetails.DISPLAY, "Complete");
                                    } else if (
                                        enroller.options.enroller_steps[step].portfolio_optional == true ||
                                        enroller.options.enroller_steps[step].PORTFOLIO_OPTIONAL == true
                                    ) {
                                        portfolioCompleted = true;
                                    } else {
                                        portfolioCompleted = false;
                                        //stepInfo = enroller._createInformationField(stepDetails.DISPLAY, "Incomplete");
                                    }
                                }
                                if (enroller.options.enroller_steps[step].TYPE == "usi-validation") {
                                    var usiDat = enroller.element.data('usi_verified');
                                    if (usiDat == null) {
                                        allCompleted = false;
                                    }
                                    else if (usiDat[enroller.options.contact_id] !== true){
                                        allCompleted = false;
                                    }
                                }
                                /*if(stepInfo != null){
									$('#review_step').append(stepInfo);
									stepInfo.addClass('enroller-step-status');
									stepInfo.hover(function(e){
										e.stopPropagation();
										var message = enroller._getStepStatusMessage(step);
										if(message != ""){
											enroller._toolTip(stepInfo, message);
										}
										
									}, function(e){
										e.stopPropagation();
										$('#tooltipPop').popup("close");
									});
								}*/
                            });

                            var continueButton = $(
                                '<button class="enroller-save-button ui-btn-icon-right ui-icon-arrow-r ui-btn ui-btn-active" data-role="button">Continue ' +
                                    enroller.options.enrolment_terminology +
                                    "</button>"
                            );

                            var continueHolder = enroller._createInformationField("Continue Enrolment", "");
                            continueHolder.find("div.enroller-text-field").remove();
                            continueHolder
                                .find("div.enroller-field-label")
                                .text("")
                                .css("background", "transparent")
                                .css("border", "none");
                            continueHolder.css("margin-top", "3em");

                            continueButton.on("click", function() {
                                var payerDataCheck = true;
                                if (
                                    enroller.options.payer_address_required == true &&
                                    enroller.options.allow_update_payer_details == true
                                ) {
                                    if (enroller.element.data("payer_data") != null) {

                                        var pData = enroller.element.data("payer_data");
                                        var streetName =
                                            pData.STREETNAME == null || pData.STREETNAME == "";
                                        var streetNo = pData.STREETNO == null || pData.STREETNO == "";
                                        var pobox = pData.POBOX == null || pData.POBOX == "";
                                        var country = pData.COUNTRYID == null || pData.COUNTRYID == "";
                                        var state = pData.STATE == null || pData.STATE == "";
                                        if (enroller.options.payer_australia_only === true) {

                                            var ausStates = ['NSW', 'VIC', "QLD", "SA", "WA", "TAS", "NT", "ACT"];
                                            if (pData.COUNTRYID + "" !== "1101") {
                                                country = true;
                                            }
                                            if (!state && ausStates.indexOf(pData.STATE) === -1) {
                                                state = true; // did not pass
                                            }
                                        }

                                        if (((streetName || streetNo) && pobox) || country || state) {
                                            payerDataCheck = false;
                                            if ($("#payer_details").length) {
                                                // Switch back to the first course where payer details are shown.
                                                var firstCourse = $(
                                                    "#instance_" +
                                                        Object.keys(enroller.options.cart_course_override)[0] +
                                                        "_link"
                                                );
                                                firstCourse.trigger("click");

                                                $("#payer_details a").trigger("click");
                                                enroller._displayError(
                                                    "payer_details",
                                                    "Payer address details are required"
                                                );
                                            }
                                            enroller._scrollToElement("#payer_details", function() {});
                                        }
                                    }
                                }
                                if (payerDataCheck) {

                                    if (portfolioCompleted && allCompleted) {

                                        if( enroller.options.payer_abn_review === true && $('#payerABN').length >-1){
                                    
                                            var abn = $('#payerABN').val();
                                            var disabledAbn = $('#payerABN').attr('disabled');
                                            if(!disabledAbn && abn != null && abn !== ""){
                                                var valid = enroller._regexIsValid('[0-9]{11}', abn);
                                                if(!valid){
                                                    enroller._scrollToElement("#payerABN", function() {});
                                                }
                                                else{
                                                    var payerOrg = enroller.element.data('payer_org_data');
                                                    if(enroller.options.payer_abn_update && payerOrg && payerOrg.ORGID){
                                                        enroller.options.payer_abn_update({
                                                            org_id: payerOrg.ORGID,
                                                            abn:abn
                                                        }, function(data){
                                                            if(data && data.ORGID){
                                                                enroller.element.data('payer_org_data', null);
                                                                enroller._reviewCartContinue();
                                                            }
                                                        })
                                                    }
                                                }
                                            }
                                            else{
                                                enroller._reviewCartContinue();
                                            }
                                        }
                                        else{
                                            enroller._reviewCartContinue();
                                        }
                                    } else {
                                        /*use billing to force the widget to select an incomplete step*/
                                        enroller._changeStep("billing");
                                    }
                                }
                            });

                            //standard instance data.
                            var courseTabHolder = $('<div class="enroller-course-tabs"></div>');
                            var tabNav = $('<div data-role="navbar" ></div>');
                            var tabNavUl = $("<ul></ul>");
                            courseTabHolder.append(tabNav);
                            tabNav.append(tabNavUl);
                            $("#review_step").append(courseTabHolder);

                            var count = 0;

                            $.each(enroller.options.cart_course_override, function(identifier, courseData) {
                                var instanceData = enroller.element.data("instance_" + identifier);

                                var courseTab = $('<div class="enroller-course-tab" data-role="tabpanel"></div>');

                                var courseName =
                                    courseData.course_name != null
                                        ? courseData.course_name
                                        : instanceData.COURSENAME
                                            ? instanceData.COURSENAME
                                            : "";
                                var tabLink = $(
                                    '<li style="width:100%; font-size:1em; margin:0; text-align: left;"><a id="instance_' +
                                        identifier +
                                        '_link" style="font-size:1em;margin:0;padding-right:2em; text-align:left"  data-ajax="false">' +
                                        instanceData.CODE +
                                        ": " +
                                        courseName +
                                        "</a></li>"
                                );
                                tabLink.on("click", function(e) {
                                    e.preventDefault();
                                    $("#review_step .enroller-course-tab").hide();
                                    courseTab.show(200);
                                    tabNavUl.find(".ui-btn-active").removeClass("ui-btn-active");
                                    tabLink.find("a").addClass("ui-btn-active");
                                });
                                if (count == 0) {
                                    tabLink.find("a").addClass("ui-btn-active");
                                } else {
                                    courseTab.hide();
                                }
                                count++;
                                tabNavUl.append(tabLink);
                                courseTab.attr("id", identifier);
                                courseTabHolder.append(courseTab);

                                enroller._reviewStepCourseInfoBlock(
                                    contactData,
                                    instanceData,
                                    "#" + identifier,
                                    false,
                                    true
                                );


                                if( enroller.options.payer_abn_review === true && count === 1){
                                    var abnLocation = $('#review_step').find('.abn-placeholder');
                                    if(Array.isArray && Array.isArray(abnLocation) ){
                                        abnLocation = abnLocation[0];
                                    }
                                    if(abnLocation){
                                        enroller._reviewStepOrgABNBlock(abnLocation);
                                    }
                                    else{
                                        enroller._reviewStepOrgABNBlock("#review_step");
                                    }
                                    
                                }




                                if (instanceData.COST != 0 && instanceData.COST != null) {
                                    courseTab.data("cost", instanceData.COST);
                                    var discountsAvail =
                                        instanceData.PUBLIC == true ||
                                        enroller.options.allow_mixed_inhouse_public == true;

                                    if (enroller.options.get_discounts != null && discountsAvail) {
                                        var discountBlock = enroller._reviewStepDiscountsBlock(
                                            "#" + identifier,
                                            courseData.instance_id,
                                            courseData.course_id,
                                            courseData.course_type
                                        );

                                        var promoCode = courseTab
                                            .find("#promoCode_" + courseData.instance_id)
                                            .val();
                                        var discountParams = {
                                            contactID: enroller.options.contact_id,
                                            instanceID: courseData.instance_id,
                                            type: courseData.course_type,
                                            originalPrice: parseFloat(instanceData.COST)
                                        };
                                        courseTab
                                            .find("#calculate_" + courseData.instance_id)
                                            .on("click", function(e) {
                                                e.preventDefault();
                                                var concessions = enroller._getSelectedConcessions(
                                                    "#concessionList_" + courseData.instance_id,
                                                    "concessionHolder_" + courseData.instance_id
                                                );
                                                promoCode = courseTab
                                                    .find("#promoCode_" + courseData.instance_id)
                                                    .val();
                                                enroller._calculateCartDiscount(
                                                    discountParams,
                                                    concessions,
                                                    promoCode,
                                                    function(discounts) {
                                                        if (
                                                            discounts.REVISEDPRICE < parseFloat(instanceData.COST)
                                                        ) {
                                                            courseTab.data(
                                                                "discounts_selected",
                                                                discounts.DISCOUNTSAPPLIED
                                                            );
                                                            courseTab.data("cost", discounts.REVISEDPRICE);
                                                        } else {
                                                            courseTab.data("discounts_selected", null);
                                                            courseTab.data("cost", instanceData.COST);
                                                        }

                                                        enroller._displayOrUpdateDiscountDisplay(
                                                            discounts,
                                                            discountBlock
                                                        );
                                                        enhanceAfterAjax(
                                                            $("#review_step"),
                                                            enroller._updateTotalCostDisplay
                                                        );
                                                        //$("#review_step").enhanceWithin();
                                                    }
                                                );
                                            });
                                        enroller._calculateCartDiscount(discountParams, null, promoCode, function(
                                            discounts
                                        ) {
                                            if (discounts.REVISEDPRICE < parseFloat(instanceData.COST)) {
                                                courseTab.data("discounts_selected", discounts.DISCOUNTSAPPLIED);
                                                courseTab.data("cost", discounts.REVISEDPRICE);
                                            } else {
                                                courseTab.data("discounts_selected", null);
                                                courseTab.data("cost", instanceData.COST);
                                            }
                                            enroller._displayOrUpdateDiscountDisplay(discounts, discountBlock);

                                            enhanceAfterAjax($("#review_step"), enroller._updateTotalCostDisplay);
                                            //$("#review_step").enhanceWithin();
                                        });
                                    }
                                }

                                var removeHeader = {
                                    DISPLAY: "Review Course",
                                    TYPE: "information",
                                    INFO_ONLY: true
                                };
                                var rHeader = enroller._createInputField("r_header", removeHeader);
                                $("#" + identifier).append(rHeader);

                                if (enroller.options.step_order.indexOf("billing") > 0) {
                                    var instanceVacancy = enroller._reviewCheckInstanceVacancy(instanceData);
                                    $("#" + identifier).data("can_enrol", instanceVacancy.available);
                                    if (instanceVacancy.available == false) {
                                        canEnrol = false;
                                        if (instanceVacancy.reason == "no_spaces") {
                                            var instanceMessage = enroller._createInformationField(
                                                "Cannot Enrol",
                                                "No Spaces Remain"
                                            );
                                            courseTab.append(instanceMessage);
                                        } else if (instanceVacancy.reason == "multiple_limit") {
                                            var instanceMessage = enroller._createInformationField(
                                                "Cannot Enrol",
                                                "No Spaces Remain"
                                            );
                                            courseTab.append(instanceMessage);
                                        }
                                    }
                                }

                                if (
                                    enroller.options.workshop_extra_billable_items === true &&
                                    courseData.course_type === "w"
                                ) {
                                    var continueReview = true;
                                    var extraItemData = enroller.element.data("extra_item_data");

                                    var instanceRef = courseData.instance_id + "_" + courseData.course_type;
                                    courseTab.data("instance_ref", instanceRef);
                                    if (extraItemData == null) {
                                        extraItemData = {};
                                        continueReview = false;
                                    } else if (extraItemData[instanceRef] === undefined) {
                                        continueReview = false;
                                    }

                                    if (!continueReview) {
                                        enroller._reviewStepExtraItems(
                                            courseData.instance_id,
                                            courseData.course_type,
                                            function(response) {
                                                extraItemData = enroller.element.data("extra_item_data");
                                                if (extraItemData == null) {
                                                    extraItemData = {};
                                                }
                                                if (response && response.error == null) {
                                                    extraItemData[instanceRef] = response;
                                                    enroller.element.data("extra_item_data", extraItemData);
                                                } else {
                                                    extraItemData[instanceRef] = null;
                                                    enroller.element.data("extra_item_data", extraItemData);
                                                }

                                                var extraItems = enroller._generateExtraItemsDisplay(
                                                    extraItemData[instanceRef],
                                                    enroller.options.contact_id,
                                                    courseData.instance_id,
                                                    courseData.course_type,
                                                    enroller._updateTotalCostDisplay
                                                );
                                                if (rHeader.length && extraItems != null) {
                                                    extraItems.insertBefore(rHeader);
                                                }
                                            }
                                        );
                                    } else {
                                        var extraItems = enroller._generateExtraItemsDisplay(
                                            extraItemData[instanceRef],
                                            enroller.options.contact_id,
                                            courseData.instance_id,
                                            courseData.course_type,
                                            enroller._updateTotalCostDisplay
                                        );

                                        if (rHeader.length && extraItems != null) {
                                            extraItems.insertBefore(rHeader);
                                        }
                                    }
                                }

                                var flipS = {
                                    ID: "reviewed_" + identifier,
                                    DISPLAY: "Reviewed",
                                    TYPE: "flip-switch",
                                    FS_OFFTEXT: "Details Correct?",
                                    FS_ONTEXT: "Details Confirmed",
                                    INFO_ONLY: true,
                                    REQUIRED: false
                                };
                                var reviewCheck = enroller._createInputField("reviewed_" + identifier, flipS);
                                $("#" + identifier).append(reviewCheck);

                                var removeC = {
                                    ID: "remove_" + identifier,
                                    DISPLAY: "Remove " + enroller.options.course_terminology,
                                    TYPE: "button",
                                    INFO_ONLY: true
                                };
                                var removeButton = enroller._createInputField("remove_" + identifier, removeC);

                                reviewCheck.on("change", function(e) {
                                    var status = enroller._getInputValue("reviewed_" + identifier, flipS);
                                    enroller._checkForEnrolmentHashes({
                                        instance_id: courseData.instance_id,
                                        course_type: courseData.course_type
                                    });
                                    courseTab.data("reviewed", status);
                                    if (status) {
                                        tabLink.addClass('ui-btn-icon-right ui-btn ui-icon-check');
                                        
                                        $("#remove_" + identifier)
                                            .addClass("ui-disabled")
                                            .prop("disabled", true);
                                        var current = Object.keys(enroller.options.cart_course_override).indexOf(
                                            identifier
                                        );
                                        if (
                                            current <
                                            Object.keys(enroller.options.cart_course_override).length - 1
                                        ) {
                                            var nextCourse = $(
                                                "#instance_" +
                                                    Object.keys(enroller.options.cart_course_override)[
                                                        current + 1
                                                    ] +
                                                    "_link"
                                            );
                                            nextCourse.trigger("click");
                                            enroller._scrollToElement(
                                                $(
                                                    "#" +
                                                        Object.keys(enroller.options.cart_course_override)[
                                                            current + 1
                                                        ]
                                                )
                                            );
                                        } else {
                                            enroller._scrollToElement($("#review_step .enroller-cart-total-cost"));
                                        }
                                    } else {
                                        tabLink.removeClass('ui-btn-icon-right ui-icon-check');
                                        $("#remove_" + identifier)
                                            .removeClass("ui-disabled")
                                            .prop("disabled", false);
                                    }
                                    enroller.element.trigger("enroller:reviewed_course_status", {
                                        identifier: identifier,
                                        status: status
                                    });
                                });

                                $("#" + identifier).append(removeButton);
                                $("#remove_" + identifier).addClass("ui-btn-icon-right ui-icon-delete");
                                removeButton.on("click", "#remove_" + identifier, function(e) {
                                    delete enroller.options.cart_course_override[identifier];
                                    if ($.isEmptyObject(enroller.options.cart_course_override)) {
                                        enroller.options.cart_course_override = null;
                                        enroller._changeStep(
                                            enroller.options.step_order[
                                                enroller.options.step_order.indexOf("review") - 1
                                            ]
                                        );
                                    } else {
                                        enroller._displayReviewStep();
                                        return false;
                                    }
                                });
                            });

                            //new total cost block
                            //Total Cost
                            var feeHeader = {
                                DISPLAY: "Total " + enroller.options.course_terminology + " Fees",
                                TYPE: "information",
                                INFO_ONLY: true
                            };

                            $("#review_step").append(enroller._createInputField("total_header", feeHeader));
                            // Fee
                            var costDisplay = enroller._createInformationField(
                                enroller.options.cost_terminology,
                                ""
                            );
                            costDisplay.addClass("enroller-cart-total-cost");
                            if (enroller.options.hide_cost_fields != true) {
                                $("#review_step").append(costDisplay);
                                enroller._updateTotalCostDisplay();
                            }

                            //Reviewed all Checkbox
                            if (canEnrol) {
                                $("#review_step").append(continueHolder.append(continueButton));
                                continueButton.addClass("ui-disabled").prop("disabled", true);
                                continueButton.data("original_text", continueButton.text());
                                continueButton.text("Complete Review to Enrol");

                                enroller.element.on("enroller:reviewed_course_status", function(e, payload) {
                                    if (payload.status) {
                                        var allReviewed = true;
                                        $(".enroller-course-tab").each(function(e) {
                                            var thisTab = $(this);
                                            if (thisTab.data("reviewed") != true) {
                                                allReviewed = false;
                                            }
                                        });

                                        if (allReviewed) {

                                            if (stepOptions.TERMS != null) {
                                                var termsComplete = $("#review_step").data('terms_completed');
                                                if(termsComplete != true){
                                                    return false;
                                                }
                                            }
                                            continueButton.removeClass("ui-disabled").prop("disabled", false);
                                            continueButton.text(continueButton.data("original_text"));
                                        }
                                    } else {
                                        continueButton.addClass("ui-disabled").prop("disabled", true);
                                        continueButton.text("Complete Review to Enrol");
                                    }
                                });

                                if (stepOptions.TERMS != null) {
                                    var terms = enroller._createTerms(stepOptions.TERMS, function(){
                                        var allReviewed = true;
                                        $(".enroller-course-tab").each(function(e) {
                                            var thisTab = $(this);
                                            if (thisTab.data("reviewed") != true) {
                                                allReviewed = false;
                                            }
                                        });
                                        return allReviewed;
                                    });
                                    // HERE
                                    continueButton.addClass("ui-disabled").prop("disabled", true);
                                    terms[0].insertBefore(continueHolder);
                                    terms[1].insertBefore(continueHolder);
                                }
                            } else {
                                // If previous enrolments (multiple_courses)exist  then add a button to jump to the group booking/agent step.
                                if (
                                    (enroller.options.group_booking == true ||
                                        enroller.options.agent_multiple == true) &&
                                    enroller.options.multiple_courses != null
                                ) {
                                    var continueOther = $(
                                        '<button class="enroller-save-button ui-btn-icon-right ui-icon-arrow-r ui-btn ui-btn-active" data-role="button">Continue Previous ' +
                                            enroller.options.enrolment_terminology +
                                            "</button>"
                                    );

                                    var conOtherHolder = enroller._createInformationField("Continue Other", "");
                                    conOtherHolder.find("div.enroller-text-field").remove();
                                    conOtherHolder
                                        .find("div.enroller-field-label")
                                        .text("")
                                        .css("background", "transparent")
                                        .css("border", "none");
                                    conOtherHolder.css("margin-top", "3em");
                                    continueOther.on("click", function() {
                                        if (enroller.options.group_booking == true) {
                                            enroller._changeStep("groupBooking");
                                        } else if (enroller.options.agent_multiple == true) {
                                            enroller._changeStep("agentCourses");
                                        }
                                    });
                                    var blurbConOther = enroller._createBlurb(
                                        "You cannot enrol this " +
                                            enroller.options.terminology_student +
                                            " into the selected " +
                                            enroller.options.instance_terminology +
                                            ", but other " +
                                            enroller.options.enrolment_terminology +
                                            "(s) remain valid. Click the button below to continue with those " +
                                            enroller.options.enrolment_terminology +
                                            "(s)."
                                    );

                                    $("#review_step").append(blurbConOther);
                                    $("#review_step").append(conOtherHolder.append(continueOther));
                                }
                            }

                            //Continue button
                        }

                        enhanceAfterAjax($("#review_step"), enroller._updateTotalCostDisplay); // CALLED HERE?
                    }
                }
            }
        },

        _updateTotalCostDisplay: function() {
            if ($("#review_step:visible").length && enroller.options.hide_cost_fields != true) {
                var total = 0;
                $("#review_step div.enroller-course-tab").each(function(e) {
                    var tab = $(this);

                    if (tab.data("cost") != null) {
                        var instanceCost = parseFloat(tab.data("cost"));
                        total += instanceCost;
                    }
                    if (enroller.options.workshop_extra_billable_items === true) {
                        if (tab.data("instance_ref") != null) {
                            var enrolRef = enroller.options.contact_id + "_" + tab.data("instance_ref");
                            var itemData = enroller.element.data("extra_items_selected");
                            if (itemData != null) {
                                var selected = itemData[enrolRef];

                                if (selected != null) {
                                    $.each(selected, function(id, selected) {
                                        if (selected) {
                                            var item = enroller._getItem(id);
                                            if (item != null && item.error == null) {
                                                total += item.DEFAULTPRICE;
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    }
                });

                var formatted = enroller._currencyDisplayFormat(total);
                $("#review_step .enroller-cart-total-cost .enroller-info-text")
                    .empty()
                    .append(formatted);
            }
        },

        _reviewCartContinue: function() {
            //Loop Courses
            var existingEnrolmentCheckComplete = {};
            $.each(enroller.options.cart_course_override, function(identifier, courseData) {
                existingEnrolmentCheckComplete[identifier] = {
                    has_enrolment: false,
                    check_complete: false
                };
                var paramsOverride = {
                    instanceID: courseData.instance_id,
                    contactID: enroller.options.contact_id,
                    type: courseData.course_type
                };
                enroller._checkForExistingEnrolment(function(alreadyEnrolled) {
                    if (alreadyEnrolled) {
                        existingEnrolmentCheckComplete[identifier] = {
                            has_enrolment: true,
                            check_complete: true
                        };
                    } else {
                        existingEnrolmentCheckComplete[identifier] = {
                            has_enrolment: false,
                            check_complete: true
                        };
                    }

                    continueEnrolment(courseData);
                }, paramsOverride);
            });

            function continueEnrolment(courseData) {
                if (existingEnrolmentCheckComplete != null) {
                    if (!$.isEmptyObject(existingEnrolmentCheckComplete)) {
                        var enrolmentReady = true;
                        $.each(existingEnrolmentCheckComplete, function(enrol_identifier, status) {
                            if (status.check_complete != true) {
                                enrolmentReady = false;
                                return false;
                            } else if (status.has_enrolment) {
                                enrolmentReady = false;
                                enroller._alert("Student already enrolled in " + courseData.course_name);
                                return false;
                            }
                        });
                        if (enrolmentReady) {
                            $.each(existingEnrolmentCheckComplete, function(enrol_identifier, status) {
                                var instanceData = enroller.element.data("instance_" + enrol_identifier);
                                var enrolParams = enroller._enrolCartParams("enrol", enrol_identifier);
                                if (enroller._enrolAdvancedParams() != null) {
                                    $.each(enroller._enrolAdvancedParams(), function(key, value) {
                                        enrolParams[key] = value;
                                    });
                                }

                                /*Enable the syncWithClassSchedule setting if the sync_with_class_schedule setting is enabled. 
                                This setting will override the syncDatesWithWorkshop setting*/
                                if (enroller.options.sync_with_class_schedule == true && instanceData.TYPE == "p") {
                                    enrolParams.syncWithClassSchedule = 1;
                                    enrolParams.syncDatesWithWorkshop = 0;
                                    var today = new Date();
                                    var startDate = new Date(instanceData.STARTDATE_SORT.replace(/-/g, "/"));
                                    if (startDate < today || startDate == "Invalid Date"){
                                        enrolParams.dateCommenced = enroller._dateTransform(today);
                                    }
                                }

                                enrolParams.NAME = instanceData.NAME;
                                enrolParams.COURSENAME = instanceData.COURSENAME;
                                enrolParams.generateInvoice = 0;
                                enrolParams.DATESDISPLAY = instanceData.DATESDISPLAY;

                                enrolParams.originalCost = instanceData.COST;

                                var selectedCourses = enroller.options.multiple_courses;
                                if (selectedCourses == null) {
                                    selectedCourses = {};
                                }

                                if (selectedCourses[enrolParams.contactID] != null) {
                                    selectedCourses[enrolParams.contactID][enrolParams.instanceID] = enrolParams;
                                } else {
                                    selectedCourses[enrolParams.contactID] = {};
                                    selectedCourses[enrolParams.contactID][enrolParams.instanceID] = enrolParams;
                                }
                                var contactData = enroller.element.data("contact_data");
                                var name = "";
                                if (contactData.GIVENNAME != null) {
                                    name += contactData.GIVENNAME;
                                }
                                if (contactData.SURNAME != null) {
                                    name += " " + contactData.SURNAME;
                                }

                                selectedCourses[enrolParams.contactID].CONTACT_NAME = name;

                                enroller._setOption("multiple_courses", selectedCourses);
                            });
                            if (enroller.options.group_booking == true) {
                                enroller._changeStep("groupBooking");
                            } else if (enroller.options.agent_multiple == true) {
                                enroller._changeStep("agentCourses");
                            }
                        }
                    }
                }
            }
        },

        _enrolCartParams: function(method, instance_identifier) {
            if (method == null) {
                method = "enrol";
            }
            var instanceData = enroller.options.cart_course_override[instance_identifier];

            var reviewStepTab = $("#" + instance_identifier);

            var params = {
                contactID: enroller.options.contact_id,
                instanceID: instanceData.instance_id,
                type: instanceData.course_type,
                payerID: enroller.options.payer_id
            };

            /*This block of code should never be processed for a logged in user - unless they are an agent / Admin */
            if (params.payerID == null || params.payerID == 0) {
                params.payerID = enroller.options.contact_id;
                if (enroller.element.data("USER_AX_TOKEN") != null) {
                    var userData = enroller.element.data("USER_AX_TOKEN");
                    if (userData.ROLETYPEID == enroller.CLIENT_ID) {
                        params.payerID = enroller.element.data("USER_AX_TOKEN").CONTACTID;
                    }
                }
            }

            //WP-340 - Cart booking!
            if (enroller.options.workshop_extra_billable_items && params.type === "w") {
                var enrolRef = params.contactID + "_" + params.instanceID + "_" + params.type;
                var selectedData = enroller.element.data("extra_items_selected");
                if (selectedData != null) {
                    var selectedItems = selectedData[enrolRef];
                    if (selectedItems != null) {
                        $.each(selectedItems, function(key, value) {
                            if (value) {
                                var item = enroller._getItem(key);
                                //Actual Item ID
                                if (params.extraBookingItemIDs == null) {
                                    params.extraBookingItemIDs = [];
                                }
                                params.extraBookingItemIDs.push(item.ITEMID);

                                //Type item Id
                                if (params.extraItemBookingIDs == null) {
                                    params.extraItemBookingIDs = [];
                                }
                                params.extraItemBookingIDs.push(key);
                            }
                        });
                        if (params.extraBookingItemIDs) {
                            params.extraBookingItemIDs = params.extraBookingItemIDs.join(","); // Does not work without this.
                        }
                        if (params.extraItemBookingIDs) {
                            params.extraItemBookingIDs = params.extraItemBookingIDs.join(",");
                        }
                    }
                }
            }

            if (method == "enrol") {
                params.generateInvoice = 1;
                var cost = reviewStepTab.data("cost");
                if (cost == null) {
                    cost = 0;
                }
                params.cost = parseFloat(cost);
                /*
				 * placeholdercode for discounts
				 */
                var discountsSelected = reviewStepTab.data("discounts_selected");
                var cost = reviewStepTab.data("cost");
                if (discountsSelected != null) {
                    var discountList = [];
                    if ($.isArray(discountsSelected)) {
                        $.each(discountsSelected, function(i, discount) {
                            discountList.push(discount.DISCOUNTID);
                        });
                        discountList = discountList.join();
                    }
                    params.discountIDList = discountList;
                }
                if (parseInt(enroller.options.agent_id) > 0) {
                    params.marketingAgentContactID = enroller.options.agent_id;
                }
            }

            return params;
        },
        /* REVIEW_STEP_FUNCTIONS */
        /*
		 * Continues to the next step from review. If agent_multiple is enabled then loads in the commission step.
		 * */
        _reviewContinue: function() {
            enroller._checkForExistingEnrolment(function(alreadyEnrolled) {
                if (alreadyEnrolled) {
                    enroller._alert(enroller.options.terminology_student + " is already enrolled in this course.");
                } else {
                    /*
					 * Create and store the parameters for the course selected. Add to the existing list - rather than creating a new one.
					 * */
                    var instanceData = enroller.element.data("selected_instance");
                    var params = enroller._enrolBasicParams();
                    if (enroller._enrolAdvancedParams() != null) {
                        $.each(enroller._enrolAdvancedParams(), function(key, value) {
                            params[key] = value;
                        });
                    }

                    /*Enable the syncWithClassSchedule setting if the sync_with_class_schedule setting is enabled.
                    This setting will override the syncDatesWithWorkshop setting*/
                    if (enroller.options.sync_with_class_schedule == true && instanceData.TYPE == "p") {
                        params.syncWithClassSchedule = 1;
                        params.syncDatesWithWorkshop = 0;
                        var today = new Date();
                        var startDate = new Date(instanceData.STARTDATE_SORT.replace(/-/g, "/"));
                        if (startDate < today || startDate == "Invalid Date"){
                            params.dateCommenced = enroller._dateTransform(today);
                        }
                    }

                    //WP-340 Extra Items
                    if (enroller.options.workshop_extra_billable_items && params.type === "w") {
                        var enrolRef = params.contactID + "_" + params.instanceID + "_" + params.type;
                        var selectedData = enroller.element.data("extra_items_selected");
                        if (selectedData != null) {
                            var selectedItems = selectedData[enrolRef];
                            if (selectedItems != null) {
                                $.each(selectedItems, function(key, value) {
                                    if (value) {
                                        var item = enroller._getItem(key);
                                        //Actual Item ID
                                        if (params.extraBookingItemIDs == null) {
                                            params.extraBookingItemIDs = [];
                                        }
                                        params.extraBookingItemIDs.push(item.ITEMID);

                                        //Type item Id
                                        if (params.extraItemBookingIDs == null) {
                                            params.extraItemBookingIDs = [];
                                        }
                                        params.extraItemBookingIDs.push(key);
                                    }
                                });
                                if (params.extraBookingItemIDs) {
                                    params.extraBookingItemIDs = params.extraBookingItemIDs.join(","); // Does not work without this.
                                }
                                if (params.extraItemBookingIDs) {
                                    params.extraItemBookingIDs = params.extraItemBookingIDs.join(",");
                                }
                            }
                        }
                    }

                    if (instanceData.NAME != null && instanceData.NAME != "") {
                        params.NAME = instanceData.NAME;
                    } else {
                        params.NAME = instanceData.COURSENAME;
                    }
                    params.DATESDISPLAY = instanceData.DATESDISPLAY;

                    params.COURSENAME = instanceData.COURSENAME;
                    params.generateInvoice = 0;
                    params.cost = parseFloat(enroller.options.cost);
                    params.originalCost = parseFloat(enroller.options.original_cost);

                    var selectedCourses = enroller.options.multiple_courses;
                    if (selectedCourses == null) {
                        selectedCourses = {};
                    }

                    if (enroller.options.agent_multiple != true && enroller.options.group_booking != true) {
                        selectedCourses = {};
                    }

                    if (selectedCourses[params.contactID] != null) {
                        selectedCourses[params.contactID][params.instanceID] = params;
                    } else {
                        selectedCourses[params.contactID] = {};
                        selectedCourses[params.contactID][params.instanceID] = params;
                    }
                    var contactData = enroller.element.data("contact_data");
                    var name = "";
                    if (contactData.GIVENNAME != null) {
                        name += contactData.GIVENNAME;
                    }
                    if (contactData.SURNAME != null) {
                        name += " " + contactData.SURNAME;
                    }

                    selectedCourses[params.contactID].CONTACT_NAME = name;

                    enroller._setOption("multiple_courses", selectedCourses);

                    enroller.element.data('payer_data_group', null); // Null this out to force payer check in group booking.

                    if (enroller.options.group_booking == true) {
                        enroller._changeStep("groupBooking");
                    } else if (enroller.options.agent_multiple == true) {
                        enroller._changeStep("agentCourses");
                    } else if (!enroller.options.legacy_enrolment_mode) {
                        enroller.element.trigger("page_busy", "Reserving Space");
                        enroller._multipleEnrolment("initial", null, "#enrolmentHolder", function(success) {
                            if (success) {
                                enroller.element.data("booking_in_progress", true);
                                enroller.element.data("billing_enabled", true);
                                enroller._changeStep("billing");
                            }
                        });
                    } else {
                        enroller.element.data("booking_in_progress", true);
                        enroller.element.data("billing_enabled", true);
                        enroller._changeStep("billing");
                    }
                }
            });
        },

        _displayCourseInformation: function() {
            var courseInfoHolder = $(
                '<div id="courseOutline" data-corners="true" data-role="collapsible" data-collapsed="true" data-iconpos="right">'
            );
            courseInfoHolder.attr("data-collapsed-icon", "carat-d").attr("data-expanded-icon", "carat-u");
            if (enroller.options.get_course_detail != null) {
                enroller.options.get_course_detail(enroller.options.course, function(courseInfo) {
                    courseInfoHolder.append("<h3>" + enroller.options.course_terminology + " Outline</h3>");
                    var courseDescription = $('<div class="course-description" />');
                    courseDescription.append(courseInfo.DESCRIPTION);
                    var courseIntroduction = $('<div class="course-introduction" />');
                    courseIntroduction.append("<h3>Introduction</h3>").append(courseInfo.INTRODUCTION);
                    var courseOutline = $('<div class="course-outline" />');
                    courseOutline.append(courseInfo.OUTLINE);
                    /*courseInfoHolder.append(courseDescription).append(courseIntroduction)*/
                    courseInfoHolder.append(courseOutline);
                    courseInfoHolder.collapsible();

                    courseInfoHolder.insertAfter(".enroller-course-heading");
                });
            }
        },

        /* REVIEW STEP - DISCOUNTS */

        _displayConcessions: function(discounts, location, instance_id) {
            var concessionList = {};
            var values = [];
            $.each(discounts, function(i, discount) {
                if (discount != null) {
                    concessionList[discount.DISCOUNTID] = false;
                    var discountValue = {
                        DISPLAY: discount.NAME,
                        VALUE: discount.DISCOUNTID
                    };
                    values.push(discountValue);
                }
            });

            var concessionHolder = {
                DISPLAY: "Concessions Available",
                TYPE: "checkbox",
                VALUES: values
            };

            var concessionInstance = "concessionHolder";
            var concessionsID = "concessionList";
            if (instance_id != null) {
                concessionInstance = concessionInstance + "_" + instance_id;
                concessionsID = "concessionList" + "_" + instance_id;
            }

            var concessions = enroller._createInputField(concessionInstance, concessionHolder);
            concessions.data("concession_fields", concessionHolder);
            concessions.attr("id", concessionsID);

            if ($(location).length) {
                $(location).append(concessions);
                enhanceAfterAjax($("#review_step"));
            }
        },
        _getSelectedConcessions: function(selector, holder) {
            if (selector == null) {
                selector = "#concessionList";
            }
            if (holder == null) {
                holder = "concessionHolder";
            }
            if ($(selector).data("concession_fields") == null) {
                return null;
            } else {
                var field = $(selector).data("concession_fields");
                var value = enroller._getInputValue(holder, field);
                return value;
            }

            return null;
        },

        /* REVIEW CART STEP - DISCOUNTS */

        /*
		 * Calculate the discount to be applied, set the options and call the display method;
		 * This is used by the Cart version of the review step. 
		 * Unlike _calculateDiscount this function requires parameters, and will not update the standard option fields.
		 * */
        _calculateCartDiscount: function(params, concessions, promoCode, callback) {
            /*var params = {
					contactID: enroller.options.contact_id,
					instanceID: enroller.options.course.INSTANCEID,
					type: enroller.options.course.TYPE,
					originalPrice: enroller.options.original_cost | instanceData.COST;

			};*/

            if (concessions != null && concessions != "") {
                params.concessionDiscountIDs = concessions;
            } else {
                params.concessionDiscountIDs = 0;
            }
            if (promoCode != null && promoCode != "") {
                params.PromoCode = promoCode;
            }
            enroller.options.calculate_discount(params, function(discounts) {
                /*if they are rounding, then round the cost at this point to prevent errors*/
                if (enroller.options.round_to_dollar) {
                    discounts.REVISEDPRICE = Math.ceil(discounts.REVISEDPRICE);
                }

                if (callback != null) {
                    callback(discounts);
                }
            });
        },

        /* AGENT_COURSES_STEP */
        _displayAgentCourses: function() {
            $("#agentCourses_step").empty();
            var stepOptions = enroller.options.enroller_steps.agentCourses;

            var tableHolder = enroller._createInformationField("Courses", '<table id="agentCourseTable" />');

            $("#agentCourses_step").append(tableHolder);
            var courseData = $.extend(true, {}, enroller.options.multiple_courses[enroller.options.contact_id], {});

            var data = [];
            var totalCost = 0;
            var totalCommission = 0;
            $.each(courseData, function(i, instance) {
                if (i != "CONTACT_NAME") {
                    var commission = instance.cost * enroller.options.agent_commission;

                    totalCost += instance.cost;
                    totalCommission += commission;
                    instance.ACTION =
                        '<a class="ui-btn ui-btn-icon-notext ui-alt-icon ui-nodisc-icon ui-icon-delete" data-instance="' +
                        instance.instanceID +
                        '">Remove</a>';
                    instance.commission = enroller._currencyDisplayFormat(commission);
                    instance.cost = enroller._currencyDisplayFormat(instance.cost);
                    data.push(instance);
                }
            });

            data.push({
                ACTION: "",
                COURSENAME: "",
                NAME: "Total:",
                cost: enroller._currencyDisplayFormat(totalCost),
                commission: enroller._currencyDisplayFormat(totalCommission)
            });
            var columns = [
                { title: enroller.options.course_terminology, data: "COURSENAME" },
                { title: enroller.options.instance_terminology, data: "NAME" },
                {
                    title: enroller.options.cost_terminology,
                    data: "cost",
                    className: "right-align",
                    visible: enroller.options.hide_cost_fields != true
                },
                { title: "Commission", data: "commission", className: "right-align" },
                { title: "", data: "ACTION" }
            ];

            $("#agentCourseTable").DataTable({
                data: data,
                columns: columns,
                paging: false,
                searching: false,
                ordering: false,
                info: false,
                compact: true
            });

            $("#agentCourseTable a.ui-btn").on("click", function(e) {
                var button = $(this);
                var instanceID = button.data("instance");

                /*duplicate the current multiple_courses*/
                var selectedCourses = $.extend(true, {}, enroller.options.multiple_courses, {});

                /*remove the course that was chosen*/
                delete selectedCourses[enroller.options.contact_id][instanceID];

                /*check to see if there are any courses left */
                if (!$.isEmptyObject(selectedCourses[enroller.options.contact_id])) {
                    enroller._setOption("multiple_courses", selectedCourses);
                } else {
                    enroller._setOption("course", { ID: 0, INSTANCEID: 0, TYPE: "p" });
                    enroller._setOption("multiple_courses", null);
                }

                /*trigger an update of the step / change to courses if none are selected*/
                enroller._changeStep("agentCourses");
                enroller.element.data("billing_enabled", false);
            });
            var contactData = enroller.element.data("contact_data");

            if (contactData.GIVENNAME == null) {
                contactData.GIVENNAME = "";
            }
            if (contactData.SURNAME == null) {
                contactData.SURNAME = "";
            }

            $("#agentCourses_step").prepend(
                enroller._createInformationField("Name", contactData.GIVENNAME + " " + contactData.SURNAME)
            );

            var continueHolder = enroller._createInformationField("Action", "");
            continueHolder.find("div.enroller-text-field").remove();
            continueHolder
                .find("div.enroller-field-label")
                .text("")
                .css("background", "transparent")
                .css("border", "none");
            var continueButton = $(
                '<a id="agentContinue" class="ui-btn ui-btn-active ui-btn-icon-right ui-alt-icon ui-nodisc-icon ui-icon-action">Continue ' +
                    enroller.options.enrolment_terminology +
                    "</a>"
            );
            continueButton.on("click", function() {
                enroller.element.data("billing_enabled", true);
                enroller._changeStep("billing");
            });
            continueHolder.append(continueButton);

            var selectNew = enroller._createInformationField("Action", "");
            selectNew.find("div.enroller-text-field").remove();
            selectNew
                .find("div.enroller-field-label")
                .text("")
                .css("background", "transparent")
                .css("border", "none");
            var addNew = $(
                '<a id="agentAddCourse" class="ui-btn ui-btn-active ui-btn-icon-right ui-alt-icon ui-nodisc-icon ui-icon-plus">Add Another ' +
                    enroller.options.course_terminology +
                    "</a>"
            );
            addNew.on("click", function() {
                /*if there is a cart override and they click this button, remove the cart*/
                if (enroller.options.cart_course_override != null) {
                    enroller.options.cart_course_override = null;
                }
                enroller._changeStep("courses");
            });
            selectNew.append(addNew);

            $("#agentCourses_step").append(selectNew);
            $("#agentCourses_step").append(continueHolder);

            /*Top Blurb*/
            if (stepOptions.BLURB_TOP != null && stepOptions.BLURB_TOP != "") {
                var blurbT = enroller._createBlurb(stepOptions.BLURB_TOP);

                $("#agentCourses_step").prepend(blurbT);
            }

            if (stepOptions.HEADER) {
                var headerInfo = {
                    INFO_ONLY: true,
                    TYPE: "header",
                    DISPLAY: stepOptions.HEADER
                };
                $("#agentCourses_step").prepend(
                    enroller._createInfoFieldDetailed("agentCourses_step_header", headerInfo)
                );
            }

            /*Bottom Blurb*/
            if (stepOptions.BLURB_BOTTOM != null && stepOptions.BLURB_BOTTOM != "") {
                var blurbB = enroller._createBlurb(stepOptions.BLURB_BOTTOM);
                $("#agentCourses_step").append(blurbB);
            }

            $("#agentCourses_step").enhanceWithin();
        },

        /* Group Booking Step */

        _displayGroupBookingStep: function(step) {
            var stepHolder = enroller.element.find("#" + step + "_step");
            stepHolder.empty();
            enroller._setupGroupBookingDT(step);
            var stepOptions = enroller.options.enroller_steps[step];
            if (enroller.options.hide_cost_fields != true) {
                stepHolder.append(
                    enroller._createInformationField(
                        "Total " + enroller.options.cost_terminology,
                        enroller._currencyDisplayFormat(enroller._calculateTotalCostGroupBooking())
                    )
                );
            }
            // still use DT? or custom list display....

            var payerCheckPass = true;
            var payerData = enroller.element.data("payer_data_group");
            if (enroller.element.data("payer_data_group") == null) {
                payerCheckPass = false;
                if (enroller.options.payer_id != 0) {
                    enroller._confirmContactIsInAccount(enroller.options.payer_id, function(data) {
                        enroller.element.data("payer_data_group", data);
                        enroller._displayGroupBookingStep(step);
                    });
                }
            } else {
                if (enroller.options.payer_id != 0) {
                    if (enroller.options.payer_id != enroller.element.data("payer_data_group").CONTACTID) {
                        enroller._confirmContactIsInAccount(enroller.options.payer_id, function(data) {
                            enroller.element.data("payer_data_group", data);
                            enroller._displayGroupBookingStep(step);
                        });
                    }
                }
            }

            if (payerData == null) {
                if (enroller.options.payer_id != 0) {
                    enroller._confirmContactIsInAccount(enroller.options.payer_id, function(data) {
                        enroller.element.data("payer_data_group", data);
                        payerCheckPass = false;
                        enroller._displayGroupBookingStep(step);
                    });
                } else {
                    /*should never get here, but use the payer check to force payer to be set if needed*/
                    enroller._reviewStepPayerCheck();
                    payerCheckPass = false;
                }
            }

            if (!$("#payer_id_gb").length && payerCheckPass && enroller.options.show_payer != false) {
                enroller._payerChangeBlock(payerData, stepHolder, "_gb", function(){
                    enroller._displayGroupBookingStep(step);
                }, true);

                enroller._displaySetupChosens("groupBooking");
            }

            if (payerCheckPass) {
                var continueHolder = enroller._createInformationField("Action", "");
                continueHolder.find("div.enroller-text-field").remove();
                continueHolder
                    .find("div.enroller-field-label")
                    .text("")
                    .css("background", "transparent")
                    .css("border", "none");
                var continueButton = $(
                    '<a id="groupBookingContinue" class="ui-btn ui-btn-active ui-btn-icon-right ui-alt-icon ui-nodisc-icon ui-icon-action">Continue ' +
                        enroller.options.enrolment_terminology +
                        "</a>"
                );
                continueButton.on("click", function() {
                    /* Start by tentatively booking students here
					 * On completion switch to the billing step.
					 */

                    /*update all the payers if the select is available to change them*/

                    var payerDataCheck = true;
                    if (
                        enroller.options.payer_address_required == true &&
                        enroller.options.allow_update_payer_details == true
                    ) {
                        if (enroller.element.data("payer_data_group") != null) {
                            var pData = enroller.element.data("payer_data_group");
                            var streetName = pData.STREETNAME == null || pData.STREETNAME == "";
                            var streetNo = pData.STREETNO == null || pData.STREETNO == "";
                            var pobox = pData.POBOX == null || pData.POBOX == "";
                            var country = pData.COUNTRYID == null || pData.COUNTRYID == "";
                            var state = pData.STATE == null || pData.STATE == "";

                            if (enroller.options.payer_australia_only === true) {
                                var ausStates = ['NSW', 'VIC',"QLD", "SA", "WA", "TAS", "NT", "ACT"];
                                if (pData.COUNTRYID + "" !== "1101") {
                                    country = true;
                                }
                                if(!state  && ausStates.indexOf(pData.STATE) === -1){
                                    state = true; // did not pass
                                }
                            }

                            if (((streetName || streetNo) && pobox) ||  country || state) {
                                payerDataCheck = false;
                                if ($("#payer_details").length) {
                                    $("#payer_details a").trigger("click");
                                    enroller._displayError("payer_details", "Payer address details are required");
                                }
                                enroller._scrollToElement("#payer_details", function() {});
                            }
                        }
                    }
                    if (payerDataCheck) {
                        enroller.element.data("payer_data", pData);
                        if ($("#payer_id_gb").length) {
                            $.each(enroller.options.multiple_courses, function(contact, enrolments) {
                                $.each(enrolments, function(enrolmentID, enrolmentParams) {
                                    if (enroller.options.payer_id != 0 && enroller.options.payer_id != null) {
                                        enrolmentParams.payerID = enroller.options.payer_id;
                                    } else {
                                        if ($("#payer_id_gb").val() != "") {
                                            enrolmentParams.payerID = parseInt($("#payer_id_gb").val());
                                        }
                                    }
                                });
                            });
                        }

                        if (continueButton.data("enrolments_processed") != true) {
                            enroller.element.trigger("page_busy", "Reserving Space");
                            enroller._multipleEnrolment("initial", null, "#enrolmentHolder", function(success) {
                                if (success) {
                                    continueButton.data("enrolments_processed", true);
                                    enroller.element.data("booking_in_progress", true);
                                    enroller.element.data("billing_enabled", true);
                                    enroller._changeStep("billing");
                                }
                            });
                        } else {
                            enroller.element.data("billing_enabled", true);
                            enroller._changeStep("billing");
                        }
                    }
                });
                continueHolder.append(continueButton);

                if (enroller.options.enroller_steps.courses != null) {
                    var selectNew = enroller._createInformationField("Action", "");
                    selectNew.find("div.enroller-text-field").remove();
                    selectNew
                        .find("div.enroller-field-label")
                        .text("")
                        .css("background", "transparent")
                        .css("border", "none");
                    var addNew = $(
                        '<a id="groupBookingAdd" class="ui-btn ui-btn-active ui-btn-icon-right ui-alt-icon ui-nodisc-icon ui-icon-plus">Add Another ' +
                            enroller.options.course_terminology +
                            "</a>"
                    );
                    addNew.on("click", function() {
                        /*if there is a cart override and they click this button, remove the cart*/
                        if (enroller.options.cart_course_override != null) {
                            enroller.options.cart_course_override = null;
                        }
                        enroller._changeStep("courses");
                    });
                    selectNew.append(addNew);

                    stepHolder.append(selectNew);
                }
                if (enroller.options.enroller_steps.contactSearch != null) {
                    var addNewContact = enroller._createInformationField("Action", "");
                    addNewContact.find("div.enroller-text-field").remove();
                    addNewContact
                        .find("div.enroller-field-label")
                        .text("")
                        .css("background", "transparent")
                        .css("border", "none");
                    var addNewContactB = $(
                        '<a id="groupBookingAddC" class="ui-btn ui-btn-active ui-btn-icon-right ui-alt-icon ui-nodisc-icon ui-icon-plus">Add Another ' +
                            enroller.options.terminology_student +
                            "</a>"
                    );
                    addNewContactB.on("click", function() {
                        enroller._changeStep("contactSearch");
                    });
                    addNewContact.append(addNewContactB);

                    stepHolder.append(addNewContact);
                }

                stepHolder.append(continueHolder);

                /*Top Blurb*/
                if (stepOptions.BLURB_TOP != null && stepOptions.BLURB_TOP != "") {
                    var blurbT = enroller._createBlurb(stepOptions.BLURB_TOP);

                    stepHolder.prepend(blurbT);
                }
                if (stepOptions.HEADER) {
                    var headerInfo = {
                        INFO_ONLY: true,
                        TYPE: "header",
                        DISPLAY: stepOptions.HEADER
                    };
                    $("#" + step + "_step").prepend(
                        enroller._createInfoFieldDetailed(step + "_step_header", headerInfo)
                    );
                }

                /*Bottom Blurb*/
                if (stepOptions.BLURB_BOTTOM != null && stepOptions.BLURB_BOTTOM != "") {
                    var blurbB = enroller._createBlurb(stepOptions.BLURB_BOTTOM);
                    stepHolder.append(blurbB);
                }
                stepHolder.enhanceWithin();

                enroller.element.trigger("enroller:enrolment_status_update", {
                    user_contact_id: enroller.options.user_contact_id,
                    contact_id: enroller.options.contact_id,
                    enrolments: enroller.options.multiple_courses,
                    payer_id: enroller.options.payer_id,
                    course: enroller.options.course,
                    config_id: enroller.options.config_id
                });
            }
        },

        _renderItemRow: function(item, data) {
            var row = $("<tr></tr>");
            row.data("enrolment", data);
            row.data("item", item);
            row.append($("<td></td>").append(item.ITEMCODE));
            row.append($("<td></td>").append(item.ITEMDESCRIPTION));
            row.append($("<td></td>").append(enroller._currencyDisplayFormat(item.DEFAULTPRICE)));
            var remove = $("<td></td>");
            if (typeof item.REQUIRED === "string") {
                item.REQUIRED = parseInt(item.REQUIRED);
            }

            if (!item.REQUIRED) {
                remove.append(
                    '<a class="enroller-gbook-remove-item ui-btn ui-btn-icon-notext ui-alt-icon ui-nodisc-icon ui-icon-delete">Remove</a>'
                );
            } else {
                remove.append("Required");
            }
            row.append(remove);
            return row;
        },
        _renderExtraItemsRow: function(data) {
            var response = null;
            // ITEM ids
            var items = data.extraBookingItemIDs != null ? data.extraBookingItemIDs.split(",") : null;
            // Booking Item ids
            var bookingItemIDs = data.extraItemBookingIDs != null ? data.extraItemBookingIDs.split(",") : null;

            if (items !== null) {
                response = $('<table style="font-size:0.85em"></table>');

                var header = $("<tr></tr>");
                header.append($("<th>Item Code:</th>"));
                header.append($("<th>Item Description:</th>"));
                header.append($("<th>Item Price:</th>"));
                header.append($("<th>Remove:</th>"));
                header.children().addClass("no-hover");
                response.append(header);
                $.each(bookingItemIDs, function(i, id) {
                    var item = enroller._getItem(id);
                    if (item != null && items.indexOf(item.ITEMID + "") > -1) {
                        response.append(enroller._renderItemRow(item, data));
                    }
                });
            }

            return response;
        },
        _setupGroupBookingDT: function(step) {
            var stepHolder = enroller.element.find("#" + step + "_step");

            var gBookTable = $(
                '<table class="enroller-group-booking-table ui-shadow ui-corner-all" style="font-size:0.85em"></table>'
            );
            stepHolder.append(gBookTable);

            var data = enroller._buildGroupBookingDTConfig();

            var columns = [
                {
                    title: enroller.options.terminology_student,
                    data: "NAME",
                    responsivePriority: 3,
                    className: "no-hover"
                },
                {
                    title: enroller.options.instance_terminology,
                    data: "INSTANCENAME",
                    responsivePriority: 1,
                    className: "no-hover"
                },
                { title: "Date(s)", data: "DATESDISPLAY", responsivePriority: 5, className: "no-hover" },
                {
                    title: enroller.options.cost_terminology,
                    data: "cost",
                    className: "right-align no-hover",
                    visible: enroller.options.hide_cost_fields != true,
                    responsivePriority: 1
                },
                { title: "", data: "ACTION", responsivePriority: 1, className: "center-align no-hover" }
            ];

            gBookTable = gBookTable.DataTable({
                data: data,
                columns: columns,
                paging: false,
                searching: false,
                ordering: false,
                info: false,
                compact: true
            });

            gBookTable.rows().every(function() {
                var data = enroller._renderExtraItemsRow(this.data());

                if (data != null) {
                    var span = $("<span>Booking extra items:</span>");
                    span.css({
                        float: "left",
                        margin: 4
                    });
                    this.child(data).show();
                }
            });
            $("table.enroller-group-booking-table a.enroller-gbook-remove-item")
                .off()
                .on("click", function(e) {
                    var item = $(this);
                    var itemData = $(this)
                        .closest("tr")
                        .data("item");
                    var selectedBooking = $(this)
                        .closest("tr")
                        .data("enrolment");
                    enroller._removeStudentItem(selectedBooking, itemData, function() {
                        enroller._displayGroupBookingStep(step);
                    });
                });
            $("table.enroller-group-booking-table a.enroller-gbook-delete")
                .off()
                .on("click", function(e) {
                    var selectedBooking = gBookTable.row($(this).closest("tr")).data();
                    enroller._removeStudentEnrolment(selectedBooking, function() {
                        if (enroller.options.multiple_courses != null) {
                            enroller._displayGroupBookingStep(step);
                        } else {
                            enroller._changeStep("review");
                        }
                    });
                });
        },
        _buildGroupBookingDTConfig: function() {
            var enrolmentsList = enroller.options.multiple_courses;

            var data = [];
            $.each(enrolmentsList, function(contactID, contactEnrolment) {
                $.each(contactEnrolment, function(instance, record) {
                    if (instance != "CONTACT_NAME") {
                        var tempRecord = {};
                        tempRecord.CONTACTID = contactID;
                        tempRecord.NAME = contactEnrolment.CONTACT_NAME;
                        tempRecord.INSTANCEID = instance;
                        tempRecord.COURSENAME = record.COURSENAME;
                        tempRecord.INSTANCENAME = record.NAME;
                        tempRecord.TYPE = record.TYPE;
                        tempRecord.DATESDISPLAY = record.DATESDISPLAY == null ? "" : record.DATESDISPLAY;
                        tempRecord.cost = enroller._currencyDisplayFormat(record.cost);
                        tempRecord.ACTION =
                            '<a class="enroller-gbook-delete ui-btn ui-btn-icon-notext ui-alt-icon ui-nodisc-icon ui-icon-delete">Remove</a>';
                        //tempRecord.ACTION = '<a class="ui-btn enroller-gbook-edit ui-btn-icon-notext ui-alt-icon ui-nodisc-icon ui-icon-edit">Edit</a>'+ tempRecord.ACTION;
                        if (record.extraBookingItemIDs != null) {
                            tempRecord.extraBookingItemIDs = record.extraBookingItemIDs;
                        }
                        if (record.extraItemBookingIDs != null) {
                            tempRecord.extraItemBookingIDs = record.extraItemBookingIDs;
                        }
                        data.push(tempRecord);
                    }
                });
            });

            return data;
        },
        _refreshGroupBookingDT: function(step) {
            var stepHolder = enroller.element.find("#" + step + "_step");
            var gBookTable = stepHolder.find(".enroller-group-booking-table").DataTable();

            var updatedConfig = enroller._buildGroupBookingDTConfig();
            gBookTable
                .clear()
                .rows.add(updatedConfig)
                .draw();
        },
        _calculateGroupBookingDiscounts: function() {},

        _removeStudentItem: function(enrolment, item, callback) {
            var enrolments = enroller.options.multiple_courses;
            if (enrolments != null) {
                try {
                    var enrolmentRecord = enrolments[enrolment.CONTACTID][enrolment.INSTANCEID];
                    if (enrolmentRecord != null) {
                        if (enrolmentRecord.extraBookingItemIDs != null) {
                            var items = enrolmentRecord.extraBookingItemIDs.split(",");
                            var bookingItems = enrolmentRecord.extraItemBookingIDs.split(",");
                            if (items.length > 0 && bookingItems.length > 0) {
                                var i = items.indexOf(item.ITEMID + "");
                                var iB = bookingItems.indexOf(item.DEFAULTBOOKINGITEMID + "");
                                if (i > -1) {
                                    items.splice(i, 1);
                                }
                                if (iB > -1) {
                                    bookingItems.splice(iB, 1);
                                }
                                if (items.length > 0) {
                                    enrolmentRecord.extraBookingItemIDs = items.join(",");
                                    enrolmentRecord.extraItemBookingIDs = bookingItems.join(",");
                                } else {
                                    delete enrolmentRecord.extraBookingItemIDs;
                                    delete enrolmentRecord.extraItemBookingIDs;
                                }
                                enrolments[enrolment.CONTACTID][enrolment.INSTANCEID] = enrolmentRecord;

                                enroller._setOption("multiple_courses", enrolments);
                            }
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }

            if (callback != null) {
                callback();
            }
        },
        _removeStudentEnrolment: function(enrolment, callback) {
            /* Clone the existing courses */
            var enrolments = $.extend(true, {}, enroller.options.multiple_courses, {});

            if (enrolment.CONTACTID != null) {
                if (enrolments[enrolment.CONTACTID] != null) {
                    if (enrolments[enrolment.CONTACTID][enrolment.INSTANCEID] != null) {
                        delete enrolments[enrolment.CONTACTID][enrolment.INSTANCEID];
                    }

                    if (enrolments[enrolment.CONTACTID] != null) {
                        /*check to see if there are no enrolments remaining */
                        var stillHasEnrolments = false;
                        $.each(enrolments[enrolment.CONTACTID], function(key, record) {
                            if (key != "CONTACT_NAME") {
                                stillHasEnrolments = true;
                            }
                        });

                        if (!stillHasEnrolments) {
                            delete enrolments[enrolment.CONTACTID];
                        }
                    }
                }
            }
            if (Object.keys(enrolments).length < 1) {
                enrolments = null;
            }
            enroller._setOption("multiple_courses", enrolments);

            callback();
        },

        /** USI VALIDATION */

        _generateUSIValidationResponse:function(response){
  
            var responseHolder = $('<div></div>').addClass('usi-response');
            if(response.verified == true){
                responseHolder.addClass('success enrolment-success');
                responseHolder.append('USI Verified')
            }
            else{
                responseHolder.addClass('fail enrolment-failure');
                responseHolder.append(response.message)
            }
            return responseHolder
        },

        _displayUSIValidationStep: function() {
            var usiStep = $("#usi_validation_step");
            
            var DEFAULT_BLURB = "From 1 January 2015, we can be prevented from issuing you with a nationally recognised VET qualification or statement of attainment when you complete your course if you do not have a Unique Student Identifier (USI). In addition, we are required to include your USI in the data we submit to NCVER. If you have not yet obtained a USI you can apply for it directly at <a href='http://www.usi.gov.au/create-your-USI/'>http://www.usi.gov.au/create-your-USI/</a> on computer or mobile device. Please note that if you would like to specify your gender as 'other' you will need to contact the USI Office for assistance."
            var stepOptions = enroller.options.enroller_steps.usi_validation;
            
            usiStep.empty();
            var contactData = usiStep.data("contact_data");
            
            var blurb = enroller._createBlurb(stepOptions.BLURB_TOP != null && stepOptions.BLURB_TOP.length > 0?stepOptions.BLURB_TOP:DEFAULT_BLURB);
            blurb.css({color: '#222'});
            usiStep.append(blurb);

            if (stepOptions.HEADER) {
                var headerInfo = {
                    INFO_ONLY: true,
                    TYPE: "header",
                    DISPLAY: stepOptions.HEADER
                };
                usiStep.prepend(
                    enroller._createInfoFieldDetailed("usi_step_header", headerInfo)
                );
            }

            var axToken;
            var axTokenAll = enroller.element.data("USER_AX_TOKEN");
            if (axTokenAll != null) {
                if (axTokenAll.ROLETYPEID !== enroller.LEARNER_ID) {
                    axToken = axTokenAll.AXTOKEN;
                }
            }

            if (
                enroller.options.contact_id != 0 &&
                (contactData == null ||
                    (contactData != null && contactData.CONTACTID != enroller.options.contact_id))
            ) {
                enroller.options.get_contact({ contactID: enroller.options.contact_id }, function(conResult) {
                    contactData = conResult;
                    if(Array.isArray(conResult)){
                        contactData = conResult[0];
                    }
                    if(contactData.CONTACTID != null && contactData.CONTACTID == enroller.options.contact_id){
                        usiStep.data('contact_data', contactData);
                        enroller._displayUSIValidationStep();
                    }
                    else{
                        usiStep.data('contact_data', null);
                    }
                    
                    
                },axToken);
            } else if (enroller.options.contact_id != 0 && contactData != null) {

                if(contactData.USI_VERIFIED === true || contactData.USI_EXEMPTION === true){
                    var verified = enroller._generateUSIValidationResponse({verified:true});
                    usiStep.append(verified);
                    var continueButton = $('<button data-role="button">Continue</button>').addClass("enroller-save-button ui-btn-icon-right ui-icon-arrow-r ui-btn ui-btn-active");
                    var continueHolder = enroller._createInformationField(
                        "Continue",
                        ""
                    );
                    continueHolder.find("div.enroller-text-field").remove();
                    continueHolder
                        .find("div.enroller-field-label")
                        .text("")
                        .css("background", "transparent")
                        .css("border", "none");
                    continueHolder.css("margin-top", "3em");
                    usiStep.append(continueHolder.append(continueButton));

                    if(stepOptions.BLURB_BOTTOM){
                        var blurbB = enroller._createBlurb(stepOptions.BLURB_BOTTOM);
                        usiStep.append(blurbB);
                    }

                    continueButton.on('click', function(){
                        enroller._changeStep(enroller._getNextStep('usi_validation'));
                    });

                    var verified = enroller.element.data('usi_verified');

                    if(verified == null){
                        verified = {};
                    }
                    verified[enroller.options.contact_id] = true;
                    enroller.element.data('usi_verified', verified);
                    enroller._updateStepButtons();
                    usiStep.enhanceWithin();
                }
                else{
           
                    var fields = {
                        usi_GIVENNAME: {
                            TYPE: "text",
                            DISPLAY: "Given Name",
                            REQUIRED: true,
                            MAXLENGTH: 40
                        },
                        usi_SURNAME: {
                            TYPE: "text",
                            DISPLAY: "Family Name",
                            REQUIRED: true,
                            MAXLENGTH: 40
                        },
                        usi_DOB:{ TYPE: "date", DISPLAY: "Date Of Birth" ,REQUIRED:true},
                        
                    };

                    $.each(fields, function(key, field){
                        usiStep.append(enroller._createInputField(key, field));
                        var actualKey = key.split('_')[1];
                        enroller._updateInputValue($('#'+key), contactData[actualKey]);
                    });
                    
                    var usi_USI = {
                        TYPE: "text",
                        REQUIRED:true,
                        DISPLAY: "Unique Student Identifier",
                        PATTERN: "[2-9A-HJ-NP-Za-hj-np-z]{10}",
                        MAXLENGTH: 10,
                        TITLE: "10 Characters no 1, 0, O or I",
                        TOOLTIP: DEFAULT_BLURB
                    };

                    fields.usi_USI = usi_USI;


                    var headerInfo = {
                        INFO_ONLY: true,
                        TYPE: "header",
                        DISPLAY: "Unique Student Identifier"
                    };

                    usiStep.append(enroller._createInfoFieldDetailed('usi_header', headerInfo));

                    usiStep.append(enroller._createInputField('usi_USI', usi_USI));
                    enroller._updateInputValue($('#usi_USI'), contactData.USI);



                    var continueButton = $('<button data-role="button">Verify USI</button>').addClass("enroller-save-button ui-btn-icon-right ui-icon-check ui-btn ui-btn-active");

                    var continueHolder = enroller._createInformationField(
                        "Verify USI",
                        ""
                    );
                    continueHolder.find("div.enroller-text-field").remove();
                    continueHolder
                        .find("div.enroller-field-label")
                        .text("")
                        .css("background", "transparent")
                        .css("border", "none");
                    continueHolder.css("margin-top", "3em");
                    usiStep.append(continueHolder.append(continueButton));

                    if (stepOptions.TERMS != null) {
                        var terms = enroller._createTerms(stepOptions.TERMS);
                        continueButton.addClass("ui-disabled").prop("disabled", true);
                        terms[0].insertBefore(continueHolder);
                        terms[1].insertBefore(continueHolder);
                    }

                    if(stepOptions.BLURB_BOTTOM){
                        var blurbB = enroller._createBlurb(stepOptions.BLURB_BOTTOM);
                        usiStep.append(blurbB);
                    }

                    usiStep.enhanceWithin();
                    

                    continueButton.on('click', function(){
                        if($('div.usi-response').length){
                            $('div.usi-response').remove();
                        }
                        usiStep.data("contact_data", null); // Null this out so it will fetch after updating if the step is reloaded.
                        enroller._checkStatusAndBuildParams(fields, function(params, requiredComplete, complete, incomplete){
                            if (incomplete.length > 0) {
                                $.each(incomplete, function(i) {
                                    enroller._markFieldIncomplete(incomplete[i], fields[incomplete[i]]);
                                });
                            }
                            else{
                                var usiValid = enroller._regexIsValid(usi_USI.PATTERN, params.usi_USI);
                                if(!usiValid){
                                    enroller._displayError('usi_USI', usi_USI.TITLE);
                                }
                                else{

                                    var finalParams = {};
                                    $.each(params, function(key, value){
                                        var actualKey = key.split('_')[1];
                                        finalParams[actualKey] = value;
                                    });
                                    enroller._update_contact(enroller.options.contact_id,finalParams, function(response){
                                        var success = false;
                                        if(response != null && response.CONTACTID != null){
                                            if(response.CONTACTID === enroller.options.contact_id){
                                                success = true;
                                            }
                                        }
                                    
                                        if(success){
                                            enroller.options.verify_usi({contact_id:enroller.options.contact_id}, function(response){
                                                
                                                if(response){
                                                    if($('div.usi-response').length){
                                                        $('div.usi-response').remove();
                                                    }
                                                    var responseBlock = enroller._generateUSIValidationResponse(response);
                                                    responseBlock.insertBefore(continueHolder);

                                                    if (response.verified == true) {
                                                        var verified = enroller.element.data('usi_verified');

                                                        if (verified == null) {
                                                            verified = {};
                                                        }
                                                        verified[enroller.options.contact_id] = true;
                                                        enroller.element.data('usi_verified', verified);
                                                        enroller._updateStepButtons();

                                                        continueButton.empty().append('Continue').removeClass('ui-icon-check').addClass('ui-icon-arrow-r').off('click').on('click', function(){
                                                            enroller._changeStep(enroller._getNextStep('usi_validation'));
                                                        });
                                                        setTimeout(function(){
                                                            enroller._changeStep(enroller._getNextStep('usi_validation'));
                                                        }, 100);
                                                    }
                                                }
                                            })
                                        }
                                        else{
                                            enroller._alert('Something went wrong. Please try again.');
                                        }
                        
                                    });
                                }
                            }
                        })
                    });
                    // Given Name

                    // Surname

                    // USI
                    // add a listener to handle updating this with a "check?"

                    // Check my USI

                    // Oncheck function, hides check

                    // Replaces with continue.

                    
                }
            }
        },

        /* ENROL_STEP */

        /* ENROL_STEP_UI */

        _displayBillingStep: function() {
            var enrolOptions = $.extend(true, {}, enroller.options.enroller_steps.billing, {});
            var billingStep = $("#billing_step");
            var validPaymentMethods = {};

            var invoiceData = enroller.element.data("invoice_data");
            if (invoiceData == null && enroller.options.invoice_id > 0) {
                enroller.options.fetch_invoice(enroller.options.invoice_id, function(reqInvoiceData) {
                    if (reqInvoiceData) {
                        enroller.element.data("invoice_data", reqInvoiceData);
                        enroller._displayBillingStep();
                    }
                });
            } else if (invoiceData != null && parseInt(invoiceData.INVOICEID) !== enroller.options.invoice_id) {
                enroller.element.data("invoice_data", null);
                enroller._displayBillingStep();
            }
            if (enroller.options.invoice_id === 0 || invoiceData != null) {
                var contactData = enroller.element.data("contact_data");
                var payerData = enroller.element.data("payer_data");

                /* If ContactData is null then it is likely that the enrolment has been resumed
                 * Ensure contactData is present before continuing*/
                if (contactData == null) {
                    if (enroller.options.contact_id != 0) {
                        enroller._confirmContactIsInAccount(enroller.options.contact_id, function(data) {
                            enroller.element.data("contact_data", data);
                            enroller._displayBillingStep();
                        });
                    }
                } else if (payerData == null) {
                    if (enroller.options.payer_id != 0) {
                        enroller._confirmContactIsInAccount(enroller.options.payer_id, function(data) {
                            enroller.element.data("payer_data", data);
                            enroller._displayBillingStep();
                        });
                    }
                } else {
                    billingStep.empty();

                    enroller._cleanNames(contactData);
                    enroller._cleanNames(payerData);
                    try {
                        
                        if($.fn.render_invoice != null && enroller.options.hide_cost_fields != true && invoiceData != null){
                            var invHolder = $('<div></div>');
                            billingStep.append(invHolder);
                            invHolder.render_invoice({
                                invoice_data: invoiceData
                            });
                        }
                    } catch (error) {
                        console.log(errors);
                    }
                    // if the invoice is paid already then force the payment/billing to stop.
                    if(invoiceData && invoiceData.ISPAID){
                        enroller._displayOverlayNonDismissableAlert(
                            "Enrolment Invoice Paid",
                            '<p style="white-space:normal; font-size:14px">This invoice has already been paid. Check your email for confirmation details!</p>'
                        );

                        return false;
                    }

                    /*check if multiple_courses has records*/

                    var cost;
                    if (enroller.options.multiple_courses != null) {
                        if (enroller.options.group_booking != true) {
                            if (invoiceData != null) {
                                cost = invoiceData.BALANCE;
                                enroller.options.cost = cost;
                            } else {
                                cost = enroller._calculateTotalCost().toFixed(2);
                                if (enroller.options.round_to_dollar) {
                                    cost = Math.ceil(cost);
                                }
                            }

                            enroller.options.cost = cost;

                            billingStep.append(
                                enroller._createInformationField(
                                    enroller.options.terminology_student,
                                    contactData.GIVENNAME + " " + contactData.SURNAME
                                )
                            );
                            if (
                                payerData.CONTACTID != contactData.CONTACTID &&
                                enroller.options.show_payer != false
                            ) {
                                billingStep.append(
                                    enroller._createInformationField(
                                        enroller.options.payer_terminology,
                                        payerData.GIVENNAME + " " + payerData.SURNAME
                                    )
                                );
                            }
                            if (enroller.options.hide_cost_fields != true) {
                                billingStep.append(
                                    enroller._createInformationField(
                                        enroller.options.cost_terminology,
                                        enroller._currencyDisplayFormat(cost)
                                    )
                                );
                            }
                        } else {
                            if (invoiceData != null) {
                                cost = invoiceData.BALANCE;
                                enroller.options.cost = cost;
                            } else {
                                cost = enroller._calculateTotalCostGroupBooking().toFixed(2);
                                if (enroller.options.round_to_dollar) {
                                    cost = Math.ceil(cost);
                                }
                                enroller.options.cost = cost;
                            }

                            if (enroller.options.show_payer != false) {
                                billingStep.append(
                                    enroller._createInformationField(
                                        "Payer",
                                        payerData.GIVENNAME + " " + payerData.SURNAME
                                    )
                                );
                            } else if (payerData.CONTACTID == contactData.CONTACTID) {
                                billingStep.append(
                                    enroller._createInformationField(
                                        enroller.options.terminology_student,
                                        contactData.GIVENNAME + " " + contactData.SURNAME
                                    )
                                );
                            }

                            if (enroller.options.hide_cost_fields != true) {
                                billingStep.append(
                                    enroller._createInformationField(
                                        enroller.options.cost_terminology,
                                        enroller._currencyDisplayFormat(cost)
                                    )
                                );
                            }
                        }

                        var allowPublicInhouse = enroller.element.data("allow_public_inhouse");

                        if (
                            (enroller.options.agent_multiple == true && enroller.options.group_booking != true) ||
                            allowPublicInhouse == "inhouse"
                        ) {
                            /*if more than one instance is selected ensure that only tentative is allowed*/
                            if (
                                Object.keys(enroller.options.multiple_courses[enroller.options.contact_id]).length >
                                1
                            ) {
                                validPaymentMethods.DISPLAY = enrolOptions.paymentMethods.DISPLAY;
                                validPaymentMethods.TYPE = enrolOptions.paymentMethods.TYPE;
                                validPaymentMethods.VALUES = [{ VALUE: "tentative", DISPLAY: "Tentative" }];
                                enrolOptions.paymentMethods = validPaymentMethods;
                            }
                            if (
                                enroller.options.inhouse_confirm_bookings == true &&
                                allowPublicInhouse == "inhouse"
                            ) {
                                validPaymentMethods.VALUES = [
                                    { VALUE: "free", DISPLAY: enroller.options.enrol_terminology }
                                ];
                                enrolOptions.paymentMethods = validPaymentMethods;
                            }
                        }
                    } else {
                        console.log("something went wrong");
                        /*should never hit this block*/
                        var instanceData = enroller.element.data("selected_instance");

                        var instanceName = $(instanceData.NAME);
                        if (invoiceData != null) {
                            cost = invoiceData.BALANCE;
                            enroller.options.cost = cost;
                        } else {
                            cost = parseFloat(enroller.options.cost).toFixed(2);
                            if (enroller.options.round_to_dollar) {
                                cost = Math.ceil(cost);
                            }
                            enroller.options.cost = cost;
                        }

                        billingStep.append(
                            enroller._createInformationField(
                                enroller.options.instance_terminology,
                                instanceName.text()
                            )
                        );

                        billingStep.append(
                            enroller._createInformationField(
                                enroller.options.terminology_student,
                                contactData.GIVENNAME + " " + contactData.SURNAME
                            )
                        );
                        if (payerData.CONTACTID != contactData.CONTACTID) {
                            billingStep.append(
                                enroller._createInformationField(
                                    "Payer",
                                    payerData.GIVENNAME + " " + payerData.SURNAME
                                )
                            );
                        }
                        if (enroller.options.hide_cost_fields != true) {
                            billingStep.append(
                                enroller._createInformationField(
                                    enroller.options.cost_terminology,
                                    enroller._currencyDisplayFormat(cost)
                                )
                            );
                        }
                    }

                    var enrolmentHolder = $('<div id="enrolmentHolder" />');
                    billingStep.append(enrolmentHolder);

                    

                    if (enrolOptions.paymentMethods != null) {
                        var courseHasCost =
                            parseFloat(enroller.options.cost) > 0 || (enroller.options.group_booking && cost > 0);

                        validPaymentMethods = {};

                        if (
                            courseHasCost &&
                            enroller.options.always_free_bookings != true &&
                            !enroller.options.hide_cost_fields
                        ) {
                            validPaymentMethods = enrolOptions.paymentMethods;
                            validPaymentMethods.DISPLAY = enroller.options.payment_method_selector_terminology;
                        } else {
                            validPaymentMethods.DISPLAY = enrolOptions.paymentMethods.DISPLAY;
                            validPaymentMethods.DISPLAY = enroller.options.payment_method_selector_terminology;
                            validPaymentMethods.TYPE = enrolOptions.paymentMethods.TYPE;
                            if (
                                enroller.options.allow_free_bookings == true ||
                                enroller.options.always_free_booking == true
                            ) {
                                validPaymentMethods.VALUES = [
                                    { VALUE: "free", DISPLAY: enroller.options.enrol_terminology }
                                ];
                            } else {
                                validPaymentMethods.VALUES = [
                                    { VALUE: "tentative", DISPLAY: enroller.options.enrol_tentative_terminology }
                                ];
                            }
                        }

                        if (validPaymentMethods.VALUES.length > 1) {
                            $.each(validPaymentMethods.VALUES, function(i, value) {
                                if (value.VALUE == "invoice") {
                                    value.DISPLAY = enroller.options.invoice_selector_terminology;
                                } else if (value.VALUE == "payment") {
                                    value.DISPLAY = enroller.options.cc_payment_selector_terminology;
                                } else if (value.VALUE == "tentative") {
                                    value.DISPLAY = enroller.options.tentative_selector_terminology;
                                } else if (value.VALUE == "direct_debit") {
                                    value.DISPLAY = enroller.options.direct_debit_selector_terminology;
                                } else if (value.VALUE == "epayment") {
                                    value.DISPLAY = enroller.options.epayment_terminology;
                                }
                                else if (value.VALUE == "ezypay") {
                                    value.DISPLAY = enroller.options.ezypay_terminology;
                                } else {
                                    value.DISPLAY = enroller.options.enrol_terminology;
                                }
                            });

                            enrolmentHolder.before(
                                enroller._createInputField("paymentMethods", validPaymentMethods)
                            );
                            billingStep.enhanceWithin();
                            $("#paymentMethods").on("change", function(e) {
                                enrolmentHolder.empty();
                                enrolmentHolder.append(enroller._selectPaymentMethod($(this).val()));
                                enroller._displaySetupChosens("billing");
                                var insertTarget = $("div.enroller-enrol-button-holder");

                                if (enrolOptions.TERMS != null) {
                                    if ($(this).val() != "epayment") {
                                        enroller._insertTerms(enrolOptions.TERMS, insertTarget, "before");
                                    }

                                    enrolmentHolder
                                        .find(".enroller-save-button")
                                        .addClass("ui-disabled")
                                        .prop("disabled", true)
                                        .prop("disabled", true);
                                }

                                enroller._insertSignatureBlock($("div.enroller-enrol-button-holder"), "before");

                                billingStep.enhanceWithin();
                            });
                        } else {
                            enrolmentHolder.append(
                                enroller._selectPaymentMethod(validPaymentMethods.VALUES[0].VALUE)
                            );
                            enroller._displaySetupChosens("billing");

                            if (enrolOptions.TERMS != null) {
                                if (validPaymentMethods.VALUES[0].VALUE != "epayment") {
                                    enroller._insertTerms(
                                        enrolOptions.TERMS,
                                        $("div.enroller-enrol-button-holder"),
                                        "before"
                                    );
                                }
                                enrolmentHolder
                                    .find(".enroller-save-button")
                                    .addClass("ui-disabled")
                                    .prop("disabled", true);
                            }
                            if (validPaymentMethods.VALUES[0].VALUE != "epayment") {
                                enroller._insertSignatureBlock($("div.enroller-enrol-button-holder"), "before");
                            }
                            billingStep.enhanceWithin();
                        }
                    }

                    /*Top Blurb*/
                    if (enrolOptions.BLURB_TOP != null && enrolOptions.BLURB_TOP != "") {
                        var blurbT = enroller._createBlurb(enrolOptions.BLURB_TOP);

                        $("#billing_step").prepend(blurbT);
                    }
                    if (enrolOptions.HEADER) {
                        var headerInfo = {
                            INFO_ONLY: true,
                            TYPE: "header",
                            DISPLAY: enrolOptions.HEADER
                        };
                        $("#billing_step").prepend(
                            enroller._createInfoFieldDetailed("billing_step_header", headerInfo)
                        );
                    }
                    /*Bottom Blurb*/
                    if (enrolOptions.BLURB_BOTTOM != null && enrolOptions.BLURB_BOTTOM != "") {
                        var blurbB = enroller._createBlurb(enrolOptions.BLURB_BOTTOM);
                        $("#billing_step").append(blurbB);
                    }

                    enroller._displaySetupChosens("billing");
                }
            }
        },

        _insertTerms: function(terms, location, beforeOrAfter) {
            var terms = enroller._createTerms(terms);
            if (beforeOrAfter == "after") {
                terms[1].insertAfter($(location));
                terms[0].insertAfter($(location));
            } else {
                terms[0].insertBefore($(location));
                terms[1].insertBefore($(location));
            }
        },
        _insertSignatureBlock: function(insertTarget, beforeOrAfter) {
            if (enroller.options.request_signature) {
                var sigData = {
                    EVENTS: {},
                    TRIGGER_EVENTS: {},
                    ID: "enrol_signature",
                    DISPLAY: "Signature",
                    TYPE: "signature",
                    CUSTOM: true,
                    REQUIRED: true,
                    INFO_ONLY: false
                };
                var signature = enroller._createInputField("enrol_signature", sigData);
                if (beforeOrAfter == "after") {
                    signature.insertAfter(insertTarget);
                } else {
                    signature.insertBefore(insertTarget);
                }
                enroller._loadSignatureFields();
            }
        },

        /* PAYMENT METHODS */
        _selectPaymentMethod: function(newMethod) {
            var paymentMethods = enroller.options.enroller_steps.billing.paymentMethods;

            if (newMethod == "invoice") {
                return enroller._createInvoiceMethod();
            } else if (newMethod == "payment") {

                if(enroller.options.payment_flow){
                    return enroller._createPaymentFlowMethod();
                }
                return enroller._createPaymentMethod();
            } else if (newMethod == "tentative") {
                return enroller._createTentativeMethod();
            } else if (newMethod == "direct_debit") {
                return enroller._createDirectDebitMethod();
            } else if (newMethod == "free") {
                return enroller._createFreeMethod();
            } else if (newMethod == "epayment") {
                return enroller._createEPaymentMethod("debit_success");
            }
            else if (newMethod == "ezypay") {
                return enroller._createEPaymentMethod("ezypay");
            }
        },

        _createFreeMethod: function() {
            var enrolButton = $(
                '<a class="ui-btn  enroller-save-button ui-btn-active">' +
                    enroller.options.enrol_terminology +
                    "</a>"
            );
            var enrolButtonHolder = enroller
                ._createInformationField("Enrol", "")
                .addClass("enroller-enrol-button-holder");
            enrolButtonHolder.find("div.enroller-text-field").remove();
            enrolButtonHolder
                .find("div.enroller-field-label")
                .text("")
                .css("background", "transparent")
                .css("border", "none");

            enrolButton.on("click", function() {
                var continueEnrol = true;
                if (enroller.options.request_signature === true) {
                    var signature = enroller.element.find("#enrol_signature");
                    if (signature.data("updated") !== true) {
                        continueEnrol = false;
                    } else {
                        var method = "free";
                        var allowPublicInhouse = enroller.element.data("allow_public_inhouse");
                        if (allowPublicInhouse == "inhouse") {
                            method = "Inhouse - Confirm";
                        }
                        enroller.element.trigger("enroller:signature_submission", {
                            signature: enroller._getInputValue("enrol_signature", {
                                TYPE: "signature"
                            }),
                            method: method
                        });
                    }
                }
                if (continueEnrol) {
                    if (enroller.options.group_booking != true && enroller.options.legacy_enrolment_mode) {
                        var params = enroller._enrolBasicParams();
                        if (enroller._enrolAdvancedParams() != null) {
                            $.each(enroller._enrolAdvancedParams(), function(key, value) {
                                params[key] = value;
                            });
                        }

                        enroller.options.course_enrol("free", params, null, function(success, response) {
                            response = enroller._enrolmentResponse(success, response);
                            $("#enrolmentHolder")
                                .empty()
                                .append(response);
                        });
                    } else {
                        enrolButton.hide();
                        enroller._multipleEnrolment("free", null, "#enrolmentHolder");
                    }
                } else {
                    enrolButton.hide();
                    enroller._alert("Please complete the required fields.");
                }
            });
            enrolButtonHolder.append(enrolButton);
            return enrolButtonHolder;
        },

        _createInvoiceMethod: function() {
            var enrolButton = $(
                '<a class="ui-btn  enroller-save-button ui-btn-active">' +
                    enroller.options.enrol_invoice_terminology +
                    "</a>"
            );
            var invoiceBlockHolder = $('<div />').addClass('enroller-invoice-method-holder');
            var enrolButtonHolder = enroller
                ._createInformationField("Enrol", "")
                .addClass("enroller-enrol-button-holder");
            enrolButtonHolder.find("div.enroller-text-field").remove();
            enrolButtonHolder
                .find("div.enroller-field-label")
                .text("")
                .css("background", "transparent")
                .css("border", "none");
            if (enroller.options.add_purchase_order == true) {
                var PONUMBER = { DISPLAY: "Purchase Order", TYPE: "text", REQUIRED: false };
                var input = enroller._createInputField('PONUMBER', PONUMBER);
                input.on('change', 'input', function (e) {
                    var field = $(this);
                    enroller.options.purchase_order = $(this).val();
                });
                invoiceBlockHolder.append(input);
            }


            enrolButton.on("click", function() {
                var continueEnrol = true;
                if (enroller.options.request_signature === true) {
                    var signature = enroller.element.find("#enrol_signature");
                    if (signature.data("updated") !== true) {
                        continueEnrol = false;
                    } else {
                        var sigData = enroller._getInputValue("enrol_signature", {
                            TYPE: "signature"
                        });
                        enroller.element.trigger("enroller:signature_submission", {
                            signature: sigData,
                            method: "payment"
                        });
                    }
                }
                if (continueEnrol) {
                    if (enroller.options.group_booking != true && enroller.options.legacy_enrolment_mode) {
                        var params = enroller._enrolBasicParams();
                        if (enroller._enrolAdvancedParams() != null) {
                            $.each(enroller._enrolAdvancedParams(), function(key, value) {
                                params[key] = value;
                            });
                        }

                        enroller.options.course_enrol("invoice", params, null, function(success, response) {
                            response = enroller._enrolmentResponse(success, response);
                            $("#enrolmentHolder")
                                .empty()
                                .append(response);
                        });
                    } else {
                        enrolButton.hide();
                        enroller._multipleEnrolment("invoice", null, "#enrolmentHolder");
                    }
                } else {
                    enrolButton.show();
                    enroller._alert("Please complete the required fields.");
                }
            });
            invoiceBlockHolder.append(enrolButtonHolder.append(enrolButton));
            return invoiceBlockHolder;
        },

        _createPaymentFlowMethod:function(){
            var paymentContent = $('<div id="paymentFlow"></div>');
            var invoiceData = enroller.element.data("invoice_data");


            enroller._beginPaymentFlow(invoiceData);


            return paymentContent;

            // will need to trigger an ajax call here, then target the payment content when done? or ? hrm.

        },

        _createPaymentMethod: function() {
            var surchargePercent = 0;
            if (enroller.options.surcharge_on != null) {
                if (enroller.options.surcharge_on.payment != null) {
                    surchargePercent = enroller.options.surcharge_on.payment;
                }
            }

            var paymentContent = $('<form class="enroller-payment" />');
            var cost = enroller.options.cost;
            var invoiceData = enroller.element.data("invoice_data");
            if (invoiceData != null && invoiceData.INVOICEID === enroller.options.invoice_id) {
                cost = invoiceData.BALANCE;
            } else {
                if (enroller.options.group_booking) {
                    cost = enroller._calculateTotalCostGroupBooking();
                }

                if (enroller.options.round_to_dollar) {
                    cost = Math.ceil(cost);
                }
            }

            if (parseFloat(surchargePercent) > 0) {
                var surchargeCost = cost * surchargePercent;
                surchargeCost = surchargeCost.toFixed(2);
                if (enroller.options.round_to_dollar) {
                    surchargeCost = Math.ceil(surchargeCost);
                }
                var surchargeField = enroller
                    ._createInformationField("Surcharge", enroller._currencyDisplayFormat(surchargeCost))
                    .addClass("enroller-surcharge-holder");
                paymentContent.append(surchargeField);
            }

            var enrolButton = $(
                '<button class="ui-btn enroller-save-button ui-btn-active" type="submit" name="submit">' +
                    enroller.options.enrol_payment_terminology +
                    "</button>"
            );

            var enrolButtonHolder = enroller
                ._createInformationField("Enrol", "")
                .addClass("enroller-enrol-button-holder");
            enrolButtonHolder.find("div.enroller-text-field").remove();
            enrolButtonHolder
                .find("div.enroller-field-label")
                .text("")
                .css("background", "transparent")
                .css("border", "none");
            if (enroller.options.enroller_steps.billing.paymentMethods)
                var fields = {
                    CARDNUMBER: {
                        DISPLAY: "Card Number",
                        TYPE: "text",
                        REQUIRED: true,
                        PATTERN: "[0-9]{13,16}",
                        MAXLENGTH: 16,
                        TITLE: "13 or 16 digits.",
                        AUTOCOMPLETE:'off'
                    },
                 
                    NAMEONCARD: { DISPLAY: "Name on Card", TYPE: "text", REQUIRED: true, AUTOCOMPLETE:'off' },
                    EXPIRYMONTH: {
                        DISPLAY: "Expiry (Month)",
                        TYPE: "select",
                        REQUIRED: true,
                        VALUES: [
                            { DISPLAY: "01 - January", VALUE: "01" },
                            { DISPLAY: "02 - February", VALUE: "02" },
                            { DISPLAY: "03 - March", VALUE: "03" },
                            { DISPLAY: "04 - April", VALUE: "04" },
                            { DISPLAY: "05 - May", VALUE: "05" },
                            { DISPLAY: "06 - June", VALUE: "06" },
                            { DISPLAY: "07 - July", VALUE: "07" },
                            { DISPLAY: "08 - August", VALUE: "08" },
                            { DISPLAY: "09 - September", VALUE: "09" },
                            { DISPLAY: "10 - October", VALUE: "10" },
                            { DISPLAY: "11 - November", VALUE: "11" },
                            { DISPLAY: "12 - December", VALUE: "12" }
                        ],
                        AUTOCOMPLETE:'cc-exp'
                    },
                    EXPIRYYEAR: {
                        DISPLAY: "Expiry (Year)",
                        TYPE: "select",
                        REQUIRED: true,
                        VALUES: [],
                        AUTOCOMPLETE:'off'
                    },

                    CARDCCV: {
                        DISPLAY: "SecurityCode",
                        TYPE: "text",
                        REQUIRED: true,
                        PATTERN: "[0-9]{3,4}",
                        MAXLENGTH: 4,
                        TITLE: "3 or 4 digits found on the back of the card.",
                        AUTOCOMPLETE:'off'
                    }
                };
            if (enroller.options.add_purchase_order == true) {
                fields.PONUMBER = { DISPLAY: "Purchase Order", TYPE: "text", REQUIRED: false };
            }

            for (i = 0; i < 15; i++) {
                var year = new Date().getFullYear();
                var yearOption = { DISPLAY: year + i, VALUE: year + i };
                fields.EXPIRYYEAR.VALUES.push(yearOption);
            }
            $.each(fields, function(key, field) {
                var fieldHolder = enroller._createInputField(key, field);

                paymentContent.append(fieldHolder);
            });

            paymentContent.append(enrolButtonHolder.append(enrolButton));

            enrolButton.on("click", function(e) {
                e.preventDefault();
                var paymentParams = {};
                var enrolmentParams = {};
                enrolButton.hide();
                var continueEnrol = true;
                if (enroller.options.request_signature === true) {
                    var signature = enroller.element.find("#enrol_signature");
                    if (signature.data("updated") !== true) {
                        continueEnrol = false;
                    } else {
                        var sigData = enroller._getInputValue("enrol_signature", {
                            TYPE: "signature"
                        });

                        enroller.element.trigger("enroller:signature_submission", {
                            signature: sigData,
                            method: "payment"
                        });
                    }
                }
                if (continueEnrol) {
                    /* Build standard params if not using group_booking */
                    if (enroller.options.group_booking != true && enroller.options.legacy_enrolment_mode) {
                        paymentParams = enroller._enrolBasicParams("invoice");
                        paymentParams.paymentAmount = enroller.options.cost;
                        paymentParams.totalAmount = enroller.options.cost;
                        if (parseFloat(surchargePercent) > 0) {
                            paymentParams.addSurcharge = paymentParams.paymentAmount * surchargePercent;
                        }
                        enrolmentParams = enroller._enrolBasicParams();

                        if (enroller._enrolAdvancedParams() != null) {
                            $.each(enroller._enrolAdvancedParams(), function(key, value) {
                                enrolmentParams[key] = value;
                            });
                        }
                    }

                    var valid = true;
                    $.each(fields, function(key, field) {
                        var fieldValue = enroller._getInputValue(key, field);
                        if (fieldValue != null && fieldValue != "") {
                            paymentParams[key] = fieldValue;
                        } else {
                   
                            if (field.REQUIRED) {
                                valid = false;
                            }
                        }
                        if(key=== 'CARDNUMBER'){
                            if(!enroller._regexIsValid(fields.CARDNUMBER.PATTERN, fieldValue)){
                                valid = false;
                            }
                        }
                        if(key=== 'CARDCCV'){
                            if(!enroller._regexIsValid(fields.CARDCCV.PATTERN, fieldValue)){
                                valid = false;
                            }
                        }
                    });

                    if (valid) {
                        if (enroller.options.user_ip != null && enroller.options.user_ip !== "") {
                            paymentParams.customerIP = enroller.options.user_ip;
                        }
                        /* Legacy Enrolment code - disabled as it is not needed */
                        if (enroller.options.group_booking != true && enroller.options.legacy_enrolment_mode) {
                            if (enroller.options.round_to_dollar) {
                                paymentParams.addSurcharge = Math.ceil(paymentParams.addSurcharge);
                                paymentParams.paymentAmount = Math.ceil(paymentParams.paymentAmount);
                                paymentParams.totalAmount = Math.ceil(paymentParams.totalAmount);

                                if (enrolmentParams.cost) {
                                    enrolmentParams.cost = Math.ceil(enrolmentParams.cost);
                                }
                            }

                            enroller.options.course_enrol("payment", enrolmentParams, paymentParams, function(
                                success,
                                response
                            ) {
                                var response = enroller._enrolmentResponse(success, response);
                                $("#enrolmentHolder")
                                    .empty()
                                    .append(response);
                            });
                        } else {
                            /*GROUP BOOKINGS THROUGH THIS BLOCK*/

                            paymentParams.payerID = enroller.options.payer_id;

                            paymentParams.paymentAmount = cost;

                            if (parseFloat(surchargePercent) > 0) {
                                paymentParams.addSurcharge = paymentParams.paymentAmount * surchargePercent;
                                if (enroller.options.round_to_dollar) {
                                    paymentParams.addSurcharge = Math.ceil(paymentParams.addSurcharge);
                                }
                            }
                            enroller._multipleBookingPayment(paymentParams);
                        }
                    } else {
                        enrolButton.show();
                        enroller._alert("Please complete the required fields.");
                    }
                } else {
                    enrolButton.show();
                    enroller._alert("Please complete the required fields.");
                }
            });

            return paymentContent;
        },

        _createTentativeMethod: function() {
            var enrolButton = $(
                '<a class="ui-btn  enroller-save-button ui-btn-active">' +
                    enroller.options.enrol_tentative_terminology +
                    "</a>"
            );

            var enrolButtonHolder = enroller
                ._createInformationField("Enrol", "")
                .addClass("enroller-enrol-button-holder");
            enrolButtonHolder.find("div.enroller-text-field").remove();
            enrolButtonHolder
                .find("div.enroller-field-label")
                .text("")
                .css("background", "transparent")
                .css("border", "none");

            if (enroller.options.multiple_courses != null) {
                /* Agent tentative enrolments - slightly different than normal mode */
                if (enroller.options.agent_multiple == true) {
                    var courseData = $.extend(
                        true,
                        {},
                        enroller.options.multiple_courses[enroller.options.contact_id],
                        {}
                    );
                    var courseArray = [];

                    $.each(courseData, function(i, instance) {
                        if (i != "CONTACT_NAME") {
                            delete instance.COURSENAME;
                            if (instance.payerID == null) {
                                instance.payerID = enroller.options.contact_id;
                            }
                            /*prevent enrolment into course*/
                            instance.bookOnDefaultWorkshops = false;
                            instance.tentative = true;
                            courseArray.push(instance);
                        }
                    });
                    enrolButton.on("click", function() {
                        var continueEnrol = true;
                        if (enroller.options.request_signature === true) {
                            var signature = enroller.element.find("#enrol_signature");
                            if (signature.data("updated") !== true) {
                                continueEnrol = false;
                            } else {
                                enroller.element.trigger("enroller:signature_submission", {
                                    signature: enroller._getInputValue("enrol_signature", {
                                        TYPE: "signature"
                                    }),
                                    method: "tentative"
                                });
                            }
                        }
                        if (continueEnrol) {
                            $("#enrolmentHolder").empty();
                            /*create the invoice on the first call*/

                            if (enroller.options.invoice_on_tentative) {
                                courseArray[0].generateInvoice = 1;
                                courseArray[0].lockInvoiceItems = 0;
                            }

                            enroller._loopEnrolCall(0, courseArray);

                            /*clear the courses*/
                            enroller._setOption("multiple_courses", null);
                            enroller._enrolmentCompleteCleanup();
                        } else {
                            enrolButton.show();
                            enroller._alert("Please complete the required fields.");
                        }
                    });
                } else {
                    enrolButton.on("click", function() {
                        enrolButton.hide();
                        var continueEnrol = true;
                        if (enroller.options.request_signature === true) {
                            var signature = enroller.element.find("#enrol_signature");
                            if (signature.data("updated") !== true) {
                                continueEnrol = false;
                            } else {
                                enroller.element.trigger("enroller:signature_submission", {
                                    signature: enroller._getInputValue("enrol_signature", {
                                        TYPE: "signature"
                                    }),
                                    method: "tentative"
                                });
                            }
                        }
                        if (continueEnrol) {
                            enroller._multipleEnrolment("tentative", null, "#enrolmentHolder");
                        } else {
                            enrolButton.show();
                            enroller._alert("Please complete the required fields.");
                        }
                    });
                }
            } else {
                /* This code block will never run, unless legacy mode is enabled*/

                enrolButton.on("click", function() {
                    enrolButton.hide();
                    var continueEnrol = true;
                    if (enroller.options.request_signature === true) {
                        var signature = enroller.element.find("#enrol_signature");
                        if (signature.data("updated") !== true) {
                            continueEnrol = false;
                        } else {
                            enroller.element.trigger("enroller:signature_submission", {
                                signature: enroller._getInputValue("enrol_signature", {
                                    TYPE: "signature"
                                }),
                                method: "tentative"
                            });
                        }
                    }
                    if (continueEnrol) {
                        var params = enroller._enrolBasicParams();

                        if (enroller._enrolAdvancedParams() != null) {
                            $.each(enroller._enrolAdvancedParams(), function(key, value) {
                                params[key] = value;
                            });
                        }

                        if (enroller.options.invoice_on_tentative) {
                            params.generateInvoice = 1;
                        } else {
                            params.generateInvoice = 0;
                        }
                        params.tentative = true;

                        enroller.options.course_enrol("enrol", params, null, function(success, response) {
                            response = enroller._enrolmentResponse(success, response);
                            $("#enrolmentHolder")
                                .empty()
                                .append(response);
                            enroller.element.trigger("page_ready");
                        });
                    } else {
                        enrolButton.show();
                        enroller._alert("Please complete the required fields.");
                    }
                });
            }

            enrolButtonHolder.append(enrolButton);
            return enrolButtonHolder;
        },

        _createDirectDebitMethod: function() {
            var enrolButton = $(
                '<a class="ui-btn  enroller-save-button ui-btn-active">' +
                    enroller.options.enrol_direct_debit_terminology +
                    "</a>"
            );

            var enrolButtonHolder = enroller
                ._createInformationField("Enrol", "")
                .addClass("enroller-enrol-button-holder");
            enrolButtonHolder.find("div.enroller-text-field").remove();
            enrolButtonHolder
                .find("div.enroller-field-label")
                .text("")
                .css("background", "transparent")
                .css("border", "none");

            if (enroller.options.multiple_courses != null) {
                /* Agent tentative enrolments - slightly different than normal mode */
                enrolButton.on("click", function() {
                    enrolButton.hide();
                    var continueEnrol = true;
                    if (enroller.options.request_signature === true) {
                        var signature = enroller.element.find("#enrol_signature");
                        if (signature.data("updated") !== true) {
                            continueEnrol = false;
                        } else {
                            enroller.element.trigger("enroller:signature_submission", {
                                signature: enroller._getInputValue("enrol_signature", {
                                    TYPE: "signature"
                                }),
                                method: "direct_debit"
                            });
                        }
                    }
                    if (continueEnrol) {
                        enroller._multipleEnrolment("direct_debit", null, "#enrolmentHolder");
                    } else {
                        enrolButton.show();
                        enroller._alert("Please complete the required fields.");
                    }
                });
            } else {
                /* This code block will never run, unless legacy mode is enabled*/

                enrolButton.on("click", function() {
                    enrolButton.hide();
                    var continueEnrol = true;
                    if (enroller.options.request_signature === true) {
                        var signature = enroller.element.find("#enrol_signature");
                        if (signature.data("updated") !== true) {
                            continueEnrol = false;
                        } else {
                            enroller.element.trigger("enroller:signature_submission", {
                                signature: enroller._getInputValue("enrol_signature", {
                                    TYPE: "signature"
                                }),
                                method: "direct_debit"
                            });
                        }
                    }
                    if (continueEnrol) {
                        var params = enroller._enrolBasicParams();

                        if (enroller._enrolAdvancedParams() != null) {
                            $.each(enroller._enrolAdvancedParams(), function(key, value) {
                                params[key] = value;
                            });
                        }

                        if (enroller.options.invoice_on_tentative) {
                            params.generateInvoice = 1;
                        } else {
                            params.generateInvoice = 0;
                        }
                        params.tentative = true;

                        enroller.options.course_enrol("enrol", params, null, function(success, response) {
                            response = enroller._enrolmentResponse(success, response);
                            $("#enrolmentHolder")
                                .empty()
                                .append(response);
                            enroller.element.trigger("page_ready");
                        });
                    } else {
                        enrolButton.show();
                        enroller._alert("Please complete the required fields.");
                    }
                });
            }

            enrolButtonHolder.append(enrolButton);
            return enrolButtonHolder;
        },

        /* ENROLMENT_FUNCTIONS */

        _loopEnrolCall: function(position, array) {
            if (position <= array.length - 1) {
                var instanceName = array[position].NAME;
                delete array[position].NAME;
                /*remove cost if discounts unspecified*/
                if (array[position].discountIDList == null) {
                    if (array[position].cost != null) {
                        delete array[position].cost;
                    }
                    if (array[position].originalCost != null) {
                        delete array[position].originalCost;
                    }
                }
                enroller.options.course_enrol("enrol", array[position], null, function(success, response) {
                    /*check to see if the previous enrolment was invoiced*/
                    if (response.INVOICEID != null) {
                        if (parseInt(response.INVOICEID) > 0) {
                            if (position < array.length - 1) {
                                array[position + 1].invoiceID = response.INVOICEID;
                                array[position + 1].generateInvoice = 1;
                            }
                        } else if (position < array.length - 1) {
                            array[position + 1].generateInvoice = 0;
                        }
                    } else if (position < array.length - 1) {
                        array[position + 1].generateInvoice = 0;
                    }

                    response = enroller._enrolmentResponse(success, response);
                    response.prepend(instanceName + ": ");
                    $("#enrolmentHolder").append(response);

                    enroller._loopEnrolCall(position + 1, array);
                    enroller.element.trigger("page_ready");
                });
            }
        },
        _enrolBasicParams: function(method) {
            var enroller = this;
            if (method == null) {
                method = "enrol";
            }
            var params = {
                contactID: enroller.options.contact_id,
                instanceID: enroller.options.course.INSTANCEID,
                type: enroller.options.course.TYPE,
                payerID: enroller.options.payer_id
            };

            /*This block of code should never be processed for a logged in user - unless they are an agent / Admin */
            if (params.payerID == null || params.payerID == 0) {
                params.payerID = enroller.options.contact_id;
                if (enroller.element.data("USER_AX_TOKEN") != null) {
                    var userData = enroller.element.data("USER_AX_TOKEN");
                    if (userData.ROLETYPEID == enroller.CLIENT_ID) {
                        params.payerID = enroller.element.data("USER_AX_TOKEN").CONTACTID;
                    }
                }
            }

            if (method == "enrol") {
                params.generateInvoice = 1;

                /*
				 * placeholdercode for discounts
				 */
                if (enroller.options.discounts_selected != null) {
                    var discountList = [];
                    if ($.isArray(enroller.options.discounts_selected)) {
                        $.each(enroller.options.discounts_selected, function(i, discount) {
                            discountList.push(discount.DISCOUNTID);
                        });
                        discountList = discountList.join();
                    }
                    params.discountIDList = discountList;
                    params.cost = parseFloat(enroller.options.cost);
                }
                if (parseInt(enroller.options.agent_id) > 0) {
                    params.marketingAgentContactID = enroller.options.agent_id;
                }
            }

            return params;
        },
        /*
		 * placeholder for extra params such as study reason
		 * */
        _enrolAdvancedParams: function() {
            if (enroller.element.data("enrol_advanced") != null) {
                return enroller.element.data("enrol_advanced");
            }
            return null;
        },

        _multipleBookingPayment: function(paymentParams) {
            var enroller = this;
            var invoiceID = enroller.options.invoice_id;
            $('#enrolmentResponse').remove();
            if (invoiceID != null) {
                paymentParams.invoiceID = invoiceID;
                enroller.options.payment_only(paymentParams, function(success, result) {
                    if (success) {
                        if (enroller.options.payment_tentative == true) {
                            //Set contact note because reasons.
                            enroller.element.trigger("enroller:signature_submission", {
                                method: "Payment With Tentative Enrolment"
                            });

                            enroller._multipleEnrolment("tentative", paymentParams, "#enrolmentHolder");
                        } else {
                            enroller._multipleEnrolment("confirmation", paymentParams, "#enrolmentHolder");
                        }
                    } else {
                        /*loop response*/
                       
                        response = enroller._enrolmentResponse(success, result);
                        $("#enrolmentHolder").append(response);
                        $("#enrolmentHolder").find('button.enroller-save-button').show();
                    }
                });
            } else {
                enroller._alert("There waas an error during your booking :(.");
            }
        },

        /*Takes the various variables needed and brings them together. Creates a easily referenced array of students/instances*/
        _multipleEnrolment: function(method, paymentParams, selector, callback) {
            enroller.element.data("enrolment_status", []);

            var instanceList = enroller._flatternMultipleEnrolments();
            var enrolmentListSnapshot = $.extend(true, {}, enroller.options.multiple_courses, {});
            var invoiceID = null;

            /* WP-152: Set Invoice ID for second call to enrolment. Without this it is possible that 2 invoices will be generated.*/
            if (enroller.options.invoice_id != null && parseInt(enroller.options.invoice_id) > 0) {
                invoiceID = parseInt(enroller.options.invoice_id);
            }

            if (instanceList.length > 0) {
                enroller._loopInstanceEnrolments(
                    method,
                    instanceList,
                    enrolmentListSnapshot,
                    paymentParams,
                    selector,
                    0,
                    invoiceID,
                    callback
                );
            }
        },

        _flatternMultipleEnrolments: function() {
            var instanceList = [];
            var enrolments = enroller.options.multiple_courses;

            if (enrolments != null) {
                $.each(enrolments, function(contactID, courses) {
                    $.each(courses, function(i, instance) {
                        if (i != "CONTACT_NAME") {
                            var found = false;
                            if (instanceList.length > 0) {
                                $.each(instanceList, function(i, iListInstance) {
                                    if (
                                        instance.instanceID == iListInstance.INSTANCEID &&
                                        instance.type == iListInstance.TYPE
                                    ) {
                                        found = true;
                                        iListInstance.CONTACTS.push(instance.contactID);
                                        iListInstance.COST += parseFloat(instance.cost);
                                    }
                                });
                            }
                            if (!found) {
                                var temp = {
                                    INSTANCEID: instance.instanceID,
                                    TYPE: instance.type,
                                    CONTACTS: [instance.contactID],
                                    COST: parseFloat(instance.cost)
                                };
                                instanceList.push(temp);
                            }
                        }
                    });
                });
            }
            return instanceList;
        },

        /*Loops through enrolments / payments. Confirms enrolments if payment is successful*/
        _loopInstanceEnrolments: function(
            method,
            instanceList,
            enrolments,
            paymentParams,
            selector,
            position,
            invoiceID,
            callback
        ) {
            enroller._loopIndividualEnrolmentCall(
                method,
                instanceList,
                enrolments,
                paymentParams,
                selector,
                position,
                0,
                invoiceID,
                callback
            );
        },

        /*Individual enrolment call, Confirms if enrolment is passed through - or could be used for tentative*/
        _loopIndividualEnrolmentCall: function(
            method,
            instanceList,
            enrolments,
            paymentParams,
            selector,
            positionInstance,
            positionContact,
            invoiceID,
            callback
        ) {
            var contactID = instanceList[positionInstance].CONTACTS[positionContact];
            var instanceID = instanceList[positionInstance].INSTANCEID;
            var enrolmentParams = enrolments[contactID][instanceID];
            
            if (invoiceID != null) {
                enrolmentParams.invoiceID = parseInt(invoiceID);
                enroller.options.invoice_id = enrolmentParams.invoiceID;
            }

            if(enroller.options.purchase_order != null && enroller.options.purchase_order != ""){
                enrolmentParams.PONumber = enroller.options.purchase_order;
            }
            var tempMethod = method;

            enrolmentParams.generateInvoice = 1;

            /* Payment has already been made, change method here */
            if (method == "payment") {
                tempMethod = "confirmation";
            }
            var allowPublicInhouse = enroller.element.data("allow_public_inhouse");
            if (enroller.options.multiple_workshop_override === "override_all" && enrolmentParams.type === "p") {
                enrolmentParams.bookOnDefaultWorkshops = false;
                enroller.options.multiple_courses[contactID][instanceID].bookOnDefaultWorkshops = false;
            }
            if (method == "initial") {
                enrolmentParams.tentative = true;
                enrolmentParams.suppressNotifications = true;

                if (allowPublicInhouse == "inhouse") {
                    enrolmentParams.generateInvoice = 0;
                } else {
                    enrolmentParams.archiveInvoice = false;
                    enrolmentParams.lockInvoiceItems = 0;
                    enrolmentParams.generateInvoice = 1;
                }
                
            } else {
                /*remove discount ID list as it's already been passed through*/
                if (enrolmentParams.discountIDList != null) {
                    if (enrolmentParams.cost != null) {
                        delete enrolmentParams.cost;
                    }
                    if (enrolmentParams.originalCost != null) {
                        delete enrolmentParams.originalCost;
                    }
                    delete enrolmentParams.discountIDList;
                }
            }

            if (method != "initial" && allowPublicInhouse == "inhouse") {
                if (enroller.options.inhouse_confirm_bookings == true) {
                    if (enrolmentParams.tentative != null) {
                        delete enrolmentParams.tentative;
                    }
                    enrolmentParams.generateInvoice = 0;
                    if (enrolmentParams.invoiceID != null) {
                        delete enrolmentParams.invoiceID;
                    }
                    enrolmentParams.suppressNotifications = false;
                } else {
                    enrolmentParams.tentative = true;
                    enrolmentParams.generateInvoice = 0;
                    if (enrolmentParams.invoiceID != null) {
                        delete enrolmentParams.invoiceID;
                    }
                    enrolmentParams.suppressNotifications = false;
                }
            } else {
                if (method == "free") {
                    enrolmentParams.generateInvoice = 0;
                }

                if (method == "tentative") {
                    if (!enroller.options.invoice_on_tentative) {
                        enrolmentParams.generateInvoice = 0;
                        if (enrolmentParams.invoiceID != null) {
                            delete enrolmentParams.invoiceID;
                        }
                    }
                    enrolmentParams.tentative = true;
                    enrolmentParams.suppressNotifications = false;
                }

                if (method == "direct_debit") {
                    enrolmentParams.generateInvoice = 0;
                    if (enroller.options.direct_debit_tentative === true) {
                        enrolmentParams.tentative = true;
                    }
                }

                if (method === "invoice") {
                    if (enroller.options.invoice_tentative === true) {
                        enrolmentParams.tentative = true;
                    }
                }
            }
            if (enrolmentParams.discountIDList == null) {
                if (enrolmentParams.cost != null) {
                    delete enrolmentParams.cost;
                }
            }

            /*Always free Bookings, turn off invoicing if this setting is enabled.*/
            if (enroller.options.always_free_bookings == true) {
                enrolmentParams.generateInvoice = 0;
            }

            if (enroller.options.always_suppress_notifications == true) {
                enrolmentParams.suppressNotifications = 1;
            }

            if (enroller.options.use_registration_form === true) {
                enrolmentParams.useRegistrationFormDefaults = 1;
            }
            
            var enrollingParams = {};

            var keys = Object.keys(enrolmentParams);
            
            for (var i = 0; i < keys.length; i++) {
         
                var key = keys[i];
                enrollingParams[key] = enrolmentParams[key];
            }

            // Delete some of the extra data that is added as part of booking.
            if (enrollingParams.extraItemBookingIDs != null) {
                delete enrollingParams.extraItemBookingIDs;
            }
            if (enrollingParams.NAME != null) {
                delete enrollingParams.NAME;
            }
            if (enrollingParams.DATESDISPLAY != null) {
                delete enrollingParams.DATESDISPLAY;
            }
            if (enrollingParams.COURSENAME != null) {
                delete enrollingParams.COURSENAME;
            }
            // End cleanup.

            enroller.options.course_enrol(tempMethod, enrollingParams, null, function(success, response) {
                /** WP-359: Book on default workshop override for the "on_error" setting*/
                if (!success && response.error === 403) {
                    if (response.resultBody.MESSAGES.indexOf("bookOnDefaultWorkshops" > -1)) {
                        if (enroller.options.multiple_workshop_override === "on_error") {
                            enrolmentParams.bookOnDefaultWorkshops = false;
                            enrolments[contactID][instanceID] = enrolmentParams;
                            enroller.options.multiple_courses[contactID][instanceID].bookOnDefaultWorkshops = false;
                            enroller._loopIndividualEnrolmentCall(
                                method,
                                instanceList,
                                enrolments,
                                paymentParams,
                                selector,
                                positionInstance,
                                positionContact,
                                invoiceID,
                                callback
                            );
                            return;
                        }
                    }
                }

                var successStatus = {
                    CONTACTID: contactID,
                    INSTANCE: instanceList[positionInstance],
                    ENROLMENT: enrolmentParams,
                    RESPONSE: response,
                    SUCCESS: success
                };
                // store the status.
                enroller._multipleEnrolmentStatus(successStatus);

                if (tempMethod == "tentative" && enroller.options.enquiry_on_tentative && success) {
                    var currentLocation = window.location.hostname;
                    var enquiryParams = {
                        noteCodeID: 88,
                        comments:
                            enroller.options.terminology_student +
                            " enrolled tentatively from - " +
                            currentLocation,
                        ID: successStatus.INSTANCE.ID,
                        type: successStatus.INSTANCE.TYPE,
                        contactID: successStatus.CONTACTID
                    };
                    if (enroller.options.enrolment_hash != null) {
                        var enrolHash = "<br />Enrolment Hash: " + enroller.options.enrolment_hash;
                        enquiryParams.comments = enquiryParams.comments + enrolHash;
                    }
                    enroller.options.course_enquire(enquiryParams, function(reponse) {
                        /*do nothing!*/
                    });
                }
                if (tempMethod == "direct_debit" && success) {
                    var currentLocation = window.location.hostname;
                    var enquiryParams = {
                        noteCodeID: 88,
                        comments:
                            enroller.options.terminology_student +
                            " enrolled and requested Direct Debit from - " +
                            currentLocation,
                        ID: successStatus.INSTANCE.ID,
                        type: successStatus.INSTANCE.TYPE,
                        contactID: successStatus.CONTACTID
                    };
                    if (enroller.options.enrolment_hash != null) {
                        var enrolHash = "<br />Enrolment Hash: " + enroller.options.enrolment_hash;
                        enquiryParams.comments = enquiryParams.comments + enrolHash;
                    }
                    enroller.options.course_enquire(enquiryParams, function(reponse) {
                        /*do nothing!*/
                    });
                }

                var newInvoiceID = null;
                if (invoiceID == null) {
                    if (response.INVOICEID != null && response.INVOICEID != 0) {
                        newInvoiceID = response.INVOICEID;
                        enroller.options.invoice_id = response.INVOICEID;
                    }
                } else {
                    if (response.INVOICEID != null && response.INVOICEID != 0) {
                        if (response.INVOICEID != invoiceID && invoiceID != 0) {
                            /* This block should never be called - as the API will not return a different invoiceID Rob: 22-11-16 */
                            enroller._alert(
                                "Enrolment Already Invoiced For " +
                                    contactID +
                                    "in " +
                                    successStatus.INSTANCE.INSTANCEID +
                                    "<br/>Removed from booking."
                            );
                            enroller._removeFromBooking(successStatus);
                        }
                        /* Set the invoiceID to the existing invoice ID, and remove the erroneous enrolment from the list */
                        newInvoiceID = invoiceID;
                    } else {
                        newInvoiceID = invoiceID;
                    }
                }
                if (positionContact == instanceList[positionInstance].CONTACTS.length - 1) {
                    if (positionInstance == instanceList.length - 1) {
                        enroller._multipleEnrolmentComplete(selector, tempMethod, callback);
                    } else {
                        enroller._loopInstanceEnrolments(
                            method,
                            instanceList,
                            enrolments,
                            paymentParams,
                            selector,
                            positionInstance + 1,
                            newInvoiceID,
                            callback
                        );
                    }
                } else {
                    enroller._loopIndividualEnrolmentCall(
                        method,
                        instanceList,
                        enrolments,
                        paymentParams,
                        selector,
                        positionInstance,
                        positionContact + 1,
                        newInvoiceID,
                        callback
                    );
                }
            });
        },

        _removeFromBooking: function(successState) {
            var enrolment = {
                contactID: successState.CONTACTID,
                instanceID: successStatus.INSTANCE.INSTANCEID
            };
            enroller._removeStudentEnrolment(enrolment, function() {
                enroller.element.trigger("enroller:removed_booking");
            });
        },

        _multipleEnrolmentStatus: function(successState) {
            var currentStatuses = enroller.element.data("enrolment_status");
            if (currentStatuses == null) {
                currentStatuses = [];
            }
            currentStatuses.push(successState);
            enroller.element.data("enrolment_status", currentStatuses);
        },
        _multipleEnrolmentComplete: function(selector, method, callback) {
            var statuses = enroller.element.data("enrolment_status");
            var messageHolder = $('<div class="enroller-multiple-complete"></div>');

            var noErrors = true;
            $.each(statuses, function(i, status) {
                if (!status.SUCCESS) {
                    noErrors = false;
                }
                if (method == "initial") {
                    if (!status.SUCCESS) {
                        var response = enroller._enrolmentResponse(status.SUCCESS, status.RESPONSE);
                        messageHolder.append(response);
                    }
                } else {
                    var response = enroller._enrolmentResponse(status.SUCCESS, status.RESPONSE);
                    messageHolder.append(response);
                }
            });

            var statusUpdate = {
                user_contact_id: enroller.options.user_contact_id,
                contact_id: enroller.options.contact_id,
                method: method,
                enrolment_status: statuses,
                errors: !noErrors,
                enrolments: enroller.options.multiple_courses,
                payer_id: enroller.options.payer_id,
                invoice_id: enroller.options.invoice_id,
                course: enroller.options.course,
                config_id: enroller.options.config_id,
                enrolment_complete: true
            };
            var allowPublicInhouse = enroller.element.data("allow_public_inhouse");
            if (allowPublicInhouse == "inhouse") {
                statusUpdate.allow_public_inhouse = "inhouse";
            }
            enroller.element.trigger("enroller:enrolment_status_update", statusUpdate);

            if (method == "initial") {
                enroller.element.find("div.enroller-step:visible").append('<div id="enrolmentFailure"></div>');
                $("#enrolmentFailure").append(messageHolder);
            } else if ($(selector).length != null) {
                $(selector)
                    .empty()
                    .append(messageHolder);
            }

            if (method != "initial") {
                enroller.element.data("booking_in_progress", null);

                if (noErrors) {
                    enroller.element.trigger("enroller:enrolment_complete", {
                        user_contact_id: enroller.options.user_contact_id,
                        method: method,
                        enrolment_status: statuses,
                        errors: !noErrors,
                        enrolments: enroller.options.multiple_courses,
                        payer_id: enroller.options.payer_id,
                        invoice_id: enroller.options.invoice_id,
                        config_id: enroller.options.config_id
                    });

                    enroller._enrolmentCompleteCleanup();
                }
                enroller._updateStepButtons();
            }
            if (callback != null) {
                callback(noErrors);
            }
        },

        //#region Epayment

        /* Epayment*/
        _multipleBookingEPayment: function(paymentParams) {
            var enroller = this;
            var invoiceID = enroller.options.invoice_id;

            if (invoiceID != null) {
                paymentParams.invoiceID = invoiceID;
                enroller.options.epayment_begin(paymentParams, function(result) {
                    var paymentURL = result.PAYMENTURL;

                    var ePaymentHolder = $('<div class="ax-epayment-holder"></div>');
                    ePaymentHolder.insertAfter(enroller.element);
                    if (window.jQuery.axcelerate.epayment != undefined) {
                        var ePayment = ePaymentHolder.epayment({
                            iframe_src: paymentURL,
                            hash: enroller.options.enrolment_hash
                        });
                        ePayment.epayment("open");
                    }
                });
            } else {
                enroller._alert("There waas an error during your booking :(.");
            }
        },

        _createEPaymentMethod: function(method) {
            var invoiceData = enroller.element.data("invoice_data");

            // update this to check the invoice cost.
            var ePaymentHolder = $("<div></div>");
            ePaymentHolder.addClass("epayment-holder");

            if ($("#billing_step .enroller-info-field-Fee").length) {
                $("#billing_step .enroller-info-field-Fee").hide();
            }
            var cost = enroller.options.cost;

            if(invoiceData !== null && invoiceData.BALANCE){
                cost = invoiceData.BALANCE;
            }
            else{
                if (enroller.options.group_booking) {
                    cost = enroller._calculateTotalCostGroupBooking();
                }
    
                if (enroller.options.round_to_dollar) {
                    cost = Math.ceil(cost);
                }
            }

            

            var ePaymentOptions = $('<div id="ePaymentOptions" style="padding:1em;"></div>');

            ePaymentHolder.append(ePaymentOptions);
            ePaymentOptions.hide();
            /* TODO: replace this with params for initiating booking process for recurring*/

           // Will need to confirm this
            
            if(method === "ezypay"){
                enroller._checkEPaymentStatusEZ(ePaymentOptions, cost);
            }
            else{
                enroller._checkEPaymentStatusDS(ePaymentOptions, cost);
            }
            

            return ePaymentHolder;
        },

        _checkEPaymentStatusDS: function(ePaymentOptions, cost){
            enroller.options.epayment_status({ enrolment_hash: enroller.options.enrolment_hash, provider:'debit_success' }, function(result) {
                if (result != null && result.error == null) {
                    if (result.REFERENCE != "") {
                        switch (result.STATUS) {
                            case "CHARGED":
                            case "COMPLETE":
                            case "PAYMENT_METHOD_PRESENT":
                                var blurbText =
                                    "A payment has been identified for your enrolment. Please contact our office should you have any questions.";
                                var infoBlurb = enroller._createBlurb(blurbText);
                                $("#ePaymentOptions").append(infoBlurb);
                                ePaymentOptions.show();
                                break;

                            case "FAILED":
                            case "DECLINED":
                            case "FATAL":
                                var blurbText =
                                    "A previous attempt at payment has been identified, however it cannot be resumed. Please contact our office to complete your booking..";
                                var infoBlurb = enroller._createBlurb(blurbText);
                                $("#ePaymentOptions").append(infoBlurb);
                                ePaymentOptions.show();
                                break;

                            case "RUNING":
                            case "PAYMENT_METHOD_MISSING":
                            case "UNBEGUN":
                                var blurbText =
                                    "A previous payment attempt has been identified. Click the button below to resume the payment process.";

                                var infoBlurb = enroller._createBlurb(blurbText);
                                $("#ePaymentOptions").append(infoBlurb);

                                //TODO: identify the term previously used.
                                $("#ePaymentOptions").append(enroller._displayResumeEPayment(result, cost));
                                ePaymentOptions.show();
                                break;
                            default:
                                break;
                        }
                    } else if (result.STATUS == "UNBEGUN") {
                        enroller._getEpaymentRules(cost,'debit_success', function(rules) {
                            enroller._displayEPaymentRules(rules, cost, ePaymentOptions, 'debit_success');
                            ePaymentOptions.show();
                            ePaymentOptions.enhanceWithin();
                        });
                    }
                }
            });
        },
        _checkEPaymentStatusEZ: function(ePaymentOptions, cost){

            //TODOHERE

            enroller.options.epayment_status({ enrolment_hash: enroller.options.enrolment_hash, provider:'ezypay' }, function(result) {
                if (result != null && result.error == null) {
                    if (result.REFERENCE != "") {
                        switch (result.STATUS) {
                            case "CHARGED":
                            case "COMPLETE":
                            case "PAYMENT_METHOD_PRESENT":
                                var blurbText =
                                    "A payment has been identified for your enrolment. Please contact our office should you have any questions.";
                                var infoBlurb = enroller._createBlurb(blurbText);
                                $("#ePaymentOptions").append(infoBlurb);
                                ePaymentOptions.show();
                                break;

                            case "RUNNING":
                                enroller.element.data('plan_locked', true);

                                enroller._displayEPaymentRuleDetails(result.EZYPAY.TERM, cost, 'ezypay');

                                break;
                            case "UNBEGUN":
                                enroller._getEpaymentRules(cost,'ezypay', function(rules) {
                                    enroller._displayEPaymentRules(rules, cost, ePaymentOptions, 'ezypay');
                                    ePaymentOptions.show();
                                    ePaymentOptions.enhanceWithin();
                                });
                                break;
                            // handle resume etc -- status TBC by marcel
                            // TODO: aaa
                            default:
                                break;
                        }
                    }

                    else if (result.STATUS === "UNBEGUN"){
                        enroller._getEpaymentRules(cost,'ezypay', function(rules) {
                            enroller._displayEPaymentRules(rules, cost, ePaymentOptions, 'ezypay');
                            ePaymentOptions.show();
                            ePaymentOptions.enhanceWithin();
                        });
                    }
                }
            });
            
          
        },

        _getEpaymentRules: function(cost, method, callback) {
            if (enroller.options.epayment_rules != null) {
                var ePaymentRuleParam = {
                    amount: cost
                };

                if(method === "ezypay"){
                    enroller.options.epayment_rules_ez(ePaymentRuleParam, callback);
                }
                else if(method === 'debit_success'){
                    enroller.options.epayment_rules(ePaymentRuleParam, callback);
                }
                
            }
        },
        _displayEPaymentRules: function(rules, cost, location, method) {
            if (rules != null) {
                if (rules.TERM != null) {
                    if ($.isArray(rules.TERM)) {
                        $.each(rules.TERM, function(index, rule) {
                            var ruleElement = enroller._createEPaymentRule(rule, cost, method);

                            $(location).append(ruleElement);
                            ruleElement.controlgroup().controlgroup("refresh");
                        });

                        //Register Switch Event (enable/disable others)
                    }
                    if (rules.TERM.length == 0) {
                        enroller._alert("There are no available payment plans for this course. Please select another billing method.");
                    }
                }
            }
        },
        _displayFormEPaymentEZPay: function(rule, amount){

            // Create a modal

            // call the api method

            // embed the iframe in the modal

            // register stuff

            var invoice_data = enroller.element.data("invoice_data");

            if(invoice_data){
                var invoiceRef = invoice_data.INVGUID;
                var params = {
                    redirect_url: enroller.options.epayment_landing_page,
                    invoice_guid:invoiceRef, 
                    enrolment_hash:enroller.options.enrolment_hash,
                    provider: 'ezypay'
                }
                
    
    
                enroller.element.append('<div></div>');
    
                enroller.options.payment_flow_form(params, function(result){

                    if (jQuery.active > 0) {
                        $(document).one("ajaxStop", function() {
                            $(".enroller-widget").addClass("ui-disabled");
                            $.mobile.loading("show", {
                                text: "Generating Payment Form",
                                textVisible: true,
                                theme: "a",
                                textonly: false
                            });
                            
                          
                        });
                    } else {
                        $(".enroller-widget").addClass("ui-disabled");
                        $.mobile.loading("show", {
                            text: "Generating Payment Form",
                            textVisible: true,
                            theme: "a",
                            textonly: false
                        });
                      
                    }
                  
                    if(result.SUCCESS){
                        var holder = $('<div></div>').attr('id', 'ez_holder');
                        holder.append(result.DATA.HTML);
                        holder.find('section').css({
                            maxWidth: 600
                        });
                        holder.find('#ezypay-frame').on('load', function(){
                        
                            holder.show();
                            $(".enroller-widget").removeClass("ui-disabled");
                            $.mobile.loading("hide");
                            setTimeout(function(){
                                //hide again in case of ajax weirdness
                                $.mobile.loading("hide");
                            }, 2000)
                        });
                        holder.find('input#ezypayPayButton')
                            .addClass('btn btn-primary')
                            .css({
                                marginLeft:'auto',
                                marginRight:'auto',
                                display:'block'
                            });
                       
                        holder.hide();

                       
                        enroller.element.append(holder);
                        
                        

                        $('#ezypayPayButton').on('click',function (e){
                            e.preventDefault();
                            var receiver = document.getElementById('ezypay-frame').contentWindow;
                            receiver.postMessage({actionType:'create'}, result.DATA.META.HOSTED_PAGE);
                          
                        });

                        window.addEventListener('message', function (e){
            

                            var response = JSON.parse(e.data);
                           
                            if (response.data.type) {
                                $('#ezypayResponse').val(e.data);
                                $('#ezypayForm').submit();
                            }

                            if (response.error) {
                                //
                            }
                        });
                        $('#ezypayForm').on('submit', function(event){
                            var $this = this;

                            //TODO: add note;
                            enroller.element.trigger("enroller:signature_submission", {
                                method:"Ezypay",
                            });

                            enroller.options.begin_payment_flow({
                                enrolment_hash: enroller.options.enrolment_hash,
                                tentative_confirm:enroller.options.ezypay_tentative?'tentative':'confirm',
                            },
                            function(){
                                $this.submit();
                            });
                            return false;
                        });

                        

                    }
                });
            }
        

        },


        _displayEzypayFees:function(fees, cost){
            var feeDisplay = $('<div class="ez_fees"></div>');
            var title = $('<div></div>').addClass(' fee-row');
            feeDisplay.append(title.append('Additional fees may apply, see below'))
            
            var header = $('<div></div>').addClass('fee-header fee-row');
            header.append($('<div></div>').addClass('fee-desc').append('Fee Type'));
            
            header.append($('<div></div>').addClass('fee-info').append(''));
            header.append($('<div></div>').addClass('fee-value').append('Fee Amount'));
            feeDisplay.append(header);
        
            $.each(fees, function (i, fee){
                if(fee.amount != null && fee.amount > 0 || fee.percentage != null && fee.percentage > 0){
                    var row = $('<div></div>').addClass('fee-row');
                    row.append($('<div></div>').addClass('fee-desc').append(fee.description));
                    
                    row.append($('<div></div>').addClass('fee-info').append(''));
                    var amount = $('<div></div>').addClass('fee-value');
                   
                   
                    switch(fee.chargingOption){
                        case 'BOTH':
                            if(fee.percentage != null && fee.percentage > 0){
                                amount.append(fee.percentage + "%");
                                if(fee.amount > 0){
                                    amount.append(' + ');
                                }
                            }
                            if(fee.amount != null && fee.amount > 0){
                                amount.append(enroller._currencyDisplayFormat(fee.amount));
                            }
                            
                            
                           
                            break;
                        case 'AMOUNT':
                            amount.append(enroller._currencyDisplayFormat(fee.amount));
                            break;
                        case "PERCENTAGE":
                            amount.append(fee.percentage + " %");
                            break;
                        default:
                            break;
                    }
             
    
                    if(fee.pricingCode ==="transaction_fee"){
                        var updatedPrice = 0;
                        if(fee.percentage != null && fee.percentage > 0){
                            updatedPrice += cost * (fee.percentage/100);
                        }
                        if(fee.amount != null && fee.amount > 0){
                            updatedPrice += fee.amount;
                        }

                        amount.append(" (" +enroller._currencyDisplayFormat(updatedPrice) +")");
                    }
                    row.append(amount);
    
                    feeDisplay.append(row);
                }
         
            });
            return feeDisplay;
        },

        _displayEPaymentRuleDetailsEZ: function(rule, amount){
            var enrolOptions = $.extend(true, {}, enroller.options.enroller_steps.billing, {});
            
            // TODO: Display Detail
            
            //var button = $('<button></button').append('EZYPay BEGIN!');
            
            var invoiceData = enroller.element.data("invoice_data");
            var epaymentParams = {
                payment_plan_id: rule.TERM_ID,
                reference: enroller.options.enrolment_hash,
                invoice_guid:invoiceData.INVGUID,
                callback: enroller.options.epayment_landing_page
            };
            
            
            
            var ruleElement = enroller._createEPaymentRule(rule, amount, 'ezpay');
            
            
            ruleElement.find('a.enroller-field-input').hide();
            
            
            var button = enroller._createInputField('ezypay', {
                DISPLAY: "Confirm",
                TYPE: "button"
            });
            
            var holder = $('<div></div>').attr('id','epayment_rule_holder');
            
            $(holder).append(ruleElement);
            ruleElement.controlgroup().controlgroup("refresh");
            var feePlaceholder = $('<div class="fee-placeholder">');
      
            var hasTerms = false;
            if (enrolOptions.TERMS != null && enrolOptions.TERMS != "") {
                var termsHeader = {
                    INFO_ONLY: true,
                    TYPE: "header",
                    DISPLAY: "Terms and Conditions"
                };
                hasTerms = true;
                
                enroller._insertTerms(enrolOptions.TERMS, ruleElement, "after");
                
                var termsInput = holder.find(".enroller-terms-flip input");
                termsInput.on("change", function(e) {
                    if (termsInput.prop("checked")) {
                        $("#enrolmentHolder")
                        .find(".epayment-save-button")
                        .removeClass("ui-disabled")
                        .prop("disabled", false);
                    }
                });
                
                enroller._createInfoFieldDetailed("terms_header", termsHeader).insertAfter(ruleElement);
            }
            
            if(enroller.options.lock_ez_plan === true && enroller.element.data('plan_locked') !== true){
                var lockPlan = enroller._createInputField('lock_ez', {
                    DISPLAY: "Lock In Plan",
                    TYPE: "button"
                });
                
                lockPlan.on('click', 'a', function(){
                    enroller.options.begin_ez_payment_flow(epaymentParams, function(response){
                        if(!response.error){
                            enroller.element.data('plan_locked', true);
                            lockPlan.hide();
                            $('#paymentBack').closest('.enroller-field-holder').hide();
                        }
                    });
                });
                holder.prepend(lockPlan);
                
            }

            holder.append(feePlaceholder);

            enroller.options.epayment_fees_ez({}, function(fees){
            
                var feeDetails = enroller._displayEzypayFees(fees, amount);

                feePlaceholder.append(feeDetails)
                
                holder.append(button);
                
            });
            button.on('click', 'a', function(){

                var enrolContinue = true;

                if (hasTerms){
                    var termsInput = holder.find(".enroller-terms-flip input");
                    var checked = termsInput.prop("checked");
                
                    if(!checked){
                        enrolContinue = false;
                    }
                }
                if (enroller.options.request_signature === true && enrolContinue) {
                    var signature = enroller.element.find("#enrol_signature");
                    if (signature.length > 0) {
                     
                        var sigData = enroller._getInputValue("enrol_signature", {
                            TYPE: "signature"
                        });
                        enroller.element.trigger("enroller:signature_submission", {
                            signature: sigData,
                            method: "ezypay"
                        });
                    }
                    else{
                        enrolContinue = false;
                    }
                }

                
                if(enrolContinue){
                    var isLocked = enroller.element.data('plan_locked');
                    if(enroller.options.lock_ez_plan === true && isLocked == true ){
                        enroller._displayFormEPaymentEZPay(rule, amount);
                    }
                    else{
                        enroller.options.begin_ez_payment_flow(epaymentParams, function(response){
                    
                            if(response.error){
        
                            }
                            else{
                                // This should also update the status!
                                enroller._displayFormEPaymentEZPay(rule, amount);
                            }
                          
                            
                            
                        });
                    }
                    
                }

                
                
            })

            return holder;

        },

        _displayEPaymentRuleDetails: function(rule, amount, method) {
            var enrolOptions = $.extend(true, {}, enroller.options.enroller_steps.billing, {});

            $("#ePaymentOptions").hide();
            var ruleDetailHolder = $('<div id="ePayRuleDetail"></div>');
            if ($("#ePayRuleDetail").length) {
                $("#ePayRuleDetail").remove();
            }
            $("#enrolmentHolder").append(ruleDetailHolder);
            var back = {
                DISPLAY: "Back to Payment Options",
                TYPE: "button"
            };
            var backButtonHold = enroller._createInputField("paymentBack", back);
            backButtonHold.find('a').css({
                'border-color': '#ddd',
                'background-color': '#ddd',
                'color': '#333'
            }).addClass('ui-btn-icon-left ui-icon-back');

            ruleDetailHolder.append(backButtonHold);
            backButtonHold.on("click", "a", function(e) {
                if ($("#ePayRuleDetail").length) {
                    $("#ePayRuleDetail").remove();
                }
                $("#ePaymentOptions").show();
            });
            if(method === "ezypay"){
                // at this point we switch into the payment flow method.
                if(enroller.options.lock_ez_plan === true){
                    if(enroller.element.data('plan_locked') === true){
                        backButtonHold.hide();
                    }
                }

                var content =  enroller._displayEPaymentRuleDetailsEZ(rule, amount);
                ruleDetailHolder.append(content);


                if(enroller.options.request_signature === true){
                    if(ruleDetailHolder.find('.fee-placeholder' )){
                        enroller._insertSignatureBlock(ruleDetailHolder.find('.fee-placeholder'), "after");
                    }
         
                }
             
                
                ruleDetailHolder.enhanceWithin();
                return;
            }

            var jsFileLocation = $("script[src*=enroller-widget]").attr("src");
            var index = jsFileLocation.indexOf("enroller-widget.js");
            var jsDir = jsFileLocation.slice(0, index);
         

            var downloadURL = jsDir + 'DS_aX_Guarantor_Form.pdf'
            var downloadLink = '<a target="_blank" href="'+downloadURL+'">Guarantor Form</a>';

            if(enroller.options.payer_under_18 !== false){

             
                var email = enroller.options.training_org_email
                var emailDS= 'customerservice@debitsuccess.com';
                var emailLink = '<a target="_blank" href="mailto:'+email+'">'+email+'</a>';
                var emailLinkDS = '<a target="_blank" href="mailto:'+emailDS+'">'+emailDS+'</a>'
           
                //'If the person making this booking is under 18 we will need a signed Guarantor form in order to process your payments. Please download the form '+downloadLink+'.<p>It can be returned to our office via email at '+ emailLink,
                var wording = 'Students under the age of 18 must have a guarantor to complete their payment plan registration with Debitsuccess.<p>Download the '+downloadLink+'.</p>After you complete your online enrolment, please complete the guarantor form and return by email to Debitsuccess '+ emailLinkDS+' or the training provider'+ (email != null ? ' ' + emailLink : '') +'.'
                enroller._alert(
                    wording,
                    'info'
                );
            }
            
            
            var headerInfo = {
                INFO_ONLY: true,
                TYPE: "header",
                DISPLAY: "Contact Phone Number"
            };
            ruleDetailHolder.append(enroller._createInfoFieldDetailed("contact_num_header", headerInfo));

            var payerData = enroller.element.data("payer_data");

            /* Stripped due to non AU numbers not working.
        var countryCode = {
            TYPE: "select",
            DISPLAY: "Country Code",
            VALUES: [
                    { DISPLAY: "Australia (+61)", VALUE: "61" },
                    { DISPLAY: "New Zealand (+64)", VALUE: "64" },
                    { DISPLAY: "Hong Kong (+852)", VALUE: "852" },
                    { DISPLAY: "USA (+1)", VALUE: "1" },
                ],
            REQUIRED: true
            };
       
        
        var contact_num_code = enroller._createInputField("contact_num_code_epay", countryCode);
        ruleDetailHolder.append(contact_num_code); */

            var contact_num = {
                DISPLAY: "Number",
                TYPE: "text",
                MAXLENGTH: "10",
                PATTERN: "[0-9]{10}",
                TITLE: "Please make sure to only use numbers without spaces and include the area code.",
                REQUIRED: true
            };

            var contact_num_field = enroller._createInputField("contact_num_epay", contact_num);
            ruleDetailHolder.append(contact_num_field);

            if (payerData != null) {
                enroller._updateInputValue($("#contact_num_epay"), payerData.MOBILEPHONE);
            }

            enroller._insertSignatureBlock(contact_num_field, "after");

            if (enrolOptions.TERMS != null && enrolOptions.TERMS != "") {
                var termsHeader = {
                    INFO_ONLY: true,
                    TYPE: "header",
                    DISPLAY: "Terms and Conditions"
                };

                enroller._insertTerms(enrolOptions.TERMS, contact_num_field, "after");

                var termsInput = ruleDetailHolder.find(".enroller-terms-flip input");
                termsInput.on("change", function(e) {
                    if (termsInput.prop("checked")) {
                        $("#enrolmentHolder")
                            .find(".epayment-save-button")
                            .removeClass("ui-disabled")
                            .prop("disabled", false);
                    }
                });

                enroller._createInfoFieldDetailed("terms_header", termsHeader).insertAfter(contact_num_field);
            }

            enroller._displaySetupChosens("billing");

            if (!$.isArray(rule.AVAILABLE_PAYMENT_METHODS)) {
                rule.AVAILABLE_PAYMENT_METHODS = rule.AVAILABLE_PAYMENT_METHODS.split(",");
            }

            var blurbText =
                '<p style="font-size:1.1em; font-weight:600!important">Direct Debit services are provided through Debitsuccess.</p><p style="margin:0">To pay for your course via direct debit the following terms and conditions apply. Please review them before continuing.</p>';
            if(enroller.options.payer_under_18 !== false){    
                blurbText+= '<p>Under 18 '+ downloadLink + '</p>';
            }
            var blurb = enroller._createBlurb(blurbText);
            //blurb.css('background', '#fff');

            var image = $("<img/>");

            var DS_TERMS =
                '<p style="margin:0;">I/We authorise Debitsuccess Pty Ltd ACN 095 551 581, APCA User ID Number 184534 to debit my/our account at the Financial Institution identified here through the Bulk Electronic Clearing System (BECS)</p>';
            var termsHeader2 = { INFO_ONLY: true, TYPE: "header", DISPLAY: "Direct Debit Conditions" };
            var iframe = $("<iframe></iframe>");

            var jsFileLocation = $("script[src*=enrol-widget]").attr("src");
            var index = jsFileLocation.indexOf("enrol-widget-base.js");
            var dsTermsLocation = jsFileLocation.slice(0, index);
            iframe.attr("src", dsTermsLocation + "/DS_Terms.html");

            // TODO: Add a "scroll indicator of some kind";
            iframe.css({ width: "100%" });
            image.attr("src", dsTermsLocation + "images/DS_logo.png");
            image.css({ height: "100px", "margin-left": "2em" });
            var dsTerms = enroller._createTerms("ReplaceMe");
            dsTerms[0].addClass("debit-success-terms");
            dsTerms[0].find(".enroller-field-label").append(image);
            var copyTermBlock = dsTerms[0].find(".enroller-info-text").clone();
            dsTerms[0]
                .find(".enroller-info-text")
                .empty()
                .append(DS_TERMS);
            copyTermBlock
                .empty()
                .append(iframe)
                .css({ "margin-top": ".5em", width: "100%", "max-width": "100%" });

            dsTerms[0].append(copyTermBlock);
            dsTerms[1].addClass("epay-direct-terms");
            var termHolder = $("<div/>");
            termHolder.prepend(dsTerms);
            termHolder.prepend(blurb);
            termHolder.prepend(enroller._createInfoFieldDetailed("terms_header", termsHeader2));
            ruleDetailHolder.append(termHolder);

            $.each(rule.AVAILABLE_PAYMENT_METHODS, function(i, pMethod) {
                var methodHolder = $("<div/>");

                var holder = $('<div data-role="controlgroup" class="epay-rule-details"></div');
                var total = $(
                    '<div class="ui-btn enroller-info-text  enroller-text-field ui-text-left"><span  style="text-align:center !important;font-size:1.1em;font-weight:600 !Important">' +
                        enroller._currencyDisplayFormat(enroller._calculateEPayRuleCost(rule, amount)) +
                        "</span></div>"
                );
                holder.append(total);

                /*  Surcharge not currently implemented.
           
           if (rule[pMethod] != null) {
                if (rule[pMethod].SURCHARGE != null) {
                    if (parseFloat(rule[pMethod].SURCHARGE.AMOUNT) > 0) {
                        var surcharge = $('<div class="ui-btn enroller-info-text enroller-text-field ui-text-left"></div>');
                        surcharge.append(" (Surcharge of " + enroller._currencyDisplayFormat(parseFloat(rule[pMethod].SURCHARGE.AMOUNT)) + ")");
                        holder.append(surcharge);
                    }
                }
            } */
                methodHolder.append(holder);

                var button = $(
                    '<a class="enroller-field-input epayment-save-button ui-btn-active ui-btn">' +
                        enroller._EPAYMENT_METHODS[pMethod] +
                        "</a>"
                );
                button.attr("id", "epayment_" + pMethod);
                holder.append(button);

                if (enrolOptions.TERMS != null && enrolOptions.TERMS != "") {
                    //button.addClass("ui-disabled").prop("disabled", true);
                }
                button.on("click", function(e) {
                    var continueEnrol = true;
                    var scrolling = false;

                    $("#billing_step")
                        .find("a")
                        .prop("disabled", true)
                        .addClass("ui-disabled");

                    var contNumber = enroller._getInputValue("contact_num_epay", contact_num);
                    var contCode = "61"; // enroller._getInputValue("contact_num_code_epay", countryCode);

                    if (contCode == null || contCode == "") {
                        continueEnrol = false;
                        enroller._displayError("contact_num_code_epay", "This field is required.");
                        $("#contact_num_code_epay").one("change", function() {
                            var field = $("#contact_num_code_epay");
                            var fieldHolder = field.closest(".enroller-field-holder");

                            if (fieldHolder.find(".enroller-error-message").length) {
                                fieldHolder.find(".enroller-error-message").remove();
                            }
                        });
                        if (!scrolling) {
                            scrolling = true;
                            enroller._scrollToElement("#contact_num_code_epay");
                        }
                    }
                    if (
                        contNumber == null ||
                        contNumber == "" ||
                        !enroller._regexIsValid(contact_num.PATTERN, contNumber)
                    ) {
                        continueEnrol = false;
                        enroller._displayError("contact_num_epay", "This field is required.");
                        if (!scrolling) {
                            enroller._scrollToElement("#contact_num_epay");
                            scrolling = true;
                        }
                    }
                    if (enrolOptions.TERMS != null && enrolOptions.TERMS != "") {
                        //button.addClass("ui-disabled").prop("disabled", true);
                        var termsInput = ruleDetailHolder.find(".enroller-terms-flip input");
                        if (!termsInput.prop("checked")) {
                            continueEnrol = false;
                            enroller._displayError(
                                termsInput.attr("id"),
                                "You must agree to the terms and conditions listed."
                            );
                            termsInput.one("change", function() {
                                var fieldHolder = termsInput.closest(".enroller-field-holder");

                                if (fieldHolder.find(".enroller-error-message").length) {
                                    fieldHolder.find(".enroller-error-message").remove();
                                }
                            });
                            if (!scrolling) {
                                scrolling = true;
                                enroller._scrollToElement("#" + termsInput.attr("id"));
                            }
                        }
                    }

                    var contactInfo = { number: contNumber, code: contCode };

                    if (enroller.options.request_signature === true) {
                        var signature = enroller.element.find("#enrol_signature");
                        if (signature.length > 0) {
                            if (signature.data("updated") !== true) {
                                enroller._displayError("enrol_signature", "A signature is required.");
                                signature.one("change", function() {
                                    var fieldHolder = signature.closest(".enroller-field-holder");
                                    if (fieldHolder.find(".enroller-error-message").length) {
                                        fieldHolder.find(".enroller-error-message").remove();
                                    }
                                });
                                continueEnrol = false;
                            }
                        }
                    }

                    if ($(".epay-direct-terms .enroller-terms-flip input").prop("checked") == false) {
                        continueEnrol = false;
                        enroller._displayError(".epay-direct-terms", "You must approve the terms.");
                        if (!scrolling) {
                            enroller._scrollToElement(".epay-direct-terms");
                            scrolling = true;
                        }
                    }

                    if (continueEnrol) {
                        if (enroller.options.request_signature === true) {
                            var signature = enroller.element.find("#enrol_signature");
                            if (signature.length > 0) {
                                var sigData = enroller._getInputValue("enrol_signature", {
                                    TYPE: "signature"
                                });
                                enroller.element.trigger("enroller:signature_submission", {
                                    signature: sigData,
                                    method: "ePayment"
                                });
                            }
                        }
                        enroller._beginEPaymentProcess(rule, pMethod, contactInfo);
                    } else {
                        $("#billing_step")
                            .find("a")
                            .prop("disabled", false)
                            .removeClass("ui-disabled");
                    }
                });
                holder.controlgroup().controlgroup("refresh");
                ruleDetailHolder.append(methodHolder);
            });
            ruleDetailHolder.enhanceWithin();
        },

        _displayResumeEPayment: function(rule, cost) {
            var holder = $('<div data-role="controlgroup" class="epay-rule-details"></div');
            var button = $(
                '<a class="enroller-field-input epayment-save-button ui-btn-active ui-btn">Resume Process</a>'
            );
            button.attr("id", "epayment_resume");
            holder.append(button);
            button.on("click", function() {
                if (enroller.options.epayment_next != null) {
                    enroller.options.epayment_next({ enrolment_hash: enroller.options.enrolment_hash }, function(
                        response
                    ) {
                        var done = false;
                        if (response != null) {
                            if (response.epayment_redirect_resume != null) {
                                done = true;
                                $.mobile.loading("show", {
                                    text:
                                        "Preparing your enrolment. Please wait until you are redirected to the payment page.",
                                    textVisible: true,
                                    theme: "b",
                                    textonly: false
                                });
                                window.location = response.epayment_redirect_resume;
                            }
                        }
                        if (!done) {
                            var blurbText =
                                "A previous attempt at payment has been identified, however it cannot be resumed. Please contact our office to complete your booking.";
                            var infoBlurb = enroller._createBlurb(blurbText);
                            $("#ePaymentOptions")
                                .empty()
                                .append(infoBlurb);
                            enroller._disable();
                        }
                    });
                }
            });
            return holder;
        },
        _beginEPaymentProcess: function(rule, method, contactNumber) {
            /*params for epayment*/

            var ePaymentProcessParams = {
                invoiceID: enroller.options.invoice_id,
                paymentMethod: method,
                termID: rule.TERM_ID,
                callback: enroller.options.epayment_landing_page,
                passthrough: enroller.options.enrolment_hash,
                config_id: enroller.options.config_id,
                contact_num_code: contactNumber.code,
                contact_num: contactNumber.number
            };
            if (enroller.options.enrolment_hash != null && enroller.options.enrolment_hash != "") {
                ePaymentProcessParams.reference = enroller.options.enrolment_hash;
                ePaymentProcessParams.process = enroller.options.enrolment_hash;
            } else {
                ePaymentProcessParams.reference = enroller._generateUniqueIdentifier();
                ePaymentProcessParams.process = enroller._generateUniqueIdentifier();
            }

            if (enroller.options.epayment_begin != null) {
                $(".enroller-widget").addClass("ui-disabled");
                $.mobile.loading("show", {
                    text: "Preparing your enrolment. Please wait until you are redirected to the payment page.",
                    textVisible: true,
                    theme: "b",
                    textonly: false
                });

                enroller.options.epayment_begin(ePaymentProcessParams, function(data) {
                    if (data != null) {
                        if (data.error != null) {
                            //TODO: Error handling :(
                            enroller._alert(
                                "There was an error processing your enrolment. Please contact our office to resolve the issue."
                            );
                        } else {
                            if (data.AX_REFERENCE_NO != null && data.REDIRECT != null) {
                                $.mobile.loading("show", {
                                    text:
                                        "Preparing your enrolment. Please wait until you are redirected to the payment page.",
                                    textVisible: true,
                                    theme: "b",
                                    textonly: false
                                });

                                enroller.element.trigger("enroller:enrolment_status_update", {
                                    user_contact_id: enroller.options.user_contact_id,
                                    contact_id: enroller.options.contact_id,
                                    method: "epayment",
                                    enrolments: enroller.options.multiple_courses,
                                    payer_id: enroller.options.payer_id,
                                    invoice_id: enroller.options.invoice_id,
                                    course: enroller.options.course,
                                    config_id: enroller.options.config_id,
                                    epayment_response_data: data,
                                    epayment_submission_data: ePaymentProcessParams
                                });
                                enroller.element.on("enroller:status_update_complete", function() {
                                    //if there is an active ajax request add a listener for when it finishes.
                                    if (jQuery.active > 0) {
                                        $(document).one("ajaxStop", function() {
                                            $(".enroller-widget").addClass("ui-disabled");
                                            $.mobile.loading("show", {
                                                text: "Redirecting you to the payment page",
                                                textVisible: true,
                                                theme: "a",
                                                textonly: false
                                            });

                                            // TODO: Figure out a way to prevent this being dismissed.
                                            window.location = data.REDIRECT;
                                        });
                                    } else {
                                        $(".enroller-widget").addClass("ui-disabled");
                                        $.mobile.loading("show", {
                                            text: "Redirecting you to the payment page",
                                            textVisible: true,
                                            theme: "a",
                                            textonly: false
                                        });
                                        window.location = data.REDIRECT;
                                    }
                                });
                            }
                        }
                    }
                });
            }

            //Call endpoint
        },


        _beginPaymentFlow :function(invoice_data){

            var invoiceRef = invoice_data.INVGUID;
            var params = {
                redirect_url: enroller.options.epayment_landing_page,
                invoice_guid:invoiceRef, 
                enrolment_hash:enroller.options.enrolment_hash,
                provider: 'eway'
            }
            enroller.options.payment_flow_form(params, function (result) {
                
                if (result && result.DATA && result.SUCCESS) {
                    var data = result.DATA;

                    var form = $('<form id="payment_flow_form" method="POST"/>').attr('action', data.ACTION);
                    $.each(data.META, function (key, field) {
                        if (field.HIDDEN) {
                            var input = $('<input/>').attr('type', 'hidden');
                            input.attr('id', key).attr('name', key);
                            input.val(field.VALUE);
                            form.append(input);
                        }
                        else {
                            if (field.OPTIONS && field.OPTIONS.length > 0) {
                                var inputObj = {
                                    TYPE: 'select',
                                    DISPLAY: key,
                                    REQUIRED: true,
                                    VALUES: field.OPTIONS.map(function (record) { return { DISPLAY: record.NAME, VALUE: record.VALUE } })
                                };
                                if (key.indexOf('MONTH') > 0) {
                                    inputObj.DISPLAY = 'Expiry Month';
                                }
                                if (key.indexOf('YEAR') > 0) {
                                    inputObj.DISPLAY = 'Expiry Year';
                                }

                                var inputField = enroller._createInputField(key, inputObj);

                                form.append(inputField);
                            }
                            else {
                                var inputObj = {
                                    TYPE: 'text',
                                    DISPLAY: key,
                                    AUTOCOMPLETE: 'off',
                                    REQUIRED: true

                                };
                                if (key.indexOf('CARDNAME') > 0) {
                                    inputObj.DISPLAY = 'Card Holder';
                                }
                                if (key.indexOf('CARDNUMBER') > 0) {
                                    inputObj = {
                                        DISPLAY: "Card Number",
                                        TYPE: "text",
                                        REQUIRED: true,
                                        PATTERN: "[0-9]{13,16}",
                                        MAXLENGTH: 16,
                                        TITLE: "13 or 16 digits.",
                                        AUTOCOMPLETE: 'off'
                                    };
                                }
                                if (key.indexOf('CARDCVN') > 0) {
                                    inputObj = {
                                        DISPLAY: "SecurityCode",
                                        TYPE: "text",
                                        REQUIRED: true,
                                        PATTERN: "[0-9]{3,4}",
                                        MAXLENGTH: 4,
                                        TITLE: "3 or 4 digits found on the back of the card.",
                                        AUTOCOMPLETE: 'off'
                                    };
                                }
                                var inputField = enroller._createInputField(key, inputObj);

                                form.append(inputField);
                            }
                        }
                    });
                   
                    var enrolButtonHolder = enroller
                        ._createInformationField("Enrol", "")
                        .addClass("enroller-enrol-button-holder");
                    enrolButtonHolder.find("div.enroller-text-field").remove();
                    enrolButtonHolder
                        .find("div.enroller-field-label")
                        .text("")
                        .css("background", "transparent")
                        .css("border", "none");

                    form.append('<div class="placeholder"></div>')
                  
                    form.append(enrolButtonHolder.append('<button class="enroller-save-button" type="submit">Submit</button>'));

                    

                    form.on('submit', function(event){
                        // call a function.
                        var $this = this;
                        var continueEnrol = true;
                        if (enroller.options.request_signature === true) {
                            var signature = enroller.element.find("#enrol_signature");
                            if (signature.data("updated") !== true) {
                                continueEnrol = false;
                                enroller._displayError('enrol_signature', 'Please Sign');
                            } else {
                                var sigData = enroller._getInputValue("enrol_signature", {
                                    TYPE: "signature"
                                });
        
                                enroller.element.trigger("enroller:signature_submission", {
                                    signature: sigData,
                                    method: "payment-attempt"
                                });
                            }
                        }
                        else{
                            enroller.element.trigger("enroller:signature_submission", {
                                method: "payment-attempt"
                            });
                        }
                        if(continueEnrol){
                            enroller.options.begin_payment_flow({
                                enrolment_hash: enroller.options.enrolment_hash
                            },
                            function(){
                                $this.submit();
                            });
                        }


                   
                       
                        return false;
                    });
                    $('#paymentFlow').append(form);
                    

                    enroller._insertSignatureBlock($("div.placeholder"), "before");
                    var enrolOptions = enroller.options.enroller_steps.billing;
                    if(enrolOptions.TERMS != null && enrolOptions.TERMS !== ""){
                        enroller._insertTerms(enrolOptions.TERMS, $("div.placeholder"), "before");
                        form
                        .find(".enroller-save-button")
                        .addClass("ui-disabled")
                        .prop("disabled", true)
                        .prop("disabled", true);
                    }
                    enroller._displaySetupChosens("billing");
                    form.enhanceWithin();
                    //$('#paymentFlow').append(data.HTML);
                }

            });

        },
        _generateUniqueIdentifier: function() {
            return "PLACEHOLDERGUID!!!";
        },
        _EPAYMENT_METHODS: {
            CREDIT_CARD: "Pay by Credit Card",
            BANK_ACCOUNT: "Pay by Direct Debit"
        },
        _createEPaymentRule: function(rule, amount, method) {

            //Create holder
            //Process rule
            //Multiple Methods

            //Create switch
            var holder = $('<div data-role="controlgroup" class="epay-rule-holder"></div');
            var total = $(
                '<div class="ui-btn enroller-info-text enroller-text-field ui-text-left " style="text-align:center !important;"><span  style="text-align:center !important;font-size:1.1em;font-weight:600 !Important">' +
                    enroller._currencyDisplayFormat(enroller._calculateEPayRuleCost(rule, amount)) +
                    "</span></div>"
            );
            holder.append(total);
            var description = $(
                '<div class="ui-btn enroller-info-text enroller-text-field ui-text-left" style="text-align:center !important">' +
                    rule.LABEL +
                    "</div>"
            );
            holder.append(description);

            if(rule.TRANSLATED){
                var translated = $(
                    '<div class="ui-btn enroller-info-text enroller-text-field ui-text-left" style="text-align:center !important">' +
                        rule.TRANSLATED +
                        "</div>"
                );
                translated.prepend('<span class="payment-installment">Paid in instalments of:</span>');
                holder.append(translated);
            }

            if (!$.isArray(rule.AVAILABLE_PAYMENT_METHODS)) {
                rule.AVAILABLE_PAYMENT_METHODS = rule.AVAILABLE_PAYMENT_METHODS.split(",");
            }
            var button = $('<a class="enroller-field-input ui-btn-active ui-btn">Enrol With this Option</a>');
            holder.data("rule", rule);
            holder.append(button);
            holder.on("click", function(e) {
                enroller._displayEPaymentRuleDetails(rule, amount, method);
            });
            /*$.each(rule.AVAILABLE_PAYMENT_METHODS, function(i, pMethod){
    		var ruleHolder = $('<div class="enroller-payment-rule" />');
    		var ruleInput = $('<input type="radio" name="e_pay_rule" />');
    		ruleInput.attr('id', 'e_pay_rule_'+rule.RULE_ID + '_' + pMethod);
    		ruleInput.attr('value', rule.RULE_ID + '_' + pMethod);
    		var ruleLabel = $('<label for="e_pay_rule_'+rule.RULE_ID + '_' + pMethod+'"></label>');
    		ruleLabel.append(enroller._EPAYMENT_METHODS[pMethod]);
    		if(rule[pMethod] != null){
    			if(rule[pMethod].SURCHARGE != null){
    				if(parseFloat(rule[pMethod].SURCHARGE.AMOUNT) > 0){
    					ruleLabel.append(' (Surcharge of ' +enroller._currencyDisplayFormat(parseFloat(rule[pMethod].SURCHARGE.AMOUNT))+  ')');
    				}
    			}
    		}
    		
    		
    		holder.append(ruleHolder.append(ruleLabel).append(ruleInput));
    	});*/
            return holder;
        },
        _calculateEPayRuleCost: function(rule, amount) {
            if (amount == 0) {
                return 0;
            } else {
                return parseFloat(amount);
            }
        },

        //#endregion
        /***** SHARED FUNCTIONS *****/

        /* CONTACT CREATE */

        _displayContactCreate: function(onCreate, terminology_override, initial) {
            var terminology = enroller.options.terminology_student;
            if (terminology_override != null) {
                terminology = terminology_override;
            }
            var contactCreate = $("#contactCreate");
            if(contactCreate.length){
                contactCreate.popup().popup("destroy");
                contactCreate.remove();
                contactCreate = $("#contactCreate");
            }
            if (!contactCreate.length) {
                contactCreate = $('<div id="contactCreate" />');
                var list = $("<div>");

                var header = $('<div class="enroller-popup-header" >Add ' + terminology + ":</div>");
                if ($(".ui-btn-active.enroller-save-button").length) {
                    header.css(
                        "background-color",
                        $(".ui-btn-active.enroller-save-button").css("background-color")
                    );
                    header.css("border", "none");
                    header.css("color", $(".ui-btn-active.enroller-save-button").css("color"));
                }

                list.append(header);
                var createHolder = $("<form />");
                var fields = {
                    create_GIVENNAME: {
                        TYPE: "text",
                        DISPLAY: "Given Name",
                        REQUIRED: true,
                        MAXLENGTH: 40
                    },
                    create_SURNAME: {
                        TYPE: "text",
                        DISPLAY: "Family Name",
                        REQUIRED: true,
                        MAXLENGTH: 40
                    },
                    create_EMAILADDRESS: {
                        TYPE: "email",
                        DISPLAY: "Email",
                        REQUIRED: true,
                        MAXLENGTH: 60
                    }
                };
                if (enroller.options.confirm_emails == true) {
                    fields["create_CONFIRM_EMAILADDRESS"] = {
                        TYPE: "email",
                        DISPLAY: "Confirm Email",
                        REQUIRED: true,
                        MAXLENGTH: 60
                    };
                }
                $.each(fields, function(key, value) {
                    createHolder.append(enroller._createInputField(key, value));
                });
                if (enroller.options.confirm_emails == true) {
                    createHolder.find("#create_EMAILADDRESS, #create_CONFIRM_EMAILADDRESS").on("input", function() {
                        var email = $("#create_EMAILADDRESS").val();
                        var confirmEmail = $("#create_CONFIRM_EMAILADDRESS").val();
                        if (email !== confirmEmail) {
                            enroller._displayError("create_CONFIRM_EMAILADDRESS", "Emails do not match.");
                        } else {
                            var field = createHolder.find("#create_CONFIRM_EMAILADDRESS");
                            var fieldHolder = field.closest(".enroller-field-holder");
                            if (fieldHolder.find(".enroller-error-message").length) {
                                fieldHolder.find(".enroller-error-message").remove();
                            }
                        }
                    });
                }

                var createButton = $(
                    '<button data-role="button" class="ui-btn ui-btn-active enroller-save-button enroller-create-contact-button ui-nodisc-icon ui-icon-plus ui-btn-icon-right">Create</button>'
                );

                var createBHolder = enroller._createInformationField("Login", "");
                createBHolder.find("div.enroller-text-field").remove();
                createBHolder
                    .find("div.enroller-field-label")
                    .text("")
                    .css("background", "transparent")
                    .css("border", "none");
                createBHolder.append(createButton);
                createHolder.append(createBHolder);
                list.append(createHolder);
                contactCreate.append(list);
                contactCreate.find("input").attr("required", "required");
            } 
            contactCreate
                .find(".enroller-create-contact-button")
                .off()
                .on("click", function() {
                    var confirmMatches = false;
                    var enoughToCreate = true;
                    var params = {};
                    if (!$.isEmptyObject($("#create_GIVENNAME").val())) {
                        params.GIVENNAME = $("#create_GIVENNAME").val();
                    } else {
                        enoughToCreate = false;
                    }
                    if (!$.isEmptyObject($("#create_SURNAME").val())) {
                        params.SURNAME = $("#create_SURNAME").val();
                    } else {
                        enoughToCreate = false;
                    }
                    if (!$.isEmptyObject($("#create_EMAILADDRESS").val())) {
                        if (enroller._isEmail($("#create_EMAILADDRESS").val())) {
                            params.EMAILADDRESS = $("#create_EMAILADDRESS").val();
                        } else {
                            enoughToCreate = false;
                        }
                    } else {
                        enoughToCreate = false;
                    }
                    if (enroller.options.confirm_emails == true) {
                        if (!$.isEmptyObject($("#create_CONFIRM_EMAILADDRESS").val())) {
                            if (enroller._isEmail($("#create_CONFIRM_EMAILADDRESS").val())) {
                                if (params.EMAILADDRESS !== $("#create_CONFIRM_EMAILADDRESS").val()) {
                                    enoughToCreate = false;
                                    confirmMatches = false;
                                } else {
                                    confirmMatches = true;
                                }
                            } else {
                                enoughToCreate = false;
                            }
                        } else {
                            enoughToCreate = false;
                        }
                        if (!confirmMatches) {
                            enroller._displayError(
                                "create_CONFIRM_EMAILADDRESS",
                                "Emails do not match, or are invalid."
                            );
                        }
                    }
                    if (enoughToCreate) {
                        params = {
                            GIVENNAME: $("#create_GIVENNAME").val(),
                            SURNAME: $("#create_SURNAME").val(),
                            EMAILADDRESS: $("#create_EMAILADDRESS").val()
                        };
                        var makeCall = true;
                        if (enroller.options.user_contact_create == true) {
                            var axTokenAll = enroller.element.data("USER_AX_TOKEN");

                            if (axTokenAll != null) {
                                params.AXTOKEN = axTokenAll.AXTOKEN;
                                if (axTokenAll.ROLETYPEID == enroller.CLIENT_ID) {
                                    var userContactData = enroller.element.data("user_contact_data");
                                    if (userContactData != null) {
                                        if (userContactData.ORGID != null) {
                                            params.orgID = userContactData.ORGID;
                                            params.organisation = userContactData.ORGANISATION;
                                        } else {
                                            makeCall = false;
                                        }
                                    } else {
                                        makeCall = false;
                                        enroller._confirmContactIsInAccount(axTokenAll.CONTACTID, function(
                                            contactData
                                        ) {
                                            enroller.element.data("user_contact_data", contactData);
                                            contactCreate.find(".enroller-create-contact-button").trigger("click");
                                        });
                                    }
                                }
                            }
                        }

                        if (makeCall) {
                            if (initial != null && enroller.options.contact_validation_check) {
                                params.performValidationCheck = true;
                                var reqParam = {
                                    course: enroller.options.course,
                                    config_id: enroller.options.config_id,
                                    page_url: window.location.href
                                };
                                if (enroller.options.cart_course_override != null) {
                                    reqParam.cart_course_override = enroller.options.cart_course_override;
                                }
                                params.enrolment_details = reqParam;
                            }

                            enroller.options.add_contact(params, function(contactID) {
                                if (contactID != null && contactID.existing_contact != null) {
                                    enroller._alert(
                                        "<p>An existing record with that email was found.</p><p>An Email has been dispatched to verify your identity and allow you to continue " +
                                            enroller.options.enrolling_terminology.toLowerCase() +
                                            ".</p>",
                                        "info",
                                        "Existing Record Found"
                                    );
                                } else {
                                    if (contactCreate.hasClass("ui-popup")) {
                                        contactCreate.popup("close");
                                    }

                                    if (onCreate != null) {
                                        params.CONTACTID = contactID;
                                        onCreate(params);
                                    } else {
                                        enroller._setOption("contact_id", contactID);
                                        enroller._changeStep(enroller._getNextStep("contactSearch"));
                                    }
                                }
                            });
                        }
                    }
                });
            contactCreate.addClass("enroller-widget-popup");
            enroller._addInputSelectionEvent($(contactCreate));

            contactCreate.on("submit", "form", function(e) {
                e.preventDefault();
                return false;
            });
            return contactCreate;
        },
        _contactAdded: function(contact) {
            if ($("#cList").length) {
                if ($("#cList").find("#" + contact.CONTACTID).length < 1) {
                    var newContactRecord = enroller._createContactListItem(contact);
                    $("#cList")
                        .prepend(newContactRecord)
                        .listview()
                        .listview("refresh");
                }
            }
            $(".enroller-search-add select:data(add_type)").each(function() {
                var element = $(this);
                if (element.data("add_type") == "contact") {
                    if (element.find('[value="' + contact.CONTACTID + '"]').length < 1) {
                        if (contact.GIVENNAME == null) {
                            contact.GIVENNAME = "";
                        }
                        if (contact.SURNAME == null) {
                            contact.SURNAME = "";
                        }
                        var name = contact.GIVENNAME + " " + contact.SURNAME;
                        var newOption = $('<option value="' + contact.CONTACTID + '" >' + name + "</option>");
                        element.append(newOption);
                        element.trigger("chosen:updated");
                    } else {
                    }
                }
            });
        },

        /* USER CREATION */

        _checkForUnsavedChanges: function(step) {
            var valuesChanged = false;
            var currentStep = step;
            if (step == null) {
                currentStep = enroller.element.data("current_step");
            }
            
            if (currentStep != null) {
                var stepChanged = $("#" + currentStep + "_step").data("changed");
    
                if (stepChanged != null) {
                    if (stepChanged) {
                        if(enroller.options.enroller_steps[currentStep].TYPE === "address"){
                            return valuesChanged;
                        }
                        /*
						 * if the last params are available, check them to see if they are the same 
						 * eg editing and changing a value back.
						 * else assume they have changed.
						 * */
                        var fields = enroller.options.enroller_steps[currentStep].FIELDS;
                        stepData = currentStep + "_last_params";
                        var lastParams = enroller.element.data(stepData);

                        if (lastParams != null && fields != null) {
                            enroller._checkStatusAndBuildParams(fields, function(params, required, complete) {
                                $.each(params, function(key, value) {
                                    if (lastParams[enroller._removeFieldContactType(key)] == null) {
                                        valuesChanged = true;
                                    }
                                    if (lastParams[enroller._removeFieldContactType(key)] != value) {
                                        valuesChanged = true;
                                    }
                                });
                            });
                        } else {
                            return stepChanged;
                        }
                    }
                }
            }
            return valuesChanged;
        },

        /*populate the contact related fields with data*/

        /* STEP SELECTION and NAVIGATION */
        /*helper to get the next step based on the order specified when created*/
        _getNextStep: function(currentStep) {
            var currentStep = enroller.options.step_order.indexOf(currentStep);
            if (currentStep == enroller.options.step_order.length - 1) {
                return enroller.options.step_order[0];
            } else {
                return enroller.options.step_order[currentStep + 1];
            }
        },

        _registerHistoryListener: function() {
            $(window).on("popstate", function(event) {
                //compare event state to current state
                var previouslyBlocked = enroller.element.data("back_button_blocked");

                var currentState = history.state;
                var currentStep = enroller.element.data("current_step");
                if (event.originalEvent.state.step != null) {
                    if (enroller.stepSelectable(history.state.step)) {
                        enroller._changeStep(history.state.step, true);
                    } else if (currentState.previous_step == currentStep) {
                        /* determine if we came back or forward. 
					  * If the user clicks the same step multiple times this could break.*/
                        history.back();
                    } else {
                        if (previouslyBlocked) {
                            var r = confirm(
                                "Are you sure you wish to leave this page? " +
                                    enroller.options.enrolment_terminology +
                                    " Progress will be lost."
                            );
                            if (r == true) {
                                var orgHistory = enroller.element.data("original_history_length");
                                var current = history.length;
                                history.go(orgHistory - current);
                            } else {
                                history.forward();
                            }
                        } else {
                            history.forward();
                        }
                        enroller.element.data("back_button_blocked", true);
                    }
                }
            });
        },

        /*check if the step can change, then change step*/
        _changeStep: function(newStep, noState) {
            /* prevent changing step until ajax calls are complete. 
			 * This is to prevent issues caused by change step being called by code*/
            if ($("#temporaryAlert").length) {
                $("#temporaryAlert")
                    .popup()
                    .popup("destroy");
                $("#temporaryAlert").remove();
            }

            if ($("#contactCreate-popup").length) {
                $("#contactCreate")
                    .popup()
                    .popup("destroy");
                $("#contactCreate").remove();
            }

            if (jQuery.active > 0) {
                var waiting = enroller.element.data("waiting_step_change");
                if (waiting == null) {
                    waiting = [];
                }
                if ($.isArray(waiting)) {
                    var next = { step: newStep, noState: noState };
                    waiting.push(next);

                    enroller.element.data("waiting_step_change", waiting);
                }
                $(document).one("ajaxStop", function() {
                    var waiting = enroller.element.data("waiting_step_change");
                    if ($.isArray(waiting)) {
                        var next = waiting.shift();
                        enroller.element.data("waiting_step_change", waiting);
                        enroller._changeStep(next.step, next.noState);
                    }
                });
            } else {
                enroller._updateStepButtons();
                var selectable = enroller.stepSelectable(newStep);
                if (selectable) {

                    enroller._scrollToElement('.enroller-content', function(){});
                    /*tie enroller steps into history*/
                    if (window.history && window.history.pushState) {
                        var currentState = window.history.state;
                        if (noState !== true) {
                            var stateObj = { step: newStep, previous_step: window.history.state };
                            if (window.history.state != null) {
                                if (
                                    window.history.state.step == null &&
                                    enroller.element.data("original_history_length") == null
                                ) {
                                    enroller.element.data("original_history_length", window.history.length);
                                }
                            } else {
                                enroller.element.data("original_history_length", window.history.length);
                            }

                            history.pushState(stateObj, null, location.href);
                        }
                    }

                    if (enroller._checkForUnsavedChanges()) {
                        
                        /*alert user they have not saved the current form*/
                        setTimeout(function(){
                            enroller._alert("Unsaved Changes in Previous Step");
                        }, 300);
                    }
                    $(".enroller-menu-link.ui-btn-active").removeClass("ui-btn-active");
                    $(".enroller-step").hide();
                    $("#" + newStep + "_step").show();

                    if (enroller.options.step_layout == "left") {
                        $("#" + newStep + "_step").css("display", "table-cell");
                    } else {
                        $("#" + newStep + "_step").css("display", "block");
                    }

                    $("#" + newStep + "_menu_link").addClass("ui-btn-active");

                    enroller.element.data("current_step", newStep);

                    /*TODO: Refactor these to all use the TYPE against the enroller steps, rather than the name*/
                    /*
						 * Populate the Review step (if it exists) when it is selected
						 * There is no point doing this prior to it's selection as things can change.
						 **/


                    switch (newStep) {
                        case 'review':
                            enroller._displayReviewStep(); 
                            break;
                        case 'complete':
                            enroller._displayCompleteStep();
                            break;
                        case 'usi_validation':
                            enroller._displayUSIValidationStep();
                            break;
                        case 'contactSearch':
                            if (enroller.options.enroller_steps.contactSearch.contactList == null) {
                                enroller.element.find("#contactSearch_step input").trigger("input");
                            }
                            break;

                        case 'billing':
                            enroller._displayBillingStep();
                            break;

                        case 'agentCourses':
                            enroller._displayAgentCourses();
                            break;

                        case 'courses':
                            enroller._initiateCourseSearch();
                            break;

                        default:
                            break;
                    }

                    var stepType = enroller.options.enroller_steps[newStep].TYPE;
                    var stepConfig = enroller.options.enroller_steps[newStep];

                    switch (stepType) {
                        case 'portfolio':
                            enroller._displayPortfolioStep(newStep);
                            break;
                        case "course-enquiry":
                            enroller.element.find(".enroller-enquiry-response").remove();
                            break;
                        case 'contact-note':
                            enroller.element.find(".enroller-note-response").remove();
                            break;
                        case "group-booking":
                            enroller._displayGroupBookingStep(newStep);
                            break;
                        case "contact-update":
                            if(stepConfig.CONTACT_TYPE && stepConfig.CONTACT_TYPE === "payer" && stepConfig.FIRST_PAYER){
                                enroller._displayFirstPayerStep(newStep);
                            }
                            break;

                        default:
                            break;
                    }



                    enroller._displaySetupChosens(newStep);

                    $("abbr.search-choice-close").addClass(
                        "ui-btn-icon-right ui-alt-icon ui-nodisc-icon ui-icon-delete ui-btn-icon-notext"
                    );
                    $("abbr.search-choice-close").css("background-image", "none !important");

                    enroller._addInputSelectionEvent($("#" + newStep + "_step"));

                    if (enroller.options.adjust_field_labels == true) {
                        enroller._adjustLabelHeight("#" + newStep + "_step");
                    }

                    enroller._dateFixDatepickers();

                    enroller._scrollToTop();
                    enroller._loadSignatureFields(newStep);
                } else {
                    if (newStep == "courses") {
                        if (enroller.options.cart_course_override != null) {
                            if (enroller.options.enroller_steps.review != null) {
                                enroller._changeStep("review");
                            }
                        }
                    } else if (newStep == "agentCourses" && !parseInt(enroller.options.course.INSTANCEID) > 0) {
                        enroller._changeStep("courses");
                    } else if (!parseInt(enroller.options.contact_id) > 0) {
                        if (
                            enroller.options.enroller_steps.contactSearch !== undefined &&
                            enroller.stepSelectable("contactSearch")
                        ) {
                            enroller._changeStep("contactSearch");
                        } else if (enroller.stepSelectable(enroller.options.step_order[0])) {
                            enroller._changeStep(enroller.options.step_order[0]);
                        } else {
                            enroller._disable();
                            enroller._alert(
                                "Could not identify the next step. The configuration for this enroller may be invalid"
                            );
                        }
                    } else if (!parseInt(enroller.options.course.INSTANCEID) > 0) {
                        if (
                            enroller.options.enroller_steps.courses !== undefined &&
                            enroller.stepSelectable("courses")
                        ) {
                            enroller._changeStep("courses");
                        }
                    } else {
                        /*find the first incomplete step and change to it*/

                        if ($(".enroller-menu-link.incomplete:first").length) {
                            newStep = $(".enroller-menu-link.incomplete:first").attr("id");
                            newStep = newStep.replace("_menu_link", "");
                            if (enroller.stepSelectable(newStep)) {
                                if (newStep != "enrol") {
                                    enroller._changeStep(newStep);
                                }
                            }
                        } else {
                            if (enroller.options.enroller_steps.review != null) {
                                if (enroller.stepSelectable("review")) {
                                    enroller._changeStep("review");
                                }
                            } else {
                                if (enroller.stepSelectable(enroller.options.step_order[0])) {
                                    enroller._changeStep(enroller.options.step_order[0]);
                                } else {
                                    enroller._disable();
                                    enroller._alert(
                                        "Could not identify the next step. The configuration for this enroller may be invalid"
                                    );
                                }
                            }
                        }
                    }
                }
            }
        },
        /*assess if the step should be able to be selected by a user*/
        stepSelectable: function(step) {
            var stepType = enroller.options.enroller_steps[step].TYPE;
            var stepSelectable = true;
            var req_contact = [
                "complete",
                "contact-update",
                "address",
                "custom-step",
                "review",
                "portfolio",
                "enrol",
                "agent-courses",
                "course-enquiry",
                "contact-note",
                "group-booking",
                "enrol-details",
                "usi-validation"
            ];

            if (stepType == "user-login") {
                if (parseInt(enroller.options.contact_id) > 0) {
                    stepSelectable = false;
                }
            } else if (stepType == "contact-search") {
                if (enroller.options.enroller_steps.userLogin != null) {
                    if (enroller.options.contact_id < 1 && enroller.options.user_contact_id < 1) {
                        stepSelectable = false;
                    }
                }
            } else if (stepType == "courses") {
                if (enroller.options.cart_course_override != null) {
                    stepSelectable = false;
                } else {
                    stepSelectable = true;
                }
            } else if (req_contact.indexOf(stepType) > -1) {
                stepSelectable = parseInt(enroller.options.contact_id) > 0;

                if (stepSelectable) {
                    if (stepType == "review") {
                        stepSelectable = parseInt(enroller.options.course.INSTANCEID) > 0;

                        if (enroller.options.cart_course_override != null) {
                            stepSelectable = true;
                        }
                    }
                    if (stepType == "course-enquiry" && enroller.options.enquiry_requires_course) {
                        if (enroller.options.course.ID != null) {
                            stepSelectable = parseInt(enroller.options.course.ID) > 0;
                        }
                    }
                    if (stepType == "course-enquiry" && enroller.options.enquiry_requires_complete) {
                        if ($(".enroller-menu-link.incomplete").length) {
                            $(".enroller-menu-link.incomplete").each(function(stepmenu) {
                                var menuLink = $(this);
                                var stepID = menuLink.attr("id").replace("_menu_link", "");
                                if (enroller.options.enroller_steps[stepID].TYPE !== "course-enquiry") {
                                    stepSelectable = false;
                                }
                            });
                        }
                    }
                    if (stepType == "enrol") {
                        if (enroller.element.data("billing_enabled") != null) {
                            stepSelectable = enroller.element.data("billing_enabled");
                        } else {
                            stepSelectable = false;
                        }
                    }

                    if (stepType == "complete") {
                        if (enroller.options.must_complete_required) {
                            if ($(".enroller-menu-link.incomplete").length) {
                                stepSelectable = false;
                            }
                        }
                    }
                    if (stepType == "agent-courses" || stepType == "group-booking") {
                        if (enroller.options.multiple_courses != null) {
                            stepSelectable = true;
                        } else {
                            stepSelectable = false;
                        }
                        if (enroller.options.must_complete_required) {
                            if ($(".enroller-menu-link.incomplete").length) {
                                stepSelectable = false;
                            }
                        }
                    }

                
                }
            }

            /*if all required fields must be set then disable enrol steps until they are*/
            if (enroller.options.must_complete_required && enroller.options.skip_to_step != "billing") {
                if ($(".enroller-menu-link.incomplete").length) {
                    if (stepType == "enrol") {
                        stepSelectable = false;
                    }
                }
            }
            if (enroller.element.data("booking_in_progress") != null) {
                if (stepType != "enrol") {
                    stepSelectable = false;
                }
            }

            return stepSelectable;
        },
        _getStepStatusMessage: function(step) {
            var menuLink = $("#" + step + "_menu_link");
            if (menuLink.data("TOOLTIP") != null) {
                return menuLink.data("TOOLTIP");
            } else {
                return "";
            }
        },

        _userLoginPopup:function(message, callback){
            var popupHolder = $('<div></div>');
            var fields = {
                USERNAME_pop: {
                    DISPLAY: "Username",
                    TYPE: "text",
                    REQUIRED: "required",
                    MAXLENGTH: 100
                },
                PASSWORD_pop: { DISPLAY: "Password", TYPE: "password", REQUIRED: "required" }
            };

            var inputHolder = $('<form id="loginFormPopup" />');
            inputHolder.on('submit', function(e){
                e.preventDefault();
            });

            if(message != null && message != ""){
                inputHolder.prepend(message);
            }
            
            // ADD POPUP HERE;

            $.each(fields, function(key, field) {
                var fieldHolder = enroller._createInputField(key, field);

                inputHolder.append(fieldHolder);
            });
          
            var loginButton = $(
                '<button class="enroller-save-button ui-btn ui-btn-active" type="submit" name="submit" data-role="button">Login</button>'
            );
            
            inputHolder.append(loginButton);
           
            inputHolder.enhanceWithin();
            popupHolder.append(inputHolder);
           

            loginButton.on("click", function() {

                var uname = $('#USERNAME_pop').val();
                var password = $('#PASSWORD_pop').val();
                if(uname == ""){
                    enroller._markFieldIncomplete('USERNAME_pop', fields.USERNAME_pop);
                }
                if(password == ""){
                    enroller._markFieldIncomplete('PASSWORD_pop', fields.PASSWORD_pop);
                }
                if(uname != "" && password != ""){
                    if (enroller.options.user_login != null) {
                        enroller.options.user_login({username:uname, password:password}, function(userData) {
                            if (userData.STATUS == null) {
                                enroller._alert("An Error occurred on Login, Please try again.");
                            } else {
                                if (userData.STATUS == "success") {
                                    callback(userData);
                                    
                                } else if (
                                    userData.AXTOKEN != null &&
                                    userData.ROLETYPEID != null &&
                                    userData.USERID != null
                                ) {
                                    callback(userData);
                                   
                                } else {
                                    enroller._displayError('PASSWORD_pop', userData.MESSAGE);
                                }
                            }
                        });
                    } else {
                        enroller._displayError('PASSWORD_pop',"An Error occurred on Login, Please try again.");
                    }
                }
            });




            var forgotButton = $(
                '<button class="enroller-save-button ui-btn" data-role="button" name="forgot" type="button">Forgot Password</button>'
            );
         
            inputHolder.append(forgotButton);
            forgotButton.on("click", function() {
                $("#forgotPassHolderPop").show();
                $("#loginFormPopup").hide();
            });

            var forgotPassHolder = $('<form id="forgotPassHolderPop" />');
            forgotPassHolder.on('submit', function(e){
                e.preventDefault();
            });
            popupHolder.append(forgotPassHolder);
            forgotPassHolder.hide();

            var fieldsFPW = {
                RESET_UNAME_pop: { DISPLAY: "Username", TYPE: "text", REQUIRED: "required" },
                RESET_EMAIL_pop: { DISPLAY: "Email Address", TYPE: "email", REQUIRED: "required" }
            };
            $.each(fieldsFPW, function(key, field) {
                var fieldHolder = enroller._createInputField(key, field);

                forgotPassHolder.append(fieldHolder);
            });

           
            var resetButton = $(
                '<button class="enroller-save-button ui-btn-active ui-btn" type="submit" name="submit" data-role="button">Reset Password</button>'
            );
            forgotPassHolder.append(resetButton);

            resetButton.on("click", function() {
                var uname = $('#RESET_UNAME_pop').val();
                var email = $('#RESET_EMAIL_pop').val();
                if(uname == ""){
                    enroller._markFieldIncomplete('RESET_UNAME_pop', fieldsFPW.RESET_UNAME_pop);
                }
                if(email == "" || !enroller._isEmail(email)){
                    email = "";
                    enroller._markFieldIncomplete('RESET_EMAIL_pop', fieldsFPW.RESET_EMAIL_pop);
                }
                if(uname != "" && email != ""){
                    if (enroller.options.user_reset != null) {
                        var newParams = {};
                        newParams.USERNAME = uname;
                        newParams.EMAIL = email;

                        enroller.options.user_reset(newParams, function(resetData) {
                            if (resetData.STATUS == null) {
                                if (resetData.ERROR == true) {
                                    if (resetData.DETAILS != null) {
                                        enroller._displayError('RESET_EMAIL_pop', "An error occurred on reset, please check your details and try again.")
                                        
                                    }
                                } else {
                                    enroller._displayError('RESET_EMAIL_pop', "An error occurred on reset, please check your details and try again.")
                                }
                            } else {
                                if (resetData.STATUS == "success") {
                                    enroller._displayError('loginFormPopup', "Password Reset - Check your email for details.")
                                    $("#forgotPassHolderPop").hide();
                                    $("#loginFormPopup").show();
                                } else {
                                    enroller._displayError('RESET_EMAIL_pop', resetData.MSG);
                                }
                            }
                        });
                    } else {
                        enroller._displayError('RESET_EMAIL_pop', "An error occurred on reset, please check your details and try again.")
                    }
                }
            });
            var cancelButton = $(
                '<button class="ui-btn" name="cancel" data-role="button">Cancel</button>'
            );
            cancelButton.on('click', function(e){
                e.preventDefault();
                enroller._dismissAlertOverlay();
                callback({cancelled:true});
            });
            popupHolder.append(cancelButton);
            enroller._displayOverlayNonDismissableAlert('Login', popupHolder, $(enroller.element));
        },

    


        /* UTILITY FUNCTIONS */

        _enrolmentCompleteCleanup: function() {
            var dataToClear = ["billing_enabled", "allow_public_inhouse", "booking_in_progress", "invoice_data"];
            var optionsToClear = ["multiple_courses"];
            $.each(dataToClear, function(i, key) {
                enroller.element.data(key, null);
            });
            $.each(optionsToClear, function(i, key) {
                enroller.options[key] = null;
            });
            /*explicitly set the instance_id to 0, preventing loading the review step.*/
            enroller.options.course.INSTANCEID = 0;
        },
        TOOLTIP_H_OFFSET: 150,
        TOOLTIP_V_OFFSET: 40
    });
});
