<?php
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
	require_once dirname(__FILE__).'/../../web/api/classes/UserArchivedTopicsRepository.class.php';
	require_once dirname(__FILE__).'/../../web/api/classes/InputSanitizer.class.php';
	
	$allTopicIds = TopicRepository::listTopics();
	
	foreach ($allTopicIds as $topic_id) {
		print $topic_id;
		
	}
