<?php

# WOBBLE_HOME can be provided by the PHP Environment, e.g. through a .htaccess file
# It describes, where other script files are located.
if (!defined('WOBBLE_HOME')) {
  define('WOBBLE_HOME', dirname(__FILE__) . '/../..');
}

require_once WOBBLE_HOME . '/vendor/autoload.php';
require_once WOBBLE_HOME . '/WobbleApi/Autoload.php';
require_once WOBBLE_HOME . '/WobbleApi/handlers/api_metrics.php';

$metrics = wobble_metrics([]);


header('Content-Type: text/plain; version=0.0.4');
foreach($metrics as $key => $value) {
	# skip empty metrics
	if (empty($value['values'])) {
		continue;
	}

	if (!empty($value['help'])) {
		print "# HELP ${value['name']} ${value['help']}\n";
	}
	if (!empty($value['type'])) {
		print "# TYPE ${value['name']} ${value['type']}\n";
	}

	if (is_array($value['values'])) {
		foreach($value['values'] as $item) {
			print "${item['name']}\t${item['value']}\n";
		}
	} else if (!empty($value['values'])) {
		print "${value['name']} ${value['values']}\n";
	}
	print "\n";
}


