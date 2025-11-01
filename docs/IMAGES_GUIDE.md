# 📸 Images Guide

## Overview

This guide explains how the README preview images are structured and how to update them if needed.

## Current Images

The project includes two high-quality preview images in `docs/assets/`:

### 1. iOS Preview Image ✓

**Path:** `docs/assets/ios-example.png`  
**Size:** 1920×1080px  
**Content:** Complete iOS AppIcon.appiconset layout showing all 19 icon sizes  
**Background:** Dark gray (#2D2D2D) for professional appearance  
**Details:**

- Shows icons at all pt sizes (20pt to 1024pt)
- Displays @2x and @3x scale factors
- Includes size labels for each icon
- Designed to match Xcode asset catalog appearance

### 2. Android Preview Image ✓

**Path:** `docs/assets/android-example.png`  
**Size:** 1920×1080px  
**Content:** Android adaptive icon variations  
**Background:** Transparent with checkered pattern  
**Details:**

- Shows all adaptive icon shapes (Circle, Squircle, Rounded Square, Square)
- Displays Full Bleed Layers, Legacy Icon, Round Icon
- Includes Google Play Store icon (512×512)
- Demonstrates adaptive icon capabilities

## How Images Are Used

The images appear in the main `README.md` in a side-by-side comparison:

```markdown
<table>
<tr>
  <td width="50%">
    <img src="./docs/assets/ios-example.png" alt="iOS Icons Preview" width="95%"/>
    ### 🍎 iOS (19 icons)
  </td>
  <td width="50%">
    <img src="./docs/assets/android-example.png" alt="Android Icons Preview" width="95%"/>
    ### 🤖 Android (33 icons)
  </td>
</tr>
</table>
```

## Updating Images

If you need to regenerate or improve the preview images:

### Step 1: Generate Icons

```bash
# Generate sample icons
ino-icon generate -fg test-directory/input/icon.png -o preview-output
```

### Step 2: Create Preview Mockups

**For iOS:**

1. Open the generated `AppIcon.appiconset/` folder
2. Take a screenshot or create a design mockup in Figma/Sketch
3. Arrange icons in a grid showing different sizes
4. Add labels for pt sizes and scale factors
5. Use dark background (#2D2D2D)

**For Android:**

1. Open the generated `android-icons/` folders
2. Create a mockup showing different adaptive icon shapes
3. Display Circle, Squircle, Rounded Square, Square variations
4. Include legacy and Play Store icons
5. Use transparent background with checkered pattern

### Step 3: Design Tools

**Recommended tools:**

- **Figma** (Free) - [figma.com](https://figma.com)
- **Sketch** (macOS) - [sketch.com](https://sketch.com)
- **Affinity Designer** - [affinity.serif.com](https://affinity.serif.com)
- **Adobe Photoshop** - For advanced editing

### Step 4: Export Settings

- **Format:** PNG
- **Dimensions:** 1920×1080px (16:9 ratio)
- **Quality:** High (85-95%)
- **Color Space:** sRGB
- **Target Size:** 200-400KB per image

### Step 5: Optimize Images

```bash
# Using ImageMagick (if installed)
convert input.png -quality 90 -strip output.png

# Using pngquant (if installed)
pngquant --quality=85-95 input.png -o output.png

# Using online tools
# - TinyPNG: https://tinypng.com/
# - Squoosh: https://squoosh.app/
```

### Step 6: Replace Images

```bash
# Backup old images
cp docs/assets/ios-example.png docs/assets/ios-example.png.backup
cp docs/assets/android-example.png docs/assets/android-example.png.backup

# Replace with new images
cp new-ios-preview.png docs/assets/ios-example.png
cp new-android-preview.png docs/assets/android-example.png

# Test in README
# Open README.md in GitHub or with a markdown preview tool
```

## Image Guidelines

### Visual Design

- ✅ Use consistent styling between both images
- ✅ Ensure text labels are readable
- ✅ Show actual generated icons (not placeholders)
- ✅ Use professional color scheme
- ✅ Maintain aspect ratio when resizing

### Technical Requirements

- ✅ PNG format with transparency support
- ✅ High resolution for retina displays
- ✅ Optimized file size (<500KB)
- ✅ Consistent dimensions (1920×1080px)
- ✅ Test on light and dark GitHub themes

### Content Requirements

- ✅ Show all major icon sizes
- ✅ Include size labels
- ✅ Display platform-specific features
- ✅ Use visually appealing example icon
- ✅ Demonstrate quality output

## Testing Images

After updating, verify:

1. **GitHub Repository** - Check how images display on the main repo page
2. **npm Package Page** - Verify images show correctly on npmjs.com
3. **Mobile View** - Test responsive display on mobile GitHub
4. **Light/Dark Themes** - Check visibility in both GitHub themes
5. **Load Time** - Ensure images load quickly

## Troubleshooting

**Images not showing:**

- Check file paths are correct relative to README.md
- Verify images are committed to git
- Ensure file names match exactly (case-sensitive)

**Images too large:**

- Optimize using pngquant or TinyPNG
- Reduce dimensions if necessary
- Consider using WebP format with PNG fallback

**Images look blurry:**

- Use higher resolution source images
- Export at 2x resolution (3840×2160) then scale down
- Ensure PNG quality is set to 90+

---

For more details, see [README-IMAGES.md](./assets/README-IMAGES.md) in the assets folder.
