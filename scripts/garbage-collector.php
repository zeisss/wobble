#!/usr/bin/env php
<?php
require_once dirname(__FILE__) . '/../WobbleApi/Autoload.php';

if (count($argv) >= 2) {
  unset($argv[0]);
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