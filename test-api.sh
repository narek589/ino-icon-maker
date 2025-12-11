#!/bin/bash

#
# API Testing Script
#
# This script tests all HTTP API endpoints of ino-icon-maker
#
# Prerequisites:
# 1. Server must be running: ino-icon serve
# 2. Test icon file must exist: docs/assets/ios-example.png
#
# Usage: ./test-api.sh
#

set -e

API_URL="${API_URL:-http://localhost:3000}"
TEST_ICON="docs/assets/ios-example.png"
OUTPUT_DIR="temp/api-test-results"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

log_test() {
    echo -e "\n${YELLOW}▶${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check if icon exists
    if [ ! -f "$TEST_ICON" ]; then
        log_error "Test icon not found: $TEST_ICON"
        exit 1
    fi
    log_success "Test icon found"

    # Check if server is running
    if ! curl -s "$API_URL/" > /dev/null 2>&1; then
        log_error "Server not running at $API_URL"
        echo ""
        echo "Start the server first:"
        echo "  ino-icon serve"
        echo "or"
        echo "  npm start"
        exit 1
    fi
    log_success "Server is running"

    # Check if jq is installed (optional)
    if command -v jq &> /dev/null; then
        JQ_AVAILABLE=true
        log_success "jq is available (JSON formatting enabled)"
    else
        JQ_AVAILABLE=false
        log_info "jq not installed (install for better JSON output)"
    fi

    # Create output directory
    mkdir -p "$OUTPUT_DIR"
    log_success "Output directory created: $OUTPUT_DIR"
}

# Format JSON output
format_json() {
    if [ "$JQ_AVAILABLE" = true ]; then
        jq .
    else
        cat
    fi
}

# Test 1: Health Check
test_health_check() {
    log_test "Test 1: Health Check (GET /)"
    
    response=$(curl -s "$API_URL/")
    echo "$response" | format_json
    
    if echo "$response" | grep -q "ino-icon-maker"; then
        log_success "Health check passed"
    else
        log_error "Health check failed"
        return 1
    fi
}

# Test 2: Platform Info
test_platform_info() {
    log_test "Test 2: Platform Info (GET /platforms)"
    
    response=$(curl -s "$API_URL/platforms")
    echo "$response" | format_json
    
    if echo "$response" | grep -q "ios"; then
        log_success "Platform info retrieved"
    else
        log_error "Platform info failed"
        return 1
    fi
}

# Test 3: Generate All Platforms
test_generate_all() {
    log_test "Test 3: Generate All Platforms"
    
    output_file="$OUTPUT_DIR/all-icons.zip"
    
    http_code=$(curl -s -w "%{http_code}" \
        -F "file=@$TEST_ICON" \
        "$API_URL/generate" \
        -o "$output_file")
    
    if [ "$http_code" = "200" ] && [ -f "$output_file" ]; then
        size=$(ls -lh "$output_file" | awk '{print $5}')
        log_success "Generated all platforms (${size})"
    else
        log_error "Failed to generate (HTTP $http_code)"
        return 1
    fi
}

# Test 4: Generate iOS Only
test_generate_ios() {
    log_test "Test 4: Generate iOS Only"
    
    output_file="$OUTPUT_DIR/ios-icons.zip"
    
    http_code=$(curl -s -w "%{http_code}" \
        -F "file=@$TEST_ICON" \
        "$API_URL/generate?platform=ios" \
        -o "$output_file")
    
    if [ "$http_code" = "200" ] && [ -f "$output_file" ]; then
        size=$(ls -lh "$output_file" | awk '{print $5}')
        log_success "Generated iOS icons (${size})"
    else
        log_error "Failed to generate iOS (HTTP $http_code)"
        return 1
    fi
}

# Test 5: Generate Android Only
test_generate_android() {
    log_test "Test 5: Generate Android Only"
    
    output_file="$OUTPUT_DIR/android-icons.zip"
    
    http_code=$(curl -s -w "%{http_code}" \
        -F "file=@$TEST_ICON" \
        "$API_URL/generate?platform=android" \
        -o "$output_file")
    
    if [ "$http_code" = "200" ] && [ -f "$output_file" ]; then
        size=$(ls -lh "$output_file" | awk '{print $5}')
        log_success "Generated Android icons (${size})"
    else
        log_error "Failed to generate Android (HTTP $http_code)"
        return 1
    fi
}

# Test 6: Generate Adaptive Icons with Color Background
test_generate_adaptive() {
    log_test "Test 6: Generate Android Adaptive Icons (with color background)"
    
    output_file="$OUTPUT_DIR/adaptive-icons.zip"
    
    http_code=$(curl -s -w "%{http_code}" \
        -F "foreground=@$TEST_ICON" \
        "$API_URL/generate?platform=android&backgroundColor=FF5722" \
        -o "$output_file")
    
    if [ "$http_code" = "200" ] && [ -f "$output_file" ]; then
        size=$(ls -lh "$output_file" | awk '{print $5}')
        log_success "Generated adaptive icons (${size})"
    else
        log_error "Failed to generate adaptive icons (HTTP $http_code)"
        return 1
    fi
}

# Test 7: Generate Adaptive Icons with Image Background
test_generate_adaptive_images() {
    log_test "Test 7: Generate Android Adaptive Icons (with image background)"
    
    output_file="$OUTPUT_DIR/adaptive-images.zip"
    
    http_code=$(curl -s -w "%{http_code}" \
        -F "foreground=@$TEST_ICON" \
        -F "background=@$TEST_ICON" \
        "$API_URL/generate?platform=android" \
        -o "$output_file")
    
    if [ "$http_code" = "200" ] && [ -f "$output_file" ]; then
        size=$(ls -lh "$output_file" | awk '{print $5}')
        log_success "Generated adaptive icons with images (${size})"
    else
        log_error "Failed to generate adaptive icons with images (HTTP $http_code)"
        return 1
    fi
}

# Test 8: Error - No File
test_error_no_file() {
    log_test "Test 8: Error Handling - No File"
    
    response=$(curl -s -X POST "$API_URL/generate")
    echo "$response" | format_json
    
    if echo "$response" | grep -q "error"; then
        log_success "Error handling works correctly"
    else
        log_error "Error handling failed"
        return 1
    fi
}

# Test 9: Error - Invalid Platform
test_error_invalid_platform() {
    log_test "Test 9: Error Handling - Invalid Platform"
    
    response=$(curl -s \
        -F "file=@$TEST_ICON" \
        "$API_URL/generate?platform=invalid")
    echo "$response" | format_json
    
    if echo "$response" | grep -q "error"; then
        log_success "Invalid platform rejected correctly"
    else
        log_error "Invalid platform not rejected"
        return 1
    fi
}

# Main test runner
main() {
    echo ""
    echo "╔═══════════════════════════════════════╗"
    echo "║   ino-icon-maker API Test Suite      ║"
    echo "╚═══════════════════════════════════════╝"
    echo ""
    echo "API URL: $API_URL"
    echo "Test Icon: $TEST_ICON"
    echo ""

    # Check prerequisites
    check_prerequisites

    # Track test results
    PASSED=0
    FAILED=0

    # Run tests
    tests=(
        test_health_check
        test_platform_info
        test_generate_all
        test_generate_ios
        test_generate_android
        test_generate_adaptive
        test_generate_adaptive_images
        test_error_no_file
        test_error_invalid_platform
    )

    for test in "${tests[@]}"; do
        if $test; then
            ((PASSED++))
        else
            ((FAILED++))
        fi
    done

    # Print summary
    echo ""
    echo "╔═══════════════════════════════════════╗"
    echo "║          Test Summary                 ║"
    echo "╚═══════════════════════════════════════╝"
    echo ""
    echo "Total Tests: $((PASSED + FAILED))"
    echo -e "${GREEN}Passed: $PASSED${NC}"
    echo -e "${RED}Failed: $FAILED${NC}"
    echo ""
    echo "Output files saved to: $OUTPUT_DIR"
    echo ""

    # List generated files
    if [ "$PASSED" -gt 0 ]; then
        echo "Generated files:"
        ls -lh "$OUTPUT_DIR" | grep -v "^total" | awk '{print "  " $9 " (" $5 ")"}'
        echo ""
    fi

    # Exit with appropriate code
    if [ "$FAILED" -eq 0 ]; then
        log_success "All tests passed!"
        exit 0
    else
        log_error "Some tests failed!"
        exit 1
    fi
}

# Run main function
main

