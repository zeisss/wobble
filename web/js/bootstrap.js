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