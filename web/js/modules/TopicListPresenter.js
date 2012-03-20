"use strict";
function TopicsListDisplay() {};
_.extend(TopicsListDisplay.prototype, EventBUS.prototype); // Make the view an eventbus
// Event Handlers -------------------------------------------------
TopicsListDisplay.prototype.onTopicClicked = function(topic) { this.fire('topic_clicked', topic)};
TopicsListDisplay.prototype.onCreateNewTopic = function() { this.fire('action_create_topic');};
TopicsListDisplay.prototype.onShowArchived = function() { this.fire('action_show_archive');};
TopicsListDisplay.prototype.onShowInbox = function() {this.fire('action_show_inbox');};
// Methods --------------------------------------------------------
TopicsListDisplay.prototype.showLoading = function() {};
TopicsListDisplay.prototype.setActiveTopic = function(topicId) {};
TopicsListDisplay.prototype.renderActionButtons = function(showArchived) {};
TopicsListDisplay.prototype.renderTopicList = function(topics) {};
TopicsListDisplay.prototype.clear = function() {};

/**
 * The Business logic for the topics list-view
 */
function TopicListPresenter (view, model) {
  this.view = view;
  this.model = model;

  this.selectedTopicId = null;

  // Start fetching an up2date list
  this.model.refreshTopicList();

  // Prerender the view from the cache
  if (this.model.hasTopics()) {
    this.view.clear();
    this.view.renderActionButtons(this.model.isShowingArchived());
    this.view.renderTopicList(this.model.getTopics());
  }

  // UI Callbacks
  this.view.on('topic_clicked', function(topic) {
    this.setSelectedTopicId(topic.id);
  }, this);
  this.view.on('action_create_topic', function() {
    this.model.createTopic();
  }, this)
  this.view.on('action_show_archive', function() {
    this.setShowArchived(1);
  }, this);
  this.view.on('action_show_inbox', function() {
    this.setShowArchived(0);
  }, this);

  // Model
  this.model.on('update', function() {
    var topics = this.model.getTopics();
    this.view.clear();
    this.view.renderTopicList(topics);
    this.view.setActiveTopic(this.selectedTopicId);
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
