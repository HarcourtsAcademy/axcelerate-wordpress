(function($) {
    if ($("#ag_submit").length) {
        $("p.submit")
            .hide()
            .remove();
    }

    $(function() {
        $(".color-picker").wpColorPicker();
    });
    var ajaxURL = "admin-ajax.php";
    if (window.settings_vars != null) {
        ajaxURL = settings_vars.ajaxURL;
    }

    $("#ax_test_connection").on("click", function() {
        var params = {
            action: "callResource",
            method: "GET",
            endpoint: "/contacts/search",
            displayLength: 1
        };
        if (window._wp_nonce != null) {
            params.security = window._wp_nonce;
        }
        if (window._ax_setting_nonce != null) {
            params.setting_nonce = window._ax_setting_nonce;
        }

        jQuery.ajax({
            type: "POST",
            url: ajaxURL,
            dataType: "JSON",
            data: params,

            success: function(result) {
                var successful = false;
                if (result[0] != null) {
                    if (result[0].CONTACTID != null) {
                        successful = true;
                    }
                }
                var notice = $("<div></div>");
                var message = $("<h4></h4>");
                if (successful) {
                    notice.addClass("notice notice-success is-dismissible");
                    message.append("Test Successful, connection established");
                } else {
                    notice.addClass("notice notice-error is-dismissible");
                    message.append("Test Failed");
                    if (result.ERROR != null) {
                        if (result.MESSAGES != null) {
                            message.empty().append("Test Failed: " + result.MESSAGES);
                        }
                    }
                    if (result.error != null) {
                        if (result.resultBody != null) {
                            if (result.resultBody.MESSAGES != null) {
                                message.empty().append("Test Failed: " + result.resultBody.MESSAGES);
                            }
                        }
                    }
                }
                notice.append(message);
                notice.insertAfter(".settings-top-bar");
            }
        });
    });
    if (typeof jQuery.fn.chosen !== undefined) {
        $("select").chosen({ width: "30em" });
    }

    if ($("#ag_submit").length) {
        $("form").on("submit", function(e) {
            e.preventDefault();
            return false;
        });
        $("#ag_submit").on("click", function() {
            var data = $("form.ax-setting-page").serializeArray();
            data.forEach(function(element) {
                if (element.name == "action") {
                    element.value = "ax_auto_generate";
                }
            }, this);

            if (window._wp_nonce != null) {
                data.push({ name: "security", value: window._wp_nonce });
            }
            jQuery.ajax({
                type: "POST",
                url: ajaxURL,
                dataType: "JSON",
                data: data,

                success: function(result) {
                    var notice = $("<div></div>");
                    var message = $("<h4></h4>");
                    var successful = true;

                    if (result == null) {
                        successful = false;
                    }
                    if (successful) {
                        notice.addClass("notice notice-success is-dismissible");
                        if (result.message != null) {
                            message.append(result.message);
                        } else {
                            message.append("Page Creation Successful");
                        }
                    } else {
                        notice.addClass("notice notice-error is-dismissible");
                        message.append("An Error Occurred!");
                    }
                    notice.append(message);
                    notice.insertAfter(".nav-tab-wrapper");
                }
            });

            //TODO: call an ajax service for this!
        });
    }
    $(document)
        .ajaxStart(function() {
            if ($("form.ax-setting-page").length) $("form.ax-setting-page").trigger("ajax:page_busy");
        })
        .ajaxStop(function() {
            $("form.ax-setting-page").trigger("ajax:page_ready");
        });

    $("form.ax-setting-page").on("ajax:page_busy", function(e) {
        var ajaxPage = $("body");

        var overlay = $('<div class="ax-overlay""></div>');
        overlay.append('<div class="ajax spinner is-active"></div>');
        var height = ajaxPage.outerHeight();
        var width = ajaxPage.outerWidth();
        overlay.css({
            height: height,
            width: width,
            "z-index": 99999,
            position: "absolute",
            background: "transparent"
        });
        ajaxPage.prepend(overlay);
        ajaxPage.css({ opacity: ".8" });
    });

    $("form.ax-setting-page").on("ajax:page_ready", function(e) {
        var ajaxPage = $("body");

        if (ajaxPage.find("div.ax-overlay").length) {
            ajaxPage.find("div.ax-overlay").remove();
        }
        ajaxPage.css({ opacity: "1" });
    });

    $(".ag-collapse-chevron").on("click", function(e) {
        var target = $(e.target);

        var id = target.attr("id");
        id = id.split("_")[0];
        var collapseDiv = $("#" + id + "_collapsible");

        if (collapseDiv.hasClass("open")) {
            collapseDiv.removeClass("open").addClass("closed");
        } else {
            console.log("got here");
            collapseDiv.removeClass("closed").addClass("open");
        }
    });
})(jQuery);
