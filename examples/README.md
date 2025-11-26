# 📚 Examples

Runnable JavaScript examples demonstrating various use cases of ino-icon-maker.

## 🚀 Quick Start

All examples are runnable Node.js scripts. Make sure you have the project dependencies installed:

```bash
npm install
```

## 📋 Available Examples

### 1. Simple Node.js Usage (`node-simple.js`) ⭐ **RECOMMENDED**

The easiest way to use ino-icon-maker - works exactly like the CLI!

```bash
node examples/node-simple.js
```

**What it does:**

- Uses CLI-style parameters (`foreground`, `background`)
- Same simple API as command line
- Perfect for automation scripts
- Includes foreground scaling

**Output:** `output/`

### 2. Basic Usage (`basic-usage.js`)

Demonstrates various generation modes.

```bash
node examples/basic-usage.js
```

**What it does:**

- Generates icons for all platforms
- Generates iOS icons only
- Generates Android icons only
- Creates ZIP archives

**Output:** `temp/basic-*/`

### 3. Adaptive Icons (`adaptive-icons.js`)

Shows how to generate Android adaptive icons with layers.

```bash
node examples/adaptive-icons.js
```

**What it does:**

- Foreground + background image
- Foreground + background color
- With monochrome layer
- iOS + Android mixed mode

**Output:** `temp/adaptive-*/`

### 4. Express Integration (`express-integration.js`)

Complete Express.js API server with icon generation endpoints.

```bash
node examples/express-integration.js
```

**Then test with curl:**

```bash
# Generate icons
curl -F "file=@icon.png" \
  "http://localhost:3001/generate" \
  -o icons.zip

# iOS only
curl -F "file=@icon.png" \
  "http://localhost:3001/generate?platform=ios" \
  -o ios.zip

# Android only
curl -F "file=@icon.png" \
  "http://localhost:3001/generate?platform=android" \
  -o android.zip
```

### 5. Build Script (`build-script.js`)

Environment-specific build script for different deployment scenarios.

```bash
# Development
NODE_ENV=development node examples/build-script.js

# Staging
NODE_ENV=staging node examples/build-script.js

# Production
NODE_ENV=production node examples/build-script.js
```

**What it does:**

- Environment-specific configurations
- Icon validation
- Build timing
- Detailed logging
- Clean output directories

**Output:** `temp/build-*/`

## 🎯 Use Cases

### For CLI Users

If you prefer the command line, see the [CLI Usage Guide](../docs/examples/CLI_USAGE.md).

### For API Users

If you want to use the HTTP API, see:

- [API Usage Guide](../docs/examples/API_USAGE.md)
- `examples/express-integration.js` for a working server

### For React Native Developers

See [React Native Integration Guide](../docs/examples/REACT_NATIVE.md) for complete setup.

Quick example:

```javascript
import { quickGenerate } from "ino-icon-maker";
import { cp } from "fs/promises";

// Generate icons
await quickGenerate({
	input: "./assets/icon.png",
	output: "./temp",
	platform: "all",
});

// Copy to React Native project
await cp(
	"./temp/AppIcon.appiconset",
	"ios/YourApp/Images.xcassets/AppIcon.appiconset",
	{ recursive: true }
);
await cp("./temp/android-icons", "android/app/src/main/res", {
	recursive: true,
});
```

### For Flutter Developers

See [Flutter Integration Guide](../docs/examples/FLUTTER.md) for complete setup.

Quick example:

```javascript
import { quickGenerate } from "ino-icon-maker";
import { cp } from "fs/promises";

// Generate icons
await quickGenerate({
	input: "./assets/icon.png",
	output: "./temp",
	platform: "all",
});

// Copy to Flutter project
await cp(
	"./temp/AppIcon.appiconset",
	"ios/Runner/Assets.xcassets/AppIcon.appiconset",
	{ recursive: true }
);
await cp("./temp/android-icons", "android/app/src/main/res", {
	recursive: true,
});
```

## 🧪 Testing

### Test All Examples

```bash
# Run all examples
npm run examples
```

Or run each individually:

```bash
node examples/basic-usage.js
node examples/adaptive-icons.js
node examples/build-script.js
```

### Test API

```bash
# Start the server first
ino-icon serve

# Or
npm start

# Then run the test script
./test-api.sh
```

## 📦 Project Structure

```
examples/
├── README.md                    # This file
├── node-simple.js              # Simple Node.js API (CLI-style) ⭐
├── basic-usage.js              # Multiple generation modes
├── adaptive-icons.js           # Android adaptive icons
├── express-integration.js      # Express API server
└── build-script.js             # Build automation
```

## 💡 Tips

1. **Source Images**: All examples use `docs/assets/ios-example.png` for demonstration. Replace with your own images in real projects.

2. **Output Directory**: Examples output to `temp/` directory. This is git-ignored and safe for testing.

3. **Error Handling**: All examples include comprehensive error handling. Check them for best practices.

4. **Environment Variables**: Build script uses `NODE_ENV` for configuration. Adapt this pattern to your needs.

5. **Async/Await**: All examples use modern async/await syntax. Make sure you're using Node.js 18+.

## 📚 More Documentation

- [CLI Usage](../docs/examples/CLI_USAGE.md) - Command line interface
- [API Usage](../docs/examples/API_USAGE.md) - HTTP API with curl
- [Programmatic Usage](../docs/examples/PROGRAMMATIC_USAGE.md) - npm module API
- [React Native Guide](../docs/examples/REACT_NATIVE.md) - Full integration
- [Flutter Guide](../docs/examples/FLUTTER.md) - Full integration
- [CI/CD Guide](../docs/examples/CI_CD.md) - Pipeline automation

## ❓ Need Help?

- Check the [main README](../../README.md)
- Read the [documentation](../docs/)
- [Open an issue](https://github.com/narek589/ino-icon-maker/issues)

## ⚖️ License

MIT - Same as main project
