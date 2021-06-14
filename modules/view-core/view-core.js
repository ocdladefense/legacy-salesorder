define([],function(){

	DEBUG = false;
	
	var log = function(m){
		DEBUG && console.log(m);
	};
	
	var documents = {
		
	};
	
	var cache = {
		'order-card': null
	};
	

	function register(documentId,url){
		cache[documentId] = url;
	}

		
	
	function loadDocument(uri){
		// if(cache[documentId]) return Promise.resolve(cache[documentId]);
		return fetch(uri).then(response => response.text());
	}
	
	
	function loadXml(uri){
		return fetch(uri)
		.then( response=>response.text())
		.then( (textHtml)=> {
			const parser = new DOMParser();
			const htmlDocument = parser.parseFromString(textHtml, "text/html");
			return htmlDocument;
		});
	}
	
	function loadTemplate(uri){
		return loadXml(uri)
		.then( (doc) => {
			return doc.body.innerHTML;
		})
	}
	
	
	var functions = {
		'if': function(t,exp,scope){
			return scope[exp] ? t : '';
		},
		'for': function(t,o,prop){
		
		}
	};
	
	var functionTokenRegex = function(fn,scope) {
		return functions[fn](scope);
	};
		
	
	var ifTokenRegex = function() {
		return new RegExp('\\{\\{if\\((.+?)\\)\\}\\}(.+?)\\{\\{fi\\}\\}','gims');		
	};
	
	var forEachTokenRegex = function() {
		return new RegExp('\\{\\{foreach\\((.+?)\\)\\}\\}(.+?)\\{\\{endforeach\\}\\}','gims');		
	};
	
	var templateTokenRegex = function() {
		return new RegExp('\\{\\{template\\((.+?)\\)\\}\\}','gims');		
	};
	
	var propertyTokenRegex = function() {
		return new RegExp('\\{\\{\\s*(.+?)\\s*\\}\\}','gim');
	};
	
	var unusedTokenRegex = new RegExp('\\{\\{(.*?)\\}\\}','gi');
	/**
	 * @function parseString
	 *
	 * @description
	 *   Parse a given XML string using the renderable object's (o) render() method.
	 *
	 */
	function parse(t,scopes,opts) {
		var re, result;
		scopes = Array.isArray(scopes) ? scopes : [scopes];

		if(scopes) {
		

		
			for(var i = 0; i<scopes.length; i++){
			
				t = t.replace(templateTokenRegex(),function(exp,tplName){//,tpl,offset,string){
					return scopes[i][tplName]();//parse(doIf(tpl,scopes[i],prop),scopes);
				});
			
				t = t.replace(ifTokenRegex(),function(exp,prop,tpl,offset,string){
					return parse(doIf(tpl,scopes[i],prop),scopes);
				});
				
				
				t = t.replace(forEachTokenRegex(),function(exp,prop,tpl,offset,string){
					var prop = scopes[i][prop];
					
					return prop.map((obj) => {
						return parse(tpl,obj);
					}).join('\n');
					
				});

				t = t.replace(propertyTokenRegex(),function(exp,prop){
					var hasNativeProp = scopes[i][prop];
					var hasRenderer = scopes[i]['render'];
					var val;
					if(hasNativeProp && hasRenderer) {
						val = scopes[i].render(prop);
					} else if(hasNativeProp) {
						val = scopes[i][prop];
						val == '' && log('WARNING: replaced ',prop,' with an empty value!');
					} else if(!hasNativeProp && hasRenderer) {
						var potential;
						try {
							potential = scopes[i].render(prop);
						} catch(e) {
							log(e);
							potential = null;
						}
						val = !potential ? '{{'+prop+'}}' : potential;
					} else {
						val = '{{'+prop+'}}';
					}
					return val;
				});
			}
		}

		return opts && opts['replaceAll'] ? t.replace(unusedTokenRegex,'') : t;
	}
	
	var doIf = function(tpl,scope,prop) {
		if(!scope[prop]) {
			return '';
		} else if(typeof scope[prop] == 'function' && scope[prop]() === false)  {
			return '';
		} else if(typeof scope[prop] == 'function' && scope[prop]() === true)  {
			return tpl;
		} else if(scope[prop]) {
			return tpl;
		}
	};
	
	
	var doWhile = function(tpl,scope,prop){
		/*while((result = re.exec(t)) !== null) {
			var stmt = result[0];
			var ev = result[1];
			var tpl = result[2];

			log(result);
			parse(tpl,o);
		}
		*/
	};
	
	return {
		register: register,
		parse: parse,
		loadDocument: loadDocument,
		loadXml: loadXml,
		loadTemplate: loadTemplate
	};
		
});