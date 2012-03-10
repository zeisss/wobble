"use strict";

function jQueryTopicsView (show_multiple_button) {
  this.e = $('<div></div>').addClass('widget').attr('id', 'topics_wrapper').appendTo('#widgets');

  this.$actions = $('<div id="topics_actions"></div>').appendTo(this.e);
  this.$topics = $('<ul id="topics">' +
                   '  <li>Loading ...</li>' +
                   '</ul>').appendTo(this.e)

  this.showMultipleButton = show_multiple_button;
};
jQueryTopicsView.prototype = new TopicsListDisplay;
jQueryTopicsView.prototype.constructor = jQueryTopicsView;

// Methods --------------------------------------------------------
jQueryTopicsView.prototype.setActiveTopic = function(topicId) {
  $(">li.active", this.$topics).removeClass("active");
  $("#topic-" + topicId).addClass("active");
};
jQueryTopicsView.prototype.renderActionButtons = function(showArchived) {
  this.$actions.empty();

  var that = this;
  $("<button>New</button>").click(function() {
    that.onCreateNewTopic();
  }).appendTo(this.$actions);

  if (this.showMultipleButton) {
    this.$actions.append($('<span></span>').css('width', '30px').css('display', 'inline-block'));
    this.$bShowInbox = $('<button>').text('Show Inbox').appendTo(this.$actions).click(function() {
      that.onShowInbox();
      that.renderActionButtons(false);
    });
    this.$bShowArchive = $('<button>').text('Show Archive').appendTo(this.$actions).click(function() {
      that.onShowArchived();
      that.renderActionButtons(true);
    })

    if (showArchived) {
      this.$bShowInbox.removeAttr('disabled');
      this.$bShowArchive.attr('disabled', 'disabled');
    } else {
      this.$bShowInbox.attr('disabled', 'disabled');
      this.$bShowArchive.removeAttr('disabled');
    }
  }
  else {
    var texts = ['Show archived', 'Show Inbox'];

    $('<button></button>').text(texts[showArchived ? 1 : 0]).click(function() {
      var button = $(this);
      if (button.text() == texts[0]) {
        that.onShowArchived();
        button.text(texts[1]);
      } else {
        that.onShowInbox();
        button.text(texts[0]);
      }
    }).appendTo(this.$actions);
  }
}
jQueryTopicsView.prototype.renderTopicList = function renderTopicList(topics, prepend) {
  // Render to html list
  if (topics.length == 0) {
    this.renderText('No topics here. Try to create one :)');
  }
  for (var i = 0; i < topics.length; ++i) {
    this.renderTopic(topics[i], prepend);
  }
};
jQueryTopicsView.prototype.renderTopic = function renderTopic(topic, prepend) {
  var template = '<li id="{{id}}" class="topic_header">' +
           ' <div class="abstract"></div>' +
           (topic.post_count_unread == 0 ?
              ' <div class="messages">{{total}} msgs</div>' :
              ' <div class="messages"><div class=unread>{{unread}}</div> of {{total}}</div>')
            +
           ' <div class="time">{{time}}</div>' +
           ' <div class="users">{{#users}}<img title="{{name}}" src="http://gravatar.com/avatar/{{img}}?s=32" width="32" height="32">{{/users}}</div>' +
           '</li>';
  var that = this;
  var $li = $(Mustache.to_html(template, {
    'id': 'topic-' + topic.id,
    'users': topic.users.slice(0,3) /* Make sure we only have 3 users */,
    'unread': topic.post_count_unread,
    'total': topic.post_count_total,
    'time': this.renderTopicTimestamp(topic.max_last_touch)
  })).data('topic', topic);

  $li.on('click', function() {
    var topic = $(this).data('topic');
    if (topic) {
      that.onTopicClicked(topic);
    }
  });

  var abstract = $(".abstract", $li).html(topic.abstract);

  if (topic.post_count_unread > 0) {
    abstract.css('font-weight', 'bold');
  }

  if (prepend) {
    $li.prependTo(this.$topics);
  } else {
    $li.appendTo(this.$topics)
  }
};
jQueryTopicsView.prototype.renderTopicTimestamp = function renderTopicTimestamp(timestamp) {
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

  if (createdAt.getYear() == now.getYear()) {
    if (createdAt.getMonth() == now.getMonth() &&
      createdAt.getDate() == now.getDate()) { // This post is from today, only show the time
      return time;
    } else {
      // this post is at least from this year, show day + month
      return createdAt.getDate() + "." + month + ".";
    }
  } else {
    return createdAt.getDate() + "." + month + "."+ (1900 + createdAt.getYear());
  }
};
jQueryTopicsView.prototype.clear = function clear() {
  this.$topics.empty();
};
jQueryTopicsView.prototype.showLoading = function showLoading() {
  this.renderText('Loading ...');
};
jQueryTopicsView.prototype.renderText = function renderText(text) {
  this.$topics.html('<li>' + text + '</li>');
};
