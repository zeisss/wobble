
function WobbleDesktopClient() {
  // Load the client.css
  $('<link />').appendTo('head').attr({
    'media': 'all',
    'rel': 'stylesheet',
    'type': 'text/css',
    'href': 'css/desktop.css'
  });
};
WobbleDesktopClient.prototype = new BasicClient;
WobbleDesktopClient.prototype.init = function(user) {
  if (user != null) {
    this.initApp();
  } else {
    this.initLogin();
  }
};
WobbleDesktopClient.prototype.initLogin = function() {
  var that = this;

  this.loginView = new DesktopLoginView();
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

WobbleDesktopClient.prototype.initApp = function() {
  this.cache = window.localcache.getCache();
  // DataModel
  this.contactsModel = new ContactsModel(this.cache);
  this.topicListModel = new TopicListModel(window.localcache.getCache());
  this.topicModel = new TopicModel();

  // Create the navigator
  this.topHeader = new DesktopClientHeader();

  // Create the Views
  this.contactsView = new JQueryContactsView();
  this.topicListView = new jQueryTopicsView(true, true);
  this.topicView = new jQueryTopicView();

  // Create the Presenter
  this.contactsChooserPresenter = new ContactsChooserPresenter(
      new ListContactsChooserDisplay('#topic_invite_user'),
      this.contactsModel
  );

  this.contactsPresenter = new ContactsPresenter(this.contactsView, this.contactsModel);
  this.contactsDetailPresenter = new ContactsDetailPresenter(new jQueryContactsDetailDisplay(100, 100), this.contactsModel, 'contact.clicked');
  this.topicUserDetailPresenter = new ContactsDetailPresenter(new jQueryContactsDetailDisplay(600, 100), this.contactsModel, 'topic.user.clicked');
  this.topicListPresenter = new TopicListPresenter(this.topicListView, this.topicListModel);
  this.windowUpdater = new WindowUpdater(this.topicListModel);

  this.topicPresenter = new TopicPresenter(this.topicView, this.topicModel);

  this.userProfilePresenter = new UserProfilePresenter();

  // Ok, all done. Lay it out
  this.doLayout();

  // Recalculate the position of the widgets, when window is resized
  BUS.on('window.resize', function(data) {
    this.doLayout(data);
  }, this);
};
WobbleDesktopClient.prototype.onRPCError = function(err) {
  var doReload = window.confirm('Whoooops! Something went wrong! We will reload now, ok?');
  if (doReload)
    window.location.reload();
};

/**
 * Calculate the widths of the three main widgets.
 */
WobbleDesktopClient.prototype.doLayout = function(data) {
  if (!data) {
    data = {'to': {w: $(window).width(),h:$(window).height() }};
  }
  // TODO: Move this into some kind of Layout object?
  function minWidth(e) {
    var sW = e.css('min-width');
    return parseFloat(sW);
  }
  var headline = $("#headline");
  var topics = $("#topics_wrapper");
  var topic = $("#topic_wrapper");
  var contacts = $("#contacts");

  contacts.css('left', 5);

  var rightPart = data.to.w - (parseFloat(contacts.css('left')) + contacts.width());

  var topicsLeft = contacts.width() + 15;
  var topicsWidth = Math.max(rightPart * 0.4, minWidth(topics));
  topics.css('left', topicsLeft);
  topics.width(topicsWidth);

  var topicLeft = topicsLeft + topicsWidth + 10;
  var topicWidth = Math.max(data.to.w - topicLeft - 15, minWidth(topics));
  topic.css('left', topicLeft);
  topic.width(topicWidth);

  var borderBottom = 35;
  contacts.height(data.to.h - headline.height() - borderBottom);
  topics.height(data.to.h - headline.height() - borderBottom);
  topic.height(data.to.h - headline.height() - borderBottom);
};

