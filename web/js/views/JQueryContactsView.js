/*global BUS ContactsDisplay */
"use strict";

/**
 * This is the view containing the ConstactsRooster as well as the user info.
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
  this.$contactsList.empty();

  if (list.length === 0) {
    $('<li></li>').html('Sorry, you have no contacts.').css('font-size', 'small').appendTo(this.$contactsList);
  }

  _.each(list, function(contact) {
    var template = "<li class=contact title='{{email}}'>" +
            "<div class='usericon usericon{{size}}'>" +
            "<div><img src='http://gravatar.com/avatar/{{{img}}}?s={{size}}' width={{size}} height={{size}}></div>" +
            "<div class='status {{online}}'></div>" +
            "</div>" +
            "<span class=name>{{name}}</span>" +
            "</li>";
    $(Mustache.to_html(template, {
        size: 20,
        email: contact.email,
        name: contact.name,
        img: contact.img,
        online: contact.online == 1 ? 'online' : 'offline'
    })).appendTo(this.$contactsList).click($.proxy(function() {
      this.onContactClick(contact);
    }, this));
  }, this);
};

JQueryContactsView.prototype.renderWhoAmI = function renderWhoAmI(user) {
  this.$whoami.empty();
  if (!user) {
    return;
  }
  var template = "<img title='That is you!' src='http://gravatar.com/avatar/{{{img}}}?s=32' width=32 height=32> <span class=name>{{name}}</span>";
  this.$whoami.append(Mustache.to_html(template, user));
};

/*
Private Stuff
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

JQueryContactsView.prototype.onWhoamiClick = function onWhoamiClick() {
  var pos = that.display.$whoami.offset();
  pos.top += that.display.$whoami.outerHeight() + 5;
  pos.left += 5;
  BUS.fire('ui.profile.show', pos);
};
