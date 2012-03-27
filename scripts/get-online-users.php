#!/usr/bin/env php
<?php
require_once dirname(__FILE__) . '/../WobbleApi/Autoload.php';

if (count($argv) >= 2 && $argv[1] == "--sessions") {
  print SessionService::getOnlineSessionCount() . "\n";
} else {
  print SessionService::getOnlineUserCount() . "\n";
}