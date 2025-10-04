#!/bin/bash

# HarmonyOS App Testing Script
# This script runs tests and validates the HarmonyOS application

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
DEVICE_ID=""
INSTALL_APP=false
RUN_NETWORK_TESTS=true
API_URL=""

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -d, --device DEVICE_ID  Target device ID for testing"
    echo "  -i, --install          Install app on device before testing"
    echo "  -n, --no-network       Skip network connectivity tests"
    echo "  -a, --api-url URL      API URL to test connectivity"
    echo "  -h, --help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --device 127.0.0.1:5555 --install"
    echo "  $0 --api-url https://api.yourdomain.com"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--device)
            DEVICE_ID="$2"
            shift 2
            ;;
        -i|--install)
            INSTALL_APP=true
            shift
            ;;
        -n|--no-network)
            RUN_NETWORK_TESTS=false
            shift
            ;;
        -a|--api-url)
            API_URL="$2"
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

print_status "HarmonyOS App Testing"
print_status "===================="

# Check if we're in the correct directory
if [ ! -f "oh-package.json5" ]; then
    print_error "Not in HarmonyOS app directory. Please run from harmonyos-app/"
    exit 1
fi

# Check if hdc is available
if ! command -v hdc &> /dev/null; then
    print_error "hdc (HarmonyOS Device Connector) is not installed or not in PATH"
    print_error "Please install DevEco Studio and ensure hdc is available"
    exit 1
fi

# List available devices
print_step "1. Checking connected devices..."
DEVICES=$(hdc list targets 2>/dev/null || echo "")

if [ -z "$DEVICES" ] || [ "$DEVICES" = "[Empty]" ]; then
    print_warning "No devices connected"
    print_warning "Please connect a device or start an emulator"
    if [ "$INSTALL_APP" = true ]; then
        print_error "Cannot install app without a connected device"
        exit 1
    fi
else
    print_status "Connected devices:"
    echo "$DEVICES" | while read -r device; do
        if [ -n "$device" ] && [ "$device" != "[Empty]" ]; then
            print_status "  $device"
        fi
    done
    
    # Use the first device if none specified
    if [ -z "$DEVICE_ID" ]; then
        DEVICE_ID=$(echo "$DEVICES" | head -1)
        print_status "Using device: $DEVICE_ID"
    fi
fi

# Build the app if needed
print_step "2. Checking build artifacts..."
HAP_FILES=$(find . -name "*.hap" -type f 2>/dev/null)

if [ -z "$HAP_FILES" ]; then
    print_warning "No HAP files found. Building app..."
    ./scripts/build.sh --mode debug
    HAP_FILES=$(find . -name "*.hap" -type f 2>/dev/null)
fi

if [ -n "$HAP_FILES" ]; then
    HAP_FILE=$(echo "$HAP_FILES" | head -1)
    print_status "Using HAP file: $HAP_FILE"
else
    print_error "No HAP files found after build"
    exit 1
fi

# Install app on device if requested
if [ "$INSTALL_APP" = true ] && [ -n "$DEVICE_ID" ]; then
    print_step "3. Installing app on device..."
    print_status "Installing $HAP_FILE on $DEVICE_ID"
    
    if hdc -t "$DEVICE_ID" install "$HAP_FILE"; then
        print_status "✓ App installed successfully"
    else
        print_error "✗ App installation failed"
        exit 1
    fi
fi

# Run static analysis tests
print_step "4. Running static analysis..."
print_status "Checking code structure and dependencies..."

# Check if all required files exist
REQUIRED_FILES=(
    "entry/src/main/ets/entryability/EntryAbility.ets"
    "entry/src/main/ets/pages/Index.ets"
    "entry/src/main/module.json5"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status "✓ $file exists"
    else
        print_error "✗ Missing required file: $file"
    fi
done

# Check permissions in module.json5
if grep -q "ohos.permission.INTERNET" entry/src/main/module.json5; then
    print_status "✓ Internet permission is configured"
else
    print_error "✗ Internet permission is missing"
fi

# Network connectivity tests
if [ "$RUN_NETWORK_TESTS" = true ]; then
    print_step "5. Testing network connectivity..."
    
    # Determine API URL
    if [ -z "$API_URL" ]; then
        # Try to extract from ApiConstants.ets
        if [ -f "entry/src/main/ets/constants/ApiConstants.ets" ]; then
            API_URL=$(grep -o 'https://[^"]*' entry/src/main/ets/constants/ApiConstants.ets | head -1)
        fi
    fi
    
    if [ -n "$API_URL" ]; then
        print_status "Testing API connectivity: $API_URL"
        
        # Test health endpoint
        if curl -s -f "$API_URL/health" > /dev/null; then
            print_status "✓ API health endpoint is accessible"
        else
            print_warning "⚠ API health endpoint is not accessible"
        fi
        
        # Test trending endpoint
        if curl -s -f "$API_URL/api/trending" > /dev/null; then
            print_status "✓ API trending endpoint is accessible"
        else
            print_warning "⚠ API trending endpoint is not accessible"
        fi
    else
        print_warning "No API URL found for testing"
    fi
fi

# App functionality tests (if device is available)
if [ -n "$DEVICE_ID" ] && [ "$INSTALL_APP" = true ]; then
    print_step "6. Testing app functionality..."
    
    # Get app package name from module.json5
    BUNDLE_NAME=$(grep -o '"bundleName"[[:space:]]*:[[:space:]]*"[^"]*"' entry/src/main/module.json5 | cut -d'"' -f4)
    
    if [ -n "$BUNDLE_NAME" ]; then
        print_status "Testing app: $BUNDLE_NAME"
        
        # Check if app is installed
        if hdc -t "$DEVICE_ID" shell bm dump -n "$BUNDLE_NAME" > /dev/null 2>&1; then
            print_status "✓ App is installed on device"
        else
            print_warning "⚠ App may not be properly installed"
        fi
        
        # Try to start the app
        print_status "Attempting to start app..."
        if hdc -t "$DEVICE_ID" shell aa start -a EntryAbility -b "$BUNDLE_NAME"; then
            print_status "✓ App started successfully"
            sleep 3
            
            # Check if app is running
            if hdc -t "$DEVICE_ID" shell ps | grep -q "$BUNDLE_NAME"; then
                print_status "✓ App is running"
            else
                print_warning "⚠ App may have crashed or closed"
            fi
        else
            print_warning "⚠ Could not start app automatically"
        fi
    else
        print_warning "Could not determine app bundle name"
    fi
fi

# Performance analysis
print_step "7. Performance analysis..."
if [ -n "$HAP_FILE" ]; then
    FILE_SIZE=$(du -h "$HAP_FILE" | cut -f1)
    print_status "HAP file size: $FILE_SIZE"
    
    # Check if size is reasonable (< 50MB for a simple app)
    FILE_SIZE_BYTES=$(du -b "$HAP_FILE" | cut -f1)
    if [ "$FILE_SIZE_BYTES" -lt 52428800 ]; then  # 50MB
        print_status "✓ App size is reasonable"
    else
        print_warning "⚠ App size is large (>50MB)"
    fi
fi

# Generate test report
print_step "8. Generating test report..."
REPORT_FILE="test-report-$(date +%Y%m%d-%H%M%S).txt"

cat > "$REPORT_FILE" << EOF
HarmonyOS App Test Report
========================
Date: $(date)
HAP File: $HAP_FILE
Device: $DEVICE_ID
API URL: $API_URL

Test Results:
- Static Analysis: Completed
- Network Tests: $([ "$RUN_NETWORK_TESTS" = true ] && echo "Completed" || echo "Skipped")
- Device Tests: $([ "$INSTALL_APP" = true ] && echo "Completed" || echo "Skipped")
- Performance Check: Completed

For detailed results, see the console output above.
EOF

print_status "Test report saved to: $REPORT_FILE"

print_status ""
print_status "Testing completed!"
print_status "=================="
print_status "Next steps:"
print_status "1. Review test results above"
print_status "2. Test manually on device if needed"
print_status "3. Run performance tests if required"
print_status "4. Package for distribution: ./scripts/package.sh"