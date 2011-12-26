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
	return TRUE;
}
function user_login($params) {
	$email = $params['email'];
	$password = $params['password'];
	
	ValidationService::validate_email($email);
	ValidationService::validate_not_empty($password);
	
	$password_hashed = SecurityService::hashPassword($password);
	$user = UserRepository::getUserByEmail($email);
	if ( $user != NULL && $password_hashed === $user['password_hashed']) {
		$_SESSION['userid'] = $user['id'];
		
		foreach(user_get_contacts() AS $contact) {
			NotificationRepository::push($contact['id'], array (
				'type' => 'user_online',
				'user_id' => $user['id'];
			));
		}
		return TRUE;
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
	
	$user_id = UserRepository::create($email, $password_hashed, $email);

	if ( defined('WELCOME_TOPIC_ID')) {
		TopicRepository::addReader(WELCOME_TOPIC_ID, $user_id);

		foreach(TopicRepository::getReaders($topic_id) as $user) {
			NotificationRepository::push($user['id'], array(
				'type' => 'topic_changed',
				'topic_id' => $topic_id
			));
		}
	}

	$_SESSION['userid'] = $user_id;
	return TRUE;
}

function user_change_name($params) {
	$self_user_id = ctx_getuserid();
	$name = $params['name'];
	ValidationService::validate_not_empty($name);
	
	UserRepository::updateName($self_user_id, $name);
	return TRUE;
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
	
	ValidationService::validate_not_empty($self_user_id);

	return ContactsRepository::getContacts($self_user_id);
}

function user_add_contact($params) {
	$self_user_id = ctx_getuserid();
	$contact_email = $params['contact_email'];
	
	ValidationService::validate_not_empty($self_user_id);
	ValidationService::validate_not_empty($contact_email);
	
	$user = UserRepository::getUserByEmail($contact_email);

	if ( $user !== NULL ) {
		ContactsRepository::addUser($self_user_id, $user['id']);
		return TRUE;
	}
	return FALSE;
}

function user_remove_contact($params) {
	$self_user_id = ctx_getuserid();
	$contact_id = $params['contact_id'];
	
	ValidationService::validate_not_empty($self_user_id);
	ValidationService::validate_not_empty($contact_id);
	
	ContactsRepository::removeUser($self_user_id, $contact_id);

	return TRUE;
}