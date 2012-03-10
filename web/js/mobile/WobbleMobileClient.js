
function WobbleMobileClient() {

  BUS.on('topic.selected', function(topicId) {
    this.onNavigation('navTopic');
  }, this);

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
}
WobbleMobileClient.prototype = new BasicClient;

WobbleMobileClient.prototype.init = function(user) {
  if (user != null) {
    this.initApp();
  } else {
    this.initLogin();
  }
};
WobbleMobileClient.prototype.initLogin = function() {
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
  this.contactsView = new JQueryContactsView();
  this.topicListView = new jQueryTopicsView();
  this.topicView = new jQueryTopicView();

  // Create the presenters
  this.contactsPresenter = new ContactsPresenter(this.contactsView, this.contactsModel);
  this.contactsDetailPresenter = new ContactsDetailPresenter(new jQueryContactsDetailDisplay(20, 20), this.contactsModel, 'contact.clicked');
  this.topicUserDetailPresenter = new ContactsDetailPresenter(new jQueryContactsDetailDisplay(20, 20), this.contactsModel, 'topic.user.clicked');
  this.topicListPresenter = new TopicListPresenter(this.topicListView, this.topicListModel);
  this.topicPresenter = new TopicPresenter(this.topicView, this.topicModel);

  this.contactsChooserPresenter = new ContactsChooserPresenter(
      new ListContactsChooserDisplay(),
      this.contactsModel
  );

  this.windowUpdater = new WindowUpdater(this.topicListModel);

  this.userProfilePresenter = new UserProfilePresenter();

  // Now show the contacts list
  this.onNavigation('navOverview');

  // Ok, all done. Lay it out
  this.doLayout();

  BUS.on('topic.topic.created', function(topicId) {
    this.onNavigation('navTopic');
  }, this);
};
WobbleMobileClient.prototype.doLayout = function() {
  var map = {'position':'absolute', 'width':'', 'left': '0px', 'right':'0px'};
  this.contactsView.e.css(map);
  this.topicListView.e.css(map);
  this.topicView.e.css(map);
};

WobbleMobileClient.prototype.onNavigation = function(targetId) {
  $(">*", this.$widgets).detach(); // Detach() does not destroy the event handlers

  window.location.hash = "";
  if (targetId == 'navContacts') {
    // Show the ContactsList
    this.contactsView.e.appendTo(this.$widgets);

  } else if (targetId == 'navOverview') {
    // Show the TopicsList
    this.topicListView.e.appendTo(this.$widgets);
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
  var doReload = window.confirm('Whoooops! Something went wrong! We will reload now, ok?');
  if (doReload)
    window.location.reload();
};