# AGENTS — ThemePicker (Svelte helper)

Single source of truth: [spec.md](./spec.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Svelte 5 headless theme picker that **loads theme CSS files
dynamically at runtime** from a developer-supplied directory URL. Ships
no CSS; consumer styles the `theme-picker` class hook.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec.md`                  | Specification-driven contract (canonical).       |
| `ThemePicker.svelte`       | Implementation. TypeScript + Svelte 5 runes.     |
| `ThemePicker.test.ts`      | Vitest spec, one assertion per §7 acceptance.    |
| `index.ts`                 | Barrel re-export.                                |
| `index.md`                 | Comprehensive user guide.                        |
| `docs/`                    | Topic guides: props, a11y, SSR, preloading, recipes. |
| `examples/`                | Self-contained Svelte 5 examples.                |

## Public surface

- Default export: `ThemePicker` component.
- Named exports: `ThemePicker`, `normaliseThemesUrl`, `themeHref`.
- Type exports: `Props`, `ChildArgs`.

Required props: `label`, `themesUrl`, `themes`. Full table in
[spec.md §4.1](./spec.md#41-props).

## Behaviour contract (one paragraph)

On every theme change the picker (1) sets the `href` of one managed
`<link rel="stylesheet" data-lily-theme-picker="{name}">` in
`document.head` to `${themesUrl}${slug}${extension}`, (2) sets
`data-theme="{slug}"` on `target` (defaults to `document.documentElement`),
(3) optionally writes the slug to `localStorage[storageKey]`, and (4)
calls `onChange(slug)`. SSR-safe — all DOM writes happen inside
`$effect`. Initial value resolves from `value` > storage >
`defaultValue` > `"light"` (if present) > `themes[0]`.

## HTML

`<fieldset class="theme-picker {class}" role="radiogroup" aria-label="{label}">`
with one native `<input type="radio">` per slug. Custom rendering via
the `children` snippet receiving `{ themes, value, setTheme, name, labelFor }`.

## Accessibility

- WCAG 2.2 AAA target.
- Native radio inputs provide Arrow / Space / Tab semantics.
- `aria-label` carries the consumer-supplied group name.
- Option labels default to title-cased slugs; the word "default" is
  never emitted.

## Conventions this package follows

- Svelte 5 runes (`$props`, `$bindable`, `$effect`).
- Strict TypeScript on the public surface.
- No runtime dependency beyond `svelte`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props.
