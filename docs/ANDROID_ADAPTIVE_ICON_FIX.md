# Android Adaptive Icon Foreground Fix

## Issue

The Android adaptive icon foreground layer was not being calculated correctly according to the official [Android Adaptive Icon Guidelines](https://developer.android.com/develop/ui/views/launch/icon_design_adaptive).

### What Was Wrong

1. **Incorrect padding calculation**: The code used 21dp padding on each side (42dp total), but the Android spec requires **18dp on each side (36dp total)**

2. **Calculated value never used**: The code calculated `innerSize` but then ignored it, using `fit: "contain"` on the full target size instead of respecting the safe zone

### Android Adaptive Icon Specification

According to the official Android documentation:

- **Total canvas**: 108dp × 108dp
- **Safe zone** (logo area): 66dp × 66dp (center)
- **Outer margin**: 18dp on each side
- **Safe zone ratio**: 66/108 = 0.6111 (61.11% of total)
- **Padding ratio**: 36/108 = 0.3333 (33.33% of total, 16.67% on each side)

The safe zone is the area that is **never clipped** by any shaped mask (circular, squircle, rounded square, etc.) that OEMs may apply.

## The Fix

### Before (Incorrect)

```javascript
if (isForeground) {
	const paddingPercent = 42 / 108; // WRONG: 42dp instead of 36dp
	const innerSize = Math.round(targetSize * (1 - paddingPercent));

	// BUG: innerSize is calculated but never used!
	return image.clone().resize(targetSize, targetSize, {
		kernel: sharp.kernel.lanczos3,
		fit: "contain", // This doesn't respect the safe zone
		background: { r: 0, g: 0, b: 0, alpha: 0 },
		position: "centre",
	});
}
```

### After (Correct)

```javascript
if (isForeground) {
	// Calculate the safe zone size (66dp out of 108dp)
	const safeZoneRatio = 66 / 108; // 0.6111
	const safeZoneSize = Math.round(targetSize * safeZoneRatio);

	// Calculate padding needed (18dp on each side)
	const padding = Math.round((targetSize - safeZoneSize) / 2);

	// Resize image to fit within the 66dp safe zone, then extend to 108dp with transparent padding
	return image
		.clone()
		.resize(safeZoneSize, safeZoneSize, {
			kernel: sharp.kernel.lanczos3,
			fit: "contain", // Keep aspect ratio, fit within safe zone
			background: { r: 0, g: 0, b: 0, alpha: 0 },
			position: "centre",
		})
		.extend({
			top: padding,
			bottom: padding,
			left: padding,
			right: padding,
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		});
}
```

## How It Works Now

1. **Calculate safe zone size**: 66/108 of the target size
2. **Resize content**: Fit the foreground image within the safe zone (maintaining aspect ratio)
3. **Add transparent padding**: Extend the image to the full 108dp canvas with 18dp transparent padding on each side

## Visual Example

```
┌─────────────────────────────────────────┐
│ 18dp   ←  Transparent Padding           │
│     ┌───────────────────────────┐       │
│     │                           │       │
│     │    66dp × 66dp           │ 18dp  │
│  ↑  │    Safe Zone              │  ↓    │
│ 18dp│    (Logo Area)            │       │
│  ↓  │                           │       │
│     │                           │       │
│     └───────────────────────────┘       │
│             → 18dp                      │
│        108dp × 108dp Canvas             │
└─────────────────────────────────────────┘
```

## Impact

This fix ensures that:

- ✅ Foreground content is properly constrained to the 66dp safe zone
- ✅ Content won't be clipped by circular, squircle, or other shaped masks
- ✅ Icons follow the official Android adaptive icon guidelines
- ✅ Icons look consistent across all Android launchers (Samsung, Pixel, OnePlus, etc.)

## Testing

To test with your adaptive icons:

```bash
# Generate adaptive icons with separate foreground/background
node cli.js generate --foreground ./my-logo.png --background "#FF0000" --platforms android --output ./test-output
```

Verify that:

1. The foreground image is centered with transparent padding
2. The content doesn't appear too large (it should be ~61% of the total canvas)
3. Important details aren't cut off when viewed in different launcher shapes

## References

- [Android Adaptive Icon Design Guidelines](https://developer.android.com/develop/ui/views/launch/icon_design_adaptive)
- [Android App Icon Figma Template](https://www.figma.com/community/file/1014027811592362943)
- [Designing Adaptive Icons (Medium)](https://medium.com/androiddevelopers/designing-adaptive-icons-515af294c783)

## Files Modified

- `lib/core/ImageProcessor.js` - Fixed `prepareAdaptiveLayer()` method
