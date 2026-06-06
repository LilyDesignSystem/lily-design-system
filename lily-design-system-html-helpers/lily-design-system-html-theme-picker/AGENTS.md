# AGENTS — `<theme-picker>` (HTML helper)

Single source of truth: [spec.md](./spec.md). Read it first; everything
below is a fast index.

## What this package is

A reusable vanilla HTML/JS headless theme picker, packaged as the
`<theme-picker>` custom element. **Loads theme CSS files dynamically
at runtime** from a developer-supplied directory URL. Ships no CSS;
consumer styles the `theme-picker` class hook on the rendered
children.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec.md`                  | Specification-driven contract (canonical).       |
| `theme-picker.ts`          | Implementation (TypeScript class).               |
| `theme-picker.test.ts`     | Vitest + jsdom spec, one assertion per §7 item.  |
| `index.ts`                 | Barrel re-export + side-effectful registration.  |
| `index.md`                 | Human-readable guide.                            |

## Public surface

- Class `ThemePicker extends HTMLElement` (registered as
  `<theme-picker>` on import of `index.ts`).
- Named exports: `ThemePicker`, `normalizeThemesUrl`, `themeHref`.
- Type exports: `ThemePickerProps`, `ThemePickerChangeDetail`.

Required attributes: `label`, `themes-url`, `themes`. Full table in
[spec.md §4.1](./spec.md#41-observed-attributes).

## Behaviour contract (one paragraph)

On every theme change the element (1) sets the `href` of one managed
`<link rel="stylesheet" data-lily-theme-picker="{name}">` in
`document.head` to `${themesUrl}${slug}${extension}`, (2) sets
`data-theme="{slug}"` on `target` (defaults to
`document.documentElement`), (3) optionally writes the slug to
`localStorage[storageKey]`, and (4) dispatches a `themechange`
`CustomEvent`. Initial value resolves from `value` > storage >
`default-value` > `"light"` (if present) > `themes[0]`.

## HTML

`<theme-picker>` contains one rendered `<fieldset class="theme-picker
{class}" role="radiogroup" aria-label="{label}">` with one native
`<input type="radio">` per slug, each wrapped in a
`<label class="theme-picker-option">` containing a
`<span class="theme-picker-option-label">`.

## Accessibility

- WCAG 2.2 AAA target.
- Native radio inputs provide Arrow / Space / Tab semantics.
- `aria-label` carries the consumer-supplied group name.
- Option labels default to title-cased slugs; the word "default" is
  never emitted.

## Conventions this package follows

- Vanilla web component (custom element extending `HTMLElement`).
- Light DOM only (no Shadow DOM).
- Strict TypeScript on the public surface.
- No runtime dependencies.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from attributes / properties.
- Mirrors the Svelte sibling's §7 acceptance criteria.
