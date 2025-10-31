<div align="center">

# 🚀 Ino Icon Maker

**Generate iOS and Android app icons from a single image in seconds**

[![npm version](https://img.shields.io/npm/v/ino-icon-maker.svg)](https://www.npmjs.com/package/ino-icon-maker)
[![npm downloads](https://img.shields.io/npm/dm/ino-icon-maker.svg)](https://www.npmjs.com/package/ino-icon-maker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

[📦 npm](https://www.npmjs.com/package/ino-icon-maker) • [💻 GitHub](https://github.com/narek589/ino-icon-maker) • [📚 Docs](https://github.com/narek589/ino-icon-maker/tree/main/docs) • [🐛 Issues](https://github.com/narek589/ino-icon-maker/issues)

</div>

---

## 📱 Platform Support

<table>
<tr>
<td width="50%" align="center">

### 🍎 iOS / iPadOS / watchOS

<img src="https://raw.githubusercontent.com/narek589/ino-icon-maker/main/assets/ios-preview.png" alt="iOS Icons" width="300" />

**18 Icons Generated**

✓ iPhone (all sizes)  
✓ iPad (all sizes)  
✓ Apple Watch  
✓ App Store (1024×1024)  
✓ `Contents.json` included

</td>
<td width="50%" align="center">

### 🤖 Android

<img src="https://raw.githubusercontent.com/narek589/ino-icon-maker/main/assets/android-preview.png" alt="Android Icons" width="300" />

**13 Icons Generated** (Legacy)  
**50+ Icons Generated** (Adaptive)

✓ All densities (ldpi → xxxhdpi)  
✓ Round icons included  
✓ Play Store (512×512)  
✓ **NEW:** Adaptive Icons (Android 8.0+)  
✓ Foreground + Background layers  
✓ Themed icons support  
✓ Ready for `AndroidManifest.xml`

</td>
</tr>
</table>

---

## ✨ Features

<table>
<tr>
<td>

🎯 **Dual Platform**  
Generate iOS & Android icons simultaneously

</td>
<td>

🖼️ **6 Formats**  
JPEG, PNG, WebP, AVIF, TIFF

</td>
</tr>
<tr>
<td>

⚡ **Lightning Fast**  
Parallel processing (10x faster)

</td>
<td>

📦 **ZIP Export**  
Optional archive creation

</td>
</tr>
<tr>
<td>

🔥 **3 Ways to Use**  
CLI, Library, or HTTP API

</td>
<td>

🎨 **High Quality**  
Lanczos3 resampling

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Standard Icons (Single Image)

```bash
# 1️⃣ NPX (No install required) - Recommended
npx ino-icon-maker generate -i icon.png -p all -z
# Output: ./icons/

# 2️⃣ Global Install
npm install -g ino-icon-maker
ino-icon generate -i icon.png -p all
# Output: ./icons/

# 3️⃣ Project Dependency
npm install -D ino-icon-maker
```

### 🆕 Adaptive Icons (Android 8.0+)

Generate modern Android adaptive icons with separate layers:

```bash
# With separate foreground and background images
ino-icon generate \
  --platform android \
  --foreground ./foreground.png \
  --background ./background.png \
  --monochrome ./monochrome.png \
  --out ./icons \
  --zip

# With solid color background (hex code)
ino-icon generate \
  -p android \
  -fg ./foreground.png \
  -bg '#FF5722' \
  -o ./icons
```

**📖 [Complete Adaptive Icons Guide →](./docs/guides/ADAPTIVE_ICONS.md)**

---

## 📊 Icon Specifications

### iOS Icons

| Size   | Scale    | Usage        | Dimensions       |
| ------ | -------- | ------------ | ---------------- |
| 20pt   | @2x, @3x | Notification | 40×40, 60×60     |
| 29pt   | @2x, @3x | Settings     | 58×58, 87×87     |
| 40pt   | @2x, @3x | Spotlight    | 80×80, 120×120   |
| 60pt   | @2x, @3x | App Icon     | 120×120, 180×180 |
| 76pt   | @2x      | iPad         | 152×152          |
| 83.5pt | @2x      | iPad Pro     | 167×167          |
| 1024pt | @1x      | App Store    | 1024×1024        |

### Android Icons

| Density    | Scale | Dimensions |
| ---------- | ----- | ---------- |
| ldpi       | 0.75x | 36×36      |
| mdpi       | 1.0x  | 48×48      |
| hdpi       | 1.5x  | 72×72      |
| xhdpi      | 2.0x  | 96×96      |
| xxhdpi     | 3.0x  | 144×144    |
| xxxhdpi    | 4.0x  | 192×192    |
| Play Store | -     | 512×512    |

---

## 💻 Usage Examples

### CLI

```bash
# Both platforms (default output: ./icons/)
ino-icon generate -i icon.png -p all

# iOS only
ino-icon generate -i icon.png -p ios

# Android only
ino-icon generate -i icon.png -p android

# Custom output directory + ZIP
ino-icon generate -i icon.png -o ./build/assets -p all -z

# Check version
ino-icon -v
```

### As Library

```javascript
import { quickGenerate } from "ino-icon-maker";

await quickGenerate({
	input: "./icon.png",
	output: "./output",
	platform: "all", // 'ios' | 'android' | 'all'
	zip: true,
	force: false,
});
```

### HTTP API

```bash
# Start server
ino-icon serve --port 3000

# Generate for both platforms (default)
curl -F "file=@icon.png" http://localhost:3000/generate -o all-icons.zip

# iOS only
curl -F "file=@icon.png" \
  "http://localhost:3000/generate?platform=ios" \
  -o ios-icons.zip

# Android only
curl -F "file=@icon.png" \
  "http://localhost:3000/generate?platform=android" \
  -o android-icons.zip

# Both platforms explicitly
curl -F "file=@icon.png" \
  "http://localhost:3000/generate?platform=all" \
  -o all-icons.zip
```

---

## 🎨 Supported Formats

| Format   | Best For     | Transparency | Compression |
| -------- | ------------ | ------------ | ----------- |
| **PNG**  | Icons, UI    | ✅ Yes       | Good        |
| **JPEG** | Photos       | ❌ No        | Excellent   |
| **WebP** | Modern web   | ✅ Yes       | Excellent   |
| **AVIF** | Next-gen     | ✅ Yes       | Superior    |
| **TIFF** | Professional | ✅ Yes       | Lossless    |

**Recommendation:** Use PNG (1024×1024 or larger) for best results

---

## 🛠️ Framework Integration

### React Native

```json
{
	"scripts": {
		"icons": "ino-icon-maker generate -i assets/icon.png -o assets/icons -p all -z"
	}
}
```

### Flutter

```makefile
# Makefile
icons:
	npx ino-icon-maker generate -i assets/icon.png -o temp -p all
	cp -r temp/AppIcon.appiconset ios/Runner/Assets.xcassets/
	cp -r temp/android-icons/* android/app/src/main/res/
	rm -rf temp
```

### CI/CD

```yaml
# GitHub Actions
- name: Generate Icons
  run: npx ino-icon-maker generate -i icon.png -o build/icons -p all -z
```

---

## 📈 Performance

<table>
<tr>
<th>Task</th>
<th>Time</th>
<th>Output</th>
</tr>
<tr>
<td>iOS Icons</td>
<td>~2 seconds</td>
<td>18 files + JSON</td>
</tr>
<tr>
<td>Android Icons</td>
<td>~1.5 seconds</td>
<td>13 files</td>
</tr>
<tr>
<td>Both + ZIP</td>
<td>~4 seconds</td>
<td>31 files + ZIP</td>
</tr>
</table>

---

## 🏗️ Output Structure

### iOS Output

```
AppIcon.appiconset/
├── Icon-App-20x20@2x.png
├── Icon-App-20x20@3x.png
├── Icon-App-29x29@2x.png
├── Icon-App-60x60@3x.png
├── Icon-App-1024x1024@1x.png
└── Contents.json
```

### Android Output

```
android-icons/
├── mipmap-ldpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-mdpi/
├── mipmap-hdpi/
├── mipmap-xhdpi/
├── mipmap-xxhdpi/
├── mipmap-xxxhdpi/
└── playstore/
    └── ic_launcher_playstore.png
```

---

## 📚 Documentation

| Guide                                                  | Description              |
| ------------------------------------------------------ | ------------------------ |
| [📖 Quick Start](./docs/guides/QUICK_START.md)         | Get started in 5 minutes |
| [💡 All Examples](./docs/examples/ALL_EXAMPLES.md)     | 200+ code examples       |
| [📱 React Native](./docs/examples/REACT_NATIVE.md)     | Complete integration     |
| [🎨 Flutter](./docs/examples/FLUTTER.md)               | Complete integration     |
| [🤖 CI/CD](./docs/examples/CI_CD.md)                   | Automation examples      |
| [🏗️ Architecture](./docs/architecture/ARCHITECTURE.md) | Technical design         |

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](./docs/CONTRIBUTING.md)

---

## 📄 License

MIT © [Narek Hambarcumyan](https://github.com/narek589)

---

## ⭐ Support

If this package helps you, please ⭐ star the [repository](https://github.com/narek589/ino-icon-maker)!

---

<div align="center">

**Built with [Sharp](https://sharp.pixelplumbing.com/) for high-performance image processing**

Made with ❤️ by [InoRain](https://github.com/narek589)

</div>
