#!/bin/bash

echo "🧪 Running Blockchain Product Authentication System Tests"
echo "======================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Installing dependencies..."
npm install

# Run smart contract tests
print_status "Running smart contract tests..."
if npx hardhat test; then
    print_status "✅ Smart contract tests passed"
else
    print_error "❌ Smart contract tests failed"
    exit 1
fi

# Run API tests
print_status "Running API tests..."
if npm test -- --testPathPattern=api.test.js; then
    print_status "✅ API tests passed"
else
    print_error "❌ API tests failed"
    exit 1
fi

# Run integration tests
print_status "Running integration tests..."
if npm test -- --testPathPattern=integration.test.js; then
    print_status "✅ Integration tests passed"
else
    print_error "❌ Integration tests failed"
    exit 1
fi

# Generate coverage report
print_status "Generating coverage report..."
npm test -- --coverage

print_status "🎉 All tests completed successfully!"
print_status "📊 Coverage report generated in ./coverage directory"

echo ""
echo "======================================================="
echo "✅ Test Suite Summary:"
echo "   - Smart Contract Tests: PASSED"
echo "   - API Tests: PASSED" 
echo "   - Integration Tests: PASSED"
echo "   - Coverage Report: Generated"
echo "======================================================="
