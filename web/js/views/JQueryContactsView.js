/*global BUS ContactsDisplay */
"use strict";

/**
 * This is the view containing the ConstactsRoster as well as the user info.
 */
function JQueryContactsView() {
  var template =
    '<div class="whoami header"></div>' +
    '<div class="actions">' +
    ' <button id="contacts_add">Add</button>' +
    ' <button id="show_my_profile">Show my profile</button>' +
    '</div>' +
    '<ul class="contactslist"></ul>',
    that = this;
  this.e = $('<div></div>').addClass('widget').attr('id', 'contacts').appendTo('#widgets');

  // NOTE: Makes sure that the contactsList does not start with a 100% width
  // and thus prvents the other widgets from beeing rendered
  this.e.css('width', '180px');

  this.e.append(template);
  this.$whoami = $(".whoami", this.e);
  this.$actions = $(".actions", this.e);
  this.$contactsList = $(".contactslist", this.e);

  this.bind();
}
JQueryContactsView.prototype = new ContactsDisplay();
JQueryContactsView.prototype.constructor = JQueryContactsView;

// Methods 
JQueryContactsView.prototype.onResize = function() {
  var viewHeight = this.e.innerHeight();
  var offsetX = this.$whoami.outerHeight() + this.$actions.outerHeight();

  this.$contactsList.css('height', viewHeight - offsetX);
};

JQueryContactsView.prototype.renderContacts = function (list) {
  var template = 
    "{{#contacts}}" + 
    "<li class=\"contact\" title='{{email}}' data-index=\"{{index}}\" data-contact-id=\"{{id}}\">" +
    "  {{> user_avatar }}" +
    "  <span class=name>{{name}}</span>" +
    "</li>"+
    "{{/contacts}}" + 
    "{{^contacts}}<li style=\"font-size: small; padding-left: 20px;\">^ Click here to add a friend by their email adress.</li>{{/contacts}}";

  var avatar_size = 20;
  var views = {
    'contacts': list.map(function (contact, index) {
      return {
        'index': index,
        'id': contact.id,
        'name': contact.name,
        'email': contact.email,
        'avatar_url': contact.avatar_url || "http://gravatar.com/avatar/" + contact.img +  "?s=" + avatar_size,
        'avatar_online': contact.online == 1 ? 'online' : 'offline'
      }
    }),

    'avatar_size': 20
  };
  var partials = {
    'user_avatar': MustacheAvatarPartial.template
  };

  var html = Mustache.render(template, views, partials);

  $(html).appendTo(this.$contactsList.empty());

  var that = this;
  $("li", this.$contactsList).click(function() {
    var index = $(this).data('index');
    var contact = list[index];
    that.onContactClick(contact);
  });
};

/*
 * Private Stuff
 */
JQueryContactsView.prototype.bind = function bind() {
  this.$whoami.click($.proxy(function() {
     this.onWhoamiClick();
  }, this));

  $("#contacts_add").click($.proxy(function() {
    var contactEmail = window.prompt("Enter the new contact's email address");
    if (contactEmail !== null) {
      this.onAddContact(contactEmail);
    }
  }, this));

  $("#show_my_profile").click($.proxy(function() {
    this.onWhoamiClick();
  }, this));

  // On a window.resize event wait for the transformations to finish (should be done in 300ms) and recalc height
  var self = this;
  function on_window_resize() {
    window.setTimeout(function() {
      self.onResize();
    }, 350);
  }
  BUS.on('window.resize', on_window_resize);
  on_window_resize(); // Fire it once initially (with a delay)
};


JQueryContactsView.prototype.renderWhoAmI = function renderWhoAmI(user) {
  this.$whoami.empty();
  if (!user) {
    return;
  }
  var template =
    "{{> user_avatar}}" +
    "<span class=name>{{user.name}}</span>";
  var view = {
    'user': user,

    'avatar_size': 32,
    'avatar_url': user.avatar_url || 'http://gravatar.com/avatar/' + user.img + "?s=32",
    'avatar_title': 'That is you!'
  };
  this.$whoami.append(Mustache.render(template, view, {'user_avatar': MustacheAvatarPartial.template_img}));
};
JQueryContactsView.prototype.onWhoamiClick = function onWhoamiClick() {};
