"use strict";
/*
This file provides the EventBus window.BUS, and two classes: JSONRPC and the WobbleAPI .
*/

function log(s) {
	if ( console ) console.log(s);
}

/*
BUS.on('topic.selected', function(data, eventName) {
	// Your code here
});
BUS.fire('topic.selected');
BUS.fire('topic.selected', {topic_name: 'Hello World!'});
*/
window.BUS = {
	'listeners': {},
	'on': function (eventName, callback, context) {
		var context = context || window;
		var list = this.listeners[eventName] || [];
		list.push([context, callback]);
		this.listeners[eventName] = list;
	},
	'fire': function(eventName, data) {
		if ( console ) {
			console.log('Event fired', eventName, data);
		}
		if ( !(eventName in this.listeners)) {
			return; // Abort, if no listener exists
		}
		for (var i = 0; i < this.listeners[eventName].length; i++) {
			var callbackEntry = this.listeners[eventName][i];
			callbackEntry[1].apply(callbackEntry[0], [data, eventName]);
		}

	},

	'clear': function() {
		this.listeners = {};
	}
};
if ( window.addEventListener) {
	window.addEventListener('unload', function() {
		BUS.clear();
	});
}


// RPC Wrapper (JSON-RPC 2.0 - http://json-this.RPC.org/wiki/specification)
var JSONRPC = function(url) {
	this.url = url;
	this.idSequence = 1;
}
/**
 * Notifications are calls, where no response is expected/wished.
 */
JSONRPC.prototype.doNotification = function(name, args) {
	RPC._call(null, name, args, null);
};
/**
 * Normal RPC call.
 */
JSONRPC.prototype.doRPC = function(name, args, callback) {
	if ( arguments.length == 2 ) {
		callback = args;
		args = null;
	}
	var requestId = this.idSequence;
	this.idSequence++;
	
	this._call(requestId, name, args, callback);
};
JSONRPC.prototype._call = function(requestId, name, args, callback) {			
	var body = {
		jsonrpc: "2.0",
		method: name,
	};
	if (args) {
		body.params = args;
	}
	if (requestId) {
		body.id = requestId;
	}
	
	var ajaxSettings = {
		type:'POST',
		cache: false,
		data: JSON.stringify(body),
		dataType: "json",
		processData: false,
		headers: {
			'Content-Type': 'application/json; charset=utf-8'
		},
		success: function(data, textStatus, jqXHR) {					
			if ( data.error ) {
				BUS.fire('this.RPC.error', {
					request: body,
					error: data.error
				});
			}
			if (!callback) 
				return;
			if ( data.error ) {
				callback(data.error);
			} else {
				callback(undefined, data.result);
			}
		}
	};
	if ( callback ) {
		ajaxSettings.error = function(jqXHR, textStatus, errorThrown) {
			BUS.fire('this.RPC.connectionerror', {text: textStatus, error: errorThrown});
			callback(errorThrown);
		};
		
	}
	$.ajax(this.url, ajaxSettings);
};

// API Wrapper functions
var WobbleAPI = function(RPC) {
	if (!RPC) {
		throw new Error('RPC object is required for WobbleAPI object');
	}
	this.RPC = RPC;
	this._user = undefined;
	this.refreshUser();
};
WobbleAPI.prototype.refreshUser = function() {
	this.user_get($.proxy(function(err, user) {
		if ( !err && user) {
			this._user = user;
			BUS.fire('api.user', user);
		}
	}, this));
};

// Directly returning functions
/** Builds an ID by combining the user_id with the current time. */
WobbleAPI.prototype.generate_id = function() {
	var id = this.user_id() + "-" + (new Date().getTime());
	return id;
};
WobbleAPI.prototype.user_id = function() {
	return this._user ? this._user.id : null;
};
WobbleAPI.prototype.user = function() {
	return this._user;
},

// Async stuff
/* Core / Basic Stuff */
WobbleAPI.prototype.wobble_api_version = function(callback) {
	this.RPC.doRPC('wobble.api_version', callback);
};
WobbleAPI.prototype.systemListMethods = function(callback) {
	this.RPC.doRPC('system.listMethods', callback);	
};

/* Notifications */
WobbleAPI.prototype.get_notifications = function(timestamp, callback) {
	this.RPC.doRPC('get_notifications', {next_timestamp: timestamp}, callback);
};

/* REGISTER / LOGIN ----------------- */
WobbleAPI.prototype.register = function(email, password, callback) {
	this.RPC.doRPC('user_register', {'email': email, 'password': password}, callback);
};
WobbleAPI.prototype.login = function(email, password, callback) {
	this.RPC.doRPC('user_login', {'email': email, 'password': password}, callback);
};
WobbleAPI.prototype.signout = function(callback) {
	this.RPC.doRPC('user_signout', callback);
};
WobbleAPI.prototype.user_change_password = function(newPassword, callback) {
	this.RPC.doRPC('user_change_password', {password: newPassword}, callback);
};
WobbleAPI.prototype.user_change_name = function(newName, callback) {
	this.RPC.doRPC('user_change_name', {name: newName}, callback);
};
WobbleAPI.prototype.user_get = function(callback) {
	this.RPC.doRPC('user_get', callback);
};

/* TOPICS Functions ----------------- */
WobbleAPI.prototype.topics_create = function(id, callback) {
	this.RPC.doRPC('topics_create', {id: id}, callback);
};

WobbleAPI.prototype.load_topic_details = function(topicId, callback) {
	this.RPC.doRPC('topic_get_details', {id: topicId}, callback);
};

WobbleAPI.prototype.list_topics = function (callback) {
	this.RPC.doRPC('topics_list', callback);
};

/* CONTACTS Functions --------------- */
WobbleAPI.prototype.add_contact = function(email, callback) {
	this.RPC.doRPC('user_add_contact', {'contact_email': email}, callback);
};
WobbleAPI.prototype.get_contacts = function (callback) {
	this.RPC.doRPC('user_get_contacts', callback);
};
WobbleAPI.prototype.contact_remove = function(contact_id, callback) {
	this.RPC.doRPC('user_remove_contact', {contact_id: contact_id}, callback);
};

/* TOPIC Functions ------------------ */
WobbleAPI.prototype.topic_add_user = function(topicId, contactId, callback) {
	this.RPC.doRPC('topic_add_user', {topic_id: topicId, contact_id: contactId}, callback);
};
WobbleAPI.prototype.topic_remove_user = function(topicId, contactId, callback) {
	this.RPC.doRPC('topic_remove_user', {topic_id: topicId, contact_id: contactId}, callback);
};

WobbleAPI.prototype.post_change_read = function(topicId, postId, readStatus, callback) {
	this.RPC.doRPC('post_read', {topic_id: topicId, post_id: postId, read: readStatus}, callback);	
};
WobbleAPI.prototype.post_create = function(topicId, postId, parentPostId, callback) {
	this.RPC.doRPC('post_create', {topic_id: topicId, post_id: postId, parent_post_id: parentPostId}, callback);
};
WobbleAPI.prototype.post_edit = function(topicId, postId, content, revision_no, callback) {
	this.RPC.doRPC('post_edit', {topic_id: topicId, post_id: postId, revision_no: revision_no, content: content}, callback);
};
WobbleAPI.prototype.post_delete = function(topicId, postId, callback) {
	this.RPC.doRPC('post_delete', {topic_id: topicId, post_id: postId}, callback);
};



