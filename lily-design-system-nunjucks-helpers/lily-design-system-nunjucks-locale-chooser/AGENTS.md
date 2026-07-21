# AGENTS — LocaleChooser (Nunjucks helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Nunjucks 3 + vanilla-JS headless locale chooser that
applies the chosen locale to the document root via `lang` and `dir`,
with optional `localStorage` persistence and `navigator.languages`
detection. Ships no CSS; consumer styles the `locale-chooser` class
hook.

The helper is a **macro + client.js pair**:

- The macro renders the markup server-side / at build time.
- The companion ES module picks up the markup in the browser and
  owns the lifecycle (storage, lang/dir application, navigator
  detection, change events).

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`                  | Specification-driven contract (canonical).       |
| `locale-chooser.njk`        | Nunjucks macro (`localeChooser(opts)`).           |
| `locale-chooser.client.js`  | ES module — `initLocaleChooser`, `autoInit`, helpers. |
| `locale-chooser.test.ts`    | Vitest spec, one assertion per §7 acceptance.    |
| `locales.ts`               | Built-in code → English-name map + RTL sets.     |
| `locales.tsv`              | Canonical 436-row source for `locales.ts`.       |
| `index.md`                 | Concise user guide.                              |

## Public surface

### Macro

- Import: `{% from "./locale-chooser.njk" import localeChooser %}`
- Call:   `{{ localeChooser({label, locales, …}) }}`
- Required `opts` keys: `label`, `locales`.
- Full table in [spec/index.md §4.1](./spec/index.md#41-macro-parameters).

### Client.js

- `import { initLocaleChooser, autoInit, bcp47LocaleTag, isRtlLocale, localeName, matchNavigatorLanguage, defaultLocaleLabels, RTL_LANGUAGE_TAGS, RTL_SCRIPT_SUBTAGS } from "./locale-chooser.client.js"`
- Required call: `initLocaleChooser(rootElement, opts?)` or
  `autoInit(opts?)`.

## Behaviour contract (one paragraph)

The macro emits a `<div class="locale-chooser">` with
`data-lily-locale-chooser-*` hooks describing the control's name,
storage key, default value, navigator flag, apply-dir flag, and — when
`opts.value` is set — the consumer's initial value
(`data-lily-locale-chooser-value`). Inside it are a hidden input, an
icon `<button>`, and a `<ul role="listbox" hidden>`. On
`initLocaleChooser(root)`, the client
(1) resolves the initial code from value-attribute > storage >
navigator (when enabled) > default-value > `"en"` > first-option,
(2) sets `target.lang = bcp47LocaleTag(code)`, (3) optionally sets
`target.dir = isRtlLocale(code) ? "rtl" : "ltr"`, (4) optionally
writes to `localStorage`, (5) mirrors the consumer-form code into the
hidden input and re-derives every option's `aria-selected`, (6) calls
`onChange(code)`. The client ALSO owns the entire listbox interaction:
open/close, focus movement, the APG keyboard contract, and typeahead.

## HTML

```html
<div class="locale-chooser {classes}" data-lily-locale-chooser-root …>
  <input type="hidden" name="{name}" value="{selected}"
         data-lily-locale-chooser-input>
  <button type="button" class="locale-chooser-button" aria-label="{label}"
          aria-haspopup="listbox" aria-expanded="false"
          aria-controls="{id}-list" data-lily-locale-chooser-button>
    <span class="locale-chooser-icon" aria-hidden="true">&#127760;&#65038;</span>
  </button>
  <ul class="locale-chooser-list" id="{id}-list" role="listbox"
      aria-label="{label}" tabindex="-1" hidden data-lily-locale-chooser-list>
    <li class="locale-chooser-option" id="{id}-option-{i}" role="option"
        aria-selected="true|false" data-value="{locale}"
        lang="{tagFor(locale)}">{labelFor(locale)}</li>
  </ul>
</div>
```

The glyph is U+1F310 GLOBE WITH MERIDIANS + U+FE0E VARIATION
SELECTOR-15 (`&#127760;&#65038;`), `aria-hidden`. VS15 forces the text
presentation so the globe stays monochrome and matches theme-chooser's
◑ instead of rendering as a blue colour emoji. A
`{% call %}` block body replaces the glyph inside the button (the
Nunjucks equivalent of `children`); it does not render options.

Options keep `lang="{tagFor(locale)}"`; the button and the `<ul>`
deliberately do not.

Server markup marks exactly ONE option `aria-selected="true"`,
resolved as `value or defaultValue or ("en" if present else
locales[0])`, and pre-fills the hidden input with it (consumer form,
not BCP 47). The listbox is rendered `hidden` with no
`aria-activedescendant` and no `data-active` — those are client-owned
open-state concerns. `opts.value` still travels ONLY on
`data-lily-locale-chooser-value`.

Ids are `{id}-list` / `{id}-option-{i}` where `id` defaults to
`locale-chooser-{name}`. Deterministic and SSR-safe; two instances
sharing a `name` need an explicit distinct `id`.

There is **no** `placeholder` param and **no**
`.locale-chooser-placeholder` hook — both were removed with the
`<select>`.

## Accessibility

- WCAG 2.2 AAA target; WAI-ARIA APG listbox pattern.
- The client provides Arrow / Home / End / Enter / Space / Escape /
  Tab / typeahead semantics; none of it works before the client runs.
- `aria-label` is the ONLY accessible name the button has, since the
  glyph is `aria-hidden`.
- `aria-selected` tracks the applied locale; `data-active` tracks the
  keyboard cursor. They are different things.
- Each option carries its own `lang` for WCAG 3.1.2 (Language of
  Parts).
- The document root receives `lang` and (by default) `dir` for WCAG
  3.1.1 (Language of Page) and 1.4.10 (Reflow / bidi).
- Known tradeoffs, documented honestly in `docs/accessibility.md`: an
  icon-only control depends entirely on `aria-label`; a custom listbox
  has weaker AT support than a native `<select>`; the glyph may render
  differently or be missing depending on platform fonts.
- **No-JS regression**: the button will not open without the client
  module. Stated plainly in `docs/ssr.md`.

## Conventions this package follows

- Nunjucks 3 macro, camelCase name, kebab-case file path and CSS class.
- Single `opts` parameter on the macro.
- No runtime dependency beyond standard DOM APIs.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from `opts`.
- No inline `<script>` in the macro output.
