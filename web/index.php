<?php
	session_name('WOBBLEID');
	session_start();
	
	if (empty($_SESSION['userid'])) {
		require('welcome.html');
	} else {
		require('client.html');
	}
