# Changelog — SharePicker (Vue)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## Unreleased

**Internal refactor: the trigger button now depends on
`@lilydesignsystem/vue-headless`'s `IconButton` instead of hand-rolling
one.** No change to the public API, rendered markup, or keyboard
contract — the full existing test suite passes unchanged. The destination/copy list stays self-contained: it is a real disclosure of `<a>`/`<button>` elements with a roving-focus pattern, not an ARIA listbox, so headless `Listbox` (which always renders `role="listbox"` over `role="option"` children) is the wrong widget for it, not merely an unmigrated one.

## 0.1.0 — 2026-09-16

**Package renamed: `lily-design-system-vue-share-picker` → `@lilydesignsystem/vue-share-picker`.** npm scoped packages
are registry-distinct from their unscoped counterparts, so this is a
new package with no publish history of its own — version reset to
`0.1.0` per this project's established rename precedent (the July
2026 `*-select` → `*-picker` rename). No code or behaviour change
relative to `lily-design-system-vue-share-picker`'s last published version (`0.2.0`);
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

Renamed from `lily-design-system-vue-share-button`, alongside its three
sibling helpers. Nothing was ever published under the old name, so the
version stays at 0.1.0 and this entry replaces the previous one.

The rename is full-depth:

- Component and default export: `SharePicker` -> `SharePicker`.
- Class hooks: `.share-picker*` -> `.share-picker`,
  `.share-picker-button`, `.share-picker-icon`, `.share-picker-list`,
  `.share-picker-list-item`, `.share-picker-target`,
  `.share-picker-copy`, `.share-picker-status`.
- Id helper: `nextSharePickerId` -> `nextSharePickerId`.

The emitted events -- `share`, `copy`, `nativeShare` -- are unchanged;
none of them said "button".

#### Changed (BREAKING)

- **The trigger naming exception is gone.** The trigger was
  `.share-picker-trigger` only because `.share-picker-button` read
  badly. Under the new name that problem disappears, so the trigger is
  now **`.share-picker-button`**, matching `theme-picker`,
  `locale-picker` and `text-size-picker`. The documented exception has
  been removed from `spec/index.md` and `AGENTS.md`.

#### The package as it stands

- Headless Vue 3 share control: a single-glyph button (U+27A4 RIGHTWARDS
  ARROW WITH HOOK) that opens the native share sheet where the browser
  has one, and otherwise discloses a list of consumer-supplied
  destinations plus an opt-in copy-the-URL action.
- Destinations are real `<a>` elements built by each target's
  `href(url, title, text)`; this package ships no third-party endpoints.
- Copy outcomes are announced in a polite live region via `copiedLabel`
  / `copyFailedLabel`.
- Owns an action, not a preference: no `v-model`, no `storageKey`,
  nothing written to the document.
- Exports `SharePicker`, `canShareNatively`, `canCopy`,
  `nextSharePickerId`, `BLACK_RIGHTWARDS_ARROWHEAD`, and the `Props` /
  `SlotArgs` / `ChildArgs` / `ShareTarget` / `ShareStrategy` types.
- Ships no CSS, fonts, icons, or images. SSR-safe.

## Prior history — released in-tree as `lily-design-system-vue-share-button`

Everything below happened in-tree under the former name, and is
kept verbatim -- headings demoted one level, old names intact -- so
the record stays accurate. None of it was published to npm.

#### 0.1.0 — 2026-07-21

##### Added

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
  `BLACK_RIGHTWARDS_ARROWHEAD`, and the types `Props`, `SlotArgs`,
  `ChildArgs`, `ShareTarget`, `ShareStrategy`.
- `SharePicker.test.ts` — 35 vitest cases under jsdom +
  `@vue/test-utils`, one or more per numbered `spec/index.md` §7 clause.
- `docs/accessibility.md`, `examples/basic.vue`, and this file.

##### Notes

- Unlike the `*-select` helpers, this owns an *action*, not a preference:
  it applies nothing to the document and persists nothing. There is
  therefore no `v-model:value`, no `storageKey`, and no hidden input.
- The trigger's class hook is `share-picker-trigger`, not
  `share-picker-button` — the one deliberate bend in the
  `{helper}-button` convention, since `.share-picker-button` reads badly.
- Behaviour differs by platform when `strategy="auto"`: a phone gets the
  OS sheet, a desktop gets the list. Documented in
  `docs/accessibility.md` rather than glossed.

##### Parity

A direct port of the Svelte canonical
`lily-design-system-svelte-share-button` v0.1.0, with the §7 clause
numbering kept identical so the two suites cross-reference.

Framework deviations, all idiomatic rather than behavioural:

- The `onShare` / `onCopy` / `onNativeShare` callback props map to the
  `share` / `copy` / `nativeShare` **emitted events**, the same way
  `onChange` maps to `@change` on the `*-select` helpers. In templates:
  `@share`, `@copy`, `@native-share`.
- The `children` snippet maps to the **default scoped slot**, and the
  `ChildArgs` type is aliased as `SlotArgs` (both are exported), matching
  how `theme-picker` and `text-size-picker` name it.
- Rest props reach the root `<div>` via Vue's `$attrs` fall-through
  rather than an explicit spread.
- `queueMicrotask` before `.focus()` becomes `await nextTick()`, Vue's
  DOM-flush primitive.

##### Not a listbox, deliberately

The other three helpers in this catalog are WAI-ARIA APG listboxes
driven by `aria-activedescendant`. This one is a disclosure with real
focusable links, because its items are navigation. Harmonising it into
a listbox would reintroduce exactly the `role="menuitem"` costs the
Svelte spec §3 rejects.

---

Lily™ and Lily Design System™ are trademarks.
