<?php
	/**
	 * Global Types:
	 * TopicId, PostId = string()
	 * UserId = int()
	 **/
	

	function _topic_has_access($pdo, $topic_id) {
		$stmt = $pdo->prepare('SELECT COUNT(*) cnt FROM topic_readers r WHERE r.user_id = ? AND r.topic_id = ?');
		$stmt->execute(array(ctx_getuserid(), $topic_id));
		$result = $stmt->fetchAll();
		return $result[0]['cnt'] > 0;
	}
	
	/**
	 * Returns the topic object which is specified by the parameter 'id'. The client must be 
	 * authenticated and a member of the topic.
	 *
	 * The resulting object contains two lists of users: Readers and Writers.
	 * The readers are the users that currently belong to a topic. Any user can modify this list.
	 * The writers are all users that have ever written anything into a topic. This is intended as a help for the UI to be able to show the user info for posts of users, that no longer belong to a post.
	 *
	 * input = {'id': TopicId}
	 * result = {'id':TopicId, 'readers': [User], 'writers': [User], 'posts': [Post]} 
	 *
	 * User = {'id': UserId, 'name': string(), 'online': int(), 
	 *         'email': string(), 'img': string()}
	 * 
	 * Post = {'id': PostId, 'content':string(), 'revision_no': int(), 
	 *         'parent': PostId, 'timestamp': int(), 'deleted': int(), 
	 *         'unread': int()}
	 *
	 * 
	 */
	function topic_get_details($params) {
		$self_user_id = ctx_getuserid();
		$topic_id = $params['id'];
		
		ValidationService::validate_not_empty($self_user_id);
		ValidationService::validate_not_empty($topic_id);
		
		if (!_topic_has_access(ctx_getpdo(), $topic_id)) {
			throw new Exception('Illegal Access!');
		}
		
		$pdo = ctx_getpdo();
		
		$readers = TopicRepository::getReaders($topic_id);
		$writers = TopicRepository::getWriters($topic_id);
				
		$stmt = $pdo->prepare('SELECT p.post_id id, p.content, p.revision_no revision_no, 
				p.parent_post_id parent, p.last_touch timestamp, p.deleted deleted, 
				coalesce((select 0 from post_users_read 
						  where topic_id = p.topic_id AND post_id = p.post_id AND user_id = ?), 1) unread 
			 FROM posts p 
			WHERE p.topic_id = ? 
			ORDER BY created_at');
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
			'readers' => $readers,
			'writers' => $writers,
			'posts' => $posts
		);
	}
	
	/**
	 * Adds a user to the specified topic. The user must be authenticated and a reader of the specified topic.
	 * Raises an error if not a member
	 *
	 * input = {'topic_id': TopicId, 'contact_id': UserId}
	 * result = true
	 */
	function topic_add_user($params) {
		$self_user_id = ctx_getuserid();
		$topic_id = $params['topic_id'];
		$user_id = $params['contact_id'];
		
		ValidationService::validate_not_empty($self_user_id);
		ValidationService::validate_not_empty($topic_id);
		ValidationService::validate_not_empty($user_id);
		
		$pdo = ctx_getpdo();
		if ( _topic_has_access($pdo, $topic_id) ) {
			TopicRepository::addReader($topic_id, $user_id);
			
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

	/**
	 * Removes a user from a topic. Any read/unread message status or other user information regarding the 
	 * topic are immediately destroyed. 
	 *
	 * E.g. if the user gets later readded to the topic, all posts are marked as unread.
	 *
	 * The client must be authenticated and a reader of the topic. 
	 * An exception is raised, if the client is not a member.
	 * 
	 * input = {'topic_id': TopicId, 'contact_id': UserId}
	 * result = TRUE
	 */
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
			TopicRepository::removeReader($topic_id, $user_id);
			
			return TRUE;
		}
		else {
			throw new Exception('Illegal Access!');
		}
	}
	
	/**
	 * Creates a new post as a child in the given topic. The post is created for the current 
	 * user and has an empty content. A notification is sent to all readers of the topic to inform
	 * them about the new post.
	 *
	 * The client must be authenticated and a reader of the given topic.
	 *
	 * input = {'topic_id': TopicId, 'post_id': PostId, 'parent_post_id': PostId}
	 * result = true
	 */
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
			TopicRepository::createPost($topic_id, $post_id, $self_user_id, $parent_post_id);
			
			foreach(TopicRepository::getReaders($topic_id) as $user) {
				NotificationRepository::push($user['id'], array(
					'type' => 'topic_changed',
					'topic_id' => $topic_id
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
	
	/**
	 * Changes the content of a post. The revision_no must match the current revision number, 
	 * otherwise an exception will be thrown. This prevents overwritting changes of other users.
	 * The new revision_no is returned.
	 *
	 * Upon a change, the read status of the post for all other users will resetted. Also a 'post_changed'
	 * notification will be generated for all other readers.
	 *
	 * The client must be authenticated and the user must be a reader of the topic.
	 *
	 * input = {'topic_id': TopicId, 'post_id': PostId, 'content': string(), 'revision_no': int()}
	 * result = {'revision_no': int()}
	 */
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
		ValidationService::validate_content($content);
		
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

			foreach(TopicRepository::getReaders($topic_id) as $user) {
				NotificationRepository::push($user['id'], array(
					'type' => 'post_changed',
					'topic_id' => $topic_id,
					'post_id' => $post_id
				));

				TopicRepository::setPostReadStatus(
					$user['id'], $topic_id, $post_id, 0
				);
			}

			TopicRepository::setPostReadStatus(
				$self_user_id, $topic_id, $post_id, 1 # Mark post as read for requesting user
			);
			
			return array (
				'revision_no' => ($revision + 1)
			);
		}
		else {
			throw new Exception('Illegal Access!');
		}
	}
	
	/**
	 * Marks the post as deleted, if it has children. Otherwise delete the post completly.
	 * This is due the tree-like arrangement of the posts, so one can only delete a post really from the 
	 * storage, if it has no children which refer to it.
	 *
	 * The client must be authenticated and the user must be a reader of the topic.
	 *
	 * input = {'topic_id': TopicId, 'post_id': PostId}
	 * result = true
	 */
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
	
	/**
	 * Sets the (un)read status of a post.
	 *
	 * The client must be authenticated and the user must be a reader of the topic.
	 *
	 * input = {'topic_id': TopicId, 'post_id': PostId, 'read': 0|1}
	 * result = true
	 */
	function post_read($params) {
		$user_id = ctx_getuserid();
		$topic_id = $params['topic_id'];
		$post_id = $params['post_id'];
		$read = $params['read'];
		$pdo = ctx_getpdo();

		ValidationService::validate_not_empty($user_id);
		ValidationService::validate_not_empty($topic_id);
		ValidationService::validate_not_empty($post_id);
		ValidationService::validate_not_empty($read);
		
		if ( _topic_has_access($pdo, $topic_id) ) {
			TopicRepository::setPostReadStatus($user_id, $topic_id, $post_id, $read);
		} else {
			throw new Exception('Illegal Access!');
		}
		return TRUE;
	}