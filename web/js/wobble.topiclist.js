"use strict";
function TopicsListDisplay() {};
// Event Handlers -------------------------------------------------
TopicsListDisplay.prototype.onTopicClicked = function(topic) {};
TopicsListDisplay.prototype.onCreateNewTopic = function() {};
// Methods --------------------------------------------------------
TopicsListDisplay.prototype.setActiveTopic = function(topic) {};
TopicsListDisplay.prototype.renderTopics = function(topics) {};
TopicsListDisplay.prototype.clear = function() {};



/**
 * The Business logic for the topics list-view
 */
function TopicsPresenter (view) {
	this.view = view;
	this.selectedTopicId = null;
	this.topics = [];
	
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
		this.refreshTopicsList();
	}, this);
	
	BUS.on('topic.post.changed', function(_data) {
		this.refreshTopicsList();
	}, this);
	BUS.on('api.notification', function(message) {
		if ( message.type == 'topic_changed' ||
			 message.type == 'post_changed' /* Unread message counter propably got changed */ ) {
			this.refreshTopicsList();
		}
	}, this);
	
};
/** Called by the view when a new topic should be created */
TopicsPresenter.prototype.refreshTopicsList = function() {
	API.list_topics($.proxy(function(err, list) {
		if ( !err ) {
			this.view.clear();
			this.topics = list;
			this.view.renderTopics(list);

			for (var i = 0; i < list.length; i++) {
				var data = list[i];
				if ( this.selectedTopicId && this.selectedTopicId == data.id) {
					this.view.setActiveTopic(data);
				}
			}
		}
	}, this));
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
	var that = this;

	var topicId = API.generate_id();
	
	// Create a topic on the server and notify the TopicView (async)
	var that = this;
	API.topics_create(topicId, function(err, topic_id) {
		if (err) {
			that.refreshTopicsList();
		}
		if (topic_id !== undefined) {					
			BUS.fire('topic.topic.created', topicId);
		}
	});
	
	// Create a dummy TopicHeader, so we can render something immediately	
	var topicDetails = {
		id: topicId,
		abstract: '-',
		users: [API.user()],
		post_count_total: 1,
		post_count_unread: 0
	};

	this.topics.splice(0, 0, topicDetails); // Prepend the item to the ViewList
	this.view.clear();
	this.view.renderTopics(this.topics);
	this.setSelectedTopic(topicDetails, true);
};

