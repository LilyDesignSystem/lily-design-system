# AGENTS — `<text-size-select>` (HTML helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable vanilla HTML/JS headless text-size select, packaged as the
`<text-size-select>` custom element. Renders a native `<select>` of
size slugs and applies the chosen slug to the document root via
`data-text-size`, with optional `localStorage` persistence. Ships no
CSS; the consumer styles the `text-size-select` class hook on rendered
children and maps each `[data-text-size="…"]` slug to real typography.

## Files

| File                        | Purpose                                          |
| --------------------------- | ------------------------------------------------ |
| `spec/index.md`                   | Specification-driven contract (canonical).       |
| `text-size-select.ts`       | Implementation (TypeScript class).               |
| `text-size-select.test.ts`  | Vitest + jsdom spec, one assertion per §7 item.  |
| `index.ts`                  | Barrel re-export + side-effectful registration.  |
| `index.md`                  | Human-readable guide.                            |

## Public surface

- Class `TextSizeSelect extends HTMLElement` (registered as
  `<text-size-select>` on import of `index.ts`).
- Type exports: `TextSizeSelectProps`, `TextSizeSelectChangeDetail`.

Required attributes: `label`, `sizes`. Full table in
[spec/index.md §4.1](./spec/index.md#41-observed-attributes).

## Behaviour contract (one paragraph)

On every size change the element (1) sets `data-text-size="{slug}"` on
`target` (default `document.documentElement`), (2) optionally writes
the slug to `localStorage[storageKey]`, and (3) dispatches a
`textsizechange` `CustomEvent` carrying the slug. Initial value
resolves from `value` > storage > `default-value` > `"medium"` (if
present) > `sizes[0]`. All DOM writes happen inside `connectedCallback`
/ `attributeChangedCallback`, so the element is SSR-safe.

## HTML

`<text-size-select>` contains one rendered `<select
class="text-size-select {class}" aria-label="{label}" name="{name}">`
with one `<option class="text-size-select-option" value="{slug}">` per
size carrying its title-cased (or `size-labels`-overridden) label.

## Accessibility

- WCAG 2.2 AAA target; directly supports 1.4.4 (Resize Text).
- The native `<select>` provides Arrow / Home / End / typeahead / Tab semantics.
- `aria-label` carries the consumer-supplied accessible name.
- Option labels default to title-cased slugs.

## Conventions this package follows

- Vanilla web component (custom element extending `HTMLElement`).
- Light DOM only (no Shadow DOM).
- Strict TypeScript on the public surface.
- No runtime dependencies.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from attributes / properties.
- Mirrors the Svelte sibling's §7 acceptance criteria.
