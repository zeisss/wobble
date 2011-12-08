(function($) {
	"use strict";
	
	// UI Functions
	var userCache = {}; // id => {id, name, email, img}
	
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
		that.removePost = function(post) {
			topic.posts = jQuery.grep(topic.posts, function(post2, i) {
				return post.id === post2.id;
			});
		};
		that.addPost = function(post) {
			topic.posts.push(post);
		};
		
		that.createReply = function(post) {
			return {
				id: API.generate_id(),
				parent: post.id,
				locked: false,
				content: '',
				revision_no: 1,
				users: [API.user_id()]
			};
		};
		
		that.addUser = function(user) {
			topic.users.push(user);
		};
		
		that.addUserToPost = function(post, user) {
			var found = false;
			jQuery.each(post.users, function(i, user_id) {
				if ( user_id === user.id) {
					found = true;
				}
			});
			if (!found) {
				post.users.push(user.id);
				// We can assume here, that the user is part of topic.users, otherwise he shouldn't see this post
			}
		};
	}
	TopicModel.prototype.removeUser = function(user, callback) {
		var topic = this.getTopic();
		
		topic.users = jQuery.grep(topic.users, function(index, tuser) {
			return user.id != tuser.id; // Filter the given user
		});
	};
	
	// Callbacks
	function TopicDisplay() {}
	TopicDisplay.prototype.onInviteUserAction = function() {};
	TopicDisplay.prototype.onStartPostEdit = function(post) {};
	TopicDisplay.prototype.onEndPostEdit = function(post, content) {};
	TopicDisplay.prototype.onReplyPost = function(post) {};
	TopicDisplay.prototype.onDeletePost = function(post) {};
	TopicDisplay.prototype.onUserClicked = function(user) {};
	
	var topicView = {	// The UI handler for the single topic
		jTopicPosts: undefined,
		jTopicReaders: undefined,
		jTopicActions: undefined,
		
		init: function() {
			topicView.jTopicPosts = $("#topic_posts");
			topicView.jTopicReaders = $("#topic_readers");
			topicView.jTopicActions = $("#topic_actions");
			
			
			topicView._renderTopicActions(false);
		},
		
		
		
		// Methods		
		clear: function() {
			this.jTopicPosts.empty();
			this.jTopicReaders.empty();
		},
		
		setEnabled: function(enabled) {
			if ( enabled ) {
				$("button", this.jTopicActions).removeAttr('disabled');
			} else {
				$("button", this.jTopicActions).attr('disabled', 'disabled');
			}
		},
		
		setLoadingState: function() {
			this.clear();
			this.setEnabled(false);
			this.jTopicPosts.append("Loading ...");
		},
		
		renderTopic: function(topicDetails) {
			this.clear();
			this._renderTopicActions($(".editing").length > 0);
			
			if ( topicDetails ) {
				this.setEnabled(true);
				
				$.each(topicDetails.users, function(i, user) {
					userCache[Number(user.id)] = user; // Cache user object (user later to show the user post images)
					topicView._addUser(user);
				});
				
				$.each(topicDetails.posts, function(i, post) {
					topicView.renderPost(post);
				});
			} else {
				this.setEnabled(false);
			}	
		},
		_addUser: function(user) {
			var template = "<div class='usericon usericon40'>" + 
						   "<div><img width='40' height='40' src='http://gravatar.com/avatar/{{img}}?s=40' title='{{name}}'/></div>" + 
						   "<div class='status {{status}}'></div>" + 
						   "</div>";
			
			this.jTopicReaders.append($(Mustache.to_html(template, {
				'img': user.img,
				'name': user.name,
				'status': user.online == 1 ? 'online':'offline'
			})).click(function() {
				topicView.onUserClicked(user);
			}));
		},
		
		
		
		renderPost: function(post) {
			var elementPostId = 'post-' + post.id;
			
			var jpost = $("#" + elementPostId);
			if (jpost.length == 0 ) {
				// Post does not exist yet in the UI
				jpost = $("<div class=\"post\"></div>");
				
				var jPostWrapper = $("<div class='post_wrapper'></div>").attr('id', elementPostId).append(jpost).append('<div class=post_replies></div>').data('post', post);
				if (post.parent) {
					$("#post-" + post.parent + " > .post_replies").append(jPostWrapper);
				} else {
					this.jTopicPosts.append(jPostWrapper);
				}
				
				jpost.click(function() {
					$("#topic_wrapper .active").removeClass('active');
					jpost.addClass('active');
				});
			}
			topicView.renderPostUsers(post, jpost);
			
			var jcontent = $(">.post>.content", jpost);
			if ( jcontent.length === 0) {
				jcontent = $("<div class='content'></div>").appendTo(jpost);
			}
			jcontent.html(post.content);
			
			var jbuttons = $(">.post>.buttons", jpost);
			if (jbuttons.length === 0) {
				jbuttons = $("<div class='buttons'></div>").appendTo(jpost);
			}
			jbuttons.empty();
			this._addDefaultButtons(jbuttons, post);
			
			
		},
		renderPostUsers: function(post, postElement) {
			if (postElement == null) {
				postElement = $("#post-" + post.id + ">.post");
			}
			
			var jusers = $(".users", postElement);
			if ( jusers.length == 0) {
				jusers = $("<div class=users></div>").appendTo(postElement);
			} else {
				jusers.empty();
			}
			
			$.each(post.users, function(j, postUserId) {
				var template = "<img width='{{size}}' height='{{size}}' src='http://gravatar.com/avatar/{{img}}?s={{size}}' title='{{name}}'/>";
				jusers.append(Mustache.to_html(template, {
					'img': userCache[postUserId].img,
					'name': userCache[postUserId].name,
					'size': post.users.length == 1 ? 20 : 16
				}));
			});
			
		},
		removePost: function(post) {
			var jpost = $('#post-' + post.id).detach();
		},
		
		openEditor: function(post) {
			this.closeEditor(); // Close any open editor there is
			
			topicView.onStartPostEdit(post); // Fire notifier event
			
			var submitPostEditing = function() {
				topicView.closeEditor();
				
				
			};
			
			var jpost = $("#post-" + post.id + ">.post");
			$(".content", jpost).attr('contenteditable', 'true').addClass('editing')./* makes formatting buttons unusable: blur(submitPostEditing).*/focus();
			$(".buttons", jpost).empty().append($("<button>Submit</button>").click(submitPostEditing));
			
			this._renderTopicActions(true);
		},
		
		closeEditor: function() {
			var jediting = $(".editing");
			
			if (jediting.length > 0) {
				
				
				topicView._renderTopicActions(false);
				
				jediting.attr('contenteditable', 'false').removeClass('editing');
				
				var post = jediting.parentsUntil('.post_wrapper').parent().data('post');
				if ( post ) {
					var jpost = $("#post-" + post.id + ">.post");
					this._addDefaultButtons($(".buttons", jpost).empty(), post);
					
					var content = $("#post-" + post.id + " .content").html();
					topicView.onStopPostEdit(post, content);
				}
			}
		},
		
		showError: function(sMessage) {
			this.clear();
			this.jTopics.append('<li>' + sMessage + '</li>');
		},
		
		_addDefaultButtons: function(jbuttons, post) {
			jbuttons.append($("<button>Edit</button>").click(function() {
				topicView.openEditor(post);
			}));
			jbuttons.append($("<button>Reply</button>").click(function() {
				topicView.onReplyPost(post);
			}));
			if ( post.id != '1' ) {
				jbuttons.append($("<button>Delete</button>").click(function() {
					topicView.onDeletePost(post);
				}));
			}
			if ( post.locked ) {
				$("button", jbuttons).attr('disabled', 'disabled');
			}
			return jbuttons;
		},
		
		_renderTopicActions: function(editing) {
			this.jTopicActions.empty();
			
			if ( editing ) {
				// See http://www.quirksmode.org/dom/execCommand/
				// for an example of commands
				$('<button><b>B</b></button>').appendTo(this.jTopicActions).click(function() {
					document.execCommand('bold', false, null); // $(".editing")[0].execCommand(
				});
				$('<button><i>I</i></button>').appendTo(this.jTopicActions).click(function() {
					document.execCommand('italic', false, null); // $(".editing")[0].execCommand(
				});
				$('<button><u>U</u></button>').appendTo(this.jTopicActions).click(function() {
					document.execCommand('underline', false, null); // $(".editing")[0].execCommand(
				});
				$('<button>UL</button>').appendTo(this.jTopicActions).click(function() {
					document.execCommand('insertunorderedlist', false, null); // $(".editing")[0].execCommand(
				});
				$('<button>img</button>').appendTo(this.jTopicActions).click(function() {
					var url = window.prompt("URL?");
					if ( url != null ) {
						document.execCommand('insertimage', false, url); // $(".editing")[0].execCommand(
					}
				});
				$('<button>url</button>').appendTo(this.jTopicActions).click(function() {
					var url = window.prompt("URL?");
					if ( url != null ) {
						document.execCommand('createLink', false, url); // $(".editing")[0].execCommand(
					}
				});
			} else {
				$('<button id="topic_invite_user">Invite user</button>').appendTo(this.jTopicActions).click(function() {
					topicView.onInviteUserAction();
				});
			}
		}
	};
	topicView.prototype = new TopicDisplay();
	
	
	
	function TopicPresenter(view, model) {
		
		this.view = view;
		this.model = model;
		
		view.setEnabled(false);
		
		//// ---- View Event Callbacks ------------------------------------------------------
		var that = this;
		view.onInviteUserAction = function() {
			BUS.fire('contacts.chooser.open', {
				'multiple': true,
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
			
			if ( user.id != API.user_id()) {
				actions.push({title: 'Remove from Topic', callback: function() {
					API.topic_remove_user(that.model.getTopic().id, user.id, function(err, result) {
						if (!err) {
							that.model.removeUser(user);
						}
					});
				}});
				
			}
			
			BUS.fire('topic.user.clicked', {
				'user': user,
				'actions': actions
			});
		};
		
		view.onStartPostEdit = function(post) {
			model.addUserToPost(post, API.user());
			view.renderPost(post);
		};
		view.onStopPostEdit = function(post, content) {
			post.locked = true; // Lock post until saved
			post.content = content;
			view.renderPost(post);
			API.post_edit(model.getTopic().id, post.id, content, post.revision_no, function(err, result) {
				if ( err === undefined ) {
					post.revision_no = result.revision_no;
				
					BUS.fire('topic.post.changed', model.getTopic().id);
				}
				post.locked = false;
				view.renderPost(post);
			});
			
			
		};
		
		view.onReplyPost = function(post) {
			var newPost = model.createReply(post);
			newPost.locked = true;
			API.post_create(model.getTopic().id, newPost.id, newPost.parent, function(err, data) {
				newPost.locked = false;
				view.openEditor(newPost);
			});
			model.addPost(newPost);
			view.renderTopic(model.getTopic());
			
		};
		view.onDeletePost = function(post) {
			post.locked = true;
			API.post_delete(model.getTopic().id, post.id, function(err, result) {
				post.locked = false;
			});
			view.removePost(post);
			model.removePost(post);
		};
		
		/**
		 * BUS Handlers
		 */
		 
		// Fired by TopicsPresenter
		BUS.on('topic.selected', function(topicId) {		
			if ( model.getTopic() != null && model.getTopic().id == topicId ) {
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
			if ( model.getTopic() != null && (
				data.type == 'topic_changed' && data.topic_id == model.getTopic().id || 
				data.type == 'post_deleted' && data.topic_id == model.getTopic().id || 
				data.type == 'post_changed' && data.topic_id == model.getTopic().id)) 
			{
				that.refreshTopic();
			}
		});
	};
	TopicPresenter.prototype.refreshTopic = function(callback) {
		if ( this.model.getTopic() == null )
			return;
			
		var that  = this;
		
		API.load_topic_details(this.model.getTopic().id, function(err, topicDetails) {
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
		if ( topicDetails === this.model.getTopic() ) {
			return;
		}
		this.model.setTopic(topicDetails);
		this.view.renderTopic(topicDetails);
	};
	
	$(document).ready(function() {
		BUS.on('api.user', function(_user) {
			var user = API.user();
			userCache[user.id] = user;
		});
		
		topicView.init();
		
		var topicPresenter = new TopicPresenter(topicView, new TopicModel());
	});
})(jQuery);