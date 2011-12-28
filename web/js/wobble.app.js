"use strict";

function WobbleApplication() {
	var that = this;

	// Show a reload dialog, when an RPC error occurs
	BUS.on('rpc.error', function(err) {
		that.onRPCError(err);
	});
};
WobbleApplication.prototype.init = function() {
	// Called 
};
WobbleApplication.prototype.onRPCError = function(err) {
	
};

