/**
 * Events:
 *  - update - A fresh list was pulled from the server
 *  - added - A dummy topic was added to the list
 *  - created - An entry was created on the server
 */
function TopicListModel(cache) {
  this.cache = cache
  this.cacheTimeout = 60 * 60 * 24 * 5;

  this.topics = cache.get('topicslistpresenter.topics') || [];
  this.show_archived = cache.get('topicslistpresenter.show_archived') || 0;
  this.requestInProcess = false;
}
_.extend(TopicListModel.prototype, EventBUS.prototype); // Make the model an eventbus

TopicListModel.prototype.setShowArchived = function (showArchived) {
  this.cache.set('topicslistpresenter.show_archived', show_archived, this.cacheTimeout);
  this.showArchived = showArchived;
}
TopicListModel.prototype.hasTopics = function() {
  return this.topics && this.topics.length > 0;
};
TopicListModel.prototype.getTopics = function() {
  return this.topics;
};

TopicListModel.prototype.refreshTopicList = function() {
  if (this.requestInProcess)
    return;
  this.requestInProcess = true;

  var that = this;
  API.list_topics(this.show_archived, function(err, list) {
    that.requestInProcess = false;
    
    if (!err) {
      that.cache.set('topicslistpresenter.topics', list, that.cacheTimeout);
      that.topics = list;

      that.fire('update');
    }
  });
}

TopicListModel.prototype.createTopic() {
  // TODO: Check if the user is currently editing something and submit that before going on
  var that = this;
  var topicId = API.generate_id();

  // Create a topic on the server and notify the TopicView (async)
  var that = this;
  API.topics_create(topicId, function(err, topic_id) {
    if (err) {
      that.refreshTopicsList();
    } else {
      that.fire('created')
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
  this.fire('added');
}