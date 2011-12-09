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
TopicDisplay.prototype.onUserClicked = function(user) {};
TopicDisplay.prototype.onDeletePost = function(post) {};
TopicDisplay.prototype.onReplyPost = function(post) {};

function jQueryTopicView() {	// The UI handler for the single topic
	this.editingPostId = null;
	
	this.jTopicPosts = $("#topic_posts");
	this.jTopicReaders = $("#topic_readers");
	this.jTopicActions = $("#topic_actions");
	
	this._renderTopicActions(false);
	
};
jQueryTopicView.prototype = new TopicDisplay;
jQueryTopicView.prototype.constructor = jQueryTopicView;

// Methods --------------------------------------------------------
jQueryTopicView.prototype.clear = function() {
	this.editingPostId = null;
	this.jTopicPosts.empty();
	this.jTopicReaders.empty();
};

jQueryTopicView.prototype.setEnabled = function(enabled) {
	if ( enabled ) {
		$("button", this.jTopicActions).removeAttr('disabled');
	} else {
		$("button", this.jTopicActions).attr('disabled', 'disabled');
	}
},

jQueryTopicView.prototype.setLoadingState = function() {
	this.clear();
	this.setEnabled(false);
	this.jTopicPosts.append("<div class=loading>Loading ...</div>");
};

jQueryTopicView.prototype.renderTopic = function(topicDetails) {
	$("#topic_posts .loading").detach();
	
	this._renderTopicActions($(".editing").length > 0);
	
	if ( topicDetails ) {
		this.setEnabled(true);
		
		var that = this;
		$.each(topicDetails.users, function(i, user) {
			userCache[Number(user.id)] = user; // Cache user object (user later to show the user post images)
			that._renderReader(user);
		});
		
		$.each(topicDetails.posts, function(i, post) {
			that.renderPost(post);
		});
	} else {
		this.setEnabled(false);
	}	
};
jQueryTopicView.prototype._renderReader= function(user) {
	var that = this;
	var containerId = "topic-reader-" + user.id;
	var container = $('#' + containerId);
	if ( container.length == 0 ) {
		container = $("<span></span>").attr('id', containerId).appendTo(this.jTopicReaders);
	}
	var template = "<div class='usericon usericon40'>" + 
				   "<div><img width='40' height='40' src='http://gravatar.com/avatar/{{img}}?s=40' title='{{name}}'/></div>" + 
				   "<div class='status {{status}}'></div>" + 
				   "</div>";
	
	container.html(Mustache.to_html(template, {
		'img': user.img,
		'name': user.name,
		'status': user.online == 1 ? 'online':'offline'
	})).off('click').click(function() {
		that.onUserClicked(user);
	});
};



jQueryTopicView.prototype.renderPost = function(post) {
	var elementPostId = 'post-' + post.id;
	
	var jPostWrapper = $("#" + elementPostId);
	if (jPostWrapper.length == 0 ) {
		// Post does not exist yet in the UI
		jPostWrapper = $(
			"<div class='post_wrapper'>" + 
			"	<div class='post'>" + 
			"		<div class='users'></div>" +
			"       <div class='time'></div>" + 
			"		<div class='content'></div>" + 
			"		<div class='buttons'></div>" + 
			"	</div>" + 
			"</div>").attr('id', elementPostId);
		
		$(">.post", jPostWrapper).click(function() {
			// Add the nice green border to any clicked post
			$("#topic_wrapper .active").removeClass('active');
			$(this).addClass('active');
		});
		
		if (post.parent) {
			// NOTE: Here is some special logic to NOT intend the first reply we got, so the listings look nicer
			// This is achieved by putting the first reply in a separate div below the intended replies
			var parentPostId = '#post-' + post.parent;
			var ePostFirstReply = $(parentPostId + ">.post_first_reply");
			if ( ePostFirstReply.length == 0 ) {
				// No first post-element found, so lets create
				ePostFirstReply = $("<div class='post_first_reply'></div>").appendTo($(parentPostId));
				jPostWrapper.appendTo(ePostFirstReply);
			} else {
				// We found a first-post-element. This means is is also already used. => Create the .post_replies and use that
				var ePostReplies = $("#post-" + post.parent + ">.post_replies");
				if (ePostReplies.length == 0) {
					ePostReplies = $("<div class='post_replies'></div>").insertBefore($(parentPostId + ">.post_first_reply"));
				}
				ePostReplies.append(jPostWrapper);
			}
		} else {
			jPostWrapper.appendTo(this.jTopicPosts);
		}
		
	}
	jPostWrapper.data('post', post); // Refresh the bound post
	
	// Render children
	var ePostUsers = $(">.post>.users", jPostWrapper);
	this._renderPostUsers(post, ePostUsers);
	
	if (post.id != this.editingPostId ) { // Leave the content untouched, if the user is editing it
		var ePostContent = $(">.post>.content", jPostWrapper);
		ePostContent.html(post.content);
	}

	var ePostTime = $(">.post>.time", jPostWrapper).empty();
	ePostTime.text(this._renderTime(post.timestamp));
	
	var ePostButtons = $(">.post>.buttons", jPostWrapper).empty();
	this._addDefaultButtons(ePostButtons, post);
};
jQueryTopicView.prototype._renderTime = function(timestamp) {
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
	
	if ( createdAt.getYear() == now.getYear() &&
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
	
	$.each(post.users, function(j, postUserId) {
		var template = "<img width='{{size}}' height='{{size}}' src='http://gravatar.com/avatar/{{img}}?s={{size}}' title='{{name}}'/>";
		postElement.append(Mustache.to_html(template, {
			'img': userCache[postUserId].img,
			'name': userCache[postUserId].name,
			'size': post.users.length == 1 ? 20 : 16
		}));
	});	

	var authorLine = "";
	if ( post.users.length == 1 ) {
		authorLine = userCache[post.users[0]].name;
	} else if ( post.users.length == 2) {
		authorLine = userCache[post.users[0]].name + " and " + userCache[post.users[1]].name;
	} else if ( post.users.length == 3) {
		authorLine = userCache[post.users[0]].name + ", " + userCache[post.users[1]].name + " and " + userCache[post.users[2]].name;
	} else if ( post.users.length >= 4) {
		authorLine = userCache[post.users[0]].name + ", " + userCache[post.users[1]].name + " and " + (post.users.length-2) + " more";
	}
	postElement.append($("<span class='names'></span>").text(authorLine));

};
jQueryTopicView.prototype.removePost = function(post) {	
	var jpost = $('#post-' + post.id + ">.post").detach();
};

jQueryTopicView.prototype.openEditor = function(post) {
	this.closeEditor(); // Close any open editor there is
	
	this.editingPostId = post.id;
	this.onStartPostEdit(post); // Fire notifier event
	
	var jpost = $("#post-" + post.id + ">.post");
	jpost.click(); // Mark active
	$(">.content", jpost).attr('contenteditable', 'true').addClass('editing')./* makes formatting buttons unusable: blur(submitPostEditing).*/focus();
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
		if ( post ) {
			var jpost = $("#post-" + post.id + ">.post");
			this._addDefaultButtons($(".buttons", jpost).empty(), post);
			
			var content = $("#post-" + post.id + " .content").html();
			this.onStopPostEdit(post, content);
		}
	}
};

jQueryTopicView.prototype._addDefaultButtons = function(jbuttons, post) {
	var that = this;

	if ( this.editingPostId == post.id ) {
		$("<button>Submit</button>").appendTo(jbuttons).click(function() {
			that.closeEditor();
		});
	} else {
		jbuttons.append($("<button>Edit</button>").click(function(event) {
			that.openEditor(post);			
		}));
		jbuttons.append($("<button>Reply</button>").click(function() {
			event.stopPropagation();
			event.preventDefault();
			event.stopImmediatePropagation();
			that.onReplyPost(post);
		}));
		if ( post.id != '1' ) {
			$("<button>Delete</button>").appendTo(jbuttons).click(function() {
				that.onDeletePost(post);
			});
		}
	}
	
	if ( post.locked ) {
		$("button", jbuttons).attr('disabled', 'disabled');
	}
	return jbuttons;
};

jQueryTopicView.prototype._renderTopicActions = function(editing) {
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
		var that = this;
		$('<button id="topic_invite_user">Invite user</button>').appendTo(this.jTopicActions).click(function() {
			that.onInviteUserAction();
		});
	}
};



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
			if (!err) {
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
			view.renderPost(newPost);
		});
		model.addPost(newPost);
		view.renderTopic(model.getTopic());
		view.openEditor(newPost);
		
	};
	view.onDeletePost = function(post) {
		post.locked = true;
		API.post_delete(model.getTopic().id, post.id, function(err, result) {
			post.locked = false;
			that.refreshTopic();
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
