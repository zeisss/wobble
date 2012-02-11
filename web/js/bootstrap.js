(function() {
	var files = [
		'js/core/cache.js',
		'js/views/jquery.wobble.js',
		'js/views/jquery.wobble.topiclist.js',
		'js/views/jquery.wobble.topic.js',
		'js/views/jquery.wobble.contacts.js'
	];

	for(var i = 0; i < files.length; i++) {
		document.write('<script src="' + files[i] + '"></script>');
	}

	window.WobbleApp = (function() {
		if (localStorage) {
			// An enforced app has priority over the UA detection
			var appName = localStorage.getItem('WOBBLE_ENFORCE_APP');
			if (appName == "mobile") {
				return new WobbleMobileClient();
			} else if(appName == "desktop") {
				return new WobbleDesktopClient();
			}
		}

		// If the UA detects a mobile browser, use that
		var ua = navigator.userAgent;
		if (ua.match(/android/i) || 
			ua.match(/iphone/i)) {
			return new WobbleMobileClient();
		} 

		// Fallback: Standard desktop version
		return new WobbleDesktopClient();
	})();
	$(document).ready(function() {
		window.WobbleApp.bootstrap();
	});
})();