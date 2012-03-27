<?php
require_once dirname(__FILE__) . '/../WobbleApi/JsonRpcServer.php';

class JsonRpcServerTest extends PHPUnit_Framework_TestCase {
  public function testRegisterFunctions() {
    $server = new JsonRpcServer();
    $server->addFunction('demo');
    $server->addFunction('demo2');

    $functions = $server->getExportedFunctions();
    $this->assertContains(array('method' => 'demo', 'name' => 'demo'), $functions);
  }

  public function testBeforeAndAfterAreInvoked() {
    $server = $this->getMock('JsonRpcServer', array('beforeCall', 'afterCall'));
    $server->expects($this->once())->method('beforeCall');
    $server->expects($this->once())->method('afterCall');

    $server->handleRequest(array(
      'method' => 'echo', 'params' => array('Hello World')
    ));
  }

  public function testSingleCallsProcessCall() {
    $server = $this->getMock('JsonRpcServer', array('processCall'));
    $server->expects($this->once())->method('processCall');
    
    $server->handleRequest(
      array('jsonrpc' => '2.0', 'id' => '123', 'method' => 'echo', 'params' => array('Hello World'))
    );
  }

  public function testBatchCallsProcessCall() {
    $server = $this->getMock('JsonRpcServer', array('processCall'));
    $server->expects($this->exactly(2))->method('processCall');

    $server->handleRequest(array(
      array('jsonrpc' => '2.0', 'id' => '123', 'method' => 'echo', 'params' => array('Hello World')),
      array('jsonrpc' => '2.0', 'id' => '123', 'method' => 'echo', 'params' => array('Hello World'))
    ));
  }

  public function testInvalidCalls() {
    $server = new JsonRpcServer();

    $expected = array(
      'jsonrpc' => '2.0',
      'id' => '234',
      'error' => array('code' => -32602, 'message' => 'Unknown method: non_existing'),
    );
    $result = $server->handleRequest(array(
      'jsonrpc' => '2.0',
      'id' => '234',
      'method' => 'non_existing',
    ));
    $this->assertEquals($expected, $result);

    $expected = array(
      'jsonrpc' => '2.0',
      'error' => array('code' => -32600, 'message' => 'Invalid request'),
    );
    $result = $server->handleRequest('invalid stuff');
    $this->assertEquals($expected, $result);

    $expected = array(
      'jsonrpc' => '2.0',
      'error' => array('code' => -32700, 'message' => 'Parse error'),
    );
    $result = $server->handleRequest(null);
    $this->assertEquals($expected, $result);

    $expected = array(
      'jsonrpc' => '2.0',
      'error' => array('code' => -32602, 'message' => 'No method given.'),
    );
    $result = $server->handleRequest(array());
    $this->assertEquals($expected, $result);
  }

  public function testExceptionInMethod() {
    $errorException = function() { throw new Exception('failed'); };
    $server = new JsonRpcServer();
    $server->addFunction($errorException, null, 'demo');

    $expected = array(
      'jsonrpc' => '2.0',
      'id' => '1',
      'error' => array('code' => -32603, 'message' => 'failed'),
    );
    $result = $server->handleRequest(array(
      'jsonrpc' => '2.0',
      'id' => '1',
      'method' => 'demo',
      'params' => 'foobar'
    ));
    
    $this->assertEquals($expected, $result);
  }

  public function testBatchJsonProtocolSingle() {
    $server = new JsonRpcServer();

    $expected = array(
      array('jsonrpc' => '2.0', 'id' => '123', 'result' => array('Hello World'))
    );
    $result = $server->handleRequest(array(
      array('jsonrpc' => '2.0', 'id' => '123', 'method' => 'echo', 'params' => array('Hello World'))
    ));
    $this->assertEquals($expected, $result);
  }

  public function testBatchJsonProtocolMulti() {
    $server = new JsonRpcServer();

    $expected = array(
      array('jsonrpc' => '2.0', 'id' => '123', 'result' => array('Hello World')),
      array('jsonrpc' => '2.0', 'id' => '345', 'result' => array('Möööp'))
    );
    $result = $server->handleRequest(array(
      array('jsonrpc' => '2.0', 'id' => '123', 'method' => 'echo', 'params' => array('Hello World')),
      array('jsonrpc' => '2.0', 'id' => '345', 'method' => 'echo', 'params' => array('Möööp'))
    ));
    $this->assertEquals($expected, $result);
  }
  
  public function testDefinitionExistsButFunctionDoesNot() {
    $server = new JsonRpcServer();
    $server->addFunction('foobar');

    $expected = array(
      'jsonrpc' => '2.0',
      'id' => '1',
      'error' => array(
        'code' => -32603, 
        'message' => "Function foobar was exported, but cannot be found."
      ),
    );
    $result = $server->handleRequest(array(
      'jsonrpc' => '2.0',
      'id' => '1',
      'method' => 'foobar'
    ));
    
    $this->assertEquals($expected, $result);
  }

  public function testBuiltinFunctions() {
    # By default it comes with 'echo' and 'system.listMethods'
    $server = new JsonRpcServer();

    $functions = $server->getExportedFunctions();
    $this->assertTrue(isset($functions['echo']));
    $this->assertTrue(isset($functions['system.listMethods']));

    # System.listMethods
    $expected = array(
      'jsonrpc' => '2.0',
      'id' => '1',
      'result' => array(
        'echo', 'system.listMethods'
      ),
    );
    $result = $server->handleRequest(array(
      'jsonrpc' => '2.0',
      'id' => '1',
      'method' => 'system.listMethods'
    ));
  
    # System.listMethods
    $expected = array(
      'jsonrpc' => '2.0',
      'id' => '1',
      'result' => array(
        'Hello', 'Demo'
      ),
    );
    $result = $server->handleRequest(array(
      'jsonrpc' => '2.0',
      'id' => '1',
      'method' => 'echo',
      'params' => array('Hello', 'Demo')
    ));    
  }
}
