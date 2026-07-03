# AGENTS — ThemeSelect (React helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable React 19 headless theme select that **loads theme CSS files
dynamically at runtime** from a developer-supplied directory URL. Ships
no CSS; consumer styles the `theme-select` class hook.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`                  | Specification-driven contract (canonical).       |
| `ThemeSelect.tsx`          | Implementation. TypeScript + React 19 hooks.     |
| `ThemeSelect.test.tsx`     | Vitest spec, one assertion per §7 acceptance.    |
| `index.ts`                 | Barrel re-export.                                |
| `index.md`                 | User guide.                                      |

## Public surface

- Default export: `ThemeSelect` component.
- Named exports: `ThemeSelect`, `normalizeThemesUrl`, `themeHref`.
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
`useEffect`. Initial value resolves from `value` > storage >
`defaultValue` > `"light"` (if present) > `themes[0]`.

## HTML

`<select className="theme-select {className}" aria-label="{label}" name="{name}">`
with one native `<option>` per slug. Custom rendering via the
`children` render prop receiving `{ themes, value, setTheme, name, labelFor }`;
the render output goes inside the `<select>`.

## Accessibility

- WCAG 2.2 AAA target.
- The native `<select>` provides Arrow / Home / End / typeahead semantics.
- `aria-label` carries the consumer-supplied accessible name.
- Option labels default to title-cased slugs; the word "default" is
  never emitted.

## Conventions this package follows

- React 19 function components with hooks.
- Strict TypeScript on the public surface.
- No runtime dependency beyond `react`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props.
