#!/bin/bash

# Test script to verify basePath configuration

echo "Testing basePath configuration for /blog subdirectory..."
echo ""
echo "1. Building the project..."
npm run build

echo ""
echo "2. Starting the server..."
echo "Visit http://localhost:3000/blog to test the blog"
echo "Check the browser console for any errors"
echo ""
npm run start