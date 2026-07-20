# AGENTS — ThemeSelect (Svelte helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Svelte 5 headless theme select that **loads theme CSS files
dynamically at runtime** from a developer-supplied directory URL. Ships
no CSS; consumer styles the `theme-select` class hook.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`                  | Specification-driven contract (canonical).       |
| `ThemeSelect.svelte`       | Implementation. TypeScript + Svelte 5 runes.     |
| `ThemeSelect.test.ts`      | Vitest spec, one assertion per §7 acceptance.    |
| `index.ts`                 | Barrel re-export.                                |
| `index.md`                 | Comprehensive user guide.                        |
| `docs/`                    | Topic guides: props, a11y, SSR, preloading, recipes. |
| `examples/`                | Self-contained Svelte 5 examples.                |

## Public surface

- Default export: `ThemeSelect` component.
- Named exports: `ThemeSelect`, `normaliseThemesUrl`, `themeHref`.
- Type exports: `Props`, `ChildArgs`.

Required props: `label`, `themesUrl`, `themes`. Full table in
[spec/index.md §4.1](./spec/index.md#41-props).

## Behaviour contract (one paragraph)

On every theme change the select (1) sets the `href` of one managed
`<link rel="stylesheet" data-lily-theme-select="{name}">` in
`document.head` to `${themesUrl}${slug}${extension}`, (2) sets
`data-theme="{slug}"` on `target` (defaults to `document.documentElement`),
(3) optionally writes the slug to `localStorage[storageKey]`, and (4)
calls `onChange(slug)`. SSR-safe — all DOM writes happen inside
`$effect`. Initial value resolves from `value` > storage >
`defaultValue` > `"light"` (if present) > `themes[0]`.

## HTML

`<select class="theme-select {class}" aria-label="{label}" name="{name}">`
with a leading `<option class="theme-select-option theme-select-placeholder"
value="">{placeholder ?? label}</option>` followed by one native
`<option>` per slug. Custom rendering via the `children` snippet
receiving `{ themes, value, setTheme, name, labelFor }`; the placeholder
is component-owned and emitted in both paths.

**The `<select>` is not bound to `value`.** Its own selection stays
pinned to the placeholder so the closed control always reads the
placeholder word and stays that narrow. On change the component reads
the chosen slug, resets `el.value = ""`, and writes to `value`.

## Accessibility

- WCAG 2.2 AAA target.
- The native `<select>` provides Arrow / Home / End / typeahead semantics.
- `aria-label` carries the consumer-supplied accessible name.
- Option labels default to title-cased slugs; the word "default" is
  never emitted.
- Tradeoff: because the closed control always shows the placeholder, the
  active theme is not announced as the combobox value. `docs/accessibility.md`
  documents how consumers surface it separately.

## Conventions this package follows

- Svelte 5 runes (`$props`, `$bindable`, `$effect`).
- Strict TypeScript on the public surface.
- No runtime dependency beyond `svelte`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props.
