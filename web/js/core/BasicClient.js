(function(exports) {
  /*global BUS EventBUS JSONRPC WobbleAPI NotificationHandler */
  "use strict";

  function BasicClient() {}
  exports.BasicClient = BasicClient;

  /**
   * Called when all dependencies are loaded. Initializes the basic objects 
   * like API, RPC.
   */
  BasicClient.prototype.bootstrap = function(config) {
    this.config = _.defaults(config, {
      api: './api/endpoint.php'
    });

    window.BUS = new EventBUS();
    if (window.addEventListener) {
      window.addEventListener('unload', function() {
        if (window.BUS) {
          BUS.clear();
        }
      }, false);
    }

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

    var self = this;
    $(window).bind('beforeunload', function () {
      // We ignore 1 operation, because there is always a notification fetcher working
      if (rpcOperations > 1) {
        return 'There are operations pending. Are you sure you want to close now?';
      }
      self.unload();
    });

    // Initialize the API and app, when user data is loaded
    window.RPC = new JSONRPC(this.config.api);
    window.API = new WobbleAPI(
      window.RPC,
      function(user) {
        self.preinit(user);
      }
    );

    self.resizeObserver = new ResizeObserver();
  };

  BasicClient.prototype.preinit = function (user) {
    $('body').empty().append('<div id=widgets></div>');

    this.initHashChangeTracker();
    this.init(user);
  };

  BasicClient.prototype.initHashChangeTracker = function initHashChangeTracker() {
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

    setTimeout(function() {
      // Ok, init is done. Now fire the initial topic.select, if given ;)
      if (appStateSelectedTopicId !== null) {
        BUS.fire('topic.selected', appStateSelectedTopicId);
      }
    }, 0);
  };

  BasicClient.prototype.init = function(user) {
    // Overwrite in Implementation
  };

  BasicClient.prototype.unload = function(user) {
    console.log('Unload detected. Marking backend object as destroyed.');
    // Overwrite in Implementation
    if (window.RPC) window.RPC.destroy();
    if (window.API) window.API.destroy();
  };

  BasicClient.prototype.onRPCError = function(err) {};
})(window);