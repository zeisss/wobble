"use strict";

/**
 * Events:
 * - updated
 */
function WhoAmIModel(api) {
  this.api = api || API;
  this.user = api.user();

  BUS.on('api.user', function (user) {
    this.user = user;
    this.fire('updated', this.user)
  }, this);
}
_.extend(WhoAmIModel.prototype, EventBUS.prototype); // Make the model an eventbus

WhoAmIModel.prototype.getUser = function getUser() {
  return this.user;
};



function WhoAmIPresenter(display, model) {
  var that = this;
  this.display = display;
  this.model = model;

  this.model.on('updated', function (user) {
    this.render();
  }, this);

  this.display.onWhoamiClick = function() {
    var pos = that.display.$whoami.offset();
    pos.top += that.display.$whoami.outerHeight() + 5;
    pos.left += 5;
    BUS.fire('ui.profile.show', pos);
  };

  this.render();
}

WhoAmIPresenter.prototype.render = function render() {
  this.display.renderWhoAmI(this.model.getUser());
};