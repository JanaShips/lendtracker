/**
 * Icon Generator Script for LendTracker
 * 
 * This script generates all required PNG icons from the SVG source.
 * 
 * Prerequisites:
 *   npm install sharp --save-dev
 * 
 * Usage:
 *   node scripts/generate-icons.js
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
const SVG_SOURCE = path.join(ICONS_DIR, 'icon.svg');

// Icon sizes needed for PWA
const PWA_SIZES = [16, 32, 72, 96, 128, 144, 152, 167, 180, 192, 384, 512];

// Apple touch icon sizes
const APPLE_SIZES = [120, 152, 167, 180];

// Splash screen sizes for iOS (width x height)
const SPLASH_SIZES = [
  { name: 'splash-1125x2436', width: 1125, height: 2436 }, // iPhone X/XS/11 Pro
  { name: 'splash-828x1792', width: 828, height: 1792 },   // iPhone XR/11
  { name: 'splash-1242x2688', width: 1242, height: 2688 }, // iPhone XS Max/11 Pro Max
  { name: 'splash-1170x2532', width: 1170, height: 2532 }, // iPhone 12/13/14
  { name: 'splash-1284x2778', width: 1284, height: 2778 }, // iPhone 12/13/14 Pro Max
  { name: 'splash-1179x2556', width: 1179, height: 2556 }, // iPhone 14 Pro
  { name: 'splash-1290x2796', width: 1290, height: 2796 }, // iPhone 14 Pro Max
  { name: 'splash-2048x2732', width: 2048, height: 2732 }, // iPad Pro 12.9"
];

async function generateIcons() {
  console.log('🎨 Generating icons for LendTracker...\n');
  
  // Ensure icons directory exists
  if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true });
  }
  
  // Check if SVG exists
  if (!fs.existsSync(SVG_SOURCE)) {
    console.error('❌ SVG source not found:', SVG_SOURCE);
    console.log('Please create the icon.svg file first.');
    process.exit(1);
  }
  
  const svgBuffer = fs.readFileSync(SVG_SOURCE);
  
  // Generate PWA icons
  console.log('📱 Generating PWA icons...');
  for (const size of PWA_SIZES) {
    const outputPath = path.join(ICONS_DIR, `icon-${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`  ✓ icon-${size}.png`);
  }
  
  // Generate Apple touch icons
  console.log('\n🍎 Generating Apple touch icons...');
  for (const size of APPLE_SIZES) {
    const outputPath = path.join(ICONS_DIR, `apple-touch-icon-${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`  ✓ apple-touch-icon-${size}.png`);
  }
  
  // Main apple-touch-icon (180px)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(ICONS_DIR, 'apple-touch-icon.png'));
  console.log('  ✓ apple-touch-icon.png');
  
  // Generate splash screens
  console.log('\n💦 Generating splash screens...');
  for (const splash of SPLASH_SIZES) {
    const outputPath = path.join(ICONS_DIR, `${splash.name}.png`);
    
    // Create splash screen with icon centered on dark background
    const iconSize = Math.min(splash.width, splash.height) * 0.3;
    const iconBuffer = await sharp(svgBuffer)
      .resize(Math.round(iconSize), Math.round(iconSize))
      .png()
      .toBuffer();
    
    await sharp({
      create: {
        width: splash.width,
        height: splash.height,
        channels: 4,
        background: { r: 10, g: 14, b: 23, alpha: 1 } // #0a0e17
      }
    })
      .composite([{
        input: iconBuffer,
        gravity: 'center'
      }])
      .png()
      .toFile(outputPath);
    
    console.log(`  ✓ ${splash.name}.png`);
  }
  
  // Generate OG image (1200x630)
  console.log('\n🖼️ Generating social media images...');
  const ogIconBuffer = await sharp(svgBuffer)
    .resize(400, 400)
    .png()
    .toBuffer();
  
  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 10, g: 14, b: 23, alpha: 1 }
    }
  })
    .composite([{
      input: ogIconBuffer,
      left: 400,
      top: 115
    }])
    .png()
    .toFile(path.join(ICONS_DIR, 'og-image.png'));
  console.log('  ✓ og-image.png');
  
  // Generate screenshots (placeholders)
  console.log('\n📸 Generating screenshot placeholders...');
  await sharp({
    create: {
      width: 1280,
      height: 720,
      channels: 4,
      background: { r: 10, g: 14, b: 23, alpha: 1 }
    }
  })
    .png()
    .toFile(path.join(ICONS_DIR, 'screenshot-wide.png'));
  console.log('  ✓ screenshot-wide.png');
  
  await sharp({
    create: {
      width: 750,
      height: 1334,
      channels: 4,
      background: { r: 10, g: 14, b: 23, alpha: 1 }
    }
  })
    .png()
    .toFile(path.join(ICONS_DIR, 'screenshot-narrow.png'));
  console.log('  ✓ screenshot-narrow.png');
  
  console.log('\n✅ All icons generated successfully!');
  console.log(`   Output directory: ${ICONS_DIR}`);
}

generateIcons().catch(console.error);
