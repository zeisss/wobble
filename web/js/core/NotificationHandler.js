"use strict";

/*
 * Queries the API / Server in an endless loop and fires BUS events for each returned notification
 *
 * Fires:
 * o api.notifications
 *
 * Listens:
 * o api.user
 */
function NotificationHandler() {
	// Start fetching, when user is available
	if (window.API && window.API.user() != null) {
		this.fetch_notifications();
	} else {
		BUS.on('api.user', function() { 
			this.fetch_notifications(); 
		}, this); 
	}
};

NotificationHandler.prototype.fetch_notifications = function (next_timestamp) {
	var that = this;

	API.get_notifications(next_timestamp, function(err, notifications) {
		if (notifications && notifications.messages) {
			for (var i = 0; i < notifications.messages.length; i++) {
				BUS.fire('api.notification', notifications.messages[i]);
			}
		}
		that.timeoutId = window.setTimeout(function() {
			that.fetch_notifications(notifications ? notifications.next_timestamp : null);
		}, 500);  // Check in 0.5secs
	});
}

NotificationHandler.prototype.destroy = function() {
	if (this.timeoutId) {
		window.clearTimeout(this.timeoutId);
	}
};