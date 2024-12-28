#!/bin/bash

# Create deployment directory
DEPLOY_DIR="deployment_$(date +%Y%m%d_%H%M%S)"
mkdir -p $DEPLOY_DIR

# Essential files and directories to copy
ITEMS=(
    "src"
    "public"
    "knowledge_base"
    "content"
    "data"
    "package.json"
    "package-lock.json"
    "next.config.ts"
    "tsconfig.json"
    "tailwind.config.ts"
    "postcss.config.mjs"
    "docker-compose.yml"
    "Dockerfile"
    ".env.local"
    "eslint.config.mjs"
)

# Copy each item to deployment directory
for item in "${ITEMS[@]}"; do
    if [ -e "$item" ]; then
        cp -r "$item" "$DEPLOY_DIR/"
    fi
done

# Create zip file
zip -r "${DEPLOY_DIR}.zip" "$DEPLOY_DIR"

# Cleanup deployment directory
rm -rf "$DEPLOY_DIR"

echo "Deployment package created: ${DEPLOY_DIR}.zip" 