define([],function(){

	var DEFAULT_QUERY = {
		// where: {Origin__c:{eq:'Admin Order'}},
		orderby:[{orderDate:'DESC'}],
		limit: 30
	};

	var widgetId = 0;
	
	var getNextWidgetId = function(){
		return ++widgetId;
	};
		
	
	
	
	
	var getAsInlineStyles = function(css){
		var styles = [];
		for(var prop in css){
			styles.push([prop,css[prop]].join(":"));
		}
		return styles.join(";")+";";
	};

	var USE_ABSOLUTE = true;

	var contentElement = function(label){
		return "<div style='background-color:#666;color:#eee;display:block;position:absolute;top:0px;left:0px;height:20px;width:100%;'><div style='padding:3px;'>"+label+"</div></div><div style='margin-top:24px;height:200px;overflow-y:scroll;'><div class='popup-content'>&nbsp;</div></div>";
	};
	
	var fn = {
		
		defaultStyles: {
			"overflow":"hidden",
			"position":"absolute",
			"width":"200px",
			"height":"200px",
			"top":"300px",
			"left":"200px",
			"z-index":"101",
			"background-color":"#fff",
			"border":"1px solid #ccc",
			"box-shadow":"3px 3px 3px #ccc",
			"display":"none"
		},
		
		getId: function(){
			return this.Id;
		},
		
		width: function(){
			return parseInt(this.styles["width"]);
		},
		
		height: function(height){
			return parseInt(this.styles["height"]);
		},
		
		init: function(styles){
			this.css(this.defaultStyles);
		},
	
		css: function(css){
			for(var prop in css){
				this.styles[prop] = css[prop];
			}
			this.root.setAttribute("style",getAsInlineStyles(this.styles));
		},
	
		contentElement: function(){
			return this.root.querySelectorAll(".popup-content")[0];
		},
	
		content: function(content){
			this.contentElement().innerHTML = content;
		},
		
		append: function(node){
			this.contentElement().appendChild(node);
		},
		
		clear: function(node){
			this.contentElement().innerHTML = "";	
		},
	
		hide: function(){
			this.css({display:"none"});
		},

		show: function(){
			this.css({display:"block"});
		},
		
		getNodeData: function(node){
			for(var i = 0; i<this.NodeDataMap.length; i++){
				if(this.NodeDataMap[i].node.contains(node)) {
					return this.NodeDataMap[i];
				}
			}
			return null;
		},
		
		handleEvent: function(e){
			this.eventIterator(e);
		},
		
		eventIterator: function(e){
	
			var target, cid, nodeData;
		
			e = e || window.event;
		
			target = e.target || e.srcElement;
			
			selectionData = this.getNodeData(target);
			
			this.eventHandlers.forEach( (handler) => {
				handler(selectionData);
			});
		},
		
		setHandler: function(fn){
			this.eventHandlers = [fn.bind(this)];
		},
		
		removeEvent: function(){
			this.root.removeEventListener("click",this,false);
		},
		
		update: function(json){
			this.clear();
			this.NodeDataMap = json.map( (item) => {
				var n = document.createElement("div");
				n.setAttribute("class","picker-item");
				n.innerHTML = this.renderElement(item);
				this.append(n);
				item.node = n;
				return item;
			});
		},
		
		paint: function(left,top){
			var offsetLeft = parseInt(left) + "px";
			var offsetTop = top + "px";
			this.css({left:offsetLeft,top:offsetTop});			
			this.show();
		},
		
		setCurrentNode: function(node){
			this.attachedNode = node;
		},
		
		getAttachedNode: function(){
			return this.config.parentNode();
		},
		
		isRendered: function(){
			return this.isPickerCollectionRendered;
		},
		
		render: function(){
			this.isPickerCollectionRendered = true;
			this.root = document.createElement("div");
			this.init();
			this.root.setAttribute("id",this.widgetId);
			this.getAttachedNode().appendChild(this.root);
			this.root.addEventListener("click",this,true);
			this.root.innerHTML = contentElement(this.label);
			this.content("Loading...");
		}
	};
	
	function Picker(config){
		this.isPickerCollectionRendered = false;
		console.log(config);
		this.config = config;
		this.click = config.click;//function(e){ console.log(e); };
		this.attachedNode = this.getAttachedNode();
		console.log("Attached node is: ",this.attachedNode);
		this.widgetId = "widget-"+getNextWidgetId();
		this.NodeDataMap = [];
		this.renderElement = config.renderElement || function(){};
		this.label = config.label;
		this.eventHandlers = [];
		this.styles = {};
	}
	

	
	Picker.prototype = fn;

	return {
		newWidget: function(appendTo){ return new Picker(appendTo); }
	};

});