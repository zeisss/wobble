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
			that.fireLogin($("#email").val(), $("#password").val());
		});

		$("#register").click(function() {
			that.fireRegister($("#email").val(), $("#password").val());
		});
	});
};
DesktopLoginView.prototype = new AbstractLoginView();
