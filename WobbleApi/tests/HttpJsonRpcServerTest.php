<?php
class HttpJsonRpcServerTest extends PHPUnit_Framework_TestCase {
  public function testHandleHttpRequest() {
    $server = $this->getMock('HttpJsonRpcServer', array('getRequestBody', 'setResponseBody'));

    $server->expects($this->once())->method('getRequestBody')->will($this->returnValue(
      '{"jsonrpc":"2.0","id":"1", "method":"echo","params":"Hello World"}'
    ));
    $server->expects($this->once())->method('setResponseBody')
           ->with($this->equalTo('{"jsonrpc":"2.0","result":"Hello World","id":"1"}'));

    $server->handleHttpRequest();
  }
}