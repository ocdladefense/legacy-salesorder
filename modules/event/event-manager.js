define(["modal/modal"],function(modal){

	var fn = {
		defaultModalHandler: function(e){
			var target,
	
			action;
	
			e = e || window.event;

			target = e.target || e.srcElement;
	
			action = target.dataset && target.dataset.action ? target.dataset.action : null;
	
			console.log("Default modal handler says action is: "+action);
	
			if(!action) return true; // Skip if not relevant action.
		
			switch(action){
				case "modal::dismiss":
					console.log("Closing modal handler!");
					// e.stopPropagation();
					e.preventDefault();
					this.removeModalHandler();
					modal.close();
					return false;
					break;
				case "modal::cancel":
					console.log("Closing modal handler!");
					// e.stopPropagation();
					e.preventDefault();
					this.removeModalHandler();
					modal.close();
					return false;
					break;
				default:
					return true;
			}
		},

		activateModalHandler: function(h){
			this.eventQueue.unshift(h);
		},
	
		removeModalHandler: function(h){
			this.eventQueue.shift();
		},
		
		addHandler: function(h){
			this.eventQueue.push(h);
		},
		
		addHandlerBefore: function(h){
			this.eventQueue.unshift(h);
		},
		
		addHandlersBefore: function(hs){
			hs.reverse().forEach( (h) => {
				this.eventQueue.unshift(h);
			})
		},
		
		handleEvent: function(e){
			return this.iterator(e);
		},

	};

	function EventManager(fn){
		this.eventQueue = [this.defaultModalHandler.bind(this)];
		this.iterator = fn;
	}
	
	EventManager.prototype = fn;
	
	
	function dismissModal(){
		modal.close();
	}
		
	// In this default implementation, if a given handler returns false, then we assume
	// that processing should not continue.
	// Probably should be superseded by e.stopPropagation.
	var defaultIterator = function(e){
		for(var i = 0; i < this.eventQueue.length; i++){
			if(!this.eventQueue[i](e)){
				break;
			}
		}
	};
	

	
	return {
		newManager: function(fn){
			return new EventManager((fn||defaultIterator));
		}
	};	

});