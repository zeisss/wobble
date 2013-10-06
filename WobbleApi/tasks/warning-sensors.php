<?php
## wobble warning-sensors --orphaned-topics
## wobble warning-sensors --orphaned-posts
##
## Prints the number of orphaned topics/posts respectitly.
##
if (count($argv) != 3) {
  echo "Usage: ${argv[0]} ${argv[1]} [--orphaned-topics|--orphaned-posts]" . PHP_EOL;
  exit(1);
}

if ($argv[2] == "--orphaned-topics") {
  # Topics which do not have any members
  $sql = 'SELECT count(*) cnt ' . 
         'FROM topics t ' . 
         'WHERE t.id NOT IN ( ' .
         'SELECT DISTINCT topic_id FROM topic_readers' . 
         ')';
} else if($argv[2] == "--orphaned-posts") {
  # Posts whose parent does not exist
  $sql = 'select count(*) cnt from posts ' . 
         ' where parent_post_id not in (select post_id from posts)';
}

$pdo = ctx_getpdo();
$stmt = $pdo->query($sql);
$result = $stmt->fetchAll();
print $result[0]['cnt'] . "\n";
