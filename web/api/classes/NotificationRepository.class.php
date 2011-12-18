<?php
/**
 * The NotificationRepository provides a way to store events for a user. 
 */
class NotificationRepository {
	function push($user_id, $message) {
		$json = json_encode($message);
		
		$pdo = ctx_getpdo();
		$stmt = $pdo->prepare('INSERT INTO notifications (user_id, data, time) VALUES (?,?,UNIX_TIMESTAMP())');
		$stmt->execute(array($user_id, $json));
	}
	function deleteNotifications($user_id, $timestamp) {
		$pdo = ctx_getpdo();
		$stmt = $pdo->prepare('DELETE FROM notifications WHERE user_id = ? AND time <= ?');
		$stmt->bindValue(1, $user_id, PDO::PARAM_INT);
		$stmt->bindValue(2, $timestamp, PDO::PARAM_INT);
		$stmt->execute();
	}
	function getNotifications($user_id, $timestamp) {	
		$pdo = ctx_getpdo();
				
		$stmt = $pdo->prepare('SELECT data FROM notifications WHERE user_id = ? AND time <= ?');
		$stmt->execute(array($user_id, $timestamp));
		$result = array();
		$data = $stmt->fetchAll();
		foreach ($data AS $i => $row) {
			$result[] = json_decode($row['data']);
		}
		return $result;
	}
}