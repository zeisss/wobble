#!/usr/bin/env bash

CONFIG_FILE="./etc/my.cnf"
BACKUP_DIR="$HOME/var/backup/wobble"

MYSQL_DBS="szeissler-002"
MYSQLDUMP="/usr/bin/mysqldump"

if [ ! -f "${CONFIG_FILE}" ]; then
	echo "No ${CONFIG_FILE} found." > /dev/stderr
	exit 1
fi


echo "Writing backup to ${BACKUP_DIR} ..." > /dev/stderr
[ ! -d $BACKUP_DIR ] && mkdir $BACKUP_DIR

for db in "${MYSQL_DBS}"; do
  file="${BACKUP_DIR}/${db}-$(date +%Y-%m-%d).sql.gz"
  ${MYSQLDUMP} --defaults-file=./etc/my.cnf ${db} | gzip -c > $file
done

