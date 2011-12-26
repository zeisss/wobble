<?php

/**
 * Manages the Rooster of a User.
 */
class ContactsRepository {
	function addUser($user_id, $contact_user_id) {
		$pdo = ctx_getpdo();

		$stmt = $pdo->prepare('INSERT INTO users_contacts (user_id, contact_user_id) VALUES (?, ?)');
		$stmt->execute(array($user_id, $contact_user_id));
	}
	function removeUser($user_id, $contact_user_id) {
		$pdo = ctx_getpdo();
	
		$stmt = $pdo->prepare('DELETE FROM users_contacts WHERE user_id = ? AND contact_user_id = ?');
		$stmt->execute(array($user_id, $contact_user_id));
	}

	function getContacts($user_id) {
		$pdo = ctx_getpdo();
		$stmt = $pdo->prepare('SELECT u.id id, u.name name, u.email email, md5(u.email) img, COALESCE(last_touch > (UNIX_TIMESTAMP() - 300), false) online ' . 
		                      'FROM users u, users_contacts c WHERE u.id = c.contact_user_id AND c.user_id = ?' . 
							  'ORDER BY online DESC, u.name');
		$stmt->execute(array($user_id));
		$result =  $stmt->fetchAll();
		foreach($result AS $i => $user) {
			$result[$i]['id'] = intval($user['id']); # convert id to int
			$result[$i]['online'] = intval($user['online']); 
		}
		return $result;
	}
}
