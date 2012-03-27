<?php
require_once dirname(__FILE__) . '/../../WobbleApi/context.php';
require_once dirname(__FILE__) . '/../../WobbleApi/handlers/api_topic.php';

class ApiTopicTest extends PHPUnit_Framework_TestCase {
  /*public function testAddUserToTopic() {
    $topic_id = 'TODO';
    $self_user_id = -1;
    $other_user_id = -1;

    topic_add_user(array(
      'topic_id' => $topic_id,
      'contact_id' => $other_user_id
    ));

    $users = TopicRepository::getReaders($topic_id);
    $this->assertEquals(
      array($other_user_id, $self_user_id),
      $users
    );
  }*/
}