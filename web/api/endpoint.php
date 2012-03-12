<?php
##############################################################
## Endpoint for JSON-RPC 2.0 Calls. 
##############################################################

require_once 'config.php';
if (!defined('WOBBLE_HOME')) {
  header('x-error-message: not configured', true, 500);
  die('Reconfigure your server. No WOBBLE_HOME provided');
}
require_once WOBBLE_HOME . '/WobbleApi/JsonRpcServer.php'; # Basic RPC Server
require_once WOBBLE_HOME . '/WobbleApi/context.php'; # introduces session setup, db connection, utility classes, ...
require_once WOBBLE_HOME . '/WobbleApi/WobbleJsonRpcServer.php'; # Defines which Wobble Funs are exported

if (defined('SIMULATE_LAG') && SIMULATE_LAG) {
  // Decrease the performance
  usleep(1000 * rand(100, 3000));
}

$request_server = new WobbleJsonRpcServer();
$request_server->handleHttpRequest();