/*global RPC BUS */
"use strict";

// RPC Wrapper (JSON-RPC 2.0 - http://www.jsonrpc.org/specification)
function JSONRPC(url) {
  this.url = url;
  this.idSequence = 1;
  this.initialSleepTime = 500; // Time to wait after first connection error before retrying
  this.retryTimeFactor = 1.9; // Increase sleeping time between retries by this factor
  this.maxRetries = 3;
  this.stateWaiting = [];
  this.debug = true;
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
JSONRPC.prototype.doRPC = function(name, args, options, callback) {
  if (typeof(args) == "function") {
    callback = args;
    args = undefined;
    options = {};
  }
  else if (typeof(options) == "function") {
    callback = options;
    options = {};
  }

  options = options || {};

  var requestId = this.idSequence;
  this.idSequence++;
  return this._retry_call(requestId, name, args, options, callback);
};

/**
 * Executes the given RPC call and retries it at least three times,
 * if a connectionerror occurs.
 */
JSONRPC.prototype._retry_call = function(requestId, name, args, options, callback) {
  var retries = this.maxRetries
    , sleepTime = this.initialSleepTime
    , self = this
    , request = {
      currentRequest: undefined,
      aborted: false,
      abort: function () {
        this.aborted = true;
        if (this.currentRequest) {
          this.currentRequest.abort();
        }
      }
    };

  var retry_callback = function(err, result) {
    if (err && err.type && err.type === 'connectionerror') {
      retries--;

      if (retries === 0 || request.aborted) {
        // We give up, notify the callback
        return callback(err, result);
      }

      // Retry in 500ms
      setTimeout(function () {
        request.currentRequest = self._call(requestId, name, args, options, retry_callback);
      }, sleepTime);
      sleepTime *= self.retryTimeFactor;
      return true; // We handled the error.
    }
    if (callback) {
      return callback(err, result);
    }
  };

  request.currentRequest = self._call(requestId, name, args, options, retry_callback);
  return request;
};

JSONRPC.prototype._call = function(requestId, name, args, options, callback) {
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

      if (!data) {
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

  var req = $.ajax(this.url + (this.debug ? "?" + name : ""), ajaxSettings)
  if (!options.ignoreState) {
    req.always(function() {
      that.stateWaiting = jQuery.grep(that.stateWaiting, function(areq, i) {
        return areq !== req;
      });
      BUS.fire('rpc.queue.length', that.stateWaiting.length);
    });

    this.stateWaiting.push(req);
    BUS.fire('rpc.queue.length', this.stateWaiting.length);
  }
  
  return req;
};

