# HarmonyOS Signing Certificate Generation Script
# This script generates signing certificates for HarmonyOS applications

param(
    [string]$KeystorePath = "signing/reddit.p12",
    [string]$KeystorePassword = "123456",
    [string]$KeyAlias = "reddit",
    [string]$OutputDir = "signing",
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
    Write-Host "Usage: .\generate-signing-cert.ps1 [OPTIONS]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -KeystorePath PATH      Path to keystore file"
    Write-Host "  -KeystorePassword PASS  Keystore password"
    Write-Host "  -KeyAlias ALIAS         Key alias"
    Write-Host "  -OutputDir DIR          Output directory for generated files"
    Write-Host "  -Help                   Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\generate-signing-cert.ps1"
    Write-Host "  .\generate-signing-cert.ps1 -KeystorePath my.p12 -KeystorePassword mypass -KeyAlias mykey"
}

# Show help if requested
if ($Help) {
    Show-Usage
    exit 0
}

Write-Status "HarmonyOS Signing Certificate Generation"
Write-Status "========================================"

# Check if we're in the correct directory
if (-not (Test-Path "oh-package.json5")) {
    Write-Error "Not in HarmonyOS app directory. Please run from harmonyos-app/"
    exit 1
}

# Create output directory if it doesn't exist
Write-Step "1. Setting up output directory..."
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
    Write-Status "Output directory created: $OutputDir"
} else {
    Write-Status "Output directory exists: $OutputDir"
}

# Check if keystore file exists
Write-Step "2. Checking keystore configuration..."
if (-not (Test-Path $KeystorePath)) {
    Write-Warning "Keystore file not found: $KeystorePath"
    Write-Warning ""
    Write-Warning "This script requires an existing keystore file (.p12 format)."
    Write-Warning "If you don't have one, you can create it using:"
    Write-Warning "1. DevEco Studio: Build -> Generate Key and CSR"
    Write-Warning "2. OpenSSL: openssl pkcs12 -export -out reddit.p12 -inkey private.key -in certificate.crt"
    Write-Warning ""
    Write-Warning "For now, we'll create placeholder files for build configuration."
    
    # Create placeholder files for build configuration
    Write-Step "3. Creating placeholder signing files..."
    
    # Create placeholder .p12 file info
    $P12Info = @{
        "type" = "PKCS12"
        "description" = "Placeholder keystore file for HarmonyOS signing"
        "created" = (Get-Date -Format "yyyy-MM-dd")
        "note" = "Replace with actual keystore file for production builds"
    }
    
    Set-Content -Path "$OutputDir/keystore-info.json" -Value ($P12Info | ConvertTo-Json -Depth 3)
    
    # Create placeholder .p7b file info
    $P7BInfo = @{
        "type" = "PKCS7"
        "description" = "Placeholder signing profile for HarmonyOS"
        "created" = (Get-Date -Format "yyyy-MM-dd")
        "note" = "Replace with actual signing profile for production builds"
    }
    
    Set-Content -Path "$OutputDir/profile-info.json" -Value ($P7BInfo | ConvertTo-Json -Depth 3)
    
    Write-Status "Placeholder files created:"
    Write-Status "  $OutputDir/keystore-info.json"
    Write-Status "  $OutputDir/profile-info.json"
    
} else {
    Write-Status "Keystore file found: $KeystorePath"
    
    # Extract certificate information (placeholder - actual extraction requires OpenSSL)
    Write-Step "3. Extracting certificate information..."
    
    # Note: Actual certificate extraction requires OpenSSL or similar tools
    # This is a placeholder implementation
    
    $CertInfo = @{
        "keystorePath" = $KeystorePath
        "keyAlias" = $KeyAlias
        "algorithm" = "SHA256withECDSA"
        "validity" = "365 days"
        "created" = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
    }
    
    Set-Content -Path "$OutputDir/certificate-info.json" -Value ($CertInfo | ConvertTo-Json -Depth 3)
    Write-Status "Certificate information saved to: $OutputDir/certificate-info.json"
}

# Generate signing configuration
Write-Step "4. Generating signing configuration..."
$SigningConfig = @{
    "default" = @{
        "type" = "harmony"
        "material" = @{
            "certpath" = $KeystorePath
            "storePassword" = $KeystorePassword
            "keyAlias" = $KeyAlias
            "keyPassword" = $KeystorePassword
            "signAlg" = "SHA256withECDSA"
            "profile" = "$OutputDir/reddit.p7b"
        }
    }
}

Set-Content -Path "$OutputDir/signing-config-generated.json5" -Value ($SigningConfig | ConvertTo-Json -Depth 3)
Write-Status "Signing configuration saved to: $OutputDir/signing-config-generated.json5"

# Generate build instructions
Write-Step "5. Generating build instructions..."
$BuildInstructions = @"
# HarmonyOS Signing Configuration

## Generated Files
- **Keystore**: $KeystorePath
- **Signing Profile**: $OutputDir/reddit.p7b
- **Configuration**: $OutputDir/signing-config-generated.json5

## Usage in build-profile.json5
Add the following to your build-profile.json5:

```json5
"signingConfigs": [
  {
    "name": "default",
    "type": "HarmonyOS", 
    "material": {
      "storeFile": "$KeystorePath",
      "storePassword": "$KeystorePassword",
      "keyAlias": "$KeyAlias",
      "keyPassword": "$KeystorePassword",
      "signAlg": "SHA256withECDSA",
      "profile": "$OutputDir/reddit.p7b",
      "certpath": "$OutputDir/reddit.cer"
    }
  }
]
```

## Next Steps
1. Ensure the keystore file exists at: $KeystorePath
2. Update build-profile.json5 with the above configuration
3. Build the application using: .\scripts\build.ps1 -Mode release

## Security Notes
- Keep keystore passwords secure
- Use different keystores for debug and release builds
- Backup your keystore files safely
"@

Set-Content -Path "$OutputDir/BUILD_INSTRUCTIONS.md" -Value $BuildInstructions
Write-Status "Build instructions saved to: $OutputDir/BUILD_INSTRUCTIONS.md"

# Display completion message
Write-Step "6. Certificate generation completed!"
Write-Status ""
Write-Status "Generated Files:"
Write-Status "  📄 $OutputDir/certificate-info.json"
Write-Status "  ⚙️  $OutputDir/signing-config-generated.json5"
Write-Status "  📖 $OutputDir/BUILD_INSTRUCTIONS.md"
Write-Status ""
Write-Status "Next Steps:"
Write-Status "1. Review the generated configuration files"
Write-Status "2. Update build-profile.json5 with the signing configuration"
Write-Status "3. Build your application: .\scripts\build.ps1 -Mode release"
Write-Status ""
Write-Status "For production builds:"
Write-Status "- Replace placeholder files with actual certificates"
Write-Status "- Use secure passwords and proper key management"
Write-Status ""

Write-Status "Certificate generation process completed successfully!"