define(["salesforce/salesforce","libFormat","libDatetime"],function(salesforce,libFormat,modDate){


	var fn = {

		cidRender: function(){ return this.getCid(); },
		
		cidProp: 'ClickpdxOrder__Cid__c',
		
		getCid: function(){
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
					var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
					return v.toString(16);
			});
		},
		
		MembershipExpiration: function(){
			var d = this["Contact__r"] ? this["Contact__r"]["Ocdla_Membership_Expiration_Date__c"] : null;
			if(null == d) return '';
			return modDate.dateFromUnixTimestamp(d);
		},
		
		LineId: function(){ return this.Id || ''; },
		
		TotalPriceString: function(){
			if(!this["TotalPrice"]) {
				return "$0.00";
			} else if(this["TotalPrice"] <= 0) {
				return "$0.00";
			}
			else return libFormat.currency(""+this["TotalPrice"]);
		},
		
		UnitPriceString: function(){
			return libFormat.currency(""+this["UnitPrice"]);
		},
		
		render: function(prop){
			var parts = prop.split('.');
			var fullProp = parts.length > 1 ? this[parts[0]][parts[1]] : this[prop];
			
			if(this[prop] && typeof this[prop] === 'function'){
				return this[prop]();
			} else {
				var fn = prop+'Render';
				return this[fn] ? this[fn]() : (fullProp || '');
			}
		}
		
	};
	
	
	function loadItems(){
		return salesforce.getOrderItems(this.Id)
		.then((sObjects) => {
			console.log("sObject Order Products are: ",sObjects);
			// For sanity, have at least one Order Product
			sObjects = (sObjects.length && sObjects.length >= 1) ? sObjects : [{Id: null,OrderId: this.Id,UnitPrice:0.00,TotalPrice:0.00,Quantity:1}];
			this.Items = sObjects.map((sObject) => {
				var oi = Object.create(fn);
				return Object.assign(oi,sObject);
			});
			return this;
		});
	};
	
	function newOrderItem(order){

		var line = {
			cid: fn.getCid(),
			OrderId: App.currentOrderId
		};
		
		console.log("New line ids are: ",line);
		
		var linesAll = document.querySelector(".order-table");

		var lineExist = linesAll.querySelectorAll("[data-cid]")[0]; // exclude the header row.
		
		var lineNew = lineExist.cloneNode(true);
		lineNew.setAttribute("style","padding:0px !important;margin:0px !important;");
		
		try {
			lineNew.querySelectorAll("[name='Id']")[0].value = "";
			lineNew.querySelectorAll("[name='Quantity']")[0].value = "1";
			lineNew.querySelectorAll("[name='OrderId']")[0].value = line.OrderId;
			lineNew.querySelectorAll("[name='PricebookEntryId']")[0].value = "";
			lineNew.querySelectorAll("[name='ProductName']")[0].value = "";
			lineNew.querySelectorAll("[name='Note_1__c']")[0].value = "";
			lineNew.querySelectorAll("[name='Note_2__c']")[0].value = "";
			lineNew.querySelectorAll("[name='Note_3__c']")[0].value = "";
			lineNew.querySelectorAll("[name='Description']")[0].value = "";
			lineNew.querySelectorAll("[name='TotalPrice']")[0].value = "";
			lineNew.querySelectorAll("[name='TotalPriceText']")[0].value = "$0.00";
			lineNew.setAttribute("class","row row-active");
		} catch(e) {
			console.log(e);
		}
		var inserted = linesAll.insertBefore(lineNew,lineExist);
		inserted.dataset.cid = line.cid;
		inserted.querySelectorAll("[name='ProductName']")[0].focus();
	}
	
	return {
		loadItems: loadItems,
		newOrderItem: newOrderItem
	};


});