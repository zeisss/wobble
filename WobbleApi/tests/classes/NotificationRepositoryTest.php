<?php

require_once dirname(__FILE__) . '/../../Autoload.php';

class NotificationRepositoryTest extends PHPUnit_Framework_TestCase {
  public function setUp() {
    NotificationRepository::deleteNotifications('test_session_id');
    NotificationRepository::deleteNotifications('test_another_session');
    NotificationRepository::deleteNotifications('test_another_user');
  }
  public function testSessionPush() {
    SessionService::touch('test_session_id', 1, false, 'test client');
    SessionService::touch('test_another_session', 1, false, 'test client');
    SessionService::touch('test_another_user', 2, false, 'test client');
    NotificationRepository::pushSession('test_session_id', array('type' => 'test_message'));

    $notifications = NotificationRepository::getNotifications('test_session_id', PHP_INT_MAX);
    $this->assertEquals(array(
      array('type' => 'test_message')
    ), $notifications);

    $notifications = NotificationRepository::getNotifications('test_another_session', PHP_INT_MAX);
    $this->assertEquals(array(), $notifications);

    $notifications = NotificationRepository::getNotifications('test_another_user', PHP_INT_MAX);
    $this->assertEquals(array(), $notifications);
  }
}
