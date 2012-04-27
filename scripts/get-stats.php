#!/usr/bin/env php
<?php
require_once dirname(__FILE__) . '/../WobbleApi/Autoload.php';

if (count($argv) !== 2) {
  echo 'Usage: get-stats key' . PHP_EOL;
  exit(1);
}

$key = trim($argv[1]);
$value = Stats::getValue($key);

if (is_null($value)) {
  $value = 0;
}
echo $value . PHP_EOL;