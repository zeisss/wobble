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
			'js/ext/underscore.js',
			'js/ext/jquery-1.7.1.js',
			'js/ext/mustache.min.js'
		);
	} else {
		files.push(
			'js/ext/underscore-min.js',
			'js/ext/jquery.min.js',
			'js/ext/mustache.min.js'
		);
	}
	
	// Wobble Core
	files.push(
		'js/core/cache.js',
		'js/core/BUS.js',
		'js/core/JSONRPC.js',
		'js/core/WobbleAPI.js',
		'js/core/NotificationHandler.js',
		'js/core/BasicApplication.js'
	)
	// Wobble Modules

	files.push(
		'js/modules/wobble.contacts.js',
		'js/modules/wobble.contactschooser.js',
		'js/modules/wobble.contactsdetail.js',
		'js/modules/wobble.topic.js',
		'js/modules/wobble.topiclist.js',

		'js/views/jquery.wobble.js',
		'js/views/jquery.wobble.topiclist.js',
		'js/views/jquery.wobble.topic.js',
		'js/views/jquery.wobble.contacts.js',

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