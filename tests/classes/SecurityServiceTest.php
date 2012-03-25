<?php

require_once dirname(__FILE__) . '/../../WobbleApi/Autoload.php';

class SecurityServiceTest extends PHPUnit_Framework_TestCase {
  public function testHashPassword() {
    $this->assertEquals(md5(PASSWORD_SALT . 'demoPasswordExtraLong'),
                        SecurityService::hashPassword('demoPasswordExtraLong'));
  }
}