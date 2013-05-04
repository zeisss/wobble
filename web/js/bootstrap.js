(function() {
  var isDev = localStorage && localStorage.getItem('WOBBLE_DEV');
  var files = [];
  var wobbleAppName = (function() {
    if (localStorage) {
      // An enforced app has priority over the UA detection
      var appName = localStorage.getItem('WOBBLE_ENFORCE_APP');
      if (appName == "mobile") {
        return 'WobbleMobileClient';
      } else if(appName == "desktop") {
        return 'WobbleDesktopClient';
      }
    }

    // If the UA detects a mobile browser, use that
    var ua = navigator.userAgent;
    if (ua.match(/android/i) ||
      ua.match(/iphone/i)) {
      return 'WobbleMobileClient';
    }

    // Fallback: Standard desktop version
    return 'WobbleDesktopClient';
  })();


  // External Libraries
  if (isDev) {
    files.push(
      'ext/tinycon.js',
      'ext/underscore.js',
      'ext/jquery-1.7.1.js',
      'ext/mustache.js',
      'ext/async.js',
      'ext/backbone.js'
    );
  } else {
    files.push(
      'ext/tinycon.min.js',
      'ext/underscore-min.js',
      'ext/jquery.min.js',
      'ext/mustache.min.js',
      'ext/async.min.js',
      'ext/backbone.js'
    );
  }

  // Wobble Core
  files.push(
    'js/core/localcache.js',
    'js/core/ResizeObserver.js',
    'js/core/EventBUS.js',
    'js/core/JSONRPC.js',
    'js/core/WobbleAPI.js',
    'js/core/NotificationHandler.js',
    'js/core/BasicClient.js'
  );

  // Wobble Modules
  files.push(
    'js/modules/ContactsModel.js',
    'js/modules/ContactsPresenter.js',
    'js/modules/ContactsChooserPresenter.js',
    'js/modules/ContactsDetailPresenter.js',
    'js/modules/TopicPresenter.js',
    'js/modules/TopicListModel.js',
    'js/modules/TopicListPresenter.js',
    'js/modules/UserProfilePresenter.js',
    'js/modules/WindowUpdater.js',
    'js/modules/WhoAmIPresenter.js',
    'js/contactlist.js',

    // Views
    'js/views/JQueryTopicListView.js',
    'js/views/JQueryTopicView.js',
    'js/views/JQueryContactsView.js',
    'js/views/JQueryContactsDetailDisplay.js',
    'js/views/ListContactsChooserDisplay.js',
//    'js/views/SimpleContactsChooserDisplay.js',

    'js/login/LoginModel.js',
    'js/login/AbstractLoginView.js',
    'js/login/DesktopLoginView.js',
    'js/login/MobileLoginView.js',
    'js/login/LoginPresenter.js'
  );

  // Load classes based selected App
  if (wobbleAppName.match(/mobile/i)) {
    files.push(
      'js/mobile/MobileNavigator.js',
      'js/mobile/WobbleMobileClient.js'
    );
  } else {
    files.push(
      'js/desktop/DesktopClientHeader.js',
      'js/desktop/WobbleDesktopClient.js'
    );
  }

  for(var i = 0; i < files.length; i++) {
    document.write('<script src="' + files[i] + '"></script>');
  }

  // Wait until all scripts are loaded
  var oldOnload = window.onload;
  window.onload = function() {
    window.WobbleApp = new window[wobbleAppName]();
    window.WobbleApp.bootstrap(window.wobble_config);
    if (oldOnload) {
      oldOnload.call(this);
    }
  };
})();