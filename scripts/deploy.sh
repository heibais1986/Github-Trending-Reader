#!/bin/bash

# GitHub Trending API Deployment Script
# This script handles deployment to different environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="production"
SKIP_TESTS=false
SKIP_BUILD=false

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

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -e, --env ENVIRONMENT    Target environment (production, staging, development)"
    echo "  -s, --skip-tests        Skip running tests before deployment"
    echo "  -b, --skip-build        Skip build step"
    echo "  -h, --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --env production"
    echo "  $0 --env staging --skip-tests"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -s|--skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        -b|--skip-build)
            SKIP_BUILD=true
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(production|staging|development)$ ]]; then
    print_error "Invalid environment: $ENVIRONMENT"
    print_error "Valid environments: production, staging, development"
    exit 1
fi

print_status "Starting deployment to $ENVIRONMENT environment..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    print_error "Wrangler CLI is not installed. Please install it first:"
    print_error "npm install -g wrangler"
    exit 1
fi

# Check if user is logged in to Cloudflare
if ! wrangler whoami &> /dev/null; then
    print_error "Not logged in to Cloudflare. Please run: wrangler login"
    exit 1
fi

# Run tests unless skipped
if [ "$SKIP_TESTS" = false ]; then
    print_status "Running tests..."
    if ! npm test; then
        print_error "Tests failed. Deployment aborted."
        exit 1
    fi
    print_status "All tests passed!"
fi

# Build the project unless skipped
if [ "$SKIP_BUILD" = false ]; then
    print_status "Building project..."
    if ! npm run build; then
        print_error "Build failed. Deployment aborted."
        exit 1
    fi
    print_status "Build completed successfully!"
fi

# Check if required secrets are set
print_status "Checking required secrets..."
REQUIRED_SECRETS=("GITHUB_TOKEN")

for secret in "${REQUIRED_SECRETS[@]}"; do
    if ! wrangler secret list --env "$ENVIRONMENT" | grep -q "$secret"; then
        print_warning "Secret $secret is not set for $ENVIRONMENT environment"
        print_warning "Please set it using: wrangler secret put $secret --env $ENVIRONMENT"
    fi
done

# Deploy to Cloudflare Workers
print_status "Deploying to Cloudflare Workers ($ENVIRONMENT)..."
if wrangler deploy --env "$ENVIRONMENT"; then
    print_status "Deployment to $ENVIRONMENT completed successfully!"
    
    # Get the deployment URL
    WORKER_URL=$(wrangler subdomain list 2>/dev/null | grep -o 'https://[^[:space:]]*' | head -1)
    if [ -n "$WORKER_URL" ]; then
        print_status "Worker URL: $WORKER_URL"
    fi
    
    print_status "You can view logs with: wrangler tail --env $ENVIRONMENT"
else
    print_error "Deployment failed!"
    exit 1
fi

print_status "Deployment process completed!"