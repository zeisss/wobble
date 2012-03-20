<?php
##############################################################
## Endpoint for JSON-RPC 2.0 Calls. 
##############################################################

# WOBBLE_HOME can be provided by the PHP Environment, e.g. through a .htaccess file
# It describes, where other script files are located.
if (!defined('WOBBLE_HOME')) {
  define('WOBBLE_HOME', dirname(__FILE__) . '/../..');
}
require_once WOBBLE_HOME . '/WobbleApi/Autoload.php';

# Handle the request
$request_server = new WobbleJsonRpcServer();
$request_server->handleHttpRequest();