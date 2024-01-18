#!/bin/bash

docker network create internal

docker volume create postgres-data
docker volume create redis-data
docker volume create mongo-data
docker volume create rabbitmq-data
docker volume create mysql-data
docker volume create sonarqube-data

docker-compose -f docker/docker-compose-infra.yml up -d --build --remove-orphans

docker exec mongo ./mongo/rs-init.sh