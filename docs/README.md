# 📚 Ino Icon Maker Documentation

Simple and clear documentation for generating iOS and Android app icons.

## 📖 Table of Contents

### 🚀 Getting Started

- **[Quick Start](./guides/QUICK_START.md)** - Get started in 5 minutes
- **[All Examples](./examples/ALL_EXAMPLES.md)** - 200+ code examples

### 📱 Framework Integration

- **[React Native](./examples/REACT_NATIVE.md)** - Complete integration guide
- **[Flutter](./examples/FLUTTER.md)** - Complete integration guide
- **[CI/CD](./examples/CI_CD.md)** - Automation for all platforms

### 🏗️ Architecture

- **[System Architecture](./architecture/ARCHITECTURE.md)** - Technical design
- **[Refactoring Details](./architecture/REFACTORING_DETAILS.md)** - SOLID principles

### 🔗 Additional

- [Git Workflow](./guides/GIT_WORKFLOW.md) - Version control guide
- [Security Policy](./SECURITY.md) - Report vulnerabilities
- [Contributing](./CONTRIBUTING.md) - How to contribute
- [License](../LICENSE) - MIT License

## 🔗 Quick Links

- **npm Package**: https://www.npmjs.com/package/ino-icon-maker
- **GitHub Repository**: https://github.com/narek589/ino-icon-maker
- **Report Issues**: https://github.com/narek589/ino-icon-maker/issues
- **Discussions**: https://github.com/narek589/ino-icon-maker/discussions

## 🚀 Quick Start

```bash
# Option 1: NPX (No install required) ⭐
npx ino-icon-maker generate -i icon.png -o ./output -p all -z

# Option 2: Global install
npm install -g ino-icon-maker
ino-icon generate -i icon.png -o ./output -p all

# Option 3: Project dependency
npm install -D ino-icon-maker
```

```javascript
// Use as library
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
│   ├── ALL_EXAMPLES.md      # 200+ code examples
│   ├── REACT_NATIVE.md      # React Native integration
│   ├── FLUTTER.md           # Flutter integration
│   └── CI_CD.md             # CI/CD automation
├── guides/
│   ├── QUICK_START.md       # 5-minute start guide
│   └── GIT_WORKFLOW.md      # Git guide
├── architecture/
│   ├── ARCHITECTURE.md      # System design
│   └── REFACTORING_DETAILS.md  # SOLID principles
├── SECURITY.md              # Security policy
├── CONTRIBUTING.md          # Contribution guide
├── CODE_OF_CONDUCT.md       # Community rules
└── CHANGELOG.md             # Version history
```

## 🎯 Popular Topics

### I want to...

**Generate icons quickly**
→ [Quick Start](./guides/QUICK_START.md)

**See all examples**
→ [All Examples](./examples/ALL_EXAMPLES.md)

**Use with React Native**
→ [React Native Guide](./examples/REACT_NATIVE.md)

**Use with Flutter**
→ [Flutter Guide](./examples/FLUTTER.md)

**Automate with CI/CD**
→ [CI/CD Examples](./examples/CI_CD.md)

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
