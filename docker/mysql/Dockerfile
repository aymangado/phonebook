FROM mysql:8.0.27

RUN apt-get update -y && \
    apt-get install pv -y

COPY import_database_backup.sh /import_database_backup.sh
RUN chmod +x /import_database_backup.sh