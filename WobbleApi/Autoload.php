<?php

if (!defined('WOBBLE_HOME')) {
  define('WOBBLE_HOME', __DIR__);
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