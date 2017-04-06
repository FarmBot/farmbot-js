#!/bin/bash

npm install

# Recompile
rm -rf dist
mkdir dist
node_modules/typescript/bin/tsc

# Commit
echo "Now commit this and push up. Then 'npm publish''"
