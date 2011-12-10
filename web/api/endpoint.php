<?php
	require_once 'config.php';
	##############################################################
	## Endpoint for JSON-RPC 2.0 Calls. 
	##############################################################
	$exportedMethods = array (
		// Topics
		array('file' => 'api_topics.php', 'method' => 'topics_list'),
		array('file' => 'api_topics.php', 'method' => 'topics_create'),
		
		// Topic
		array('file' => 'api_topic.php', 'method' => 'topic_get_details'),
		array('file' => 'api_topic.php', 'method' => 'topic_add_user'),
		array('file' => 'api_topic.php', 'method' => 'topic_remove_user'),
		array('file' => 'api_topic.php', 'method' => 'post_create'),
		array('file' => 'api_topic.php', 'method' => 'post_edit'),
		array('file' => 'api_topic.php', 'method' => 'post_delete'),
		array('file' => 'api_topic.php', 'method' => 'post_read'),
		
		// User / Session
		array('file' => 'api_user.php', 'method' => 'user_get'),
		array('file' => 'api_user.php', 'method' => 'user_get_id'),
		array('file' => 'api_user.php', 'method' => 'user_register'),
		array('file' => 'api_user.php', 'method' => 'user_change_name'),
		array('file' => 'api_user.php', 'method' => 'user_login'),
		array('file' => 'api_user.php', 'method' => 'user_signout'),
		
		// Notifications
		array('file' => 'api_notifications.php', 'method' => 'get_notifications'),
		
		// Contact list
		array('file' => 'api_user.php', 'method' => 'user_get_contacts'),
		array('file' => 'api_user.php', 'method' => 'user_add_contact'),
		array('file' => 'api_user.php', 'method' => 'user_remove_contact'),
		
		// Test functions
		array('file' => 'api_test.php', 'method' => 'testecho')
	);
	
	if (SIMULATE_LAG) {
		// Decrease the performance
		usleep(1000 * rand(100, 3000));
	}
	
	$requestBody = file_get_contents('php://input');
	$request = json_decode($requestBody, TRUE);

	if ($request === NULL) {
		return die_json(jsonrpc_error(-32700, "Parse error"));
	}

	if ( $requestBody[0] == '[') { # If the first char was a [, this is a batch request
		die_json(handle_jsonrpc_batch($request));
	} else {
		die_json(handle_jsonrpc_request($request));
	}
	


	function jsonrpc_result($result, $id = FALSE) {
		$result = array(
			'jsonrpc' => '2.0',
			'result' => $result
		);
		if ( $id ) {
			$result['id'] = $id;
		}
		return $result;
	}
	function jsonrpc_error($code, $message, $id = FALSE) {
		$result =  array(
			'jsonrpc' => '2.0',
			'error' => array (
				'code' => $code,
				'message' => $message
			)
		);
		if ($id) { 
			$result['id'] = $id; 
		}
		return $result;
	}
	function handle_jsonrpc_batch($requests) {
		$result = array();

		foreach ($requests as $subrequest) {
			$subresult = handle_jsonrpc_request($subrequest);
			if ( $subresult !== NULL ) {
				$result[] = $subresult;
			}
		}

		return $result;
	}
	function handle_jsonrpc_request($request) {
		global $exportedMethods;

		if ($request === NULL || !is_array($request)) {
			return jsonrpc_error(-32600, "Invalid request");
		}
		if ( !isset ( $request['method']))  {
			return jsonrpc_error(-32602, 'No method given.', $request['id']);
		}
		if (!isset($request['params'])) {
			$request['params'] = array();
		}
		
		# Iterate over all given methods
		foreach($exportedMethods AS $export) {
			if ( $export['method'] === $request['method']) {
				
				try {
					require_once 'context.php'; # introduces session setup, db connection, utility classes, ...
					ctx_before_request($request['method'], $request['params']);
					
					require_once($export['file']);
					$response = call_user_func($request['method'], $request['params']);
					
					ctx_after_request($request['method'], $request['params'], $response, null);
				} catch(Exception $e) {
					ctx_after_request($request['method'], $request['params'], null, $e);
					return jsonrpc_error(-32603, $e->getMessage(), $request['id']);
				}
				
				
				if (isset($request['id'])) {
					return jsonrpc_result($response, $request['id']);
				} else {
					return NULL; # only return a result for requests with an id (no id => notification)
				}
			}
		}
		return jsonrpc_error(-32602, 'Unknown method: '. $request['method'], $request['id']);
	}

	function die_json($result_object) {
		header('Content-Type: application/json');
		die(json_encode($result_object));
	}
