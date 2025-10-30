# 🏗️ Architecture

Clean architecture with SOLID principles for maintainable, extensible code.

---

## 📐 Design Principles

### SOLID Implementation

| Principle                 | Implementation                          |
| ------------------------- | --------------------------------------- |
| **Single Responsibility** | Each class has one clear purpose        |
| **Open/Closed**           | Extend without modifying                |
| **Liskov Substitution**   | Platform generators are interchangeable |
| **Interface Segregation** | Minimal, focused interfaces             |
| **Dependency Inversion**  | Depend on abstractions                  |

---

## 🏛️ System Structure

```
┌─────────────────────────────────────────┐
│         CLI / Library / HTTP API        │
│             (Entry Points)              │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      IconGeneratorFactory               │
│    (Platform Selection & Creation)      │
└──────────────┬──────────────────────────┘
               │
     ┌─────────┴─────────┬────────────────┐
     │                   │                │
┌────▼──────┐   ┌───────▼────┐  ┌───────▼────┐
│    iOS    │   │  Android   │  │  Future    │
│ Generator │   │  Generator │  │ Platforms  │
└────┬──────┘   └───────┬────┘  └───────┬────┘
     │                  │               │
┌────▼──────────────────▼───────────────▼────┐
│         Core Utilities                     │
│  • ImageProcessor                          │
│  • FileManager                             │
│  • ArchiveManager                          │
└────────────────────────────────────────────┘
```

---

## 📁 Code Organization

### Core Utilities (Reusable)

```
lib/core/
├── ImageProcessor.js    # Sharp image operations
├── FileManager.js       # File system operations
└── ArchiveManager.js    # ZIP creation
```

### Platform Generators (Extensible)

```
lib/platforms/
├── PlatformGenerator.js # Abstract base class
├── IOSGenerator.js      # iOS implementation
└── AndroidGenerator.js  # Android implementation
```

### Configuration (Data)

```
lib/config/
├── ios-config.js        # iOS specifications
└── android-config.js    # Android specifications
```

### Factory (Creation)

```
lib/
└── IconGeneratorFactory.js  # Platform registration & creation
```

---

## 🎯 Key Design Patterns

### 1. Factory Pattern

Creates platform generators dynamically.

```javascript
const generator = IconGeneratorFactory.createGenerator("ios");
```

### 2. Template Method

Base class defines algorithm, subclasses implement steps.

```javascript
class PlatformGenerator {
	async generate() {
		await this.prepare();
		await this.generateIcons(); // Implemented by subclass
		await this.generateMetadata(); // Implemented by subclass
		await this.finalize();
	}
}
```

### 3. Dependency Injection

All dependencies injected via constructor.

```javascript
class IOSGenerator extends PlatformGenerator {
	constructor(inputPath, outputDir, options) {
		super(inputPath, outputDir, options);
		this.imageProcessor = new ImageProcessor();
		this.fileManager = new FileManager();
	}
}
```

---

## ⚡ Performance

### Parallel Processing

```javascript
// Generate all sizes in parallel
await Promise.all(sizes.map(size => this.generateIcon(size)));
```

### Image Optimization

- Lanczos3 resampling for quality
- Cloning Sharp instances for thread safety
- PNG compression level 9

---

## 🔒 Security

- Input validation (file type, size, format)
- Path sanitization
- Sandboxed file operations
- No shell command execution

---

## 🧪 Testability

Each component is independently testable:

```javascript
// Unit test
const processor = new ImageProcessor();
const result = await processor.resizeImage(input, 1024);

// Integration test
const generator = new IOSGenerator(input, output, options);
const result = await generator.generate();
```

---

## 🔄 Adding New Platforms

1. **Create config** in `lib/config/`
2. **Extend** `PlatformGenerator`
3. **Implement** `generateIcons()` and `generateMetadata()`
4. **Register** in factory
5. **Done!**

Example:

```javascript
// lib/platforms/WindowsGenerator.js
export class WindowsGenerator extends PlatformGenerator {
	async generateIcons() {
		// Windows-specific icon generation
	}

	async generateMetadata() {
		// Windows-specific manifest
	}
}

// Register
IconGeneratorFactory.registerPlatform("windows", WindowsGenerator);
```

---

## 📊 Benefits

| Benefit          | Impact                                       |
| ---------------- | -------------------------------------------- |
| **Maintainable** | Easy to understand and modify                |
| **Extensible**   | Add platforms without breaking existing code |
| **Testable**     | Each component tested independently          |
| **Performant**   | Parallel processing, optimized algorithms    |
| **Reliable**     | Input validation, error handling             |

---

## 🔍 Code Quality

- ✅ SOLID principles
- ✅ Design patterns
- ✅ Dependency injection
- ✅ Clean separation of concerns
- ✅ Comprehensive error handling
- ✅ Full type documentation (JSDoc)

---

**For implementation details:** See [REFACTORING_DETAILS.md](./REFACTORING_DETAILS.md)
