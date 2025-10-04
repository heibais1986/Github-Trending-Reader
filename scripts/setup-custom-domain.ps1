# Custom Domain Setup Script for GitHub Trending API (PowerShell)
# This script helps configure a custom domain for the Cloudflare Worker

param(
    [string]$Domain = "",
    [string]$Environment = "production",
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
    Write-Host "Usage: .\setup-custom-domain.ps1 [OPTIONS]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Domain DOMAIN           Your custom domain (e.g., api.yourdomain.com)"
    Write-Host "  -Environment ENVIRONMENT Target environment (production, staging, development)"
    Write-Host "  -Help                    Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\setup-custom-domain.ps1 -Domain api.yourdomain.com -Environment production"
    Write-Host "  .\setup-custom-domain.ps1 -Domain staging-api.yourdomain.com -Environment staging"
}

# Show help if requested
if ($Help) {
    Show-Usage
    exit 0
}

# Validate required parameters
if (-not $Domain) {
    Write-Error "Domain is required. Use -Domain to specify your custom domain."
    Show-Usage
    exit 1
}

# Validate environment
if ($Environment -notin @("production", "staging", "development")) {
    Write-Error "Invalid environment: $Environment"
    Write-Error "Valid environments: production, staging, development"
    exit 1
}

Write-Status "Setting up custom domain: $Domain"
Write-Status "Environment: $Environment"
Write-Status "=================================="

# Check if wrangler is installed and user is logged in
Write-Step "1. Checking prerequisites..."
try {
    $null = Get-Command wrangler -ErrorAction Stop
} catch {
    Write-Error "Wrangler CLI is not installed. Please install it first:"
    Write-Error "npm install -g wrangler"
    exit 1
}

try {
    $null = wrangler whoami 2>$null
} catch {
    Write-Error "Not logged in to Cloudflare. Please run: wrangler login"
    exit 1
}

Write-Status "Prerequisites check passed."

# Get worker name
$WranglerContent = Get-Content "wrangler.toml" -Raw
$WorkerName = ($WranglerContent | Select-String 'name\s*=\s*"([^"]*)"').Matches[0].Groups[1].Value
if ($Environment -ne "production") {
    $WorkerName = "$WorkerName-$Environment"
}

Write-Status "Worker name: $WorkerName"

# Add custom domain route
Write-Step "2. Adding custom domain route..."
Write-Status "Adding route for $Domain/*"

$routeResult = wrangler route add "$Domain/*" --env $Environment
if ($LASTEXITCODE -eq 0) {
    Write-Status "✓ Custom domain route added successfully"
} else {
    Write-Error "Failed to add custom domain route"
    Write-Error "Make sure the domain is added to your Cloudflare account"
    exit 1
}

# Check if domain is in Cloudflare
Write-Step "3. Verifying domain configuration..."
Write-Status "Checking if $Domain is configured in Cloudflare..."

# Extract the root domain from subdomain
$RootDomain = $Domain -replace '^[^.]*\.', ''
$Subdomain = $Domain -replace "\.$RootDomain", ''

Write-Status "Root domain: $RootDomain"
Write-Status ""
Write-Status "DNS Configuration Required:"
Write-Status "============================"
Write-Status "You need to add the following DNS record in your Cloudflare dashboard:"
Write-Status ""
Write-Status "Type: CNAME"
Write-Status "Name: $Subdomain"
Write-Status "Target: $WorkerName.workers.dev"
Write-Status "Proxy status: Proxied (orange cloud)"
Write-Status ""

# Wait for user confirmation
$confirmation = Read-Host "Have you added the DNS record? (y/n)"
if ($confirmation -notmatch '^[Yy]$') {
    Write-Warning "Please add the DNS record and run this script again."
    exit 0
}

# Test the custom domain
Write-Step "4. Testing custom domain..."
Write-Status "Testing https://$Domain/health"

# Wait a bit for DNS propagation
Write-Status "Waiting for DNS propagation (30 seconds)..."
Start-Sleep -Seconds 30

# Test the domain
try {
    $testResponse = Invoke-WebRequest -Uri "https://$Domain/health" -Method GET -UseBasicParsing
    Write-Status "✓ Custom domain is working correctly!"
} catch {
    Write-Warning "Custom domain test failed. This might be due to:"
    Write-Warning "1. DNS propagation delay (can take up to 24 hours)"
    Write-Warning "2. Incorrect DNS configuration"
    Write-Warning "3. SSL certificate provisioning in progress"
    Write-Warning ""
    Write-Warning "You can test manually later with:"
    Write-Warning "curl https://$Domain/health"
}

# Update HarmonyOS app configuration
Write-Step "5. Updating HarmonyOS app configuration..."
$HarmonyConfigFile = "harmonyos-app/entry/src/main/ets/constants/ApiConstants.ets"

if (Test-Path $HarmonyConfigFile) {
    # Create backup
    Copy-Item $HarmonyConfigFile "$HarmonyConfigFile.backup"
    
    # Update the API base URL
    $content = Get-Content $HarmonyConfigFile -Raw
    $updatedContent = $content -replace 'https://[^/]*', "https://$Domain"
    Set-Content $HarmonyConfigFile $updatedContent
    
    Write-Status "✓ Updated HarmonyOS app configuration"
    Write-Status "Updated file: $HarmonyConfigFile"
} else {
    Write-Warning "HarmonyOS app configuration file not found: $HarmonyConfigFile"
    Write-Warning "Please update the API base URL manually in your app"
}

# SSL Certificate information
Write-Step "6. SSL Certificate information..."
Write-Status "Cloudflare automatically provisions SSL certificates for custom domains."
Write-Status "The certificate should be available within a few minutes."
Write-Status ""
Write-Status "You can check the SSL status in your Cloudflare dashboard:"
Write-Status "SSL/TLS > Edge Certificates"

# Final instructions
Write-Step "7. Setup complete!"
Write-Status "Custom domain setup completed successfully!"
Write-Status ""
Write-Status "Summary:"
Write-Status "- Domain: $Domain"
Write-Status "- Environment: $Environment"
Write-Status "- Worker: $WorkerName"
Write-Status ""
Write-Status "Next steps:"
Write-Status "1. Test your API: curl https://$Domain/api/trending"
Write-Status "2. Verify deployment: .\scripts\verify-deployment.ps1 -CustomDomain $Domain -Environment $Environment"
Write-Status "3. Update your HarmonyOS app if needed"
Write-Status ""
Write-Status "Useful commands:"
Write-Status "- List routes: wrangler route list --env $Environment"
Write-Status "- Remove route: wrangler route delete $Domain/* --env $Environment"
Write-Status "- View logs: wrangler tail --env $Environment"