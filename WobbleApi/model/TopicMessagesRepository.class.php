<?php

class TopicMessagesRepository {
  public static function listMessages($topic_id, $user_id) {
    $pdo = ctx_getpdo();
    
    $stmt = $pdo->prepare('SELECT * FROM topic_messages WHERE topic_id = ? AND user_id = ?');
    $stmt->execute(array($topic_id, $user_id));

    $result = array();
    foreach ($stmt->fetchAll() as $row) {
        $result[] = array(
            'message_id' => $row['message_id'],
            'message' => json_decode($row['data'])
        );
    }
    return $result;
  }

  public static function createMessage($topic_id, $user_id, $data) {
    $pdo = ctx_getpdo();

    $stmt = $pdo->prepare('INSERT INTO topic_messages (topic_id, user_id, data) VALUES (?,?,?)');
    $stmt->execute(array($topic_id, $user_id, json_encode($data)));

    return true;
  }

  public static function deleteMessage($topic_id, $user_id, $message_id) {
    $pdo = ctx_getpdo();
    $stmt = $pdo->prepare('DELETE FROM topic_messages WHERE topic_id = ? AND message_id = ? AND user_id = ?');
    $stmt->execute(array($topic_id, $message_id, $user_id));

    return true;
  }
}