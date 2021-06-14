define([],function(){

	var profileUrl = '//'+AppSettings.domain+'/authNet/getFullCustomerProfile';

	var DEBUG = false;

	var log = function(m){
		DEBUG && console.log(m);
	};
	
	var fn = {
		PaymentProfileOptions: function(){
			// console.log(this.paymentProfiles);
			if(!this.paymentProfiles) return '';
			console.log(this.paymentProfiles);
			var profiles = this.paymentProfiles.map((pm) => {
				//cardNumber, cardType, customerPaymentProfileId, defaultPaymentProfile
				var selected = pm.defaultPaymentProfile != null ? " selected='selected' " : "";
				return '<option '+selected+'value="'+pm.customerPaymentProfileId+'">'+pm.cardType+' ending in '+pm.cardNumber+'</option>';
			});
			
			profiles.length > 0 && profiles.unshift('<option value="999">-- SELECT A CARD --</option>');
			profiles.length < 1 && profiles.unshift('<option value="998">-- NO CARDS AVAILABLE --</option>');
			profiles.push('<option value="997">&nbsp;</option>');
			profiles.push('<option value="996">-- CREATE NEW CARD --</option>');
			
			return profiles.join('\n');
		},
		render: function(prop){
			var parts = prop.split('.');
			var fullProp;
			
			if(parts.length > 1 && !!this[parts[0]]){
				fullProp = this[parts[0]][parts[1]];
			} else {
				fullProp = this[prop];
			}
			
			if(this[prop] && typeof this[prop] === 'function'){
				return this[prop]();
			} else {
				var fn = prop+'Render';
				return this[fn] ? this[fn]() : (fullProp || '');
			}
		}
	};

	
	var getPaymentMethods = function(authNetProfileId){
		log('fetching payment methods for: '+authNetProfileId);
		$profile = fetch(profileUrl,{
			method: "POST",
			cache: "no-cache",
			headers: {
				'Accept': 'application/json',
				'Content-Type':'application/json'
			},
			body: JSON.stringify({customerProfileId:authNetProfileId})
		});

		return $profile.then((resp) => {
			return resp.json();
		})
		.then((json) => {
			log('Payment profiles are: ',json);
			var paymentProfiles = json.paymentProfiles;
			var customerProfile = json.customerProfile;
			
			customerProfile = assignProfilePrototype(customerProfile);
			customerProfile.paymentProfiles = paymentProfiles;
			return customerProfile;
		});
		
		function assignProfilePrototype(p) {
			var o = Object.create(fn);
			return Object.assign(o,p);
		}
	};
	

	var createPaymentMethod = function(order,contact) {

		return {
			amount: order.TotalAmount,
			orderNumber: order.OrderNumber,
			orderId: order.Id,
			contactId:  order.BillToContactId,
			profileId: contact.AuthorizeDotNetCustomerProfileId__c,
			billingFirstName: contact.FirstName,
			billingLastName: contact.LastName || '',
			billingStreet: contact.MailingStreet || '',
			billingCity: contact.MailingCity || '',
			billingState: contact.MailingStateCode || '',
			billingZip: contact.MailingPostalCode || '',
			email: contact.Email || '',
			description: 'My Default Card',
			ccNum: '',
			ccExp: '',
			ccCode: ''
		};
	};
	
	return {
		getPaymentMethods: getPaymentMethods
	};

});