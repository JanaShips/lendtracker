# LendWise iOS Build Guide

This guide covers building the LendWise iOS app locally for development and testing. For **App Store submission**, see **APP_STORE_DEPLOYMENT.md**.

## Prerequisites

### 1. macOS with Xcode

iOS builds **require macOS**. You cannot build for iOS on Windows or Linux.

- **macOS** 13 (Ventura) or later recommended
- **Xcode** 15 or later — install from the [Mac App Store](https://apps.apple.com/us/app/xcode/id497799835)
- **Xcode Command Line Tools**:
  ```bash
  xcode-select --install
  ```

### 2. CocoaPods

CocoaPods manages native iOS dependencies for Capacitor.

```bash
sudo gem install cocoapods
```

Or with Homebrew:

```bash
brew install cocoapods
```

### 3. Node.js 18+ and npm

Ensure Node.js is installed:

```bash
node --version   # should be 18+
npm --version
```

### 4. Apple Developer Account (for device testing)

- Free accounts can run on your own device via Xcode
- Paid Apple Developer Program ($99/year) required for TestFlight and App Store distribution

---

## Initial Setup

### 1. Install dependencies

```bash
cd lendtracker-ui
npm install
```

### 2. Build web assets

```bash
npm run build
```

### 3. Add iOS platform (already done if ios/ folder exists)

```bash
npx cap add ios
```

### 4. Sync web assets to iOS project

```bash
npx cap sync ios
```

### 5. Generate iOS icons and splash screens

```bash
npm run ios:icons
```

This generates:
- `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png` (1024x1024)
- `ios/App/App/Assets.xcassets/Splash.imageset/splash-2732x2732*.png` (all scales)

### 6. Install CocoaPods dependencies

```bash
cd ios/App
pod install
cd ../..
```

### 7. Open in Xcode

```bash
npx cap open ios
```

This opens the `.xcworkspace` file. **Always use the `.xcworkspace`**, not the `.xcodeproj`.

---

## Building & Running

### Option 1: Xcode (Recommended)

1. Open Xcode via `npx cap open ios`
2. Select your target device or simulator from the top toolbar
3. Click the **Play** button (or press `Cmd+R`) to build and run

### Option 2: Command Line

```bash
# Build for simulator
npm run ios:build
npx cap open ios
# Then run from Xcode, or:
xcodebuild -workspace ios/App/App.xcworkspace -scheme App -sdk iphonesimulator -configuration Debug build
```

### Running on a Physical Device

1. Open the project in Xcode
2. Go to **Signing & Capabilities** tab
3. Select your **Team** (Apple Developer account)
4. Connect your iPhone via USB
5. Select your device from the device selector
6. Click **Play** — Xcode will install and launch the app

> First time: you may need to trust the developer certificate on your iPhone via **Settings > General > VPN & Device Management**.

---

## Quick Commands Reference

```bash
# From lendtracker-ui directory:

# Build web assets
npm run build

# Sync to iOS
npx cap sync ios

# Open in Xcode
npx cap open ios

# Generate iOS icons
npm run ios:icons

# Full build + sync + open
npm run build:ios

# Sync only
npm run ios:sync
```

---

## Project Structure

```
ios/
├── App/
│   ├── App/
│   │   ├── AppDelegate.swift          # App lifecycle
│   │   ├── Info.plist                 # App configuration
│   │   ├── Assets.xcassets/           # Icons & splash screens
│   │   │   ├── AppIcon.appiconset/    # App icon (1024x1024)
│   │   │   └── Splash.imageset/       # Splash screen images
│   │   ├── Base.lproj/
│   │   │   ├── LaunchScreen.storyboard  # Launch screen layout
│   │   │   └── Main.storyboard        # Main app storyboard
│   │   ├── public/                    # Bundled web assets (from dist/)
│   │   ├── config.xml                 # Cordova compat config
│   │   └── capacitor.config.json      # Runtime Capacitor config
│   ├── App.xcodeproj/                 # Xcode project
│   ├── App.xcworkspace/               # Xcode workspace (use this!)
│   └── Podfile                        # CocoaPods dependencies
└── capacitor-cordova-ios-plugins/     # Cordova plugin bridge
```

---

## Troubleshooting

### "CocoaPods not installed"
```bash
sudo gem install cocoapods
# or
brew install cocoapods
```

### "No signing certificate"
- Open Xcode > Signing & Capabilities
- Select your Apple Developer Team
- Xcode will auto-create a provisioning profile

### "Module 'Capacitor' not found"
```bash
cd ios/App
pod install
cd ../..
npx cap sync ios
```

### App shows blank/white screen
- Check that `server.url` in `capacitor.config.ts` points to a reachable URL
- For bundled assets (no remote URL), comment out `server.url`
- Verify web assets were copied: check `ios/App/App/public/index.html` exists

### "Unable to install app on device"
- Ensure your Apple Developer Team is selected in Signing & Capabilities
- Trust the certificate on your device: Settings > General > VPN & Device Management
- Try Clean Build Folder: Xcode > Product > Clean Build Folder (`Cmd+Shift+K`)

---

## App Configuration

| Setting | Value |
|---------|-------|
| App ID | `com.lendwise.app` |
| App Name | `LendWise` |
| Min iOS | 13.0 |
| Theme | Dark (`#0a0e17`) |
| Accent Color | Emerald Green (`#10b981`) |
| Status Bar | Light content on dark background |
| Orientation | Portrait (iPhone), All (iPad) |

---

## Features

- Native iOS app icon (1024x1024 universal)
- Dark-themed splash screen with centered logo
- Status bar integration (light content)
- Keyboard handling and resize
- Local notifications support
- Safe area / notch support (viewport-fit=cover)
- Back gesture support via Capacitor App plugin
