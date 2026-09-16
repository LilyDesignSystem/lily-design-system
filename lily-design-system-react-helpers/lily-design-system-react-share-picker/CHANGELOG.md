# Changelog — SharePicker (React)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-09-16

**Package renamed: `lily-design-system-react-share-picker` → `@lilydesignsystem/react-share-picker`.** npm scoped packages
are registry-distinct from their unscoped counterparts, so this is a
new package with no publish history of its own — version reset to
`0.1.0` per this project's established rename precedent (the July
2026 `*-select` → `*-picker` rename). No code or behaviour change
relative to `lily-design-system-react-share-picker`'s last published version (`0.2.0`);
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

#### Renamed

- Previously developed in-tree as `lily-design-system-react-share-button`.
  The rename to `-share-picker` also renames the `SharePicker` symbol to
  `SharePicker` and the `share-picker*` class hooks to `share-picker*`.
  It brings the helper into line with the catalog-wide `*-picker` naming,
  and it retires the old naming exception: the trigger's hook was
  `share-button-trigger` only because `.share-button-button` read badly,
  so it is now plainly `share-picker-button` like every sibling. Nothing
  was ever published under the old name.

#### Added

- Initial release. A headless share control: a single-glyph button
  (➤, U+27A4) that opens the **native share sheet** via `navigator.share`
  where the browser provides one, and otherwise a disclosure list of
  consumer-supplied destinations plus a built-in copy-the-URL action.
  Ported from the canonical Svelte helper, mirroring its spec §-numbering
  clause for clause.
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

- Unlike the `*-picker` helpers, this owns an _action_, not a preference:
  it applies nothing to the document and persists nothing.
- The trigger's class hook is `share-picker-button`, following the same
  `{helper}-button` convention as the sibling helpers.
- The list id comes from `React.useId()`, matching the sibling helpers,
  so it survives hydration. `nextSharePickerId()` ships for parity with
  the Svelte helper but is not what the component uses.
- Focus into the list moves in a `useEffect` keyed on `open` rather than
  in the click handler, because the items do not exist in the DOM until
  the open is committed. The Svelte helper's `queueMicrotask` plays the
  same role.
- No `aria-activedescendant`, unlike the three `*-picker` siblings: the
  items here are real focusable elements, so focus moves for real.
- Behaviour differs by platform when `strategy="auto"`: a phone gets the
  OS sheet, a desktop gets the list. Documented in
  `docs/accessibility.md` rather than glossed.
