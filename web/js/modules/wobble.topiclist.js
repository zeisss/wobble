"use strict";
function TopicsListDisplay() {};
// Event Handlers -------------------------------------------------
TopicsListDisplay.prototype.onTopicClicked = function(topic) {};
TopicsListDisplay.prototype.onCreateNewTopic = function() {};
TopicsListDisplay.prototype.onShowArchived = function() {};
TopicsListDisplay.prototype.onShowInbox = function() {};
// Methods --------------------------------------------------------
TopicsListDisplay.prototype.showLoading = function() {};
TopicsListDisplay.prototype.setActiveTopic = function(topic) {};
TopicsListDisplay.prototype.renderTopicList = function(topics) {};
TopicsListDisplay.prototype.clear = function() {};


function TopicListModel(cache) {
    this.cache = cache;
    
    this.total_topics = -1;
    this.total_topics_inbox = -1;
    this.total_topics_archive = -1;
    
	this.cacheTimeout = 60 * 60 * 24 * 5;    
	this.topics = cache.get('topicslistpresenter.topics') || [];
	this.show_archived = cache.get('topicslistpresenter.show_archived') || 0;	
	
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
}
TopicListModel.prototype.onTopicDataRefreshed = function() {};

TopicListModel.prototype.refreshTopicList = function() {
    API.list_topics(this.show_archived, $.proxy(function(err, result) {
		if (!err) {
			this.cache.set('topicslistpresenter.topics', result.topics, this.cacheTimeout);
            
            // Store the result set
            this.total_topics = result.size;
            this.total_topics_inbox = result.size_inbox;
            this.total_topics_archive = result.size_archived;
			this.topics = result.topics;
			
			this.onTopicDataRefreshed();
		}
	}, this));  
};

TopicListModel.prototype.setShowArchived = function(show_archived) {
    this.show_archived = show_archived;
	this.cache.set('topicslistpresenter.show_archived', show_archived, this.cacheTimeout);
};
TopicListModel.prototype.createNewTopic = function(topicId) {
    // Create a topic on the server and notify the TopicView (async)
	API.topics_create(topicId, $.proxy(function(err, topic_id) {
		if (err) {
			this.refreshTopicsList();
		}
		if (topic_id !== undefined) {					
			BUS.fire('topic.topic.created', topicId);
		}
	}, this));
	
    var topicDetails = {
		id: topicId,
		abstract: '-',
		users: [API.user()],
		post_count_total: 1,
		post_count_unread: 0
	};
	this.topics.splice(0, 0, topicDetails); // Prepend the item to the ViewList
	this.onTopicDataRefreshed();
}

/**
 * The Business logic for the topics list-view
 */
function TopicListPresenter (view, model) {
	this.view = view;
	this.model = model;

	this.selectedTopicId = null;
	
	// Load initial topic, if given in URL Bar.
	if (window.location.hash != "") {
	   this.selectedTopicId = window.location.hash.substring(1); // Remove the #
	   
	   setTimeout(function(){
	       BUS.fire('topic.selected', window.location.hash.substring(1));
	   }, 100);
	}
	
	// Start fetching an up2date list
	if (!this.model.topics)
	   this.model.refreshTopicsList();

	// Prerender the view from the cache
	this.view.clear();
	this.view.renderTopicList(this.topics);
	
	var that = this;
	// UI Callbacks
	this.view.onTopicClicked = function(topic) {
		that.setSelectedTopic(topic); 
	};
	this.view.onCreateNewTopic = function() {
		that.onCreateNewTopic();
	};
	this.view.onShowArchived = $.proxy(function() {
		that.onSetShowArchived(1);
	}, this);
	this.view.onShowInbox = function() {
		that.onSetShowArchived(0);
	}
	
	// Refresh the View, when the data in the backend changes
	this.model.onTopicDataRefreshed = $.proxy(function() {
        var list = this.model.topics;
	    this.view.clear();
        this.view.renderTopicList(list);
        
        if (!this.selectedTopicId)
            return;
        
        for (var i = 0; i < list.length; i++) {
        	var data = list[i];
        	if (this.selectedTopicId == data.id) {
        		this.view.setActiveTopic(data);
        	}
        }
	}, this);
};

TopicListPresenter.prototype.onSetShowArchived = function setShowArchived(show_archived) {
	this.view.showLoading();
	this.model.setShowArchived(show_archived);
	
	this.selectedTopicId = null;
	this.model.refreshTopicsList();
}

TopicListPresenter.prototype.setSelectedTopic = function(topic, noEvent) {
	this.selectedTopicId = topic.id;
	this.view.setActiveTopic(topic);
	if (!noEvent) {
		BUS.fire('topic.selected', topic.id);
	}
};
TopicListPresenter.prototype.onCreateNewTopic = function() {
	// TODO: Check if the user is currently editing something and submit that before going on
	var topicId = API.generate_id();
	this.model.createNewTopic(topicId); // This calls our callback, so we automatically render the new list
    this.setSelectedTopic(topicDetails, true);
};

