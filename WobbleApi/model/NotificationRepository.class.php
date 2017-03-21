<?php
/**
 * The NotificationRepository provides a way to store events for a session/user. 
 */
class NotificationRepository {
  public static function push($user_id, $message) {
    $json = json_encode($message);

    $pdo = ctx_getpdo();
    # This creates a notification only, if there is currently a session for that user. otherwise
    # we don't create any rows in the DB.
    $stmt = $pdo->prepare('INSERT INTO notifications (session_id, user_id, data, time)
      SELECT session_id, user_id, ?, UNIX_TIMESTAMP()
      FROM sessions
      WHERE user_id = ?
        AND last_touch > (UNIX_TIMESTAMP() - 300)
    ');
    $stmt->execute(array($json, $user_id));

    Stats::incr('notification_pushed_user');
  }

  public static function pushSession($session_id, $message) {
    $json = json_encode($message);

    $pdo = ctx_getpdo();
    # This creates a notification only, if there is currently a session for that user. otherwise
    # we don't create any rows in the DB.
    $stmt = $pdo->prepare('INSERT INTO notifications (session_id, user_id, data, time)
      SELECT session_id, user_id, ?, UNIX_TIMESTAMP() FROM sessions WHERE session_id = ?');
    $stmt->execute(array($json, $session_id));

    Stats::incr('notification_pushed_session');
  }

  /**
   * Delete all notifications for the given session before the given timestamp. If null
   * is provided for the timestamp, delete all messages.
   */
  public static function deleteNotifications($session_id, $timestamp = null) {
    $pdo = ctx_getpdo();
    if (is_null($timestamp)) {
        $stmt = $pdo->prepare('DELETE FROM notifications WHERE session_id = ?');
        $stmt->bindValue(1, $session_id, PDO::PARAM_STR);
        $stmt->execute();
    } else {
        $stmt = $pdo->prepare('DELETE FROM notifications WHERE session_id = ? AND time <= ?');
        $stmt->bindValue(1, $session_id, PDO::PARAM_STR);
        $stmt->bindValue(2, $timestamp, PDO::PARAM_INT);
        $stmt->execute();
    }
  }

  public static function getNotifications($session_id, $timestamp) {
    $pdo = ctx_getpdo();
        
    $stmt = $pdo->prepare('SELECT data FROM notifications WHERE session_id = ? AND time <= ?');
    $stmt->execute(array($session_id, $timestamp));
    $result = array();
    $data = $stmt->fetchAll();
    foreach ($data AS $i => $row) {
      $result[] = json_decode($row['data'], true);
    }
    Stats::incr('notification_fetch_count');
    Stats::incr('notification_fetch_sum', sizeof($result));
    return $result;
  }
}