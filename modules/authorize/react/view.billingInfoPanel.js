/**
 * Object billingInfoPanel
 *
 * Description: should return a renderable array with the appropriate "pm" values.
 *
 */
var billingInfoPanel = function(pm){
	return [

		el('formItemElement',
		{
			label: '',
			elementType: 'input',
			type: 'hidden',
			name: 'orderId',
			value: pm.orderId,
			placeholder: '0.00',
			id: 'orderId',
			className: 'baz pow',
			size: 40
		}),
	
		el('formItemElement',
		{
			label: '',
			elementType: 'input',
			type: 'hidden',
			name: 'contactId',
			value: pm.contactId,
			placeholder: '0.00',
			id: 'contactId',
			className: 'baz pow',
			size: 40
		}),
		
		el('formItemElement',
		{
			label: '',
			elementType: 'input',
			type: 'hidden',
			name: 'profileId',
			value: pm.profileId,
			placeholder: '0.00',
			id: 'profileId',
			className: 'profileId',
			size: 40
		}),
	
		el('formItemElement',
		{
			label: '',
			elementType: 'input',
			type: 'hidden',
			name: 'orderNumber',
			value: pm.orderNumber,
			placeholder: '0.00',
			id: 'orderNumber',
			className: 'baz pow',
			size: 40
		}),
	
	
				
		el('formItemElement',
		{
			label: 'Amount: ',
			elementType: 'input',
			type: 'number',
			name: 'amount',
			value: pm.amount,
			placeholder: '0.00',
			id: 'amount',
			className: 'amount',
			size: 40
		}),
		
		el('formItemElement',
		{
			label: 'Bill To First Name: ',
			elementType: 'input',
			type: 'text',
			name: 'billingFirstName',
			value: pm.billingFirstName,
			placeholder: 'type here...',
			id: 'billingFirstName',
			classes: 'billingFirstName',
			size: 40
		}),
		
		el('formItemElement',{
			label: 'Bill To Last Name: ',
			elementType: 'input',
			type: 'text',
			name: 'billingLastName',
			value: pm.billingLastName,
			placeholder: 'type here...',
			id: 'billingLastName',
			classes: 'billingLastName',
			size: 40
		}),
		
		el('formItemElement',{
			label: 'Bill To Street: ',
			elementType: 'input',
			type: 'text',
			name: 'billingStreet',
			value: pm.billingStreet,
			placeholder: 'type here...',
			id: 'billingStreet',
			classes: 'billingStreet',
			size: 25
		}),
		
		el('formItemElement',{
			label: 'Bill To City: ',
			elementType: 'input',
			type: 'text',
			name: 'billingCity',
			value: pm.billingCity,
			placeholder: 'type here...',
			id: 'billingCity',
			classes: 'billingCity',
			size: 25
		}),
		
		el('formItemElement',{
			label: 'Bill To State: ',
			elementType: 'input',
			type: 'text',
			name: 'billingState',
			value: pm.billingState,
			placeholder: 'type here...',
			id: 'billingState',
			classes: 'billingState',
			size: 2
		}),
		
		el('formItemElement',{
			label: 'Bill To Zip: ',
			elementType: 'input',
			type: 'text',
			name: 'billingZip',
			value: pm.billingZip,
			placeholder: 'type here...',
			id: 'billingZip',
			classes: 'billingZip',
			size: 10
		}),
		
		el('formItemElement',{
			label: 'Bill To Email: ',
			elementType: 'input',
			type: 'text',
			name: 'email',
			value: pm.email,
			placeholder: 'type here...',
			id: 'email',
			classes: 'email',
			size: 30
		}),
		
		el('formItemElement',{
			label: 'Payment Method Description: ',
			elementType: 'input',
			type: 'text',
			name: 'paymentMethodDescription',
			value: pm.description,
			placeholder: 'type here...',
			id: 'paymentMethodDescription',
			classes: 'paymentMethodDescription',
			size: 30
		}),
		
		el('formItemElement',{
			label: 'Credit Card #',
			elementType: 'input',
			type: 'text',
			name: 'ccNum',
			value: pm.ccNum,
			placeholder: 'type here...',
			id: 'ccNum',
			classes: 'ccNum',
			size: 24
		}),
		
		el('formItemElement',{
			label: 'Expiration Date',
			elementType: 'input',
			type: 'text',
			name: 'ccExp',
			value: pm.ccExp,
			placeholder: 'type here...',
			id: 'ccExp',
			classes: 'ccExp',
			size: 8
		}),
		
		el('formItemElement',{
			label: 'CVV',
			elementType: 'input',
			type: 'text',
			name: 'ccCode',
			value: pm.ccCode,
			placeholder: 'type here...',
			id: 'ccCode',
			classes: 'ccCode',
			size: 6
		}),
		
		el('div',{
			id: 'billing-panel-separator'
		}),
		
		el('input',{
			id: 'ccCharge',
			type: 'submit',
			value: 'Charge Card'
		}),
	
		el('input', {
			id: 'ccCancel',
			type: 'submit',
			value: 'Cancel'
		})
		
	];
};