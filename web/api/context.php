<?php
ini_set('session.use_cookies', '0');

require_once dirname(__FILE__) . '/config.php';

# TODO: Replace with __autoload()
require_once dirname(__FILE__).'/classes/NotificationRepository.class.php';
require_once dirname(__FILE__).'/classes/TopicRepository.class.php';
require_once dirname(__FILE__).'/classes/UserRepository.class.php';
require_once dirname(__FILE__).'/classes/ContactsRepository.class.php';
require_once dirname(__FILE__).'/classes/SecurityService.class.php';
require_once dirname(__FILE__).'/classes/SessionService.class.php';
require_once dirname(__FILE__).'/classes/ValidationService.class.php';
require_once dirname(__FILE__).'/classes/TopicMessagesRepository.class.php';
require_once dirname(__FILE__).'/classes/UserArchivedTopicRepository.class.php';
require_once dirname(__FILE__).'/classes/InputSanitizer.class.php';




###
# Helper Functions
#
#
global $PDO_CONTEXT_VAR;
$PDO_CONTEXT_VAR = null;
function ctx_getpdo() {
  global $PDO_CONTEXT_VAR;

  if ( $PDO_CONTEXT_VAR == null ) {
    $pdo = new PDO(PDO_URL, PDO_USER, PDO_PASSWORD,
      array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES \'UTF8\''));
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); # Raise exceptions, so they get logged by Airbrake, or whatever
    $pdo->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, false);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $PDO_CONTEXT_VAR = $pdo;
  }
  return $PDO_CONTEXT_VAR;
}

function ctx_getuserid() {
  return isset($_SESSION['userid']) ? intval($_SESSION['userid']) : NULL;
}
