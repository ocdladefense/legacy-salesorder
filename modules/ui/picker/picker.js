define(["order/order","libElement","view-core/view-core"],function(order,element,view){


	var cache = {
		"order-card": null
	};
	
	var containers;
		
	var activeOrder;

	var getTemplate = function(documentId){
		if(cache[documentId]) return Promise.resolve(cache[documentId]);
		var path = "/sites/default/modules/salesorder/modules/order/templates";
		path += "/"+documentId+".html";
		// loadTemplate returns the innerHTML of the body element as the template.
		return view.loadTemplate("//"+AppSettings.domain+path).then((html) => {
			cache[documentId] = html;
			return html;
		});
	};


	var addOrderToList = function(order){
		console.log("Order to be added is: ",order);
		return renderOrders([order])
		.then( (html) => {
			var frag = new DocumentFragment();
			var container = document.createElement("div");
			container.innerHTML = html;
			console.log("Container is: ",container);
			
			for(var i =0; i<container.children.length; i++){
				frag.appendChild(container.children[i]);
			}
			
			console.log(frag);
			
			var firstChild = document.getElementById("order-picker-container").firstChild;
			var newCard = firstChild.parentNode.insertBefore(frag,firstChild);
			console.log("Inserted card is: ",newCard);
			if(activeOrder) {
				activeOrder.removeClass("active-order");
			}
			activeOrder = element.newNode(containers[0]).addClass("active-order");	
			
		});
	};





	var getParentNode = function(node){
		for(var i = 0; i<containers.length; i++){
			if(containers[i] == node || containers[i].contains(node)) {
				return containers[i];
			}
		}
		return null;
	};
	
	
	
	// This iterator assumes that each local callback returns a Promise.
	// Promises are then chained using <then>.
	var handler = function(e){
	
		var target, cid;
		
		e = e || window.event;
		
		target = e.target || e.srcElement;


		// console.log(e);
		// console.log('HANDLER CALLED');
		// console.log(new Date());
		
		var itemNode = getParentNode(target);
		
		if(activeOrder && !activeOrder.equals(itemNode)){
			activeOrder.removeClass("active-order");
		}
		

		activeOrder = element.newNode(itemNode).addClass("active-order");	
		
		if(!itemNode) {
			console.log('no parent found!');
			return true;
		} else {
			e.stopPropagation();
			e.preventDefault();
		}
		
		var orderId = itemNode.dataset.orderId;
		
		App.loadOrder(orderId);
	};
	
	
	
	
	function renderOrders(orders){
		return getTemplate("order-card").then((tpl) => {
			var cards = orders.map((order) => {
				return view.parse(tpl,order);
			});
			return cards.join("\n");
		});
	}

	
	var loadSidebarOrders = function(params){
		params = params || ({
			options: {
				"ORDER BY": "CreatedDate DESC",
				LIMIT: 30,
				OFFSET: 0
			}
		});

		return order.getOrders(params)
		.then(renderOrders)			
		.then( (html)=> {
			document.getElementById("order-picker-container").innerHTML = html;
		});
	};
		

	domready(function(){
		var orderPicker = document.getElementById("order-picker");
		containers = orderPicker.getElementsByTagName("ul");
		orderPicker.addEventListener("click",handler,true);
		document.addEventListener("orderCreate", function(e) {
			addOrderToList(e.detail); 
		});
	});
			
		
		
	return {
		loadSidebarOrders: loadSidebarOrders
	};

});