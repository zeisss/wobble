/*global ContactsDetailDisplay */
"use strict";

/**
 * Implements the ContactsDetailDisplay as a dialog which flies over all other elements (thank to css z-index).
 */
function JQueryContactsDetailDisplay(x,y) {
  this.e = $('<div class="dialog contactdetail"></div>').appendTo($('body')).css('display', 'none').css('left', x).css('top', y);
  this.contact = null;

  var that = this;
  this.e.click(function() {
    that.hide();
  });
}

JQueryContactsDetailDisplay.prototype = new ContactsDetailDisplay();
JQueryContactsDetailDisplay.prototype.constructor = JQueryContactsDetailDisplay;

JQueryContactsDetailDisplay.prototype.show = function(contact, relativeTo) {
  this.contact = contact;

  var template =
    '{{> user_avatar}}' +
    '<div class="name">{{name}}</div>' +
    '<div class="email">{{email}}</div>';

  var avatar_size = 100;
  var views = {
    'name': contact.name,
    'email': contact.email,

    'avatar_size': avatar_size,
    'avatar_url':  contact.avatar_url || "http://gravatar.com/avatar/" + contact.img + "?size=" + avatar_size,
    'avatar_title': contact.email,
    'avatar_online': contact.online == 1 ? 'online': 'offline',
  };
  var partials = {
    'user_avatar': MustacheAvatarPartial.template
  };

  this.e.html(Mustache.render(template, views, partials)).css('display', '');

  if (relativeTo) {
    this.e.css('left', relativeTo.left);
    this.e.css('top', relativeTo.top);
  }
};
JQueryContactsDetailDisplay.prototype.hide = function() {
  this.e.css('display', 'none');
  this.onClose();
  this.contact = null;
};

JQueryContactsDetailDisplay.prototype.addAction = function(title, callback) {
  $('<button></button>').text(title).click(callback).appendTo(this.e);
};
JQueryContactsDetailDisplay.prototype.showMessage = function(sMessage) {
  window.alert(sMessage);
};