# LendTracker Android Build Guide

This guide will help you build the LendTracker Android APK.

## ⚠️ IMPORTANT: Configure API URL Before Building

Before building the APK, you **MUST** configure the backend API URL:

1. Copy the example file: `cp .env.production.example .env.production`
2. Open `.env.production` and replace `YOUR-RAILWAY-BACKEND-URL` with your actual Railway backend URL:

```bash
# Example - replace with your actual Railway URL:
VITE_API_URL=https://lendtracker-production-xxxx.up.railway.app/api
```

### How to Find Your Railway Backend URL:
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click on your LendTracker backend service
3. Go to **Settings** → **Networking** → **Public Networking**
4. Copy your domain (e.g., `lendtracker-production-xxxx.up.railway.app`)
5. Add `/api` at the end

**If you skip this step, the APK will try to connect to `localhost` which won't work on your phone!**

---

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

### ✅ Pre-Build Checklist
1. Ensure `.env.production` has the correct `VITE_API_URL` (your Railway backend URL)
2. Run `npm run build` to create the production build
3. Run `npx cap sync android` to sync changes to Android

### Option 1: Using Android Studio (Recommended)

1. **First, build the web app with production settings:**
   ```powershell
   cd lendtracker-ui
   npm run build
   npx cap sync android
   ```

2. Open Android Studio
3. Click "Open" and navigate to:
   ```
   lendtracker-ui/android
   ```
4. Wait for Gradle sync to complete
5. Go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
6. The APK will be generated at:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Option 2: Using Command Line

1. Open PowerShell in the `lendtracker-ui` directory
2. **Build the web app first:**
   ```powershell
   npm run build
   npx cap sync android
   ```
3. Set environment variables:
   ```powershell
   $env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
   ```
4. Navigate to android folder and build:
   ```powershell
   cd android
   .\gradlew.bat assembleDebug
   ```
5. The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

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

# ⭐ COMPLETE REBUILD (use this after changing .env.production):
npm run build && npx cap sync android && cd android && .\gradlew.bat assembleDebug

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

## Quick Fix for "Unable to Connect" Error

If you're seeing connection errors on your Android app, run these commands:

```powershell
# 1. Create .env.production from example (if not exists)
copy .env.production.example .env.production

# 2. Edit .env.production with your Railway URL
notepad .env.production
# Change: VITE_API_URL=https://YOUR-ACTUAL-RAILWAY-URL.up.railway.app/api

# 3. Rebuild and sync
npm run build
npx cap sync android

# 4. Rebuild APK
cd android
.\gradlew.bat clean assembleDebug

# 5. Install new APK on phone
# The APK is at: android/app/build/outputs/apk/debug/app-debug.apk
```

## Troubleshooting

### "Unable to connect to server" or "Network Error" on Sign Up/Login
**This is the most common issue!** It means the app is trying to connect to `localhost` instead of your Railway backend.

**Solution:**
1. Check `.env.production` has the correct Railway URL:
   ```
   VITE_API_URL=https://YOUR-RAILWAY-APP.up.railway.app/api
   ```
2. Rebuild the web app: `npm run build`
3. Sync to Android: `npx cap sync android`
4. Rebuild the APK

**To verify the URL is correct:**
- Connect your phone to your computer
- Open Chrome DevTools Remote Debugging
- Check the console for: `[LendTracker] API URL: https://...`

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

### CORS Errors
If you see CORS errors in the logs:
- Make sure your Railway backend has CORS configured to allow all origins
- The backend's `SecurityConfig.java` should have `setAllowedOriginPatterns(List.of("*"))`

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
