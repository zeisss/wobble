'use strict';

function MustacheAvatarPartial() {

}

MustacheAvatarPartial.template_img = 
	"<img title=\"{{avatar_title}}\" src='{{avatar_url}}' width='{{avatar_size}}' height='{{avatar_size}}'>";

MustacheAvatarPartial.template = 
	"<div class='usericon usericon{{avatar_size}}'>" +
	" <div>" + MustacheAvatarPartial.template_img + "</div>" +
	" <div class='status {{avatar_online}}'></div>" +
	"</div>";


MustacheAvatarPartial.render = function (title, url, size, status) {
	var view = {
		'avatar_url': url,
		'avatar_title': title,
		'avatar_size': size,
		'avatar_online': status,
	}
	return Mustache.render(MustacheAvatarPartial.template, view);
}
MustacheAvatarPartial.renderMagic = function (user, size) {
	return MustacheAvatarPartial.render(
		user.name,
		user.avatar_url || "http://gravatar.com/avatar/" + user.img,
		size, 
		user.online == 1 ? "online":"offline"
	);
}