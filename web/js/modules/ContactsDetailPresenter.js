/*global BUS API */
"use strict";

function ContactsDetailDisplay() {}
ContactsDetailDisplay.prototype.show = function(contact) {};
ContactsDetailDisplay.prototype.showMessage = function(sMessage) {};
ContactsDetailDisplay.prototype.addAction = function(label, callback) {};
ContactsDetailDisplay.prototype.onClose = function() {};



function ContactsDetailPresenter(display, model, eventName) {
  this.display = display;
  this.model = model;

  BUS.on(eventName, function(data) {
    var theUser = data.user || data.contact;
    display.show(theUser);

    // Add action buttons from provided params
    if (data.actions) {
      for (var x in data.actions) {
        display.addAction(
          data.actions[x].title,
          data.actions[x].callback
        );
      }
    }
    // Also add an 'Add contact' button, if user is not in model and not ourself
    if (theUser.id !== API.user_id() && !model.isContact(theUser.id)) {
      display.addAction('Add as contact', function() {
        model.addNewContact(theUser.email, function(err, data) {
          if (!err && data) {
            display.showMessage('Contact added!');
          } else {
            display.showMessage('Contact could not be added.');
          }
        });
        display.hide();
      });
    }

  });
}
