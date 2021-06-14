define(["settings","libVisualforceRemoting"],function(config,remoting){

	Visualforce.remoting.buffer = false;
	
	var DEBUG = false;
	
	var invokeAction = remoting.invokeAction("ClickpdxOrder");
	
	function getSObjects(theArgs){
		return invokeAction('OrderEntryController','getSObjects',[theArgs]).then((sobjects) => {
			return sobjects;
			/*
			return sobjects.map((sobject) => {
				var obj = Object.create(fn);
				var target = Object.assign(obj,sobject);
				// t.Items = []; Would need to locate the appropriate prototype object.
				return target;
			});
			*/
		});
	}
	
	
	function getOrderItems(OrderId){
		var query = {};
		query.conditions = [
			{
				field: "OrderId",
				op: "=",
				value: OrderId
			}
		];
		query.options = {
			"ORDER BY":"LastModifiedDate DESC"
		};
		query.fields = config.getOrderItemSelectFieldNames();

		return invokeAction("OrderEntryController","getOrderItems",[query])
	}
	
	
	function deleteOrderItems(OrderItemId){
		var itemJson = JSON.stringify([{Id:OrderItemId}]);
		return invokeAction("OrderEntryController","doOrderItemsAction",[itemJson,"delete"])
	}
	
	function getContacts(searchString){
		var conditions = [];
		searchString = searchString.split(" ");
		// Remove any empty entries
		searchString.filter( (word) => {
			return ("" != word && null != word &&  "" != word.trim());
		});
		
		// Setup an OR search on first and last name
		if(searchString.length > 1) {
			conditions.push({
				field: "FirstName",
				op: "LIKE",
				value: searchString[0]
			});
			conditions.push({
				field: "LastName",
				op: "LIKE",
				value: searchString[1]
			});
		} else {
			conditions.push({
				field: "Name",
				op: "LIKE",
				value: searchString[0]
			});
		}
		
		var contactSoql = {
			fields: ["Id","Name","AccountId","Account.Name","Ocdla_Member_Status__c","Ocdla_Membership_Expiration_Date__c"],
			options: {
				"ORDER BY": "LastName ASC, FirstName ASC",
				"LIMIT":"25",
				"OFFSET":"0"
			},
			conditions: conditions,
			sObjectName: "Contact"
		};
		
		return getSObjects(contactSoql);
	}
	
	function getProducts(searchString){
		var productSoql = {
			fields: ["Id","Product2.Name","UnitPrice","Product2.ClickpdxCatalog__LineDescription__c"],
			options: {
				"ORDER BY": "Product2.Name ASC",
				"LIMIT":"25",
				"OFFSET":"0"
			},
			conditions: [
				{
					field: "Product2.Name",
					op: "LIKE",
					value: searchString
				},
				{
					field: "Product2.ClickpdxCatalog__IsParent__c",
					op: "!=",
					value: 'True'
				}
			],
			sObjectName: "PricebookEntry"
		};
		
		return getSObjects(productSoql);
	}
	

	return {
		invokeAction: invokeAction,
		deleteOrderItems: deleteOrderItems,
		getContacts: getContacts,
		getProducts: getProducts,
		getOrderItems: getOrderItems
	};

});