<div align="center">

# 🚀 Ino Icon Maker

**Generate iOS & Android app icons from a single image**

[![npm version](https://img.shields.io/npm/v/ino-icon-maker.svg)](https://www.npmjs.com/package/ino-icon-maker)
[![npm downloads](https://img.shields.io/npm/dm/ino-icon-maker.svg)](https://www.npmjs.com/package/ino-icon-maker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

[📦 npm](https://www.npmjs.com/package/ino-icon-maker) • [💻 GitHub](https://github.com/narek589/ino-icon-maker) • [📚 Docs](https://github.com/narek589/ino-icon-maker/tree/main/docs) • [🐛 Issues](https://github.com/narek589/ino-icon-maker/issues)

**One command. All sizes. Both platforms.**

</div>

---

## 📸 What You Get

<table>
<tr>
<td width="50%" align="center">

### iOS (19 icons)

<img src="./docs/assets/ios-example.png" alt="iOS Icons" width="100%"/>

**AppIcon.appiconset/**

- iPhone, iPad, Watch
- App Store (1024×1024)
- Contents.json

</td>
<td width="50%" align="center">

### Android (33 icons)

<img src="./docs/assets/android-example.png" alt="Android Icons" width="100%"/>

**mipmap-\*/ folders**

- Adaptive icons (API 26+)
- Legacy + Round icons
- All densities (ldpi-xxxhdpi)

</td>
</tr>
</table>

---

## ⚡ Quick Start

```bash
# NPX (no install needed)
npx ino-icon-maker generate -i icon.png

# Or install globally
npm install -g ino-icon-maker
ino-icon generate -i icon.png
```

**That's it!** Generates icons for both iOS and Android in `./icons/` directory.

---

## 🔧 Framework Setup

### React Native

```bash
# Auto-install to project
cd my-react-native-app
ino-icon generate -i assets/icon.png --install
```

**Or add to package.json:**

```json
{
	"scripts": {
		"icons": "ino-icon generate -i assets/icon.png --install"
	}
}
```

**Manual installation:**

```bash
ino-icon generate -i icon.png -o temp
cp -r temp/AppIcon.appiconset ios/YourApp/Images.xcassets/
cp -r temp/android-icons/* android/app/src/main/res/
rm -rf temp
```

### Flutter

```bash
# Auto-install to project
cd my-flutter-app
ino-icon generate -i assets/icon.png --install
```

**Manual installation:**

```bash
ino-icon generate -i icon.png -o temp
cp -r temp/AppIcon.appiconset ios/Runner/Assets.xcassets/
cp -r temp/android-icons/* android/app/src/main/res/
rm -rf temp
```

### Node.js / Programmatic

```javascript
import { quickGenerate } from "ino-icon-maker";

// Simple usage
await quickGenerate({
	input: "./icon.png",
	output: "./output",
	zip: true,
});

// With custom sizes
await quickGenerate({
	input: "./icon.png",
	output: "./output",
	customSizes: {
		scale: 1.2,
		android: { excludeSizes: ["ldpi"] },
	},
});
```

### HTTP API / Server

```bash
# Start server
ino-icon serve -p 3000

# Generate icons
curl -F "file=@icon.png" http://localhost:3000/generate -o icons.zip

# With custom sizes
curl -F "file=@icon.png" \
  -F 'customSizes={"scale":1.2}' \
  http://localhost:3000/generate -o icons.zip
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
      - run: npx ino-icon-maker generate -i icon.png --install
      - run: git add . && git commit -m "Update icons" && git push
```

---

## 📊 Supported Sizes

### iOS Icons

| Size      | Scale    | Pixels  | Usage        |
| --------- | -------- | ------- | ------------ |
| 20×20     | @2x, @3x | 40, 60  | Notification |
| 29×29     | @2x, @3x | 58, 87  | Settings     |
| 40×40     | @2x, @3x | 80, 120 | Spotlight    |
| 60×60     | @2x, @3x | 120,180 | iPhone App   |
| 76×76     | @2x      | 152     | iPad App     |
| 83.5×83.5 | @2x      | 167     | iPad Pro     |
| 1024×1024 | @1x      | 1024    | App Store    |

**Total: 19 icons**

### Android Icons

| Density   | Size    | Usage                      |
| --------- | ------- | -------------------------- |
| ldpi      | 36×36   | Low density (120 dpi)      |
| mdpi      | 48×48   | Medium density (160 dpi)   |
| hdpi      | 72×72   | High density (240 dpi)     |
| xhdpi     | 96×96   | Extra-high (320 dpi)       |
| xxhdpi    | 144×144 | Extra-extra-high (480 dpi) |
| xxxhdpi   | 192×192 | Extra³-high (640 dpi)      |
| playstore | 512×512 | Google Play Store          |

**+ Adaptive icons (foreground, background, monochrome)**  
**Total: 33 icons**

---

## ⚙️ Custom Sizes

### Scale All Icons

```bash
ino-icon generate -i icon.png --scale 1.2  # 20% larger
ino-icon generate -i icon.png --scale 0.8  # 20% smaller
```

### Exclude Sizes

```bash
# Android: Skip low-density
ino-icon generate -i icon.png --exclude "ldpi"

# Android: Skip monochrome
ino-icon generate -i icon.png --exclude "monochrome"

# iOS: Skip small sizes
ino-icon generate -i icon.png --exclude "20x20,29x29"
```

### Platform-Specific

```bash
ino-icon generate -i icon.png --ios-scale 1.1 --android-scale 1.3
```

### Custom Config File

**custom-sizes.json:**

```json
{
	"scale": 1.2,
	"ios": {
		"excludeSizes": ["20x20@2x"]
	},
	"android": {
		"excludeSizes": ["ldpi", "monochrome"],
		"addSizes": [
			{
				"density": "xxxxhdpi",
				"size": 256,
				"folder": "mipmap-xxxxhdpi",
				"filename": "ic_launcher.png"
			}
		]
	}
}
```

```bash
ino-icon generate -i icon.png --custom-config custom-sizes.json
```

**[📖 Full Custom Sizes Documentation](./docs/guides/CUSTOM_SIZES.md)**

---

## 📚 More Resources

| Resource                                                    | Description               |
| ----------------------------------------------------------- | ------------------------- |
| [Custom Sizes Guide](./docs/guides/CUSTOM_SIZES.md)         | Scale, add, exclude sizes |
| [Adaptive Icons Guide](./docs/guides/ADAPTIVE_ICONS.md)     | Android adaptive icons    |
| [Icon Padding Config](./docs/guides/ICON_PADDING_CONFIG.md) | Configure zoom/padding    |
| [Complete Examples](./docs/examples/COMPLETE_EXAMPLES.md)   | All usage examples        |
| [Architecture Docs](./docs/architecture/ARCHITECTURE.md)    | Technical design          |
| [Changelog](./docs/CHANGELOG.md)                            | Version history           |

**[📍 Full Documentation](./docs/DOCUMENTATION_MAP.md)**

---

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](./docs/CONTRIBUTING.md)

```bash
git clone https://github.com/narek589/ino-icon-maker.git
cd ino-icon-maker
npm install
npm run dev
```

---

<div align="center">

**Built with [Sharp](https://sharp.pixelplumbing.com/), [Archiver](https://www.archiverjs.com/), [Express](https://expressjs.com/)**

**[⭐ Star this project](https://github.com/narek589/ino-icon-maker)** • [🐛 Issues](https://github.com/narek589/ino-icon-maker/issues) • [💬 Discussions](https://github.com/narek589/ino-icon-maker/discussions)

---

## 🙏 Acknowledgments

Special thanks to **[inorain](https://github.com/inorain)** for inspiration and support in building this tool.

</div>
