define(['view-core/view-core'],function(view){




	function getOrderQueries(){
		var options = '<option value="Recent Sales Orders">Recent Admin Orders</option>'+
		'<option disabled="disabled" value="AMS Web Orders">AMS Web Orders</option>'+
		'<option disabled="disabled" value="Admin Orders">Admin Orders</option>'+
		'<option disabled="disabled" value="Legacy Web Orders">Legacy Web Orders</option>';
		return options;
	}
	
	function getMenuItems(){
		var buttons = '<button id="new-order" data-route-path="new-order">New Order</button>'

		+'<button id="new-order-item" data-route-path="new-order-item">New Order Item</button>'

		+'<button disabled="disabled" id="delete-order" data-module="core" data-method="deleteSalesOrder">Delete Order</button>'

		+'<button data-route-path="standard-form">Standard Form</button>'

		+'<button disabled="disabled" data-module="core" data-method="sendCheckoutEmailTest">Test checkout email</button>'

		+'<button id="process-payment"  data-route-path="process-payment">Process payment</button>';
		return buttons;
	}
	
	function initUI() {
		var lineItems = document.getElementById("order-items");
		
		var bodyDiv = document.getElementsByClassName('bodyDiv')[0];
		
		document.getElementById('sales-order-list-picker').innerHTML = getOrderQueries();
		
		var menu = document.createElement('div');
		menu.setAttribute('class','so-menu');
		menu.setAttribute('id','so-menu');

		var appHeader = document.createElement('div');
		appHeader.setAttribute('class','appHeader');
		appHeader.setAttribute('style','position:relative;border:1px dashed #ccc;');
		
		bodyDiv.insertBefore(appHeader,bodyDiv.firstChild);	
		

		var appStatus = document.createElement('div');
		appStatus.setAttribute('id','sessionOrders');
		

		appHeader.appendChild(menu);		
		appHeader.appendChild(appStatus);


		// Disable loading, for now.
		/*
		var loading = document.createElement('div');
		loading.setAttribute('class','loading visible');
		
		lineItems.insertBefore(loading,lineItems.firstChild);
		*/

		document.getElementById('so-menu').innerHTML = getMenuItems();
	}
	
	return {
		initUI: initUI
	};
});