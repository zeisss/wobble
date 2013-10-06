<?php
if (count($argv) != 3) {
  die("Usage: {$argv[0]} {$argv[1]} <email>" . PHP_EOL);
}

$email = $argv[2];
$user = UserRepository::getUserByEmail($email);
if ($user === NULL) {
  die('ERROR: User not found' . PHP_EOL);
}

print "Deleting user {$user['name']} with id {$user['id']}" . PHP_EOL;
UserRepository::delete($user['id']);