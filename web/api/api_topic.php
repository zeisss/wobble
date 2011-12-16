<?php
	function _topic_has_access($pdo, $topic_id) {
		$stmt = $pdo->prepare('SELECT COUNT(*) cnt FROM topic_readers r WHERE r.user_id = ? AND r.topic_id = ?');
		$stmt->execute(array(ctx_getuserid(), $topic_id));
		$result = $stmt->fetchAll();
		return $result[0]['cnt'] > 0;
	}
	
	function topic_get_details($params) {
		$self_user_id = ctx_getuserid();
		$topic_id = $params['id'];
		
		ValidationService::validate_not_empty($self_user_id);
		ValidationService::validate_not_empty($topic_id);
		
		if (!_topic_has_access(ctx_getpdo(), $topic_id)) {
			throw new Exception('Illegal Access!');
		}
		
		$pdo = ctx_getpdo();
		
		$users = TopicRepository::getReaders($topic_id);
				
		$stmt = $pdo->prepare('SELECT p.post_id id, p.content, p.revision_no revision_no, p.parent_post_id parent, p.last_touch timestamp, p.deleted deleted, coalesce((select 0 from post_users_read where topic_id = p.topic_id AND post_id = p.post_id AND user_id = ?), 1) unread 
								FROM posts p WHERE p.topic_id = ? ORDER BY created_at');
		$stmt->execute(array($self_user_id, $topic_id));
		$posts = $stmt->fetchAll();
		
		$stmt = $pdo->prepare('SELECT e.user_id id FROM post_editors e WHERE topic_id = ? AND post_id = ?');
		foreach($posts AS $i => $post) {
			# Integer formatting for JSON-RPC result
			$posts[$i]['timestamp'] = intval($posts[$i]['timestamp']);
			$posts[$i]['revision_no'] = intval($posts[$i]['revision_no']);
			$posts[$i]['deleted'] = intval($posts[$i]['deleted']);
			$posts[$i]['unread'] = intval($posts[$i]['unread']);

			# Subobject
			$posts[$i]['users'] = array();
			$stmt->execute(array($topic_id, $post['id']));
			foreach($stmt->fetchAll() AS $post_user) {
				$posts[$i]['users'][] = intval($post_user['id']);
			}
		}
		
		return array (
			'id' => $topic_id,
			'users' => $users,
			'posts' => $posts
		);
	}
	
	
	function topic_add_user($params) {
		$topic_id = $params['topic_id'];
		$user_id = $params['contact_id'];
		
		ValidationService::validate_not_empty($topic_id);
		ValidationService::validate_not_empty($user_id);
		
		$pdo = ctx_getpdo();
		if ( _topic_has_access($pdo, $topic_id) ) {
			$pdo->prepare('REPLACE topic_readers (topic_id, user_id) VALUES (?,?)')->execute(array($topic_id, $user_id));
			
			foreach(TopicRepository::getReaders($topic_id) as $user) {
				NotificationRepository::push($user['id'], array(
					'type' => 'topic_changed',
					'topic_id' => $topic_id
				));
			}

			# NOTE: No need to mark all posts as unread, as we store only the 'read' status, no unread messages.

			return TRUE;
		}
		else {
			throw new Exception('Illegal Access!');
		}
	}
	function topic_remove_user($params) {
		$topic_id = $params['topic_id'];
		$user_id = $params['contact_id'];
		
		ValidationService::validate_not_empty($topic_id);
		ValidationService::validate_not_empty($user_id);
		
		$pdo = ctx_getpdo();
		if ( _topic_has_access($pdo, $topic_id) ) {
			
			foreach(TopicRepository::getReaders($topic_id) as $user) {
				NotificationRepository::push($user['id'], array(
					'type' => 'topic_changed',
					'topic_id' => $topic_id
				));
			}
			# Delete afterwards. The other way around, the deleted user wouldn't get the notification
			$pdo->prepare('DELETE FROM topic_readers WHERE topic_id = ? AND user_id = ?')->execute(array($topic_id, $user_id));

			$pdo->prepare('DELETE FROM post_users_read WHERE topic_id = ? AND user_id = ?')->execute(array($topic_id, $user_id));
			
			return TRUE;
		}
		else {
			throw new Exception('Illegal Access!');
		}
	}
	
	function post_create($params) {
		$self_user_id = ctx_getuserid();
		$topic_id = $params['topic_id'];
		$post_id = $params['post_id'];
		$parent_post_id = $params['parent_post_id'];
		
		ValidationService::validate_not_empty($topic_id);
		ValidationService::validate_not_empty($post_id);
		ValidationService::validate_not_empty($parent_post_id);
		
		$pdo = ctx_getpdo();
		
		if ( _topic_has_access($pdo, $topic_id) ) {
			// Create empty root post
			$stmt = $pdo->prepare('INSERT INTO posts (topic_id, post_id, content, parent_post_id, created_at, last_touch)  VALUES (?,?, "",?, unix_timestamp(), unix_timestamp())');
			$stmt->execute(array($topic_id, $post_id, $parent_post_id));
			
			// Assoc first post with current user
			$stmt = $pdo->prepare('INSERT INTO post_editors (topic_id, post_id, user_id) VALUES (?,?,?)');
			$stmt->bindValue(1, $topic_id);
			$stmt->bindValue(2, $post_id);
			$stmt->bindValue(3, $self_user_id);
			$stmt->execute();
			
			foreach(TopicRepository::getReaders($topic_id) as $user) {
				NotificationRepository::push($user['id'], array(
					'type' => 'post_changed',
					'topic_id' => $topic_id,
					'post_id' => $post_id
				));
			}
			

			TopicRepository::setPostReadStatus(
				$self_user_id, $topic_id, $post_id, 1
			);
			
			return TRUE;
		}
		else {
			throw new Exception('Illegal Access!');
		}
	}
	
	function post_edit($params) {
		$self_user_id = ctx_getuserid();
		$topic_id = $params['topic_id'];
		$post_id = $params['post_id'];
		$content = $params['content'];
		$revision = $params['revision_no'];
		
		ValidationService::validate_not_empty($self_user_id);
		ValidationService::validate_not_empty($topic_id);
		ValidationService::validate_not_empty($post_id);
		ValidationService::validate_not_empty($revision);
		
		$pdo = ctx_getpdo();
		
		if ( _topic_has_access($pdo, $topic_id) ) {
			$stmt = $pdo->prepare('SELECT revision_no FROM posts WHERE topic_id = ? AND post_id = ?');
			$stmt->execute(array($topic_id, $post_id));
			$posts = $stmt->fetchAll();

			if ( sizeof($posts) === 0 ) {
				# Post has already been deleted. Toooo laggy? No idea...
				return NULL;
			}
			
			if ($posts[0]['revision_no'] != $revision) {
				throw new Exception('RevisionNo is not correct. Somebody else changed the post already. (Value: ' . $posts[0]['revision_no'] . ')');
			}
			$pdo->prepare('UPDATE posts SET content = ?, revision_no = revision_no + 1, last_touch = unix_timestamp() WHERE post_id = ? AND topic_id = ?')->execute(array($content, $post_id, $topic_id));
			$pdo->prepare('REPLACE post_editors (topic_id, post_id, user_id) VALUES (?,?,?)')->execute(array($topic_id, $post_id, $self_user_id));


			TopicRepository::setPostReadStatus(
				$self_user_id, $topic_id, $post_id, 1 # Mark post as read for requesting user
			);
			
			foreach(TopicRepository::getReaders($topic_id) as $user) {
				if ( $user['id'] == $self_user_id)  # Skip for requesting user
					continue;

				NotificationRepository::push($user['id'], array(
					'type' => 'post_changed',
					'topic_id' => $topic_id,
					'post_id' => $post_id
				));

				TopicRepository::setPostReadStatus(
					$user['id'], $topic_id, $post_id, 0
				);
			}
			
			return array (
				'revision_no' => ($revision + 1)
			);
		}
		else {
			throw new Exception('Illegal Access!');
		}
	}
	
	function post_delete($params) {
		$self_user_id = ctx_getuserid();
		$topic_id = $params['topic_id'];
		$post_id = $params['post_id'];
		
		ValidationService::validate_not_empty($self_user_id);
		ValidationService::validate_not_empty($topic_id);
		ValidationService::validate_not_empty($post_id);
		ValidationService::check($post_id != '1', 'Root posts cannot be deleted!');
		
		$pdo = ctx_getpdo();
		
		if ( _topic_has_access($pdo, $topic_id) ) {
			$stmt = $pdo->prepare('DELETE FROM post_editors WHERE topic_id = ? AND post_id = ?');
			$stmt->execute(array($topic_id, $post_id));
			
			$pdo->prepare('UPDATE posts SET deleted = 1, content = NULL WHERE topic_id = ? AND post_id = ?')->execute(array($topic_id, $post_id));

			$pdo->prepare('DELETE FROM post_users_read WHERE topic_id = ? AND post_id = ?')->execute(array($topic_id, $post_id));
			
			TopicRepository::deletePostsIfNoChilds($topic_id, $post_id); # Traverses upwards and deletes all posts, if no child exist

			foreach(TopicRepository::getReaders($topic_id) as $user) {
				NotificationRepository::push($user['id'], array(
					'type' => 'post_deleted',
					'topic_id' => $topic_id,
					'post_id' => $post_id
				));
			}
			return TRUE;
		} else {
			throw new Exception('Illegal Access!');
		}
	}
	
	function post_read($params) {
		$user_id = ctx_getuserid();
		$topic_id = $params['topic_id'];
		$post_id = $params['post_id'];
		$read = $params['read'];

		ValidationService::validate_not_empty($user_id);
		ValidationService::validate_not_empty($topic_id);
		ValidationService::validate_not_empty($post_id);
		ValidationService::validate_not_empty($read);

		TopicRepository::setPostReadStatus($user_id, $topic_id, $post_id, $read);
		return TRUE;
	}