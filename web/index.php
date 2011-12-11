<?php
	session_start();
	
	if (empty($_SESSION['userid'])) {
		require('welcome.html');
	} else {
		require('client.html');
	}
