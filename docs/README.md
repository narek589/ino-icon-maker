# 📚 Ino Icon Maker Documentation

Welcome to the comprehensive documentation for Ino Icon Maker!

## 📖 Table of Contents

### Getting Started

- [Installation Guide](./guides/INSTALLATION.md) - How to install and set up
- [Quick Start](./guides/QUICK_START.md) - Get started in 5 minutes
- [All Examples](./examples/ALL_EXAMPLES.md) - Complete examples for all use cases

### Guides

- [CLI Guide](./guides/CLI_GUIDE.md) - Command-line interface reference
- [Library API Guide](./guides/LIBRARY_API.md) - Using as a Node.js library
- [HTTP API Guide](./guides/HTTP_API.md) - Using the HTTP server
- [Git Workflow](./guides/GIT_WORKFLOW.md) - Version control and collaboration

### Examples

- [NPX Examples](./examples/NPX_EXAMPLES.md) - No installation required
- [React Native Examples](./examples/REACT_NATIVE.md) - Integration with React Native
- [Flutter Examples](./examples/FLUTTER.md) - Integration with Flutter
- [CI/CD Examples](./examples/CI_CD.md) - Automation pipelines

### Architecture

- [System Architecture](./architecture/ARCHITECTURE.md) - Technical design
- [Refactoring Details](./architecture/REFACTORING_DETAILS.md) - Code improvements
- [Platform Configuration](./architecture/PLATFORM_CONFIG.md) - Platform-specific setup

### Contributing

- [Contributing Guide](./CONTRIBUTING.md) - How to contribute
- [Code of Conduct](./CODE_OF_CONDUCT.md) - Community standards
- [Development Setup](./guides/DEVELOPMENT.md) - For contributors

### Reference

- [Security Policy](./SECURITY.md) - Report vulnerabilities
- [Changelog](./CHANGELOG.md) - Version history
- [License](../LICENSE) - MIT License

## 🔗 Quick Links

- **npm Package**: https://www.npmjs.com/package/ino-icon-maker
- **GitHub Repository**: https://github.com/narek589/ino-icon-maker
- **Report Issues**: https://github.com/narek589/ino-icon-maker/issues
- **Discussions**: https://github.com/narek589/ino-icon-maker/discussions

## 🚀 Quick Start

```bash
# Option 1: NPX (No install required)
npx ino-icon-maker generate -i icon.png -o ./output -p all -z

# Option 2: Global install
npm install -g ino-icon-maker
ino-icon generate -i icon.png -o ./output -p all

# Option 3: As library
npm install ino-icon-maker
```

```javascript
import { quickGenerate } from "ino-icon-maker";

await quickGenerate({
	input: "./icon.png",
	output: "./output",
	platform: "all",
	zip: true,
});
```

## 📂 Documentation Structure

```
docs/
├── README.md (this file)
├── examples/
│   ├── ALL_EXAMPLES.md
│   ├── NPX_EXAMPLES.md
│   ├── REACT_NATIVE.md
│   ├── FLUTTER.md
│   └── CI_CD.md
├── guides/
│   ├── INSTALLATION.md
│   ├── QUICK_START.md
│   ├── CLI_GUIDE.md
│   ├── LIBRARY_API.md
│   ├── HTTP_API.md
│   ├── GIT_WORKFLOW.md
│   └── DEVELOPMENT.md
├── architecture/
│   ├── ARCHITECTURE.md
│   ├── REFACTORING_DETAILS.md
│   └── PLATFORM_CONFIG.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
└── CHANGELOG.md
```

## 🎯 Popular Topics

### I want to...

**Generate icons without installing anything**
→ [NPX Examples](./examples/NPX_EXAMPLES.md)

**Use it in my React Native app**
→ [React Native Guide](./examples/REACT_NATIVE.md)

**Use it in my Flutter app**
→ [Flutter Guide](./examples/FLUTTER.md)

**Automate icon generation in CI/CD**
→ [CI/CD Examples](./examples/CI_CD.md)

**Use it as a library in Node.js**
→ [Library API Guide](./guides/LIBRARY_API.md)

**Contribute to the project**
→ [Contributing Guide](./CONTRIBUTING.md)

**Understand the architecture**
→ [Architecture Guide](./architecture/ARCHITECTURE.md)

## 🆘 Need Help?

1. Check the [Examples](./examples/ALL_EXAMPLES.md)
2. Read the [Guides](./guides/QUICK_START.md)
3. Search [Issues](https://github.com/narek589/ino-icon-maker/issues)
4. Ask in [Discussions](https://github.com/narek589/ino-icon-maker/discussions)
5. Open a [New Issue](https://github.com/narek589/ino-icon-maker/issues/new/choose)

---

**Happy icon generating!** 🎨
