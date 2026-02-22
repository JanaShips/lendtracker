# Building LendWise iOS Without a Mac

You **cannot** run Xcode directly on Windows, but there are several practical ways to build, test, and publish an iOS app without owning a Mac.

---

## Option 1: GitHub Actions (Free - Recommended)

GitHub provides **free macOS runners** on every repository. This is the easiest and cheapest way.

### How it works
- Push your code to GitHub
- A GitHub Actions workflow runs on a macOS VM in the cloud
- It builds the iOS app, runs tests, and produces artifacts
- You download the build artifact from the Actions tab

### Setup

1. **Push this repo to GitHub** (if not already):
   ```powershell
   cd LendTracker
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/LendTracker.git
   git push -u origin main
   ```

2. **The workflow is already created** at `.github/workflows/ios-build.yml`

3. **Trigger a build**:
   - Push to `main` branch (auto-triggers), OR
   - Go to **Actions** tab > **iOS Build** > **Run workflow** > Select `debug` or `release`

4. **Download the artifact**: After the build completes, download from the Actions run page.

### Limits (Free tier)
| Resource | Free (public repo) | Free (private repo) |
|----------|-------------------|---------------------|
| macOS minutes/month | Unlimited | 200 min (10x multiplier = 20 actual min) |
| Storage | 500 MB artifacts | 500 MB artifacts |

> For private repos, each macOS minute counts as 10 regular minutes. A typical iOS build takes ~10-15 min = ~100-150 of your 2000 free minutes.

### For App Store submission
Add signing secrets to your repo:
1. Go to **Settings** > **Secrets and variables** > **Actions**
2. Add your Apple certificates and provisioning profiles as secrets
3. The workflow handles the rest

---

## Option 2: Codemagic (Free tier - Best for Mobile)

[Codemagic](https://codemagic.io) is a CI/CD platform built specifically for mobile apps. It has excellent Capacitor support.

### How it works
- Connect your GitHub/GitLab/Bitbucket repo
- Codemagic builds on Apple Silicon Mac minis in the cloud
- Handles code signing automatically
- Can publish directly to App Store / TestFlight

### Setup

1. **Sign up** at [codemagic.io](https://codemagic.io) (free, use GitHub login)

2. **The config is already created** at `lendtracker-ui/codemagic.yaml`

3. **Connect your repo** in Codemagic dashboard

4. **Start a build** from the dashboard

### Free tier limits
| Resource | Free |
|----------|------|
| Build minutes/month | 500 min on macOS M2 |
| Max build duration | 120 min |
| Concurrent builds | 1 |

500 minutes is very generous for personal projects (~30-40 builds/month).

### Automatic App Store publishing
1. In Codemagic dashboard: **Settings** > **Code signing** > **iOS**
2. Upload your Apple Distribution certificate and provisioning profile
3. Add App Store Connect API key
4. Codemagic builds, signs, and uploads to TestFlight/App Store automatically

---

## Option 3: Xcode Cloud (Apple's CI/CD)

If you have an **Apple Developer Program** membership ($99/year), you get [Xcode Cloud](https://developer.apple.com/xcode-cloud/) included.

### How it works
- Configure via App Store Connect (web browser, works on Windows)
- Builds on Apple's infrastructure
- Direct integration with TestFlight and App Store

### Setup
1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Navigate to your app > **Xcode Cloud**
3. Create a workflow pointing to your repo
4. Configure build settings

### Limits (included with Developer Program)
| Resource | Included |
|----------|----------|
| Compute hours/month | 25 hours |

---

## Option 4: Cloud Mac Rental

Rent a Mac in the cloud, access it via Remote Desktop from your Windows PC.

| Service | Starting Price | Notes |
|---------|---------------|-------|
| [MacStadium](https://www.macstadium.com) | ~$50/month | Dedicated Mac minis |
| [MacinCloud](https://www.macincloud.com) | ~$1/hour pay-as-you-go | Shared or dedicated |
| [AWS EC2 Mac](https://aws.amazon.com/ec2/instance-types/mac/) | ~$0.65/hour (M2) | Minimum 24-hour allocation |
| [Scaleway Apple Silicon](https://www.scaleway.com/en/apple-silicon/) | ~$0.10/hour (M1) | Cheapest hourly option |

### When to use
- You need full Xcode IDE access (debugging, profiling)
- You want to test on a real iOS Simulator
- One-time or occasional builds where CI/CD feels overkill

---

## Option 5: Appetize.io (Testing Only)

[Appetize.io](https://appetize.io) lets you **run iOS apps in a browser** without any Apple hardware. It streams a real iOS simulator.

### Use case
- Quick testing of your built .app file
- Sharing a demo with others via a link
- Does NOT help with building (you still need one of the above for that)

---

## Recommendation Matrix

| Situation | Best Option |
|-----------|-------------|
| **Free, occasional builds** | GitHub Actions |
| **Free, frequent mobile builds** | Codemagic (500 min/month) |
| **Already have Apple Developer ($99/yr)** | Xcode Cloud (25 hrs included) |
| **Need full Xcode IDE access** | Cloud Mac rental (MacinCloud) |
| **Just want to test quickly** | Build via CI + Appetize.io |
| **Publishing to App Store** | Codemagic (easiest signing setup) |

---

## Quick Start: Build Your First iOS IPA from Windows

### Using GitHub Actions (simplest)

```powershell
# 1. Make sure your repo is on GitHub
cd LendTracker
git add .
git commit -m "Add iOS platform"
git push origin main

# 2. Go to GitHub > Actions > iOS Build > Run workflow
# 3. Wait ~10-15 minutes
# 4. Download the artifact from the completed run
```

### Using Codemagic

1. Go to [codemagic.io](https://codemagic.io), sign in with GitHub
2. Add your repository
3. It auto-detects `codemagic.yaml`
4. Click **Start new build** > select `ios-simulator` workflow
5. Download the build artifact when done

---

## Publishing to App Store from Windows

The full flow without ever touching a Mac:

1. **Build & sign** via Codemagic or GitHub Actions (with certificates configured)
2. **Upload** to App Store Connect automatically via CI, or use [Transporter](https://apps.apple.com/us/app/transporter/id1450874784) (macOS only, but CI handles this)
3. **Manage your app listing** at [appstoreconnect.apple.com](https://appstoreconnect.apple.com) (works in any browser on Windows)
4. **Submit for review** from App Store Connect web interface

The only Apple-specific requirement is the **Apple Developer Program** ($99/year) for App Store distribution. Testing on simulators via CI is completely free.
