<?php

function cleanupPosts($argv) {
  if (count($argv) >= 1) {
    $topicIds = $argv;
  } else {
    $topicIds = TopicRepository::listTopics();
  }

  foreach($topicIds as $topic_id) {
    $topic = TopicRepository::getTopic($topic_id, /*userid:*/ 0);
    echo $topic_id . PHP_EOL;

    foreach($topic['posts'] as $post) {
      if ($post['deleted']) {
        # echo " - " . $post['id'] . PHP_EOL;
        TopicRepository::deletePostsIfNoChildren($topic_id, $post['id']);
      }

    }
  }

  Stats::gauge('wobble_posts_last_gc_seconds', time());
  echo "Checked " . count($topicIds) . " for deleted posts." . PHP_EOL;
}

/**
 * Deletes all sessions that are older than 30 days.
 */
function cleanupSessions($args) {
  $num = SessionService::gc();
  echo "Cleared $num sessions." . PHP_EOL;
}

function cleanupStats($args) {
  $pdo = ctx_getpdo();
  # delete all stats that were not updated in the last 7 days
  $sql = 'DELETE FROM `statistics` WHERE last_update < (unix_timestamp() - 60 * 60 * 24 * 7)';
  $num = $stat = $pdo->exec($sql);

  Stats::gauge('wobble_stats_last_gc_seconds', time());
  echo "Cleared $num stats." . PHP_EOL;
}

$requestedAction = isset($argv[2]) ? $argv[2] : 'default';
unset($argv[0]); # 'wobble'
unset($argv[1]); # 'garbage-collector'
unset($argv[2]); # $requestedAction
$args = array_values($argv);


$actions = array();

if ($requestedAction == '-h' || $requestedAction == '--help') {
  die('Usage: wobble garbage-collector.php [default]' . PHP_EOL .
      '       wobble garbage-collector.php all' . PHP_EOL .
      PHP_EOL .
      '       wobble garbage-collector.php posts [topics]' . PHP_EOL .
      '       wobble garbage-collector.php stats' . PHP_EOL .
      '       wobble garbage-collector.php sessions' . PHP_EOL .
      PHP_EOL);
}
else if ($requestedAction == "default") {
  $actions[] = 'cleanupPosts';
  # $actions[] = 'cleanupStats';
  $actions[] = 'cleanupSessions';
  $args = array();
}
else if ($requestedAction == "all") {
  $actions[] = 'cleanupPosts';
  $actions[] = 'cleanupStats';
  $actions[] = 'cleanupSessions';
  $args = array();
} 
else if($requestedAction == 'sessions') {
  $actions[] = 'cleanupSessions';
}
else if($requestedAction == 'posts') {
  $actions[] = 'cleanupPosts';
}
else if($requestedAction == 'stats') {
  $actions[] = 'cleanupStats';
} else {
  echo 'Unknown parameter ' . $requestedAction . PHP_EOL;
  exit(1);
}

foreach($actions AS $n) {
  echo "### $n" . PHP_EOL;
  call_user_func($n, $args);
}
