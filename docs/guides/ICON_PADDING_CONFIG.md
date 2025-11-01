# 🎨 Icon Padding Configuration Guide

Configure how much your app icon foreground is "zoomed out" (padding/safe zone) for iOS and Android.

## 📍 Configuration Location

**File:** `lib/core/ImageProcessor.js`  
**Lines:** 11-14 (Platform enum)  
**Lines:** 37-40 (Configuration)

## 🎯 Platform Enum

```javascript
export const Platform = Object.freeze({
	IOS: "ios",
	ANDROID: "android",
});
```

## 🎯 Current Default Settings

```javascript
const ICON_PADDING_CONFIG = {
	[Platform.IOS]: 0.9, // iOS: 90% content, 10% padding (minimal zoom out)
	[Platform.ANDROID]: 0.6111, // Android: 61% content, 39% padding (standard safe zone)
};
```

## 📊 Understanding the Values

The value represents the **percentage of content** (foreground icon size):

| Value    | Content | Padding | Visual Effect                   |
| -------- | ------- | ------- | ------------------------------- |
| `1.0`    | 100%    | 0%      | No padding - fills entire space |
| `0.95`   | 95%     | 5%      | Minimal breathing room          |
| `0.90`   | 90%     | 10%     | Light padding (iOS default)     |
| `0.80`   | 80%     | 20%     | Comfortable padding             |
| `0.6111` | 61%     | 39%     | Standard Android safe zone      |
| `0.50`   | 50%     | 50%     | Maximum zoom out                |

## 🔧 Quick Presets

### No Padding (100% Fill)

```javascript
const ICON_PADDING_CONFIG = {
	[Platform.IOS]: 1.0,
	[Platform.ANDROID]: 1.0,
};
```

**Use case:** Logos/icons designed to fill entire space

### Minimal Padding

```javascript
const ICON_PADDING_CONFIG = {
	[Platform.IOS]: 0.95,
	[Platform.ANDROID]: 0.9,
};
```

**Use case:** Modern, full-bleed design

### Light Padding (Recommended)

```javascript
const ICON_PADDING_CONFIG = {
	[Platform.IOS]: 0.9,
	[Platform.ANDROID]: 0.8,
};
```

**Use case:** Balanced look with breathing room

### Standard (Android Safe Zone)

```javascript
const ICON_PADDING_CONFIG = {
	[Platform.IOS]: 0.8,
	[Platform.ANDROID]: 0.6111,
};
```

**Use case:** Ensure Android icon content is never clipped

### Generous Padding

```javascript
const ICON_PADDING_CONFIG = {
	[Platform.IOS]: 0.7,
	[Platform.ANDROID]: 0.5,
};
```

**Use case:** Small logos that need lots of space

## 🎨 Visual Comparison

### iOS: 90% vs 100%

```
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│   ┌─────────┐   │     │   ███████████   │
│   │   😊   │   │     │   █   😊   █   │
│   └─────────┘   │     │   ███████████   │
│                 │     │                 │
└─────────────────┘     └─────────────────┘
   90% (default)           100% (no pad)
```

### Android: 61% vs 80%

```
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│    ┌───────┐    │     │  ┌───────────┐  │
│    │  😊  │    │     │  │    😊    │  │
│    └───────┘    │     │  └───────────┘  │
│                 │     │                 │
└─────────────────┘     └─────────────────┘
   61% (default)           80% (less pad)
```

## 🚀 How to Change

1. Open `lib/core/ImageProcessor.js`
2. Find lines 37-40 (the ICON_PADDING_CONFIG constant)
3. Modify the values:
   ```javascript
   const ICON_PADDING_CONFIG = {
   	[Platform.IOS]: 0.95, // Change this for iOS
   	[Platform.ANDROID]: 0.8, // Change this for Android
   };
   ```
4. Save the file
5. Regenerate your icons

## 💡 Tips

### iOS Icons

- iOS doesn't clip icons, so you can use higher values (0.90-1.0)
- Use 0.90-0.95 for modern, full-bleed look
- Use 0.80-0.85 for classic look with padding

### Android Icons

- Android clips icons with circular/squircle masks
- **Default 0.6111 (61%)** ensures content stays in safe zone
- **0.75-0.85** works well if you've tested on various launchers
- **Below 0.61** may cause clipping on some launchers

## ⚠️ Platform Differences

### When Using Adaptive Icons (Foreground + Background)

**iOS:**

- Creates composite image (background + foreground merged)
- No system-level clipping
- Safe to use higher values

**Android:**

- System applies circular/squircle/rounded square masks
- Different OEMs use different mask shapes
- Lower values (0.60-0.70) ensure compatibility

## 📐 Android Safe Zone Reference

Android adaptive icon specification:

- Total canvas: **108dp × 108dp**
- Safe zone: **66dp × 66dp** (center)
- Safe zone ratio: **66/108 = 0.6111** ← Default Android value

Content inside the 66dp safe zone is guaranteed to be visible on all launchers.

## 🧪 Testing Your Configuration

After changing the values:

1. Generate icons for both platforms
2. Test on real devices:
   - **iOS:** iPhone with different icon styles
   - **Android:** Multiple launchers (stock, Nova, Samsung, etc.)
3. Check for clipping in:
   - Home screen
   - App drawer
   - Recent apps view
   - Settings

## 📱 Examples by App Type

### Photography App

```javascript
{ [Platform.IOS]: 1.0, [Platform.ANDROID]: 0.9 }  // Full bleed, minimal padding
```

### Game with Logo

```javascript
{ [Platform.IOS]: 0.8, [Platform.ANDROID]: 0.65 }  // Comfortable padding around logo
```

### Social Media App

```javascript
{ [Platform.IOS]: 0.95, [Platform.ANDROID]: 0.75 }  // Modern, almost full
```

### Business/Productivity

```javascript
{ [Platform.IOS]: 0.85, [Platform.ANDROID]: 0.7 }  // Professional with space
```

## 🔄 Reverting to Defaults

If you want to restore the default values:

```javascript
const ICON_PADDING_CONFIG = {
	[Platform.IOS]: 0.9,
	[Platform.ANDROID]: 0.6111,
};
```

## 📚 Related Documentation

- [Adaptive Icons Guide](./ADAPTIVE_ICONS.md)
- [Android Adaptive Icon Fix](../ANDROID_ADAPTIVE_ICON_FIX.md)
- [Quick Start Guide](./QUICK_START.md)

---

**Questions?** [Open an issue](https://github.com/narek589/ino-icon-maker/issues)
