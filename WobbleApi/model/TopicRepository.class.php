<?php
class Topic {
  const TYPE_INLINE = 0;
  const TYPE_INTENDED_REPLY = 1;
}

/**
 * The TopicRepository provides convienience function to access the storage for Topics.
 */
class TopicRepository {
  public static function listTopics() {
    $pdo = ctx_getpdo();
    $stmt = $pdo->prepare('SELECT id FROM topics');
    $stmt->execute();
    $result = $stmt->fetchAll();
    
    $data = array();
    foreach ($result as $row) {
      $data[] = $row['id'];
    }
    return $data;
  }

  public static function isReader($topic_id, $user_id) {
    $pdo = ctx_getpdo();
    $stmt = $pdo->prepare('SELECT COUNT(*) cnt FROM topic_readers r WHERE r.user_id = ? AND r.topic_id = ?');
    $stmt->execute(array($user_id, $topic_id));
    $result = $stmt->fetchAll();
    return $result[0]['cnt'] > 0;
  }

  /**
   * Creates a new topic with an initial empty post belongign to the given user.
   * This user is also the only reader in the created topic.
   */
  function createTopic($topic_id, $user_id) 
  {
    $pdo = ctx_getpdo();
    
    // Create topic
    $stmt = $pdo->prepare('INSERT INTO topics VALUES (?)');
    $stmt->bindValue(1, $topic_id, PDO::PARAM_STR);
    $stmt->execute();

    TopicRepository::addReader($topic_id, $user_id);
    TopicRepository::createPost($topic_id, '1', $user_id);
  }

  /**
   * Get topic.
   */
  function getTopic($topic_id, $user_id) {
    $pdo = ctx_getpdo();
    
    $stmt = $pdo->prepare('SELECT p.post_id id, p.content, p.revision_no revision_no,
        p.parent_post_id parent, p.created_at created_at, p.last_touch timestamp, p.deleted deleted,
        p.intended_post intended_post,
        coalesce((select 0 from post_users_read
              where topic_id = p.topic_id AND post_id = p.post_id AND user_id = ?), 1) unread
       FROM posts p
      WHERE p.topic_id = ?
      ORDER BY created_at');
    $stmt->execute(array($user_id, $topic_id));
    $posts = $stmt->fetchAll();
    
    $created_at = null;
    $stmt = $pdo->prepare('SELECT e.user_id id FROM post_editors e WHERE topic_id = ? AND post_id = ?');
    foreach($posts AS $i => $post) {
      if ($post['id'] == '1') {
          $created_at = intval($post['created_at']);
      }
      unset($post['created_at']); # Currently not of interest for public api
    
      # Integer formatting for JSON-RPC result
      $posts[$i]['timestamp'] = intval($posts[$i]['timestamp']);
      $posts[$i]['revision_no'] = intval($posts[$i]['revision_no']);
      $posts[$i]['deleted'] = intval($posts[$i]['deleted']);
      $posts[$i]['unread'] = intval($posts[$i]['unread']);
      $posts[$i]['intended_post'] = intval($posts[$i]['intended_post']);
    
      $posts[$i]['locked'] = TopicRepository::getPostLockStatus($topic_id, $posts[$i]['id']);
      if ($posts[$i]['locked']['user_id'] == $user_id) {
        $posts[$i]['locked'] = NULL;
      }
    
      # Subobject
      $posts[$i]['users'] = array();
      $stmt->execute(array($topic_id, $post['id']));
      foreach($stmt->fetchAll() AS $post_user) {
        $posts[$i]['users'][] = intval($post_user['id']);
      }
    }
    
    $readers = TopicRepository::getReaders($topic_id);
    $writers = TopicRepository::getWriters($topic_id);
    $messages = TopicMessagesRepository::listMessages($topic_id, $user_id);
    
    // Archived?
    $archived = UserArchivedTopicRepository::isArchivedTopic($user_id, $topic_id);
    
    return array (
      'id' => $topic_id,
      'readers' => $readers,
      'messages' => $messages,
      'writers' => $writers,
      'posts' => $posts,
      'archived' => $archived,
      'created_at' => $created_at
    );
  }

  /**
   * Creates a new post with the given $post_id in the given topic.
   * The user $user_id is set as the owner and the post is a child of $parent_post_id.
   */
  function createPost($topic_id, $post_id, $user_id, $parent_post_id = NULL, $intended_reply = 0) {
    $pdo = ctx_getpdo();

    // Create empty root post
    $stmt = $pdo->prepare('INSERT INTO posts (topic_id, post_id, content, parent_post_id, intended_post, created_at, last_touch) 
                                      VALUES (?,        ?,       "",      ?,              ?, unix_timestamp(), unix_timestamp())');
    $stmt->execute(array($topic_id, $post_id, $parent_post_id, $intended_reply));
    
    // Assoc first post with current user
    $stmt = $pdo->prepare('INSERT INTO post_editors (topic_id, post_id, user_id) VALUES (?,?,?)');
    $stmt->bindValue(1, $topic_id);
    $stmt->bindValue(2, $post_id);
    $stmt->bindValue(3, $user_id);
    $stmt->execute();
  }
  function addReader($topic_id, $user_id) {
    $pdo = ctx_getpdo();

    $pdo->prepare('REPLACE topic_readers (topic_id, user_id, created_at) VALUES (?,?, unix_timestamp())')->execute(array($topic_id, $user_id));
  }

  function removeReader($topic_id, $user_id) {
    $pdo = ctx_getpdo();
    $pdo->prepare('DELETE FROM topic_readers WHERE topic_id = ? AND user_id = ?')->execute(array($topic_id, $user_id));

    $pdo->prepare('DELETE FROM post_users_read WHERE topic_id = ? AND user_id = ?')->execute(array($topic_id, $user_id));
  }
  function setPostReadStatus($user_id, $topic_id, $post_id, $read_status) {
    $pdo = ctx_getpdo();

    if ($read_status == 1) { # if read, create entry
      $sql = 'REPLACE post_users_read (topic_id, post_id, user_id) VALUES (?,?,?)';
    } else {
      $sql = 'DELETE FROM post_users_read WHERE topic_id = ? AND post_id = ? AND user_id = ?';
    }
    $pdo->prepare($sql)->execute(array($topic_id, $post_id, $user_id));
  }
  function setPostLockStatus($topic_id, $post_id, $lock_status, $user_id) {
    $pdo = ctx_getpdo();

    if ($lock_status == 1) { # if read, create entry
      $sql = 'REPLACE post_locks (topic_id, post_id, user_id, created_at) VALUES (?,?,?, unix_timestamp())';
      $pdo->prepare($sql)->execute(array($topic_id, $post_id, $user_id));
    } else {
      $sql = 'DELETE FROM post_locks WHERE topic_id = ? AND post_id = ?';
      $pdo->prepare($sql)->execute(array($topic_id, $post_id));
    }
  }
  function getPostLockStatus($topic_id, $post_id) {
    $pdo = ctx_getpdo();
    $sql = 'SELECT user_id, created_at FROM post_locks WHERE topic_id = ? AND post_id = ? AND created_at > unix_timestamp() - (5 * 60)';
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array($topic_id, $post_id));
    $result = $stmt->fetchAll();

    if (sizeof($result)) {
      $result[0]['user_id'] = intval($result[0]['user_id']);
      return $result[0];
    } else {
      return NULL;
    }
  }

  public static function updatePost($topic_id, $post_id, $rev, $content, $user_id) {
    $pdo = ctx_getpdo();

    $pdo->prepare('UPDATE posts SET content = ?, revision_no = revision_no + 1, last_touch = unix_timestamp() WHERE post_id = ? AND topic_id = ? AND revision_no = ?')
        ->execute(array($content, $post_id, $topic_id, $rev));
    $pdo->prepare('REPLACE post_editors (topic_id, post_id, user_id) VALUES (?,?,?)')
        ->execute(array($topic_id, $post_id, $user_id));
  }

  public static function deletePost($topic_id, $post_id) {
    $pdo = ctx_getpdo();

    $stmt = $pdo->prepare('DELETE FROM post_editors WHERE topic_id = ? AND post_id = ?');
    $stmt->execute(array($topic_id, $post_id));

    $pdo->prepare('UPDATE posts SET deleted = 1, content = NULL WHERE topic_id = ? AND post_id = ?')->execute(array($topic_id, $post_id));

    $pdo->prepare('DELETE FROM post_users_read WHERE topic_id = ? AND post_id = ?')->execute(array($topic_id, $post_id));
  }

  # Traverses upwards and deletes all posts, if no child exist
  public static function deletePostsIfNoChilds($topic_id, $post_id) {
    if($post_id === '1') {
      return;
    }

    $pdo = ctx_getpdo();
    
    # Fetch the deleted flag of the current post
    $sql = 'SELECT deleted, parent_post_id FROM posts WHERE topic_id = ? AND post_id = ?';
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array($topic_id, $post_id));
    $post = $stmt->fetchAll();
    
    if ($post[0]['deleted'] !== '1') { # Abort is given post is not deleted
      return;
    }
    
    # Count how many children the given post has.
    $sql = 'SELECT COUNT(*) child_count FROM posts WHERE topic_id = ? AND parent_post_id = ?' ;
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array($topic_id, $post_id));
    $result = $stmt->fetchAll();

    # If the post has no children, we can delete it savely.
    if (intval($result[0]['child_count']) === 0) {
      # Delete the post
      $sql = 'DELETE FROM posts WHERE topic_id = ? AND post_id = ? AND deleted = 1';
      $stmt = $pdo->prepare($sql);
      $stmt->execute(array($topic_id, $post_id));

      # Check if we can delete its parent
      TopicRepository::deletePostsIfNoChilds($topic_id, $post[0]['parent_post_id']);
    }
  }

  /**
   * Returns the user objects for every reader of a topic. Readers are the user which are allowed 
   * to read and write to a topic.
   */
  function getReaders($topic_id, $limit = FALSE) {
    assert('!empty($topic_id)');
    $pdo = ctx_getpdo();
    
    $sql = 'SELECT r.user_id id
            FROM topic_readers r 
           WHERE r.topic_id = ?
           ORDER BY created_at';
    if ($limit) {
      $sql .= ' LIMIT ' . $limit;
    }
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array($topic_id));
    $result =  array();
    foreach($stmt->fetchAll() AS $i => $userid) {
      $user = UserRepository::get($userid['id']); 
      if ($user) {
        $result[] = $user;
      }
    }
    return $result;
  }

  /**
   * Returns the user objects for every user ever written or edited a post in that Topic. 
   */
  function getWriters($topic_id, $limit = FALSE) {
    assert('!empty($topic_id)');
    $pdo = ctx_getpdo();
    
    $sql = 'SELECT DISTINCT pe.user_id id FROM post_editors pe WHERE pe.topic_id = ?';
    if ($limit) {
      $sql .= ' LIMIT ' . $limit;
    }
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array($topic_id));
    $result =  array();
    foreach($stmt->fetchAll() AS $i => $userid) {
      $user = UserRepository::get($userid['id']); 
      if ($user) {
        $result[] = $user;
      }
    }
    return $result;
  }

}