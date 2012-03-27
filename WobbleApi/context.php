<?php
# Disable session cookies, since we do our own session key management
ini_set('session.use_cookies', '0');

# Load the configuration file
require_once WOBBLE_HOME . '/etc/config.php';

###
# Helper Functions
#
#
global $PDO_CONTEXT_VAR;
$PDO_CONTEXT_VAR = null;
function ctx_getpdo() {
  global $PDO_CONTEXT_VAR;

  if ($PDO_CONTEXT_VAR == null) {
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
