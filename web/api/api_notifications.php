<?php
/**
 * Returns the notifications for the current user. If no notifications are available, this wait up to 10secs.
 * A notification is normally an object with a field 'type' which describes the notification further.
 * 
 * input = {'next_timestamp': int()}
 * 
 * result = {'next_timestamp': int(), 'messages': [Notification]}
 * Notification = Object?
 */
function get_notifications($params) {
	session_write_close(); # we dont need to modify the session after here
	
	$self_user_id = ctx_getuserid();
	$timestamp = $params['next_timestamp'];

	if ( $timestamp != NULL )
	{
		NotificationRepository::deleteNotifications($self_user_id, $timestamp);
	}
	
	// Check 10 times, but sleep after each check, if no notifications where found
	for ( $i = 0; $i < 100; $i++ ) {
		$timestamp = time();
		$messages = NotificationRepository::getNotifications(ctx_getuserid(), $timestamp);
		if ( count($messages) > 0 ) {
			return array(
				'next_timestamp' => $timestamp,
				'messages' => $messages
			);
		}
		usleep(100 * 1000); /* 100ms */
	}
	return NULL;
}