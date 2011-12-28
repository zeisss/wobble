
function WobbleMobileClient() {
	
	BUS.on('topic.selected', function() {
		this.onNavigation('navTopic');
	}, this);

	// Append the Mobile.css to the html tree
	$('<link href="css/client.css" media="all" rel="stylesheet" type="text/css" />').appendTo('head');
	$('<link href="css/mobile.css" media="all" rel="stylesheet" type="text/css" />').appendTo('head');

	$('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />').appendTo('head');
}
WobbleMobileClient.prototype = new WobbleApplication;
WobbleMobileClient.prototype.init = function() {
	this.$widgets = $("#widgets");

	// DataModel
	this.contactsModel = new ContactsModel();

	// Create the navigator
	this.navigatorView = new MobileNavigation(this);

	// Create the views
	this.contactsView = new JQueryContactsView();
	this.topicListView = new jQueryTopicsView();
	this.topicView = new jQueryTopicView();

	var map = {'position':'absolute', 'width':'', 'left': '0px', 'right':'0px'};
	this.contactsView.e.css(map);
	this.topicListView.e.css(map);
	this.topicView.e.css(map);
	
	// Create the presenters
	this.contactsPresenter = new ContactsPresenter(this.contactsView, this.contactsModel);
	this.topicsPresenter = new TopicsPresenter(this.topicListView);
	this.topicPresenter = new TopicPresenter(this.topicView, new TopicModel());	

	// Now show the contacts list
	this.onNavigation('navContacts');
};
WobbleMobileClient.prototype.onNavigation = function(targetId) {
	$(">*", this.$widgets).detach(); // Detach() does not destroy the event handlers

	if ( targetId == 'navContacts') {
		// Show the ContactsList
		this.contactsView.e.appendTo(this.$widgets);

	} else if (targetId == 'navOverview') {
		// Show the TopicsList
		this.topicListView.e.appendTo(this.$widgets);
	} else if (targetId == 'navTopic') {
		// Show the Topic itself
		this.topicView.e.appendTo(this.$widgets);
	} else {
		// Unknown error
		alert('Unknown navigation id: ' + targetId);
	}
};