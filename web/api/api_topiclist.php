<?php
    /**	
	 * Return a list of topics the user can see. 
	 *
	 * The client must be authenticated.
	 *
	 * input = {}
	 *
	 * result = [MetaTopic]
	 * MetaTopic = {'id': TopicId, 'abstract': string(), 'users': [User], 'max_last_touch': int(), 
	 *              'post_count_unread': int(), 'post_count_total': int()}
	 */
	function topics_list() {
		$self_user_id = ctx_getuserid();

		ValidationService::validate_not_empty($self_user_id);
		
		$pdo = ctx_getpdo();
		$stmt = $pdo->prepare('SELECT 
			  t.id id, 
			  p.content abstract, 
			  (select max(p.last_touch) from posts p WHERE p.topic_id = t.id) max_last_touch, 
			  (select count(*) from posts where topic_id = t.id and deleted = 0) post_count_total, 
			  (select count(*) from post_users_read where topic_id = p.topic_id AND user_id = r.user_id) post_count_read 
		 FROM topics t, topic_readers r, posts p 
		WHERE r.user_id = ? AND r.topic_id = t.id AND t.id = p.topic_id AND p.post_id = cast(1 as char)
		ORDER BY max_last_touch DESC');
		$stmt->execute(array($self_user_id));
		$result = $stmt->fetchAll();
		
		foreach($result AS $i => $topic) {
			$result[$i]['users'] = TopicRepository::getReaders($topic['id'], 3);
			$result[$i]['post_count_total'] = intval($result[$i]['post_count_total']);
			$result[$i]['max_last_touch'] = intval($result[$i]['max_last_touch']);

			# We count read entries in the database, but we need to return the number of unread entries
			$result[$i]['post_count_unread'] = $result[$i]['post_count_total'] - intval($result[$i]['post_count_read']);
			unset($result[$i]['post_count_read']);		
			
			$result[$i]['abstract']	= strip_tags(substr($result[$i]['abstract'], 0, 100));
		}
		
		return $result;
	}
	
	/**
	 * Creates a new topic for the current user.
	 *
	 * The client must be authenticated and a reader of the given topic.
	 * 
	 * input = {'id': TopicId}
	 * result = TopicId
	 *
	 */
	function topics_create($params) {
		$self_user_id = ctx_getuserid();
		$topic_id = @$params['id']; 

		ValidationService::validate_not_empty($self_user_id);
		ValidationService::validate_not_empty($topic_id);
		ValidationService::validate_topicid($topic_id);

		TopicRepository::create($topic_id, $self_user_id);		
		
		return $topic_id;
	}
