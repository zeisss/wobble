<?php

global $PDO_CONTEXT_VAR;
$PDO_CONTEXT_VAR = null;
function ctx_getpdo() {
  global $PDO_CONTEXT_VAR;

  if ( $PDO_CONTEXT_VAR == null ) {
    $pdo = new PDO(PDO_URL, PDO_USER, PDO_PASSWORD,
      array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES \'UTF8\''));
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); # Raise exceptions, so they get logged by Airbrake, or whatever
    $pdo->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, false);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $PDO_CONTEXT_VAR = $pdo;
  }
  return $PDO_CONTEXT_VAR;
}


	require_once dirname(__FILE__) . '/../../web/api/config.php';

	# TODO: Replace with __autoload()
	require_once dirname(__FILE__).'/../../web/api/classes/NotificationRepository.class.php';
	require_once dirname(__FILE__).'/../../web/api/classes/TopicRepository.class.php';
	require_once dirname(__FILE__).'/../../web/api/classes/UserRepository.class.php';
	require_once dirname(__FILE__).'/../../web/api/classes/ContactsRepository.class.php';
	require_once dirname(__FILE__).'/../../web/api/classes/SecurityService.class.php';
	require_once dirname(__FILE__).'/../../web/api/classes/SessionService.class.php';
	require_once dirname(__FILE__).'/../../web/api/classes/ValidationService.class.php';
	require_once dirname(__FILE__).'/../../web/api/classes/TopicMessagesRepository.class.php';
	require_once dirname(__FILE__).'/../../web/api/classes/UserArchivedTopicRepository.class.php';
	require_once dirname(__FILE__).'/../../web/api/classes/InputSanitizer.class.php';
	
	$allTopicIds = TopicRepository::listTopics();
#	$allTopicIds = array('7-1328992318043');
	$pdo = ctx_getpdo();
	
	$update = $pdo->prepare('UPDATE posts SET intended_post = ? WHERE topic_id = ? AND post_id = ?');
	
	foreach ($allTopicIds as $topic_id) {

		
		$postTree = array();
		
		$stmt = $pdo->prepare('SELECT p.post_id id, p.parent_post_id parent, 
			                            p.last_touch timestamp, p.deleted deleted,
	                                p.intended_post intended_post
	     FROM posts p
	    WHERE p.topic_id = ?
	    ORDER BY created_at');
	  $stmt->execute(array($topic_id));
	  $posts = $stmt->fetchAll();
	
	  if (count($posts) < 3) {
      continue;
	  }

		print "\n\n===> $topic_id\n";	
	  foreach ($posts as $post) {
			if (isset($postTree[$post['parent']])) {
				$update->execute(array(1, $topic_id, $post['id']));
				print "\n=>" . $post['id']. "\n";
			} else {
				$update->execute(array(0, $topic_id, $post['id']));
				print "+ " . $post['id'] . "\n";
			}
			$postTree[$post['parent']] = true;
			#var_dump($post);
		}
	}
