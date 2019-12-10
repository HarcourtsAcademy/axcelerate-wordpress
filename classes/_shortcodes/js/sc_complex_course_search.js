(function($) {
    /**
     * TODO:
     *
     * Ajax function to initiate search
     *
     * Likely will need something to setup the controls? Or should that be a secondary js file?
     */

    var ajaxURL = "";
    if (window.ax_course_vars != null) {
        ajaxURL = window.ax_course_vars.ajaxURL;
    }
    var DATA_TABLE = null;
    function dateFromSQL(d) {
        if (d != null && typeof d === "string") {
            var dS = d.replace(/-/g, "/");
            return new Date(dS);
        } else {
            return null;
        }
    }
    function dateToSQL(d) {
        d = new Date(d);
        var day = ("0" + d.getDate()).slice(-2);
        var month = ("0" + (d.getMonth() + 1)).slice(-2);
        var converted = d.getFullYear() + "-" + month + "-" + day;
        return converted;
    }
    $("#ax_complex_finish_date").datepicker({
        format: "dd/mm/yyyy",
        orientation: "bottom auto"
    });
    $("#ax_complex_start_date").datepicker({
        format: "dd/mm/yyyy",
        orientation: "bottom auto"
    });

    //Animated "fake" progress overlay
    function progressOverlay(progress) {
        if (jQuery.active > 0) {
            if (!$("div.overlay").length) {
                var overlay = $('<div class="overlay"  />');
                var pBar = $('<div class="progress" />');
                var bar = $(
                    '<div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"  aria-valuemin="0" aria-valuemax="100" ></div>'
                );
                overlay.append(pBar.append(bar));
                $(".ax-complex-course-search").append(overlay);
            }
            if (progress + 10 > 100) {
                progress = 0;
            } else {
                progress = progress + 10;
            }
            $("div.progress-bar")
                .attr("aria-valuenow", progress)
                .css({ width: progress + "%" });
            setTimeout(function() {
                progressOverlay(progress);
            }, 200);
        }
    }

    $(document).ajaxStart(function(e) {
        progressOverlay(0);
    });
    $(document).ajaxStop(function(e) {
        if ($("div.overlay").length > 0) {
            $("div.overlay").remove();
        }
    });

    function buildParams() {
        var params = {
            action: "ax_complex_course_search",
            domains: ax_course_vars.domains,
            courses: Object.keys(ax_course_vars.courses),
            show_empty_domains: ax_course_vars.show_empty_domains == true,
            course_type: ax_course_vars.course_type,
            workshop_default_period:ax_course_vars.workshop_default_period
        };
        if ($("#ax_complex_finish_date").length) {
            var fDate = $("#ax_complex_finish_date")
                .data("datepicker")
                .getFormattedDate("yyyy-mm-dd");
            if (fDate != null && fDate != "") {
                try {
                    fDate = new Date(fDate);
                    fDate.setDate(fDate.getDate() + 1);
                    params.finish_date = dateToSQL(fDate);
                } catch (error) {}
            }
        }
        if ($("#ax_complex_start_date").length) {
            var sDate = $("#ax_complex_start_date")
                .data("datepicker")
                .getFormattedDate("yyyy-mm-dd");
            if (sDate != null && sDate != "") {
                try {
                    sDate = new Date(sDate);
                    sDate.setDate(sDate.getDate() - 1);
                    params.start_date = dateToSQL(sDate);
                } catch (error) {}
            }
        }
        if ($("#ax_complex_domain").length) {
            var domain_id = $("#ax_complex_domain").val();
            if (domain_id !== "" && domain_id != null && domain_id.indexOf("Select") < 0) {
                params.domain_id = domain_id;
            }
        }
        if ($("#ax_complex_course").length) {
            var course_id = $("#ax_complex_course").val();
            if (course_id !== "" && course_id != null && course_id.indexOf("Select") < 0) {
                params.course_id = course_id;
            }
        }
        if ($("#ax_complex_instance_id").length) {
            var instance_id = $("#ax_complex_instance_id").val();
            if (instance_id !== "" && instance_id != null) {
                //See if it is numeric
                var reg = new RegExp(/^[0-9]*$/gm);
                if (reg.test(instance_id)) {
                    params.instance_id = instance_id;
                } else {
                    params.course_code = instance_id;
                }
            }
        }

        return params;
    }
    function fetchCourses() {
        var params = buildParams();
        jQuery.ajax({
            type: "POST",
            url: ajaxURL,
            dataType: "JSON",
            data: params,
            success: function(result) {
                if (DATA_TABLE != null) {
                    DATA_TABLE.clear();
                    if (result.length > 0) {
                        DATA_TABLE.rows.add(result);
                    }

                    DATA_TABLE.draw();
                } else {
                    setupDatatable(result);
                }
            }
        });
    }

    fetchCourses();

    $("#ax_complex_search").on("click", fetchCourses);
    function dateRenderer(data, type, row) {
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        if (type === "display" || type === "filter") {
            if (data == null) {
                return "";
            }
            var d;
            if (typeof data === "string") {
                d = dateFromSQL(data);
            } else {
                d = new Date(data);
            }

            return days[d.getDay()] + ", " + d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
        }
        if (typeof data === "string") {
            return dateFromSQL(data);
        } else {
            return new Date(data);
        }
    }
    function locationRenderer(data, type, row) {
        if (type === "display") {
            return '<div data-loc="' + data + '">' + data + "</div>";
        }

        return data;
    }
    function venueRenderer(data, type, row) {
        var venue = null;
        if (window.ax_course_vars.venues != null && data != null && data != 0) {
            venue = window.ax_course_vars.venues[data];
        }
        if (venue != null) {
            if (type === "display") {
                var streetAddress = venue.SADDRESS1;
                var streetAddress2 = venue.SADDRESS2;
                if (streetAddress2 !== null && streetAddress2 !== ""){
                    streetAddress += " / " + streetAddress2;
                }
                var tip =
                    "<p>" +
                    venue.NAME +
                    "</p>" +
                    "<p>" +
                    streetAddress +
                    "</p>" +
                    "<p>" +
                    venue.SCITY +
                    ", " +
                    venue.SSTATE +
                    " " +
                    venue.SPOSTCODE +
                    "</p>";

                var render =
                    '<span title="' + tip + '" data-toggle="tooltip" data-html="true" data-placement="bottom">';
                if (row["LOCATION"] != null && row["LOCATION"] != "") {
                    render += row["LOCATION"];
                } else {
                    render += venue.NAME;
                }
                return render + "</span>";
            } else {
                return JSON.stringify(venue);
            }
        } else {
            return locationRenderer(row["LOCATION"], type, row);
        }
    }
    function costRenderer(data, type, row) {
        if (type === "display") {
            if (data == null || data == "") {
                data = 0;
            }
            if (data == 0) {
                return "-";
            }
            try {
                data = parseFloat(data);
                data = data.toLocaleString("en-AU", { style: "currency", currency: "AUD" });
            } catch (e) {
                return data;
            }
            return data;
        }

        return data;
    }
    function enrolRenderer(data, type, row) {
        var url = "";
        if (window.ax_course_vars != null) {
            url = ax_course_vars.drilldown_url;
        }
        var qVars = url.indexOf("?");
        if (qVars > 0 && qVars != url.length - 1) {
            url += "&";
        } else if (qVars < 0) {
            url += "?";
        }

        url = url + "instance_id=" + data + "&course_type=" + row.TYPE + "&course_id=" + row.ID;

        if (type === "display") {
            if (row.ENROLMENTOPEN) {
                return (
                    '<a class="ax-enrol-link btn btn-outline-primary" data-instance="' +
                    data +
                    '" href="' +
                    url +
                    '" >Enrol</a>'
                );
            } else {
                return '<a class="ax-enrol-closed btn btn-outline-secondary disabled" style="cursor:not-allowed;">Closed</a>';
            }
        }
        return data;
    }
    function vacancyRenderer(data, type, row) {
        if (type === "display") {
            return row.PARTICIPANTVACANCY ;
        }
        return data;
    }

    /* remove seconds, convert from 24-12 hour time and set AM/PM */
    function cleanTime(timeString) {
        /* remove all characters outside of ASCII range for IE11*/
        timeString = timeString.replace(/[^\x00-\x7F]/g, "");
        var parts = timeString.split(":");
        var hours = parseInt(parts[0], 10);
        var am_pm = "AM";
        if (hours > 12) {
            hours = hours - 12;
            am_pm = "PM";
        } else if (hours == 12) {
            am_pm = "PM";
        }
        else if (hours == 0) {
            hours = 12;
        }
        if ((parts[2] != null) && (parts[2].indexOf("M") > -1 || parts[2].indexOf("m") > -1)) {
            am_pm = parts[2].substring(parts[2].length - 2, parts[2].length);
        }
        return hours + ":" + parts[1] + " " + am_pm.toUpperCase();
    }

    function complexDateRender(data, type, row) {
        if (type === "display" || type === "filter") {
            var tip = "";
            var button = "";
            for (var index = 0; index < row.COMPLEXDATES.length; index++) {
                var complex = row.COMPLEXDATES[index];
                var date = dateFromSQL(complex.DATE);
                button += "<span>" + date.toLocaleDateString("en-AU") + "</span>";
                tip +=
                    "<p>" +
                    date.toLocaleDateString("en-AU") +
                    " :  <br/> " +
                    cleanTime(complex.STARTTIME) +
                    " - " +
                    cleanTime(complex.ENDTIME) +
                    "</p>";
            }
            return (
                '<div data-toggle="tooltip" data-placement="right" data-html="true"  class="input-group-text" title="' +
                tip +
                '"><div class="ax-complex-date">' +
                button +
                "</div></div>"
            );
        }
        return data;
    }
    function complexTimeRender(data, type, row) {
        if (type === "display" || type === "filter") {
            var tip = "";
            var button = "";
            var previousStart = "";
            var previousEnd = "";
            for (var index = 0; index < row.COMPLEXDATES.length; index++) {
                var complex = row.COMPLEXDATES[index];
                var date = dateFromSQL(complex.DATE);
                if(previousStart === complex.STARTTIME && previousEnd === complex.ENDTIME){
                    // skip
                }
                else{
                    button += "<span>" + cleanTime(complex.STARTTIME) + " - " + cleanTime(complex.ENDTIME) + "</span>";
                    previousStart = complex.STARTTIME;
                    previousEnd = complex.ENDTIME;
                }
                
                tip +=
                    "<p>" +
                    date.toLocaleDateString("en-AU") +
                    " : <br/> " +
                    cleanTime(complex.STARTTIME) +
                    " - " +
                    cleanTime(complex.ENDTIME) +
                    "</p>";
            }
            return (
                '<div data-toggle="tooltip" data-placement="right" data-html="true"  class="input-group-text" title="' +
                tip +
                '"><div class="ax-complex-date">' +
                button +
                "</div></div>"
            );
        }
        return data;
    }

    function dateFullRender(data, type, row) {
        var date1 = row.STARTDATE;
        var date2 = row.FINISHDATE;
        if (date1 != null && date2 != null) {
            date1 = dateFromSQL(date1);
            date2 = dateFromSQL(date2);
        }
        if (row.TYPE !== "w" && date1 != null && date2 != null) {
            return date1.toLocaleDateString("en-AU") + " - " + date2.toLocaleDateString("en-AU");
        } else if (row.TYPE !== "w") {
            return "-";
        }

        if (type === "display" || type === "filter") {
            if (row.COMPLEXDATES != null) {
                if (row.COMPLEXDATES.length > 0) {
                    return complexDateRender(data, type, row);
                }
            }

            if (date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth()) {
                var tip =
                    date1.toLocaleDateString("en-AU") +
                    " : " +
                    cleanTime(date1.toLocaleTimeString("en-AU")) +
                    " - " +
                    cleanTime(date2.toLocaleTimeString("en-AU"));
                return (
                    '<div data-toggle="tooltip" data-placement="right" class="input-group-text" title="' +
                    tip +
                    '">' +
                    dateRenderer(data, type, row) + 
                    "</div>"
                );
            } else {
                var tip = date1.toLocaleDateString("en-AU") + " : ";
                cleanTime(date1.toLocaleTimeString("en-AU")) + " - " + date2.toLocaleDateString("en-AU");
                " : " + +cleanTime(date2.toLocaleTimeString("en-AU"));

                return (
                    '<div data-toggle="tooltip" data-placement="right" class="input-group-text" title="' +
                    tip +
                    '">' +
                    dateRenderer(date1, type, row) +
                    "<br/> - <br/>" +
                    dateRenderer(date2, type, row) +
                    "</div>"
                );
            }
        }
        return date1;
    }


    function timeRenderer(data, type, row) {
        var date1 = row.STARTDATE;
        var date2 = row.FINISHDATE;
        if (date1 != null && date2 != null) {
            date1 = dateFromSQL(date1);
            date2 = dateFromSQL(date2);
        }
        if (row.TYPE !== "w" && date1 != null && date2 != null) {
            return date1.toLocaleDateString("en-AU") + " - " + date2.toLocaleDateString("en-AU");
        } else if (row.TYPE !== "w") {
            return "-";
        }

        if (type === "display" || type === "filter") {
            if (row.COMPLEXDATES != null) {
                if (row.COMPLEXDATES.length > 0) {
                    return complexTimeRender(data, type, row);
                }
            }

            if (date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth()) {
                var tip =
                    date1.toLocaleDateString("en-AU") +
                    " : " +
                    cleanTime(date1.toLocaleTimeString("en-AU")) +
                    " - " +
                    cleanTime(date2.toLocaleTimeString("en-AU"));
                return (
                    '<div data-toggle="tooltip" data-placement="right" class="input-group-text" title="' +
                    tip +
                    '">' +
                    cleanTime(date1.toLocaleTimeString("en-AU")) +
                    "<br/> - <br/>" +
                    cleanTime(date2.toLocaleTimeString("en-AU"))+
                    "</div>"
                );
            } else {
                var tip = date1.toLocaleDateString("en-AU") + " : ";
                cleanTime(date1.toLocaleTimeString("en-AU")) + " - " + date2.toLocaleDateString("en-AU");
                " : " + +cleanTime(date2.toLocaleTimeString("en-AU"));

                return (
                    '<div data-toggle="tooltip" data-placement="right" class="input-group-text" title="' +
                    tip +
                    '">' +
                    date1.toLocaleTimeString("en-AU") +
                    "<br/> - <br/>" +
                    date2.toLocaleTimeString("en-AU") +
                    "</div>"
                );
            }
        }
        return date1;
    }
    function renderModal(data) {
        if (ax_course_vars.courses[data.ID] != null) {
            var desc = ax_course_vars.courses[data.ID].SHORTDESCRIPTION;

            var modal =
                '<div class="modal " id="' +
                data.INSTANCEID +
                '_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">';
            modal +=
                ' <div class="modal-dialog modal-dialog-centered" role="document"><div class="modal-content"><div class="modal-header">';
            modal += '<h5 class="modal-title">' + data.CODE + " : " + data.NAME + "</h5>";
            modal +=
                '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
            modal += "</div>";
            modal += '<div class="modal-body">';
            if (desc != null && desc != "") {
                modal += desc;
            }
            modal += "</div>";
            modal += '<div class="modal-footer">';
            modal += enrolRenderer(data.INSTANCEID, "display", data);
            modal += "</div>";
            modal += "</div>";
            return modal;
        }
        return "";
    }
    function nameRenderer(data, type, row) {
        if (type === "display") {
            return (
                '<button type="button" class="btn btn-outline-info ax-modal-link" data-target="#' +
                row.INSTANCEID +
                '_modal"><span>' +
                data +
                "</span></button>" +
                renderModal(row)
            );
        }
        return data;
    }
    function drawSetup() {
        $('[data-toggle="tooltip"]').tooltip();
        $("button.ax-modal-link").on("click", function(e) {
            var button = $(e.target);
            if (!button.hasClass("ax-modal-link")) {
                button = button.closest("button");
            }
            var modalid = button.data("target");
            $(modalid).modal();
        });
    }
    function setupDatatable(data) {
        var datTableColumns = [
            {
                title: "Dates",
                data: "STARTDATE",
                render: dateFullRender
            },
            {
                title: "Time",
                data: "STARTDATE",
                render: timeRenderer
            },
            {
                title: "Start Date",
                data: "STARTDATE",
                render: dateRenderer,
                visible:false,
      
            },
            {
                title: "Name",
                data: "NAME",
                render: nameRenderer
            },
           
            {
                title: "Location",
                data: "VENUECONTACTID",
                render: venueRenderer
            },

            {
                title: "Price",
                data: "COST",
                render: costRenderer
            },
            {
                title: "Spaces",
                data: "PARTICIPANTVACANCY",
                render: vacancyRenderer
            },
            {
                title: "Enrol",
                data: "INSTANCEID",
                render: enrolRenderer,
                sortable: false
            }
        ];
        var dataTableOptions = {
            data: data,
            columns: datTableColumns,
            responsive: true
        };

        DATA_TABLE = $("#ax_course_search_table").DataTable(dataTableOptions);

        drawSetup();
        // Handle tooltips on redraws.
        DATA_TABLE.on("draw", drawSetup);
    }
})(jQuery);
