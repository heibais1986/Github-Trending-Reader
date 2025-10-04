# GitHub Trending API Deployment Verification Script (PowerShell)
# This script verifies that the production deployment is working correctly

param(
    [string]$Environment = "production",
    [string]$CustomDomain = "",
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
    Write-Host "Usage: .\verify-deployment.ps1 [OPTIONS]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Environment ENVIRONMENT  Target environment (production, staging, development)"
    Write-Host "  -CustomDomain DOMAIN      Custom domain to test (optional)"
    Write-Host "  -Help                     Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\verify-deployment.ps1 -Environment production"
    Write-Host "  .\verify-deployment.ps1 -Environment production -CustomDomain api.yourdomain.com"
}

# Show help if requested
if ($Help) {
    Show-Usage
    exit 0
}

Write-Status "Verifying deployment for $Environment environment..."
Write-Status "=================================================="

# Get worker URL
Write-Step "1. Getting worker URL..."
if ($CustomDomain) {
    $WorkerUrl = "https://$CustomDomain"
    Write-Status "Using custom domain: $WorkerUrl"
} else {
    # Try to get the worker URL from wrangler.toml
    $WranglerContent = Get-Content "wrangler.toml" -Raw
    $WorkerName = ($WranglerContent | Select-String 'name\s*=\s*"([^"]*)"').Matches[0].Groups[1].Value
    if ($Environment -ne "production") {
        $WorkerName = "$WorkerName-$Environment"
    }
    $WorkerUrl = "https://$WorkerName.workers.dev"
    Write-Status "Using worker URL: $WorkerUrl"
}

# Test health endpoint
Write-Step "2. Testing health endpoint..."
try {
    $HealthResponse = Invoke-WebRequest -Uri "$WorkerUrl/health" -Method GET -UseBasicParsing
    if ($HealthResponse.StatusCode -eq 200) {
        Write-Status "✓ Health endpoint is responding correctly"
        Write-Host "Response: $($HealthResponse.Content)"
    } else {
        Write-Error "✗ Health endpoint failed (HTTP $($HealthResponse.StatusCode))"
    }
} catch {
    Write-Error "✗ Health endpoint failed: $($_.Exception.Message)"
}

# Test API trending endpoint
Write-Step "3. Testing API trending endpoint..."
try {
    $ApiResponse = Invoke-WebRequest -Uri "$WorkerUrl/api/trending" -Method GET -UseBasicParsing
    if ($ApiResponse.StatusCode -eq 200) {
        Write-Status "✓ API trending endpoint is responding correctly"
        
        # Check if response is valid JSON
        try {
            $JsonData = $ApiResponse.Content | ConvertFrom-Json
            Write-Status "✓ Response is valid JSON"
            $RepoCount = $JsonData.repositories.Count
            Write-Status "✓ Found $RepoCount repositories in response"
        } catch {
            Write-Warning "⚠ Response is not valid JSON"
            Write-Host $ApiResponse.Content.Substring(0, [Math]::Min(200, $ApiResponse.Content.Length))
        }
    } else {
        Write-Error "✗ API trending endpoint failed (HTTP $($ApiResponse.StatusCode))"
    }
} catch {
    Write-Error "✗ API trending endpoint failed: $($_.Exception.Message)"
}

# Test CORS headers
Write-Step "4. Testing CORS headers..."
try {
    $Headers = @{ "Origin" = "https://example.com" }
    $CorsResponse = Invoke-WebRequest -Uri "$WorkerUrl/api/trending" -Method GET -Headers $Headers -UseBasicParsing
    if ($CorsResponse.Headers["Access-Control-Allow-Origin"]) {
        Write-Status "✓ CORS headers are present"
    } else {
        Write-Warning "⚠ CORS headers not found"
    }
} catch {
    Write-Warning "⚠ Could not test CORS headers: $($_.Exception.Message)"
}

# Test rate limiting
Write-Step "5. Testing rate limiting..."
try {
    $RateLimitResponse = Invoke-WebRequest -Uri "$WorkerUrl/api/trending" -Method GET -UseBasicParsing
    $RateLimitHeaders = $RateLimitResponse.Headers.Keys | Where-Object { $_ -like "*ratelimit*" }
    if ($RateLimitHeaders.Count -gt 0) {
        Write-Status "✓ Rate limiting headers are present"
    } else {
        Write-Warning "⚠ Rate limiting headers not found"
    }
} catch {
    Write-Warning "⚠ Could not test rate limiting: $($_.Exception.Message)"
}

# Check KV storage
Write-Step "6. Checking KV storage access..."
try {
    $Yesterday = (Get-Date).AddDays(-1).ToString("yyyy-MM-dd")
    $KvTestResponse = Invoke-WebRequest -Uri "$WorkerUrl/api/trending?date=$Yesterday" -Method GET -UseBasicParsing
    if ($KvTestResponse.StatusCode -eq 200 -or $KvTestResponse.StatusCode -eq 404) {
        Write-Status "✓ KV storage access is working (HTTP $($KvTestResponse.StatusCode))"
    } else {
        Write-Warning "⚠ KV storage access may have issues (HTTP $($KvTestResponse.StatusCode))"
    }
} catch {
    $StatusCode = $_.Exception.Response.StatusCode.value__
    if ($StatusCode -eq 404) {
        Write-Status "✓ KV storage access is working (HTTP 404 - no data for yesterday)"
    } else {
        Write-Warning "⚠ KV storage access may have issues: $($_.Exception.Message)"
    }
}

# Performance test
Write-Step "8. Performance test..."
Write-Status "Testing response times..."
for ($i = 1; $i -le 3; $i++) {
    try {
        $StartTime = Get-Date
        $PerfResponse = Invoke-WebRequest -Uri "$WorkerUrl/api/trending" -Method GET -UseBasicParsing
        $EndTime = Get-Date
        $ResponseTime = ($EndTime - $StartTime).TotalSeconds
        Write-Status "Request $i`: $([Math]::Round($ResponseTime, 3))s"
    } catch {
        Write-Warning "Request $i failed: $($_.Exception.Message)"
    }
}

# Security headers check
Write-Step "9. Checking security headers..."
try {
    $SecurityResponse = Invoke-WebRequest -Uri "$WorkerUrl/api/trending" -Method GET -UseBasicParsing
    $SecurityHeaders = @("X-Content-Type-Options", "X-Frame-Options", "X-XSS-Protection")
    
    foreach ($header in $SecurityHeaders) {
        if ($SecurityResponse.Headers[$header]) {
            Write-Status "✓ $header header is present"
        } else {
            Write-Warning "⚠ $header header is missing"
        }
    }
} catch {
    Write-Warning "⚠ Could not check security headers: $($_.Exception.Message)"
}

# SSL/TLS check
Write-Step "10. Checking SSL/TLS configuration..."
try {
    $SslResponse = Invoke-WebRequest -Uri $WorkerUrl -Method GET -UseBasicParsing
    Write-Status "✓ SSL/TLS is working correctly"
} catch {
    Write-Warning "⚠ SSL/TLS configuration may have issues: $($_.Exception.Message)"
}

Write-Status ""
Write-Status "Verification completed!"
Write-Status "======================"

# Summary
Write-Status "🎉 Deployment verification completed"
Write-Status "Check the results above for any issues."

Write-Status ""
Write-Status "Useful commands:"
Write-Status "- View logs: wrangler tail --env $Environment"
Write-Status "- Check metrics: wrangler analytics --env $Environment"
Write-Status "- Update worker: .\scripts\deploy.ps1 -Environment $Environment"