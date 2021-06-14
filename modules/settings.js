define([],function(){


	
	var itemFields = {
		
		Id: {
			type: "SObjectField",
			display: true,
			elem: {name:"input",type: "hidden"},
			order: 0,
			update: true
		},
		OrderId: {
			type: "SObjectField",
			display: true,
			elem: {name:"input",type: "hidden"},
			order: 0,
			update: true
		},
		Contact__c: {
			type: "SObjectField",
			display: true,
			elem: {name:"input",type: "hidden"},
			order: 0,
			update: true
		},
		"Contact__r.Name": {
			type: "SObjectField",
			display: true,
			elem: {name:"input",type: "text"},
			order: 0,
			update: false
		},
		"Contact__r.Ocdla_Membership_Expiration_Date__c": {
			type: "SObjectField",
			display: true,
			elem: {name:"input",type: "text"},
			order: 0,
			update: false
		},
		PricebookEntryId: {
			type: "SObjectField",
			display: true,
			elem: {name:"input",type: "hidden"},
			order: 0,
			update: true
		},
		"Product2.Name": {
			type: "SObjectField",
			display: true,
			elem: {name:"input",type: "text"},
			order: 0,
			update: false
		},
		"Description": {
			type: "SObjectField",
			display: true,
			elem: {name:"input",type: "text"},
			order: 0,
			update: true
		},
		Note_1__c: {
			type: "SObjectField",
			display: true,
			elem: {name:"input",type: "text"},
			order: 0,
			update: true
		},
		Note_2__c: {
			type: "SObjectField",
			display: true,
			elem: {name:"input",type: "text"},
			order: 0,
			update: true
		},
		Note_3__c: {
			type: "SObjectField",
			display: true,
			elem: {name:"input",type: "text"},
			order: 0,
			update: true
		},
		Quantity: {
			type: "SObjectField",
			display: true,
			elem: {name:"input",type: "text"},
			order: 5,
			update: true
		},
		UnitPrice: {
			type: "SObjectField",
			display: true,
			elem: {name:"input",type: "text"},
			order: 5,
			update: true
		},
		TotalPrice: {
			type: "SObjectField",
			display: true,
			elem: {name:"input",type: "text"},
			order: 5,
			update: true
		}
		
	};
	
	/*
	var itemFields = {
		
		Id: {
			type: "SObjectField",
			display: true,
			elem: {name:"input",type: "hidden"},
			order: 0,
			update: true
		},
		OrderId: {
			type: "SObjectField",
			display: true,
			elem: {name:"input",type: "hidden"},
			order: 0,
			update: true
		},
		PricebookEntryId: {
			type: "SObjectField",
			display: true,
			elem: {name:"input",type: "hidden"},
			order: 0,
			update: true
		},
		"Product2.Name": {
			type: "SObjectField",
			display: true,
			elem: {name:"input",type: "text"},
			order: 0,
			update: false
		},
		"Description": {
			type: "SObjectField",
			display: true,
			elem: {name:"input",type: "text"},
			order: 0,
			update: true
		},
		Quantity: {
			type: "SObjectField",
			display: true,
			elem: {name:"input",type: "text"},
			order: 5,
			update: true
		},
		UnitPrice: {
			type: "SObjectField",
			display: true,
			elem: {name:"input",type: "text"},
			order: 5,
			update: true
		},
		TotalPrice: {
			type: "SObjectField",
			display: true,
			elem: {name:"input",type: "text"},
			order: 5,
			update: true
		}
		
	};
	
	*/
	var getOrderItemUpdateFieldNames = function(){
		var fieldNames = [];
		for(var fName in itemFields) {
			if(itemFields[fName].type == "SObjectField" && itemFields[fName].update === true){
				fieldNames.push(fName);
			}
		}
		return fieldNames;
	};
	
	var getOrderItemSelectFieldNames = function(){
		var fieldNames = [];
		for(var fName in itemFields) {
			if(itemFields[fName].type == "SObjectField"){
				fieldNames.push(fName);
			}
		}
		return fieldNames;
	};
	
	return {
		getOrderItemSelectFieldNames: getOrderItemSelectFieldNames,
		getOrderItemUpdateFieldNames: getOrderItemUpdateFieldNames
	};

});