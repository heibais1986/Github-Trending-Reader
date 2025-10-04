# HarmonyOS App Packaging Script (PowerShell)
# This script packages the HarmonyOS application for distribution

param(
    [string]$Mode = "release",
    [string]$OutputDir = "dist",
    [switch]$Sign,
    [string]$KeystorePath = "",
    [string]$KeystorePassword = "",
    [string]$KeyAlias = "",
    [switch]$Help
)

# Function to write colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Step {
    param([string]$Message)
    Write-Host "[STEP] $Message" -ForegroundColor Blue
}

# Function to show usage
function Show-Usage {
    Write-Host "Usage: .\package.ps1 [OPTIONS]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Mode MODE              Build mode (debug, release)"
    Write-Host "  -OutputDir DIR          Output directory for packaged files"
    Write-Host "  -Sign                   Sign the application"
    Write-Host "  -KeystorePath PATH      Path to keystore file"
    Write-Host "  -KeystorePassword PASS  Keystore password"
    Write-Host "  -KeyAlias ALIAS         Key alias"
    Write-Host "  -Help                   Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\package.ps1 -Mode release -OutputDir dist"
    Write-Host "  .\package.ps1 -Sign -KeystorePath my.p12 -KeystorePassword mypass -KeyAlias mykey"
}

# Show help if requested
if ($Help) {
    Show-Usage
    exit 0
}

# Validate build mode
if ($Mode -notin @("debug", "release")) {
    Write-Error "Invalid build mode: $Mode"
    Write-Error "Valid modes: debug, release"
    exit 1
}

Write-Status "Packaging HarmonyOS App"
Write-Status "Build Mode: $Mode"
Write-Status "Output Directory: $OutputDir"
Write-Status "========================="

# Check if we're in the correct directory
if (-not (Test-Path "oh-package.json5")) {
    Write-Error "Not in HarmonyOS app directory. Please run from harmonyos-app/"
    exit 1
}

# Create output directory
Write-Step "1. Creating output directory..."
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}
Write-Status "Output directory created: $OutputDir"

# Build the application
Write-Step "2. Building application..."
.\scripts\build.ps1 -Mode $Mode

# Find the built HAP file
Write-Step "3. Locating build artifacts..."

# Check common build output locations
$BuildOutputPaths = @(
    "build\outputs\hap\entry\release",
    "build\outputs\hap\entry\debug", 
    "entry\build\outputs\hap\release",
    "entry\build\outputs\hap\debug",
    "outputs\hap\entry\release",
    "outputs\hap\entry\debug",
    ".hvigor\outputs\hap\entry\release",
    ".hvigor\outputs\hap\entry\debug"
)

$HapFiles = @()
foreach ($path in $BuildOutputPaths) {
    if (Test-Path $path) {
        $HapFiles += Get-ChildItem -Path $path -Filter "*.hap" -File -ErrorAction SilentlyContinue
    }
}

# Fallback: search recursively
if ($HapFiles.Count -eq 0) {
    $HapFiles = Get-ChildItem -Recurse -Filter "*.hap" -File -ErrorAction SilentlyContinue
}

if ($HapFiles.Count -eq 0) {
    Write-Error "No HAP files found. Cannot package without a built application."
    Write-Error ""
    Write-Error "SOLUTION STEPS:"
    Write-Error "1. Install DevEco Studio: https://developer.harmonyos.com/en/develop/deveco-studio"
    Write-Error "2. Open this project in DevEco Studio"
    Write-Error "3. Build the project: Build -> Build Hap(s)/APP(s)"
    Write-Error "4. Run this packaging script again"
    Write-Error ""
    Write-Error "Or try: .\scripts\build.ps1 -Mode $Mode"
    exit 1
}

$HapFile = $HapFiles[0].FullName
Write-Status "Found HAP file: $HapFile"

# Get app information
Write-Step "4. Extracting app information..."
$packageContent = Get-Content "oh-package.json5" -Raw
$AppName = ($packageContent | Select-String '"name"\s*:\s*"([^"]*)"').Matches[0].Groups[1].Value
$AppVersion = ($packageContent | Select-String '"version"\s*:\s*"([^"]*)"').Matches[0].Groups[1].Value

if (-not $AppName) {
    $AppName = "github-trending-harmonyos"
}

if (-not $AppVersion) {
    $AppVersion = "1.0.0"
}

Write-Status "App Name: $AppName"
Write-Status "App Version: $AppVersion"

# Create versioned filename
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$VersionedName = "$AppName-$AppVersion-$Mode-$Timestamp.hap"

# Copy HAP file to output directory
Write-Step "5. Copying HAP file..."
Copy-Item $HapFile "$OutputDir\$VersionedName"
Write-Status "HAP file copied to: $OutputDir\$VersionedName"

# Sign the application if requested
if ($Sign) {
    Write-Step "6. Signing application..."
    
    if (-not $KeystorePath -or -not $KeystorePassword -or -not $KeyAlias) {
        Write-Error "Signing requires keystore path, password, and alias"
        Write-Error "Use -KeystorePath, -KeystorePassword, and -KeyAlias parameters"
        exit 1
    }
    
    if (-not (Test-Path $KeystorePath)) {
        Write-Error "Keystore file not found: $KeystorePath"
        exit 1
    }
    
    # Note: This is a placeholder for actual signing process
    # HarmonyOS signing requires specific tools and certificates
    Write-Warning "Signing functionality is not yet implemented"
    Write-Warning "Please use DevEco Studio or official signing tools"
}

# Generate checksums
Write-Step "7. Generating checksums..."
$HapFilePath = "$OutputDir\$VersionedName"
$Sha256Hash = (Get-FileHash -Path $HapFilePath -Algorithm SHA256).Hash.ToLower()
$Md5Hash = (Get-FileHash -Path $HapFilePath -Algorithm MD5).Hash.ToLower()

Set-Content -Path "$HapFilePath.sha256" -Value "$Sha256Hash  $VersionedName"
Set-Content -Path "$HapFilePath.md5" -Value "$Md5Hash  $VersionedName"

Write-Status "Checksums generated:"
Write-Status "  SHA256: $OutputDir\$VersionedName.sha256"
Write-Status "  MD5: $OutputDir\$VersionedName.md5"

# Create package information file
Write-Step "8. Creating package information..."
$PackageInfoFile = "$OutputDir\package-info.json"
$FileSize = [math]::Round((Get-Item $HapFilePath).Length / 1MB, 2)

$packageInfo = @{
    name = $AppName
    version = $AppVersion
    buildMode = $Mode
    buildDate = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssK")
    hapFile = $VersionedName
    fileSize = "$FileSize MB"
    checksums = @{
        sha256 = $Sha256Hash
        md5 = $Md5Hash
    }
    requirements = @{
        minSdkVersion = 9
        targetSdkVersion = 11
        deviceTypes = @("phone", "tablet")
    }
    permissions = @("ohos.permission.INTERNET")
}

$packageInfo | ConvertTo-Json -Depth 3 | Set-Content $PackageInfoFile
Write-Status "Package information saved to: $PackageInfoFile"

# Create installation instructions
Write-Step "9. Creating installation instructions..."
$InstallInstructions = "$OutputDir\INSTALL.md"
$BuildDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

$installContent = @"
# Installation Instructions

## GitHub Trending HarmonyOS App

### Package Information
- **App Name**: $AppName
- **Version**: $AppVersion
- **Build Mode**: $Mode
- **Build Date**: $BuildDate
- **File**: $VersionedName

### System Requirements
- HarmonyOS 3.0 or later
- API Level 9 or higher
- Internet connection

### Installation Methods

#### Method 1: Using hdc (Developer)
1. Enable Developer Mode on your device
2. Connect device to computer
3. Install using hdc:
   ``````bash
   hdc install $VersionedName
   ``````

#### Method 2: Side-loading (Advanced Users)
1. Enable "Install from Unknown Sources" in device settings
2. Transfer the HAP file to your device
3. Use a file manager to install the HAP file

### Verification
After installation, verify the checksums:
- **SHA256**: $Sha256Hash
- **MD5**: $Md5Hash

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
"@

Set-Content -Path $InstallInstructions -Value $installContent
Write-Status "Installation instructions saved to: $InstallInstructions"

# Display package summary
Write-Step "10. Package Summary"
Write-Status "Packaging completed successfully!"
Write-Status ""
Write-Status "Package Details:"
Write-Status "  Name: $AppName"
Write-Status "  Version: $AppVersion"
Write-Status "  Build Mode: $Mode"
Write-Status "  HAP File: $OutputDir\$VersionedName"
Write-Status "  File Size: $FileSize MB"
Write-Status ""
Write-Status "Generated Files:"
Write-Status "  📱 $OutputDir\$VersionedName"
Write-Status "  🔒 $OutputDir\$VersionedName.sha256"
Write-Status "  🔒 $OutputDir\$VersionedName.md5"
Write-Status "  📋 $OutputDir\package-info.json"
Write-Status "  📖 $OutputDir\INSTALL.md"
Write-Status ""
Write-Status "Next Steps:"
Write-Status "1. Test the HAP file on a device"
Write-Status "2. Verify checksums match"
Write-Status "3. Distribute the package"
Write-Status ""
Write-Status "Installation Command:"
Write-Status "  hdc install $OutputDir\$VersionedName"