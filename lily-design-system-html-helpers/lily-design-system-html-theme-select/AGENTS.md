# AGENTS — `<theme-select>` (HTML helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable vanilla HTML/JS headless theme select, packaged as the
`<theme-select>` custom element. **Loads theme CSS files dynamically
at runtime** from a developer-supplied directory URL. Ships no CSS;
consumer styles the `theme-select` class hook on the rendered
children.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`                  | Specification-driven contract (canonical).       |
| `theme-select.ts`          | Implementation (TypeScript class).               |
| `theme-select.test.ts`     | Vitest + jsdom spec, one assertion per §7 item.  |
| `index.ts`                 | Barrel re-export + side-effectful registration.  |
| `index.md`                 | Human-readable guide.                            |

## Public surface

- Class `ThemeSelect extends HTMLElement` (registered as
  `<theme-select>` on import of `index.ts`).
- Named exports: `ThemeSelect`, `normalizeThemesUrl`, `themeHref`.
- Type exports: `ThemeSelectProps`, `ThemeSelectChangeDetail`.

Required attributes: `label`, `themes-url`, `themes`. Full table in
[spec/index.md §4.1](./spec/index.md#41-observed-attributes).

## Behaviour contract (one paragraph)

On every theme change the element (1) sets the `href` of one managed
`<link rel="stylesheet" data-lily-theme-select="{name}">` in
`document.head` to `${themesUrl}${slug}${extension}`, (2) sets
`data-theme="{slug}"` on `target` (defaults to
`document.documentElement`), (3) optionally writes the slug to
`localStorage[storageKey]`, and (4) dispatches a `themechange`
`CustomEvent`. Initial value resolves from `value` > storage >
`default-value` > `"light"` (if present) > `themes[0]`.

The rendered `<select>` never tracks the selection. Its own DOM
selection stays pinned to the leading placeholder option: on
`change` the handler reads the chosen slug, immediately resets
`select.value = ""`, and only then assigns the element's `value`.
The real selection lives on `this.value` (attribute + property) and
everything downstream — link href, `data-theme`, persistence,
`themechange`, initial-value resolution — is unchanged.

## HTML

`<theme-select>` contains one rendered `<select class="theme-select
{class}" aria-label="{label}" name="{name}">` whose first child is
the component-owned placeholder
`<option class="theme-select-option theme-select-placeholder" value="" selected>`
carrying `placeholder ?? label` as its text, followed by one native
`<option class="theme-select-option">` per slug. No option other
than the placeholder is ever marked `selected`.

## Accessibility

- WCAG 2.2 AAA target.
- The native `<select>` provides combobox semantics: Tab to focus,
  Arrow keys to change selection, typeahead.
- `aria-label` carries the consumer-supplied accessible name.
- Option labels default to title-cased slugs; the word "default" is
  never emitted.
- Because the closed control always reads the placeholder, the
  active theme is NOT announced as the combobox value. Consumers
  who need it should surface it in visible text or a polite live
  region — see `docs/accessibility.md`.

## Conventions this package follows

- Vanilla web component (custom element extending `HTMLElement`).
- Light DOM only (no Shadow DOM).
- Strict TypeScript on the public surface.
- No runtime dependencies.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from attributes / properties.
- Mirrors the Svelte sibling's §7 acceptance criteria.
