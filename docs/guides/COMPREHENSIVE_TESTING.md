# 🧪 Comprehensive Testing Guide

Complete testing documentation for **Ino Icon Maker** - covers all test types, running tests, and interpreting results.

---

## 📖 Table of Contents

- [Quick Start](#quick-start)
- [Test Categories](#test-categories)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Writing Tests](#writing-tests)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites

```bash
# Node.js 18+ required
node -v

# Install dependencies
npm install
```

### Run All Tests

```bash
# Full test suite
npm test

# Quick tests (unit + core integration)
npm run test:quick

# With coverage report
npm run test:coverage
```

### Run Specific Test Suites

```bash
# Unit tests only (fast)
npm run test:unit

# Integration tests only
npm run test:integration

# E2E tests only
npm run test:e2e

# HTTP API tests (requires server running)
npm run test:api
```

---

## 📂 Test Categories

### 1. Unit Tests (`test/unit/`)

Tests for individual core modules in isolation.

**Files:**

- `ImageProcessor.test.js` - Image operations (load, resize, save, validate)
- `FileManager.test.js` - File system operations
- `ArchiveManager.test.js` - ZIP archive creation

**What's Tested:**

- Image loading and validation
- Image resizing with various dimensions
- Image saving to disk
- File/directory operations
- ZIP archive creation
- Error handling

**Run:**

```bash
npm run test:unit
```

**Duration:** ~10 seconds

---

### 2. Integration Tests (`test/integration/`)

Tests for complete workflows and multi-component interactions.

**Files:**

- `ios-generator.test.js` - iOS icon generation workflow
- `android-generator.test.js` - Android icon generation + adaptive icons
- `custom-sizes.test.js` - Custom size configurations
- `programmatic-api.test.js` - Library API functions
- `http-api.test.js` - HTTP server endpoints

**What's Tested:**

- Complete iOS icon generation (19 icons + Contents.json)
- Complete Android icon generation (all densities)
- Adaptive icon generation (foreground/background)
- Custom size scaling and exclusions
- Programmatic API (quickGenerate, etc.)
- HTTP endpoints (requires server running)
- ZIP creation
- Error handling

**Run:**

```bash
npm run test:integration
```

**Duration:** ~60 seconds

---

### 3. E2E Tests (`test/e2e/`)

End-to-end tests for CLI commands.

**Files:**

- `cli.test.js` - CLI command testing

**What's Tested:**

- CLI commands (generate, serve, info, platforms)
- CLI arguments and flags
- Interactive prompts (simulated)
- CLI error handling
- Output verification

**Run:**

```bash
npm run test:e2e
```

**Duration:** ~30 seconds

---

### 4. HTTP API Tests

Tests for HTTP server endpoints (requires server running).

**Prerequisites:**

```bash
# Terminal 1: Start server
npm run dev

# Terminal 2: Run tests
npm run test:api
```

**What's Tested:**

- Health check endpoint
- Platforms list endpoint
- Icon generation endpoints
- Adaptive icon endpoints
- Custom sizes via API
- Error responses
- File upload handling

**Note:** These tests are included in integration tests but can be run separately.

---

## 🎯 Test Coverage

### Coverage Report

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/lcov-report/index.html
```

### Expected Coverage

| Module                     | Target Coverage | Current |
| -------------------------- | --------------- | ------- |
| Core (lib/core/)           | 90%+            | ✓       |
| Platforms (lib/platforms/) | 85%+            | ✓       |
| API (index.js)             | 90%+            | ✓       |
| Total                      | 80%+            | ✓       |

### What's Covered

✅ **Core Functionality**

- All image processing operations
- All file operations
- ZIP archive creation
- Error handling

✅ **Platform Generators**

- iOS icon generation (all sizes)
- Android icon generation (all densities)
- Adaptive icons (all layers)
- Metadata generation

✅ **Features**

- Custom sizes (scale, add, exclude)
- ZIP creation
- Force overwrite
- Validation

✅ **APIs**

- Programmatic API (all functions)
- HTTP API (all endpoints)
- CLI (all commands)

✅ **Edge Cases**

- Invalid inputs
- Missing files
- Permission errors
- Malformed configurations

---

## ✍️ Writing Tests

### Test Template

```javascript
import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { cleanupDir, TEST_OUTPUT_DIR, getTestIcon } from "../setup.js";
import path from "path";
import { mkdir } from "fs/promises";

describe("Feature Name", () => {
	let testOutputDir;

	beforeEach(async () => {
		testOutputDir = path.join(TEST_OUTPUT_DIR, "feature-name");
		await cleanupDir(testOutputDir);
		await mkdir(testOutputDir, { recursive: true });
	});

	afterEach(async () => {
		await cleanupDir(testOutputDir);
	});

	describe("Specific Functionality", () => {
		test("should do something specific", async () => {
			// Arrange
			const input = getTestIcon();

			// Act
			const result = await someFunction(input);

			// Assert
			expect(result).toBeDefined();
			expect(result.success).toBe(true);
		});
	});
});
```

### Test Helpers

Available in `test/setup.js`:

```javascript
// Directories
TEST_OUTPUT_DIR; // Base test output directory
TEST_FIXTURES_DIR; // Test fixtures location
TEST_CONFIGS_DIR; // Test config files

// Cleanup
cleanupTestOutput(); // Clean all test output
cleanupDir(dir); // Clean specific directory

// Utilities
countFilesInDir(dir, ext); // Count files recursively
directoryHasFiles(dir); // Check if dir has files

// Test Files
getTestIcon(); // Get test icon path
getTestForeground(); // Get foreground layer path
getTestBackground(); // Get background layer path
getTestConfig(name); // Get config file path
```

### Best Practices

1. **Isolate Tests**

   - Each test should be independent
   - Use beforeEach/afterEach for setup/cleanup
   - Don't rely on test execution order

2. **Use Descriptive Names**

   - Test name should describe what it tests
   - Use "should" pattern: "should generate iOS icons"

3. **Test One Thing**

   - Each test should verify one behavior
   - Break complex tests into multiple smaller tests

4. **Clean Up**

   - Always clean up test output
   - Use afterEach hooks
   - Don't leave orphaned files

5. **Handle Async**
   - Use async/await for async operations
   - Set appropriate timeouts for slow operations
   - Use `jest.setTimeout()` if needed

---

## 🏃 Running Tests

### Development Workflow

```bash
# Watch mode (re-run on file change)
npm run test:watch

# Run specific test file
npx jest test/unit/ImageProcessor.test.js

# Run tests matching pattern
npx jest --testNamePattern="adaptive"

# Verbose output
npx jest --verbose

# Update snapshots (if using)
npx jest --updateSnapshot
```

### Before Commit

```bash
# Quick sanity check
npm run test:quick

# Full test suite
npm test

# With coverage
npm run test:coverage
```

### Before Release

```bash
# 1. Run all tests
npm test

# 2. Check coverage
npm run test:coverage

# 3. Run HTTP API tests
# Terminal 1:
npm run dev
# Terminal 2:
npm run test:api

# 4. Manual smoke test
npx ino-icon-maker generate -i test-directory/input/icon.png -o /tmp/test-icons

# 5. Test on different Node versions
nvm use 18 && npm test
nvm use 20 && npm test
nvm use 21 && npm test
```

---

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18, 20, 21]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Generate coverage
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

      - name: Archive test output
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: test-output
          path: test-output/
```

### GitLab CI

```yaml
image: node:20

stages:
  - test
  - coverage

test:
  stage: test
  script:
    - npm install
    - npm test
  artifacts:
    paths:
      - coverage/
    expire_in: 1 week

coverage:
  stage: coverage
  script:
    - npm run test:coverage
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  only:
    - main
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Tests Timeout

**Problem:** Tests fail with timeout error

**Solution:**

```bash
# Increase timeout globally
npx jest --testTimeout=60000

# Or in specific test
test('slow test', async () => {
  // test code
}, 60000); // 60 second timeout
```

#### 2. HTTP API Tests Fail

**Problem:** HTTP API tests fail with connection errors

**Solution:**

```bash
# Make sure server is running
npm run dev

# Check server is accessible
curl http://localhost:3000/

# Skip HTTP tests if server not needed
npx jest --testPathIgnorePatterns="http-api"
```

#### 3. Permission Errors

**Problem:** Tests fail with EACCES errors

**Solution:**

```bash
# Clean test output
rm -rf test-output/

# Check permissions
ls -la test-output/

# Fix permissions if needed
chmod -R 755 test-output/
```

#### 4. Out of Memory

**Problem:** Tests crash with out of memory errors

**Solution:**

```bash
# Increase Node memory limit
NODE_OPTIONS=--max-old-space-size=4096 npm test

# Run tests sequentially
npx jest --runInBand
```

#### 5. Test Fixtures Missing

**Problem:** Tests fail because fixtures not found

**Solution:**

```bash
# Verify fixtures exist
ls -la test-directory/input/

# Required files:
# - test-directory/input/icon.png
# - test-directory/input/foreground.png
# - test-directory/input/background.png
```

### Debug Mode

```bash
# Enable debug output
DEBUG=* npm test

# Node.js inspector
node --inspect-brk node_modules/.bin/jest

# Then open chrome://inspect in Chrome
```

### View Test Output

```bash
# Test output is saved to: test-output/
ls -la test-output/

# Keep output after tests (edit test/setup.js)
# Comment out cleanup in afterAll()
```

---

## 📊 Test Metrics

### Expected Numbers

- **Total Tests**: ~115 tests
- **Test Suites**: 9 files
- **Coverage**: >80%
- **Duration**: ~2 minutes (full suite)

### Performance Benchmarks

| Test Suite  | Count | Duration |
| ----------- | ----- | -------- |
| Unit        | ~40   | ~10s     |
| Integration | ~60   | ~60s     |
| E2E         | ~15   | ~30s     |

---

## ✅ Test Checklist

### Developer Checklist

- [ ] All tests pass locally
- [ ] No console errors or warnings
- [ ] Test output cleaned up
- [ ] New features have tests
- [ ] Coverage maintained or improved
- [ ] Documentation updated

### Release Checklist

- [ ] All tests pass
- [ ] Coverage > 80%
- [ ] HTTP API tests pass
- [ ] E2E tests pass
- [ ] Tested on Node 18, 20, 21
- [ ] Manual smoke test completed
- [ ] CI/CD pipeline green

---

## 📚 Related Documentation

- [Test Suite README](../../test/README.md) - Technical test documentation
- [Testing Guide](./TESTING.md) - User-facing testing guide
- [Contributing](../CONTRIBUTING.md) - How to contribute
- [Architecture](../architecture/ARCHITECTURE.md) - System design

---

## 🆘 Need Help?

### Still Having Issues?

1. Check test output: `npm test -- --verbose`
2. Verify fixtures exist: `ls test-directory/input/`
3. Clean output: `rm -rf test-output/`
4. Check Node version: `node -v` (requires >= 18)
5. Reinstall dependencies: `rm -rf node_modules && npm install`

### Report Test Failures

If tests are failing and you can't figure out why:

1. Run: `npm test -- --verbose > test-output.txt 2>&1`
2. Open an issue: [GitHub Issues](https://github.com/narek589/ino-icon-maker/issues)
3. Include:
   - Node version (`node -v`)
   - OS (`uname -a` or `ver`)
   - Test output file
   - Steps to reproduce

---

**Happy Testing!** 🎉
