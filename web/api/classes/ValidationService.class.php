<?php
class ValidationService {
	function validate_email($input) {
		ValidationService::check(!empty($input) && strpos($input, '@') > 0, 'Valid email adress required: ' . $input);
	}
	function validate_not_empty($input) {
		ValidationService::check(!empty($input));
	}
	
	function check($boolean, $message = 'Invalid Input!') {
		if ( !$boolean ) throw new Exception($message);
	}
}