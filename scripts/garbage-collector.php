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

if($requestedAction == "all") {
  $actions[] = 'cleanupPosts';
  $actions[] = 'cleanupStats';
  $args = array();
} 
else if($requestedAction == 'posts') {
  $actions[] = 'cleanupPosts';
}
else if($requestedAction == 'stats') {
  $actions[] = 'cleanupStats';
} else {
  die('Unknown parameter ' . $requestedAction);
}

foreach($actions AS $n) {
  echo "### $n" . PHP_EOL;
  call_user_func($n, $args);
}
