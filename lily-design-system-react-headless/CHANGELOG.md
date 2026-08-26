# Changelog — lily-design-system-react-headless

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the package follows [Semantic Versioning](https://semver.org/).

## 0.3.1 — 2026-08-26

Metadata-only patch; no code change. Ships the corrected package
metadata to the registry:

- `license` is the project SPDX menu (`MIT OR Apache-2.0 OR
  GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause`), replacing the
  single-license field that contradicted the repository's LICENSE.md.
- `repository`, `homepage`, and `bugs` point at the LilyDesignSystem
  organisation and the documentation site.
  The previous URLs pointed at `github.com/lily/…`, an unrelated
  account — the repository link on the npm page led to a stranger's 404.
- `description` says "Targets WCAG 2.2 AAA." — the previous
  "WCAG 2.2 AAA compliant" claimed a conformance no audit supports.
- `author` names the maintainer rather than a bare email address.

Also as of this release, 0.2.0 is marked deprecated on npm (it
declared a `main` that was never built; see 0.3.0's notes).

## 0.3.0 — 2026-08-23

### Fixed

- **The package had no entry point.** `package.json` declared
  `"main": "index.js"` and no such file was ever built or shipped, so
  every `import … from "lily-design-system-react-headless"` failed at
  resolution. 0.2.0 is broken on npm for this reason. The package now
  builds a real `dist/` with tsup and points `main`/`types`/
  `exports` at it.

### Added

- A generated barrel (`index.ts`, written by `build.mjs`) exporting all
  491 components in the catalog. It is generated rather than
  hand-maintained because the catalog grows, and a hand-written list
  silently omits new components.
- `build.mjs` — generates the barrel, builds `dist/`, and fails loudly if
  the bundle comes out empty.
- A `files` allowlist.

### Changed

- **Tarball contents.** Previously the package shipped its entire working
  tree — sources, tests, Storybook stories, docs and config. It now ships
  only `dist/` plus the docs.
- `peerDependencies` now declares the framework it needs.
- The description said "236 components"; the catalog has 491.

### Also fixed (surfaced by building declarations for the first time)

Nine type errors that no build had ever exercised:

- Eight components destructured `children` and/or `label` without
  declaring either on their props interface, so both resolved through the
  `[key: string]: unknown` index signature: `ContentsList`, `ContentsNav`,
  `EmojiCharacterPicker`, `Figure`, `FileManager`, `QrCodeImage`,
  `Sonner`, `Sparkline`. The runtime behaviour was already correct — the
  types simply did not describe it, and `aria-label={label}` typed as
  `unknown` blocked declaration emit.
- `TreeList` held its root ref as `useRef<HTMLElement>` while attaching it
  to an `<ol>`, which wants `Ref<HTMLOListElement>`.

All 2665 tests pass.
