#!/bin/bash

until echo '\q' | mysql --default-character-set=utf8 -h localhost -P 3306 -u "$MYSQL_ROOT_USER" -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" 2>/dev/null; do
    echo " "
    echo "Please wait ..."
    echo " "
    sleep 5
done

pv --name 'Importing' '/database_backup/schema.sql' | mysql --default-character-set=utf8 -h localhost -u "$MYSQL_ROOT_USER" -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" 2>/dev/null
echo " "
echo "-------------------------------------------"
echo ">>> Database backup has been imported <<<"
echo "-------------------------------------------"
