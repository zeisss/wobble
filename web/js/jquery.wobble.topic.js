"use strict";

// UI Functions
var userCache = {}; // id => {id, name, email, img}
function jQueryTopicView() {	// The UI handler for the single topic
	this.editingPostId = null;
	
	this.e = $('<div></div>').addClass('widget').attr('id', 'topic_wrapper').appendTo('#widgets');

	this.jTopicPosts = $('<div></div>').attr('id', 'topic_posts').appendTo(this.e);
	this.jTopicReaders = $('<div></div>').attr('id', 'topic_readers').appendTo(this.e);
	this.jTopicActions = $('<div></div>').attr('id', 'topic_actions').appendTo(this.e);
	
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
};

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

		this.jTopicReaders.empty();
		for (var i = 0; i<  topicDetails.writers.length; ++i) {
			var user = topicDetails.writers[i];
			userCache[user.id] = user;
		}
		for (var i = 0; i < topicDetails.readers.length; ++i) {
			var user = topicDetails.readers[i];
			userCache[user.id] = user; // Cache user object (user later to show the user post images)
			this._renderReader(user);
		}
		
		for (var i = 0; i < topicDetails.posts.length; i++) {
			this.renderPost(topicDetails, topicDetails.posts[i]);
		}
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

jQueryTopicView.prototype.renderPost = function(topic, post) {
	var elementPostId = 'post-' + post.id;
	var that = this;
	
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

	$(">.post", jPostWrapper).off('click').click(function() {
			// Add the nice green border to any clicked post
			$("#topic_wrapper .active").removeClass('active');
			$(this).addClass('active');

			that.onPostClicked(post);
		});
	
	if ( post.deleted != 1) {
		// Render children
		
		var ePostUsers = $(">.post>.users", jPostWrapper);
		this._renderPostUsers(post, ePostUsers);
		
		var ePostContent = $(">.post>.content", jPostWrapper);
		if (post.id != this.editingPostId ) { // Leave the content untouched, if the user is editing it
			ePostContent.html(post.content);
		}
		if ( post.unread == 1) {
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
	
	var minHeight = 16;
	if ( post.id != ROOT_ID) { // No user icons for the root
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
		if ( userCache[post.users[index]].id == API.user_id()) {
			return "Me";
		} else {
			return userCache[post.users[index]].name;
		}
	};
	var apiUserId = API.user_id();
	var authorLine = null;
	if ( post.users.length == 1 && (post.id != ROOT_ID || post.users[0] != apiUserId) /* no authorline for ourself */) {
		authorLine = name(0);
	} else if ( post.users.length == 2) {
		authorLine = name(0) + " and " + name(1);
	} else if ( post.users.length == 3) {
		authorLine = name(0) + ", " + name(1) + " and " + name(2);
	} else if ( post.users.length >= 4) {
		authorLine = name(0) + ", " + name(1) + " and " + (post.users.length-2) + " more";
	} else {
		// NO authorlines (also no icons) => No min height
		minHeight = null;
	}
	postElement.append($("<span class='names'></span>").text(authorLine));
	if (minHeight) postElement.css('min-height', minHeight);

};

jQueryTopicView.prototype.removePost = function(post) {	
	var jpost = $('#post-' + post.id + ">.post").detach();
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
		if ( event.shiftKey && event.which == 13) {
			// Focus the button, otherwise there is a rendering bug in chrome when removing the 
			// contenteditable from the div while it has focus (the editing border does not get removed, until you click somewhere)
			$(">.buttons>button", jpost).focus(); 
			that.closeEditor();
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
		$("<button><b>Done</b> <span style='font-size:small; color:gray'>[Shift+Enter]</span></button>").appendTo(jbuttons).click(function() {
			that.closeEditor();
		});
	} else {
		jbuttons.append($("<button>Edit</button>").click(function(event) {
			that.openEditor(post);			
		}));
		jbuttons.append($("<button>Reply</button>").click(function(event) {
			event.stopPropagation();
			event.preventDefault();
			event.stopImmediatePropagation();
			that.onReplyPost(post);
		}));
		if ( post.id != ROOT_ID ) { // You cannot delete the root
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
		$('<button class="icon boldicon"></button>').appendTo(this.jTopicActions).click(function() {
			document.execCommand('bold', false, null); // $(".editing")[0].execCommand(
		});
		$('<button class="icon italicicon"></button>').appendTo(this.jTopicActions).click(function() {
			document.execCommand('italic', false, null); // $(".editing")[0].execCommand(
		});
		$('<button class="icon underlineicon"></button>').appendTo(this.jTopicActions).click(function() {
			document.execCommand('underline', false, null); // $(".editing")[0].execCommand(
		});
		$('<button class="icon strikeicon" style="margin-right:10px; padding-right:12px; border-right:1px black solid"></button>').appendTo(this.jTopicActions).click(function() {
			document.execCommand('strikethrough', false, null); // $(".editing")[0].execCommand(
		});
		$('<button class="icon listicon"></button>').appendTo(this.jTopicActions).click(function() {
			document.execCommand('insertunorderedlist', false, null); // $(".editing")[0].execCommand(
		});
		$('<button class="icon imgicon">img</button>').appendTo(this.jTopicActions).click(function() {
			var url = window.prompt("URL?");
			if ( url != null ) {
				document.execCommand('insertimage', false, url); // $(".editing")[0].execCommand(
			}
		});
		$('<button class="icon urlicon"></button>').appendTo(this.jTopicActions).click(function() {
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
