define([],function(){

	var fn = {
	

		handleEvent: function(e) {
			if(!e.target.name || e.target.name != this.targetName) return false;
			//Clear any previous timer
			clearTimeout(this.timerId);
			//Immediately start the timer after the first keystroke
			//But also start the timer after every keystroke
			//Any additional keystroke cancels the previous timer
			var userInput = e.target.value;

			function sendUserInput() {
				this.delegate(userInput);
			}
			//After less than a second, send input to the contact widget.
			this.timerId = setTimeout(sendUserInput.bind(this),350);
			//Wait 3 seconds to gather user input
		},
	
		addHandler: function(fn){
			this.handlers.push(fn.bind(this));
		},
	
		delegate: function(userInput){
			for(var i = 0; i<this.handlers.length; i++){
				this.handlers[i](userInput);
			}
		}
	};
	
	
	
	function AutocompleteWidget(config){
		this.targetName = config.targetName;
		this.handlers = [];
		this.timerId = null;
		this.userInput = null;
	}


	AutocompleteWidget.prototype = fn;



	return {
		newWidget: function(config){ return new AutocompleteWidget(config); }
	}
	
});