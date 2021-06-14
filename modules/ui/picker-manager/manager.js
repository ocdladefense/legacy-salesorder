define(["ui/pickers/picker"],function(picker){



	var widgetId = 0;
	
	var getNextWidgetId = function(){
		return ++widgetId;
	};
		

	var nodeData = function(node){
		var cid = node.dataset ? node.dataset.cid : 'no cid';
		var inputs = node.getElementsByTagName('input');
		var data = {
			cid: cid
		};
		for(var i =0; i<inputs.length; i++){
			if(!inputs[i].name) continue;
			data[inputs[i].name] = {
				node: inputs[i],
				value: inputs[i].value
			}
		}
		
		return data;
	};


	var fn = {
		
		getParentNode: function(node){
			return this.parentNodeAlgorithm(node);
		},
		
		setParentNodeAlgorithm: function(fn){
			this.parentNodeAlgorithm = fn;
		},
		
		setDefaultHandler: function(fn){
			this.defaultHandler = fn;
		},
		
		hideAll: function(){
			for(var p in this.pickers){
				this.pickers[p].hide();
			}
		},
		
		getPicker: function(name){
			return this.pickers[name];
		},
		
		addPicker: function(config){
			var thePicker = picker.newWidget(config);
			thePicker.setHandler(config.handler);
			this.pickers[config.targetNameAttribute] = thePicker;
		},
		
		addHandler: function(fn){
			this.handlers.unshift(fn);
		},
		
		handleEvent: function(e){

			var itemNode, elem, classes;
			
			itemNode = this.getParentNode(e.target);

			this.handlers.forEach( (fn) => {
				fn(itemNode,e);
			});
			
			var picker = this.pickers[e.target.name];
			
			if(picker) {
				this.handlePicker(picker,itemNode,e);
			} else {
				this.defaultHandler(itemNode,e);
			}

		},
		
		handlePicker: function(picker,itemNode,e){
			this.hideAll();
			
			var left;
			var top;
			var picker;
			
			e.target.setSelectionRange(0, e.target.value.length);
			left = e.target.offsetLeft;
			top = e.target.offsetTop + e.target.offsetHeight;

			console.log("About to paint picker...");
			picker.paint(left,top);
			console.log(picker);
			picker.click(e);
			picker.setCurrentNode(itemNode);
		},
		
		defaultHandler: function(itemNode,e){
			console.log("Using the default Picker Manager handler.");
		},
		
		render: function(){
			for(var p in this.pickers){
				this.pickers[p].render();
			}
		}
	};
	
	
	function PickerManager(){
		this.pickers = {};
		this.handlers = [];
		this.parentNodeAlgorithm = function(node){ return node; };
	}
	
	PickerManager.prototype = fn;
	

	return {
		newManager: function(){ return new PickerManager(); }
	};

});