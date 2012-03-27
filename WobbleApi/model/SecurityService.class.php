<?php
if (!defined('PASSWORD_SALT'))
  die('You need to define a constant PASSWORD_SALT in your config.php');

class SecurityService {
  public static function hashPassword($password) {
    return md5(PASSWORD_SALT . $password);
  }
}
