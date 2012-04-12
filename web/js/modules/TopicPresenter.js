/*global API BUS */
"use strict";

// Callbacks
function TopicDisplay() {}
TopicDisplay.prototype.onInviteUserAction = function() {};
TopicDisplay.prototype.onStartPostEdit = function(post) {};
TopicDisplay.prototype.onEndPostEdit = function(post, content) {};
TopicDisplay.prototype.onUserClicked = function(user) {};
TopicDisplay.prototype.onDeletePost = function(post) {};
TopicDisplay.prototype.onReplyPost = function(post) {};
TopicDisplay.prototype.onIntendedReplyPost = function(post) {};
TopicDisplay.prototype.onPostClicked = function(post) {};
TopicDisplay.prototype.onMoveToInbox = function() {};
TopicDisplay.prototype.onMoveToArchive = function() {};
TopicDisplay.prototype.onReadAll = function() {};
TopicDisplay.prototype.onUnreadAll = function() {};

TopicDisplay.prototype.clear = function() {};
TopicDisplay.prototype.setLoadingState = function() {};
TopicDisplay.prototype.removePost = function(post) {};
TopicDisplay.prototype.renderPost = function(topic, post) {};
TopicDisplay.prototype.renderTopic = function(topic) {};
TopicDisplay.prototype.setEnabled = function(enabled) {};

TopicDisplay.prototype.openEditor = function(post) {};

function TopicModel() {
  var that = this;
  var topic = null;

  // Getters & Setters -------------------------------
  that.setTopic = function(new_topic) {
    topic = new_topic;
  };
  that.getTopic = function() {
    return topic;
  };

  // Methods ------------------------------------------
  that.addPost = function(post) {
    topic.posts.push(post);
  };
}

TopicModel.prototype.createReply = function(post) {
  return {
    id: API.generate_id(),
    parent: post.id,
    locked: false,
    content: '\n<br>\n<br>',
    revision_no: 1,
    users: [API.user_id()],
    deleted: 0,
    unread: 0
  };
};
TopicModel.prototype.addUserToPost = function(post, user) {
  var found = false;
  for (var i = 0; i < post.users.length; i++) {
    if (post.users[i] === user.id) {
      found = true;
    }
  }
  if (!found) {
    post.users.push(user.id);
    // We can assume here, that the user is part of topic.users, otherwise he shouldn't see this post
  }
};
TopicModel.prototype.addUser = function(user) {
  if (_.contains(this.getTopic().readers, user)) {
    this.getTopic().readers.push(user);
  }
};
TopicModel.prototype.removeUser = function(user, callback) {
  var topic = this.getTopic();

  API.topic_remove_user(topic.id, user.id, function(err, result) {
    if (!err) {
      topic.readers = _.filter(topic.readers, function(tuser) {
        return user.id != tuser.id; // Filter the given user
      });
    }
    callback(err, result);
  });
};
TopicModel.prototype.getUserIds = function() {
  var topic = this.getTopic();
  var result = [];

  for (var i = 0; i < topic.readers.length; i++) {
    result.push(topic.readers[i].id);
  }

  return result;
};




function TopicPresenter(view, model) {
  this.view = view;
  this.model = model;

  view.setEnabled(false);

  //// ---- View Event Callbacks ------------------------------------------------------
  var that = this;
  view.onReadAll = function() {
    var topic = that.model.getTopic();
    if (topic) {
      async.forEach(topic.posts, function(post, done) {
        API.post_change_read(topic.id, post.id, 1, done);
      }, function(err, results) {
        that.refreshTopic();
        BUS.fire('topic.post.changed', model.getTopic().id);
      });
    }
  };

  view.onUnreadAll = function() {
    var topic = that.model.getTopic();
    if (topic) {
      async.forEach(topic.posts, function(post, done) {
        API.post_change_read(topic.id, post.id, 0, done);
      }, function(err, results) {
        that.refreshTopic();
        BUS.fire('topic.post.changed', model.getTopic().id);
      });
    }
  };
  view.onInviteUserAction = function() {
    BUS.fire('contacts.chooser.open', {
      'multiple': true,
      'remove_contacts': model.getUserIds(),
      'on_add': function (contact) {
        API.topic_add_user(model.getTopic().id, contact.id, function(err, data) {
          model.addUser(contact);
          view.renderTopic(model.getTopic());
        });
      },
      'on_close': function() {
        BUS.fire('topic.changed', model.getTopic().id);
      }
    });
  };
  view.onUserClicked = function(user) {
    var actions = [];
 
    if (user.id != API.user_id()) {
      actions.push({title: 'Remove from Topic', callback: function() {
        that.model.removeUser(user, function(err, result) {
          view.renderTopic(model.getTopic());
        });
      }});

    }

    BUS.fire('topic.user.clicked', {
      'user': user,
      'actions': actions
    });
  };
  view.onPostClicked = function(post) {
    // remove unread class on click + mark read on server side
    if (post.unread == 1) {
      var topic = model.getTopic();

      post.unread = 0;
      post.locked = true;
      view.renderPost(model.getTopic(), post);

      API.post_change_read(model.getTopic().id, post.id, 1, function() {
        post.locked = false;

        // Still our topic? => Refresh View
        if (model.getTopic().id == topic.id) {
          view.renderPost(topic, post);
        }
        BUS.fire('topic.post.changed', model.getTopic().id);
      });
    }
  };
  view.onStartPostEdit = function(post) {
    // Create the lock
    API.post_change_lock(model.getTopic().id, post.id, 1, function(err, success) {
      if (err || !success) {
        alert('Failed to create lock for post. Try again later or refresh your browser.');
      } else {
        model.addUserToPost(post, API.user());
        view.renderPost(model.getTopic(), post);
      }
    });
  };
  view.onStopPostEdit = function(post, content) {
    post.locked = true; // Lock post until saved
    post.content = content;
    view.renderPost(model.getTopic(), post);
    API.post_edit(model.getTopic().id, post.id, content, post.revision_no, function(err, result) {
      if (!err) {
        post.revision_no = result.revision_no;

        BUS.fire('topic.post.changed', model.getTopic().id);
      }
      post.locked = false;
      view.renderPost(model.getTopic(), post);
    });
  };

  view.onReplyPost = function(post) {
    var newPost = model.createReply(post);
    newPost.locked = true;
    API.post_create(model.getTopic().id, newPost.id, newPost.parent, 0, function(err, data) {
      newPost.locked = false;
      view.renderPost(model.getTopic(), newPost);
    });
    model.addPost(newPost);
    view.renderTopic(model.getTopic());
    view.openEditor(newPost);
  };
  view.onIntendedReplyPost = function(post) {
    var newPost = model.createReply(post);
    newPost.intended_post = 1;
    newPost.locked = true;
    API.post_create(model.getTopic().id, newPost.id, newPost.parent, 1, function(err, data) {
      newPost.locked = false;
      view.renderPost(model.getTopic(), newPost);
    });
    model.addPost(newPost);
    view.renderTopic(model.getTopic());
    view.openEditor(newPost);
  };

  view.onDeletePost = function(post) {
    post.locked = true;
    API.post_delete(model.getTopic().id, post.id, function(err, result) {
      post.locked = false;

      if (!err) {
        post.deleted = 1;
        view.renderTopic(model.getTopic());
      }
    });
    view.renderTopic(model.getTopic());
  };

  view.onMoveToArchive = function() {
    API.topic_set_archived(model.getTopic().id, 1, function(err, result) {
    });
    view.clear();
    model.setTopic(null);
  };
  view.onMoveToInbox = function() {
    API.topic_set_archived(model.getTopic().id, 0, function(err, result) {
    });
    view.clear();
    model.setTopic(null);
  };


  /**
   * BUS Handlers
   */

  // Fired by TopicsPresenter
  BUS.on('topic.selected', function(topicId) {
    if (model.getTopic() !== null && model.getTopic().id == topicId) {
      return;
    }
    model.setTopic({id: topicId});
    view.setLoadingState();
    that.refreshTopic();
  });
  // Fired when a new topic got created by TopicsPresenter
  BUS.on('topic.topic.created', function(topicId) {
    model.setTopic({id: topicId});
    view.setLoadingState();

    that.refreshTopic(function() { // Refreshs the data based on the set ID
      view.openEditor(that.model.getTopic().posts[0]);
    });
  });

  BUS.on('api.notification', function(data) {
    // Somebody else changed our topic
    if (model.getTopic() !== null && (
      data.type == 'topic_changed' && data.topic_id == model.getTopic().id ||
      data.type == 'post_deleted' && data.topic_id == model.getTopic().id ||
      data.type == 'post_changed' && data.topic_id == model.getTopic().id))
    {
      that.refreshTopic();
    }
  });
}

TopicPresenter.prototype.refreshTopic = function(callback) {
  if (this.model.getTopic() === null)
    return;

  var that  = this;

  API.load_topic_details(this.model.getTopic().id, function(err, topicDetails) {
    if (err) { // Just clear the view, when the data could not be loaded.
      console.log('Failed to load topic. Clearing view.');
      that.view.clear();
      return true;
    }
    var modelTopic = that.model.getTopic();
    if (modelTopic !== null && topicDetails !== undefined && topicDetails.id == modelTopic.id) { // Check that we still want to see this data
      that.setSelectedTopic(topicDetails);
      if (callback) {
        callback();
      }
    }
  });
};
/**
 * Change the underlying topic
 */
TopicPresenter.prototype.setSelectedTopic = function(topicDetails) {
  if (topicDetails === this.model.getTopic()) {
    return;
  }
  this.model.setTopic(topicDetails);
  this.view.renderTopic(topicDetails);
};