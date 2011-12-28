"use strict";

function WobbleApplication() {
	
	
};
WobbleApplication.prototype.bootstrap = function() {
	$('<div></div>').attr('id', 'widgets').appendTo($('body'));

	// Show a reload dialog, when an RPC error occurs
	BUS.on('rpc.error', function(err) {
		this.onRPCError(err);
	}, this);

	// Create global #widgets holder
	this.init();
}
WobbleApplication.prototype.init = function() {
	// Called 
};
WobbleApplication.prototype.onRPCError = function(err) {
	
};

