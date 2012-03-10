"use strict";

/**
 * The contacts-model represents the list of contacts the current
 * user has.
 *
 * Events:
 *  - user - API.user() changed
 *  - update - List of contacts was reloaded
 *  - added - A contact was added
 *  - removed - A contact was removed
 */
function ContactsModel(cache) {
  this.contacts = [];
  if (cache) {
    this.cache = cache;
    this.cacheTimeout = 7 * 24 * 60 * 60;
    this.contacts = this.cache.get('contactlist.contacts') || [];

    var that = this;
    setTimeout(function() {
      that.fire('update');
    }, 50);
  }
  this.user = API.user();

  BUS.on('api.user', function(user) {
    this.user = user;
    this.contacts = [];
    this.fire('user', user);

    this.refreshContactList();
  },this);

  BUS.on('api.notification', function(message) {
    if (message.type == 'user_online' || message.type == 'user_signout') {
      this.refreshContactList();
    }
  }, this)

  var that = this;
  that.refreshContactList(); // Initial load
  this.refreshTimer = setInterval(function() {
    that.refreshContactList();
  }, 1 * 60 * 1000);
};
_.extend(ContactsModel.prototype, EventBUS.prototype); // Make the model an eventbus

ContactsModel.prototype.findByEmail = function (email) {
  for (var i = 0; i < this.contacts.length; i++) {
    var user = this.contacts[i];
    if (user.email === email) {
      return user
    }
  }
  return null;
};

ContactsModel.prototype.getContacts = function (callback) {
  var result = this.contacts;
  _.defer(function() { // Fake the async behavior
    callback(undefined, result);
  })
};

ContactsModel.prototype.getUser = function() {
  return this.user;
};

ContactsModel.prototype.addNewContact = function(contactEmail, callback) {
  var that = this;
  API.add_contact(contactEmail, function(err, result) {
    if (!err) {
      that.refreshContactList();

      that.fire('added');
    }
    if (callback)
      return callback(err, result);
  });
};

ContactsModel.prototype.isContact = function(contactId) {
  var list = _.filter(this.contacts, function(contact) {
    return contact.id == contactId;
  })
  return (list.length > 0);
}

ContactsModel.prototype.removeContactFromRooster = function(userId, callback) {
  var that = this;
  API.contact_remove(userId, function(err, data) {
    // Update the model
    that.contacts = _.filter(that.contacts, function(contact) {
      return contact && contact.id != userId;
    });

    that.fire('removed');

    that.refreshContactList();

    // Call the callback
    if (callback)
      return callback(err, data);
  });
}

/**
 * Refresh the contactlist in the background.
 */
ContactsModel.prototype.refreshContactList = function() {
  // Prevent to many calls
  if (this.fetchInProgress)
    return;
  this.fetchInProgress = true;

  // Now that we are clear, call the API
  var that = this;
  API.get_contacts(function(err, data) {
    that.fetchInProgress = false;
    if (!err) {
      // Update our local version
      that.contacts = [];
      for (var i = 0; i < data.length; i++) {
        that.contacts.push(data[i]);
      }
      if (that.cache) 
        that.cache.set('contactlist.contacts', that.contacts, that.cacheTimeout);
      that.fire('update');
    }
  });
}