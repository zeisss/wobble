<?php

class JsonRpcServer {
  private $config = array();

  public function __construct() {
  }

  public function addFunction($func) {
    $this->config['methods'][] = $func;
  }

  public function handleRequest($request) {
    if ($request === NULL) {
      return jsonrpc_error(-32700, "Parse error");
    }

    # Is this a batch request? Route it as a batch request
    if (isset($request[0])) {
      return $this->processBatch($request);
    } else {
      return $this->processCall($request);
    }
  }

  public function processBatch($batch) {
    $result = array();

    foreach ($requests as $subrequest) {
      $subresult = handle_jsonrpc_request($subrequest);
      if ($subresult !== NULL) {
        $result[] = $subresult;
      }
    }

    return $result;
  }
  public function processCall($call) {
    return handle_jsonrpc_request($call);
  }
}

class HttpJsonRpcServer extends JsonRpcServer {
  protected function getRequestBody() {
    return file_get_contents('php://input');
  }
  protected function setResponseBody($response) {
    header('Content-Type: application/json');
    die($response);
  }
  public function handleHttpRequest() {
    $requestBody = $this->getRequestBody();
    $request = json_decode($requestBody, TRUE);
    $response = $this->handleRequest($request);
    $this->setResponseBody(json_encode($response));
  }
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
          require_once(WOBBLE_HOME . '/WobbleApi/handlers/' . $export['file']);
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
