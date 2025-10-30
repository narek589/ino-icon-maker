# ⚛️ React Native Integration Guide

Complete guide for using Ino Icon Maker with React Native projects.

## 📖 Table of Contents

- [Quick Setup](#quick-setup)
- [Manual Integration](#manual-integration)
- [Automated Script](#automated-script)
- [Different Approaches](#different-approaches)
- [Environment-Specific Icons](#environment-specific-icons)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Setup

### Method 1: NPM Script (Recommended)

Add to your `package.json`:

```json
{
	"scripts": {
		"icons": "ino-icon-maker generate -i assets/icon.png -o temp -p all && npm run icons:install && npm run icons:cleanup",
		"icons:install": "npm run icons:ios && npm run icons:android",
		"icons:ios": "cp -r temp/AppIcon.appiconset ios/YourAppName/Images.xcassets/AppIcon.appiconset",
		"icons:android": "cp -r temp/android-icons/* android/app/src/main/res/",
		"icons:cleanup": "rm -rf temp"
	}
}
```

Then run:

```bash
npm run icons
```

---

## 📱 Manual Integration

### Step 1: Generate Icons

```bash
# Navigate to your React Native project
cd /path/to/your-rn-project

# Generate icons
npx ino-icon-maker generate -i assets/icon.png -o ./temp -p all
```

### Step 2: iOS Integration

```bash
# Copy to iOS project
cp -r temp/AppIcon.appiconset ios/YourAppName/Images.xcassets/AppIcon.appiconset
```

**Or manually:**

1. Open Xcode
2. Navigate to `ios/YourAppName/Images.xcassets/`
3. Delete existing `AppIcon.appiconset` folder
4. Drag generated `AppIcon.appiconset` folder into Xcode

### Step 3: Android Integration

```bash
# Copy to Android res directory
cp -r temp/android-icons/mipmap-* android/app/src/main/res/
```

**Directory structure after copy:**

```
android/app/src/main/res/
├── mipmap-hdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-mdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-xhdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-xxhdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
└── mipmap-xxxhdpi/
    ├── ic_launcher.png
    └── ic_launcher_round.png
```

### Step 4: Verify Android Manifest

Check `android/app/src/main/AndroidManifest.xml`:

```xml
<application
  android:icon="@mipmap/ic_launcher"
  android:roundIcon="@mipmap/ic_launcher_round"
  ...>
  ...
</application>
```

### Step 5: Clean Up

```bash
rm -rf temp
```

---

## 🤖 Automated Script

### Create `scripts/generate-icons.js`

```javascript
#!/usr/bin/env node

import { quickGenerate } from "ino-icon-maker";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const APP_NAME = "YourAppName"; // Change this!

async function generateIcons() {
	console.log("🎨 Generating app icons...\n");

	try {
		// Generate icons
		await quickGenerate({
			input: "./assets/icon.png",
			output: "./temp",
			platform: "all",
			force: true,
		});

		console.log("✓ Icons generated\n");

		// Install iOS icons
		console.log("📱 Installing iOS icons...");
		const iosTarget = `ios/${APP_NAME}/Images.xcassets/AppIcon.appiconset`;
		if (fs.existsSync(iosTarget)) {
			fs.rmSync(iosTarget, { recursive: true });
		}
		fs.cpSync("temp/AppIcon.appiconset", iosTarget, { recursive: true });
		console.log("✓ iOS icons installed\n");

		// Install Android icons
		console.log("🤖 Installing Android icons...");
		const androidRes = "android/app/src/main/res";
		const mipmapDirs = fs
			.readdirSync("temp/android-icons")
			.filter(dir => dir.startsWith("mipmap-"));

		for (const dir of mipmapDirs) {
			const source = `temp/android-icons/${dir}`;
			const target = `${androidRes}/${dir}`;

			if (!fs.existsSync(target)) {
				fs.mkdirSync(target, { recursive: true });
			}

			fs.cpSync(source, target, { recursive: true });
		}
		console.log("✓ Android icons installed\n");

		// Clean up
		console.log("🧹 Cleaning up...");
		fs.rmSync("temp", { recursive: true, force: true });
		console.log("✓ Cleanup complete\n");

		console.log("✅ All done! Your app icons have been updated.\n");
		console.log("Next steps:");
		console.log("  iOS: Run 'npx react-native run-ios'");
		console.log("  Android: Run 'npx react-native run-android'");
	} catch (error) {
		console.error("❌ Error:", error.message);
		process.exit(1);
	}
}

generateIcons();
```

### Make it executable

```bash
chmod +x scripts/generate-icons.js
```

### Add to package.json

```json
{
	"scripts": {
		"icons": "node scripts/generate-icons.js"
	}
}
```

### Run it

```bash
npm run icons
```

---

## 🎯 Different Approaches

### Approach 1: Direct Copy (Simple)

```json
{
	"scripts": {
		"icons": "npx ino-icon-maker generate -i assets/icon.png -o output -p all && npm run icons:copy",
		"icons:copy": "cp -r output/AppIcon.appiconset ios/YourApp/Images.xcassets/ && cp -r output/android-icons/* android/app/src/main/res/"
	}
}
```

**Pros:** Simple, fast  
**Cons:** Manual app name configuration

### Approach 2: Temporary Directory (Clean)

```json
{
	"scripts": {
		"icons": "npm run icons:generate && npm run icons:install && npm run icons:cleanup",
		"icons:generate": "npx ino-icon-maker generate -i assets/icon.png -o temp -p all",
		"icons:install": "cp -r temp/AppIcon.appiconset ios/YourApp/Images.xcassets/ && cp -r temp/android-icons/* android/app/src/main/res/",
		"icons:cleanup": "rm -rf temp"
	}
}
```

**Pros:** Organized, clean  
**Cons:** More steps

### Approach 3: Custom Script (Flexible)

Use the automated script above.

**Pros:** Full control, error handling  
**Cons:** More complex setup

---

## 🌍 Environment-Specific Icons

### Setup for Dev, Staging, Production

```
assets/
├── icon-dev.png      # Dev icon (with badge)
├── icon-staging.png  # Staging icon
└── icon-prod.png     # Production icon
```

### scripts/generate-icons.js

```javascript
#!/usr/bin/env node

import { quickGenerate } from "ino-icon-maker";
import fs from "fs";

const APP_NAME = "YourAppName";
const ENV = process.env.APP_ENV || "dev";

const ICON_MAP = {
	dev: "./assets/icon-dev.png",
	staging: "./assets/icon-staging.png",
	prod: "./assets/icon-prod.png",
};

async function generateIcons() {
	console.log(`🎨 Generating ${ENV} icons...\n`);

	const iconPath = ICON_MAP[ENV];

	if (!fs.existsSync(iconPath)) {
		console.error(`❌ Icon not found: ${iconPath}`);
		process.exit(1);
	}

	await quickGenerate({
		input: iconPath,
		output: "./temp",
		platform: "all",
		force: true,
	});

	// Copy to projects...
	// (same as automated script above)

	console.log(`✅ ${ENV} icons installed!\n`);
}

generateIcons();
```

### package.json

```json
{
	"scripts": {
		"icons:dev": "APP_ENV=dev node scripts/generate-icons.js",
		"icons:staging": "APP_ENV=staging node scripts/generate-icons.js",
		"icons:prod": "APP_ENV=prod node scripts/generate-icons.js"
	}
}
```

### Usage

```bash
# Generate dev icons
npm run icons:dev

# Generate staging icons
npm run icons:staging

# Generate production icons
npm run icons:prod
```

---

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/icons.yml
name: Update Icons

on:
  push:
    paths:
      - "assets/icon*.png"

jobs:
  generate-icons:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm install

      - name: Generate icons
        run: npm run icons

      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add ios/ android/
          git commit -m "chore: update app icons" || echo "No changes"
          git push
```

---

## 🎨 Adaptive Icons (Android)

For Android adaptive icons with background + foreground:

### Step 1: Create adaptive icon XMLs

**android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml:**

```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
```

### Step 2: Generate icons normally

```bash
npm run icons
```

### Step 3: Add background color

**android/app/src/main/res/values/colors.xml:**

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#FFFFFF</color>
</resources>
```

---

## 🐛 Troubleshooting

### Icons not showing on iOS

**Solution:**

```bash
# Clean iOS build
cd ios
pod deintegrate
pod install
cd ..

# Clean build
npx react-native run-ios --reset-cache
```

### Icons not showing on Android

**Solution:**

```bash
# Clean Android build
cd android
./gradlew clean
cd ..

# Rebuild
npx react-native run-android
```

### "Module not found: ino-icon-maker"

**Solution:**

```bash
# Install as dev dependency
npm install -D ino-icon-maker
```

### Wrong app name in script

**Solution:** Update `APP_NAME` in your script to match your actual app name in `ios/` directory.

---

## 📚 Complete Example

Here's a complete working setup:

### Project Structure

```
my-rn-app/
├── assets/
│   └── icon.png
├── scripts/
│   └── generate-icons.js
├── ios/
│   └── MyApp/
│       └── Images.xcassets/
│           └── AppIcon.appiconset/
├── android/
│   └── app/
│       └── src/
│           └── main/
│               └── res/
│                   ├── mipmap-hdpi/
│                   ├── mipmap-mdpi/
│                   └── ...
└── package.json
```

### package.json

```json
{
	"name": "my-rn-app",
	"scripts": {
		"icons": "node scripts/generate-icons.js",
		"android": "react-native run-android",
		"ios": "react-native run-ios"
	},
	"devDependencies": {
		"ino-icon-maker": "^1.0.5"
	}
}
```

### Run

```bash
npm run icons
npm run ios
npm run android
```

---

## ✅ Checklist

After running icon generation:

- [ ] iOS icons in `ios/YourApp/Images.xcassets/AppIcon.appiconset/`
- [ ] Android icons in `android/app/src/main/res/mipmap-*/`
- [ ] Clean iOS build: `cd ios && pod install`
- [ ] Clean Android build: `cd android && ./gradlew clean`
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Test on real devices
- [ ] Verify App Store icon (1024×1024)
- [ ] Verify Play Store icon (512×512)

---

**Need more help?** [Open an issue](https://github.com/narek589/ino-icon-maker/issues)
