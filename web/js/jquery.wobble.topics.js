"use strict";

function jQueryTopicsView () {
	this.jTopicsWrapper = $("#topics_wrapper").append('<div id="topics_actions"></div>' + 
						'<ul id="topics">' + 
						'  <li>Loading ...</li>' + 
						'</ul>');
						
	this.jTopics = $("#topics");
	
	this.jTopicsAction = $("#topics_actions");
	
	var that = this;
	this.jTopicsAction.append($("<button>New</button>").click(function() {
		that.onCreateNewTopic();
	}));
};
jQueryTopicsView.prototype = new TopicsDisplay;
jQueryTopicsView.prototype.constructor = jQueryTopicsView;

// Methods --------------------------------------------------------
jQueryTopicsView.prototype.setActiveTopic = function(topic) {
	$("#topics li.active").removeClass("active");
	$("#topic-" + topic.id).addClass("active");
};
jQueryTopicsView.prototype.addTopic = function(topic, prepend) {

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
	var li = $(Mustache.to_html(template, {
		'id': 'topic-' + topic.id,
		'users': topic.users,
		'unread': topic.post_count_unread,
		'total': topic.post_count_total,
		'time': this.renderTimestamp(topic.max_last_touch)
	})).click(function() { 
		that.onTopicClicked(topic);
	});
	$(".abstract", li).html(topic.abstract);
	
	if ( prepend ) {
		li.prependTo(this.jTopics);
	} else {
		li.appendTo(this.jTopics)
	}
};
jQueryTopicsView.prototype.renderTimestamp = function(timestamp) {
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
	if ( minutes < 10) {
		minutes = "0" + minutes;
	}
	var time = hours + ":" + minutes;

	var month = createdAt.getMonth() + 1;
	if ( month < 0 ){
		month = "0" + month;
	}
	
	if ( createdAt.getYear() == now.getYear() ) {
		if ( createdAt.getMonth() == now.getMonth() &&
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
jQueryTopicsView.prototype.clear = function() {
	this.jTopics.empty();
};
