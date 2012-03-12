<?php

class JsonRpcServer {
  private $config = array();

  public function __construct() {
  }

  public function setConfig($config) {
    $this->config = $config;
  }

  public function handleRequest($request) {
    if ($request === NULL) {
      return $this->createError(-32700, "Parse error");
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
      $subresult = $this->processCall($subrequest);
      if ($subresult !== NULL) {
        $result[] = $subresult;
      }
    }

    return $result;
  }

  public function processCall($request) {
    if ($request === NULL || !is_array($request)) {
      return $this->createError(-32600, "Invalid request");
    }

    if (!isset ($request['method']))  {
      return $this->createError(-32602, 'No method given.', $request['id']);
    }

    if (!isset($request['params'])) {
      $request['params'] = array();
    }

    # Iterate over all given methods
    foreach($this->config['methods'] AS $export) {
      if ($export['name'] === $request['method']) {

        try {
          if (isset($this->config['callback_before'])) {
            call_user_func($this->config['callback_before'],
                    $request['method'], $request['params']);
          }
          if (isset($export['file'])) {
            require_once(WOBBLE_HOME . '/WobbleApi/handlers/' . $export['file']);
          }
          if (!function_exists($export['method'])) {
            throw new Exception("Expected that {$export['method']} gets defined in {$export['file']}. Function not found.");
          }

          $response = call_user_func($export['method'], $request['params']);

          if (isset($this->config['callback_after'])) {
            call_user_func($this->config['callback_after'],
                           $request['method'], $request['params'], $response, null);
          }
        } catch(Exception $e) {
          if (isset($this->config['callback_after'])) {
            call_user_func($this->config['callback_after'],
                           $request['method'], $request['params'], null, $e);
          }
          return $this->createError(-32603, $e->getMessage(), $request['id']);
        }

        if (isset($request['id'])) {
          return $this->createResult($request['id'], $response);
        } else {
          return NULL; # only return a result for requests with an id (no id => notification)
        }
      }
    }
    return $this->createError(-32602, 'Unknown method: '. $request['method'], $request['id']);
  }

  protected function createResult($requestId, $resultObject) {
    $result = array(
      'jsonrpc' => '2.0',
      'result' => $resultObject
    );
    if ($requestId) {
      $result['id'] = $requestId;
    }
    return $result;
  }

  protected function createError($errorNo, $message, $id = false) {
    $result =  array(
      'jsonrpc' => '2.0',
      'error' => array (
        'code' => $errorNo,
        'message' => $message
      )
    );
    if ($id) {
      $result['id'] = $id;
    }
    return $result;
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
