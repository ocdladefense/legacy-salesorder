define([],function(){

	window.iDataManager = new DataManager(salesOrderAppConfig);

	var initDataManager = function(e){

		iDataManager.start = function() {
			var idb = this.getDataSource('localSalesOrderData');
			var remote = this.getDataSource('force');
			var local = this.getDataSource('localAppData');
			
			idb.setUpgradeSchema(10,iDataManager.getSchema('localSalesOrderData'));
			idb.open();
			remote.open();
			local.open();
			
			var pendingDataTransfers = [];
			pendingDataTransfers.push(this.copy(remote.getStore('getAllContacts'),local.getStore('contacts')));
			pendingDataTransfers.push(this.copy(remote.getStore('getAllAccounts'),local.getStore('accounts')));
			pendingDataTransfers.push(this.copy(remote.getStore('getItems'),local.getStore('items')));
			
			return pendingDataTransfers;
		};
		
		var data = iDataManager.start();

		return Promise.all(data);
	};

	
	return {
		initDataManager: initDataManager
	};

});