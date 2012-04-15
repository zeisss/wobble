<?php
/**
 * Input = {}
 * Result = true 
 */
function user_signout($params) {
  $self_user_id = ctx_getuserid();

  SessionService::signoff(session_id()); # mark offline in database

  foreach(user_get_contacts() AS $user) {
    NotificationRepository::push($user['id'], array (
      'type' => 'user_signout',
      'user_id' => $self_user_id
    ));
  }

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

  $email = InputSanitizer::sanitizeEmail($email);

  $password_hashed = SecurityService::hashPassword($password);
  $user = UserRepository::getUserByEmail($email, true);
  if ($user != NULL && $password_hashed === $user['password_hashed']) {
    # Valid login given. We must start a session now (we dont want the cookie)

    session_start();

    $_SESSION['userid'] = $user['id'];

    SessionService::signon(session_id(), $user['id']);

    foreach(user_get_contacts() AS $contact) {
      NotificationRepository::push($contact['id'], array (
        'type' => 'user_online',
        'user_id' => $user['id']
      ));
    }
    return array(
      'apikey' => session_id()
    );
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
  if ($user != NULL) {
    throw new Exception('You are already registered!');
  }

  $user_id = UserRepository::create($email, $password_hashed, $email);


  # Now that the user is registered, we auto-login him in
  session_start();
  $_SESSION['userid'] = $user_id;

  # We skip the contact-notifications here, since the user shouldn't have any friends

  # Add the new user to the welcome topic, if defined
  if (defined('WELCOME_TOPIC_ID')) {
    foreach(TopicRepository::getReaders(WELCOME_TOPIC_ID) as $reader) {
      NotificationRepository::push($reader['id'], array(
        'type' => 'topic_changed',
        'topic_id' => WELCOME_TOPIC_ID
      ));

      TopicMessagesRepository::createMessage(WELCOME_TOPIC_ID, $reader['id'], array(
        'type' => 'user_added',
        'user_id' => $user_id,
        'user_name' => $email # current name of that user
      ));
    }

    TopicRepository::addReader(WELCOME_TOPIC_ID, $user_id);
  }

  return array(
    'apikey' => session_id()
  );
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
  $self_user_id = ctx_getuserid();
  if (empty ($self_user_id)) {
    return null;
  }
  $user = UserRepository::get($self_user_id);
  unset($user['password_hashed']);
  return $user;
  
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

  $contacts = ContactsRepository::getContacts($self_user_id);
  usort($contacts, function($a, $b) {
    if ($a['online'] == $b['online']) {
      return strcasecmp($a['name'], $b['name']);
    }
    else {
      if ($a['online'] == 1) {
        return -1;
      }
      else {
        return 1;
      }
    }
  });
  return $contacts;
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

  if ($user !== NULL) {
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