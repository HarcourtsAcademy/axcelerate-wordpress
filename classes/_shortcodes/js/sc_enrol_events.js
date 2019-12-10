(function($) {
    $(function() {
        $(document)
            .ajaxStart(function() {
                if ($("div.ax-course-search-ajax").length) {
                    $("div.ax-course-search-ajax").trigger("ajax_cs:page_busy");
                }
            })
            .ajaxStop(function() {
                if ($("div.ax-course-search-ajax").length) {
                    $("div.ax-course-search-ajax").trigger("ajax_cs:page_ready");
                }
            });

        var ajaxUrl = "/wp-admin/admin-ajax.php";
        if (enrol_event_vars != null) {
            ajaxUrl = enrol_event_vars.ajaxURL;

            if (enrol_event_vars.run_enrolment_check) {
                var overlay = $(
                    '<div class="ax-overlay" style="display:flex;flex:1;justify-content:space-around;align-items:center;"></div>'
                );
                var overlayInner = $('<div class="ax-overlay-inner">Checking your enrolment status...</div>');
                overlay.append(overlayInner);

                overlay.css({
                    height: "100%",
                    width: "100%",
                    "z-index": 99999,
                    position: "absolute",
                    background: "transparent"
                });
                $("body").prepend(overlay);
                $("body").css({ opacity: "9" });
                jQuery.ajax({
                    type: "POST",
                    url: ajaxUrl,
                    dataType: "JSON",
                    data: {
                        ax_process_id: enrol_event_vars.ax_process_id,
                        enrolment_hash: enrol_event_vars.enrolment_hash,
                        method: enrol_event_vars.method,
                        status: enrol_event_vars.status,
                        action: "ax_confirm_enrolment"
                    },
                    success: function(response) {
                        if (response.success == true) {
                            overlayInner.empty().append("Enrolment Successful!");

                            setTimeout(function() {
                                $(".ax-enrol-event-holder").show();
                                overlay.remove();
                            }, 2000);
                        } else {
                            if (response.success == false) {
                                overlayInner.empty().append(response.message);
                                if (response.error_content) {
                                    overlayInner.append(jQuery("<p></p>").append(response.error_content));
                                }

                                if (response.status == "epayment_redirect_resume" && response.redirect_url != null) {
                                    $(".ax-enrol-event-holder").empty();

                                    var content = $('<div class="epayment-failure-primary"></div>');
                                    content
                                        .append("<h3>Enrolment Found.</h3>")
                                        .append(
                                            "<p>An incomplete enrolment has been found. You will be redirected automatically to resume the payment process, or you may click the button below.</p>"
                                        )
                                        .append(
                                            "<p>Should you encounter any issues please get in touch with our office.</p>"
                                        )
                                        .append('<div class="ax-countdown"><span class="seconds"></span></div>');
                                    $(".ax-enrol-event-holder").append(content);
                                    if (window.initialiseCountdown != null) {
                                        var url = response.redirect_url;
                                        var link = $("<a>Continue</a>").attr("href", url);
                                        $(".ax-countdown").append(link);
                                        initialiseCountdown(
                                            15,
                                            function(count) {
                                                if (count < 10) {
                                                    count = "0" + count;
                                                }
                                                $(".seconds")
                                                    .empty()
                                                    .append("Redirecting in " + count);
                                            },
                                            function() {
                                                if (window.location != url) {
                                                    window.location = url;
                                                }
                                            }
                                        );
                                    }
                                } else {
                                    $(".ax-enrol-event-holder").empty();

                                    var content = $('<div class="epayment-failure-primary"></div>');
                                    content
                                        .append("<h3>Enrolment Found.</h3>")
                                        .append($("<p/>").append(response.message));
                                    $(".ax-enrol-event-holder").append(content);
                                }
                                setTimeout(function() {
                                    $(".ax-enrol-event-holder").show();
                                    overlay.remove();
                                }, 5000);
                            } else {
                                setTimeout(function() {
                                    $(".ax-enrol-event-holder").show();
                                    overlay.remove();
                                }, 2000);
                            }
                        }
                    }
                });
            }
        }

        if (window.initialiseCountdown != null && false) {
            var url = "'.$url.'";
            var link = $("<a>Continue</a>").attr("href", url);
            $(".ax-countdown").append(link);
            initialiseCountdown(
                30,
                function(count) {
                    if (count < 10) {
                        count = "0" + count;
                    }
                    $(".seconds")
                        .empty()
                        .append("Redirecting in " + count);
                },
                function() {
                    console.log("redirecting to: " + url);
                    if (window.location != url) {
                        window.location = "'.$url.'";
                    }
                }
            );
        }
    });
})(jQuery);
