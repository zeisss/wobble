<?php

class Stats { 
  public static function gc() {
    $pdo = ctx_getpdo();
    # delete all stats that were not updated in the last 7 days
    $sql = 'DELETE FROM `statistics` WHERE last_update < (unix_timestamp() - 60 * 60 * 24 * 7)';
    $num = $stat = $pdo->exec($sql);

    Stats::gauge('wobble_stats_last_gc_seconds', time());
  }
  /**
   * @return [{name: string(), value: int()}]
   */
  public static function getValuesByPrefix($prefix) {
    $pdo = ctx_getpdo();

    $sql = 'SELECT name, value FROM `statistics` WHERE name LIKE ?';
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array($prefix . '%'));
    return $stmt->fetchAll();
  }
  public static function getValue($key) {
    $pdo = ctx_getpdo();
    $sql = 'SELECT value FROM `statistics` WHERE name = ?';
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array($key));
    $result = $stmt->fetch();

    if ($result !== false) {
      # NOTE: We do not cast here to int, as the value might be above MAX_INT (db has BIGINT)
      return $result['value'];
    }
    return null;
  }

  public static function incr($key, $amount = 1) {
    $pdo = ctx_getpdo();

    $sql = 'INSERT DELAYED INTO `statistics` (`name`, `value`, `last_update`) VALUES (?,?, unix_timestamp()) ' . 
           'ON DUPLICATE KEY UPDATE `value` = `value` + ?, `last_update` = unix_timestamp()';
    $pdo->prepare($sql)->execute(array($key, $amount, $amount));
  }

  public static function clear($key) {
    $pdo = ctx_getpdo();

    $sql = 'DELETE FROM `statistics` WHERE `name` = ?';
    $pdo->prepare($sql)->execute(array($key));
  }

  /**
   * Provide a value for a gauge.
   */
  public static function gauge($key, $value = 0) {
    $pdo = ctx_getpdo();
    $sql = 'REPLACE DELAYED `statistics` SET value = ?, last_update = unix_timestamp(), name = ?';
    $pdo->prepare($sql)->execute(array($value, $key));
  }
}
