# 🔄 Git Workflow Guide

Complete guide for working with Git in the Ino Icon Maker project.

## 📖 Table of Contents

- [Quick Start](#quick-start)
- [Initial Setup](#initial-setup)
- [Basic Workflow](#basic-workflow)
- [Branch Strategy](#branch-strategy)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/narek589/ino-icon-maker.git
cd ino-icon-maker

# Install dependencies
npm install

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes, then commit
git add .
git commit -m "feat: add new feature"

# Push to your fork
git push origin feature/your-feature-name

# Open pull request on GitHub
```

---

## ⚙️ Initial Setup

### 1. Fork the Repository

Go to https://github.com/narek589/ino-icon-maker and click **Fork**

### 2. Clone Your Fork

```bash
# HTTPS
git clone https://github.com/YOUR_USERNAME/ino-icon-maker.git

# SSH (recommended)
git clone git@github.com:YOUR_USERNAME/ino-icon-maker.git

cd ino-icon-maker
```

### 3. Add Upstream Remote

```bash
# Add upstream repository
git remote add upstream https://github.com/narek589/ino-icon-maker.git

# Verify remotes
git remote -v
# origin    https://github.com/YOUR_USERNAME/ino-icon-maker.git (fetch)
# origin    https://github.com/YOUR_USERNAME/ino-icon-maker.git (push)
# upstream  https://github.com/narek589/ino-icon-maker.git (fetch)
# upstream  https://github.com/narek589/ino-icon-maker.git (push)
```

### 4. Configure Git

```bash
# Set your name and email
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Enable color output
git config --global color.ui auto

# Set default editor
git config --global core.editor "code --wait"  # VS Code
# or
git config --global core.editor "vim"  # Vim
```

### 5. Install Dependencies

```bash
npm install
```

---

## 🔄 Basic Workflow

### Daily Development Cycle

```bash
# 1. Start your day - sync with upstream
git checkout main
git fetch upstream
git merge upstream/main
git push origin main

# 2. Create feature branch
git checkout -b feature/amazing-feature

# 3. Make changes
# ... edit files ...

# 4. Check status
git status

# 5. Stage changes
git add .
# or selectively
git add lib/core/NewFile.js

# 6. Commit with conventional message
git commit -m "feat: add amazing feature"

# 7. Push to your fork
git push origin feature/amazing-feature

# 8. Create pull request on GitHub
```

### Keeping Branch Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Merge upstream/main into your branch
git checkout feature/your-feature
git merge upstream/main

# Or rebase (cleaner history)
git checkout feature/your-feature
git rebase upstream/main

# If conflicts, resolve them, then:
git add .
git rebase --continue

# Force push after rebase (be careful!)
git push origin feature/your-feature --force-with-lease
```

---

## 🌿 Branch Strategy

### Branch Types

**main** - Production-ready code

- Always stable
- Protected branch
- Requires PR reviews

**develop** - Integration branch (if used)

- Latest development
- Testing ground

**feature/\*** - New features

```bash
git checkout -b feature/ios-generator
git checkout -b feature/android-support
```

**fix/\*** - Bug fixes

```bash
git checkout -b fix/image-processing-error
git checkout -b fix/cli-validation
```

**docs/\*** - Documentation

```bash
git checkout -b docs/update-readme
git checkout -b docs/add-examples
```

**refactor/\*** - Code refactoring

```bash
git checkout -b refactor/cleanup-core
git checkout -b refactor/solid-principles
```

**test/\*** - Testing

```bash
git checkout -b test/add-unit-tests
git checkout -b test/integration-tests
```

### Branch Naming Convention

```bash
# Good examples
feature/add-web-platform-support
fix/sharp-memory-leak
docs/improve-contributing-guide
refactor/extract-platform-factory
test/add-image-processor-tests

# Bad examples
fix-bug
my-changes
test
feature123
```

---

## 💬 Commit Guidelines

### Conventional Commits

Format: `<type>(<scope>): <description>`

#### Types

**feat**: New feature

```bash
git commit -m "feat: add web platform icon generation"
git commit -m "feat(cli): add interactive mode"
```

**fix**: Bug fix

```bash
git commit -m "fix: resolve image processing memory leak"
git commit -m "fix(android): correct hdpi icon size"
```

**docs**: Documentation

```bash
git commit -m "docs: update installation guide"
git commit -m "docs(api): add library usage examples"
```

**refactor**: Code refactoring

```bash
git commit -m "refactor: apply SOLID principles to generators"
git commit -m "refactor(core): extract image validation"
```

**test**: Testing

```bash
git commit -m "test: add unit tests for ImageProcessor"
git commit -m "test(integration): add end-to-end tests"
```

**chore**: Maintenance

```bash
git commit -m "chore: update dependencies"
git commit -m "chore(ci): improve GitHub Actions workflow"
```

**style**: Code style

```bash
git commit -m "style: format code with prettier"
git commit -m "style: fix linter warnings"
```

**perf**: Performance

```bash
git commit -m "perf: optimize parallel processing"
git commit -m "perf(core): reduce memory usage"
```

### Commit Message Best Practices

```bash
# ✅ Good commits
git commit -m "feat: add support for WebP format"
git commit -m "fix: handle invalid image dimensions"
git commit -m "docs: add React Native integration guide"

# ❌ Bad commits
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
git commit -m "asdfgh"
```

### Multi-line Commits

```bash
git commit -m "feat: add batch processing support

- Add processBatch function
- Implement parallel processing
- Add progress callbacks
- Update documentation

Closes #123"
```

### Amending Commits

```bash
# Forgot to add a file
git add forgotten-file.js
git commit --amend --no-edit

# Fix commit message
git commit --amend -m "feat: correct feature description"
```

---

## 🔀 Pull Request Process

### 1. Prepare Your Branch

```bash
# Make sure branch is up to date
git checkout feature/your-feature
git fetch upstream
git rebase upstream/main

# Run tests
npm test

# Check for linting errors
npm run lint

# Verify everything works
npm run icons -- -i test.png -o output -p all
```

### 2. Push to Your Fork

```bash
git push origin feature/your-feature

# If you rebased
git push origin feature/your-feature --force-with-lease
```

### 3. Create Pull Request

Go to: https://github.com/narek589/ino-icon-maker/compare

1. Click **New Pull Request**
2. Select **base: main** ← **compare: feature/your-feature**
3. Fill out the PR template:
   - Clear title
   - Description of changes
   - Link related issues
   - Add screenshots if UI changes
4. Click **Create Pull Request**

### 4. PR Template Example

````markdown
## Description

Adds support for generating Web PWA icons.

## Type of Change

- [x] New feature
- [ ] Bug fix
- [ ] Breaking change

## Related Issues

Closes #45

## Testing

- [x] Tested locally
- [x] All tests pass
- [x] Added new tests

### Test Commands

```bash
npm test
node cli.js generate -i test.png -o output -p web
```
````

## Checklist

- [x] Code follows project guidelines
- [x] Self-reviewed code
- [x] Commented complex code
- [x] Updated documentation
- [x] No new warnings
- [x] Added tests
- [x] Tests pass

````

### 5. Respond to Feedback

```bash
# Make requested changes
git add .
git commit -m "fix: address review comments"
git push origin feature/your-feature
````

---

## 🛠️ Common Tasks

### View History

```bash
# View commit log
git log

# One line per commit
git log --oneline

# With graph
git log --oneline --graph --all

# Last 5 commits
git log -5

# Commits by author
git log --author="Your Name"

# Changes in file
git log -p lib/core/ImageProcessor.js
```

### Check Status

```bash
# See modified files
git status

# Short format
git status -s

# See changes
git diff

# See staged changes
git diff --cached

# See changes in specific file
git diff lib/core/ImageProcessor.js
```

### Undo Changes

```bash
# Discard changes in working directory
git checkout -- file.js

# Unstage file
git reset HEAD file.js

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert a commit (creates new commit)
git revert abc123
```

### Stash Changes

```bash
# Save changes temporarily
git stash

# Save with message
git stash save "WIP: working on feature"

# List stashes
git stash list

# Apply latest stash
git stash apply

# Apply specific stash
git stash apply stash@{0}

# Apply and remove
git stash pop

# Delete stash
git stash drop stash@{0}
```

### Cherry-pick Commits

```bash
# Apply commit from another branch
git cherry-pick abc123

# Cherry-pick multiple commits
git cherry-pick abc123 def456

# Cherry-pick without committing
git cherry-pick --no-commit abc123
```

### Tags

```bash
# List tags
git tag

# Create lightweight tag
git tag v1.0.5

# Create annotated tag
git tag -a v1.0.5 -m "Release version 1.0.5"

# Push tag
git push origin v1.0.5

# Push all tags
git push origin --tags

# Delete tag locally
git tag -d v1.0.5

# Delete tag remotely
git push origin --delete v1.0.5
```

---

## 🔧 Troubleshooting

### Merge Conflicts

```bash
# When you see conflict
git status  # Shows conflicted files

# Open files and resolve conflicts
# Look for:
# <<<<<<< HEAD
# your changes
# =======
# their changes
# >>>>>>> branch-name

# After resolving
git add .
git commit -m "fix: resolve merge conflicts"
```

### Wrong Branch

```bash
# Made changes on wrong branch?
# 1. Stash changes
git stash

# 2. Switch to correct branch
git checkout correct-branch

# 3. Apply stash
git stash pop
```

### Committed to Wrong Branch

```bash
# Undo commit but keep changes
git reset --soft HEAD~1

# Switch to correct branch
git checkout correct-branch

# Commit again
git add .
git commit -m "feat: your commit message"
```

### Force Push Issues

```bash
# Safe force push (won't overwrite remote changes)
git push origin feature/your-feature --force-with-lease

# If rejected, fetch and rebase first
git fetch origin
git rebase origin/feature/your-feature
git push origin feature/your-feature --force-with-lease
```

### Sync Fork with Upstream

```bash
# Fetch upstream changes
git fetch upstream

# Merge into your main
git checkout main
git merge upstream/main

# Push to your fork
git push origin main
```

### Clean Up Branches

```bash
# Delete local branch
git branch -d feature/old-feature

# Force delete
git branch -D feature/old-feature

# Delete remote branch
git push origin --delete feature/old-feature

# Prune deleted remote branches
git fetch --prune
```

---

## 📚 Git Aliases (Optional)

Add to `~/.gitconfig`:

```ini
[alias]
  # Shortcuts
  co = checkout
  br = branch
  ci = commit
  st = status

  # Pretty log
  lg = log --oneline --graph --all --decorate

  # Show last commit
  last = log -1 HEAD

  # Undo last commit
  undo = reset --soft HEAD~1

  # Sync with upstream
  sync = !git fetch upstream && git checkout main && git merge upstream/main
```

Usage:

```bash
git co feature/new-feature
git st
git lg
git sync
```

---

## 🔗 Useful Resources

- **GitHub Repository**: https://github.com/narek589/ino-icon-maker
- **Git Documentation**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com/
- **Conventional Commits**: https://www.conventionalcommits.org/

---

## 📝 Quick Reference

```bash
# Setup
git clone https://github.com/narek589/ino-icon-maker.git
git remote add upstream https://github.com/narek589/ino-icon-maker.git

# Daily workflow
git checkout main
git pull upstream main
git checkout -b feature/name
# ... make changes ...
git add .
git commit -m "feat: description"
git push origin feature/name

# Sync
git fetch upstream
git rebase upstream/main

# Cleanup
git branch -d feature/name
git push origin --delete feature/name
```

---

**Need help?** [Open an issue](https://github.com/narek589/ino-icon-maker/issues) or check [Contributing Guide](../CONTRIBUTING.md)
