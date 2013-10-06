<?php
if (count($argv) !== 3) {
  echo 'Usage: get-stats key' . PHP_EOL;
  exit(1);
}

$key = trim($argv[2]);
$value = Stats::getValue($key);

if (is_null($value)) {
  $value = 0;
}
echo $value . PHP_EOL;