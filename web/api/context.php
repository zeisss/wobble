<?php
	require_once 'config.php';

	require_once dirname(__FILE__).'/classes/NotificationRepository.class.php';
	require_once dirname(__FILE__).'/classes/TopicRepository.class.php';
	require_once dirname(__FILE__).'/classes/UserRepository.class.php';
	require_once dirname(__FILE__).'/classes/ContactsRepository.class.php';
	require_once dirname(__FILE__).'/classes/SecurityService.class.php';
	require_once dirname(__FILE__).'/classes/ValidationService.class.php';


	function ctx_before_request($method, $params) {
		session_start();
		if ( !empty($_SESSION['userid'])) {
			UserRepository::touch($_SESSION['userid']);
		}
	}
	function ctx_after_request($method, $params, $result, $exception) {
	
	}
	
	global $PDO_CONTEXT_VAR;
	$PDO_CONTEXT_VAR = null;
	function ctx_getpdo() {
		global $PDO_CONTEXT_VAR;
		
		if ( $PDO_CONTEXT_VAR == null ) {
			$pdo = new PDO(PDO_URL, PDO_USER, PDO_PASSWORD);
			$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); # Raise exceptions, so they get logged by Airbrake
			$pdo->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, false);
			$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
			$PDO_CONTEXT_VAR = $pdo;
		}
		return $PDO_CONTEXT_VAR;
	}	
	
	function ctx_getuserid() {
		return isset($_SESSION['userid']) ? $_SESSION['userid'] : NULL;
	}
	
	
	
	
	