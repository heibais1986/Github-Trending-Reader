#!/bin/bash

# GitHub Trending API Deployment Verification Script
# This script verifies that the production deployment is working correctly

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

# Default values
ENVIRONMENT="production"
CUSTOM_DOMAIN=""

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -e, --env ENVIRONMENT    Target environment (production, staging, development)"
    echo "  -d, --domain DOMAIN      Custom domain to test (optional)"
    echo "  -h, --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --env production"
    echo "  $0 --env production --domain api.yourdomain.com"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -d|--domain)
            CUSTOM_DOMAIN="$2"
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

print_status "Verifying deployment for $ENVIRONMENT environment..."
print_status "=================================================="

# Get worker URL
print_step "1. Getting worker URL..."
if [ -n "$CUSTOM_DOMAIN" ]; then
    WORKER_URL="https://$CUSTOM_DOMAIN"
    print_status "Using custom domain: $WORKER_URL"
else
    # Try to get the worker URL from wrangler
    WORKER_NAME=$(grep "name.*=" wrangler.toml | head -1 | cut -d'"' -f2)
    if [ "$ENVIRONMENT" != "production" ]; then
        WORKER_NAME="${WORKER_NAME}-${ENVIRONMENT}"
    fi
    WORKER_URL="https://${WORKER_NAME}.workers.dev"
    print_status "Using worker URL: $WORKER_URL"
fi

# Test health endpoint
print_step "2. Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/health_response "$WORKER_URL/health" || echo "000")
HEALTH_CODE="${HEALTH_RESPONSE: -3}"

if [ "$HEALTH_CODE" = "200" ]; then
    print_status "✓ Health endpoint is responding correctly"
    HEALTH_BODY=$(cat /tmp/health_response)
    echo "Response: $HEALTH_BODY"
else
    print_error "✗ Health endpoint failed (HTTP $HEALTH_CODE)"
    if [ -f /tmp/health_response ]; then
        cat /tmp/health_response
    fi
fi

# Test API trending endpoint
print_step "3. Testing API trending endpoint..."
API_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/api_response "$WORKER_URL/api/trending" || echo "000")
API_CODE="${API_RESPONSE: -3}"

if [ "$API_CODE" = "200" ]; then
    print_status "✓ API trending endpoint is responding correctly"
    # Check if response is valid JSON
    if jq empty /tmp/api_response 2>/dev/null; then
        print_status "✓ Response is valid JSON"
        REPO_COUNT=$(jq '.repositories | length' /tmp/api_response 2>/dev/null || echo "0")
        print_status "✓ Found $REPO_COUNT repositories in response"
    else
        print_warning "⚠ Response is not valid JSON"
        head -c 200 /tmp/api_response
    fi
else
    print_error "✗ API trending endpoint failed (HTTP $API_CODE)"
    if [ -f /tmp/api_response ]; then
        head -c 500 /tmp/api_response
    fi
fi

# Test CORS headers
print_step "4. Testing CORS headers..."
CORS_RESPONSE=$(curl -s -I -H "Origin: https://example.com" "$WORKER_URL/api/trending" || echo "")
if echo "$CORS_RESPONSE" | grep -i "access-control-allow-origin" > /dev/null; then
    print_status "✓ CORS headers are present"
else
    print_warning "⚠ CORS headers not found"
fi

# Test rate limiting (if enabled)
print_step "5. Testing rate limiting..."
RATE_LIMIT_RESPONSE=$(curl -s -I "$WORKER_URL/api/trending" || echo "")
if echo "$RATE_LIMIT_RESPONSE" | grep -i "x-ratelimit" > /dev/null; then
    print_status "✓ Rate limiting headers are present"
else
    print_warning "⚠ Rate limiting headers not found"
fi

# Check KV storage (if we can access it)
print_step "6. Checking KV storage access..."
KV_TEST_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/kv_test "$WORKER_URL/api/trending?date=$(date -d '1 day ago' '+%Y-%m-%d')" || echo "000")
KV_TEST_CODE="${KV_TEST_RESPONSE: -3}"

if [ "$KV_TEST_CODE" = "200" ] || [ "$KV_TEST_CODE" = "404" ]; then
    print_status "✓ KV storage access is working (HTTP $KV_TEST_CODE)"
else
    print_warning "⚠ KV storage access may have issues (HTTP $KV_TEST_CODE)"
fi

# Check scheduled tasks (cron triggers)
print_step "7. Checking scheduled tasks..."
if wrangler cron trigger --env "$ENVIRONMENT" 2>/dev/null; then
    print_status "✓ Scheduled tasks are configured"
else
    print_warning "⚠ Could not verify scheduled tasks"
fi

# Performance test
print_step "8. Performance test..."
print_status "Testing response times..."
for i in {1..3}; do
    RESPONSE_TIME=$(curl -s -w "%{time_total}" -o /dev/null "$WORKER_URL/api/trending" || echo "0")
    print_status "Request $i: ${RESPONSE_TIME}s"
done

# Security headers check
print_step "9. Checking security headers..."
SECURITY_RESPONSE=$(curl -s -I "$WORKER_URL/api/trending" || echo "")
SECURITY_HEADERS=("x-content-type-options" "x-frame-options" "x-xss-protection")

for header in "${SECURITY_HEADERS[@]}"; do
    if echo "$SECURITY_RESPONSE" | grep -i "$header" > /dev/null; then
        print_status "✓ $header header is present"
    else
        print_warning "⚠ $header header is missing"
    fi
done

# SSL/TLS check
print_step "10. Checking SSL/TLS configuration..."
SSL_INFO=$(curl -s -I "$WORKER_URL" 2>&1 | head -1 || echo "")
if echo "$SSL_INFO" | grep -i "200\|301\|302" > /dev/null; then
    print_status "✓ SSL/TLS is working correctly"
else
    print_warning "⚠ SSL/TLS configuration may have issues"
fi

# Cleanup temporary files
rm -f /tmp/health_response /tmp/api_response /tmp/kv_test

print_status ""
print_status "Verification completed!"
print_status "======================"

# Summary
if [ "$HEALTH_CODE" = "200" ] && [ "$API_CODE" = "200" ]; then
    print_status "🎉 Deployment verification PASSED"
    print_status "Your API is ready to serve traffic!"
else
    print_error "❌ Deployment verification FAILED"
    print_error "Please check the issues above and redeploy if necessary."
    exit 1
fi

print_status ""
print_status "Useful commands:"
print_status "- View logs: wrangler tail --env $ENVIRONMENT"
print_status "- Check metrics: wrangler analytics --env $ENVIRONMENT"
print_status "- Update worker: ./scripts/deploy.sh --env $ENVIRONMENT"