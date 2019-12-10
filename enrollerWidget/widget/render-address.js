jQuery(function($) {
    $.widget("axcelerate.render_address", {
        options: {
            fieldRenderer: function() {
                return null;
            },
            updateField: function() {
                return null;
            },
            getInputValue: function() {
                return null;
            },
            headerRenderer: function() {},
            fieldPrefix: "",
            addressTypes: ["street_address", "postal_address"],
            country_restriction: "au",
            required: false,
            attachEventsTo: null,
            countryList: [],
            // Clone default fields to avoid reference weirdness
            street_address_fields: $.extend(
                {},
                {
                    SPOBOX: ENROLLER_FIELD_DEFAULTS.SPOBOX,
                    SBUILDINGNAME: ENROLLER_FIELD_DEFAULTS.SBUILDINGNAME,
                    SUNITNO: ENROLLER_FIELD_DEFAULTS.SUNITNO,
                    SSTREETNO: ENROLLER_FIELD_DEFAULTS.SSTREETNO,
                    SSTREETNAME: ENROLLER_FIELD_DEFAULTS.SSTREETNAME,
                    SCITY: ENROLLER_FIELD_DEFAULTS.SCITY,
                    SPOSTCODE: ENROLLER_FIELD_DEFAULTS.SPOSTCODE,
                    SSTATE: ENROLLER_FIELD_DEFAULTS.SSTATE,
                    SCOUNTRYID: ENROLLER_FIELD_DEFAULTS.SCOUNTRYID
                }
            ),
            postal_address_fields: $.extend(
                {},
                {
                    POBOX: ENROLLER_FIELD_DEFAULTS.POBOX,
                    BUILDINGNAME: ENROLLER_FIELD_DEFAULTS.BUILDINGNAME,
                    UNITNO: ENROLLER_FIELD_DEFAULTS.UNITNO,
                    STREETNO: ENROLLER_FIELD_DEFAULTS.STREETNO,
                    STREETNAME: ENROLLER_FIELD_DEFAULTS.STREETNAME,
                    CITY: ENROLLER_FIELD_DEFAULTS.CITY,
                    POSTCODE: ENROLLER_FIELD_DEFAULTS.POSTCODE,
                    STATE: ENROLLER_FIELD_DEFAULTS.STATE,
                    COUNTRYID: ENROLLER_FIELD_DEFAULTS.COUNTRYID
                }
            )
        },
        _create: function() {
            var $this = this;
            $this._renderContent();
        },

        getFieldsList: function() {
            return {
                street_address: this.options.street_address_fields,
                postal_address: this.options.postal_address_fields
            };
        },
        /**
         * Returns an object containing all fields used in the form, with the keys prefixed.
         */
        getFieldListWithPrefix: function() {
            var $this = this;
            var fields = $this.getFieldsList();
            if ($this.options.fieldPrefix !== "") {
                var fieldsFull = {};

                for (var index = 0; index < $this.options.addressTypes.length; index++) {
                    var type = $this.options.addressTypes[index];

                    $.each(fields[type], function(key, field) {
                        fieldsFull[$this.options.fieldPrefix + key] = field;
                    });
                }

                return fieldsFull;
            } else {
                var fieldsFull = {};
                for (var index = 0; index < $this.options.addressTypes.length; index++) {
                    var type = $this.options.addressTypes[index];
                    fieldsFull = $.extend(fieldsFull, fields[type]);
                }

                return fieldsFull;
            }
        },
        _renderContent: function() {
            var $this = this;
            var holder = $this.element;
            var fields = $this.getFieldsList();
            var i = 0;
            for (var index = 0; index < $this.options.addressTypes.length; index++) {
                var type = $this.options.addressTypes[index];

                var prefix = $this.options.fieldPrefix + type;
                var autoInput = $('<input id="' + prefix + '" placeholder="Enter your address" type="text"></input>');
                autoInput.addClass("address-lookup");
                var addressHolder = $("<div></div>")
                    .addClass("ew-address-group")
                    .attr("id", prefix + "_holder");
                addressHolder.prepend($('<div class="auto-complete"></div>').append(autoInput));
                var addressRequiredGroupHolder = $("<div></div>").addClass("enroller-fieldgroup");

                var holderInserted = false;
                if (index > 0 && type === "postal_address") {
                    var test = {
                        TRIGGER_EVENTS: {
                            postal_copy_click: {
                                TRIGGER_ON: "click",
                                EVENT: $this.options.fieldPrefix + "_postal_copy",
                                VALUE_RESTRICTION: ""
                            }
                        },
                        ID: "addressStreetSame",
                        DISPLAY: "Copy Street Address to Postal",
                        TYPE: "button",
                        CUSTOM: true,
                        REQUIRED: false,
                        INFO_ONLY: true
                    };
                    var inputField = $this.options.fieldRenderer($this.options.fieldPrefix + "street_same", test);
                    addressHolder.prepend(inputField);
                    if ($this.options.attachEventsTo) {
                        $($this.options.attachEventsTo).on(
                            "enroller:" + $this.options.fieldPrefix + "_postal_copy",
                            function() {
                                $.each(fields[type], function(key, field) {
                                    var streetVal = $this.options.getInputValue(
                                        $this.options.fieldPrefix + "S" + key,
                                        field
                                    );

                                    $this.options.updateField($("#" + $this.options.fieldPrefix + key), streetVal);
                                });
                            }
                        );
                    }
                }
                $.each(fields[type], function(key, field) {
                    var location = addressHolder;
                    field.DISPLAY = field.DISPLAY.replace("Street Address - ", "");
                    field.DISPLAY = field.DISPLAY.replace("Postal - ", "");
                    // Handle required state.
                    switch (key) {
                        case "CITY":
                        case "STATE":
                        case "POSTCODE":
                        case "SCITY":
                        case "SSTATE":
                        case "SPOSTCODE":
                            field.REQUIRED = $this.options.required;
                            break;
                        case "COUNTRYID":
                        case "SCOUNTRYID":
                            field.VALUES = $this.options.countryList;
                            field.REQUIRED = $this.options.required;
                            break;
                        case "STREETNO":
                        case "SSTREETNO":
                        case "STREETNAME":
                        case "SSTREETNAME":
                        case "POBOX":
                        case "SPOBOX":
                            if ($this.options.required) {
                                location = addressRequiredGroupHolder;
                                if (!holderInserted) {
                                    addressHolder.append(addressRequiredGroupHolder);
                                }
                            }
                            break;
                        default:
                            break;
                    }

                    var inputField = $this.options.fieldRenderer($this.options.fieldPrefix + key, field, i);
                    i++;
                    location.append(inputField);
                    if (key.indexOf("POBOX") > -1 && $this.options.required) {
                        location.append("<hr />");
                    }
                });
                if ($this.options.required) {
                    addressRequiredGroupHolder.addClass("required");
                }
                holder.append(addressHolder);
                var options = { types: ["address"] };
                if ($this.options.country_restriction !== "") {
                    options.componentRestrictions = { country: $this.options.country_restriction };
                }
                if (type === "street_address") {
                    var AutoCompleteStreet = new google.maps.places.Autocomplete(
                        document.getElementById(prefix),
                        options
                    );
                    AutoCompleteStreet.setFields(["place_id", "address_components"]);
                    AutoCompleteStreet.addListener("place_changed", function() {
                        var place = AutoCompleteStreet.getPlace();

                        $this._updateFields($this.options.fieldPrefix + "S", place, type);
                    });

                    var headerInfo = {
                        INFO_ONLY: true,
                        TYPE: "header",
                        DISPLAY: "Street Address:"
                    };
                    addressHolder.prepend($this.options.headerRenderer("sa_header", headerInfo));
                } else {
                    var AutoCompletePostal = new google.maps.places.Autocomplete(
                        document.getElementById(prefix),
                        options
                    );
                    AutoCompletePostal.setFields(["place_id", "address_components"]);
                    AutoCompletePostal.addListener("place_changed", function() {
                        var place = AutoCompletePostal.getPlace();

                        $this._updateFields($this.options.fieldPrefix + "", place, type);
                    });
                    var headerInfo = {
                        INFO_ONLY: true,
                        TYPE: "header",
                        DISPLAY: "Postal Address:"
                    };
                    addressHolder.prepend($this.options.headerRenderer("pa_header", headerInfo));
                }
            }
        },
        _clearFields: function(prefix, type) {
            var $this = this;
            var fieldList = $this.getFieldsList()[type];
            $.each(fieldList, function(key, field) {
                $this.options.updateField($("#" + prefix + key), "");
            });
        },
        _updateFields: function(prefix, placeObj, type) {
            var $this = this;

            var placeID = $this.element.data("place_id" + prefix);
            if (placeID !== placeObj.place_id) {
                $this._clearFields(prefix, type);
            }

            for (var index = 0; index < placeObj.address_components.length; index++) {
                var placeComp = placeObj.address_components[index];

                var fieldID = "";
                switch (placeComp.types[0]) {
                    case "street_number":
                        fieldID = "STREETNO";
                        break;
                    case "route":
                        fieldID = "STREETNAME";
                        break;
                    case "locality":
                        fieldID = "CITY";
                        break;
                    case "administrative_area_level_1":
                        fieldID = "STATE";
                        break;
                    case "country":
                        fieldID = "COUNTRYID";
                        break;
                    case "postal_code":
                        fieldID = "POSTCODE";
                        break;
                    case "subpremise":
                        fieldID = "UNITNO";
                        break;
                    default:
                        break;
                }
                if (fieldID === "STATE") {
                    $this.options.updateField($("#" + prefix + fieldID), placeComp.short_name);
                } else if (fieldID === "COUNTRYID") {
                    var test = $("#" + prefix + fieldID + " option")
                        .filter(function() {
                            return $(this).html() === placeComp.long_name;
                        })
                        .val();

                    $this.options.updateField($("#" + prefix + fieldID), test);
                } else {
                    $this.options.updateField($("#" + prefix + fieldID), placeComp.long_name);
                }
            }
        }
    });
});
