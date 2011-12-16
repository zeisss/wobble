<?php

class SecurityService {
	function hashPassword($password) {
		return md5('myStaticSalt' . $password);
	}
}
