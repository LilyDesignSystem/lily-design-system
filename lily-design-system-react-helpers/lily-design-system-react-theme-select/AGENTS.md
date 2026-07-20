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
- Named exports: `ThemeSelect`, `normalizeThemesUrl`, `themeHref`,
  `themeName`, `matchSystemTheme`.
- Type exports: `Props`, `ChildArgs`.
- `themeName(slug)` is the single implementation of the title-casing
  label rule (`"high-contrast"` → `"High Contrast"`); the internal
  `labelFor` delegates to it, and it mirrors `localeName` in
  locale-select. Consumers should use it instead of re-deriving labels.
- `matchSystemTheme(themes)` resolves `prefers-color-scheme` to a
  supported slug, returning `""` when the slug is absent or when
  `matchMedia` is unavailable (SSR, and jsdom). It mirrors
  `matchNavigatorLanguage` in locale-select and backs the
  `detectFromSystem` prop.
- `ThemeSelect.tsx` also exports `CIRCLE_WITH_RIGHT_HALF_BLACK` (the
  default glyph, U+25D1); the barrel does not re-export it.

Required props: `label`, `themesUrl`, `themes`. Optional `children` is a
render prop that replaces the glyph inside the button and receives
`{ value, open, labelFor }` — it does **not** render the options. Full
table in [spec/index.md §4.1](./spec/index.md#41-props).

## Behaviour contract (one paragraph)

On every theme change the select (1) sets the `href` of one managed
`<link rel="stylesheet" data-lily-theme-select="{name}">` in
`document.head` to `${themesUrl}${slug}${extension}`, (2) sets
`data-theme="{slug}"` on `target` (defaults to `document.documentElement`),
(3) optionally writes the slug to `localStorage[storageKey]`, and (4)
calls `onChange(slug)`. SSR-safe — all DOM writes happen inside
`useEffect`. Initial value resolves from `value` > storage > system
detection (if `detectFromSystem`) > `defaultValue` > `"light"` (if
present) > `themes[0]`. The control is an
icon button that opens a listbox; the component owns the open/close
state, the active-option state, and the whole keyboard contract, and it
returns focus to the button when a selection or `Escape` closes the list.

## HTML

```html
<div class="theme-select {className}" ...restProps>
  <input type="hidden" name="{name}" value="{value}" />
  <button type="button" class="theme-select-button"
          aria-label="{label}" aria-haspopup="listbox"
          aria-expanded="false" aria-controls="{listId}">
    <span class="theme-select-icon" aria-hidden="true">◑</span>
  </button>
  <ul class="theme-select-list" id="{listId}" role="listbox"
      aria-label="{label}" tabindex="-1" hidden
      aria-activedescendant="{optionId of active, only while open}">
    <li class="theme-select-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active>Light</li>
  </ul>
</div>
```

Ids come from `useId`, so they are stable and hydration-safe. Custom
rendering via the `children` render prop receiving
`{ value, open, labelFor }` replaces the glyph inside the button only —
the component owns the options.

## Accessibility

- WCAG 2.2 AAA target; WAI-ARIA APG listbox pattern.
- The component implements the keyboard contract itself: open with
  `ArrowDown` / `Enter` / `Space` (`ArrowUp` opens on the last option),
  then `ArrowUp` / `ArrowDown` (clamping), `Home` / `End`, `Enter` /
  `Space` to commit, `Escape` to dismiss, `Tab` to move on, and
  printable-character typeahead with a 500 ms buffer.
- `aria-label` carries the consumer-supplied accessible name on both the
  button and the listbox. The glyph is `aria-hidden`, so `label` is the
  only source of the accessible name.
- Active option is tracked with `aria-activedescendant`, not roving focus.
- Option labels default to title-cased slugs; the word "default" is
  never emitted.

## Conventions this package follows

- React 19 function components with hooks.
- Strict TypeScript on the public surface.
- No runtime dependency beyond `react`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props.
