<?php
	session_set_cookie_params(60 * 60 * 24 * 31);
	session_name('WOBBLEID');
	session_start();
	
	if (empty($_SESSION['userid'])) {
		require('welcome.html');
	} else {
		require('client.html');
	}
