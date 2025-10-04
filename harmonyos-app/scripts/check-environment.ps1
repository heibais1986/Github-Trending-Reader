# HarmonyOS Development Environment Check Script
# This script verifies that the development environment is properly configured

param(
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
    Write-Host "[CHECK] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[✓] $Message" -ForegroundColor Green
}

function Write-Fail {
    param([string]$Message)
    Write-Host "[✗] $Message" -ForegroundColor Red
}

# Function to show usage
function Show-Usage {
    Write-Host "Usage: .\check-environment.ps1"
    Write-Host ""
    Write-Host "This script checks if your HarmonyOS development environment is properly configured."
    Write-Host ""
    Write-Host "It verifies:"
    Write-Host "  - Project structure"
    Write-Host "  - Node.js installation"
    Write-Host "  - HarmonyOS SDK configuration"
    Write-Host "  - Build tools availability"
    Write-Host "  - Previous build artifacts"
}

# Show help if requested
if ($Help) {
    Show-Usage
    exit 0
}

Write-Status "HarmonyOS Development Environment Check"
Write-Status "======================================"

$issuesFound = 0

# Check 1: Project structure
Write-Step "1. Checking project structure..."

$requiredFiles = @(
    "oh-package.json5",
    "build-profile.json5", 
    "hvigorfile.ts",
    "entry/src/main/module.json5",
    "entry/src/main/ets/entryability/EntryAbility.ets",
    "entry/src/main/ets/pages/Index.ets",
    "AppScope/app.json5"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Success "$file exists"
    } else {
        Write-Fail "$file is missing"
        $missingFiles += $file
        $issuesFound++
    }
}

# Check 2: Node.js
Write-Step "2. Checking Node.js..."
try {
    $nodeVersion = node --version
    $nodeVersionNumber = [version]($nodeVersion -replace 'v', '')
    if ($nodeVersionNumber -ge [version]"16.0.0") {
        Write-Success "Node.js $nodeVersion (✓ >= 16.0.0)"
    } else {
        Write-Fail "Node.js $nodeVersion (✗ < 16.0.0 required)"
        $issuesFound++
    }
} catch {
    Write-Fail "Node.js is not installed or not in PATH"
    $issuesFound++
}

# Check 3: Local properties
Write-Step "3. Checking local.properties..."
if (Test-Path "local.properties") {
    Write-Success "local.properties exists"
    
    $localProps = Get-Content "local.properties" -Raw
    if ($localProps -match "sdk\.dir=(.+)") {
        $sdkPath = $matches[1].Trim()
        if (Test-Path $sdkPath) {
            Write-Success "SDK path exists: $sdkPath"
        } else {
            Write-Fail "SDK path does not exist: $sdkPath"
            $issuesFound++
        }
    } else {
        Write-Warning "SDK path not configured in local.properties"
        $issuesFound++
    }
} else {
    Write-Fail "local.properties is missing"
    $issuesFound++
}

# Check 4: Hvigor build system
Write-Step "4. Checking hvigor build system..."
if (Test-Path "hvigor\bin\hvigor.js") {
    Write-Success "Hvigor build system is available"
} else {
    Write-Fail "Hvigor build system is missing"
    $issuesFound++
}

# Check 5: Previous build artifacts
Write-Step "5. Checking for previous build artifacts..."
$buildPaths = @(
    "build\outputs\hap\entry\debug",
    "build\outputs\hap\entry\release",
    "entry\build\outputs\hap\entry\debug",
    "entry\build\outputs\hap\entry\release"
)

$hapFound = $false
foreach ($path in $buildPaths) {
    if (Test-Path $path) {
        $hapFiles = Get-ChildItem -Path $path -Filter "*.hap" -File -ErrorAction SilentlyContinue
        if ($hapFiles.Count -gt 0) {
            foreach ($hap in $hapFiles) {
                $fileSize = [math]::Round($hap.Length / 1MB, 2)
                if ($hap.Length -gt 1000) {  # More than 1KB
                    Write-Success "Found valid HAP: $($hap.FullName) ($fileSize MB)"
                    $hapFound = $true
                } else {
                    Write-Warning "Found small HAP file (may be mock): $($hap.FullName) ($fileSize MB)"
                }
            }
        }
    }
}

if (-not $hapFound) {
    Write-Warning "No valid HAP files found - project needs to be built"
}

# Check 6: OHPM connectivity
Write-Step "6. Checking OHPM connectivity..."
try {
    $ohpmTest = Test-NetConnection ohpm.openharmony.cn -Port 443 -WarningAction SilentlyContinue
    if ($ohpmTest.TcpTestSucceeded) {
        Write-Success "OHPM registry is accessible"
    } else {
        Write-Warning "OHPM registry is not accessible - may cause dependency download issues"
        Write-Warning "Consider using DevEco Studio for dependency management"
    }
} catch {
    Write-Warning "Could not test OHPM connectivity"
}

# Check 7: DevEco Studio detection
Write-Step "7. Checking for DevEco Studio..."
$devecoStudioPaths = @(
    "C:\Users\$env:USERNAME\AppData\Local\Programs\DevEco Studio",
    "D:\Program Files\Huawei\DevEco Studio",
    "C:\Program Files\Huawei\DevEco Studio"
)

$devecoFound = $false
foreach ($path in $devecoStudioPaths) {
    if (Test-Path $path) {
        Write-Success "DevEco Studio found at: $path"
        $devecoFound = $true
        break
    }
}

if (-not $devecoFound) {
    Write-Warning "DevEco Studio not found in common locations"
    Write-Warning "DevEco Studio is required for initial project setup"
}

# Summary
Write-Step "Environment Check Summary"
Write-Status "========================"

if ($issuesFound -eq 0) {
    Write-Success "✓ Environment check passed!"
    Write-Status "Your development environment appears to be properly configured."
    
    if ($hapFound) {
        Write-Status ""
        Write-Status "Next steps:"
        Write-Status "1. Continue development in DevEco Studio"
        Write-Status "2. Use command line scripts for automation:"
        Write-Status "   .\scripts\build.ps1 -Mode release"
        Write-Status "   .\scripts\test.ps1 -Install"
        Write-Status "   .\scripts\package.ps1 -Mode release"
    } else {
        Write-Status ""
        Write-Status "Next steps:"
        Write-Status "1. Build the project in DevEco Studio first"
        Write-Status "2. Then use command line scripts for automation"
    }
} else {
    Write-Fail "✗ Environment check found $issuesFound issue(s)"
    Write-Status ""
    Write-Status "RECOMMENDED ACTIONS:"
    
    if ($missingFiles.Count -gt 0) {
        Write-Status "1. Verify project structure - missing files:"
        foreach ($file in $missingFiles) {
            Write-Status "   - $file"
        }
    }
    
    if (-not $devecoFound) {
        Write-Status "2. Install DevEco Studio:"
        Write-Status "   https://developer.harmonyos.com/en/develop/deveco-studio"
    }
    
    Write-Status "3. Open project in DevEco Studio and let it configure the environment"
    Write-Status "4. Build once in DevEco Studio: Build -> Build Hap(s)/APP(s)"
    Write-Status "5. If you see OHPM dependency errors, see: docs/ohpm-dependency-issues.md"
    Write-Status "6. Run this check script again"
    
    Write-Status ""
    Write-Status "For detailed setup instructions, see:"
    Write-Status "docs/deveco-studio-setup.md"
}

Write-Status ""
Write-Status "Environment check completed."