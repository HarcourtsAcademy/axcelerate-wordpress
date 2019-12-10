(function( $ ) {
	$(function() {

		if(typeof(jQuery.fn.chosen) !== undefined){
			$('div.ax-course-search-ajax select').chosen({width: '30em', search_contains: true});
		}
		
		$(document)
		.ajaxStart(function () {
			if($('div.ax-course-search-ajax').length){
				$('div.ax-course-search-ajax').trigger('ajax_cs:page_busy');
			}
		})
		.ajaxStop(function () {
			if($('div.ax-course-search-ajax').length){
				$('div.ax-course-search-ajax').trigger('ajax_cs:page_ready');
			}
		});
		
		
		/*register listeners*/
		if($('div.ax-course-search-ajax').length){
			
			$('div.ax-course-search-ajax').on('ajax_cs:page_busy',function(e){
				var ajaxCS = $(this);
				var overlay = $('<div class="ax-overlay"></div>');
				var height = ajaxCS.outerHeight();
				var width = ajaxCS.outerWidth();
				overlay.css({
					height: height,
					width: width,
					'z-index': 99999,
					'position':'absolute',
					'background':'transparent',
					
				})
				ajaxCS.prepend(overlay);
				ajaxCS.css({'opacity': '.4'});
			});
			
			$('div.ax-course-search-ajax').on('ajax_cs:page_ready',function(e){
				var ajaxCS = $(this);
				if(ajaxCS.find('div.ax-overlay').length){
					ajaxCS.find('div.ax-overlay').remove();
				}
				ajaxCS.css({'opacity': '1'});
			});
			$('div.ax-course-search-ajax').on('click', 'a.ax-course-search-link', function(e){
				var ajaxCS = $(this).closest('div.ax-course-search-ajax');
				var type = ajaxCS.find('.ax-type-select').val();
				var courseID = ajaxCS.find('.ax-course-select select').val();
				var done = false;
				if(ajax_cs_vars != null){
					if(ajax_cs_vars.mapping != null){
						var id = courseID + '_' + type;
						if(ajax_cs_vars.mapping[id] != null){
							done = true;
							window.location = ajax_cs_vars.mapping[id].PAGE + '?course_id='+courseID + '&type='+type;
						}
					}
				}
				if ( ! done ){
					window.location = $(this).data('default-url')+ '?course_id='+courseID + '&type='+type;
				}
			});
			
			
			/*Check to see if Location filters exist*/
			$('div.ax-course-search-ajax').on('ajax_cs:location_show', function(e){
				var ajaxCS = $(this);
				if(ajaxCS.find('.ax-course-none').length){
					ajaxCS.find('.ax-course-none').remove();
				}
				if( ! ajaxCS.find('.ax-location-filter').length ){
					ajaxCS.trigger('ajax_cs:search');
					ajaxCS.find('a.ax-course-search-link').hide();
				}	
			});

			$('div.ax-course-search-ajax').on('ajax_cs:search', function(e){
				var ajaxCS = $(this);
				var searchParams = {type:'all', AXTOKEN:null};
		
				if(ajaxCS.find('.ax-course-none').length){
					ajaxCS.find('.ax-course-none').remove();
				}
				ajaxCS.find('a.ax-course-search-link').hide();
				if(ajaxCS.find('.ax-type-select').length){
					searchParams.type = ajaxCS.find('.ax-type-select').val();
					
					if(searchParams.type == 'p' || searchParams.type =='el'){
						searchParams.startDate_min = dateTransform(new Date().setMonth(new Date().getMonth() - 12));
						
						searchParams.finishDate_min = dateTransform(new Date());
						searchParams.startDate_max = dateTransform(new Date().setMonth(new Date().getMonth() + 72));
						searchParams.finishDate_max = dateTransform(new Date().setMonth(new Date().getMonth() + 72));
						
					}
					else{
						
						searchParams.startDate_min = dateTransform(new Date().setMonth(new Date().getMonth() - 1));
						
						searchParams.finishDate_min = dateTransform(new Date());
						searchParams.startDate_max = dateTransform(new Date().setMonth(new Date().getMonth() + 3));
						searchParams.finishDate_max = dateTransform(new Date().setMonth(new Date().getMonth() + 6));
						
					}
				}
				
				if(ajaxCS.find('.ax-location-filter:visible').length){
					var select = ajaxCS.find('.ax-location-filter:visible select');
					if(ajaxCS.find('.ax-course-select').length){
						ajaxCS.find('.ax-course-select').remove();
					}
					var selectVal = select.val();
					if(selectVal != null && selectVal != ''){
						if(select.data('type') == 'venue'){
							searchParams.VENUECONTACTID = select.val();
						}
						else if(select.data('type') == 'location'){
							searchParams.LOCATION = select.val();
						}
						else if(select.data('type') == 'delivery'){
							searchParams.DELIVERYLOCATIONID = select.val();
						}
					}
				}
				searchParams.PUBLIC=true;
				ENROLLER_FUNCTION_DEFAULTS.courseSearch(searchParams, function(data){
					var noneFound=true;
					if( data != null ){
						if(data[0] != null){
							noneFound = false;
							var selectList = generateSelectList(data);
							$(selectList).insertBefore(ajaxCS.find('a.ax-course-search-link'));
							ajaxCS.find('.ax-course-select select').chosen({width:'30em'});
							ajaxCS.find('a.ax-course-search-link').show();
						}
					}
					
					if( noneFound ){
						var noneFoundMessage = $(generateNoneFoundMessage());
						noneFoundMessage.insertBefore(ajaxCS.find('a.ax-course-search-link'))
					}
					
				});

			});
			$('div.ax-course-search-ajax').on('change', '.ax-location-filter select', function(e){
				var ajaxCS = $(this).closest('div.ax-course-search-ajax');
				ajaxCS.trigger('ajax_cs:search');
			});


		}
		
		/*process page*/
		if($('input.ax-type-select').length){
			var ajaxCS = $('input.ax-type-select').closest('div.ax-course-search-ajax');
			ajaxCS.find('div.ax-location-filter').show();
			ajaxCS.trigger('ajax_cs:location_show');
		}
		if($('select.ax-type-select').length){
			
			$('div.ax-course-search-ajax').on('change', '.ax-type-select', function(e){
				
				var element = $(this);
				var ajaxCS = element.closest('div.ax-course-search-ajax');
				if(ajaxCS.find('.ax-course-select').length){
					ajaxCS.find('.ax-course-select').remove();
				}
				
				if(element.val()=='w'){
					ajaxCS.find('.ax-workshop-filter').show();
					ajaxCS.find('.ax-program-filter').hide();
					ajaxCS.trigger('ajax_cs:location_show');
				}
				else if(element.val()=='p'){
					ajaxCS.find('.ax-program-filter').show();
					ajaxCS.find('.ax-workshop-filter').hide();
					ajaxCS.trigger('ajax_cs:location_show');
				}
				else{
					ajaxCS.find('.ax-location-filter').hide();
					ajaxCS.trigger('ajax_cs:search');
				}
				
				if(ajaxCS.find('.ax-course-none').length){
					ajaxCS.find('.ax-course-none').remove();
				}
				ajaxCS.find('a.ax-course-search-link').hide();
				
			});
			$('select.ax-type-select').trigger('change');

		}
		
		function generateNoneFoundMessage(){
			var message = '<div class="ax-course-none">';
			message = message + 'No Available Courses.</div>';
			return message;
		}
		
		function generateSelectList (data){
			var select = '<div class="ax-course-select"><select >';
			var added = {};
			$.each(data, function(i){
				if(added[data[i].ID] == null){
					var optVal = '<option value="' + data[i].ID + '">';
					if(data[i].TYPE == 'w' || data[i].TYPE == 'p'){
						optVal += data[i].CODE + ': ' + data[i].COURSENAME
							+ '</option>';
					}
					else{
						optVal+= data[i].NAME+ '</option>';
					}
					select = select + optVal;
					added[data[i].ID] = true;
				}
				
			});
			select = select + '</select></div>';
			return select;
			
		}
		function dateTransform(d) {
			d = new Date(d);
			var day = ("0" + d.getDate()).slice(-2);
			var month = ("0" + (d.getMonth() + 1)).slice(-2);
			var converted = d.getFullYear()+"-"+(month)+"-"+(day);
			return converted;
		}
		function PAGE_BUSY(){
			
		}
		function PAGE_READY(){
			
		}





	});

})( jQuery );