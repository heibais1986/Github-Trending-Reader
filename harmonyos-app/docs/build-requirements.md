# HarmonyOS Build Requirements

## Overview

Building HarmonyOS applications requires specific tools and environment setup. This document outlines the requirements and common issues.

## Required Tools

### 1. DevEco Studio
- **Version**: 4.0 or later
- **Purpose**: Official IDE for HarmonyOS development
- **Download**: [DevEco Studio Official Site](https://developer.harmonyos.com/en/develop/deveco-studio)

### 2. HarmonyOS SDK
- **API Level**: 9 or higher (minimum)
- **Target API**: 11 (recommended)
- **Installation**: Through DevEco Studio SDK Manager

### 3. Node.js
- **Version**: 16 or later
- **Purpose**: Required for hvigor build system
- **Download**: [Node.js Official Site](https://nodejs.org/)

## Build Process

### Method 1: DevEco Studio (Recommended)
1. Open the project in DevEco Studio
2. Configure the SDK path
3. Select target device/emulator
4. Click **Build** → **Build Hap(s)/APP(s)**
5. HAP files will be generated in `build/outputs/hap/`

### Method 2: Command Line
```bash
# Using build scripts (may require DevEco Studio SDK)
./scripts/build.sh --mode release

# Using hvigor directly
node ./hvigor/bin/hvigor.js assembleHap --mode module -p product=default -p buildMode=release
```

## Common Issues

### 1. No HAP Files Generated
**Symptoms**: Build completes but no `.hap` files are found

**Causes**:
- Incomplete project structure
- Missing SDK components
- Incorrect build configuration
- Missing signing certificates

**Solutions**:
1. Use DevEco Studio for the first build
2. Ensure all SDK components are installed
3. Check build logs in `.hvigor/outputs/build-logs/`
4. Verify project configuration files

### 2. Build Command Not Found
**Symptoms**: `hvigor` command not recognized

**Solutions**:
- Use the local hvigor wrapper: `./hvigor/bin/hvigorw.bat` (Windows) or `./hvigor/bin/hvigorw` (Linux/macOS)
- Use Node.js directly: `node ./hvigor/bin/hvigor.js`
- Install DevEco Studio and use its integrated build system

### 3. SDK Path Issues
**Symptoms**: Build fails with SDK-related errors

**Solutions**:
1. Set `OHOS_SDK_HOME` environment variable
2. Update `local.properties` with correct SDK path
3. Use DevEco Studio to configure SDK automatically

### 4. Signing Issues
**Symptoms**: Build fails during signing phase

**Solutions**:
1. Use debug signing for development
2. Configure proper signing certificates for release builds
3. Check signing configuration in `build-profile.json5`

## Project Structure Requirements

### Minimum Required Files
```
harmonyos-app/
├── AppScope/
│   └── app.json5                 # App configuration
├── entry/
│   ├── src/main/
│   │   ├── ets/                  # ArkTS source code
│   │   ├── resources/            # Resources (strings, images, etc.)
│   │   └── module.json5          # Module configuration
│   ├── oh-package.json5          # Module dependencies
│   └── hvigorfile.ts            # Build configuration
├── build-profile.json5           # Build profiles
├── hvigorfile.ts                # Project build configuration
├── oh-package.json5             # Project dependencies
└── hvigor/                      # Build system
```

### Configuration Files

#### `build-profile.json5`
```json5
{
  "app": {
    "signingConfigs": [],
    "compileSdkVersion": 11,
    "compatibleSdkVersion": 9,
    "products": [
      {
        "name": "default",
        "signingConfig": "default",
        "compileSdkVersion": 11,
        "compatibleSdkVersion": 9
      }
    ]
  },
  "modules": [
    {
      "name": "entry",
      "srcPath": "./entry",
      "targets": [
        {
          "name": "default",
          "applyToProducts": ["default"]
        }
      ]
    }
  ]
}
```

#### `local.properties` (create if missing)
```properties
# SDK path (update with your actual path)
sdk.dir=C:\\Users\\YourUser\\AppData\\Local\\OpenHarmony\\Sdk
nodejs.dir=C:\\Program Files\\nodejs
```

## Build Output Locations

HAP files are typically generated in:
- `build/outputs/hap/entry/release/` (release builds)
- `build/outputs/hap/entry/debug/` (debug builds)
- `entry/build/outputs/hap/` (alternative location)

## Troubleshooting Steps

### 1. Verify Environment
```bash
# Check Node.js version
node --version

# Check if hvigor wrapper exists
ls -la hvigor/bin/

# Check project structure
ls -la AppScope/ entry/src/main/
```

### 2. Clean Build
```bash
# Clean previous build artifacts
node ./hvigor/bin/hvigor.js clean

# Rebuild
node ./hvigor/bin/hvigor.js assembleHap --mode module -p product=default -p buildMode=release
```

### 3. Check Build Logs
```bash
# View build logs
cat .hvigor/outputs/build-logs/build.log
```

### 4. DevEco Studio Integration
1. Import the project into DevEco Studio
2. Let DevEco Studio configure the environment
3. Build once in the IDE
4. Command line builds should work afterward

## Alternative: Mock Build for Testing

For testing the packaging and deployment scripts without a full build environment, you can create a mock HAP file:

```bash
# Create mock HAP file for testing
mkdir -p build/outputs/hap/entry/release
echo "Mock HAP content" > build/outputs/hap/entry/release/entry-default-signed.hap
```

This allows testing of the packaging and deployment workflows while working on setting up the full build environment.

## Support Resources

- [HarmonyOS Developer Documentation](https://developer.harmonyos.com/)
- [DevEco Studio User Guide](https://developer.harmonyos.com/en/develop/deveco-studio)
- [HarmonyOS Build System Guide](https://developer.harmonyos.com/en/docs/documentation/doc-guides/build_overview-0000001218440654)
- [Troubleshooting Guide](https://developer.harmonyos.com/en/docs/documentation/doc-guides/faq-0000001071482184)