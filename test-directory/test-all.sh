#!/bin/bash

# Comprehensive Test Script for ino-icon-maker
# Tests all customization options and scenarios

set -e

echo "🧪 INO-ICON-MAKER COMPREHENSIVE TEST SUITE"
echo "=========================================="
echo ""

# Create test images if they don't exist
if [ ! -f input/icon.png ]; then
    echo "⚠️  Creating test images..."
    # Create a simple colored square as test icon
    node -e "
    const sharp = require('sharp');
    
    // Create basic icon - blue square with white circle
    sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 4,
        background: { r: 33, g: 150, b: 243, alpha: 1 }
      }
    })
    .composite([{
      input: Buffer.from(
        '<svg><circle cx=\"512\" cy=\"512\" r=\"300\" fill=\"white\"/></svg>'
      ),
      top: 0,
      left: 0
    }])
    .png()
    .toFile('input/icon.png');
    
    // Create foreground layer - transparent with logo
    sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    .composite([{
      input: Buffer.from(
        '<svg><circle cx=\"512\" cy=\"512\" r=\"400\" fill=\"#2196F3\"/><circle cx=\"512\" cy=\"512\" r=\"300\" fill=\"white\"/></svg>'
      ),
      top: 0,
      left: 0
    }])
    .png()
    .toFile('input/foreground.png');
    
    // Create background layer - gradient
    sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 4,
        background: { r: 255, g: 87, b: 34, alpha: 1 }
      }
    })
    .png()
    .toFile('input/background.png');
    "
    echo "✅ Test images created"
fi

# Create custom config files
echo "📝 Creating custom config files..."

# Config 1: Scale up
cat > configs/scale-up.json << 'CONF1'
{
  "scale": 1.2
}
CONF1

# Config 2: Platform-specific scales
cat > configs/platform-scales.json << 'CONF2'
{
  "ios": { "scale": 1.1 },
  "android": { "scale": 1.3 }
}
CONF2

# Config 3: Exclude sizes
cat > configs/exclude-sizes.json << 'CONF3'
{
  "android": {
    "excludeSizes": ["ldpi", "monochrome"]
  },
  "ios": {
    "excludeSizes": ["20x20@2x"]
  }
}
CONF3

# Config 4: Add custom sizes
cat > configs/add-custom.json << 'CONF4'
{
  "android": {
    "addSizes": [
      {
        "density": "xxxxhdpi",
        "size": 256,
        "folder": "mipmap-xxxxhdpi",
        "filename": "ic_launcher.png"
      }
    ]
  },
  "ios": {
    "addSizes": [
      {
        "size": "512x512",
        "scale": "2x",
        "filename": "Icon-App-512x512@2x.png"
      }
    ]
  }
}
CONF4

# Config 5: Combined customization
cat > configs/combined.json << 'CONF5'
{
  "scale": 1.1,
  "android": {
    "excludeSizes": ["ldpi"],
    "addSizes": [
      {
        "density": "xxxxhdpi",
        "size": 256,
        "folder": "mipmap-xxxxhdpi",
        "filename": "ic_launcher.png"
      }
    ]
  },
  "ios": {
    "excludeSizes": ["20x20"],
    "scale": 1.2
  }
}
CONF5

echo "✅ Config files created"
echo ""

# Test counter
test_num=0

# Function to run test
run_test() {
    ((test_num++))
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "TEST $test_num: $1"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    shift
    if "$@"; then
        echo "✅ Test $test_num PASSED"
    else
        echo "❌ Test $test_num FAILED"
        return 1
    fi
}

# TEST 1: Basic iOS generation
run_test "Basic iOS icon generation" \
    iim generate -i input/icon.png -o output/test1-ios -p ios -f

# TEST 2: Basic Android generation
run_test "Basic Android icon generation" \
    iim generate -i input/icon.png -o output/test2-android -p android -f

# TEST 3: Both platforms
run_test "Both platforms (iOS + Android)" \
    iim generate -i input/icon.png -o output/test3-both -p all -f

# TEST 4: With ZIP archive
run_test "Generate with ZIP archive" \
    iim generate -i input/icon.png -o output/test4-zip -p all -z -f

# TEST 5: Removed (scale functionality removed)
# TEST 6: Removed (scale functionality removed)

# TEST 7: Exclude Android ldpi
run_test "Exclude Android ldpi density" \
    iim generate -i input/icon.png -o output/test7-exclude-ldpi -p android --exclude "ldpi" -f

# TEST 8: Exclude multiple sizes
run_test "Exclude ldpi and monochrome" \
    iim generate -i input/icon.png -o output/test8-exclude-multi -p android --exclude "ldpi,monochrome" -f

# TEST 9: Removed (scale functionality removed)
# TEST 10: Removed (scale functionality removed)

# TEST 11: Custom config - exclude sizes
run_test "Custom config: exclude sizes" \
    iim generate -i input/icon.png -o output/test11-config-exclude --custom-config configs/exclude-sizes.json -f

# TEST 12: Custom config - add custom sizes
run_test "Custom config: add custom sizes" \
    iim generate -i input/icon.png -o output/test12-config-add --custom-config configs/add-custom.json -f

# TEST 13: Custom config - combined
run_test "Custom config: combined customization" \
    iim generate -i input/icon.png -o output/test13-config-combined --custom-config configs/combined.json -f

# TEST 14: Adaptive icons with background color
run_test "Android adaptive icons with background color" \
    iim generate -p android -fg input/foreground.png --bg-color "#FF5722" -o output/test14-adaptive-color -f

# TEST 15: Adaptive icons with background image
run_test "Android adaptive icons with background image" \
    iim generate -p android -fg input/foreground.png -bg input/background.png -o output/test15-adaptive-image -f

# TEST 16: Adaptive + exclude monochrome (moved from TEST 17, scale test removed)
run_test "Adaptive icons excluding monochrome" \
    iim generate -p android -fg input/foreground.png -bg input/background.png -o output/test16-adaptive-no-mono --exclude "monochrome" -f

# TEST 17: iOS with custom config exclude
run_test "iOS: exclude small sizes" \
    iim generate -i input/icon.png -o output/test17-ios-exclude -p ios --exclude "20x20@2x,29x29@3x" -f

# TEST 18: Android with exclude only (removed scale)
run_test "Android: exclude ldpi" \
    iim generate -i input/icon.png -o output/test18-android-exclude -p android --exclude "ldpi" -f

# TEST 19: All platforms with ZIP (removed scale)
run_test "All platforms: ZIP archive" \
    iim generate -i input/icon.png -o output/test19-all-zip -p all -z -f

# TEST 20: Combined: Custom config with exclude + addSizes
run_test "Combined: exclude + addSizes via config" \
    iim generate -i input/icon.png -o output/test20-combined --custom-config configs/combined.json -f

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 ALL TESTS COMPLETED SUCCESSFULLY!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Test Results:"
echo "   Total tests: $test_num"
echo "   Output directory: output/"
echo ""
echo "📁 Generated test outputs:"
ls -1 output/ | head -20
