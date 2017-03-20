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
	$metrics = [
		'requests.counter' => [
			'name' => 'http_requests', 
			'help' => 'Number of requests handled',
			'type' => 'counter'
		],
		'requests.time' => [
			'name' => 'http_request_duration_microseconds',
			'help' => ' The HTTP request latencies in microseconds.',
			'type' => 'counter'
		],
		'jsonrpc.errors' => [
			'name' => 'jsonrpc_errors',
			'help' => '',
			'type' => 'counter'
		],
		'jsonrpc.success' => [
			'name' => 'jsonrpc_success',
			'help' => '',
			'type' => 'counter'
		],
	];

	$result = [];
	foreach($metrics as $key => $m) {
		$value = Stats::getValue($key);
		$result[] = array(
			'type' => $m['type'],
			'name' => $m['name'],
			'help' => $m['help'],
			'values' => $value,
		);
	}
	return $result;
}
