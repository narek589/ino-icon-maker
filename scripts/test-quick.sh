#!/bin/bash

###########################################
# Quick Test Script - Fast feedback
###########################################

set -e

echo ""
echo "⚡ Quick Test - Essential Tests Only"
echo ""

# Unit tests (fast)
echo "📦 Running unit tests..."
npx jest --testMatch="**/test/unit/*.test.js" --silent

echo ""
echo "✓ Unit tests passed"
echo ""

# Basic integration tests (iOS + Android)
echo "🔗 Running core integration tests..."
npx jest --testMatch="**/test/integration/ios-generator.test.js" --silent
npx jest --testMatch="**/test/integration/android-generator.test.js" --silent

echo ""
echo "✓ Integration tests passed"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Quick tests passed!"
echo ""
echo "For full test suite, run: npm test"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

