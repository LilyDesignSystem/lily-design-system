# AGENTS — LocaleSelect (React helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable React 19 headless locale select — an icon button that opens
a dropdown listbox (WAI-ARIA APG Listbox pattern) — that applies the
chosen locale to the document root via `lang` and `dir`, with optional
`localStorage` persistence and `navigator.languages` detection. Ships
no CSS; consumer styles the `locale-select` class hooks and positions
the list.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`                  | Specification-driven contract (canonical).       |
| `LocaleSelect.tsx`         | Implementation. TypeScript + React 19 hooks.    |
| `LocaleSelect.test.tsx`    | Vitest spec, one assertion per §7 acceptance.    |
| `locales.ts`               | Built-in locale-code → English-name table.       |
| `locales.tsv`              | Canonical 436-row locale list.                   |
| `index.ts`                 | Barrel re-export.                                |
| `index.md`                 | User guide.                                      |
| `docs/`                    | Topic guides: props, a11y, BCP 47, concepts, i18n, RTL, SSR, styling, custom rendering, recipes, troubleshooting. |
| `examples/`                | Ten self-contained React 19 examples, descriptively named. |

## Public surface

- Default export: `LocaleSelect` component.
- Named exports: `LocaleSelect`, `bcp47LocaleTag`, `isRtlLocale`,
  `localeName`, `matchNavigatorLanguage`, `defaultLocaleLabels`,
  `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`, `GLOBE_WITH_MERIDIANS`.
- Type exports: `Props`, `ChildArgs`.

Required props: `label`, `locales`. `label` is the only source of the
button's accessible name, because the glyph is `aria-hidden`. Full
table in [spec/index.md §4.1](./spec/index.md#41-props).

## Behaviour contract (one paragraph)

On every locale change the select (1) sets `target.lang` to the BCP 47
hyphen form of the locale code, (2) sets `target.dir` to `"rtl"` or
`"ltr"` (skipped when `applyDir` is false), (3) optionally writes the
code to `localStorage[storageKey]`, and (4) calls `onChange(code)`.
SSR-safe — all DOM writes happen inside `useEffect`. Initial value
resolves from `value` > storage > navigator (if `detectFromNavigator`)
> `defaultValue` > `"en"` (if present) > `locales[0]`. The component
also owns the disclosure state: opening the listbox moves focus to the
`<ul>` and tracks the keyboard cursor with `aria-activedescendant`;
selecting, `Escape`, or toggling the button returns focus to the
button.

## HTML

```html
<div class="locale-select {className}" ...restProps>
  <input type="hidden" name="{name}" value="{value}" />
  <button type="button" class="locale-select-button"
          aria-label="{label}" aria-haspopup="listbox"
          aria-expanded="false" aria-controls="{listId}">
    <span class="locale-select-icon" aria-hidden="true">🌐</span>
  </button>
  <ul class="locale-select-list" id="{listId}" role="listbox"
      aria-label="{label}" tabindex="-1" hidden
      aria-activedescendant="{optionId of active, only while open}">
    <li class="locale-select-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active lang="en-US">English (United States)</li>
  </ul>
</div>
```

The glyph is U+1F310 GLOBE WITH MERIDIANS + U+FE0E VARIATION SELECTOR-15, exported
as `GLOBE_WITH_MERIDIANS`. Each option carries `lang="{tagFor(locale)}"`
for WCAG 3.1.2 (Language of Parts); the button and the list do not. Ids
come from `useId`, so they are stable and hydration-safe. The `children`
render prop receives `{ value, open, labelFor }` and replaces the glyph
inside the button — it does not render options.

## Accessibility

- WCAG 2.2 AAA target; WAI-ARIA APG Listbox pattern.
- The component implements the keyboard contract itself — nothing comes
  from the platform. Button: `ArrowDown` / `Enter` / `Space` open,
  `ArrowUp` opens on the last option. List: `ArrowDown` / `ArrowUp`
  (clamping), `Home` / `End`, `Enter` / `Space` to select, `Escape` to
  cancel, `Tab` to move on, printable characters for label typeahead
  (500 ms buffer). See [spec/index.md §6.2](./spec/index.md#62-keyboard-contract).
- `aria-label` carries the consumer-supplied accessible name on both
  the button and the listbox. Because the glyph is `aria-hidden`, it is
  the button's *only* name — never omit it.
- Each option carries its locale via `lang` so screen readers
  pronounce option text in the right voice.
- The document root gets `lang` and (by default) `dir`.
- Tradeoffs of the icon button + custom listbox (name depends wholly on
  `aria-label`; weaker AT support than a native `<select>`; the globe
  glyph is font-dependent and culturally loaded) are documented in
  [docs/accessibility.md](./docs/accessibility.md).

## Conventions this package follows

- React 19 function components with hooks.
- Strict TypeScript on the public surface.
- No runtime dependency beyond `react`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props.
