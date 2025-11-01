# 🎯 Flutter Integration Guide

Complete guide for using Ino Icon Maker with Flutter projects.

## 📖 Table of Contents

- [Quick Setup](#quick-setup)
- [Manual Integration](#manual-integration)
- [Automated Approach](#automated-approach)
- [Multiple Flavors](#multiple-flavors)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Setup

### Method 1: Auto-Install (Easiest - NEW!)

```bash
# From your Flutter project root
npx ino-icon-maker generate -i assets/icon.png --install
```

**What happens:**

- Automatically detects Flutter project
- Generates icons for both platforms
- Installs iOS icons to `ios/Runner/Assets.xcassets/AppIcon.appiconset/`
- Installs Android icons to `android/app/src/main/res/mipmap-*/`
- Shows success message with installation paths

### Method 2: Direct Command

```bash
# Navigate to your Flutter project
cd /path/to/your-flutter-project

# Generate and install icons in one command
npx ino-icon-maker generate -i assets/icon.png -o temp -p all && \
cp -r temp/AppIcon.appiconset ios/Runner/Assets.xcassets/ && \
cp -r temp/android-icons/* android/app/src/main/res/ && \
rm -rf temp

echo "✅ Icons installed!"
```

### Method 3: Makefile (Recommended for Manual Control)

Create a `Makefile` in your project root:

```makefile
.PHONY: icons

icons:
	@echo "🎨 Generating icons..."
	@npx ino-icon-maker generate -i assets/icon.png -o temp -p all
	@cp -r temp/AppIcon.appiconset ios/Runner/Assets.xcassets/
	@cp -r temp/android-icons/* android/app/src/main/res/
	@rm -rf temp
	@echo "✅ Icons installed!"
```

Then run:

```bash
make icons
```

---

## 📱 Manual Integration

### Step 1: Generate Icons

```bash
# Navigate to your Flutter project
cd /path/to/your-flutter-project

# Generate icons
npx ino-icon-maker generate -i assets/icon.png -o ./temp -p all
```

### Step 2: iOS Integration

```bash
# Copy to iOS Runner
cp -r temp/AppIcon.appiconset ios/Runner/Assets.xcassets/AppIcon.appiconset
```

**Flutter iOS structure:**

```
ios/
└── Runner/
    └── Assets.xcassets/
        └── AppIcon.appiconset/
            ├── Icon-App-20x20@2x.png
            ├── Icon-App-29x29@2x.png
            ├── ...
            └── Contents.json
```

### Step 3: Android Integration

```bash
# Copy to Android res directory
cp -r temp/android-icons/mipmap-* android/app/src/main/res/
```

**Flutter Android structure:**

```
android/
└── app/
    └── src/
        └── main/
            └── res/
                ├── mipmap-hdpi/
                ├── mipmap-mdpi/
                ├── mipmap-xhdpi/
                ├── mipmap-xxhdpi/
                └── mipmap-xxxhdpi/
```

### Step 4: Clean Up

```bash
rm -rf temp
```

---

## 🤖 Automated Approach

### Install ino-icon-maker

```bash
# Install as dev dependency
npm install -D ino-icon-maker
```

### Create Dart Script

**tool/generate_icons.dart:**

```dart
import 'dart:io';

Future<void> main() async {
  print('🎨 Generating app icons...\n');

  try {
    // Generate icons
    print('Generating icons...');
    final generateResult = await Process.run(
      'npx',
      [
        'ino-icon-maker',
        'generate',
        '-i',
        'assets/icon.png',
        '-o',
        'temp',
        '-p',
        'all',
      ],
    );

    if (generateResult.exitCode != 0) {
      throw Exception('Icon generation failed: ${generateResult.stderr}');
    }

    print('✓ Icons generated\n');

    // Install iOS icons
    print('📱 Installing iOS icons...');
    final iosTarget = Directory('ios/Runner/Assets.xcassets/AppIcon.appiconset');
    if (await iosTarget.exists()) {
      await iosTarget.delete(recursive: true);
    }
    await copyDirectory(
      Directory('temp/AppIcon.appiconset'),
      iosTarget,
    );
    print('✓ iOS icons installed\n');

    // Install Android icons
    print('🤖 Installing Android icons...');
    final androidIconsDir = Directory('temp/android-icons');
    final mipmapDirs = await androidIconsDir
        .list()
        .where((entity) => entity is Directory && entity.path.contains('mipmap-'))
        .toList();

    for (final dir in mipmapDirs) {
      final dirName = dir.path.split('/').last;
      final targetDir = Directory('android/app/src/main/res/$dirName');
      await copyDirectory(dir as Directory, targetDir);
    }
    print('✓ Android icons installed\n');

    // Clean up
    print('🧹 Cleaning up...');
    await Directory('temp').delete(recursive: true);
    print('✓ Cleanup complete\n');

    print('✅ All done! Your app icons have been updated.\n');
    print('Next steps:');
    print('  iOS: Run flutter run');
    print('  Android: Run flutter run');
  } catch (e) {
    print('❌ Error: $e');
    exit(1);
  }
}

Future<void> copyDirectory(Directory source, Directory destination) async {
  if (!await destination.exists()) {
    await destination.create(recursive: true);
  }

  await for (final entity in source.list(recursive: false)) {
    if (entity is Directory) {
      final newDirectory = Directory('${destination.path}/${entity.path.split('/').last}');
      await copyDirectory(entity, newDirectory);
    } else if (entity is File) {
      await entity.copy('${destination.path}/${entity.path.split('/').last}');
    }
  }
}
```

### Run the Script

```bash
dart run tool/generate_icons.dart
```

---

## 🎨 Multiple Flavors (Dev, Staging, Prod)

### Setup

```
assets/
├── icons/
│   ├── dev.png
│   ├── staging.png
│   └── prod.png
```

### Script with Flavor Support

**tool/generate_icons.dart:**

```dart
import 'dart:io';

Future<void> main(List<String> args) async {
  final flavor = args.isNotEmpty ? args[0] : 'dev';
  final iconPath = 'assets/icons/$flavor.png';

  print('🎨 Generating $flavor icons...\n');

  if (!await File(iconPath).exists()) {
    print('❌ Icon not found: $iconPath');
    exit(1);
  }

  // Generate icons
  final generateResult = await Process.run(
    'npx',
    [
      'ino-icon-maker',
      'generate',
      '-i',
      iconPath,
      '-o',
      'temp',
      '-p',
      'all',
      '-f',
    ],
  );

  if (generateResult.exitCode != 0) {
    throw Exception('Icon generation failed');
  }

  // Install icons (same as above)...

  print('✅ $flavor icons installed!\n');
}
```

### Usage

```bash
# Dev icons
dart run tool/generate_icons.dart dev

# Staging icons
dart run tool/generate_icons.dart staging

# Production icons
dart run tool/generate_icons.dart prod
```

### Flutter Flavors Configuration

**android/app/build.gradle:**

```gradle
android {
    flavorDimensions "app"

    productFlavors {
        dev {
            dimension "app"
            applicationIdSuffix ".dev"
            manifestPlaceholders = [appIcon: "@mipmap/ic_launcher"]
        }

        staging {
            dimension "app"
            applicationIdSuffix ".staging"
            manifestPlaceholders = [appIcon: "@mipmap/ic_launcher"]
        }

        prod {
            dimension "app"
            manifestPlaceholders = [appIcon: "@mipmap/ic_launcher"]
        }
    }
}
```

---

## 🔄 Makefile Approach

### Create Makefile

**Makefile:**

```makefile
.PHONY: icons icons-dev icons-staging icons-prod

icons:
	@npx ino-icon-maker generate -i assets/icon.png -o temp -p all
	@cp -r temp/AppIcon.appiconset ios/Runner/Assets.xcassets/AppIcon.appiconset
	@cp -r temp/android-icons/* android/app/src/main/res/
	@rm -rf temp
	@echo "✅ Icons installed!"

icons-dev:
	@npx ino-icon-maker generate -i assets/icons/dev.png -o temp -p all -f
	@cp -r temp/AppIcon.appiconset ios/Runner/Assets.xcassets/AppIcon.appiconset
	@cp -r temp/android-icons/* android/app/src/main/res/
	@rm -rf temp
	@echo "✅ Dev icons installed!"

icons-staging:
	@npx ino-icon-maker generate -i assets/icons/staging.png -o temp -p all -f
	@cp -r temp/AppIcon.appiconset ios/Runner/Assets.xcassets/AppIcon.appiconset
	@cp -r temp/android-icons/* android/app/src/main/res/
	@rm -rf temp
	@echo "✅ Staging icons installed!"

icons-prod:
	@npx ino-icon-maker generate -i assets/icons/prod.png -o temp -p all -f
	@cp -r temp/AppIcon.appiconset ios/Runner/Assets.xcassets/AppIcon.appiconset
	@cp -r temp/android-icons/* android/app/src/main/res/
	@rm -rf temp
	@echo "✅ Production icons installed!"
```

### Usage

```bash
make icons
make icons-dev
make icons-staging
make icons-prod
```

---

## 🎯 Integration with flutter_launcher_icons

You can use `ino-icon-maker` as an alternative to `flutter_launcher_icons`!

### Using ino-icon-maker (Recommended)

```bash
# Simple, fast, works every time
npx ino-icon-maker generate -i assets/icon.png -o temp -p all
cp -r temp/AppIcon.appiconset ios/Runner/Assets.xcassets/
cp -r temp/android-icons/* android/app/src/main/res/
rm -rf temp
```

**Or** use flutter_launcher_icons:

### pubspec.yaml

```yaml
dev_dependencies:
  flutter_launcher_icons: ^0.13.1

flutter_icons:
  android: true
  ios: true
  image_path: "assets/icon.png"
```

Then run:

```bash
flutter pub get
flutter pub run flutter_launcher_icons
```

---

## 🐛 Troubleshooting

### Icons not updating on iOS

```bash
# Clean iOS build
cd ios
rm -rf Pods
rm -rf build
pod install
cd ..

# Run
flutter clean
flutter pub get
flutter run
```

### Icons not updating on Android

```bash
# Clean Android build
cd android
./gradlew clean
cd ..

# Run
flutter clean
flutter pub get
flutter run
```

### "No such file or directory"

Make sure paths are correct:

```bash
# Check if icon exists
ls -la assets/icon.png

# Check Flutter directory structure
ls -la ios/Runner/Assets.xcassets/
ls -la android/app/src/main/res/
```

### Icon appears stretched/distorted

**Solution:** Ensure your source image is:

- Square (1:1 aspect ratio)
- At least 1024×1024 pixels
- Centered content
- Transparent background (PNG)

---

## 📋 Complete Workflow

### 1. Create Icon

Create your app icon (1024×1024 PNG):

```
assets/icon.png
```

### 2. Create Makefile

Create `Makefile` in project root:

```makefile
.PHONY: icons

icons:
	@npx ino-icon-maker generate -i assets/icon.png -o temp -p all
	@cp -r temp/AppIcon.appiconset ios/Runner/Assets.xcassets/
	@cp -r temp/android-icons/* android/app/src/main/res/
	@rm -rf temp
	@echo "✅ Icons installed!"
```

### 3. Generate

```bash
make icons
```

### 4. Test

```bash
flutter clean
flutter pub get
flutter run
```

---

## ✅ Checklist

After icon generation:

- [ ] iOS icons in `ios/Runner/Assets.xcassets/AppIcon.appiconset/`
- [ ] Android icons in `android/app/src/main/res/mipmap-*/`
- [ ] Run `flutter clean`
- [ ] Run `flutter pub get`
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Test on real devices
- [ ] Check home screen icon
- [ ] Check app switcher icon
- [ ] Check splash screen (if using icon)

---

## 🎨 Best Practices

1. **Source Image Quality**

   - Use 1024×1024 or larger
   - Square aspect ratio
   - PNG with transparency
   - Simple, bold design

2. **Testing**

   - Test on multiple devices
   - Check different screen sizes
   - Verify in light and dark modes
   - Check icon corners (iOS rounds them)

3. **Version Control**

   - Commit source icon: `assets/icon.png`
   - Don't commit generated icons (optional)
   - Add to CI/CD pipeline

4. **Automation**
   - Use scripts for consistency
   - Generate on pre-commit hook
   - Automate in CI/CD

---

## 📚 Additional Resources

- **Flutter Docs**: https://flutter.dev/docs
- **iOS Icon Guidelines**: https://developer.apple.com/design/human-interface-guidelines/app-icons
- **Android Icon Guidelines**: https://developer.android.com/guide/practices/ui_guidelines/icon_design

---

**Need more help?** [Open an issue](https://github.com/narek589/ino-icon-maker/issues)
