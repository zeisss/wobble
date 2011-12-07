(function($) {
	/*
	 * Queries the API / Server in an endless loop and fires BUS events for each returned notification
	 *
	 * Fires:
	 * o api.notifications
	 *
	 * Listens:
	 * o api.user
	 */
	
	function fetch_notifications(next_timestamp) {
		API.get_notifications(next_timestamp, function(err, notifications) {
			if (notifications) {
				jQuery.each(notifications.messages, function(i, message) {
					BUS.fire('api.notification', message);
				});
			}
			window.setTimeout(function() {
				fetch_notifications(notifications ? notifications.next_timestamp : null);
			}, 500);  // Check in 0.5secs
		});
	}
	
	BUS.on('api.user', fetch_notifications); // Start fetching, when user is available
})(jQuery);