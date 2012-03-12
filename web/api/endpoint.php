<?php
##############################################################
## Endpoint for JSON-RPC 2.0 Calls. 
##############################################################
global $JSONRPC_CONFIG;
$JSONRPC_CONFIG = array('methods' => array());

require_once 'config.php';
require_once WOBBLE_HOME . '/WobbleApi/jsonrpc.php';
require_once WOBBLE_HOME . '/WobbleApi/context.php'; # introduces session setup, db connection, utility classes, ...
require_once WOBBLE_HOME . '/WobbleApi/wobble_handlers.php'; # Defines which Wobble Funs are exported
require_once WOBBLE_HOME . '/WobbleApi/handlers/jsonrpc_system.php'; # Exports the default system.listMethods and echo APICalls

if (defined('SIMULATE_LAG') && SIMULATE_LAG) {
  // Decrease the performance
  usleep(1000 * rand(100, 3000));
}

$server = new HttpJsonRpcServer();
foreach($JSONRPC_CONFIG['methods'] as $function) {
  $server->addFunction($function);
}
$server->handleHttpRequest();