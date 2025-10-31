<div align="center">

# 🚀 Ino Icon Maker

**Generate iOS and Android app icons with unified layer-based workflow**

[![npm version](https://img.shields.io/npm/v/ino-icon-maker.svg)](https://www.npmjs.com/package/ino-icon-maker)
[![npm downloads](https://img.shields.io/npm/dm/ino-icon-maker.svg)](https://www.npmjs.com/package/ino-icon-maker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

[📦 npm](https://www.npmjs.com/package/ino-icon-maker) • [💻 GitHub](https://github.com/narek589/ino-icon-maker) • [📚 Docs](https://github.com/narek589/ino-icon-maker/tree/main/docs) • [🐛 Issues](https://github.com/narek589/ino-icon-maker/issues)

</div>

---

## 🆕 What's New in v1.1.0

🎉 **Unified Layer-Based Workflow** - Both iOS and Android now support foreground/background layers!

- ✅ **iOS**: Auto-generates composite (background + centered foreground with 20% padding)
- ✅ **Android**: Native adaptive icons with separate layers
- ✅ **Default Background**: Uses `#111111` if not specified
- ✅ **Auto Padding**: Foreground gets 20% safe zone automatically

```bash
# One command for both platforms with layers!
curl -F "foreground=@fg.png" \
  "http://localhost:3000/generate?platform=all&backgroundColor=%23FF5722" -o icons.zip
```

---

## 📱 Platform Support

| Platform | Output | Count |
|----------|--------|-------|
| **iOS** | `AppIcon.appiconset/` | 19 icons + Contents.json |
| **Android** | `mipmap-*/` folders | 33 icons (adaptive + legacy) |
| **Both** | Combined ZIP | 52 icons total |

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

| Feature | Description |
|---------|-------------|
| 🎯 **Dual Platform** | iOS & Android from single source |
| 🎨 **Adaptive Icons** | Android 8.0+ with foreground/background layers |
| 🖼️ **6 Formats** | JPEG, PNG, WebP, AVIF, TIFF |
| ⚡ **Parallel Processing** | 10x faster generation |
| 📦 **ZIP Export** | Optional archive creation |
| 🔥 **3 Interfaces** | CLI, Library, HTTP API |
| 🌈 **Smart Defaults** | Auto-padding, default backgrounds |
| 📐 **Non-Square Support** | Auto-centers images |

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

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/platforms` | List supported platforms |
| `POST` | `/generate?platform=<ios\|android\|all>` | Generate icons |

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

## 🎯 Common Workflows

### React Native
```json
{
  "scripts": {
    "icons": "ino-icon-maker generate -i assets/icon.png -p all"
  }
}
```

### Flutter
```bash
ino-icon generate -i assets/icon.png -p all
cp -r icons/AppIcon.appiconset ios/Runner/Assets.xcassets/
cp -r icons/android-icons/* android/app/src/main/res/
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

| Document | Description |
|----------|-------------|
| [Quick Start](docs/guides/QUICK_START.md) | Get started in 2 minutes |
| [Adaptive Icons](docs/guides/ADAPTIVE_ICONS.md) | Complete adaptive icons guide |
| [All Examples](docs/examples/ALL_EXAMPLES.md) | Comprehensive examples |
| [React Native](docs/examples/REACT_NATIVE.md) | React Native integration |
| [Flutter](docs/examples/FLUTTER.md) | Flutter integration |
| [CI/CD](docs/examples/CI_CD.md) | Automation examples |
| [Architecture](docs/architecture/ARCHITECTURE.md) | Technical architecture |
| [Changelog](docs/CHANGELOG.md) | Version history |

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
