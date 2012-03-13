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

  public function testNonExistingMethodCall() {
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
      'params' => array()
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
}