(function() {
  var isDev = localStorage && localStorage.getItem('WOBBLE_DEV');
  var files = [];
  var WobbleAppName = (function() {
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
      'js/ext/tinycon.js',
      'js/ext/underscore.js',
      'js/ext/jquery-1.7.1.js',
      'js/ext/mustache.js'
    );
  } else {
    files.push(
      'js/ext/tinycon.min.js',
      'js/ext/underscore-min.js',
      'js/ext/jquery.min.js',
      'js/ext/mustache.min.js'
    );
  }

  // Wobble Core
  files.push(
    'js/core/localcache.js',
    'js/core/resize_observer.js',
    'js/core/EventBUS.js',
    'js/core/JSONRPC.js',
    'js/core/WobbleAPI.js',
    'js/core/NotificationHandler.js',
    'js/core/BasicClient.js'
  )
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

    // Views
    'js/views/jQueryTopicListView.js',
    'js/views/jQueryTopicView.js',
    'js/views/JQueryContactsView.js',
    'js/views/jQueryContactsDetailDisplay.js',
    'js/views/ListContactsChooserDisplay.js',
//    'js/views/SimpleContactsChooserDisplay.js',

    'js/login/LoginModel.js',
    'js/login/AbstractLoginView.js',
    'js/login/DesktopLoginView.js',
    'js/login/MobileLoginView.js',
    'js/login/LoginPresenter.js'
  );

  // Load classes based selected App
  if (WobbleAppName.match(/mobile/i)) {
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
  window.onload = function() {
    window.WobbleApp = new window[WobbleAppName];
    window.WobbleApp.bootstrap();
  };
})();