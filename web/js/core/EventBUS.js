"use strict";

/*
BUS.on('topic.selected', function(data, eventName) {
  // Your code here
});
BUS.fire('topic.selected');
BUS.fire('topic.selected', {topic_name: 'Hello World!'});
*/
function EventBUS() {
  this.listeners = {};
};

EventBUS.prototype.on = function (eventName, callback, context) {
  var context = context || window;
  if (!this.listeners)
    this.listeners = {};

  var list = this.listeners[eventName] || [];
  list.push([context, callback]);
  this.listeners[eventName] = list;
};
EventBUS.prototype.fire = function(eventName, data) {
  if (window.console && window.BUS == this) {
    console.log('Event fired', eventName, data);
  }
  if (!this.listeners || !(eventName in this.listeners)) {
    return; // Abort, if no listener exists
  }
  for (var i = 0; i < this.listeners[eventName].length; i++) {
    var callbackEntry = this.listeners[eventName][i];
    callbackEntry[1].apply(callbackEntry[0], [data, eventName]);
  }
}
EventBUS.prototype.clear = function() {
  this.listeners = {};
};

// Create the Global BUS
if (!window.BUS) {
  window.BUS = new EventBUS();
  if (window.addEventListener) {
    window.addEventListener('unload', function() {
      BUS.clear();
    }, false)
  }
}