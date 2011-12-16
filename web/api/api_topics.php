<?php	
	# Return a list of topics the user can see
	#
	# @return array()
	function topics_list() {
		/*return array (
			array ('id' => '1', 'abstract' => 'Hello World!'),
			array ('id' => '2', 'abstract' => 'You made my day!'),
			array ('id' => '3', 'abstract' => 'TGIF - Thank god its friday!')
		);*/
		
		$pdo = ctx_getpdo();
		$stmt = $pdo->prepare('SELECT 
			  t.id id, 
			  substr(p.content, 1, 200) abstract, 
			  (select max(last_touch) from posts WHERE topic_id = t.id) max_last_touch, 
			  (select count(*) from posts where topic_id = t.id) post_count_total, 
			  (select count(*) from post_users_read where topic_id = p.topic_id AND user_id = r.user_id) post_count_read 
		 FROM topics t, topic_readers r, posts p 
		WHERE r.user_id = ? AND r.topic_id = t.id AND t.id = p.topic_id AND p.post_id = cast(1 as char)
		ORDER BY max_last_touch DESC');
		$stmt->execute(array(ctx_getuserid()));
		$result = $stmt->fetchAll();
		
		foreach($result AS $i => $topic) {
			$result[$i]['users'] = $users = TopicRepository::getReaders($topic['id'], 3);
			$result[$i]['post_count_total'] = intval($result[$i]['post_count_total']);
			$result[$i]['max_last_touch'] = intval($result[$i]['max_last_touch']);

			# We count read entries in the database, but we need to return the number of unread entries
			$result[$i]['post_count_unread'] = $result[$i]['post_count_total'] - intval($result[$i]['post_count_read']);
			unset($result[$i]['post_count_read']);		
			
			$result[$i]['abstract']	= substr(strip_tags($result[$i]['abstract']), 1, 100);
		}
		
		return $result;
	}
	
	function topics_create($params) {
		$pdo = ctx_getpdo();
		
		// Create topic
		$stmt = $pdo->prepare('INSERT INTO topics VALUES (?)');
		$stmt->bindValue(1, $params['id']);
		$stmt->execute();
		
		$stmt = $pdo->prepare('INSERT INTO topic_readers (topic_id, user_id) VALUES (?,?)');
		$stmt->execute(array($params['id'], ctx_getuserid()));
		
		// Create empty root post
		$stmt = $pdo->prepare('INSERT INTO posts (topic_id, post_id, content)  VALUES (?,?,?)');
		$stmt->bindValue(1, $params['id']);
		$stmt->bindValue(2, 1);
		$stmt->bindValue(3, '');
		$stmt->execute();
		
		// Assoc first post with current user
		$stmt = $pdo->prepare('INSERT INTO post_editors (topic_id, post_id, user_id) VALUES (?,?,?)');
		$stmt->bindValue(1, $params['id']);
		$stmt->bindValue(2, 1);
		$stmt->bindValue(3, ctx_getuserid());
		$stmt->execute();
		
		return $params['id'];
	}