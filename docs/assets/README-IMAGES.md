# README Images

## Available Images

This directory contains preview images used in the main README.

### 1. **ios-example.png** ✓

- Shows iOS AppIcon.appiconset structure with all icon sizes
- Displays icons in dark theme preview
- Shows different sizes: 20pt, 29pt, 38pt, 40pt, 60pt, 64pt, 68pt, 76pt, 83.5pt, 152×152pt, 167×167pt, 1024pt
- Includes @2x and @3x scale factors
- **Dimensions:** 1920×1080px
- **Background:** Dark gray (#2D2D2D)

### 2. **android-example.png** ✓

- Shows Android adaptive icon variations
- Displays different shapes: Circle, Squircle, Rounded Square, Square
- Shows Full Bleed Layers, Legacy Icon, Round Icon, and Google Play Store icon
- **Dimensions:** 1920×1080px
- **Background:** Transparent with checkered pattern

## Image Specifications

- **Format:** PNG
- **Quality:** High resolution for retina displays
- **Size:** Optimized for fast loading (~100-300KB each)
- **Usage:** Displayed in README.md side-by-side comparison table

## Display in README

Images are displayed using an HTML table with two columns:

- **Left:** iOS preview with dark background
- **Right:** Android preview with transparent background
- **Width:** Each image at 95% of column width for visual balance
- **Styling:** Rounded corners and subtle shadows (where supported)

## Updating Images

If you need to regenerate or update these images:

1. Generate icons using the CLI:

```bash
ino-icon generate -fg icon.png -o preview-output
```

2. Create preview screenshots:

   - **iOS:** Capture AppIcon.appiconset folder view in Xcode or Finder
   - **Android:** Capture mipmap folders or create design mockup

3. Recommended tools:

   - **Figma** - For creating preview mockups
   - **Sketch** - For macOS design
   - **Screenshot + ImageMagick** - For automated captures

4. Save as PNG with appropriate dimensions (1920×1080px recommended)

5. Optimize images:

```bash
# Using ImageMagick
convert input.png -quality 85 -strip output.png

# Using pngquant
pngquant --quality=80-95 input.png -o output.png
```

## Best Practices

- Keep images under 500KB for faster page loads
- Use consistent dimensions for both images
- Maintain high quality for GitHub's retina display rendering
- Test on both light and dark GitHub themes
- Ensure images are clear and readable at smaller sizes
