<?php
require_once dirname(__FILE__) . '/handlers/jsonrpc_system.php'; # Exports the default system.listMethods and echo APICalls

class JsonRpcServer {
  private $functions = array();

  public function __construct() {
    $this->addFunctions(array(
      # No file, since it always gets included
      array('name' => 'system.listMethods', 'method' => 'jsonrpc_exported_system_list'),
      array('name' => 'echo', 'method' => 'jsonrpc_echo')
    ));
  }

  public function addFunctions($defs) {
    foreach($defs as $def) {
      $this->addFunction($def['method'], isset($def['file']) ? $def['file'] : null, isset($def['name']) ? $def['name'] : $def['method']);
    }
  }

  public function addFunction($method, $file = null, $name = null) {
    if (is_null($name)) {
      $name = $method;
    }

    $def = array();
    $def['method'] = $method;
    $def['name'] = $name;

    if (!is_null($file)) {
      $def['file'] = $file;
    }
    $this->functions[$name] = $def;
  }

  public function getExportedFunctions() {
    return $this->functions;
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

  protected function processBatch($batch) {
    $result = array();

    foreach ($requests as $subrequest) {
      $subresult = $this->processCall($subrequest);
      if ($subresult !== NULL) {
        $result[] = $subresult;
      }
    }

    return $result;
  }

  protected function processCall($request) {
    if ($request === NULL || !is_array($request)) {
      return $this->createError(-32600, "Invalid request");
    }

    if (!isset ($request['method']))  {
      return $this->createError(-32602, 'No method given.', $request['id']);
    }

    if (!isset($request['params'])) {
      $request['params'] = array();
    }
    
    if (!isset($this->functions[$request['method']])) {
      return $this->createError(-32602, 'Unknown method: '. $request['method'], $request['id']);
    }
    
    $export = $this->functions[$request['method']];
    
    try {
      if (isset($export['file'])) {
        require_once(WOBBLE_HOME . '/WobbleApi/handlers/' . $export['file']);
      }
      if (!function_exists($export['method'])) {
        throw new Exception("Expected that {$export['method']} gets defined in {$export['file']}. Function not found.");
      }
    
      $this->beforeCall($request['method'], $request['params']);
      $response = call_user_func($export['method'], $request['params'], $this);
      $this->afterCall($request['method'], $request['params'], $response, null);
    } catch(Exception $e) {
      $this->afterCall($request['method'], $request['params'], null, $e);
      return $this->createError(-32603, $e->getMessage(), $request['id']);
    }

    if (isset($request['id'])) {
      return $this->createResult($request['id'], $response);
    } else {
      return NULL; # only return a result for requests with an id (no id => notification)
    }
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
  
  protected function beforeCall($method, $params) {
  }
  protected function afterCall($method, $params, $result, $error) {
  }
}

class HttpJsonRpcServer extends JsonRpcServer {
  public function __construct() {
    parent::__construct();
  }
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