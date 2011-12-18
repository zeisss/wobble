<?php
	// JSON RPC Exported Standard functions
	jsonrpc_export_functions(array(
		# No file, since it always gets included
		array('name' => 'system.listMethods', 'method' => 'jsonrpc_exported_system_list')
	));

	function jsonrpc_exported_system_list($params) {
		global $JSONRPC_CONFIG;
		$result = array();

		#var_dump($JSONRPC_CONFIG);

		foreach($JSONRPC_CONFIG['methods'] AS $entry) {
			$result[] = $entry['name'];
		}
		return $result;
	}
	