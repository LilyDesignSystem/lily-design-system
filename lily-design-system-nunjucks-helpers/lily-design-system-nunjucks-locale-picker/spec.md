# LocalePicker — Specification (Nunjucks)

Single source of truth for the `lily-design-system-nunjucks-locale-picker`
Nunjucks helper. This file drives implementation, testing, and
documentation in the spec-driven-development style: anything not in
this spec is out of scope; anything in this spec must be exercised by
a test.

Sibling files in this directory:

- `locale-picker.njk` — the macro implementation
- `locale-picker.client.js` — runtime JS that owns the lifecycle
- `locale-picker.test.ts` — vitest spec exercising every clause in §4–§7
- `locales.ts` — built-in locale-code → English-name table and RTL set,
  derived from `locales.tsv` (verbatim copy of the Svelte canonical)
- `locales.tsv` — canonical 436-row list of locale codes and English
  names (verbatim copy of the Svelte canonical)
- `index.md` — user-facing readme

The headless `lily-design-system-nunjucks-headless` library does not
(yet) include a canonical `LocalePicker`; this helper is the
opinionated, reusable counterpart split into a Nunjucks macro and a
client-side JS module.

---

## 1. Goal

Give a Nunjucks-rendered application a drop-in, headless locale
picker that:

1. Renders an accessible radio group of available locales from a
   Nunjucks macro.
2. **Applies the chosen locale** at runtime by setting `lang="…"` and
   `dir="ltr|rtl"` on the document root (or on a consumer-supplied
   target) via a companion client-side JS module.
3. Auto-detects script direction: RTL for locales using Arabic,
   Hebrew, Thaana, Mongolian (traditional), N'Ko, Syriac, or Adlam
   scripts.
4. Optionally persists the chosen locale to `localStorage`.
5. Optionally falls back to `navigator.language` on first visit when
   no value or storage entry is supplied.
6. Ships zero CSS — the consumer styles every visual aspect via the
   `locale-picker` class hook and the `lang` / `dir` attributes.
7. Provides BCP 47-compliant tag output. Underscores in locale codes
   (e.g. `en_US`) are converted to hyphens (`en-US`) when written to
   the `lang` attribute, per RFC 5646.

## 2. Non-goals

- **Translation.** This helper does not translate strings — only
  signals the locale via the `lang` attribute, the `onChange`
  callback, and the radios' checked state.
- **Locale negotiation.** No `Intl.LocaleMatcher` / RFC 4647
  best-fit / lookup. The optional `navigator.language` fallback uses
  a simple two-step match (see §5.3).
- **Auto-discovery.** Consumers always supply the list of available
  locale codes.
- **Bundling translation files.** No JSON / YAML / PO assets ship.
- **Eleventy-only features.** The macro runs in any Nunjucks host.
- **A `<select>` default rendering.** The default is
  `<fieldset role="radiogroup">`. Consumers who want a `<select>`,
  buttons, or a combobox render their own markup and use the
  client.js helpers to wire it up — see `index.md`.
- **Inline `<script>` tags inside the macro output.** The client.js
  is a separate ES module loaded once per page.

## 3. Architectural decisions

- **Split between macro and client.js.** The macro renders static
  HTML with `data-lily-locale-picker-*` hooks; the client.js owns
  the apply lifecycle (lang, dir, storage, navigator, change events).
- **The `lang` attribute is the source of truth** (WCAG 3.1.1, HTML
  Living Standard). The picker writes there.
- **BCP 47 hyphen form on the wire.** Consumer codes can use `_` or
  `-`; the picker normalises to `-` when writing to `lang`. The
  client preserves the consumer's original form when firing
  `onChange`.
- **Single `opts` object on the macro** — matches the Lily Nunjucks
  convention.
- **Vanilla ES module client.js** — no framework dependency. Exports
  `initLocalePicker(root, opts?)` and `autoInit(opts?)` plus pure
  helpers (`bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage`, `defaultLocaleLabels`,
  `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`).
- **SSR-safe.** Macro is a pure template; client.js guards every DOM
  read/write.

## 4. Public API

### 4.1 Macro parameters

`{% from "./locale-picker.njk" import localePicker %}` then
`{{ localePicker(opts) }}`.

| Key                  | Type                       | Required | Default                  | Purpose |
| -------------------- | -------------------------- | -------- | ------------------------ | ------- |
| `label`              | `string`                   | yes      | —                        | Accessible name for the radiogroup. |
| `locales`            | `array<string>`            | yes      | —                        | Available locale codes (e.g. `["en", "en_US", "fr", "ar"]`). |
| `value`              | `string`                   | no       | `""`                     | Initial selected locale (rendered checked). |
| `defaultValue`       | `string`                   | no       | `""`                     | Initial locale when nothing else is supplied at runtime. |
| `storageKey`         | `string`                   | no       | `""`                     | If non-empty, the client.js persists to `localStorage`. |
| `detectFromNavigator`| `boolean`                  | no       | `false`                  | If true, the client.js resolves `navigator.languages` on first init. |
| `name`               | `string`                   | no       | `"locale"`               | `name` attribute shared by the radio inputs. |
| `applyDir`           | `boolean`                  | no       | `true`                   | If false, the client.js never writes `dir`. |
| `localeLabels`       | `object<string,string>`    | no       | `{}`                     | Optional pretty labels per locale code. |
| `classes`            | `string`                   | no       | `""`                     | Extra CSS classes on the `<fieldset>` root. |
| `attributes`         | `object`                   | no       | —                        | Extra HTML attributes spread onto the root. |

### 4.2 DOM contract (macro output)

- Root element: `<fieldset class="locale-picker {classes}"
  role="radiogroup" aria-label="{label}"
  data-lily-locale-picker-root
  data-lily-locale-picker-name="{name}"
  data-lily-locale-picker-storage-key="{storageKey}"
  data-lily-locale-picker-default-value="{defaultValue}"
  data-lily-locale-picker-detect-from-navigator="{true|false}"
  data-lily-locale-picker-apply-dir="{true|false}">`.
- One `<label class="locale-picker-option" lang="{tagFor(locale)}">`
  per locale containing
  `<input type="radio" name="{name}" value="{locale}"
  checked={value===locale}>` and
  `<span class="locale-picker-option-label">{labelFor(locale)}</span>`.
- Each option carries `lang="{tagFor(locale)}"` (BCP 47 hyphen form)
  for WCAG 3.1.2 (Language of Parts).

### 4.3 Client.js exports

`locale-picker.client.js` is an ES module exporting:

| Export                    | Type                                            | Purpose |
| ------------------------- | ----------------------------------------------- | ------- |
| `bcp47LocaleTag(locale)`  | `(string) => string`                            | `en_US` → `en-US`. |
| `isRtlLocale(locale)`     | `(string) => boolean`                           | See §5.6. |
| `localeName(locale)`      | `(string) => string`                            | Lookup in built-in table. |
| `matchNavigatorLanguage(navLangs, locales)` | `(string[], string[]) => string` | First match, "" if none. |
| `defaultLocaleLabels`     | `Record<string, string>`                        | Built-in 436-row table. |
| `RTL_LANGUAGE_TAGS`       | `Set<string>`                                   | Base subtag RTL set. |
| `RTL_SCRIPT_SUBTAGS`      | `Set<string>`                                   | Script subtag RTL set. |
| `initLocalePicker(root, opts?)` | `(HTMLElement, object?) => {setLocale, destroy}` | Wire one fieldset. |
| `autoInit(opts?)`         | `(object?) => Array<{setLocale, destroy}>`      | Wire every root on the page. |

Optional `opts`:

- `onChange(code)` — fired after every apply; receives the
  consumer-form code.
- `target` — element receiving `lang` and `dir` (defaults to
  `document.documentElement`).

## 5. Behaviour

### 5.1 BCP 47 tag normalisation

`bcp47LocaleTag(locale)` replaces every `_` with `-`. No case
normalisation is applied.

### 5.2 Initial value resolution (client-side, on `initLocalePicker`)

The initial locale is the first non-empty value of:

1. The `value` attribute of any radio that the macro rendered with
   `checked` (i.e. the consumer's `value` prop).
2. `localStorage.getItem(storageKey)` (only if `storageKey` is set
   and the read does not throw).
3. `matchNavigatorLanguage(navigator.languages, locales)` (only if
   `detectFromNavigator` is true).
4. The fieldset's `data-lily-locale-picker-default-value`.
5. `"en"` if present among the rendered radio values.
6. The first radio value, or `""` if none.

### 5.3 Navigator-language matching

When `detectFromNavigator` is true, the client inspects
`navigator.languages` (falling back to `[navigator.language]`) and
matches each entry against the rendered radio values in order. For
each entry:

1. Exact match (treating `-` and `_` as equivalent, case-insensitive).
2. Language-only match: if `nav` is `xx-YY`, try `xx`. The first
   `locales` entry whose language matches wins.

If no entry matches, falls through to step 4 of §5.2.

### 5.4 Default labels (macro side)

When `localeLabels[code]` is missing, the macro falls back to the
slug verbatim (rendered as the option label text). The client.js
does NOT overwrite labels at runtime — pretty labels are a macro
concern.

(The Nunjucks helper exposes `defaultLocaleLabels` from
`locales.ts`; consumers can pass it as `localeLabels` to the macro
in their template if they want the built-in 436-row table to
populate labels. See `index.md`.)

### 5.5 Applying a locale

Applying a locale `code` performs, in order:

1. Resolve the target element (defaults to `document.documentElement`).
2. Set `target.lang = bcp47LocaleTag(code)`.
3. If `applyDir` is true, set `target.dir = isRtlLocale(code)
   ? "rtl" : "ltr"`.
4. If `storageKey` is non-empty, write `code` to `localStorage`.
5. Check the matching radio.
6. Call `opts.onChange?.(code)` if supplied (consumer-form code).

### 5.6 RTL detection

`isRtlLocale(locale)` returns `true` when:

1. The locale string contains one of the RTL script subtags as a
   case-insensitive component separated by `-` or `_`: `Arab`,
   `Hebr`, `Mong`, `Nkoo`, `Syrc`, `Thaa`, `Adlm`. **OR**
2. The leading language subtag (before the first `-` or `_`) is one
   of: `ar`, `arc`, `ckb`, `dv`, `fa`, `he`, `iw`, `ji`, `ks`,
   `ku`, `mzn`, `ps`, `sd`, `ug`, `ur`, `yi`.

### 5.7 SSR

Macro renders deterministic markup; no DOM access at template time.
Client.js touches `document` only after `initLocalePicker(root)` is
called.

## 6. Accessibility

- `<fieldset role="radiogroup" aria-label="{label}">` is the
  announced container.
- Native `<input type="radio">` provides Arrow / Space / Tab
  semantics.
- Each option carries `lang="{tagFor(locale)}"` (WCAG 3.1.2,
  Language of Parts).
- The document root receives `lang` and (by default) `dir` (WCAG
  3.1.1 and 1.4.10).
- WCAG 2.2 AAA is the target.

## 7. Testing acceptance criteria

`locale-picker.test.ts` must assert every numbered item below.
Tests run under vitest + jsdom. Items 1–6 exercise the macro via
`nunjucks.renderString`; items 7–12 exercise the pure helpers;
items 13–23 exercise the client.js lifecycle against a jsdom
document populated from the macro output.

### 7.1 Markup contract (macro)

1. Macro renders a `<fieldset>` with `role="radiogroup"`.
2. Macro renders `aria-label` equal to the supplied `label`.
3. Macro renders one radio per entry in `locales`, sharing the
   supplied `name` attribute.
4. Each radio's `value` attribute is the locale code.
5. Each option `<label>` carries `lang="{tagFor(locale)}"` (BCP 47
   hyphen form).
6. `localeLabels[code]` overrides the default option text; missing
   entries fall back to the raw code.

### 7.2 Pure helpers

7. `bcp47LocaleTag("en_US")` === `"en-US"`.
8. `bcp47LocaleTag("zh_Hant_TW")` === `"zh-Hant-TW"`.
9. `bcp47LocaleTag("en")` === `"en"`.
10. `isRtlLocale("ar")`, `isRtlLocale("he_IL")`, and
    `isRtlLocale("uz_Arab_AF")` are all `true`.
11. `isRtlLocale("en")` and `isRtlLocale("fr_CA")` are both `false`.
12. `localeName("en_US")` returns `"English (United States)"` from
    the built-in table.

### 7.3 Client.js locale application

13. After `initLocalePicker(root)`, `target.lang` (defaulting to
    `document.documentElement`) is the BCP 47 form of the resolved
    initial locale.
14. After init, `target.dir` is `"rtl"` for an RTL initial locale.
15. When `applyDir` is `false`, the `dir` attribute is not written.
16. Firing a `change` event on a different radio updates `lang`,
    `dir`, and fires `onChange` with the new locale code in its
    consumer form (not the BCP 47-normalised tag).
17. A custom `target` element receives `lang` and `dir` instead of
    `document.documentElement`.

### 7.4 Initial-value resolution

18. When `storageKey` is set, the active code is written to
    `localStorage` and read back on a fresh init.
19. When the macro renders `value` as a non-empty prop, the
    initial-value resolution uses the supplied value (skipping
    storage, navigator, and defaults).
20. When `detectFromNavigator` is true and `navigator.languages`
    contains a supported locale, the client resolves to that
    locale.
21. When `detectFromNavigator` is true and only a language-only
    match is available, the client resolves to the language-only
    locale.

### 7.5 Spread + autoInit

22. Extra attributes spread through onto the `<fieldset>` root.
23. `autoInit()` wires every `[data-lily-locale-picker-root]` on
    the page.

## 8. Out-of-scope (future)

- A complementary `LocaleView` helper.
- An `Intl.LocaleMatcher` / RFC 4647 lookup integration.
- A built-in `Accept-Language`-header server helper.

## 9. Tracking

- Package directory:
  `lily-design-system-nunjucks-helpers/lily-design-system-nunjucks-locale-picker/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
  (or contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
- Canonical locale list: [locales.tsv](./locales.tsv) — 436 codes
