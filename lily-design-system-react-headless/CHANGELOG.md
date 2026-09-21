# Changelog — @lilydesignsystem/react-headless

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the package follows [Semantic Versioning](https://semver.org/).

## Unreleased

**`Listbox` and `IconButton` extended, additively, to support the
`react-helpers` catalog's icon-button-triggered pickers depending on
them instead of hand-rolling equivalent markup/keyboard logic** —
porting the same change already made to `@lilydesignsystem/svelte-headless`.
Both components had zero real consumers elsewhere in this
491-component catalog (confirmed by search before changing either;
`Listbox` had two doc-comment *mentions* as an example, no actual
imports) — full suite (2679 tests) still green.

- `IconButton` gains `baseClass` (default `"icon-button"`, unchanged)
  and a forwarded ref (`React.forwardRef`) exposing the rendered
  `<button>`. Its props interface now extends
  `React.ButtonHTMLAttributes<HTMLButtonElement>` instead of a
  `[key: string]: unknown` catch-all — restProps (`aria-haspopup`,
  `aria-expanded`, `aria-controls`, `onKeyDown`, etc.) keep real types,
  and `forwardRef`'s `Omit<P, "ref">` machinery no longer collapses
  named properties on an indexed type during `.d.ts` generation (a
  real build break this refactor hit and fixed, not a style choice).
- `Listbox` gains an opt-in `navigation="active-descendant"` mode
  (default remains `"roving-focus"`, byte-for-byte unchanged
  behaviour): the root holds real focus and tracks a virtual cursor
  (`aria-activedescendant`, a controlled/uncontrolled `activeIndex` +
  `onActiveIndexChange`, mirroring Svelte's bindable `activeIndex`)
  rather than moving DOM focus between options, plus `clamp` (vs.
  wrap), `typeahead`, `pageSize` paging, `onActivate`/`onEscape`/
  `onTabOut` callbacks, `baseClass`, `as` (root tag, default `"div"`),
  and a forwarded ref. Same props interface fix as `IconButton`
  (extends `React.HTMLAttributes<HTMLElement>`, no index signature).

## 0.1.0 — 2026-09-16

**Package renamed: `lily-design-system-react-headless` → `@lilydesignsystem/react-headless`.** npm scoped packages
are registry-distinct from their unscoped counterparts, so this is a
new package with no publish history of its own — version reset to
`0.1.0` per this project's established rename precedent (the July
2026 `*-select` → `*-picker` rename). No code or behaviour change
relative to `lily-design-system-react-headless`'s last published version (`0.1.0`);
its full changelog continues below, now read as history prior to the
rescope. The old unscoped name is deprecated on the registry (never
unpublished), pointing consumers here.

---

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
  every `import … from "@lilydesignsystem/react-headless"` failed at
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
