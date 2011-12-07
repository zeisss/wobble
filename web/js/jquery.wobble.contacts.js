(function($) {
	"use strict";
	
	function ContactsModel() {
		var that = this;
		that.cache = {};
		this.user = API.user();
		
		BUS.on('api.user', function(user) {
			that.user = user;
		});
		
		that.put = function (contact) {
			that.cache[contact.id] = contact;
		};
		
		that.get = function (id) {
			return that.cache[id];
		}
		
		that.findByEmail = function (email) {
			var result = undefined;
			jQuery.each(that.cache, function(i, user) {
				if ( user.email === email ) {
					result = user;
				}
			});
			return result;
		};
	
		that.getContacts = function (callback) {
			API.get_contacts(function(err, data) {
				if ( data) {
					jQuery.each(data, function(i, user) {
						that.put(user);
					});
				}
				callback(err, data);
			});
		};
		
		that.addNewContact = function(contactEmail, callback) {
			API.add_contact(contactEmail, callback);
		};
	}
	ContactsModel.prototype.getUser = function() {
		return this.user;
	}
	
	function ContactsView() {
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
	// Event Callbacks
	ContactsView.onAddContact = function(contactEmail) {};
	ContactsView.onContactClick = function(contact) {};
	ContactsView.onNameChange = function(new_name) {};
	
	// Methods 
	ContactsView.prototype.renderContacts = function (list) {
		var that = this;
		var ul = $("#contacts ul").empty();
		
		$.each(list, function(i, contact) {
			var template = "<li class=contact title='{{email}}'><img src='http://gravatar.com/avatar/{{{img}}}?s=16' width=16 height=16> {{name}}</li>";
			ul.append($(Mustache.to_html(template, contact)).click(function() {
				that.onContactClick(contact);
			}));
		});
	};
	ContactsView.prototype.renderWhoAmI = function(user) {
		var whoami = $("#contacts .whoami").empty();
		var template = "<img title='That is you!' src='http://gravatar.com/avatar/{{{img}}}?s=32' width=32 height=32> <span class=name>{{name}}</span>";
		whoami.append(Mustache.to_html(template, user));
	};
	
	
		

		
	
	
	
	function ContactsPresenter(view, model) {
		var that = this;
		
		// Methods ---------------------------------------------------
		that.refreshContacts = function () {
			model.getContacts(function(err, data) {
				view.renderContacts(data);
			});
		};
		
		// Timers & Data Loading  ----------------------------------
		var timer = setTimeout(function() {	
			that.refreshContacts();
		}, 60 * 1000);  // Reload contact list once a minute
		that.refreshContacts(); // Load initially
		
		BUS.on('api.user', function(user) {
			view.renderWhoAmI(user);
		});
		
		// Button Handlers  ---------------------------------------------------
		view.onAddContact = function(contactEmail) {
			model.addNewContact(contactEmail, function(err, data) {
				if ( data ) {
					window.alert('Contact added!');
					that.refreshContacts();
				} else {
					window.alert('Contact not found!');
				}
			});
		};
		view.onContactClick = function(contact) {
			BUS.fire('contact.clicked', contact);
		};
		view.onNameChange = function(newName) {
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
		
		return that;
	}
	
	function SimpleContactsChooserPresenter() {
		this.prompt = function(title) {
			return window.prompt(title);
		};
	}
	
	function ContactsChooserPresenter(view, model) {
		var that = this;
		
		BUS.on('contacts.chooser.open', function(config) {
			var defaults = {
				'multiple': false,
				'on_add': function(contact) {},
				'on_close': function() {}
			};
			var options = jQuery.extend(defaults, config);
			that.open(options);
		});
		
		this.open = function(options) {
			do {
				var contactId = view.prompt('Add participant');
				if (contactId) {
					var id = Number(contactId);
					if ( model.get(id)) {
						options.on_add(model.get(id));
					}
					else {
						var byEmail = model.findByEmail(contactId);
						if (byEmail) {
							options.on_add(byEmail);
						}
					}
				}
			} while (contactId && options.multiple);
			options.on_close();			
		};
	}
	
	$(document).ready(function() {
		
		var model = new ContactsModel();
		
		var contactsList = new ContactsPresenter(new ContactsView(), model);
		var chooser = new ContactsChooserPresenter(new SimpleContactsChooserPresenter(), model);
	});
})(jQuery);