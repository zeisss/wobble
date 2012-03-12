<?php
##############################################################
## Endpoint for JSON-RPC 2.0 Calls. 
##############################################################
global $JSONRPC_CONFIG;
$JSONRPC_CONFIG = array('methods' => array());

require_once 'config.php';
if (!defined('WOBBLE_HOME')) {
  header('x-error-message: not configured', true, 500);
  die('Reconfigure your server. No WOBBLE_HOME provided');
}
require_once WOBBLE_HOME . '/WobbleApi/jsonrpc.php';
require_once WOBBLE_HOME . '/WobbleApi/context.php'; # introduces session setup, db connection, utility classes, ...
require_once WOBBLE_HOME . '/WobbleApi/wobble_handlers.php'; # Defines which Wobble Funs are exported
require_once WOBBLE_HOME . '/WobbleApi/handlers/jsonrpc_system.php'; # Exports the default system.listMethods and echo APICalls

if (defined('SIMULATE_LAG') && SIMULATE_LAG) {
  // Decrease the performance
  usleep(1000 * rand(100, 3000));
}

$server = new HttpJsonRpcServer();
$server->setConfig($JSONRPC_CONFIG);
$server->handleHttpRequest();