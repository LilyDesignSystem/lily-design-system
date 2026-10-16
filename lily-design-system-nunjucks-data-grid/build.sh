#!/usr/bin/env bash
# Build dist/: tsup bundles data-grid.client.ts (its behaviour and the grid element) to dist/index.js + index.d.ts;
# the .njk template is copied alongside. No Lily dependencies.
set -e
cd "$(dirname "$0")"
name=data-grid

tsup "$name.client.ts" --format esm --dts --clean --out-dir dist
mv "dist/$name.client.js" "dist/index.js"
mv "dist/$name.client.d.ts" "dist/index.d.ts"
cp "$name.njk" dist/
echo "built dist"
