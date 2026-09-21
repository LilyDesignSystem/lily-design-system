#!/usr/bin/env bash
# Build each publishable helper sub-package's `dist/` with tsup.
#
# Each package directory needs `{name}.client.js` (its behaviour); the
# `.njk` template is optional — a behaviour-only package (e.g.
# lily-design-system-nunjucks-listbox-behavior) ships no markup of its
# own. Extracted from an inline package.json one-liner once it grew a
# conditional; kept in its own file for the same reason every other
# catalog's build.js is a real file, not a one-liner.
set -e

built=0
for d in lily-design-system-nunjucks-*/; do
  d=${d%/}
  [ -f "$d/package.json" ] || continue
  name=${d#lily-design-system-nunjucks-}

  if [ ! -f "$d/$name.client.js" ]; then
    echo "build: $d has package.json but no $name.client.js" >&2
    exit 1
  fi

  deps=$(node -e "const p=require('./$d/package.json');process.stdout.write(Object.keys(p.dependencies||{}).map(d=>'--external '+d).join(' '))")
  tsup "$d/$name.client.js" --format esm --dts --clean --out-dir "$d/dist" $deps
  mv "$d/dist/$name.client.js" "$d/dist/index.js"
  mv "$d/dist/$name.client.d.ts" "$d/dist/index.d.ts"

  if [ -f "$d/$name.njk" ]; then
    cp "$d/$name.njk" "$d/dist/"
  fi

  built=$((built + 1))
done

if [ "$built" -eq 0 ]; then
  echo "build: no helper packages discovered" >&2
  exit 1
fi

echo "build: $built helper package(s) built"
