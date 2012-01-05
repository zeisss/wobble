"use strict";

function BasicApplication() {
	
	
};
BasicApplication.prototype.bootstrap = function() {
	$('<div></div>').attr('id', 'widgets').appendTo($('body'));

	// Show a reload dialog, when an RPC error occurs
	BUS.on('rpc.error', function(err) {
		this.onRPCError(err);
	}, this);

	// Create global #widgets holder
	this.init();
}
BasicApplication.prototype.init = function() {
	// Overwrite in Implementation 
};
BasicApplication.prototype.onRPCError = function(err) {
	
};

