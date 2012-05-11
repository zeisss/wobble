/*global API */
"use strict";

function LoginModel() {}
LoginModel.prototype.doLogin = function(email, password, callback){
  API.login(email, password, callback);
};
LoginModel.prototype.doRegister = function(email, password, callback) {
  API.register(email, password, callback);
};