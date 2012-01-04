"use strict";

// RPC Wrapper (JSON-RPC 2.0 - http://json-this.RPC.org/wiki/specification)
var JSONRPC = function(url) {
	this.url = url;
	this.idSequence = 1;
}
/**
 * Notifications are calls, where no response is expected/wished.
 */
JSONRPC.prototype.doNotification = function(name, args) {
	RPC._call(null, name, args, null);
};
/**
 * Normal RPC call.
 */
JSONRPC.prototype.doRPC = function(name, args, callback) {
	if ( arguments.length == 2 ) {
		callback = args;
		args = null;
	}
	var requestId = this.idSequence;
	this.idSequence++;
	
	this._call(requestId, name, args, callback);
};
JSONRPC.prototype._call = function(requestId, name, args, callback) {			
	var body = {
		jsonrpc: "2.0",
		method: name,
	};
	if (args) {
		body.params = args;
	}
	if (requestId) {
		body.id = requestId;
	}
	
	var ajaxSettings = {
		type:'POST',
		cache: false,
		data: JSON.stringify(body),
		dataType: "json",
		processData: false,
		headers: {
			'Content-Type': 'application/json; charset=utf-8'
		},
		success: function(data, textStatus, jqXHR) {					
			if ( data.error ) {
				BUS.fire('rpc.error', {
					request: body,
					error: data.error
				});
			}
			if (!callback) 
				return;
			if ( data.error ) {
				callback(data.error);
			} else {
				callback(undefined, data.result);
			}
		}
	};
	if ( callback ) {
		ajaxSettings.error = function(jqXHR, textStatus, errorThrown) {
			BUS.fire('rpc.connectionerror', {text: textStatus, error: errorThrown});
			callback(errorThrown);
		};
		
	}
	$.ajax(this.url, ajaxSettings);
};