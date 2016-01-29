'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:


var $Promise = function(){
	this.state = "pending";
}

var Deferral = function(){
	this.$promise = new $Promise;
	this.$promise.handlerGroups = [];
	this.$promise.value;
}

function defer(){
	return new Deferral;
}

function settle(state, value){
	if(this.$promise.state === 'pending'){
		this.$promise.state = state;
		this.$promise.value = value;
		this.$promise.callHandlers();
	}
}

function isFn(maybeFn){
	return typeof maybeFn === 'function';
}

Deferral.prototype.resolve = function(data){
	settle.call(this, 'resolved', data);
}

Deferral.prototype.reject = function(reason){
	settle.call(this, 'rejected', reason);
}

$Promise.prototype.then = function(successCb, errorCb){
	var newGroup = {
		successCb: isFn(successCb) ? successCb: null,
		errorCb: isFn(errorCb) ? errorCb : null,
		forwarder: new Deferral
	};
	this.handlerGroups.push(newGroup);
	this.callHandlers();
	return newGroup.forwarder.$promise;
}

$Promise.prototype.callHandlers = function(){
	if(this.state === 'pending') return;
	var handler,
		output;
	this.handlerGroups.forEach(function(group){
		handler = (this.state === 'resolved') ?
			group.successCb :
			group.errorCb;
			if(!handler){
				if(this.state === 'resolved'){ 
					group.forwarder.resolve(this.value);
				}
				else group.forwarder.reject(this.value);
			}
			else {
				try{
					output = handler(this.value);
					if(output instanceof $Promise){
						output.then(function(val){
							group.forwarder.resolve(val);
						}).then(null, function(err){
							group.forwarder.reject(err);
						})
					} else{
						group.forwarder.resolve(output);
					}
				} catch(err){
					group.forwarder.reject(err)
				}
			}
	}.bind(this));
	this.handlerGroups = [];
}

$Promise.prototype.catch = function(err){
	return this.then(null, err);
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
