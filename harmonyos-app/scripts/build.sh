#!/bin/bash

# HarmonyOS App Build Script
# This script builds the HarmonyOS application

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
BUILD_MODE="debug"
CLEAN_BUILD=false
SKIP_LINT=false

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -m, --mode MODE         Build mode (debug, release)"
    echo "  -c, --clean            Clean build (remove previous build artifacts)"
    echo "  -s, --skip-lint        Skip linting"
    echo "  -h, --help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --mode release"
    echo "  $0 --mode debug --clean"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -m|--mode)
            BUILD_MODE="$2"
            shift 2
            ;;
        -c|--clean)
            CLEAN_BUILD=true
            shift
            ;;
        -s|--skip-lint)
            SKIP_LINT=true
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

# Validate build mode
if [[ ! "$BUILD_MODE" =~ ^(debug|release)$ ]]; then
    print_error "Invalid build mode: $BUILD_MODE"
    print_error "Valid modes: debug, release"
    exit 1
fi

print_status "Building HarmonyOS App"
print_status "Build Mode: $BUILD_MODE"
print_status "======================"

# Check if we're in the correct directory
if [ ! -f "oh-package.json5" ]; then
    print_error "Not in HarmonyOS app directory. Please run from harmonyos-app/"
    exit 1
fi

# Check if hvigor is available
if ! command -v hvigor &> /dev/null; then
    print_warning "hvigor command not found. Trying to use npx..."
    HVIGOR_CMD="npx hvigor"
else
    HVIGOR_CMD="hvigor"
fi

# Clean build if requested
if [ "$CLEAN_BUILD" = true ]; then
    print_step "1. Cleaning previous build artifacts..."
    $HVIGOR_CMD clean
    print_status "Clean completed"
fi

# Install dependencies
print_step "2. Installing dependencies..."
if [ -f "package.json" ]; then
    npm install
elif [ -f "oh-package.json5" ]; then
    print_status "Using oh-package.json5 for dependencies"
else
    print_warning "No package.json or oh-package.json5 found"
fi

# Lint code (if not skipped)
if [ "$SKIP_LINT" = false ]; then
    print_step "3. Running code linting..."
    # Note: HarmonyOS projects don't have standard linting by default
    # This is a placeholder for future linting setup
    print_status "Linting skipped (not configured)"
fi

# Build the application
print_step "4. Building application..."
print_status "Building in $BUILD_MODE mode..."

if [ "$BUILD_MODE" = "release" ]; then
    $HVIGOR_CMD assembleHap --mode module -p product=default -p buildMode=release
else
    $HVIGOR_CMD assembleHap --mode module -p product=default -p buildMode=debug
fi

if [ $? -eq 0 ]; then
    print_status "✓ Build completed successfully!"
else
    print_error "✗ Build failed!"
    exit 1
fi

# Find and display the output HAP file
print_step "5. Locating build artifacts..."
HAP_FILES=$(find . -name "*.hap" -type f 2>/dev/null)

if [ -n "$HAP_FILES" ]; then
    print_status "Build artifacts:"
    echo "$HAP_FILES" | while read -r hap_file; do
        file_size=$(du -h "$hap_file" | cut -f1)
        print_status "  $hap_file ($file_size)"
    done
else
    print_warning "No HAP files found. Build may have failed."
fi

# Display next steps
print_step "6. Next steps:"
print_status "To install on device:"
print_status "  hdc install <path-to-hap-file>"
print_status ""
print_status "To run tests:"
print_status "  ./scripts/test.sh"
print_status ""
print_status "To package for distribution:"
print_status "  ./scripts/package.sh --mode release"

print_status ""
print_status "Build process completed!"