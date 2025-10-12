# HarmonyOS Signing Configuration

## Generated Files
- **Keystore**: signing/reddit.p12
- **Signing Profile**: signing/reddit.p7b
- **Configuration**: signing/signing-config-generated.json5

## Usage in build-profile.json5
Add the following to your build-profile.json5:

`json5
"signingConfigs": [
  {
    "name": "default",
    "type": "HarmonyOS", 
    "material": {
      "storeFile": "signing/reddit.p12",
      "storePassword": "RedditAppSecurePassword1234567890!@#",
      "keyAlias": "reddit",
      "keyPassword": "RedditAppSecurePassword1234567890!@#",
      "signAlg": "SHA256withECDSA",
      "profile": "signing/reddit.p7b",
      "certpath": "signing/reddit.cer"
    }
  }
]
`

## Next Steps
1. Ensure the keystore file exists at: signing/reddit.p12
2. Update build-profile.json5 with the above configuration
3. Build the application using: .\scripts\build.ps1 -Mode release

## Security Notes
- Keep keystore passwords secure
- Use different keystores for debug and release builds
- Backup your keystore files safely
