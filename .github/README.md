# GitHub Repository Documentation

This directory contains GitHub-specific configuration and templates for the Ino Icon Maker project.

## 📁 Directory Structure

```
.github/
├── workflows/
│   └── ci.yml                          # CI/CD pipeline configuration
├── ISSUE_TEMPLATE/
│   ├── bug_report.md                   # Bug report template
│   └── feature_request.md              # Feature request template
├── pull_request_template.md            # Pull request template
├── FUNDING.yml                         # Sponsorship configuration
└── README.md                           # This file
```

## 🔄 CI/CD Pipeline

Our CI/CD pipeline (`workflows/ci.yml`) runs on:

- **Push to main/develop branches**
- **Pull requests to main/develop branches**

### Pipeline Jobs

1. **Test**: Runs tests on multiple Node.js versions (18.x, 20.x, 21.x) and operating systems (Ubuntu, Windows, macOS)
2. **Build**: Packages the application and verifies build integrity
3. **Security**: Runs npm security audits

## 📝 Issue Templates

We provide two issue templates:

### Bug Reports

Use this template to report bugs with detailed information including:

- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Error messages

### Feature Requests

Use this template to suggest new features with:

- Problem description
- Proposed solution
- Use case examples
- Impact assessment

## 🔀 Pull Request Template

Our PR template helps ensure:

- Clear description of changes
- Proper categorization
- Testing confirmation
- Documentation updates
- Adherence to coding standards

## 📚 Related Documentation

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) - Community standards
- [SECURITY.md](../SECURITY.md) - Security policy
- [CHANGELOG.md](../CHANGELOG.md) - Version history

## 🛠️ Maintaining These Files

When updating GitHub templates:

1. Test templates by creating actual issues/PRs
2. Ensure all links work correctly
3. Keep formatting consistent
4. Update this README if structure changes

---

For questions about repository management, please open an issue or contact the maintainers.
