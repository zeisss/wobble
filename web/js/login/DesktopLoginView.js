"use strict";

/**
 * The loginview should support the following features:
 * - Login by email + password
 * - Register with email+password
 */
function DesktopLoginView() {
	var that = this;

	this.e = $('<div></div>').attr('id', 'desktoploginview').appendTo('body').css('display', 'none');

	this.e.load('js/login/template.html', function() {
		// When the view is loaded, register handlers
		$("#password").keypress(function(event) {
			if ( event.which == 13 ) {
				$("#login").focus().click();
			}
		});

		$("#login").click(function() {
			that.fire('loginview.login', {
				'email': $("#email").val(),
				'password': $("#password").val()
			});
		});

		$("#register").click(function() {
			that.fire('loginview.register', {
				'email': $("#email").val(),
				'password': $("#password").val()
			});
		});
	});
};
DesktopLoginView.prototype = new EventBUS();
DesktopLoginView.prototype.show = function() {
	this.e.css('display', '');
};
DesktopLoginView.prototype.hide = function() {
	this.e.css('display', 'none');
};
DesktopLoginView.prototype.destroy = function() {
	this.e.empty();
	this.e.remove();
};
DesktopLoginView.prototype.setEnabled = function(enabled) {
	var buttons = $("button,input", this.e);
	if (enabled) {
		buttons.removeAttr('disabled');
	} else {
		buttons.attr('disabled', 'disabled');
	}
};

// Register Event Handlers
DesktopLoginView.prototype.onLogin = function(callback) {
	this.on('loginview.login', callback);
};
DesktopLoginView.prototype.onRegister = function(callback) {
	this.on('loginview.register', callback);
};