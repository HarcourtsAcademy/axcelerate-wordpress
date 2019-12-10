/**
 * Calls makes an ajax call to a backend page that will then handle communication with aXcelerate.
 * @param action - the action, how the function call is identified through the backend. Generally callResource when using this function.
 * @param endpoint - axcelerate API endpoint to call
 * @param method - The method to call the axcelerate API endpoint ('GET', 'POST', 'PUT' etc)
 * @param params - The data/parameters of the API call.
 * @param callback - the function to call once the API call has completed.
 */
function callResource(action, endpoint, method, params, callback) {
    var ajaxURL = enroller_default_vars.ajaxURL;
    params.action = action;
    params.method = method;
    params.endpoint = endpoint;

    if (window.ax_session != null) {
        params.ax_session = window.ax_session.session_id;
    }

    if (window._wp_nonce != null) {
        params.security = window._wp_nonce;
    }

    jQuery.ajax({
        type: "POST",
        url: ajaxURL,
        dataType: "JSON",

        data: params,

        success: function(result) {
            if (result != null) {
                if (result.session != null) {
                    window.ax_session = result.session;
                    delete result.session;
                }
            }
            callback(result);
        }
    });
}
/**
 * Calls makes an ajax call to a backend page that will then handle communication with aXcelerate.
 * @param action - the action, how the function call is identified through the backend. Generally callResourceAX when using this function.
 * @param endpoint - axcelerate API endpoint to call
 * @param method - The method to call the axcelerate API endpoint ('GET', 'POST', 'PUT' etc)
 * @param params - The data/parameters of the API call.
 * @param callback - the function to call once the API call has completed.
 * @param axToken - a User AXtoken. This is used to perform user specific API Calls. For example retrieving contacts a client has access to.
 */
function callResourceAX(action, endpoint, method, params, callback, axToken) {
    var ajaxURL = enroller_default_vars.ajaxURL;
    params.action = action;
    params.method = method;
    params.endpoint = endpoint;
    params.AXTOKEN = axToken;

    if (window._wp_nonce != null) {
        params.security = window._wp_nonce;
    }

    if (window.ax_session != null) {
        params.ax_session = window.ax_session.session_id;
    }

    jQuery.ajax({
        type: "POST",
        url: ajaxURL,
        dataType: "JSON",
        data: params,

        success: function(result) {
            if (result != null) {
                if (result.session != null) {
                    window.ax_session = result.session;
                    delete result.session;
                }
            }
            callback(result);
        }
    });
}
/**
 * When uploading a file to aXcelerate this function will be utilised. In the case of WP this call is made directly, rather than through the backend.
 * @param resource - The API Endpoint to hit.
 * @param method - The method to call the axcelerate API endpoint ('GET', 'POST', 'PUT' etc)
 * @param data - The data/parameters of the API call.
 * @param callback - The function to call when completed
 * @param progressHandlingFunction - A function registered to display the upload progress.
 * @param token - The API token to use when uploading.
 */
function callResourceFile(resource, method, data, callback, progressHandlingFunction, token) {
    var ax_url = enroller_default_vars.ax_url;
    var API_TOKEN = enroller_default_vars.api_token;
    jQuery.ajax({
        crossDomain: true,
        data: data,
        contentType: false,
        processData: false,
        cache: false,
        success: function(result) {
            callback(result);
        },
        error: function(jqXHR) {
            console.log(jqXHR);
        },
        type: method,
        headers: {
            apiToken: API_TOKEN,
            aXtoken: token
        },
        url: ax_url + resource,
        xhr: function() {
            // Custom XMLHttpRequest
            var myXhr = jQuery.ajaxSettings.xhr();
            if (myXhr.upload) {
                // Check if upload property exists
                myXhr.upload.addEventListener("progress", progressHandlingFunction, false); // For handling the progress of the upload
            }
            return myXhr;
        }
    });
}

function storeEnrolData(params, callback) {
    var ajaxURL = enroller_default_vars.ajaxURL;
    params.action = "store_enrolment";
    if (window._wp_nonce != null) {
        params.security = window._wp_nonce;
    }
    if (window.ax_session != null) {
        params.ax_session = window.ax_session.session_id;
    }
    jQuery.ajax({
        type: "POST",
        url: ajaxURL,
        dataType: "JSON",
        data: params,

        success: function(result) {
            callback(result.TOKEN);
        }
    });
}

function storePostEnrolData(params, callback) {
    var ajaxURL = enroller_default_vars.ajaxURL;
    params.action = "store_post_enrolment";
    if (window._wp_nonce != null) {
        params.security = window._wp_nonce;
    }
    if (window.ax_session != null) {
        params.ax_session = window.ax_session.session_id;
    }
    jQuery.ajax({
        type: "POST",
        url: ajaxURL,
        dataType: "JSON",
        data: params,

        success: function(result) {
            callback(result);
        }
    });
}

function enrolmentComplete(params) {
    var ajaxURL = enroller_default_vars.ajaxURL;
    params.action = "enrolment_complete";
    if (window._wp_nonce != null) {
        params.security = window._wp_nonce;
    }
    if (window.ax_session != null) {
        params.ax_session = window.ax_session.session_id;
    }
    jQuery.ajax({
        type: "POST",
        url: ajaxURL,
        dataType: "JSON",
        data: params,

        success: function(result) {
            if (result != null) {
                if (result.ACTION == "redirect") {
                    window.location = result.REDIRECT_URL;
                } else if (result.ACTION == "hide_and_display") {
                    jQuery("#enroller").hide();

                    jQuery("#enroller_success").show(100);
                    var position = jQuery("#enroller_success").offset();
                    if (postion != null) {
                        jQuery("body,html")
                            .stop(true, true)
                            .animate({ scrollTop: position.top - 100 }, "slow");
                    }
                } else {
                }
            }
        }
    });
}

function standardAjax(params, callback) {
    var ajaxURL = enroller_default_vars.ajaxURL;
    if (window._wp_nonce != null) {
        params.security = window._wp_nonce;
    }

    jQuery.ajax({
        type: "POST",
        url: ajaxURL,
        dataType: "JSON",
        data: params,

        success: function(result) {
            callback(result);
        }
    });
}

function requestIdentityValidation(params, callback) {
    params.action = "request_validation_email";
    standardAjax(params, callback);
}

function ePayment(params, callback) {
    params.action = "epayment_process";
    standardAjax(params, callback);
}

function ePaymentCheckStatus(params, callback) {
    params.action = "epayment_check_status";
    standardAjax(params, callback);
}

function ePaymentNext(params, callback) {
    params.action = "epayment_next_step";
    standardAjax(params, callback);
}

function courseInstanceV2(params, callback) {
    params.action = "course_instance_v2";
    standardAjax(params, callback);
}

function courseInstanceItems(params, callback) {
    params.action = "instance_items_v2";
    standardAjax(params, callback);
}

function sendReminderByReference(params, callback) {
    params.action = "send_reminder_by_reference";
    standardAjax(params, callback);
}
function hasEnrolmentByReference(params, callback) {
    params.action = "has_enrolment_by_reference";
    standardAjax(params, callback);
}
function flagEnrolmentsAsRedundantByReference(params, callback) {
    params.action = "flag_others_redundant_by_reference";
    standardAjax(params, callback);
}

function validateUSI(params, callback) {
    params.action = "ax_verify_usi";
    standardAjax(params, callback);
}
function checkForUser(params, callback) {
    params.action = "ax_check_for_user";
    standardAjax(params, callback);
}

function cognitoAccessToken(params, callback) {
    params.action = "ax_validate_access_token";
    standardAjax(params, callback);
}
function logout(params, callback) {
    params.action = "ax_logout";
    standardAjax(params, callback);
}

function paymentFlowForm(params, callback) {
    params.action = "ax_payment_flow_form";
    standardAjax(params, callback);
}

function beginPaymentFlow(params, callback) {
    params.action = "ax_payment_flow_begin";
    standardAjax(params, callback);
}

function beginEZFlow(params, callback) {
    params.action = "ax_select_plan";
    standardAjax(params, callback);
}

function triggerEnrolment(params, callback) {
    params.action = "ax_trigger_resumption";
    standardAjax(params, callback);
}

function retrieveABN(params, callback) {
    params.action = "ax_retrieve_abn_org";
    standardAjax(params, callback);
}

function updateABN(params, callback) {
    params.action = "ax_update_org_abn";
    standardAjax(params, callback);
}
