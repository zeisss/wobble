
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
	// Models
	this.contactsModel = new ContactsModel();

	// Views
	this.topHeader = new DesktopClientHeader();

	// Presenter
	
	this.contactsChooserPresenter = new ContactsChooserPresenter(
			new ListContactsChooserDisplay('#topic_invite_user'), 
			this.contactsModel
	);
	this.contactsPresenter = new ContactsPresenter(new JQueryContactsView(), this.contactsModel);
	this.topicsPresenter = new TopicsPresenter(new jQueryTopicsView());
	
	this.contactsDetailPresenter = new ContactsDetailPresenter(new jQueryContactsDetailDisplay(100, 100), this.contactsModel, 'contact.clicked');
	this.topicUserDetailPresenter = new ContactsDetailPresenter(new jQueryContactsDetailDisplay(600, 100), this.contactsModel, 'topic.user.clicked');

	this.topicPresenter = new TopicPresenter(new jQueryTopicView(), new TopicModel());	
	
	// Ok, all done. Lay it out
	this.doLayout();

	// Recalculate the position of the widgets, when window is resized
	BUS.on('window.resize', function(data) {
		this.doLayout(data);
	}, this);	

	BUS.on('topic.selected', function(topicId) {
		window.location.hash = topicId; // Note the current topicId in the URL, so its visible for the user and we can work with it on page reloads
	});
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

