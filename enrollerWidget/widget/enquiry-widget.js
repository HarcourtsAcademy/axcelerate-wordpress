jQuery(function($) {
    $.widget("axcelerate.enquiry_widget", $.axcelerate.enrol_base, {
        options: {
            /* UI */

            stylesheet: "enroller.css",
            stylesheet_override: null,

            selects_as_chosens: true,
            required_complete_check: false,

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

            force_left: false,
            terminology_student: "Student",

            store_enrol_data: null,
            enrolment_complete: null,
            enrolment_hash: null,

            enquiry_single_click: false,
            enquiry_complete_events:false,

            //WP-337
            confirm_emails:false
        },
        ALLOWED_STEPS: {
            "contact-update": true,
            "course-enquiry": true,
            "contact-note": true
        },

        _create: function() {
            enroller = this;
            enroller.element.addClass("enquiry-widget");
            enroller._registerWidgetListeners();
            if(enroller.options.user_contact_id !== 0){
                enroller.options.enquiry_single_click = false;
                enroller._setContact(enroller.options.user_contact_id);
            }
            return this._super();
        },

        _setOption: function(key, value) {
            if (key === "contact_id") {
                this._setContact(value);
            }
            return this._super();
        },
        _setContact: function(contactID) {
            if (parseInt(contactID) > 0) {
                var params = { contactID: contactID, API: true };

                enroller.element.find("div.enroller-step").data("terms_completed", false);

                if (enroller.options.enquiry_single_click == true) {
                    enroller.options.get_contact(params, function(data) {
                        var cid = 0;
                        if (data != null) {
                            if (data.CONTACTID == null) {
                                if (data[0] !== null) {
                                    if (data[0].CONTACTID != null) {
                                        cid = data[0].CONTACTID;
                                    }
                                }
                            } else {
                                cid = data.CONTACTID;
                            }
                        }
                        if (cid > 0) {
                            enroller.options.contact_id = cid;
                            enroller.element
                                .trigger("enroller:contact_id_set")
                                .off("enroller:contact_id_set");
                        }

                        /*add this in here as specifying just the function will lose the widget context*/
                    });
                } else {
                    $.each(enroller.options.enroller_steps, function(key, step) {
                        if (step.TYPE == "contact-update") {
                            enroller.element.data(key + "_last_params", null);
                        }

                        if (step.FIELDS != null) {
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

                    /*update the data based on the retrieveFunction specified during widget creation*/
                    enroller.options.get_contact(params, function(data) {
                        /*add this in here as specifying just the function will lose the widget context*/

                        enroller._processContactData(data);
                    });
                    if ($(".enroller-terms-action-holder").length) {
                        $(".enroller-terms-action-holder input").prop("checked", false);
                        $(".enroller-terms-action-holder input").trigger("change");
                    }
                }
            } else {
                $.each(enroller.options.enroller_steps, function(key, step) {
                    if (step.TYPE == "contact-update") {
                        enroller.element.data(key + "_last_params", null);
                    }
                    if (step.FIELDS != null) {
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
            }
        },
        /*add content creation here*/
        _refreshEnrolmentWizard: function() {
            enroller.element.empty();
            enroller._displaySegments();
            enroller._displayUserLogin();

            enroller._displayComplete();
            enroller.element.trigger("enquiry:initial_state");
            enroller._loadSignatureFields();
            enroller.element.enhanceWithin();
        },

        _registerWidgetListeners: function() {
            enroller.element.on("submit", "form", function(e) {
                e.preventDefault();
                return false;
            });

            if (enroller.options.enquiry_single_click == true) {
                enroller.element.on("enroller:contact_id_set", function() {
                    enroller._checkForCourses();
                    enroller._processEnquiry(0);
                });
            }

            enroller.element.find("form:not(#loginForm)").on("keyup keypress", function(e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode === 13) {
                    e.preventDefault();
                    return false;
                }
            });

            enroller.element.on("enroller:update_enroller_status", function(e) {
                enroller._updateState();
            });

            enroller.element.on("enquiry:initial_state", function(e) {
                enroller._setInitialState();
            });
            enroller.element.on("enquiry:step_state_update", function(e, payload) {
                if (payload != null) {
                    enroller._updateSegmentState(payload.step, payload.completed);
                }
            });

            enroller.element.on("enquiry:submission_failure", function(e, payload) {
                if (payload != null) {
                    enroller.element.trigger("enroller:update_enroller_status");
                    enroller._updateSegmentState(payload.step, false);

                    enroller._flagStepError(payload.step, payload.response);
                }
            });
            enroller.element.on("enquiry:submission_success", function(e, payload) {
                var message = enroller._enquiryResponse(true, "");
                message.addClass("enroller-enquiry-response");
                enroller.element.append(message);
                enroller.element
                    .find(".enroller-step")
                    .addClass("ui-disabled")
                    .hide(500, function() {
                        enroller._scrollToElement(message);
                    });
                if (enroller.options.complete_step_events == true) {
                    enroller.element.trigger("enroller:enquiry_complete", {
                        user_contact_id: enroller.options.user_contact_id,
                        method: "complete_step",
                        config_id: enroller.options.config_id
                    });
                }
            });

            enroller.element.on("enquiry:completion_error", function(e, payload) {
                if (payload != null) {
                    if (payload.step != null) {
                        var stepElement = enroller.element.find("#" + payload.step + "_step");
                        var fields = enroller.options.enroller_steps[payload.step].FIELDS;
                        if (fields != null) {
                            var status = enroller._checkStatusNoCallback(fields);
                            var scrolled = false;
                            $.each(fields, function(key, field) {
                                if (field.REQUIRED == true) {
                                    if (
                                        status.params[field] == null ||
                                        status.params[field] == ""
                                    ) {
                                        $("#" + key).focus();
                                        enroller._scrollToElement("#" + key, function() {
                                            enroller._toolTip(
                                                "#" + key,
                                                "Required Fields Are Incomplete."
                                            );
                                        });
                                        scrolled = true;
                                        return false;
                                    }
                                }
                            });
                            if (!scrolled) {
                                enroller._scrollToElement(stepElement);
                            }
                        }
                    }
                }
            });
            enroller.element.on("enquiry:terms_complete_error", function(e, payload) {
                if (payload != null) {
                    if (payload.step != null) {
                        var stepElement = enroller.element.find("#" + payload.step + "_step");
                        var terms = stepElement.find(".enroller-terms-action-holder");
                        enroller._scrollToElement(terms, function() {
                            enroller._toolTip(terms, "Terms are Incomplete.");
                        });
                    }
                }
            });
            enroller.element.on("enroller:enquiry_complete", function(event, payload) {
                if (payload == null) {
                    payload = {
                        user_contact_id:enroller.options.user_contact_id,
                       
                    };
                }
                payload.enquiry = true;

                if (enroller.options.enquiry_complete_events != null) {
                    if (enroller.options.enrolment_hash != null) {
                        payload.enrolment_hash = enroller.options.enrolment_hash;
                    }
                   
                    enroller.options.enrolment_complete(payload);
                }
            });
        },
        _setInitialState: function() {
            if (enroller.options.enquiry_single_click !== true) {
                enroller.element
                    .find(".enroller-step:not(#userLogin_step)")
                    .addClass("ui-disabled");
            }

            enroller.element.find(".enroller-step").data("completed", false);
        },
        _updateSegmentState: function(step, completed) {
            var stepElement = $("#" + step + "_step");
            var completed = stepElement.data("completed", completed == true);
        },
        _updateState: function() {
            /*Confirm that both the contact ID and data are set*/

            if (enroller.options.contact_id != 0) {
                if (enroller.element.data("contact_data") != null) {
                    enroller.element.find(".enroller-step").removeClass("ui-disabled");
                    if (
                        enroller.element.find(".enroller-step#userLogin_step").data("completed") ==
                            false ||
                        enroller.element.find(".enroller-step#userLogin_step").is(":visible")
                    ) {
                        enroller.element
                            .find(".enroller-step#userLogin_step")
                            .data("completed", true);
                        enroller.element
                            .find(".enroller-step#userLogin_step")
                            .addClass("ui-disabled")
                            .hide(500);
                    }
                }
                /*placeholder until a trigger is added to check the field status*/
                enroller.element.data("enquire_enabled", true);
            }
            var allCompleted = true;
            $.each(enroller.options.enroller_steps, function(key, step) {
                var stepElement = $("#" + key + "_step");
                var completed = stepElement.data("completed");
                if (stepElement.data("successful_submission") == true) {
                    enroller.element
                        .find(".enroller-step#userLogin_step")
                        .addClass("ui-disabled")
                        .hide(500);
                }

                /*check for nulls or false*/
                if (!(completed == true)) {
                    allCompleted = false;
                }
            });

            /* Check the current value, in case for some reason it has been set to true elsewhere*/
            var enquiryEnabled = enroller.element.data("enquire_enabled");

            if (enquiryEnabled == true || allCompleted) {
                enroller.element.data("enquire_enabled", allCompleted);
                enroller.element.find("#enquiry_complete_step").removeClass("ui-disabled");
                enroller.element.find("#enquiry_complete_step button").attr("disabled", false);
            } else {
                enroller.element.data("enquire_enabled", false);
                enroller.element.find("#enquiry_complete_step").addClass("ui-disabled");
                enroller.element.find("#enquiry_complete_step button").attr("disabled", "disabled");
            }
        },
        _disable: function() {
            enroller.element.attr("disabled", "disabled").addClass("ui-disabled");
        },

        _displaySegments: function() {
            if (enroller.options.step_order != null) {
                if (enroller.options.step_order[0] != "userLogin") {
                    enroller._alert("Invalid Configuration");
                } else {
                    $.each(enroller.options.step_order, function(i) {
                        var stepData =
                            enroller.options.enroller_steps[enroller.options.step_order[i]];
                        if (stepData != null) {
                            var stepHolder = $("<div />");
                            stepHolder.attr("id", enroller.options.step_order[i] + "_step");
                            stepHolder.addClass("enroller-step ui-body ui-body-a");
                            stepHolder.addClass(stepData.TYPE);
                            if (enroller.ALLOWED_STEPS[stepData.TYPE] != null) {
                                enroller.element.append(stepHolder);
                                enroller._populateSegment(enroller.options.step_order[i]);
                                enroller._displaySetupChosens(enroller.options.step_order[i]);
                            } else if (stepData.TYPE == "courses") {
                                enroller.element.append(stepHolder);
                                enroller._populateSegment(enroller.options.step_order[i]);
                                enroller._displaySetupChosens(enroller.options.step_order[i]);
                            } else if (stepData.TYPE == "user-login") {
                                enroller.element.append(stepHolder);
                            }
                        } else {
                            enroller._alert("Invalid Configuration");
                        }
                    });
                }
            }
        },
        _populateSegment: function(stepID) {
            var step = $("#" + stepID + "_step");
            var stepOptions = enroller.options.enroller_steps[stepID];
            if (enroller.ALLOWED_STEPS[stepOptions.TYPE] != null) {
                var inputHolder = $("<form />");
                var fields = stepOptions.FIELDS;

                step.append(inputHolder);
                $.each(fields, function(key, field) {
                    if (field.INFO_ONLY == true) {
                        var fieldHolder = enroller._createInfoFieldDetailed(key, field);
                    } else {
                        var fieldHolder = enroller._createInputField(key, field);
                    }

                    inputHolder.append(fieldHolder);
                });
                if (stepOptions.BLURB_TOP != null) {
                    var blurbT = enroller._createBlurb(stepOptions.BLURB_TOP);

                    step.prepend(blurbT);
                }
                /*Bottom Blurb*/
                if (stepOptions.BLURB_BOTTOM != null) {
                    var blurbB = enroller._createBlurb(stepOptions.BLURB_BOTTOM);
                    step.append(blurbB);
                }
                $("#" + stepID + "_step :input").change(function() {
                    step.data("changed", true);
                });

                if (stepOptions.TERMS != null) {
                    var terms = enroller._createTerms(stepOptions.TERMS);
                    step.append(terms[0]);
                    step.append(terms[1]);
                }
                enroller.element.trigger("enroller:update_chosens");
            } else if (stepOptions.TYPE == "courses") {
                enroller._displayCourseSearch();
            }
        },

        _displayComplete: function() {
            var stepHolder = $("<div />");
            stepHolder.attr("id", "enquiry_complete_step");
            stepHolder.addClass("enroller-step ui-body ui-body-a");

            enroller.element.append(stepHolder);

            var completeButtonH = enroller._createInformationField("Enquire", "");
            completeButtonH.find("div.enroller-text-field").remove();
            completeButtonH
                .find("div.enroller-field-label")
                .text("")
                .css("background", "transparent")
                .css("border", "none");

            var completeButton = $(
                '<button class="enroller-save-button ui-btn ui-btn-active" type="submit" name="submit" data-role="button">Enquire</button>'
            );
            completeButtonH.append(completeButton);
            stepHolder.append(completeButtonH);

            completeButton.on("click", function() {
                completeButton.attr("disabled", "disabled");

                if (
                    enroller.options.enquiry_single_click == true &&
                    enroller.options.contact_id == 0
                ) {
                    var cForm = $("#contactForm:visible");
                    var lForm = $("#loginForm:visible");

                    if (cForm.length) {
                        cForm.find(".enroller-save-button").trigger("click");
                    } else if (lForm.length) {
                        lForm.find(".enroller-save-button[name='submit']").trigger("click");
                    }
                } else {
                    enroller._checkForCourses();

                    enroller._processEnquiry(0);
                }
            });
        },

        _flagStepError: function(step, response) {
            var stepElement = enroller.element.find("#" + step + "_step");
            enroller._scrollToElement(stepElement, function() {
                var message =
                    "There was an error submitting the following data: <br/>" +
                    enroller._messageReWrite(response.response);

                enroller._toolTip(stepElement, message);
            });
        },

        /**
		 * This function is run once per step. The loop inside checks the field status for every step regardless to prevent data being changed if something fails.
		 */
        _processEnquiry: function(stepIndex) {
            var currentStepData;
            var requiredComplete = true;

            $.each(enroller.options.step_order, function(i) {
                var step = enroller.options.step_order[i];
                var stepOptions = enroller.options.enroller_steps[step];

                //having no fields shouldn't throw any errors here.
                var status = enroller._checkStatusNoCallback(stepOptions.FIELDS);

                if (i == stepIndex) {
                    currentStepData = status;
                }
                if (status.requiredComplete == false) {
                    requiredComplete = false;
                    enroller.element.trigger("enquiry:completion_error", { step: step });
                    enroller.element.trigger("enroller:update_enroller_status");
                    return false;
                }
                if (stepOptions.TERMS != null) {
                    var termsComplete = enroller.element
                        .find("#" + step + "_step")
                        .data("terms_completed");
                    if (termsComplete != true) {
                        requiredComplete = false;
                        enroller.element.trigger("enquiry:terms_complete_error", { step: step });
                        enroller.element.trigger("enroller:update_enroller_status");
                        return false;
                    }
                }
            });
            var currentStep = enroller.options.step_order[stepIndex];

            if (requiredComplete) {
                if (stepIndex < enroller.options.step_order.length - 1) {
                    var stepElement = $("#" + currentStep + "_step");

                    var previouslySubmitted = stepElement.data("successful_submission") == true;
                    var stepType = enroller.options.enroller_steps[currentStep].TYPE;

                    var skipStep = enroller.ALLOWED_STEPS[stepType] == null;

                    if (!previouslySubmitted && !skipStep) {
                        /* To be changed in if there is a "completion" detection added
						 * var completedFields = stepElement.data('completed') == true;*/
                        var completedFields = currentStepData.requiredComplete;

                        if (completedFields) {
                            enroller._processStepSubmission(currentStep, function(data) {
                                if (data.success) {
                                    stepElement.data("successful_submission", true);
                                    enroller._processEnquiry(stepIndex + 1);
                                } else {
                                    enroller.element.trigger("enquiry:submission_failure", {
                                        step: currentStep,
                                        response: data
                                    });
                                }
                            });
                        } else {
                            /*should never reach this block*/
                            enroller.element.trigger("enquiry:completion_error", {
                                step: currentStep
                            });
                        }
                    } else {
                        enroller._processEnquiry(stepIndex + 1);
                    }
                } else {
                    /*last step*/
                    enroller._processStepSubmission(currentStep, function(data) {
                        if (data.success) {
                            enroller.element.trigger("enquiry:submission_success");
                            
                        } else {
                            enroller.element.trigger("enquiry:submission_failure", {
                                step: currentStep,
                                response: data
                            });
                        }
                    });
                }
            }
        },
        _processStepSubmission: function(step, callback) {
            var stepOptions = enroller.options.enroller_steps[step];
            if (stepOptions != null) {
                if (stepOptions.TYPE == "contact-update") {
                    enroller._checkStatusAndBuildParams(stepOptions.FIELDS, function(
                        params,
                        requiredComplete,
                        complete
                    ) {
               
                        contactID = enroller.options.contact_id;
                        enroller._update_contact(contactID, params, function(response) {
                            if (response != null) {
                                if (response.error != null) {
                                    var message = "";
                                    if (response.resultBody != null) {
                                        if (response.resultBody.MESSAGES != null) {
                                            message =
                                                message + response.resultBody.MESSAGES + "<br />";
                                        }
                                        if (response.resultBody.DETAILS != null) {
                                            message = message + response.resultBody.DETAILS;
                                        }
                                    }
                                    callback({
                                        success: false,
                                        response: message
                                    });
                                } else {
                                    if (response.CONTACTID != enroller.options.contact_id) {
                                        callback({
                                            success: false,
                                            response: response
                                        });
                                    } else {
                                        callback({
                                            success: true,
                                            response: response
                                        });
                                    }
                                }
                            }
                        });
                    });
                } else if (stepOptions.TYPE == "course-enquiry") {
                    enroller._checkStatusAndBuildParams(stepOptions.FIELDS, function(
                        params,
                        requiredComplete,
                        complete
                    ) {
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
                            newParams.COMMENTS =
                                "Enquiry from - " + currentLocation + "<br/>" + params.COMMENTS;
                        } else {
                            var comments = "Enquiry from - " + currentLocation + "<br/>";
                            $.each(params, function(key, inputVal) {
                                comments =
                                    comments +
                                    stepOptions.FIELDS[key].DISPLAY.replace(/\\/g, "") +
                                    ": " +
                                    inputVal +
                                    "<br/>";
                            });

                            newParams.COMMENTS = comments;
                        }
                        if (enroller.options.enrolment_hash != null) {
                            var enrolHash =
                                "<br />Enrolment Hash: " + enroller.options.enrolment_hash;
                            newParams.COMMENTS = newParams.COMMENTS + enrolHash;
                        }

                        if (requiredComplete) {
                            enroller.options.course_enquire(newParams, function(enquiryResponse) {
                                if (enquiryResponse.SUCCESS == true) {
                                    callback({
                                        success: true,
                                        response: enquiryResponse
                                    });
                                } else {
                                    callback({
                                        success: false,
                                        response: enquiryResponse
                                    });
                                }
                            });
                        } else {
                            callback({
                                success: false,
                                response: { required_fields_incomplete: true }
                            });
                        }
                    });
                } else if (stepOptions.TYPE == "contact-note") {
                    enroller._checkStatusAndBuildParams(stepOptions.FIELDS, function(
                        params,
                        requiredComplete,
                        complete
                    ) {
                        var stepOptions = enroller.options.enroller_steps[step];
                        var newParams = {};

                        /* if there is no noteCodeID then set to SYSTEM NOTE */
                        if (stepOptions.noteCodeID == null) {
                            newParams.noteCodeID = 88;
                        } else {
                            newParams.noteCodeID = stepOptions.noteCodeID;
                        }
                        if (stepOptions.emailTo != null) {
                            newParams.emailNote = stepOptions.emailTo;
                        }
                        newParams.contactID = enroller.options.contact_id;
                        var currentLocation = window.location.hostname;

                        /*
						 * Build a custom set of params;
						 * */

                        var contactNote = "Contact Note from - " + currentLocation + "<br/>";
                        $.each(params, function(key, inputVal) {
                            contactNote =
                                contactNote +
                                stepOptions.FIELDS[key].DISPLAY.replace(/\\/g, "") +
                                ": " +
                                inputVal +
                                "<br/>";
                        });

                        newParams.contactNote = contactNote;
                        if (requiredComplete) {
                            enroller.options.contact_note(newParams, function(response) {
                                if (response.STATUS == "success") {
                                    callback({
                                        success: true,
                                        response: response
                                    });
                                } else {
                                    callback({
                                        success: false,
                                        response: response
                                    });
                                }
                            });
                        }
                        callback({
                            success: false,
                            response: { required_fields_incomplete: true }
                        });
                    });
                } else {
                    /*if there are any other step types, skip them*/
                    callback({
                        success: true,
                        response: { invalid_step_type: true }
                    });
                }
            }
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
                        '<a class="enroller-login-switch ui-btn ui-btn-icon-right ui-alt-icon ui-nodisc-icon ui-icon-user ">Returning ' +
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
                        var contactCreate = enroller._displayContactCreate(function(
                            contactBasicDetails
                        ) {
                            enroller._setOption("contact_id", contactBasicDetails.CONTACTID);
                            enroller._setOption("payer_id", contactBasicDetails.CONTACTID);
                            enroller.options.user_contact_id = contactBasicDetails.CONTACTID;
                            enroller.element.trigger("enroller:user_contact_set", {
                                user_contact_id: enroller.options.user_contact_id
                            });
                        });
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
            if (enroller.options.enquiry_single_click == true) {
                loginHolder.css("display", "none");
            }
            loginHolder.append(loginButton);
            inputHolder.append(loginHolder);
            loginButton.on("click", function() {
                enroller._checkStatusAndBuildParams(fields, function(
                    params,
                    requiredComplete,
                    complete
                ) {
                    if (requiredComplete) {
                        if (enroller.options.user_login != null) {
                            enroller.options.user_login(params, function(userData) {
                                if (userData.STATUS == null) {
                                    enroller._alert(
                                        "An Error occurred on Login, Please try again."
                                    );
                                    if (enroller.options.enquiry_single_click) {
                                        $("#enquiry_complete_step button").attr("disabled", false);
                                    }
                                } else {
                                    if (userData.STATUS == "success") {
                                        enroller._setUserRoleAndAccess(userData);
                                    } else {
                                        enroller._alert(enroller._messageReWrite(userData.MESSAGE));
                                        if (enroller.options.enquiry_single_click) {
                                            $("#enquiry_complete_step button").attr(
                                                "disabled",
                                                false
                                            );
                                        }
                                    }
                                }
                            });
                        } else {
                            enroller._alert("An Error occurred on Login, Please try again.");
                            if (enroller.options.enquiry_single_click) {
                                $("#enquiry_complete_step button").attr("disabled", false);
                            }
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
                '<button class="enroller-save-button ui-btn" data-role="button" type="button">Forgot Password</button>'
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

            resetButton.on("click", function(e) {
                e.preventDefault();
                enroller._checkStatusAndBuildParams(fieldsFPW, function(
                    params,
                    requiredComplete,
                    complete
                ) {
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
                                        $(
                                            "#userLogin_step .enroller-login-switch.ui-icon-user"
                                        ).trigger("click");
                                    } else {
                                        enroller._alert(resetData.MSG);
                                    }
                                }
                            });
                        } else {
                            enroller._alert(
                                "An error occurred on reset, please check your details and try again."
                            );
                        }
                    }
                });
                return false;
            });
            inputHolder.on("keyup keypress", function(e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode === 13) {
                    if (enroller.options.enquiry_single_click != true) {
                        loginButton.trigger("click");
                    }
                    e.preventDefault();
                    return false;
                }
            });

            if (!contact_create_only) {
                contactCreateHolder.hide();
            } else {
                $("#userLogin_step #loginForm").hide();
                $("#userLogin_step #forgotPassHolder").hide();
                modeSwitchHolder.find("a.enroller-create-contact").trigger("click");
                modeSwitchHolder.hide();
            }

            var stepOptions = enroller.options.enroller_steps.userLogin;
            /*Top Blurb*/
            if (stepOptions.BLURB_TOP != null) {
                var blurbT = enroller._createBlurb(stepOptions.BLURB_TOP);

                $("#userLogin_step").prepend(blurbT);
            }
            /*Bottom Blurb*/
            if (stepOptions.BLURB_BOTTOM != null) {
                var blurbB = enroller._createBlurb(stepOptions.BLURB_BOTTOM);
                $("#userLogin_step").append(blurbB);
            }
            modeSwitchHolder.find("a.enroller-create-contact").trigger("click");
        },
        _displayContactCreate: function(onCreate) {
            var contactCreate = $("#contactCreate");
            if (!contactCreate.length) {
                contactCreate = $('<div id="contactCreate" />');
                var list = $("<div>");
                var header = $(
                    '<div class="enroller-popup-header" >Add ' +
                        enroller.options.terminology_student +
                        ":</div>"
                );
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

                if(enroller.options.confirm_emails == true){
                    fields['create_CONFIRM_EMAILADDRESS'] =  {
                        TYPE: "email",
                        DISPLAY: "Confirm Email",
                        REQUIRED: true,
                        MAXLENGTH: 60
                    }
                }

                $.each(fields, function(key, value) {
                    createHolder.append(enroller._createInputField(key, value));
                });

                if (enroller.options.confirm_emails == true) {
                    createHolder
                        .find("#create_EMAILADDRESS, #create_CONFIRM_EMAILADDRESS")
                        .on("input", function() {
                            var email = $("#create_EMAILADDRESS").val();
                            var confirmEmail = $(
                                "#create_CONFIRM_EMAILADDRESS"
                            ).val();
                            if (email !== confirmEmail) {
                                enroller._displayError(
                                    "create_CONFIRM_EMAILADDRESS",
                                    "Emails do not match."
                                );
                            }
                            else{
                                var field = createHolder.find('#create_CONFIRM_EMAILADDRESS');
                                var fieldHolder = field.closest(".enroller-field-holder");
                                if (fieldHolder.find(".enroller-error-message").length) {
                                    fieldHolder.find(".enroller-error-message").remove();
                                }
                            }
                        });
                }
                
                var createButton = $(
                    '<button data-role="button" class="ui-btn ui-btn-active enroller-save-button enroller-create-contact-button ui-nodisc-icon ui-alt-icon ui-icon-plus ui-btn-icon-right">Create</button>'
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
                if (enroller.options.enquiry_single_click == true) {
                    createBHolder.css("display", "none");
                }
                list.append(createHolder);
                contactCreate.append(list);
                contactCreate.find("input").attr("required", "required");
            } else {
                contactCreate.popup().popup("destroy");
            }
            contactCreate
                .find(".enroller-create-contact-button")
                .off()
                .on("click", function() {
                    if (enroller.options.enquiry_single_click) {
                        $("#enquiry_complete_step button").attr("disabled", false);
                    }
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
                            enroller._displayError("create_CONFIRM_EMAILADDRESS", "Emails do not match, or are invalid.");
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
                                    var userContactData = enroller.element.data(
                                        "user_contact_data"
                                    );
                                    if (userContactData != null) {
                                        if (userContactData.ORGID != null) {
                                            params.orgID = userContactData.ORGID;
                                            params.organisation = userContactData.ORGANISATION;
                                        } else {
                                            makeCall = false;
                                        }
                                    } else {
                                        makeCall = false;
                                        enroller._confirmContactIsInAccount(
                                            axTokenAll.CONTACTID,
                                            function(contactData) {
                                                enroller.element.data(
                                                    "user_contact_data",
                                                    contactData
                                                );
                                                contactCreate
                                                    .find(".enroller-create-contact-button")
                                                    .trigger("click");
                                            }
                                        );
                                    }
                                }
                            }
                        }

                        if (makeCall) {
                            enroller.options.add_contact(params, function(contactID) {
                                if (contactCreate.hasClass("ui-popup")) {
                                    contactCreate.popup("close");
                                }

                                if (onCreate != null) {
                                    params.CONTACTID = contactID;
                                    onCreate(params);
                                } else {
                                    enroller._setOption("contact_id", contactID);
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

        _displayCourseSearch: function() {
            var courseOptions = enroller.options.enroller_steps.courses;
            var terminologyOverride = enroller.options.enroller_steps.courses.COURSE_TYPES != null;
            var qualificationName = "Qualifications";
            var workshopName = "Workshops";
            var eLearningName = "eLearning";
            var courseTypeHolder = $('<div class="enroller-course-selector-holder"></div>');

            var courseTypeSelectParams = {
                DISPLAY: "Course Type",
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
            if (terminologyOverride) {
                courseTypeSelectParams.VALUES =
                    enroller.options.enroller_steps.courses.COURSE_TYPES;
                $.each(courseTypeSelectParams.VALUES, function(i, courseType) {
                    if (courseType.VALUE == "p") {
                        qualificationName = courseType.DISPLAY;
                    } else if (courseType.VALUE == "w") {
                        workshopName = courseType.DISPLAY;
                    } else if (courseType.value == "el") {
                        eLearningName = courseType.DISPLAY;
                    }
                });
            }
            var courseTypeSelector = enroller._createInputField(
                "courseType",
                courseTypeSelectParams
            );
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
                enroller._updateCourseSearchSelects();
            });
            courseOptions.retrieveWorkshopTypesList(function(workshopList) {
                var workshopListFieldParam = {
                    DISPLAY: workshopName,
                    VALUES: workshopList,
                    TYPE: "search-select"
                };
                var workshopListField = enroller._createInputField(
                    "workshopList",
                    workshopListFieldParam
                );
                workshopListField.addClass("enroller-workshoptypes");
                workshopListField.insertAfter(courseTypeSelector);
                workshopListField.hide();
                workshopListField.find("select").val("");
                $("#courses_step").enhanceWithin();
                enroller._displaySetupChosens("courses");
                enroller._updateCourseSearchSelects();
            });

            $("#courses_step").enhanceWithin();

            if (courseOptions.BLURB_TOP != null) {
                var blurbT = enroller._createBlurb(courseOptions.BLURB_TOP);

                $("#courses_step").prepend(blurbT);
            }
        },
        /*
		 * Custom code to work with chosens. 
		 * Creates, then modifies both the UI and behaviour of chosens.
		 * TODO: add specific input type for the "Add new value" chosen, rather than just single-select
		 */
        _displaySetupChosens: function(step) {
            if (/Android/i.test(window.navigator.userAgent) == false) {
                if (enroller.options.selects_as_chosens) {
                    $("#" + step + "_step .enroller-select-chosen:not(.chosen-markup)")
                        .addClass("chosen-markup")
                        .chosen({
                            width: "24em",
                            allow_single_deselect: true,
                            disable_search_threshold: 10
                        });
                }

                $("#" + step + "_step .enroller-select-multi:not(.chosen-markup)")
                    .addClass("chosen-markup")
                    .chosen({
                        width: "24em",
                        allow_single_deselect: true,
                        disable_search_threshold: 10
                    });
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
                            .addClass(
                                "ui-btn ui-btn-active ui-btn-icon-right ui-icon-nodisc ui-icon-plus"
                            );
                        addResult.on("click", function() {
                            var selectMenu = addResult
                                .closest(".enroller-field-holder")
                                .find("select");

                            if (selectMenu.data("add_type") != null) {
                                if (selectMenu.data("add_type") == "contact") {
                                    var contactCreate = enroller._displayContactCreate(function(
                                        contactBasicDetails
                                    ) {
                                        enroller._contactAdded(contactBasicDetails);
                                        selectMenu.val(contactBasicDetails.CONTACTID);
                                        selectMenu.trigger("chosen:updated");
                                    });
                                    contactCreate.insertAfter(enroller.element).hide();
                                    contactCreate.enhanceWithin();

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
                                }
                            } else {
                                var newOption = $(
                                    '<option value="' + newValue + '" >' + newValue + "</option>"
                                );
                                selectMenu.append(newOption);
                                newOption.attr("selected", "selected");
                                selectMenu.trigger("chosen:updated");
                            }
                        });
                    }
                }
            });
        },
        _updateCourseSearchSelects: function() {
            var course = enroller.options.course;

            if (course != null) {
                if (course.TYPE != null) {
                    if (course.ID != null) {
                        if (course.TYPE == "w") {
                            $("#courseType").val("w");
                            if (enroller.options.selects_as_chosens) {
                                $("#courseType")
                                    .trigger("chosen:updated")
                                    .trigger("change");
                            }
                            if (course.ID > 0) {
                                $("#workshopList").val(course.ID);
                                if (enroller.options.selects_as_chosens) {
                                    $("#workshopList").trigger("chosen:updated");
                                }
                            }
                        } else if (course.TYPE == "p") {
                            $("#courseType").val("p");
                            if (enroller.options.selects_as_chosens) {
                                $("#courseType")
                                    .trigger("chosen:updated")
                                    .trigger("change");
                            }
                            if (course.ID > 0) {
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

        _checkForCourses: function() {
            var courseType = $("#courseType").val();
            if (courseType != null && courseType != "") {
                enroller.options.course.TYPE = courseType;
            }
            var ID = 0;
            if (enroller.options.course.TYPE == "w") {
                ID = $("#workshopList").val();
            } else if (enroller.options.course.TYPE == "p") {
                ID = $("#qualList").val();
            } else if (enroller.options.course.TYPE == "el") {
            }
            if (ID != null && ID != "") {
                enroller.options.course.ID = ID;
            }
        }
    });
});
