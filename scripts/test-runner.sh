#!/bin/bash

###########################################
# Ino Icon Maker - Comprehensive Test Runner
###########################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
SKIPPED=0

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   Ino Icon Maker Test Suite Runner      ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Function to print section header
print_section() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Function to run test suite
run_test_suite() {
    local name=$1
    local pattern=$2
    
    echo -e "${YELLOW}Running ${name}...${NC}"
    
    if npx jest --testMatch="**/test/${pattern}/*.test.js" --silent 2>/dev/null; then
        echo -e "${GREEN}✓ ${name} PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ ${name} FAILED${NC}"
        ((FAILED++))
    fi
    echo ""
}

# Check if test fixtures exist
print_section "Pre-flight Checks"

if [ ! -d "test-directory/input" ]; then
    echo -e "${RED}✗ Test fixtures not found: test-directory/input/${NC}"
    exit 1
fi

if [ ! -f "test-directory/input/icon.png" ]; then
    echo -e "${RED}✗ Test icon not found: test-directory/input/icon.png${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Test fixtures found${NC}"

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}✗ Node.js 18+ required (found: v$NODE_VERSION)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js version compatible (v$NODE_VERSION)${NC}"

# Check dependencies
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠ Installing dependencies...${NC}"
    npm install --silent
fi

echo -e "${GREEN}✓ Dependencies installed${NC}"

# Clean previous test output
if [ -d "test-output" ]; then
    echo -e "${YELLOW}⚠ Cleaning previous test output...${NC}"
    rm -rf test-output
fi

echo -e "${GREEN}✓ Environment ready${NC}"

###########################################
# Run Test Suites
###########################################

print_section "Running Test Suites"

# 1. Unit Tests
run_test_suite "Unit Tests" "unit"

# 2. Integration Tests
run_test_suite "Integration Tests" "integration"

# 3. E2E Tests
run_test_suite "E2E Tests" "e2e"

###########################################
# HTTP API Tests (Optional)
###########################################

print_section "HTTP API Tests"

# Check if server is running
if curl -s http://localhost:3000/ > /dev/null 2>&1; then
    echo -e "${YELLOW}Server detected, running HTTP API tests...${NC}"
    
    if npx jest --testMatch="**/test/integration/http-api.test.js" --silent 2>/dev/null; then
        echo -e "${GREEN}✓ HTTP API Tests PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ HTTP API Tests FAILED${NC}"
        ((FAILED++))
    fi
else
    echo -e "${YELLOW}⚠ HTTP server not running, skipping API tests${NC}"
    echo -e "${YELLOW}  Start server with: npm run dev${NC}"
    ((SKIPPED++))
fi

###########################################
# Summary
###########################################

print_section "Test Results Summary"

TOTAL=$((PASSED + FAILED + SKIPPED))

echo "Total Suites:   $TOTAL"
echo -e "${GREEN}Passed:         $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Failed:         $FAILED${NC}"
else
    echo "Failed:         $FAILED"
fi
if [ $SKIPPED -gt 0 ]; then
    echo -e "${YELLOW}Skipped:        $SKIPPED${NC}"
fi

echo ""

###########################################
# Coverage Report (Optional)
###########################################

if [ "$1" = "--coverage" ]; then
    print_section "Coverage Report"
    
    npx jest --coverage --silent
    
    echo ""
    echo -e "${BLUE}Full coverage report: coverage/lcov-report/index.html${NC}"
fi

###########################################
# Exit
###########################################

echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║          ALL TESTS PASSED ✓              ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}╔══════════════════════════════════════════╗${NC}"
    echo -e "${RED}║          SOME TESTS FAILED ✗             ║${NC}"
    echo -e "${RED}╚══════════════════════════════════════════╝${NC}"
    echo ""
    echo "Run with --verbose for detailed output:"
    echo "  npm test -- --verbose"
    echo ""
    exit 1
fi

