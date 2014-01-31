"use strict";


function LoginPresenter(display, model, callback) {
  var self = this;

  self.display = display;
  self.model = model;
  self.callback = callback;

  self.display.onLogin(function (fields) {
    display.setEnabled(false);
    model.doLogin(fields.email, fields.password, function (err, result) {
      display.setEnabled(true);
      if (err) {
        return self.modelError(err);
      }
      callback();
    });
  });

  self.display.onRegister(function (fields) {
    display.setEnabled(false);
    model.doRegister(fields.email, fields.password, function (err, result) {
      display.setEnabled(true);
      if (err) {
        return self.modelError(err);
      }
      callback();
    });
  });

  display.show();
}

LoginPresenter.prototype.modelError = function modelError(e) {
  if (e.type === 'connectionerror') {
    this.display.showError('Server error. Please try again later.');
  } else {
    this.display.showError(e.message);
  }
  return true;
};

