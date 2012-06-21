/*global RPC BUS */
"use strict";

// RPC Wrapper (JSON-RPC 2.0 - http://json-this.RPC.org/wiki/specification)
function JSONRPC(url) {
  this.url = url;
  this.idSequence = 1;
  this.initialSleepTime = 500; // Time to wait after first connection error before retrying
  this.retryTimeFactor = 1.9; // Increase sleeping time between retries by this factor
  this.maxRetries = 3;
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
  this._retry_call(null, name, args, null);
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

  this._retry_call(requestId, name, args, callback);
};

/**
 * Executes the given RPC call and retries it at least three times,
 * if a connectionerror occurs.
 */
JSONRPC.prototype._retry_call = function(requestId, name, args, callback) {
  var retries = this.maxRetries
    , sleepTime = this.initialSleepTime
    , self = this;

  var retry_callback = function(err, result) {
    if (err && err.type && err.type === 'connectionerror') {
      retries--;

      if (retries === 0) {
        // We give up, notify the callback
        return callback(err, result);
      }

      // Retry in 500ms
      setTimeout(function () {
        self._call(requestId, name, args, retry_callback);
      }, sleepTime);
      sleepTime *= self.retryTimeFactor;
      return true; // We handled the error.
    }
    if (callback) {
      return callback(err, result);
    }
  };

  self._call(requestId, name, args, retry_callback);
};

JSONRPC.prototype._call = function(requestId, name, args, callback) {
  var that = this;

  var body = {
    jsonrpc: "2.0",
    method: name
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
      var errorHandled, error;

      if(that.aborted)
        return;

      if (data === undefined) {
        error = {'message': 'Empty response'};
        errorHandled = callback ? callback(error) : false;
        if (!errorHandled) {
          BUS.fire('rpc.error', {
            request: body,
            error: error
          });
        }
      }
      else if (data.error) {
        errorHandled = callback ? callback(data.error) : false;
        if (!errorHandled) {
          BUS.fire('rpc.error', {
            request: body,
            error: data.error
          });
        }
      } else {
        if (callback) {
          callback(undefined, data.result);
        }
      }
    }
  };

  ajaxSettings.error = function(jqXHR, textStatus, errorThrown) {
    if (that.aborted)
      return;

    var errorObj = {type: 'connectionerror', text: textStatus, error: errorThrown};
    var errorHandled = callback ? callback(errorObj) : false;
    if (!errorHandled) {
      BUS.fire('rpc.connectionerror', errorObj);
    }
  };

  var req = $.ajax(this.url, ajaxSettings).always(function() {
    that.stateWaiting = jQuery.grep(that.stateWaiting, function(areq, i) {
      return areq !== req;
    });
    BUS.fire('rpc.queue.length', that.stateWaiting.length);
  });
  this.stateWaiting.push(req);
  BUS.fire('rpc.queue.length', this.stateWaiting.length);
};
