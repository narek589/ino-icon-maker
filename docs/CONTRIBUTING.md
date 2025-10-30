# 🤝 Contributing

Thanks for contributing to Ino Icon Maker! This guide will help you get started.

---

## 🚀 Quick Start

```bash
# 1. Fork & Clone
git clone https://github.com/YOUR_USERNAME/ino-icon-maker.git
cd ino-icon-maker

# 2. Install dependencies
npm install

# 3. Create branch
git checkout -b feature/my-feature

# 4. Make changes

# 5. Test
npm test

# 6. Commit
git commit -m "feat: add my feature"

# 7. Push & create PR
git push origin feature/my-feature
```

---

## 📋 Contribution Guidelines

### What We Accept

✅ **YES:**

- Bug fixes
- New features
- Performance improvements
- Documentation improvements
- Test additions
- Code refactoring

❌ **NO:**

- Breaking changes without discussion
- Code style changes only
- Large PRs without prior discussion

---

## ✍️ Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
type: short description

Examples:
feat: add AVIF format support
fix: resolve ZIP creation error
docs: update README examples
refactor: improve ImageProcessor
test: add validation tests
chore: bump dependencies
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`

---

## 🎯 Pull Request Process

### Before Submitting

- [ ] Tests pass (`npm test`)
- [ ] Code follows project style
- [ ] Commits follow convention
- [ ] Documentation updated
- [ ] Branch is up-to-date

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

How was this tested?

## Checklist

- [ ] Tests pass
- [ ] Documentation updated
- [ ] Follows code style
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test
npm test -- ImageProcessor.test.js

# Watch mode
npm test -- --watch
```

---

## 📝 Code Style

### Formatting

- Use tabs for indentation
- 2 spaces for continuation
- Single quotes for strings
- Semicolons optional
- ES6+ features encouraged

### Naming

```javascript
// Classes: PascalCase
class ImageProcessor {}

// Functions/Variables: camelCase
function generateIcons() {}
const iconSize = 1024;

// Constants: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Private methods: _prefixed
_validateInput() {}
```

### Comments

```javascript
/**
 * Resize image to specified dimensions
 * @param {string} input - Input file path
 * @param {number} size - Target size
 * @returns {Promise<Buffer>}
 */
async resizeImage(input, size) {
  // Implementation
}
```

---

## 🏗️ Project Structure

```
ino-icon-maker/
├── lib/
│   ├── core/           # Reusable utilities
│   ├── platforms/      # Platform generators
│   ├── config/         # Configuration
│   └── generator.js    # Main entry
├── docs/              # Documentation
├── tests/             # Test files
└── cli.js            # CLI interface
```

---

## 🐛 Reporting Bugs

### Before Reporting

1. Check [existing issues](https://github.com/narek589/ino-icon-maker/issues)
2. Try latest version
3. Test with minimal example

### Bug Report Template

```markdown
**Describe the bug**
Clear description

**To Reproduce**
Steps to reproduce:

1. Run command...
2. With file...
3. See error...

**Expected behavior**
What should happen

**Environment:**

- OS: [e.g. macOS 13]
- Node: [e.g. 18.0.0]
- Version: [e.g. 1.0.11]

**Additional context**
Screenshots, logs, etc.
```

---

## 💡 Feature Requests

### Template

```markdown
**Feature Description**
What feature do you want?

**Use Case**
Why is this needed?

**Proposed Solution**
How should it work?

**Alternatives**
Other solutions considered?
```

---

## 📞 Getting Help

- 📖 Read [Documentation](./README.md)
- 💬 Open [Discussion](https://github.com/narek589/ino-icon-maker/issues)
- 🐛 Report [Bug](https://github.com/narek589/ino-icon-maker/issues/new)

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing!** 🎉
