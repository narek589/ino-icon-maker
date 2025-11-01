# 🧪 Testing Guide

Comprehensive guide for testing ino-icon-maker in all scenarios.

## 📖 Table of Contents

- [Manual Testing](#manual-testing)
- [Automated Testing](#automated-testing)
- [Verification Checklist](#verification-checklist)
- [Platform-Specific Testing](#platform-specific-testing)
- [Integration Testing](#integration-testing)

---

## 🧪 Manual Testing

### CLI Testing

#### Test Basic Generation

```bash
# Test all platforms
ino-icon generate -fg test-icon.png -o ./test-output -p all

# Verify output
ls -la test-output/
ls -la test-output/AppIcon.appiconset/
ls -la test-output/android-icons/

# Cleanup
rm -rf test-output
```

#### Test Each Platform

```bash
# iOS
ino-icon generate -fg test-icon.png -o ./ios-test -p ios
test -d ios-test/AppIcon.appiconset && echo "✅ iOS OK" || echo "❌ iOS Failed"

# Android
ino-icon generate -fg test-icon.png -o ./android-test -p android
test -d android-test/android-icons && echo "✅ Android OK" || echo "❌ Android Failed"

# Cleanup
rm -rf ios-test android-test
```

#### Test ZIP Creation

```bash
ino-icon generate -fg test-icon.png -o ./zip-test -z

# Verify ZIP exists
test -f zip-test/*.zip && echo "✅ ZIP created" || echo "❌ ZIP not created"

# Extract and verify contents
cd zip-test
unzip *.zip -d extracted
ls -la extracted/

# Cleanup
cd ..
rm -rf zip-test
```

#### Test Auto-Install Feature

**React Native Project:**

```bash
# Create test React Native structure
mkdir -p test-rn/ios/TestApp/Images.xcassets
mkdir -p test-rn/android/app/src/main/res
echo '{"dependencies":{"react-native":"*"}}' > test-rn/package.json

# Test auto-install
cd test-rn
ino-icon generate -fg ../test-icon.png --install

# Verify installation
test -d ios/TestApp/Images.xcassets/AppIcon.appiconset && echo "✅ iOS installed"
test -d android/app/src/main/res/mipmap-hdpi && echo "✅ Android installed"

# Cleanup
cd ..
rm -rf test-rn
```

**Flutter Project:**

```bash
# Create test Flutter structure
mkdir -p test-flutter/ios/Runner/Assets.xcassets
mkdir -p test-flutter/android/app/src/main/res
echo 'name: test_app' > test-flutter/pubspec.yaml

# Test auto-install
cd test-flutter
ino-icon generate -fg ../test-icon.png --install

# Verify installation
test -d ios/Runner/Assets.xcassets/AppIcon.appiconset && echo "✅ iOS installed"
test -d android/app/src/main/res/mipmap-hdpi && echo "✅ Android installed"

# Cleanup
cd ..
rm -rf test-flutter
```

#### Test Adaptive Icons

```bash
# Test foreground + background color
ino-icon generate \
  -fg test-fg.png \
  -bg "#FF5722" \
  -o ./adaptive-test \
  -p android

# Verify output
ls -la adaptive-test/android-icons/mipmap-xxxhdpi/

# Cleanup
rm -rf adaptive-test
```

#### Test Error Handling

```bash
# Test missing input file
ino-icon generate -fg nonexistent.png -o ./test 2>&1 | grep -q "not found" && echo "✅ Error handling OK"

# Test invalid platform
ino-icon generate -fg test-icon.png -p invalid 2>&1 | grep -q "Invalid" && echo "✅ Error handling OK"

# Test invalid image format
touch test.txt
ino-icon generate -fg test.txt -o ./test 2>&1 | grep -q "Invalid" && echo "✅ Error handling OK"
rm test.txt
```

### HTTP API Testing

#### Start Server

```bash
# Terminal 1: Start server
ino-icon serve -p 3000
```

#### Manual Tests (Terminal 2)

```bash
# Test health check
curl http://localhost:3000/
echo ""

# Test platforms endpoint
curl http://localhost:3000/platforms
echo ""

# Test icon generation
curl -F "file=@test-icon.png" \
  "http://localhost:3000/generate" \
  -o test-icons.zip

# Verify ZIP
unzip -l test-icons.zip

# Cleanup
rm test-icons.zip
```

#### Automated API Tests

```bash
# Run the test script
chmod +x test-api.sh
./test-api.sh
```

### Programmatic Testing

Create `test-programmatic.js`:

```javascript
import { quickGenerate, validateImageFile } from "ino-icon-maker";
import { existsSync } from "fs";
import { rm } from "fs/promises";

async function test() {
	console.log("Testing programmatic usage...\n");

	try {
		// Test 1: Basic generation
		console.log("Test 1: Basic generation");
		await quickGenerate({
			input: "./test-icon.png",
			output: "./test-output",
			platform: "all",
			force: true,
		});
		console.log(existsSync("./test-output/AppIcon.appiconset") ? "✅" : "❌");

		// Test 2: iOS only
		console.log("Test 2: iOS only");
		await quickGenerate({
			input: "./test-icon.png",
			output: "./test-ios",
			platform: "ios",
			force: true,
		});
		console.log(existsSync("./test-ios/AppIcon.appiconset") ? "✅" : "❌");

		// Test 3: Validation
		console.log("Test 3: Validation");
		const isValid = await validateImageFile("./test-icon.png");
		console.log(isValid ? "✅" : "❌");

		// Cleanup
		await rm("./test-output", { recursive: true, force: true });
		await rm("./test-ios", { recursive: true, force: true });

		console.log("\n✅ All tests passed!");
	} catch (error) {
		console.error("❌ Test failed:", error.message);
		process.exit(1);
	}
}

test();
```

Run:

```bash
node test-programmatic.js
```

---

## 🤖 Automated Testing

### Jest Test Suite

Create `__tests__/icon-generation.test.js`:

```javascript
import {
	quickGenerate,
	validateImageFile,
	getSupportedPlatforms,
} from "../index.js";
import { existsSync } from "fs";
import { rm } from "fs/promises";
import path from "path";

describe("Icon Generation", () => {
	const testIcon = path.join(__dirname, "../docs/assets/ios-example.png");
	const outputDir = path.join(__dirname, "../temp/test-output");

	afterEach(async () => {
		if (existsSync(outputDir)) {
			await rm(outputDir, { recursive: true });
		}
	});

	test("should generate iOS icons", async () => {
		await quickGenerate({
			input: testIcon,
			output: outputDir,
			platform: "ios",
		});

		expect(existsSync(path.join(outputDir, "AppIcon.appiconset"))).toBe(true);
	}, 30000);

	test("should generate Android icons", async () => {
		await quickGenerate({
			input: testIcon,
			output: outputDir,
			platform: "android",
		});

		expect(existsSync(path.join(outputDir, "android-icons"))).toBe(true);
	}, 30000);

	test("should validate image file", async () => {
		const isValid = await validateImageFile(testIcon);
		expect(isValid).toBe(true);
	});

	test("should get supported platforms", () => {
		const platforms = getSupportedPlatforms();
		expect(platforms).toContain("ios");
		expect(platforms).toContain("android");
	});
});
```

Run:

```bash
npm test
```

### CI Testing

Add to `.github/workflows/test.yml`:

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Test CLI
        run: |
          npx ino-icon-maker generate \
            -i docs/assets/ios-example.png \
            -o test-output \
            -p all
          test -d test-output/AppIcon.appiconset
          test -d test-output/android-icons
```

---

## ✅ Verification Checklist

### Icon Quality Verification

#### iOS Icons

```bash
# Generate iOS icons
ino-icon generate -fg icon.png -o output -p ios

# Check all sizes exist
sizes=(
  "Icon-App-20x20@1x.png"
  "Icon-App-20x20@2x.png"
  "Icon-App-20x20@3x.png"
  "Icon-App-29x29@1x.png"
  "Icon-App-29x29@2x.png"
  "Icon-App-29x29@3x.png"
  "Icon-App-40x40@1x.png"
  "Icon-App-40x40@2x.png"
  "Icon-App-40x40@3x.png"
  "Icon-App-60x60@2x.png"
  "Icon-App-60x60@3x.png"
  "Icon-App-76x76@1x.png"
  "Icon-App-76x76@2x.png"
  "Icon-App-83.5x83.5@2x.png"
  "Icon-App-1024x1024@1x.png"
)

for size in "${sizes[@]}"; do
  if [ -f "output/AppIcon.appiconset/$size" ]; then
    echo "✅ $size"
  else
    echo "❌ $size MISSING"
  fi
done

# Check Contents.json
test -f output/AppIcon.appiconset/Contents.json && echo "✅ Contents.json"
```

#### Android Icons

```bash
# Generate Android icons
ino-icon generate -fg icon.png -o output -p android

# Check all density folders exist
densities=("ldpi" "mdpi" "hdpi" "xhdpi" "xxhdpi" "xxxhdpi")

for density in "${densities[@]}"; do
  if [ -d "output/android-icons/mipmap-$density" ]; then
    echo "✅ mipmap-$density"
    ls output/android-icons/mipmap-$density/
  else
    echo "❌ mipmap-$density MISSING"
  fi
done
```

### Image Dimension Verification

```bash
# Install ImageMagick (if needed)
# brew install imagemagick  # macOS
# apt-get install imagemagick  # Linux

# Verify iOS icon dimensions
identify output/AppIcon.appiconset/Icon-App-20x20@1x.png
identify output/AppIcon.appiconset/Icon-App-60x60@3x.png
identify output/AppIcon.appiconset/Icon-App-1024x1024@1x.png

# Verify Android icon dimensions
identify output/android-icons/mipmap-xxxhdpi/ic_launcher.png
identify output/android-icons/mipmap-mdpi/ic_launcher.png
```

Expected outputs:

- `Icon-App-20x20@1x.png`: 20x20
- `Icon-App-60x60@3x.png`: 180x180
- `Icon-App-1024x1024@1x.png`: 1024x1024
- `ic_launcher.png` (xxxhdpi): 192x192
- `ic_launcher.png` (mdpi): 48x48

---

## 📱 Platform-Specific Testing

### iOS Testing

1. **Generate icons:**

   ```bash
   ino-icon generate -fg icon.png -o ios-test -p ios
   ```

2. **Copy to Xcode project:**

   ```bash
   cp -r ios-test/AppIcon.appiconset /path/to/ios/project/Images.xcassets/
   ```

3. **Open in Xcode and verify:**

   - Open project in Xcode
   - Navigate to Images.xcassets
   - Click on AppIcon
   - Verify all icon slots are filled
   - No warnings should appear

4. **Build and test:**

   ```bash
   cd /path/to/ios/project
   xcodebuild clean build
   ```

5. **Test on simulator:**
   - Run app on iOS simulator
   - Check home screen icon
   - Check app switcher icon
   - Check Settings app icon

### Android Testing

1. **Generate icons:**

   ```bash
   ino-icon generate -fg icon.png -o android-test -p android
   ```

2. **Copy to Android project:**

   ```bash
   cp -r android-test/android-icons/mipmap-* /path/to/android/app/src/main/res/
   ```

3. **Verify AndroidManifest.xml:**

   ```xml
   <application
     android:icon="@mipmap/ic_launcher"
     android:roundIcon="@mipmap/ic_launcher_round"
     ...>
   ```

4. **Build and test:**

   ```bash
   cd /path/to/android/project
   ./gradlew clean assembleDebug
   ```

5. **Test on emulator:**
   - Install APK on Android emulator
   - Check home screen icon
   - Check app drawer icon
   - Check recent apps icon

---

## 🔗 Integration Testing

### React Native Integration

Create `test-rn-integration.sh`:

```bash
#!/bin/bash

echo "Testing React Native integration..."

# Setup
mkdir -p test-rn-project/ios/TestApp/Images.xcassets
mkdir -p test-rn-project/android/app/src/main/res
echo '{"name":"test","dependencies":{"react-native":"*"}}' > test-rn-project/package.json

# Test
cd test-rn-project
npx ino-icon-maker generate -fg ../test-icon.png --install

# Verify
if [ -d "ios/TestApp/Images.xcassets/AppIcon.appiconset" ]; then
  echo "✅ iOS integration OK"
else
  echo "❌ iOS integration FAILED"
  exit 1
fi

if [ -d "android/app/src/main/res/mipmap-hdpi" ]; then
  echo "✅ Android integration OK"
else
  echo "❌ Android integration FAILED"
  exit 1
fi

# Cleanup
cd ..
rm -rf test-rn-project

echo "✅ All integration tests passed!"
```

### Flutter Integration

Create `test-flutter-integration.sh`:

```bash
#!/bin/bash

echo "Testing Flutter integration..."

# Setup
mkdir -p test-flutter-project/ios/Runner/Assets.xcassets
mkdir -p test-flutter-project/android/app/src/main/res
echo 'name: test_app' > test-flutter-project/pubspec.yaml

# Test
cd test-flutter-project
npx ino-icon-maker generate -fg ../test-icon.png --install

# Verify
if [ -d "ios/Runner/Assets.xcassets/AppIcon.appiconset" ]; then
  echo "✅ iOS integration OK"
else
  echo "❌ iOS integration FAILED"
  exit 1
fi

if [ -d "android/app/src/main/res/mipmap-hdpi" ]; then
  echo "✅ Android integration OK"
else
  echo "❌ Android integration FAILED"
  exit 1
fi

# Cleanup
cd ..
rm -rf test-flutter-project

echo "✅ All integration tests passed!"
```

---

## 📊 Performance Testing

```bash
# Time generation
time ino-icon generate -fg test-icon.png -o output -p all

# Expected: < 3 seconds for typical icon
```

---

## 🐛 Debugging

### Enable Verbose Logging

```javascript
// In your script
process.env.DEBUG = 'ino-icon-maker:*';

import { quickGenerate } from 'ino-icon-maker';
await quickGenerate({...});
```

### Check Output Files

```bash
# Verify file sizes are reasonable
find output -type f -exec ls -lh {} \; | awk '{print $5, $9}'

# Check image format
file output/AppIcon.appiconset/*.png

# Verify no corrupt images
identify -verbose output/AppIcon.appiconset/*.png
```

---

## ✅ Final Checklist

Before release, verify:

- [ ] All CLI commands work
- [ ] HTTP API endpoints work
- [ ] Programmatic API works
- [ ] Auto-install works for React Native
- [ ] Auto-install works for Flutter
- [ ] iOS icons generate correctly
- [ ] Android icons generate correctly
- [ ] Adaptive icons generate correctly
- [ ] ZIP archives create correctly
- [ ] Error handling works properly
- [ ] Icons display correctly on real devices
- [ ] Performance is acceptable
- [ ] All tests pass
- [ ] Documentation is accurate

---

## 📚 Related Documentation

- [CLI Usage](../examples/CLI_USAGE.md)
- [API Usage](../examples/API_USAGE.md)
- [Programmatic Usage](../examples/PROGRAMMATIC_USAGE.md)

---

**Need help?** [Open an issue](https://github.com/narek589/ino-icon-maker/issues)
