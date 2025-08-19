#!/bin/bash

# Download PocketBase binary from GitHub Release
curl -L -o pocketbase https://github.com/talk2klyro/gubros_backend/releases/download/v0.1/pocketbase-linux-amd64

# Make it executable
chmod +x pocketbase

# Run PocketBase server
./pocketbase serve --http=0.0.0.0:3000
