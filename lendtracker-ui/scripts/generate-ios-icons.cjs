/**
 * iOS Icon & Splash Screen Generator for LendWise
 * 
 * Generates all required iOS app icons (1024x1024 for App Store)
 * and splash screen images for the Capacitor iOS project.
 * 
 * Prerequisites:
 *   npm install sharp --save-dev
 * 
 * Usage:
 *   node scripts/generate-ios-icons.cjs
 */

const fs = require('fs');
const path = require('path');

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('Sharp not installed. Run: npm install sharp --save-dev');
  process.exit(1);
}

const ICONS_DIR = path.join(__dirname, '../public/icons');
const IOS_ASSETS_DIR = path.join(__dirname, '../ios/App/App/Assets.xcassets');
const APP_ICON_DIR = path.join(IOS_ASSETS_DIR, 'AppIcon.appiconset');
const SPLASH_DIR = path.join(IOS_ASSETS_DIR, 'Splash.imageset');
const SVG_SOURCE = path.join(ICONS_DIR, 'icon.svg');

const SPLASH_BG_COLOR = { r: 10, g: 14, b: 23, alpha: 1 }; // #0a0e17
const SPLASH_SIZE = 2732;

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateAppIcon() {
  console.log('Generating iOS App Icon (1024x1024)...\n');

  if (!fs.existsSync(SVG_SOURCE)) {
    console.error('SVG source not found:', SVG_SOURCE);
    process.exit(1);
  }

  await ensureDir(APP_ICON_DIR);
  const svgBuffer = fs.readFileSync(SVG_SOURCE);

  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png({ quality: 100 })
    .toFile(path.join(APP_ICON_DIR, 'AppIcon-512@2x.png'));
  console.log('  Done: AppIcon-512@2x.png (1024x1024)');

  const contentsJson = {
    images: [
      {
        filename: 'AppIcon-512@2x.png',
        idiom: 'universal',
        platform: 'ios',
        size: '1024x1024'
      }
    ],
    info: {
      author: 'xcode',
      version: 1
    }
  };

  fs.writeFileSync(
    path.join(APP_ICON_DIR, 'Contents.json'),
    JSON.stringify(contentsJson, null, 2)
  );
  console.log('  Done: Contents.json\n');
}

async function generateSplashScreens() {
  console.log('Generating iOS Splash Screens...\n');

  await ensureDir(SPLASH_DIR);
  const svgBuffer = fs.readFileSync(SVG_SOURCE);

  const iconSize = Math.round(SPLASH_SIZE * 0.15);
  const iconBuffer = await sharp(svgBuffer)
    .resize(iconSize, iconSize)
    .png()
    .toBuffer();

  const scales = [
    { name: 'splash-2732x2732-2.png', scale: '1x', size: SPLASH_SIZE },
    { name: 'splash-2732x2732-1.png', scale: '2x', size: SPLASH_SIZE },
    { name: 'splash-2732x2732.png',   scale: '3x', size: SPLASH_SIZE }
  ];

  for (const entry of scales) {
    await sharp({
      create: {
        width: entry.size,
        height: entry.size,
        channels: 4,
        background: SPLASH_BG_COLOR
      }
    })
      .composite([{ input: iconBuffer, gravity: 'center' }])
      .png()
      .toFile(path.join(SPLASH_DIR, entry.name));
    console.log(`  Done: ${entry.name} (${entry.scale})`);
  }

  const contentsJson = {
    images: [
      { idiom: 'universal', filename: 'splash-2732x2732-2.png', scale: '1x' },
      { idiom: 'universal', filename: 'splash-2732x2732-1.png', scale: '2x' },
      { idiom: 'universal', filename: 'splash-2732x2732.png',   scale: '3x' }
    ],
    info: {
      version: 1,
      author: 'xcode'
    }
  };

  fs.writeFileSync(
    path.join(SPLASH_DIR, 'Contents.json'),
    JSON.stringify(contentsJson, null, 2)
  );
  console.log('  Done: Contents.json\n');
}

async function main() {
  console.log('=== LendWise iOS Asset Generator ===\n');

  if (!fs.existsSync(path.join(__dirname, '../ios'))) {
    console.error('ios/ directory not found. Run: npx cap add ios');
    process.exit(1);
  }

  await generateAppIcon();
  await generateSplashScreens();

  console.log('All iOS assets generated successfully!');
  console.log(`  App Icon: ${APP_ICON_DIR}`);
  console.log(`  Splash:   ${SPLASH_DIR}`);
}

main().catch(console.error);
