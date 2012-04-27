<?php

class Stats {
    public static function incr($key, $amount = 1) {
      $pdo = ctx_getpdo();

      $sql = 'INSERT DELAYED INTO `statistics` (`name`, `value`, `last_update`) VALUES (?,?, unix_timestamp()) ON DUPLICATE KEY UPDATE `value` = `value` + ?';
      $pdo->prepare($sql)->execute(array($key, $amount, $amount));
    }
    
    public static function clear($key) {
      $pdo = ctx_getpdo();

      $sql = 'DELETE FROM `statistics` WHERE `name` = ?';
      $pdo->prepare($sql)->execute(array($key));
    }

    public static function update($key, $value = 0) {
      $pdo = ctx_getpdo();

      $sql = 'REPLACE DELAYED `statistics` SET value = ?, last_update = unix_timestamp(), name = ?';
      $pdo->prepare($sql)->execute(array($value, $key));
    }
}
