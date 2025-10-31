# Android Adaptive Icons Guide

## Overview

Android 8.0 (API level 26) introduced **adaptive icons**, which allow your app icon to display in different shapes across different device models. Adaptive icons are composed of separate foreground and background layers, giving device manufacturers and users more flexibility in customization.

**ino-icon-maker** now supports generating adaptive icons with separate foreground, background, and monochrome layers, while maintaining backward compatibility with older Android versions.

## What Are Adaptive Icons?

Adaptive icons consist of two layers:

1. **Foreground Layer** - The main icon artwork (108x108dp)
2. **Background Layer** - The background artwork or solid color (108x108dp)
3. **Monochrome Layer** (Optional) - Themed icon for Android 13+ (108x108dp)

The system masks these layers into various shapes (circle, squircle, rounded square, square) depending on the device manufacturer.

### Safe Zone

The **safe zone** is a 66x66dp circle in the center of the 108x108dp canvas. All important visual elements should be within this safe zone to ensure they're visible across all mask shapes.

```
┌─────────────────────────────┐
│       108x108dp Canvas      │
│                             │
│   ┌─────────────────┐       │
│   │   66x66dp       │       │
│   │   Safe Zone     │       │
│   └─────────────────┘       │
│                             │
└─────────────────────────────┘
```

## Benefits of Adaptive Icons

- **Device Consistency**: Icons conform to the device's icon shape
- **Visual Effects**: Support for parallax effects and animations
- **Themed Icons**: Android 13+ supports monochrome themed icons
- **Future-Proof**: New shapes can be added without updating your app

## Preparing Your Layers

### Design Guidelines

**Foreground Layer**:

- Size: 108x108dp (432x432px @ xxhdpi)
- Keep important elements within the 66x66dp safe zone
- Use transparency for the masked effect
- PNG format with alpha channel recommended

**Background Layer**:

- Size: 108x108dp (432x432px @ xxhdpi)
- Can be an image file or solid color (hex code)
- Should complement the foreground
- No transparency required (fully opaque layer)

**Monochrome Layer** (Optional):

- Size: 108x108dp (432x432px @ xxhdpi)
- Single-color silhouette for themed icons
- Used in Android 13+ for system theming
- Defaults to foreground layer if not provided

### Design Tools

**Figma/Sketch**:

1. Create a 108x108dp artboard
2. Add a 66x66dp circle guide in the center
3. Design foreground within the safe zone
4. Design background to fill entire canvas
5. Export as PNG @4x (432x432px)

**Photoshop**:

1. Create 432x432px canvas (xxhdpi)
2. Add circular guide (264px diameter, centered)
3. Keep key elements within the guide
4. Export layers separately as PNG

## Usage

### CLI Mode

#### Basic Adaptive Icons

```bash
# Generate Android adaptive icons
ino-icon generate \
  --platform android \
  --foreground ./layers/foreground.png \
  --background ./layers/background.png \
  --out ./icons \
  --zip
```

#### With Solid Color Background

```bash
# Use hex color for background
ino-icon generate \
  --platform android \
  --foreground ./foreground.png \
  --background '#FF5722' \
  --out ./icons
```

#### With Monochrome Layer

```bash
# Include monochrome layer for themed icons
ino-icon generate \
  --platform android \
  --foreground ./foreground.png \
  --background ./background.png \
  --monochrome ./monochrome.png \
  --out ./icons
```

#### Using Short Flags

```bash
ino-icon generate \
  -p android \
  -fg ./fg.png \
  -bg ./bg.png \
  -m ./mono.png \
  -o ./icons \
  -z
```

### HTTP API Mode

#### Basic Adaptive Icons

```bash
# Upload foreground and background images
curl -X POST http://localhost:3000/generate?platform=android \
  -F "foreground=@./layers/foreground.png" \
  -F "background=@./layers/background.png" \
  -o android-adaptive-icons.zip
```

#### With Solid Color Background

```bash
# Use backgroundColor query parameter
curl -X POST "http://localhost:3000/generate?platform=android&backgroundColor=%23FF5722" \
  -F "foreground=@./foreground.png" \
  -o android-icons.zip
```

#### With All Three Layers

```bash
# Include monochrome layer
curl -X POST http://localhost:3000/generate?platform=android \
  -F "foreground=@./fg.png" \
  -F "background=@./bg.png" \
  -F "monochrome=@./mono.png" \
  -o complete-icons.zip
```

### JavaScript/Node.js API

#### Using quickGenerate

```javascript
import { quickGenerate } from "ino-icon-maker";

// Generate Android adaptive icons
await quickGenerate({
	output: "./icons",
	platform: "android",
	adaptiveIcon: {
		foreground: "./layers/foreground.png",
		background: "./layers/background.png",
		monochrome: "./layers/monochrome.png",
	},
	zip: true,
});
```

#### With Solid Color Background

```javascript
await quickGenerate({
	output: "./icons",
	platform: "android",
	adaptiveIcon: {
		foreground: "./fg.png",
		background: "#FF5722", // Hex color
	},
});
```

#### Generate Both iOS and Android

```javascript
// Generate iOS (legacy) + Android (adaptive)
await quickGenerate({
	input: "./icon.png", // Used for iOS
	output: "./icons",
	platform: "all",
	adaptiveIcon: {
		foreground: "./android-fg.png",
		background: "./android-bg.png",
	},
});
```

#### Using Direct API

```javascript
import { generateIconsForPlatform } from "ino-icon-maker";

const result = await generateIconsForPlatform(
	"android",
	null, // No single input file
	"./output",
	{
		force: true,
		zip: true,
		adaptiveIcon: {
			foreground: "./foreground.png",
			background: "#4CAF50",
			monochrome: "./monochrome.png",
		},
	}
);

console.log(`Generated ${result.files.length} icons`);
console.log(`Output: ${result.outputDir}`);
console.log(`ZIP: ${result.zipPath}`);
```

## Output Structure

When generating adaptive icons, the following structure is created:

```
android-icons/
├── mipmap-anydpi-v26/
│   ├── ic_launcher.xml
│   └── ic_launcher_round.xml
├── mipmap-ldpi/
│   ├── ic_launcher_foreground.png (81x81px)
│   ├── ic_launcher_background.png (81x81px)
│   ├── ic_launcher_monochrome.png (81x81px)
│   ├── ic_launcher.png (36x36px - legacy)
│   └── ic_launcher_round.png (36x36px - legacy)
├── mipmap-mdpi/
│   ├── ic_launcher_foreground.png (108x108px)
│   ├── ic_launcher_background.png (108x108px)
│   ├── ic_launcher_monochrome.png (108x108px)
│   ├── ic_launcher.png (48x48px - legacy)
│   └── ic_launcher_round.png (48x48px - legacy)
├── mipmap-hdpi/
│   ├── ic_launcher_foreground.png (162x162px)
│   ├── ic_launcher_background.png (162x162px)
│   ├── ic_launcher_monochrome.png (162x162px)
│   ├── ic_launcher.png (72x72px - legacy)
│   └── ic_launcher_round.png (72x72px - legacy)
├── mipmap-xhdpi/
│   ├── ic_launcher_foreground.png (216x216px)
│   ├── ic_launcher_background.png (216x216px)
│   ├── ic_launcher_monochrome.png (216x216px)
│   ├── ic_launcher.png (96x96px - legacy)
│   └── ic_launcher_round.png (96x96px - legacy)
├── mipmap-xxhdpi/
│   ├── ic_launcher_foreground.png (324x324px)
│   ├── ic_launcher_background.png (324x324px)
│   ├── ic_launcher_monochrome.png (324x324px)
│   ├── ic_launcher.png (144x144px - legacy)
│   └── ic_launcher_round.png (144x144px - legacy)
├── mipmap-xxxhdpi/
│   ├── ic_launcher_foreground.png (432x432px)
│   ├── ic_launcher_background.png (432x432px)
│   ├── ic_launcher_monochrome.png (432x432px)
│   ├── ic_launcher.png (192x192px - legacy)
│   └── ic_launcher_round.png (192x192px - legacy)
└── playstore/
    └── ic_launcher_playstore.png (512x512px)
```

### XML Files

**mipmap-anydpi-v26/ic_launcher.xml**:

```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
    <monochrome android:drawable="@mipmap/ic_launcher_monochrome"/>
</adaptive-icon>
```

**mipmap-anydpi-v26/ic_launcher_round.xml**: Same structure as above

## Integration with Android Project

### Update AndroidManifest.xml

No changes needed! The manifest already references `@mipmap/ic_launcher`:

```xml
<application
    android:icon="@mipmap/ic_launcher"
    android:roundIcon="@mipmap/ic_launcher_round"
    android:label="@string/app_name">
    ...
</application>
```

### Copy Icons to Your Project

1. **Copy the generated `android-icons/` folder to your project**:

   ```bash
   cp -r android-icons/* android/app/src/main/res/
   ```

2. **For React Native**:

   ```bash
   cp -r android-icons/* android/app/src/main/res/
   ```

3. **For Flutter**:
   ```bash
   cp -r android-icons/* android/app/src/main/res/
   ```

### Verify Installation

Android Studio will automatically recognize the adaptive icon resources. You can preview them in:

- **Android Studio**: Right-click on `mipmap-anydpi-v26/ic_launcher.xml` → "Preview"
- **Device**: Install the app and check the launcher

## Backward Compatibility

The generator automatically creates legacy icons for devices running Android 7.1 (API 25) and below:

- **Android 8.0+ (API 26+)**: Uses adaptive icon with foreground/background layers
- **Android 7.1 and below (API 25-)**: Uses legacy PNG icons (foreground composited over background)

This ensures your app looks great on all Android versions!

## Best Practices

### Do's

✅ Keep important elements within the 66x66dp safe zone  
✅ Use transparent backgrounds on foreground layer  
✅ Test on multiple device shapes (circle, squircle, square)  
✅ Use high-resolution source images (432x432px or larger)  
✅ Provide monochrome layer for Android 13+ themed icons  
✅ Use solid colors for simple, clean backgrounds

### Don'ts

❌ Don't place text near edges (may be clipped)  
❌ Don't use complex gradients that span outside safe zone  
❌ Don't use transparent backgrounds on background layer  
❌ Don't forget to test on different Android versions  
❌ Don't use photos as foreground (doesn't scale well)

## Common Issues

### Issue: Icon appears clipped on some devices

**Solution**: Ensure your key visual elements are within the 66x66dp safe zone. The outer 21dp on each side may be masked.

### Issue: Background color not displaying correctly

**Solution**:

- If using hex color, ensure it starts with `#` (e.g., `#FF5722`)
- If using an image, ensure it's fully opaque (no transparency)

### Issue: Monochrome icon not appearing in Android 13

**Solution**:

- Provide a proper monochrome layer (single-color silhouette)
- Ensure the layer is high contrast (black on transparent or white on transparent)

### Issue: Legacy icons look different from adaptive icons

**Solution**: This is expected! Legacy icons are created by compositing foreground over background. Design with this in mind, or provide a separate legacy icon.

## Testing Your Icons

### Android Studio

1. Copy icons to your project's `res/` directory
2. Right-click `ic_launcher.xml` → "Preview"
3. Check all shapes: Circle, Squircle, Rounded Square, Square

### Physical Device

1. Install your app on multiple devices
2. Check launcher icons across different manufacturers
3. Test on Android 8.0+ and older versions

### Online Tools

- [Adaptive Icon Preview](https://adapticon.tooo.io/) - Preview your adaptive icon
- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/) - Google's official tool

## Examples

### Example 1: Material Design Icon

```bash
# Foreground: Transparent PNG with material icon
# Background: Brand color
ino-icon generate \
  -p android \
  -fg ./material-icon-fg.png \
  -bg '#2196F3' \
  -m ./material-icon-mono.png \
  -o ./icons \
  -z
```

### Example 2: Logo with Gradient Background

```bash
# Foreground: Logo as PNG
# Background: Gradient image
ino-icon generate \
  -p android \
  -fg ./logo.png \
  -bg ./gradient-bg.png \
  -o ./icons
```

### Example 3: Full Project (iOS + Android)

```bash
# Generate both platforms
# iOS uses single image, Android uses adaptive
ino-icon generate \
  -i ./icon-ios.png \
  -p all \
  -fg ./android-fg.png \
  -bg '#FF5722' \
  -o ./all-icons \
  -z
```

## Resources

- [Android Adaptive Icons Documentation](https://developer.android.com/develop/ui/views/launch/icon_design_adaptive)
- [Material Design Icon Guidelines](https://m3.material.io/styles/icons/overview)
- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/)

## Migration from Legacy Icons

If you're currently using legacy single-image icons:

### Before (Legacy Mode):

```bash
ino-icon generate -i ./icon.png -p android -o ./icons
```

### After (Adaptive Mode):

```bash
# Prepare separate foreground and background layers first
ino-icon generate \
  -fg ./foreground.png \
  -bg ./background.png \
  -p android \
  -o ./icons
```

**Note**: Legacy icons are still supported! Adaptive icons are optional but recommended for modern Android apps.

## FAQ

**Q: Do I need to provide a monochrome layer?**  
A: No, it's optional. If not provided, the foreground layer will be used as the monochrome layer.

**Q: Can I use gradients in the background?**  
A: Yes! You can use any image as the background layer, including gradients.

**Q: Will my icon work on older Android versions?**  
A: Yes! The generator creates legacy icons automatically for backward compatibility.

**Q: How do I know if my safe zone is correct?**  
A: Use Android Studio's preview tool or online validators to check all mask shapes.

**Q: Can I use the same image for foreground and background?**  
A: Technically yes, but it's not recommended. Separate layers give better results.

---

Need help? Check out our [Quick Start Guide](./QUICK_START.md) or open an issue on [GitHub](https://github.com/yourusername/ino-icon-maker/issues).
