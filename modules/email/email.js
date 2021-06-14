	
	sendEmail: function(eTemplate,userInfo,targetObject){		
		// OcdlaUtility.makeRequest('sendEmail',[param1,param2,param3])
		return iDataManager.getDataSource('force')
		.makeRequest('sendEmail',[userInfo.userId,targetObject.get('Id'), eTemplate.Id]);
	},
	
	sendCheckoutEmailTest: function(){
		var eTemplate = this.getTemplate('OCDLA eStore Checkout Receipt');
		var userInfo = this.getCurrentUserInfo();
		
		this.sendEmail(eTemplate,userInfo,this.salesOrderObject)
		.then(function(foo,bar,baz){
			var msg = 'A test checkout receipt was sent to:'+"\n\n"+ userInfo['emailAddress'];
			alert(msg);
			log(foo);
			log(bar);
			log(baz);
			return false;
		});
	},