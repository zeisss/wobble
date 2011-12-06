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
	class UserRepository {
		function create($name, $password_hashed, $email) {
			$pdo = ctx_getpdo();
			$stmt = $pdo->prepare('INSERT INTO users (name, password_hashed, email) VALUES (?,?,?)');
			$stmt->execute(array($name, $password_hashed, strtolower($email)));
			
			return $pdo->lastInsertId();
		}
		function updateName($user_id, $name) {
			$pdo = ctx_getpdo();
			$stmt = $pdo->prepare('UPDATE users SET name = trim(?) WHERE id = ?');
			$stmt->execute(array($name, $user_id));
		}
		function getUserByEmail($email) {
			$pdo = ctx_getpdo();
			
			$stmt = $pdo->prepare('SELECT id, name, password_hashed, email, md5(email) img FROM users WHERE email = ?');
			$stmt->execute(array(strtolower($email)));
			
			$result = $stmt->fetchAll();
			if ( count($result) == 1 ) {
				return $result[0]['id'];
			} else {
				return NULL;
			}
		}
	}