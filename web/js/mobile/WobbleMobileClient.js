/*global BUS BasicClient MobileLoginView LoginModel LoginPresenter API ContactsModel TopicListModel TopicModel MobileNavigation 
         ContactsDetailPresenter ContactsDetailPresenter
         JQueryContactsDetailDisplay JQueryContactsDetailDisplay JQueryTopicView JQueryTopicListView
         TopicListPresenter TopicPresenter
         ContactsChooserPresenter ListContactsChooserDisplay WindowUpdater UserProfilePresenter */
"use strict";

function WobbleMobileClient() {}
WobbleMobileClient.prototype = new BasicClient();

WobbleMobileClient.prototype.init = function(user) {
  this.initHeaders();

  if (user !== null) {
    this.initApp();
  } else {
    this.initLogin();
  }
};

WobbleMobileClient.prototype.initHeaders = function () {
  // Append the Mobile.css to the html tree
  $('<link />').appendTo('head').attr({
    'media': 'all',
    'rel': 'stylesheet',
    'type': 'text/css',
    'href': 'css/mobile.css'
  });
  /*$('<meta />').appendTo('head').attr({
    'name': 'viewport',
    'content': 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
  });*/

  $('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />').appendTo('head');
};

WobbleMobileClient.prototype.initLogin = function () {
  var that = this;

  this.loginView = new MobileLoginView();
  this.loginModel = new LoginModel();

  this.loginPresenter = new LoginPresenter(
    this.loginView,
    this.loginModel,
    function() {
      that.loginView.destroy(); // Remove the LoginView from the document

      API.refreshUser();

      // More code to show the actuall app
      that.initApp();
    }
  );
};

WobbleMobileClient.prototype.initApp = function() {
  this.$widgets = $("#widgets");

  this.cache = window.localcache.getCache();

  // DataModel
  this.contactsModel = new ContactsModel(this.cache);
  this.topicListModel = new TopicListModel(this.cache);
  this.topicModel = new TopicModel();

  // Create the navigator
  this.navigatorView = new MobileNavigation(this);

  // Create the views
  this.topicListView = new JQueryTopicListView(false, false);
  this.topicView = new JQueryTopicView();

  // Create the presenters
  this.contactsDetailPresenter = new ContactsDetailPresenter(new JQueryContactsDetailDisplay(20, 20), this.contactsModel, 'contact.clicked');
  this.topicListPresenter = new TopicListPresenter(this.topicListView, this.topicListModel);
  this.topicPresenter = new TopicPresenter(this.topicView, this.topicModel);
  this.contactsView = new window.ContactRosterView({
    el: $('<div><div class="header"></div>' +
          '<div class="actions"></div>' +
          '<ul class="contactslist"></ul></div>')
        .addClass('widget').attr('id', 'contacts').appendTo('#widgets')
  });

  this.contactsChooserPresenter = new ContactsChooserPresenter(
      new ListContactsChooserDisplay(),
      this.contactsModel
  );

  this.windowUpdater = new WindowUpdater(this.topicListModel);

  this.userProfilePresenter = new UserProfilePresenter();

  // Now show the contacts list
  this.onNavigation('navOverview', true);

  // Ok, all done. Lay it out
  this.doLayout();

  BUS.on('topic.topic.created', function(topicId) {
    this.onNavigation('navTopic');
  }, this);

  BUS.on('topic.selected', function(topicId) {
    if (topicId === 'contacts') {
      this.onNavigation('navContacts', true);
    } else if(topicId === 'overview') {
      this.onNavigation('navOverview', true);
    } else {
      this.onNavigation('navTopic', true);
    }
  }, this);
};
WobbleMobileClient.prototype.doLayout = function() {
  var map = {'position':'absolute', 'width':'', 'left': '0px', 'right':'0px'};
  this.contactsView.$el.css(map);
  this.topicListView.e.css(map);
  this.topicView.e.css(map);
};

WobbleMobileClient.prototype.onNavigation = function(targetId, noFireEvent) {
  $(">*", this.$widgets).detach(); // Detach() does not destroy the event handlers

  // window.location.hash = "";
  if (targetId == 'navContacts') {
    // Show the ContactsList
    this.contactsView.$el.appendTo(this.$widgets);
    if (!noFireEvent) BUS.fire('topic.selected', 'contacts');
  } else if (targetId == 'navOverview') {
    // Show the TopicsList
    this.topicListView.e.appendTo(this.$widgets);
    if (!noFireEvent) BUS.fire('topic.selected', 'overview');
  } else if (targetId == 'navTopic') {
    // Show the Topic itself
    this.topicView.e.appendTo(this.$widgets);
  } else if (targetId == 'navLogout') {
    API.signout(function(err, result) {
      window.location.reload();
    });
  } else {
    // Unknown error
    alert('Unknown navigation id: ' + targetId);
  }
};

WobbleMobileClient.prototype.onRPCError = function(err) {
  var doReload = window.alert('Whoooops! Something went wrong! We will reload now, ok?');
  window.location.reload();
};