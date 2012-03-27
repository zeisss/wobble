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
    # TODO: Refactor to use a mock
    $input = '<a href="http://example.com">Click me</a>';
    $expected = '<a target="_new" href="http://example.com">Click me</a>';
    
    $this->assertEquals($expected, InputSanitizer::sanitizePostContent($input));
  }
  
  public function testSanitizeLinks() {
    $this->assertEquals('<a target="_new" href="http://example.com">Click here</a>', 
                        InputSanitizer::sanitizeLinks('<a href="http://example.com">Click here</a>'));

    # Link already added
    $this->assertEquals('<a target="_new" href="http://example.com">Click here</a>', 
                        InputSanitizer::sanitizeLinks('<a target="_new" href="http://example.com">Click here</a>'));

  }
  public function testSanitizeLinkException() {
    try {
      $value = InputSanitizer::sanitizeLinks('<a href="http://example.com" target="_new">Click here</a>');
      $this->fail('No exception was thrown.');
    } catch (SanitizeException $e) {
      $this->assertEquals('Invalid content. Do not use target attribute in links(a): SAN-001',
                          $e->getMessage());
    }
  }
  
  public function testSanitizeLinksWithInvalidHtml() {
    $input = '<a href="http://example.com">Click me</a><a ';
    $expected = '<a target="_new" href="http://example.com">Click me</a><a ';

    $this->assertEquals($expected, InputSanitizer::sanitizePostContent($input));
  }
}