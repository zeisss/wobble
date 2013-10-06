<?php
if (count($argv) >= 3 && $argv[2] == "--sessions") {
  print SessionService::getOnlineSessionCount() . PHP_EOL;
} else {
  print SessionService::getOnlineUserCount() . PHP_EOL;
}