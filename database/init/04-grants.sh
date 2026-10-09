#!/bin/bash
set -eu
mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" StarwarsAcademy <<SQL
GRANT SELECT, INSERT, EXECUTE ON StarwarsAcademy.* TO '$MARIADB_USER'@'%';
FLUSH PRIVILEGES;
SQL
