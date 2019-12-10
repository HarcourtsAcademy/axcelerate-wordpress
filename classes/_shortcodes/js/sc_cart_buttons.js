(function( $ ) {
	$(function() {
		
		function updateCart(newCart){
			var totalCost = 0;
			var count = 0;
			$.each(newCart, function(item_id, item){
				var cost = 0;
				if(item.course_cost != null){
					cost = parseFloat(item.course_cost);
				}
				else if(item.cost != null){
					cost = parseFloat(item.cost);
				}
				totalCost += cost;
				count+=1;
			});

			var countLink = $('.ax-shopping-cart .ax-cart-count');
			countLink.empty();
			countLink.append(count);
			
			var totalCost = currencyDisplayFormat(totalCost);
			var totalHolder = $('.ax-shopping-cart .ax-cart-total');
			totalHolder.empty();
			totalHolder.append('Total: ' + totalCost);
			
			
		}
		function currencyDisplayFormat(value){
			if (value == null || value == '' ){
				value = 0;
			}
			try{
				value = parseFloat(value);
				value = value.toLocaleString('en-AU', {style:'currency', currency:'AUD'});
			}
			catch(e){
				return value;
			}
			return value;
			
		}
		
		$('.ax-cart-add').on('click', 'a:not(.added)', function(e){
			var cartButton = $(this);
			if(!cartButton.hasClass('disabled')){
				$('.ax-cart-add a').addClass('disabled');
				
				var courseData = cartButton.data();
				delete courseData.default_text;
				var params = {
						item_id:courseData.instance_id + '_' + courseData.course_type,
						item: courseData,
						action: 'cart_add_item'
				};
				var ajaxUrl = '/wp-admin/admin-ajax.php';
				if(default_vars != null){
					ajaxUrl = default_vars.ajaxURL;
				}
				cartButton.find('span').empty().css('opacity', '.8');
				cartButton.find('span').append('Adding Course');
				if(window._wp_nonce != null){
					params.security = window._wp_nonce;
				}
				jQuery.ajax({
					type: "POST",
					url: ajaxUrl,
					dataType: 'JSON',
					data: params,
					success: function(newCart) {
						$('.ax-cart-add a:not(.novacancy)').removeClass('disabled');
						updateCart(newCart);
						cartButton.find('span').empty().css('opacity', '1');
						cartButton.find('span').append('In Cart');
						cartButton.addClass('added');
						
						
					}

				});
			}
			
			
		});
		
		$('.ax-cart-add').on('click', 'a.added', function(e){
			
			var cartButton = $(this);
			if(!cartButton.hasClass('disabled')){
				$('.ax-cart-add a').addClass('disabled');
				
				var courseData = cartButton.data();
				var params = {
						item_id:courseData.instance_id + '_' + courseData.course_type,
						item: courseData,
						action: 'cart_remove_item'
				};
				var ajaxUrl = '/wp-admin/admin-ajax.php';
				if(default_vars != null){
					ajaxUrl = default_vars.ajaxURL;
				}
				cartButton.find('span').empty().css('opacity', '.8');
				
				cartButton.find('span').append('Removing Course');
				cartButton.removeClass('added');
				if(window._wp_nonce != null){
					params.security = window._wp_nonce;
				}
				jQuery.ajax({
					type: "POST",
					url: ajaxUrl,
					dataType: 'JSON',
					data: params,
					success: function(newCart) {
						$('.ax-cart-add a:not(.novacancy)').removeClass('disabled');
						updateCart(newCart);
						cartButton.find('span').empty().css('opacity', '1');
						cartButton.find('span').append(cartButton.data('default_text'));
						
						if(cartButton.closest('.ax-shopping-cart-list').length){
							cartButton.closest('tr').addClass('ax-cart-removed');
						}
						
					}

				});
			}
			
		});
		
		$('a.ax_empty_cart').on('click', function(e){
			var params = {
					item_id:'',
					wipe_cookie: true,
					action: 'cart_remove_item'
			};
			var ajaxUrl = '/wp-admin/admin-ajax.php';
			if(default_vars != null){
				ajaxUrl = default_vars.ajaxURL;
			}
			if(window._wp_nonce != null){
				params.security = window._wp_nonce;
			}
			jQuery.ajax({
				type: "POST",
				url: ajaxUrl,
				dataType: 'JSON',
				data: params,
				success: function(newCart) {
					if(newCart[0] == null){
						if($('.ax-cart-add a.added').length){
							$('.ax-cart-add a.added').each(function(e){
								var button = $(this);
								button.find('span').empty();
								button.removeClass('added');
								button.find('span').append(button.data('default_text'));
								
								if(button.closest('.ax-shopping_cart_list').length){
									button.closest('tr').addClass('ax-cart-removed');
								}
							});
						}
						
					}
					updateCart(newCart);
					
					
				}

			});
		});




	});

})( jQuery );