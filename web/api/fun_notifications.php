<?php
	function get_notifications($params) {
		session_write_close(); # we dont need to modify the session after here
		
		$timestamp = $params['next_timestamp'];
		
		// Check 10 times, but sleep after each check, if no notifications where found
		for ( $i = 0; $i < 100; $i++ ) {
			$messages = NotificationRepository::getNotifications(ctx_getuserid(), $timestamp);
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