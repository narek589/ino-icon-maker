# 📚 Complete Examples Guide

Comprehensive examples for every use case of Ino Icon Maker.

## 📖 Table of Contents

- [Installation Methods](#installation-methods)
- [Basic Usage](#basic-usage)
- [Adaptive Icons (Android 8.0+)](#adaptive-icons)
- [CLI Examples](#cli-examples)
- [HTTP API Examples](#http-api-examples)
- [Library API Examples](#library-api-examples)

---

## 🔧 Installation Methods

### NPX (No Installation)

```bash
npx ino-icon-maker generate -i icon.png -p all
```

### Global Installation

```bash
npm install -g ino-icon-maker
iim generate -i icon.png -p all
```

### Project Dependency

```bash
npm install -D ino-icon-maker
```

```json
{
	"scripts": {
		"icons": "ino-icon-maker generate -i assets/icon.png -p all"
	}
}
```

---

## 🎯 Basic Usage

### Generate for All Platforms

```bash
# CLI
ino-icon generate -i icon.png

# HTTP
curl -F "file=@icon.png" http://localhost:3000/generate -o icons.zip
```

### iOS Only

```bash
# CLI
ino-icon generate -i icon.png -p ios

# HTTP
curl -F "file=@icon.png" http://localhost:3000/generate?platform=ios -o ios.zip
```

### Android Only

```bash
# CLI
ino-icon generate -i icon.png -p android

# HTTP
curl -F "file=@icon.png" http://localhost:3000/generate?platform=android -o android.zip
```

---

## 🆕 Adaptive Icons

### Unified Layer-Based Workflow (v1.1.0+)

**New in v1.1.0:** Both iOS and Android support foreground/background layers!

```bash
# Only foreground (default #111111 background)
curl -F "foreground=@fg.png" \
  "http://localhost:3000/generate?platform=all" -o icons.zip

# Foreground + background color
curl -F "foreground=@fg.png" \
  "http://localhost:3000/generate?platform=all&backgroundColor=%23FF5722" -o icons.zip

# Foreground + background image
curl -F "foreground=@fg.png" \
  -F "background=@bg.png" \
  "http://localhost:3000/generate?platform=all" -o icons.zip
```

**How it works:**

- **iOS**: Creates composite (background + centered foreground with 20% padding)
- **Android**: Generates adaptive icons with separate layers
- **Default**: Uses #111111 if no background specified
- **Safe Zone**: Foreground automatically gets 20% padding

---

## 🖥️ CLI Examples

### Interactive Mode

```bash
ino-icon generate
# Follow prompts
```

### With Options

```bash
# Custom output directory
ino-icon generate -i icon.png -o custom/path

# Force overwrite
ino-icon generate -i icon.png -f

# Specific platform
ino-icon generate -i icon.png -p ios
```

### Serve HTTP API

```bash
# Default port 3000
ino-icon serve

# Custom port
ino-icon serve -p 8080
```

### Info Commands

```bash
# Show version
ino-icon -v

# List platforms
ino-icon platforms

# Show info
ino-icon info
```

---

## 🌐 HTTP API Examples

### Start Server

```bash
ino-icon serve -p 3000
```

### Basic Generation

```bash
# All platforms
curl -F "file=@icon.png" http://localhost:3000/generate -o icons.zip

# iOS only
curl -F "file=@icon.png" http://localhost:3000/generate?platform=ios -o ios.zip

# Android only
curl -F "file=@icon.png" http://localhost:3000/generate?platform=android -o android.zip
```

### Adaptive Icons

```bash
# Default background (#111111)
curl -F "foreground=@fg.png" \
  http://localhost:3000/generate?platform=android -o android.zip

# Custom background color
curl -F "foreground=@fg.png" \
  "http://localhost:3000/generate?platform=android&backgroundColor=%23FF5722" -o android.zip

# Background image
curl -F "foreground=@fg.png" -F "background=@bg.png" \
  http://localhost:3000/generate?platform=android -o android.zip

# Both platforms with layers
curl -F "foreground=@fg.png" -F "background=@bg.png" \
  http://localhost:3000/generate?platform=all -o all-icons.zip
```

### Query Available Platforms

```bash
curl http://localhost:3000/platforms
```

---

## 📦 Library API Examples

### Quick Generate

```javascript
import { quickGenerate } from "ino-icon-maker";

await quickGenerate({
	input: "./icon.png",
	output: "./output",
	platform: "all",
	force: true,
	zip: true,
});
```

### Advanced Usage

```javascript
import { generate } from "ino-icon-maker";

const results = await generate({
	platforms: ["ios", "android"],
	input: "./icon.png",
	output: "./output",
	force: true,
	zip: true,
});

console.log(results);
// {
//   ios: { count: 19, path: './output/AppIcon.appiconset', zip: './output/AppIcon.zip' },
//   android: { count: 33, path: './output', zip: './output/AndroidIcons.zip' }
// }
```

### Adaptive Icons (Programmatic)

```javascript
import { AndroidGenerator } from "ino-icon-maker/lib/platforms/AndroidGenerator.js";
import { ImageProcessor } from "ino-icon-maker/lib/core/ImageProcessor.js";
import { FileManager } from "ino-icon-maker/lib/core/FileManager.js";

const imageProcessor = new ImageProcessor();
const fileManager = new FileManager();
const generator = new AndroidGenerator(imageProcessor, fileManager);

await generator.generate("./foreground.png", "./output", {
	force: true,
	zip: true,
	adaptiveIcon: {
		foreground: "./foreground.png",
		background: "#FF5722", // or path to background image
	},
});
```

---

## 🔗 Integration Examples

### React Native

```json
{
	"scripts": {
		"generate-icons": "ino-icon-maker generate -i assets/icon.png -o ./output -p all"
	}
}
```

### Flutter

```yaml
# pubspec.yaml
dev_dependencies:
  flutter_launcher_icons: ^0.13.1

flutter_launcher_icons:
  # Use ino-icon-maker to generate, then configure paths
```

### GitHub Actions

```yaml
name: Generate Icons
on: [push]
jobs:
  icons:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npx ino-icon-maker generate -i icon.png -p all
```

---

## 📝 Common Patterns

### npm Scripts

```json
{
	"scripts": {
		"icons": "ino-icon-maker generate -i assets/icon.png -p all",
		"icons:ios": "ino-icon-maker generate -i assets/icon.png -p ios",
		"icons:android": "ino-icon-maker generate -i assets/icon.png -p android",
		"icons:adaptive": "curl -F 'foreground=@fg.png' -F 'background=@bg.png' http://localhost:3000/generate?platform=all -o icons.zip",
		"icons:serve": "ino-icon-maker serve -p 3000"
	}
}
```

### Build Scripts

```bash
#!/bin/bash
# generate-icons.sh

# Generate standard icons
ino-icon generate -i icon.png -o output -p all

# Generate adaptive icons
curl -F "foreground=@fg.png" \
  -F "background=@bg.png" \
  "http://localhost:3000/generate?platform=android" -o adaptive.zip

# Unzip to project
unzip -o adaptive.zip -d android/app/src/main/res/
```

---

## 🆘 Troubleshooting

### Server not responding

```bash
# Check if port is in use
lsof -i :3000

# Use different port
ino-icon serve -p 8080
```

### Permission errors

```bash
# Add force flag
ino-icon generate -i icon.png -f

# Check directory permissions
ls -la output/
```

### Image format issues

```bash
# Supported formats: JPEG, PNG, WebP, AVIF, TIFF
file icon.png  # Verify format

# Convert if needed
convert icon.jpg icon.png
```

---

## 📚 More Examples

- **React Native**: See [REACT_NATIVE.md](./REACT_NATIVE.md)
- **Flutter**: See [FLUTTER.md](./FLUTTER.md)
- **CI/CD**: See [CI_CD.md](./CI_CD.md)
- **Adaptive Icons**: See [ADAPTIVE_ICONS.md](../guides/ADAPTIVE_ICONS.md)
- **Quick Start**: See [QUICK_START.md](../guides/QUICK_START.md)

---

**Need help?** Open an issue at [GitHub](https://github.com/narek589/ino-icon-maker/issues)
