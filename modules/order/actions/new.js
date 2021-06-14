define(["salesforce/salesforce","order/order","view-core/view-core","ui/autocomplete/autocomplete","ui/picker-manager/manager","libData","libDatetime"],function(salesforce,order,view,autocomplete,pickerManager,libData,libDatetime){

	var DEBUG = false;
	
	var log = function(m){
		DEBUG && console.log(m);
	};



	var getDocument = function(documentId){
		var path = '/sites/default/modules/salesorder/modules/order/templates';
		path += '/'+documentId+'.html';
		return view.loadDocument('//'+AppSettings.domain+path);
	};


	var pickers = pickerManager.newManager();


	var handler = function(e) {
		var target,
		
		action;
		
		e = e || window.event;

		target = e.target || e.srcElement;
		
		action = target.dataset && target.dataset.action ? target.dataset.action : null;
		
		if(!action) return true; // Skip if not relevant action.

		
		console.log("Selected action is: "+action);
		switch(action){

		
			case "order::create":
				var formData = libData.getFormData(document.getElementById("new-order-form"));
				console.log("New Order data is: ",formData);
				formData.EffectiveDate = libDatetime.toSalesforceDate(new Date());
				console.log("Form data is: ",formData);
				
				e.preventDefault();
				

				$create = newOrder(formData);
				$load = $create.then( (sobject) => {
					return order.getOrder(sobject.Id).then( (sobject) => {
						return sobject.loadItems();
					});
				});
				$load.then( (sobject) => {
					log(sobject);
					var event = new CustomEvent('orderCreate',{detail:sobject});
					document.dispatchEvent(event);
					// if sobject doesn't have any line-items then add a couple, by default.
					order.render(sobject);
				})
				.then( ()=>{
					App.closeModal();
				});
				
				return false;
			break;
				
			default:
				return true;
			break;
		}
		
		return true;
	};

	var getParentNode = function(node){
		return document.getElementById("modal-new-order");
	};


	// add picker for elements named ContactName
	var contactPickerConfig = {
		targetNameAttribute: "BillToContactName",
		parentNode: function(){ return document.getElementById("modal-new-order"); },
		label: "Select a Contact",
		renderElement: function(obj) {
			return "<div class='picker-Contact-Name'>"+obj.Name+"</div><div class='picker-Account-Name'>"+
				obj.Account.Name+"</span>";
		},
		handler: function(selectionData){
			console.log("Picker handler called!");
			var itemNode = this.attachedNode;
			console.log("Row to be updated is: ",itemNode);
			console.log("Picker selection is: ",selectionData);
			itemNode.querySelectorAll("[name='BillToContactName']")[0].value = selectionData.Name;
			itemNode.querySelectorAll("[name='AccountName']")[0].value = selectionData.Account.Name;
			itemNode.querySelectorAll("[name='BillToContactId']")[0].value = selectionData.Id;
			itemNode.querySelectorAll("[name='AccountId']")[0].value = selectionData.AccountId;
			// var event = new Event('orderUpdate');
			// itemNode.dispatchEvent(event);
			this.hide();
		},
		click: function(e){
			salesforce.getContacts(e.target.value).then( (json) => {
				this.update(json);
			});
		}
	};


	
	
	var contactAutocomplete;
	
	contactAutocomplete = !contactAutocomplete ? autocomplete.newWidget({targetName:"BillToContactName"}) : contactAutocomplete;
	
	contactAutocomplete.addHandler(function(input){
		console.log("Input is: ",input);
		salesforce.getContacts(input).then( (json) => {
			console.log("Returned JSON is: ",json);
			pickers.getPicker("BillToContactName").update(json);
		});
	});


		
	function modalSetup() {

		if(!pickers.getPicker("BillToContactName")){
			console.log("ADDING A PICKER!!");
			pickers.addPicker(contactPickerConfig);
		}

		pickers.setDefaultHandler(function(itemNode,e){
			this.hideAll();
		});
		
		pickers.setParentNodeAlgorithm(getParentNode);
		
 		contactAutocomplete = !contactAutocomplete ? autocomplete.newWidget({targetName:"BillToContactName"}) : contactAutocomplete;

		root = document.getElementById("modal-new-order");
		root.addEventListener("input",contactAutocomplete,true);
		root.addEventListener("focus",pickers,true);
		root.addEventListener("blur",pickers,true);
		if(!pickers.isRendered) pickers.render();
	}
	
	
	
	/**
	 *
	 * things to do when the modal is completed or dismissed.
	 */
	function modalDestroy() {
	
	}
	
	
	var displayNewOrder = function(){
		return getDocument("new-order").then((tpl) => {
			return view.parse(tpl,{},{replaceAll:true});
		});
	};
	
	var newOrder = function(order){
		return salesforce.invokeAction("OrderEntryController","saveOrderJson",[JSON.stringify(order)])
		.then( (order) => {
			console.log(order);
			App.currentOrderId = order.Id;
			return order;
		});
	};
	

	
	return {
		newOrder: newOrder,
		displayNewOrder: displayNewOrder,
		getHandler: function(){ return handler; },
		modalSetup: modalSetup
	};

});