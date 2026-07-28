# Changelog — SharePicker (React)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-21

### Renamed

- Previously developed in-tree as `lily-design-system-react-share-button`.
  The rename to `-share-picker` also renames the `SharePicker` symbol to
  `SharePicker` and the `share-picker*` class hooks to `share-picker*`.
  It brings the helper into line with the catalog-wide `*-picker` naming,
  and it retires the old naming exception: the trigger's hook was
  `share-button-trigger` only because `.share-button-button` read badly,
  so it is now plainly `share-picker-button` like every sibling. Nothing
  was ever published under the old name.

### Added

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

### Notes

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
