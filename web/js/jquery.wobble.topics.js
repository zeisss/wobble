(function($) {
	"use strict";
	
	var topicsView = {
		jTopicsWrapper: undefined,
		jTopicsAction: undefined,
		jTopics: undefined,
		
		init: function() {
			this.jTopicsWrapper = $("#topics_wrapper").append('<div id="topics_actions"></div>' + 
								'<ul id="topics">' + 
								'  <li>Loading ...</li>' + 
								'</ul>');
								
			this.jTopics = $("#topics");
			
			
			this.jTopicsAction = $("#topics_actions");
			this.jTopicsAction.append("<button>New</button>").click(function() {
				topicsPresenter.createNewTopic();
			});
			
		},
		
		clear: function() {
			this.jTopics.empty();
		},
		
		setActiveTopic: function(topic) {
			$("#topics li.active").removeClass("active");
			$("#topic-" + topic.id).addClass("active");
		},
		addTopic: function(topic) {
			var template = '<li id="{{id}}" class="topic_header">' + 
						   ' <div class="abstract"></div>' + 
						   ' <div class="users">{{#users}}<img title="{{name}}" src="http://gravatar.com/avatar/{{img}}?s=32" width="32" height="32">{{/users}}</div>' + 
						   '</li>';
			var li = $(Mustache.to_html(template, {
				'id': 'topic-' + topic.id,
				'users': topic.users,
			})).appendTo(this.jTopics).click(function() { 
				topicsView.onTopicClicked(topic);
			});
			
			$(".abstract", li).html(topic.abstract);
		},
		
		// Event Handlers --------------------------------
		onTopicClicked: function(topic) {}
	};
		
	/**
     * The Business logic for the topics list-view
	 */
	function TopicsPresenter (view) {
		var that = this;
		
		that.init = function() {
			that.refreshTopicsList();
			
			view.onTopicClicked = function(topic) {
				that.onSelectedTopic(topic); 
			};
			
			BUS.on('topic.changed', function(_data) {
				that.refreshTopicsList();
			});
			
			BUS.on('topic.post.changed', function(_data) {
				that.refreshTopicsList();
			});
		};
		
		that.onSelectedTopic = function(topic) {
			view.setActiveTopic(topic);
			BUS.fire('topic.selected', topic.id);
		};
		
		/** Called by the view when a new topic should be created */
		that.refreshTopicsList = function() {
			API.list_topics(function(err, list) {
				view.clear();
				if ( err !== undefined ) {
					alert('Error while loading topics. Please reload to try again.');
				} else {
					$.each(list, function(i, data) {
						view.addTopic(data);
					});
				}
			});
		};
		that.createNewTopic = function() {
			// TODO: Check if the user is currently editing something and submit that before going on
			
			// Create a dummy topic
			var topicDetails = {
				id: API.generate_id(),
				abstract: '-',
				users: [API.user()],
				posts: [
					{
						id: '1', // First post always has the '1'
						content: 'Write some text!', 
						revision_no: 1, 
						users:[API.user_id()]
					}
				]
			};
			
			// Create a topic on the server and notify the TopicView
			API.topics_create(topicDetails.id, function(err, topic_id) {
				if (topic_id !== undefined) {					
					BUS.fire('topic.topic.created', topicDetails);
				}
			});
			
			view.addTopic(topicDetails);
			view.setActiveTopic(topicDetails);
			
		};
		
		that.init();
		
		return that;
	};
	
	$(document).ready(function() {
		topicsView.init();
		
		var presenter = new TopicsPresenter(topicsView);
	});
})(jQuery);