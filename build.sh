#!/bin/bash

npm install

# Recompile
rm ./dist/*.d.ts
rm ./dist/*.js
node_modules/typescript/bin/tsc

# Commit
echo "Now commit this and push up. Then `npm publish`"
