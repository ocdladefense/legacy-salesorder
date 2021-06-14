define(["salesforce/salesforce"],function(salesforce){

	var DEBUG = false;
	
	var log = function(m){
		DEBUG && log(m);
	};
	
	
	var orderManager = {
		outbound: [],
	
		cancel: function(tid){
			window.clearTimeout(tid);
		},
	
		getLast: function(cid){
			for(var i =0; i<this.outbound.length; i++){
				if(this.outbound[i].cid == cid) return this.outbound[i];
			}
			return null;
		},

		makeRequest: function(data){
			// Check snapshot completeness; bail if
			return this.update(data);
		},
	
		update: function(data){
			var cid = data.cid;
		
			var request, recent;
			
			window.currentSaveRequest = request = {
				cid: cid,
				tid: null,
				status: "initialized",
				body: data,
				resp: null
			};
		
		
			// Create a reference to the most recent outbound request for this OrderItem.
			recent = this.getLast(cid);
		
			if(recent && (recent.status == "initialized" || recent.status == "pending")){
				if(recent.PricebookEntryId == request.PricebookEntryId) {
					recent.status = "cancelled";
					this.cancel(recent.tid);
				}
			}
		

			// Set this request as the most recent.
			this.outbound.unshift(request);
		
			if(recent && recent.status != "rejected" && (recent.status == "executing" || recent.status == "complete")){
				request.resp = recent.resp.then(queueThis).then( (resp) => {
					request.status = "complete";
					return resp;
				});
			} else {
				request.resp = queueThis().then( (resp) => {
					request.status = "complete";
					return resp;
				});
			}
		
		
		
			function queueThis(previousResult) {
				// A previous request resulted in an Id being assigned so use it.
				// This would happen for a new Order Item
				// or an Order Item that gets replaced.
				data.Id = (previousResult && previousResult.Id) ? previousResult.Id : data.Id;

				return new Promise( (resolve,reject)=> {
					var tid;
					
					tid = request.tid = setTimeout(()=>{
						if(request.status == "cancelled") {
							reject("The queued request was cancelled.");
						} else {
							request.status = "executing";
							saveOrderItem(data).then( (orderProduct) => {
								resolve(orderProduct);
							})
							.catch( (e) => {
								request.status = "rejected";
								reject(e);
							});
						}
					},750);
			
					request.status = "pending";
				});
			}
		
			return request.resp;
		}
	};
	
	
	var saveOrderItem = function(item){

		item.Id = item.Id || null;
		console.log("Item to be saved is: ",item);
		
		return salesforce.invokeAction("OrderEntryController","saveOrderItem",[JSON.stringify(item)])
		.then( (item) => {
			console.log("Saved item is: ",item);
			return item;
		});
	};
	
	
	
	return {
		orderManager: orderManager
	}

});