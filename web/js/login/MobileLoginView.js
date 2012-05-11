/*global AbstractLoginView */
"use strict";
function MobileLoginView() {
  this.e = $("<div></div>").attr('id', 'mobileloginview').appendTo('body');

  var that = this;
  this.e.load('js/login/template.html', function() {
    // When the view is loaded, register handlers
    $("#password").keypress(function(event) {
      if (event.which == 13) {
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
}
MobileLoginView.prototype = new AbstractLoginView();