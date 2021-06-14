define([],function(){

	var DEBUG = false;
	
	var log = function(m){
		DEBUG && log(m);
	};
	
	
	var standardForm = function(e){
		var orderId = App.currentOrderId;
		
		window.open("/"+orderId,"Order - Standard Form");
	};
	
	
	return {
		standardForm: standardForm
	}

});