define([],function(){


	/*
	

	function showModal(modalpath){//'authorize/payment'){
		// do a fetch of the template
		
		var modulename,
		
		modalname,
		
		mo;
		
		modulename = modalpath.split('/')[0];
		
		modalname = modalpath.split('/')[1];
		
		document.body.setAttribute('class','hasModal');
		
		require([modulename],function(module){
			mo = module.getModal(modalname);
			
			loadDocument(mo.getTemplateUri())
			.then((text) => {
				var xml = (new window.DOMParser()).parseFromString(text, "text/html"); //"text/xml"
				log(xml);
				document.getElementById('modal-content').innerHTML = parse(text,mockCustomer);
			})
			.then(()=>{
			
				document.addEventListener('click',mo.handler,true);

			});
		});

	}
	*/
	
	var $root, $content, closeFuncs;
	
	closeFuncs = [_closeModal];
	
	function setContent(content){
		$content.innerHTML = content;
	}

	function showModal(){
		$style = $root.getAttribute('style');
		$style += ';display:block;';
		$root.setAttribute('style',$style);
	}
	
	function _closeModal(){
		fadeOut();
		window.setTimeout(cleanUp,450);
	}
	
	function closeModal(e){
		e = e || null;
		e && e.preventDefault();
		for(var i = 0; i<closeFuncs.length; i++){
			closeFuncs[i](e);
		}
		return false;
	}
	
	function openModal(html,opts){
		setContent(html);
		showModal();
		if(opts && !opts['showActions']) {
			var actions = document.getElementById('modal-actions');
			actions.setAttribute('style',';display:none;');
		}
	}
	
	function cleanUp(){
		// $root.removeClass('has-modal');
		// $root.removeClass('close-modal-request');
		// document.querySelector('.clickpdx-modal').className = 'clickpdx-modal';
	}
	
	function fadeOut(){
		$style = $root.getAttribute('style');
		
		$root.setAttribute('style',$style+=';display:none;');
	}
	
	
	function addModalClasses(classes){
		for(var i = 0; i<classes.length; i++){
			$modal.addClass(classes[i]);
		}
	}
	
	function getRootCss(){
		return "display:none;background-color:#eee; border-radius:8px; border:1px solid #ccc; position:absolute;top:200px;left:400px;overflow:hidden;";
	}
	
	function getContentCss(){
		return "padding:25px;"
	}
	
	function getActionCss(){
		return "display:block;";
	}
	
	function init(){
		var css;
		
		$root = document.createElement('div');
		$content = document.createElement('div');
		$actions = document.createElement('div');
		
		
		$content.setAttribute('class','content');
		$content.setAttribute('style',getContentCss());
		$actions.setAttribute('style',getActionCss());
		$actions.setAttribute('id','modal-actions');
		$root.setAttribute('id','clickpdx-modal');
		$root.setAttribute('style',getRootCss());
		
		// $actions.setAttribute('

		
		$root.appendChild($content);
		$root.appendChild($actions);
		document.body.appendChild($root);
		$actions.innerHTML = '<button data-action="modal::dismiss">OK</button><button data-action="modal::cancel">Cancel</button>';
		
	}
	/*
	return (function(settings){
		var closeIcon;
		$root = $('body');
		document.querySelector('.clickpdx-modal').className = 'clickpdx-modal';
		$modal = $('.clickpdx-modal');
		$content = $('.clickpdx-modal .content');
		
		console.log(settings);
		
		setContent(settings.content);
		showModal();

		// Add any additional close functions.
		settings.close && closeFuncs.push(settings.close);
		settings.classes && addModalClasses(settings.classes);
		
		settings.init && settings.init();
		
		closeIcon = document.getElementById('close-modal');
		closeIcon.addEventListener('click',closeModal,false);
	
		$('.form-action-close').click(settings.form.actions['close']);
		
		$('.form-action-add-to-cart').click(settings.form.actions['add']);
	});
	*/
	init();
	
	return {
		open: openModal,
		close: closeModal,
		content: setContent
	};

});