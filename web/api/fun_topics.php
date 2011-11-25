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
		$stmt = $pdo->prepare('SELECT t.id id, substr(p.content, 1, 100) abstract FROM topics t, posts p WHERE t.id = p.topic_id AND p.post_id = 1');
		$stmt->execute();
		return $stmt->fetchAll();
	}
	
	function topics_create($params) {
		$pdo = ctx_getpdo();
		
		// Create topic
		$stmt = $pdo->prepare('INSERT INTO topics VALUES (?)');
		$stmt->bindValue(1, $params['id']);
		$stmt->execute();
		
		// Create empty root post
		$stmt = $pdo->prepare('INSERT INTO posts (topic_id, post_id, content)  VALUES (?,?,?)');
		$stmt->bindValue(1, $params['id']);
		$stmt->bindValue(2, 1);
		$stmt->bindValue(3, '');
		$stmt->execute();
		
		// Assoc first post with current user
		require_once 'fun_user.php';
		
		$stmt = $pdo->prepare('INSERT INTO post_editors (topic_id, post_id, user_id) VALUES (?,?,?)');
		$stmt->bindValue(1, $params['id']);
		$stmt->bindValue(2, 1);
		$stmt->bindValue(3, user_get_id());
		$stmt->execute();
		
		return $params['id'];
	}