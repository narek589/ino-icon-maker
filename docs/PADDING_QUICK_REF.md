# 🎨 Icon Padding - Quick Reference Card

## 📍 Where to Change

**File:** `lib/core/ImageProcessor.js`  
**Lines:** 37-40

```javascript
const ICON_PADDING_CONFIG = {
	[Platform.IOS]: 0.9, // ← Change this for iOS
	[Platform.ANDROID]: 0.6111, // ← Change this for Android
};
```

**Note:** `Platform` enum is defined at lines 11-14

## 🎯 Common Presets

Copy and paste one of these:

### No Padding (100% Fill)

```javascript
const ICON_PADDING_CONFIG = { [Platform.IOS]: 1.0, [Platform.ANDROID]: 1.0 };
```

**Use for:** Full-bleed designs, photography apps

### Minimal Padding (Modern)

```javascript
const ICON_PADDING_CONFIG = { [Platform.IOS]: 0.95, [Platform.ANDROID]: 0.9 };
```

**Use for:** Modern apps, minimal aesthetic

### Light Padding (Recommended)

```javascript
const ICON_PADDING_CONFIG = { [Platform.IOS]: 0.9, [Platform.ANDROID]: 0.8 };
```

**Use for:** Most apps, balanced look

### Standard (Android Safe Zone)

```javascript
const ICON_PADDING_CONFIG = { [Platform.IOS]: 0.8, [Platform.ANDROID]: 0.6111 };
```

**Use for:** Maximum Android compatibility

### Generous Padding

```javascript
const ICON_PADDING_CONFIG = { [Platform.IOS]: 0.7, [Platform.ANDROID]: 0.5 };
```

**Use for:** Small logos, need lots of space

## 📊 Value Guide

| Value | Content | Padding | Visual        |
| ----- | ------- | ------- | ------------- |
| 1.00  | 100%    | 0%      | ████████████  |
| 0.95  | 95%     | 5%      | █████████████ |
| 0.90  | 90%     | 10%     | ██████████▒   |
| 0.80  | 80%     | 20%     | ████████▒▒    |
| 0.61  | 61%     | 39%     | ███▒▒▒▒▒▒     |
| 0.50  | 50%     | 50%     | ██▒▒▒▒▒▒▒▒    |

## 🚀 After Changing

1. Save `lib/core/ImageProcessor.js`
2. Regenerate icons:
   ```bash
   node cli.js generate --input icon.png --platform all --out output
   ```
3. Test on real devices

## 📱 Platform Tips

### iOS

- Can safely use higher values (0.90-1.0)
- No system clipping
- Recommended: 0.90-0.95

### Android

- Launchers clip with circles/squircles
- Stay above 0.61 for safety
- Recommended: 0.61-0.80

## ⚡ Quick Examples by App Type

```javascript
// Social Media App
{ [Platform.IOS]: 0.95, [Platform.ANDROID]: 0.75 }

// Game with Logo
{ [Platform.IOS]: 0.8, [Platform.ANDROID]: 0.65 }

// Photography App
{ [Platform.IOS]: 1.0, [Platform.ANDROID]: 0.9 }

// Business/Productivity
{ [Platform.IOS]: 0.85, [Platform.ANDROID]: 0.7 }

// E-commerce
{ [Platform.IOS]: 0.9, [Platform.ANDROID]: 0.75 }
```

## 📖 Full Guide

See [Icon Padding Configuration Guide](./guides/ICON_PADDING_CONFIG.md) for detailed information.

---

**Print this page for quick reference while developing!**
