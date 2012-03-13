<?php
// JSON RPC Exported Standard functions

function jsonrpc_exported_system_list($params, $server) {
  $result = array();
  foreach($server->getExportedFunctions() AS $entry) {
    $result[] = $entry['name'];
  }
  return $result;
}

/**
 * Returns the input object as is.
 *
 * input = [Object]
 * result = input
 */
function jsonrpc_echo($params) {
  return $params;
}
