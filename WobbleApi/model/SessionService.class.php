<?php
class SessionService {
  public static function gc() {
    $pdo = ctx_getpdo();
    $sql = 'SELECT session_id FROM  `sessions` ' .
           'WHERE last_touch < ( UNIX_TIMESTAMP( ) - ( 31 *24 *60 *60 ) )';
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll();

    foreach($result as $session) {
      static::signoff($session['session_id']);
    }
    Stats::gauge('sessions_last_gc_seconds', time());
    return count($result);
  }



  /**
   *
   */
  public static function signon($session_id, $user_id) {
    SessionService::touch($session_id, $user_id);
  }
  public static function signoff($session_id) {
    NotificationRepository::deleteNotifications($session_id, time() + 100 /* Just somewhere in the future */ );

    $pdo = ctx_getpdo();
    $sql = 'DELETE FROM sessions WHERE session_id = ?';
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array($session_id));

  }
  public static function touch($session_id, $user_id, $timestamp = false, $client_info = null) {
    if ($timestamp === false) {
      $timestamp = time();
    }
    if (is_null($client_info)) {
      $client_info = $_SERVER['HTTP_USER_AGENT'];
    }
    $pdo = ctx_getpdo();
    $stmt = $pdo->prepare('REPLACE sessions (user_id, session_id, user_agent, last_touch) VALUES(?,?,?,?)');
    $stmt->bindValue(1, $user_id, PDO::PARAM_INT);
    $stmt->bindValue(2, $session_id, PDO::PARAM_STR);
    $stmt->bindValue(3, $client_info, PDO::PARAM_STR);
    $stmt->bindValue(4, $timestamp, PDO::PARAM_INT);
    $stmt->execute();
  }

  /**
   * Returns an array describing the current session.
   * Keys: session_id, user_id, user_agent, last_touch
   */
  public static function getSession($session_id) {
    $pdo = ctx_getpdo();

    $sql = 'SELECT session_id, user_id,
                   user_agent, last_touch,
                   (last_touch <= (unix_timestamp() - 5 * 60)) timeout
            FROM sessions WHERE session_id = ?';
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array($session_id));
    return $stmt->fetch();
  }

  public static function getOnlineUserCount() {
    $pdo = ctx_getpdo();
    $r = $pdo->query('SELECT count(distinct user_id) online_users FROM sessions WHERE last_touch > (unix_timestamp() - 5 * 60)')->fetchAll();
    return $r[0]['online_users'];
  }
  public static function getOnlineSessionCount() {
    $pdo = ctx_getpdo();
    $r = $pdo->query('SELECT count(*) online_sessions FROM sessions WHERE last_touch > (unix_timestamp() - 5 * 60)')->fetchAll();
    return $r[0]['online_sessions'];
  }

  public static function getTotalSessionCount() {
    $pdo = ctx_getpdo();
    $r = $pdo->query('SELECT count(*) total_session FROM sessions')->fetchAll();
    return $r[0]['total_sessions'];
  }


}