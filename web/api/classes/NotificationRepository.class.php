<?php
/**
 * The NotificationRepository provides a way to store events for a session/user. 
 */
class NotificationRepository {
	function push($user_id, $message) {
		$json = json_encode($message);
		
		$pdo = ctx_getpdo();
		# This creates a notification only, if there is currently a session for that user. otherwise
		# we don't create any rows in the DB.
		$stmt = $pdo->prepare('INSERT INTO notifications (session_id, user_id, data, time) 
			SELECT session_id, user_id, ?, UNIX_TIMESTAMP() FROM sessions WHERE user_id = ?');
		$stmt->execute(array($json, $user_id));
	}

	/**
	 * Delete all notifications for the given session before the given timestamp
	 */
	function deleteNotifications($session_id, $timestamp) {
		$pdo = ctx_getpdo();
		$stmt = $pdo->prepare('DELETE FROM notifications WHERE session_id = ? AND time <= ?');
		$stmt->bindValue(1, $session_id, PDO::PARAM_STR);
		$stmt->bindValue(2, $timestamp, PDO::PARAM_INT);
		$stmt->execute();
	}
	function getNotifications($session_id, $timestamp) {	
		$pdo = ctx_getpdo();
				
		$stmt = $pdo->prepare('SELECT data FROM notifications WHERE session_id = ? AND time <= ?');
		$stmt->execute(array($session_id, $timestamp));
		$result = array();
		$data = $stmt->fetchAll();
		foreach ($data AS $i => $row) {
			$result[] = json_decode($row['data']);
		}
		return $result;
	}
}