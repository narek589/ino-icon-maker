# 📚 Complete Examples - All Variants

This document provides comprehensive examples for every possible use case of Ino Icon Maker.

## 📖 Table of Contents

- [Installation Methods](#installation-methods)
- [Basic Usage](#basic-usage)
- [CLI Examples](#cli-examples)
- [Library API Examples](#library-api-examples)
- [HTTP API Examples](#http-api-examples)
- [Platform-Specific Examples](#platform-specific-examples)
- [Advanced Examples](#advanced-examples)
- [Integration Examples](#integration-examples)

---

## 🔧 Installation Methods

### Method 1: NPX (No Installation)

```bash
# Use directly without installing
npx ino-icon-maker generate -i icon.png -o ./output -p ios
```

✅ **Pros**: No installation, always latest version  
❌ **Cons**: Slower first run, downloads each time

### Method 2: Global Installation

```bash
# Install once
npm install -g ino-icon-maker

# Use anywhere
ino-icon generate -i icon.png -o ./output -p ios

# Or short alias
iim generate -i icon.png -o ./output -p ios
```

✅ **Pros**: Fast, convenient commands  
❌ **Cons**: Needs global install, version management

### Method 3: Project Dependency

```bash
# Install in project
npm install -D ino-icon-maker

# Add to package.json scripts
{
  "scripts": {
    "icons": "ino-icon-maker generate -i assets/icon.png -o output -p all"
  }
}

# Run via npm
npm run icons
```

✅ **Pros**: Version locked, team consistency  
❌ **Cons**: Per-project installation

### Method 4: Library Import

```bash
# Install as dev dependency
npm install -D ino-icon-maker
```

```javascript
// Import and use programmatically
import { quickGenerate } from "ino-icon-maker";

await quickGenerate({
	input: "./icon.png",
	output: "./output",
	platform: "all",
});
```

✅ **Pros**: Programmatic control, flexible  
❌ **Cons**: Requires code integration

---

## 🎯 Basic Usage

### Generate iOS Icons

```bash
# NPX
npx ino-icon-maker generate -i icon.png -o ./output -p ios

# Global
ino-icon generate -i icon.png -o ./output -p ios

# Library
import { quickGenerate } from "ino-icon-maker";
await quickGenerate({
	input: "./icon.png",
	output: "./output",
	platform: "ios",
});
```

**Output**: `./output/AppIcon.appiconset/` with 18 icons + Contents.json

### Generate Android Icons

```bash
# NPX
npx ino-icon-maker generate -i icon.png -o ./output -p android

# Global
ino-icon generate -i icon.png -o ./output -p android

# Library
await quickGenerate({
	input: "./icon.png",
	output: "./output",
	platform: "android",
});
```

**Output**: `./output/mipmap-*/` folders with 13 icons

### Generate Both Platforms

```bash
# NPX
npx ino-icon-maker generate -i icon.png -o ./output -p all

# Global
ino-icon generate -i icon.png -o ./output -p all

# Library
await quickGenerate({
	input: "./icon.png",
	output: "./output",
	platform: "all",
});
```

**Output**: Both iOS and Android icons

### Generate with ZIP

```bash
# NPX
npx ino-icon-maker generate -i icon.png -o ./output -p all -z

# Global
ino-icon generate -i icon.png -o ./output -p all -z

# Library
await quickGenerate({
	input: "./icon.png",
	output: "./output",
	platform: "all",
	zip: true,
});
```

**Output**: Icons + ZIP archives

---

## 💻 CLI Examples

### Interactive Mode

```bash
# Start interactive wizard
ino-icon generate

# Follow prompts:
# 1. Select input image
# 2. Choose output directory
# 3. Select platform (ios/android/all)
# 4. Enable ZIP? (yes/no)
```

### Show Icon Information

```bash
# Show all platform info
ino-icon info

# Show iOS only
ino-icon info --platform ios

# Show Android only
ino-icon info --platform android
```

### List Supported Platforms

```bash
ino-icon platforms
# Output: ios, android
```

### Force Overwrite

```bash
# Overwrite existing files
ino-icon generate -i icon.png -o ./output -p all -f

# Or
ino-icon generate -i icon.png -o ./output -p all --force
```

### Custom Output Names

```bash
# iOS - output to specific directory
ino-icon generate -i icon.png -o ./ios/Assets.xcassets -p ios

# Android - output to res directory
ino-icon generate -i icon.png -o ./android/app/src/main/res -p android
```

### Multiple Source Formats

```bash
# PNG source
ino-icon generate -i icon.png -o ./output -p all

# JPEG source
ino-icon generate -i icon.jpg -o ./output -p all

# WebP source
ino-icon generate -i icon.webp -o ./output -p all
```

### Help Commands

```bash
# General help
ino-icon --help

# Command-specific help
ino-icon generate --help
ino-icon info --help
ino-icon serve --help

# Version
ino-icon --version
```

---

## 📚 Library API Examples

### Simple API - Quick Generate

```javascript
import { quickGenerate } from "ino-icon-maker";

// Minimal usage
await quickGenerate({
	input: "./icon.png",
	output: "./output",
	platform: "ios",
});

// With all options
await quickGenerate({
	input: "./assets/icon.png",
	output: "./output",
	platform: "all", // 'ios', 'android', or 'all'
	zip: true, // Create ZIP archives
	force: true, // Overwrite existing files
});
```

### Advanced API - Platform-Specific

```javascript
import {
	generateIconsForPlatform,
	validateImageFile,
	getSupportedPlatforms,
} from "ino-icon-maker";

// Validate image first
const isValid = await validateImageFile("./icon.png");
if (!isValid) {
	console.error("Invalid image file");
	process.exit(1);
}

// Get supported platforms
const platforms = getSupportedPlatforms();
console.log("Supported:", platforms); // ['ios', 'android']

// Generate for specific platform
const result = await generateIconsForPlatform("ios", "./icon.png", "./output", {
	zip: true,
	force: false,
});

console.log(result);
// {
//   success: true,
//   platform: 'ios',
//   outputDir: './output/AppIcon.appiconset',
//   files: [...],
//   zipPath: './output/ios-icons.zip'
// }
```

### Error Handling

```javascript
import { quickGenerate } from "ino-icon-maker";

try {
	const result = await quickGenerate({
		input: "./icon.png",
		output: "./output",
		platform: "all",
	});

	if (result.success) {
		console.log("✅ Icons generated successfully!");
		console.log(`Files: ${result.files.length}`);
	}
} catch (error) {
	console.error("❌ Error:", error.message);
	process.exit(1);
}
```

### Progress Tracking

```javascript
import { generateIconsForPlatform } from "ino-icon-maker";

console.log("Starting icon generation...");

const result = await generateIconsForPlatform("ios", "./icon.png", "./output");

console.log(`✓ Generated ${result.files.length} icons`);
console.log(`✓ Output: ${result.outputDir}`);

if (result.zipPath) {
	console.log(`✓ ZIP: ${result.zipPath}`);
}
```

### Batch Processing

```javascript
import { quickGenerate } from "ino-icon-maker";
import { promises as fs } from "fs";

const icons = [
	{ input: "./icon1.png", output: "./output/app1" },
	{ input: "./icon2.png", output: "./output/app2" },
	{ input: "./icon3.png", output: "./output/app3" },
];

// Process sequentially
for (const icon of icons) {
	await quickGenerate({
		input: icon.input,
		output: icon.output,
		platform: "all",
	});
	console.log(`✓ Processed ${icon.input}`);
}

// Or process in parallel
await Promise.all(
	icons.map(icon =>
		quickGenerate({
			input: icon.input,
			output: icon.output,
			platform: "all",
		})
	)
);
console.log("✓ All icons processed");
```

### Dynamic Configuration

```javascript
import { quickGenerate } from "ino-icon-maker";

const config = {
	development: {
		input: "./assets/icon-dev.png",
		output: "./output/dev",
	},
	staging: {
		input: "./assets/icon-staging.png",
		output: "./output/staging",
	},
	production: {
		input: "./assets/icon-prod.png",
		output: "./output/prod",
	},
};

const env = process.env.NODE_ENV || "development";

await quickGenerate({
	input: config[env].input,
	output: config[env].output,
	platform: "all",
	zip: env === "production",
});
```

---

## 🌐 HTTP API Examples

### Start Server

```bash
# Default port (3000)
ino-icon serve

# Custom port
ino-icon serve --port 8080

# Or with NPX
npx ino-icon-maker serve --port 3000
```

### Generate Icons via HTTP

#### Using cURL

```bash
# Generate iOS icons
curl -F "file=@icon.png" \
  "http://localhost:3000/generate?platform=ios" \
  -o ios-icons.zip

# Generate Android icons
curl -F "file=@icon.png" \
  "http://localhost:3000/generate?platform=android" \
  -o android-icons.zip

# Generate both platforms
curl -F "file=@icon.png" \
  "http://localhost:3000/generate?platform=all" \
  -o all-icons.zip
```

#### Using JavaScript/Fetch

```javascript
const formData = new FormData();
formData.append("file", fileInput.files[0]);

const response = await fetch("http://localhost:3000/generate?platform=all", {
	method: "POST",
	body: formData,
});

const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "icons.zip";
a.click();
```

#### Using Axios

```javascript
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const form = new FormData();
form.append("file", fs.createReadStream("./icon.png"));

const response = await axios.post(
	"http://localhost:3000/generate?platform=ios",
	form,
	{
		headers: form.getHeaders(),
		responseType: "stream",
	}
);

response.data.pipe(fs.createWriteStream("ios-icons.zip"));
```

#### Health Check

```bash
curl http://localhost:3000/health
# Response: {"status": "ok"}
```

---

## 🎨 Platform-Specific Examples

### iOS Development

#### Standard iOS App

```bash
# Generate to Xcode project
ino-icon generate \
  -i assets/icon.png \
  -o ios/YourApp/Assets.xcassets \
  -p ios
```

**Project structure:**

```
ios/
└── YourApp/
    └── Assets.xcassets/
        └── AppIcon.appiconset/
            ├── Contents.json
            ├── Icon-App-20x20@2x.png
            └── ... (18 total icons)
```

#### React Native iOS

```bash
ino-icon generate \
  -i assets/icon.png \
  -o ios/YourApp/Images.xcassets \
  -p ios
```

#### Flutter iOS

```bash
ino-icon generate \
  -i assets/icon.png \
  -o ios/Runner/Assets.xcassets \
  -p ios
```

### Android Development

#### Standard Android App

```bash
# Generate to res directory
ino-icon generate \
  -i assets/icon.png \
  -o android/app/src/main/res \
  -p android
```

**Project structure:**

```
android/app/src/main/res/
├── mipmap-ldpi/
│   ├── ic_launcher.png (36x36)
│   └── ic_launcher_round.png
├── mipmap-mdpi/
│   ├── ic_launcher.png (48x48)
│   └── ic_launcher_round.png
├── mipmap-hdpi/
│   ├── ic_launcher.png (72x72)
│   └── ic_launcher_round.png
├── mipmap-xhdpi/
│   ├── ic_launcher.png (96x96)
│   └── ic_launcher_round.png
├── mipmap-xxhdpi/
│   ├── ic_launcher.png (144x144)
│   └── ic_launcher_round.png
└── mipmap-xxxhdpi/
    ├── ic_launcher.png (192x192)
    └── ic_launcher_round.png
```

#### React Native Android

```bash
ino-icon generate \
  -i assets/icon.png \
  -o android/app/src/main/res \
  -p android
```

#### Flutter Android

```bash
ino-icon generate \
  -i assets/icon.png \
  -o android/app/src/main/res \
  -p android
```

---

## 🚀 Advanced Examples

### Custom Build Script

```javascript
// build-icons.js
import { quickGenerate } from "ino-icon-maker";
import path from "path";

async function buildIcons() {
	const environments = ["dev", "staging", "prod"];

	for (const env of environments) {
		console.log(`\n🎨 Building ${env} icons...`);

		await quickGenerate({
			input: `./assets/icon-${env}.png`,
			output: `./output/${env}`,
			platform: "all",
			zip: true,
			force: true,
		});

		console.log(`✅ ${env} icons complete`);
	}
}

buildIcons().catch(console.error);
```

```json
// package.json
{
	"scripts": {
		"build:icons": "node build-icons.js"
	}
}
```

### Monorepo Setup

```javascript
// scripts/generate-icons.js
import { quickGenerate } from "ino-icon-maker";

const apps = [
	{
		name: "mobile-app",
		icon: "./assets/mobile-icon.png",
		output: "./apps/mobile",
	},
	{
		name: "tablet-app",
		icon: "./assets/tablet-icon.png",
		output: "./apps/tablet",
	},
];

for (const app of apps) {
	console.log(`Generating icons for ${app.name}...`);

	await quickGenerate({
		input: app.icon,
		output: `${app.output}/assets/icons`,
		platform: "all",
		zip: false,
	});
}
```

### Pre-commit Hook

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Regenerate icons if source changed
if git diff --cached --name-only | grep "assets/icon.png"; then
  echo "🎨 Regenerating app icons..."
  npm run icons
  git add ios/ android/
fi
```

### Docker Integration

```dockerfile
# Dockerfile
FROM node:18-alpine

RUN npm install -g ino-icon-maker

WORKDIR /app

COPY icon.png .

CMD ["ino-icon", "generate", "-i", "icon.png", "-o", "/app/output", "-p", "all", "-z"]
```

```bash
# Build and run
docker build -t icon-generator .
docker run -v $(pwd)/output:/app/output icon-generator
```

---

## 🔗 Integration Examples

### React Native

```json
// package.json
{
	"scripts": {
		"icons": "ino-icon-maker generate -i assets/icon.png -o temp && npm run icons:ios && npm run icons:android",
		"icons:ios": "cp -r temp/AppIcon.appiconset ios/YourApp/Images.xcassets/",
		"icons:android": "cp -r temp/android-icons/* android/app/src/main/res/",
		"posticons": "rm -rf temp"
	}
}
```

### Flutter

```makefile
# Create Makefile in Flutter project root
icons:
	npx ino-icon-maker generate -i assets/icon.png -o temp -p all
	cp -r temp/AppIcon.appiconset ios/Runner/Assets.xcassets/
	cp -r temp/android-icons/* android/app/src/main/res/
	rm -rf temp

# Then run: make icons
```

Or use direct command:

```bash
npx ino-icon-maker generate -i assets/icon.png -o temp -p all && \
cp -r temp/AppIcon.appiconset ios/Runner/Assets.xcassets/ && \
cp -r temp/android-icons/* android/app/src/main/res/ && \
rm -rf temp
```

### GitHub Actions

```yaml
# .github/workflows/icons.yml
name: Generate Icons

on:
  push:
    paths:
      - "assets/icon.png"

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Generate Icons
        run: npx ino-icon-maker generate -i assets/icon.png -o output -p all -z

      - name: Upload Artifacts
        uses: actions/upload-artifact@v3
        with:
          name: app-icons
          path: output/
```

### GitLab CI

```yaml
# .gitlab-ci.yml
generate-icons:
  image: node:18
  script:
    - npx ino-icon-maker generate -i assets/icon.png -o output -p all -z
  artifacts:
    paths:
      - output/
  only:
    changes:
      - assets/icon.png
```

---

## 📝 Summary

This guide covered:

✅ All installation methods  
✅ Basic to advanced CLI usage  
✅ Library API with error handling  
✅ HTTP API integration  
✅ Platform-specific configurations  
✅ CI/CD automation  
✅ Framework integrations

For more examples, see:

- [React Native Guide](./REACT_NATIVE.md)
- [Flutter Guide](./FLUTTER.md)
- [CI/CD Guide](./CI_CD.md)

---

**Need help?** [Open an issue](https://github.com/narek589/ino-icon-maker/issues)
