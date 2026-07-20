# AGENTS — ShareButton (Svelte helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

A Svelte 5 headless share control. A single-glyph button (↪, U+21AA)
that uses the **native share sheet** when the browser has one, and
otherwise opens a disclosure list of consumer-supplied destinations plus
a built-in copy-the-URL action. Ships no CSS, no icons, and no
third-party endpoints.

## Files

| File | Purpose |
| ---- | ------- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `ShareButton.svelte` | Implementation. Svelte 5 runes + TypeScript. |
| `ShareButton.test.ts` | Vitest spec, mapped to the §7 clauses. |
| `index.ts` | Barrel re-export. |
| `index.md` | User guide. |
| `docs/accessibility.md` | Tradeoffs, stated plainly. |

## Public surface

Default export `ShareButton`; named `ShareButton`, `canShareNatively`,
`canCopy`, `nextShareButtonId`, `RIGHTWARDS_ARROW_WITH_HOOK`; types
`Props`, `ChildArgs`, `ShareTarget`, `ShareStrategy`.

Required prop: `label`.

## Behaviour contract (one paragraph)

Activating the button either opens the native sheet
(`navigator.share`, when `strategy` allows and it exists) or opens the
list. Destinations are real links built by each target's `href(url,
title, text)`. The copy item writes `url` to the clipboard, fires
`onCopy`, and announces `copiedLabel` / `copyFailedLabel` in a polite
live region. Nothing is applied to the document and nothing is
persisted — unlike the `*-select` helpers, this owns an action, not a
preference.

## HTML

`<div class="share-button">` → `<button class="share-button-trigger">`
with an `aria-hidden` glyph span → `<ul class="share-button-list" hidden>`
of `<li>` containing `<a class="share-button-target">` and an optional
`<button class="share-button-copy">` → `<p class="share-button-status"
aria-live="polite">`.

**Not a menu.** Destinations are real `<a>` elements; `role="menuitem"`
would strip middle-click, open-in-new-tab and copy-link-address. The
trigger class is `share-button-trigger`, not `-button`, because
`.share-button-button` reads badly — the one deliberate bend in the
`{helper}-button` convention.

## Conventions this package follows

- Svelte 5 runes; strict TypeScript on the public surface.
- No runtime dependency beyond `svelte`.
- No bundled CSS, fonts, icons, images, or third-party URLs.
- All user-facing strings come from props — including the copy label,
  which is why the copy item is opt-in.
