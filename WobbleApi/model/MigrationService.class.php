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
        if (strlen($file) > 4 && substr($file, strlen($file) - 4) == '.sql')
          $result[] = $file;
      }
      closedir($fp);
      return $result;
    }

    public function getActiveMigrations() {
      if (!$this->has_migrations_table) {
        echo "ERROR: No schema_migrations table found.";
        return array();
      }

      $result = array();
      $sql = 'SELECT filename FROM schema_migrations';
      $stmt = $this->pdo->prepare($sql);
      $stmt->execute();
      foreach($stmt->fetchAll() as $row) {
        $result[] = $row['filename'];
      }
      return $result;
    }

    public function executeMigration($filename) {
      if (!$this->has_migrations_table) {
        $this->createMigrationsTable();
      }

      $filecontent = file_get_contents($this->path . '/' . $filename);

      $this->pdo->exec($filecontent);

      $sql = 'INSERT INTO `schema_migrations` (filename, timestamp) VALUE (?, unix_timestamp())';
      $stmt = $this->pdo->prepare($sql);
      $stmt->execute(array($filename));

      return true;
    }
    
    public function downgrade($number) {
      die('NOT IMPLEMENTED');
    }
  }