(function(window,undefined,$){

	function viewState(params){
		this.el = null;
		this.timer = null;
		this.params = params||{};
		this.events = this.params.events||{};
		this.processed = false;
		this.hideMessageClass = 'app-status-hidden';
		this.statusBarContainerSelector = this.params.root || document.body;
		this.init();
	}
	
	viewState.prototype.init = function(msg){
		this.initEvents();
		this.appendStatusPane(msg||null);
	};
	
	viewState.prototype.initEvents = function(){
		document.addEventListener('appStatusUpdate',this.showAppMessage.bind(this));
	};
	
	viewState.prototype.appendStatusPane = function(initialMsg){
		var status = document.createElement('div'),
		
		msg = document.createElement('span'),
		
		dismiss = document.createElement('a'),
		
		initialClass = this.hideMessageClass;
		
		initialMsg = initialMsg||'';
		if(initialMsg){
			initialClass = '';
		}
		dismiss.appendChild(document.createTextNode('[dismiss]'));
		dismiss.setAttribute('href','#');
		dismiss.setAttribute('class','app-status-dismiss');
		
		msg.setAttribute('class','message');
		msg.appendChild(document.createTextNode(initialMsg));
		status.appendChild(msg);
		status.appendChild(dismiss);
		status.setAttribute('id','app-status');
		status.setAttribute('style','margin:0 auto;width:30%;height:30px;');
		status.setAttribute('class',initialClass);
		this.el = status;
		dismiss.addEventListener('click',this.dismissAppMessage.bind(this),true);
	};
	
	viewState.prototype.attachTo = function(n){
		if(n.childNodes.length){
			n.insertBefore(this.el,n.firstChild);
		} else {
			n.appendChild(this.el);
		}
	};
	
	viewState.prototype.dismissAppMessage = function(e){
		$('#app-status .message').html('');
		this.hideAppMessage();
		e.preventDefault();
		e.stopPropagation();
		return false;
	};
	
	viewState.prototype.showAppMessage = function(evt){
		$('#app-status').css({display:'block',width:'100%',height:'30px'});
		$('#app-status .message').html(evt.detail);
		if(!this.timer){
			this.timer = setTimeout(this.hideAppMessage.bind(this),1580);
		}
	};
	
	viewState.prototype.hideAppMessage = function(){
		$('#app-status').css({display:'none'});
		this.timer = null;
	};
	
	
	var showMessage = function(message){
		document.dispatchEvent(new CustomEvent('appStatusUpdate',{'detail': message}));
	};
	
	window.viewState = viewState;
	window.showMessage = showMessage;
})(window,undefined,jQuery);