/*global TopicsListDisplay */
"use strict";

function JQueryTopicListView (show_multiple_button, show_search_bar) {
  this.showMultipleButton = show_multiple_button;
  this.showSearchBar = show_search_bar;

  this.e = $('<div></div>').addClass('widget').attr('id', 'topics_wrapper').appendTo('#widgets');

  this.$header = $('<div></div>').attr('id', 'topiclist_header').addClass('header').appendTo(this.e);
  this.$actions = $('<div id="topics_actions"></div>').appendTo(this.e);
  this.$topics = $('<ul id="topics">' +
                   '  <li>Loading ...</li>' +
                   '</ul>').appendTo(this.e);

  this.$searchFilter = null;
  if (this.showSearchBar) {
    this.$header.append(this.createSearchHeader());
  }
}
JQueryTopicListView.prototype = new TopicsListDisplay();
JQueryTopicListView.prototype.constructor = JQueryTopicListView;

// Methods --------------------------------------------------------
JQueryTopicListView.prototype.createSearchHeader = function() {
  var that = this;
  var e = $('<div class="input_search_box"><input id="topiclist_search" type="text"></div>');
  this.$searchFilter = $('input', e).on('keydown', function(e) {
    if (e.keyCode != 13)
    {
      return;
    }
    e.preventDefault();
    var value = $(this).val();
    that.onSearch(value);
  });
  return e;
};
JQueryTopicListView.prototype.setSearchFilter = function(filter) {
  if (this.$searchFilter) {
    this.$searchFilter.val(filter);
  }
};
JQueryTopicListView.prototype.setActiveTopic = function(topicId) {
  $(">li.active", this.$topics).removeClass("active");
  $("#topic-" + topicId).addClass("active");
};
JQueryTopicListView.prototype.renderActionButtons = function(enableShowInbox, enableShowArchived) {
  this.$actions.empty();

  var that = this;
  $("<button>New</button>").click(function() {
    that.onCreateNewTopic();
  }).appendTo(this.$actions);

  if (this.showMultipleButton) {
    this.$actions.append($('<span></span>').css('width', '30px').css('display', 'inline-block'));
    this.$bShowInbox = $('<button>').text('Show Inbox').appendTo(this.$actions).click(function() {
      that.onShowInbox();
      that.renderActionButtons(false, true);
    });
    this.$bShowArchive = $('<button>').text('Show Archive').appendTo(this.$actions).click(function() {
      that.onShowArchived();
      that.renderActionButtons(true, false);
    });

    if (enableShowInbox) {
      this.$bShowInbox.removeAttr('disabled');
    } else {
      this.$bShowInbox.attr('disabled', 'disabled');
    }

    if (enableShowArchived) {
      this.$bShowArchive.removeAttr('disabled');
    } else {
      this.$bShowArchive.attr('disabled', 'disabled');
    }
  }
  else {
    var texts = ['Show archived', 'Show Inbox'];

    $('<button></button>').text(texts[enableShowInbox ? 1 : 0]).click(function() {
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
};
JQueryTopicListView.prototype.renderTopicList = function renderTopicList(topics, prepend) {
  var template =
    '{{#topics}}' +
    '<li id="topic-{{id}}" data-topic-id="{{id}}" class="topic_header">' +
    ' <div class="abstract" {{#is_unread}}style="font-weight:bold"{{/is_unread}}>{{{abstract}}}</div>' +
    '{{#is_unread}} <div class="messages"><div class=unread>{{unread}}</div> of {{total}}</div>{{/is_unread}}' +
    '{{^is_unread}} <div class="messages">{{total}} msgs</div>{{/is_unread}}' +
    ' <div class="time">{{time}}</div>' +
    ' <div class="users">{{#users}}{{> avatar_img}}{{/users}}</div>' +
    '</li>' +
    '{{/topics}}' +
    '{{^topics}}<li style="padding-left: 20px">^ Click here to create new topic.</li>{{/topics}}'
    ;

  var views = {
    'topics': topics.map(function (topic) {
      return {
        'id': topic.id,
        'is_unread': topic.post_count_unread > 0,
        'unread': topic.post_count_unread,
        'total': topic.post_count_total,
        'time': this.renderTopicTimestamp(topic.max_last_touch),
        'abstract': (topic.archived ? '<i>[Archive]</i> ' : '') + topic.abstract,

        // Avatar Partial
        'avatar_size': 32,

        'users': topic.users.slice(0, 1).map(function (user) {
          user.avatar_title = user.name;
          user.avatar_url = user.avatar_url || "http://gravatar.com/avatar/" + user.img + "?s=32";
          return user;
        }),
      };
    }.bind(this))
  };
  var partials = {
    'avatar_img': MustacheAvatarPartial.template_img
  };

  var $topicList = $(Mustache.render(template, views, partials));
  var that = this;
  $topicList.on('click', function () {
    var topicId = $(this).data('topic-id');
    if (topicId) {
      that.onTopicClicked(topicId);
    }
  });

  if (prepend) {
    $topicList.prependTo(this.$topics);
  } else {
    $topicList.appendTo(this.$topics);
  }
};
JQueryTopicListView.prototype.renderTopicTimestamp = function renderTopicTimestamp(timestamp) {
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

  if (createdAt.getYear() === now.getYear()) {
    if (createdAt.getMonth() === now.getMonth() &&
      createdAt.getDate() === now.getDate()) { // This post is from today, only show the time
      return time;
    } else {
      // this post is at least from this year, show day + month
      return createdAt.getDate() + "." + month + ".";
    }
  } else {
    return createdAt.getDate() + "." + month + "."+ (1900 + createdAt.getYear());
  }
};
JQueryTopicListView.prototype.clear = function clear() {
  this.$topics.empty();
};
JQueryTopicListView.prototype.showLoading = function showLoading() {
  this.renderText('Loading ...');
};
JQueryTopicListView.prototype.renderText = function renderText(text) {
  this.$topics.html('<li>' + text + '</li>');
};
