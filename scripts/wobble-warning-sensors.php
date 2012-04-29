#!/usr/bin/env php
<?php
require_once dirname(__FILE__) . '/../WobbleApi/Autoload.php';

if (count($argv) != 2) {
  die('Usage: $0 [--orphaned-topics|--orphaned-posts]');
}

if ($argv[1] == "--orphaned-topics") {
  # Topics which do not have any members
  $sql = 'SELECT count(*) cnt ' . 
         'FROM topics t ' . 
         'WHERE t.id NOT IN ( ' .
         'SELECT DISTINCT topic_id FROM topic_readers' . 
         ')';
} else if($argv[1] == "--orphaned-posts") {
  # Posts whose parent does not exist
  $sql = 'select count(*) cnt from posts ' . 
         ' where parent_post_id not in (select post_id from posts)';
}

$pdo = ctx_getpdo();
$stmt = $pdo->query($sql);
$result = $stmt->fetchAll();
print $result[0]['cnt'] . "\n";
