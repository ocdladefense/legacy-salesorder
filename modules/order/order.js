define(["libFormat","libDatetime","salesforce/salesforce","order/order-item/order-item","order/event","view-core/view-core"],function(libFormat,libDatetime,salesforce,item,event,view){
	
	var DEBUG = false;
	
	var log = function(m){
		DEBUG && console.log(m);
	};
	
	
	var cache = {
		'order': null
	};
		

	var getDocument = function(documentId){
		// if(cache[documentId]) return Promise.resolve(cache[documentId]);
		var path = '/sites/default/modules/salesorder/modules/order/templates';
		path += '/'+documentId+'.html';
		return view.loadDocument('//'+AppSettings.domain+path).then((doc) => {
			cache[documentId] = doc;
			return doc;
		});
	};



	var render = function(order) {
		return getDocument('order').then((tpl) => {
			return view.parse(tpl,order,{replaceAll:true});		
		})
		.then( (html)=> {
			document.getElementById("order-items").innerHTML = html;
			event.setupHandlers();
		});
	};
	
	
	

	var fn = {
		OrderItemLabels: function(){
			return '';
		},
		OrderItemTemplate: function(){
			return "<li class='cell'><input name='Quantity' class='Quantity' value='{{Quantity}}' /></li>";
		},
		ActivatedDateRender: function(){
			return !this['ActivatedDate'] ? '' :libDatetime.fromUnixTimestamp(this['ActivatedDate']);
		},
		CreatedDateRender: function(){
			return !this['CreatedDate'] ? '' :libDatetime.fromUnixTimestamp(this['CreatedDate']);
		},
		StatusRender: function(){
			return ['Draft','Activated','Posted Payment'].map((item) => {
				return "<option "+(item == this['Status'] ? "selected='selected' " : " ") +"value='"+item+"'>"+item+"</option>";
			}).join('\n');
		},
		PostingEntity__cRender: function(){
			return ['Receipt','Invoice','Cash','Check'].map((item) => {
				return "<option "+(item == this['PostingEntity__c'] ? "selected='selected' " : " ") +"value='"+item+"'>"+item+"</option>";
			}).join('\n');
		},
		Origin__cRender: function(){
			return ['Admin Order','Web Order','Test Order'].map((item) => {
				return "<option "+(item == this['Origin__c'] ? "selected='selected' " : " ") +"value='"+item+"'>"+item+"</option>";
			}).join('\n');
		},
		TotalAmountNumber: function(){
			return this['TotalAmount'] || 0.00;
		},
		TotalAmountString: function(){
			return libFormat.currency(""+this["TotalAmount"]);
		},
		TotalAmountRender: function(){
			return libFormat.currency(''+(this.TotalAmount||0.00));
		},
		AccountNameRender: function(){
			return this.Account.Name;
		},
		FullNameRender: function(){
			return this.BillToContact.FirstName + ' ' + this.BillToContact.LastName;
		},
		isPosted: function(){
			return this['Status'] === 'Activated' || this['Status'] === 'Posted Payment';
		},
		isDraft: function(){
			return this['Status'] === 'Draft';
		},
		theStatus: function(){
			return this["Status"];
		},
		CreatedDateOnly: function(){
			var dt = this["CreatedDateRender"]();
			var d = dt.split(",")[0];
			return d;
		},
		hasOwnBilling: function(){
			return !!this['BillingStreet'];
		},
		notHasOwnBilling: function(){
			return !this.hasOwnBilling();
		},
		hasOwnShipping: function(){
			return !!this['ShippingStreet'];
		},
		loadItems: item.loadItems,		
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
	

	
	var getOrder = function(id){
		if(!id) {
			throw new Error("Cannot fetch Order with blank or null Id.");
		}
		return salesforce.invokeAction('OrderEntryController','getOrder',[id]).then((order) => {
			log(order);
			var o = Object.create(fn);
			var t = Object.assign(o,order);
			t.Items = [];
			return t;
		});
	};
	
	var getOrders = function(params){
		return salesforce.invokeAction('OrderEntryController','getOrders',[params]).then((orders) => {
			log(orders);
			return orders.map((order) => {
				var o = Object.create(fn);
				var t = Object.assign(o,order);
				t.Items = [];
				return t;
			});
		});
	};
	
	
	var postOrder = function(id,bill,auth){
		var fields = {
			Origin__c: bill.Origin__c,
			PostingEntity__c: bill.PostingEntity__c,
			Status: "Posted Payment",
			Payment_Info__c: auth,
			BillingStreet: bill.BillingStreet,
			BillingCity: bill.BillingCity,
			BillingStateCode: bill.BillingStateCode,
			BillingPostalCode: bill.BillingPostalCode,
			BillingCountryCode: bill.BillingCountryCode
		};
		log(fields);
		
		return saveOrder(id,fields)
		//.then(
			// modal.setStatus('This Order has been completed.');
		.catch((message) => {
			log(message);
			throw new Error('The card was charged, but there was an error finalizing the Order.  Use the Standard Form to set the Order to Posted status. Error:\n\n'+message);
		});
	};
	
	
	var saveOrder = function(id,fields){
		return salesforce.invokeAction('OrderEntryController','finalizeOrder',[id,fields])
		.then((order) => {
			log(order);
			return order;
		});
	};

	
	
	return {
		getOrder: getOrder,
		getOrders: getOrders,
		saveOrder: saveOrder,
		postOrder: postOrder,
		render: render
	};

});