# 📸 Images Guide

## Required Images for README

To make the README look perfect, you need to add these preview images:

### 1. iOS Preview Image
**Path:** `assets/ios-preview.png`
**Recommended size:** 600×400px
**Content:** Screenshot showing iOS icons in different sizes (iPhone, iPad, Apple Watch)

### 2. Android Preview Image
**Path:** `assets/android-preview.png`
**Recommended size:** 600×400px
**Content:** Screenshot showing Android icons in different densities (ldpi to xxxhdpi)

## How to Create Preview Images

### Option 1: Use Generated Icons

1. Generate icons for both platforms:
```bash
ino-icon generate -i your-icon.png -o preview-output -p all
```

2. Take screenshots of the output folders
3. Resize to 600×400px
4. Save as PNG

### Option 2: Design Custom Previews

Create mockup images showing:
- **iOS**: Multiple icon sizes on iPhone/iPad interface
- **Android**: Icon grid showing different densities

### Tools for Creating Previews

- [Figma](https://figma.com) - Free design tool
- [Canva](https://canva.com) - Easy mockup creator
- [Sketch](https://sketch.com) - macOS design tool
- Screenshot tools + Image editors

## Folder Structure

```
ino-icon-maker/
├── assets/
│   ├── ios-preview.png       # iOS preview
│   ├── android-preview.png   # Android preview
│   └── banner.png           # (Optional) Hero banner
└── README.md
```

## Image Specifications

- **Format:** PNG (for transparency)
- **Size:** ~100-200KB each
- **Dimensions:** 600×400px (maintains aspect ratio in GitHub)
- **Quality:** High resolution for retina displays

## Testing Images

After adding images, test on:
1. GitHub repository page
2. npm package page
3. Mobile GitHub view

## Temporary Solution

Until you add images, the README will show broken image links. You can either:

1. **Remove image references** temporarily:
```markdown
### 🍎 iOS / iPadOS / watchOS
<!-- Image will be added soon -->
```

2. **Use placeholder service**:
```markdown
<img src="https://via.placeholder.com/600x400/4A90E2/ffffff?text=iOS+Icons" />
```

3. **Add images to GitHub** and the README will automatically work!

---

**Tip:** Commit images to a new `assets/` folder in your repository first, then update the README.

