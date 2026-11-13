#!/bin/bash

# exits if something fails
set -e

echo "building app"

echo "installing node dependencies"
npm ci

# 2. Run your build tool
echo "building the react frontend"
npm run build

echo "build finished"