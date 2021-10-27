FROM mysql:8.0.27

RUN apt-get update -y && \
    apt-get install pv -y

COPY wait.sh /wait.sh
RUN chmod +x /wait.sh