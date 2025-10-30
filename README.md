# 🚀 Ino Icon Maker

[![npm version](https://img.shields.io/npm/v/ino-icon-maker.svg)](https://www.npmjs.com/package/ino-icon-maker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Repository](https://img.shields.io/badge/GitHub-narek589%2Fino--icon--maker-blue?logo=github)](https://github.com/narek589/ino-icon-maker)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![GitHub Stars](https://img.shields.io/github/stars/narek589/ino-icon-maker?style=social)](https://github.com/narek589/ino-icon-maker)
[![npm Downloads](https://img.shields.io/npm/dm/ino-icon-maker.svg)](https://www.npmjs.com/package/ino-icon-maker)

> Generate complete iOS and Android app icon sets from a single source image in seconds

**📝 Note:** Commands `ino-icon` and `iim` only work after global install. Use `npx ino-icon-maker` for instant use without installation.

---

## 🔗 Important Links

| Resource                 | Link                                                      |
| ------------------------ | --------------------------------------------------------- |
| **📦 npm Package**       | https://www.npmjs.com/package/ino-icon-maker              |
| **💻 GitHub Repository** | https://github.com/narek589/ino-icon-maker                |
| **📚 Documentation**     | https://github.com/narek589/ino-icon-maker/tree/main/docs |
| **🐛 Issues**            | https://github.com/narek589/ino-icon-maker/issues         |

---

## 📚 Documentation

📖 **[Complete Documentation](./docs/README.md)** | 🚀 **[Quick Start](./docs/guides/QUICK_START.md)** | 💡 **[All Examples](./docs/examples/ALL_EXAMPLES.md)**

### Quick Links

- 📱 [React Native Integration](./docs/examples/REACT_NATIVE.md)
- 🎨 [Flutter Integration](./docs/examples/FLUTTER.md)
- 🤖 [CI/CD Examples](./docs/examples/CI_CD.md)
- 🏗️ [Architecture](./docs/architecture/ARCHITECTURE.md)

## ✨ Features

- 🎯 **iOS & Android** - Generate all required icons for both platforms
- 🖼️ **Multiple Formats** - JPEG, PNG, WebP support
- ⚡ **Fast** - Parallel processing (10x faster)
- 📦 **ZIP Export** - Optional archive creation
- 🔥 **3 Ways to Use** - CLI, Library, or HTTP API

## 📦 Installation & Usage

### Option 1: NPX (No Install Required) ⭐

```bash
# iOS icons
npx ino-icon-maker generate -i icon.png -o ./output -p ios

# Android icons
npx ino-icon-maker generate -i icon.png -o ./output -p android

# Both platforms + ZIP
npx ino-icon-maker generate -i icon.png -o ./output -p all -z
```

### Option 2: Global Install (For Short Commands)

```bash
# Install once
npm install -g ino-icon-maker

# Then use short commands
ino-icon generate -i icon.png -o ./output -p ios
ino-icon generate -i icon.png -o ./output -p android
ino-icon generate -i icon.png -o ./output -p all -z

# Or even shorter alias
iim generate -i icon.png -o ./output -p all -z
```

### Option 3: As Library in Your Project

```bash
npm install ino-icon-maker
```

```javascript
import { quickGenerate } from "ino-icon-maker";

await quickGenerate({
	input: "./icon.png",
	output: "./output",
	platform: "all", // 'ios', 'android', or 'all'
	zip: true,
});
```

## 📐 What You Get

### iOS (18 icons)

- iPhone: Notification, Settings, Spotlight, App icons
- iPad: App, Spotlight, Settings icons
- Apple Watch: All sizes
- App Store: 1024×1024

### Android (13 icons)

- All densities: ldpi, mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi
- Round icons included

## 💻 CLI Commands (After Global Install)

> **Note:** Install globally first: `npm install -g ino-icon-maker`

```bash
# Generate icons
ino-icon generate [options]
  -i, --input <path>     Source image (required)
  -o, --out <dir>        Output directory (required)
  -p, --platform <type>  Platform: ios, android, all (default: ios)
  -z, --zip              Create ZIP archive
  -f, --force            Overwrite existing files

# Interactive mode
ino-icon generate

# Show icon sizes
ino-icon info [--platform ios|android|all]

# List platforms
ino-icon platforms

# Start API server
ino-icon serve [--port 3000]

# Help
ino-icon --help

# Short alias (same commands)
iim generate -i icon.png -o ./output -p all -z
```

## 📖 Library API

### Simple API

```javascript
import { quickGenerate } from "ino-icon-maker";

await quickGenerate({
	input: "./icon.png",
	output: "./output",
	platform: "all",
	zip: true,
	force: false,
});
```

### Advanced API

```javascript
import {
	generateIconsForPlatform,
	validateImageFile,
	getSupportedPlatforms,
} from "ino-icon-maker";

// Validate image
const isValid = await validateImageFile("./icon.png");

// Get platforms
const platforms = getSupportedPlatforms(); // ['ios', 'android']

// Generate for specific platform
const result = await generateIconsForPlatform("ios", "./icon.png", "./output", {
	zip: true,
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

## 🌐 HTTP API

```bash
# Start server (after global install)
ino-icon serve --port 3000

# Or with NPX
npx ino-icon-maker serve --port 3000

# Generate icons via API
curl -F "file=@icon.png" \
  "http://localhost:3000/generate?platform=ios" \
  -o ios-icons.zip
```

## 🎨 Supported Formats

**Supported Formats:**

- **PNG** - Best for icons (supports transparency)
- **JPEG/JPG** - Universal support
- **WebP** - Modern, efficient

**Recommendations:**

- Use 1024×1024 or larger
- Square aspect ratio (1:1)
- PNG preferred for transparency

## 🛠️ Use in Your Project

### React Native

```json
{
	"scripts": {
		"icons": "npx ino-icon-maker generate -i assets/icon.png -o assets/icons -p all -z"
	}
}
```

### Flutter

```makefile
# Create a Makefile in your Flutter project root
icons:
	npx ino-icon-maker generate -i assets/icon.png -o temp -p all
	cp -r temp/AppIcon.appiconset ios/Runner/Assets.xcassets/
	cp -r temp/android-icons/* android/app/src/main/res/
	rm -rf temp

# Then run: make icons
```

### CI/CD

```yaml
# GitHub Actions
- name: Generate Icons
  run: npx ino-icon-maker generate -i icon.png -o build/icons -p all -z
```

## 🏗️ Output Structure

### iOS

```
output/
└── AppIcon.appiconset/
    ├── icon-20@2x.png (40×40)
    ├── icon-20@3x.png (60×60)
    ├── icon-29@2x.png (58×58)
    ├── icon-60@3x.png (180×180)
    ├── icon-1024@1x.png (1024×1024)
    └── Contents.json
```

### Android

```
output/
├── mipmap-ldpi/ic_launcher.png (36×36)
├── mipmap-mdpi/ic_launcher.png (48×48)
├── mipmap-hdpi/ic_launcher.png (72×72)
├── mipmap-xhdpi/ic_launcher.png (96×96)
├── mipmap-xxhdpi/ic_launcher.png (144×144)
└── mipmap-xxxhdpi/
    ├── ic_launcher.png (192×192)
    └── ic_launcher_round.png (192×192)
```

## ⚡ Why Use This?

- ✅ **Save Time** - 30 minutes manual work → 3 seconds automated
- ✅ **No Mistakes** - Generates all required sizes correctly
- ✅ **Professional Quality** - High-quality image processing
- ✅ **Easy to Use** - Clear output, helpful commands
- ✅ **Fast** - Parallel processing for speed

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines.

## 📄 License

MIT © [Narek Hambarcumyan](https://github.com/narek589)

---

Built with [Sharp](https://sharp.pixelplumbing.com/) for high-performance image processing.

## ⭐ Support

If this package helps you, please ⭐ star the [repository](https://github.com/narek589/ino-icon-maker)!
