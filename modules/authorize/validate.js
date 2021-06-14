(function(window,OCDLA,$){


	var parseCcExp = function(monthYear){
			// Use a decimal base for evaluating string to integer input.
			var BASE = 10; 
		
			// Identify the current year.
			var CURRENT_YEAR = 2019;
		
			// How many digits to trip off the year to enforce 2-digit years.
			var EXP_SKIP_FIRST_TWO_DIGITS = 2;
		
			// Assume this is a two-digit month followed by a four-digit year.
			var data, month, year, ret;


		
			if(typeof monthYear === 'undefined' || monthYear == null || monthYear.trim() == '') {
				throw new Error('Credit card expiration date cannot be empty.');
			}


			data = monthYear.split('/');

		
			if(monthYear.indexOf('/') === -1) {
				throw new Error('Credit card expiration date must be in the form of mm/yyyy.');
			}

			// Customer didn't include a '/' separator in their cc expiration date.
			if(data.length === 1) {
				throw new Error('Credit card expiration date must be in the form of mm/yyyy.');			
			}
		
			month = parseInt(data[0],BASE);
		
			if(month > 12 || month < 1) {
				throw new Error('Credit card expiration month must be between 1 and 12.');
			}
		
			month = month < 10 ? "0"+month : month;
		
			// Validate the expiration year.
			year = data[1];
		
			// Should be four digits:
			if(year.length != 4) {
				throw new Error('Credit card expiration year must be four digits.');
			}
		
			year = parseInt(data[1],BASE);
		
			// Sanity check on expiration year and to flag expired cards.
			if(year > 2099 || year < CURRENT_YEAR) {
				throw new Error('Credit card expiration year is not valid.');
			}
		
			year = data[1].substring(EXP_SKIP_FIRST_TWO_DIGITS);
		
			return (month + '' + year);
		};


	OCDLA.Checkout.validateContact = function(data){
		if(data.FirstName.trim() === '') {
			throw new Error('First Name cannot be blank.');
		}
	
		if(data.LastName.trim() === ''){
			throw new Error('Last Name cannot be blank.');			
		}
		if(data.Email.trim() === '') {
			throw new Error('Email address cannot be blank.');
		} else if( data.Email.indexOf('@') === -1 || data.Email.indexOf('.') === -1){
			throw new Error('Email address should be entered in the format: abc@abc.com.');
		}
	};

	OCDLA.Checkout.validationFuncs = {

			amount: function(data){ return (typeof data == 'undefined' || data == '' || parseInt(data) < 1) ? 0.00 : data },
		
			contactId: function(data){ return data; },
		
			FirstName: function(data){
				if(typeof data == 'undefined' || data.trim() == '') {
					throw new Error('First Name cannot be empty.');
				}
				return data;
			},
			LastName: function(data){
				if(typeof data == 'undefined' || data.trim() == '') {
					throw new Error('Last Name cannot be empty.');
				}
				return data;
			},
			BillingFirstName: function(data){
				if(typeof data == 'undefined' || data.trim() == '') {
					throw new Error('Billing First Name cannot be empty.');
				}
				return data;
			},
			BillingLastName: function(data){
				if(typeof data == 'undefined' || data.trim() == '') {
					throw new Error('Billing Last Name cannot be empty.');
				}
				return data;
			},
			BillingStreet: function(data){
				if(typeof data == 'undefined' || data.trim() == '') {
					throw new Error('Billing Street cannot be empty.');
				}
				return data;
			},
			BillingCity: function(data){
				if(typeof data == 'undefined' || data.trim() == '') {
					throw new Error('Billing City cannot be empty.');
				}
				return data;
			},
			BillingStateCode: function(data){
				if(typeof data == 'undefined' || data.trim() == '') {
					throw new Error('Billing State cannot be empty.');
				}
				return data;
			},
			BillingPostalCode: function(data){
				if(typeof data == 'undefined' || data.trim() == '') {
					throw new Error('Billing Zip Code cannot be empty.');
				}
				return data;
			},
			ccNum: function(data){
				if(false && data.length != 16) {
					throw new Error('Credit card number must be 16 digits.');
				}
				return data;
			},
			ccExp: function(data){ return parseCcExp(data); },
			ccCode: function(data){
				if(data.length < 3 || data.length > 4){
					throw new Error('CCV code must be either three or four digits in length.');
				}
				return data;
			},
		};
	
		
})(window,OCDLA,jQuery);