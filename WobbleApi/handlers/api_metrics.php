<?php
/**
 * Returns the version of the API.
 *
 * input = {}
 * result = [metric()]
 * metric = {[type: type(),] [help: string(),] name: string(), values: values()}
 * type = "gauge" | "counter"
 * tag = string() "=\"" string() "\"" tag ["," tag]
 * values = value() | [{tag(): value()}]
 * value = float64()
 */
function wobble_metrics($params) {
	$counter_stats = [
		## Notifications
		['name' => 'notification_connection_aborted', 'type' => 'counter',
		 'help' => 'Number of time notification fetching has aborted due to an aborted connection.'],
		['name' => 'notification_oot', 'type' => 'counter',
		 'help' => 'Number of notification fetched that have reached the out-of-time limit.'],
		['name' => 'notification_pushed_user', 'type' => 'counter'],
		['name' => 'notification_pushed_session', 'type' => 'counter'],
		['name' => 'notification_fetch_count', 'type' => 'counter'],
		['name' => 'notification_fetch_sum', 'type' => 'counter'],

		## HTTP API
		/*[
			'name' => 'http_request_duration_microseconds_count',
			'type' => 'counter',
			'help' => 'Number of HTTP requests measured.'
		],

		[
			'name' => 'http_request_duration_microseconds_sum',
			'type' => 'counter',
			'help' => 'Sum of all HTTP request durations observed.'
		]*/
	];

	$result = [];
	foreach($counter_stats as $m) {
		$value = Stats::getValue($m['name']);
		if (empty($value)) {
			$value = 0.0;
		}
		$result[] = array(
			'type' => $m['type'],
			'name' => $m['name'],
			'help' => @$m['help'],
			'values' => $value,
		);
	}

	$result[] = [
		'name' => 'jsonrpc_api_calls', 'type' => 'counter',
		'values' => Stats::getValuesByPrefix('jsonrpc_api_calls{')
	];
	$result[] = [
		'name' => 'jsonrpc_api_errors', 'type' => 'counter',
		'values' => Stats::getValuesByPrefix('jsonrpc_api_errors')
	];

	$result[] = array(
		'type' => 'histogram',
		'name' => 'http_request_duration_seconds',
		'help' => 'Request duration bucket',
		'values' => Stats::getValuesByPrefix('http_request_duration_seconds_')
	);

	$result[] = array(
		'type' => 'histogram',
		'name' => 'jsonrpc_api_call_duration_seconds',
		'help' => 'jsonrpc api call request duration bucket',
		'values' => Stats::getValuesByPrefix('jsonrpc_api_call_duration_seconds_')
	);

	## Model Gauges
	### Users
	$result[] = array(
		'type' => 'gauge',
		'name' => 'users_online_count',
		'help' => 'Users that have a living session active in the last 5 minutes.',
		'values' => SessionService::getOnlineUserCount()
	);
	$result[] = array(
		'type' => 'gauge',
		'name' => 'users_count',
		'help' => 'Users total',
		'values' => UserRepository::getUserCount()
	);

	### Sessions
	$result[] = array(
		'type' => 'gauge',
		'name' => 'session_online_count',
		'help' => 'Living session active in the last 5 minutes.',
		'values' => SessionService::getOnlineSessionCount()
	);
	$result[] = array(
		'type' => 'gauge',
		'name' => 'session_count',
		'help' => 'Total number of session in the DB.',
		'values' => SessionService::getTotalSessionCount()
	);

	$result[] = array(
		'type' => 'gauge',
		'name' => 'sessions_last_gc_seconds',
		'help' => 'Time of the last GC since unix epoch in seconds.',
		'values' => Stats::getValue('sessions_last_gc_seconds'),
	);

	$result[] = array(
		'type' => 'gauge',
		'name' => 'stats_last_gc_seconds',
		'help' => 'Time of the last GC since unix epoch in seconds.',
		'values' => Stats::getValue('wobble_stats_last_gc_seconds'),
	);

	### Topics
	$result[] = array(
		'type' => 'gauge',
		'name' => 'topics_count',
		'help' => 'Number of topics',
		'values' => sizeof(TopicRepository::listTopics()),
	);
	$result[] = array(
		'type' => 'gauge',
		'name' => 'topics_orphaned_count',
		'help' => 'Number of topics',
		'values' => TopicRepository::getOrphanedTopicCount(),
	);


	### Posts
	$result[] = array(
		'type' => 'gauge',
		'name' => 'posts_count',
		'help' => 'Number of posts in all topics',
		'values' => PostRepository::getPostCount(),
	);
	$result[] = array(
		'type' => 'gauge',
		'name' => 'posts_orphaned_count',
		'help' => 'Number of posts in all topics',
		'values' => PostRepository::getOrphanedPostCount(),
	);
	$result[] = array(
		'type' => 'gauge',
		'name' => 'posts_last_gc_seconds',
		'help' => 'Time of the last GC since unix epoch in seconds.',
		'values' => Stats::getValue('wobble_posts_last_gc_seconds'),
	);
	return $result;
}
