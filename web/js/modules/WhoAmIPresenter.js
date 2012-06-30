"use strict";

function WhoAmIPresenter(display) {
	this.display = display;
	this.model = null;

	BUS.on('api.user', function (user) {
		this.model = user;
		this.render();
	}, this);
}

WhoAmIPresenter.prototype.render = function render() {
  this.display.renderWhoAmI(this.model);
};