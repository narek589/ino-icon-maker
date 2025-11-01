<div align="center">

# 🚀 Ino Icon Maker

**Professional mobile app icon generator for iOS and Android**

[![npm version](https://img.shields.io/npm/v/ino-icon-maker.svg)](https://www.npmjs.com/package/ino-icon-maker)
[![npm downloads](https://img.shields.io/npm/dm/ino-icon-maker.svg)](https://www.npmjs.com/package/ino-icon-maker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

[📦 npm](https://www.npmjs.com/package/ino-icon-maker) • [💻 GitHub](https://github.com/narek589/ino-icon-maker) • [📚 Docs](https://github.com/narek589/ino-icon-maker/tree/main/docs) • [🐛 Issues](https://github.com/narek589/ino-icon-maker/issues)

</div>

---

## 📖 Overview

**Ino Icon Maker** is a comprehensive solution for generating production-ready mobile app icons for both iOS and Android platforms. Built with performance and developer experience in mind, it automates the entire icon generation workflow—from a single source image to platform-specific icon sets with proper naming, sizing, and metadata.

Whether you're building a React Native app, Flutter project, or native iOS/Android application, Ino Icon Maker eliminates the tedious manual work of creating dozens of icon variations. It supports modern requirements including **adaptive icons** for Android 8.0+, **unified layer-based workflows** for both platforms, and **customizable sizing** for specialized use cases.

### Why Choose Ino Icon Maker?

- **Zero Configuration**: Works out-of-the-box with platform best practices
- **Modern Standards**: Full support for adaptive icons, all densities, and latest guidelines
- **Developer Friendly**: CLI, programmatic API, and HTTP server—choose your interface
- **Production Ready**: Generates all required sizes with proper naming and metadata
- **Extensible**: Built on SOLID principles for easy customization and extension

Perfect for solo developers and teams alike, Ino Icon Maker integrates seamlessly into your development workflow and CI/CD pipelines.

---

## 📸 Output Examples

<div align="center">

### iOS Icon Set

<img src="./docs/assets/ios-example.png" alt="iOS Icon Output" width="700"/>

_Complete iOS icon set with all required sizes and Contents.json_

### Android Icon Set

<img src="./docs/assets/android-example.png" alt="Android Icon Output" width="700"/>

_Android adaptive icons with foreground, background, and legacy variants_

</div>

---

## 🆕 What's New in v1.2.0

🎉 **Custom Icon Sizes** - Full control over icon generation!

- ✅ **Scale Icons**: Make all icons larger or smaller with a single factor
- ✅ **Add Custom Sizes**: Include additional sizes not in defaults
- ✅ **Exclude Sizes**: Skip specific sizes (e.g., low-density or monochrome)
- ✅ **Platform-Specific**: Different customization for iOS and Android
- ✅ **Best Practices**: Default sizes remain unchanged, fully optional

```bash
# Scale all icons 20% larger
ino-icon generate -i icon.png --scale 1.2

# Exclude low-density and monochrome
ino-icon generate -i icon.png -p android --exclude "ldpi,monochrome"
```

[📖 Custom Sizes Guide](./docs/guides/CUSTOM_SIZES.md)

---

## 📱 Platform Support

| Platform    | Output                | Count                        |
| ----------- | --------------------- | ---------------------------- |
| **iOS**     | `AppIcon.appiconset/` | 19 icons + Contents.json     |
| **Android** | `mipmap-*/` folders   | 33 icons (adaptive + legacy) |
| **Both**    | Combined ZIP          | 52 icons total               |

**iOS Output:**

- iPhone, iPad, Apple Watch sizes
- App Store icon (1024×1024)
- `Contents.json` included

**Android Output:**

- All densities (ldpi → xxxhdpi)
- Adaptive icons (API 26+)
- Legacy icons (API 25-)
- Round icons + Play Store

---

## ✨ Features

| Feature                     | Description                                    |
| --------------------------- | ---------------------------------------------- |
| 🎯 **Dual Platform**        | iOS & Android from single source               |
| 🎨 **Adaptive Icons**       | Android 8.0+ with foreground/background layers |
| 🖼️ **6 Formats**            | JPEG, PNG, WebP, AVIF, TIFF                    |
| ⚡ **Parallel Processing**  | 10x faster generation                          |
| 📦 **ZIP Export**           | Optional archive creation                      |
| 🔥 **3 Interfaces**         | CLI, Library, HTTP API                         |
| 🌈 **Smart Defaults**       | Auto-padding, default backgrounds              |
| ⚙️ **Configurable Padding** | Adjust iOS/Android zoom out percentage         |
| 📐 **Non-Square Support**   | Auto-centers images                            |

---

## 🚀 Quick Start

### NPX (No Install)

```bash
npx ino-icon-maker generate -i icon.png
```

### Global Install

```bash
npm install -g ino-icon-maker
iim generate -i icon.png
```

### Project Dependency

```bash
npm install -D ino-icon-maker
```

---

## ⚡ Auto-Install (NEW!)

Automatically detect and install icons to your React Native or Flutter project:

```bash
# From your project root
npx ino-icon-maker generate -i assets/icon.png --install
```

**What it does:**

- ✅ Detects project type (React Native or Flutter)
- ✅ Generates icons for both platforms
- ✅ Installs to correct locations automatically
- ✅ Shows installation paths

**Supported Projects:**

- React Native (detects `package.json` with `react-native` + ios/android dirs)
- Flutter (detects `pubspec.yaml` + ios/android dirs)

---

## 📱 Basic Usage

### Generate for All Platforms

```bash
ino-icon generate -i icon.png
# Output: ./icons/AppIcon.appiconset/ + android-icons/
```

### iOS Only

```bash
ino-icon generate -i icon.png -p ios
```

### Android Only

```bash
ino-icon generate -i icon.png -p android
```

---

## 🎨 Unified Layer-Based Workflow

### HTTP API (Recommended)

**Start Server:**

```bash
ino-icon serve
```

**Generate with Layers:**

```bash
# Foreground only (default #111111 background)
curl -F "foreground=@fg.png" \
  http://localhost:3000/generate?platform=all -o icons.zip

# With background color
curl -F "foreground=@fg.png" \
  "http://localhost:3000/generate?platform=all&backgroundColor=%23FF5722" -o icons.zip

# With background image
curl -F "foreground=@fg.png" -F "background=@bg.png" \
  http://localhost:3000/generate?platform=all -o icons.zip
```

**What You Get:**

- **iOS**: Composite icons (background + padded foreground)
- **Android**: Adaptive icons with separate layers
- **Auto-padding**: Foreground zoomed out 20% (safe zone)
- **Smart defaults**: `#111111` background if not specified

### CLI (Android Adaptive)

```bash
# With colors
ino-icon generate -p android -fg ./fg.png --bg-color "#FF5722"

# With images
ino-icon generate -p android -fg ./fg.png -bg ./bg.png
```

---

## 🌐 HTTP API

### Endpoints

| Method | Endpoint                                 | Description              |
| ------ | ---------------------------------------- | ------------------------ |
| `GET`  | `/platforms`                             | List supported platforms |
| `POST` | `/generate?platform=<ios\|android\|all>` | Generate icons           |

### Examples

```bash
# Start server
ino-icon serve -p 3000

# Generate for all platforms
curl -F "file=@icon.png" http://localhost:3000/generate -o icons.zip

# iOS only
curl -F "file=@icon.png" \
  "http://localhost:3000/generate?platform=ios" -o ios.zip

# Android only
curl -F "file=@icon.png" \
  "http://localhost:3000/generate?platform=android" -o android.zip

# Adaptive icons (both platforms)
curl -F "foreground=@fg.png" -F "background=@bg.png" \
  "http://localhost:3000/generate?platform=all" -o all-icons.zip
```

---

## 📦 Library Usage

### Quick Generate

```javascript
import { quickGenerate } from "ino-icon-maker";

await quickGenerate({
	input: "./icon.png",
	platform: "all",
	force: true,
	zip: true,
});
```

### Advanced

```javascript
import { generate } from "ino-icon-maker";

const results = await generate({
	platforms: ["ios", "android"],
	input: "./icon.png",
	output: "./output",
	force: true,
});

console.log(results);
// { ios: { count: 19, ... }, android: { count: 33, ... } }
```

---

## ⚙️ Custom Icon Sizes (Advanced)

Customize icon sizes with scale factors, add custom sizes, or exclude specific sizes:

### CLI

```bash
# Scale all icons by 20%
ino-icon generate -i icon.png --scale 1.2

# Exclude specific sizes
ino-icon generate -i icon.png -p android --exclude "ldpi,monochrome"

# Use custom config file
ino-icon generate -i icon.png --custom-config custom-sizes.json
```

### Programmatic

```javascript
import { quickGenerate } from "ino-icon-maker";

await quickGenerate({
	input: "./icon.png",
	output: "./output",
	customSizes: {
		scale: 1.2, // Make all icons 20% larger
		android: {
			excludeSizes: ["ldpi", "monochrome"], // Skip low-density & monochrome
		},
	},
});
```

### HTTP API

```bash
curl -F "file=@icon.png" \
  -F 'customSizes={"scale":1.2,"android":{"excludeSizes":["ldpi","monochrome"]}}' \
  http://localhost:3000/generate -o icons.zip
```

**📖 See [Custom Sizes Guide](./docs/guides/CUSTOM_SIZES.md) for complete documentation.**

---

## 🎯 Common Workflows

### React Native

```json
{
	"scripts": {
		"icons": "ino-icon-maker generate -i assets/icon.png --install"
	}
}
```

Or manual installation:

```bash
ino-icon generate -i assets/icon.png -o temp
cp -r temp/AppIcon.appiconset ios/YourApp/Images.xcassets/
cp -r temp/android-icons/* android/app/src/main/res/
rm -rf temp
```

### Flutter

```bash
# Auto-install
ino-icon generate -i assets/icon.png --install

# Or manual
ino-icon generate -i assets/icon.png -o temp
cp -r temp/AppIcon.appiconset ios/Runner/Assets.xcassets/
cp -r temp/android-icons/* android/app/src/main/res/
rm -rf temp
```

### CI/CD (GitHub Actions)

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

## 📐 Design Guidelines

### Standard Icons

- **Format**: PNG, JPEG, WebP, AVIF, or TIFF
- **Recommended**: 1024×1024px minimum
- **Non-square**: Auto-centered on transparent canvas

### Adaptive Icons (Android 8.0+)

**Foreground:**

- PNG with transparency
- 1024×1024px recommended
- Keep content in center 66% (safe zone)
- Auto-padding applied (20%)

**Background:**

- PNG or solid color hex
- 1024×1024px if image
- Fills entire space (no padding)
- Default: `#111111` if not specified

**Visual:**

```
┌──────────────────────────┐
│  ← 20% padding →         │ 108dp total
│  ┌──────────────┐        │
│  │   Your Icon  │        │ 72dp safe zone
│  └──────────────┘        │
└──────────────────────────┘
```

---

## 💡 CLI Options

```bash
ino-icon generate [options]

Options:
  -i, --input <path>           Input image path
  -o, --output <path>          Output directory (default: ./icons)
  -p, --platform <platform>    Platform: ios, android, all (default: all)
  -f, --force                  Force overwrite existing files
  -z, --zip                    Create ZIP archive
  -fg, --foreground <path>     Foreground layer (adaptive icons)
  -bg, --background <path>     Background layer (adaptive icons)
  --bg-color <hex>             Background color (adaptive icons)
  -v, --version                Show version
  -h, --help                   Show help

Serve HTTP API:
  ino-icon serve [options]
  -p, --port <number>          Port number (default: 3000)

Info:
  ino-icon platforms           List supported platforms
  ino-icon info                Show detailed info
```

---

## 📚 Documentation

| Document                                                  | Description                   |
| --------------------------------------------------------- | ----------------------------- |
| [Quick Start](docs/guides/QUICK_START.md)                 | Get started in 2 minutes      |
| [Complete Examples](docs/examples/COMPLETE_EXAMPLES.md)   | Quick reference (NEW!)        |
| [CLI Usage](docs/examples/CLI_USAGE.md)                   | Complete CLI reference (NEW!) |
| [API Usage](docs/examples/API_USAGE.md)                   | HTTP API with curl (NEW!)     |
| [Programmatic Usage](docs/examples/PROGRAMMATIC_USAGE.md) | npm module API (NEW!)         |
| [All Examples](docs/examples/ALL_EXAMPLES.md)             | Legacy examples               |
| [React Native](docs/examples/REACT_NATIVE.md)             | React Native integration      |
| [Flutter](docs/examples/FLUTTER.md)                       | Flutter integration           |
| [CI/CD](docs/examples/CI_CD.md)                           | Automation examples           |
| [Adaptive Icons](docs/guides/ADAPTIVE_ICONS.md)           | Adaptive icons guide          |
| [Icon Padding Config](docs/guides/ICON_PADDING_CONFIG.md) | Configure zoom/padding (NEW!) |
| [Testing Guide](docs/guides/TESTING.md)                   | Testing guide (NEW!)          |
| [Architecture](docs/architecture/ARCHITECTURE.md)         | Technical architecture        |
| [Documentation Map](docs/DOCUMENTATION_MAP.md)            | Complete docs index (NEW!)    |
| [Changelog](docs/CHANGELOG.md)                            | Version history               |

---

## 🛠️ Requirements

- **Node.js**: ≥18.0.0
- **npm**: ≥8.0.0
- **Dependencies**: `sharp`, `archiver`, `express`, `multer`

---

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

### Development

```bash
git clone https://github.com/narek589/ino-icon-maker.git
cd ino-icon-maker
npm install
npm run dev
```

---

## 📄 License

MIT © [Narek Hambarcumyan](https://github.com/narek589)

See [LICENSE](LICENSE) for details.

---

## 💬 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/narek589/ino-icon-maker/issues)
- 📧 **Email**: n.hambarcumyan@inorain.com
- 💬 **Discussions**: [GitHub Discussions](https://github.com/narek589/ino-icon-maker/discussions)

---

## 🙏 Acknowledgments

Built with:

- [Sharp](https://sharp.pixelplumbing.com/) - High-performance image processing
- [Archiver](https://www.archiverjs.com/) - ZIP creation
- [Express](https://expressjs.com/) - HTTP API
- [Commander](https://github.com/tj/commander.js/) - CLI framework

---

<div align="center">

**[⭐ Star this project](https://github.com/narek589/ino-icon-maker)** if you find it useful!

Made with ❤️ by [Narek Hambarcumyan](https://github.com/narek589)

</div>
