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
				   ' <div class="users">{{#users}}<img title="{{name}}" src="http://gravatar.com/avatar/{{img}}?s=32" width="32" height="32">{{/users}}</div>' + 
				   '</li>';
	var that = this;
	var li = $(Mustache.to_html(template, {
		'id': 'topic-' + topic.id,
		'users': topic.users,
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
jQueryTopicsView.prototype.clear = function() {
	this.jTopics.empty();
};
