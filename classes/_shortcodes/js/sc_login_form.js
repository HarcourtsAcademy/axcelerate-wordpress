(function($) {
    var ajaxURL = "";
    if (window.login_vars != null) {
        ajaxURL = window.login_vars.ajaxURL;
    }
    var passReg = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,30}$/);
    var passTest = new RegExp(/(?=.*([pP][aA][sS][sS]))/g);
    var emailReg = new RegExp(/^([a-zA-Z0-9]+[a-zA-Z0-9._%\-\+]*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,4})$/);
    if ($("form.ax_login_form").length) {
        //Use a doc level trigger to handle UI switching - allows other components to also subscribe
        $(document).on("ax:login", function(e) {
            if ($(".ax-login-form").length) {
                $(".ax-login-form").hide(250);
            }
            if ($(".ax-logout-form").length) {
                $(".ax-logout-form").show(250);
            }
            $('.ax-form-standard form input:not(input[type="hidden"])').val("");
        });
        $(document).on("ax:user_reset", function(e) {
            if ($(".ax-login-form").length) {
                $(".ax-login-form").show(250);
                var info = $('<div class="info alert"/>').append(
                    "<p>Password Reset: Your password has been reset.</p>Please check your email for instructions."
                );
                $(".ax-login-form").prepend(info);
            }
            if ($(".ax-login-forgot-form").length) {
                $(".ax-login-forgot-form").hide(250);
            }
            $('.ax-form-standard form input:not(input[type="hidden"])').val("");
        });

        $("form.ax_login_form").on("input", function(e) {
            if ($(".ax-login-form .alert").length) {
                $(".ax-login-form .alert").hide(500); // hide not remove to make the form animate.
            }
        });
        $("form.ax_login_form .ax-create").on("click", function(e) {
            $(document).trigger("ax:new_user");
        });
        $("form.ax_login_form .ax-forgot").on("click", function(e) {
            $(document).trigger("ax:forgot");
        });

        $("form.ax_login_form").on("submit", function(e) {
            var form = $(this);

            e.preventDefault();
            if ($("form.ax_login_form .alert").length) {
                $("form.ax_login_form .alert").remove();
            }

            if (form.find('input[name="password"]').val() == "" || form.find('input[name="username"]').val() == "") {
                var warning = $('<div class="warning alert"/>').append("Please specify both username and password");
                form.prepend(warning);
                return;
            }
            form.find("button").hide();
            var data = form.serializeArray();
            jQuery.ajax({
                type: "POST",
                url: ajaxURL,
                dataType: "JSON",
                data: data,
                success: function(result) {
                    form.find("button").show();
                    if (result.success == true) {
                        $(document).trigger("ax:login");
                        //window.location = window.location;
                    } else {
                        var message = result.resultBody
                            ? result.resultBody.DETAILS
                            : "An unknown error occurred. Login may not be enabled for this site.";
                        var warning = $('<div class="warning alert"/>').append(message);
                        form.prepend(warning);
                    }
                }
            });
        });
    }

    if ($("form.ax_logout_form").length) {
        //Use a doc level trigger to handle UI switching - allows other components to also subscribe
        $(document).on("ax:logout", function(e) {
            if ($(".ax-logout-form").length) {
                $(".ax-logout-form").hide(250);
            }
            if ($(".ax-login-form").length) {
                $(".ax-login-form").show(250);
            }
            $('.ax-form-standard form input:not(input[type="hidden"])').val("");
        });

        $("form.ax_logout_form").on("submit", function(e) {
            var form = $(this);
            e.preventDefault();
            form.find("button").hide();
            var data = form.serializeArray();
            jQuery.ajax({
                type: "POST",
                url: ajaxURL,
                dataType: "JSON",
                data: data,
                success: function(result) {
                    $("form.ax_logout_form button").show();
                    if (result.success == true) {
                        $(document).trigger("ax:logout");
                        //window.location = window.location;
                    }
                }
            });
        });
    }

    if ($("form.ax_login_create_form").length) {
        $(document).on("ax:user_created", function(e) {
            if ($(".ax-login-form").length) {
                $(".ax-login-form").show(250);
                var info = $('<div class="info alert"/>').append(
                    "<p>Account Created: Please enter your credentials below to login. Your username is your email address.</p>"
                );
                $(".ax-login-form").prepend(info);
            }
            if ($(".ax-login-create-form").length) {
                $(".ax-login-create-form ").hide(250);
            }
            $('.ax-form-standard form input:not(input[type="hidden"])').val("");
        });
        $(document).on("ax:new_user", function(e) {
            if ($(".ax-login-form").length) {
                $(".ax-login-form").hide(250);
            }
            if ($(".ax-login-create-form").length) {
                $(".ax-login-create-form").show(250);
            }
            $('.ax-form-standard form input:not(input[type="hidden"])').val("");
        });
        $(document).on("ax:user_found", function(e) {
            if ($(".ax-login-form").length) {
                $(".ax-login-form").show(250);
                var info = $('<div class="info alert"/>').append(
                    "<p>Account Found: A user account with that email address was found, please enter your details below.</p>If you've forgotten your password, use the forgot password option."
                );
                $(".ax-login-form").prepend(info);
            }
            if ($(".ax-login-create-form").length) {
                $(".ax-login-create-form ").hide(250);
            }
            $('.ax-form-standard form input:not(input[type="hidden"])').val("");
        });

        $("form.ax_login_create_form .ax-login").on("click", function(e) {
            $(".ax-login-create-form").hide(250);
            $(document).trigger("ax:logout");
        });

        $("form.ax_login_create_form").on("input", function(e) {
            if ($(".ax-login-form .alert").length) {
                $(".ax-login-form .alert").hide(500); // hide not remove to make the form animate.
            }
            if ($(".ax-login-create-form .alert").length) {
                $(".ax-login-create-form .alert").hide(500); // hide not remove to make the form animate.
            }
        });

        var passVerify = $("form.ax_login_create_form").find('input[name="password_verify"]');
        var passField = $("form.ax_login_create_form").find('input[name="password"]');

        // When the verify field changes check it matches.
        passVerify.on("input", function(e) {
            var element = $(this);
            var form = element.closest("form");
            var pass = form.find('input[name="password"]');
            if (element.val() !== pass.val()) {
                element[0].setCustomValidity("Passwords must match");
            } else {
                element[0].setCustomValidity("");
            }
        });

        // When the 1st field changes trigger an input event for the 2nd.
        passField.on("input", function(e) {
            var element = $(this);
            var form = element.closest("form");
            var passV = form.find('input[name="password_verify"]');
            passV.trigger("input");
        });

        $("form.ax_login_create_form").on("submit", function(e) {
            var form = $(this);
            form.find("input").removeClass("invalid");
            var invalidFields = {};
            e.preventDefault();
            var pass = form.find('input[name="password"]').val();
            var pass2 = form.find('input[name="password_verify"]').val();
            var strength = passReg.test(pass);
            form.find("button").hide();
            var email = form.find('input[name="email_address"]').val();

            if (!strength) {
                invalidFields.password = true;
            }

            if (pass !== pass2) {
                invalidFields.password_verify = true;
            }
            if (!emailReg.test(email)) {
                invalidFields.email_address = true;
            }

            var data = form.serializeArray();
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var element = data[key];
                    if (element.value == null || element.value == "") {
                        invalidFields[element.name] = true;
                    }
                }
            }
            var invalidkeys = Object.keys(invalidFields);
            if (invalidkeys.length == 0) {
                jQuery.ajax({
                    type: "POST",
                    url: ajaxURL,
                    dataType: "JSON",
                    data: data,
                    success: function(result) {
                        form.find("button").show();
                        if (result.user_created == true) {
                            //Show login form
                            $(document).trigger("ax:user_created");
                        }
                        if (result.user_found == true) {
                            $(document).trigger("ax:user_found");
                            //show forgot form
                        } else {
                            //Something went wrong.
                        }
                    }
                });
            } else {
                for (var index = 0; index < invalidkeys.length; index++) {
                    var element = invalidkeys[index];
                    form.find('input[name="' + element + '"]').addClass("invalid");
                }
                form.find("button").show();
            }
        });
    }
    if ($("form.ax_login_forgot_form").length) {
        $(document).on("ax:forgot", function(e) {
            if ($(".ax-login-forgot-form").length) {
                $(".ax-login-forgot-form").show(250);
            }
            if ($(".ax-login-form").length) {
                $(".ax-login-form").hide(250);
            }
            $('.ax-form-standard form input:not(input[type="hidden"])').val("");
        });
        $("form.ax_login_forgot_form .ax-login").on("click", function(e) {
            if ($(".ax-login-forgot-form").length) {
                $(".ax-login-forgot-form").hide(250);
            }
            if ($(".ax-login-form").length) {
                $(".ax-login-form").show(250);
            }
            $('.ax-form-standard form input:not(input[type="hidden"])').val("");
        });

        $("form.ax_login_forgot_form").on("input", function(e) {
            if ($(".ax-login-forgot-form .alert").length) {
                $(".ax-login-forgot-form .alert").hide(500); // hide not remove to make the form animate.
            }
        });

        $("form.ax_login_forgot_form").on("submit", function(e) {
            var form = $(this);
            form.find("button").hide();
            form.find("input").removeClass("invalid");
            e.preventDefault();
            var data = form.serializeArray();
            var fieldsValid = true;
            if ($(".ax-login-forgot-form .alert").length) {
                $(".ax-login-forgot-form .alert").remove();
            }
            var uname = form.find('input[name="username"]').val();
            var email = form.find('input[name="email_address"]').val();
            if (!emailReg.test(email)) {
                fieldsValid = false;
            }
            if (uname == null || uname === "") {
                fieldsValid = false;
            }
            if (fieldsValid) {
                jQuery.ajax({
                    type: "POST",
                    url: ajaxURL,
                    dataType: "JSON",
                    data: data,
                    success: function(result) {
                        form.find("button").show();
                        if (result.user_reset == true) {
                            //Show login form
                            $(document).trigger("ax:user_reset");
                        } else if (result.not_found == true) {
                            var warning = $('<div class="warning alert"/>');
                            if (result.response != null) {
                                if (result.response.MSG == "Your username and email are not valid.") {
                                    warning.append("Not Found: An account with that combination was not found.");
                                } else {
                                    warning.append("Password could not be reset.");
                                }
                            } else {
                                warning.append("Password could not be reset.");
                            }
                            form.prepend(warning);
                        }
                    }
                });
            }
        });
    }
})(jQuery);
