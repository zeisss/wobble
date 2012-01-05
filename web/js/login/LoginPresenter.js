"use strict";


function LoginPresenter(display, model, callback) {
	this.display = display;
	this.model = model;
	this.callback = callback;

	this.display.onLogin(function(fields) {
		display.setEnabled(false);
		model.doLogin(fields.email, fields.password, function(err, result) {
			display.setEnabled(true);

			if ( err ) {
				alert(err.message);
				return true;
			} else {
				callback();
			}
		});
	});

	this.display.onRegister(function(fields) {
		display.setEnabled(false);
		model.doRegister(fields.email, fields.password, function(err, result) {
			display.setEnabled(true);
			if ( err ) {
				alert(err.message);
				return true;
			} else {
				callback();
			}
		});
	});

	display.show();
}

