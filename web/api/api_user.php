<?php
/**
 * Input = {}
 * Result = true 
 */
function user_signout($params) {
	$self_user_id = ctx_getuserid();
	
	SessionService::signoff(session_id()); # mark offline in database
	
	$_SESSION['userid'] = null;
	session_destroy();
	return TRUE;
}

/**
 * Input = {'email': Email, 'password': Password}
 * Email = Password = string()
 * Result = true
 */
function user_login($params) {
	$email = $params['email'];
	$password = $params['password'];
	
	ValidationService::validate_email($email);
	ValidationService::validate_not_empty($password);
	
	$password_hashed = SecurityService::hashPassword($password);
	$user = UserRepository::getUserByEmail($email);
	if ( $user != NULL && $password_hashed === $user['password_hashed']) {
		$_SESSION['userid'] = $user['id'];
		
		SessionService::signon(session_id(), $user['id']);

		foreach(user_get_contacts() AS $contact) {
			NotificationRepository::push($contact['id'], array (
				'type' => 'user_online',
				'user_id' => $user['id']
			));
		}
		return TRUE;
	} else {
		throw new Exception('Illegal email or password!');
	}
}

/**
 * Input = {'email': Email, 'password': Password}
 * Email = Password = string()
 * Result = true
 */
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
	$_SESSION['userid'] = $user_id;

	# We skip the contact-notifications here, since the user shouldn't have any friends

	# ADd the new user to the welcome topic, if defined
	if ( defined('WELCOME_TOPIC_ID')) {
		TopicRepository::addReader(WELCOME_TOPIC_ID, $user_id);

		foreach(TopicRepository::getReaders($topic_id) as $user) {
			NotificationRepository::push($user['id'], array(
				'type' => 'topic_changed',
				'topic_id' => $topic_id
			));
		}
	}

	
	return TRUE;
}

/**
 * Input = {'name': Username}
 * Username = string()
 * Result = true
 */
function user_change_name($params) {
	$self_user_id = ctx_getuserid();
	$name = $params['name'];
	ValidationService::validate_not_empty($name);
	
	UserRepository::updateName($self_user_id, $name);
	return TRUE;
}	

/**
 * Input = {'password': string()}
 * Result = true
 */
function user_change_password($params) {
    $self_user_id = ctx_getuserid();
    $password = $params['password'];
    
    ValidationService::validate_not_empty($self_user_id);
    ValidationService::validate_not_empty($password);
    
    $hashed = SecurityService::hashPassword($password);
    UserRepository::updatePassword($self_user_id, $hashed);
    return TRUE;
}

/**
 * Input = {'id': UserId, 'email': Email, 'img': GravatarEmailHash, 'name': Username, 'online': 1|0}
 * Username = Email = GravatarEmailHash = string()
 * Result = true
 */
function user_get() {
	$pdo = ctx_getpdo();
	$self_user_id = ctx_getuserid();
	if ( empty ($self_user_id)) {
		return null;
	}
	return UserRepository::get($self_user_id);
	
}
/**
 * Returns the id of the currently logged in user.
 *
 * Input = {}
 * Result = int()
 */
function user_get_id() {
	return ctx_getuserid();
}

/**
 * Returns all contacts for the currently logged in user.
 *
 * Input = {}
 * Result = [Contact]
 * Contact = {...?...} id, name, email, img, online
 */
function user_get_contacts() {
	$self_user_id = ctx_getuserid();
	
	ValidationService::validate_not_empty($self_user_id);

	return ContactsRepository::getContacts($self_user_id);
}

/**
 * Input = {'contact_email': Email}
 * Email = string()
 *
 * Result = true|false
 */
function user_add_contact($params) {
	$self_user_id = ctx_getuserid();
	$contact_email = $params['contact_email'];
	
	ValidationService::validate_not_empty($self_user_id);
	ValidationService::validate_email($contact_email);
	
	$user = UserRepository::getUserByEmail($contact_email);

	if ( $user !== NULL ) {
		if ($user['id'] == $self_user_id) {
			return FALSE;
		}
		ContactsRepository::addUser($self_user_id, $user['id']);
		return TRUE;
	}
	return FALSE;
}

/**
 * Removes the user with the given ID from the currently logged in user.
 *
 * Input = {'contact_id': UserId}
 * Result = true
 */
function user_remove_contact($params) {
	$self_user_id = ctx_getuserid();
	$contact_id = $params['contact_id'];
	
	ValidationService::validate_not_empty($self_user_id);
	ValidationService::validate_not_empty($contact_id);
	
	ContactsRepository::removeUser($self_user_id, $contact_id);

	return TRUE;
}