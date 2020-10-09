#!/bin/bash

npm install

# Recompile
rm -rf dist
mkdir dist
node_modules/typescript/bin/tsc
parcel build src/farmbot_single_file.js

# Commit
echo "Now run this: "
echo "    git add -A"
echo "    git commit -am 'FBJS Version x.y.z'"
echo "    git push ____ main"
echo "    npm publish"
