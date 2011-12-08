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
		$stmt = $pdo->prepare('SELECT t.id id, substr(p.content, 1, 100) abstract, (select max(last_touch) from posts WHERE topic_id = t.id) max_last_touch ' . 
		                      'FROM topics t, topic_readers r, posts p ' . 
							  'WHERE r.user_id = ? AND r.topic_id = t.id AND t.id = p.topic_id AND p.post_id = cast(1 as char)' . 
							  'ORDER BY max_last_touch DESC');
		$stmt->execute(array(ctx_getuserid()));
		$result = $stmt->fetchAll();
		
		foreach($result AS $i => $topic) {
			$result[$i]['users'] = $users = TopicRepository::getReaders($topic['id'], 3);
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