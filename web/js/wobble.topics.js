"use strict";
function TopicsDisplay() {};
// Event Handlers -------------------------------------------------
TopicsDisplay.prototype.onTopicClicked = function(topic) {};
TopicsDisplay.prototype.onCreateNewTopic = function() {};
// Methods --------------------------------------------------------
TopicsDisplay.prototype.setActiveTopic = function(topic) {};
TopicsDisplay.prototype.addTopic = function(topic) {};
TopicsDisplay.prototype.clear = function() {};



/**
 * The Business logic for the topics list-view
 */
function TopicsPresenter (view) {
	this.view = view;
	this.selectedTopicId = null;
	
	this.refreshTopicsList();
	
	var that = this;
	// UI Callbacks
	this.view.onTopicClicked = function(topic) {
		that.setSelectedTopic(topic); 
	};
	this.view.onCreateNewTopic = function() {
		that.createNewTopic();
	};
	
	// BUS Events
	BUS.on('topic.changed', function(_data) {
		that.refreshTopicsList();
	});
	
	BUS.on('topic.post.changed', function(_data) {
		that.refreshTopicsList();
	});
	BUS.on('api.notification', function(message) {
		if ( message.type == 'topic_changed' ) {
			that.refreshTopicsList();
		}
	});
	
};
/** Called by the view when a new topic should be created */
TopicsPresenter.prototype.refreshTopicsList = function() {
	var that = this;
	API.list_topics(function(err, list) {
		if ( !err ) {
			that.view.clear();
			$.each(list, function(i, data) {
				that.view.addTopic(data);
				if ( that.selectedTopicId && that.selectedTopicId == data.id) {
					that.view.setActiveTopic(data);
				}
			});
		}
	});
};
TopicsPresenter.prototype.setSelectedTopic = function(topic, noEvent) {
	this.selectedTopicId = topic.id;
	this.view.setActiveTopic(topic);
	if (!noEvent) {
		BUS.fire('topic.selected', topic.id);
	}
};
TopicsPresenter.prototype.createNewTopic = function() {
	// TODO: Check if the user is currently editing something and submit that before going on
	
	var topicId = API.generate_id();
	
	// Create a topic on the server and notify the TopicView
	var that = this;
	API.topics_create(topicId, function(err, topic_id) {
		if (topic_id !== undefined) {					
			BUS.fire('topic.topic.created', topicId);
		}
	});
	
	// Create a dummy topic, so we can render something immediately	
	var topicDetails = {
		id: topicId,
		abstract: '-',
		users: [API.user()],
		posts: [
			{
				id: '1', // First post always has the '1'
				content: 'Write some text!', 
				revision_no: 1, 
				users:[API.user_id()]
			}
		]
	};
	this.view.addTopic(topicDetails, true);
	this.setSelectedTopic(topicDetails, false);
};

