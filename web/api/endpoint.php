<?php
	error_reporting(E_ALL);
	
	function die_result($id, $result = NULL) {
		the_result(array(
			'jsonrpc' => '2.0',
			'id' => $id,
			'result' => $result
		));
	}
	function die_error($id, $code, $message, $data = NULL) {
		$error = array (
			'code' => $code,
			'message' => $message
		);
		if ( $data != NULL ) {
			$error['data'] = $data;
		}
		the_result(array(
			'jsonrpc' => '2.0',
			'id' => $id, 
			'error' => $error
		));
	}
	function the_result($result_object) {
		header('Content-Type: application/json');
		die(json_encode($result_object));
	}
	
	require_once 'context.php';
	
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
	
	# DEV MODE: Sleep randomly 500ms - 1.500ms
	usleep(1000 * 500); // rand(100, 3000));
	
	session_start();
	$requestBody = file_get_contents('php://input');
	$request = json_decode($requestBody, TRUE);
	if ($request === NULL) {
		die_error(NULL, -32700, "Parse error");
	}
	if ( !isset ( $request['method']))  {
		die_error($request['id'], -32602, 'No method given.');
	}
	foreach($exportedMethods AS $export) {
		if ( $export['method'] === $request['method']) {
			ctx_before_request($request['method'], $request['params']);
			require_once($export['file']);
			try {
				$response = call_user_func($request['method'], $request['params']);
			} catch(Exception $e) {
				ctx_after_request($request['method'], $request['params'], null, $e);
				die_error($request['id'], -32603, $e->getMessage());
			}
			
			ctx_after_request($request['method'], $request['params'], $response, null);
			if (isset($request['id'])) 
				die_result($request['id'], $response);
			else
				die(); # die silently for a notification
		}
	}
	die_error(NULL, -32602, 'Unknown method: '. $request['method']);