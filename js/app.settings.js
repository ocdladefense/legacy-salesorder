(function(window,undefined,jQuery){


	var settings = {

		remoteForceTemplateCalloutImplementation: clickpdxForce.orderEntry.remoteForceTemplateCalloutImplementation,
	
		remoteCCProcessingDomain: 'members.ocdla.org',
	
		itemAutocompleteObject: function(item){
			return {
				value: item.Id,
				label: item.Product2.Name,
				price: item.UnitPrice,
				line_description: item.Product2.Name
			};
		},
		
		itemAutocompleteRender: function(ul,item){
			// alert('who me?');
			return j$("<li>").append(item.line_description + "<br /><span class='autocomplete-details'>$" + item.price + ".00<span class='view-more'><a title='View in new tab' href='/"+item.value+"' target='_new'>view details</a></span></span>").appendTo(ul);
		},
		
		contactAutocompleteObject: function(item){
			return {
				value: item.Id,
				label: item.FirstName + ' ' + item.LastName
				// accountName: item.Account.Name
			};
		},
		
		contactAutocompleteRender: function(ul,item){
			return j$("<li>").append(item.label + "<br /><span class='autocomplete-details contact-account'>" + item.accountName + "<span class='view-more'><a href='#' onclick='return false;'>details</a> | <a title='View in new tab' href='/"+item.value+"' target='_new'>go</a></span></span>").appendTo(ul);
		},
		
	
		onSelectForItems: function(event,ui){
			console.log('doing select callback for Items.');
			$uiLineItem = event.target.parentNode.parentNode;
			$cid = jQuery($uiLineItem).find('input[name=cid]');
			$cid = $cid ? $cid.val() : null;
			console.log('CID is: '+$cid);
			var data = {
				cid: $cid,
				PricebookEntryId: ui.item.value,
				UnitPrice: ui.item.price,
				Description: ui.item.line_description,
				ItemName: ui.item.label
			};
			this.add(data,$uiLineItem);
			jQuery(event.target).blur();
			return false;
		},
	
		onSelectForContacts: function(event,ui){
			console.log('doing select callback for Contacts.');
			$uiLineItem = event.target.parentNode.parentNode;
			console.log('UI LINE ITEM IS:');
			console.log($uiLineItem);
			$cid = jQuery($uiLineItem).find('input[name=cid]');
			$cid = $cid ? $cid.val() : null;
			console.log('CID IS: '+$cid);
			var data = {
				cid: $cid,
				Contact__c: ui.item.value,
				ContactName: ui.item.label
			};
			this.add(data,$uiLineItem);
			jQuery(event.target).blur();
			// j$('ul[data-line-item-id='+$Id+'] .line-item-item input').focus();
			return false;
		}  
	
	};
	
	/**
	 * We have three data sources
	 *
	 */
	var config = {
		remoteObjects: {
			type: 'VisualforceRemoteObject',
			params: ["remoteObjects"],
			stores: ['orders']
		},
		localAppData: {
			type: 'jsArrayDataStore',
			params: ["appData"],
			stores: ['contacts','accounts','items','salesOrders']
		},
		force: {
			type: 'VisualforceRemoting',
			params: [clickpdxForce.orderEntry.remotingProxyObject || "ClickpdxOrder.OrderEntryController"],
			stores: ['getAllContacts','getAllAccounts','getItems','getLineItems']
		},
		localSalesOrderData: {
			type: 'IndexedDb',
			params: ["SalesOrderApp",10],
			stores: ['contacts','accounts','items'],
			schema: [{
				name: "contacts",
				keyPath: "Id",
				indexes: [{
					colName: "FirstName",
					indexName:"FirstName",
					options:{unique:false}
					},
					{colName: "LastName",
						indexName:"LastName",
						options:{unique:false}
					}]
				},
				{
					name: "accounts",
					keyPath: "Id",
					indexes: [{colName: "Name",
						indexName:"Name",
						options:{unique:false}
					}]
				},
				{
					name: "items",
					keyPath: "Id",
					indexes: [{colName: "Name",
						indexName:"Name",
						options:{unique:false}
					}]
				}]
		}
	};
	
	
	window.salesOrderAppConfig = config;
	window.appSettings = settings;

})(window,undefined,jQuery);