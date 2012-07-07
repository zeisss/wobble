/*global BUS*/
"use strict";


/**
 * The prototype for the ContactsDisplay used by the ContactsPresenter.
 */
function ContactsDisplay() {}
// Event Callbacks (Will be set by presenter)
ContactsDisplay.prototype.onAddContact = function(contactEmail) {};
ContactsDisplay.prototype.onContactClick = function(contact) {};

// Methods
ContactsDisplay.prototype.renderContacts = function (list) {};
ContactsDisplay.prototype.showMessage = function(message) { window.alert(message); };


function ContactsPresenter(display, model) {
  this.display = display;
  this.model = model;

  var that = this;

  // Button Handlers  ---------------------------------------------------
  display.onAddContact = function(contactEmail) {
    that.model.addNewContact(contactEmail, function(err, data) {
      if (data) {
        that.display.showMessage('Contact added!');
      } else {
        that.display.showMessage('Contact could not be added.');
      }
    });
  };
  display.onContactClick = function(contact) {
    // Forward to the BUS => Other Module
    BUS.fire('contact.clicked', {
      'contact': contact,
      'actions': [
        {title: 'Remove Contact', callback: function() {
          that.removeContactFromRooster(contact.id);
        }}
      ]
    });
  };
  display.onWhoamiClick = function() {
    var pos = that.display.$whoami.offset();
    pos.top += that.display.$whoami.outerHeight() + 5;
    pos.left += 5;
    BUS.fire('ui.profile.show', pos);
  };

  // WhoAmI  ---------------------------------------------------
  model.on('update', this.refreshContacts, this);

  // Initial rendering
  if (model.getUser()) {
    this.display.renderWhoAmI(model.getUser());
  }
  return that;
}
// Methods ---------------------------------------------------
ContactsPresenter.prototype.removeContactFromRooster = function(userId) {
  var that = this;
  this.model.removeContactFromRooster(userId, function(err) {
    that.refreshContacts();
  });
};

ContactsPresenter.prototype.refreshContacts = function () {
  var display = this.display;
  this.model.getContacts(function(err, data) {
    if (!err) {
      display.renderContacts(data);
    }
  });
};