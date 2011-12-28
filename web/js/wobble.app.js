"use strict";

function WobbleApplication() {
	var that = this;

	// Show a reload dialog, when an RPC error occurs
	BUS.on('rpc.error', function(err) {
		that.onRPCError(err);
	});
};
WobbleApplication.prototype.init = function() {
	// Called 
};
WobbleApplication.prototype.onRPCError = function(err) {
	
};


function WobbleDesktopClient() {
	

	BUS.on('topic.selected', function(topicId) {
		window.location.hash = topicId; // Note the current topicId in the URL, so its visible for the user and we can work with it on page reloads
	});

	
};
WobbleDesktopClient.prototype = new WobbleApplication;
WobbleDesktopClient.prototype.init = function() {
	this.contactsModel = new ContactsModel();
	this.contactsChooserPresenter = new ContactsChooserPresenter(
			new ListContactsChooserDisplay('#topic_invite_user'), 
			this.contactsModel
	);
	this.contactsPresenter = new ContactsPresenter(new JQueryContactsView(), this.contactsModel);
	
	this.topicsPresenter = new TopicsPresenter(new jQueryTopicsView());
	
	this.contactsDetailPresenter = new ContactsDetailPresenter(new jQueryContactsDetailDisplay(100, 100), this.contactsModel, 'contact.clicked');
	this.topicUserDetailPresenter = new ContactsDetailPresenter(new jQueryContactsDetailDisplay(600, 100), this.contactsModel, 'topic.user.clicked');

	this.topicPresenter = new TopicPresenter(new jQueryTopicView(), new TopicModel());	
	this.topHeader = new JQueryClientHeader();
	
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
WobbleDesktopClient.prototype.doLayout = function(data) {
	data = data || {to: {w: $(window).width(),h:$(window).height() }}
	// TODO: Move this into some kind of Layout object?
	function minWidth(e) {
		var sW = e.css('min-width');
		return Number(sW.substr(0, sW.length - 2));
	}
	var headline = $("#headline");
	var topics = $("#topics_wrapper");
	var topic = $("#topic_wrapper");
	var contacts = $("#contacts");
	
	var rightPart = data.to.w - contacts.width();
	
	var topicsLeft = contacts.width() + 10;
	var topicsWidth = Math.max(rightPart * 0.4, minWidth(topics));
	topics.css('left', topicsLeft);
	topics.width(topicsWidth);
	
	var topicLeft = topicsLeft + topicsWidth + 10;
	var topicWidth = Math.max(data.to.w - topicLeft - 20, minWidth(topics));
	topic.css('left', topicLeft);
	topic.width(topicWidth);
	
	contacts.height(data.to.h - headline.height() - 20);
	topics.height(data.to.h - headline.height() - 20);
	topic.height(data.to.h - headline.height() - 20);
};

function WobbleMobileClient() {
	
}
WobbleMobileClient.prototype = new WobbleApplication;
WobbleMobileClient.prototype.init = function() {
	// Create the navigator
	this.navigatorView = new jQueryNavigatorView(this);

	// Create the views

	
	// Create the presenters
		
};
WobbleMobileClient.prototype.onNavigation = function(targetId) {
	
};