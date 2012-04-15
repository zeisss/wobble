<?php

class TopicListService {
  public static function search($user_id, $searchFilter) {
    $pdo = ctx_getpdo();

    $stmt = $pdo->prepare('SELECT
        t.id id,
        proot.content abstract,
        (select max(p.last_touch) from posts p WHERE p.topic_id = t.id) max_last_touch,
        (select count(*) from posts where topic_id = t.id and deleted = 0) post_count_total,
        (select count(*) from post_users_read pur, posts p2
         where pur.topic_id = t.id and pur.topic_id = p2.topic_id
           and pur.post_id = p2.post_id and p2.deleted = 0
           and pur.user_id = r.user_id) post_count_read,
        (select count(*) from topic_messages
         where topic_id = t.id AND user_id = r.user_id) topic_messages,
        (select count(*) from posts where topic_id = t.id and deleted = 0
            and content like concat("%", concat(?, "%"))) matches,
        (select count(*) from user_archived_topics uat
          where uat.topic_id = t.id and uat.user_id = r.user_id) archived
     FROM topics t, topic_readers r, posts proot
    WHERE r.user_id = ? AND r.topic_id = t.id
      AND t.id = proot.topic_id AND proot.post_id = cast(1 as char)
    HAVING matches > 0
    ORDER BY t.timestamp DESC, max_last_touch DESC');
    $stmt->execute(array($searchFilter, $user_id));
    $result = $stmt->fetchAll();

    foreach($result AS $i => $topic) {
      $result[$i]['users'] = TopicRepository::getReaders($topic['id'], /*count:*/1);
      $result[$i]['post_count_total'] = intval($result[$i]['post_count_total']);
      $result[$i]['max_last_touch'] = intval($result[$i]['max_last_touch']);

      # We count read entries in the database, but we need to return the number of unread entries
      # Also, we cheat a little, since we just add the messages to the unread count
      $result[$i]['post_count_unread'] = $result[$i]['post_count_total'] - intval($result[$i]['post_count_read']) + intval($result[$i]['topic_messages']);
      unset($result[$i]['post_count_read']);

      $abstract = TopicListService::createAbstract($result[$i]['abstract'], 50);
      $result[$i]['abstract'] = "<b>{$abstract['headline']}</b> - {$abstract['text']}";
      $result[$i]['archived'] = intval($result[$i]['archived']);
    }
    return $result;
  }
  /**
   * Returns the number of topics with unread posts or messages for the given user.
   */
  public static function getUnreadTopicList($user_id, $show_archive = false) {
    $topics = self::getTopicList($user_id, $show_archive);
    $counter = 0;
    foreach ($topics as $t) {
      if ($t['post_count_unread']) {
        $counter++;
      }
    }
    return $counter;
  }
  public static function getTopicList($user_id, $show_archive = false) {
    $pdo = ctx_getpdo();

    $stmt = $pdo->prepare('SELECT
        t.id id,
        p.content abstract,
        (select max(p.last_touch) from posts p WHERE p.topic_id = t.id) max_last_touch,
        (select count(*) from posts where topic_id = t.id and deleted = 0) post_count_total,
        (select count(*) from post_users_read pur, posts p2
         where pur.topic_id = t.id and pur.topic_id = p2.topic_id
           and pur.post_id = p2.post_id and p2.deleted = 0
           and pur.user_id = r.user_id) post_count_read,
        (select count(*) from topic_messages
         where topic_id = t.id AND user_id = r.user_id) topic_messages
     FROM topics t, topic_readers r, posts p
    WHERE r.user_id = ? AND r.topic_id = t.id 
      AND t.id = p.topic_id AND p.post_id = cast(1 as char)
      AND t.id ' . ($show_archive ? '' : 'not') . ' in (select topic_id from user_archived_topics where user_id = r.user_id)
    ORDER BY t.timestamp DESC, max_last_touch DESC');
    $stmt->execute(array($user_id));
    $result = $stmt->fetchAll();

    foreach($result AS $i => $topic) {
      $result[$i]['users'] = TopicRepository::getReaders($topic['id'], /*count:*/1);
      $result[$i]['post_count_total'] = intval($result[$i]['post_count_total']);
      $result[$i]['max_last_touch'] = intval($result[$i]['max_last_touch']);

      # We count read entries in the database, but we need to return the number of unread entries
      # Also, we cheat a little, since we just add the messages to the unread count
      $result[$i]['post_count_unread'] = $result[$i]['post_count_total'] - intval($result[$i]['post_count_read']) + intval($result[$i]['topic_messages']);
      unset($result[$i]['post_count_read']);

      $abstract = TopicListService::createAbstract($result[$i]['abstract'], 50);
      $result[$i]['abstract'] = "<b>{$abstract['headline']}</b> - {$abstract['text']}";
      $result[$i]['archived'] = $show_archive;
    }
    return $result;
  }
  public static function createAbstract($post_content, $text_length = 30) {
    $text = '';
    $headline = null;
    $offset = null;

    $headline = TopicListService::parseHeadline($post_content, $offset);
    $headline = strip_tags($headline);
    if (!is_null($offset)) {
      $text = substr(trim(strip_tags(substr(trim($post_content), $offset))), 0, $text_length);
    }

    return array(
      'headline' => $headline,
      'text' => $text
    );
  }
  
  private static function parseHeadline($post_content, &$offset) {
    if (empty($post_content)) {
      return "";
    }
    $post_content = trim($post_content);
    $offset = null;
    if ($post_content[0] !== '<') {
      # Text does not start with a tag, so we have to p
      $end = strpos($post_content, '<');
      if ($end === false) {
        return $post_content;
      } else {
        $offset = $end;
        return substr($post_content, 0, $end);
      }
    } else {
      $i = strpos($post_content, ' '); // Search the first whitespace
      $j = strpos($post_content, '>');

      if ($i === false) {
        if ($j === false) {
          return $post_content;
        }
        else {
          $tagNameEnd = $j;
        }
      } else {
        $tagNameEnd = $i < $j ? $i : $j;
      }
      
      $tag = substr($post_content, 1, $tagNameEnd - 1);
      $tagEnd = strpos($post_content, '>');
      if ($tagEnd === false) {
        # What? No idea Oo
        return $post_content;
      }

      $end = strpos($post_content, '</' . $tag . '>', $tagEnd);
      if ($end === false) {
        # Srsly?
        return $post_content;
      }

      $offset = $end + 3 + strlen($tag);
      return substr($post_content, $tagEnd + 1, $end - $tagEnd);
    }
  }
}