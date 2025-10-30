# 🔄 Git Workflow Guide

Quick guide for contributing to Ino Icon Maker.

## 🚀 Quick Start

```bash
# 1. Fork & Clone
git clone https://github.com/YOUR_USERNAME/ino-icon-maker.git
cd ino-icon-maker

# 2. Install
npm install

# 3. Create Branch
git checkout -b feature/my-feature

# 4. Make Changes & Commit
git add .
git commit -m "feat: add my feature"

# 5. Push & Open PR
git push origin feature/my-feature
```

## 📋 Branch Naming

```
feature/feature-name    # New features
fix/bug-name           # Bug fixes  
docs/update-name       # Documentation
refactor/code-name     # Code improvements
test/test-name         # Tests
```

## ✍️ Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add AVIF format support
fix: resolve ZIP creation error
docs: update README examples
refactor: improve ImageProcessor
test: add validation tests
chore: bump version to 1.0.11
```

**Format**: `type: description`

**Types**: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

## 🔄 Syncing Your Fork

```bash
# Get latest changes
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## 🎯 Pull Request Checklist

Before opening a PR:

- [ ] Code follows project style
- [ ] Tests pass (`npm test`)
- [ ] Commit messages follow convention
- [ ] PR description is clear
- [ ] Branch is up to date with main

## 🆘 Common Issues

**Merge conflicts?**
```bash
git fetch upstream
git rebase upstream/main
# Resolve conflicts, then:
git rebase --continue
git push origin feature-name --force
```

**Wrong commit message?**
```bash
git commit --amend -m "new message"
git push --force
```

**Undo last commit (keep changes)?**
```bash
git reset --soft HEAD~1
```

---

**Need detailed help?** See [CONTRIBUTING.md](../CONTRIBUTING.md)
