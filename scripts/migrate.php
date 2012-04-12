#!/usr/bin/env php
<?php
  require_once(dirname(__FILE__) . '/../WobbleApi/Autoload.php');

  $upgrade = true;

  foreach($argv as $arg) {
    if ($arg == '-h' || $arg == '--help') {
        die('Usage: migrate.php [up|down]' . PHP_EOL);
    }
    if ($arg == 'down') {
      $upgrade = false;
    }
  }

  $service = new MigrationService(dirname(__FILE__) . '/../shared/database-migrations/');
  $availableMigrations = $service->getAvailableMigrations();
  $currentMigrations = $service->getActiveMigrations();

  if ($upgrade) {
      # Which files are in $available, but not in $current
      $missing = array_diff($availableMigrations, $currentMigrations);
      # NOTE: we just try to apply them blindly here.
      if (count($missing) === 0) {
          echo "No migrations for you. Good one!" . PHP_EOL;
      }
      foreach($missing as $file) {
          echo PHP_EOL;
          echo "## Executing migration $file" . PHP_EOL;
          echo PHP_EOL;
          $service->executeMigration($file, true);
          echo PHP_EOL;
      }
  } else {
      $currentMigrations = array_reverse($currentMigrations); # 0 is now the newest activated migration
      $number = 1;

      for ($i = 0; $i < $number; $i++) {
        echo PHP_EOL;
        echo "## Migrating down {$currentMigrations[$i]}" . PHP_EOL;
        echo PHP_EOL;
        $service->executeMigration($currentMigrations[$i], false);
        echo PHP_EOL;
      }
  }