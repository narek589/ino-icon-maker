# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Ino Icon Maker seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please DO NOT:

- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before it has been addressed

### Please DO:

**Report security vulnerabilities via email to:** [n.hambarcumyan@inorain.com](mailto:n.hambarcumyan@inorain.com)

In your report, please include:

- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability, including how an attacker might exploit it

### What to Expect

After you've submitted a vulnerability report:

1. **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
2. **Investigation**: We will investigate and validate the issue
3. **Update**: We will send you regular updates about our progress
4. **Fix**: Once the vulnerability is confirmed, we will:
   - Develop and test a fix
   - Prepare a security advisory
   - Release a patch as soon as possible
5. **Credit**: With your permission, we will acknowledge your responsible disclosure in the security advisory

### Response Timeline

- **Initial response**: Within 48 hours
- **Status update**: Within 7 days
- **Fix release**: Depends on severity and complexity
  - Critical: Within 7 days
  - High: Within 14 days
  - Medium: Within 30 days
  - Low: Next regular release

## Security Best Practices for Users

When using Ino Icon Maker:

1. **Keep Dependencies Updated**

   ```bash
   npm update ino-icon-maker
   ```

2. **Use Official Sources Only**

   - Install from npm: `npm install ino-icon-maker`
   - Clone from official GitHub: `https://github.com/narek589/ino-icon-maker`

3. **Verify Package Integrity**

   ```bash
   npm audit
   ```

4. **Input Validation**

   - Only process images from trusted sources
   - Be cautious with user-uploaded files in production

5. **File System Permissions**

   - Ensure output directories have appropriate permissions
   - Don't run with elevated privileges unless necessary

6. **Network Security** (when using HTTP API)
   - Use HTTPS in production
   - Implement proper authentication
   - Rate limit API endpoints
   - Validate file uploads

## Known Security Considerations

### Image Processing

This package uses [Sharp](https://sharp.pixelplumbing.com/) for image processing. Sharp handles various image formats and has its own security considerations:

- We use Sharp's built-in validation
- Large images are automatically handled
- Malformed images are rejected

### File System Operations

- Input validation is performed on all file paths
- Temporary files are cleaned up after processing
- Output paths are sanitized

### HTTP API (Optional)

If you use the built-in HTTP API:

- It's intended for development/internal use
- Add authentication before exposing to the internet
- Implement rate limiting
- Use HTTPS in production
- Validate all inputs

## Security Updates

Subscribe to security updates:

- Watch the [GitHub repository](https://github.com/narek589/ino-icon-maker)
- Follow npm package updates
- Check [CHANGELOG.md](CHANGELOG.md) for security-related releases

## Disclosure Policy

When we receive a security report, we will:

1. Confirm the problem and determine affected versions
2. Audit code to find similar problems
3. Prepare fixes for all supported versions
4. Release new versions as soon as possible
5. Publish a security advisory on GitHub

## Comments on This Policy

If you have suggestions on how this policy could be improved, please submit a pull request or open an issue.

## Security Hall of Fame

We would like to thank the following individuals for responsibly disclosing security issues:

- No reports yet

---

**Thank you for helping keep Ino Icon Maker and its users safe!** 🔒
