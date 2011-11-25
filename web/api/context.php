<?php
	function ctx_getpdo() {
		$db_name = "wooble";
		$db_host = "localhost";
		$db_user = "root";
		$db_pwd = "lamproot";
		$pdo = new PDO("mysql:dbname={$db_name};host={$db_host}", $db_user, $db_pwd);
		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); # Raise exceptions, so they get logged by Airbrake
		return $pdo;
	}