/**
 * Android Icon Generator Script for LendTracker
 * 
 * This script generates all required Android icons and splash screens.
 * 
 * Prerequisites:
 *   npm install sharp --save-dev
 * 
 * Usage:
 *   node scripts/generate-android-icons.cjs
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('Sharp not installed. Installing...');
  console.log('Run: npm install sharp --save-dev');
  console.log('Then run this script again.');
  process.exit(1);
}

const ICONS_DIR = path.join(__dirname, '../public/icons');
const ANDROID_RES_DIR = path.join(__dirname, '../android/app/src/main/res');
const SVG_SOURCE = path.join(ICONS_DIR, 'icon.svg');

// Android launcher icon sizes (density: size)
const ANDROID_ICON_SIZES = {
  'mdpi': 48,
  'hdpi': 72,
  'xhdpi': 96,
  'xxhdpi': 144,
  'xxxhdpi': 192
};

// Android adaptive icon foreground sizes (with padding for safe zone)
const ANDROID_ADAPTIVE_SIZES = {
  'mdpi': 108,
  'hdpi': 162,
  'xhdpi': 216,
  'xxhdpi': 324,
  'xxxhdpi': 432
};

// Android splash screen sizes (portrait)
const ANDROID_SPLASH_PORTRAIT = {
  'port-mdpi': { width: 320, height: 480 },
  'port-hdpi': { width: 480, height: 800 },
  'port-xhdpi': { width: 720, height: 1280 },
  'port-xxhdpi': { width: 960, height: 1600 },
  'port-xxxhdpi': { width: 1280, height: 1920 }
};

// Android splash screen sizes (landscape)
const ANDROID_SPLASH_LANDSCAPE = {
  'land-mdpi': { width: 480, height: 320 },
  'land-hdpi': { width: 800, height: 480 },
  'land-xhdpi': { width: 1280, height: 720 },
  'land-xxhdpi': { width: 1600, height: 960 },
  'land-xxxhdpi': { width: 1920, height: 1280 }
};

// Background color for splash screens
const SPLASH_BG_COLOR = { r: 10, g: 14, b: 23, alpha: 1 }; // #0a0e17

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateAndroidIcons() {
  console.log('🤖 Generating Android icons for LendTracker...\n');
  
  // Check if SVG exists
  if (!fs.existsSync(SVG_SOURCE)) {
    console.error('❌ SVG source not found:', SVG_SOURCE);
    console.log('Please ensure icon.svg exists in public/icons/');
    process.exit(1);
  }
  
  const svgBuffer = fs.readFileSync(SVG_SOURCE);
  
  // Generate launcher icons (ic_launcher.png)
  console.log('📱 Generating launcher icons...');
  for (const [density, size] of Object.entries(ANDROID_ICON_SIZES)) {
    const outputDir = path.join(ANDROID_RES_DIR, `mipmap-${density}`);
    await ensureDir(outputDir);
    
    // Standard launcher icon
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(outputDir, 'ic_launcher.png'));
    
    // Round launcher icon (with circular mask)
    const roundedBuffer = await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toBuffer();
    
    // Create circular mask
    const circleMask = Buffer.from(
      `<svg width="${size}" height="${size}">
        <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white"/>
      </svg>`
    );
    
    await sharp(roundedBuffer)
      .composite([{
        input: circleMask,
        blend: 'dest-in'
      }])
      .png()
      .toFile(path.join(outputDir, 'ic_launcher_round.png'));
    
    console.log(`  ✓ mipmap-${density}/ic_launcher.png & ic_launcher_round.png`);
  }
  
  // Generate adaptive icon foreground
  console.log('\n🎨 Generating adaptive icon foreground...');
  for (const [density, size] of Object.entries(ANDROID_ADAPTIVE_SIZES)) {
    const outputDir = path.join(ANDROID_RES_DIR, `mipmap-${density}`);
    await ensureDir(outputDir);
    
    // Calculate icon size (66% of total for safe zone)
    const iconSize = Math.round(size * 0.66);
    const padding = Math.round((size - iconSize) / 2);
    
    const iconBuffer = await sharp(svgBuffer)
      .resize(iconSize, iconSize)
      .png()
      .toBuffer();
    
    // Create foreground with icon centered
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([{
        input: iconBuffer,
        left: padding,
        top: padding
      }])
      .png()
      .toFile(path.join(outputDir, 'ic_launcher_foreground.png'));
    
    console.log(`  ✓ mipmap-${density}/ic_launcher_foreground.png`);
  }
  
  // Generate splash screens (portrait)
  console.log('\n💦 Generating portrait splash screens...');
  for (const [density, dimensions] of Object.entries(ANDROID_SPLASH_PORTRAIT)) {
    const outputDir = path.join(ANDROID_RES_DIR, `drawable-${density}`);
    await ensureDir(outputDir);
    
    const iconSize = Math.min(dimensions.width, dimensions.height) * 0.3;
    const iconBuffer = await sharp(svgBuffer)
      .resize(Math.round(iconSize), Math.round(iconSize))
      .png()
      .toBuffer();
    
    await sharp({
      create: {
        width: dimensions.width,
        height: dimensions.height,
        channels: 4,
        background: SPLASH_BG_COLOR
      }
    })
      .composite([{
        input: iconBuffer,
        gravity: 'center'
      }])
      .png()
      .toFile(path.join(outputDir, 'splash.png'));
    
    console.log(`  ✓ drawable-${density}/splash.png`);
  }
  
  // Generate splash screens (landscape)
  console.log('\n🌅 Generating landscape splash screens...');
  for (const [density, dimensions] of Object.entries(ANDROID_SPLASH_LANDSCAPE)) {
    const outputDir = path.join(ANDROID_RES_DIR, `drawable-${density}`);
    await ensureDir(outputDir);
    
    const iconSize = Math.min(dimensions.width, dimensions.height) * 0.3;
    const iconBuffer = await sharp(svgBuffer)
      .resize(Math.round(iconSize), Math.round(iconSize))
      .png()
      .toBuffer();
    
    await sharp({
      create: {
        width: dimensions.width,
        height: dimensions.height,
        channels: 4,
        background: SPLASH_BG_COLOR
      }
    })
      .composite([{
        input: iconBuffer,
        gravity: 'center'
      }])
      .png()
      .toFile(path.join(outputDir, 'splash.png'));
    
    console.log(`  ✓ drawable-${density}/splash.png`);
  }
  
  // Generate default splash in drawable folder
  console.log('\n📄 Generating default splash...');
  const defaultDir = path.join(ANDROID_RES_DIR, 'drawable');
  await ensureDir(defaultDir);
  
  const defaultIconBuffer = await sharp(svgBuffer)
    .resize(200, 200)
    .png()
    .toBuffer();
  
  await sharp({
    create: {
      width: 480,
      height: 800,
      channels: 4,
      background: SPLASH_BG_COLOR
    }
  })
    .composite([{
      input: defaultIconBuffer,
      gravity: 'center'
    }])
    .png()
    .toFile(path.join(defaultDir, 'splash.png'));
  console.log('  ✓ drawable/splash.png');
  
  // Generate notification icon (small, monochrome)
  console.log('\n🔔 Generating notification icon...');
  for (const [density, size] of Object.entries(ANDROID_ICON_SIZES)) {
    const outputDir = path.join(ANDROID_RES_DIR, `drawable-${density}`);
    await ensureDir(outputDir);
    
    // Notification icons should be smaller (24dp base)
    const notifSize = Math.round(size * 0.5);
    
    await sharp(svgBuffer)
      .resize(notifSize, notifSize)
      .png()
      .toFile(path.join(outputDir, 'ic_stat_icon.png'));
    
    console.log(`  ✓ drawable-${density}/ic_stat_icon.png`);
  }
  
  console.log('\n✅ All Android icons generated successfully!');
  console.log(`   Output directory: ${ANDROID_RES_DIR}`);
}

generateAndroidIcons().catch(console.error);
