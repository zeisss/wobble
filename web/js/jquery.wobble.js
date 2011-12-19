(function($) {
	"use strict";
	/*
	This file provides the EventBus window.BUS and the Wobble API window.API.
	
	There is also a RPC object for json-rpc 2.0 calls. It is used by the API object.
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
	$(window).unload(function() {
		BUS.clear();
	});
	
	
	// RPC Wrapper (JSON-RPC 2.0 - http://json-rpc.org/wiki/specification)
	window.RPC = {
		idSequence: 1,
		
		/**
		 * Notifications are calls, where no response is expected/wished.
		 */
		doNotification: function(name, args) {
			RPC._call(null, name, args, null);
		},
		/**
		 * Normal RPC call.
		 */
		doRPC: function(name, args, callback) {
			if ( arguments.length == 2 ) {
				callback = args;
				args = null;
			}
			var requestId = this.idSequence;
			this.idSequence++;
			
			RPC._call(requestId, name, args, callback);
		},
		_call: function(requestId, name, args, callback) {			
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
						BUS.fire('rpc.error', {
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
					BUS.fire('rpc.connectionerror', {text: textStatus, error: errorThrown});
					callback(errorThrown);
				};
				
			}
			$.ajax('api/endpoint.php', ajaxSettings);
		}
	};
	
	// API Wrapper functions
	window.API = {
		_user: undefined,
		
		// Directly returning functions
		/** Builds an ID by combining the user_id with the current time. */
		generate_id: function() {
			var id = API.user_id() + "-" + (new Date().getTime());
			return id;
		},
		user_id: function() {
			return this._user ? this._user.id : null;
		},
		user:function() {
			return this._user;
		},
		
		/** Loads initial data */
		init: function() {
			this.user_get(function(err, user) {
				if ( !err && user) {
					API._user = user;
					BUS.fire('api.user', user);
				}
			});
		},
		
		// Async stuff
		/* Core / Basic Stuff */
		wobble_api_version: function(callback) {
			RPC.doRPC('wobble_api_version', callback);
		},
		systemListMethods: function(callback) {
			RPC.doRPC('system.listMethods', callback);	
		},

		/* Notifications */
		get_notifications: function(timestamp, callback) {
			RPC.doRPC('get_notifications', {next_timestamp: timestamp}, callback);
		},
		
		/* REGISTER / LOGIN ----------------- */
		register: function(email, password, callback) {
			RPC.doRPC('user_register', {'email': email, 'password': password}, callback);
		},
		login: function(email, password, callback) {
			RPC.doRPC('user_login', {'email': email, 'password': password}, callback);
		},
		signout: function(callback) {
			RPC.doRPC('user_signout', callback);
		},
		
		user_change_name: function(newName, callback) {
			RPC.doRPC('user_change_name', {name: newName}, callback);
		},
		user_get: function(callback) {
			RPC.doRPC('user_get', callback);
		},
		
		/* TOPICS Functions ----------------- */
		topics_create: function(id, callback) {
			RPC.doRPC('topics_create', {id: id}, callback);
		},
	
		load_topic_details: function(topicId, callback) {
			RPC.doRPC('topic_get_details', {id: topicId}, callback);
		},
		
		list_topics: function (callback) {
			RPC.doRPC('topics_list', callback);
		},
		
		/* CONTACTS Functions --------------- */
		
		add_contact: function(email, callback) {
			RPC.doRPC('user_add_contact', {'contact_email': email}, callback);
		},
		get_contacts: function (callback) {
			RPC.doRPC('user_get_contacts', callback);
		},
		contact_remove: function(contact_id, callback) {
			RPC.doRPC('user_remove_contact', {contact_id: contact_id}, callback);
		},
		
		/* TOPIC Functions ------------------ */
		topic_add_user: function(topicId, contactId, callback) {
			RPC.doRPC('topic_add_user', {topic_id: topicId, contact_id: contactId}, callback);
		},
		topic_remove_user: function(topicId, contactId, callback) {
			RPC.doRPC('topic_remove_user', {topic_id: topicId, contact_id: contactId}, callback);
		},
		
		post_change_read: function(topicId, postId, readStatus, callback) {
			RPC.doRPC('post_read', {topic_id: topicId, post_id: postId, read: readStatus}, callback);	
		},
		post_create: function(topicId, postId, parentPostId, callback) {
			RPC.doRPC('post_create', {topic_id: topicId, post_id: postId, parent_post_id: parentPostId}, callback);
		},
		post_edit: function(topicId, postId, content, revision_no, callback) {
			RPC.doRPC('post_edit', {topic_id: topicId, post_id: postId, revision_no: revision_no, content: content}, callback);
		},
		post_delete: function(topicId, postId, callback) {
			RPC.doRPC('post_delete', {topic_id: topicId, post_id: postId}, callback);
		}
	};
	
	
	
	$(document).ready(function() {
		function get_size() {
			return {w: $(window).width(), h: $(window).height()};
		};
		var old_size = get_size();
		BUS.fire('window.resize', {before: old_size, 'to': old_size});
		$(window).resize(function() {
			var new_size = get_size();
			BUS.fire('window.resize', {
				'before': old_size,
				'to':  new_size
			});
			old_size = new_size;
		});
	});
	
})(jQuery);



