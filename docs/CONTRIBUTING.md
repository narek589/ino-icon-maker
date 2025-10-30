# Contributing to Ino Icon Maker

First off, thank you for considering contributing to Ino Icon Maker! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Architecture](#project-architecture)
- [Pull Request Process](#pull-request-process)
- [Coding Guidelines](#coding-guidelines)
- [Testing](#testing)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and respectful environment. Please be kind and courteous.

## 🤔 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the [issue list](https://github.com/narek589/ino-icon-maker/issues) as you might find that you don't need to create one.

**When submitting a bug report, please include:**

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Your environment (OS, Node.js version, npm version)
- Screenshots if applicable
- Any error messages or logs

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- A clear and descriptive title
- A detailed description of the proposed feature
- Explain why this enhancement would be useful
- List any alternatives you've considered

### Adding New Platform Support

Want to add support for a new platform (e.g., Web PWA, Windows, macOS)? Great! Please:

1. Review the [ARCHITECTURE.md](ARCHITECTURE.md) to understand the platform generator pattern
2. Create a new configuration file in `lib/config/`
3. Create a new generator class extending `PlatformGenerator`
4. Register it in `IconGeneratorFactory`
5. Add tests
6. Update documentation

## 🛠️ Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Setup Steps

1. **Fork the repository** on GitHub

2. **Clone your fork:**

   ```bash
   git clone https://github.com/YOUR_USERNAME/ino-icon-maker.git
   cd ino-icon-maker
   ```

3. **Add upstream remote:**

   ```bash
   git remote add upstream https://github.com/narek589/ino-icon-maker.git
   ```

4. **Install dependencies:**

   ```bash
   npm install
   ```

5. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Running Locally

```bash
# Test CLI commands
node cli.js generate -i test-icon.png -o ./test-output -p all

# Run in development mode with auto-reload
npm run dev

# Run tests
npm test

# Test as global package (without publishing)
npm link
ino-icon generate -i icon.png -o output -p all
npm unlink  # When done testing
```

## 🏗️ Project Architecture

This project follows **SOLID principles** and uses several design patterns:

### Core Structure

```
lib/
├── core/                    # Platform-agnostic utilities
│   ├── ImageProcessor.js   # Image processing operations
│   ├── FileManager.js      # File system operations
│   └── ArchiveManager.js   # ZIP creation
├── platforms/              # Platform-specific generators
│   ├── PlatformGenerator.js    # Abstract base class
│   ├── IOSGenerator.js         # iOS implementation
│   └── AndroidGenerator.js     # Android implementation
├── config/                 # Platform configurations
│   ├── ios-config.js
│   └── android-config.js
├── IconGeneratorFactory.js # Factory for creating generators
└── generator.js            # Public API wrapper
```

### Key Principles

- **Single Responsibility**: Each class has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Dependency Injection**: All dependencies injected via constructor
- **Factory Pattern**: Centralized platform creation
- **Template Method**: Common algorithm structure in base class

For more details, see [ARCHITECTURE.md](ARCHITECTURE.md).

## 🔄 Pull Request Process

1. **Update your fork:**

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Make your changes** following the coding guidelines

3. **Test your changes:**

   ```bash
   npm test
   node cli.js generate -i test.png -o test-output -p all
   ```

4. **Commit your changes:**

   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

   Use conventional commit messages:

   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

5. **Push to your fork:**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub:
   - Provide a clear title and description
   - Reference any related issues
   - Include screenshots for UI changes
   - Ensure all tests pass

## 📝 Coding Guidelines

### JavaScript Style

- Use ES6+ features (async/await, classes, arrow functions)
- Use meaningful variable and function names
- Keep functions small and focused (< 50 lines ideally)
- Add JSDoc comments for public methods

### Example:

```javascript
/**
 * Generates icons for a specific platform
 * @param {string} platform - Platform identifier (ios, android)
 * @param {string} inputPath - Path to source image
 * @param {string} outputPath - Output directory path
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} Generation result
 */
async function generateIconsForPlatform(
	platform,
	inputPath,
	outputPath,
	options
) {
	// Implementation
}
```

### File Naming

- Use PascalCase for classes: `ImageProcessor.js`
- Use kebab-case for config files: `ios-config.js`
- Use camelCase for utilities: `generator.js`

### Error Handling

- Validate inputs early
- Provide clear, actionable error messages
- Clean up resources in `finally` blocks
- Log errors with context

### Performance

- Use `Promise.all()` for parallel operations
- Clone Sharp images for concurrent processing
- Avoid blocking operations
- Clean up temporary files

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- ImageProcessor.test.js

# Run with coverage
npm test -- --coverage
```

### Writing Tests

- Test all core utilities in isolation
- Mock external dependencies
- Test error cases
- Test edge cases
- Add integration tests for new features

### Test Structure

```javascript
import { ImageProcessor } from "../lib/core/ImageProcessor.js";

describe("ImageProcessor", () => {
	let processor;

	beforeEach(() => {
		processor = new ImageProcessor();
	});

	afterEach(() => {
		// Cleanup
	});

	test("should resize image correctly", async () => {
		// Test implementation
	});
});
```

## 📚 Documentation

When adding features:

- Update README.md if it affects user-facing API
- Update ARCHITECTURE.md for architectural changes
- Update EXAMPLES.md with usage examples
- Add JSDoc comments to code
- Update COMMANDS.md for CLI changes

## 🎯 Areas Needing Contributions

- [ ] Web PWA icon support
- [ ] Windows app icon support
- [ ] macOS app icon support
- [ ] Better error messages
- [ ] More comprehensive tests
- [ ] Performance optimizations
- [ ] Additional image format support
- [ ] Better CLI progress indicators
- [ ] Configuration file support

## 💡 Questions?

Feel free to:

- Open an issue for discussion
- Reach out to maintainers
- Check existing documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Ino Icon Maker! 🚀
