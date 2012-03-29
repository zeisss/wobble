"use strict";

// UI Functions

var ROOT_ID = '1';

function jQueryTopicReadersPartial(parent, click_handler) {
  this.e = $('<div>').attr('id', 'topic_readers').appendTo(parent);
  this.readerList = $('<div>').addClass('readers').appendTo(this.e);
  this.moreBox = $('<div>').addClass('more_box').appendTo(this.e);
  this.showAllReaders = false;
  this.onUserClicked = click_handler;

  var that = this;
  this.moreBox.on('click', function() {
    that.showAllReaders = !that.showAllReaders;
    that.checkReaderOverflow();
  })
}
jQueryTopicReadersPartial.prototype.empty = function() {
  this.readerList.empty();
};
jQueryTopicReadersPartial.prototype.render = function(data) {
  this.readerList.empty();
  for(var i = 0; i < data.length; i++) {
    this.renderReader(data[i]);
  }
  this.checkReaderOverflow();
};
jQueryTopicReadersPartial.prototype.renderReader = function(user) {
  var containerId = "topic-reader-" + user.id;
  var container = $('#' + containerId);
  if (container.length == 0) {
    container = $("<span></span>").addClass('reader').attr('id', containerId).appendTo(this.readerList);
  } else {
    container.css('display', '');
  }
  var template = "<div class='usericon usericon40'>" +
           "<div><img width='40' height='40' src='http://gravatar.com/avatar/{{img}}?s=100' title='{{name}}'/></div>" +
           "<div class='status {{status}}'></div>" +
           "</div>";

  var that = this;
  container.html(Mustache.to_html(template, {
    'img': user.img,
    'name': user.name,
    'status': user.online == 1 ? 'online':'offline'
  })).off('click').click(function() {
    that.onUserClicked(user);
  });
};
jQueryTopicReadersPartial.prototype.checkReaderOverflow = function() {
  var hiddenUsers = 0;
  this.moreBox.css('display', ''); // Show this initially, so we can take its width into account

  if (this.showAllReaders) {
    $('.reader', this.readerList).css('display', '');
  } else {
    // Try to make the list smaller by hiding the last reader
    var readers = $('.reader', this.readerList);
    for (var trie = 0; this.e.outerHeight() > 56 && trie < 1000; trie++) {
      $(readers[readers.length - trie]).css('display', 'none');
      hiddenUsers++;
    }
  }

  if (this.showAllReaders && hiddenUsers == 0) {
    this.moreBox.text('Hide');
  }
  else if (hiddenUsers > 0) {
    this.moreBox.text(hiddenUsers + ' more');
  } else {
    this.moreBox.css('display', 'none');
  }
};


var userCache = {}; // id => {id, name, email, img}
function jQueryTopicView() {  // The UI handler for the single topic
  var that = this;

  this.editingPostId = null;
  this.currentTopic = null;
  this.readersExtended = false;

  this.e = $('<div></div>').addClass('widget').attr('id', 'topic_wrapper').appendTo('#widgets');

  this.readerView = new jQueryTopicReadersPartial(this.e, function(user) {that.onUserClicked(user)});
  this.$actions = $('<div></div>').attr('id', 'topic_actions').appendTo(this.e);
  this.$messages = $('<div></div>').attr('id', 'topic_messages').appendTo(this.e);
  this.$posts = $('<div></div>').attr('id', 'topic_posts').appendTo(this.e);

  this._renderTopicActions(false);

  // On a window.resize event wait for the transformations to finish (should be done in 300ms) and recalc height
  BUS.on('window.resize', function() {
    var t = this;
    window.setTimeout(function() {
      t.onResize();
    }, 350);
  }, this);
};
jQueryTopicView.prototype = new TopicDisplay;
jQueryTopicView.prototype.constructor = jQueryTopicView;

// Methods --------------------------------------------------------
jQueryTopicView.prototype.onResize = function() {

  var viewHeight = this.e.innerHeight();
  var offsetX = this.readerView.e.outerHeight() +
                this.$actions.outerHeight() +
                this.$messages.outerHeight();

  this.$posts.css('height', viewHeight - offsetX);
};
jQueryTopicView.prototype.clear = function() {
  this.editingPostId = null;
  this.currentTopic = null;
  this.readerView.showAllReaders = false;
  this.$posts.empty();
  this.readerView.empty();
  this.$actions.empty();
};

jQueryTopicView.prototype.setEnabled = function(enabled) {
  if (enabled) {
    $("button", this.$actions).removeAttr('disabled');
  } else {
    $("button", this.$actions).attr('disabled', 'disabled');
  }
};

jQueryTopicView.prototype.setLoadingState = function() {
  this.clear();
  this.setEnabled(false);
  this.$posts.append("<div class=loading>Loading ...</div>");
};

jQueryTopicView.prototype.renderTopic = function(topicDetails) {
  $("#topic_posts .loading").detach();

  this.currentTopic = topicDetails;

  this._renderTopicActions($(".editing").length > 0);

  if (topicDetails) {
    this.setEnabled(true);

    this.readerView.empty();
    // Only cache the writers
    for (var i = 0; i < topicDetails.writers.length; ++i) {
      var user = topicDetails.writers[i];
      userCache[user.id] = user;
    }
    // Cache & render the readers
    for (var i = 0; i < topicDetails.readers.length; ++i) {
      var user = topicDetails.readers[i];
      userCache[user.id] = user; // Cache user object (user later to show the user post images)
    }
    this.readerView.render(topicDetails.readers);

    this.renderMessages(topicDetails.id, topicDetails.messages);

    this.onResize();

    this.renderPosts(topicDetails);
  } else {
    this.setEnabled(false);
  }
};

jQueryTopicView.prototype.renderMessages = function(topic_id, messages) {
    this.$messages.empty();
    _.each(messages, function(msgObj) {
        var msg = msgObj.message;
        var message_id = msgObj.message_id;
        var str;

        if (msg.type == 'user_added') {
            str = msg.user_name + ' was added.';
        } else if (msg.type == 'user_removed') {
            str = msg.user_name + ' was removed';
        } else {
          console.log('Unknown message type: ' + msg.type);
        }

        if (str) {
            var con = $('<div></div>');
            con.addClass('message');
            $('<div></div>').html(str).appendTo(con);
            $('<button></button').text('x').click(function() {
                console.log('topic_remove_message ' + topic_id + ', ' + message_id);
                API.topic_remove_message(topic_id, message_id, function(err, result) {
                  if (!err) {
                    con.remove();
                    con = null;
                  }
                });
            }).appendTo(con);
            con.appendTo(this.$messages);
        }
    }, this);
};

jQueryTopicView.prototype.renderPosts = function(topicDetails) {
  var $scrollToPost = null;
  for (var i = 0; i < topicDetails.posts.length; i++) {
    var $post = this.renderPost(topicDetails, topicDetails.posts[i]);
    if (!$scrollToPost && topicDetails.posts[i].deleted == 0 && topicDetails.posts[i].unread == 1) {
      $scrollToPost = $post; 
    }
  }
  this.renderAddReply();

  if ($scrollToPost && this.editingPostId == null) {
    $(">.post", $scrollToPost)[0].scrollIntoView(false);
  }
};

jQueryTopicView.prototype.renderPost = function(topic, post) {
  var elementPostId = 'post-' + post.id;
  var that = this;

  var jPostWrapper = $("#" + elementPostId);
  if (jPostWrapper.length == 0) {
    // Post does not exist yet in the UI => Create it
    jPostWrapper = $(
      "<div class='post_wrapper'>" +
      " <div class='post'>" +
      "   <div class='users'></div>" +
      "       <div class='time'></div>" +
      "   <div class='content'></div>" +
      "   <div class='buttons'></div>" +
      " </div>" +
      " <div class='post_replies empty'></div>" +
      "</div>").attr('id', elementPostId);

    if (post.parent) {
      var parentPostId = '#post-' + post.parent;
      if (post.intended_post == 1) {
        var parentPost = $(parentPostId + ">.post_replies");
        var thread = $('<div></div>').addClass('intended_reply_thread').appendTo(parentPost).append(jPostWrapper);
        if (parentPost.hasClass('empty')) {
          parentPost.removeClass('empty');
        } else {
          thread.addClass('thread_spacer');
        }
      } else {
        jPostWrapper.insertAfter(parentPostId);
      }
    } else { // Root post
      jPostWrapper.appendTo(this.$posts);
    }

  }
  jPostWrapper.data('post', post); // Refresh the bound post

  $(">.post", jPostWrapper).off('click').click(function() {
      // Add the nice green border to any clicked post
      $("#topic_wrapper .active").removeClass('active');
      $(this).addClass('active');

      that.onPostClicked(post);
    });

  if (post.deleted != 1) {
    // Render children

    var ePostUsers = $(">.post>.users", jPostWrapper);
    this._renderPostUsers(post, ePostUsers);

    var ePostContent = $(">.post>.content", jPostWrapper);
    if (post.id != this.editingPostId) { // Leave the content untouched, if the user is editing it
      ePostContent.html(post.content);
      // Security: Change all link in the post to open in a new browser window
      $("a", ePostContent).attr('target', '_new');
    }
    if (post.unread == 1) {
      $("<div></div>").addClass('unread').appendTo($(">.post", jPostWrapper));
    } else {
      $('>.post>.unread', jPostWrapper).detach();
    }

    var ePostTime = $(">.post>.time", jPostWrapper).empty();
    ePostTime.text(this._renderTime(post.timestamp));

    var ePostButtons = $(">.post>.buttons", jPostWrapper).empty();
    this._addDefaultButtons(ePostButtons, post);
  } else {
    $(">.post",jPostWrapper).detach();
  }
  return jPostWrapper;
};

jQueryTopicView.prototype._renderTime = function(timestamp) {
  if (!timestamp) {
    return "";
  }
  // NOTE: This format the date in the german way (localized): dd.mm.yyyy hh24:mi
  var createdAt = new Date(timestamp * 1000), now = new Date();
  var hours = createdAt.getHours();
  if (hours < 10) {
    hours = "0" + hours;
  }
  var minutes = createdAt.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  var time = hours + ":" + minutes;

  var month = createdAt.getMonth() + 1;
  if (month < 0){
    month = "0" + month;
  }

  if (createdAt.getYear() == now.getYear() &&
     createdAt.getMonth() == now.getMonth() &&
     createdAt.getDate() == now.getDate()) { // This post is from today, only show the time
    return time;
  } else {
    return createdAt.getDate() + "." + month + "."+ (1900 + createdAt.getYear()) + " " + time;
  }
};

jQueryTopicView.prototype._renderPostUsers = function(post, postElement) {
  if (postElement == null) {
    postElement = $("#post-" + post.id + ">.post>.users");
  }
  postElement.empty();

  var minHeight = 16;
  if (post.id != ROOT_ID) { // No user icons for the root
    var size = post.users.length == 1 ? 25 : 21;
    for (var i = 0; i < post.users.length; i++) {
      var postUserId = post.users[i];
      var template = "<img width='{{size}}' height='{{size}}' src='http://gravatar.com/avatar/{{img}}?s={{size}}' title='{{name}}'/>";
      postElement.append(Mustache.to_html(template, {
        'img': userCache[postUserId].img,
        'name': userCache[postUserId].name,
        'size': size
      }));
    }
    minHeight = size;
  }

  // Part 2: Render the author names
  function name(index) {
    if (userCache[post.users[index]].id == API.user_id()) {
      return "Me";
    } else {
      return userCache[post.users[index]].name;
    }
  };
  var apiUserId = API.user_id();
  var authorLine = null;
  if (post.users.length == 1 && (post.id != ROOT_ID || post.users[0] != apiUserId) /* no authorline for ourself */) {
    authorLine = name(0);
  } else if (post.users.length == 2) {
    authorLine = name(0) + " and " + name(1);
  } else if (post.users.length == 3) {
    authorLine = name(0) + ", " + name(1) + " and " + name(2);
  } else if (post.users.length >= 4) {
    authorLine = name(0) + ", " + name(1) + " and " + (post.users.length-2) + " more";
  } else {
    // NO authorlines (also no icons) => No min height
    minHeight = null;
  }
  postElement.append($("<span class='names'></span>").text(authorLine));
  if (minHeight) postElement.css('min-height', minHeight);

};

jQueryTopicView.prototype.renderAddReply = function() {
  if ($("#add_reply").size() > 0) {
    return;
  }
  var $addReply = $('<div id="add_reply">Click here to add a reply</div>');
  var that = this;
  $addReply.click(function() {
    var rootPosts = $('>.post_wrapper', that.$posts);
    if (rootPosts.size() > 0) {
      var lastPost = rootPosts.eq(-1);
      that.onReplyPost(lastPost.data('post'));
    }
  })
  $addReply.appendTo(that.$posts);
};

jQueryTopicView.prototype.removePost = function(post) {
  var jpost = $('#post-' + post.id + ">.post");
  var parent = jpost.parent(); // postwrapper
  var container = parent.parent(); // #topic_posts or .intended_reply_thread
  jpost.detach();
  if ($('>.post_replies', parent).hasClass('empty')) {
    parent.detach();
  }
  if (container.hasClass('intended_reply_thread') && container.children().size() == 0) {
    container.detach();
  }
  
};

jQueryTopicView.prototype.openEditor = function(post) {
  this.closeEditor(); // Close any open editor there is

  var that = this;

  this.editingPostId = post.id;
  this.onStartPostEdit(post); // Fire notifier event

  var jpost = $("#post-" + post.id + ">.post");
  jpost.click(); // Mark active

  var eContent = $(">.content", jpost).attr('contenteditable', 'true');
  eContent.addClass('editing')./* makes formatting buttons unusable: blur(submitPostEditing).*/focus();
  eContent.keydown(function(event) {
    if (event.shiftKey && event.which == 13) {
      // Focus the button, otherwise there is a rendering bug in chrome when removing the
      // contenteditable from the div while it has focus (the editing border does not get removed, until you click somewhere)
      $(">.buttons>button", jpost).focus();
      that.closeEditor();

      event.stopPropagation();
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });
  this._addDefaultButtons($(">.buttons", jpost).empty(), post);

  this._renderTopicActions(true);
};

jQueryTopicView.prototype.closeEditor = function() {
  var jediting = $(".editing");
  this.editingPostId = null;

  if (jediting.length > 0) {
    this._renderTopicActions(false);
    jediting.attr('contenteditable', 'false').removeClass('editing');

    var post = jediting.parentsUntil('.post_wrapper').parent().data('post');
    if (post) {
      var jpost = $("#post-" + post.id + ">.post");
      this._addDefaultButtons($(".buttons", jpost).empty(), post);

      var content = $("#post-" + post.id + " .content").html();
      this.onStopPostEdit(post, content);
    }
  }
};

jQueryTopicView.prototype._addDefaultButtons = function(jbuttons, post) {
  var that = this;

  if (this.editingPostId == post.id) {
    $("<button><b>Done</b> <span style='font-size:small; color:gray'>[Shift+Enter]</span></button>").appendTo(jbuttons).click(function(event) {
      that.closeEditor();

      event.stopPropagation();
      event.preventDefault();
      event.stopImmediatePropagation();

    });
  } else {
    jbuttons.append($("<button>Edit</button>").click(function(event) {
      that.openEditor(post);
    }));
    jbuttons.append($("<button>Reply</button>").click(function(event) {
      event.stopPropagation();
      event.preventDefault();
      event.stopImmediatePropagation();
      // If the post-wrapper has a next-sibling, we create an intended-reply
      if ($(this).closest('.post_wrapper').next('.post_wrapper').size() > 0) {
        that.onIntendedReplyPost(post);
      } else {
        that.onReplyPost(post);
      }
    }));
    if (post.id != ROOT_ID) { // You cannot delete the root
      $("<button>Delete</button>").appendTo(jbuttons).click(function() {
        if (window.confirm('Are you sure to delete this post?')) {
          that.onDeletePost(post);
        }
      });
    }
  }

  if (post.locked) {
    $("button", jbuttons).attr('disabled', 'disabled');
  }
  return jbuttons;
};

jQueryTopicView.prototype._renderTopicActions = function(editing) {
  this.$actions.empty();

  if (editing) {
    // See http://www.quirksmode.org/dom/execCommand/
    // for an example of commands
    $('<button title="Clear most formattings. Tip: Use BG with empty value to clear background color." class="icon rightborder">Clear</button>').appendTo(this.$actions).click(function() {
      document.execCommand('RemoveFormat', false, null);
    });

    $('<button title="Bold" class="icon boldicon rightborder"></button>').appendTo(this.$actions).click(function() {
      document.execCommand('bold', false, null);
    });
    $('<button title="Italic" class="icon italicicon"></button>').appendTo(this.$actions).click(function() {
      document.execCommand('italic', false, null);
    });
    $('<button title="Underline" class="icon underlineicon"></button>').appendTo(this.$actions).click(function() {
      document.execCommand('underline', false, null);
    });
    $('<button title="Strike" class="icon strikeicon borderright"></button>').appendTo(this.$actions).click(function() {
      document.execCommand('strikethrough', false, null);
    });

    $('<button title="Set background color" class="icon">BG</button>').appendTo(this.$actions).click(function() {
      var color = window.prompt('Color? (#FF0000 or red)');
      if (color!=null)
        document.execCommand('backcolor', true, color ||'white');
    });
    $('<button title="Set foreground color" class="icon">FG</button>').appendTo(this.$actions).click(function() {
      var color = window.prompt('Color? (#FF0000 or red)');
      if (color!=null)
        document.execCommand('forecolor', false, color ||'black');
    });
    $('<button title="Indent text" class="icon">&gt;&gt;</button>').appendTo(this.$actions).click(function() {
      document.execCommand('indent', false);
    });
    $('<button title="Outdent text" class="icon">&lt;&lt;</button>').appendTo(this.$actions).click(function() {
      document.execCommand('outdent', false);
    });
    /* Not supported by IE8
    $('<button class="icon borderright">Hi</button>').appendTo(this.$actions).click(function() {
      var color = window.prompt('Color? (#FF0000 or red)');
      if (color!=null)
        document.execCommand('hilitecolor', false, color || 'black');
    });
    */

    $('<button title="Make numbered list" class="icon olisticon"></button>').appendTo(this.$actions).click(function() {
      document.execCommand('insertorderedlist', false, null);
    });
    $('<button title="Make list" class="icon listicon borderright"></button>').appendTo(this.$actions).click(function() {
      document.execCommand('insertunorderedlist', false, null);
    });
    $('<button title="Insert image from url" class="icon imgicon">img</button>').appendTo(this.$actions).click(function() {
      var url = window.prompt("URL?");
      if (url != null) {
        document.execCommand('insertimage', false, url);
      }
    });
    $('<button title="Make link" class="icon urlicon"></button>').appendTo(this.$actions).click(function() {
      var url = window.prompt("URL?");
      if (url != null) {
        document.execCommand('createLink', false, url);
      }
    });

    $('<button title="Remove link from text" class="icon"><s>URL</s></button>').appendTo(this.$actions).click(function() {
      document.execCommand('Unlink');
    });
  } else {
    var that = this;
    $('<button title="Invite your contacts to this topic!" id="topic_invite_user">Invite user</button>').appendTo(this.$actions).click(function() {
      that.onInviteUserAction();
    });

    if (that.currentTopic) {
      if (that.currentTopic.archived == 1) {
        var bMoveToInbox = $('<button title="Move this topic back to your inbox." id="topic_move_to_inbox">Inbox</button>').appendTo(this.$actions).click(function() {
          that.onMoveToInbox();
        });
      }

      if (that.currentTopic.archived == 0) {
        var bMoveToArchive = $('<button title="Move this topic into the archive." id="topic_move_to_archive">Archive topic</button>').appendTo(this.$actions).click(function() {
          that.onMoveToArchive();
        });
      }
    }
  }
};
