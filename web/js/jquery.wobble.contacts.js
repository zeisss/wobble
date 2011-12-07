"use strict";

function JQueryContactsView() {
	var that = this;
	// UI Event Handlers		
	$("#contacts_add").click(function() {
		var contactEmail = window.prompt("Enter the new contact's email address");
		if (contactEmail !== null) {
			that.onAddContact(contactEmail);
		}
	});
	$("#user_change_name").click(function() {
		var newName = window.prompt("What should your new name be?");
		if ( newName !== null ) {
			that.onNameChange(newName);
		}
	});
}
JQueryContactsView.prototype = new ContactsDisplay();
JQueryContactsView.prototype.constructor = JQueryContactsView;

// Methods 
JQueryContactsView.prototype.renderContacts = function (list) {
	var that = this;
	var ul = $("#contacts ul").empty();
	
	$.each(list, function(i, contact) {
		var template = "<li class=contact title='{{email}}'>" + 
						"<div class='usericon usericon{{size}}'>" +
						"<div><img src='http://gravatar.com/avatar/{{{img}}}?s={{size}}' width={{size}} height={{size}}></div>" +
						"<div class='status {{online}}'></div>" + 
						"</div>" + 
						"<span class=name>{{name}}</span>" +
						"</li>";
		ul.append($(Mustache.to_html(template, {
				size: 20,
				email: contact.email,
				name: contact.name,
				img: contact.img,
				online: contact.online == 1 ? 'online' : 'offline'
			})).click(function() {
			that.onContactClick(contact);
		}));
	});
};
JQueryContactsView.prototype.renderWhoAmI = function(user) {
	var whoami = $("#contacts .whoami").empty();
	var template = "<img title='That is you!' src='http://gravatar.com/avatar/{{{img}}}?s=32' width=32 height=32> <span class=name>{{name}}</span>";
	whoami.append(Mustache.to_html(template, user));
};


/**
 * A simple ContactsChooserDisplay Implementation using only the standard javascript window functions. 
 */
function SimpleContactsChooserDisplay() {}
SimpleContactsChooserDisplay.prototype = new ContactsChooserDisplay;
SimpleContactsChooserDisplay.prototype.constructor = SimpleContactsChooserDisplay;
SimpleContactsChooserDisplay.prototype.show = function(title, contacts) {
	var that = this;
	window.setTimeout(function() { // Do this async
		var contactNameOrEmail = window.prompt(title);
		if ( contactNameOrEmail != null ) {
			var matchingContacts = jQuery.grep(contacts, function(contact, index) {
				return contact.name == contactNameOrEmail || contact.email == contactNameOrEmail;
			});
			if (matchingContacts.length > 0 ) {
				that.onAddContact(matchingContacts[0]);
				return;
			}
		}
		// No contact entered or found, closing
		that.close();
	}, 0);
};
SimpleContactsChooserDisplay.prototype.close = function() {
	this.onClose();
};