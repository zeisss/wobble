<?php

if (!defined('WOBBLE_HOME')) {
  define('WOBBLE_HOME', dirname(__DIR__));
}

function wobble_autoload($className) {
  $path = WOBBLE_HOME . '/WobbleApi/' . $className . '.php';
  if (file_exists($path)) {
    return include $path;
  }
  $path = WOBBLE_HOME . '/WobbleApi/model/' . $className . '.class.php';
  if (file_exists($path)) {
    return include $path;
  }
}
spl_autoload_register('wobble_autoload');

# Include general context functions
require_once WOBBLE_HOME . '/WobbleApi/context.php';

# Load the configuration file
require_once WOBBLE_HOME . '/etc/config.php';

# Load account management component
require_once WOBBLE_HOME . '/AccountMgmt/autoload.php';
