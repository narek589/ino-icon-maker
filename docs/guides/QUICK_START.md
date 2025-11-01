# ⚡ Quick Start Guide

Get started with Ino Icon Maker in 2 minutes.

---

## 🚀 Installation

### NPX (No Install, Recommended)

```bash
npx ino-icon-maker generate -fg icon.png
```

### Global Install

```bash
npm install -g ino-icon-maker
iim generate -fg icon.png
```

### Project Dependency

```bash
npm install -D ino-icon-maker
```

---

## 📱 Basic Usage

### Generate for All Platforms

```bash
ino-icon generate -fg icon.png
# Output: ./icons/AppIcon.appiconset/ + android-icons/
```

### iOS Only

```bash
ino-icon generate -fg icon.png -p ios
# Output: ./icons/AppIcon.appiconset/ (19 icons + Contents.json)
```

### Android Only

```bash
ino-icon generate -fg icon.png -p android
# Output: ./icons/ (33 icons in mipmap-* folders)
```

---

## 🆕 Unified Layer-Based Workflow (v1.1.0)

**New!** Both iOS and Android support foreground/background layers:

### HTTP API (Recommended for Layers)

```bash
# Start server
ino-icon serve

# Generate with foreground only (default #111111 background)
curl -F "foreground=@fg.png" \
  http://localhost:3000/generate?platform=all -o icons.zip

# With background color
curl -F "foreground=@fg.png" \
  "http://localhost:3000/generate?platform=all&backgroundColor=%23FF5722" -o icons.zip

# With background image
curl -F "foreground=@fg.png" -F "background=@bg.png" \
  http://localhost:3000/generate?platform=all -o icons.zip
```

**Result:**

- **iOS**: Composite image (background + centered foreground with padding)
- **Android**: Adaptive icons with separate layers
- **Auto-padding**: Foreground gets 20% safe zone

### CLI (Android Adaptive Only)

```bash
# Android adaptive with colors
ino-icon generate -p android -fg ./fg.png --bg-color "#FF5722"

# Android adaptive with images
ino-icon generate -p android -fg ./fg.png -bg ./bg.png
```

---

## 🌐 HTTP API Server

### Start Server

```bash
ino-icon serve -p 3000
```

### Test Endpoints

```bash
# Check platforms
curl http://localhost:3000/platforms

# Generate icons
curl -F "file=@icon.png" http://localhost:3000/generate -o icons.zip
```

### Common Patterns

```bash
# iOS only
curl -F "file=@icon.png" \
  "http://localhost:3000/generate?platform=ios" -o ios.zip

# Android only
curl -F "file=@icon.png" \
  "http://localhost:3000/generate?platform=android" -o android.zip

# Both platforms
curl -F "file=@icon.png" \
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
		"icons": "ino-icon-maker generate -fg assets/icon.png -p all"
	}
}
```

### Flutter

```bash
# Generate icons
ino-icon generate -fg assets/icon.png -p all

# Copy to project
cp -r icons/AppIcon.appiconset ios/Runner/Assets.xcassets/
cp -r icons/android-icons/* android/app/src/main/res/
```

### Build Automation

```bash
#!/bin/bash
# Pre-build: Generate icons
ino-icon generate -fg assets/icon.png -p all -f

# Adaptive icons via API
curl -F "foreground=@fg.png" -F "background=@bg.png" \
  http://localhost:3000/generate?platform=android -o adaptive.zip

unzip -o adaptive.zip -d android/app/src/main/res/
```

---

## 💡 Tips

### Interactive Mode

```bash
ino-icon generate
# Follow prompts - great for first-time use
```

### Force Overwrite

```bash
ino-icon generate -fg icon.png -f
```

### Create ZIP

```bash
ino-icon generate -fg icon.png -z
```

### Custom Output

```bash
ino-icon generate -fg icon.png -o custom/path
```

### Show Info

```bash
ino-icon -v          # Version
ino-icon platforms   # List platforms
ino-icon info        # Show info
```

---

## 📚 Next Steps

- **Adaptive Icons**: [ADAPTIVE_ICONS.md](./ADAPTIVE_ICONS.md)
- **React Native**: [REACT_NATIVE.md](../examples/REACT_NATIVE.md)
- **Flutter**: [FLUTTER.md](../examples/FLUTTER.md)
- **CI/CD**: [CI_CD.md](../examples/CI_CD.md)
- **All Examples**: [ALL_EXAMPLES.md](../examples/ALL_EXAMPLES.md)

---

**Need help?** Open an issue at [GitHub](https://github.com/narek589/ino-icon-maker/issues)
