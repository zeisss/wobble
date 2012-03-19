ALTER TABLE  `post_editors` ADD  `timestamp` INT NULL;

UPDATE post_editors SET timestamp = UNIX_TIMESTAMP() WHERE timestamp IS NULL;