#!/usr/bin/env php
<?php
require_once dirname(__FILE__) . '/../web/api/context.php';

if (count($argv) != 2) {
  die('Usage: $0 [--orphaned-topics|--orphaned-posts]');
}

if ($argv[1] == "--orphaned-topics") {
  # Topics which do not have any members
  $sql = 'select count(*) cnt from (select t.id, count(r.user_id) from topics t, topic_readers r where t.id = r.topic_id group by t.id having count(r.user_id) < 1) t';
} else if($argv[1] == "--orphaned-posts") {
  # Posts whose parent does not exist
  $sql = 'select count(*) cnt from posts ' . 
         ' where parent_post_id not in (select post_id from posts)';
}

$pdo = ctx_getpdo();
$stmt = $pdo->query($sql);
$result = $stmt->fetchAll();
print $result[0]['cnt'] . "\n";
