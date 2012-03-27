<?php
class HttpJsonRpcServer extends JsonRpcServer {
  /**
   * @codeCoverageIgnore
   */
  protected function getRequestBody() {
    return file_get_contents('php://input');
  }

  /**
   * @codeCoverageIgnore
   */
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