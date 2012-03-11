<?php

require_once dirname(__FILE__) . '/../../web/api/context.php';

class InputSanitizerTest extends PHPUnit_Framework_TestCase {
  function testSanitizeEmail() {
    $this->assertEquals('user@example.com', InputSanitizer::sanitizeEmail("user@example.com "));
    $this->assertEquals('user@example.com', InputSanitizer::sanitizeEmail("\tuser@example.com"));
    $this->assertEquals('user@example.com', InputSanitizer::sanitizeEmail("user@example.com\n"));
  }
  
  public function testSanitizeLinks() {
    $this->assertEquals('<a target="_new" href="http://example.com">Click here</a>', 
                        InputSanitizer::sanitizeLinks('<a href="http://example.com">Click here</a>'));
  }
}