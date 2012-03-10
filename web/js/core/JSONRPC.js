"use strict";

// RPC Wrapper (JSON-RPC 2.0 - http://json-this.RPC.org/wiki/specification)
var JSONRPC = function(url) {
  this.url = url;
  this.idSequence = 1;
  this.stateWaiting = [];
}
/**
 * Mark this RPC object as aborted, so any result that comes in is not propagated further.
 * This means no callbacks will be called anymore.
 */
JSONRPC.prototype.destroy = function(name) {
  this.aborted = true;
};

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
  if (arguments.length == 2) {
    callback = args;
    args = null;
  }
  var requestId = this.idSequence;
  this.idSequence++;

  this._call(requestId, name, args, callback);
};
JSONRPC.prototype._call = function(requestId, name, args, callback) {
  var that = this;

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
    contentType: 'application/json; charset=utf-8',
    success: function(data, textStatus, jqXHR) {
      if(that.aborted)
        return;
      if (!callback)
        return;

      if (data == undefined) {
        var error = {'message': 'Empty response'};
        var errorHandled = callback(error);
        if (!errorHandled) {
          BUS.fire('rpc.error', {
            request: body,
            error: error
          });
        }
      }
      else if (data.error) {
        var errorHandled = callback(data.error);
        if (!errorHandled) {
          BUS.fire('rpc.error', {
            request: body,
            error: data.error
          });
        }
      } else {
        callback(undefined, data.result);
      }
    }
  };
  if (callback) {
    ajaxSettings.error = function(jqXHR, textStatus, errorThrown) {
      if(that.aborted)
        return;

      var errorObj = {text: textStatus, error: errorThrown};
      BUS.fire('rpc.connectionerror', errorObj);
      callback(errorObj);
    };
  }

  var that = this;
  var req = $.ajax(this.url, ajaxSettings).always(function() {
    that.stateWaiting = jQuery.grep(that.stateWaiting, function(areq, i) {
      return areq !== req;
    });
    BUS.fire('rpc.queue.length', that.stateWaiting.length);
  });
  this.stateWaiting.push(req);
  BUS.fire('rpc.queue.length', this.stateWaiting.length);
};
