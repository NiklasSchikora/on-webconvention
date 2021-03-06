#!/bin/sh

echo "*** Starting deployment ... ***"

# make sure to not use development environment variables
rm .env

NETWORK_NAME=nginx-proxy
if [ -z $(docker network ls --filter name=^${NETWORK_NAME}$ --format="{{ .Name }}") ] ; then
  echo "Creating new network for proxied containers."
  docker network create nginx-proxy
fi

docker compose up -d --build
echo "*** Deployment done. ***"