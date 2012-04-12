/*global ContactsChooserDisplay */
"use strict";

/**
 * A simple ContactsChooserDisplay Implementation using only the standard 
 * javascript window.prompt() function. 
 */
function SimpleContactsChooserDisplay() {}
SimpleContactsChooserDisplay.prototype = new ContactsChooserDisplay();
SimpleContactsChooserDisplay.prototype.constructor = SimpleContactsChooserDisplay;
SimpleContactsChooserDisplay.prototype.show = function(title, contacts) {
  var that = this;
  window.setTimeout(function() { // Do this async
    var contactNameOrEmail = window.prompt(title);
    if (contactNameOrEmail !== null) {
      var matchingContacts = jQuery.grep(contacts, function(contact, index) {
        return contact.name == contactNameOrEmail || contact.email == contactNameOrEmail;
      });
      if (matchingContacts.length > 0) {
        that.onAddContact(matchingContacts[0]);
        return;
      }
    }
    // No contact entered or found, closing
    that.close();
  });
};
SimpleContactsChooserDisplay.prototype.close = function() {
  this.onClose();
};


