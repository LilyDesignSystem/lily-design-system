# Changelog — @lilydesignsystem/solid-headless

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the package follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-11-17

- First release: all 637 catalog components for Solid 2.0 (`solid-js` and `@solidjs/web` ^2.0.0 as peers), with the
  same root elements, class hooks, ARIA, keyboard contracts and no English defaults as the other Lily catalogs.
- Two builds: `dist/source` keeps the JSX, for the `solid` export condition (a Solid app compiles it for the browser
  or the server); `dist/index.js` is compiled for the browser, for any other bundler. Types in `dist/source`.
- `class`, not `className`. A default applies when a prop is `undefined` (`withDefaults`), and ARIA and data booleans
  render `"true"` / `"false"` (`attr`), as in the other catalogs.
- The pure modules `clinical-format` and `ips-sections` are exported beside the components.
- The monorepo [CHANGELOG](../CHANGELOG.md) has the detail.
