jQuery(function($) {
    var config_widget_settings;
    var environment = "wordpress";
    if (after_init_vars.config_widget_settings != null && after_init_vars.config_widget_settings != "") {
        config_widget_settings = $.parseJSON(after_init_vars.config_widget_settings);
    } else {
        config_widget_settings = {};
    }

    EMPTY_CONFIG = {
        enroller_steps: {},
        step_order: []
    };

    function download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    function save_configuration(config_id, configuration, success) {
        var newConfig = {};
        if (configuration != null) {
            /*convert a single config to array*/
            if (config_widget_settings.enroller_steps != null) {
                newConfig[0] = config_widget_settings;
                newConfig[config_id] = configuration;
            } else {
                config_widget_settings[config_id] = configuration;
                newConfig = config_widget_settings;
            }
        } else {
            newConfig[config_id] = configuration;
        }

        var newJson = JSON.stringify(newConfig);
        try {
            var tested = JSON.parse(newJson);
        } catch (error) {
            alert("There is something wrong with the config that is preventing it from saving correctly");
            return;
        }
        var backup = $("#enroller_widget_settings").val();
        $("#enroller_widget_settings").val(newJson);
        try {
            var newDate = new Date();

            if (window.download_backups === true) {
                download(
                    backup,
                    "old_config_" + newDate.getFullYear() + newDate.getMonth() + newDate.getDate() + ".json",
                    "text/plain"
                );

                download(
                    newJson,
                    "new_config_" + newDate.getFullYear() + newDate.getMonth() + newDate.getDate() + ".json",
                    "text/plain"
                );
            }

            localStorage.setItem("old_config", backup);
            localStorage.setItem("new_config", newJson);
        } catch (error) {}
        try {
            var test = $("#enroller_widget_settings").val();
            var parsed = JSON.parse(test);
        } catch (error) {
            alert("There is something wrong with the config that is preventing it from saving correctly");
            $("#enroller_widget_settings").val(backup);
            return;
        }

        if ($("#enroller_config_table").length) {
            $("#enroller_config_table_wrapper").remove();
            if ($("#enroller_config_widget").length) {
                /*replace the div for the config_widget*/
                var element = document.getElementById("enroller_config_widget");
                element.parentNode.removeChild(element);
                $("#enroller_config_holder").append($('<div id="enroller_config_widget"></div>'));
            }
            config_widget_settings = newConfig;
            display_settings_list(newConfig);
            $(".settings-top-bar div.notice").remove();
            $(".settings-top-bar").append(
                $(
                    '<div class="notice is-dismissible notice-success" style="width:100%;"><h4>Configuration Updated. Make sure to hit Save Changes to store your changes to the database.</h4></div>'
                )
            );
            $(".settings-top-bar").css({ "flex-basis": 100 });
            var position = $(".ax-settings-tab").offset();
            $("body,html")
                .stop(true, true)
                .animate({ scrollTop: position.top - 50 }, "slow");
        }
    }

    function display_setting_buttons() {
        var controls = $('<div class="ax-settings-controls" />');

        controls.append(
            $('<a class="ui-btn ax-link add ui-icon-plus ui-btn-icon-right ax-add-new" >Add New Configuration</a>')
        );

        //TODO: Add a select box to select the scenario here!
        controls.append(
            $('<a class="ui-btn ax-link default ui-icon-plus ui-btn-icon-right ax-add-default" >Add A Default:</a>')
        );

        var selectConfig = $('<select id="default_configuration" />');
        controls.append(selectConfig);
        if (ENROLMENT_DEFAULT_CONFIGS != null) {
            $.each(ENROLMENT_DEFAULT_CONFIGS, function(id, config) {
                selectConfig.append('<option value="' + id + '">' + config.DISPLAY + "</option>");
            });
        }
        controls.find("a").css("display", "inline-block");
        controls.find("a.ax-add-new").on("click", function() {
            var config_id = checkSafeID(config_widget_settings, 0);
            var newConfig = { enroller_steps: {}, step_order: [] };
            config_widget_settings[config_id] = newConfig;

            if ($("#enroller_config_table").length) {
                $("#enroller_config_table_wrapper").remove();
                if ($("#enroller_config_widget").length) {
                    /*replace the div for the config_widget*/
                    var element = document.getElementById("enroller_config_widget");
                    element.parentNode.removeChild(element);
                    $("#enroller_config_holder").append($('<div id="enroller_config_widget"></div>'));
                }
                display_settings_list(config_widget_settings);
            }
        });

        controls.find("a.ax-add-default").on("click", function() {
            //TODO: Add check for the val of the select box here.

            var newConfig_steps = jQuery.extend({}, ENROLLER_STEP_DEFAULTS);
            delete newConfig_steps.agentCourses;
            delete newConfig_steps.contactCRICOS;
            delete newConfig_steps.contactSearch;

            var newConfig = {
                enroller_steps: newConfig_steps,
                step_order: [
                    "userLogin",
                    "contactGeneral",
                    "contactAvetmiss",
                    "contactAddress",
                    "emergencyContact",
                    "courses",
                    "portfolio",
                    "review",
                    "billing"
                ]
            };
            var config_id = checkSafeID(config_widget_settings, 0);
            if (ENROLMENT_DEFAULT_CONFIGS != null) {
                if ($("#default_configuration").length) {
                    var selected = $("#default_configuration").val();
                    if (selected != null) {
                        if (ENROLMENT_DEFAULT_CONFIGS[selected] != null) {
                            newConfig = jQuery.extend({}, ENROLMENT_DEFAULT_CONFIGS[selected].CONFIG);
                        }
                    }
                }
            }

            config_widget_settings[config_id] = newConfig;

            if ($("#enroller_config_table").length) {
                $("#enroller_config_table_wrapper").remove();
                if ($("#enroller_config_widget").length) {
                    /*replace the div for the config_widget*/
                    var element = document.getElementById("enroller_config_widget");
                    element.parentNode.removeChild(element);
                    $("#enroller_config_holder").append($('<div id="enroller_config_widget"></div>'));
                }
                display_settings_list(config_widget_settings);
            }
        });

        $("#enroller_config_holder").prepend(controls);
        $("#enroller_config_holder select").chosen();
    }
    function checkSafeID(config_w_settings, configID) {
        if (config_w_settings[configID] !== undefined) {
            return checkSafeID(config_w_settings, configID + 1);
        } else {
            return configID;
        }
    }
    function display_settings_list(config_settings) {
        var columns = [
            { title: "Config ID", data: "config_id" },
            { title: "Config Name", data: "NAME" },
            { title: "Steps", data: "STEPS" },
            { title: "Action", data: "ACTION" }
        ];
        var settingsArray = [];
        $.each(config_settings, function(key, setting) {
            var temp = {
                config_id: key,
                NAME: "",
                STEPS: setting.step_order.join(", "),
                ACTION:
                    '<a class="ax-config-edit ui-btn ui-icon-edit ui-btn-icon-notext">Edit</a><a class="ax-config-duplicate ui-btn ui-icon-plus ui-btn-icon-notext">Duplicate</a><a class="ax-config-delete ui-btn ui-icon-delete ui-btn-icon-notext">Delete</a>'
            };
            if (setting.config_name != null) {
                temp.NAME = setting.config_name;
            }
            settingsArray.push(temp);
        });

        $("#enroller_config_holder").append('<table id="enroller_config_table"></table>');
        var configTable = $("#enroller_config_table").DataTable({
            data: settingsArray,
            columns: columns,
            searching: true,
            paging: true,
            info: false,
            lengthMenu: [[10, 25, -1], [10, 25, "All"]]
        });
        if (environment == "agent-portal") {
            $(".dataTables_length").enhanceWithin();
            $("#enroller_config_table_filter").addClass(
                "ui-input-search ui-body-inherit ui-corner-all ui-shadow-inset ui-input-has-clear"
            );
            $("#enroller_config_table_filter input").attr({
                "data-role": "none",
                "data-enhance": false
            });
            $("#enroller_config_table_wrapper")
                .find("label")
                .contents()
                .filter(function() {
                    return this.nodeType == 3;
                })
                .remove();
            $("#enroller_config_table_filter input").insertBefore(
                $("#enroller_config_table_filter input").closest("label")
            );
            $("#enroller_config_table_filter label").remove();
        }

        $("#enroller_config_table").on("click", ".ax-config-edit", function(e) {
            $(".settings-top-bar .notice").remove();
            $(".settings-top-bar").css({ "flex-basis": "" });
            var selectedConfig = configTable.row($(this).closest("tr")).data();
            var selectedStepRow = $(this).closest("tr");
            $(".ax-active-config").removeClass("ax-active-config");
            selectedStepRow.addClass("ax-active-config");

            /*replace the div for the config_widget*/
            if ($("#enroller_config_widget").length) {
                /*replace the div for the config_widget*/
                var element = document.getElementById("enroller_config_widget");
                element.parentNode.removeChild(element);
                $("#enroller_config_holder").append($('<div id="enroller_config_widget"></div>'));
            }

            $("#enroller_config_widget")
                .enroller_config({
                    config_id: selectedConfig.config_id,
                    current_configuration: config_widget_settings[selectedConfig.config_id],
                    advanced_mode: false,
                    save_configuration: save_configuration,
                    field_options: ENROLLER_FIELD_DEFAULTS,
                    environment: environment
                })
                .addClass("wordpress");
        });
        $("#enroller_config_table").on("click", ".ax-config-delete", function(e) {
            var selectedConfig = configTable.row($(this).closest("tr")).data();
            delete config_widget_settings[selectedConfig.config_id];

            $("#enroller_widget_settings").val(JSON.stringify(config_widget_settings));
            if ($("#enroller_config_table").length) {
                $("#enroller_config_table_wrapper").remove();
                if ($("#enroller_config_widget").length) {
                    /*replace the div for the config_widget*/
                    var element = document.getElementById("enroller_config_widget");
                    element.parentNode.removeChild(element);
                    $("#enroller_config_holder").append($('<div id="enroller_config_widget"></div>'));
                }
                display_settings_list(config_widget_settings);
            }
        });
        $("#enroller_config_table").on("click", ".ax-config-duplicate", function(e) {
            var selectedConfig = configTable.row($(this).closest("tr")).data();
            var config_id = selectedConfig.config_id;
            var config = config_widget_settings[config_id];
            var newConfig = jQuery.extend({}, config_widget_settings[config_id]);
            var newConfigID = checkSafeID(config_widget_settings, 0);
            config_widget_settings[newConfigID] = newConfig;

            $("#enroller_widget_settings").val(JSON.stringify(config_widget_settings));
            if ($("#enroller_config_table").length) {
                $("#enroller_config_table_wrapper").remove();
                if ($("#enroller_config_widget").length) {
                    /*replace the div for the config_widget*/
                    var element = document.getElementById("enroller_config_widget");
                    element.parentNode.removeChild(element);
                    $("#enroller_config_holder").append($('<div id="enroller_config_widget"></div>'));
                }
                display_settings_list(config_widget_settings);
            }
        });
        if (Object.keys(config_settings).length > 50) {
            $(".ax-config-duplicate, .ax-add-new").hide();
        } else {
            $(".ax-config-duplicate, .ax-add-new").show();
        }
    }
    display_setting_buttons();
    display_settings_list(config_widget_settings);

    /*

	 */
});
