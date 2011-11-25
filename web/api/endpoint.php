<?php
	function die_result($id, $result = NULL) {
		the_result(array(
			'jsonrpc' => '2.0',
			'id' => $id,
			'result' => $result
		));
	}
	function die_error($id, $code, $message, $data = NULL) {
		the_result(array(
			'jsonrpc' => '2.0',
			'id' => $id, 
			'error' => array (
				'code' => $code,
				'message' => $message,
				'data' => $data
			)
		));
	}
	function the_result($result_object) {
		die(json_encode($result_object));
	}
	
	require_once 'context.php';
	
	global $USERS;
	$USERS = array (
		'1' => array('userid' => '1', 'name' => 'ZeissS', 'img' => 'http://0.gravatar.com/avatar/6b24e6790cb03535ea082d8d73d0a235'),
		'2' => array('userid' => '2', 'name' => 'Calaelen', 'img' => 'http://1.gravatar.com/avatar/5d669243ec0bd7524d50cf4bb5bf28d8'),
	);
	
	$exportedMethods = array (
		array('file' => 'fun_topics.php', 'method' => 'topics_list'),
		array('file' => 'fun_topics.php', 'method' => 'topics_create'),
		
		array('file' => 'fun_topic.php', 'method' => 'topic_get_details'),
		
		array('file' => 'fun_user.php', 'method' => 'user_get'),
		array('file' => 'fun_user.php', 'method' => 'user_get_id'),
		
		array('file' => 'fun_test.php', 'method' => 'testecho')
	);
	
	# DEV MODE: Sleep randomly 500ms - 1.500ms
	usleep(1000 * rand(100, 3000));
	
	
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
			require_once($export['file']);
			try {
				$response = call_user_func($request['method'], $request['params']);
			}catch(Exception $e) {
				die_error($request['id'], -32603, $e);
			}
			
			if (isset($request['id'])) 
				die_result($request['id'], $response);
			else
				die(); # die silently for a notification
		}
	}
	die_error(NULL, -32602, 'Unknown method: '. $request['method']);
