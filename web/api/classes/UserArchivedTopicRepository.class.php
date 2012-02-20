<?php

class UserArchivedTopicRepository {
  public static function setArchived($user_id, $topic_id, $archived) {
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

  public static function isArchivedTopic($user_id, $topic_id) {
    $pdo = ctx_getpdo();

    $stmt = $pdo->prepare('SELECT COUNT(*) cnt FROM user_archived_topics WHERE user_id = ? AND topic_id = ?');
    $stmt->execute(array($user_id, $topic_id));
    $archived = $stmt->fetchObject()->cnt;

    return intval($archived);
  }
}