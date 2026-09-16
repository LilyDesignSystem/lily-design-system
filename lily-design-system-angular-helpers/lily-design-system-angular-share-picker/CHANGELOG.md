# Changelog — SharePicker (Angular)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-09-16

**Package renamed: `lily-design-system-angular-share-picker` → `@lilydesignsystem/angular-share-picker`.** npm scoped packages
are registry-distinct from their unscoped counterparts, so this is a
new package with no publish history of its own — version reset to
`0.1.0` per this project's established rename precedent (the July
2026 `*-select` → `*-picker` rename). No code or behaviour change
relative to `lily-design-system-angular-share-picker`'s last published version (`0.3.0`);
its full changelog continues below, now read as history prior to the
rescope. The old unscoped name is deprecated on the registry (never
unpublished), pointing consumers here.

---

## 0.3.0 — 2026-09-16

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

## 0.2.0 — 2026-08-26

Angular 22 support: peer range widens to `>=20.0.0 <23.0.0`; built and
tested on Angular 22.1 (ng-packagr 22.1, TypeScript 6.0, vitest 4).
No behaviour change beyond 0.1.1.

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

- **Previously carried in-tree as
  `lily-design-system-angular-share-button`**, at 0.1.0 and never
  published. The package name, directory, component class, selector
  (`lily-share-picker`), marker directive and class hooks all changed
  with it, bringing this helper in line with its three `*-picker`
  siblings. The trigger hook `share-button-trigger` became plain
  `share-picker-button` — see the note below.

#### Added

- Initial release. An Angular 20 port of the canonical Svelte
  `share-picker` helper: a headless share control whose single-glyph
  button (➤, U+27A4) opens the **native share sheet** via
  `navigator.share` where the browser provides one, and otherwise a
  disclosure list of consumer-supplied destinations plus a built-in
  copy-the-URL action.
- Standalone, signal-based, `OnPush`, `@for` control flow, zero CSS.
- `targets` are supplied by the consumer, each with its own
  `href(url, title, text)` function. **No social-network endpoints ship
  with this package** — which networks belong in a product is an
  editorial and privacy decision, the URLs change, and networks die.
- Destinations render as real `<a>` elements rather than
  `role="menuitem"`, preserving middle-click, open-in-new-tab and
  copy-link-address. Copy is a real `<button>`.
- Copy outcome is announced in an `aria-live="polite"` region.
  `copyLabel`, `copiedLabel` and `copyFailedLabel` are all inputs — the
  copy item renders only when named, since a default label would be a
  hardcoded English string.
- Keyboard: arrows open the list on the first / last item and then move
  between items, clamping rather than wrapping; `Home` / `End` jump;
  `Escape` closes and returns focus to the trigger; `Tab` closes and
  moves on. Items are real focusable elements, so focus moves for real.
- Clicking outside the root, or focus leaving it, closes the list
  without stealing focus back.
- A projected `<ng-template>` replaces the glyph and receives
  `ChildArgs` (`{ open, url }`); the optional `SharePickerIcon` marker
  directive types the `let-` variables.
- Exports `canShareNatively`, `canCopy`, `nextSharePickerId`,
  `BLACK_RIGHTWARDS_ARROWHEAD`, and the types `ChildArgs`,
  `ShareTarget`, `ShareStrategy`, `ShareEvent`.
- 47 vitest cases mapped onto the `spec/index.md` §7 clauses.

#### Notes

- Unlike the three preference helpers, this owns an _action_, not a
  preference: it applies nothing to the document and persists nothing.
  No `localStorage`, no `data-*` on the document root.
- The trigger's class hook is `share-picker-button`, following the
  `{helper}-button` convention exactly. Under the package's former name
  it had to be `share-button-trigger`, because `.share-button-button`
  read badly; the rename removed the need for that exception.
- A dismissed native sheet **ends** the interaction. `navigator.share()`
  rejects when the user closes the sheet; falling through to the list
  would resurrect UI they just dismissed.
- Angular deviations from the canonical Svelte contract: callbacks are
  `output()`s (`(share)` emits one `ShareEvent` object rather than two
  positional arguments), and the consumer's class hook is `className`
  because `class` is not a legal Angular input name.
- Promise rejections attach their handler at the call site
  (`.then(ok, err)`) rather than relying on `try { await }` — under
  zone.js a rejection caught only by a native `await` is still reported
  as an unhandled error against the originating click task.

#### Accessibility

- The tradeoffs are documented in `docs/accessibility.md` rather than
  glossed: the accessible name rests entirely on `aria-label` with no
  visible fallback; behaviour differs by platform under
  `strategy="auto"`; the glyph is font-dependent (though ➤ is in-font
  and materially safer than an emoji); and copy can fail for reasons
  invisible to the user, so `copyFailedLabel` should be actionable.

---

Lily™ and Lily Design System™ are trademarks.
