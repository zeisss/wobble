"use strict";

function WhoAmIPresenter(display) {
  var that = this;
  this.display = display;
  this.model = null;

  BUS.on('api.user', function (user) {
  	this.model = user;
    this.render();
  }, this);

  // Initial rendering
  if (API.user()) {
  	this.model = API.user();
    this.render();
  }

  this.display.onWhoamiClick = function() {
    var pos = that.display.$whoami.offset();
    pos.top += that.display.$whoami.outerHeight() + 5;
    pos.left += 5;
    BUS.fire('ui.profile.show', pos);
  };
}

WhoAmIPresenter.prototype.render = function render() {
  this.display.renderWhoAmI(this.model);
};