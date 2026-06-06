# AGENTS — LocalePicker (Nunjucks helper)

Single source of truth: [spec.md](./spec.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Nunjucks 3 + vanilla-JS headless locale picker that
applies the chosen locale to the document root via `lang` and `dir`,
with optional `localStorage` persistence and `navigator.languages`
detection. Ships no CSS; consumer styles the `locale-picker` class
hook.

The helper is a **macro + client.js pair**:

- The macro renders the markup server-side / at build time.
- The companion ES module picks up the markup in the browser and
  owns the lifecycle (storage, lang/dir application, navigator
  detection, change events).

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec.md`                  | Specification-driven contract (canonical).       |
| `locale-picker.njk`        | Nunjucks macro (`localePicker(opts)`).           |
| `locale-picker.client.js`  | ES module — `initLocalePicker`, `autoInit`, helpers. |
| `locale-picker.test.ts`    | Vitest spec, one assertion per §7 acceptance.    |
| `locales.ts`               | Built-in code → English-name map + RTL sets.     |
| `locales.tsv`              | Canonical 436-row source for `locales.ts`.       |
| `index.md`                 | Concise user guide.                              |

## Public surface

### Macro

- Import: `{% from "./locale-picker.njk" import localePicker %}`
- Call:   `{{ localePicker({label, locales, …}) }}`
- Required `opts` keys: `label`, `locales`.
- Full table in [spec.md §4.1](./spec.md#41-macro-parameters).

### Client.js

- `import { initLocalePicker, autoInit, bcp47LocaleTag, isRtlLocale, localeName, matchNavigatorLanguage, defaultLocaleLabels, RTL_LANGUAGE_TAGS, RTL_SCRIPT_SUBTAGS } from "./locale-picker.client.js"`
- Required call: `initLocalePicker(rootElement, opts?)` or
  `autoInit(opts?)`.

## Behaviour contract (one paragraph)

The macro emits a `<fieldset class="locale-picker"
role="radiogroup">` with `data-lily-locale-picker-*` hooks
describing the picker's name, storage key, default value, navigator
flag, and apply-dir flag. On `initLocalePicker(root)`, the client
(1) resolves the initial code from checked-radio > storage >
navigator (when enabled) > default-value > `"en"` > first-radio,
(2) sets `target.lang = bcp47LocaleTag(code)`, (3) optionally sets
`target.dir = isRtlLocale(code) ? "rtl" : "ltr"`, (4) optionally
writes to `localStorage`, (5) checks the matching radio, (6) calls
`onChange(code)`.

## HTML

`<fieldset class="locale-picker {classes}" role="radiogroup"
aria-label="{label}" data-lily-locale-picker-root …>` containing
one `<label class="locale-picker-option" lang="{tagFor(locale)}">
<input type="radio" …><span class="locale-picker-option-label">…
</span></label>` per locale code.

## Accessibility

- WCAG 2.2 AAA target.
- Native radio inputs provide Arrow / Space / Tab semantics.
- Each option carries its own `lang` for WCAG 3.1.2 (Language of
  Parts).
- The document root receives `lang` and (by default) `dir` for WCAG
  3.1.1 (Language of Page) and 1.4.10 (Reflow / bidi).

## Conventions this package follows

- Nunjucks 3 macro, camelCase name, kebab-case file path and CSS class.
- Single `opts` parameter on the macro.
- No runtime dependency beyond standard DOM APIs.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from `opts`.
- No inline `<script>` in the macro output.
