#!/bin/bash

# HarmonyOS App Packaging Script
# This script packages the HarmonyOS application for distribution

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
BUILD_MODE="release"
OUTPUT_DIR="dist"
SIGN_APP=false
KEYSTORE_PATH=""
KEYSTORE_PASSWORD=""
KEY_ALIAS=""

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -m, --mode MODE         Build mode (debug, release)"
    echo "  -o, --output DIR        Output directory for packaged files"
    echo "  -s, --sign             Sign the application"
    echo "  -k, --keystore PATH    Path to keystore file"
    echo "  -p, --password PASS    Keystore password"
    echo "  -a, --alias ALIAS      Key alias"
    echo "  -h, --help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --mode release --output dist"
    echo "  $0 --sign --keystore my.p12 --password mypass --alias mykey"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -m|--mode)
            BUILD_MODE="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        -s|--sign)
            SIGN_APP=true
            shift
            ;;
        -k|--keystore)
            KEYSTORE_PATH="$2"
            shift 2
            ;;
        -p|--password)
            KEYSTORE_PASSWORD="$2"
            shift 2
            ;;
        -a|--alias)
            KEY_ALIAS="$2"
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

# Validate build mode
if [[ ! "$BUILD_MODE" =~ ^(debug|release)$ ]]; then
    print_error "Invalid build mode: $BUILD_MODE"
    print_error "Valid modes: debug, release"
    exit 1
fi

print_status "Packaging HarmonyOS App"
print_status "Build Mode: $BUILD_MODE"
print_status "Output Directory: $OUTPUT_DIR"
print_status "========================="

# Check if we're in the correct directory
if [ ! -f "oh-package.json5" ]; then
    print_error "Not in HarmonyOS app directory. Please run from harmonyos-app/"
    exit 1
fi

# Create output directory
print_step "1. Creating output directory..."
mkdir -p "$OUTPUT_DIR"
print_status "Output directory created: $OUTPUT_DIR"

# Build the application
print_step "2. Building application..."
./scripts/build.sh --mode "$BUILD_MODE"

# Find the built HAP file
print_step "3. Locating build artifacts..."
HAP_FILES=$(find . -name "*.hap" -type f 2>/dev/null)

if [ -z "$HAP_FILES" ]; then
    print_error "No HAP files found. Build may have failed."
    exit 1
fi

HAP_FILE=$(echo "$HAP_FILES" | head -1)
print_status "Found HAP file: $HAP_FILE"

# Get app information
print_step "4. Extracting app information..."
APP_NAME=$(grep -o '"name"[[:space:]]*:[[:space:]]*"[^"]*"' oh-package.json5 | head -1 | cut -d'"' -f4)
APP_VERSION=$(grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' oh-package.json5 | head -1 | cut -d'"' -f4)

if [ -z "$APP_NAME" ]; then
    APP_NAME="github-trending-harmonyos"
fi

if [ -z "$APP_VERSION" ]; then
    APP_VERSION="1.0.0"
fi

print_status "App Name: $APP_NAME"
print_status "App Version: $APP_VERSION"

# Create versioned filename
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
VERSIONED_NAME="${APP_NAME}-${APP_VERSION}-${BUILD_MODE}-${TIMESTAMP}.hap"

# Copy HAP file to output directory
print_step "5. Copying HAP file..."
cp "$HAP_FILE" "$OUTPUT_DIR/$VERSIONED_NAME"
print_status "HAP file copied to: $OUTPUT_DIR/$VERSIONED_NAME"

# Sign the application if requested
if [ "$SIGN_APP" = true ]; then
    print_step "6. Signing application..."
    
    if [ -z "$KEYSTORE_PATH" ] || [ -z "$KEYSTORE_PASSWORD" ] || [ -z "$KEY_ALIAS" ]; then
        print_error "Signing requires keystore path, password, and alias"
        print_error "Use --keystore, --password, and --alias options"
        exit 1
    fi
    
    if [ ! -f "$KEYSTORE_PATH" ]; then
        print_error "Keystore file not found: $KEYSTORE_PATH"
        exit 1
    fi
    
    # Note: This is a placeholder for actual signing process
    # HarmonyOS signing requires specific tools and certificates
    print_warning "Signing functionality is not yet implemented"
    print_warning "Please use DevEco Studio or official signing tools"
fi

# Generate checksums
print_step "7. Generating checksums..."
cd "$OUTPUT_DIR"
sha256sum "$VERSIONED_NAME" > "${VERSIONED_NAME}.sha256"
md5sum "$VERSIONED_NAME" > "${VERSIONED_NAME}.md5"
cd - > /dev/null

print_status "Checksums generated:"
print_status "  SHA256: $OUTPUT_DIR/${VERSIONED_NAME}.sha256"
print_status "  MD5: $OUTPUT_DIR/${VERSIONED_NAME}.md5"

# Create package information file
print_step "8. Creating package information..."
PACKAGE_INFO_FILE="$OUTPUT_DIR/package-info.json"

cat > "$PACKAGE_INFO_FILE" << EOF
{
  "name": "$APP_NAME",
  "version": "$APP_VERSION",
  "buildMode": "$BUILD_MODE",
  "buildDate": "$(date -Iseconds)",
  "hapFile": "$VERSIONED_NAME",
  "fileSize": "$(du -h "$OUTPUT_DIR/$VERSIONED_NAME" | cut -f1)",
  "checksums": {
    "sha256": "$(cat "$OUTPUT_DIR/${VERSIONED_NAME}.sha256" | cut -d' ' -f1)",
    "md5": "$(cat "$OUTPUT_DIR/${VERSIONED_NAME}.md5" | cut -d' ' -f1)"
  },
  "requirements": {
    "minSdkVersion": 9,
    "targetSdkVersion": 11,
    "deviceTypes": ["phone", "tablet"]
  },
  "permissions": [
    "ohos.permission.INTERNET"
  ]
}
EOF

print_status "Package information saved to: $PACKAGE_INFO_FILE"

# Create installation instructions
print_step "9. Creating installation instructions..."
INSTALL_INSTRUCTIONS="$OUTPUT_DIR/INSTALL.md"

cat > "$INSTALL_INSTRUCTIONS" << EOF
# Installation Instructions

## GitHub Trending HarmonyOS App

### Package Information
- **App Name**: $APP_NAME
- **Version**: $APP_VERSION
- **Build Mode**: $BUILD_MODE
- **Build Date**: $(date)
- **File**: $VERSIONED_NAME

### System Requirements
- HarmonyOS 3.0 or later
- API Level 9 or higher
- Internet connection

### Installation Methods

#### Method 1: Using hdc (Developer)
1. Enable Developer Mode on your device
2. Connect device to computer
3. Install using hdc:
   \`\`\`bash
   hdc install $VERSIONED_NAME
   \`\`\`

#### Method 2: Side-loading (Advanced Users)
1. Enable "Install from Unknown Sources" in device settings
2. Transfer the HAP file to your device
3. Use a file manager to install the HAP file

### Verification
After installation, verify the checksums:
- **SHA256**: $(cat "$OUTPUT_DIR/${VERSIONED_NAME}.sha256" | cut -d' ' -f1)
- **MD5**: $(cat "$OUTPUT_DIR/${VERSIONED_NAME}.md5" | cut -d' ' -f1)

### Permissions
This app requires the following permissions:
- **Internet Access**: To fetch GitHub trending repositories

### Troubleshooting
- Ensure your device supports HarmonyOS 3.0+
- Check that Developer Mode is enabled for hdc installation
- Verify the HAP file is not corrupted using checksums
- Contact support if installation fails

### Support
For issues or questions, please refer to the project documentation.
EOF

print_status "Installation instructions saved to: $INSTALL_INSTRUCTIONS"

# Display package summary
print_step "10. Package Summary"
print_status "Packaging completed successfully!"
print_status ""
print_status "Package Details:"
print_status "  Name: $APP_NAME"
print_status "  Version: $APP_VERSION"
print_status "  Build Mode: $BUILD_MODE"
print_status "  HAP File: $OUTPUT_DIR/$VERSIONED_NAME"
print_status "  File Size: $(du -h "$OUTPUT_DIR/$VERSIONED_NAME" | cut -f1)"
print_status ""
print_status "Generated Files:"
print_status "  📱 $OUTPUT_DIR/$VERSIONED_NAME"
print_status "  🔒 $OUTPUT_DIR/${VERSIONED_NAME}.sha256"
print_status "  🔒 $OUTPUT_DIR/${VERSIONED_NAME}.md5"
print_status "  📋 $OUTPUT_DIR/package-info.json"
print_status "  📖 $OUTPUT_DIR/INSTALL.md"
print_status ""
print_status "Next Steps:"
print_status "1. Test the HAP file on a device"
print_status "2. Verify checksums match"
print_status "3. Distribute the package"
print_status ""
print_status "Installation Command:"
print_status "  hdc install $OUTPUT_DIR/$VERSIONED_NAME"