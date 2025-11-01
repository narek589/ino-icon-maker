# 🎯 Complete Examples - Quick Reference

Quick copy-paste examples for all use cases. Choose your workflow and get started immediately.

## 📖 Table of Contents

- [CLI Examples](#cli-examples)
- [HTTP API Examples](#http-api-examples)
- [NPM Module Examples](#npm-module-examples)
- [React Native](#react-native)
- [Flutter](#flutter)
- [CI/CD](#cicd)

---

## 💻 CLI Examples

### Quick Start

```bash
# Generate icons (quickest way)
npx ino-icon-maker generate -i icon.png

# With auto-install to React Native/Flutter project
npx ino-icon-maker generate -i icon.png --install

# Interactive mode
npx ino-icon-maker interactive
```

### Common Workflows

```bash
# iOS only
ino-icon generate -i icon.png -p ios -o ./ios-icons

# Android only
ino-icon generate -i icon.png -p android -o ./android-icons

# Both platforms with ZIP
ino-icon generate -i icon.png -p all -o ./icons -z

# Android adaptive icons
ino-icon generate \
  -fg foreground.png \
  -bg "#FF5722" \
  -p android \
  -o ./icons

# Auto-install to project
cd /path/to/react-native-or-flutter-project
ino-icon generate -i assets/icon.png --install
```

---

## 🌐 HTTP API Examples

### Start Server

```bash
ino-icon serve -p 3000
```

### curl Examples

```bash
# All platforms
curl -F "file=@icon.png" \
  "http://localhost:3000/generate" \
  -o icons.zip

# iOS only
curl -F "file=@icon.png" \
  "http://localhost:3000/generate?platform=ios" \
  -o ios-icons.zip

# Android only
curl -F "file=@icon.png" \
  "http://localhost:3000/generate?platform=android" \
  -o android-icons.zip

# Android adaptive icons
curl -F "foreground=@fg.png" \
  -F "background=@bg.png" \
  "http://localhost:3000/generate?platform=android" \
  -o adaptive-icons.zip

# With color background
curl -F "foreground=@fg.png" \
  "http://localhost:3000/generate?platform=android&backgroundColor=FF5722" \
  -o adaptive-icons.zip
```

---

## 📦 NPM Module Examples

### Installation

```bash
npm install ino-icon-maker
```

### Quick Generate

```javascript
import { quickGenerate } from "ino-icon-maker";

// All platforms
await quickGenerate({
	input: "./icon.png",
	output: "./icons",
	platform: "all",
});

// iOS only
await quickGenerate({
	input: "./icon.png",
	output: "./icons",
	platform: "ios",
});

// Android adaptive
await quickGenerate({
	output: "./icons",
	platform: "android",
	adaptiveIcon: {
		foreground: "./fg.png",
		background: "#FF5722",
	},
});

// With ZIP
await quickGenerate({
	input: "./icon.png",
	output: "./icons",
	platform: "all",
	zip: true,
});
```

### Lower-Level API

```javascript
import {
	generateIconsForPlatform,
	getSupportedPlatforms,
} from "ino-icon-maker";

// Generate for specific platform
const result = await generateIconsForPlatform("ios", "./icon.png", "./output");

// Get platforms
const platforms = getSupportedPlatforms(); // ['ios', 'android']
```

---

## ⚛️ React Native

### One-Liner

```bash
cd /path/to/react-native-project
npx ino-icon-maker generate -i assets/icon.png --install
```

### package.json Script

```json
{
	"scripts": {
		"icons": "ino-icon generate -i assets/icon.png --install"
	}
}
```

```bash
npm run icons
```

### Manual Installation

```bash
# Generate
npx ino-icon-maker generate -i assets/icon.png -o temp

# Copy iOS
cp -r temp/AppIcon.appiconset ios/YourApp/Images.xcassets/

# Copy Android
cp -r temp/android-icons/mipmap-* android/app/src/main/res/

# Cleanup
rm -rf temp
```

### Programmatic

```javascript
import { quickGenerate } from "ino-icon-maker";
import { cp, rm } from "fs/promises";

// Generate
await quickGenerate({
	input: "./assets/icon.png",
	output: "./temp",
	platform: "all",
});

// Install iOS
await cp(
	"./temp/AppIcon.appiconset",
	"ios/YourApp/Images.xcassets/AppIcon.appiconset",
	{ recursive: true }
);

// Install Android
await cp("./temp/android-icons", "android/app/src/main/res", {
	recursive: true,
	filter: src => src.includes("mipmap-"),
});

// Cleanup
await rm("./temp", { recursive: true });
```

### Environment-Specific

```json
{
	"scripts": {
		"icons:dev": "ino-icon generate -i assets/icon-dev.png --install",
		"icons:staging": "ino-icon generate -i assets/icon-staging.png --install",
		"icons:prod": "ino-icon generate -i assets/icon-prod.png --install"
	}
}
```

---

## 🎯 Flutter

### One-Liner

```bash
cd /path/to/flutter-project
npx ino-icon-maker generate -i assets/icon.png --install
```

### Makefile

```makefile
.PHONY: icons

icons:
	@npx ino-icon-maker generate -i assets/icon.png -o temp -p all
	@cp -r temp/AppIcon.appiconset ios/Runner/Assets.xcassets/
	@cp -r temp/android-icons/* android/app/src/main/res/
	@rm -rf temp
	@echo "✅ Icons installed!"
```

```bash
make icons
```

### Manual Installation

```bash
# Generate
npx ino-icon-maker generate -i assets/icon.png -o temp

# Copy iOS
cp -r temp/AppIcon.appiconset ios/Runner/Assets.xcassets/AppIcon.appiconset

# Copy Android
cp -r temp/android-icons/mipmap-* android/app/src/main/res/

# Cleanup
rm -rf temp
```

### Dart Script

```dart
// tool/generate_icons.dart
import 'dart:io';

Future<void> main() async {
  print('🎨 Generating icons...');

  // Generate
  final result = await Process.run('npx', [
    'ino-icon-maker',
    'generate',
    '-i', 'assets/icon.png',
    '-o', 'temp',
    '-p', 'all'
  ]);

  if (result.exitCode != 0) {
    throw Exception('Generation failed');
  }

  // Install (copy commands similar to bash)
  print('✅ Icons generated!');
}
```

```bash
dart run tool/generate_icons.dart
```

---

## 🔄 CI/CD

### GitHub Actions

```yaml
# .github/workflows/generate-icons.yml
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

      - name: Generate icons
        run: npx ino-icon-maker generate -i assets/icon.png -o icons -z

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: app-icons
          path: icons/
```

### GitLab CI

```yaml
# .gitlab-ci.yml
generate-icons:
  stage: build
  image: node:20
  script:
    - npx ino-icon-maker generate -i assets/icon.png -o icons -z
  artifacts:
    paths:
      - icons/
  only:
    changes:
      - assets/icon.png
```

### With Auto-Install

```yaml
# .github/workflows/icons.yml
name: Update Icons

on:
  push:
    paths:
      - "assets/icon.png"

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4

      - name: Generate and install
        run: |
          npx ino-icon-maker generate -i assets/icon.png --install

      - name: Commit changes
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add ios/ android/
          git diff --quiet && git diff --staged --quiet || \
            (git commit -m "chore: update icons [skip ci]" && git push)
```

### Docker

```dockerfile
FROM node:20-alpine

RUN npm install -g ino-icon-maker

WORKDIR /app
COPY icon.png .

RUN ino-icon generate -i icon.png -o /app/output -p all -z

CMD ["sh"]
```

```bash
docker build -t icon-gen .
docker run --rm -v $(pwd)/output:/app/output icon-gen
```

### Pre-commit Hook

```bash
#!/bin/sh
# .git/hooks/pre-commit

if git diff --cached --name-only | grep -q "assets/icon"; then
  echo "🎨 Icon changed, regenerating..."
  npm run icons
  git add ios/ android/
fi
```

---

## 🎨 Advanced Patterns

### Environment Variables

```bash
# .env
ICON_PATH=./assets/icon.png
OUTPUT_PATH=./icons
PLATFORM=all
```

```javascript
import "dotenv/config";
import { quickGenerate } from "ino-icon-maker";

await quickGenerate({
	input: process.env.ICON_PATH,
	output: process.env.OUTPUT_PATH,
	platform: process.env.PLATFORM || "all",
});
```

### Build Script with Validation

```javascript
import { quickGenerate, validateImageFile } from "ino-icon-maker";
import { existsSync } from "fs";

const iconPath = "./assets/icon.png";

// Validate
if (!existsSync(iconPath)) {
	throw new Error("Icon not found");
}

if (!(await validateImageFile(iconPath))) {
	throw new Error("Invalid image format");
}

// Generate
await quickGenerate({
	input: iconPath,
	output: "./icons",
	platform: "all",
	force: true,
});
```

### Parallel Generation

```javascript
import { generateIconsForPlatform } from "ino-icon-maker";

// Generate iOS and Android in parallel
const [iosResult, androidResult] = await Promise.all([
	generateIconsForPlatform("ios", "./icon.png", "./ios-icons"),
	generateIconsForPlatform("android", "./icon.png", "./android-icons"),
]);

console.log("iOS:", iosResult.files.length, "icons");
console.log("Android:", androidResult.files.length, "icons");
```

### Express Middleware

```javascript
import express from "express";
import multer from "multer";
import { quickGenerate } from "ino-icon-maker";

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/generate", upload.single("icon"), async (req, res) => {
	const result = await quickGenerate({
		input: req.file.path,
		output: "./temp",
		platform: req.query.platform || "all",
		zip: true,
	});

	res.download(result.zipPath || result[0].zipPath);
});

app.listen(3000);
```

---

## 🔍 Quick Lookup

### By Use Case

| Use Case       | Command/Code                                                |
| -------------- | ----------------------------------------------------------- |
| Quick CLI      | `npx ino-icon-maker generate -i icon.png`                   |
| Auto-install   | `ino-icon generate -i icon.png --install`                   |
| iOS only       | `ino-icon generate -i icon.png -p ios`                      |
| Android only   | `ino-icon generate -i icon.png -p android`                  |
| With ZIP       | `ino-icon generate -i icon.png -z`                          |
| Adaptive icons | `ino-icon generate -fg fg.png -bg "#FF5722" -p android`     |
| API server     | `ino-icon serve`                                            |
| Programmatic   | `await quickGenerate({input: 'icon.png', output: 'icons'})` |

### By Platform

| Platform | CLI          | NPM                   |
| -------- | ------------ | --------------------- |
| iOS      | `-p ios`     | `platform: 'ios'`     |
| Android  | `-p android` | `platform: 'android'` |
| Both     | `-p all`     | `platform: 'all'`     |

### Common Options

| Option       | CLI           | NPM                 |
| ------------ | ------------- | ------------------- |
| Input        | `-i icon.png` | `input: 'icon.png'` |
| Output       | `-o ./icons`  | `output: './icons'` |
| Platform     | `-p all`      | `platform: 'all'`   |
| ZIP          | `-z`          | `zip: true`         |
| Force        | `-f`          | `force: true`       |
| Auto-install | `--install`   | N/A (use scripts)   |

---

## 📚 Full Documentation

- [CLI Usage](./CLI_USAGE.md) - Detailed CLI guide
- [API Usage](./API_USAGE.md) - HTTP API reference
- [Programmatic Usage](./PROGRAMMATIC_USAGE.md) - npm module API
- [React Native](./REACT_NATIVE.md) - Complete RN integration
- [Flutter](./FLUTTER.md) - Complete Flutter integration
- [CI/CD](./CI_CD.md) - Pipeline automation

---

**Need help?** [Open an issue](https://github.com/narek589/ino-icon-maker/issues)
