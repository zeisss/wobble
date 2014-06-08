<?php

/**
 * contact = user()
 */


/**
 * Returns all contacts for the currently logged in user.
 *
 * Input = {}
 * Result = [contact()]
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