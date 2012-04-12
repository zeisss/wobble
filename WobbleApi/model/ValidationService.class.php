<?php
class ValidationService {
  public static function validate_topicid($input) {
    $pattern = '/^[-\w]*$/';
    static::check(preg_match($pattern, $input));
  }

  public static function validate_email($input) {
    static::check(!empty($input) && strpos($input, '@') > 0, 'Valid email adress required: ' . $input);
  }

  public static function validate_not_empty($input) {
    static::check(!empty($input));
  }

  public static function validate_content($input) {
    $pos = strpos($input, '<script');
    static::check($pos === FALSE);
  }

  public static function validate_list($input, $list) {
    $in_list = in_array($input, $list);
    static::check($in_list !== FALSE);
  }

  public static function validate_boolean($input) {
      static::validate_list($input, array(0, 1));
  }

  public static function check($boolean, $message = 'Invalid Input!') {
    if (!$boolean) throw new Exception($message);
  }
}