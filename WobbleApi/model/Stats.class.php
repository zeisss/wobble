<?php

/**
  $m = Stats::histogramWithLabels(
    'http_request_duration_microseconds', 
    [100, 500, 2500], ['handler']
  );
  $m->observe(12345123, ['get_notifications']);
*/

class Histogram {
  private static function renderLabels($labels, $labelValues) {
    $key = "";
    foreach ($labels as $index => $value) {
      $key .= $value . '="' . $labelValues[$index] . '",';
    }
    if (strlen($key) > 0) {
      $key = substr($key, 0, -1);
    }
    return $key;
  }

  private $key;
  private $labels;
  private $buckets;
  public function __construct($key, $labels, $buckets) {
    $this->key = $key;
    $this->labels = $labels;
    $this->buckets = $buckets;
  }

  public function _key($key, $labels, $labelLE = "") {
    if (empty($labels) && empty($labelLE)) {
      return $key;
    } else if (empty($labels)) {
      return $key . '{le="' . $labelLE . '"}';
    } else if (empty($labelLE)) {
      return $key . '{' . $labels . '}';
    } else {
      return $key . '{' . $labels . ',le="' . $labelLE . '"}';
    }
  }

  public function observe($value, $labelValues = []) {
    $lab = Histogram::renderLabels($this->labels, $labelValues);

    foreach($this->buckets as $bound) {
      if ($bound <= $value) {
        Stats::incr(
          $this->_key($this->key . '_bucket', $lab, $bound),
          $value
        );
      }
    }

    Stats::incr($this->_key($this->key . '_bucket', $lab, '+Inf'), $value);
    Stats::incr($this->_key($this->key . '_sum' , $lab), $value);
    Stats::incr($this->_key($this->key . '_count', $lab));
  }
}

class Stats { 
  public static function histogramWithLabels($name, $buckets, $labels = []) {
    $s = new Histogram($name, $labels, $buckets);
    return $s;
  }

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
