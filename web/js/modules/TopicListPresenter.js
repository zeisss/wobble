"use strict";
function TopicsListDisplay() {};
// Event Handlers -------------------------------------------------
TopicsListDisplay.prototype.onTopicClicked = function(topic) {};
TopicsListDisplay.prototype.onCreateNewTopic = function() {};
TopicsListDisplay.prototype.onShowArchived = function() {};
TopicsListDisplay.prototype.onShowInbox = function() {};
// Methods --------------------------------------------------------
TopicsListDisplay.prototype.showLoading = function() {};
TopicsListDisplay.prototype.setActiveTopic = function(topicId) {};
TopicsListDisplay.prototype.renderActionButtons = function(showArchived) {};
TopicsListDisplay.prototype.renderTopicList = function(topics) {};
TopicsListDisplay.prototype.clear = function() {};

/**
 * The Business logic for the topics list-view
 */
function TopicListPresenter (view, cache) {
  this.view = view;
  this.model = new TopicListModel(cache);
  
  this.selectedTopicId = null;

  // Start fetching an up2date list
  this.model.refreshTopicList();

  // Prerender the view from the cache
  if (this.model.hasTopics()) {
    this.view.clear();
    this.view.renderActionButtons(this.model.isShowingArchived());
    this.view.renderTopicList(this.model.getTopics());
  }

  var that = this;
  // UI Callbacks
  this.view.onTopicClicked = function(topic) {
    that.setSelectedTopicId(topic.id);
  };
  this.view.onCreateNewTopic = function() {
    that.model.createTopic();
  };
  this.view.onShowArchived = function() {
    that.setShowArchived(1);
  };
  this.view.onShowInbox = function() {
    that.setShowArchived(0);
  };
  
  // Model
  this.model.on('update', function() {
    var topics = this.model.getTopics();
    this.view.clear();
    this.view.renderTopicList(topics);
  }, this);
  this.model.on('created', function(topicId) {
    this.setSelectedTopicId(topicId, true);
    BUS.fire('topic.topic.created', topicId);
  }, this);

  // BUS Events
  BUS.on('topic.selected', function(topicId) {
    if (this.selectedTopicId !== topicId) {
      this.setSelectedTopicId(topicId, true);
    }
  }, this);
  BUS.on('topic.changed', function(_data) {
    this.model.refreshTopicList();
  }, this);

  BUS.on('topic.post.changed', function(_data) {
    this.model.refreshTopicList();
  }, this);

  BUS.on('api.notification', function(message) {
    if (message.type == 'topic_changed' ||
       message.type == 'post_changed' /* Unread message counter propably got changed */) {
      this.model.refreshTopicList();
    }
  }, this);

};

TopicListPresenter.prototype.setShowArchived = function setShowArchived(show_archived) {
  this.view.showLoading();

  this.model.setShowArchived(show_archived);

  this.selectedTopicId = null;
  this.model.refreshTopicList();
}

TopicListPresenter.prototype.setSelectedTopicId = function(topicId, noEvent) {
  if (topicId == this.selectedTopicId) {
    return;
  }
  this.selectedTopicId = topicId;
  this.view.setActiveTopic(this.selectedTopicId);
  if (!noEvent) {
    BUS.fire('topic.selected', topicId);
  }
};
