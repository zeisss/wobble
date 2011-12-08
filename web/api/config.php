<?php
	define('PDO_USER', 'root');
	define('PDO_URL', 'mysql:dbname=wooble;host=localhost');
	define('PDO_PASSWORD', 'lamproot');
	
	# Adds a usleep() call to each request to mimick internet latency on local development boxes
	define('SIMULATE_LAG', true);