/*global BUS EventBUS API */
"use strict";

/**
 * Events:
 *  - update - A fresh list was pulled from the server
 *  - added(id) - A dummy topic was added to the list
 *  - created(id) - An entry was created on the server
 */
function TopicListModel(cache) {
  this.cache = cache;
  this.cacheTimeout = 60 * 60 * 24 * 5;

  this.inboxUnreadTopics = 0;
  this.topics = cache.get('topicslistpresenter.topics') || [];
  this.show_archived = cache.get('topicslistpresenter.show_archived') || 0;
  this.requestInProcess = false;
  this.reloadAgainAfterRequest = false;
  this.is_search_result = false;

  BUS.on('api.notification', function(message) {
    if (message.type == 'topic_changed' ||
       message.type == 'post_changed' || /* Unread message counter propably got changed */
       message.type == 'post_deleted') {
      this.refreshTopicList();
    }
  }, this);

  BUS.on('topic.changed', function(_data) {
    this.refreshTopicList();
  }, this);

  BUS.on('topic.post.changed', function(_data) {
    this.refreshTopicList();
  }, this);
}
_.extend(TopicListModel.prototype, EventBUS.prototype); // Make the model an eventbus

TopicListModel.prototype.setShowArchived = function (showArchived) {
  this.cache.set('topicslistpresenter.show_archived', showArchived, this.cacheTimeout);
  this.show_archived = showArchived;
};

TopicListModel.prototype.isShowingArchived = function() {
  return this.show_archived;
};

TopicListModel.prototype.isSearchResult = function() {
  return this.is_search_result;
};

TopicListModel.prototype.hasTopics = function() {
  return this.topics && this.topics.length > 0;
};

TopicListModel.prototype.getTopics = function() {
  return this.topics;
};

TopicListModel.prototype.getInboxUnreadTopics = function() {
  return this.inboxUnreadTopics;
};

TopicListModel.prototype.search = function (filter) {
  var that = this;
  API.topics_search(filter, function(err, result) {
    if (!err) {
      that.topics = result.topics;
      that.inboxUnreadTopics = result.inbox_unread_topics;
      that.is_search_result = true;

      that.fire('update');
    }
  });
};

TopicListModel.prototype.refreshTopicList = function() {
  if (this.requestInProcess) {
    this.reloadAgainAfterRequest = true;
    return;
  }
  this.requestInProcess = true;

  var that = this;
  API.list_topics(this.show_archived, function(err, result) {
    that.requestInProcess = false;

    if (!err) {
      that.cache.set('topicslistpresenter.topics', result.topics, that.cacheTimeout);
      that.topics = result.topics;
      that.inboxUnreadTopics = result.inbox_unread_topics;
      that.is_search_result = false;

      that.fire('update');
    }
    if (that.reloadAgainAfterRequest) {
        that.reloadAgainAfterRequest = false;
        that.refreshTopicList();
    }
  });
};

TopicListModel.prototype.createTopic = function() {
  // TODO: Check if the user is currently editing something and submit that before going on
  var that = this;
  var topicId = API.generate_id();

  // Create a topic on the server and notify the TopicView (async)
  API.topics_create(topicId, function(err, topic_id) {
    if (err) {
      that.refreshTopicList();
    } else {
      that.fire('created', topicId);
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
  this.fire('added', topicId);
};