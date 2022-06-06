/*
https://stackoverflow.com/questions/14267781/sorting-html-table-with-javascript
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
https://ocdla--ocdpartial--clickpdxorder.visualforce.com/apex/OrderEntry?test=true&id=8015b00000R4AGK

<table>
    <tr><th>Country</th><th>Date</th><th>Size</th></tr>
    <tr><td>France</td><td>2001-01-01</td><td><i>25</i></td></tr>
    <tr><td><a href=#>spain</a></td><td><i>2005-05-05</i></td><td></td></tr>
    <tr><td><b>Lebanon</b></td><td><a href=#>2002-02-02</a></td><td><b>-17</b></td></tr>
    <tr><td><i>Argentina</i></td><td>2005-04-04</td><td><a href=#>100</a></td></tr>
    <tr><td>USA</td><td></td><td>-6</td></tr>
</table>
*/




// do the work...
let labels = 'li.cell-label';
let contain = '.order-table';
let previousQuerySelectorAll = 'ul:nth-child(n+2)';
let rowQuery = 'ul';



let ORDER_NO_CHANGE =   ()=>0; // function(a,b) { return 0; };





function setupRows() {

	let mechanism = document.querySelectorAll(".cell-label a");
	mechanism.forEach(function(label) {
		label.addEventListener("click",rowHandler);
		console.log(label);
	});
	console.log("Sorting is set up.");
	
}


function orderRows(rows, comparator) {
	
	return !comparator ? rows.reverse() : rows.sort(comparator);
}


function updateView(rows, container) {

	rows.forEach(row => container.appendChild(row));
}

let SORT_ASC = true;

function test() {
	let container = document.querySelector(".order-table");
	let rows = Array.from(container.querySelectorAll(rowQuery));
	let labels = rows.shift(); // Remove the header row.
	let index = 2; // Index of column to sort by. Corresponds to name.
	let sortColumn = labels.children[index];
	
	let comparator = getComparator(index, SORT_ASC = !SORT_ASC);
	let reorder = orderRows(rows, comparator);
	
	updateView(reorder, container);
}



const getValue = (row, n) => row.children[n].children[0].value || row.children[n].children[0].value;

// Returns a function responsible for sorting a specific column index 
// (idx = columnIndex, asc = ascending order?).
const getComparator = function(idx, asc) { 

    // This is used by the array.sort() function...
    return function(a, b) { 

        // This is a transient function, that is called straight away. 
        // It allows passing in different order of args, based on 
        // the ascending/descending order.
        return function(v1, v2) {

            // Sort based on a numeric or localeCompare, based on type...
            return (v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)) 
                ? v1 - v2 
                : v1.toString().localeCompare(v2);
        }(getValue(asc ? a : b, idx), getValue(asc ? b : a, idx));
    }
};


function rowHandler(e) {
	console.log("Entering rowHandler");
	e.stopPropagation();
	e.preventDefault();

	let label = e.target;
	let container = label.closest(contain);
	let labels = label.closest("ul.row").querySelectorAll("li.cell");

	
	let rows = Array.from(container.querySelectorAll(rowQuery));

	let index = null;

	let fn = function(node, i) {
		if(node.contains(label)) {
			index = i;
		}
	};


	console.log(label);
	
	labels.forEach(fn);
	console.log(index);
	let comparator = getComparator(++index, SORT_ASC = !SORT_ASC);

	rows.shift(); // Remove the header row.
	rows = orderRows(rows, comparator);

	updateView(rows, container);
	return false;
}












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


function domready(fn,capturing){
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
		domready(function() {
			controller.load(App.currentOrderId)
			.then(setupRows);
		});
	}

});