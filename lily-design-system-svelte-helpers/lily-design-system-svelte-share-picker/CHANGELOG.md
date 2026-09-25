# Changelog — SharePicker (Svelte)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.2 — 2026-09-25

**Fix: dependency range on `@lilydesignsystem/svelte-headless` widened
from `^0.1.0` to `^0.2.0`.** 0.1.1 (below) started passing `baseClass`
to `IconButton` — a prop that only exists in `svelte-headless` 0.2.0.
Because `^0.1.0` never resolves to a 0.2.x release, every consumer
installing this package fresh got 0.1.x's `IconButton`, which does not
recognise `baseClass` and spreads it onto the rendered element as an
inert HTML attribute (`baseclass="share-picker-button"`) instead of
applying it as a class. The practical symptom: the trigger button never
actually received the `share-picker-button` class, so a consumer's
styling for it silently did nothing. No code change here; the
component's own implementation was already correct — only the manifest
was wrong.

## 0.1.1 — 2026-09-21

**Internal refactor: the trigger button now depends on
`@lilydesignsystem/svelte-headless`'s `IconButton` instead of
hand-rolling one.** No change to the public API, rendered markup, or
keyboard contract — the full existing test suite passes unchanged.
The destination/copy list stays self-contained: it is a real
disclosure of `<a>`/`<button>` elements with a roving-focus pattern,
not an ARIA listbox, so headless `Listbox` (which always renders
`role="listbox"` over `role="option"` children) is the wrong widget
for it, not merely an unmigrated one.

## 0.1.0 — 2026-09-16

**Package renamed: `lily-design-system-svelte-share-picker` → `@lilydesignsystem/svelte-share-picker`.** npm scoped packages
are registry-distinct from their unscoped counterparts, so this is a
new package with no publish history of its own — version reset to
`0.1.0` per this project's established rename precedent (the July
2026 `*-select` → `*-picker` rename). No code or behaviour change
relative to `lily-design-system-svelte-share-picker`'s last published version (`0.2.0`);
its full changelog continues below, now read as history prior to the
rescope. The old unscoped name is deprecated on the registry (never
unpublished), pointing consumers here.

---

## 0.2.0 — 2026-09-16

### Changed (BREAKING)

- **Default icon changed from a Unicode glyph to a bundled SVG.** The
  button's `share-picker-icon` now renders an inline
  `<svg viewBox="0 0 16 16" aria-hidden="true">` (outline right arrow (matching https://testingexamples.github.io/) design,
  `stroke="currentColor"`, `stroke-width="1.6"`, round caps/joins,
  explicit `width="1.05rem" height="1.05rem"`) instead of a text glyph
  in a `<span>`. Renders identically on every platform and font stack —
  no missing-glyph risk, no per-glyph optical-scale correction to maintain (the
  45 root `themes/*.css` files' `--lily-picker-icon-scale` rule is
  dropped for this icon; an SVG's ink fills its own `viewBox` by
  construction). The exported glyph constant **`BLACK_RIGHTWARDS_ARROWHEAD`**
  (➤ U+27A4) is **removed, not renamed** — there is
  no longer a single swappable character value to export. `children`
  still overrides the icon exactly as before.

### Fixed

- **Opening the popup no longer scrolls the page.** The `.focus()`
  calls this component makes on itself — moving focus onto the open
  panel, and back to the trigger button on close — now pass
  `{ preventScroll: true }`. Without it, a popup rendered partly
  off-screen (the shipped default CSS anchors to the left edge and
  grows rightward, which overflows a right-aligned header picker
  unless the consumer adds an `inset-inline-end` override) triggered
  the browser's default scroll-into-view, which read as the whole page
  jumping sideways the instant the picker opened.

## 0.1.1 — 2026-08-26

Metadata-only patch; no behaviour change. Ships the corrected package
metadata to the registry: the project SPDX license menu (`MIT OR
Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause`) replacing
the single-license field that contradicted the repository's
LICENSE.md, `repository`/`homepage`/`bugs` URLs, a named author, and a
description that says what the package does.

## 0.1.0 — 2026-07-30

First published release. Nothing earlier shipped, so the
accessibility hardening completed after the initial entry below is
part of 0.1.0 rather than a later version.

### Accessibility hardening (2026-07-29/30)

#### Changed

- **`Tab` from the open list no longer strands keyboard focus.** The
  handler hid the list while it had focus; the browser then moved focus
  to `<body>` and the default Tab restarted from the top of the
  document. Focus now goes to the trigger button first — without
  cancelling the key — so the default Tab proceeds from the picker's
  own position.

#### Added

- The list carries the picker's accessible name (`aria-label` =
  `label`), matching the sibling pickers' listboxes: a screen reader
  entering the list hears what it is for, not just "list, three items".

### Initial entry — 2026-07-21

#### Changed (BREAKING)

- Renamed from `lily-design-system-svelte-share-button`. Directory,
  component (`SharePicker.svelte`), exported symbols (`SharePicker`,
  `nextSharePickerId`) and class hooks (`share-picker`,
  `share-picker-button`, `share-picker-icon`, `share-picker-list`,
  `share-picker-list-item`, `share-picker-target`,
  `share-picker-copy`, `share-picker-status`) all carry the new name.
- **The trigger's class hook is now `share-picker-button`**, replacing
  `share-picker-trigger`. That exception existed only because
  `.share-button-button` read badly; under the new name the problem
  disappears, so this helper follows the same `{helper}-button`
  convention as its siblings. The documented exception is removed.
- A headless Svelte 5 share control: a single-glyph button (➤) that
  opens the native share sheet via `navigator.share` where the browser
  has one, and otherwise a disclosure list of consumer-supplied
  destinations plus a copy-the-page-URL action. No social-network
  endpoints and no CSS ship with the package.

#### Versioning

- Version reset to `0.1.0`. Nothing has been published under the name
  `@lilydesignsystem/svelte-share-picker`, so continuing the old
  number line would imply releases that never existed under this name.

---

## Prior history — released in-tree as `lily-design-system-svelte-share-button`

Previously released in-tree as `lily-design-system-svelte-share-button`. Everything below happened
under that name. Identifiers in these entries (class hooks, symbols, data
attributes) have been updated to their current spellings so the document
reads coherently; the events they describe are unchanged.

### 0.1.0 — 2026-07-20

#### Added

- Initial release. A headless share control: a single-glyph button
  (➤, U+27A4) that opens the **native share sheet** via `navigator.share`
  where the browser provides one, and otherwise a disclosure list of
  consumer-supplied destinations plus a built-in copy-the-URL action.
- `targets` are supplied by the consumer, each with its own `href(url,
title, text)` function. **No social-network endpoints ship with this
  package** — which networks belong in a product is an editorial and
  privacy decision, the URLs change, and networks die.
- Destinations render as real `<a>` elements rather than
  `role="menuitem"`, preserving middle-click, open-in-new-tab and
  copy-link-address. Copy is a real `<button>`.
- Copy outcome is announced in an `aria-live="polite"` region.
  `copyLabel`, `copiedLabel` and `copyFailedLabel` are all props — the
  copy item renders only when named, since a default label would be a
  hardcoded English string.
- Keyboard: arrows move between items and clamp, Home/End jump, Escape
  closes and returns focus to the trigger, Tab closes and moves on.
- Exports `canShareNatively`, `canCopy`, `nextSharePickerId`,
  `BLACK_RIGHTWARDS_ARROWHEAD`.

#### Notes

- Unlike the `*-select` helpers, this owns an _action_, not a preference:
  it applies nothing to the document and persists nothing.
- The trigger's class hook is `share-picker-button`, not
  `share-picker-button` — the one deliberate bend in the
  `{helper}-button` convention, since `.share-picker-button` reads badly.
- Behaviour differs by platform when `strategy="auto"`: a phone gets the
  OS sheet, a desktop gets the list. Documented in
  `docs/accessibility.md` rather than glossed.
