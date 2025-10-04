#!/bin/bash

# GitHub Trending API Deployment Setup Script
# This script helps set up the deployment environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_status "GitHub Trending API Deployment Setup"
print_status "====================================="

# Check if wrangler is installed
print_step "1. Checking Wrangler CLI installation..."
if ! command -v wrangler &> /dev/null; then
    print_warning "Wrangler CLI is not installed."
    read -p "Would you like to install it now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Installing Wrangler CLI..."
        npm install -g wrangler
    else
        print_error "Wrangler CLI is required for deployment. Please install it manually:"
        print_error "npm install -g wrangler"
        exit 1
    fi
else
    print_status "Wrangler CLI is already installed."
fi

# Login to Cloudflare
print_step "2. Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    print_warning "Not logged in to Cloudflare."
    read -p "Would you like to login now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Opening Cloudflare login..."
        wrangler login
    else
        print_error "Cloudflare authentication is required. Please run: wrangler login"
        exit 1
    fi
else
    print_status "Already authenticated with Cloudflare."
fi

# Create KV namespaces
print_step "3. Setting up KV namespaces..."

# Production KV namespace
print_status "Creating production KV namespace..."
PROD_KV_ID=$(wrangler kv:namespace create "TRENDING_KV" --env production 2>/dev/null | grep -o 'id = "[^"]*"' | cut -d'"' -f2)
if [ -n "$PROD_KV_ID" ]; then
    print_status "Production KV namespace created: $PROD_KV_ID"
else
    print_warning "Failed to create production KV namespace or it already exists."
fi

# Staging KV namespace  
print_status "Creating staging KV namespace..."
STAGING_KV_ID=$(wrangler kv:namespace create "TRENDING_KV" --env staging 2>/dev/null | grep -o 'id = "[^"]*"' | cut -d'"' -f2)
if [ -n "$STAGING_KV_ID" ]; then
    print_status "Staging KV namespace created: $STAGING_KV_ID"
else
    print_warning "Failed to create staging KV namespace or it already exists."
fi

# Preview KV namespace
print_status "Creating preview KV namespace..."
PREVIEW_KV_ID=$(wrangler kv:namespace create "TRENDING_KV" --preview 2>/dev/null | grep -o 'id = "[^"]*"' | cut -d'"' -f2)
if [ -n "$PREVIEW_KV_ID" ]; then
    print_status "Preview KV namespace created: $PREVIEW_KV_ID"
else
    print_warning "Failed to create preview KV namespace or it already exists."
fi

# Update wrangler.toml with KV namespace IDs
print_step "4. Updating wrangler.toml configuration..."
if [ -n "$PROD_KV_ID" ] && [ -n "$PREVIEW_KV_ID" ]; then
    # Create backup of wrangler.toml
    cp wrangler.toml wrangler.toml.backup
    
    # Update the KV namespace IDs
    sed -i.tmp "s/your-kv-namespace-id/$PROD_KV_ID/g" wrangler.toml
    sed -i.tmp "s/your-preview-kv-namespace-id/$PREVIEW_KV_ID/g" wrangler.toml
    rm wrangler.toml.tmp
    
    print_status "Updated wrangler.toml with KV namespace IDs"
else
    print_warning "Could not update wrangler.toml automatically. Please update the KV namespace IDs manually."
fi

# Set up secrets
print_step "5. Setting up secrets..."
print_status "You need to set up the following secrets for each environment:"
print_status "- GITHUB_TOKEN: Your GitHub Personal Access Token"

read -p "Do you have a GitHub Personal Access Token ready? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Set secrets for each environment
    for env in "production" "staging" "development"; do
        print_status "Setting GITHUB_TOKEN for $env environment..."
        echo "Please enter your GitHub Personal Access Token for $env:"
        wrangler secret put GITHUB_TOKEN --env "$env"
    done
else
    print_warning "Please create a GitHub Personal Access Token and set it using:"
    print_warning "wrangler secret put GITHUB_TOKEN --env production"
    print_warning "wrangler secret put GITHUB_TOKEN --env staging"
    print_warning "wrangler secret put GITHUB_TOKEN --env development"
fi

# Make deployment scripts executable
print_step "6. Setting up deployment scripts..."
chmod +x scripts/deploy.sh
chmod +x scripts/setup-deployment.sh
print_status "Made deployment scripts executable"

# Final instructions
print_step "7. Setup complete!"
print_status "Your deployment environment is now configured."
print_status ""
print_status "Next steps:"
print_status "1. Test your deployment: ./scripts/deploy.sh --env staging"
print_status "2. Deploy to production: ./scripts/deploy.sh --env production"
print_status "3. View logs: wrangler tail --env production"
print_status ""
print_status "For CI/CD, make sure to set these GitHub secrets:"
print_status "- CLOUDFLARE_API_TOKEN"
print_status "- CLOUDFLARE_ACCOUNT_ID"
print_status "- GITHUB_TOKEN_SECRET"