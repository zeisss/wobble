<?php
	global $PDO_CONTEXT_VAR;
	$PDO_CONTEXT_VAR = null;
	function ctx_getpdo() {
		global $PDO_CONTEXT_VAR;
		
		if ( $PDO_CONTEXT_VAR == null ) {
			$db_name = "wooble";
			$db_host = "localhost";
			$db_user = "root";
			$db_pwd = "lamproot";
			$pdo = new PDO("mysql:dbname={$db_name};host={$db_host}", $db_user, $db_pwd);
			$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); # Raise exceptions, so they get logged by Airbrake
			$pdo->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, false);
			$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
			$PDO_CONTEXT_VAR = $pdo;
		}
		return $PDO_CONTEXT_VAR;
	}	
	
	function ctx_getuserid() {
		return $_SESSION['userid'];
	}
	
	function ctx_before_request($method, $params) {
		if ( !empty($_SESSION['userid'])) {
			UserRepository::touch($_SESSION['userid']);
		}
	}
	function ctx_after_request($method, $params, $result, $exception) {
	
	}
	
	class ValidationService {
		function validate_email($input) {
			ValidationService::check(!empty($input) && strpos($input, '@') > 0, 'Valid email adress required: ' . $input);
		}
		function validate_not_empty($input) {
			ValidationService::check(!empty($input));
		}
		
		function check($boolean, $message = 'Invalid Input!') {
			if ( !$boolean ) throw new Exception($message);
		}
	}
	class SecurityService {
		function hashPassword($password) {
			return md5('myStaticSalt' . $password);
		}
	}
	
	class ContactsRepository {
		function getContacts($user_id) {
			$pdo = ctx_getpdo();
			$stmt = $pdo->prepare('SELECT u.id id, u.name name, u.email email, md5(u.email) img, COALESCE(last_touch > (UNIX_TIMESTAMP() - 300), false) online  FROM users u, users_contacts c WHERE u.id = c.contact_user_id AND c.user_id = ?');
			$stmt->execute(array($user_id));
			return $stmt->fetchAll();
		}
	}
	class UserRepository {
		function touch($user_id, $timestamp = FALSE) {
			if ( $timestamp === FALSE) {
				$timestamp = time();
			}
			$pdo = ctx_getpdo();
			$stmt = $pdo->prepare('UPDATE users SET last_touch = ? WHERE id = ?');
			$stmt->bindValue(1, $timestamp, PDO::PARAM_INT);
			$stmt->bindValue(2, $user_id, PDO::PARAM_INT);
			$stmt->execute();
			
		}
		function create($name, $password_hashed, $email) {
			$pdo = ctx_getpdo();
			$stmt = $pdo->prepare('INSERT INTO users (name, password_hashed, email) VALUES (?,?,?)');
			$stmt->execute(array($name, $password_hashed, strtolower(trim($email))));
			
			return $pdo->lastInsertId();
		}
		function updateName($user_id, $name) {
			$pdo = ctx_getpdo();
			$stmt = $pdo->prepare('UPDATE users SET name = trim(?) WHERE id = ?');
			$stmt->execute(array($name, $user_id));
		}
		
		function get($user_id) {
			$pdo = ctx_getpdo();
			
			$stmt = $pdo->prepare('SELECT id, name, password_hashed, email, md5(email) img, COALESCE(last_touch > (UNIX_TIMESTAMP() - 300), false) online FROM users WHERE id = ?');
			$stmt->execute(array($user_id));
			
			$result = $stmt->fetchAll();
			if ( count($result) == 1 ) {
				$result[0]['id'] = intval($result[0]['id']);
				return $result[0];
			} else {
				return NULL;
			}
		}
		function getUserByEmail($email) {
			$pdo = ctx_getpdo();
			
			$stmt = $pdo->prepare('SELECT id, name, password_hashed, email, md5(email) img, COALESCE(last_touch > (UNIX_TIMESTAMP() - 300), false) online FROM users WHERE email = ?');
			$stmt->execute(array(strtolower(trim($email))));
			
			$result = $stmt->fetchAll();
			if ( count($result) == 1 ) {
				$result[0]['id'] = intval($result[0]['id']);
				return $result[0];
			} else {
				return NULL;
			}
		}
	}
	
	class TopicRepository {
		function getReaders($topic_id, $limit = FALSE) {
			$pdo = ctx_getpdo();
			
			$sql = 'SELECT u.id id, u.name name, u.email email, md5(u.email) img, COALESCE(last_touch > (UNIX_TIMESTAMP() - 300), false) online ' . 
				  'FROM users u, topic_readers r ' . 
				  'WHERE u.id = r.user_id AND r.topic_id = ?';
			if ( $limit ) {
				$sql .= ' LIMIT ' . $limit;
			}
			$stmt = $pdo->prepare($sql);
			$stmt->execute(array($topic_id));
			return $stmt->fetchAll();
		}
	}
	class NotificationRepository {
		function push($user_id, $message) {
			$json = json_encode($message);
			
			$pdo = ctx_getpdo();
			$stmt = $pdo->prepare('INSERT INTO notifications (user_id, data, time) VALUES (?,?,UNIX_TIMESTAMP())');
			$stmt->execute(array($user_id, $json));
		}
		function getNotifications($user_id, $timestamp) {	
			$pdo = ctx_getpdo();
			
			if ( $timestamp != NULL ) {
				$stmt = $pdo->prepare('DELETE FROM notifications WHERE user_id = ? AND time < ?');
				$stmt->bindValue(1, $user_id, PDO::PARAM_INT);
				$stmt->bindValue(2, $timestamp, PDO::PARAM_INT);
				$stmt->execute();
			}
			
			$stmt = $pdo->prepare('SELECT data FROM notifications WHERE user_id = ?');
			$stmt->execute(array($user_id));
			$result = array();
			$data = $stmt->fetchAll();
			foreach ($data AS $i => $row) {
				$result[] = json_decode($row['data']);
			}
			return $result;
		}
	}