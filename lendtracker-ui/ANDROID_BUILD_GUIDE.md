# LendTracker Android Build Guide

This guide will help you build the LendTracker Android APK.

## Prerequisites

### 1. Install Android Studio
Download and install Android Studio from: https://developer.android.com/studio

During installation, make sure to install:
- Android SDK
- Android SDK Platform-Tools
- Android SDK Build-Tools

### 2. Configure Environment Variables
After installing Android Studio, set these environment variables:

**Windows (PowerShell - Run as Administrator):**
```powershell
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LOCALAPPDATA\Android\Sdk", "User")
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-17", "User")
```

Or add to your system PATH:
- `%LOCALAPPDATA%\Android\Sdk\platform-tools`
- `%LOCALAPPDATA%\Android\Sdk\tools`

### 3. Accept Android SDK Licenses
Open a new terminal and run:
```bash
cd %LOCALAPPDATA%\Android\Sdk\tools\bin
sdkmanager --licenses
```

## Building the APK

### Option 1: Using Android Studio (Recommended)

1. Open Android Studio
2. Click "Open" and navigate to:
   ```
   C:\Users\janardko\Desktop\Cursor\LendTracker\lendtracker-ui\android
   ```
3. Wait for Gradle sync to complete
4. Go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
5. The APK will be generated at:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Option 2: Using Command Line

1. Open PowerShell in the `lendtracker-ui` directory
2. Set environment variables:
   ```powershell
   $env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
   ```
3. Navigate to android folder and build:
   ```powershell
   cd android
   .\gradlew.bat assembleDebug
   ```
4. The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Building a Release APK (For Distribution)

For a release APK, you need to sign it:

1. Generate a keystore (one-time):
   ```bash
   keytool -genkey -v -keystore lendtracker-release-key.keystore -alias lendtracker -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Create `android/app/keystore.properties`:
   ```properties
   storeFile=../lendtracker-release-key.keystore
   storePassword=YOUR_STORE_PASSWORD
   keyAlias=lendtracker
   keyPassword=YOUR_KEY_PASSWORD
   ```

3. Build release APK:
   ```powershell
   cd android
   .\gradlew.bat assembleRelease
   ```

4. The signed APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

## Quick Commands Reference

```powershell
# From lendtracker-ui directory:

# Build web app
npm run build

# Sync to Android
npx cap sync android

# Open in Android Studio
npx cap open android

# Build debug APK (requires Android SDK)
cd android; .\gradlew.bat assembleDebug

# Build release APK
cd android; .\gradlew.bat assembleRelease

# Clean build
cd android; .\gradlew.bat clean
```

## Troubleshooting

### "SDK location not found"
- Install Android Studio and Android SDK
- Set ANDROID_HOME environment variable

### "JAVA_HOME is set to an invalid directory"
- Install JDK 17 or later
- Set JAVA_HOME to your JDK installation path

### "Could not resolve dependencies"
- Run `.\gradlew.bat --refresh-dependencies`

### App crashes on launch
- Check logcat in Android Studio for errors
- Ensure the backend API URL is correctly configured

## App Configuration

The app is configured in `capacitor.config.ts`:
- **App ID**: `com.lendtracker.app`
- **App Name**: `LendTracker`
- **Theme Color**: `#0a0e17` (dark)
- **Accent Color**: `#10b981` (emerald green)

## Features

✅ Native Android icons (all densities)
✅ Adaptive icons for Android 8.0+
✅ Splash screens (portrait & landscape)
✅ Status bar integration
✅ Keyboard handling
✅ Local notifications support
✅ Dark theme optimized
