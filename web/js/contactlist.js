;(function (exports) {
  var ContactView = Backbone.View.extend({
    tagName: 'li',
    className: 'contact',

    events: {
      'click': 'click'
    },

    options: {
      imgsize: 20,
      imgprefix: 'http://gravatar.com/avatar/',

      template:  "<div title='{{email}}'>" +
        "<div class='usericon usericon{{size}}'>" +
        "<div><img src='{{{img}}}?s={{size}}' width={{size}} height={{size}}></div>" +
        "<div class='status {{online}}'></div>" +
        "</div>" +
        "<span class=name>{{name}}</span>" +
        "</div>"
    },

    initialize: function () {
      _.bindAll(this, 'render', 'click');
    },

    render: function() {
      this.$el.html(Mustache.to_html(this.options.template, {
          size: this.options.imgsize,
          email: this.model.email,
          name: this.model.name,
          img: this.options.imgprefix + this.model.img,
          online: this.model.online == 1 ? 'online' : 'offline'
      }))
      return this;
    },

    click: function () {
      var self = this;
      // Forward to the BUS => Other Module
      BUS.fire('contact.clicked', {
        'contact': this.model,
        'actions': [
          {title: 'Remove Contact', callback: function() {
            self.trigger('remove-contact', self.model.id)
          }}
        ]
      });
    }
  });

  exports.ContactRosterView = Backbone.View.extend({
    tagName: 'div',

    events: {
      'click button#contacts_add': 'addContact'
    },

    options: {
      addContactLabel: 'Add'
    },

    initialize: function () {
      _.bindAll(this, 'render', 'addContact', 'onResize');

      this.collection = new ContactsModel();
      this.collection.on('update', this.render);
      this.collection.on('added', this.render);
      this.collection.on('removed', this.render);

      $('<button id="contacts_add"></button>').text(this.options.addContactLabel).appendTo(this.$('.actions'))

      // NOTE: I have no idea, but I propably had my reasons ...
      // {
      // On a window.resize event wait for the transformations to finish (should be done in 300ms) and recalc height
      var self = this;
      function on_window_resize() {
        window.setTimeout(function() {
          self.onResize();
        }, 350);
      }
      BUS.on('window.resize', on_window_resize);
      on_window_resize(); // Fire it once initially (with a delay)
      // }
    },

    render: function () {
      var self = this;
      var $ul = $('ul.contactslist', this.$el);

      this.collection.getContacts(function (err, contacts) {
        if (err) {
          return console.log('fetching contacts failed', err);
        }
        $ul.empty();
        if (contacts.length === 0) {
          $('<li></li>').html('Sorry, you have no contacts.').css('font-size', 'small').appendTo($ul);
        }
        contacts.forEach(function (contact) {
          var v = new ContactView({
            model: contact,
            imgsize: 20
          });
          v.on('remove-contact', function (contactId) {
            self.collection.removeContactFromRoster(contactId);
          });
          $ul.append(v.render().el);
        });
      });
    },

    // Set an absolute height for .contactlist so it takes all available space.
    onResize: function () {
      var viewHeight = this.$el.innerHeight();
      var offsetX = this.$('.whoami').outerHeight() + this.$('.actions').outerHeight();

      this.$('.contactslist').css('height', viewHeight - offsetX);
    },

    addContact: function () {
      var contactEmail = window.prompt("Enter the new contact's email address");
      if (!contactEmail) {
        return;
      }

      this.collection.addNewContact(contactEmail, function(err, data) {
        if (data) {
          alert('Contact added!');
        } else {
          alert('Contact could not be added.');
        }
      });
    }
  });
})(window)