var discounts = {
	
		/*Display Components and functions*/
		view: {
		
			addConcessionTable:function(concession){
			
			},
			addConcessionElement:function(concession){
				
				checkbox = jQuery('<div class="checkbox"/>');
				input = jQuery('<input type="checkbox" value="">');
				label = jQuery('<label />');
				input.attr('id', concession.DISCOUNTID);
				input.addClass('axip-discount-concession');
				label.append(input);
				label.append(concession.NAME);
				checkbox.append(label);
				
				return checkbox;
			},
			addPromoCodeEntry:function(){
				
			},
			addDiscountTable:function(discountArray, location){
				
		    	discountList = jQuery('#discounts tbody');
		    	jQuery.each(discountArray, function(i, discount)
		    	{
		    		discountList.append(discounts.view.addDiscountLine(discount));
		    	});
		    },
		    
		    addDiscountLine:function(discount){
		    	row = jQuery("<tr></tr>");
		    	row.attr('id', discount.DISCOUNTID);
		    	row.append('<td>' + discount.DISCOUNTTYPEDESCRIPTION + '</td>')
		    	row.append('<td>' + discount.NAME + '</td>')
		    	row.append('<td>' + discount.CALCULATIONDESCRIPTION + '</td>')
		    	return row;
		    },
		    
		    addDiscountList:function(discountArray, location){
		    	
		    	if(jQuery('.axip-discount-concession').length >=1 ){
		    		/*list already exists*/
		    	}
		    	else{
		    		discountList = jQuery('<ul />');
			    	discountList.attr('id', 'discounts');
			    	jQuery.each(discountArray, function(i, discount)
					{
			    		if(discount.DISCOUNTTYPEID == 7)
			    		{
			    			discountList.append(discounts.view.addConcessionElement(discount));
			    		}
			    		else
			    		{}
					 });
			    	jQuery(location).append(discountList);
			    	if(jQuery('.axip-discount-concession').length < 1)
			    	{
			    		jQuery('#axip_discounts_concessions_holder').hide();
			    	}
		    	}
		    	
		    },
		    displayDiscountedPrice:function(discountData, params)
		    {
		    	jQuery('.axip_course_cost').addClass('axip-price-revised');
		    	price = discountData.REVISEDPRICE;
		    	if(typeof params.GroupBookingSize != 'undefined')
	    		{
	    			price = price * params.GroupBookingSize;
	    		}
		    	if(jQuery('#axip_revised_price').length)
		    	{
		    		
		    		
		    		revisedPrice = jQuery('#axip_revised_price');
		    		revisedPrice.empty().append('New Price: $' + price.toFixed(2));
		    	}
		    	else
		    	{
		    		revisedPrice = jQuery('<div id="axip_revised_price" class="alert alert-success" />');
		    		revisedPrice.append('New Price: $' + price.toFixed(2));
		    		revisedPrice.insertAfter('.axip_course_cost');
		    	}
		    }, 
		    noDiscountFound:function(){
		    	noDiscountMessage = jQuery('<div id="axip_nodiscount" class="alert alert-warning" />');
		    	if(jQuery('#axip_nodiscount').length)
		    	{
		    		noDiscountMessage = jQuery('#axip_nodiscount');
		    		noDiscountMessage.empty();
		    	}
		    	
		    	if(jQuery('#axip_revised_price').length)
		    	{
		    		jQuery('#axip_revised_price').remove();
		    		jQuery('.axip_course_cost').removeClass('axip-price-revised');
		    		noDiscountMessage.append('No Discounts Found');
		    	}
		    	else{
		    		noDiscountMessage.append('No Discounts Found');
		    	}
		    	noDiscountMessage.insertAfter('.axip_course_cost');
		    }
		},
		/*Actions, ajax/other*/
		action:{
			calculateDiscountCall:function(params, url)
			{
				params.action = 'axip_calculateDiscount_action';
				jQuery.ajax({
					type: "POST",
					url: url,
					dataType: 'JSON',
					data: params,
					beforeSend: function( xhr ) {
						jQuery("#axip_ajaxLoader").show();
					},
					success: function(result) {
						jQuery("#axip_ajaxLoader").hide();
						if(result.REVISEDPRICE < result.INITIALPRICE){
							discounts.view.displayDiscountedPrice(result, params);
							jQuery("#axip_discounts_holder").data('discounts', result);
							if(jQuery("#axip_nodiscount").length){
								jQuery("#axip_nodiscount").remove();
							}
						}
						else{
							jQuery("#axip_discounts_holder").removeData('discounts');
							discounts.view.noDiscountFound();
						}
							
					}
				});
			},
			
			getDiscounts:function(params, url, method, location)
			{
				jQuery.ajax({
					type: "POST",
					url: url,
					dataType: 'JSON',
					data: params,
					beforeSend: function( xhr ) {
						jQuery("#axip_ajaxLoader").show();
					},
					success: function(result) {
						jQuery("#axip_ajaxLoader").hide();
						if(method == 'table'){
							discounts.view.addDiscountTable(result, location);
						}
						if(method == 'list'){
							discounts.view.addDiscountList(result, location);
						}
						
					}
				});
			},
			buildConcessionParams:function(type, instanceID, price){
				params = {};
				params.contactID = Cookies.get('axip_payerID');
				params.type = type;
				params.instanceID = instanceID;
				params.originalPrice = price;
				promoCode = jQuery('#axip_promo_code').val();
				if (promoCode != '')
				{
					params.promoCode = promoCode;
				}
				concessionArray = [];
				concessions = jQuery('.axip-discount-concession:checked').toArray();
				jQuery.each(concessions, function(i, concession)
				{
					concessionArray.push(jQuery(concession).attr('id'));
				});
				params.concessionDiscountIDs = concessionArray.join(',');
				return params;
				
			},
			
			buildGroupBookingParams:function(type, instanceID, price, numberOfStudents){
				params = {};
				params.contactID = Cookies.get('axip_payerID');
				params.type = type;
				params.instanceID = instanceID;
				params.originalPrice = price;
				params.GroupBookingSize = numberOfStudents;
				promoCode = jQuery('#axip_promo_code').val();
				if (promoCode != '')
				{
					params.promoCode = promoCode;
				}
				
				return params;
				
			},
			
			getDiscountsApplied:function()
			{
				discountHolder = jQuery('#axip_discounts_holder');
				discountArray = discountHolder.data('discounts');
				discountsApplied =[];
				jQuery.each(discountArray.DISCOUNTSAPPLIED, function(i, discount)
				{
					discountsApplied.push(discount.DISCOUNTID);
				});
				return discountsApplied.join(',');
			},
			setupDiscountDisplay:function(displayConcessions, displayPromoCode, instanceID, courseType, url){
				if( displayConcessions ){
					if(jQuery('#axip_discounts_concessions_holder:visible').length < 1){
						jQuery('#axip_discounts_concessions_holder').show();
						params = {};
						params.action = 'axip_getDiscountsInstance_action';
						params.status = 'ACTIVE'
							params.type = courseType;
						params.discountTypeID = [7];
						params.instanceID = instanceID;
						url = url;
						discounts.action.getDiscounts(params, url, 'list', '#concessions');
						jQuery('#calculate_discounts').data('discounts-retrieved', 1);
					}
				}
			}
			
			
			
		}

}