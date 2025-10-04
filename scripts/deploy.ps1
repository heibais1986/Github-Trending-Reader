# GitHub Trending API Deployment Script (PowerShell)
# This script handles deployment to different environments on Windows

param(
    [string]$Environment = "production",
    [switch]$SkipTests,
    [switch]$SkipBuild,
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

# Function to show usage
function Show-Usage {
    Write-Host "Usage: .\deploy.ps1 [OPTIONS]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Environment ENVIRONMENT  Target environment (production, staging, development)"
    Write-Host "  -SkipTests               Skip running tests before deployment"
    Write-Host "  -SkipBuild               Skip build step"
    Write-Host "  -Help                    Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\deploy.ps1 -Environment production"
    Write-Host "  .\deploy.ps1 -Environment staging -SkipTests"
}

# Show help if requested
if ($Help) {
    Show-Usage
    exit 0
}

# Validate environment
if ($Environment -notin @("production", "staging", "development")) {
    Write-Error "Invalid environment: $Environment"
    Write-Error "Valid environments: production, staging, development"
    exit 1
}

Write-Status "Starting deployment to $Environment environment..."

# Check if wrangler is installed
try {
    $null = Get-Command wrangler -ErrorAction Stop
} catch {
    Write-Error "Wrangler CLI is not installed. Please install it first:"
    Write-Error "npm install -g wrangler"
    exit 1
}

# Check if user is logged in to Cloudflare
try {
    $null = wrangler whoami 2>$null
} catch {
    Write-Error "Not logged in to Cloudflare. Please run: wrangler login"
    exit 1
}

# Run tests unless skipped
if (-not $SkipTests) {
    Write-Status "Running tests..."
    $testResult = npm test
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Tests failed. Deployment aborted."
        exit 1
    }
    Write-Status "All tests passed!"
}

# Build the project unless skipped
if (-not $SkipBuild) {
    Write-Status "Building project..."
    $buildResult = npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Build failed. Deployment aborted."
        exit 1
    }
    Write-Status "Build completed successfully!"
}

# Check if required secrets are set
Write-Status "Checking required secrets..."
$requiredSecrets = @("GITHUB_TOKEN")

foreach ($secret in $requiredSecrets) {
    $secretList = wrangler secret list --env $Environment 2>$null
    if (-not ($secretList -match $secret)) {
        Write-Warning "Secret $secret is not set for $Environment environment"
        Write-Warning "Please set it using: wrangler secret put $secret --env $Environment"
    }
}

# Deploy to Cloudflare Workers
Write-Status "Deploying to Cloudflare Workers ($Environment)..."
$deployResult = wrangler deploy --env $Environment
if ($LASTEXITCODE -eq 0) {
    Write-Status "Deployment to $Environment completed successfully!"
    
    # Get the deployment URL
    try {
        $workerUrl = (wrangler subdomain list 2>$null | Select-String 'https://[^\s]*').Matches[0].Value
        if ($workerUrl) {
            Write-Status "Worker URL: $workerUrl"
        }
    } catch {
        # Ignore if we can't get the URL
    }
    
    Write-Status "You can view logs with: wrangler tail --env $Environment"
} else {
    Write-Error "Deployment failed!"
    exit 1
}

Write-Status "Deployment process completed!"