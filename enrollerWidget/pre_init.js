jQuery(document).on("mobileinit", function(event){

	jQuery.mobile.ajaxEnabled = false;
	jQuery.mobile.ajaxLinksEnabled=false;
	jQuery.mobile.keepNative = "header *, footer*, div.main, select";
	jQuery.mobile.ignoreContentEnabled = true;
	//jQuery.mobile.autoInitializePage = false;
});

