# ⚡ Quick Start Guide

Get started with Ino Icon Maker in 2 minutes.

---

## 🚀 Installation Options

### Option 1: NPX (Recommended)

No installation needed! Perfect for one-time use.

```bash
npx ino-icon-maker generate -i icon.png -o ./output -p all -z
```

### Option 2: Global Install

For frequent use with short commands.

```bash
npm install -g ino-icon-maker

# Then use anywhere
ino-icon generate -i icon.png -o ./output -p all
iim generate -i icon.png -o ./output -p all  # Short alias
```

### Option 3: Project Dependency

For team projects and automation.

```bash
npm install -D ino-icon-maker
```

```json
{
  "scripts": {
    "icons": "ino-icon-maker generate -i assets/icon.png -o output -p all"
  }
}
```

---

## 📱 Generate Icons

### All Platforms

```bash
ino-icon generate -i icon.png -o ./output -p all -z
```

### iOS Only

```bash
ino-icon generate -i icon.png -o ./output -p ios
```

**Output:** `./output/AppIcon.appiconset/` (18 icons + Contents.json)

### Android Only

```bash
ino-icon generate -i icon.png -o ./output -p android
```

**Output:** `./output/android-icons/` (13 icons in mipmap folders)

---

## 📖 CLI Commands

```bash
# Generate icons
ino-icon generate -i <input> -o <output> -p <platform>

# Options:
#   -i, --input    Source image (required)
#   -o, --out      Output directory (required)
#   -p, --platform ios|android|all (default: ios)
#   -z, --zip      Create ZIP archive
#   -f, --force    Overwrite existing files

# Show icon information
ino-icon info --platform all

# List supported platforms
ino-icon platforms

# Start HTTP server
ino-icon serve --port 3000

# Show version
ino-icon -v

# Help
ino-icon --help
```

---

## 💻 Use as Library

```javascript
import { quickGenerate } from "ino-icon-maker";

await quickGenerate({
  input: "./icon.png",
  output: "./output",
  platform: "all",
  zip: true,
  force: false
});
```

### Advanced Usage

```javascript
import { 
  generateIconsForPlatform,
  validateImageFile,
  getSupportedPlatforms 
} from "ino-icon-maker";

// Validate image
const isValid = await validateImageFile("./icon.png");

// Get platforms
const platforms = getSupportedPlatforms(); // ['ios', 'android']

// Generate
const result = await generateIconsForPlatform(
  "ios",
  "./icon.png",
  "./output",
  { zip: true }
);

console.log(result.files); // Array of generated files
```

---

## 🌐 HTTP API

```bash
# Start server
ino-icon serve --port 3000

# Generate icons (defaults to both platforms)
curl -F "file=@icon.png" http://localhost:3000/generate -o icons.zip

# Specific platform
curl -F "file=@icon.png" \
  "http://localhost:3000/generate?platform=ios" \
  -o ios-icons.zip
```

---

## 🎨 Best Practices

### Input Image

✅ **DO:**
- Use 1024×1024 or larger
- Square aspect ratio (1:1)
- PNG format with transparency
- High-quality source

❌ **DON'T:**
- Use low-resolution images
- Use non-square images
- Include padding/margins

### File Formats

| Format | When to Use |
|--------|-------------|
| **PNG** | Icons with transparency (recommended) |
| **AVIF** | Next-gen format, best compression |
| **WebP** | Modern web images |
| **JPEG** | Photos without transparency |
| **TIFF** | Professional/print quality |

---

## 📂 Output Examples

### iOS Structure
```
output/
└── AppIcon.appiconset/
    ├── Icon-App-20x20@2x.png
    ├── Icon-App-60x60@3x.png
    ├── Icon-App-1024x1024@1x.png
    └── Contents.json
```

### Android Structure
```
output/
└── android-icons/
    ├── mipmap-ldpi/
    ├── mipmap-mdpi/
    ├── mipmap-hdpi/
    ├── mipmap-xhdpi/
    ├── mipmap-xxhdpi/
    ├── mipmap-xxxhdpi/
    └── playstore/
```

---

## 🔄 What's Next?

- **[React Native Integration](../examples/REACT_NATIVE.md)**
- **[Flutter Integration](../examples/FLUTTER.md)**
- **[CI/CD Automation](../examples/CI_CD.md)**
- **[All Examples](../examples/ALL_EXAMPLES.md)**

---

**Questions?** Check [All Examples](../examples/ALL_EXAMPLES.md) or [open an issue](https://github.com/narek589/ino-icon-maker/issues)
