#!/usr/bin/env php
<?php
require_once dirname(__FILE__) . '/../WobbleApi/Autoload.php';

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
        echo " - " . $post['id'] . PHP_EOL;
        TopicRepository::deletePostsIfNoChildren($topic_id, $post['id']);
      }

    }
  }
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
  echo "Cleared $num stats." . PHP_EOL;
}

$requestedAction = isset($argv[1]) ? $argv[1] : 'all';
unset($argv[0]);
unset($argv[1]);
$args = array_values($argv);


$actions = array();

if ($requestedAction == '-h' || $requestedAction == '--help') {
  die('Usage: garbage-collector.php all' . PHP_EOL .
      '       garbage-collector.php posts [topics]' . PHP_EOL .
      '       garbage-collector.php stats' . PHP_EOL .
      '       garbage-collector.php sessions' . PHP_EOL .
      PHP_EOL);
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
