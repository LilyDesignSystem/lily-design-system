# AGENTS — ThemePicker (Svelte helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Svelte 5 headless theme select — an **icon button that opens
a WAI-ARIA APG listbox** — that **loads theme CSS files dynamically at
runtime** from a developer-supplied directory URL. Ships no CSS;
consumer styles the `theme-picker` class hooks (and must supply the
listbox's positioning CSS).

## Files

| File                   | Purpose                                              |
| ---------------------- | ---------------------------------------------------- |
| `spec/index.md`        | Specification-driven contract (canonical).           |
| `ThemePicker.svelte`  | Implementation. TypeScript + Svelte 5 runes.         |
| `ThemePicker.test.ts` | Vitest spec, one assertion per §7 acceptance.        |
| `index.ts`             | Barrel re-export.                                    |
| `index.md`             | Comprehensive user guide.                            |
| `docs/`                | Topic guides: props, a11y, SSR, preloading, recipes. |
| `examples/`            | Self-contained Svelte 5 examples.                    |

## Public surface

- Default export: `ThemePicker` component.
- Module-script exports: `normaliseThemesUrl`, `themeHref`,
  `themeName`, `matchSystemTheme`, `nextThemePickerId`. No glyph
  constant — the default icon is a bundled SVG, not a Unicode
  character (reversed 2026-09-16).
- Barrel (`index.ts`) currently re-exports only `default`,
  `ThemePicker`, `normaliseThemesUrl`, `themeHref`, and the types —
  see [spec/index.md §4.3](./spec/index.md#43-re-exports).
- Type exports: `Props`, `ChildArgs`.

Required props: `label`, `themesUrl`, `themes`. Full table in
[spec/index.md §4.1](./spec/index.md#41-props).

**There is no `placeholder` prop.** It was removed with the native
`<select>`; do not reintroduce it.

## Behaviour contract (one paragraph)

On every theme change the select (1) sets the `href` of one managed
`<link rel="stylesheet" data-lily-theme-picker="{name}">` in
`document.head` to `${themesUrl}${slug}${extension}`, (2) sets
`data-theme="{slug}"` on `target` (defaults to `document.documentElement`),
(3) optionally writes the slug to `localStorage[storageKey]`, and (4)
calls `onChange(slug)`. SSR-safe — all DOM writes happen inside
`$effect`. Initial value resolves from `value` > storage >
`matchSystemTheme` (if `detectFromSystem`) > `defaultValue` >
`"light"` (if present) > `themes[0]`.

## HTML

```html
<div class="theme-picker {class}" ...restProps>
  <input type="hidden" name="{name}" value="{value}" />
  <button
    type="button"
    class="theme-picker-button"
    aria-label="{label}"
    aria-haspopup="listbox"
    aria-expanded="false"
    aria-controls="{listId}"
  >
    <svg class="theme-picker-icon" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M8 2a6 6 0 0 1 0 12z" fill="currentColor" stroke="none"/></svg>
  </button>
  <ul
    class="theme-picker-list"
    id="{listId}"
    role="listbox"
    aria-label="{label}"
    tabindex="-1"
    hidden
    aria-activedescendant="{active optionId while open}"
  >
    <li
      class="theme-picker-option"
      id="{optionId}"
      role="option"
      aria-selected="true|false"
      data-active
    >
      Light
    </li>
  </ul>
</div>
```

The icon is a bundled contrast/half-circle SVG (`viewBox="0 0 16 16"`,
stroke-based, matching the other four picker icons as one family). The
`children` snippet **replaces that icon inside the button** and
receives `{ value, open, labelFor }` — it no longer renders options.
The hidden input carries form participation; its `name` also
discriminates the managed `<link>`.

## Keyboard (WAI-ARIA APG listbox)

Button: `ArrowDown` / `Enter` / `Space` open with the selected option
active; `ArrowUp` opens with the last option active. Opening moves
focus to the `<ul>`.

Listbox: `ArrowDown` / `ArrowUp` move the active option and **clamp**
(no wrap); `Home` / `End` jump to first / last; `Enter` / `Space`
select, apply, close, and return focus to the button; `Escape` closes
and returns focus without changing the value; `Tab` closes without
stealing focus back; printable characters run a 500 ms-buffer typeahead
over the labels. Clicking an option selects it; clicking outside or
focus leaving the root closes.

## Accessibility

- WCAG 2.2 AAA target; WAI-ARIA APG **Listbox** pattern (not Combobox).
- `aria-label` carries the consumer-supplied accessible name onto both
  the button and the listbox.
- The selection **is** exposed to assistive technology, via
  `aria-selected` on the options.
- Option labels default to `themeName(slug)` (title-cased); the word
  "default" is never emitted.
- Two honest tradeoffs — icon-only naming and hand-rolled listbox
  support — are documented in `docs/accessibility.md`. A native
  `<select>` remains the better choice for some audiences. (The
  font-dependent-rendering tradeoff no longer applies: the icon is a
  bundled SVG, not a Unicode character — reversed 2026-09-16.)

## Conventions this package follows

- Svelte 5 runes (`$props`, `$bindable`, `$effect`).
- Strict TypeScript on the public surface.
- No runtime dependency beyond `svelte`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props.
