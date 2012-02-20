#!/usr/bin/env php
<?php
require_once dirname(__FILE__) . '/../web/api/context.php';

print SessionService::getOnlineUserCount();
