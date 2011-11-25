<?php
	
	function user_get() {
		global $USERS;
		return $USERS[user_get_id()];
	}
	function user_get_id() {
		return $_SESSION['userid'];
	}