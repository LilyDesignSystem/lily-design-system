# AGENTS — LinkPicker (Svelte helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything below is a fast index.

## What this package is

A Svelte 5 headless page-links control. A single-icon button (a bundled **home** SVG) that opens a disclosure list of page
links the **app defines** ("Home", "About Us", "Contact Us", "Privacy Policy", …). Ships no CSS, no routes and no English;
the one bundled asset is the default button icon.

## Files

| File | Purpose |
| ---- | ------- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `LinkPicker.svelte` | Implementation. Svelte 5 runes + TypeScript. |
| `LinkPicker.test.ts` | Vitest spec, mapped to the §7 clauses. |
| `index.ts` | Barrel re-export. |
| `index.md` | User guide. |
| `docs/accessibility.md` | Tradeoffs, stated plainly. |
| `examples/` | Home / About Us / Contact Us / Privacy Policy, plus a SvelteKit `navigate` example. |

## Public surface

Default export `LinkPicker`; named `LinkPicker`, `linkId`, `nextLinkPickerId`; types `Props`, `ChildArgs`, `LinkItem`.
Required props: `label`, `links`.

## Behaviour contract (one paragraph)

Activating the button opens a list of real `<a href>` links built from `links` (`{ id?, label, href, current?, newTab? }`).
Choosing a link fires `onNavigate(id, href)` and closes the list; with the optional `navigate(href)` hook a plain left
click is a client-side navigation (modified clicks and `newTab` links stay native). `current` sets `aria-current="page"`.
Nothing is applied to the document and nothing is persisted.

## HTML

`<div class="link-picker">` → `<button class="link-picker-button">` with an `aria-hidden` SVG (`link-picker-icon`) →
`<div class="link-picker-tooltip" role="tooltip">` → `<ul class="link-picker-list" hidden>` of
`<li class="link-picker-list-item"><a class="link-picker-link">`.

**Not a menu.** Links are real `<a>` elements; `role="menuitem"` would strip middle-click, open-in-new-tab and copy-link-address.

## Conventions this package follows

- Svelte 5 runes; strict TypeScript on the public surface.
- Runtime dependency: `@lilydesignsystem/svelte-headless` (the trigger's `IconButton`) beside `svelte`.
- No bundled CSS, fonts, images, routes or English. The one bundled asset is the default home icon, always overridable
  through `children`.
- Every user-facing string, and every route, comes from props.
