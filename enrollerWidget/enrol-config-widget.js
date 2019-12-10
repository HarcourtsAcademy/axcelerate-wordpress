/*jslint browser: true, white: false, plusplus: false, evil: true, undef: false, bitwise: false, nomen: false */
jQuery(function($) {
    /*
     * Enrolment Widget Configuration Tool @widget @param {function}
     * save_configuration - Called by the widget when attempting to store the
     * configuration. @param {object} current_configuration - The configuration
     * currently loaded / being edited. @param {object} field_options - Default
     * field options, supplies the list of fields that can be selected. @param
     * {object} alert_function - Function to be called to notify the user of an
     * issue. @param {object} ax_ui - UI format override (placeholder) @param
     * {object} config_id - the config ID of the configuration being edited.
     * @param {object} field_edit_holder - Override the target location (CSS
     * selector) of the Field Editor @param {object} step_edit_holder - Override
     * the target location (CSS selector) of the Step Editor @param {object}
     * advanced_mode - Enables advanced field/step editing options.
     *
     * NOTE THIS WIDGET RELIES ON THE FOLLOWING JS Libraries: Chosen Version
     * 1.6.1 - https://github.com/harvesthq/chosen DataTables 1.10.12,
     * Responsive 2.1.0, RowReorder 1.1.2 - https://datatables.net/ jQuery
     * v1.11.3 + (may work with earlier versions) OPTIONAL - jQuery Mobile 1.4.5
     * (note it may be possible to replace aspects of JQM with jqueryUI)- Used
     * for the Default Alert Method.
     */
    var WORDPRESS_ENV = "wordpress";
    var AXCELERATE_ENV = "axcelerate";
    var AGENT_ENV = "agent-portal";
    var CLIENT_ENV = "client-portal";

    var jsFileLocation = $("script[src*=enrol-config-widget]").attr("src");
    var index = jsFileLocation.indexOf("enrol-config-widget.js");
    var jsDir = jsFileLocation.slice(0, index);

    CONFIG_SETTINGS_MIXINS = {};

    var CONFIG_FILES = [
        { file: "settings/basic.json", config_id: "GENERAL_SETTINGS" },
        { file: "settings/appearance.json", config_id: "GENERAL_SETTINGS" },
        { file: "settings/terminology.json", config_id: "GENERAL_SETTINGS" },
        { file: "settings/users.json", config_id: "GENERAL_SETTINGS" },
        { file: "settings/courseSearch.json", config_id: "GENERAL_SETTINGS" },
        { file: "settings/contactSearch.json", config_id: "GENERAL_SETTINGS" },
        { file: "settings/messages.json", config_id: "GENERAL_SETTINGS" },
        { file: "settings/enrolment.json", config_id: "GENERAL_SETTINGS" },
        { file: "settings/enquiry.json", config_id: "GENERAL_SETTINGS" },
        { file: "settings/advanced.json", config_id: "GENERAL_SETTINGS" },

        { file: "specialSteps.json", config_id: "SPECIAL_STEPS" },
        { file: "stepTypes.json", config_id: "STEP_TYPES" },
        { file: "fieldTypes.json", config_id: "FIELD_TYPES" },
        { file: "paymentMethods.json", config_id: "PAYMENT_METHODS" },
        { file: "addressStep.json", config_id: "ADDRESS_STEP_FIELDS" },
        { file: "portfolioStep.json", config_id: "PORTFOLIO_STEP_FIELDS" },
        { file: "contactNoteStep.json", config_id: "CONTACT_NOTE_STEP_FIELDS" },
        { file: "contactUpdateStep.json", config_id: "CONTACT_UPDATE_STEP_FIELDS" }
    ];

    $.each(CONFIG_FILES, function(index, file) {
        $.getJSON(jsDir + "/config/" + file.file, function(data) {
            var current = CONFIG_SETTINGS_MIXINS[file.config_id];
            if (current != null) {
                $.extend(CONFIG_SETTINGS_MIXINS[file.config_id], data);
            } else {
                CONFIG_SETTINGS_MIXINS[file.config_id] = data;
            }
        });
    });

    $.widget("axcelerate.enroller_config", {
        /* DEFAULTS */
        SPECIAL_STEPS: {},

        /*
         * The following IDs are Reserved and cannot be used for
         * other steps
         */
        DISALLOWED_IDS: ["userLogin", "contactSearch", "courses", "review", "agentCourses", "billing", "enrolOptions"],

        /* Available Step Types */
        STEP_TYPES: {}, // stepTypes.json
        /* Predefined field types */
        FIELD_TYPES: {}, // fieldTypes.json

        GENERAL_SETTINGS: {
            // loaded via ajax
            /***** GROUPING: NONE *****/
            /***** GROUPING: APPEARANCE *****/
            /***** GROUPING: TERMINOLOGY *****/
            /***** GROUPING: RETURNING USERS *****/
            /***** GROUPING: COURSE SEARCHING *****/
            /***** GROUPING: CONTACT SEARCH *****/
            /***** GROUPING: MESSAGES *****/
            /***** GROUPING: ENROLMENT SETTINGS *****/
            /***** GROUPING: ENQUIRY SETTINGS *****/
            /***** GROUPING: ADVANCED *****/
        },
        STEPS_WITH_TERMS: [
            "contact-update",
            "enrol-details",
            "enrol",
            "review",
            "course-enquiry",
            "contact-note",
            "usi-validation"
        ],
        STEPS_WITH_CUSTOM_BUTTON: [
            "contact-update",
            "enrol-details",
            "contact-note",
            "course-enquiry"
            //"custom-step"
        ],

        ADDRESS_STEP_FIELDS: {}, // stub - loaded via ajax

        PORTFOLIO_STEP_FIELDS: {}, // stub - loaded via ajax

        CONTACT_NOTE_STEP_FIELDS: {}, // stub - loaded via ajax
        PAYMENT_METHODS: {}, //paymentMethods.json

        options: {
            save_configuration: null,
            current_configuration: null,
            field_options: null,
            alert_function: null,
            ax_ui: false,
            config_id: 1,
            field_edit_holder: "#config_widget_holder",
            field_v_edit_holder: "#config_widget_holder",
            field_list_holder: ".ax-field-list-holder",
            step_edit_holder: ".ax-step-content",
            new_step_edit_holder: "#config_widget_holder",
            environment: WORDPRESS_ENV,

            advanced_mode: false,
            tooltip_v_offset: 40,
            tooltip_h_offset: 200,
            _menuNavigationState: [],
            _saveButtonState: []
        },

        _create: function() {
            configWidget = this;

            // ENSURE THAT THE AJAX LOADED CONFIG IS AVAILABLE
            $.each(CONFIG_SETTINGS_MIXINS, function(key, value) {
                configWidget[key] = value;
            });

            if (configWidget.options.alert_function == null) {
                configWidget._setOption("alert_function", configWidget._alert);
            }
            configWidget._buildMainUI();
            if (configWidget.options.current_configuration != null) {
                configWidget.element.data("original_config", configWidget.options.current_configuration);
                configWidget._setOption("current_configuration", configWidget.options.current_configuration);
            }

            configWidget.element.on("click", ".ui-disabled", function(e) {
                e.stopPropagation();
                e.preventDefault();
                return false;
            });

            configWidget._init();
        },
        _init: function() {
            configWidget._triggerEditorLoad();
        },
        //refresh: function() {},
        _destroy: function() {
            //super.destroy();

            /**
             * This should clean everything up. but doesn't.
             */
            configWidget.element.empty();
            configWidget.element.removeData();
            delete configWidget;
        },
        _setOption: function(key, value) {
            this._super(key, value);
            if (key == "current_configuration") {
                this._setConfiguration(value);
            }
            if (key == "config_id") {
                this._changeConfigID(value);
            }
            this._init();
        },

        /**
         * This is for a listener in aXcelerate - it does nothing in wordpress currently 16/11/17
         */
        _triggerEditorLoad: function() {
            configWidget.element.closest("div").trigger("ax_config:editor_load");
        },
        _triggerEditorCancel: function() {
            configWidget.element.closest("div").trigger("ax_config:editor_cancel");
        },

        _setConfiguration: function(configuration) {
            configWidget._refreshStepTable(configuration);
            configWidget._refreshGeneralSettings();
        },
        _changeConfigID: function(config_id) {
            if (configWidget.element.find(".ax-step-content").length) {
                configWidget.element.find(".ax-step-content").remove();
                configWidget._toggleStepsList();
            }
            if (configWidget.element.find(".ax-step-fieldedit").length) {
                configWidget.element.find(".ax-step-fieldedit").remove();
            }
            configWidget._refreshGeneralSettings();
        },

        /*
         * components to the UI Controls - Add new step Step
         * Table Step Configuration Fields Configuration Field
         * Editor Field Values List Field Values Editor
         */
        _buildMainUI: function() {
            if (configWidget.options.ax_ui) {
                /* We're in AX, everything must be tables :( */
            } else {
                configWidget.options._menuNavigationState = [];

                //TODO: Add Menu system here Will need to think of the best way to update the menu. Likely the best option would be a trigger/event system, to allow for complex updates...

                //TODO: swap to flex for the main outer components, makes it easier to lay out.

                //TODO: replace all the hide/show systems with triggers/event listeners, in order to both hide/show but also to update the heirarchy etc.
                var outer = $('<div id="config_widget_outer"/>');
                configWidget.element.append(outer);
                configWidget.element.addClass("is-active");
                var menuHolder = $('<div id="config_widget_menu_holder" class="ax-config-menu" style=""/>');
                outer.append(menuHolder);
                configWidget._generateMenu();

                var topMenu = $('<div id="config_widget_top_menu" class="ax-config-menu-top" style=""/>');

                var closeButton = $(
                    '<a class="ui-btn ui-btn-mini ui-btn-icon-notext ui-icon-delete ax-config-close">Close</a>'
                );
                topMenu.append(closeButton);
                closeButton.on("click", function() {
                    configWidget.element.removeClass("is-active");
                    configWidget._triggerEditorCancel();
                    configWidget.destroy();
                });
                var contentHolder = $('<div id="config_widget_content_holder" />');
                outer.append(contentHolder);
                contentHolder.append(topMenu);

                var configHolder = $('<div id="config_widget_holder" class="ax-enrol-config" />');
                contentHolder.append(configHolder);

                if (configWidget.options.current_configuration != null) {
                    /* Load the steps */
                } else {
                }

                configHolder.prepend($('<div class="ax-config-general"> </div>'));
                configWidget._createGeneralSettingConfig();

                var stepsHolder = $('<div class="ax-config-steps"> </div>');
                configHolder.append(stepsHolder);

                var controls = configWidget._createControls("steps");
                stepsHolder.append(controls);

                configWidget._generateStepsTable(stepsHolder);
                configWidget._menuAddNavigation({
                    stateLabel: "Steps",
                    stateID: "steps",
                    selector: ".ax-config-steps"
                });
                configWidget._addSaveButtonState({});
                configWidget._triggerEditorLoad();
            }
        },

        _generateStepsTable: function(location) {
            var stepTable = $("<table />");
            stepTable.addClass(" ax-step-table");
            $(location).append(stepTable);
            configWidget._initStepTable(stepTable);
        },
        _generateMenu: function() {
            var settingsState = {
                stateLabel: "Settings",
                stateID: "settings",
                selector: ".ax-config-general"
            };
            var settings = configWidget.renderNavRecord(settingsState);
            settings.on("click", function() {
                configWidget._menuSetNavigationState([settingsState]);
                configWidget._setSaveButtonState([{}]);
            });

            var stepsState = {
                stateLabel: "Steps",
                stateID: "steps",
                selector: ".ax-config-steps"
            };
            var steps = configWidget.renderNavRecord(stepsState);
            steps.on("click", function() {
                configWidget._menuSetNavigationState([stepsState]);
                configWidget._setSaveButtonState([{}]);
            });
            var menu = $("#config_widget_menu_holder");
            var name = $("<h3></h3>");
            if (
                configWidget.options.current_configuration.config_name != null &&
                configWidget.options.current_configuration.config_name != ""
            ) {
                name.append(configWidget.options.current_configuration.config_name);
            } else {
                name.append("Config: " + configWidget.options.config_id);
            }

            menu.prepend(name);

            menu.append(steps);
            menu.append(settings);
        },
        renderNavRecord: function(state) {
            var navState = $("<div/>").addClass("ax-config-nav-record");
            navState.append(state.stateLabel);
            navState.data("state", state);

            return navState;
        },

        registerEventListeners: function() {
            //TODO: Register event listeners for step change and similar events
        },

        _menuAddNavigation: function(newNavObject) {
            configWidget.options._menuNavigationState.push(newNavObject);
            configWidget._menuRenderNavigationState();
        },
        _menuSetNavigationState: function(newNavState) {
            configWidget.options._menuNavigationState = newNavState;
            configWidget._menuRenderNavigationState();
        },
        _menuReturnNavigationStateTo: function(index) {
            //TODO:
            //find index of nav state
            //remove all states after the navstate;
            var navState = configWidget.options._menuNavigationState;
            if (navState.length > 0) {
                if (navState.length - 1 >= index + 1) {
                    navState.splice(index + 1, navState.length - (index + 1));
                }
            }
            configWidget._menuRenderNavigationState();
        },
        _menuNavigationBack: function() {
            configWidget.options._menuNavigationState.pop();
            configWidget._menuRenderNavigationState();
            configWidget._saveStateBack();
        },
        _menuRenderNavigationState: function() {
            if ($(".ax-config-nav").length) {
                $(".ax-config-nav").remove();
            }
            var nav = $('<div class="ax-config-nav" />');
            configWidget.element.find("#config_widget_top_menu").prepend(nav);
            $.each(configWidget.options._menuNavigationState, function(i, state) {
                var navState = configWidget.renderNavRecord(state);
                navState.on("click", function() {
                    configWidget._menuReturnNavigationStateTo(i);
                    configWidget._returnToSaveState(i);
                });
                nav.append(navState);
            });
            configWidget._updateSaveButtonState(configWidget.options._menuNavigationState.length == 1);

            configWidget._displayContentForNavState();
        },

        _displayContentForNavState: function() {
            //TODO:
            // Use this function to toggle visibility of various components.
            var activeState =
                configWidget.options._menuNavigationState[configWidget.options._menuNavigationState.length - 1];
            configWidget._hideNonActive();
            configWidget.element.find(activeState.selector).show();
        },
        _updateSaveButtonState: function(state) {
            if (state == true) {
                $(".ax-export-settings").removeClass("ui-disabled");
            } else {
                $(".ax-export-settings").addClass("ui-disabled");
            }
        },

        _createGeneralSettingConfig: function() {
            var genHolder = configWidget.element.find("div.ax-config-general");
            var controls = configWidget._createControls("general");
            genHolder.append("<h2>General Settings:</h2>");
            genHolder.prepend(controls);
            var filter = $(
                '<input id="optListFilter" data-type="search" data-wrapper-class="ui-btn controlgroup-textinput" placeholder="Search Settings" />'
            );
            genHolder.append(filter);

            genHolder.enhanceWithin();
            var list = $(
                '<ul id="optList" data-role="listview" data-filter="true" data-filter-reveal="true" data-inset="true" data-input="#optListFilter" style="border:none; -webkit-box-shadow: none; box-shadow:none;" />'
            );

            genHolder.append(list);

            var currentGrouping = "";
            $.each(configWidget.GENERAL_SETTINGS, function(key, field) {
                var add = true;
                if (field.AVAILABLE_ENVS != null) {
                    if (!field.AVAILABLE_ENVS[configWidget.options.environment]) {
                        add = false;
                    }
                }
                if (add) {
                    var id = "ax_config_general_" + key;
                    var input = configWidget._createInputField(id, field);
                    var inputHolder = configWidget._stepInputFieldHolder(id, field.DISPLAY).append(input);

                    // inputHolder.append(tipButton);
                    var listElement = $(
                        '<li style="background:transparent; border:none; padding:0; white-space:normal; overflow:visible"></li>'
                    );
                    listElement.append(inputHolder);

                    if (field.GROUPING != null) {
                        if (field.GROUPING !== currentGrouping) {
                            list.append(
                                $('<li data-role="list-divider" style="margin-top:.5em;">' + field.GROUPING + "</li>")
                            );
                            currentGrouping = field.GROUPING;
                        }
                        /*add hidden element to allow filtering on the grouping*/
                        listElement.append('<span style="display:none;">' + field.GROUPING + "</span>");
                    }

                    list.append(listElement);
                }
            });
            list.listview().listview("refresh");
            genHolder.find("select").chosen({
                width: "400px"
            });
            configWidget._toggleGeneralSettings(true);
            configWidget._triggerEditorLoad();
        },
        _refreshGeneralSettings: function() {
            var config = configWidget.options.current_configuration;
            $.each(configWidget.GENERAL_SETTINGS, function(key, field) {
                var id = "ax_config_general_" + key;

                var defaultVal = configWidget.element.find("#" + id).data("default_val");
                if (defaultVal != null) {
                    configWidget.element.find("#" + id).val(defaultVal);
                }

                if (config[key] === undefined) {
                    if (defaultVal == null) {
                        configWidget.element.find("#" + id).val("");
                    }
                } else {
                    if (config[key] == true) {
                        configWidget.element.find("#" + id).val("1");
                    } else if (config[key] == false) {
                        configWidget.element.find("#" + id).val("0");
                    } else {
                        configWidget.element.find("#" + id).val(config[key]);
                    }
                }
                if (field.TYPE == "select") {
                    configWidget.element.find("#" + id).trigger("chosen:updated");
                }
            });
        },
        _updateConfigGeneralSettings: function() {
            var config = configWidget.options.current_configuration;
            $.each(configWidget.GENERAL_SETTINGS, function(key, field) {
                var id = "ax_config_general_" + key;

                var fieldVal = configWidget._checkField(configWidget.element.find("#" + id));
                /*
                 * insert the value, else delete the record so
                 * that it resets to the default
                 */

                if (fieldVal != null && fieldVal != "") {
                    if (fieldVal === " ") {
                        config[key] = fieldVal;
                    } else if (fieldVal === 1 || fieldVal === "1" || fieldVal === "true") {
                        config[key] = true;
                    } else if (fieldVal === 0 || fieldVal === "0" || fieldVal === "false") {
                        config[key] = false;
                    } else {
                        config[key] = fieldVal;
                    }
                } else {
                    if (config[key] !== undefined) {
                        delete config[key];
                    }
                }
            });
        },

        _getCurrentSaveAction: function() {
            var lastID = configWidget.options._saveButtonState.length - 1;
            if (lastID > -1) {
                return configWidget.options._saveButtonState[lastID];
            } else {
                return null;
            }
        },

        _addSaveButtonState: function(saveButtonObject) {
            // event + display
            var current = configWidget._getCurrentSaveAction();
            if (current == null) {
                configWidget.options._saveButtonState.push(saveButtonObject);
            } else if (current.event !== saveButtonObject.event) {
                configWidget.options._saveButtonState.push(saveButtonObject);
            }
            configWidget._renderSaveButton();
        },
        _setSaveButtonState: function(newSaveState) {
            configWidget.options._saveButtonState = newSaveState;
            configWidget._renderSaveButton();
        },
        _returnToSaveState: function(index) {
            var state = configWidget.options._saveButtonState;
            if (state.length > 0) {
                if (state.length - 1 >= index + 1) {
                    state.splice(index + 1, state.length - (index + 1));
                }
            }
            configWidget._renderSaveButton();
        },
        _saveStateBack: function() {
            var state = configWidget.options._saveButtonState;
            if (state.length > 0) {
                state.pop();
            }

            configWidget._renderSaveButton();
        },

        _renderSaveButton: function() {
            var topMenu = configWidget.element.find("#config_widget_top_menu");
            configWidget.element.find("#config_widget_top_menu .ax-save-button").remove();
            var saveAction = configWidget._getCurrentSaveAction();

            if (saveAction != null && saveAction.event != null) {
                var saveButton = $("<a/>").addClass("ui-btn ui-btn-icon-right ui-icon-check ax-save-button");

                saveButton.append(saveAction.display);

                configWidget.element.find("#config_widget_top_menu .ax-export-settings").before(saveButton);
                saveButton.on("click", function() {
                    configWidget.element.trigger(saveAction.event);
                });
            }
        },
        _createInputField: function(id, field) {
            var inputField = $("<input></input>");
            if (field.TYPE != null) {
                if (field.TYPE == "select") {
                    inputField = $("<select></select>").attr({
                        id: id,
                        class: "ax-config-select-input",
                        "data-role": "none"
                    });
                    if (field.VALUES != null) {
                        $.each(field.VALUES, function(i, option) {
                            var optionRow = $('<option value="' + option.VALUE + '">' + option.DISPLAY + "</option>");
                            inputField.append(optionRow);
                        });
                    }
                } else if (field.TYPE == "text") {
                    inputField.attr({
                        id: id,
                        class: "ax-config-text-input",
                        type: field.TYPE
                    });
                } else if (field.TYPE == "textarea") {
                    inputField = $("<textarea></textarea>");
                    inputField.attr({
                        id: id,
                        class: "ax-config-text-input",
                        type: field.TYPE
                    });
                }
            }

            if (field.DEFAULT_VALUE !== undefined) {
                if (field.MAKE_UNIQUE == true) {
                    inputField.data("default_val", field.DEFAULT_VALUE + "_" + new Date().getTime());
                } else {
                    inputField.data("default_val", field.DEFAULT_VALUE);
                }
            }

            //TODO: Add "required" field option.

            if (field.TITLE != null) {
                inputField.attr("title", field.TITLE);
                var tipButton = $('<a class="ui-icon-info ax-config-tooltip ui-btn-icon-notext ui-btn">Info</a>').css(
                    "display",
                    "inline-block"
                );

                tipButton.on("click", function(event) {
                    if (field.TYPE == "select") {
                        configWidget._toolTip(inputField.closest("div").find(".chosen-container"), field.TITLE);
                    } else {
                        configWidget._toolTip(inputField, field.TITLE);
                    }
                });
                return [inputField, tipButton];
            } else {
                return inputField;
            }
        },

        /** NEW STEP BUILDER */

        _createEditStepUI: function(stepType, stepData, ID) {
            //if stepholder == true then remove
            if ($("#ax_config_step_editor").length) {
                $("#ax_config_step_editor").remove();
            }
            var stepHolder = $('<div id="ax_config_step_editor"></div>');
            $(configWidget.options.new_step_edit_holder).append(stepHolder);

            stepHolder.prepend(configWidget._createCloseButton("steps"));

            //Register event listeners for displaying error messages.
            configWidget._registerStepSaveEvents();

            //TODO: Add Close button
            var header = $("<h2>Editing Step:</h2>").css({ padding: "10px" });
            stepHolder.append(header);
            //stepHolder.prepend(controls);
            var filter = $(
                '<input id="stepOptListFilter" data-type="search" data-wrapper-class="ui-btn controlgroup-textinput" placeholder="Search Settings" />'
            );
            stepHolder.append(filter);

            stepHolder.enhanceWithin();
            var list = $(
                '<ul id="stepOptList" data-role="listview" data-filter="true" data-filter-reveal="false" data-inset="true" data-input="#stepOptListFilter" style="border:none; -webkit-box-shadow: none; box-shadow:none;" />'
            );

            stepHolder.append(list);

            var currentGrouping = "";
            $.each(stepType, function(key, field) {
                if (key === "AVALILABLE_ENVS") {
                    return;
                }
                if (key === "FIELDS") {
                    // hack to keep the existing functionality in place.
                    var tempCopy = configWidget.options.field_list_holder;
                    configWidget.options.field_list_holder = ".fields-holder";
                    stepHolder.append($("<div/>").addClass("fields-holder"));
                    configWidget._initFieldList(stepData);

                    configWidget._refreshFieldListTable(configWidget.options.current_configuration, ID);
                    configWidget.options.field_list_holder = tempCopy;
                    return;
                }
                var id = "ax_step_" + key;
                var input = configWidget._createInputField(id, field);

                var inputHolder = configWidget._stepInputFieldHolder(id, field.DISPLAY).append(input);
                if (key === "CONTACT_TYPE") {
                    $(inputHolder)
                        .find("select")
                        .on("change", function() {
                            /* configWidget.options.alert_function(
                                "It is not reccommended to change this once fields have been set."
                            ); */

                            var inputField = $("#" + id);
                            var contactType = inputField.val();

                            var currentConfig = configWidget.options.current_configuration;

                            var enroller_steps = currentConfig.enroller_steps;
                            var currentStep = enroller_steps[ID];
                            if (currentStep.FIELDS) {
                                var updated = {};
                                $.each(currentStep.FIELDS, function(key, value) {
                                    updated[configWidget._renameField(key, contactType)] = value;
                                });

                                currentStep.FIELDS = updated;
                            }
                            if (currentStep.FIELD_ORDER) {
                                currentStep.FIELD_ORDER = currentStep.FIELD_ORDER.map(function(name) {
                                    return configWidget._renameField(name, contactType);
                                });
                            }
                            currentStep.CONTACT_TYPE = contactType;

                            enroller_steps[ID] = currentStep;
                            currentConfig.enroller_steps = enroller_steps;
                            configWidget.options.current_configuration = currentConfig;

                            $(".fields-holder").empty();
                            var tempCopy = configWidget.options.field_list_holder;
                            configWidget.options.field_list_holder = ".fields-holder";
                            configWidget._initFieldList(currentStep);

                            configWidget._refreshFieldListTable(configWidget.options.current_configuration, ID);

                            configWidget.options.field_list_holder = tempCopy;
                        });
                }
                // inputHolder.append(tipButton);
                var listElement = $(
                    '<li style="background:transparent; border:none; padding:0; white-space:normal; overflow:visible"></li>'
                );
                listElement.append(inputHolder);

                if (field.GROUPING != null) {
                    if (field.GROUPING !== currentGrouping) {
                        list.append(
                            $('<li data-role="list-divider" style="margin-top:.5em;">' + field.GROUPING + "</li>")
                        );
                        currentGrouping = field.GROUPING;
                    }
                    /*add hidden element to allow filtering on the grouping*/
                    listElement.append('<span style="display:none;">' + field.GROUPING + "</span>");
                }

                list.append(listElement);
                if (field.EDITABLE == false) {
                    listElement.hide();
                }

                if (stepData != null) {
                    var inputField = $("#" + id);
                    if (inputField.length) {
                        if (key === "STEP_ID") {
                            inputField.val(ID);
                        } else {
                            if (stepData[key] !== undefined) {
                                inputField.val(stepData[key]);
                                if (field.TYPE == "select") {
                                    inputField.val(configWidget._boolToString(field, stepData[key]));
                                }
                            } else {
                                var defaultVal = inputField.data("default_val");
                                if (defaultVal != null) {
                                    inputField.val(defaultVal);
                                    if (field.TYPE == "select") {
                                        inputField.val(configWidget._boolToString(field, defaultVal));
                                    }
                                } else {
                                    inputField.val("");
                                }
                                if (field.TYPE == "select") {
                                    inputField.trigger("chosen:updated"); //May be redundant as this is likely called before field is "chosenified"
                                }
                            }
                        }
                    }
                }
            });
            list.listview().listview("refresh");
            stepHolder.find("select").chosen({
                width: "400px"
            });

            configWidget._addSaveButtonState({ display: "Save Step", event: "save_step" });
            configWidget.element.off("save_step").on("save_step", function() {
                var step = configWidget.element.data("editing_step");
                configWidget._saveStep_New(ID); // Nav handled within save
            });

            configWidget._triggerEditorLoad(); // Is this needed here?
        },

        /**Stupidly complex true false converter for selects. */
        _boolToString: function(field, value) {
            var typesFound = [];
            if (field.VALUES != null) {
                $.each(field.VALUES, function(i, fieldVal) {
                    switch (fieldVal.VALUE) {
                        case 1:
                        case 0:
                        case "1":
                        case "0":
                            if (typesFound.indexOf("numeric") < 0) {
                                typesFound.push("numeric");
                            }
                            break;
                        case true:
                        case false:
                        case "true":
                        case "false":
                            if (typesFound.indexOf("bool") < 0) {
                                typesFound.push("bool");
                            }
                            break;
                        default:
                            if (typesFound.indexOf("string") < 0) {
                                typesFound.push("string");
                            }
                    }
                });
            }

            switch (value) {
                case "true":
                case true:
                case 1:
                case "1":
                    if (typesFound.indexOf("bool") > -1) {
                        value = "true";
                    } else if (typesFound.indexOf("numeric") > -1) {
                        value = "1";
                    }
                    break;
                case "false":
                case false:
                case 0:
                case "0":
                    if (typesFound.indexOf("bool") > -1) {
                        value = "false";
                    } else if (typesFound.indexOf("numeric") > -1) {
                        value = "0";
                    }
                    break;
                default:
                    value = value;
            }

            return value;
        },
        _registerStepSaveEvents: function() {
            configWidget.element
                .off("ax_config:step_config_minor_error")
                .on("ax_config:step_config_minor_error", function(event, payload) {
                    if ($("#tooltipPop").length) {
                        $("#tooltipPop").append("<p>" + payload.message + "</p>");
                    } else {
                        configWidget._toolTip(".ax-save-button", payload.message);
                    }
                });
            configWidget.element
                .off("ax_config:step_config_error")
                .on("ax_config:step_config_error", function(event, payload) {
                    if ($("#tooltipPop").length) {
                        $("#tooltipPop").append("<p>" + payload.message + "</p>");
                    } else {
                        configWidget._toolTip(".ax-save-button", payload.message);
                    }
                });
        },

        _saveStep_New: function(originalID) {
            //TODO:

            /**
             * 2 options:
             *
             * 1 > Look at every field on the page and update.
             *
             * 2 Switch statement on type.
             *
             * likely that the course to give the best results would be to look at the ID and Type fields, then use switch to go through.
             * That way if somehow the step type got changed then you could pull in the defaults instead. Allow easier step type switching...
             *
             *
             */

            if ($("#ax_config_step_editor").length) {
                var idPrefix = "ax_step_";
                var type = $("#" + idPrefix + "TYPE").val();
                var id = $("#" + idPrefix + "STEP_ID").val();

                //TODO: build a set of step options here. Check for "required fields"

                if (!id) {
                    configWidget.element.trigger("ax_config:step_config_error", {
                        message: "A step ID must be set"
                    });
                    return;
                }
                if (!type) {
                    configWidget.element.trigger("ax_config:step_config_error", {
                        message: "Step type could not be identified, step is invalid."
                    });
                    return;
                }

                var fieldList = null;

                var config = {};

                /**Set Type fields here, and potentially set the fields/other things needed for specific steps*/

                switch (type) {
                    case "portfolio":
                        fieldList = configWidget.PORTFOLIO_STEP_FIELDS;
                        break;
                    case "address":
                        fieldList = configWidget.ADDRESS_STEP_FIELDS;
                        break;
                    case "contact-update":
                        fieldList = configWidget.CONTACT_UPDATE_STEP_FIELDS;
                        break;
                    case "contact-note":
                        fieldList = configWidget.CONTACT_NOTE_STEP_FIELDS;
                        break;

                    default:
                        break;
                }

                var continueToSave = true;
                $.each(fieldList, function(key, field) {
                    if (key === "FIELDS") {
                        var fieldsList = configWidget._getFieldsList(originalID, config.TYPE);
                        if (fieldsList != null) {
                            config.FIELDS = fieldsList;
                        }
                        if (configWidget.options.current_configuration.enroller_steps[originalID].FIELD_ORDER != null) {
                            config.FIELD_ORDER =
                                configWidget.options.current_configuration.enroller_steps[originalID].FIELD_ORDER;
                        }
                    } else if (key === "FIELD_ORDER") {
                        if (configWidget.options.current_configuration.enroller_steps[originalID].FIELD_ORDER != null) {
                            config.FIELD_ORDER =
                                configWidget.options.current_configuration.enroller_steps[originalID].FIELD_ORDER;
                        }
                    } else if ($("#" + idPrefix + key).length) {
                        var inputValue = $("#" + idPrefix + key).val();

                        // Should do a null check here.
                        if ((inputValue == null || inputValue === "") && field.REQUIRED) {
                            configWidget.element.trigger("ax_config:step_config_error", {
                                key: key,
                                message: "No value for " + key + " found. A value must be specified"
                            });
                            continueToSave = false;
                        }
                        config[key] = inputValue;
                        if (configWidget.checkBoolean(config[key]) != null) {
                            config[key] = configWidget.checkBoolean(config[key]);
                        }
                    } else {
                        if (field.DEFAULT_VALUE !== undefined) {
                            config[key] = field.DEFAULT_VALUE;
                            configWidget.element.trigger("ax_config:step_config_minor_error", {
                                key: key,
                                message: "No field for " + key + " found, set default in place"
                            });
                            if (configWidget.checkBoolean(config[key]) != null) {
                                config[key] = configWidget.checkBoolean(config[key]);
                            }
                        } else {
                            configWidget.element.trigger("ax_config:step_config_error", {
                                key: key,
                                message: "No field for " + key + " found, no default available"
                            });
                            continueToSave = false;
                        }
                    }
                });

                if (continueToSave) {
                    var validity = configWidget.checkValidity(config);
                    if (!validity.valid) {
                        continueToSave = validity.valid;
                        configWidget.element.trigger("ax_config:step_config_error", {
                            message: validity.message
                        });
                    }
                }

                //TODO Custom validation check for step. Pass config generated above and validate if it is in fact valid.

                if (continueToSave) {
                    if (id !== originalID) {
                        configWidget.options.current_configuration.enroller_steps[id] = config;
                        try {
                            delete configWidget.options.current_configuration.enroller_steps[originalID];
                        } catch (error) {}
                        var stepIndex = configWidget.options.current_configuration.step_order.indexOf(originalID);
                        if (stepIndex > 0) {
                            configWidget.options.current_configuration.step_order[stepIndex] = id;
                        }
                    } else {
                        configWidget.options.current_configuration.enroller_steps[id] = config;
                    }
                    /* Refresh the step table*/
                    var currentConfig = configWidget.options.current_configuration;
                    configWidget._refreshStepTable(currentConfig);
                    configWidget._menuNavigationBack(); // return to step list.
                }
            } else {
                //STOP CALLING SAVE WITHOUT ANY STEP TO SAVE!!!!!
            }
        },

        checkValidity: function(config) {
            var valid = true;
            var message = "Invalid";
            switch (config.TYPE) {
                case "portfolio":
                    var isCricos = configWidget.checkBoolean(config.ISCRICOS);
                    if (config.PORTFOLIOCHECKLISTID == "" && isCricos != true) {
                        valid = false;
                        message = "Either a portfolio checklist ID or the CRICOS setting must be set.";
                    }
                    break;
                default:
                    valid = true;
            }
            return { valid: valid, message: message };
        },

        /**
         * Check for one of the expected boolean values to convert strings etc to bool;
         */
        checkBoolean: function(value) {
            var bool = null;
            switch (value) {
                case "true":
                case true:
                case 1:
                case "1":
                    bool = true;
                    break;
                case "false":
                case false:
                case 0:
                case "0":
                    bool = false;
                    break;
                default:
                    bool = null;
            }
            return bool;
        },

        _createControls: function(area, stepConfig) {
            var naming = "";
            if (area == "steps") {
                naming = "Step";
            } else if (area == "fields") {
                naming = "Field";
            } else if (area == "field_values") {
                naming = "Value";
            } else if (area == "field_events") {
                naming = "Event";
            } else if (area == "field_trigger") {
                naming = "Trigger";
            } else if (area == "general") {
                naming = "General Setting";
            }

            var controls = $('<div class="ax-config-controls" />');
            controls.addClass(area);
            if (area == "general") {
                controls.append(
                    $('<a class="ui-btn edit ui-icon-eye ui-btn-icon-right ax-show-hide" >Show all ' + naming + "s</a>")
                );
            } /*
            else {
                controls.append(
                    $(
                        '<a class="ui-btn ax-link edit ui-icon-eye ui-btn-icon-right ax-show-hide" >Hide ' +
                            naming +
                            "s</a>"
                    )
                );
            }
            
            */
            if (area != "general") {
                controls.append(
                    $('<a class="ui-btn add ui-icon-plus ui-btn-icon-right ax-add-new" >Add New ' + naming + "</a>")
                );

                controls.find(".ax-add-new").on("click", function() {
                    if (area == "steps") {
                        configWidget._createAddStepUI();
                        configWidget.element.find(".ax-step-content").remove();
                    } else if (area == "fields") {
                        configWidget._createAddFieldUI(stepConfig);
                        configWidget.element.find(".ax-step-fieldedit").remove();
                    } else if (area == "field_values") {
                        configWidget._createAddFieldVUI();
                        configWidget._toggleFieldVList(true);
                    } else if (area == "field_events") {
                        configWidget._createAddFieldEUI();
                        configWidget._toggleFieldEList(true);
                    } else if (area == "field_trigger") {
                        configWidget._createAddFieldTUI();
                        configWidget._toggleFieldTList(true);
                    }
                });
            }

            controls.find("a").css("display", "inline-block");

            controls.find(".ax-show-hide").on("click", function() {
                if (area == "steps") {
                    configWidget._toggleStepsList();
                } else if (area == "fields") {
                    configWidget._toggleFieldsList();
                } else if (area == "field_values") {
                    configWidget._toggleFieldVList();
                } else if (area == "field_events") {
                    configWidget._toggleFieldEList();
                } else if (area == "field_trigger") {
                    configWidget._toggleFieldTList();
                } else if (area == "general") {
                    configWidget._toggleGeneralSettings();
                }
            });

            if (area == "steps") {
                var saveConfig = $(
                    '<a class="ui-btn edit ui-icon-check ui-btn-icon-right ax-export-settings" >Save Config</a>'
                );
                /* configWidget.element.append(
                    $('<div class="ax-invisible-label"></div>'),
                    
                );
               */
                configWidget.element.find("#config_widget_top_menu .ax-config-close").before(saveConfig);

                saveConfig.on("click", function() {
                    if (!saveConfig.hasClass("ui-disabled")) {
                        if (configWidget.options.save_configuration != null) {
                            configWidget._updateConfigGeneralSettings();

                            configWidget.options.save_configuration(
                                configWidget.options.config_id,
                                configWidget.options.current_configuration,
                                function(success) {
                                    if (success) {
                                        // configWidget.alert_function('Saved
                                        // Successfully');
                                    }
                                }
                            );
                        }
                    }
                });
            }

            return controls;
        },
        _createCloseButton: function(area) {
            var naming = "";
            if (area == "steps") {
                naming = "Step";
            } else if (area == "fields") {
                naming = "Field";
            } else if (area == "field_values") {
                naming = "Value";
            } else if (area == "field_events") {
                naming = "Events";
            } else if (area == "general") {
                naming = "General Setting";
            } else if (area == "field_trigger") {
                naming = "Trigger";
            }
            var closeButton = $(
                '<a class="ui-btn ui-btn-mini ui-btn-icon-notext ui-icon-delete ax-config-close">Close' +
                    naming +
                    "</a>"
            );
            closeButton.css("float", "right");
            closeButton.addClass(area);

            closeButton.on("click", function() {
                configWidget._menuNavigationBack();
                if (area == "steps") {
                    $(".ax-step-content").remove();
                    configWidget._toggleStepsList();
                } else if (area == "fields") {
                    configWidget._toggleFieldsList();
                    $(".ax-step-fieldedit").remove();
                } else if (area == "field_values") {
                    $(".ax-step-field-v-edit").remove();
                    configWidget._toggleFieldVList();
                } else if (area == "field_events") {
                    $(".ax-step-field-event-edit").remove();
                    configWidget._toggleFieldEList();
                } else if (area == "field_trigger") {
                    $(".ax-step-field-trigger-edit").remove();
                    configWidget._toggleFieldTList();
                } else if (area == "general") {
                    configWidget._toggleGeneralSettings();
                }
            });
            return closeButton;
        },

        _createAddStepUI: function() {
            if ($(".ax-new-step #ax_select_step").length) {
                $(".ax-new-step #ax_select_step")
                    .closest(".ax-new-step")
                    .remove();
            }
            var stepUI = $('<div class="ax-new-step" />');
            var selectStep = $('<select id="ax_select_step" />');
            stepUI.append(
                configWidget._stepInputFieldHolder("ax_select_step", "Select a Step Type").append(selectStep)
            );
            // addNew.css('display', 'inline-block');
            var availableSteps = configWidget._getUnusedSteps();
            stepUI
                .find(".ax-select-step")
                .append(
                    $('<a id="ax_add_step" class="ui-btn ui-btn-icon-notext ui-icon-plus">Add Field</a>').css(
                        "display",
                        "inline-block"
                    )
                );

            /* Add the other step types */
            availableSteps["contact-update"] = {
                DISPLAY: "Contact Update",
                TYPE: "contact-update",
                FIELDS: {}
            };
            /* availableSteps["custom-step"] = {
                DISPLAY: "Custom Step",
                TYPE: "custom-step",
                FIELDS: {},
                updateFunction: ""
            }; */
            availableSteps["contact-note"] = {
                DISPLAY: "Contact Note",
                TYPE: "contact-note",
                FIELDS: {},
                noteCodeID: 88,
                emailTo: ""
            };

        
            availableSteps["portfolio"] = {
                DISPLAY: "Portfolio",
                TYPE: "portfolio",
                ISCRICOS: false,
                PORTFOLIOCHECKLISTID: "",
                portfolio_optional: false
            };

            if (availableSteps != null) {
                $.each(availableSteps, function(key, value) {
                    var description = configWidget.STEP_TYPES[value.TYPE].DESCRIPTION;
                    var toolTip = configWidget.STEP_TYPES[value.TYPE].TITLE;
                    selectStep.append(
                        '<option value="' + key + '" title="' + toolTip + '">' + description + "</option>"
                    );
                });
            } else {
                $(".ax-select-field").remove();
            }
            stepUI.insertAfter($(".ax-config-controls.steps"));

            stepUI.find("#ax_add_step").on("click", function() {
                var stepID = selectStep.val();
                /* enforce unique IDs */
                var stepConfig = availableSteps[stepID];
                if (
                    stepID == "contact-update" ||
                    stepID == "custom-step" ||
                    stepID == "contact-note" ||
                    stepID == "portfolio"|| stepID == 'contact_address'
                ) {
                    stepID = "step_" + new Date().getTime();
                }
                var currentConfig = configWidget.options.current_configuration;
                currentConfig.enroller_steps[stepID] = stepConfig;
                currentConfig.step_order.push(stepID);
                configWidget._refreshStepTable(currentConfig);

                if ($(".ax-new-step #ax_select_step").length) {
                    $(".ax-new-step #ax_select_step")
                        .closest(".ax-new-step")
                        .remove();
                }
                $(".ax-step-content").remove();
            });

            stepUI.find("select").chosen({
                disable_search_threshold: 10,
                width: "400px"
            });
        },
        _toggleStepsList: function(hide) {
            return;
        },
        _toggleFieldsList: function(hide) {
            return;
        },
        _toggleFieldVList: function(hide) {
            return;
        },
        _toggleFieldEList: function(hide) {
            return;
        },

        _toggleFieldTList: function(hide) {
            return;
        },

        _hideNonActive: function() {
            configWidget.element.find("#config_widget_holder > div").hide();
        },
        _showNonActive: function() {
            configWidget.element.find("#config_widget_holder > div").show();
        },
        _toggleGeneralSettings: function(visible) {
            var button = $(".ax-config-controls.general a.ax-show-hide");
            var list = $("#optList");
            var currentFilter = list.filterable("option", "filterReveal");
            //TODO: SWITCH THIS TO HIDE/SHOW ALL
            if (visible == true) {
                //$(".ax-config-general").show();

                list.filterable("option", "filterReveal", false);
                list.listview().listview("refresh");
                button.text("Hide all General Settings");
            } else if (visible === false) {
                //$(".ax-config-general").show();

                list.filterable("option", "filterReveal", true);
                list.listview().listview("refresh");
                button.text("Show all General Settings");
            } else if (!currentFilter) {
                //$(".ax-config-general:visible").length || visible == false
                //$(".ax-config-general").hide();
                list.filterable("option", "filterReveal", true);
                list.listview().listview("refresh");
                button.text("Show all General Settings");
            } else {
                //$(".ax-config-general").show();
                list.filterable("option", "filterReveal", false);
                list.listview().listview("refresh");
                button.text("Hide all General Settings");
            }
        },

        _validateStepOrder: function(configuration) {
            var newConfig = $.extend(true, {}, configuration);
            var removeSteps = [];
            for (var index = 0; index < newConfig.step_order.length; index++) {
                var stepID = newConfig.step_order[index];
                if (newConfig.enroller_steps[stepID] == null) {
                    removeSteps.push(stepID);
                }
            }
            if (removeSteps.length) {
                var newStepOrder = [].concat(newConfig.step_order);
                for (var index = 0; index < removeSteps.length; index++) {
                    var stepID = removeSteps[index];
                    var i = newStepOrder.indexOf(stepID);
                    newStepOrder.splice(i, 1);
                }
                newConfig.step_order = newStepOrder;
            }
            return newConfig;
        },

        /*
         * Convert a standard configuration object into
         * something readable by the data table creation. @param
         * {object} configuration - a Enroller Widget
         * configuration
         */
        _createStepDTConfigSet: function(configuration) {
            var dataTableSteps = [];

            if (configuration.step_order != null) {
                $.each(configuration.step_order, function(i, step) {
                    var tableStep = {
                        POSITION: i + 1,
                        DISPLAY: configuration.enroller_steps[step].DISPLAY,
                        TYPE: configuration.enroller_steps[step].TYPE,
                        ACTION:
                            '<div><a class="ax-step-action ax-step-action-edit">Edit</a><a class="ax-step-action ax-step-action-delete">Delete</a></div>',
                        ID: step
                    };
                    dataTableSteps.push(tableStep);
                });
            }
            return dataTableSteps;
        },

        /*
         * Creates the stepTable, defining the columns and
         * attaching any events. @param {object} stepTable - The
         * jQuery object/element the stepTable is to be attached
         * to.
         */
        _initStepTable: function(stepTable) {
            stepTable = $(stepTable);
            var columns = [
                {
                    title: "Order",
                    data: "POSITION",
                    className: "reorder"
                },
                {
                    title: "Name",
                    data: "DISPLAY"
                },
                {
                    title: "Type",
                    data: "TYPE"
                },
                {
                    title: "Action",
                    data: "ACTION"
                }
            ];
            var data = [];

            stepTable
                .DataTable({
                    data: data,
                    columns: columns,
                    searching: false,
                    paging: false,
                    columnDefs: [
                        {
                            orderable: false,
                            targets: [1, 2, 3]
                        }
                    ],
                    info: false,
                    compact: true,
                    rowReorder: {
                        dataSrc: "POSITION"
                    }
                })
                .on("row-reordered", function(e) {
                    var stepOrder = configWidget._getDTOrder("step");
                    var currentConfig = configWidget.options.current_configuration;
                    currentConfig.step_order = stepOrder;
                    configWidget._refreshStepTable(currentConfig);
                });
        },
        /*
         * Clears and updates the datatable with the current
         * configuration @param {object} configuration - The
         * configuration to load.
         */
        _refreshStepTable: function(configuration) {
            var stepTable = configWidget.element.find(".ax-step-table").DataTable();
            configuration = configWidget._validateStepOrder(configuration);
            configWidget.options.current_configuration = configuration;

            var dataTableSteps = configWidget._createStepDTConfigSet(configuration);
            stepTable
                .clear()
                .rows.add(dataTableSteps)
                .draw();
            if (configWidget.options.ax_ui) {
            } else {
                $(".ax-step-action").addClass("ui-btn ui-mini ui-btn-icon-right ui-btn-icon-notext");
                $(".ax-step-action-edit").addClass("ui-icon-edit");
                $(".ax-step-action-delete").addClass("ui-icon-delete");
                $(".ax-step-action").css({
                    display: "inline-block",
                    overflow: "inherit"
                });

                configWidget.element.find(".ax-step-table").off("click", ".ax-step-action-delete");
                configWidget.element.find(".ax-step-table").off("click", ".ax-step-action-edit");

                configWidget.element.find(".ax-step-table").on("click", ".ax-step-action-edit", function(e) {
                    if ($(".ax-step-content").length) {
                        $(".ax-step-content").remove();
                    }
                    var selectedStep = stepTable.row($(this).closest("tr")).data();

                    switch (selectedStep.TYPE) {
                        case "portfolio":
                        case "address":
                        case "contact-update":
                        case "contact-note":
                            configWidget._loadNewStepEditor(selectedStep);
                            break;
                        default:
                            configWidget._loadStepEditor($("#config_widget_holder"), selectedStep);
                            break;
                    }
                });
                configWidget.element.find(".ax-step-table").on("click", ".ax-step-action-delete", function(e) {
                    var selectedStep = stepTable.row($(this).closest("tr")).data();
                    configWidget._deleteStep(selectedStep.ID);
                });
            }
        },

        _loadNewStepEditor: function(selectedStep) {
            configWidget.element.data("editing_step", selectedStep.ID);

            switch (selectedStep.TYPE) {
                case "portfolio":
                    configWidget._createEditStepUI(
                        configWidget.PORTFOLIO_STEP_FIELDS,
                        configWidget.options.current_configuration.enroller_steps[selectedStep.ID],
                        selectedStep.ID
                    );
                    break;
                case "address":
                    configWidget._createEditStepUI(
                        configWidget.ADDRESS_STEP_FIELDS,
                        configWidget.options.current_configuration.enroller_steps[selectedStep.ID],
                        selectedStep.ID
                    );
                    break;
                case "contact-update":
                    configWidget._createEditStepUI(
                        configWidget.CONTACT_UPDATE_STEP_FIELDS,
                        configWidget.options.current_configuration.enroller_steps[selectedStep.ID],
                        selectedStep.ID
                    );
                    break;
                case "contact-note":
                    configWidget._createEditStepUI(
                        configWidget.CONTACT_NOTE_STEP_FIELDS,
                        configWidget.options.current_configuration.enroller_steps[selectedStep.ID],
                        selectedStep.ID
                    );
                    break;
                default:
                    console.log(selectedStep);
            }

            configWidget._menuAddNavigation({
                stateLabel: selectedStep.DISPLAY,
                stateID: selectedStep.ID,
                selector: "#ax_config_step_editor"
            });
        },

        _loadStepEditor: function(location, selectedStep) {
            configWidget._menuAddNavigation({
                stateLabel: selectedStep.DISPLAY,
                stateID: selectedStep.ID,
                selector: ".ax-step-content"
            });

            var stepContent = $('<div class="ax-step-content"></div>');
            $(location).append(stepContent);

            configWidget._clearStepValues();

            configWidget._getStepDetails(selectedStep.ID);

            configWidget._toggleStepsList(true);
            configWidget._initFieldList(selectedStep);

            configWidget._refreshFieldListTable(configWidget.options.current_configuration, selectedStep.ID);

            /*
             * set the step being edited -
             * for use in field
             * reordering / updating
             */
            configWidget.element.data("editing_step", selectedStep.ID);
            configWidget.element.find(".ax-new-step").remove();
        },

        /*
         * Removes a step from the configuration, and triggers
         * UI updates. @param {string} step - the ID of a step
         * to be removed.
         */
        _deleteStep: function(step) {
            /* add dialog confirm here if needed */

            var stepIndex = configWidget.options.current_configuration.step_order.indexOf(step);
            configWidget.options.current_configuration.step_order.splice(stepIndex, 1);
            delete configWidget.options.current_configuration.enroller_steps[step];

            configWidget.options.current_configuration = configWidget._validateStepOrder(
                configWidget.options.current_configuration
            );

            configWidget._refreshStepTable(configWidget.options.current_configuration);
        },

        /*
         * Gets the current order of steps in the table and
         * returns it. Uses the Position column in the datatable
         * for ordering.
         */
        _getDTOrder: function(type) {
            var dataTable;
            if (type == "step") {
                dataTable = configWidget.element.find(".ax-step-table").DataTable();
            } else {
                dataTable = configWidget.element.find(".ax-field-table").DataTable();
            }

            var records = dataTable.data();
            records.sort(function(a, b) {
                return a.POSITION - b.POSITION;
            });
            var recordOrder = [];
            $.each(records, function(i, record) {
                recordOrder.push(record.ID);
            });
            return recordOrder;
        },

        _getFieldOrder: function() {
            var stepTable = configWidget.element.find(".ax-field-table").DataTable();

            var steps = stepTable.data();
            steps.sort(function(a, b) {
                return a.POSITION - b.POSITION;
            });
            var stepOrder = [];
            $.each(steps, function(i, step) {
                stepOrder.push(step.ID);
            });
            return stepOrder;
        },

        _initFieldList: function(stepConfig) {
            var controls = configWidget._createControls("fields", stepConfig);
            var fieldTable = $('<table class=" ax-field-table" />');
            $(configWidget.options.field_list_holder)
                .append(controls)
                .append(fieldTable);
            // TODO: fix/remove
            $(configWidget.options.field_list_holder)
                .find("div.ax-step-input-holder.ax-save-step")
                .insertAfter(fieldTable);
            var columns = [
                {
                    title: "Order",
                    data: "POSITION",
                    className: "reorder"
                },
                {
                    title: "Name",
                    data: "DISPLAY"
                },
                {
                    title: "Type",
                    data: "TYPE"
                },
                {
                    title: "Required",
                    data: "REQUIRED"
                },
                {
                    title: "Action",
                    data: "ACTION"
                }
            ];
            var data = [];

            fieldTable = fieldTable
                .DataTable({
                    data: data,
                    columns: columns,
                    searching: false,
                    paging: false,
                    columnDefs: [
                        {
                            orderable: false,
                            targets: [1, 2, 3, 4]
                        }
                    ],
                    info: false,
                    compact: true,
                    rowReorder: {
                        dataSrc: "POSITION"
                    }
                })
                .on("row-reordered", function(e) {
                    var fieldOrder = configWidget._getDTOrder("field");
                    var currentStep = configWidget.element.data("editing_step");
                    configWidget._updateFieldConfiguration(fieldOrder, currentStep);
                });
        },

        /*
         * Convert a standard configuration object into
         * something readable by the data table creation. @param
         * {object} configuration - a Enroller Widget
         * configuration
         */
        _createFieldListDTConfigSet: function(configuration, step) {
            var dataTableSteps = [];
            if (configuration.enroller_steps[step] != null) {
                if (configuration.enroller_steps[step].FIELDS != null) {
                    var position = 0;
                    $.each(configuration.enroller_steps[step].FIELDS, function(fieldKey, fieldDetail) {
                        var required = fieldDetail.REQUIRED;
                        if (required == null) {
                            required = false;
                        }
                        position = position + 1;
                        var tableField = {
                            POSITION: position,
                            DISPLAY: fieldDetail.DISPLAY,
                            TYPE: fieldDetail.TYPE,
                            REQUIRED: required,
                            ACTION:
                                '<div><a class="ax-field-action ax-field-action-edit">Edit</a><a class="ax-field-action ax-field-action-delete">Delete</a></div>',
                            ID: fieldKey
                        };

                        dataTableSteps.push(tableField);
                    });
                } else {
                    return null;
                }
            }
            return dataTableSteps;
        },
        /*
         * Clears and updates the datatable with the current
         * configuration @param {object} configuration - The
         * configuration to load. @param {object} step - The
         * step to load.
         */
        _refreshFieldListTable: function(configuration, step) {
            var fieldTable = configWidget.element.find(".ax-field-table").DataTable();
            var dataTableFields = configWidget._createFieldListDTConfigSet(configuration, step);

            if (dataTableFields != null) {
                fieldTable
                    .clear()
                    .rows.add(dataTableFields)
                    .draw();

                /*update FIELD_ORDER*/
                var fieldOrder = configWidget._getDTOrder("field");
                configWidget.options.current_configuration.enroller_steps[step].FIELD_ORDER = fieldOrder;

                if (
                    configWidget.element
                        .find(".ax-field-table")
                        .closest(".dataTables_wrapper")
                        .is(":visible")
                ) {
                    $(".fields .ax-show-hide").text("Hide Fields");
                } else {
                    configWidget._toggleFieldsList();
                }
                $(".ax-config-controls.fields").show();
                if (configWidget.options.ax_ui) {
                } else {
                    $(".ax-field-action").addClass("ui-btn ui-mini ui-btn-icon-right ui-btn-icon-notext");
                    $(".ax-field-action-edit").addClass("ui-icon-edit");
                    $(".ax-field-action-delete").addClass("ui-icon-delete");
                    $(".ax-field-action").css({
                        display: "inline-block",
                        overflow: "inherit"
                    });

                    configWidget.element.find(".ax-field-table").off("click", ".ax-field-action-edit");
                    configWidget.element.find(".ax-field-table").off("click", ".ax-field-action-delete");

                    configWidget.element.find(".ax-field-table").on("click", ".ax-field-action-edit", function(e) {
                        var selectedField = fieldTable.row($(this).closest("tr")).data();
                        configWidget._getFieldDetails(step, selectedField.ID);

                        configWidget._toggleFieldsList(true);
                    });

                    configWidget.element.find(".ax-field-table").on("click", ".ax-field-action-delete", function(e) {
                        var selectedField = fieldTable.row($(this).closest("tr")).data();
                        configWidget._deleteField(step, selectedField.ID);
                    });
                }
            } else {
                fieldTable.clear();
                configWidget.element
                    .find(".ax-field-table")
                    .closest(".dataTables_wrapper")
                    .hide();
                /*
                 * check to see if any fields should be allowed.
                 * Note, explicitly checks for undefined and not
                 * null.
                 */
                if (configuration.enroller_steps[step].FIELDS === undefined) {
                    $(".ax-config-controls.fields").hide();
                }
            }
        },

        /*
         * Removes a field from the configuration, and triggers
         * UI updates. @param {string} step - the ID of a step
         * containing the field to be removed. @param {string}
         * field - the ID of the field to be removed.
         */
        _deleteField: function(step, field) {
            /* add dialog confirm here if needed */

            delete configWidget.options.current_configuration.enroller_steps[step].FIELDS[field];

            configWidget._refreshStepTable(configWidget.options.current_configuration);
            configWidget._refreshFieldListTable(configWidget.options.current_configuration, step);
        },

        _getFieldDetails: function(step, fieldID) {
            var configuration = configWidget.options.current_configuration;

            if (configuration == null) {
                configuration = {};
            }
            var stepConfig = configuration.enroller_steps[step];
            var contactType = "student";
            if (stepConfig && stepConfig.CONTACT_TYPE) {
                contactType = stepConfig.CONTACT_TYPE;
            }
            var fieldConfig = configuration.enroller_steps[step].FIELDS[fieldID];
            fieldConfig.ID = fieldID;
            configWidget._fieldEditor(fieldConfig, contactType);
        },

        _updateFieldConfiguration: function(fieldOrder, step) {
            /*
             * referencing objects, not copying them, but
             * written this way for clarity
             */
            var fieldConfig = configWidget.options.current_configuration.enroller_steps[step].FIELDS;
            var newConfig = {};
            $.each(fieldOrder, function(i, field) {
                newConfig[field] = fieldConfig[field];
            });
            configWidget.options.current_configuration.enroller_steps[step].FIELDS = newConfig;
            configWidget.options.current_configuration.enroller_steps[step].FIELD_ORDER = fieldOrder;

            /*
             * won't change values as it is already set, but
             * will trigger the refresh functions
             */
            configWidget._refreshStepTable(configWidget.options.current_configuration);
            configWidget._refreshFieldListTable(configWidget.options.current_configuration, step);
        },

        _createAddFieldUI: function(stepConfig) {
            var contactType = "student";
            if (stepConfig && stepConfig.CONTACT_TYPE) {
                contactType = stepConfig.CONTACT_TYPE;
            }
            if ($(".ax-new-field").length) {
                $(".ax-new-field").remove();
            }
            var fieldUI = $('<div class="ax-new-field" />');

            var selectField = $('<select id="ax_select_field" />');
            fieldUI.append(
                configWidget._stepInputFieldHolder("ax_select_field", "Select a Default Field").append(selectField)
            );

            var addNew = $('<a id="ax_add_custom_field" class="ui-btn ui-btn-icon-right ui-icon-plus">Add Custom</a>');
            fieldUI.append(
                configWidget._stepInputFieldHolder("ax_add_custom_field", "Add Custom Field").append(addNew)
            );

            var availableFields = configWidget._getUnusedFields(contactType);

            var addField = $('<a id="ax_add_existing" class="ui-btn ui-btn-icon-notext ui-icon-plus">Add Field</a>');
            addField.css("display", "inline-block");
            fieldUI.find(".ax-select-field").append(addField);
            if (availableFields != null) {
                $.each(availableFields, function(key, value) {
                    selectField.append('<option value="' + key + '">' + value.DISPLAY + "</option>");
                });
            } else {
                $(".ax-select-field").remove();
            }

            fieldUI.insertAfter($(".ax-config-controls.fields"));
            selectField.chosen({ width: "400px" });
            $("#ax_add_existing").on("click", function() {
                var step = configWidget.element.data("editing_step");
                var selected = selectField.val();
                if (selected != null && selected != "") {
                    configWidget.options.current_configuration.enroller_steps[step].FIELDS[selected] =
                        availableFields[selected];

                    configWidget._refreshFieldListTable(configWidget.options.current_configuration, step);
                    fieldUI.remove();
                }
            });
            addNew.on("click", function() {
                fieldUI.remove();
                configWidget._toggleFieldsList(true);
                configWidget._createCustomFieldUI(contactType);
            });

            fieldUI.find("select").chosen({
                disable_search_threshold: 10,
                width: "400px"
            });
        },

        /*
         * Displays UI component to create a Custom Field
         * (define variable ID, display and type);
         */
        _createCustomFieldUI: function(contactType) {
            var customField = {
                ID: contactType !== "student" ? contactType + "_" + "ReplaceWithID" : "ReplaceWithID",
                TYPE: "text",
                DISPLAY: "NewCustomField",
                CUSTOM: true
            };
            configWidget._fieldEditor(customField, contactType);
        },

        FIELD_INPUTS: {
            ID: {
                TYPE: "text",
                TITLE:
                    "The internal ID of the field, for custom fields to populate with content from aXcelerate ensure they are in all caps.",
                DISPLAY: "Field ID",
                REQUIRED: true
            },
            DISPLAY: {
                TYPE: "text",
                TITLE: "The Name/Label of the field.",
                DISPLAY: "Display Name",
                REQUIRED: true
            },
            REQUIRED: {
                TYPE: "select",
                TITLE:
                    "Determines if the field is required to be completed before enrolment becomes available for the student",
                DISPLAY: "Required Field",
                VALUES: [
                    {
                        DISPLAY: "Required",
                        VALUE: 1
                    },
                    {
                        DISPLAY: "Not Required",
                        VALUE: 0
                    }
                ]
            },
            TITLE: {
                TYPE: "textarea",
                TITLE: "Displayed to the user when content in a required field is invalid.",
                DISPLAY: "Field Title"
            },
            TOOLTIP: {
                TYPE: "textarea",
                TITLE: "Adds a tooltip to the field to provide more information to the student.",
                DISPLAY: "Field ToolTip"
            },
            PATTERN: {
                TYPE: "text",
                TITLE: "A Regular expression for checking validity of content.",
                DISPLAY: "RE Pattern"
            },
            MAXLENGTH: {
                TYPE: "text",
                TITLE: "The maximum length of the field",
                DISPLAY: "Max Length"
            },
            INFO_ONLY: {
                TYPE: "select",
                TITLE: "This field will not be sent through the API to aXcelerate, it is only for display purposes.",
                DISPLAY: "Info / Data Field",
                VALUES: [
                    {
                        DISPLAY: "Info Only",
                        VALUE: 1
                    },
                    {
                        DISPLAY: "Data Field",
                        VALUE: 0
                    }
                ]
            },
            HIDE_INITIALLY: {
                TYPE: "select",
                TITLE: "Hide field on load (must be set to visible through events)",
                DISPLAY: "Hide Initially",
                VALUES: [
                    {
                        DISPLAY: "Visible",
                        VALUE: "visible"
                    },
                    {
                        DISPLAY: "Hidden",
                        VALUE: "hidden"
                    }
                ]
            }
        },

        /*
         * Create/initialise field editor for an input field
         * @param {object} field - input field configuration.
         */
        _fieldEditor: function(field, contactType) {
            if (field == null) {
                field = {};
            }
            configWidget._menuAddNavigation({
                stateLabel: field.DISPLAY,
                stateID: field.ID,
                selector: ".ax-step-fieldedit"
            });

            var stepHolder = $(configWidget.options.field_edit_holder);

            configWidget.element.data("editing_field", field);

            if (stepHolder.find(".ax-step-fieldedit").length) {
                stepHolder.find(".ax-step-fieldedit").remove();
            }
            var fieldEditorDiv = $('<div class="ax-step-fieldedit"><h2>Edit Field:</h2></div>');
            stepHolder.append(fieldEditorDiv);
            fieldEditorDiv.prepend(configWidget._createCloseButton("fields"));

            $.each(configWidget.FIELD_INPUTS, function(key, inputField) {
                var id = "ax_field_" + key.toLowerCase();
                var input = configWidget._createInputField(id, inputField);
                var inputHolder = configWidget._stepInputFieldHolder(id, inputField.DISPLAY).append(input);
                if (field[key] != null) {
                    if (inputField.TYPE == "select") {
                        var fieldVal = field[key];
                        if (fieldVal == true) {
                            fieldVal = 1;
                        } else if (fieldVal == false) {
                            fieldVal = 0;
                        }
                        inputHolder
                            .find("select")
                            .val(fieldVal)
                            .trigger("chosen:updated");
                    } else if (inputField.TYPE == "textarea") {
                        inputHolder.find("textarea").val(field[key]);
                    } else {
                        inputHolder.find("input").val(field[key]);
                    }
                } else if (inputField.TYPE == "select") {
                    /* SETS SELECT FIELDS TO DEFAULT TO FALSE.
                     * NOTE IF AN ADDITIONAL SELECT FIELD IS ADDED THIS WILL NEED TO CHANGE*/
                    inputHolder
                        .find("select")
                        .val(0)
                        .trigger("chosen:updated");
                }

                if (key == "ID") {
                    inputHolder.find("input").data("org_id", field.ID);
                    if (field.CUSTOM != null) {
                        inputHolder.find("input").data("custom_field", field.CUSTOM);
                    }
                }

                fieldEditorDiv.append(inputHolder);
            });

            var fieldType = $('<select id="ax_field_type" placeholder="Type" />');
            fieldType.attr("data-role", "none");
            fieldType.attr("data-enhance", "false");
            $.each(configWidget.FIELD_TYPES, function(i, inputType) {
                if (field.CUSTOM && inputType.CUSTOM_AVAILABLE) {
                    fieldType.append('<option value="' + inputType.TYPE + '">' + inputType.DESCRIPTION + "</option");
                } else if (!field.CUSTOM) {
                    fieldType.append('<option value="' + inputType.TYPE + '">' + inputType.DESCRIPTION + "</option");
                }
            });

            fieldType.on("change", function(e) {
                var type = fieldType.val();

                if ($("#ax_field_fs_ontext").length) {
                    if (type != "flip-switch") {
                        $("div.ax-field-fs-ontext, div.ax-field-fs-offtext").remove();
                    }
                } else {
                    if (type == "flip-switch") {
                        var fsSettings = configWidget._flipSwitchSettings();
                        fieldEditorDiv.find("div.ax-field-type").after(fsSettings);
                    }
                }
            });
            if (field.TYPE != null) {
                fieldType.val(field.TYPE);
            }
            fieldEditorDiv.append(configWidget._stepInputFieldHolder("ax_field_type", "Field Type").append(fieldType));

            if (field.TYPE == "flip-switch") {
                fieldEditorDiv.append(configWidget._flipSwitchSettings());

                if (field.FS_ONTEXT != null) {
                    fieldEditorDiv.find("#ax_field_fs_ontext").val(field.FS_ONTEXT);
                }
                if (field.FS_OFFTEXT != null) {
                    fieldEditorDiv.find("#ax_field_fs_offtext").val(field.FS_OFFTEXT);
                }
            }

            if (field.VALUES != null) {
                var fieldValues = $(
                    '<div class="ax-field-value-holder ax-field-values" style="margin-top: 2em; clear:both;"/>'
                );
                fieldEditorDiv.append(fieldValues);
                configWidget._fieldValuesDatatable(field.VALUES, ".ax-field-value-holder");
            }
            var fieldEventEditor = $(
                '<div class="ax-field-event-holder ax-field-events" style="margin-top: 2em;clear:both;"/>'
            );
            fieldEditorDiv.append(fieldEventEditor);
            configWidget._fieldEventsDatatable(field.EVENTS, ".ax-field-event-holder");

            var fieldTriggerEditor = $(
                '<div class="ax-field-trigger-holder ax-field-trigger" style="margin-top: 2em;clear:both;"/>'
            );
            fieldEditorDiv.append(fieldTriggerEditor);
            configWidget._fieldTriggersDatatable(field.TRIGGER_EVENTS, ".ax-field-trigger-holder");

            if (!configWidget.options.advanced_mode && field.CUSTOM != true) {
                $(".ax-field-id").hide();
                $(".ax-field-maxlength").hide();
                $(".ax-field-pattern").hide();
                $(".ax-field-title").hide();
                $(".ax-field-type").hide();
            }

            var saveField = $('<a class="ax-field-save ui-btn ui-btn-icon-right ui-icon-check">Save Field</a>');
            configWidget._addSaveButtonState({ display: "Save Field", event: "save_field" });

            configWidget.element.off("save_field").on("save_field", function() {
                var step = configWidget.element.data("editing_step");
                configWidget._saveField(step);
            });

            stepHolder.find("select").chosen({
                disable_search_threshold: 10,
                width: "400px"
            });
            configWidget.element.trigger("ax_config:editor_load");
        },
        _flipSwitchSettings: function() {
            var fsSettings = [];
            var onText = {
                TYPE: "text",
                TITLE: "Text displayed when in On position.",
                DISPLAY: "FS On Text"
            };
            var offText = {
                TYPE: "text",
                TITLE: "Text displayed when in Off position.",
                DISPLAY: "FS Off Text"
            };

            var onInput = configWidget._createInputField("ax_field_fs_ontext", onText);
            var onInputHolder = configWidget
                ._stepInputFieldHolder("ax_field_fs_ontext", onText.DISPLAY)
                .append(onInput);
            fsSettings.push(onInputHolder);
            var offInput = configWidget._createInputField("ax_field_fs_offtext", offText);
            var offInputHolder = configWidget
                ._stepInputFieldHolder("ax_field_fs_offtext", offText.DISPLAY)
                .append(offInput);
            fsSettings.push(offInputHolder);

            return fsSettings;
        },

        _createAddFieldVUI: function() {
            var value = {
                DISPLAY: "New Value",
                VALUE: ""
            };

            configWidget._fieldValueEditor(value);
        },

        /* FIELD VALUES EDITOR : fieldValEd */

        _fieldValueEditor: function(fieldValue) {
            var stepHolder = $(configWidget.options.field_v_edit_holder);
            if (stepHolder.find(".ax-step-field-v-edit").length) {
                stepHolder.find(".ax-step-field-v-edit").remove();
            }

            configWidget._menuAddNavigation({
                stateLabel: fieldValue.DISPLAY,
                stateID: fieldValue.ID,
                selector: ".ax-step-field-v-edit"
            });

            //TODO: hide other divs

            configWidget._hideNonActive();
            var fieldVEditorDiv = $('<div class="ax-step-field-v-edit"><h2>Edit Value:</h2></div>');
            stepHolder.append(fieldVEditorDiv);
            fieldVEditorDiv.prepend(configWidget._createCloseButton("field_values"));
            var fieldVDisplay = $('<input type="text" id="ax_field_v_display" placeholder="Display Name" />');
            fieldVEditorDiv.append(
                configWidget._stepInputFieldHolder("ax_field_v_display", "Display Name").append(fieldVDisplay)
            );
            if (fieldValue.DISPLAY != null) {
                fieldVDisplay.val(fieldValue.DISPLAY);
            }

            var fieldVValue = $('<input type="text" id="ax_field_v_value" placeholder="Value" />');
            fieldVEditorDiv.append(configWidget._stepInputFieldHolder("ax_field_v_value", "Value").append(fieldVValue));
            if (fieldValue.VALUE != null) {
                fieldVValue.val(fieldValue.VALUE);
            }

            var saveFieldV = $(
                '<a class="ax-field-save-v ax-field-save ui-btn ui-btn-icon-right ui-icon-check">Save Value</a>'
            );
            configWidget.element.off("save_field_value").on("save_field_value", function() {
                var tempValue = {
                    DISPLAY: configWidget._checkField(fieldVDisplay),
                    VALUE: configWidget._checkField(fieldVValue)
                };
                configWidget._saveFieldValue(tempValue);
                stepHolder.find(".ax-step-field-v-edit").remove();
                configWidget._toggleFieldVList();
                configWidget._menuNavigationBack();
            });
            configWidget._addSaveButtonState({ display: "Save Value", event: "save_field_value" });

            fieldVEditorDiv.trigger("ax_config:editor_load");
        },

        _fieldValuesDatatable: function(fieldValues, location) {
            var fvColumns = [
                {
                    title: "Order",
                    data: "POSITION",
                    className: "reorder"
                },
                {
                    title: "Display",
                    data: "DISPLAY"
                },
                {
                    title: "Value",
                    data: "VALUE"
                },
                {
                    title: "Action",
                    data: "ACTION"
                }
            ];
            var fvData = [];
            fvData = configWidget._createFieldVListDTConfig(fieldValues);
            var fvControls = configWidget._createControls("field_values");
            var fvTable = $('<table class=" ax-field-value-table" />');
            $(location)
                .append(fvControls)
                .append(fvTable);
            /* $(location).find('div.ax-step-input-holder.ax-save-step').insertAfter(fieldTable); */

            fvTable = fvTable.DataTable({
                data: fvData,
                columns: fvColumns,
                searching: false,
                paging: false,
                columnDefs: [
                    {
                        orderable: false,
                        targets: [1, 2, 3]
                    }
                ],
                info: false,
                compact: true,
                rowReorder: {
                    dataSrc: "POSITION"
                }
            });
            configWidget._refreshFieldVListTable(fieldValues);
        },

        _createFieldVListDTConfig: function(fieldValues) {
            var fvData = [];
            if ($.isArray(fieldValues)) {
                if (fieldValues.length > 0) {
                    $.each(fieldValues, function(i, value) {
                        var tempV = {
                            POSITION: i,
                            DISPLAY: value.DISPLAY,
                            VALUE: value.VALUE,
                            ACTION:
                                '<div><a class="ax-field-v-action ax-field-v-action-edit">Edit</a><a class="ax-field-v-action ax-field-v-action-delete">Delete</a></div>'
                        };
                        fvData.push(tempV);
                    });
                }
            }
            return fvData;
        },

        _saveFieldValue: function(fieldValue) {
            var fieldValues = [];
            if (configWidget.element.find(".ax-field-value-table").length) {
                var fieldVTable = configWidget.element.find(".ax-field-value-table").DataTable();
                var currentValues = fieldVTable.data();
                var currentV_Array = [];
                if (currentValues.length < 1) {
                    fieldValues.push(fieldValue);
                    configWidget._refreshFieldVListTable(fieldValues);
                } else {
                    var added = false;
                    $.each(currentValues, function(i, fieldV) {
                        if (fieldV.VALUE == fieldValue.VALUE) {
                            fieldV = fieldValue;
                            added = true;
                        } else if (fieldV.DISPLAY == fieldValue.DISPLAY) {
                            fieldV = fieldValue;
                            added = true;
                        }
                        currentV_Array.push(fieldV);
                    });
                    if (!added) {
                        currentV_Array.push(fieldValue);
                    }
                    configWidget._refreshFieldVListTable(currentV_Array);
                }
            } else {
                fieldValues.push(fieldValue);
                configWidget._fieldValuesDatatable(fieldValues, ".ax-field-value-holder");
                configWidget._refreshFieldVListTable(fieldValues);
            }
        },

        /*
         * Clears and updates the datatable with the current
         * configuration @param {object} configuration - The
         * configuration to load. @param {object} step - The
         * step to load.
         */
        _refreshFieldVListTable: function(fieldValues) {
            var fieldVTable = configWidget.element.find(".ax-field-value-table").DataTable();
            var fvData = configWidget._createFieldVListDTConfig(fieldValues);

            if (fvData != null) {
                fieldVTable
                    .clear()
                    .rows.add(fvData)
                    .draw();

                $(".ax-config-controls.fields").show();
                if (configWidget.options.ax_ui) {
                } else {
                    $(".ax-field-v-action").addClass("ui-btn ui-mini ui-btn-icon-right ui-btn-icon-notext");
                    $(".ax-field-v-action-edit").addClass("ui-icon-edit");
                    $(".ax-field-v-action-delete").addClass("ui-icon-delete");
                    $(".ax-field-v-action").css({
                        display: "inline-block",
                        overflow: "inherit"
                    });

                    configWidget.element.find(".ax-field-value-table").off("click", ".ax-field-v-action-edit");
                    configWidget.element.find(".ax-field-value-table").off("click", ".ax-field-v-action-delete");

                    configWidget.element
                        .find(".ax-field-value-table")
                        .on("click", ".ax-field-v-action-edit", function(e) {
                            var selectedField = fieldVTable.row($(this).closest("tr")).data();
                            configWidget._fieldValueEditor(selectedField);
                            configWidget._toggleFieldVList(true);
                        });

                    configWidget.element
                        .find(".ax-field-value-table")
                        .on("click", ".ax-field-v-action-delete", function(e) {
                            var selectedField = fieldVTable
                                .row($(this).closest("tr"))
                                .remove()
                                .draw();
                        });
                }
            } else {
                fieldVTable.clear();
                configWidget.element
                    .find(".ax-field-value-table")
                    .closest(".dataTables_wrapper")
                    .hide();
            }
        },

        /*
         * Check and save the values for a field. @param
         * {string} step - the step to save the field against.
         */
        _saveField: function(step) {
            var contactType = "student";

            var stepConfig = configWidget.options.current_configuration.enroller_steps[step];
            if (stepConfig && stepConfig.CONTACT_TYPE) {
                contactType = stepConfig.CONTACT_TYPE;
            }

            var fieldID = $("#ax_field_id").val();
            var fieldDisplay = $("#ax_field_display").val();
            var fieldType = $("#ax_field_type").val();
            var fieldValues = [];

            var infoOnly = $("#ax_field_info_only").val() == 1;

            var fieldConfig = {};

            /*
             * ensure that any "special" parameters are
             * stored
             */
            var original_config = configWidget.element.data("editing_field");
            if (original_config != null) {
                $.each(original_config, function(key, value) {
                    if (fieldConfig[key] === undefined) {
                        fieldConfig[key] = value;
                    }
                });
            }

            if (fieldID == "" || fieldID == null) {
                configWidget._toolTip(".ax-save-button", "Invalid ID");
            } else if (fieldDisplay == "") {
                configWidget._toolTip(".ax-save-button", "Display is Required");
            } else if (fieldType == "") {
                configWidget._toolTip(".ax-save-button", "Type not available");
            } else {
                var valuesRequired = [
                    "search-select",
                    "multi-select",
                    "select",
                    "search-select-add",
                    "checkbox",
                    "modifier-checkbox"
                ];
                if (valuesRequired.indexOf(fieldType) > -1) {
                    if (configWidget.element.find(".ax-field-value-table").length) {
                        var fieldVTable = configWidget.element.find(".ax-field-value-table").DataTable();
                        var fieldVData = fieldVTable.data();

                        if (fieldVData.length > 0) {
                            //Sort the data by position in datatable.
                            fieldVData.sort(function(a, b) {
                                return a.POSITION - b.POSITION;
                            });
                            $.each(fieldVData, function(i, fieldVal) {
                                var tempV = {
                                    DISPLAY: fieldVal.DISPLAY,
                                    VALUE: fieldVal.VALUE
                                };
                                fieldValues.push(tempV);
                            });
                        }
                    }
                    /*
                     * need values so check to see if they are
                     * set, or if there are defaults
                     */
                    if (fieldValues.length < 1) {
                        if (configWidget.options.field_options[fieldID] != null) {
                            if (configWidget.options.field_options[fieldID].values != null) {
                                fieldValues = configWidget.options.field_options[fieldID].values;
                            }
                        }
                    }

                    /*
                     * check again to see if the above set
                     * anything and assume that we are pulling
                     * it back via API if not.
                     */
                    if (fieldValues.length < 1) {
                        fieldConfig.DYNAMIC = true;
                    }

                    fieldConfig.VALUES = fieldValues;
                }

                /** ** Wp-100 *** */
                var fieldEventTable = $("table.ax-field-event-table");
                if (fieldEventTable.length) {
                    fieldEventTable = fieldEventTable.DataTable();
                    var fieldData = fieldEventTable.data();

                    if (fieldData.length > 0) {
                        fieldConfig.EVENTS = {};
                        $.each(fieldData, function(i, fieldEvent) {
                            fieldConfig.EVENTS[fieldEvent.EVENT_ID] = {
                                LISTENER: fieldEvent.LISTENER,
                                EVENT_ACTION: fieldEvent.EVENT_ACTION,
                                TARGET_FIELD: fieldEvent.TARGET_FIELD
                            };
                        });
                    } else {
                        fieldConfig.EVENTS = {};
                    }
                }

                var fieldTriggerTable = $("table.ax-field-trigger-table");
                if (fieldTriggerTable.length) {
                    fieldTriggerTable = fieldTriggerTable.DataTable();
                    var fieldData = fieldTriggerTable.data();

                    if (fieldData.length > 0) {
                        fieldConfig.TRIGGER_EVENTS = {};
                        $.each(fieldData, function(i, fieldEvent) {
                            fieldConfig.TRIGGER_EVENTS[fieldEvent.TRIGGER_ID] = {
                                TRIGGER_ON: fieldEvent.TRIGGER_ON,
                                EVENT: fieldEvent.EVENT,
                                VALUE_RESTRICTION: fieldEvent.VALUE_RESTRICTION
                            };
                        });
                    } else {
                        fieldConfig.TRIGGER_EVENTS = {};
                    }
                }

                /** ** End Wp-100 *** */

                fieldConfig.ID = fieldID;
                fieldConfig.DISPLAY = fieldDisplay;
                fieldConfig.TYPE = fieldType;
                if ($("#ax_field_id").data("custom_field") != null) {
                    fieldConfig.CUSTOM = $("#ax_field_id").data("custom_field");
                }

                if (fieldConfig.TYPE == "flip-switch") {
                    if ($("#ax_field_fs_ontext").length) {
                        var fsOnVal = $("#ax_field_fs_ontext").val();
                        if (fsOnVal != null && fsOnVal != "") {
                            fieldConfig.FS_ONTEXT = fsOnVal;
                        }
                    }
                    if ($("#ax_field_fs_offtext").length) {
                        var fsOffVal = $("#ax_field_fs_offtext").val();
                        if (fsOffVal != null && fsOffVal != "") {
                            fieldConfig.FS_OFFTEXT = fsOffVal;
                        }
                    }
                }

                $.each(configWidget.FIELD_INPUTS, function(key, inputField) {
                    var id = "ax_field_" + key.toLowerCase();
                    var input = $("#" + id);
                    if (input.length) {
                        if (input.val() != null && input.val() != "") {
                            if (inputField.TYPE == "select") {
                                var fieldVal = input.val();
                                if (fieldVal == 1) {
                                    fieldVal = true;
                                } else if (fieldVal == 0) {
                                    fieldVal = false;
                                }

                                fieldConfig[key] = fieldVal;
                            } else {
                                fieldConfig[key] = input.val();
                            }
                        } else if (input.val() === "" && inputField.REQUIRED !== true) {
                            delete fieldConfig[key];
                        }
                    }
                });

                if (infoOnly != "" && infoOnly != null) {
                    fieldConfig.INFO_ONLY = infoOnly;
                }

                if (
                    fieldConfig.TYPE == "information" ||
                    fieldConfig.TYPE == "divider" ||
                    fieldConfig.TYPE == "button"
                ) {
                    fieldConfig.INFO_ONLY = true;
                }

                var originalID = $("#ax_field_id").data("org_id");

                /*
                 * check to see if the ID was changed note that
                 * this will cause the position to change
                 */
                if (originalID != fieldID) {
                    if (configWidget.options.current_configuration.enroller_steps[step].FIELDS[originalID] != null) {
                        delete configWidget.options.current_configuration.enroller_steps[step].FIELDS[originalID];
                    }
                }
                fieldID = configWidget._renameField(fieldID, contactType);
                configWidget.options.current_configuration.enroller_steps[step].FIELDS[fieldID] = fieldConfig;

                /*
                 * won't change values as it is already set, but
                 * will trigger the refresh functions
                 */

                configWidget._refreshFieldListTable(configWidget.options.current_configuration, step);
                $(".ax-step-fieldedit").remove();
                configWidget._menuNavigationBack();
            }
        },

        STEP_FIELDS: {
            ax_config_step_id: {
                DISPLAY: "Step ID",
                TYPE: "text",
                TITLE: "The Internal ID used to identify the step. Not shown to students."
            },
            ax_config_step_display: {
                DISPLAY: "Display Name",
                TYPE: "text",
                TITLE: "The Step Name shown to students in the step menu. It is reccommended to keep these short."
            },
            ax_config_step_header: {
                DISPLAY: "Step Header",
                TYPE: "text",
                TITLE: "This Text appears above the step as a header."
            },

            ax_config_step_blurb_top: {
                DISPLAY: "Top Blurb",
                TYPE: "textarea",
                TITLE: "An information blurb that appears above any content on the step."
            },

            /*Inner Blurb - will only display on the Contact Search Step.*/
            ax_config_step_blurb_inner: {
                DISPLAY: "Inner Blurb",
                TYPE: "textarea",
                TITLE:
                    "An information blurb that appears above step content - when in search mode on the contact-search step."
            },
            ax_config_step_blurb_bottom: {
                DISPLAY: "Bottom Blurb",
                TYPE: "textarea",
                TITLE: "An information blurb that appears below any content on the step."
            },
            ax_config_step_terms: {
                DISPLAY: "Step Terms",
                TYPE: "textarea",
                TITLE:
                    "Adds a terms and conditions approval element to the step, required to be completed before the step is considered complete."
            },
            ax_config_step_button_text: {
                DISPLAY: "Button Text",
                TYPE: "text",
                TITLE: "The button text for the Submit button for a step. It is reccommended to keep these short."
            }

            /*
             * "ax_config_step_type": {DISPLAY: "Step Type",
             * TYPE:"select", TITLE:"The Type of step. Not
             * reccommended to change this.",
             * VALUES:configWidget.STEP_TYPES},
             */
        },
        SPECIAL_STEP_FIELDS: {
            ax_config_step_notecodeid: {
                DISPLAY: "Note Code",
                TYPE: "text",
                TITLE: "The NCID, or Note Code ID of the note type to be added."
            },
            ax_config_step_emailto: {
                DISPLAY: "Email To",
                TYPE: "text",
                TITLE:
                    "The email address, or comma separated list of emails to be notified on submission. <br/> NOTE: If sending as contact note, this must be contactIDs and not emails. Note for Enquiry this may be handled through Workflow."
            },
            ax_config_step_iscricos: {
                DISPLAY: "Use CRICOS Checklist",
                TYPE: "select",
                TITLE: "Use the system CRICOS checklist - Takes precedence over the ID.",
                VALUES: [
                    {
                        DISPLAY: "Yes",
                        VALUE: "true"
                    },
                    {
                        DISPLAY: "No",
                        VALUE: "false"
                    }
                ]
            },
            ax_config_step_portfoliochecklistid: {
                DISPLAY: "Portfolio Checklist ID",
                TYPE: "text",
                TITLE:
                    "The numeric ID of the portfolio checklist to be used. Found in the URL when editing the checklist. (certTypeListID)"
            },
            ax_config_step_portfolio_optional: {
                DISPLAY: "Step Optional",
                TYPE: "select",
                TITLE: "This step is optional and may be skipped",
                VALUES: [
                    {
                        DISPLAY: "No",
                        VALUE: "false"
                    },
                    {
                        DISPLAY: "Yes",
                        VALUE: "true"
                    }
                ]
            }
        },
        COURSE_TYPE_FIELDS: {
            ax_config_step_terminology_w: {
                DISPLAY: "Terminology Workshop",
                TYPE: "text",
                TITLE: "The Terminology to be used for Workshops / Short Courses in the Course Search Step."
            },
            ax_config_step_terminology_p: {
                DISPLAY: "Terminology Program",
                TYPE: "text",
                TITLE: "The Terminology to be used for Programs / Qualifications in the Course Search Step."
            },
            ax_config_step_terminology_el: {
                DISPLAY: "Terminology ELearning",
                TYPE: "text",
                TITLE: "The Terminology to be used for ELearning in the Course Search Step."
            },
            ax_config_step_course_w: {
                DISPLAY: "Add Workshop Option",
                TYPE: "select",
                TITLE: "Add an Option under the Course Selector for Workshop Courses",
                VALUES: [
                    {
                        DISPLAY: "No",
                        VALUE: 0
                    },
                    {
                        DISPLAY: "Yes",
                        VALUE: 1
                    }
                ]
            },
            ax_config_step_course_p: {
                DISPLAY: "Add Program Option",
                TYPE: "select",
                TITLE: "Add an Option under the Course Selector for Program Courses",
                VALUES: [
                    {
                        DISPLAY: "No",
                        VALUE: 0
                    },
                    {
                        DISPLAY: "Yes",
                        VALUE: 1
                    }
                ]
            },
            ax_config_step_course_el: {
                DISPLAY: "Add Elearning Option",
                TYPE: "select",
                TITLE: "Add an Option under the Course Selector for ELearning Courses",
                VALUES: [
                    {
                        DISPLAY: "No",
                        VALUE: 0
                    },
                    {
                        DISPLAY: "Yes",
                        VALUE: 1
                    }
                ]
            }
        },
        /*
         * Create UI components for a Generic Contact / Field
         * step
         */
        _createGenericStep: function() {
            var stepHolder = $(configWidget.options.step_edit_holder);

            stepHolder.prepend("<h2>Edit Step:</h2>");
            stepHolder.prepend(configWidget._createCloseButton("steps"));

            $.each(configWidget.STEP_FIELDS, function(key, field) {
                var input = configWidget._createInputField(key, field);
                var inputHolder = configWidget._stepInputFieldHolder(key, field.DISPLAY).append(input);
                stepHolder.append(inputHolder);
            });

            var typeField = $('<select id="ax_config_step_type" placeholder="Type" />');
            typeField.attr("data-role", "none");
            typeField.attr("data-enhance", "false");
            $.each(configWidget.STEP_TYPES, function(i, stepType) {
                typeField.append('<option value="' + stepType.TYPE + '">' + stepType.DESCRIPTION + "</option");
            });
            var typeFieldDiv = configWidget._stepInputFieldHolder("ax_config_step_type", "Step Type").append(typeField);
            stepHolder.append(typeFieldDiv);

            if (!configWidget.options.advanced_mode) {
                typeFieldDiv.hide();
            }

            typeField.chosen({
                disable_search_threshold: 10
            });
            stepHolder.append($('<div class="ax-field-list-holder"></div>'));
            var saveStep = $('<a class="ax-step-save ui-btn ui-btn-icon-right ui-icon-check">Save Step</a>');

            configWidget.element.off("save_step").on("save_step", function() {
                var step = configWidget.element.data("editing_step");

                var config = configWidget._generateStepConfig(step);

                if (config.valid) {
                    configWidget._saveStep(config.config);
                }
            });
            configWidget._addSaveButtonState({ display: "Save Step", event: "save_step" });

            stepHolder.trigger("ax_config:editor_load");
        },

        /*
         * Creates a standardised div for holding input fields.
         * Replace with ax_ui setting for use in ax
         */
        _stepInputFieldHolder: function(fieldID, labelName) {
            var fieldClass = fieldID.replace(/_/g, "-");
            var div = $('<div class="ax-step-input-holder" />');
            var label = $('<label class="ax-step-input-label">' + labelName + ":</label>");
            div.addClass(fieldClass);
            label.attr("for", fieldID);
            div.append(label);
            return div;
        },
        /*
         * Gets the currently set step configuration, and
         * triggers loading it into the form, or the default if
         * none is set. @param {string} currentStep - A Step ID
         * for the currently viewed step
         */
        _getStepDetails: function(currentStep) {
            var configuration = configWidget.options.current_configuration;
            if (configuration == null) {
                configuration = {};
            }
            if (configWidget._isSpecialStep(currentStep)) {
                /* add any special logic for special steps here */
                if (configuration.enroller_steps[currentStep] != null) {
                    configuration.enroller_steps[currentStep].ID = currentStep;

                    /*
                     * ensure all the required params are
                     * present
                     */
                    $.each(configWidget.SPECIAL_STEPS[currentStep], function(stepKey, value) {
                        if (configuration.enroller_steps[currentStep][stepKey] == null) {
                            configuration.enroller_steps[currentStep][stepKey] = value;
                        }
                    });
                    configWidget._loadStepValues(configuration.enroller_steps[currentStep]);
                    configWidget._loadSpecialValues(configuration.enroller_steps[currentStep]);
                    $("#ax_config_step_id").prop("disabled", true);
                } else {
                    configWidget._loadStepValues(configWidget.SPECIAL_STEPS[currentStep]);
                }
            } else {
                if (configuration.enroller_steps[currentStep] != null) {
                    configuration.enroller_steps[currentStep].ID = currentStep;
                    configWidget._loadStepValues(configuration.enroller_steps[currentStep]);

                    var stepType = configuration.enroller_steps[currentStep].TYPE;
                    /*
                     * check for any other "Special Steps" that
                     * are not predefined
                     */
                    var customButtonStep = false;
                    if (configWidget.STEPS_WITH_CUSTOM_BUTTON.indexOf(stepType) != -1) {
                        customButtonStep = true;
                    }
                    if (
                        stepType == "course-enquiry" ||
                        stepType == "contact-update" ||
                        stepType == "contact-note" ||
                        stepType == "portfolio" ||
                        customButtonStep
                    ) {
                        configWidget._loadSpecialValues(configuration.enroller_steps[currentStep]);
                    }
                    $("#ax_config_step_id").prop("disabled", false);
                }
            }
            configWidget.element.find("select:not(.chosen-single)").chosen({
                disable_search_threshold: 10,
                width: "400px"
            });
        },
        /*
         * Returns Bool to identify if the step is a "special"
         * step or not. @param {string} stepID - ID of the step.
         */
        _isSpecialStep: function(stepID) {
            return configWidget.SPECIAL_STEPS[stepID] != null;
        },

        /*
         * Load the current configuration into the step. @param
         * {object} stepConfiguration - Step configuration.
         */
        _loadStepValues: function(stepConfiguration) {
            configWidget._clearStepValues();

            $("#ax_config_step_id")
                .val(stepConfiguration.ID)
                .data("ID", stepConfiguration.ID);
            $("#ax_config_step_display").val(stepConfiguration.DISPLAY);
            $("#ax_config_step_type")
                .val(stepConfiguration.TYPE)
                .trigger("chosen:updated");

            if (stepConfiguration.updateFunction != null || stepConfiguration.TYPE == "custom-step") {
                var updateFunction = $(
                    '<input type="text" id="ax_config_step_updatefunction" placeholder="Text String corresponding to a javascript function name"></input>'
                );
                $(".ax-step-content").append(
                    configWidget
                        ._stepInputFieldHolder("ax_config_step_updatefunction", "Update Function")
                        .append(updateFunction)
                );
                updateFunction.val(stepConfiguration.updateFunction);
            }

            if (configWidget.STEPS_WITH_TERMS.indexOf(stepConfiguration.TYPE) == -1) {
                $("#ax_config_step_terms")
                    .closest("div")
                    .remove();
            }

            if (stepConfiguration.TYPE != "contact-search") {
                $("#ax_config_step_blurb_inner")
                    .closest("div")
                    .remove();
            }
            if (configWidget.STEPS_WITH_CUSTOM_BUTTON.indexOf(stepConfiguration.TYPE) == -1) {
                $("#ax_config_step_button_text")
                    .closest("div.ax-step-input-holder")
                    .remove();
            }
        },

        _loadSpecialValues: function(stepConfiguration) {
            var stepHolder = $(configWidget.options.step_edit_holder);
            var stepType = stepConfiguration.TYPE;

            if (stepType == "portfolio") {
                if (stepConfiguration.portfolio_optional == null) {
                    stepConfiguration.portfolio_optional = false;
                }
            }
            $.each(stepConfiguration, function(key, value) {
                if (key === "AVAILABLE_ENVS") {
                    return;
                }
                if (key != "FIELDS") {
                    var fieldID = "ax_config_step_" + key;
                    fieldID = fieldID.toLowerCase();
                    if ($("#" + fieldID).length) {
                        $("#" + fieldID).val(value);
                        if (value === true) {
                            $("#" + fieldID).val("true");
                        } else if (value === false) {
                            $("#" + fieldID).val("false");
                        }
                    } else {
                        if (configWidget.SPECIAL_STEP_FIELDS[fieldID] != null) {
                            var field = configWidget.SPECIAL_STEP_FIELDS[fieldID];
                            var input = configWidget._createInputField(fieldID, field);
                            var inputHolder = configWidget._stepInputFieldHolder(key, field.DISPLAY).append(input);

                            if (stepHolder.find(".ax-field-list-holder").length) {
                                inputHolder.insertBefore(stepHolder.find(".ax-field-list-holder"));
                            } else if (stepHolder.find(".ax-save-step").length) {
                                inputHolder.insertBefore(stepHolder.find(".ax-save-step"));
                            } else {
                                stepHolder.append(inputHolder);
                            }

                            if (field.TYPE == "select") {
                                inputHolder
                                    .find("select")
                                    .val(value)
                                    .trigger("chosen:updated");

                                if (value === true) {
                                    inputHolder
                                        .find("select")
                                        .val("true")
                                        .trigger("chosen:updated");
                                } else if (value === false) {
                                    inputHolder
                                        .find("select")
                                        .val("false")
                                        .trigger("chosen:updated");
                                }
                            } else if (field.TYPE == "textarea") {
                                inputHolder.find("textarea").val(value);
                            } else {
                                if (typeof value == "object") {
                                    inputHolder.find("input").val(JSON.stringify(value));
                                } else {
                                    inputHolder.find("input").val(value);
                                }
                            }
                        } else {
                            if (key == "paymentMethods") {
                                /*create the fields and set them to No by default*/
                                configWidget._paymentMethodsOptions();
                                $.each(value.VALUES, function(i, method) {
                                    if ($("#method_" + method.VALUE).length) {
                                        $("#method_" + method.VALUE).val(1);
                                        $("#method_" + method.VALUE).trigger("chosen:updated");
                                    }
                                });
                            } else if (key == "COLUMNS") {
                                var columnFields = configWidget._createCourseColumnOptions();
                                $.each(columnFields, function(i) {
                                    $(columnFields[i]).insertBefore(stepHolder.find(".ax-field-list-holder"));
                                });

                                configWidget._updateCourseColumnOptions(value);
                            } else if (key == "contactList") {
                            } else if (key == "FIELD_ORDER") {
                            } else if (key == "COURSE_TYPES") {
                                $.each(configWidget.COURSE_TYPE_FIELDS, function(key, field) {
                                    var input = configWidget._createInputField(key, field);
                                    var inputHolder = configWidget
                                        ._stepInputFieldHolder(key, field.DISPLAY)
                                        .append(input);

                                    if (stepHolder.find(".ax-field-list-holder").length) {
                                        inputHolder.insertBefore(stepHolder.find(".ax-field-list-holder"));
                                    } else if (stepHolder.find(".ax-save-step").length) {
                                        inputHolder.insertBefore(stepHolder.find(".ax-save-step"));
                                    } else {
                                        stepHolder.append(inputHolder);
                                    }
                                });
                                if (value != null) {
                                    $.each(value, function(i, courseType) {
                                        if (courseType.VALUE == "w") {
                                            $("#ax_config_step_terminology_w").val(courseType.DISPLAY);
                                            $("#ax_config_step_course_w")
                                                .val(1)
                                                .trigger("chosen:updated");
                                        }
                                        if (courseType.VALUE == "p") {
                                            $("#ax_config_step_terminology_p").val(courseType.DISPLAY);
                                            $("#ax_config_step_course_p")
                                                .val(1)
                                                .trigger("chosen:updated");
                                        }
                                        if (courseType.VALUE == "el") {
                                            $("#ax_config_step_terminology_el").val(courseType.DISPLAY);
                                            $("#ax_config_step_course_el")
                                                .val(1)
                                                .trigger("chosen:updated");
                                        }
                                    });
                                }
                            } else {
                                var inputTemp = $('<input type="text" id="' + fieldID + '" placeholder=""></input>');
                                var holderDiv = configWidget._stepInputFieldHolder(fieldID, key).append(inputTemp);

                                if (stepHolder.find(".ax-save-step").length) {
                                    holderDiv.addClass("ax-config-advanced").insertBefore($(".ax-save-step"));
                                } else {
                                    stepHolder.append(holderDiv);
                                    holderDiv.addClass("ax-config-advanced");
                                }

                                if (typeof value == "object") {
                                    inputTemp.val(JSON.stringify(value));
                                } else {
                                    inputTemp.val(value);
                                }
                            }
                        }
                    }
                }
            });
            configWidget._triggerEditorLoad();
        },

        _paymentMethodsOptions: function() {
            var stepHolder = $(configWidget.options.step_edit_holder);

            $.each(configWidget.PAYMENT_METHODS, function(key, value) {
                var add = true;
                if (value.AVAILABLE_ENVS != null) {
                    if (!value.AVAILABLE_ENVS[configWidget.options.environment]) {
                        add = false;
                    }
                }
                if (add) {
                    var input = configWidget._createInputField(key, value);
                    var inputHolder = configWidget._stepInputFieldHolder(key, value.DISPLAY).append(input);
                    stepHolder.append(inputHolder);
                }
                //stepHolder.find("div.ax-step-input-holder.ax-save-step").before(inputHolder);
            });

            /*default to no*/
            stepHolder
                .find("#method_invoice,#method_payment,#method_tentative,#method_direct_debit,#method_epayment")
                .val(0)
                .chosen({
                    disable_search_threshold: 10,
                    width: "400px"
                });
        },

        PRIORITY_OPTIONS: [
            {
                DISPLAY: "Never display (0)",
                VALUE: "priority-0"
            },
            {
                DISPLAY: "Always display (1)",
                VALUE: "priority-1"
            },
            {
                DISPLAY: "Priority 2",
                VALUE: "priority-2"
            },
            {
                DISPLAY: "Priority 3",
                VALUE: "priority-3"
            },
            {
                DISPLAY: "Priority 4",
                VALUE: "priority-4"
            }
        ],
        COURSE_COLUMNS: function() {
            return $.extend([], configWidget.SPECIAL_STEPS.courses.COLUMNS);
        },
        /*WP-155: Course Search Column Configuration*/
        _createCourseColumnOptions: function() {
            var options = [];
            var defColumns = configWidget.COURSE_COLUMNS();

            $.each(defColumns, function(i) {
                var temp = {
                    TYPE: "select",
                    TITLE: "Column visibility Priority",
                    DISPLAY: defColumns[i]["title"],
                    VALUES: configWidget.PRIORITY_OPTIONS
                };
                var field = configWidget._createInputField("column_" + i, temp);
                var holder = configWidget._stepInputFieldHolder("column_" + i, defColumns[i]["title"]);
                options.push(holder.append(field));
            });

            return options;
        },
        _updateCourseColumnOptions: function(columns) {
            $.each(columns, function(i) {
                if (columns[i].className != null) {
                    $("#column_" + i)
                        .val(columns[i].className)
                        .trigger("chosen:updated");
                }
            });
        },
        _retrieveCourseColumnOptions: function() {
            var defColumns = configWidget.COURSE_COLUMNS();
            var tempColumns = [];
            $.each(defColumns, function(i) {
                var temp = {
                    title: defColumns[i].title,
                    data: defColumns[i].data
                };
                if (defColumns[i].orderData != null) {
                    temp.orderData = defColumns[i].orderData;
                }
                if (defColumns[i].visible != null) {
                    temp.visible = defColumns[i].visible;
                }
                var priority = $("#column_" + i).val();
                if (priority == "priority-0") {
                    temp.visible = false;
                } else {
                    temp.visible = true;
                }
                temp.className = priority;
                tempColumns.push(temp);
            });
            return tempColumns;
        },
        _clearStepValues: function() {
            $(".ax-step-content").empty();

            configWidget._createGenericStep();
        },

        /*
         * Builds the configuration parameters for the current
         * step. Returns an object with config, and validity
         * (null values) @param {string} currentStep - A Step ID
         * for the currently viewed step
         */
        _generateStepConfig: function(currentStep) {
            var configValid = true;
            var config = {};
            if (configWidget._isSpecialStep(currentStep)) {
                $.each(configWidget.SPECIAL_STEPS[currentStep], function(key, value) {
                    if (key == "paymentMethods") {
                        var tempConfig = [];
                        $.each(configWidget.PAYMENT_METHODS, function(payKey, payVal) {
                            var add = true;
                            if (payVal.AVAILABLE_ENVS != null) {
                                if (!payVal.AVAILABLE_ENVS[configWidget.options.environment]) {
                                    add = false;
                                }
                            }
                            if (add) {
                                if ($("#" + payKey).val() == 1) {
                                    tempConfig.push({
                                        VALUE: payKey.replace("method_", ""),
                                        DISPLAY: payVal.DISPLAY
                                    });
                                }
                            }
                        });

                        config[key] = {
                            DISPLAY: "Payment Method",
                            VALUES: tempConfig,
                            TYPE: "select"
                        };
                    } else if (key == "COLUMNS") {
                        var columnConfig = configWidget._retrieveCourseColumnOptions();
                        config[key] = columnConfig;
                    } else if (key == "FIELDS") {
                        var fieldsList = configWidget._getFieldsList(currentStep, config.TYPE);
                        if (fieldsList != null) {
                            config.FIELDS = fieldsList;
                        }
                    } else if (key == "FIELD_ORDER") {
                        if (
                            configWidget.options.current_configuration.enroller_steps[currentStep].FIELD_ORDER != null
                        ) {
                            config.FIELD_ORDER =
                                configWidget.options.current_configuration.enroller_steps[currentStep].FIELD_ORDER;
                        }
                    } else if (key == "COURSE_TYPES") {
                        var courseTypes = [];
                        var terminologyW = $("#ax_config_step_terminology_w").val() || "Workshop";
                        var terminologyP = $("#ax_config_step_terminology_p").val() || "Program";
                        var terminologyEL = $("ax_config_step_terminology_el").val() || "ELearning";

                        if ($("#ax_config_step_course_w").val() == 1 || $("#ax_config_step_course_w").val() == "") {
                            courseTypes.push({
                                DISPLAY: terminologyW,
                                VALUE: "w"
                            });
                        }
                        if ($("#ax_config_step_course_p").val() == 1 || $("#ax_config_step_course_p").val() == "") {
                            courseTypes.push({
                                DISPLAY: terminologyP,
                                VALUE: "p"
                            });
                        }
                        if ($("#ax_config_step_course_el").val() == 1 || $("#ax_config_step_course_el").val() == "") {
                            courseTypes.push({
                                DISPLAY: terminologyEL,
                                VALUE: "el"
                            });
                        }
                        if (courseTypes.length > 0) {
                            config[key] = courseTypes;
                        } else {
                            config[key] = null;
                        }
                    } else {
                        config[key] = configWidget._checkField($("#ax_config_step_" + key.toLowerCase()));
                    }
                });
                config.ID = currentStep;
            } else {
                var stepID = configWidget._ensureSafeID($("#ax_config_step_id"));
                config.ID = stepID;
                config.DISPLAY = configWidget._checkField($("#ax_config_step_display"));
                config.TYPE = configWidget._checkField($("#ax_config_step_type"));

                if (config.TYPE == "custom-step") {
                    config.updateFunction = configWidget._checkField($("#ax_config_step_updatefunction"));
                }
                if (config.TYPE == "course-enquiry") {
                    config.noteCodeID = configWidget._checkField($("#ax_config_step_notecodeid"));
                    config.emailTo = configWidget._checkField($("#ax_config_step_emailto"));
                }
                if (config.TYPE == "portfolio") {
                    config.ISCRICOS = configWidget._checkField($("#ax_config_step_iscricos"));
                    config.PORTFOLIOCHECKLISTID = configWidget._checkField($("#ax_config_step_portfoliochecklistid"));
                    config.portfolio_optional = configWidget._checkField($("#ax_config_step_portfolio_optional"));
                    if (config.portfolio_optional == null) {
                        config.portfolio_optional = false;
                    }
                }
                if (config.TYPE == "contact-note") {
                    config.noteCodeID = configWidget._checkField($("#ax_config_step_notecodeid"));
                    config.emailTo = configWidget._checkField($("#ax_config_step_emailto"));
                }

                var fieldsList = configWidget._getFieldsList(currentStep, config.TYPE);
                if (fieldsList != null) {
                    config.FIELDS = fieldsList;
                    if (configWidget.options.current_configuration.enroller_steps[currentStep].FIELD_ORDER != null) {
                        config.FIELD_ORDER =
                            configWidget.options.current_configuration.enroller_steps[currentStep].FIELD_ORDER;
                    }
                }
            }
            $.each(config, function(key, value) {
                if (value == null || (value == "" && value !== false && value !== true)) {
                    if (
                        key != "emailTo" &&
                        key != "COURSE_TYPES" &&
                        key != "PORTFOLIOCHECKLISTID" &&
                        key != "AVAILABLE_ENVS"
                    ) {
                        configWidget._toolTip(".ax-save-button", 'Please ensure "' + key + '" is set.');

                        configValid = false;
                    }
                }
            });
            var blurbTop = configWidget._checkField($("#ax_config_step_blurb_top"));
            var blurbBottom = configWidget._checkField($("#ax_config_step_blurb_bottom"));
            if ($("#ax_config_step_blurb_inner").length) {
                var blurbInner = configWidget._checkField($("#ax_config_step_blurb_inner"));
                if (blurbInner != "" && blurbInner != null) {
                    config.BLURB_INNER = blurbInner;
                }
            }
            if ($("#ax_config_step_header").length) {
                var header = configWidget._checkField($("#ax_config_step_header"));
                if (header != "" && header != null) {
                    config.HEADER = header;
                }
            }

            if ($("#ax_config_step_terms").length) {
                var termsVal = configWidget._checkField($("#ax_config_step_terms"));
                if (termsVal != "" && termsVal != null) {
                    config.TERMS = termsVal;
                }
            }

            if ($("#ax_config_step_button_text").length) {
                var buttonTextVal = configWidget._checkField($("#ax_config_step_button_text"));
                if (buttonTextVal != "" && buttonTextVal != null) {
                    config.BUTTON_TEXT = buttonTextVal;
                }
            }

            if (blurbTop != "" && blurbTop != null) {
                config.BLURB_TOP = blurbTop;
            }
            if (blurbBottom != "" && blurbBottom != null) {
                config.BLURB_BOTTOM = blurbBottom;
            }

            return {
                config: config,
                valid: configValid
            };
        },

        /*
         * placeholder for additional error checking TODO: add
         * error checking. @param {object} element - jQuery
         * element object.
         */
        _checkField: function(element) {
            element = $(element);

            if (element.val() != null) {
                /* correct for boolean type issues */
                if (element.val() == "true") {
                    return true;
                } else if (element.val() == "false") {
                    return false;
                }

                if (!String.prototype.includes) {
                    if (element.val().indexOf("{") > -1) {
                        var updated = jQuery.parseJSON(element.val());
                        return updated;
                    }
                } else {
                    if (element.val().includes("{")) {
                        var updated = jQuery.parseJSON(element.val());
                        return updated;
                    }
                }
            }

            return element.val();
        },

        _getFieldsList: function(currentStep, stepType) {
            if (configWidget.options.current_configuration.enroller_steps[currentStep] != null) {
                if (configWidget.options.current_configuration.enroller_steps[currentStep].FIELDS != null) {
                    return configWidget.options.current_configuration.enroller_steps[currentStep].FIELDS;
                }
            }
            /*
             * No fields are currently set, check to see if they
             * are allowed Return empty object if they are, or
             * null if they arent
             */
            if (configWidget.STEP_TYPES[stepType].ALLOWED_FIELDS) {
                return {};
            } else {
                return null;
            }
        },
        /*
         * Ensures that a userDefinedID does not contain any non
         * Alpha characters and does not use one of the reserved
         * names. @param {string} field - A user defined step
         * ID.
         */
        _ensureSafeID: function(field) {
            var fieldValue = $(field).val();
            fieldValue = fieldValue.replace(/\W/g, "");
            if (fieldValue != null && fieldValue != "") {
                if (configWidget.DISALLOWED_IDS.indexOf(fieldValue) > -1) {
                    fieldValue += "_" + new Date().getTime();
                }
            } else {
                fieldValue = "step_" + new Date().getTime();
            }
            return fieldValue;
        },

        /*
         * Updates the widget configuration with a new step
         * configuration. @param {object} step - The step
         * configuration
         */
        _saveStep: function(step) {
            var stepID = step.ID;
            var editingStep = configWidget.element.data("editing_step");

            if ($(".ax-step-content").length) {
                $(".ax-step-content").remove();
            }
            if (configWidget.options.current_configuration != null) {
                var currentConfig = configWidget.options.current_configuration;
                currentConfig.enroller_steps[stepID] = step;
                if (stepID != editingStep) {
                    delete currentConfig.enroller_steps[editingStep];
                    var index = currentConfig.step_order.indexOf(editingStep);
                    currentConfig.step_order[index] = stepID;
                }

                configWidget._refreshStepTable(currentConfig);
            } else {
                var newConfiguration = {
                    stepID: step
                };
                configWidget._refreshStepTable(newConfiguration);
            }
            configWidget._menuNavigationBack();
        },

        /*
         * Checks what fields are being used and returns an
         * Object containing unused fields.
         */
        _getUnusedFields: function(contactType) {
            var fullFieldList = {};
            var unusedFields = {};

            $.each(configWidget.options.field_options, function(key, value) {
                /*
                 * quick check to determine if it is a
                 * field or function
                 */
                if (value.DISPLAY != null) {
                    fullFieldList[key] = value;
                }
            });
            $.each(fullFieldList, function(key, value) {
                var used = false;
                var updatedKey = configWidget._renameField(key, contactType);
                $.each(configWidget.options.current_configuration.enroller_steps, function(i, step) {
                    if (step.FIELDS != null) {
                        if (step.FIELDS[updatedKey] != null) {
                            used = true;
                            return false;
                        }
                    }
                });
                if (!used) {
                    unusedFields[updatedKey] = value;
                }
            });

            return unusedFields;
        },

        _renameField: function(fieldName, contactType) {
            var splitName = fieldName.split("_");
            if (splitName[0] === "payer" || splitName[0] === "user") {
                splitName.splice(0, 1);
            }
            if (contactType === "student") {
                return splitName.join("_");
            } else {
                return [contactType].concat(splitName).join("_");
            }
        },

        _getUnusedSteps: function() {
            var unusedSteps = {};

            $.each(configWidget.SPECIAL_STEPS, function(key, value) {
                var available = true;
                if (value.AVAILABLE_ENVS != null) {
                    if (!value.AVAILABLE_ENVS[configWidget.options.environment]) {
                        available = false;
                    }
                }
                var used = false;
                if (!$.isEmptyObject(configWidget.options.current_configuration.enroller_steps)) {
                    if (configWidget.options.current_configuration.enroller_steps[key] != null) {
                        // let address be used more than once.
                        if (configWidget.options.current_configuration.enroller_steps[key].TYPE === "address") {
                            used = false;
                        } else {
                            used = true;
                        }
                    }
                }

                if (!used && available) {
                    unusedSteps[key] = value;
                }
            });
            if (configWidget.options.current_configuration.enroller_steps != null) {
                var enquiryFound = false;

                $.each(configWidget.options.current_configuration.enroller_steps, function(key, step) {
                    if (step.TYPE == "course-enquiry") {
                        enquiryFound = true;
                    }
                });

                if (!enquiryFound) {
                    unusedSteps.enquiry = {
                        DISPLAY: "Enquiry",
                        TYPE: "course-enquiry",
                        FIELDS: {},
                        noteCodeID: 88,
                        emailTo: ""
                    };
                }
            }

            return unusedSteps;
        },

        /*
         * Fallback alert method if not specified in options
         * @param {string/html} message - Message to be
         * displayed.
         */
        _alert: function(message) {
            if ($("#temporaryAlert").length) {
                $("#temporaryAlert").popup("destroy");
                $("#temporaryAlert").remove();
            }
            var popup = $('<div id="temporaryAlert"></div>');
            var list = $('<ul data-role="listview"/>');
            var header = $(
                '<li data-role="list-divider" class="ui-btn ui-btn-active ui-btn-icon-right ui-text-left ui-icon-alert">Warning:</li>'
            );
            list.append(header);
            var messageHolder = $('<li style="padding:1em;" />');
            messageHolder.append(message);
            list.append(messageHolder);
            popup.append(list);
            configWidget.element.append(popup);
            popup.hide();
            popup
                .popup({
                    positionTo: "window",
                    corners: false
                })
                .popup("open")
                .show();
            /* correct positioning of poup */
            $("#temporaryAlert-popup").css({
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -100%)",
                width: "20em",
                position: "fixed",
                background: "#fff"
            });
        },
        _toolTip: function(selector, message) {
            var position = $(selector).offset();
            var arrow = "t";
            if (configWidget.options.tooltip_h_offset < 1 && configWidget.options.tooltip_v_offset < 40) {
                arrow = "r";
            } else if (configWidget.options.tooltip_h_offset > 399 && configWidget.options.tooltip_v_offset < 40) {
                arrow = "l";
            }

            var popup = $(
                '<div data-role="popup" data-theme="b" data-arrow="' +
                    arrow +
                    '" id="tooltipPop" style="padding:.5em; max-width: 30em;">' +
                    message +
                    "</div>"
            );
            $.mobile.activePage.append(popup);
            popup.popup().popup("open", {
                x: position.left + configWidget.options.tooltip_h_offset,
                y: position.top + configWidget.options.tooltip_v_offset
            });
            popup.on("popupafterclose", function(event) {
                popup.popup("destroy");
                popup.remove();
            });
        },

        /** *** WP-100 - Events and Triggers **** */

        _createEventConfiguration: function() {},

        _createAddFieldEUI: function() {
            var event = {
                LISTENER: "new_event",
                EVENT_ACTION: "",
                EVENT_TARGET: ""
            };

            configWidget._fieldEventEditor(event);
        },

        /* FIELD VALUES EDITOR : fieldValEd */

        EVENT_FIELDS: {
            LISTENER: {
                TYPE: "text",
                TITLE: "The name of the event to listen for.",
                DISPLAY: "Event Listener"
            },
            EVENT_ACTION: {
                TYPE: "select",
                TITLE:
                    "The type of Action to perform. Hide the field, Clone the contents of another field, show the field. NOTE: Show/Hide/Toggle do not prevent values from being recorded.",
                DISPLAY: "Event Action",
                VALUES: [
                    {
                        DISPLAY: "Clone Value",
                        VALUE: "clone"
                    },
                    {
                        DISPLAY: "Hide Field",
                        VALUE: "hide"
                    },
                    {
                        DISPLAY: "Show Field",
                        VALUE: "show"
                    },
                    {
                        DISPLAY: "Toggle Field Visibility",
                        VALUE: "toggle"
                    },
                    {
                        DISPLAY: "Toggle Field Visibility - Bool",
                        VALUE: "toggle_on_bool"
                    }
                ]
            },
            TARGET_FIELD: {
                TYPE: "select",
                TITLE:
                    "The field to target when cloning / performing a similar action. Not the field to be hidden/shown.",
                DISPLAY: "Event TargetField",
                VALUES: [
                    {
                        DISPLAY: "placeholder",
                        VALUES: "placeholder"
                    }
                ]
            }
        },
        _fieldEventEditor: function(fieldEvent) {
            var stepHolder = $(configWidget.options.field_edit_holder);
            if (stepHolder.find(".ax-step-field-event-edit").length) {
                stepHolder.find(".ax-step-field-event-edit").remove();
            }

            configWidget._menuAddNavigation({
                stateLabel: fieldEvent.EVENT_ID ? fieldEvent.EVENT_ID : "New Event",
                stateID: fieldEvent.EVENT_ID,
                selector: ".ax-step-field-event-edit"
            });

            var fieldVEditorDiv = $('<div class="ax-step-field-event-edit"><h2>Edit Event:</h2></div>');
            stepHolder.append(fieldVEditorDiv);

            $.each(configWidget.EVENT_FIELDS, function(key, event) {
                if (key == "TARGET_FIELD") {
                    var options = [];
                    $.each(configWidget.options.current_configuration.enroller_steps, function(stepKey, stepDetails) {
                        if (stepDetails.FIELDS != null) {
                            if (!$.isEmptyObject(stepDetails.FIELDS)) {
                                $.each(stepDetails.FIELDS, function(fieldKey, fieldDetails) {
                                    options.push({
                                        DISPLAY: fieldDetails.DISPLAY,
                                        VALUE: fieldKey
                                    });
                                });
                            }
                        }
                    });

                    if (options.length > 0) {
                        event.VALUES = options;
                    }
                }

                var id = "ax_field_event_" + key;
                var input = configWidget._createInputField(id, event);
                var inputHolder = configWidget._stepInputFieldHolder(id, event.DISPLAY).append(input);

                if (fieldEvent[key] != null) {
                    if (event.TYPE == "select") {
                        inputHolder.find("select").val(fieldEvent[key]);
                    } else {
                        inputHolder.find("input").val(fieldEvent[key]);
                    }
                }

                fieldVEditorDiv.append(inputHolder);
            });

            fieldVEditorDiv
                .find("select")
                .chosen({
                    width: "400px"
                })
                .trigger("chosen:updated");
            fieldVEditorDiv.prepend(configWidget._createCloseButton("field_events"));

            var saveFieldE = $(
                '<a class="ax-field-save-e ax-field-save ui-btn ui-btn-icon-right ui-icon-check">Save Event</a>'
            );
            configWidget.element.off("save_field_event").on("save_field_event", function() {
                var tempValue = {};
                var valid = true;
                $.each(configWidget.EVENT_FIELDS, function(eventKey, eventDetail) {
                    var field = $("#ax_field_event_" + eventKey);
                    if (field.length) {
                        tempValue[eventKey] = field.val();

                        if (field.val() == null || field.val() == "") {
                            if (eventKey != "TARGET_FIELD") {
                                valid = false;
                            }
                        }
                    }
                });

                if (!valid) {
                    configWidget._toolTip(".ax-save-button", "An Action is required.");
                } else {
                    configWidget._saveFieldEvent(tempValue);
                    stepHolder.find(".ax-step-field-event-edit").remove();
                    configWidget._menuNavigationBack();
                }
            });
            configWidget._addSaveButtonState({ display: "Save Event", event: "save_field_event" });
            fieldVEditorDiv.trigger("ax_config:editor_load");
        },

        _fieldEventsDatatable: function(fieldEvents, location) {
            var feColumns = [
                {
                    title: "EventID",
                    data: "EVENT_ID",
                    visible: false
                },
                {
                    title: "Listener",
                    data: "LISTENER"
                },
                {
                    title: "Event Action",
                    data: "EVENT_ACTION"
                },
                {
                    title: "TARGET_FIELD",
                    data: "TARGET_FIELD",
                    visible: false
                },
                {
                    title: "Action",
                    data: "ACTION"
                }
            ];
            var feData = [];
            feData = configWidget._createFieldEListDTConfig(fieldEvents);
            var feControls = configWidget._createControls("field_events");
            var feTable = $('<table class=" ax-field-event-table" />');
            $(location)
                .append(feControls)
                .append(feTable);
            /* $(location).find('div.ax-step-input-holder.ax-save-step').insertAfter(fieldTable); */

            feTable = feTable.DataTable({
                data: feData,
                columns: feColumns,
                searching: false,
                paging: false,

                info: false,
                compact: true
            });
            configWidget._refreshFieldEventListTable(fieldEvents);
        },

        _createFieldEListDTConfig: function(fieldEvents) {
            var feData = [];
            if (fieldEvents != null) {
                if ($.isArray(fieldEvents)) {
                    if (fieldEvents.length > 0) {
                        $.each(fieldEvents, function(i, eventDetails) {
                            var tempE = {
                                EVENT_ID: eventDetails.LISTENER,
                                LISTENER: eventDetails.LISTENER,
                                EVENT_ACTION: eventDetails.EVENT_ACTION,
                                TARGET_FIELD: eventDetails.TARGET_FIELD,
                                ACTION:
                                    '<div><a class="ax-field-e-action ax-field-e-action-edit">Edit</a><a class="ax-field-e-action ax-field-e-action-delete">Delete</a></div>'
                            };
                            feData.push(tempE);
                        });
                    }
                } else if (!$.isEmptyObject(fieldEvents)) {
                    $.each(fieldEvents, function(eventID, eventDetails) {
                        var tempE = {
                            EVENT_ID: eventID,
                            LISTENER: eventDetails.LISTENER,
                            EVENT_ACTION: eventDetails.EVENT_ACTION,
                            TARGET_FIELD: eventDetails.TARGET_FIELD,
                            ACTION:
                                '<div><a class="ax-field-e-action ax-field-e-action-edit">Edit</a><a class="ax-field-e-action ax-field-e-action-delete">Delete</a></div>'
                        };
                        feData.push(tempE);
                    });
                }
            }
            return feData;
        },

        _saveFieldEvent: function(fieldEvent) {
            var fieldEvents = [];
            fieldEvent.EVENT_ID = fieldEvent.LISTENER;
            if (configWidget.element.find(".ax-field-event-table").length) {
                var fieldETable = configWidget.element.find(".ax-field-event-table").DataTable();
                var currentEvents = fieldETable.data();
                var currentE_Array = [];

                if (currentEvents.length < 1) {
                    fieldEvents.push(fieldEvent);
                    configWidget._refreshFieldEventListTable(fieldEvents);
                } else {
                    var added = false;
                    $.each(currentEvents, function(i, current_event) {
                        if (current_event.EVENT_ID == fieldEvent.EVENT_ID) {
                            current_event = fieldEvent;
                            added = true;
                        }
                        currentE_Array.push(current_event);
                    });
                    if (!added) {
                        currentE_Array.push(fieldEvent);
                    }
                    configWidget._refreshFieldEventListTable(currentE_Array);
                }
            } else {
                fieldEvents.push(fieldEvent);
                configWidget._fieldEventsDatatable(fieldEvents, ".ax-field-event-holder");
                configWidget._refreshFieldEventListTable(fieldEvents);
            }
        },

        /*
         * Clears and updates the datatable with the current
         * configuration @param {object} configuration - The
         * configuration to load. @param {object} step - The
         * step to load.
         */
        _refreshFieldEventListTable: function(fieldEvents) {
            var fieldETable = configWidget.element.find(".ax-field-event-table").DataTable();
            var feData = configWidget._createFieldEListDTConfig(fieldEvents);

            if (feData != null) {
                fieldETable
                    .clear()
                    .rows.add(feData)
                    .draw();

                $(".ax-config-controls.events").show();
                if (configWidget.options.ax_ui) {
                } else {
                    $(".ax-field-e-action").addClass("ui-btn ui-mini ui-btn-icon-right ui-btn-icon-notext");
                    $(".ax-field-e-action-edit").addClass("ui-icon-edit");
                    $(".ax-field-e-action-delete").addClass("ui-icon-delete");
                    $(".ax-field-e-action").css({
                        display: "inline-block",
                        overflow: "inherit"
                    });

                    configWidget.element.find(".ax-field-event-table").off("click", ".ax-field-e-action-edit");
                    configWidget.element.find(".ax-field-event-table").off("click", ".ax-field-e-action-delete");

                    configWidget.element
                        .find(".ax-field-event-table")
                        .on("click", ".ax-field-e-action-edit", function(e) {
                            var selectedEvent = fieldETable.row($(this).closest("tr")).data();
                            configWidget._fieldEventEditor(selectedEvent);
                            configWidget._toggleFieldEList(true);
                        });

                    configWidget.element
                        .find(".ax-field-event-table")
                        .on("click", ".ax-field-e-action-delete", function(e) {
                            var selectedField = fieldETable
                                .row($(this).closest("tr"))
                                .remove()
                                .draw();
                        });
                }
            } else {
                fieldETable.clear();
                configWidget.element
                    .find(".ax-field-event-table")
                    .closest(".dataTables_wrapper")
                    .hide();
            }
        },

        /** * Event trigger** */

        _createAddFieldTUI: function() {
            var trigger_event = {
                EVENT: "",
                TRIGGER_ON: ""
            };

            configWidget._fieldTriggerEditor(trigger_event);
        },

        /* FIELD VALUES EDITOR : fieldValEd */

        TRIGGER_FIELDS: {
            EVENT: {
                TYPE: "text",
                TITLE: "The name of the Event to trigger.",
                DISPLAY: "Trigger Event"
            },
            TRIGGER_ON: {
                TYPE: "select",
                TITLE: "The method for the trigger to be fired (click, change, input)",
                DISPLAY: "Trigger On",
                VALUES: [
                    {
                        DISPLAY: "Click Event",
                        VALUE: "click"
                    },
                    {
                        DISPLAY: "Input Event",
                        VALUE: "input"
                    },
                    {
                        DISPLAY: "Change (value change)",
                        VALUE: "change"
                    }
                ]
            },
            VALUE_RESTRICTION: {
                TYPE: "text",
                TITLE: "Only fire event on this value being selected",
                DISPLAY: "Restrict to Value"
            }
        },
        _fieldTriggerEditor: function(fieldtrigger) {
            var stepHolder = $(configWidget.options.field_edit_holder);
            if (stepHolder.find(".ax-step-field-trigger-edit").length) {
                stepHolder.find(".ax-step-field-trigger-edit").remove();
            }

            configWidget._menuAddNavigation({
                stateLabel: fieldtrigger.EVENT ? fieldtrigger.EVENT : "New Trigger",
                stateID: fieldtrigger.TRIGGER_ID,
                selector: ".ax-step-field-trigger-edit"
            });
            var fieldVEditorDiv = $('<div class="ax-step-field-trigger-edit"><h2>Edit Trigger:</h2></div>');
            stepHolder.append(fieldVEditorDiv);

            $.each(configWidget.TRIGGER_FIELDS, function(key, trigger) {
                var id = "ax_field_trigger_" + key;
                var input = configWidget._createInputField(id, trigger);
                var inputHolder = configWidget._stepInputFieldHolder(id, trigger.DISPLAY).append(input);

                if (fieldtrigger[key] != null) {
                    if (trigger.TYPE == "select") {
                        inputHolder.find("select").val(fieldtrigger[key]);
                    } else {
                        inputHolder.find("input").val(fieldtrigger[key]);
                    }
                }

                fieldVEditorDiv.append(inputHolder);
            });

            fieldVEditorDiv
                .find("select")
                .chosen({
                    width: "400px"
                })
                .trigger("chosen:updated");
            fieldVEditorDiv.prepend(configWidget._createCloseButton("field_trigger"));

            var saveFieldT = $(
                '<a class="ax-field-save-t ax-field-save ui-btn ui-btn-icon-right ui-icon-check">Save Trigger</a>'
            );
            configWidget.element.off("save_field_trigger").on("save_field_trigger", function() {
                var tempValue = {};
                var valid = true;
                $.each(configWidget.TRIGGER_FIELDS, function(triggerKey, triggerDetail) {
                    var field = $("#ax_field_trigger_" + triggerKey);
                    if (field.length) {
                        tempValue[triggerKey] = field.val();

                        if (field.val() == null || field.val() == "") {
                            if (triggerKey != "VALUE_RESTRICTION") {
                                valid = false;
                            }
                        }
                    }
                });

                if (!valid) {
                    configWidget._toolTip(".ax-save-button", "An Action is required.");
                } else {
                    configWidget._saveFieldTrigger(tempValue);
                    stepHolder.find(".ax-step-field-trigger-edit").remove();
                    configWidget._menuNavigationBack();
                }
            });
            configWidget._addSaveButtonState({ display: "Save Trigger", event: "save_field_trigger" });
            fieldVEditorDiv.trigger("ax_config:editor_load");
        },

        _fieldTriggersDatatable: function(fieldtriggers, location) {
            var feColumns = [
                {
                    title: "triggerID",
                    data: "TRIGGER_ID",
                    visible: false
                },
                {
                    title: "Event",
                    data: "EVENT"
                },
                {
                    title: "Trigger On",
                    data: "TRIGGER_ON"
                },
                {
                    title: "Action",
                    data: "ACTION"
                },
                {
                    title: "valueRestriction",
                    data: "VALUE_RESTRICTION",
                    visible: false
                }
            ];
            var feData = [];
            feData = configWidget._createFieldTListDTConfig(fieldtriggers);
            var feControls = configWidget._createControls("field_trigger");
            var feTable = $('<table class=" ax-field-trigger-table" />');
            $(location)
                .append(feControls)
                .append(feTable);
            /* $(location).find('div.ax-step-input-holder.ax-save-step').insertAfter(fieldTable); */

            feTable = feTable.DataTable({
                data: feData,
                columns: feColumns,
                searching: false,
                paging: false,

                info: false,
                compact: true
            });
            configWidget._refreshFieldTriggerListTable(fieldtriggers);
        },

        _createFieldTListDTConfig: function(fieldtriggers) {
            var feData = [];
            if (fieldtriggers != null) {
                if ($.isArray(fieldtriggers)) {
                    if (fieldtriggers.length > 0) {
                        $.each(fieldtriggers, function(i, triggerDetails) {
                            var tempE = {
                                TRIGGER_ID: triggerDetails.EVENT + "_" + triggerDetails.TRIGGER_ON,
                                TRIGGER_ON: triggerDetails.TRIGGER_ON,
                                EVENT: triggerDetails.EVENT,
                                VALUE_RESTRICTION:
                                    triggerDetails.VALUE_RESTRICTION == null ? "" : triggerDetails.VALUE_RESTRICTION,
                                ACTION:
                                    '<div><a class="ax-field-t-action ax-field-t-action-edit">Edit</a><a class="ax-field-t-action ax-field-t-action-delete">Delete</a></div>'
                            };
                            feData.push(tempE);
                        });
                    }
                } else if (!$.isEmptyObject(fieldtriggers)) {
                    $.each(fieldtriggers, function(triggerID, triggerDetails) {
                        var tempE = {
                            TRIGGER_ID: triggerDetails.EVENT + "_" + triggerDetails.TRIGGER_ON,
                            TRIGGER_ON: triggerDetails.TRIGGER_ON,
                            EVENT: triggerDetails.EVENT,
                            VALUE_RESTRICTION:
                                triggerDetails.VALUE_RESTRICTION == null ? "" : triggerDetails.VALUE_RESTRICTION,
                            ACTION:
                                '<div><a class="ax-field-t-action ax-field-t-action-edit">Edit</a><a class="ax-field-t-action ax-field-t-action-delete">Delete</a></div>'
                        };
                        feData.push(tempE);
                    });
                }
            }
            return feData;
        },

        _saveFieldTrigger: function(fieldtrigger) {
            var fieldtriggers = [];
            fieldtrigger.TRIGGER_ID = fieldtrigger.EVENT + "_" + fieldtrigger.TRIGGER_ON;
            if (configWidget.element.find(".ax-field-trigger-table").length) {
                var fieldETable = configWidget.element.find(".ax-field-trigger-table").DataTable();
                var currenttriggers = fieldETable.data();
                var currentE_Array = [];

                if (currenttriggers.length < 1) {
                    fieldtriggers.push(fieldtrigger);
                    configWidget._refreshFieldTriggerListTable(fieldtriggers);
                } else {
                    var added = false;
                    $.each(currenttriggers, function(i, current_trigger) {
                        if (current_trigger.TRIGGER_ID == fieldtrigger.TRIGGER_ID) {
                            current_trigger = fieldtrigger;
                            added = true;
                        }
                        currentE_Array.push(current_trigger);
                    });
                    if (!added) {
                        currentE_Array.push(fieldtrigger);
                    }
                    configWidget._refreshFieldTriggerListTable(currentE_Array);
                }
            } else {
                fieldtriggers.push(fieldtrigger);
                configWidget._fieldTriggersDatatable(fieldtriggers, ".ax-field-trigger-holder");
                configWidget._refreshFieldTriggerListTable(fieldtriggers);
            }
        },

        /*
         * Clears and updates the datatable with the current
         * configuration @param {object} configuration - The
         * configuration to load. @param {object} step - The
         * step to load.
         */
        _refreshFieldTriggerListTable: function(fieldtriggers) {
            var fieldETable = configWidget.element.find(".ax-field-trigger-table").DataTable();
            var feData = configWidget._createFieldTListDTConfig(fieldtriggers);

            if (feData != null) {
                fieldETable
                    .clear()
                    .rows.add(feData)
                    .draw();

                $(".ax-config-controls.triggers").show();
                if (configWidget.options.ax_ui) {
                } else {
                    $(".ax-field-t-action").addClass("ui-btn ui-mini ui-btn-icon-right ui-btn-icon-notext");
                    $(".ax-field-t-action-edit").addClass("ui-icon-edit");
                    $(".ax-field-t-action-delete").addClass("ui-icon-delete");
                    $(".ax-field-t-action").css({
                        display: "inline-block",
                        overflow: "inherit"
                    });

                    configWidget.element.find(".ax-field-trigger-table").off("click", ".ax-field-t-action-edit");
                    configWidget.element.find(".ax-field-trigger-table").off("click", ".ax-field-t-action-delete");

                    configWidget.element
                        .find(".ax-field-trigger-table")
                        .on("click", ".ax-field-t-action-edit", function(e) {
                            var selectedtrigger = fieldETable.row($(this).closest("tr")).data();
                            configWidget._fieldTriggerEditor(selectedtrigger);
                            configWidget._toggleFieldTList(true);
                        });

                    configWidget.element
                        .find(".ax-field-trigger-table")
                        .on("click", ".ax-field-t-action-delete", function(e) {
                            var selectedField = fieldETable
                                .row($(this).closest("tr"))
                                .remove()
                                .draw();
                        });
                }
            } else {
                fieldETable.clear();
                configWidget.element
                    .find(".ax-field-trigger-table")
                    .closest(".dataTables_wrapper")
                    .hide();
            }
        }
    });
});
