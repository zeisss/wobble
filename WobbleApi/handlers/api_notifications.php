<?php
/**
 * Returns the notifications for the current user. If no retries are available, it performs a busy
 * polling with a max try count of 20.
 * A notification is normally an object with a field 'type' which describes the notification further.
 * 
 * input = {'next_timestamp': int()}
 * 
 * result = {'next_timestamp': int(), 'messages': [Notification]}
 * Notification = Object?
 */
function get_notifications($params) {
  $session_id = session_id();
  $self_user_id = ctx_getuserid();
  $timestamp = @$params['next_timestamp'];

  ValidationService::validate_not_empty($self_user_id);

  session_write_close(); # we dont need to modify the session after here

  if (is_null($timestamp))
  {
    # NotificationRepository::deleteNotifications($session_id);
  } else {
    NotificationRepository::deleteNotifications($session_id, $timestamp);
  }

  // Check 10 times, but sleep after each check, if no notifications where found
  for ($i = 0; $i < 20 && !connection_aborted(); $i++) {
    $timestamp = time();
    $messages = NotificationRepository::getNotifications($session_id, $timestamp);
    if (count($messages) > 0) {
      return array(
        'next_timestamp' => $timestamp,
        'messages' => $messages
      );
    }
    usleep(250 * 1000); /* 250ms */
  }

  if (connection_aborted()) {
    Stats::incr('wobble_notification_connection_aborted');
  } else {
    # oot (out of time): reached the natural intended limit for this request
    Stats::incr('wobble_notification_oot');
  }

  return array(
    'next_timestamp' => time(),
    'messages' => array()
  );
}