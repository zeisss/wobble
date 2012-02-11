"use strict";

/**
 * <div id="contacts" class="widget">
 *		<div class="whoami">
 *		</div>
 *		<div class="actions">
 *			<button id="contacts_add">Add</button>
 *			<button id="user_change_name">Change my name</button>
 *		</div>
 *		<ul class="contactslist">
 *		</ul>
 *	</div>
 */
function JQueryContactsView() {
	var template = 
		'<div class="whoami"></div>' + 
		'<div class="actions">' + 
		'	<button id="contacts_add">Add</button>' + 
		'	<button id="show_my_profile">Show my profile</button>' + 
		'</div>' + 
		'<ul class="contactslist"></ul>';
	this.e = $('<div></div>').addClass('widget').attr('id', 'contacts').appendTo('#widgets');
    
    
   
	// NOTE: Makes sure that thie contactsList does not start with a 100% width 
	// and thus prvents the other widgets from beeing rendered
	this.e.css('width', '180px'); 

	this.e.append(template);
    this.$whoami = $(".whoami", this.e);
    this.$actions = $(".actions", this.e);
    this.$contactsList = $(".contactslist", this.e);

	// UI Event Handlers	
	this.$whoami.click($.proxy(function() {
	   this.fireWhoamiClicked();
	}, this));
	$("#contacts_add").click($.proxy(function() {
		var contactEmail = window.prompt("Enter the new contact's email address");
		if (contactEmail !== null) {
			this.onAddContact(contactEmail);
		}
	}, this));
	$("#show_my_profile").click($.proxy(function() {
	   var that = this;
	   that.fireWhoamiClicked();		
	}, this));

	// On a window.resize event wait for the transformations to finish (should be done in 300ms) and recalc height
	function on_window_resize() {
		var t = this;
		window.setTimeout( function() {
			t.onResize();
		}, 350);
	}
	BUS.on('window.resize', on_window_resize, this);
	on_window_resize.call(this); // Fire it once initially (with a delay)

};
JQueryContactsView.prototype = new ContactsDisplay();
JQueryContactsView.prototype.constructor = JQueryContactsView;

// Methods 
JQueryContactsView.prototype.onResize = function() {
	var viewHeight = this.e.innerHeight();
	var offsetX = this.$whoami.outerHeight() + this.$actions.outerHeight()

	this.$contactsList.css('height', viewHeight - offsetX);
};

JQueryContactsView.prototype.fireWhoamiClicked = function() {
  var that = this;
  BUS.fire('contact.clicked', {
      'contact': API.user(),
      'actions': [
        {title: 'Change my name', callback: function() {
            var newName = window.prompt("What should your new name be?");
    		if ( newName !== null ) {
    			that.onNameChange(newName);
    		}
        }},
        {title: 'Change password', callback: function() {
           var p1 = window.prompt('What should your new password be?');
           if (p1 !== null) {
             var p2 = window.prompt('And once again to be sure:');
             if (p2 !== null) {
               if (p1 === p2) {
                   that.onPasswordChange(p1);
               } else {
                   window.alert('Your two passwords do not match. Try again.');   
               }
             }   
           }
        }}
      ]
   });
};
JQueryContactsView.prototype.renderContacts = function (list) {
	this.$contactsList.empty();
	
	jQuery.each(list, $.proxy(function(i, contact) {
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
	}, this));
};
JQueryContactsView.prototype.renderWhoAmI = function(user) {
	this.$whoami.empty();
	var template = "<img title='That is you!' src='http://gravatar.com/avatar/{{{img}}}?s=32' width=32 height=32> <span class=name>{{name}}</span>";
	this.$whoami.append(Mustache.to_html(template, user));
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
	this.e.addClass('dialog');

	this.relativeTo = relativeTo;

	this.contacts = [];
	this.selectedContact = null;
};
ListContactsChooserDisplay.prototype = new ContactsChooserDisplay;
ListContactsChooserDisplay.prototype.constructor = ListContactsChooserDisplay;
ListContactsChooserDisplay.prototype.show = function(title, contacts) {
	this.title = title;
	this.contacts = contacts;
	this.render();
};
ListContactsChooserDisplay.prototype.render = function() {
	var $filterText, $contactList;

	// Generate the content
	var template =  '<div id="contactschooser_title">{{title}}</div>' + 
					'<div class="buttons"><button class=button_close>x</button></div>' + 
					'<div id="contactschooser_filter"><input type=text id="contactschooser_filter_text"></div>' + 
					'<ul id="contactschooser_list">'
					'</ul>';	
	this.e.empty().append(Mustache.to_html(template, {
		'title': this.title
	}));
	$contactList = $('#contactschooser_list', this.e);
	if ( this.contacts.length == 0 ) {
		$contactList.append('<li>No contacts</li>');
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
			})).attr('id', 'contactchooser-contact-' + contact.id).appendTo($contactList);
			$li.data('contact', contact);

			$li.click($.proxy(function() {
				// Move cursor to clicked and then one down
				this.setSelectedContact(contact);
				this.navigateNextContact();

				// Contact was clicked
				this.onAddContact(contact);
				$li.detach(); // Remove row after adding it
				$filterText.focus(); // Refocus the text input, where we capture the keyboard events
			}, this));

			if (i == 0) {
				// Autoselect the first element
				this.setSelectedContact(contact);
			}
		}, this));
	}

	// Install button-listeners
	$('.button_close', this.e).click($.proxy(function() {
		this.close();
	}, this));

	$filterText = $("#contactschooser_filter_text");
	$filterText.keydown($.proxy(function(e) {
		if (e.which == 27) {
			// Close dialog on escape
			this.close();
		}
		else if (e.which == 38) {
			// Naviagte up
			this.navigatePreviousContact();
			e.preventDefault();
		}
		else if (e.which == 40) {
			// Navigate down
			this.navigateNextContact();
			e.preventDefault();
		}
		else if (e.which == 13) {
			e.preventDefault();
			$('#contactchooser-contact-' + this.selectedContact.id).click(); // Simulate clicking on it
		}

	}, this));
	$filterText.keyup($.proxy(function(e) {
		// Refresh filtered list
		this.refreshFilteredContactList($filterText.val());
	}, this));

	// Position it relative to this.relativeTo
	if (this.relativeTo) {
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
	this.e.empty().css('display', 'none'); // Clear and hide 
	this.onClose(); // Notify caller
};
ListContactsChooserDisplay.prototype.setSelectedContact = function(contact) {
	$('.active', this.e).removeClass('active');
	if ( contact != null ) {
		$('#contactchooser-contact-' + contact.id, this.e).addClass('active');
	}

	this.selectedContact = contact;
};
ListContactsChooserDisplay.prototype.navigateNextContact = function() {
	var element = $("#contactchooser-contact-" + this.selectedContact.id);

	// Find the next element which is visible
	do {
		element = element.next();
	} while (element.css('display') == 'none');

	if ( element ) {
		this.setSelectedContact(element.data('contact'));
	}
};
ListContactsChooserDisplay.prototype.navigatePreviousContact = function() {
	var element = $("#contactchooser-contact-" + this.selectedContact.id);

	// Find the next element which is visible
	do {
		element = element.prev();
	} while (element.css('display') == 'none');

	if ( element ) {
		this.setSelectedContact(element.data('contact'));
	}
};
ListContactsChooserDisplay.prototype.refreshFilteredContactList = function(filterText) {
	var firstContact = null;

	$(".contact", this.e).css('display', ''); // Show all contacts

	filterText = filterText.toLowerCase();

	for (var i = 0; i < this.contacts.length; i++) {
		var contact = this.contacts[i];
		// Show all elements
		if (!(contact.name.toLowerCase().indexOf(filterText) >= 0 || contact.email.indexOf(filterText) >= 0 )) {
			// text not found in name or email
			var $contact = $("#contactchooser-contact-"+ contact.id);
			$contact.css('display', 'none');

			// If the selectedContact is now hidden, set selectedContact to null
			if ( contact == this.selectedContact) {
				this.setSelectedContact(null);
			}
		} else {
			if ( firstContact == null ) {
				firstContact = contact;
			}
		}	
	};

	
	if ( this.selectedContact == null && firstContact != null) {
		// No contact selected, mark the first visible one
		this.setSelectedContact(firstContact);
	}
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
	});
};
SimpleContactsChooserDisplay.prototype.close = function() {
	this.onClose();
};


/**
 * 
 */
function jQueryContactsDetailDisplay(x,y) {
	this.e = $('<div class="dialog contactdetail"></div>').appendTo($('body')).css('display', 'none').css('left', x).css('top', y);
	this.contact = null;
	
	var that = this;
	this.e.click(function() {
		that.hide();
	});
};
jQueryContactsDetailDisplay.prototype = new ContactsDetailDisplay;
jQueryContactsDetailDisplay.prototype.constructor = jQueryContactsDetailDisplay;

jQueryContactsDetailDisplay.prototype.show = function(contact) {
	this.contact = contact;
	
	
	var template =  ' <div class="usericon usericon{{size}}">' +
					'   <div><img src="http://gravatar.com/avatar/{{img}}?s={{size}}" width="{{size}}" height="{{size}}"></div>' +
					'   <div class="status {{status}}"></div>' + 
					' </div>'+ 
					' <div class=name>{{name}}</div>' + 
					' <div class=email>{{email}}</div>';
					
	var html = Mustache.to_html(template, {
		'img': contact.img,
		'name': contact.name,
		'email': contact.email,
		'status': contact.online == 1 ? 'online': 'offline',
		'size': 100
	});
	this.e.html(html).css('display', '');
};
jQueryContactsDetailDisplay.prototype.hide = function() {
	this.e.css('display', 'none');
	this.onClose();
	this.contact = null;
};

jQueryContactsDetailDisplay.prototype.addAction = function(title, callback) {
	$('<button></button>').text(title).click(callback).appendTo(this.e);
};
