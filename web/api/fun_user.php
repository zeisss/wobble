<?php	
	
	function get_notifications($params) {
		session_write_close(); # we dont need to modify the session after here
		
		$timestamp = $params['next_timestamp'];
		
		// Check 10 times, but sleep after each check, if no notifications where found
		for ( $i = 0; $i < 100; $i++ ) {
			$messages = NotificationRepository::getNotifications(user_get_id(), $timestamp);
			if ( count($messages) > 0 ) {
				return array(
					'next_timestamp' => time(),
					'messages' => $messages
				);
			}
			usleep(100 * 1000); /* 100ms */
		}
		return NULL;
	}
	
	function user_signout($params) {
		$_SESSION['userid'] = null;
	}
	function user_login($params) {
		$email = $params['email'];
		$password = $params['password'];
		
		ValidationService::validate_email($email);
		ValidationService::validate_not_empty($password);
		
		$password_hashed = SecurityService::hashPassword($password);
		$user = UserRepository::getUserByEmail($email);
		if ( $user != NULL /* && $password_hashed === $user['password_hashed']*/) {
			$_SESSION['userid'] = $user['id'];
		} else {
			throw new Exception('Illegal email or password!');
		}
	}
	
	function user_register($params) {
		$email = $params['email'];
		$password = $params['password'];
		$password_hashed = SecurityService::hashPassword($password);
		
		ValidationService::validate_email($email);
		ValidationService::validate_not_empty($password);
		
		$user = UserRepository::getUserByEmail($email);
		if ( $user != NULL ) {
			throw new Exception('You are already registered!');
		}
		
		$_SESSION['userid'] = UserRepository::create($email, $password_hashed, $email);
	}
	
	function user_change_name($params) {
		$self_user_id = user_get_id();
		$name = $params['name'];
		ValidationService::validate_not_empty($name);
		
		UserRepository::updateName($self_user_id, $name);
	}	
	
	function user_get() {
		$pdo = ctx_getpdo();
		$self_user_id = user_get_id();
		if ( empty ($self_user_id)) {
			return null;
		}
		return UserRepository::get($self_user_id);
		
	}
	function user_get_id() {
		return $_SESSION['userid'];
	}
	
	function user_get_contacts() {
		$self_user_id = user_get_id();
		
		$pdo = ctx_getpdo();
		$stmt = $pdo->prepare('SELECT u.id id, u.name name, u.email email, md5(trim(u.email)) img FROM users u, users_contacts c WHERE u.id = c.contact_user_id AND c.user_id = ?');
		$stmt->execute(array($self_user_id));
		return $stmt->fetchAll();
	}
	
	function user_add_contact($params) {
		$self_user_id = user_get_id();
		$contact_email = $params['contact_email'];
		
		if ( empty($contact_email)) {
			throw new Exception('No contact email given!');
		}
		
		$pdo = ctx_getpdo();
		
		$stmt = $pdo->prepare('SELECT DISTINCT u.id id FROM users u WHERE email = ?');
		$stmt->execute(array($contact_email));
		$result = $stmt->fetchALL();
		
		if ( count($result) == 1 ) {
			$stmt = $pdo->prepare('INSERT INTO users_contacts (user_id, contact_user_id) VALUES (?, ?)');
			$stmt->execute(array($self_user_id, $result[0]['id']));
			return TRUE;
		}
		return FALSE;
	}
	
	function user_remove_contact($params) {
		$self_user_id = user_get_id();
		$contact_email = $params['contact_id'];
		
		if ( empty($contact_id)) {
			throw new Exception('No contact id given!');
		}
		
		$pdo = ctx_getpdo();
		
		$stmt = $pdo->prepare('DELETE FROM users_contacts WHERE user_id = ? AND contact_user_id = ?');
		$stmt->execute(array($self_user_id, $contact_email));
		return TRUE;
	}