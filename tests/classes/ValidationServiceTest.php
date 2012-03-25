<?php

require_once dirname(__FILE__) . '/../../WobbleApi/Autoload.php';

class ValidationServiceTest extends PHPUnit_Framework_TestCase {
  public function testValidateTopicId() {
    ValidationService::validate_topicid('1241-124123-1241231221234567899');
    ValidationService::validate_topicid('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    ValidationService::validate_topicid('-----');
  }

  public function testInvalidTopicIds() {
    try {
      ValidationService::validate_topicid('$3214%!');
      $this->fail('No exception raised for invalid topicid.');
    } catch (Exception $e) {}
      
    try {
      ValidationService::validate_topicid('1241-124123-1241231221234567899');
      $this->fail('No exception raised for invalid topicid.');
    } catch (Exception $e) {}
  }

  public function testValidateEmail() {
    ValidationService::validate_email('demo@acme.com');
    # ValidationService::validate_email('demo(at)acme.com');

    try {
      ValidationService::validate_email('');
      $this->fail('validate_email() should raise exception for empty string.');
    } catch (Exception $e) {}
      
    try {
      ValidationService::validate_email('demo acme.com');
      $this->fail('validate_email() should raise exception when not @ is found.');
    } catch (Exception $e) {}
  }

  public function testValidateNotEmpty() {
    ValidationService::validate_not_empty('adam');
    try {
      ValidationService::validate_not_empty("\t");
      $this->fail('validate_not_empty() should raise an exception for a tab as input.');
    } catch(Exception $e) {}
  }

  public function testValidateList() {
    ValidationService::validate_list('adam', array('eva', 'adam', 'snake'));
  }

  public function testValidateContent() {
    ValidationService::validate_content('Here is some code to look at: &lt;script>var harmless = true;&lt;script>');
    try {
      ValidationService::validate_content('Bla bla. Now secret script Tag!<script>alert("Hacked!");</script> You haven&quot;t seen that!');
      $this->fail('validate_content should raise an exception for a script tag.');
    } catch (Exception $e) {}
  }
}
