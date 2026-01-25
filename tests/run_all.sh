#!/bin/bash

echo "Running BASIC Test Suite"
echo "========================"

for file in tests/samples/*.bas; do
    echo ""
    echo "Testing: $file"
    echo "------------------------"
    bun index.ts --file "$file"
    echo ""
done

echo "All tests complete!"
