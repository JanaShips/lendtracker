# LendWise – Apple App Store Deployment Guide

This guide covers preparing and submitting the LendWise iOS app to the Apple App Store.

---

## 1. Prerequisites

- **macOS** with **Xcode 15+**
- **Apple Developer Program** membership ($99/year) — [developer.apple.com](https://developer.apple.com/programs/)
- **Node.js 18+** and npm
- **CocoaPods** installed (`sudo gem install cocoapods` or `brew install cocoapods`)
- **LendWise backend** deployed and reachable — update `capacitor.config.ts` `server.url` if needed

---

## 2. Apple Developer Setup

### 2.1 Create an App ID

1. Go to [developer.apple.com/account](https://developer.apple.com/account)
2. Navigate to **Certificates, Identifiers & Profiles** > **Identifiers**
3. Click **+** to register a new App ID
4. Select **App IDs** > **App**
5. Set:
   - **Description**: `LendWise`
   - **Bundle ID**: `com.lendwise.app` (Explicit)
6. Enable capabilities as needed:
   - **Push Notifications** (for local/remote notifications)
7. Click **Register**

### 2.2 Create a Distribution Certificate

1. In **Certificates**, click **+**
2. Select **Apple Distribution**
3. Follow the CSR (Certificate Signing Request) process via Keychain Access
4. Download and double-click to install the certificate

### 2.3 Create a Provisioning Profile

1. In **Profiles**, click **+**
2. Select **App Store Connect**
3. Select the App ID: `com.lendwise.app`
4. Select your Distribution Certificate
5. Name it: `LendWise App Store`
6. Download and double-click to install

---

## 3. Xcode Project Configuration

### 3.1 Open in Xcode

```bash
cd lendtracker-ui
npm run build
npx cap sync ios
npx cap open ios
```

### 3.2 Set Signing & Capabilities

1. Select the **App** target in the project navigator
2. Go to **Signing & Capabilities** tab
3. Uncheck **Automatically manage signing** (for production builds)
4. Set:
   - **Team**: Your Apple Developer Team
   - **Bundle Identifier**: `com.lendwise.app`
   - **Provisioning Profile**: Select the App Store profile created above
5. Or keep **Automatically manage signing** checked and select your Team — Xcode handles the rest

### 3.3 Set Version and Build Number

1. In **General** tab, set:
   - **Version**: `1.0.0` (user-visible version, must follow semantic versioning)
   - **Build**: `1` (integer, must increment for every App Store upload)

For subsequent releases: bump **Version** (e.g. `1.0.1`) and always increment **Build** (e.g. `2`, `3`, ...).

### 3.4 Set Deployment Target

1. In **General** tab, set **Minimum Deployments** to `iOS 13.0` (or higher as needed)

### 3.5 Configure App Icons

Ensure icons are generated:

```bash
npm run ios:icons
npx cap sync ios
```

Verify in Xcode: **Assets.xcassets** > **AppIcon** shows a 1024x1024 icon.

---

## 4. Build for App Store

### 4.1 Build and Archive

1. In Xcode, select **Any iOS Device (arm64)** as the build destination
2. Go to **Product** > **Archive**
3. Wait for the archive to complete (this may take a few minutes)
4. The **Organizer** window opens automatically

### 4.2 Distribute via Organizer

1. In the Organizer, select the latest archive
2. Click **Distribute App**
3. Select **App Store Connect** > **Upload**
4. Follow the prompts:
   - Select your Distribution Certificate and Profile
   - Enable **Upload your app's symbols** (recommended for crash reports)
   - Enable **Manage Version and Build Number** if needed
5. Click **Upload**

### 4.3 Alternative: Command Line Archive

```bash
# Archive
xcodebuild -workspace ios/App/App.xcworkspace \
  -scheme App \
  -sdk iphoneos \
  -configuration Release \
  -archivePath build/LendWise.xcarchive \
  archive

# Export IPA
xcodebuild -exportArchive \
  -archivePath build/LendWise.xcarchive \
  -exportOptionsPlist ExportOptions.plist \
  -exportPath build/
```

You'll need an `ExportOptions.plist` file — Xcode generates one during manual archive/export.

---

## 5. App Store Connect Setup

Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com) and create a new app:

### 5.1 Create App

1. Click **+** > **New App**
2. Fill in:
   - **Platform**: iOS
   - **Name**: `LendWise`
   - **Primary Language**: English
   - **Bundle ID**: `com.lendwise.app`
   - **SKU**: `lendwise-ios-001` (unique identifier, not shown to users)

### 5.2 App Information

- **Category**: Finance
- **Subcategory**: (optional)
- **Content Rights**: Declare if applicable
- **Age Rating**: Complete the questionnaire (typically 4+ for a finance tracker)

### 5.3 Privacy

- **Privacy Policy URL**: Required — host at `https://yoursite.com/privacy`
- **App Privacy** (Data Collection): Declare what data you collect:
  - **Contact Info** (email, name, phone) — used for account
  - **Financial Info** (loan data) — core app functionality
  - **Identifiers** (user ID) — for authentication
  - **Usage Data** — if any analytics are collected

### 5.4 App Review Information

- **Contact Info**: Provide a name, phone, and email for the review team
- **Demo Account**: If the app requires login, provide test credentials:
  - Email: `test@example.com`
  - Password: `TestPassword123`
- **Notes**: Explain that the app tracks personal loans/money lent to others

---

## 6. Store Listing

### 6.1 Required Assets

| Asset | Specification |
|-------|--------------|
| App Icon | 1024x1024 PNG (auto-generated from `ios:icons`) |
| Screenshots (iPhone 6.7") | 1290x2796 or 1284x2778 — at least 3 |
| Screenshots (iPhone 6.5") | 1242x2688 or 1284x2778 — at least 3 |
| Screenshots (iPhone 5.5") | 1242x2208 — optional |
| Screenshots (iPad 12.9") | 2048x2732 — required if supporting iPad |
| App Preview (video) | Optional, 15-30 seconds |

### 6.2 Text Content

**App Name** (30 chars max):
```
LendWise
```

**Subtitle** (30 chars max):
```
Track Money You've Lent Out
```

**Promotional Text** (170 chars, can be updated without new build):
```
Track personal loans, calculate interest, and never forget who owes you. Beautiful dashboard with payment tracking.
```

**Description** (4000 chars max):
```
LendWise helps you track money you've lent to friends, family, or business contacts.

Features:
• Track loans with borrower details, amounts, and interest rates
• Flexible interest calculation: daily, weekly, biweekly, monthly, quarterly, or yearly
• Record interest and principal payments with full history
• Dashboard with total lent, active loans, interest earned, and more
• Search and filter loans by borrower, status, amount, or date
• Top borrowers overview and monthly interest projections
• Secure login with email verification
• Beautiful dark-themed interface optimized for mobile

Never lose track of who owes you money. LendWise makes personal lending simple and organized.
```

**Keywords** (100 chars, comma-separated):
```
loan,tracker,money,lending,interest,calculator,finance,debt,personal,payment
```

**Support URL**: `https://yoursite.com/support`

**Marketing URL**: `https://lendwise.vercel.app` (optional)

---

## 7. Submit for Review

1. In App Store Connect, go to your app
2. Under the latest version, click **Add Build**
3. Select the build you uploaded from Xcode
4. Fill in **What's New in This Version**:
   ```
   Initial release of LendWise — track personal loans, interest, and payments with a beautiful dashboard.
   ```
5. Review all sections (App Information, Pricing, Privacy, etc.)
6. Click **Submit for Review**

Apple typically reviews within 24-48 hours. You'll receive an email when approved (or if changes are requested).

---

## 8. Quick Reference

| Step | Command / Location |
|------|--------------------|
| Build web | `npm run build` |
| Sync to iOS | `npx cap sync ios` |
| Generate icons | `npm run ios:icons` |
| Open in Xcode | `npx cap open ios` |
| Install pods | `cd ios/App && pod install` |
| Archive | Xcode > Product > Archive |
| Upload | Xcode Organizer > Distribute App |
| App ID | `com.lendwise.app` |
| Min iOS | 13.0 |
| App Store Connect | [appstoreconnect.apple.com](https://appstoreconnect.apple.com) |

---

## 9. Subsequent Releases

1. Make changes to the web app
2. Build and sync:
   ```bash
   npm run build
   npx cap sync ios
   ```
3. In Xcode: increment **Build** number (and optionally **Version**)
4. Archive and upload
5. In App Store Connect: add the new build and submit

---

## 10. Troubleshooting

### "No accounts with App Store Connect access"
- Ensure your Apple ID is enrolled in the Apple Developer Program
- In Xcode > Preferences > Accounts, sign in with your developer Apple ID

### "Provisioning profile doesn't match bundle identifier"
- Verify Bundle ID in Xcode matches `com.lendwise.app`
- Re-download provisioning profile from developer.apple.com

### "Missing compliance" warning after upload
- The `Info.plist` already includes `ITSAppUsesNonExemptEncryption = NO`
- If you use HTTPS only (no custom encryption), this is correct

### "App rejected: Guideline 4.2 — Minimum Functionality"
- Apple may reject apps that are primarily web wrappers loading from a URL
- Consider bundling the web assets instead of using `server.url`
- To bundle: comment out `server.url` in `capacitor.config.ts`, rebuild, and re-sync
- This ensures the app works offline and feels native

### Build fails with "Module not found"
```bash
cd ios/App
pod deintegrate
pod install
cd ../..
npx cap sync ios
```

For local iOS build instructions (debug, simulator, device), see **IOS_BUILD_GUIDE.md**.
