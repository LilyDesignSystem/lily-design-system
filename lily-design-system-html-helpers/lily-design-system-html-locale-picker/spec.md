# `<locale-picker>` — Specification

Single source of truth for the `lily-design-system-html-locale-picker`
HTML helper. This file drives implementation, testing, and
documentation in the spec-driven-development style: anything not in
this spec is out of scope; anything in this spec must be exercised by
a test.

Sibling files in this directory:

- `locale-picker.ts` — the custom-element implementation
- `locale-picker.test.ts` — vitest + jsdom spec exercising every clause in §4–§7
- `locales.ts` — built-in code → English-name table and RTL sets
- `locales.tsv` — canonical 436-row source for `locales.ts`
- `index.ts` — re-export barrel (side-effectfully registers the element)
- `index.md` — user-facing readme

The Svelte sibling
(`lily-design-system-svelte-helpers/lily-design-system-svelte-locale-picker/`)
shares the same numbered acceptance criteria; this spec mirrors §1–§9
re-expressed for the custom-element idiom.

---

## 1. Goal

Give any HTML page a drop-in, headless locale picker that:

1. Renders an accessible radio group of available locales.
2. **Applies the chosen locale** by setting `lang="…"` and
   `dir="ltr|rtl"` on the document root (or on a consumer-supplied
   target).
3. Auto-detects script direction (RTL for Arabic, Hebrew, Thaana,
   Mongolian traditional, N'Ko, Syriac, Adlam scripts).
4. Optionally persists the chosen locale to `localStorage`.
5. Optionally falls back to `navigator.languages` on first visit when
   no value, storage, or default is supplied.
6. Ships zero CSS — the consumer styles every visual aspect via the
   `locale-picker` class hook and the `lang` / `dir` attributes.
7. Provides BCP 47-compliant tag output. Underscores in locale codes
   (e.g. `en_US`) are converted to hyphens (`en-US`) when written to
   the `lang` attribute, per RFC 5646.

## 2. Non-goals

- **Translation**. This helper does not translate strings. It only
  signals the locale to the consumer's i18n library via the `lang`
  attribute, the `localechange` event, and the bindable `value`.
- **Locale negotiation**. The helper does not implement
  `Intl.LocaleMatcher`. A simple prefix-match resolves
  `navigator.languages` against the consumer's `locales` list.
- **Auto-discovery**. The consumer always supplies the list of
  available locale codes.
- **Bundling translation files**. No JSON / YAML / PO assets ship.
- **A `<select>` default rendering**. The default is
  `<fieldset role="radiogroup">` for symmetry with `<theme-picker>`.

## 3. Architectural decisions

- **Custom element extends `HTMLElement`.** The tag is
  `<locale-picker>`. The class is exported as `LocalePicker` from
  `locale-picker.ts` and `index.ts`.
- **Side-effectful registration on import.** `index.ts` calls
  `customElements.define("locale-picker", LocalePicker)` on first
  module evaluation, guarded by a `customElements.get(...)` check.
- **Light DOM.** The element renders its `<fieldset>` and radios as
  children, not in a shadow root.
- **The `lang` attribute is the source of truth.**
- **The `dir` attribute is the secondary switch** (auto-detected from
  the locale; can be suppressed with `apply-dir="false"`).
- **BCP 47 hyphen form on the wire.** Locale codes are stored in the
  consumer's array using whichever form they prefer (`en_US`,
  `en-US`, or `en`). When the picker writes to the DOM, it
  normalises to the hyphen form. The `value` attribute / property
  mirrors back the original consumer form so round-trips are
  lossless.
- **No dependencies.** `Intl.DisplayNames` is used opportunistically
  if the runtime supports it.

## 4. Public API

### 4.1 Observed attributes

| Attribute              | Type            | Required | Default                          | Purpose |
| ---------------------- | --------------- | -------- | -------------------------------- | ------- |
| `label`                | `string`        | yes      | —                                | Accessible name for the radiogroup. |
| `locales`              | `string` (CSV)  | yes      | —                                | Available locale codes, comma-separated. The JS property `el.locales` accepts `string[]`. |
| `value`                | `string`        | no       | `""`                             | Currently selected locale code (consumer form). |
| `default-value`        | `string`        | no       | `"en"` if present, else first    | Initial locale when nothing else is supplied. |
| `storage-key`          | `string`        | no       | `undefined`                      | If set, persist the selection to `localStorage` under this key. |
| `detect-from-navigator`| `boolean` attr  | no       | absent / `false`                 | If present (and not `="false"`), resolve `navigator.languages` to a supported locale on first visit. |
| `name`                 | `string`        | no       | `"locale"`                       | `name` attribute shared by the radio inputs. |
| `apply-dir`            | `boolean` attr  | no       | absent / `true`                  | If set to `"false"`, the picker only writes `lang` and never touches `dir`. |
| `locale-labels`        | `string` (JSON) | no       | `"{}"`                           | Pretty labels per locale code, JSON-encoded object. |
| `class`                | `string`        | no       | `""`                             | Extra CSS class on the rendered `<fieldset>`. |

### 4.2 JS properties

Mirror every attribute, plus:

- `el.target` (`HTMLElement | null`, default
  `document.documentElement`; not exposed as an attribute).

### 4.3 Lifecycle callbacks

- `static get observedAttributes()` lists the kebab-case attributes
  in §4.1.
- `connectedCallback()` resolves the initial value (per §5.2),
  renders the children, and applies the locale.
- `attributeChangedCallback(name, _old, _new)` updates the
  corresponding internal field, re-renders (if it's a markup-affecting
  attribute), and re-applies (if it's `value`).
- `disconnectedCallback()` does not unset `lang` / `dir` — those
  attributes are author-managed once they have been set.

### 4.4 Events

The element fires a `localechange` `CustomEvent` after every applied
change. `event.detail` is `{ locale: string }` (the consumer-form
code, not the BCP 47-normalised tag). The event bubbles and is
composed.

### 4.5 DOM contract

```html
<locale-picker label="Language" locales="en,fr,ar">
  <fieldset class="locale-picker" role="radiogroup" aria-label="Language">
    <label class="locale-picker-option" lang="en">
      <input type="radio" name="locale" value="en" checked>
      <span class="locale-picker-option-label">English</span>
    </label>
    <label class="locale-picker-option" lang="fr">
      <input type="radio" name="locale" value="fr">
      <span class="locale-picker-option-label">French</span>
    </label>
    <label class="locale-picker-option" lang="ar">
      <input type="radio" name="locale" value="ar">
      <span class="locale-picker-option-label">Arabic</span>
    </label>
  </fieldset>
</locale-picker>
```

Each option carries `lang="{tagFor(locale)}"` (BCP 47 hyphen form) so
assistive technology pronounces the option name correctly.

`lang` and (by default) `dir` are set on the resolved target on every
apply.

### 4.6 Re-exports

`index.ts` exports:

- `LocalePicker` (the class)
- `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage` (pure helpers)
- `defaultLocaleLabels`, `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`
  (re-exports from `./locales`)
- `type LocalePickerProps`, `type LocalePickerChangeDetail`

## 5. Behaviour

### 5.1 BCP 47 tag normalisation

`bcp47LocaleTag(locale)` replaces every `_` with `-`. No case
normalisation is applied.

### 5.2 Initial value resolution

On first `connectedCallback` in the browser, the initial locale is the
first non-empty value of:

1. The `value` attribute (if non-empty).
2. `localStorage.getItem(storageKey)` (only if `storage-key` is set
   and the read does not throw).
3. `matchNavigatorLanguage(navigator.languages, locales)` (only if
   `detect-from-navigator` is set) — see §5.3.
4. The `default-value` attribute.
5. `"en"` if present in `locales`, else `locales[0]`.
6. `""` (no apply happens — the picker waits for user interaction).

### 5.3 Navigator-language matching

When `detect-from-navigator` is set, the helper inspects
`navigator.languages` (falling back to `[navigator.language]`) and
matches each entry against `locales` in order:

1. Exact match (treating `-` and `_` as equivalent, case-insensitive).
2. Language-only match: if `nav` is `xx-YY`, try the first `locales`
   entry whose language part equals `xx`.

### 5.4 Default labels

When `localeLabels[code]` is missing, the helper falls back to:

1. `defaultLocaleLabels[code]` from the built-in `locales.ts` table.
2. `Intl.DisplayNames` for the consumer's environment locale, if
   available and non-empty. (Opportunistic; never throws.)
3. The raw `code`.

### 5.5 Applying a locale

Applying a locale `code` performs, in order:

1. Resolve the target element (default `document.documentElement`).
2. Set `target.lang = bcp47LocaleTag(code)`.
3. If `apply-dir` is not `"false"`, set
   `target.dir = isRtlLocale(code) ? "rtl" : "ltr"`.
4. If `storage-key` is set, write `code` to `localStorage` inside a
   try/catch.
5. Dispatch `localechange` `CustomEvent` with
   `detail: { locale: code }` (consumer-form code).

### 5.6 RTL detection

`isRtlLocale(locale)` returns `true` when:

1. The locale string contains one of the RTL script subtags as a
   case-insensitive `-`- or `_`-separated component:
   `Arab`, `Hebr`, `Mong`, `Nkoo`, `Syrc`, `Thaa`, `Adlm`. **OR**
2. The leading language subtag is one of: `ar`, `arc`, `ckb`, `dv`,
   `fa`, `he`, `iw` (legacy Hebrew), `ji` (legacy Yiddish), `ks`,
   `ku`, `mzn`, `ps`, `sd`, `ug`, `ur`, `yi`.

### 5.7 Reactivity

Setting `el.value` or selecting a different radio input triggers a
re-apply. Other attribute / property changes re-render the children
when relevant and take effect on the next apply.

### 5.8 SSR / no-JS

The element only registers in browsers with `customElements`. Without
JS, the element renders nothing. Consumers wanting flicker-free first
paint should set `lang` / `dir` on the document manually before
upgrade.

## 6. Accessibility

### 6.1 Roles and properties

- `<fieldset>` with `role="radiogroup"` is the announced container.
- `aria-label={label}` supplies the group name.
- Native `<input type="radio">` elements get the radio role.
- Each option carries `lang="{tagFor(locale)}"` (WCAG 3.1.2 Language
  of Parts).
- The document root receives `lang` (WCAG 3.1.1 Language of Page)
  and `dir` for bidi layout.

### 6.2 Keyboard contract

Provided by the platform (native radio inputs):

| Key            | Action                                           |
| -------------- | ------------------------------------------------ |
| `Tab`          | Move focus into / out of the group.              |
| `Arrow` keys   | Move selection between options inside the group. |
| `Space`        | Select the focused option (when not already).    |

### 6.3 Internationalisation

- `label`, `localeLabels`, and the consumer-supplied `locales` list
  are all passed through verbatim.
- No user-facing strings are hardcoded.
- Each rendered option name appears in its own `lang` context.

## 7. Testing acceptance criteria

`locale-picker.test.ts` must assert every numbered item below. Tests
run under vitest + jsdom. Numbering mirrors the Svelte sibling's §7.

### 7.1 Markup contract (§4.5)

1. Renders a `<fieldset>` with `role="radiogroup"`.
2. `aria-label` is the supplied `label`.
3. Renders one radio input per entry in `locales`, sharing the
   supplied `name` attribute.
4. Each radio's `value` attribute is the locale code.
5. Each option carries `lang="{tagFor(locale)}"` (BCP 47 hyphen form).
6. The default rendering shows `localeLabels[code] ??
   defaultLocaleLabels[code] ?? code` as the visible option text.

### 7.2 Pure helpers (§5.1, §5.6)

7. `bcp47LocaleTag("en_US")` === `"en-US"`.
8. `bcp47LocaleTag("zh_Hant_TW")` === `"zh-Hant-TW"`.
9. `bcp47LocaleTag("en")` === `"en"`.
10. `isRtlLocale("ar")`, `isRtlLocale("he_IL")`, and
    `isRtlLocale("uz_Arab_AF")` are all `true`.
11. `isRtlLocale("en")` and `isRtlLocale("fr_CA")` are both `false`.
12. `localeName("en_US")` returns `"English (United States)"` from
    the built-in table.

### 7.3 Locale application (§5.5)

13. After mount, `target.lang` (defaulting to
    `document.documentElement`) is the BCP 47 form of the resolved
    initial locale.
14. After mount, `target.dir` is `"rtl"` for an RTL initial locale
    and `"ltr"` otherwise (default `apply-dir`).
15. When `apply-dir="false"`, the `dir` attribute is not written.
16. Selecting a different radio updates `target.lang`, updates
    `target.dir`, and fires `localechange` with the new locale code
    in its consumer form.
17. A custom `target` element receives `lang` and `dir` instead of
    `document.documentElement`.

### 7.4 Initial-value resolution (§5.2, §5.3)

18. When `storage-key` is set, the active code is written to
    `localStorage` and read back on a fresh mount.
19. When `value` is supplied as a non-empty attribute, the
    initial-value resolution skips storage, navigator detection, and
    defaults.
20. When `detect-from-navigator` is set and `navigator.languages`
    contains a supported locale, the picker resolves to it.
21. When `detect-from-navigator` is set and only a language-only
    match is available, the picker resolves to that match.

### 7.5 Element shape + property API

22. Setting `el.locales` as an array property mirrors the CSV
    attribute and re-renders.
23. Setting `el.localeLabels` as an object property mirrors the JSON
    attribute and re-renders.

## 8. Out-of-scope (future, not implemented here)

- A `<locale-view>` companion element.
- An `Intl.LocaleMatcher` integration.
- A built-in `Accept-Language` server helper.

## 9. Tracking

- Package directory:
  `lily-design-system-html-helpers/lily-design-system-html-locale-picker/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
  (or contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
- Canonical locale list: [locales.tsv](./locales.tsv) — 436 codes
  with English names
