# AGENTS — LocaleSelect (Nunjucks helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Nunjucks 3 + vanilla-JS headless locale select that
applies the chosen locale to the document root via `lang` and `dir`,
with optional `localStorage` persistence and `navigator.languages`
detection. Ships no CSS; consumer styles the `locale-select` class
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
| `locale-select.njk`        | Nunjucks macro (`localeSelect(opts)`).           |
| `locale-select.client.js`  | ES module — `initLocaleSelect`, `autoInit`, helpers. |
| `locale-select.test.ts`    | Vitest spec, one assertion per §7 acceptance.    |
| `locales.ts`               | Built-in code → English-name map + RTL sets.     |
| `locales.tsv`              | Canonical 436-row source for `locales.ts`.       |
| `index.md`                 | Concise user guide.                              |

## Public surface

### Macro

- Import: `{% from "./locale-select.njk" import localeSelect %}`
- Call:   `{{ localeSelect({label, locales, …}) }}`
- Required `opts` keys: `label`, `locales`.
- Full table in [spec/index.md §4.1](./spec/index.md#41-macro-parameters).

### Client.js

- `import { initLocaleSelect, autoInit, bcp47LocaleTag, isRtlLocale, localeName, matchNavigatorLanguage, defaultLocaleLabels, RTL_LANGUAGE_TAGS, RTL_SCRIPT_SUBTAGS } from "./locale-select.client.js"`
- Required call: `initLocaleSelect(rootElement, opts?)` or
  `autoInit(opts?)`.

## Behaviour contract (one paragraph)

The macro emits a `<select class="locale-select">` with
`data-lily-locale-select-*` hooks describing the select's name,
storage key, default value, navigator flag, apply-dir flag, and — when
`opts.value` is set — the consumer's initial value
(`data-lily-locale-select-value`). On
`initLocaleSelect(root)`, the client
(1) resolves the initial code from value-attribute > storage >
navigator (when enabled) > default-value > `"en"` > first-option,
(2) sets `target.lang = bcp47LocaleTag(code)`, (3) optionally sets
`target.dir = isRtlLocale(code) ? "rtl" : "ltr"`, (4) optionally
writes to `localStorage`, (5) snaps the `<select>` back to its
placeholder option (`select.value = ""`), (6) calls `onChange(code)`.
The `<select>`'s own value never tracks the active locale — on
`change` the client reads the chosen code, resets the control to `""`,
then applies.

## HTML

`<select class="locale-select {classes}" aria-label="{label}"
name="{name}" data-lily-locale-select-root …>` whose first child is
the always-rendered placeholder `<option class="locale-select-option
locale-select-placeholder" value="" selected>{placeholder ??
label}</option>` (no `lang` — it is not a locale), followed by one
`<option class="locale-select-option" value="{locale}"
lang="{tagFor(locale)}">…</option>` per locale code.

The placeholder is the **only** option ever rendered `selected` — real
options never carry `selected`, even when `opts.value` is set. That
value travels on `data-lily-locale-select-value` instead, so the closed
control reads the placeholder word from byte zero and never flashes the
locale name before the client runs.

## Accessibility

- WCAG 2.2 AAA target.
- The native `<select>` provides Arrow / Home / End / typeahead /
  Tab semantics with no JS keyboard handlers.
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
