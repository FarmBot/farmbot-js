#!/bin/bash

npm install

# Recompile
rm ./dist/*.d.ts
rm ./dist/*.js
node_modules/typescript/bin/tsc

# Commit
git add -A
git commit -am 'Automated build.'
npm version patch
