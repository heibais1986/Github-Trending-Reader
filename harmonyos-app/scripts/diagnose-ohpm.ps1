# OHPM Diagnostic Script
# This script diagnoses OHPM (OpenHarmony Package Manager) issues

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
    Write-Host "Usage: .\diagnose-ohpm.ps1"
    Write-Host ""
    Write-Host "This script diagnoses OHPM (OpenHarmony Package Manager) connectivity and configuration issues."
    Write-Host ""
    Write-Host "It checks:"
    Write-Host "  - OHPM installation and version"
    Write-Host "  - Registry connectivity"
    Write-Host "  - Package availability"
    Write-Host "  - Configuration settings"
}

# Show help if requested
if ($Help) {
    Show-Usage
    exit 0
}

Write-Status "OHPM Diagnostic Tool"
Write-Status "==================="

# Check 1: OHPM installation
Write-Step "1. Checking OHPM installation..."

# Try to find OHPM in common locations
$ohpmPaths = @(
    "ohpm",  # In PATH
    "D:\Program Files\Huawei\DevEco Studio\tools\ohpm\bin\ohpm.bat",
    "C:\Program Files\Huawei\DevEco Studio\tools\ohpm\bin\ohpm.bat"
)

$ohpmCmd = $null
foreach ($path in $ohpmPaths) {
    try {
        if ($path -eq "ohpm") {
            $testResult = & $path --version 2>$null
        } else {
            if (Test-Path $path) {
                $testResult = & $path --version 2>$null
            } else {
                continue
            }
        }
        
        if ($LASTEXITCODE -eq 0) {
            $ohpmCmd = $path
            Write-Success "OHPM found at: $path"
            Write-Status "Version: $testResult"
            break
        }
    } catch {
        continue
    }
}

if (-not $ohpmCmd) {
    Write-Fail "OHPM is not installed or not accessible"
    Write-Status "OHPM is typically installed with DevEco Studio"
    Write-Status "Expected location: D:\Program Files\Huawei\DevEco Studio\tools\ohpm\bin\"
    Write-Status "Please install DevEco Studio or add OHPM to PATH"
    exit 1
}

# Check 2: OHPM configuration
Write-Step "2. Checking OHPM configuration..."
try {
    $ohpmConfig = & $ohpmCmd config list 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "OHPM configuration:"
        $ohpmConfig | ForEach-Object { Write-Host "  $_" }
    } else {
        Write-Warning "Could not retrieve OHPM configuration"
    }
} catch {
    Write-Warning "OHPM config command failed"
}

# Check 3: Registry connectivity
Write-Step "3. Testing registry connectivity..."
$registries = @(
    "https://ohpm.openharmony.cn/ohpm/",
    "https://repo.harmonyos.com/ohpm/"
)

foreach ($registry in $registries) {
    try {
        Write-Status "Testing: $registry"
        $response = Invoke-WebRequest -Uri $registry -Method HEAD -TimeoutSec 10 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Success "✓ $registry is accessible"
        } else {
            Write-Warning "⚠ $registry returned status: $($response.StatusCode)"
        }
    } catch {
        Write-Fail "✗ $registry is not accessible: $($_.Exception.Message)"
    }
}

# Check 4: Specific package availability
Write-Step "4. Checking specific package availability..."
$packages = @(
    "@ohos/hvigor-ohos-plugin",
    "@ohos/hvigor"
)

foreach ($package in $packages) {
    try {
        Write-Status "Checking package: $package"
        $packageInfo = & $ohpmCmd view $package 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "✓ $package is available"
            # Extract version info
            $versionLine = $packageInfo | Select-String "latest:" | Select-Object -First 1
            if ($versionLine) {
                Write-Status "  $versionLine"
            }
        } else {
            Write-Fail "✗ $package is not available"
        }
    } catch {
        Write-Fail "✗ Failed to check $package"
    }
}

# Check 5: Project dependencies
Write-Step "5. Checking project dependencies..."
if (Test-Path "oh-package.json5") {
    $packageContent = Get-Content "oh-package.json5" -Raw
    Write-Status "Project dependencies from oh-package.json5:"
    
    # Extract dependencies
    if ($packageContent -match '"devDependencies"\s*:\s*\{([^}]+)\}') {
        $deps = $matches[1]
        $deps -split ',' | ForEach-Object {
            $dep = $_.Trim()
            if ($dep -match '"([^"]+)"\s*:\s*"([^"]+)"') {
                $name = $matches[1]
                $version = $matches[2]
                Write-Status "  ${name}: ${version}"
            }
        }
    }
} else {
    Write-Warning "oh-package.json5 not found"
}

# Check 6: Cache status
Write-Step "6. Checking OHPM cache..."
try {
    $cacheInfo = & $ohpmCmd cache ls 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "OHPM cache is accessible"
        $cacheLines = $cacheInfo | Measure-Object -Line
        Write-Status "Cache contains $($cacheLines.Lines) entries"
    } else {
        Write-Warning "Could not access OHPM cache"
    }
} catch {
    Write-Warning "OHPM cache command failed"
}

# Check 7: Network diagnostics
Write-Step "7. Network diagnostics..."
try {
    $dnsTest = Resolve-DnsName ohpm.openharmony.cn -ErrorAction SilentlyContinue
    if ($dnsTest) {
        Write-Success "DNS resolution for ohpm.openharmony.cn works"
        Write-Status "  Resolved to: $($dnsTest.IPAddress -join ', ')"
    } else {
        Write-Fail "DNS resolution failed for ohpm.openharmony.cn"
    }
} catch {
    Write-Warning "DNS test failed"
}

# Recommendations
Write-Step "Recommendations"
Write-Status "==============="

Write-Status "Based on the diagnostic results:"
Write-Status ""
Write-Status "1. If OHPM is not installed:"
Write-Status "   - Install DevEco Studio which includes OHPM"
Write-Status "   - Add OHPM to PATH: D:\Program Files\Huawei\DevEco Studio\tools\ohpm\bin\"
Write-Status ""
Write-Status "2. If registry is not accessible:"
Write-Status "   - Check firewall and proxy settings"
Write-Status "   - Try alternative registry: ohpm config set registry https://repo.harmonyos.com/ohpm/"
Write-Status ""
Write-Status "3. If packages are not found:"
Write-Status "   - Use DevEco Studio for dependency management"
Write-Status "   - Check for newer/older package versions"
Write-Status "   - Clear cache: ohpm cache clean"
Write-Status ""
Write-Status "4. For persistent issues:"
Write-Status "   - Use DevEco Studio's built-in package management"
Write-Status "   - Check official documentation for latest package versions"
Write-Status "   - Consider offline installation if network issues persist"

Write-Status ""
Write-Status "For detailed solutions, see: docs/ohpm-dependency-issues.md"
Write-Status "Diagnostic completed."