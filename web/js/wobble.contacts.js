"use strict";

function ContactsModel() {
	this.cache = {};
	this.user = API.user();
	
	
	var that = this;
	BUS.on('api.user', function(user) {
		that.user = user;
	});
};
ContactsModel.prototype.findByEmail = function (email) {
	var result = undefined;
	jQuery.each(this.cache, function(i, user) {
		if ( user.email === email ) {
			result = user;
		}
	});
	return result;
};
ContactsModel.prototype.getContacts = function (callback) {
	var that = this;
	API.get_contacts(function(err, data) {
		if ( data) {
			jQuery.each(data, function(i, user) {
				that.put(user);
			});
		}
		callback(err, data);
	});
};
ContactsModel.prototype.put = function (contact) {
	this.cache[contact.id] = contact;
};
ContactsModel.prototype.get = function (id) {
	return this.cache[id];
}
ContactsModel.prototype.addNewContact = function(contactEmail, callback) {
	API.add_contact(contactEmail, callback);
};
ContactsModel.prototype.getUser = function() {
	return this.user;
}


/**
 * The prototype for the ContactsDisplay used by the ContactsPresenter.
 */
function ContactsDisplay() {}
// Event Callbacks (Will be set by presenter)
ContactsDisplay.prototype.onAddContact = function(contactEmail) {};
ContactsDisplay.prototype.onContactClick = function(contact) {};
ContactsDisplay.prototype.onNameChange = function(new_name) {};
// Methods
ContactsDisplay.prototype.renderContacts = function (list) {};
ContactsDisplay.prototype.renderWhoAmI = function(user) {};


function ContactsPresenter(display, model) {
	this.display = display;
	this.model = model;
	
	this.refreshContacts(); // Load initially
	
	var that = this;
	
	// Timers & Data Loading  ----------------------------------
	var timer = setTimeout(function() {	
		that.refreshContacts();
	}, 60 * 1000);  // Reload contact list once a minute
	
	// Button Handlers  ---------------------------------------------------
	display.onAddContact = function(contactEmail) {
		model.addNewContact(contactEmail, function(err, data) {
			if ( data ) {
				window.alert('Contact added!');
				that.refreshContacts();
			} else {
				window.alert('Contact not found!');
			}
		});
	};
	display.onContactClick = function(contact) {
		BUS.fire('contact.clicked', contact);
	};
	display.onNameChange = function(newName) {
		API.user_change_name(newName, function(err, result) {
			if ( !err ) {
				API.init();
			}
		});
	};
	
	// BUS Handler  ---------------------------------------------------
	BUS.on('contacts.refresh', function() {
		that.refreshContacts();
	});
	BUS.on('api.user', function(user) {
		display.renderWhoAmI(user);
	});
	BUS.on('api.notification', function(message) {
		if ( message.type == 'user_signout' || message.type == 'user_online') { // We receive this message only, because we are on his contacts list
			that.refreshContacts();
		}
	});
	
	return that;
}
// Methods ---------------------------------------------------
ContactsPresenter.prototype.refreshContacts = function () {
	var display = this.display;
	this.model.getContacts(function(err, data) {
		if (!err) {
			display.renderContacts(data);
		}
	});
};