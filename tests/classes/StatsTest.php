<?php

require_once dirname(__FILE__) . '/../../WobbleApi/Autoload.php';

class StatsTest extends PHPUnit_Framework_TestCase {
  private static $test_stat = 'test.stats';

  private function getValue($key) {
    $pdo = ctx_getpdo();
    $sql = 'SELECT value FROM `statistics` WHERE name = ?';
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array($key));
    $result =  $stmt->fetch();

    if ($result !== false) {
      return intval($result['value']);
    }
    return null;
  }

  public function setUp() {
    // Just create an initial key
    Stats::incr(self::$test_stat);
  }

  public function testClear() {
    Stats::incr(self::$test_stat);
    $this->assertNotNull(self::getValue(self::$test_stat));

    Stats::clear(self::$test_stat);
    $this->assertNull(self::getValue(self::$test_stat));
  }

  public function testIncrementNonExistent() {
    Stats::clear(self::$test_stat);
    Stats::incr(self::$test_stat);
    $new_value = self::getValue(self::$test_stat);
    $this->assertEquals(1, $new_value, 'Expected $value to be 1');
  }

  public function testIncrementByDefault() {
    $value = self::getValue(self::$test_stat);
    Stats::incr(self::$test_stat);
    $new_value = self::getValue(self::$test_stat);
    $this->assertEquals($value + 1, $new_value, 'Expected $value to be incremented by 1');
  }

  public function testIncrementByOne() {
    $value = self::getValue(self::$test_stat);
    Stats::incr(self::$test_stat, 99);
    $new_value = self::getValue(self::$test_stat);
    $this->assertEquals($value + 99, $new_value, 'Expected $value to be incremented by 99');
  }

  public function testSet() {
    $old_value = self::getValue(self::$test_stat);
    $old_value += 124;

    Stats::update(self::$test_stat, $old_value);
    $new_value = self::getValue(self::$test_stat);
    $this->assertEquals($old_value, $new_value, 'Expected $value to be set to ' . $old_value);
  }
}