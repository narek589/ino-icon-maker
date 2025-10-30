# ⚡ Quick Start Guide

Get started with Ino Icon Maker in 5 minutes!

## 🎯 Choose Your Method

### Option 1: NPX (Recommended for First-Time Users)

No installation required! Run directly:

```bash
npx ino-icon-maker generate -i icon.png -o ./output -p all -z
```

**What this does:**

- Reads `icon.png` from current directory
- Generates iOS and Android icons
- Saves to `./output` directory
- Creates ZIP archives

### Option 2: Global Install (For Regular Use)

Install once, use everywhere:

```bash
# Install globally
npm install -g ino-icon-maker

# Use short commands
ino-icon generate -i icon.png -o ./output -p all

# Or even shorter
iim generate -i icon.png -o ./output -p all
```

### Option 3: Project Dependency (For Teams)

Add to your project:

```bash
# Install in project
npm install ino-icon-maker

# Add script to package.json
{
  "scripts": {
    "icons": "ino-icon-maker generate -i assets/icon.png -o output -p all"
  }
}

# Run
npm run icons
```

---

## 📱 Platform-Specific Quick Start

### iOS Only

```bash
npx ino-icon-maker generate -i icon.png -o ./output -p ios
```

**Output:** `./output/AppIcon.appiconset/`

- 18 icon files (all sizes for iPhone, iPad, Apple Watch)
- `Contents.json` metadata file

### Android Only

```bash
npx ino-icon-maker generate -i icon.png -o ./output -p android
```

**Output:** Multiple `mipmap-*` directories

- 13 icon files (all density buckets)
- Standard and round launcher icons

### Both Platforms

```bash
npx ino-icon-maker generate -i icon.png -o ./output -p all
```

**Output:** Both iOS and Android icons

---

## 💻 Interactive Mode

Don't remember the commands? Use interactive mode:

```bash
npx ino-icon-maker generate
```

Follow the prompts:

1. 📂 Select your source image
2. 📁 Choose output directory
3. 📱 Select platform (iOS/Android/All)
4. 📦 Enable ZIP export? (Yes/No)

---

## 🎨 Recommended Icon Specifications

### Source Image Requirements

✅ **Format**: PNG (preferred), JPEG, or WebP  
✅ **Size**: 1024×1024 or larger  
✅ **Aspect Ratio**: 1:1 (square)  
✅ **Background**: Transparent (PNG) or solid color

### Good Example

```
✓ icon.png
  - 1024×1024 pixels
  - PNG format
  - Transparent background
  - Centered content
```

### What to Avoid

```
✗ Small image (512×512 or less) - may look pixelated when upscaled
✗ Non-square (800×600) - will be cropped
✗ Low quality JPEG - compression artifacts
✗ Text too small - hard to read at small sizes
```

---

## 🚀 Quick Examples

### Example 1: React Native Project

```bash
# Navigate to your project
cd /path/to/my-react-native-app

# Generate icons
npx ino-icon-maker generate \
  -i assets/app-icon.png \
  -o temp \
  -p all

# Copy to project folders
cp -r temp/AppIcon.appiconset ios/YourApp/Images.xcassets/
cp -r temp/android-icons/* android/app/src/main/res/

# Clean up
rm -rf temp
```

### Example 2: Flutter Project

```bash
# Navigate to your project
cd /path/to/my-flutter-app

# Generate icons
npx ino-icon-maker generate \
  -i assets/icon.png \
  -o output \
  -p all

# Copy to platform folders
cp -r output/AppIcon.appiconset ios/Runner/Assets.xcassets/
cp -r output/android-icons/* android/app/src/main/res/
```

### Example 3: Multiple Apps

```bash
# App 1
npx ino-icon-maker generate -i app1-icon.png -o ./app1/icons -p all

# App 2
npx ino-icon-maker generate -i app2-icon.png -o ./app2/icons -p all

# App 3
npx ino-icon-maker generate -i app3-icon.png -o ./app3/icons -p all
```

---

## 📦 Output Structure

### iOS Output

```
output/
└── AppIcon.appiconset/
    ├── Icon-App-20x20@2x.png      # 40×40
    ├── Icon-App-20x20@3x.png      # 60×60
    ├── Icon-App-29x29@2x.png      # 58×58
    ├── Icon-App-29x29@3x.png      # 87×87
    ├── Icon-App-40x40@2x.png      # 80×80
    ├── Icon-App-40x40@3x.png      # 120×120
    ├── Icon-App-60x60@2x.png      # 120×120
    ├── Icon-App-60x60@3x.png      # 180×180
    ├── Icon-App-76x76@2x.png      # 152×152
    ├── Icon-App-83.5x83.5@2x.png  # 167×167
    ├── Icon-App-1024x1024@1x.png  # 1024×1024 (App Store)
    └── Contents.json              # Metadata
```

### Android Output

```
output/
├── mipmap-ldpi/
│   ├── ic_launcher.png (36×36)
│   └── ic_launcher_round.png
├── mipmap-mdpi/
│   ├── ic_launcher.png (48×48)
│   └── ic_launcher_round.png
├── mipmap-hdpi/
│   ├── ic_launcher.png (72×72)
│   └── ic_launcher_round.png
├── mipmap-xhdpi/
│   ├── ic_launcher.png (96×96)
│   └── ic_launcher_round.png
├── mipmap-xxhdpi/
│   ├── ic_launcher.png (144×144)
│   └── ic_launcher_round.png
└── mipmap-xxxhdpi/
    ├── ic_launcher.png (192×192)
    └── ic_launcher_round.png
```

---

## ❓ Common Questions

### Q: Do I need to install anything?

**A:** No! Use `npx ino-icon-maker` to run without installing.

### Q: What image formats are supported?

**A:** PNG (best), JPEG, and WebP.

### Q: What size should my source image be?

**A:** Minimum 1024×1024, but larger is better (won't be upscaled).

### Q: Can I generate just iOS or just Android?

**A:** Yes! Use `-p ios` or `-p android` flag.

### Q: Where are the generated files?

**A:** In the output directory you specified with `-o` flag.

### Q: Can I create ZIP archives?

**A:** Yes! Add `-z` or `--zip` flag.

### Q: How do I overwrite existing files?

**A:** Add `-f` or `--force` flag.

---

## 🆘 Troubleshooting

### "Command not found: ino-icon"

**Solution:** You haven't installed globally. Either:

- Use `npx ino-icon-maker` instead
- Install globally: `npm install -g ino-icon-maker`

### "Invalid image file"

**Solution:**

- Check image exists at specified path
- Verify it's PNG, JPEG, or WebP format
- Ensure file is not corrupted

### "ENOENT: no such file or directory"

**Solution:**

- Check input path is correct
- Use absolute paths or ensure you're in right directory
- Check file permissions

### "Sharp installation failed"

**Solution:**

```bash
npm cache clean --force
npm install -g ino-icon-maker --force
```

---

## ✨ Next Steps

Now that you've generated your first icons:

1. **Integrate with your app**

   - [React Native Guide](../examples/REACT_NATIVE.md)
   - [Flutter Guide](../examples/FLUTTER.md)

2. **Automate the process**

   - [CI/CD Examples](../examples/CI_CD.md)

3. **Use as a library**

   - [Library API Guide](./LIBRARY_API.md)

4. **Learn advanced features**
   - [All Examples](../examples/ALL_EXAMPLES.md)

---

## 🔗 Resources

- **GitHub**: https://github.com/narek589/ino-icon-maker
- **npm**: https://www.npmjs.com/package/ino-icon-maker
- **Issues**: https://github.com/narek589/ino-icon-maker/issues
- **Documentation**: https://github.com/narek589/ino-icon-maker/tree/main/docs

---

**Happy icon generating!** 🎨
