/**
 * 
 * @file, settings.js
 *
 * @description, Set custom values for the execution of this application.
 *
 */
var AppSettings = (function(global){
	
	var domain = 'members.ocdla.org';

	
	var modules = {
		authorize: {
			enabled: true
		},
		order: {
			enabled: true,
			sampleOrderId: "001j000000oPGnYAAW"
		},
		picker: {
			enabled: true
		}
	};
	

	
	return {
		domain: domain,
		moduleEnabled: function(module){
			var entry = modules[module];
			
			return !entry ? true : entry.enabled;
		},
		config: function(path){
			var parts = path.split('.');
			module = parts[0];
			key = parts[1];
			if(!modules[module]){
				throw new Error('Could not locate '+path+' in module configs.');
			}
			return modules[module][key];
		}
	};//!!global.define ? global.define([],function(){ return obj; }) : obj;

})(window||global);