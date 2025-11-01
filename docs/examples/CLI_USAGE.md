# 💻 CLI Usage Guide

Complete reference for all CLI commands and options.

## 📖 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Commands](#commands)
- [Options](#options)
- [Usage Examples](#usage-examples)
- [Advanced Usage](#advanced-usage)

---

## 🚀 Installation

### Global Installation

```bash
npm install -g ino-icon-maker
```

### Use without Installation (npx)

```bash
npx ino-icon-maker [command] [options]
```

### Project Installation

```bash
npm install --save-dev ino-icon-maker
```

---

## ⚡ Quick Start

```bash
# Generate icons for both platforms
ino-icon generate -i icon.png -o ./icons

# Generate and auto-install to React Native/Flutter project
ino-icon generate -i icon.png --install

# Interactive mode (guided prompts)
ino-icon interactive
```

---

## 📋 Commands

### `generate`

Generate icons from a source image.

```bash
ino-icon generate [options]
```

### `create <image>`

Quick shorthand for generate command.

```bash
ino-icon create icon.png [options]
```

### `interactive` / `i`

Interactive mode with guided prompts.

```bash
ino-icon interactive
```

### `info`

Show icon size specifications for platforms.

```bash
ino-icon info [-p <platform>]
```

### `platforms` / `list`

List all supported platforms.

```bash
ino-icon platforms
```

### `serve`

Start HTTP API server.

```bash
ino-icon serve [-p <port>]
```

---

## 🔧 Options

### Input Options

| Option                | Alias | Description                         | Example                       |
| --------------------- | ----- | ----------------------------------- | ----------------------------- |
| `--input <path>`      | `-i`  | Source image path                   | `-i icon.png`                 |
| `--foreground <path>` | `-fg` | Foreground layer (Android adaptive) | `-fg fg.png`                  |
| `--background <path>` | `-bg` | Background layer or hex color       | `-bg bg.png` or `-bg #FF5722` |
| `--monochrome <path>` | `-m`  | Monochrome layer (optional)         | `-m mono.png`                 |

### Output Options

| Option                  | Alias | Description                       | Default |
| ----------------------- | ----- | --------------------------------- | ------- |
| `--out <dir>`           | `-o`  | Output directory                  | `icons` |
| `--platform <platform>` | `-p`  | Target platform (ios/android/all) | `all`   |
| `--zip`                 | `-z`  | Create ZIP archive                | `false` |
| `--force`               | `-f`  | Overwrite existing files          | `false` |
| `--install`             |       | Auto-install to project           | `false` |

### Info Options

| Option      | Alias | Description  |
| ----------- | ----- | ------------ |
| `--help`    | `-h`  | Show help    |
| `--version` | `-v`  | Show version |

---

## 📚 Usage Examples

### Basic Generation

#### Generate for All Platforms

```bash
ino-icon generate -i icon.png -o ./icons
```

**Output:**

```
icons/
├── AppIcon.appiconset/     # iOS icons
│   ├── Icon-App-20x20@1x.png
│   ├── Icon-App-20x20@2x.png
│   └── ...
└── android-icons/          # Android icons
    ├── mipmap-hdpi/
    ├── mipmap-mdpi/
    └── ...
```

#### Generate for iOS Only

```bash
ino-icon generate -i icon.png -o ./ios-icons -p ios
```

#### Generate for Android Only

```bash
ino-icon generate -i icon.png -o ./android-icons -p android
```

### With ZIP Archive

```bash
ino-icon generate -i icon.png -o ./icons -z
```

**Output:**

```
icons/
├── AppIcon.appiconset/
├── android-icons/
└── icons.zip              # ZIP archive
```

### Auto-Install to Project

#### React Native Project

```bash
# From your React Native project root
ino-icon generate -i assets/icon.png --install
```

**What happens:**

1. Detects React Native project
2. Generates icons
3. Copies iOS icons to `ios/YourApp/Images.xcassets/AppIcon.appiconset/`
4. Copies Android icons to `android/app/src/main/res/mipmap-*/`
5. Shows success message

#### Flutter Project

```bash
# From your Flutter project root
ino-icon generate -i assets/icon.png --install
```

**What happens:**

1. Detects Flutter project
2. Generates icons
3. Copies iOS icons to `ios/Runner/Assets.xcassets/AppIcon.appiconset/`
4. Copies Android icons to `android/app/src/main/res/mipmap-*/`
5. Shows success message

### Android Adaptive Icons

#### Foreground + Background Image

```bash
ino-icon generate \
  -fg foreground.png \
  -bg background.png \
  -o ./icons \
  -p android
```

#### Foreground + Background Color

```bash
ino-icon generate \
  -fg foreground.png \
  -bg "#FF5722" \
  -o ./icons \
  -p android
```

#### With Monochrome Layer

```bash
ino-icon generate \
  -fg foreground.png \
  -bg "#FFFFFF" \
  -m monochrome.png \
  -o ./icons \
  -p android
```

#### iOS + Android Adaptive

```bash
ino-icon generate \
  -i icon.png \
  -fg foreground.png \
  -bg background.png \
  -o ./icons \
  -p all
```

### Quick Create Command

```bash
# Shorthand for generate
ino-icon create icon.png

# With options
ino-icon create icon.png -o ./output -z --install
```

### Interactive Mode

```bash
ino-icon interactive
```

**Prompts:**

1. Generation mode (standard or adaptive)
2. Input file path
3. Output directory
4. Target platform
5. Create ZIP?
6. Force overwrite?

### View Icon Specifications

```bash
# All platforms
ino-icon info

# Specific platform
ino-icon info -p ios
ino-icon info -p android
```

### List Platforms

```bash
ino-icon platforms
```

### Start API Server

```bash
# Default port 3000
ino-icon serve

# Custom port
ino-icon serve -p 8080
```

---

## 🎯 Advanced Usage

### Force Overwrite

```bash
ino-icon generate -i icon.png -o ./icons -f
```

**Use case:** Regenerate icons without deleting output directory first.

### Multiple Formats

```bash
# JPEG
ino-icon generate -i icon.jpg -o ./icons

# PNG (recommended)
ino-icon generate -i icon.png -o ./icons

# WebP
ino-icon generate -i icon.webp -o ./icons

# AVIF
ino-icon generate -i icon.avif -o ./icons

# TIFF
ino-icon generate -i icon.tiff -o ./icons
```

### Custom Output Structure

```bash
# Output to specific directory
ino-icon generate -i icon.png -o ./my-custom-output

# Output to parent directory
ino-icon generate -i icon.png -o ../icons

# Output to absolute path
ino-icon generate -i icon.png -o /path/to/output
```

### Environment-Specific Icons

```bash
# Development icons
ino-icon generate -i assets/icon-dev.png -o ./icons --install

# Staging icons
ino-icon generate -i assets/icon-staging.png -o ./icons --install

# Production icons
ino-icon generate -i assets/icon-prod.png -o ./icons --install
```

### Combine with Other Commands

```bash
# Generate and verify
ino-icon generate -i icon.png -o ./icons && ls -la icons/

# Generate and move to specific location
ino-icon generate -i icon.png -o ./temp && \
  cp -r temp/AppIcon.appiconset ios/YourApp/Images.xcassets/ && \
  rm -rf temp

# Generate for CI/CD
ino-icon generate -i icon.png -o ./icons -z -f
```

### Using with NPM Scripts

Add to `package.json`:

```json
{
	"scripts": {
		"icons": "ino-icon generate -i assets/icon.png --install",
		"icons:dev": "ino-icon generate -i assets/icon-dev.png --install",
		"icons:prod": "ino-icon generate -i assets/icon-prod.png --install",
		"icons:info": "ino-icon info"
	}
}
```

Run:

```bash
npm run icons
npm run icons:dev
npm run icons:prod
npm run icons:info
```

---

## 🐛 Troubleshooting

### "Command not found"

**Solution:**

```bash
# Install globally
npm install -g ino-icon-maker

# Or use npx
npx ino-icon-maker generate -i icon.png
```

### "Input file not found"

**Solution:** Check file path is correct

```bash
# Verify file exists
ls -la icon.png

# Use absolute path
ino-icon generate -i /absolute/path/to/icon.png -o ./icons

# Use relative path from current directory
ino-icon generate -i ./assets/icon.png -o ./icons
```

### "Permission denied"

**Solution:**

```bash
# Use sudo (if global install fails)
sudo npm install -g ino-icon-maker

# Or install locally
npm install --save-dev ino-icon-maker
```

### "Output directory already exists"

**Solution:** Use `-f` flag to force overwrite

```bash
ino-icon generate -i icon.png -o ./icons -f
```

### Auto-install not detecting project

**Solution:** Ensure you're in the project root directory

```bash
# React Native - must have these directories:
# ios/YourApp/Images.xcassets/
# android/app/src/main/res/
# package.json with "react-native" dependency

# Flutter - must have these:
# ios/Runner/Assets.xcassets/
# android/app/src/main/res/
# pubspec.yaml
```

---

## ✅ Best Practices

1. **Use PNG format** for source images (best quality)
2. **Source image should be 1024×1024** or larger
3. **Square aspect ratio** (1:1) required
4. **Use --install flag** for automatic project integration
5. **Use -z flag** to create backup ZIP archives
6. **Test icons** on real devices before release
7. **Keep source images** in version control
8. **Use environment-specific** icons for dev/staging/prod

---

## 📚 Related Documentation

- [API Usage](./API_USAGE.md) - HTTP API with curl examples
- [Programmatic Usage](./PROGRAMMATIC_USAGE.md) - Use as npm module
- [React Native Integration](./REACT_NATIVE.md) - Full React Native guide
- [Flutter Integration](./FLUTTER.md) - Full Flutter guide
- [CI/CD Integration](./CI_CD.md) - Automate in CI/CD pipelines

---

**Need help?** [Open an issue](https://github.com/narek589/ino-icon-maker/issues)
