#!/usr/bin/env php
<?php
if (!defined('WOBBLE_HOME')) {
  define('WOBBLE_HOME', dirname(__DIR__));
}
include WOBBLE_HOME . '/WobbleApi/Autoload.php';

$server = new JsonRpcServer();
var_dump($server);
var_dump(InputSanitizer::sanitizeEmail('stephan@asda'));