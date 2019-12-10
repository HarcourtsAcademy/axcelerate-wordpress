(function($) {
    var ajaxURL = "";
    if (window.ax_feature_test != null) {
        ajaxURL = window.ax_feature_test.ajaxURL;
    }

    function runTest(testName, resultCallback) {
        var params = {
            action: testName
        };
        if (window._ax_setting_nonce != null) {
            params.setting_nonce = window._ax_setting_nonce;
        }
        jQuery.ajax({
            type: "POST",
            url: ajaxURL,
            dataType: "JSON",
            data: params,
            success: function(result) {
                if (resultCallback != null) {
                    resultCallback(result);
                }
            }
        });
    }

    function updateByStatus(testID, status, message) {
        $("." + testID + " .status")
            .removeClass()
            .addClass("status " + status)
            .empty()
            .append(status)
            .attr("title", message);
            $("." + testID ).off('click').on('click', function(){
                if(message != ""){
                    if($("." + testID + " .message").is(':visible')){
                        $("." + testID + " .message").hide(200);
                    } else{
                        $("." + testID + " .message").show(200);
                    }
                }
            })
        $("." + testID + " .message")
            .removeClass()
            .addClass("message " + status)
            .empty().hide();
        if (message != "") {
            $("." + testID).css('cursor', 'pointer');
            $("." + testID + " .message").append(message);
            $("." + testID + " .status").append('<span class="dashicons dashicons-warning"></span>');
        } 
        else{
            $("." + testID).css('cursor', 'default');
        }
    }

    function updateTestStatus(testID, status, message) {
        switch (status) {
            case true:
            case "success":
                status = "success";
                updateByStatus(testID, status, message);

                break;
            case false:
            case "error":
                status = "error";
                updateByStatus(testID, status, message);

                break;
            case "warning":
                status = "warning";
                updateByStatus(testID, status, message);

                break;
            default:
                status = "pending";
                updateByStatus(testID, status, message);

                break;
        }
    }

    $("#ax_ds_run_test").on("click", function(e) {
        e.preventDefault();
        $("#ax_ds_run_test").hide();

        runTest("ax_run_ds_tests", function(result) {
            $("#ax_ds_run_test").show();
            if (result) {
                var keys = Object.keys(result);
                for (var index = 0; index < keys.length; index++) {
                    var key = keys[index];
                    updateTestStatus(key, result[key].status, result[key].message);
                }
            }
        });
    });
})(jQuery);
