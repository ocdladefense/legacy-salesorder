define(['view-core/view-core','order/order',"libData",'salesforce/salesforce','salesforce/contact','ccActions','ccFormData','authorize/payment-method','translate/translate'],function(view,order,libData,salesforce,contact,charge,ccFormData,paymentMethod,translate){

	var DEBUG = true;
	
	var log = function(m){
		DEBUG && console.log(m);
	};
	
	var currentScopes = {
		order: null,
		contact: null,
		profile: null,
		billing: null
	};

	var getDocument = function(documentId){
		var path = '/sites/default/modules/salesorder/modules/authorize/templates';
		path += '/'+documentId+'.html';
		return view.loadDocument('//'+AppSettings.domain+path);
	};


	var doRoute = function(cb,data){
		// If the module or route is offline then display that in the modal
		if(!AppSettings.moduleEnabled('authorize')){
			return getDocument('offline');
		}
		
		$currentSaveRequest = window.currentSaveRequest ? window.currentSaveRequest.resp : Promise.resolve(null);
		
		return $currentSaveRequest.then( ()=>{
			return getScopes('cc-authorize').then( (scopes) => {
				currentScopes.order = scopes[0];
				currentScopes.contact = scopes[1];
				currentScopes.profile = scopes[2];
				return getDocument('ccAuthorize').then((tpl) => {
					return view.parse(tpl,scopes,{replaceAll:true});
				});						
			});
		});
	};

	var getScopes = function(modalId){
		return order.getOrder(App.currentOrderId).then( (order) => {
			if(!order.BillToContactId){
				return Promise.resolve([order,{}]);
			}
			else return contact.getContact(order.BillToContactId).then( (contact)=>{
				return [order,contact];
			});
		})
		.then( (multiple) => {
			var billTo = multiple[1];
			var AuthNetProfileId = billTo.AuthorizeDotNetCustomerProfileId__c;

			return paymentMethod.getPaymentMethods(AuthNetProfileId).then( (profile) => {
				console.log('Profile results are: ',profile);
				multiple.push(profile);
				return multiple;
			});
		});
	};



	var handler = function(e) {
		var target,
		
		action;
		
		e = e || window.event;

		target = e.target || e.srcElement;
		
		action = target.dataset && target.dataset.action ? target.dataset.action : null;
		
		if(!action) return true; // Skip if not relevant action.
		
		var ccData = currentScopes.billing = ccFormData.ccData();
		
		var promiseAction = Promise.resolve(ccData);
		
		
		/*
		require(actions[action].modules,function(){
		
		});
		*/
		
		switch(action){
		
			case 'authorize::purchase':
				promiseAction = promiseAction.then((ccData) => {
					return charge.payNow('//'+AppSettings.domain+'/ccAuthorize',libData.getAsUrlEncoded(ccData));
				})
				.then(charge.checkAuthNetResponse)
				.then((auth) => {
					var contactId = currentScopes['order'].BillToContactId;
					var fields = {AuthorizeDotNetCustomerProfileId__c:auth.AuthorizeDotNetCustomerProfileId__c};
					if(fields.AuthorizeDotNetCustomerProfileId__c){
						document.getElementById('AuthorizeDotNetCustomerProfileId__c').value = fields.AuthorizeDotNetCustomerProfileId__c;
						contact.saveContact(contactId,fields);
					}
					return auth;
				});
				
			case 'authorize::post':	

				promiseAction.then((auth) => {
					var bill = currentScopes.billing;
					var paymentInfo = (!auth ? Payment_Info__c : JSON.stringify(auth));
					order.postOrder(currentScopes['order'].Id,bill,paymentInfo);
				})
				.then((order) => {
					alert('The Order was posted and the checkout receipt was emailed.');
					// App.removeModalHandler();
					App.closeModal();
				})
				.catch(err => alert(err));
				
				return false;
				break;
				
			default:
				return true;
				break;
		}
		
		return true;
	};



	return {
		getHandler: function(){ return handler; },
		doRoute: doRoute
	};


});