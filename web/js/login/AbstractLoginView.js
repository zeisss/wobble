/*global EventBUS */
"use strict";
function AbstractLoginView() {}
AbstractLoginView.prototype = new EventBUS();

AbstractLoginView.prototype.show = function() {
  this.e.css('display', '');
};
AbstractLoginView.prototype.hide = function() {
  this.e.css('display', 'none');
};
AbstractLoginView.prototype.destroy = function() {
  this.e.empty();
  this.e.remove();
};
AbstractLoginView.prototype.setEnabled = function(enabled) {
  var buttons = $("button,input", this.e);
  if (enabled) {
    buttons.removeAttr('disabled');
  } else {
    buttons.attr('disabled', 'disabled');
  }
};

// Register Event Handlers
AbstractLoginView.prototype.fireLogin = function(email, password) {
  this.fire('loginview.login', {'email': email, 'password': password});
};
AbstractLoginView.prototype.fireRegister = function(email, password) {
  this.fire('loginview.register', {'email': email, 'password': password});
};
AbstractLoginView.prototype.onLogin = function(callback) {
  this.on('loginview.login', callback);
};
AbstractLoginView.prototype.onRegister = function(callback) {
  this.on('loginview.register', callback);
};