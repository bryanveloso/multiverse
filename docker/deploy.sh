#!/bin/bash

# Build the production images
echo "Building production Docker images..."
docker compose -f docker-compose.dev.yml build

# Stop any existing containers
echo "Stopping any existing containers..."
docker compose -f docker-compose.dev.yml down

# Start the containers in detached mode
echo "Starting containers..."
docker compose -f docker-compose.dev.yml up -d

echo "Deployment completed! Sites are available at:"
echo "- Bryan Veloso: http://localhost:4321"
echo "- Avalonstar: http://localhost:4322"
echo "- Omnyist: http://localhost:4323"
