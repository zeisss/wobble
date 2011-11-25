(function($) {
	function log(s) {
		if ( console ) console.log(s);
	}
	// RPC Wrapper (JSON-RPC 2.0 - http://json-rpc.org/wiki/specification)
	var RPC = {
		id: 1,
		doRPC: function(name, args, callback) {
			var requestId = this.id;
			this.id++;
			
			var body = {
				jsonrpc: "2.0",
				method: name,
				params: args,
				id: requestId
			};
			var ajaxSettings = {
				type:'POST',
				cache: false,
				data: JSON.stringify(body),
				dataType: "json",
				processData: false				
			};
			if ( callback ) {
				ajaxSettings.error = function(jqXHR, textStatus, errorThrown) {
					callback(errorThrown);
				};
				ajaxSettings.success = function(data, textStatus, jqXHR) {
					if (!callback) return;
					if ( data.error ) {
						callback(data.error);
					} else {
						callback(undefined, data.result);
					}
				};
			}
			$.ajax('api/endpoint.php', ajaxSettings);
		}
	};
	
	// API Wrapper functions
	var API = {
		userId: undefined,
		user: undefined,
		
		// Directly returning functions
		/** Builds an ID by combining the user_id with a sequence ID */
		generate_id: function() {
			var id = API.user_id() + "-" + (new Date().getTime());
			return id;
		},
		user_id: function() {
			return this.userId;
		},
		user:function() {
			return this.user;
		},
		
		/** Loads initial data */
		init: function() {
			RPC.doRPC('user_get', false, function(err, user) {
				API.userId = user.id;
				API.user = user;				
			});
		},
		
		// Async stuff
		create_topic: function(id, callback) {
			RPC.doRPC('topics_create', {id: id}, callback);
		},
	
		load_topic_details: function(topic, callback) {
			/*setTimeout(function() {
				callback(undefined,  {
					id: topic.id,
					users: [
						{userid: '1', name: 'ZeissS', img: 'http://0.gravatar.com/avatar/6b24e6790cb03535ea082d8d73d0a235'},
						{userid: '2', name: 'Calaelen', img: 'http://1.gravatar.com/avatar/5d669243ec0bd7524d50cf4bb5bf28d8'}
					],
					posts: [
						{id: '1', content: '<b>Hello World</b><br />Hi there! This is topic with id=' + topic.id, users:['1']},
						{id: '2', content: 'Moar!', users:['2']}, /* first reply, no indentation *
						{id: '3', parent: '1', content: 'Intended Comment!', users:['1', '2']}
					]
				});
			}, 1000);
			*/
			RPC.doRPC('topic_get_details', {id: topic.id}, callback);
		},
		
		list_topics: function(callback) {
			// Simulate async callback
			/*setTimeout(function() {
				callback(undefined, [
					{id: '1', abstract: 'Hello World - Topic #1'},
					{id: '2', abstract: 'You made my day!'},
					{id: '3', abstract: 'TGIF - Thank god its friday!'}
				]);
			}, 1000);*/
			RPC.doRPC('topics_list', false, callback);
		}
	};
	
	// UI Functions
	var userCache = {}; // id => {id, name, img}
	
	var topicView = {	// The UI handler for the single topic
		jTopicPosts: false,
		jTopicReaders: false,
		
		init: function() {
			this.jTopicPosts = $("#topic_posts");
			this.jTopicReaders = $("#topic_readers");
		},
		
		clear: function() {
			this.jTopicPosts.empty();
			this.jTopicReaders.empty();
		},
		
		setLoadingState: function() {
			this.clear();
			this.jTopicPosts.append("Loading ...");
		},
		
		addUser: function(imgurl, name) {
			var jUser = $("<img width='40' />").attr('src', imgurl).attr('title', name);
			this.jTopicReaders.append(jUser);
		},
		
		addPost: function(post) {
			var jpost = $("<div class=\"post\"></div>");
			
			var jusers = $("<div class=users></div>");
			$.each(post.users, function(j, postUser) {
				var userIcon = $("<img height=15 />").attr('src', userCache[postUser].img).attr('title', userCache[postUser].name);					
				jusers.append(userIcon); // All users should be in the cache already
			});
			jpost.append(jusers);
			
			jpost.append($("<div class=content></div>").html(post.content));
			
			jpost.append(this._addDefaultButtons($("<div class=buttons></div>"), post));
			
			
			var jPostWrapper = $("<div class=post_wrapper></div>").attr('id', 'post-' + post.id).append(jpost).append('<div class=post_replies></div>').data('post', post);
			if ( post.parent ) {
				$("#post-" + post.parent + " .post_replies").append(jPostWrapper);
			} else {
				this.jTopicPosts.append(jPostWrapper);
			}
		},
		
		openEditor: function(post) {
			this.closeEditor(); // Close any open editor there is
			
			var jpost = $("#post-" + post.id + ">.post");
			$(".content", jpost).attr('contenteditable', 'true').addClass('editing').focus();
			$(".buttons", jpost).empty().append($("<button>Submit</button>").click(function() {
				topicPresenter.stopPostEdit(post);
			}));
		},
		
		getPostContent: function(post_id) {
			return $("#post-" + post_id + " .content").html();
		},
		
		closeEditor: function() {
			var jediting = $(".editing");
			jediting.attr('contenteditable', 'false').removeClass('editing');
			
			var post = jediting.parentsUntil('.post_wrapper').parent().data('post');
			if ( post ) {
				var jpost = $("#post-" + post.id + ">.post");
				this._addDefaultButtons($(".buttons", jpost).empty(), post);
			}
		},
		
		_addDefaultButtons: function(jbuttons, post) {
			jbuttons.append($("<button>Edit</button>").click(function() {
				topicPresenter.startPostEdit(post);
			}));
			jbuttons.append($("<button>Reply</button>").click(function() {
				topicPresenter.replyPost(post);
			}));
			jbuttons.append($("<button>Delete</button>").click(function() {
				topicPresenter.deletePost(post);
			}));
			return jbuttons;
		}
		
	};
	var topicsView = {
		jTopicsAction: false,
		jTopics: false,
		
		init: function() {
			this.jTopics = $("#topics");
			
			this.jTopicsAction = $("#topics_actions");
			this.jTopicsAction.append("<button>New</button>").click(function() {
				topicsPresenter.createNewTopic();
			});
			
		},
		
		clear: function() {
			this.jTopics.empty();
		},
		
		showError: function(sMessage) {
			this.clear();
			this.jTopics.append('<li>' + sMessage + '</li>');
		},
		
		setActiveTopic: function(topic) {
			$("#topics li.active").removeClass("active");
			$("#topic-" + topic.id).addClass("active");
		},
		addTopic: function(topic) {
			this.jTopics.append(
				$("<li>" + topic.abstract + "</li>").attr('id', 'topic-' + topic.id).attr('style', 'cursor:pointer').click(function() { topicsPresenter.onSelectedTopic(topic); })
			);
		}
	};
		
	var topicsPresenter = { // The Business logic for the single topic view
		init: function() {
			API.list_topics(function(err, list) {
				topicsView.clear();
				if ( err !== undefined ) {
					topicsView.showError('Error while loading topics. Please reload to try again.');
				} else {
					$.each(list, function(i, data) {
						topicsView.addTopic(data);
					});
				}
			});
		},
		
		onSelectedTopic: function(topic) {
			log("Topic in topic list clicked: " + topic.id);
		
			topicsView.setActiveTopic(topic);
			
			topicView.setLoadingState();
			API.load_topic_details(topic, function(err, topicDetails) {
				topicView.clear(); // Rese the view
				if ( err !== undefined ) {
					topicsView.showError("Failed to load topic details. Ooooops!");
				} else {
					topicsPresenter.openTopic(topicDetails);
				}
			});
		},
		
		openTopic: function(topicDetails) {
			$.each(topicDetails.users, function(i, user) {
				userCache[user.userid] = user; // Cache user object (user later to show the user post images)
				topicView.addUser(user.img, user.name);
			});
			
			$.each(topicDetails.posts, function(i, post) {
				topicView.addPost(post);
			});
		},
		
		/** Called by the view when a new topic should be created */
		createNewTopic: function() {
			// TODO: Check if the user is currently editing something and submit that before going on
			
			// Create a dummy topic
			var topicDetails = {
				id: API.generate_id(),
				abstract: '-',
				users: [API.user()],
				posts: [
					{id: '1', content: '', users:[API.user_id()]}
				]
			};
			
			// Create a topic on the server and read the users
			API.create_topic(topicDetails.id, function(err, topic_id) {
				if ( err !== undefined) {
					alert("You failed to create the topic!");
				}
			});
			
			topicsView.addTopic(topicDetails);
			topicsView.setActiveTopic(topicDetails);
			
			topicView.clear();
			this.openTopic(topicDetails);
			topicView.openEditor(topicDetails.posts[0]);
		}
	};
	
	var topicPresenter = {
		startPostEdit: function(post) {
			topicView.openEditor(post);
		},
		
		stopPostEdit: function(post) {
			var content = topicView.getPostContent(post.id);
			// TODO: Submit content
			topicView.closeEditor();
		},
		
		deletePost: function(post) {},
		replyPost: function(post) {}
	};
	
	$(document).ready(function() {
		API.init(); // Loads current user ID infos (so its cached locally)
		
		topicsView.init();
		topicView.init();
		
		topicsPresenter.init();
	});
})(jQuery);



