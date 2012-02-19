<?php

class UserArchivedTopicsRepository {
  public static function set_archived($user_id, $topic_id, $archived) {
    if ($archived) {
      $sql = 'REPLACE user_archived_topics (user_id, topic_id) VALUES (?,?)';
    } else {
      $sql = 'DELETE FROM user_archived_topics WHERE user_id = ? AND topic_id = ?';
    }

    $pdo = ctx_getpdo();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(1, $user_id, PDO::PARAM_INT);
    $stmt->bindValue(2, $topic_id, PDO::PARAM_STR);
    $stmt->execute();

    return TRUE;
  }
}