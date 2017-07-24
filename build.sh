#!/bin/bash

npm install

# Recompile
rm -rf dist
mkdir dist
node_modules/typescript/bin/tsc

# Update Documentation
typedoc --out ./doc/ src/farmbot.ts

# Commit
echo "Now run this: "
echo "    git commit -am 'FBJS Version x.y.z'"
echo "    git push ____ master"
echo "    npm publish"
