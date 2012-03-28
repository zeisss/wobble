<?php

require_once dirname(__FILE__) . '/../../WobbleApi/Autoload.php';

class InputSanitizerTest extends PHPUnit_Framework_TestCase {
  function testSanitizeEmail() {
    $this->assertEquals('user@example.com', InputSanitizer::sanitizeEmail("user@example.com "));
    $this->assertEquals('user@example.com', InputSanitizer::sanitizeEmail("\tuser@example.com"));
    $this->assertEquals('user@example.com', InputSanitizer::sanitizeEmail("user@example.com\n"));
  }
  
  public function testSanitizePostContent() {
    # Currently sanitizePostContent() only cleans the links via sanitizeLinks()
    $input = ' asd <a href="http://example.com">Click me</a>';
    $expected = 'asd <a href="http://example.com">Click me</a>';
    
    $this->assertEquals($expected, InputSanitizer::sanitizePostContent($input));
  }
}