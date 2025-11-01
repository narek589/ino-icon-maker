# Test Suite Documentation

Comprehensive test suite for **Ino Icon Maker** covering all functionalities.

## 📁 Test Structure

```
test/
├── setup.js                          # Global test setup and utilities
├── unit/                             # Unit tests for core modules
│   ├── ImageProcessor.test.js        # Image processing tests
│   ├── FileManager.test.js           # File operations tests
│   └── ArchiveManager.test.js        # ZIP archive tests
├── integration/                      # Integration tests
│   ├── ios-generator.test.js         # iOS icon generation
│   ├── android-generator.test.js     # Android icon generation
│   ├── custom-sizes.test.js          # Custom sizes feature
│   ├── programmatic-api.test.js      # Library API tests
│   └── http-api.test.js              # HTTP server API tests
└── e2e/                              # End-to-end tests
    └── cli.test.js                   # CLI command tests
```

## 🚀 Quick Start

### Run All Tests

```bash
npm test
```

### Run Specific Test Suites

```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# E2E tests only
npm run test:e2e

# HTTP API tests (requires server running)
npm run test:api
```

### Run Individual Test Files

```bash
# Single test file
npx jest test/unit/ImageProcessor.test.js

# With verbose output
npx jest test/unit/ImageProcessor.test.js --verbose

# Watch mode for development
npx jest test/unit/ImageProcessor.test.js --watch
```

## 📋 Test Categories

### Unit Tests

Tests for individual core modules in isolation.

**Files:**

- `unit/ImageProcessor.test.js` - Image loading, resizing, saving, validation
- `unit/FileManager.test.js` - Directory/file operations
- `unit/ArchiveManager.test.js` - ZIP creation

**Run:**

```bash
npm run test:unit
```

### Integration Tests

Tests for complete workflows and platform generators.

**Files:**

- `integration/ios-generator.test.js` - iOS icon generation workflow
- `integration/android-generator.test.js` - Android icon generation + adaptive icons
- `integration/custom-sizes.test.js` - Custom size configurations
- `integration/programmatic-api.test.js` - Library API functions

**Run:**

```bash
npm run test:integration
```

### HTTP API Tests

Tests for the HTTP server endpoints.

**Prerequisites:**

```bash
# Start the server first
npm run dev
# or
ino-icon serve
```

**Run:**

```bash
npm run test:api
```

**Files:**

- `integration/http-api.test.js` - All HTTP endpoints

### E2E Tests

End-to-end tests for CLI commands.

**Files:**

- `e2e/cli.test.js` - CLI commands and arguments

**Run:**

```bash
npm run test:e2e
```

## 🎯 Test Coverage

### What's Covered

✅ **Core Functionality**

- Image processing (load, resize, save, validate)
- File management (directories, paths)
- ZIP archive creation

✅ **Platform Generators**

- iOS icon generation (19 icons + Contents.json)
- Android icon generation (all densities)
- Adaptive icons (foreground/background layers)

✅ **Features**

- Custom sizes (scaling, exclusion, addition)
- ZIP creation
- Force overwrite
- Error handling

✅ **APIs**

- Programmatic API (quickGenerate, etc.)
- HTTP API (all endpoints)
- CLI commands

✅ **Validation**

- Input validation
- Image format validation
- Configuration validation
- Error messages

### Coverage Report

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/lcov-report/index.html
```

## 🔧 Test Configuration

### Jest Configuration

See `jest.config.js`:

```javascript
{
  testEnvironment: "node",
  testMatch: ["**/test/**/*.test.js"],
  collectCoverageFrom: ["lib/**/*.js", "index.js"],
  setupFilesAfterEnv: ["./test/setup.js"]
}
```

### Environment Variables

```bash
# HTTP API test URL (default: http://localhost:3000)
TEST_API_URL=http://localhost:3000

# Keep test output for inspection
KEEP_TEST_OUTPUT=true
```

## 📝 Writing Tests

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

	test("should do something", async () => {
		// Test implementation
		expect(true).toBe(true);
	});
});
```

### Helper Functions

Available in `setup.js`:

```javascript
import {
	TEST_OUTPUT_DIR, // Base test output directory
	TEST_FIXTURES_DIR, // Test fixtures location
	cleanupTestOutput, // Clean all test output
	cleanupDir, // Clean specific directory
	countFilesInDir, // Count files recursively
	getTestIcon, // Get test icon path
	getTestForeground, // Get test foreground path
	getTestBackground, // Get test background path
	getTestConfig, // Get test config file path
} from "./setup.js";
```

## 🐛 Debugging Tests

### Run Single Test with Debug

```bash
# Enable Node.js debugging
node --inspect-brk node_modules/.bin/jest test/unit/ImageProcessor.test.js

# Run with verbose output
npx jest test/unit/ImageProcessor.test.js --verbose --no-coverage
```

### View Test Output

```bash
# Test output is saved to: test-output/
ls -la test-output/

# Keep output after tests (set in setup.js)
KEEP_TEST_OUTPUT=true npm test
```

### Common Issues

**Issue: Tests timeout**

```bash
# Increase timeout
npx jest --testTimeout=60000
```

**Issue: HTTP API tests fail**

```bash
# Make sure server is running
npm run dev

# Or skip HTTP tests
npx jest --testPathIgnorePatterns="http-api"
```

**Issue: Permission errors**

```bash
# Clean test output
rm -rf test-output/
```

## 📊 Continuous Integration

### GitHub Actions

```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## 📈 Test Metrics

### Expected Test Counts

- **Unit Tests**: ~40 tests
- **Integration Tests**: ~60 tests
- **E2E Tests**: ~15 tests
- **Total**: ~115 tests

### Typical Test Run Time

- Unit tests: ~10 seconds
- Integration tests: ~60 seconds
- E2E tests: ~30 seconds
- **Total**: ~2 minutes

## ✅ Pre-Release Checklist

Before releasing a new version:

- [ ] All tests pass: `npm test`
- [ ] Coverage > 80%: `npm run test:coverage`
- [ ] HTTP API tests pass (server running)
- [ ] E2E tests pass
- [ ] Manual smoke test on real projects
- [ ] Test on different Node versions (18, 20, 21)

## 🆘 Getting Help

### Test Not Working?

1. Check test output: `npm test -- --verbose`
2. Verify fixtures exist: `ls test-directory/input/`
3. Clean output: `rm -rf test-output/`
4. Check Node version: `node -v` (requires >= 18)

### Need to Add Tests?

1. Create test file in appropriate directory
2. Import helpers from `setup.js`
3. Follow existing test patterns
4. Run locally: `npx jest path/to/test.js`
5. Update this README if needed

## 📚 Related Documentation

- [Testing Guide](../docs/guides/TESTING.md) - User testing guide
- [Contributing](../docs/CONTRIBUTING.md) - Contribution guidelines
- [Architecture](../docs/architecture/ARCHITECTURE.md) - System design

---

**Happy Testing!** 🎉
