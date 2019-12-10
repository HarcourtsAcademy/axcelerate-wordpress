(function( $ ) {
	
	function detectDuplicates(){
		console.log('duplicates');
		var foundList = {};
		$('.type-tribe_events').each(function(i){
			var element = $(this);
			var data = element.data('tribejson');
			if(data != null){
				eventID = data.eventId;
				if(foundList[eventID] != null){
					$(element).addClass('event-duplicate');
				}
				else{
					foundList[eventID] = true;
				}
			}
			
		});
	}
	function delay(state){
		setTimeout(function(){
			if(state == -1){
				detectDuplicates();
			}
			
		}, 10);
	}
	if($('.tribe-events-calendar').length){
		detectDuplicates();
		$(document)
		.ajaxStop(function () {
			delay(-1);
			console.log('delay start');
			
		});
	}
	
	
})( jQuery );