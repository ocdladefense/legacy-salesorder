var util = {
	cached: null,
	getQueryString: function(){
		var params = {};
		window.location.search.split('&').forEach((tuple) => {
			var prop = tuple.split('=')[0];
			var val = tuple.split('=')[1];
			params[prop] = val;
		});
		return params;
	},
	getVar: function(name){
		return this.getQueryString()[name] || null;
	}
};


var domready = function(fn,capturing){
	var READY_STATES = ["complete","interactive"];
	var NOT_READY_STATES = ["loading"];
	

	if(READY_STATES.includes(document.readyState)){
		fn();
	} else {
		// document.addEventListener('DOMContentLoaded',fn,false);
		document.addEventListener('load',fn,false);
	}
};


var App = {
	currentOrderId: util.getVar('id')
};



requirejs.config({
	baseUrl: '//'+AppSettings.domain+'/sites/default/modules/salesorder/modules/',
	paths: {
		"libData":"//"+AppSettings.domain+"/sites/all/libraries/library/data",
		"libDatetime":"//"+AppSettings.domain+"/sites/all/libraries/library/datetime",
		"libElement":"//"+AppSettings.domain+"/sites/all/libraries/library/element",
		"libFormat":"//"+AppSettings.domain+"/sites/all/libraries/library/format",
		"libVisualforceRemoting":"//"+AppSettings.domain+"/sites/all/libraries/library/visualforceRemoting",
		"ccFormData":"//"+AppSettings.domain+"/sites/default/modules/ccauthorize/js/data",
		"ccActions":"//"+AppSettings.domain+"/sites/default/modules/ccauthorize/js/actions"
	}
});


requirejs(['event/event-manager','view-core/view-core','order/order','order/controller','salesforce/contact','modal/modal','ui/stage/stage','ui/picker/picker'],function(event,view,order,controller,contact,modal,stage,picker){

	console.log('Application is bootstrapped.');

	App = (function orderApp(){


		
		var domain = AppSettings.domain;
	
	
		function getRoute(path) {
			var routes = {
				"process-payment": {
					module: "authorize/authorize",
					target: "modal"
					// callback: "showPaymentModal",
				},
				"standard-form": {
					module: "order/actions/standard-form",
					callback: "standardForm"
				},
				"delete-order-item": {
					module: "order/event",
					callback: "deleteOrderItem"
				},
				"new-order": {
					module: "order/actions/new",
					target: "modal",
					callback: "displayNewOrder"
				},
				"new-order-create": {
					module: "order/actions/new",
					callback: "loadNewOrder"
				},
				"new-order-item": {
					module: "order/order-item/order-item",
					callback: "newOrderItem"
				},
				"modal::dismiss":{
					module: null,
					callback: "dismiss"
				},
				"modal::cancel": {
					module: null,
					callback: "cancel"
				}
			};
			
			return routes[path] || null;
		}

		
		function appRouter(e){

			var target,
			
			route,
	
			routePath,
			
			routeData;

			e = e || window.event;
	
			target = e.target || e.srcElement;
			
			
			if(!target.dataset) return true; // Continue on to some other handler if no routing data is present.
			

			
			routePath = (target.dataset && target.dataset.routePath) ? target.dataset.routePath : null;
			routeData = (target.dataset && target.dataset.routeData) ? target.dataset.routeData : null;
			
			if(!target.dataset.routePath) return true; // Not a router-based event so keep looking
			// for other valid event handlers.
			
			route = getRoute(routePath);
			
			if(!route) return true; // The route hasn't been registered so we wouldn't know where to look.

			require([route.module],routerOutput(route,e));

			return false;
		}
		
		function routerOutput(route,e){
			e.stopPropagation();
			e.preventDefault();
			return function(module) {
				var usesModal = route.target == "modal";
				console.log('Route is: ',route,' | Target elem is: ',e);
				if(usesModal && module.getHandler) {
					manager.activateModalHandler(module.getHandler());
				}
			
				$execute = route.callback ? module[route.callback](e) : module.doRoute(null,e);
				$execute.then((out) => {
					if(usesModal){
						modal.open(out,{showActions:false});
					}
					return out;
				})
				.then((out) => {
					if(module.modalSetup){
						module.modalSetup();
					}
				})
				/*.catch((err) => {
					modal.open("There was an error processing your request:"+err);
				});
				*/
			}
		};

		var manager = event.newManager();
		manager.addHandler(appRouter);



		document.addEventListener('click',manager,false);


		// @todo - probably not necessary.
		// window.addEventListener('load',init,false);
	
		return {
			currentOrderId: util.getVar('id'),
			loadOrder: controller.load,
			domain: domain,
			closeModal: modal.close
		};
	})();
	
	domready(stage.initUI,false);
	domready(picker.loadSidebarOrders,false);
	if(App.currentOrderId) {
		domready(function(){controller.load(App.currentOrderId);});
	}

});