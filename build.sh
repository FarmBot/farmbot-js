#!/bin/bash

npm install
rm ./dist/*.d.ts
rm ./dist/*.js
node_modules/typescript/bin/tsc
git add -A
git commit -am 'Automated build.'
npm version tiny
