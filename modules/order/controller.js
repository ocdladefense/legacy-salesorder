define(["order/order"],function(order){

	var DEBUG = false;
	
	var log = function(m){
		DEBUG && log(m);
	};
	
	var controller = {
	
		salesOrderId: null,
	
		salesOrderObject: null,
	
		salesOrderProcess: null,
	
		load: function(id) {
			App.currentOrderId = id;

			this.salesOrderId = id;
			
			// showMessage('Loading Sales Order...');

			//iDataManager.getDataSource('force').getStore('getLineItems')
			return order.getOrder(id).then( (sobject) => {
				return sobject.loadItems();
			})
			.then( (sobject) => {
				log(sobject);
				this.salesOrderObject = sobject;
				return order.render(sobject);
			});
		},
	

	
		loadFromNewSalesOrder: function(e){
			this.load(e.detail.data);
		},
	
		init: function() {	
			document.addEventListener('salesOrderSelect',this.loadFromSalesOrderSelect.bind(this));
		},

	
		navToSalesOrder: function(){
			var standard = window.open("/"+this.Id,"Standard Sales Order Form");
			return false;
		},


	};
	
	return controller;

});