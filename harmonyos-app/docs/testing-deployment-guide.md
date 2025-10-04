# HarmonyOS App Testing and Deployment Guide

This guide covers the complete testing and deployment process for the GitHub Trending HarmonyOS application.

## Prerequisites

### Development Environment
- **DevEco Studio**: Version 4.0 or later
- **HarmonyOS SDK**: API Level 9 or higher
- **Node.js**: Version 16 or later
- **hdc**: HarmonyOS Device Connector (included with DevEco Studio)

### Device Requirements
- **HarmonyOS**: Version 3.0 or later
- **API Level**: 9 or higher
- **Device Types**: Phone or Tablet
- **Internet Connection**: Required for API access

## Build Process

### 1. Automated Build

Use the build scripts for consistent builds:

```bash
# Debug build
./scripts/build.sh --mode debug

# Release build
./scripts/build.sh --mode release

# Clean build
./scripts/build.sh --mode release --clean
```

On Windows:
```powershell
# Debug build
.\scripts\build.ps1 -Mode debug

# Release build
.\scripts\build.ps1 -Mode release

# Clean build
.\scripts\build.ps1 -Mode release -Clean
```

### 2. Manual Build

Using DevEco Studio:
1. Open the project in DevEco Studio
2. Select the target device/emulator
3. Click **Build** → **Build Hap(s)/APP(s)**
4. The HAP file will be generated in the build output directory

Using command line:
```bash
# Using hvigor directly
hvigor assembleHap --mode module -p product=default -p buildMode=release
```

## Testing Process

### 1. Automated Testing

Run the comprehensive test suite:

```bash
# Basic testing
./scripts/test.sh

# Test with device installation
./scripts/test.sh --device 127.0.0.1:5555 --install

# Test with custom API URL
./scripts/test.sh --api-url https://api.yourdomain.com
```

On Windows:
```powershell
# Basic testing
.\scripts\test.ps1

# Test with device installation
.\scripts\test.ps1 -DeviceId 127.0.0.1:5555 -Install

# Test with custom API URL
.\scripts\test.ps1 -ApiUrl https://api.yourdomain.com
```

### 2. Manual Testing Checklist

#### Pre-Installation Testing
- [ ] HAP file is generated successfully
- [ ] File size is reasonable (< 50MB)
- [ ] All required permissions are declared
- [ ] API configuration is correct

#### Installation Testing
- [ ] App installs without errors
- [ ] App icon appears in launcher
- [ ] App starts successfully
- [ ] No crash on startup

#### Functionality Testing
- [ ] Main page loads correctly
- [ ] Repository list displays
- [ ] Pull-to-refresh works
- [ ] Repository cards show correct information
- [ ] Tap to open GitHub works
- [ ] Loading states display properly
- [ ] Error handling works correctly

#### Network Testing
- [ ] App works with WiFi connection
- [ ] App works with mobile data
- [ ] Offline behavior is appropriate
- [ ] API timeouts are handled
- [ ] Network errors show user-friendly messages

#### UI/UX Testing
- [ ] Layout adapts to different screen sizes
- [ ] Text is readable and properly sized
- [ ] Colors and themes are consistent
- [ ] Animations are smooth
- [ ] Touch targets are appropriately sized

#### Performance Testing
- [ ] App starts quickly (< 3 seconds)
- [ ] Scrolling is smooth
- [ ] Memory usage is reasonable
- [ ] No memory leaks detected
- [ ] Battery usage is acceptable

## Device Testing

### 1. Emulator Testing

Using DevEco Studio emulator:
1. Start the HarmonyOS emulator
2. Install the HAP file: `hdc install app.hap`
3. Launch the app and test functionality
4. Check logs: `hdc hilog`

### 2. Physical Device Testing

#### Setup Device
1. Enable **Developer Mode**:
   - Go to **Settings** → **About phone**
   - Tap **Build number** 7 times
   - Go back to **Settings** → **System & updates** → **Developer options**
   - Enable **USB debugging**

2. Connect device to computer
3. Verify connection: `hdc list targets`

#### Install and Test
```bash
# Install the app
hdc install path/to/your/app.hap

# Launch the app
hdc shell aa start -a EntryAbility -b com.example.githubtrending

# View logs
hdc hilog | grep "GitHubTrending"

# Uninstall (if needed)
hdc uninstall com.example.githubtrending
```

### 3. Multi-Device Testing

Test on different device types:
- **Phones**: Different screen sizes and resolutions
- **Tablets**: Landscape and portrait orientations
- **Foldable devices**: Folded and unfolded states

## Packaging for Distribution

### 1. Release Build

Create a release build for distribution:

```bash
# Package for distribution
./scripts/package.sh --mode release --output dist

# With signing (if certificates are available)
./scripts/package.sh --mode release --sign --keystore my.p12 --password mypass --alias mykey
```

On Windows:
```powershell
# Package for distribution
.\scripts\package.ps1 -Mode release -OutputDir dist

# With signing (if certificates are available)
.\scripts\package.ps1 -Mode release -Sign -KeystorePath my.p12 -KeystorePassword mypass -KeyAlias mykey
```

### 2. Package Contents

The packaging script generates:
- **HAP file**: The installable application package
- **Checksums**: SHA256 and MD5 for verification
- **Package info**: JSON file with build details
- **Installation guide**: Step-by-step instructions

### 3. Distribution Methods

#### Developer Distribution
- Direct installation via hdc
- Side-loading on developer devices
- Internal testing and validation

#### App Store Distribution
- Submit to Huawei AppGallery
- Follow Huawei's review guidelines
- Provide required metadata and screenshots

## API Configuration

### 1. Development Environment

For development, the app connects to:
- **Local API**: `http://localhost:8787` (if running locally)
- **Staging API**: `https://staging-api.yourdomain.com`

### 2. Production Environment

For production builds:
- **Production API**: `https://api.yourdomain.com`
- **Custom Domain**: Configure in `ApiConstants.ets`

Update the API URL in:
```typescript
// harmonyos-app/entry/src/main/ets/constants/ApiConstants.ets
export const API_BASE_URL = 'https://api.yourdomain.com';
```

## Troubleshooting

### Common Build Issues

1. **Build fails with "Module not found"**
   - Check `oh-package.json5` dependencies
   - Run `npm install` in the project directory

2. **HAP file not generated**
   - Check build logs for errors
   - Ensure all required files are present
   - Verify SDK version compatibility

3. **Signing errors**
   - Verify certificate validity
   - Check keystore password and alias
   - Ensure proper signing configuration

### Common Installation Issues

1. **Installation fails on device**
   - Enable Developer Mode
   - Check device compatibility
   - Verify HAP file integrity

2. **App crashes on startup**
   - Check device logs: `hdc hilog`
   - Verify API configuration
   - Test on emulator first

3. **Network connectivity issues**
   - Check internet permission
   - Verify API endpoint accessibility
   - Test with different network conditions

### Performance Issues

1. **Slow app startup**
   - Optimize initialization code
   - Reduce bundle size
   - Profile with DevEco Studio

2. **Memory leaks**
   - Use DevEco Studio profiler
   - Check for retained references
   - Optimize image loading

## Quality Assurance

### 1. Code Quality
- Follow HarmonyOS coding standards
- Use TypeScript strict mode
- Implement proper error handling
- Add comprehensive logging

### 2. Security
- Validate all network inputs
- Use HTTPS for API communication
- Implement proper certificate validation
- Avoid storing sensitive data

### 3. Accessibility
- Add proper content descriptions
- Support screen readers
- Ensure adequate color contrast
- Test with accessibility services

## Deployment Checklist

### Pre-Deployment
- [ ] All tests pass
- [ ] Code review completed
- [ ] API endpoints are configured
- [ ] Performance benchmarks met
- [ ] Security review completed

### Deployment
- [ ] Release build created
- [ ] Package integrity verified
- [ ] Installation tested on multiple devices
- [ ] Network connectivity validated
- [ ] User acceptance testing completed

### Post-Deployment
- [ ] Monitor crash reports
- [ ] Check user feedback
- [ ] Monitor API usage
- [ ] Plan updates and improvements

## Support and Maintenance

### Monitoring
- Track app crashes and errors
- Monitor API response times
- Analyze user engagement metrics
- Review app store ratings and feedback

### Updates
- Regular security updates
- API compatibility updates
- Feature enhancements
- Bug fixes and improvements

### Documentation
- Keep installation guides updated
- Maintain troubleshooting documentation
- Update API documentation
- Provide user support materials

---

For additional support, refer to:
- [HarmonyOS Developer Documentation](https://developer.harmonyos.com/)
- [DevEco Studio User Guide](https://developer.harmonyos.com/en/develop/deveco-studio)
- Project README and API documentation