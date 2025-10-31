# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
