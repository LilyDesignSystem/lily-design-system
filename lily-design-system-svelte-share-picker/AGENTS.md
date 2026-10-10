# AGENTS — SharePicker (Svelte helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

A Svelte 5 headless share control. A single-icon button (a bundled
outline-arrow SVG) that uses the **native share sheet** when the
browser has one, and otherwise opens a disclosure list of
consumer-supplied destinations plus a built-in copy-the-URL action.
Ships no CSS and no third-party endpoints; the one bundled asset is
the default button icon (reversed 2026-09-16 from a Unicode glyph).

## Files

| File | Purpose |
| ---- | ------- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `SharePicker.svelte` | Implementation. Svelte 5 runes + TypeScript. |
| `SharePicker.test.ts` | Vitest spec, mapped to the §7 clauses. |
| `index.ts` | Barrel re-export. |
| `index.md` | User guide. |
| `docs/accessibility.md` | Tradeoffs, stated plainly. |

## Public surface

Default export `SharePicker`; named `SharePicker`, `canShareNatively`,
`canCopy`, `nextSharePickerId`; types `Props`, `ChildArgs`,
`ShareTarget`, `ShareStrategy`. No glyph constant — the default icon
is a bundled SVG, not a Unicode character.

Required prop: `label`.

## Behaviour contract (one paragraph)

Activating the button either opens the native sheet
(`navigator.share`, when `strategy` allows and it exists) or opens the
list. Destinations are real links built by each target's `href(url,
title, text)`. The copy item writes `url` to the clipboard, fires
`onCopy`, and announces `copiedLabel` / `copyFailedLabel` in a polite
live region. Nothing is applied to the document and nothing is
persisted — unlike the `*-picker` helpers, this owns an action, not a
preference.

## HTML

`<div class="share-picker">` → `<button class="share-picker-button">`
with an `aria-hidden` SVG icon → `<ul class="share-picker-list" hidden>`
of `<li>` containing `<a class="share-picker-target">` and an optional
`<button class="share-picker-copy">` → `<p class="share-picker-status"
aria-live="polite">`.

**Not a menu.** Destinations are real `<a>` elements; `role="menuitem"`
would strip middle-click, open-in-new-tab and copy-link-address. The
trigger class is `share-picker-button`, matching the `{helper}-button`
convention the sibling helpers use.

## Conventions this package follows

- Svelte 5 runes; strict TypeScript on the public surface.
- No runtime dependency beyond `svelte`.
- No bundled CSS, fonts, images, or third-party URLs. The one
  deliberate exception is the default button icon: a bundled SVG
  (reversed 2026-09-16 from a Unicode glyph), matching the other four
  page-header pickers.
- All user-facing strings come from props — including the copy label,
  which is why the copy item is opt-in.
