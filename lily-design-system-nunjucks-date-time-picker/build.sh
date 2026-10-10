#!/usr/bin/env bash
# Build dist/: tsup bundles date-time-picker.client.js (its behaviour) to
# dist/index.js + index.d.ts; the .njk template, when this package has
# one, is copied alongside. Run from this package's own directory, tsup
# treats every `dependencies` entry in package.json as external, so a
# sibling package is never bundled in; the bare import stays for a real
# install to resolve.
set -e
cd "$(dirname "$0")"
name=date-time-picker

tsup "$name.client.js" --format esm --dts --clean --out-dir dist
mv "dist/$name.client.js" "dist/index.js"
mv "dist/$name.client.d.ts" "dist/index.d.ts"
if [ -f "$name.njk" ]; then
  cp "$name.njk" dist/
fi
echo "built dist"
