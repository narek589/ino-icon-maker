# Custom Icon Sizes Guide

> **Note**: Customizing icon sizes is an advanced feature. The default sizes follow platform best practices and are recommended for most use cases.

## Overview

The Custom Sizes feature allows you to:

1. **Scale** all default icon sizes by a factor
2. **Add** custom sizes not included in defaults
3. **Exclude** specific sizes from generation

**Important**: You cannot override existing default size values to maintain platform best practices.

## When to Use Custom Sizes

### Good Use Cases ✅

- **Scaling for specific requirements**: Project requires all icons 20% larger
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
  scale: 1.2,                    // Global scale factor (optional)
  ios: {
    scale: 1.1,                  // Platform-specific scale (optional)
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
    scale: 1.3,                  // Platform-specific scale (optional)
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

#### 1. Scale All Icons

Make all icons 20% larger:

```bash
ino-icon generate -fg icon.png -o ./output --scale 1.2
```

#### 2. Platform-Specific Scaling

Scale iOS icons by 1.1x and Android by 1.3x:

```bash
ino-icon generate -fg icon.png -o ./output --ios-scale 1.1 --android-scale 1.3
```

#### 3. Exclude Specific Sizes

Skip low-density and monochrome Android icons:

```bash
ino-icon generate -fg icon.png -o ./output -p android --exclude "ldpi,monochrome"
```

Exclude specific iOS sizes:

```bash
ino-icon generate -fg icon.png -o ./output -p ios --exclude "20x20@2x,29x29@3x"
```

#### 4. Use Custom Config File

Create a JSON file (e.g., `custom-sizes.json`):

```json
{
	"scale": 1.2,
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

#### 1. Basic Scale

```javascript
import { generateIconsForPlatform } from "ino-icon-maker";

await generateIconsForPlatform("ios", "./icon.png", "./output", {
	customSizes: {
		scale: 1.2, // 20% larger
	},
});
```

#### 2. Add Custom Sizes

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

#### 3. Exclude Sizes

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

#### 4. Combination

```javascript
import { generateIconsForMultiplePlatforms } from "ino-icon-maker";

await generateIconsForMultiplePlatforms(
	["ios", "android"],
	"./icon.png",
	"./output",
	{
		customSizes: {
			scale: 1.1, // Global 10% scale
			ios: {
				excludeSizes: ["20x20@2x"],
			},
			android: {
				scale: 1.2, // Override global for Android
				excludeSizes: ["ldpi", "monochrome"],
			},
		},
		zip: true,
	}
);
```

#### 5. Using QuickGenerate

```javascript
import { quickGenerate } from "ino-icon-maker";

await quickGenerate({
	input: "./icon.png",
	output: "./output",
	platform: "all",
	customSizes: {
		scale: 1.2,
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
  -F 'customSizes={"scale":1.2}'
```

#### 2. With JSON Body

```bash
curl -X POST http://localhost:3000/generate \
  -F "file=@icon.png" \
  -F "platform=android" \
  -F 'customSizes={"android":{"excludeSizes":["ldpi","monochrome"]}}'
```

#### 3. Complex Configuration

```bash
curl -X POST http://localhost:3000/generate \
  -F "file=@icon.png" \
  -F "platform=all" \
  -F 'customSizes={
    "scale": 1.1,
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

## Scale Factors

### Recommended Scale Factors

- **0.8 - 1.0**: Slightly smaller icons (use cautiously)
- **1.0**: Default (no scaling)
- **1.1 - 1.3**: Slightly larger (most common custom range)
- **1.5 - 2.0**: Significantly larger (use with care)

### Scale Factor Warnings

The tool will warn you if:

- Scale factor < 0.5 (too small)
- Scale factor > 3.0 (too large)

Scale factors outside 0.5-3.0 are rejected.

## Best Practices

### 1. Test Your Custom Sizes

Always test generated icons on actual devices:

```bash
# Generate with custom sizes
ino-icon generate -fg icon.png -o ./test-output --scale 1.2

# Install to your project
ino-icon generate -fg icon.png -o ./test-output --scale 1.2 --install

# Test on device
```

### 2. Use Scale Sparingly

Prefer default sizes when possible:

```javascript
// ❌ Bad: Arbitrary scaling without reason
customSizes: {
	scale: 1.23;
}

// ✅ Good: Scale for specific requirement
customSizes: {
	scale: 1.1;
} // 10% larger for better visibility
```

### 3. Exclude Wisely

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

### 4. Document Custom Configurations

Save custom configs as JSON files with comments (in documentation):

```javascript
// custom-sizes.json
{
  "scale": 1.2,
  "android": {
    "excludeSizes": ["ldpi", "monochrome"]
  }
}
```

Add to project docs explaining why custom sizes are needed.

### 5. Combine with Adaptive Icons

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

1. **Scale factors**: Must be numbers between 0 and 5
2. **Custom size format**: Required fields present
3. **Exclusion patterns**: Must be strings
4. **JSON syntax**: Valid JSON if using config file

### Validation Errors

Common validation errors and fixes:

```javascript
// ❌ Invalid: Scale too high
{ scale: 10 }
// ✅ Fix: Use reasonable scale
{ scale: 1.5 }

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
	scale: 1.2,
	ios: { excludeSizes: ["20x20@2x"] },
});

if (!validation.valid) {
	console.error("Invalid config:", validation.error);
} else {
	// Use in generation
	await generateIconsForPlatform("ios", "./icon.png", "./output", {
		customSizes: { scale: 1.2, ios: { excludeSizes: ["20x20@2x"] } },
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

### Issue: "customSizes must be between 0 and 5"

**Cause**: Scale factor outside valid range

**Fix**: Use scale factor between 0.5 and 3.0 (recommended)

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

- [Icon Padding Configuration](./ICON_PADDING_CONFIG.md)
- [Quick Start Guide](./QUICK_START.md)
- [CLI Usage Examples](../examples/CLI_USAGE.md)
- [API Usage Examples](../examples/API_USAGE.md)
- [Testing Guide](./TESTING.md)
