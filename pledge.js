'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:


var $Promise = function(){


}

var Deferral = function(){

}

$Promise.prototype.state = "pending";

Deferral.prototype.resolve = function(data){
	if(this.$promise.state === 'pending'){
		this.$promise.value = data;
		this.$promise.state = 'resolved';
	}

	for(var x = 0; x < this.$promise.handlerGroups.length; x++){
		this.$promise.handlerGroups[x].successCb(this.$promise.value);
	}
	this.$promise.handlerGroups = [];
}

Deferral.prototype.reject = function(reason){
	if(this.$promise.state === 'pending'){
		this.$promise.value = reason;
		this.$promise.state = 'rejected';
	}

	for(var x = 0; x < this.$promise.handlerGroups.length; x++){
		this.$promise.handlerGroups[x].errorCb(this.$promise.value);
	}
	this.$promise.handlerGroups = [];
}

var defer = function(){
	var newdefer = new Deferral;
	newdefer.$promise = new $Promise;
	newdefer.$promise.handlerGroups = [];
	newdefer.$promise.then = function(success, error){
		console.log("test", success, error);
		if((typeof success === 'function' || success === null) && (typeof error === 'function' || typeof error === 'undefined')){
				this.handlerGroups.push({ ['successCb']: success, ['errorCb']: error});
		} else {
			this.handlerGroups.push({ ['successCb']: null, ['errorCb']: null});
		}

		if(newdefer.$promise.state === 'resolved') {
			this.handlerGroups[this.handlerGroups.length-1].successCb(newdefer.$promise.value);
			this.handlerGroups.pop();
		}

		if(newdefer.$promise.state === 'rejected' && this.handlerGroups[this.handlerGroups.length-1].errorCb !== undefined) {
			this.handlerGroups[this.handlerGroups.length-1].errorCb(newdefer.$promise.value);
			this.handlerGroups.pop();
		}
	}
	newdefer.$promise.catch = function(func){
		this.then(null, func);
	}
	return newdefer;
}






/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = {
  defer: defer,
};

So in a Node-based project we could write things like this:

var pledge = require('pledge');
…
var myDeferral = pledge.defer();
var myPromise1 = myDeferral.$promise;
--------------------------------------------------------*/
