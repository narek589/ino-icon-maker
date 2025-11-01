# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.1] - 2025-11-01

### Changed

- **Improved README**: Professional abstract and introduction section
- Added "Why Choose Ino Icon Maker" section highlighting key benefits
- Added output examples section with image placeholders for iOS and Android
- Updated "What's New" section to highlight v1.2.0 features
- More professional and comprehensive documentation structure

### Added

- Image instructions in `docs/assets/README-IMAGES.md` for contributors

## [1.2.0] - 2025-11-01

### Added

- **Custom Icon Sizes**: Users can now customize icon generation with scale factors, add custom sizes, or exclude specific sizes
  - Scale all icons by a factor (e.g., `--scale 1.2` for 20% larger icons)
  - Add custom sizes not in defaults (e.g., add "1024x1024@3x" for iOS)
  - Exclude specific sizes from generation (e.g., skip "monochrome" or "ldpi" for Android)
- **New CLI flags**:
  - `--scale <factor>` - Global scale factor for all icons
  - `--ios-scale <factor>` - iOS-specific scale factor
  - `--android-scale <factor>` - Android-specific scale factor
  - `--exclude <sizes>` - Comma-separated sizes to exclude
  - `--custom-config <path>` - Path to JSON file with full customization
- **New SizeConfigManager class**: Core size customization logic with validation
- **HTTP API support**: Custom sizes can be passed via `customSizes` parameter
- **Programmatic API support**: `customSizes` option in all generation functions
- **Comprehensive documentation**: New guide at `docs/guides/CUSTOM_SIZES.md` with examples

### Changed

- Updated package description to include custom sizes feature
- Enhanced API exports to include `SizeConfigManager` and `sizeConfigManager`
- Updated `README.md` with custom sizes examples
- Updated `DOCUMENTATION_MAP.md` to include custom sizes guide

### Technical

- Added `lib/core/SizeConfigManager.js` - Core size customization manager
- Updated `PlatformGenerator` base class to support custom sizes
- Updated `IconGeneratorFactory` to pass custom sizes to generators
- Updated all CLI helpers to parse and validate size customization
- Updated HTTP server validators and handlers to support custom sizes
- Maintains backward compatibility - all existing code works without changes

### Notes

- Default icon sizes remain unchanged and follow platform best practices
- Custom sizes are completely optional
- Users cannot override existing default sizes (only scale, add, or exclude)
- All custom size configurations are validated before generation

## [1.1.5] - 2025-10-31

### Fixed

- **Android adaptive icon safe zone**: Corrected foreground padding to match official Android specification
- Fixed incorrect padding calculation: was using 21dp per side (42dp total), now correctly uses **18dp per side (36dp total)**
- Fixed bug where calculated `innerSize` was computed but never used in the resize operation
- Safe zone now properly sized at 66dp within 108dp canvas (61.11% content area)
- Foreground images are now correctly resized to fit the 66dp safe zone, then extended with 18dp transparent padding
- Foreground icons will no longer be clipped by circular/squircle launcher masks

### Changed

- Updated `ImageProcessor.prepareAdaptiveLayer()` to use correct formula: `safeZoneRatio = 66/108`
- Foreground layer now properly resizes to safe zone first, then extends with transparent padding
- Enhanced documentation with detailed Android adaptive icon specifications
- Improved code comments explaining safe zone dimensions per official Android guidelines
- Added comprehensive fix documentation in `docs/ANDROID_ADAPTIVE_ICON_FIX.md`

### References

- [Android Adaptive Icon Design Guidelines](https://developer.android.com/develop/ui/views/launch/icon_design_adaptive)

## [1.1.4] - 2025-10-31 [DEPRECATED - Use 1.1.5]

### Fixed

- **Android adaptive icon safe zone**: Corrected foreground padding to match official Android specification
- Fixed incorrect padding calculation: was using 21dp per side (42dp total), now correctly uses **18dp per side (36dp total)**
- Fixed bug where calculated `innerSize` was computed but never used in the resize operation
- Safe zone now properly sized at 66dp within 108dp canvas (61.11% content area)
- Foreground images are now correctly resized to fit the 66dp safe zone, then extended with 18dp transparent padding
- Foreground icons will no longer be clipped by circular/squircle launcher masks

### Changed

- Updated `ImageProcessor.prepareAdaptiveLayer()` to use correct formula: `safeZoneRatio = 66/108`
- Foreground layer now properly resizes to safe zone first, then extends with transparent padding
- Enhanced documentation with detailed Android adaptive icon specifications
- Improved code comments explaining safe zone dimensions per official Android guidelines
- Added comprehensive fix documentation in `docs/ANDROID_ADAPTIVE_ICON_FIX.md`

### References

- [Android Adaptive Icon Design Guidelines](https://developer.android.com/develop/ui/views/launch/icon_design_adaptive)

## [1.1.3] - 2025-10-31

### Added

- **IOSGenerator adaptive mode**: iOS now has native layer-based generation support
- `IOSGenerator.generateAdaptiveMode()` method for creating composites from layers
- Both iOS and Android generators now fully support unified layer-based workflow via CLI

### Fixed

- **CLI adaptive mode**: Fixed generation for both iOS and Android platforms
- IOSGenerator now properly handles null input in adaptive mode
- CLI commands like `ino-icon generate -fg foreground.png` now work correctly

### Changed

- IOSGenerator overrides `generate()` to detect and handle adaptive mode
- Consistent adaptive mode implementation across both platform generators

## [1.1.2] - 2025-10-31

### Fixed

- **CLI adaptive mode**: Fixed "Input file not found: undefined" error
- CLI now passes `null` instead of `undefined` for input parameter in adaptive mode
- Input parameter not needed in adaptive mode (uses `genOptions.adaptiveIcon`)
- Fixes both single platform and multi-platform adaptive generation

## [1.1.1] - 2025-10-31

### Fixed

- **CLI adaptive mode**: Background parameter now optional, defaults to `#111111`
- **CLI flag**: Correct flag is `-bg` or `--background`, not `--bg-color`
- **ZIP downloads**: Added file sync delay and verification to prevent corruption
- **HTTP API**: ZIP files now properly finalized before download (200ms delay + readability check)

### Changed

- CLI adaptive mode now only requires `--foreground` parameter
- Updated help text to clarify background defaults to `#111111`
- Configuration display shows default background when not provided

## [1.1.0] - 2025-10-31

### Added

- **Unified Layer-Based Workflow** - Both iOS and Android now support foreground/background layers
- **iOS Composite Generation** - iOS creates composite from layers (background + centered foreground with 20% padding)
- **Android Adaptive Icons Enhanced** - Foreground gets 20% padding (safe zone) to prevent launcher clipping
- **Default Background Color** - Automatically uses #111111 when no background is provided
- **Smart Background Priority** - Background file → color param → default #111111
- **`createCompositeFromLayers()` method** in ImageProcessor for iOS layer composition

### Changed

- **Breaking**: `file` parameter no longer fallback for Android background - use `foreground` + `background` exclusively
- Foreground layers now use `contain` fit with 20% padding (zoomed out for safety)
- Background layers use `cover` fit (fills entire space without distortion)
- iOS icons now generated from composite when using layer-based workflow
- HTTP API accepts `foreground` parameter for both iOS and Android

### Fixed

- Aspect ratio issue resolved - foreground has padding, background fills space
- HTTP API body parsing middleware added (Express json/urlencoded)
- Optional chaining for safer request parameter access
- iOS and "all" platforms now work with curl using only foreground parameter

## [1.0.11] - 2025-10-30

### Added

- **AVIF format support** - Next-generation image format with superior compression
- **TIFF format support** - Professional/high-quality source images
- Support for 6 image formats total: JPEG, PNG, WebP, AVIF, TIFF

### Changed

- Updated all documentation to reflect new supported formats
- Enhanced format validation in ImageProcessor
- Updated HTTP API to accept AVIF and TIFF uploads

## [1.0.10] - 2025-10-30

### Added

- Version flag: `-v` and `--version` to show current version number

### Changed

- Updated CLI to display version from package.json dynamically

## [1.0.9] - 2025-10-30

### Added

- HTTP API now creates combined ZIP for `platform=all` requests
- Default platform changed to `all` for HTTP API

### Fixed

- Fixed HTTP API returning JSON instead of ZIP for `platform=all`
- Combined ZIP creation for multiple platforms now works correctly

### Changed

- Output filename for combined platforms: `ios-icons.zip`
- API documentation updated to show default platform behavior

## [1.0.7] - 2025-10-30

### Changed

- Cleaned up root directory - removed duplicate markdown files
- All documentation now organized in `docs/` folder only
- Updated to use `npm install -D` for dev dependencies
- Simplified documentation structure (removed 404 links)
- Added `.cursorrules` to enforce documentation organization

### Removed

- Duplicate files from root: ARCHITECTURE.md, CHANGELOG.md, CODE_OF_CONDUCT.md, CONTRIBUTING.md, SECURITY.md
- Old documentation files: COMMANDS.md, EXAMPLES.md, GETTING_STARTED_WITH_GITHUB.md, REPOSITORY_IMPROVEMENTS.md

### Documentation

- Simplified `docs/README.md` - removed non-existent guide links
- Kept only essential documentation: Quick Start, Examples, Framework Integration, Architecture
- All markdown files now in `docs/` folder (except root README.md)

## [1.0.6] - 2025-10-30

### Added

- Comprehensive documentation folder (`docs/`) with 14 markdown files
- Complete examples for all use cases (200+ code samples)
- React Native integration guide with automation scripts
- Flutter integration guide with Dart scripts and flavors
- CI/CD examples for 7 major platforms (GitHub Actions, GitLab CI, Jenkins, etc.)
- Complete Git workflow guide with conventional commits
- SOLID principles documentation with real code examples
- Refactoring details with before/after comparisons
- Documentation navigation map
- GitHub stars and npm downloads badges

### Changed

- Enhanced README with prominent documentation section
- Updated package.json with correct GitHub repository URL
- Added funding information to package.json
- Improved link organization in README

### Documentation

- Created `docs/README.md` - Documentation hub
- Created `docs/examples/ALL_EXAMPLES.md` - All variants and examples
- Created `docs/examples/REACT_NATIVE.md` - React Native integration
- Created `docs/examples/FLUTTER.md` - Flutter integration
- Created `docs/examples/CI_CD.md` - CI/CD automation
- Created `docs/guides/QUICK_START.md` - 5-minute quick start
- Created `docs/guides/GIT_WORKFLOW.md` - Git workflow guide
- Created `docs/architecture/REFACTORING_DETAILS.md` - SOLID principles
- Created `docs/DOCUMENTATION_MAP.md` - Visual navigation

## [1.0.5] - 2025-10-30

### Changed

- Updated repository URLs to new GitHub location (narek589/ino-icon-maker)
- Enhanced README with additional badges and contribution guidelines
- Improved documentation structure

### Added

- CONTRIBUTING.md with comprehensive contribution guidelines
- CHANGELOG.md for tracking version history
- Additional badges in README (GitHub, Node.js version)

## [1.0.4] - Previous Release

### Added

- Initial public release
- iOS icon generation (18 icons)
- Android icon generation (13 icons)
- CLI with multiple commands
- Library API support
- HTTP API server
- ZIP export functionality
- Support for JPEG, PNG, WebP formats

### Features

- `ino-icon` and `iim` CLI commands
- Interactive mode
- Parallel processing for better performance
- Comprehensive error handling
- Beautiful terminal output with colors and tables

## Future Plans

### Planned Features

- [ ] Web PWA icon support
- [ ] Windows app icon support
- [ ] macOS app icon support
- [ ] Configuration file support (.iconrc)
- [ ] Batch processing multiple icons
- [ ] Image optimization options
- [ ] Custom icon naming templates
- [ ] Icon preview before generation
- [ ] Support for SVG input
- [ ] Docker support

### Performance Improvements

- [ ] Parallel processing optimization
- [ ] Memory usage optimization
- [ ] Caching mechanism for repeated generations

### Documentation

- [ ] Video tutorials
- [ ] Interactive examples
- [ ] More platform-specific guides
- [ ] API documentation site

---

For more details about each release, visit the [releases page](https://github.com/narek589/ino-icon-maker/releases).
