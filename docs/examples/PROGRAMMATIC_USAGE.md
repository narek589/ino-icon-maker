# 🔧 Programmatic Usage Guide

Complete guide for using ino-icon-maker as an npm module in your JavaScript/TypeScript projects.

## 📖 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [Advanced Usage](#advanced-usage)
- [Error Handling](#error-handling)

---

## 🚀 Installation

```bash
npm install ino-icon-maker
```

---

## ⚡ Quick Start

```javascript
import { quickGenerate } from "ino-icon-maker";

// Generate icons for both platforms
await quickGenerate({
	foreground: "./icon.png",
	output: "./icons",
	platform: "all",
});
```

---

## 📚 API Reference

### Main Functions

#### `quickGenerate(options)`

High-level function for quick icon generation. Works exactly like the CLI.

**Parameters:**

```typescript
{
  foreground: string;       // Icon/foreground image path (required, same as -fg)
  background?: string;      // Background layer path or hex color like '#FF5722' (optional, defaults to '#111111')
  monochrome?: string;      // Monochrome layer path (optional, same as -m)
  output: string;           // Output directory (required)
  platform?: string;        // 'ios', 'android', or 'all' (default: 'all')
  zip?: boolean;            // Create ZIP archive (default: false)
  force?: boolean;          // Overwrite existing files (default: false)
  fgScale?: number;         // Scale foreground content (e.g., 2.0 = zoom in 2x)
  fgScaleIos?: number;      // iOS-specific foreground scale
  fgScaleAndroid?: number;  // Android-specific foreground scale
  customSizes?: object;     // Custom size configuration
}
```

**Returns:** `Promise<object | array>` - Generation result(s)

#### `generateIcons(inputPath, outputDir, options)`

Generate iOS icons (legacy function).

**Parameters:**

- `inputPath` (string): Path to source image
- `outputDir` (string): Output directory
- `options` (object): Generation options

**Returns:** `Promise<object>` - Generation result

#### `generateIconsForPlatform(platform, inputPath, outputDir, options)`

Generate icons for specific platform.

**Parameters:**

- `platform` (string): Platform name ('ios' or 'android')
- `inputPath` (string): Path to source image
- `outputDir` (string): Output directory
- `options` (object): Generation options

**Returns:** `Promise<object>` - Generation result

#### `generateIconsForMultiplePlatforms(platforms, inputPath, outputDir, options)`

Generate icons for multiple platforms.

**Parameters:**

- `platforms` (array): Array of platform names
- `inputPath` (string): Path to source image
- `outputDir` (string): Output directory
- `options` (object): Generation options

**Returns:** `Promise<array>` - Array of generation results

### Utility Functions

#### `getSupportedPlatforms()`

Get list of supported platforms.

**Returns:** `array` - ['ios', 'android']

#### `getPlatformInfo(platform)`

Get information about a platform.

**Parameters:**

- `platform` (string): Platform name

**Returns:** `object` - Platform information

#### `getAllPlatformsInfo()`

Get information about all platforms.

**Returns:** `array` - Array of platform information objects

#### `validateImageFile(filePath)`

Validate an image file.

**Parameters:**

- `filePath` (string): Path to image file

**Returns:** `Promise<boolean>` - true if valid

#### `createZipArchive(sourceDir, outputPath)`

Create a ZIP archive.

**Parameters:**

- `sourceDir` (string): Directory to archive
- `outputPath` (string): Output ZIP file path

**Returns:** `Promise<string>` - Path to created ZIP file

---

## 📝 Usage Examples

### Basic Generation

#### Generate for All Platforms

```javascript
import { quickGenerate } from "ino-icon-maker";

await quickGenerate({
	foreground: "./assets/icon.png",
	output: "./output/icons",
	platform: "all",
});

console.log("✅ Icons generated successfully!");
```

#### Generate for iOS Only

```javascript
import { quickGenerate } from "ino-icon-maker";

await quickGenerate({
	foreground: "./assets/icon.png",
	output: "./output/ios-icons",
	platform: "ios",
});
```

#### Generate for Android Only

```javascript
import { quickGenerate } from "ino-icon-maker";

await quickGenerate({
	foreground: "./assets/icon.png",
	output: "./output/android-icons",
	platform: "android",
});
```

### With ZIP Archive

```javascript
import { quickGenerate } from "ino-icon-maker";

const result = await quickGenerate({
	foreground: "./assets/icon.png",
	output: "./output/icons",
	platform: "all",
	zip: true,
});

console.log("ZIP created:", result.zipPath);
```

### Android Adaptive Icons

#### Foreground + Background Image

```javascript
import { quickGenerate } from "ino-icon-maker";

await quickGenerate({
	output: "./output/android-icons",
	platform: "android",
	adaptiveIcon: {
		foreground: "./assets/foreground.png",
		background: "./assets/background.png",
	},
});
```

#### Foreground + Background Color

```javascript
import { quickGenerate } from "ino-icon-maker";

await quickGenerate({
	output: "./output/android-icons",
	platform: "android",
	adaptiveIcon: {
		foreground: "./assets/foreground.png",
		background: "#FF5722", // Hex color
	},
});
```

#### With Monochrome Layer

```javascript
import { quickGenerate } from "ino-icon-maker";

await quickGenerate({
	output: "./output/android-icons",
	platform: "android",
	adaptiveIcon: {
		foreground: "./assets/foreground.png",
		background: "#FFFFFF",
		monochrome: "./assets/monochrome.png",
	},
});
```

#### iOS + Android Adaptive

```javascript
import { quickGenerate } from "ino-icon-maker";

await quickGenerate({
	foreground: "./assets/icon.png", // For iOS
	output: "./output/icons",
	platform: "all",
	adaptiveIcon: {
		// For Android
		foreground: "./assets/foreground.png",
		background: "./assets/background.png",
	},
});
```

### Using Lower-Level APIs

#### Generate with Platform-Specific Function

```javascript
import { generateIconsForPlatform } from "ino-icon-maker";

const result = await generateIconsForPlatform(
	"ios",
	"./assets/icon.png",
	"./output/ios-icons",
	{
		force: true,
		zip: false,
	}
);

console.log("Platform:", result.platform);
console.log("Icon count:", result.files.length);
console.log("Output path:", result.outputPath);
```

#### Generate for Multiple Platforms

```javascript
import { generateIconsForMultiplePlatforms } from "ino-icon-maker";

const results = await generateIconsForMultiplePlatforms(
	["ios", "android"],
	"./assets/icon.png",
	"./output/icons",
	{ force: true }
);

for (const result of results) {
	console.log(`${result.platform}: ${result.files.length} icons`);
}
```

---

## 🎯 Advanced Usage

### Build Script Integration

```javascript
// build-icons.js
import { quickGenerate } from "ino-icon-maker";
import { copyFileSync } from "fs";

async function buildIcons() {
	const env = process.env.NODE_ENV || "development";
	const iconPath = `./assets/icon-${env}.png`;

	console.log(`Building ${env} icons...`);

	const result = await quickGenerate({
		foreground: iconPath,
		output: "./build/icons",
		platform: "all",
		force: true,
		zip: true,
	});

	console.log("✅ Icons built successfully!");
	console.log(`Generated ${result.length} platform sets`);

	return result;
}

buildIcons().catch(console.error);
```

Run:

```bash
NODE_ENV=production node build-icons.js
```

### Express.js Integration

```javascript
// server.js
import express from "express";
import multer from "multer";
import { quickGenerate } from "ino-icon-maker";
import { mkdtemp, rm } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/generate-icons", upload.single("icon"), async (req, res) => {
	try {
		const platform = req.query.platform || "all";
		const tempDir = await mkdtemp(join(tmpdir(), "icons-"));

		const result = await quickGenerate({
			foreground: req.file.path,
			output: tempDir,
			platform: platform,
			zip: true,
		});

		// Send ZIP file
		res.download(result.zipPath, "icons.zip", async err => {
			// Cleanup
			await rm(tempDir, { recursive: true, force: true });
			await rm(req.file.path, { force: true });
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.listen(3000, () => {
	console.log("Server running on port 3000");
});
```

### Webpack Plugin

```javascript
// webpack-icon-plugin.js
import { quickGenerate } from "ino-icon-maker";

class IconGeneratorPlugin {
	constructor(options = {}) {
		this.options = {
			foreground: "./assets/icon.png",
			output: "./dist/icons",
			platform: "all",
			...options,
		};
	}

	apply(compiler) {
		compiler.hooks.afterEmit.tapPromise("IconGeneratorPlugin", async () => {
			console.log("Generating app icons...");
			await quickGenerate(this.options);
			console.log("✅ Icons generated");
		});
	}
}

export default IconGeneratorPlugin;
```

Use in webpack.config.js:

```javascript
import IconGeneratorPlugin from "./webpack-icon-plugin.js";

export default {
	// ...
	plugins: [
		new IconGeneratorPlugin({
			foreground: "./src/assets/icon.png",
			output: "./dist/icons",
			platform: "all",
		}),
	],
};
```

### Gulp Task

```javascript
// gulpfile.js
import gulp from "gulp";
import { quickGenerate } from "ino-icon-maker";

gulp.task("icons", async () => {
	await quickGenerate({
		foreground: "./src/assets/icon.png",
		output: "./dist/icons",
		platform: "all",
		force: true,
	});
});

gulp.task("icons:dev", async () => {
	await quickGenerate({
		foreground: "./src/assets/icon-dev.png",
		output: "./dist/icons",
		platform: "all",
		force: true,
	});
});

gulp.task("icons:prod", async () => {
	await quickGenerate({
		foreground: "./src/assets/icon-prod.png",
		output: "./dist/icons",
		platform: "all",
		force: true,
		zip: true,
	});
});

gulp.task("default", gulp.series("icons"));
```

### React Native Build Script

```javascript
// scripts/generate-app-icons.js
import { quickGenerate } from "ino-icon-maker";
import { cp, rm } from "fs/promises";
import { existsSync } from "fs";

async function generateAppIcons() {
	const APP_NAME = "MyReactNativeApp";
	const tempDir = "./temp-icons";

	try {
		console.log("🎨 Generating app icons...\n");

		// Generate icons
		await quickGenerate({
			foreground: "./assets/icon.png",
			output: tempDir,
			platform: "all",
			force: true,
		});

		console.log("✅ Icons generated\n");

		// Install iOS icons
		console.log("📱 Installing iOS icons...");
		const iosTarget = `ios/${APP_NAME}/Images.xcassets/AppIcon.appiconset`;
		if (existsSync(iosTarget)) {
			await rm(iosTarget, { recursive: true });
		}
		await cp(`${tempDir}/AppIcon.appiconset`, iosTarget, { recursive: true });
		console.log("✅ iOS icons installed\n");

		// Install Android icons
		console.log("🤖 Installing Android icons...");
		const androidRes = "android/app/src/main/res";
		await cp(`${tempDir}/android-icons`, androidRes, {
			recursive: true,
			filter: src => src.includes("mipmap-"),
		});
		console.log("✅ Android icons installed\n");

		// Cleanup
		await rm(tempDir, { recursive: true, force: true });

		console.log("✅ All done!\n");
	} catch (error) {
		console.error("❌ Error:", error.message);
		process.exit(1);
	}
}

generateAppIcons();
```

Add to package.json:

```json
{
	"scripts": {
		"generate:icons": "node scripts/generate-app-icons.js"
	}
}
```

### Flutter Build Script

```javascript
// tool/generate-icons.mjs
import { quickGenerate } from "ino-icon-maker";
import { cp, rm } from "fs/promises";
import { existsSync } from "fs";

async function generateFlutterIcons() {
	const tempDir = "./temp-icons";

	try {
		console.log("🎨 Generating Flutter app icons...\n");

		await quickGenerate({
			foreground: "./assets/icon.png",
			output: tempDir,
			platform: "all",
			force: true,
		});

		console.log("✅ Icons generated\n");

		// Install iOS icons
		console.log("📱 Installing iOS icons...");
		const iosTarget = "ios/Runner/Assets.xcassets/AppIcon.appiconset";
		if (existsSync(iosTarget)) {
			await rm(iosTarget, { recursive: true });
		}
		await cp(`${tempDir}/AppIcon.appiconset`, iosTarget, { recursive: true });
		console.log("✅ iOS icons installed\n");

		// Install Android icons
		console.log("🤖 Installing Android icons...");
		const androidRes = "android/app/src/main/res";
		await cp(`${tempDir}/android-icons`, androidRes, {
			recursive: true,
			filter: src => src.includes("mipmap-"),
		});
		console.log("✅ Android icons installed\n");

		// Cleanup
		await rm(tempDir, { recursive: true, force: true });

		console.log("✅ All done!\n");
	} catch (error) {
		console.error("❌ Error:", error.message);
		process.exit(1);
	}
}

generateFlutterIcons();
```

---

## ⚠️ Error Handling

### Try-Catch Pattern

```javascript
import { quickGenerate } from "ino-icon-maker";

try {
	await quickGenerate({
		foreground: "./icon.png",
		output: "./icons",
		platform: "all",
	});
	console.log("✅ Success!");
} catch (error) {
	console.error("❌ Error:", error.message);
	process.exit(1);
}
```

### Validation Before Generation

```javascript
import { validateImageFile, quickGenerate } from "ino-icon-maker";
import { existsSync } from "fs";

const iconPath = "./assets/icon.png";

// Check if file exists
if (!existsSync(iconPath)) {
	console.error("Icon file not found!");
	process.exit(1);
}

// Validate image format
const isValid = await validateImageFile(iconPath);
if (!isValid) {
	console.error("Invalid image format!");
	process.exit(1);
}

// Generate icons
await quickGenerate({
	foreground: iconPath,
	output: "./icons",
	platform: "all",
});
```

### Graceful Degradation

```javascript
import { quickGenerate, getSupportedPlatforms } from "ino-icon-maker";

async function generateWithFallback(platform) {
	try {
		await quickGenerate({
			foreground: "./icon.png",
			output: "./icons",
			platform: platform,
		});
	} catch (error) {
		console.warn(`Failed to generate ${platform} icons:`, error.message);

		// Try generating for all platforms instead
		const platforms = getSupportedPlatforms();
		for (const p of platforms) {
			try {
				await quickGenerate({
					foreground: "./icon.png",
					output: `./icons/${p}`,
					platform: p,
				});
				console.log(`✅ Generated ${p} icons`);
			} catch (err) {
				console.error(`Failed ${p}:`, err.message);
			}
		}
	}
}
```

---

## 🧪 Testing

### Unit Test Example (Jest)

```javascript
import { quickGenerate, validateImageFile } from "ino-icon-maker";
import { existsSync } from "fs";
import { rm } from "fs/promises";

describe("Icon Generation", () => {
	const outputDir = "./test-output";

	afterEach(async () => {
		// Cleanup
		if (existsSync(outputDir)) {
			await rm(outputDir, { recursive: true });
		}
	});

	test("should generate iOS icons", async () => {
		await quickGenerate({
			foreground: "./test-icon.png",
			output: outputDir,
			platform: "ios",
		});

		expect(existsSync(`${outputDir}/AppIcon.appiconset`)).toBe(true);
	});

	test("should generate Android icons", async () => {
		await quickGenerate({
			foreground: "./test-icon.png",
			output: outputDir,
			platform: "android",
		});

		expect(existsSync(`${outputDir}/android-icons`)).toBe(true);
	});

	test("should validate image file", async () => {
		const isValid = await validateImageFile("./test-icon.png");
		expect(isValid).toBe(true);
	});
});
```

---

## 📚 TypeScript Support

```typescript
import { quickGenerate } from "ino-icon-maker";

interface GenerateOptions {
	input?: string;
	output: string;
	platform?: "ios" | "android" | "all";
	zip?: boolean;
	force?: boolean;
	adaptiveIcon?: {
		foreground: string;
		background?: string;
		monochrome?: string;
	};
}

async function generateIcons(options: GenerateOptions): Promise<void> {
	await quickGenerate(options);
}

// Usage
await generateIcons({
	foreground: "./icon.png",
	output: "./icons",
	platform: "all",
	zip: true,
});
```

---

## 📚 Related Documentation

- [CLI Usage](./CLI_USAGE.md) - Command line interface guide
- [API Usage](./API_USAGE.md) - HTTP API with curl examples
- [Complete Examples](./COMPLETE_EXAMPLES.md) - Quick reference
- [React Native Integration](./REACT_NATIVE.md) - Full React Native guide
- [Flutter Integration](./FLUTTER.md) - Full Flutter guide

---

**Need help?** [Open an issue](https://github.com/narek589/ino-icon-maker/issues)
