<?php
	require_once 'fun_user.php';
	
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
		$stmt = $pdo->prepare('SELECT t.id id, substr(p.content, 1, 100) abstract ' . 
		                      'FROM topics t, topic_readers r, posts p ' . 
							  'WHERE r.user_id = ? AND r.topic_id = t.id AND t.id = p.topic_id AND p.post_id = cast(1 as char)');
		$stmt->execute(array(user_get_id()));
		$result = $stmt->fetchAll();
		
		$stmt = $pdo->prepare('SELECT u.id id, u.name name, u.email email, md5(u.email) img FROM users u, topic_readers r WHERE u.id = r.user_id AND r.topic_id = ? LIMIT 3');
		foreach($result AS $i => $topic) {
			$stmt->execute(array($topic['id']));
			$result[$i]['users'] = $stmt->fetchAll();
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
		$stmt->execute(array($params['id'], user_get_id()));
		
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
		$stmt->bindValue(3, user_get_id());
		$stmt->execute();
		
		return $params['id'];
	}