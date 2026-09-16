# AGENTS — LocalePicker (React helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable React 19 headless locale picker — an icon button that opens
a dropdown listbox (WAI-ARIA APG Listbox pattern) — that applies the
chosen locale to the document root via `lang` and `dir`, with optional
`localStorage` persistence and `navigator.languages` detection. Ships
no CSS; consumer styles the `locale-picker` class hooks and positions
the list.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`                  | Specification-driven contract (canonical).       |
| `LocalePicker.tsx`         | Implementation. TypeScript + React 19 hooks.    |
| `LocalePicker.test.tsx`    | Vitest spec, one assertion per §7 acceptance.    |
| `locales.ts`               | Fallback code → English-name map and RTL sets; default labels are endonyms via `localeEndonym`. |
| `locales.tsv`              | Canonical 436-row locale list.                   |
| `index.ts`                 | Barrel re-export.                                |
| `index.md`                 | User guide.                                      |
| `docs/`                    | Topic guides: props, a11y, BCP 47, concepts, i18n, RTL, SSR, styling, custom rendering, recipes, troubleshooting. |
| `examples/`                | Ten self-contained React 19 examples, descriptively named. |

## Public surface

- Default export: `LocalePicker` component.
- Named exports: `LocalePicker`, `bcp47LocaleTag`, `isRtlLocale`,
  `localeEndonym`, `localeName`, `matchNavigatorLanguage`,
  `defaultLocaleLabels`, `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`.
  No glyph constant — the default icon is a bundled SVG, not a
  Unicode character (reversed 2026-09-16).
- Type exports: `Props`, `ChildArgs`.

Required props: `label`, `locales`. `label` is the only source of the
button's accessible name, because the icon is `aria-hidden`. Full
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
<div class="locale-picker {className}" ...restProps>
  <input type="hidden" name="{name}" value="{value}" />
  <button type="button" class="locale-picker-button"
          aria-label="{label}" aria-haspopup="listbox"
          aria-expanded="false" aria-controls="{listId}">
    <svg class="locale-picker-icon" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M2 8h12"/><path d="M8 2c2.2 0 4 2.7 4 6s-1.8 6-4 6-4-2.7-4-6 1.8-6 4-6z"/></svg>
  </button>
  <ul class="locale-picker-list" id="{listId}" role="listbox"
      aria-label="{label}" tabindex="-1" hidden
      aria-activedescendant="{optionId of active, only while open}">
    <li class="locale-picker-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active
        lang="{tag, only when the label is the derived endonym}">American English</li>
  </ul>
</div>
```

The icon is a bundled globe-outline SVG (`viewBox="0 0 16 16"`) —
not a Unicode character, reversed 2026-09-16. An option carries `lang`
(BCP 47 hyphen form) only when its label is the derived endonym —
WCAG 3.1.2 (Language of Parts) is a claim about the text, and consumer
or English-fallback labels make no claim; the button and the list carry
no `lang`. Ids come from `useId`, so they are stable and hydration-safe.
The `children` render prop receives `{ value, open, labelFor }` and
replaces the icon inside the button — it does not render options.

## Accessibility

- WCAG 2.2 AAA target; WAI-ARIA APG Listbox pattern.
- The component implements the keyboard contract itself — nothing comes
  from the platform. Button: `ArrowDown` / `Enter` / `Space` open,
  `ArrowUp` opens on the last option. List: `ArrowDown` / `ArrowUp`
  (clamping), `Home` / `End`, `PageUp` / `PageDown` (by ten, clamped),
  `Enter` / `Space` to select, `Escape` to cancel, printable characters
  for label typeahead (500 ms buffer; a repeated character cycles
  through its matches). `Tab` closes via the button so the default Tab
  proceeds from the picker's position.
  See [spec/index.md §6.2](./spec/index.md#62-keyboard-contract).
- `aria-label` carries the consumer-supplied accessible name on both
  the button and the listbox. Because the icon is `aria-hidden`, it is
  the button's *only* name — never omit it.
- An option carries its locale via `lang` only when its label is the
  derived endonym, so screen readers switch voice only when the claim
  is true.
- The document root gets `lang` and (by default) `dir`.
- Tradeoffs of the icon button + custom listbox (name depends wholly on
  `aria-label`; weaker AT support than a native `<select>`) are
  documented in [docs/accessibility.md](./docs/accessibility.md). (The
  font-dependent-glyph tradeoff no longer applies: the icon is a
  bundled SVG — reversed 2026-09-16.)

## Conventions this package follows

- React 19 function components with hooks.
- Strict TypeScript on the public surface.
- No runtime dependency beyond `react`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props.
