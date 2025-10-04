# HarmonyOS App Testing Script (PowerShell)
# This script runs tests and validates the HarmonyOS application

param(
    [string]$DeviceId = "",
    [switch]$Install,
    [switch]$NoNetwork,
    [string]$ApiUrl = "",
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
    Write-Host "Usage: .\test.ps1 [OPTIONS]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -DeviceId DEVICE_ID     Target device ID for testing"
    Write-Host "  -Install               Install app on device before testing"
    Write-Host "  -NoNetwork             Skip network connectivity tests"
    Write-Host "  -ApiUrl URL            API URL to test connectivity"
    Write-Host "  -Help                  Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\test.ps1 -DeviceId 127.0.0.1:5555 -Install"
    Write-Host "  .\test.ps1 -ApiUrl https://api.yourdomain.com"
}

# Show help if requested
if ($Help) {
    Show-Usage
    exit 0
}

Write-Status "HarmonyOS App Testing"
Write-Status "===================="

# Check if we're in the correct directory
if (-not (Test-Path "oh-package.json5")) {
    Write-Error "Not in HarmonyOS app directory. Please run from harmonyos-app/"
    exit 1
}

# Check if hdc is available
try {
    $null = Get-Command hdc -ErrorAction Stop
} catch {
    Write-Error "hdc (HarmonyOS Device Connector) is not installed or not in PATH"
    Write-Error "Please install DevEco Studio and ensure hdc is available"
    exit 1
}

# List available devices
Write-Step "1. Checking connected devices..."
try {
    $Devices = hdc list targets 2>$null
    if (-not $Devices -or $Devices -eq "[Empty]") {
        Write-Warning "No devices connected"
        Write-Warning "Please connect a device or start an emulator"
        if ($Install) {
            Write-Error "Cannot install app without a connected device"
            exit 1
        }
    } else {
        Write-Status "Connected devices:"
        $Devices -split "`n" | ForEach-Object {
            if ($_ -and $_ -ne "[Empty]") {
                Write-Status "  $_"
            }
        }
        
        # Use the first device if none specified
        if (-not $DeviceId) {
            $DeviceId = ($Devices -split "`n")[0]
            Write-Status "Using device: $DeviceId"
        }
    }
} catch {
    Write-Warning "Could not list devices: $($_.Exception.Message)"
}

# Build the app if needed
Write-Step "2. Checking build artifacts..."
$HapFiles = Get-ChildItem -Recurse -Filter "*.hap" -File

if ($HapFiles.Count -eq 0) {
    Write-Warning "No HAP files found. Building app..."
    .\scripts\build.ps1 -Mode debug
    $HapFiles = Get-ChildItem -Recurse -Filter "*.hap" -File
}

if ($HapFiles.Count -gt 0) {
    $HapFile = $HapFiles[0].FullName
    Write-Status "Using HAP file: $HapFile"
} else {
    Write-Error "No HAP files found after build"
    exit 1
}

# Install app on device if requested
if ($Install -and $DeviceId) {
    Write-Step "3. Installing app on device..."
    Write-Status "Installing $HapFile on $DeviceId"
    
    $installResult = hdc -t $DeviceId install $HapFile
    if ($LASTEXITCODE -eq 0) {
        Write-Status "✓ App installed successfully"
    } else {
        Write-Error "✗ App installation failed"
        exit 1
    }
}

# Run static analysis tests
Write-Step "4. Running static analysis..."
Write-Status "Checking code structure and dependencies..."

# Check if all required files exist
$RequiredFiles = @(
    "entry/src/main/ets/entryability/EntryAbility.ets",
    "entry/src/main/ets/pages/Index.ets",
    "entry/src/main/module.json5"
)

foreach ($file in $RequiredFiles) {
    if (Test-Path $file) {
        Write-Status "✓ $file exists"
    } else {
        Write-Error "✗ Missing required file: $file"
    }
}

# Check permissions in module.json5
if (Test-Path "entry/src/main/module.json5") {
    $moduleContent = Get-Content "entry/src/main/module.json5" -Raw
    if ($moduleContent -match "ohos\.permission\.INTERNET") {
        Write-Status "✓ Internet permission is configured"
    } else {
        Write-Error "✗ Internet permission is missing"
    }
}

# Network connectivity tests
if (-not $NoNetwork) {
    Write-Step "5. Testing network connectivity..."
    
    # Determine API URL
    if (-not $ApiUrl) {
        # Try to extract from ApiConstants.ets
        if (Test-Path "entry/src/main/ets/constants/ApiConstants.ets") {
            $apiContent = Get-Content "entry/src/main/ets/constants/ApiConstants.ets" -Raw
            $ApiUrl = ($apiContent | Select-String 'https://[^"]*').Matches[0].Value
        }
    }
    
    if ($ApiUrl) {
        Write-Status "Testing API connectivity: $ApiUrl"
        
        # Test health endpoint
        try {
            $healthResponse = Invoke-WebRequest -Uri "$ApiUrl/health" -Method GET -UseBasicParsing
            Write-Status "✓ API health endpoint is accessible"
        } catch {
            Write-Warning "⚠ API health endpoint is not accessible"
        }
        
        # Test trending endpoint
        try {
            $trendingResponse = Invoke-WebRequest -Uri "$ApiUrl/api/trending" -Method GET -UseBasicParsing
            Write-Status "✓ API trending endpoint is accessible"
        } catch {
            Write-Warning "⚠ API trending endpoint is not accessible"
        }
    } else {
        Write-Warning "No API URL found for testing"
    }
}

# App functionality tests (if device is available)
if ($DeviceId -and $Install) {
    Write-Step "6. Testing app functionality..."
    
    # Get app package name from module.json5
    if (Test-Path "entry/src/main/module.json5") {
        $moduleContent = Get-Content "entry/src/main/module.json5" -Raw
        $bundleNameMatch = $moduleContent | Select-String '"bundleName"\s*:\s*"([^"]*)"'
        if ($bundleNameMatch) {
            $BundleName = $bundleNameMatch.Matches[0].Groups[1].Value
            Write-Status "Testing app: $BundleName"
            
            # Check if app is installed
            try {
                $dumpResult = hdc -t $DeviceId shell bm dump -n $BundleName 2>$null
                if ($LASTEXITCODE -eq 0) {
                    Write-Status "✓ App is installed on device"
                } else {
                    Write-Warning "⚠ App may not be properly installed"
                }
            } catch {
                Write-Warning "⚠ Could not verify app installation"
            }
            
            # Try to start the app
            Write-Status "Attempting to start app..."
            try {
                $startResult = hdc -t $DeviceId shell aa start -a EntryAbility -b $BundleName
                if ($LASTEXITCODE -eq 0) {
                    Write-Status "✓ App started successfully"
                    Start-Sleep -Seconds 3
                    
                    # Check if app is running
                    $psResult = hdc -t $DeviceId shell ps
                    if ($psResult -match $BundleName) {
                        Write-Status "✓ App is running"
                    } else {
                        Write-Warning "⚠ App may have crashed or closed"
                    }
                } else {
                    Write-Warning "⚠ Could not start app automatically"
                }
            } catch {
                Write-Warning "⚠ Could not start app: $($_.Exception.Message)"
            }
        } else {
            Write-Warning "Could not determine app bundle name"
        }
    }
}

# Performance analysis
Write-Step "7. Performance analysis..."
if ($HapFile) {
    $FileSize = [math]::Round((Get-Item $HapFile).Length / 1MB, 2)
    Write-Status "HAP file size: $FileSize MB"
    
    # Check if size is reasonable (< 50MB for a simple app)
    if ($FileSize -lt 50) {
        Write-Status "✓ App size is reasonable"
    } else {
        Write-Warning "⚠ App size is large (>50MB)"
    }
}

# Generate test report
Write-Step "8. Generating test report..."
$ReportFile = "test-report-$(Get-Date -Format 'yyyyMMdd-HHmmss').txt"

$reportContent = @"
HarmonyOS App Test Report
========================
Date: $(Get-Date)
HAP File: $HapFile
Device: $DeviceId
API URL: $ApiUrl

Test Results:
- Static Analysis: Completed
- Network Tests: $(if ($NoNetwork) { "Skipped" } else { "Completed" })
- Device Tests: $(if ($Install) { "Completed" } else { "Skipped" })
- Performance Check: Completed

For detailed results, see the console output above.
"@

Set-Content -Path $ReportFile -Value $reportContent
Write-Status "Test report saved to: $ReportFile"

Write-Status ""
Write-Status "Testing completed!"
Write-Status "=================="
Write-Status "Next steps:"
Write-Status "1. Review test results above"
Write-Status "2. Test manually on device if needed"
Write-Status "3. Run performance tests if required"
Write-Status "4. Package for distribution: .\scripts\package.ps1"