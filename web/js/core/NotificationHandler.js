/*global API BUS */
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
function NotificationHandler(api) {
  this.api = api;
  this.timeoudId = undefined;
  this.request = undefined;

  BUS.on('api.user', function() {
    this.restart();
  }, this);
}

NotificationHandler.prototype.restart = function() {
  this.destroy();
  this.fetch_notifications();
};

NotificationHandler.prototype.destroy = function() {
  if (this.request) {
    this.request.abort();
  }
  if (this.timeoutId) {
    window.clearTimeout(this.timeoutId);
  }
};

NotificationHandler.prototype.fetch_notifications = function (next_timestamp) {
  var that = this;

  this.request = this.api.doRPC('get_notifications', {next_timestamp: next_timestamp}, function(err, notifications) {
    if (err && err.type === 'connectionerror') {
      return;
    }
    if (notifications && notifications.messages) {
      for (var i = 0; i < notifications.messages.length; i++) {
        BUS.fire('api.notification', notifications.messages[i]);
      }
    }
    that.timeoutId = window.setTimeout(function() {
      that.fetch_notifications(notifications ? notifications.next_timestamp : null);
    }, 500);  // Check in 0.5secs
  });
};
