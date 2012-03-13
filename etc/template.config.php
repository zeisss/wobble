<?php
define('PDO_USER', 'root');
define('PDO_URL', 'mysql:dbname=wobble;host=localhost');
define('PDO_PASSWORD', 'your_mysql_password');

# Adds a usleep() call to each request to mimick internet latency on local development boxes
define('SIMULATE_LAG', false);

# Replace value with something totally random for Production environments. Leave empty for only md5-ing the passwords
define('PASSWORD_SALT', 'myStaticSalt');

# Define a topic id to which every newly registered user gets added
# define ('WELCOME_TOPIC_ID', '1-1323269956900');
