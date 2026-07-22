#!/bin/bash

# Cardano Multiplatform Lib
BUILD_DIR="$(pwd)/src/libs/cardano-multiplatform-lib"
rm -rf "$BUILD_DIR"
cd "$(pwd)/rust/cardano-multiplatform-lib/cml/wasm"
wasm-pack build --target browser --out-dir "$BUILD_DIR/browser"
wasm-pack build --target nodejs --out-dir "$BUILD_DIR/nodejs"
wasm-pack build --target web --out-dir "$BUILD_DIR/web"

# Clean up
find "$BUILD_DIR" -type f -name '.gitignore' -exec rm -f {} +
find "$BUILD_DIR" -type f -name 'README.md' -exec rm -f {} +