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
	for (var i = 0; i < this.cache.length; i++) {
		var user = this.cache[i];
		if ( user.email === email ) {
			result = user;
		}
	}
	return result;
};
ContactsModel.prototype.getContacts = function (callback) {
	var that = this;
	API.get_contacts(function(err, data) {
		if (data) {
			for (var i = 0; i < data.length; i++) {
				that.put(data[i]);
			}
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
ContactsModel.prototype.removeUserFromRooster = function(userId, callback) {
	var that = this;
	API.contact_remove(userId, function(err, data) {
		// Update the model
		delete that.cache[userId];

		// Call the callback
		callback(err, data);
	});
}


/**
 * The prototype for the ContactsDisplay used by the ContactsPresenter.
 */
function ContactsDisplay() {}
// Event Callbacks (Will be set by presenter)
ContactsDisplay.prototype.onAddContact = function(contactEmail) {};
ContactsDisplay.prototype.onContactClick = function(contact) {};
ContactsDisplay.prototype.onNameChange = function(new_name) {};
ContactsDisplay.prototype.onPasswordChange = function(new_password) {};
// Methods
ContactsDisplay.prototype.renderContacts = function (list) {};
ContactsDisplay.prototype.renderWhoAmI = function(user) {};
ContactsDisplay.prototype.showMessage = function(message) { window.alert(message); };


function ContactsPresenter(display, model) {
	this.display = display;
	this.model = model;
	
	this.refreshContacts(); // Load initially
	if (model.getUser()) {
		this.display.renderWhoAmI(model.getUser());
	}

	var that = this;
	
	// Timers & Data Loading  ----------------------------------
	var timer = setTimeout(function() {	
		that.refreshContacts();
	}, 60 * 1000);  // Reload contact list once a minute
	
	// Button Handlers  ---------------------------------------------------
	display.onAddContact = function(contactEmail) {
		that.addUserByEmail(contactEmail);
	};
	display.onContactClick = function(contact) {
		BUS.fire('contact.clicked', {
			'contact': contact,			
			'actions': [
				{title: 'Remove Contact', callback: function() {
					that.removeUserFromRooster(contact.id);
				}}
			]
		});
	};
	display.onNameChange = function(newName) {
		API.user_change_name(newName, function(err, result) {
			API.refreshUser();
		});
	};
	display.onPasswordChange = function(newPassword) {
	   API.user_change_password(newPassword, function(err, result) {
	       if (result) {
	           window.alert('Password changed successfully.');    
	       }   
	   });
	};
	
	// BUS Handler  ---------------------------------------------------
	BUS.on('contacts.refresh', function() {
		this.refreshContacts();
	}, this);
	BUS.on('api.user', function(user) {
		this.display.renderWhoAmI(user);
	}, this);
	BUS.on('api.notification', function(message) {
		if ( message.type == 'user_signout' || message.type == 'user_online') { // We receive this message only, because we are on his contacts list
			this.refreshContacts();
		}
	}, this);
	BUS.on('contacts.adduser', function(userEmail) {
		this.addUserByEmail(userEmail);
	}, this);
	
	return that;
}
// Methods ---------------------------------------------------
ContactsPresenter.prototype.removeUserFromRooster = function(userId) {
	var that = this;
	this.model.removeUserFromRooster(userId, function(err) {
		that.refreshContacts();
	});
}
ContactsPresenter.prototype.addUserByEmail = function(email) {
	var that = this;
	this.model.addNewContact(email, function(err, data) {
		if ( data ) {
			that.refreshContacts();
			that.display.showMessage('Contact added!');
		} else {
			that.display.showMessage('Contact could not be added.');
		}
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