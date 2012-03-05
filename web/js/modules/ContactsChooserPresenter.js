"use strict";
/**
 * The display for the ContactsChooserPresenter
 */
function ContactsChooserDisplay() {}
// Methods
ContactsChooserDisplay.prototype.show = function(title) {};
ContactsChooserDisplay.prototype.close = function() {};
ContactsChooserDisplay.prototype.setPresenter = function(presenter) {
  this.presenter = presenter;
}
ContactsChooserDisplay.prototype.renderContacts = function(contacts) {}
// Callbacks
ContactsChooserDisplay.prototype.onAddContact = function(contact) {};
ContactsChooserDisplay.prototype.onClose = function(contact) {};

/**
 * The ContactsChooserPresenter. Listens for BUS events to show it's UI. Use the ContactsModel.
 * 
 * @param display A ContactsChooserDisplay Implementation
 * @param model A ContactsModel
 */
function ContactsChooserPresenter(display, model) {
  this.display = display;
  this.model = model;

  this.display.setPresenter(this);

  BUS.on('contacts.chooser.open', function(config) {
    var options = _.defaults(config, {
      'multiple': false,
      'on_add': function(contact) {},
      'on_close': function() {},
      'remove_contacts': []
    });
    this.open(options);
  }, this);

  // Autoclose the display when the topic changes
  BUS.on('topic.selected', function() {
    this.display.close();
  }, this);
};
/**
 * Starts a loop where the user can add users. For each added user the options.on_add callback is executed.
 * 
 * options: {
 *  on_add: function(contact) {},
 *  on_close: function() {},
 *  multiple: true | false,
 *  remove_contacts: [user_id]
 * }
 */
ContactsChooserPresenter.prototype.open = function(options) {
  var display = this.display;
  display.show('Add participant');
  this.model.getContacts(function(err, contacts) {
    if (!err) {
      var showableContacts = _.filter(contacts, function(contact) {
        var shouldBeRemoved = _.contains(options.remove_contacts, contact.id);
        return !shouldBeRemoved;
      });

      display.onAddContact = function(contact) {
        options.on_add(contact);
        if (!options.multiple) display.close();
      };
      display.onClose = function() {
        options.on_close();
      };
      display.render(showableContacts);
    }
  });
};
