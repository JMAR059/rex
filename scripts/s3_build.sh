#!/bin/bash

# exits if something fails
set -e

echo "building app"

# moving into the node directory to build dist
cd app

echo "installing node dependencies"
npm ci

# 2. Run your build tool
echo "building the react frontend"
npm run build

# moving to root to build wasm module
cd ..

# build wasm module
echo "building wasm module"

# move it to /app/dist
echo "moving wasm module to /app/dist"

# all done
echo "build finished"