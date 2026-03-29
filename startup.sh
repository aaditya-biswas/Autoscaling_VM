#!/bin/bash

# Logging
exec > /var/log/startup-script.log 2>&1

echo "Starting setup ..."

apt-get install -y docker.io

systemctl start docker
systemctl enable docker

sleep 5

# Pull the Docker Image
docker pull aaditya577/app

# Run
docker run -d -p 3000:3000 --restart always aaditya577/app

echo "App deployed"
