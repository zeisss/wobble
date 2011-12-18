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
 * A contactschooser dialog similar to the original Google Wave version.
 * The dialog shows all contacts who are not yet added to the topic in a list.
 * The user can filter the list with a textfield at the top. 
 * The left/right keys navigate inside the filter.
 * The up/down keys navigate in the contacts list.
 * By clicking a contact or pressing [Enter] when selected, the callback onAddContact() gets fired.
 */
function ListContactsChooserDisplay(relativeTo) {
	this.e = $('<div></div>').attr('id', 'contactschooser').appendTo('body'); // The element to use
	this.e.css('display', 'none');

	this.relativeTo = relativeTo;

	this.contacts = [];
};
ListContactsChooserDisplay.prototype = new ContactsChooserDisplay;
ListContactsChooserDisplay.prototype.constructor = ListContactsChooserDisplay;
ListContactsChooserDisplay.prototype.show = function(title, contacts) {
	this.title = title;
	this.contacts = contacts;
	this.render();
};
ListContactsChooserDisplay.prototype.render = function() {
	// Generate the content
	var template =  '<div id="contactschooser_title">{{title}}</div>' + 
					'<div class="buttons"><button class=button_close>x</button></div>' + 
					'<div id="contactschooser_filter"><input type=text id="contactschooser_filter_text"></div>' + 
					'<ul id="contactschooser_list">'
					'</ul>';	
	this.e.empty().append(Mustache.to_html(template, {
		'title': this.title
	}));
	var list = $('#contactschooser_list', this.e);
	if ( this.contacts.length == 0 ) {
		list.append('<li>No contacts</li>');
	} else {

		jQuery.each(this.contacts, $.proxy(function(i, contact) {
			var template = "<li class=contact title='{{email}}'>" + 
							"<div class='usericon usericon{{size}}'>" +
							"<div><img src='http://gravatar.com/avatar/{{{img}}}?s={{size}}' width={{size}} height={{size}}></div>" +
							"<div class='status {{online}}'></div>" + 
							"</div>" + 
							"<span class=name>{{name}}</span>" +
							"</li>";
			var $li = $(Mustache.to_html(template, {
					size: 20,
					email: contact.email,
					name: contact.name,
					img: contact.img,
					online: contact.online == 1 ? 'online' : 'offline'
			})).appendTo(list).click($.proxy(function() {
				// Contact was clicked
				this.onAddContact(contact);
				$li.detach(); // Remove row after adding it
			}, this));
		}, this));
	}
	
	// Install button-listeners
	$('.button_close', this.e).click($.proxy(function() {
		this.close();
	}, this));

	var $filterText = $("#contactschooser_filter_text").keypress($.proxy(function(e) {
		if ( event.which == 38) {
			// Naviagte left
			this.navigatePreviousContact();
		}
		else if ( event.which == 40) {
			// Navigate right
			this.navigateNextContact();
		} else {
			// Refresh filtered list
			this.refreshFilteredContactList($filterText.val());
		}
	}, this));

	// Position it relative to this.relativeTo
	if ( this.relativeTo ) {
		var relativeElem = $(this.relativeTo);
		var pos = relativeElem.offset();
		this.e.css('top', pos.top).css('left', pos.left - (this.e.width() * 0.75));
	}

	// Finally, show it
	this.e.css('display', '');

	// And focus the textfield
	$filterText.focus();
};
ListContactsChooserDisplay.prototype.close = function() {
	this.e.empty().css('display', 'none');
	this.onClose();
};

ListContactsChooserDisplay.prototype.navigateNextContact = function() {
};
ListContactsChooserDisplay.prototype.navigatePreviousContact = function() {
};
ListContactsChooserDisplay.prototype.refreshFilteredContactList = function(filterText) {
};

/**
 * A simple ContactsChooserDisplay Implementation using only the standard 
 * javascript window.prompt() function. 
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