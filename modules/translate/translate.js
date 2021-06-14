define([],function(){
	var defaultLang = 'en-us';
	
	function en(token){
		return langs['en-us'][token];
	}
	
	function getCurrentLang(){
		return defaultLang;
	}
	
	return {
		t: en
	}

});