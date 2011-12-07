"use strict";
/**
 * The display for the ContactsChooserPresenter
 */
function ContactsChooserDisplay() {}
ContactsChooserDisplay.prototype.show = function(title, contacts) {};
ContactsChooserDisplay.prototype.close = function() {};
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
	
	BUS.on('contacts.chooser.open', jQuery.proxy(function(config) {
		var defaults = {
			'multiple': false,
			'on_add': function(contact) {},
			'on_close': function() {}
		};
		var options = jQuery.extend(defaults, config);
		this.open(options);
	}, this));
};
/**
 * Starts a loop where the user can add users. For each added user the options.on_add callback is executed.
 * 
 * options: {
 *  on_add: function(contact) {},
 *  on_close: function() {},
 *  multiple: true | false
 * }
 */
ContactsChooserPresenter.prototype.open = function(options) {	
	var display = this.display;
	this.model.getContacts(function(err, contacts) {
		if ( !err ) {
			
			display.onAddContact = function(contact) {
				options.on_add(contact);
				if ( !options.multiple) display.close();
			};
			display.onClose = function() {
				options.on_close();
			};
			display.show('Add participant', contacts );
		}
	});
};
