#!/bin/bash
# Frontend deployment script

# Install dependencies
npm install

# Build for production
npm run build:prod

# Output success message
echo "Frontend build completed successfully. Deploy the 'dist' directory to your web server."