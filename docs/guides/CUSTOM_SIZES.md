# Custom Icon Sizes Guide

> **Note**: Customizing icon sizes is an advanced feature. The default sizes follow platform best practices and are recommended for most use cases.

## Quick Reference

| Feature              | CLI            | Config File          | Programmatic API | HTTP API         |
| -------------------- | -------------- | -------------------- | ---------------- | ---------------- |
| **Add custom sizes** | ❌             | ✅ `--custom-config` | ✅ `customSizes` | ✅ `customSizes` |
| **Exclude sizes**    | ✅ `--exclude` | ✅ `--custom-config` | ✅ `customSizes` | ✅ `customSizes` |

## Overview

The Custom Sizes feature allows you to:

1. **Add** custom sizes not included in defaults
2. **Exclude** specific sizes from generation

**Important**: You cannot override existing default size values to maintain platform best practices.

## When to Use Custom Sizes

### Good Use Cases ✅

- **Adding platform-specific sizes**: Custom icon size for a specific device
- **Optimizing bundle size**: Exclude low-density icons for modern-only apps
- **Special requirements**: Skip monochrome icons if not needed

### Not Recommended ❌

- **"Fixing" design issues**: Use proper source images instead
- **Random experimentation**: Stick to defaults unless you have specific needs
- **Breaking platform guidelines**: Custom sizes should complement, not replace standards

## Configuration Format

```javascript
{
  ios: {
    addSizes: [                  // Add custom sizes (optional)
      {
        size: "1024x1024",
        scale: "3x",
        filename: "Icon-App-1024x1024@3x.png"
      }
    ],
    excludeSizes: [              // Exclude specific sizes (optional)
      "20x20@2x",
      "29x29@3x"
    ]
  },
  android: {
    addSizes: [                  // Add custom sizes (optional)
      {
        density: "xxxxhdpi",
        size: 256,
        folder: "mipmap-xxxxhdpi",
        filename: "ic_launcher.png"
      }
    ],
    excludeSizes: [              // Exclude specific sizes (optional)
      "monochrome",              // Skip all monochrome icons
      "ldpi",                    // Skip ldpi density
      "ic_launcher_round"        // Skip all round icons
    ]
  }
}
```

## Usage Examples

### CLI Usage

#### 1. Exclude Specific Sizes

Skip low-density and monochrome Android icons:

```bash
ino-icon generate -fg icon.png -o ./output -p android --exclude "ldpi,monochrome"
```

Exclude specific iOS sizes:

```bash
ino-icon generate -fg icon.png -o ./output -p ios --exclude "20x20@2x,29x29@3x"
```

#### 2. Use Custom Config File

Create a JSON file (e.g., `custom-sizes.json`):

```json
{
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

Then use it:

```bash
ino-icon generate -fg icon.png -o ./output --custom-config custom-sizes.json
```

### Programmatic API Usage

#### 1. Add Custom Sizes

```javascript
import { generateIconsForPlatform } from "ino-icon-maker";

await generateIconsForPlatform("ios", "./icon.png", "./output", {
	customSizes: {
		ios: {
			addSizes: [
				{
					size: "1024x1024",
					scale: "3x",
					filename: "Icon-App-1024x1024@3x.png",
				},
			],
		},
	},
});
```

#### 2. Exclude Sizes

```javascript
import { generateIconsForPlatform } from "ino-icon-maker";

await generateIconsForPlatform("android", "./icon.png", "./output", {
	customSizes: {
		android: {
			excludeSizes: ["ldpi", "monochrome", "ic_launcher_round"],
		},
	},
});
```

#### 3. Combination

```javascript
import { generateIconsForMultiplePlatforms } from "ino-icon-maker";

await generateIconsForMultiplePlatforms(
	["ios", "android"],
	"./icon.png",
	"./output",
	{
		customSizes: {
			ios: {
				excludeSizes: ["20x20@2x"],
			},
			android: {
				excludeSizes: ["ldpi", "monochrome"],
			},
		},
		zip: true,
	}
);
```

#### 4. Using QuickGenerate

```javascript
import { quickGenerate } from "ino-icon-maker";

await quickGenerate({
	input: "./icon.png",
	output: "./output",
	platform: "all",
	customSizes: {
		android: {
			excludeSizes: ["monochrome"],
		},
	},
});
```

### HTTP API Usage

#### 1. With Query Parameter

```bash
curl -X POST http://localhost:3000/generate \
  -F "file=@icon.png" \
  -F "platform=ios" \
  -F 'customSizes={"ios":{"excludeSizes":["20x20@2x"]}}'
```

#### 2. Complex Configuration

```bash
curl -X POST http://localhost:3000/generate \
  -F "file=@icon.png" \
  -F "platform=all" \
  -F 'customSizes={
    "ios": {
      "addSizes": [
        {
          "size": "1024x1024",
          "scale": "3x",
          "filename": "Icon-App-1024x1024@3x.png"
        }
      ]
    },
    "android": {
      "excludeSizes": ["ldpi", "monochrome"]
    }
  }'
```

## Exclusion Patterns

### iOS Exclusion Patterns

| Pattern      | Description | Example                                      |
| ------------ | ----------- | -------------------------------------------- |
| `"60x60@2x"` | Exact match | Excludes only this specific size/scale combo |
| `"60x60"`    | Size match  | Excludes all scales of 60x60 (@2x, @3x)      |
| `"@2x"`      | Scale match | Excludes all @2x icons                       |

**Examples:**

```javascript
{
	ios: {
		excludeSizes: [
			"20x20@2x", // Skip only 20x20@2x
			"29x29", // Skip 29x29@2x AND 29x29@3x
			"@3x", // Skip ALL @3x icons
		];
	}
}
```

### Android Exclusion Patterns

| Pattern               | Description      | Example                                          |
| --------------------- | ---------------- | ------------------------------------------------ |
| `"ldpi"`              | Density match    | Excludes all ldpi files                          |
| `"monochrome"`        | Keyword match    | Excludes all files with "monochrome" in filename |
| `"ic_launcher_round"` | Filename pattern | Excludes all round launcher icons                |
| `"mipmap-ldpi"`       | Folder match     | Excludes by folder name                          |

**Examples:**

```javascript
{
	android: {
		excludeSizes: [
			"ldpi", // Skip all ldpi density
			"monochrome", // Skip all monochrome icons
			"ic_launcher_round", // Skip all round icons
			"playstore", // Skip Play Store icon
		];
	}
}
```

## Adding Custom Sizes

### iOS Custom Size Format

```javascript
{
  size: "WxH",        // Size in points (e.g., "1024x1024")
  scale: "Nx",        // Scale factor (e.g., "2x", "3x")
  filename: "..."     // Output filename (e.g., "Icon-App-1024x1024@3x.png")
}
```

**Example:**

```javascript
{
	ios: {
		addSizes: [
			{
				size: "1024x1024",
				scale: "3x",
				filename: "Icon-App-1024x1024@3x.png",
			},
			{
				size: "512x512",
				scale: "2x",
				filename: "Icon-App-512x512@2x.png",
			},
		];
	}
}
```

### Android Custom Size Format

```javascript
{
  density: "...",     // Density name (e.g., "xxxxhdpi")
  size: 256,          // Size in pixels (number)
  folder: "...",      // Folder name (e.g., "mipmap-xxxxhdpi")
  filename: "..."     // Filename (e.g., "ic_launcher.png")
}
```

**Example:**

```javascript
{
	android: {
		addSizes: [
			{
				density: "xxxxhdpi",
				size: 256,
				folder: "mipmap-xxxxhdpi",
				filename: "ic_launcher.png",
			},
			{
				density: "xxxxhdpi",
				size: 256,
				folder: "mipmap-xxxxhdpi",
				filename: "ic_launcher_round.png",
			},
		];
	}
}
```

## Best Practices

### 1. Test Your Custom Sizes

Always test generated icons on actual devices:

```bash
# Create custom config
echo '{"ios": {"excludeSizes": ["20x20@2x"]}}' > custom-sizes.json

# Generate with custom sizes
ino-icon generate -fg icon.png -o ./test-output --custom-config custom-sizes.json

# Install to your project
ino-icon generate -fg icon.png -o ./test-output --custom-config custom-sizes.json --install

# Test on device
```

### 2. Exclude Wisely

Only exclude sizes you genuinely don't need:

```javascript
// ❌ Bad: Excluding important sizes
android: {
	excludeSizes: ["mdpi", "hdpi", "xhdpi"]; // Modern devices need these!
}

// ✅ Good: Exclude truly unnecessary sizes
android: {
	excludeSizes: ["ldpi"]; // Rare on modern devices
}
```

### 3. Document Custom Configurations

Save custom configs as JSON files with comments (in documentation):

```javascript
// custom-sizes.json
{
  "android": {
    "excludeSizes": ["ldpi", "monochrome"]
  }
}
```

Add to project docs explaining why custom sizes are needed.

### 4. Combine with Adaptive Icons

Custom sizes work with adaptive icons:

```bash
ino-icon generate \
  -fg foreground.png \
  -bg background.png \
  -o ./output \
  -p android \
  --exclude "monochrome,ldpi"
```

## Validation

The tool validates all custom size configurations:

### What Gets Validated

1. **Custom size format**:
   - iOS: Requires `size`, `scale`, and `filename` fields
   - Android: Requires `density`, `size` (number), `folder`, and `filename` fields
2. **Exclusion patterns**: Must be array of strings
3. **JSON syntax**: Must be valid JSON if using config file
4. **Data types**: Customization must be an object, platform configs must be objects

### Validation Errors

Common validation errors and fixes:

```javascript
// ❌ Invalid: Missing required field
{
  ios: {
    addSizes: [{ size: "1024x1024", scale: "3x" }]  // Missing filename!
  }
}
// ✅ Fix: Add all required fields
{
  ios: {
    addSizes: [{
      size: "1024x1024",
      scale: "3x",
      filename: "Icon-App-1024x1024@3x.png"
    }]
  }
}

// ❌ Invalid: Android size must be number
{
  android: {
    addSizes: [{ density: "xxxxhdpi", size: "256px", ... }]
  }
}
// ✅ Fix: Use number
{
  android: {
    addSizes: [{ density: "xxxxhdpi", size: 256, ... }]
  }
}
```

## Advanced: Programmatic Configuration

For maximum flexibility, use the SizeConfigManager directly:

```javascript
import { SizeConfigManager } from "ino-icon-maker";

const manager = new SizeConfigManager();

// Validate custom configuration
const validation = manager.validateSizeCustomization({
	ios: { excludeSizes: ["20x20@2x"] },
});

if (!validation.valid) {
	console.error("Invalid config:", validation.error);
} else {
	// Use in generation
	await generateIconsForPlatform("ios", "./icon.png", "./output", {
		customSizes: { ios: { excludeSizes: ["20x20@2x"] } },
	});
}
```

## Troubleshooting

### Issue: "Invalid customSizes JSON"

**Cause**: Malformed JSON in custom config file or API request

**Fix**:

```bash
# Validate JSON first
cat custom-sizes.json | jq .

# Fix any syntax errors, then retry
ino-icon generate -fg icon.png -o ./output --custom-config custom-sizes.json
```

### Issue: Custom size not appearing

**Cause**: Custom size format incorrect

**Fix**: Ensure all required fields are present:

- iOS: `size`, `scale`, `filename`
- Android: `density`, `size` (number), `folder`, `filename`

### Issue: Exclusion not working

**Cause**: Exclusion pattern doesn't match

**Fix**: Check pattern format:

```javascript
// iOS: Use exact format
"60x60@2x"; // Not "60x60_2x" or "60*60@2x"

// Android: Use keywords
"monochrome"; // Matches *monochrome*
"ldpi"; // Matches density field
```

## See Also

- [Icon Padding Configuration](./ICON_PADDING_CONFIG.md) - For content scaling (`--fg-scale`)
- [Quick Start Guide](./QUICK_START.md)
- [CLI Usage Examples](../examples/CLI_USAGE.md)
- [API Usage Examples](../examples/API_USAGE.md)
- [Testing Guide](./TESTING.md)
