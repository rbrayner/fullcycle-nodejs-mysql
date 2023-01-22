#!/bin/bash

source ./env.list
dockerize -wait tcp://${DB_HOSTNAME}:${DB_PORT} -timeout 60s && sleep 5
cd /app && npm start
