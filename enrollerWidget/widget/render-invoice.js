jQuery(function($) {
    $.widget("axcelerate.render_invoice", {
        options: {
            invoice_data: null
        },
        _create: function() {
            var $this = this;
            $this._setupDT();
        },

        _buildDTConfig: function() {
            var $this = this;
            var items = [];
            if ($this.options.invoice_data != null) {
                items = $this.options.invoice_data.ITEMS;
            }
            var invoiceData = $this.options.invoice_data;
            if (invoiceData.BALANCE !== invoiceData.PRICEGROSS) {
                var payments = {
                    QTY: "",
                    ITEMCODE: "",
                    DESCRIPTION: "Payments",
                    UNITPRICEGROSS: invoiceData.BALANCE - invoiceData.PRICEGROSS,
                    TOTALGROSS: invoiceData.BALANCE
                };
                items.push(payments);
            }

            return items;
        },
        _setupDT: function() {
            var $this = this;
            var table = $('<table class="invoice-table ui-shadow ui-corner-all" style="font-size:0.85em"></table>');
            table.append(
                '<tfoot><tr> <th colspan="3" style="text-align:right">Total:</th><th></th><th></th></tr></tfoot>'
            );
            $this.element.append(table);
            var columns = [
                { title: "Quantity", data: "QTY", responsivePriority: 5, className: "no-hover center-align" },
                { title: "Code", data: "ITEMCODE", responsivePriority: 5, className: "no-hover center-align" },
                {
                    title: "Description",
                    data: "DESCRIPTION",
                    render: $this.descriptionRenderer,
                    responsivePriority: 1,
                    className: "no-hover"
                },
                {
                    title: "Item Price",
                    data: "UNITPRICEGROSS",
                    render: $this.costRenderer,
                    responsivePriority: 4,
                    className: "no-hover center-align"
                },
                {
                    title: "Total",
                    data: "TOTALGROSS",
                    render: $this.costRenderer,
                    responsivePriority: 1,
                    className: "no-hover center-align",
                    visible: false
                }
            ];
            var dTable = table.DataTable({
                data: $this._buildDTConfig(),
                columns: columns,
                paging: false,
                searching: false,
                ordering: false,
                info: false,
                compact: true,
                responsive: true,
                footerCallback: function(row, data, start, end, display) {
                    var api = this.api(),
                        data;
                    var total = 0;
                    if ($this.options.invoice_data != null) {
                        total = $this.options.invoice_data.BALANCE;
                    } else {
                        total = api
                            .column(4)
                            .data()
                            .reduce(function(a, b) {
                                return a + b;
                            }, 0);
                    }
                    $(api.column(3).footer()).html($this.costRenderer(total, "display"));
                }
            });
            dTable.columns.adjust().draw();
        },
        costRenderer: function(data, type, row) {
            if (type === "display") {
                if (data == null || data == "") {
                    data = 0;
                }
                if (data == 0) {
                    return "-";
                }
                try {
                    var negative = false;
                    if (data < 0) {
                        data = data * -1;
                        negative = true;
                    }
                    data = parseFloat(data);
                    data = data.toLocaleString("en-AU", { style: "currency", currency: "AUD" });
                    if (negative) {
                        data = "(" + data + ")";
                    }
                } catch (e) {
                    return data;
                }
                return data;
            }

            return data;
        },
        descriptionRenderer: function(data, type, row) {
            if (type === "display") {
                var display = $("<span></span>").append(data);
                display.css({
                    float: "left",
                    "text-align": "left"
                });
                return display.prop("outerHTML");
            }

            return data;
        }
    });
});
