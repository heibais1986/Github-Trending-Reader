#!/bin/bash

# Custom Domain Setup Script for GitHub Trending API
# This script helps configure a custom domain for the Cloudflare Worker

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

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -d, --domain DOMAIN      Your custom domain (e.g., api.yourdomain.com)"
    echo "  -e, --env ENVIRONMENT    Target environment (production, staging, development)"
    echo "  -h, --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --domain api.yourdomain.com --env production"
    echo "  $0 --domain staging-api.yourdomain.com --env staging"
}

# Default values
DOMAIN=""
ENVIRONMENT="production"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--domain)
            DOMAIN="$2"
            shift 2
            ;;
        -e|--env)
            ENVIRONMENT="$2"
            shift 2
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

# Validate required parameters
if [ -z "$DOMAIN" ]; then
    print_error "Domain is required. Use --domain to specify your custom domain."
    show_usage
    exit 1
fi

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(production|staging|development)$ ]]; then
    print_error "Invalid environment: $ENVIRONMENT"
    print_error "Valid environments: production, staging, development"
    exit 1
fi

print_status "Setting up custom domain: $DOMAIN"
print_status "Environment: $ENVIRONMENT"
print_status "=================================="

# Check if wrangler is installed and user is logged in
print_step "1. Checking prerequisites..."
if ! command -v wrangler &> /dev/null; then
    print_error "Wrangler CLI is not installed. Please install it first:"
    print_error "npm install -g wrangler"
    exit 1
fi

if ! wrangler whoami &> /dev/null; then
    print_error "Not logged in to Cloudflare. Please run: wrangler login"
    exit 1
fi

print_status "Prerequisites check passed."

# Get worker name
WORKER_NAME=$(grep "name.*=" wrangler.toml | head -1 | cut -d'"' -f2)
if [ "$ENVIRONMENT" != "production" ]; then
    WORKER_NAME="${WORKER_NAME}-${ENVIRONMENT}"
fi

print_status "Worker name: $WORKER_NAME"

# Add custom domain route
print_step "2. Adding custom domain route..."
print_status "Adding route for $DOMAIN/*"

if wrangler route add "$DOMAIN/*" --env "$ENVIRONMENT"; then
    print_status "✓ Custom domain route added successfully"
else
    print_error "Failed to add custom domain route"
    print_error "Make sure the domain is added to your Cloudflare account"
    exit 1
fi

# Check if domain is in Cloudflare
print_step "3. Verifying domain configuration..."
print_status "Checking if $DOMAIN is configured in Cloudflare..."

# Extract the root domain from subdomain
ROOT_DOMAIN=$(echo "$DOMAIN" | sed 's/^[^.]*\.//')

print_status "Root domain: $ROOT_DOMAIN"
print_status ""
print_status "DNS Configuration Required:"
print_status "============================"
print_status "You need to add the following DNS record in your Cloudflare dashboard:"
print_status ""
print_status "Type: CNAME"
print_status "Name: $(echo "$DOMAIN" | sed "s/\.$ROOT_DOMAIN//")"
print_status "Target: $WORKER_NAME.workers.dev"
print_status "Proxy status: Proxied (orange cloud)"
print_status ""

# Wait for user confirmation
read -p "Have you added the DNS record? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Please add the DNS record and run this script again."
    exit 0
fi

# Test the custom domain
print_step "4. Testing custom domain..."
print_status "Testing https://$DOMAIN/health"

# Wait a bit for DNS propagation
print_status "Waiting for DNS propagation (30 seconds)..."
sleep 30

# Test the domain
if curl -s -f "https://$DOMAIN/health" > /dev/null; then
    print_status "✓ Custom domain is working correctly!"
else
    print_warning "Custom domain test failed. This might be due to:"
    print_warning "1. DNS propagation delay (can take up to 24 hours)"
    print_warning "2. Incorrect DNS configuration"
    print_warning "3. SSL certificate provisioning in progress"
    print_warning ""
    print_warning "You can test manually later with:"
    print_warning "curl https://$DOMAIN/health"
fi

# Update HarmonyOS app configuration
print_step "5. Updating HarmonyOS app configuration..."
HARMONY_CONFIG_FILE="harmonyos-app/entry/src/main/ets/constants/ApiConstants.ets"

if [ -f "$HARMONY_CONFIG_FILE" ]; then
    # Create backup
    cp "$HARMONY_CONFIG_FILE" "$HARMONY_CONFIG_FILE.backup"
    
    # Update the API base URL
    sed -i.tmp "s|https://[^/]*|https://$DOMAIN|g" "$HARMONY_CONFIG_FILE"
    rm "$HARMONY_CONFIG_FILE.tmp"
    
    print_status "✓ Updated HarmonyOS app configuration"
    print_status "Updated file: $HARMONY_CONFIG_FILE"
else
    print_warning "HarmonyOS app configuration file not found: $HARMONY_CONFIG_FILE"
    print_warning "Please update the API base URL manually in your app"
fi

# SSL Certificate information
print_step "6. SSL Certificate information..."
print_status "Cloudflare automatically provisions SSL certificates for custom domains."
print_status "The certificate should be available within a few minutes."
print_status ""
print_status "You can check the SSL status in your Cloudflare dashboard:"
print_status "SSL/TLS > Edge Certificates"

# Final instructions
print_step "7. Setup complete!"
print_status "Custom domain setup completed successfully!"
print_status ""
print_status "Summary:"
print_status "- Domain: $DOMAIN"
print_status "- Environment: $ENVIRONMENT"
print_status "- Worker: $WORKER_NAME"
print_status ""
print_status "Next steps:"
print_status "1. Test your API: curl https://$DOMAIN/api/trending"
print_status "2. Verify deployment: ./scripts/verify-deployment.sh --domain $DOMAIN --env $ENVIRONMENT"
print_status "3. Update your HarmonyOS app if needed"
print_status ""
print_status "Useful commands:"
print_status "- List routes: wrangler route list --env $ENVIRONMENT"
print_status "- Remove route: wrangler route delete $DOMAIN/* --env $ENVIRONMENT"
print_status "- View logs: wrangler tail --env $ENVIRONMENT"