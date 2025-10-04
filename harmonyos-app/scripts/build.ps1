# HarmonyOS App Build Script (PowerShell)
# This script builds the HarmonyOS application

param(
    [string]$Mode = "debug",
    [switch]$Clean,
    [switch]$SkipLint,
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
    Write-Host "Usage: .\build.ps1 [OPTIONS]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Mode MODE              Build mode (debug, release)"
    Write-Host "  -Clean                  Clean build (remove previous build artifacts)"
    Write-Host "  -SkipLint              Skip linting"
    Write-Host "  -Help                   Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\build.ps1 -Mode release"
    Write-Host "  .\build.ps1 -Mode debug -Clean"
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

Write-Status "Building HarmonyOS App"
Write-Status "Build Mode: $Mode"
Write-Status "======================"

# Check if we're in the correct directory
if (-not (Test-Path "oh-package.json5")) {
    Write-Error "Not in HarmonyOS app directory. Please run from harmonyos-app/"
    exit 1
}

# Check if hvigor is available
if (Test-Path "hvigor\bin\hvigorw.bat") {
    $HvigorCmd = ".\hvigor\bin\hvigorw.bat"
} elseif (Test-Path "hvigor\bin\hvigor.js") {
    $HvigorCmd = "node .\hvigor\bin\hvigor.js"
} else {
    try {
        $null = Get-Command hvigor -ErrorAction Stop
        $HvigorCmd = "hvigor"
    } catch {
        Write-Warning "hvigor command not found. Trying to use npx..."
        $HvigorCmd = "npx hvigor"
    }
}

# Clean build if requested
if ($Clean) {
    Write-Step "1. Cleaning previous build artifacts..."
    & $HvigorCmd clean
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Clean completed"
    } else {
        Write-Error "Clean failed"
        exit 1
    }
}

# Install dependencies
Write-Step "2. Installing dependencies..."
if (Test-Path "package.json") {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to install dependencies"
        exit 1
    }
} elseif (Test-Path "oh-package.json5") {
    Write-Status "Using oh-package.json5 for dependencies"
} else {
    Write-Warning "No package.json or oh-package.json5 found"
}

# Lint code (if not skipped)
if (-not $SkipLint) {
    Write-Step "3. Running code linting..."
    # Note: HarmonyOS projects don't have standard linting by default
    # This is a placeholder for future linting setup
    Write-Status "Linting skipped (not configured)"
}

# Build the application
Write-Step "4. Building application..."
Write-Status "Building in $Mode mode..."
$HvigorCmd = "node"
$HvigorScript = "$PSScriptRoot\..\hvigor\bin\hvigor.js"

if ($Mode -eq "release") {
    & $HvigorCmd $HvigorScript assembleHap --mode module -p product=default -p buildMode=release
} else {
    & $HvigorCmd $HvigorScript assembleHap --mode module -p product=default -p buildMode=debug
}

if ($LASTEXITCODE -eq 0) {
    Write-Status "✓ Build completed successfully!"
} else {
    Write-Error "✗ Build failed!"
    exit 1
}

# Find and display the output HAP file
Write-Step "5. Locating build artifacts..."

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

if ($HapFiles.Count -gt 0) {
    Write-Status "Build artifacts:"
    foreach ($hapFile in $HapFiles) {
        $fileSize = [math]::Round($hapFile.Length / 1MB, 2)
        Write-Status "  $($hapFile.FullName) ($fileSize MB)"
    }
} else {
    Write-Warning "No HAP files found after build attempt."
    Write-Warning ""
    Write-Warning "This is likely because:"
    Write-Warning "1. HarmonyOS SDK is not properly configured"
    Write-Warning "2. DevEco Studio is required for initial project setup"
    Write-Warning "3. Build tools are not correctly installed"
    Write-Warning ""
    Write-Warning "RECOMMENDED SOLUTION:"
    Write-Warning "1. Install DevEco Studio from: https://developer.harmonyos.com/en/develop/deveco-studio"
    Write-Warning "2. Open this project in DevEco Studio"
    Write-Warning "3. Let DevEco Studio configure the SDK and build tools"
    Write-Warning "4. Build once in DevEco Studio (Build -> Build Hap(s)/APP(s))"
    Write-Warning "5. After successful IDE build, command line builds should work"
    Write-Warning ""
    Write-Warning "Alternative: Check build logs at .hvigor\outputs\build-logs\build.log"
}

# Display next steps
Write-Step "6. Next steps:"
Write-Status "To install on device:"
Write-Status "  hdc install <path-to-hap-file>"
Write-Status ""
Write-Status "To run tests:"
Write-Status "  .\scripts\test.ps1"
Write-Status ""
Write-Status "To package for distribution:"
Write-Status "  .\scripts\package.ps1 -Mode release"

Write-Status ""
Write-Status "Build process completed!"