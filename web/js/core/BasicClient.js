/*global BUS JSONRPC WobbleAPI NotificationHandler */
"use strict";

function BasicClient() {}

/**
 * Called when all dependencies are loaded. Initializes the basic objects 
 * like API, RPC.
 */
BasicClient.prototype.bootstrap = function() {
  $('<div></div>').attr('id', 'widgets').appendTo($('body'));

  // Show a reload dialog, when an RPC error occurs
  var rpcOperations = 0;
  BUS.on('rpc.queue.length', function(length) {
    rpcOperations = length;
  });

  BUS.on('rpc.error', function(err) {
    this.onRPCError(err);
  }, this);
  BUS.on('rpc.connectionerror', function(err) {
    this.onRPCError(err);
  }, this);

  var that = this;
  $(window).bind('beforeunload', function () {
    // We ignore 1 operation, because there is always a notification fetcher working
    if (rpcOperations > 1) {
      return 'There are operations pending. Are you sure you want to close now?';
    }
    that.unload();
  });

  // Initialize the API and app, when user data is loaded
  window.RPC = new JSONRPC('./api/endpoint.php');
  window.API = new WobbleAPI(
    window.RPC,
    function(user) {
      that.preinit(user);
    }
  );
};

BasicClient.prototype.preinit = function (user) {
  this.notificationFetcher = new NotificationHandler();

  $('body').empty().append('<div id=widgets></div>');

  var appStateSelectedTopicId = window.location.hash ? window.location.hash.substring(1) : null;
  // Fire a select event, when the hash changes, e.g. by the user clicking on something or
  // Using the back button ...
  $(window).on('hashchange', function () {
    var s = window.location.hash;
    if (s.length > 0) {
      s = s.substring(1);
      if (s !== appStateSelectedTopicId) {
        appStateSelectedTopicId = s;
        BUS.fire('topic.selected', appStateSelectedTopicId);
      }
    }
  });

  BUS.on('topic.selected', function (topicId) {
    if (window.location.hash !== "#" + topicId) {
      appStateSelectedTopicId = topicId;
      window.location.hash = topicId; // Note the current topicId in the URL, so its visible for the user and we can work with it on page reloads
    }
  });

  this.init(user);

  // Ok, init is done. Now fire the initial topic.select, if given ;)
  if (appStateSelectedTopicId !== null) {
    BUS.fire('topic.selected', appStateSelectedTopicId);
  }
};

BasicClient.prototype.init = function(user) {
  // Overwrite in Implementation
};

BasicClient.prototype.unload = function(user) {
  console.log('Unload detected. Marking backend object as destroyed.');
  // Overwrite in Implementation
  if (this.notificationFetcher) this.notificationFetcher.destroy();
  if (window.RPC) window.RPC.destroy();
  if (window.API) window.API.destroy();
};

BasicClient.prototype.onRPCError = function(err) {};
