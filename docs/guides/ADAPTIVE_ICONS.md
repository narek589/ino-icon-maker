# 🎨 Adaptive Icons Guide

Complete guide to Android Adaptive Icons and the new unified layer-based workflow (v1.1.0+).

---

## 📖 Table of Contents

- [What are Adaptive Icons?](#what-are-adaptive-icons)
- [Unified Layer-Based Workflow (v1.1.0)](#unified-layer-based-workflow-v110)
- [CLI Usage](#cli-usage)
- [HTTP API Usage](#http-api-usage)
- [Design Guidelines](#design-guidelines)
- [Best Practices](#best-practices)

---

## 🤔 What are Adaptive Icons?

Introduced in Android 8.0 (API 26), adaptive icons consist of:

1. **Foreground layer**: Your app's logo/icon
2. **Background layer**: Solid color or image
3. **Safe zone**: 20% padding (66dp of 108dp canvas)

**Why use them?**
- System applies different masks (circle, squircle, rounded square)
- Supports visual effects (parallax, pulsing)
- Modern, consistent look across launchers

**Safe Zone Diagram:**
```
┌──────────────────────────┐
│  ← 20% padding →         │ 108dp total canvas
│  ┌──────────────┐        │
│  │              │        │ 72dp safe zone (icon)
│  │   Your Icon  │        │ 36dp bleeding edge
│  │              │        │
│  └──────────────┘        │
│         ↑ 20% padding    │
└──────────────────────────┘
```

---

## 🆕 Unified Layer-Based Workflow (v1.1.0)

**New in v1.1.0:** Both iOS and Android now support foreground/background layers!

### How It Works

**For Android:**
- Generates native adaptive icons (separate foreground/background layers)
- Foreground automatically gets 20% padding (safe zone)
- Background fills entire space

**For iOS:**
- Creates composite image from layers
- Background fills entire space
- Foreground centered with 20% padding (zoomed out)
- Composite used to generate standard iOS icons

**Default Background:** If no background specified, uses `#111111` (dark gray)

---

## 🖥️ CLI Usage

### Android Adaptive Icons

```bash
# Foreground + background color
ino-icon generate -p android \
  -fg ./foreground.png \
  --bg-color "#FF5722"

# Foreground + background image
ino-icon generate -p android \
  -fg ./foreground.png \
  -bg ./background.png

# Foreground only (default #111111)
ino-icon generate -p android -fg ./foreground.png

# With custom output
ino-icon generate -p android \
  -fg ./fg.png \
  -bg ./bg.png \
  -o ./android/app/src/main/res/
```

**Output Structure:**
```
android/
└── app/
    └── src/
        └── main/
            └── res/
                ├── mipmap-ldpi/
                ├── mipmap-mdpi/
                ├── mipmap-hdpi/
                ├── mipmap-xhdpi/
                ├── mipmap-xxhdpi/
                ├── mipmap-xxxhdpi/
                └── mipmap-anydpi-v26/
                    ├── ic_launcher.xml
                    └── ic_launcher_round.xml
```

---

## 🌐 HTTP API Usage

### Start Server
```bash
ino-icon serve -p 3000
```

### Android Only (Adaptive)

```bash
# Foreground only (default #111111)
curl -F "foreground=@fg.png" \
  http://localhost:3000/generate?platform=android -o android.zip

# With background color
curl -F "foreground=@fg.png" \
  "http://localhost:3000/generate?platform=android&backgroundColor=%23FF5722" -o android.zip

# With background image
curl -F "foreground=@fg.png" -F "background=@bg.png" \
  http://localhost:3000/generate?platform=android -o android.zip
```

### Both Platforms (iOS + Android)

```bash
# Foreground only (default #111111)
curl -F "foreground=@fg.png" \
  http://localhost:3000/generate?platform=all -o all-icons.zip

# With background color
curl -F "foreground=@fg.png" \
  "http://localhost:3000/generate?platform=all&backgroundColor=%23FF5722" -o all-icons.zip

# With background image
curl -F "foreground=@fg.png" -F "background=@bg.png" \
  http://localhost:3000/generate?platform=all -o all-icons.zip
```

**What you get:**
- **iOS**: Composite icons (background + padded foreground) in `AppIcon.appiconset/`
- **Android**: Native adaptive icons with separate layers in `mipmap-*/`

### iOS Only (Layer-Based)

```bash
# Foreground only (default #111111)
curl -F "foreground=@fg.png" \
  http://localhost:3000/generate?platform=ios -o ios.zip

# With background
curl -F "foreground=@fg.png" -F "background=@bg.png" \
  http://localhost:3000/generate?platform=ios -o ios.zip
```

---

## 🎨 Design Guidelines

### Image Requirements

**Foreground Layer:**
- Format: PNG with transparency
- Recommended: 1024x1024px minimum
- Content: Keep within safe zone (66% of canvas)
- Best: Simple, recognizable shapes

**Background Layer:**
- Format: PNG or solid color
- Recommended: 1024x1024px if image
- Content: Fills entire space (no transparency needed)
- Best: Solid colors or simple gradients

### Safe Zone Rules

The **safe zone is the center 66%** of the canvas:
- Total canvas: 108dp × 108dp
- Safe zone: 72dp × 72dp (center)
- Visible: At least 66% always shown
- Masked: Outer 36dp may be clipped

**Visual Representation:**
```
┌─────────────────────────────┐
│ ← Unsafe (may be clipped) → │
│  ┌───────────────────────┐  │
│  │                       │  │
│  │    Safe Zone 72dp     │  │
│  │  (Always visible)     │  │
│  │                       │  │
│  └───────────────────────┘  │
│ ← Unsafe (may be clipped) → │
└─────────────────────────────┘
```

### Padding Applied Automatically

**v1.1.0 automatically adds 20% padding** to foreground layers:
- ✅ Your foreground is zoomed out (safe from clipping)
- ✅ Background fills entire space
- ✅ No manual padding needed!

**Before v1.1.0:**
```
You had to manually design with padding
❌ Risk of clipping if logo too large
```

**v1.1.0+ Automatic:**
```
✅ Foreground automatically zoomed out 20%
✅ Safe zone guaranteed
✅ Just design at 100%, we handle the rest!
```

---

## ✅ Best Practices

### 1. **Foreground Design**
- Keep important elements within 66% center
- Use transparency for irregular shapes
- Avoid text or fine details on edges
- Test with different launcher masks

### 2. **Background Design**
- Use solid colors for consistency
- Avoid complex patterns (they may look busy when masked)
- Consider contrast with foreground
- Test light/dark modes

### 3. **Color Recommendations**
- **Brand colors**: Use your primary brand color for background
- **Dark mode friendly**: Consider `#111111` or `#1a1a1a` for dark themes
- **Contrast**: Ensure foreground is visible on background
- **Accessibility**: Check WCAG contrast ratios

### 4. **Testing**
Test your icons on different launchers:
- Google Pixel Launcher (circle)
- Samsung One UI (squircle)
- OnePlus Launcher (rounded square)
- Custom launchers (various shapes)

### 5. **Common Mistakes to Avoid**
- ❌ Placing text/logos too close to edges
- ❌ Using transparency in background (use solid color instead)
- ❌ Making foreground too large (will be clipped)
- ❌ Complex backgrounds (distracting when animated)

---

## 🧪 Testing Your Icons

### Preview Different Masks

Use Android Studio's Image Asset Studio to preview:
1. Open Android Studio
2. File → New → Image Asset
3. Import your generated icons
4. Preview with different masks

### Test on Device

```bash
# Generate icons
curl -F "foreground=@fg.png" -F "background=@bg.png" \
  http://localhost:3000/generate?platform=android -o test.zip

# Unzip to project
unzip -o test.zip -d android/app/src/main/res/

# Build and install
cd android && ./gradlew installDebug
```

### Online Preview Tools
- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html)
- [Figma Android Icon Template](https://www.figma.com/community/file/894667932711550782)

---

## 📚 Examples

### Example 1: Simple Logo + Solid Color
```bash
curl -F "foreground=@logo.png" \
  "http://localhost:3000/generate?platform=android&backgroundColor=%23FF5722" \
  -o icons.zip
```

### Example 2: Logo + Gradient Background
```bash
# Create gradient background first (use design tool)
curl -F "foreground=@logo.png" -F "background=@gradient.png" \
  http://localhost:3000/generate?platform=android -o icons.zip
```

### Example 3: Both Platforms with Layers
```bash
curl -F "foreground=@logo.png" -F "background=@brand-bg.png" \
  http://localhost:3000/generate?platform=all -o all-icons.zip
```

### Example 4: Default Dark Background
```bash
# Uses #111111 automatically
curl -F "foreground=@logo.png" \
  http://localhost:3000/generate?platform=all -o icons.zip
```

---

## 🔧 Programmatic Usage

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
		background: "#FF5722", // or "./background.png"
	},
});
```

---

## 📖 More Resources

- [Android Developer Guide](https://developer.android.com/develop/ui/views/launch/icon_design_adaptive)
- [Material Design Icons](https://m3.material.io/styles/icons/overview)
- [Quick Start Guide](./QUICK_START.md)
- [Complete Examples](../examples/ALL_EXAMPLES.md)

---

**Questions?** Open an issue at [GitHub](https://github.com/narek589/ino-icon-maker/issues)
