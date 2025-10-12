# Deploy and Test GitHub Trending Worker
# This script deploys the worker and tests the trending API

Write-Host "🚀 Deploying GitHub Trending Worker..." -ForegroundColor Green

# Deploy to Cloudflare Workers
Write-Host "📦 Building and deploying worker..." -ForegroundColor Yellow
try {
    & npx wrangler deploy
    if ($LASTEXITCODE -ne 0) {
        throw "Deployment failed"
    }
    Write-Host "✅ Worker deployed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Deployment failed: $_" -ForegroundColor Red
    exit 1
}

# Wait a moment for deployment to propagate
Write-Host "⏳ Waiting for deployment to propagate..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test the API endpoints
$workerUrl = "https://github-trending-api.your-subdomain.workers.dev"  # Update with your actual URL

Write-Host "🧪 Testing API endpoints..." -ForegroundColor Yellow

# Test health endpoint
Write-Host "Testing health endpoint..." -ForegroundColor Cyan
try {
    $healthResponse = Invoke-RestMethod -Uri "$workerUrl/health" -Method Get
    Write-Host "✅ Health check passed" -ForegroundColor Green
    Write-Host "Status: $($healthResponse.status)" -ForegroundColor White
} catch {
    Write-Host "❌ Health check failed: $_" -ForegroundColor Red
}

# Test trending endpoint
Write-Host "Testing trending endpoint..." -ForegroundColor Cyan
try {
    $trendingResponse = Invoke-RestMethod -Uri "$workerUrl/api/trending" -Method Get
    Write-Host "✅ Trending API working" -ForegroundColor Green
    Write-Host "Found $($trendingResponse.data.length) repositories" -ForegroundColor White
    
    if ($trendingResponse.data.length -gt 0) {
        Write-Host "Sample repositories:" -ForegroundColor White
        $trendingResponse.data[0..2] | ForEach-Object {
            Write-Host "  - $($_.full_name) ($($_.stargazers_count) stars)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "❌ Trending API failed: $_" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Gray
}

# Test manual trigger of scheduled task
Write-Host "Testing manual scheduled task trigger..." -ForegroundColor Cyan
try {
    $triggerResponse = Invoke-RestMethod -Uri "$workerUrl/api/trigger-scraping" -Method Post
    Write-Host "✅ Manual trigger successful" -ForegroundColor Green
    Write-Host "Result: $($triggerResponse.message)" -ForegroundColor White
} catch {
    Write-Host "⚠️ Manual trigger not available (this is normal)" -ForegroundColor Yellow
}

# Show recent execution logs
Write-Host "📊 Checking execution logs..." -ForegroundColor Cyan
try {
    $statsResponse = Invoke-RestMethod -Uri "$workerUrl/api/stats" -Method Get
    Write-Host "✅ Stats retrieved" -ForegroundColor Green
    Write-Host "Total executions: $($statsResponse.totalExecutions)" -ForegroundColor White
    Write-Host "Success rate: $($statsResponse.uptime)%" -ForegroundColor White
    Write-Host "Last execution: $($statsResponse.lastExecution.startTime)" -ForegroundColor White
} catch {
    Write-Host "❌ Stats retrieval failed: $_" -ForegroundColor Red
}

Write-Host "`n🎉 Deployment and testing complete!" -ForegroundColor Green
Write-Host "Monitor your worker at: https://dash.cloudflare.com/" -ForegroundColor Cyan
Write-Host "API URL: $workerUrl" -ForegroundColor Cyan

# Instructions for monitoring
Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Monitor the worker logs in Cloudflare dashboard" -ForegroundColor White
Write-Host "2. Check scheduled task execution at midnight UTC" -ForegroundColor White
Write-Host "3. Verify data is being stored in KV storage" -ForegroundColor White
Write-Host "4. Test API endpoints from your mobile apps" -ForegroundColor White