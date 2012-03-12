<?php

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
  array('file' => 'api_topic.php', 'method' => 'topic_set_archived'),
  array('file' => 'api_topic.php', 'method' => 'topic_remove_message'),   
  array('file' => 'api_topic.php', 'method' => 'post_create'),
  array('file' => 'api_topic.php', 'method' => 'post_edit'),
  array('file' => 'api_topic.php', 'method' => 'post_delete'),
  array('file' => 'api_topic.php', 'method' => 'post_change_read'),
  array('file' => 'api_topic.php', 'method' => 'post_change_lock'),
  array('file' => 'api_topic.php', 'method' => 'post_change_read', 'name' => 'post_read'),

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
  if (empty($params['apikey'])) {
    return;
  }

  session_id($params['apikey']);
  session_set_cookie_params(60 * 60 * 24 * 31); # tell php to keep this session alive 1 month
  session_start();

  if (empty($_SESSION['userid'])) {
    # User was so long offline, that the server php-session was destroy
    # We still have it in the DB
    $session = SessionService::getSession(session_id());

    if (empty($session)) {
      return;
    }
    $_SESSION['userid'] = $session['user_id'];
  }

  // Load the current user and check if he was marked offline
  $userid = $_SESSION['userid'];
  $user = UserRepository::get($userid);
  if (empty($user)) {
    return;
  }
  if (!$user['online']) {
     SessionService::signon(session_id(), $userid);
     NotificationRepository::deleteNotifications(session_id(), time());

     // Ok, we were offline, so notify everybody that we are back
     foreach(ContactsRepository::getContacts($userid) AS $contact) {
       NotificationRepository::push($contact['id'], array (
            'type' => 'user_online',
            'user_id' => $userid
       ));
    }
  }
  SessionService::touch(session_id(), $userid);
}
jsonrpc_export_before('ctx_before_request'); # TODO: Replace this with a closure?

function ctx_after_request($method, $params, $result, $exception) {
}
jsonrpc_export_after('ctx_after_request');
