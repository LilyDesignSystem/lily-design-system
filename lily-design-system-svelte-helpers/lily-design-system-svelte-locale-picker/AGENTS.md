# AGENTS — LocalePicker (Svelte helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Svelte 5 headless locale select — an **icon button that
opens a WAI-ARIA APG listbox** — that applies the chosen locale to the
document root via `lang` and `dir`, with optional `localStorage`
persistence and `navigator.languages` detection. Ships no CSS; consumer
styles the `locale-picker` class hooks (and must supply the listbox's
positioning CSS).

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`                  | Specification-driven contract (canonical).       |
| `LocalePicker.svelte`      | Implementation. Svelte 5 runes + TypeScript.     |
| `LocalePicker.test.ts`     | Vitest spec, one assertion per §7 acceptance.    |
| `locales.ts`               | Fallback code → English-name map and RTL sets; default labels are endonyms via `localeEndonym`. |
| `locales.tsv`              | Canonical 436-row source for `locales.ts`.       |
| `index.ts`                 | Barrel re-export.                                |
| `index.md`                 | Human-readable guide.                            |
| `docs/`                    | Topic guides: a11y, BCP 47, concepts, custom rendering, i18n, props, recipes, RTL, SSR, styling, troubleshooting. |
| `examples/`                | Ten self-contained Svelte 5 examples.            |

## Public surface

- Default export: `LocalePicker` component.
- Named exports: `LocalePicker`, `bcp47LocaleTag`, `isRtlLocale`,
  `localeName`, `matchNavigatorLanguage`, `defaultLocaleLabels`,
  `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`.
- Also on the module script (not in the barrel): `nextLocalePickerId`.
  No glyph constant — the default icon is a bundled SVG, not a
  Unicode character (reversed 2026-09-16).
- Type exports: `Props`, `ChildArgs`.

Required props: `label`, `locales`. Full table in
[spec/index.md §4.1](./spec/index.md#41-props).

**There is no `placeholder` prop.** It was removed with the native
`<select>`; do not reintroduce it.

## Behaviour contract (one paragraph)

On every locale change the select (1) sets `target.lang` to the
BCP 47 hyphen form of the code, (2) sets `target.dir` to `"rtl"` /
`"ltr"` (skipped if `applyDir=false`), (3) optionally writes to
`localStorage[storageKey]`, and (4) calls `onChange(code)` with the
consumer-form code. SSR-safe — all DOM writes happen inside
`$effect`. Initial value resolves from `value` > storage > navigator
detection (if enabled) > `defaultValue` > `"en"` (if present) >
`locales[0]`.

## HTML

```html
<div class="locale-picker {class}" ...restProps>
  <input type="hidden" name="{name}" value="{value}" />
  <button type="button" class="locale-picker-button" aria-label="{label}"
          aria-haspopup="listbox" aria-expanded="false" aria-controls="{listId}">
    <svg class="locale-picker-icon" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M2 8h12"/><path d="M8 2c2.2 0 4 2.7 4 6s-1.8 6-4 6-4-2.7-4-6 1.8-6 4-6z"/></svg>
  </button>
  <ul class="locale-picker-list" id="{listId}" role="listbox" aria-label="{label}"
      tabindex="-1" hidden aria-activedescendant="{active optionId while open}">
    <li class="locale-picker-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active
        lang="{tag, only when the label is the derived endonym}">American English</li>
  </ul>
</div>
```

The icon is a bundled globe-outline SVG (`viewBox="0 0 16 16"`,
stroke-based) — not a Unicode character, so it renders identically on
every platform with no colour-emoji fallback risk (reversed
2026-09-16 from U+1F310 GLOBE WITH MERIDIANS + U+FE0E).

Each locale option keeps `lang="{tagFor(…)}"` so its name is pronounced
in its own language (WCAG 3.1.2); the button and the list carry none.

The `children` snippet **replaces the icon inside the button** and
receives `{ value, open, labelFor }` — it no longer renders options.
The hidden input carries form participation with the consumer-form
code.

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

- WCAG 2.2 AAA target. WCAG 3.1.1 (Language of Page) and 3.1.2
  (Language of Parts).
- WAI-ARIA APG **Listbox** pattern (not Combobox).
- `aria-label` carries the consumer-supplied accessible name onto both
  the button and the listbox.
- The selection **is** exposed to assistive technology, via
  `aria-selected` on the options.
- Two honest tradeoffs — icon-only naming and hand-rolled listbox
  support — are documented in `docs/accessibility.md`. The first bites
  harder here than for `theme-picker`: `aria-label` is written in
  *some* language, and a user who cannot read the page needs this
  control most. A native `<select>` remains the better choice for some
  audiences. (The font-dependent-rendering tradeoff no longer applies:
  the icon is a bundled SVG, not a Unicode character — reversed
  2026-09-16.)

## Conventions this package follows

- Svelte 5 runes (`$props`, `$bindable`, `$effect`).
- Strict TypeScript on the public surface.
- No runtime dependency beyond `svelte`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props.
