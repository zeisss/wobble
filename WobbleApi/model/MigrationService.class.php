<?php
  class MigrationService {
    private $path;
    private $pdo;
    private $has_migrations_table;

    public function __construct($path) {
      $this->path = $path;
      $this->pdo = ctx_getpdo();
      $this->checkMigrationsTable();
    }

    protected function checkMigrationsTable() {
      $sql = 'SHOW TABLES like "schema_migrations"';
      $stmt = $this->pdo->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetch();

      $this->has_migrations_table = !empty($result);
    }

    protected function createMigrationsTable() {
      $sql = 'CREATE TABLE schema_migrations (filename varchar(255) not null, timestamp int(13))';
      $this->pdo->prepare($sql)->execute();
      $this->has_migrations_table = true;
    }

    public function getAvailableMigrations() {
      $fp = opendir($this->path);
      $result = array();

      while (false !== ($file = readdir($fp))) {
        if (strlen($file) < 4)
          continue;

        $ending = substr($file, strrpos($file, '.'));
        if ($ending == '.sql' ||
            $ending == '.json')
          $result[] = $file;
      }
      closedir($fp);
      sort($result);
      return $result;
    }

    public function getActiveMigrations() {
      if (!$this->has_migrations_table) {
        echo "INFO: No schema_migrations table found." . PHP_EOL;
        return array();
      }

      $result = array();
      $sql = 'SELECT filename FROM schema_migrations ORDER BY timestamp';
      $stmt = $this->pdo->prepare($sql);
      $stmt->execute();
      foreach($stmt->fetchAll() as $row) {
        $result[] = $row['filename'];
      }
      sort($result);
      return $result;
    }

    public function executeMigration($filename, $upgrade = true) {
      if (!$this->has_migrations_table) {
        $this->createMigrationsTable();
      }

      $ending = substr($filename, strrpos($filename, '.'));
      if ($ending == '.sql')
        $this->executeSqlMigration($filename, $upgrade);
      else if($ending == '.json')
        $this->executeJsonMigration($filename, $upgrade);
      else
        throw new Exception('Unknown migration type.');

      if ($upgrade) {
        $sql = 'INSERT INTO `schema_migrations` (filename, timestamp) VALUE (?, unix_timestamp())';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(array($filename));
      } else {
        $sql = 'DELETE FROM `schema_migrations` WHERE filename = ?';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(array($filename));
      }

      return true;
    }
    protected function executeJsonMigration($filename, $upgrade = true) {
      $key = $upgrade ? 'up' : 'down';
      $filecontent = file_get_contents($this->path . '/' . $filename);
      $migration = json_decode($filecontent, TRUE);

      if (!is_array($migration))
        throw new Exception('File ' . $filename . ' is not a proper json migration. Expected object at root.');
      $queries = $migration[$key];
      if (!is_array($queries))
        throw new Exception('Expected an array in migration-file ' . $filename . ' for key ' . $key);

      foreach($queries as $sql) {
        $this->executeSql($sql);
      }
    }
    protected function executeSqlMigration($filename, $upgrade = true) {
      if (!$upgrade) {
        throw new Exception('The migrationfile ' . $filename . ' does not support down-migration.');
      }
      $filecontent = file_get_contents($this->path . '/' . $filename);
      $statements = explode(';', $filecontent);

      foreach($statements as $sql) {
        $this->executeSql($sql);
      }
    }

    protected function executeSql($sql) {
      $sql = trim($sql);
      if (empty($sql))
        return;
      echo $sql . PHP_EOL;
      $this->pdo->exec($sql);
    }
  }