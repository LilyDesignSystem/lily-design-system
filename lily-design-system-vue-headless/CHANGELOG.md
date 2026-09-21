# Changelog — @lilydesignsystem/vue-headless

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the package follows [Semantic Versioning](https://semver.org/).

## Unreleased

**`Listbox` and `IconButton` extended, additively, to support the
`*-helpers` catalog's icon-button-triggered pickers depending on them
instead of hand-rolling equivalent markup/keyboard logic — porting the
same extension already made to `@lilydesignsystem/svelte-headless`.**
Both components had zero real consumers elsewhere in this catalog
(only doc-comment mentions found) before this change — full suite
(2668 tests) still green.

- `IconButton` gains `baseClass` (default `"icon-button"`, unchanged)
  — a consumer whose own contract requires an exact class (no extra
  `icon-button` token, since Vue's default class fallthrough only
  concatenates) sets `baseClass` instead — and `defineExpose({ el })`
  exposing the rendered `<button>` so a consumer can call `.focus()`
  on it (neither component exposed anything via `defineExpose` before
  this change).
- `Listbox` gains `baseClass` (default `"listbox"`, same reasoning)
  and `as` (default `"div"`, unchanged — a consumer needing e.g. a
  `<ul>` root sets `as="ul"`, rendered via `<component :is="as">`),
  plus an opt-in `navigation="active-descendant"` mode (default
  remains `"roving-focus"`, byte-for-byte unchanged behaviour): the
  root holds real focus and tracks a virtual cursor
  (`aria-activedescendant`, `v-model:activeIndex`) rather than moving
  DOM focus between options, plus `clamp` (vs. wrap), `typeahead`,
  `pageSize` paging, and `activate`/`escape`/`tab-out` emits — the
  full WAI-ARIA APG listbox keyboard contract the picker helpers
  already implement by hand. `defineExpose({ el })` exposes the
  rendered root the same way.

## 0.1.0 — 2026-09-16

**Package renamed: `lily-design-system-vue-headless` → `@lilydesignsystem/vue-headless`.** npm scoped packages
are registry-distinct from their unscoped counterparts, so this is a
new package with no publish history of its own — version reset to
`0.1.0` per this project's established rename precedent (the July
2026 `*-select` → `*-picker` rename). No code or behaviour change
relative to `lily-design-system-vue-headless`'s last published version (`0.1.0`);
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
  every `import … from "@lilydesignsystem/vue-headless"` failed at
  resolution. 0.2.0 is broken on npm for this reason. The package now
  builds a real `dist/` with Vite library mode + vue-tsc and points `main`/`types`/
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

Real runtime defects, not just typing gaps:

- `FiveStarRatingPicker`, `FiveFaceRatingPicker` and
  `NetPromoterScorePicker` bound `:checked="value === …"` and
  `@change="value = …"` to `value` — an identifier none of them declares.
  The control rendered unchecked whatever the model held, and choosing an
  option recorded nothing. The bindings now use `modelValue`. Their
  existing "clicking selects it" tests passed against the broken code,
  because a native radio checks itself on click regardless of what Vue
  bound to it; tests that assert the emitted `update:modelValue` have been
  added, and each was confirmed to fail before the fix.
- `NetPromoterScorePicker` additionally wrapped its change handler in
  `{{ }}` interpolation inside a directive value.
- `FiveStarRatingPicker` and `NetPromoterScorePicker` rendered stray
  `:star="star"` / `:score="score"` attribute text as visible label
  content, so no star or score number was shown.
- `TagInput` called `onadd?.()`, an identifier it never declared, so
  pressing Enter threw a `ReferenceError`. It now emits an `add` event,
  the Vue idiom for the `onAdd` callback the React sibling exposes.
- `FiveFaceRatingPicker` and `FiveFaceRatingView` passed an array literal
  as a `withDefaults` default, where Vue requires a factory.
- `ProgressCircle`'s tests queried `getByRole("Progress")`, which is not a
  valid ARIA role and never matched; the component correctly renders
  `role="progressbar"`. Those four tests had been failing.

All 2655 tests pass; 4 were failing before.
