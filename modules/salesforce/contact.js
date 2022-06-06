define(['salesforce/salesforce'],function(salesforce){
	var prototypeFn = {
		EmailRender: function(){
			return '<a href="mailto:'+this['Email']+'">'+this['Email']+'</a>';
		},
		render: function(prop){
			var rMethod = prop+'Render';
			return this[rMethod] ? this[rMethod]() : this[prop];
		}
	};
	
	var getContact = function(contactId){	
		return salesforce.invokeAction('OrderEntryController','getBillToContact',[contactId]).then((contact) => {
			var c = Object.create(prototypeFn);
			return Object.assign(c,contact);
		});		
	};
	
	var saveContact = function(id,fields){
		return salesforce.invokeAction('OrderEntryController','saveContactFields',[id,fields]).then((result) => {
			console.log('Contact saved with fields: ',fields);
			return result;
		});
	};
	
	return {
		getContact: getContact,
		saveContact: saveContact
	};

});