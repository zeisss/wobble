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
	$single_stats = [
		## Notifications
		['name' => 'notification_pushed_user', 'type' => 'counter'],
		['name' => 'notification_pushed_session', 'type' => 'counter'],
		['name' => 'notification_fetch_count', 'type' => 'counter'],
		['name' => 'notification_fetch_sum', 'type' => 'counter'],

		## HTTP API
		[
			'name' => 'http_request_duration_microseconds_count',
			'type' => 'counter',
			'help' => 'Number of HTTP requests measured.'
		],

		[
			'name' => 'http_request_duration_microseconds_sum',
			'type' => 'counter',
			'help' => 'Sum of all HTTP request durations observed.'
		]
	];

	$result = [];
	foreach($single_stats as $m) {
		$value = Stats::getValue($m['name']);
		if (empty($value)) {
			$value = 0.0;
		}
		$result[] = array(
			'type' => $m['type'],
			'name' => $m['name'],
			'help' => $m['help'],
			'values' => $value,
		);
	}

	$multi_stats = [
		['name' => 'jsonrpc_api_calls', 'type' => 'counter'],
		['name' => 'jsonrpc_api_errors', 'type' => 'counter'],
	];
	foreach($multi_stats as $m) {
		$values = Stats::getValuesByPrefix($m['name']);
		$mapped_values = [];
		foreach($values as $v) {
			$n = $v['name'];
			$i = strpos($n, '{');
			if ($i === FALSE) {
				die('invalid multi metric: ' . $n);
			}
			$n = substr($n, $i + 1, -1);
			$mapped_values[$n] = $v['value'];
		}
		if (empty($mapped_values)) {
			# no need to expose empty metrics
			continue;
		}
		$result[] = array(
			'type' => $m['type'],
			'name' => $m['name'],
			'help' => $m['help'],
			'values' => $mapped_values,
		);
	}

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

	### Topics
	$result[] = array(
		'type' => 'gauge',
		'name' => 'topic_count',
		'help' => 'Number of topics',
		'values' => sizeof(TopicRepository::listTopics()),
	);


	### Posts
	$result[] = array(
		'type' => 'gauge',
		'name' => 'posts_count',
		'help' => 'Number of posts in all topics',
		'values' => PostRepository::getPostCount(),
	);
	return $result;
}
