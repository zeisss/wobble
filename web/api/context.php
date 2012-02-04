<?php
	ini_set('session.use_cookies', '0');
	
	require_once 'config.php';

	# TODO: Replace with __autoload()
	require_once dirname(__FILE__).'/classes/NotificationRepository.class.php';
	require_once dirname(__FILE__).'/classes/TopicRepository.class.php';
	require_once dirname(__FILE__).'/classes/UserRepository.class.php';
	require_once dirname(__FILE__).'/classes/ContactsRepository.class.php';
	require_once dirname(__FILE__).'/classes/SecurityService.class.php';
	require_once dirname(__FILE__).'/classes/SessionService.class.php';
	require_once dirname(__FILE__).'/classes/ValidationService.class.php';

	jsonrpc_export_functions(array (
		// Core
		array('file' => 'api_core.php', 'method' => 'wobble_api_version', 'name'=>'wobble.api_version'),
		
		// Topics
		array('file' => 'api_topiclist.php', 'method' => 'topics_list'),
		array('file' => 'api_topiclist.php', 'method' => 'topics_create'),
		
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
		array('file' => 'api_user.php', 'method' => 'user_change_password'),		
		array('file' => 'api_user.php', 'method' => 'user_login'),
		array('file' => 'api_user.php', 'method' => 'user_signout'),
		
		// Notifications
		array('file' => 'api_notifications.php', 'method' => 'get_notifications'),
		
		// Contact list
		array('file' => 'api_user.php', 'method' => 'user_get_contacts'),
		array('file' => 'api_user.php', 'method' => 'user_add_contact'),
		array('file' => 'api_user.php', 'method' => 'user_remove_contact')
		
	));

	function ctx_before_request($method, $params) {
		session_name('WOBBLEID');
		if (isset($params['apikey'])) {
			session_id($params['apikey']);
			session_set_cookie_params(60 * 60 * 24 * 31); # tell php to keep this session alive 1 month
			session_start();
		}
		
		if ( !empty($_SESSION['userid'])) {
			SessionService::touch(session_id(), $_SESSION['userid']);
		}
	}
	jsonrpc_export_before('ctx_before_request'); # TODO: Replace this with a closure?

	function ctx_after_request($method, $params, $result, $exception) {
	
	}
	jsonrpc_export_after('ctx_after_request');
	



	###
	# Helper Functions
	#
	#
	global $PDO_CONTEXT_VAR;
	$PDO_CONTEXT_VAR = null;
	function ctx_getpdo() {
		global $PDO_CONTEXT_VAR;
		
		if ( $PDO_CONTEXT_VAR == null ) {
			$pdo = new PDO(PDO_URL, PDO_USER, PDO_PASSWORD, 
				array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES \'UTF8\''));
			$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); # Raise exceptions, so they get logged by Airbrake, or whatever
			$pdo->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, false);
			$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
			$PDO_CONTEXT_VAR = $pdo;
		}
		return $PDO_CONTEXT_VAR;
	}	
	
	function ctx_getuserid() {
		return isset($_SESSION['userid']) ? $_SESSION['userid'] : NULL;
	}
	