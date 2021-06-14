define(["event/event-manager","libFormat","libDatetime","libElement","ui/autocomplete/autocomplete","ui/picker-manager/manager","order/actions/save","salesforce/salesforce"],function(event,libFormat,libDatetime,libElement,autocomplete,pickerManager,orderSave,salesforce){

	var DEBUG = false;
	
	var log = function(m){
		DEBUG && console.log(m);
	};
	

	var currency = libFormat.currency;
	
	var total = libFormat.total;
	
	var root;
	
	var containers;
	
	var manager = event.newManager(eventIterator);
	
	var activeRow;	
	// Initialize pickers.
	var pickers = pickerManager.newManager();


	var nodeData = function(node){
		var cid = node.getAttribute("data-cid");
		var inputs = node.getElementsByTagName('input');
		var data = {
			cid: {node:node,value:cid}
		};
		
		for(var i =0; i<inputs.length; i++){
			if(!inputs[i].name) continue;
			data[inputs[i].name] = {
				node: inputs[i],
				value: inputs[i].value
			}
		}
		
		return data;
	};

	
	var getParentNode = function(node){
		for(var i = 0; i<containers.length; i++){
			if(containers[i] == node || containers[i].contains(node)) {
				return containers[i];
			}
		}
		return null;
	};
	
	// This iterator assumes that each local callback returns a Promise.
	// Promises are then chained using <then>.
	var eventIterator = function(e){
	
		var target, cid;
		
		e = e || window.event;
		
		target = e.target || e.srcElement;


		// console.log(e);
		// console.log('HANDLER CALLED');
		// console.log(new Date());
		
		var itemNode = getParentNode(target);
		
		if(!itemNode) {
			console.log('no parent found!');
			return true;
		}
		
		var nodeDataMap = nodeData(itemNode);
		
		var data = {};
		for(var prop in nodeDataMap){
			data[prop] = nodeDataMap[prop]["value"];
		}
		
		var chain;

		// returns a Promise, but what value should it return?
		var firstLink = null; //this.eventQueue[0](e); 
		
		// data,itemNode,target,e
		/*
		chain = this.eventQueue.reduce(function(accumulator,currentValue){
			console.log(accumulator);
			return accumulator.then(currentValue);
		},firstLink);
		*/
		defaultSaveHandler(data,itemNode);

	};
	
	
	var defaultSaveHandler = function(data,itemNode,targetNode,e){
		console.log("All data is: ",data);
		orderSave.orderManager.makeRequest(data)
		.then( (orderItem) => {
			console.log("Returned OrderItem is: ",orderItem);
			itemNode.querySelectorAll("[name='Id']")[0].value = orderItem.Id;
		});
	};
	

	manager = event.newManager(eventIterator);
	// manager.addHandler(defaultSaveHandler);



	pickers.addHandler(function(itemNode,e){
		if(activeRow && !activeRow.equals(itemNode)){
			activeRow.removeClass("row-active");
		}
	
		if(e.type == "blur") {
			try {
				this.hideAll();
			} catch(e) {
				console.warn("Could not hide a picker.");
			}
		}
		else if(e.type == "focus") {
			activeRow = libElement.newNode(itemNode).addClass("row-active");	
		}
	});
	
 	pickers.setDefaultHandler(function(itemNode,e){
		this.hideAll();
		updateUI(itemNode);
		var event = new Event('orderUpdate');
		itemNode.dispatchEvent(event);
	});
	



	// add picker for elements named ContactName
	var contactPickerConfig = {
		targetNameAttribute: "ContactName",
		parentNode: function(){ return document.getElementById("order-items"); },
		label: "Select a Contact",
		renderElement: function(obj) {
			return "<div class='picker-Contact-Name'>"+obj.Name+"</div><div class='picker-Account-Name'>"+
				obj.Account.Name+"</div><div class='picker-membership-info'><div class='picker-membership-status'>"+obj.Ocdla_Member_Status__c+"</div><div class='picker-membership-expiration'>"+libDatetime.dateFromUnixTimestamp(obj.Ocdla_Membership_Expiration_Date__c)+"</div></div>";
		},
		handler: function(selectionData){
			var itemNode = this.attachedNode;
			console.log("Row to be updated is: ",itemNode);
			console.log("Picker selection is: ",selectionData);
			itemNode.querySelectorAll("[name='ContactName']")[0].value = selectionData.Name;
			itemNode.querySelectorAll("[name='Contact__c']")[0].value = selectionData.Id;
			var event = new Event('orderUpdate');
			itemNode.dispatchEvent(event);
			this.hide();
		},
		click: function(e){
			salesforce.getContacts(e.target.value).then( (json) => {
				this.update(json);
			});
		}
	};
	
	
	
	var productPickerConfig = {
		targetNameAttribute: "ProductName",
		parentNode: function(){ return document.getElementById("order-items"); },
		label: "Select a Product",
		renderElement: function(obj) {
			return "<div class='product-name'>"+obj.Product2.Name+"</div><div class='product-price'>"+libFormat.currency(""+obj.UnitPrice)+"</div>";
		},
		handler: function(selectionData){
			var itemNode = this.attachedNode;
			console.log("Row to be updated is: ",itemNode);
			console.log("Picker selection is: ",selectionData);
			itemNode.querySelectorAll("[name='ProductName']")[0].value = selectionData.Product2.Name;
			itemNode.querySelectorAll("[name='PricebookEntryId']")[0].value = selectionData.Id;
			// itemNode.querySelectorAll("[name='UnitPrice']")[0].value = selectionData.UnitPrice;
			if(selectionData.Product2 && selectionData.Product2.Description) {
				itemNode.querySelectorAll("[name='Description']")[0].value = selectionData.Product2.ClickpdxCatalog__LineDescription__c;
			} else {
				itemNode.querySelectorAll("[name='Description']")[0].value = selectionData.Product2.Name;
			}
			updateUI(itemNode,selectionData.UnitPrice);
			var event = new Event("orderUpdate");
			itemNode.dispatchEvent(event);
			this.hide();
			// Next field
		},
		click: function(e){
			console.log("Executing click function...");
			var words = e.target.value.split(" ");
			
			salesforce.getProducts(words[0]).then( (json) => {
				this.update(json);
			});
		}
	
	};
	

		
	function getOrderTotalAmount(){
		var amount = 0;
		
		for(var i = 1; i<containers.length; i++){ // skip header row
			var TotalPrice = containers[i].querySelectorAll("[name='TotalPrice']")[0].value;
			if(libFormat.zero(TotalPrice)) continue;
			amount += parseFloat(TotalPrice);
		}
		
		return amount;
	}
	

	
	
	function updateUI(itemNode,UnitPrice,Quantity){
		UnitPrice = UnitPrice || libFormat.number(itemNode.querySelectorAll("[name='UnitPriceString']")[0].value);
		Quantity = Quantity || (itemNode.querySelectorAll("[name='Quantity']")[0].value || 1);

		// Set real numbers
		itemNode.querySelectorAll("[name='UnitPrice']")[0].value = UnitPrice;
		itemNode.querySelectorAll("[name='Quantity']")[0].value = Quantity;
		itemNode.querySelectorAll("[name='TotalPrice']")[0].value = total(UnitPrice,Quantity);
				
		// Set pretty values
		itemNode.querySelectorAll("[name='UnitPriceString']")[0].value = currency(UnitPrice);
		itemNode.querySelectorAll("[name='TotalPriceString']")[0].value = currency(total(UnitPrice,Quantity));


		var OrderId = itemNode.querySelectorAll("[name='OrderId']")[0].value;
		var selector = (".order-"+OrderId);
		var TotalAmountNodes = document.querySelectorAll(selector +" .order-TotalAmount");

		var TotalAmount = currency(getOrderTotalAmount());
		console.log("New TotalAmount is: ",TotalAmount);

		for(var i = 0; i<TotalAmountNodes.length; i++){
			TotalAmountNodes[i].childNodes[0].nodeValue = TotalAmount;
		}
		
		console.log("Revised itemNode is: ",itemNode);
	}
	
	try {
		var contactAutocomplete = autocomplete.newWidget({targetName:"ContactName"});
		contactAutocomplete.addHandler(function(input){
			salesforce.getContacts(input).then( (json) => {
				pickers.getPicker("ContactName").update(json);
			});
		});
	} catch(e) {
		console.error("There was an error loading the Contact autocomplete widget.");
	}
	
	try {
		var productAutocomplete = autocomplete.newWidget({targetName:"ProductName"});
		productAutocomplete.addHandler(function(input){
			console.log("executing autocomplete handler...");
			salesforce.getProducts(input).then( (json) => {
				console.log(json);
				pickers.getPicker("ProductName").update(json);
			});
		});
	} catch(e) {
		console.error("There was an error loading the Product2 autocomplete widget.");
	}
	

	pickers.addPicker(contactPickerConfig);
	pickers.addPicker(productPickerConfig);


	
	domready(function(){
		root = document.getElementById("order-items");
		containers = root.getElementsByTagName("ul");
		pickers.setParentNodeAlgorithm(getParentNode);
	});
	
	function setupHandlers() {
		// root = document.getElementById("order-items");
		// containers = root.getElementsByTagName("ul");
		root.addEventListener("orderUpdate",manager,true);
		root.addEventListener("input",contactAutocomplete,false);
		root.addEventListener("input",productAutocomplete,false);
		root.addEventListener("focus",pickers,true);
		root.addEventListener("blur",pickers,true);
		pickers.render();
		doResize();
	}
	
	
	function doResize(){
		var m_pos;
		
		var targetCell;
		
		var doc = libElement.newNode(document.body);
		
		function resize(e){
			// console.log("resizing...");
			// console.log(e);
			var dx = e.x - m_pos;
			m_pos = e.x;
			var width = parseInt(getComputedStyle(targetCell,'').width) + dx;
			targetCell.style.width = width + "px";
		}

		var onMouseDown = function(e){
			doc.addClass("resizing");
			targetCell = e.target.parentNode;
			var width = getComputedStyle(targetCell, '').width;
			m_pos = e.x;
			document.addEventListener("mousemove", resize, false);
		};

		var elems = document.getElementsByClassName("resize");
		
		for(var i = 0; i<elems.length; i++){
			elems[i].addEventListener("mousedown",onMouseDown,false);
		}

		document.addEventListener("mouseup", function(){
			doc.removeClass("resizing");
			document.removeEventListener("mousemove", resize, false);
		}, false);
	}


	function deleteOrderItem(e){
		console.log("Called delete function.");
		var itemNode = getParentNode(e.target);
		var id = itemNode.querySelectorAll("[name='Id']")[0].value;
		return salesforce.deleteOrderItems(id).then( (sobject) => {
			itemNode = itemNode.parentNode.removeChild(itemNode);
		});
	}
	
	return {
		setupHandlers: setupHandlers,
		deleteOrderItem: deleteOrderItem
	};
	
});