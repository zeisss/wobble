<?php
global $JSONRPC_CONFIG;
$JSONRPC_CONFIG = array('methods' => array());

require_once 'config.php';
require_once 'context.php'; # introduces session setup, db connection, utility classes, ...
require_once 'exports.php'; # Defines which Wobble Funs are exported
require_once 'jsonrpc_system.php'; # Exports the default system.listMethods and echo APICalls

##############################################################
## Endpoint for JSON-RPC 2.0 Calls. 
##############################################################


if (defined('SIMULATE_LAG') && SIMULATE_LAG) {
  // Decrease the performance
  usleep(1000 * rand(100, 3000));
}

$requestBody = file_get_contents('php://input');
$request = json_decode($requestBody, TRUE);

if ($request === NULL) {
  return die_json(jsonrpc_error(-32700, "Parse error"));
}

if ($requestBody[0] == '[') { # If the first char was a [, this is a batch request
  die_json(handle_jsonrpc_batch($request));
} else {
  die_json(handle_jsonrpc_request($request));
}


function jsonrpc_export_functions($exportedMethods) {
  global $JSONRPC_CONFIG;

  foreach($exportedMethods AS $m) {
    $entry = array();
    $entry['method'] = $m['method'];

    if (isset($m['file'])) {
      $entry['file'] = $m['file'];
    }

    if (isset($m['name'])) {
      $entry['name'] = $m['name'];
    } else {
      $entry['name'] = $m['method'];
    }

    $JSONRPC_CONFIG['methods'][] = $entry; # Append 
  }
}
function jsonrpc_export_after($func_name) {
  global $JSONRPC_CONFIG;
  $JSONRPC_CONFIG['callback_after'] = $func_name;
}
function jsonrpc_export_before($func_name) {
  global $JSONRPC_CONFIG;
  $JSONRPC_CONFIG['callback_before'] = $func_name;
}
function jsonrpc_result($result, $id = FALSE) {
  $result = array(
    'jsonrpc' => '2.0',
    'result' => $result
  );
  if ($id) {
    $result['id'] = $id;
  }
  return $result;
}
function jsonrpc_error($code, $message, $id = FALSE) {
  $result =  array(
    'jsonrpc' => '2.0',
    'error' => array (
      'code' => $code,
      'message' => $message
    )
  );
  if ($id) { 
    $result['id'] = $id; 
  }
  return $result;
}
function handle_jsonrpc_batch($requests) {
  $result = array();

  foreach ($requests as $subrequest) {
    $subresult = handle_jsonrpc_request($subrequest);
    if ($subresult !== NULL) {
      $result[] = $subresult;
    }
  }

  return $result;
}
function handle_jsonrpc_request($request) {
  global $JSONRPC_CONFIG;

  if ($request === NULL || !is_array($request)) {
    return jsonrpc_error(-32600, "Invalid request");
  }
  if (!isset ($request['method']))  {
    return jsonrpc_error(-32602, 'No method given.', $request['id']);
  }
  if (!isset($request['params'])) {
    $request['params'] = array();
  }

  # Iterate over all given methods
  foreach($JSONRPC_CONFIG['methods'] AS $export) {
    if ($export['name'] === $request['method']) {

      try {
        if (isset($JSONRPC_CONFIG['callback_before'])) {
          call_user_func($JSONRPC_CONFIG['callback_before'], 
                  $request['method'], $request['params']);
        }
        if (isset($export['file'])) {
          require_once($export['file']);
        }
        if (!function_exists($export['method'])) {
          throw new Exception("Expected that {$export['method']} gets defined in {$export['file']}. Function not found.");
        }

        $response = call_user_func($export['method'], $request['params']);

        if (isset($JSONRPC_CONFIG['callback_after'])) {
          call_user_func($JSONRPC_CONFIG['callback_after'], 
                         $request['method'], $request['params'], $response, null);
        }
      } catch(Exception $e) {
        if (isset($JSONRPC_CONFIG['callback_after'])) {
          call_user_func($JSONRPC_CONFIG['callback_after'], 
                         $request['method'], $request['params'], null, $e);
        }
        return jsonrpc_error(-32603, $e->getMessage(), $request['id']);
      }

      if (isset($request['id'])) {
        return jsonrpc_result($response, $request['id']);
      } else {
        return NULL; # only return a result for requests with an id (no id => notification)
      }
    }
  }
  return jsonrpc_error(-32602, 'Unknown method: '. $request['method'], $request['id']);
}

function die_json($result_object) {
  header('Content-Type: application/json');
  die(json_encode($result_object));
}



