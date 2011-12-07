<?php	
	function user_signout($params) {
		$self_user_id = ctx_getuserid();
		
		UserRepository::touch($self_user_id, NULL); # mark offline in database
		
		
		foreach(user_get_contacts() AS $user) {
			NotificationRepository::push($user['id'], array (
				'type' => 'user_signout',
				'user_id' => $self_user_id
			));
		}
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
			
			foreach(user_get_contacts() AS $contact) {
				NotificationRepository::push($contact['id'], array (
					'type' => 'user_online',
					'user_id' => $self_user_id
				));
			}
			
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
		$self_user_id = ctx_getuserid();
		$name = $params['name'];
		ValidationService::validate_not_empty($name);
		
		UserRepository::updateName($self_user_id, $name);
	}	
	
	function user_get() {
		$pdo = ctx_getpdo();
		$self_user_id = ctx_getuserid();
		if ( empty ($self_user_id)) {
			return null;
		}
		return UserRepository::get($self_user_id);
		
	}
	function user_get_id() {
		return ctx_getuserid();
	}
	
	function user_get_contacts() {
		$self_user_id = ctx_getuserid();
		
		return ContactsRepository::getContacts($self_user_id);
	}
	
	function user_add_contact($params) {
		$self_user_id = ctx_getuserid();
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
		$self_user_id = ctx_getuserid();
		$contact_email = $params['contact_id'];
		
		if ( empty($contact_id)) {
			throw new Exception('No contact id given!');
		}
		
		$pdo = ctx_getpdo();
		
		$stmt = $pdo->prepare('DELETE FROM users_contacts WHERE user_id = ? AND contact_user_id = ?');
		$stmt->execute(array($self_user_id, $contact_email));
		return TRUE;
	}