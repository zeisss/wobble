<?php

class WobbleJsonRpcServer extends HttpJsonRpcServer {
  public function __construct() {
    parent::__construct();

    $this->addFunctions(array (
      // Core
      array('file' => 'api_core.php', 'method' => 'wobble_api_version', 'name' => 'wobble.api_version'),

      // User / Session
      array('file' => 'api_user.php', 'method' => 'user_register'),
      array('file' => 'api_user.php', 'method' => 'user_get'),
      array('file' => 'api_user.php', 'method' => 'user_get_id'),
      array('file' => 'api_user.php', 'method' => 'user_change_name'),
      array('file' => 'api_user.php', 'method' => 'user_change_password'),
      array('file' => 'api_user.php', 'method' => 'user_login'),
      array('file' => 'api_user.php', 'method' => 'user_signout'),

      // Topics
      array('file' => 'api_topiclist.php', 'method' => 'topics_list'),
      array('file' => 'api_topiclist.php', 'method' => 'topics_search'),
      array('file' => 'api_topiclist.php', 'method' => 'topics_create'),

      // Topic
      array('file' => 'api_topic.php', 'method' => 'topic_get_details'),
      array('file' => 'api_topic.php', 'method' => 'topic_add_user'),
      array('file' => 'api_topic.php', 'method' => 'topic_remove_user'),
      array('file' => 'api_topic.php', 'method' => 'topic_set_archived'),
      array('file' => 'api_topic.php', 'method' => 'topic_remove_message'),
      array('file' => 'api_topic.php', 'method' => 'topic_change_read'),

      array('file' => 'api_topic.php', 'method' => 'post_create'),
      array('file' => 'api_topic.php', 'method' => 'post_edit'),
      array('file' => 'api_topic.php', 'method' => 'post_delete'),
      array('file' => 'api_topic.php', 'method' => 'post_change_read'),
      array('file' => 'api_topic.php', 'method' => 'post_change_lock'),

      
      // Notifications
      array('file' => 'api_notifications.php', 'method' => 'get_notifications'),

      // Contact list (api_contacts.php)
      array('file' => 'api_contacts.php', 'method' => 'user_get_contacts', 'name' => 'contacts.list'),
      array('file' => 'api_contacts.php', 'method' => 'user_add_contact', 'name' => 'contacts.add'),  
      array('file' => 'api_contacts.php', 'method' => 'user_remove_contact', 'name' => 'contacts.remove'),


      // DEPRECATED
      array('file' => 'api_contacts.php', 'method' => 'user_get_contacts'),  // deprecated
      array('file' => 'api_contacts.php', 'method' => 'user_add_contact'),   // deprecated
      array('file' => 'api_contacts.php', 'method' => 'user_remove_contact'), // deprecated
      array('file' => 'api_topic.php', 'method' => 'post_change_read', 'name' => 'post_read')
    ));
  }

  /**
   *
   */
  public function handleHttpRequest() {
    $startRequest = microtime(true);
    parent::handleHttpRequest();
    $endRequest = microtime(true);

    $h = Stats::histogramWithLabels(
      'http_request_duration_microseconds',
      [25000, 50000, 100000, 250000, 500000, 1000000, 2500000, 5000000]
    );

    $h->observe(floor(($endRequest - $startRequest) * 1000 * 1000));

    Stats::incr('http_request_duration_microseconds_count');
    Stats::incr('http_request_duration_microseconds_sum', floor(($endRequest - $startRequest) * 1000 * 1000));
  }

  /**
   * Performs a session validation.
   */
  public function beforeCall($method, $params) {
    self::beforeCallInitSession($method, $params);
    self::beforeCallStats($method, $params);
  }

  protected function beforeCallInitSession($method, $params) {
    session_name('WOBBLEID');
    if (empty($params['apikey'])) {
      return;
    }
    session_id($params['apikey']);
    session_set_cookie_params(60 * 60 * 24 * 31); # tell php to keep this session alive 1 month
    session_start(); # Try to find a PHP Session

    if (empty($_SESSION['userid'])) {
      # User was so long offline, that the server php-session was destroy
      # We can rebuild it. We have the technology!
      $session = SessionService::getSession(session_id());

      if (empty($session)) {
        # Ok, the given sessionkey is really bogus / outdated. Just ignore it.
        return;
      }
      $_SESSION['userid'] = $session['user_id'];
    } else {
      $session = SessionService::getSession(session_id());
    }

    // Load the current user and check if he was marked offline
    $userid = $_SESSION['userid'];
    $user = UserRepository::get($userid);
    if (empty($user)) {
      return;
    }

    if (!$user['online']) {
      # Ok, we were offline, so notify everybody that we are back
      foreach(ContactsRepository::getContacts($userid) AS $contact) {
        NotificationRepository::push($contact['id'], array (
          'type' => 'user_online',
          'user_id' => $userid
        ));
      }
    }

    if ($session['timeout'] === '1') {
      SessionService::signon(session_id(), $userid);

      NotificationRepository::deleteNotifications(session_id(), time());

      # Notify the client, that he needs to reload his data, since we cleared the notifications
      NotificationRepository::pushSession(
        session_id(),
        array('type' => 'notifications_timeout')
      );
    }
    SessionService::touch(session_id(), $userid);
  }

  protected function beforeCallStats($method, $params) {
    Stats::incr('jsonrpc_api_calls{handler="' . $method . '"}');
  }

  public function afterCall($method, $params, $result, $error) {
    if (!is_null($error)) {
      Stats::incr('jsonrpc_api_errors{handler="' . $method . '"}');
    }
  }
}
