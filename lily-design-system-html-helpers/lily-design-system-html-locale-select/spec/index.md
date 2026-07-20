# `<locale-select>` — Specification

Single source of truth for the `lily-design-system-html-locale-select`
HTML helper. This file drives implementation, testing, and
documentation in the spec-driven-development style: anything not in
this spec is out of scope; anything in this spec must be exercised by
a test.

Sibling files in this directory:

- `locale-select.ts` — the custom-element implementation
- `locale-select.test.ts` — vitest + jsdom spec exercising every clause in §4–§7
- `locales.ts` — built-in code → English-name table and RTL sets
- `locales.tsv` — canonical 436-row source for `locales.ts`
- `index.ts` — re-export barrel (side-effectfully registers the element)
- `index.md` — user-facing readme

The Svelte sibling
(`lily-design-system-svelte-helpers/lily-design-system-svelte-locale-select/`)
shares the same numbered acceptance criteria; this spec mirrors §1–§9
re-expressed for the custom-element idiom.

---

## 1. Goal

Give any HTML page a drop-in, headless locale select that:

1. Renders an accessible native `<select>` of available locales.
2. **Applies the chosen locale** by setting `lang="…"` and
   `dir="ltr|rtl"` on the document root (or on a consumer-supplied
   target).
3. Auto-detects script direction (RTL for Arabic, Hebrew, Thaana,
   Mongolian traditional, N'Ko, Syriac, Adlam scripts).
4. Optionally persists the chosen locale to `localStorage`.
5. Optionally falls back to `navigator.languages` on first visit when
   no value, storage, or default is supplied.
6. Ships zero CSS — the consumer styles every visual aspect via the
   `locale-select` class hook and the `lang` / `dir` attributes.
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

## 3. Architectural decisions

- **Custom element extends `HTMLElement`.** The tag is
  `<locale-select>`. The class is exported as `LocaleSelect` from
  `locale-select.ts` and `index.ts`.
- **Side-effectful registration on import.** `index.ts` calls
  `customElements.define("locale-select", LocaleSelect)` on first
  module evaluation, guarded by a `customElements.get(...)` check.
- **Light DOM.** The element renders its `<select>` and `<option>`s
  as children, not in a shadow root.
- **The `lang` attribute is the source of truth.**
- **The `dir` attribute is the secondary switch** (auto-detected from
  the locale; can be suppressed with `apply-dir="false"`).
- **BCP 47 hyphen form on the wire.** Locale codes are stored in the
  consumer's array using whichever form they prefer (`en_US`,
  `en-US`, or `en`). When the select writes to the DOM, it
  normalises to the hyphen form. The `value` attribute / property
  mirrors back the original consumer form so round-trips are
  lossless.
- **No dependencies.** `Intl.DisplayNames` is used opportunistically
  if the runtime supports it.

## 4. Public API

### 4.1 Observed attributes

| Attribute              | Type            | Required | Default                          | Purpose |
| ---------------------- | --------------- | -------- | -------------------------------- | ------- |
| `label`                | `string`        | yes      | —                                | Accessible name for the `<select>`. |
| `placeholder`          | `string`        | no       | value of `label`                 | Text of the always-displayed placeholder `<option>`. The closed `<select>` shows this instead of the active locale name, so the control stays as narrow as this word. Defaults to `label`, so no hardcoded user-facing string is emitted. |
| `locales`              | `string` (CSV)  | yes      | —                                | Available locale codes, comma-separated. The JS property `el.locales` accepts `string[]`. |
| `value`                | `string`        | no       | `""`                             | Currently selected locale code (consumer form). |
| `default-value`        | `string`        | no       | `"en"` if present, else first    | Initial locale when nothing else is supplied. |
| `storage-key`          | `string`        | no       | `undefined`                      | If set, persist the selection to `localStorage` under this key. |
| `detect-from-navigator`| `boolean` attr  | no       | absent / `false`                 | If present (and not `="false"`), resolve `navigator.languages` to a supported locale on first visit. |
| `name`                 | `string`        | no       | `"locale"`                       | `name` attribute on the `<select>`. |
| `apply-dir`            | `boolean` attr  | no       | absent / `true`                  | If set to `"false"`, the select only writes `lang` and never touches `dir`. |
| `locale-labels`        | `string` (JSON) | no       | `"{}"`                           | Pretty labels per locale code, JSON-encoded object. |
| `class`                | `string`        | no       | `""`                             | Extra CSS class on the rendered `<select>`. |

### 4.2 JS properties

Mirror every attribute, plus:

- `el.target` (`HTMLElement | null`, default
  `document.documentElement`; not exposed as an attribute).

`el.placeholder` falls back to `el.label` when the `placeholder`
attribute is absent.

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
<locale-select label="Locale" locales="en,fr,ar">
  <select class="locale-select" aria-label="Locale" name="locale">
    <option class="locale-select-option locale-select-placeholder" value="" selected>Locale</option>
    <option class="locale-select-option" value="en" lang="en">English</option>
    <option class="locale-select-option" value="fr" lang="fr">French</option>
    <option class="locale-select-option" value="ar" lang="ar">Arabic</option>
  </select>
</locale-select>
```

Each locale `<option>` carries `lang="{tagFor(locale)}"` (BCP 47
hyphen form) so assistive technology pronounces the option name
correctly.

**The placeholder option.** The first child of the `<select>` is
always a component-owned placeholder `<option>` carrying
`class="locale-select-option locale-select-placeholder"`, `value=""`,
`selected`, and `placeholder ?? label` as its text. It is rendered
before the real options and before any consumer-supplied custom
option rendering. It carries **no `lang`** — it is not a locale. No
option other than the placeholder is ever marked `selected`.

**Snap-back.** The `<select>` is not bound to `value`. Its own DOM
selection stays pinned to the placeholder, so the closed control
always reads `placeholder ?? label` rather than the active locale
name. On `change` the element:

```js
const chosen = select.value;
select.value = "";      // snap back to the placeholder
if (chosen) this.value = chosen;
```

Everything downstream is unchanged: `this.value` remains the real
selection (attribute + property), and `lang` / `dir` application,
`localStorage` persistence, the `localechange` event, navigator
detection, and initial-value resolution all behave exactly as
before. Consumers read the selection from `el.value` or the
`localechange` detail — never from the rendered `<select>`, whose
`value` is always `""`. Consumer `change` listeners on the host
still fire (the native event bubbles from the `<select>`).

`lang` and (by default) `dir` are set on the resolved target on every
apply.

### 4.6 Re-exports

`index.ts` exports:

- `LocaleSelect` (the class)
- `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage` (pure helpers)
- `defaultLocaleLabels`, `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`
  (re-exports from `./locales`)
- `type LocaleSelectProps`, `type LocaleSelectChangeDetail`

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
6. `""` (no apply happens — the select waits for user interaction).

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

Setting `el.value` or selecting a different `<option>` in the
`<select>` triggers a re-apply. Other attribute / property changes
re-render the children when relevant and take effect on the next
apply.

### 5.8 SSR / no-JS

The element only registers in browsers with `customElements`. Without
JS, the element renders nothing. Consumers wanting flicker-free first
paint should set `lang` / `dir` on the document manually before
upgrade.

## 6. Accessibility

### 6.1 Roles and properties

- `<select>` (implicit `role="combobox"`) is the announced control.
- `aria-label={label}` supplies the accessible name.
- Native `<option>` elements get the implicit `role="option"`.
- Each locale option carries `lang="{tagFor(locale)}"` (WCAG 3.1.2
  Language of Parts). The placeholder option carries no `lang`: it
  is UI copy in the page language, not a locale name.
- The document root receives `lang` (WCAG 3.1.1 Language of Page)
  and `dir` for bidi layout.
- **Known tradeoff.** Because the `<select>` keeps the placeholder
  selected, the active locale is not announced as the combobox
  value; a screen-reader user hears only `placeholder ?? label`.
  Consumers who need the active locale conveyed must surface it
  elsewhere — visible text next to the control, or a polite
  `role="status"` live region updated on `localechange`. The
  element still writes `lang` / `dir` on the target, so the state
  stays observable to CSS, scripts, and the AT's language engine.

### 6.2 Keyboard contract

Provided by the platform (native `<select>`):

| Key                  | Action                                           |
| -------------------- | ------------------------------------------------ |
| `Tab` / `Shift+Tab`  | Move focus into / out of the control.            |
| `Arrow Down` / `Up`  | Move selection to the next / previous option.    |
| `Home` / `End`       | Move selection to the first / last option.       |
| typeahead            | Jump to the option matching typed characters.    |
| `Enter` / `Space`    | Open the option list (where the platform pops one). |
| `Escape`             | Close the open option list.                      |

### 6.3 Internationalisation

- `label`, `localeLabels`, and the consumer-supplied `locales` list
  are all passed through verbatim.
- No user-facing strings are hardcoded.
- Each rendered option name appears in its own `lang` context.

## 7. Testing acceptance criteria

`locale-select.test.ts` must assert every numbered item below. Tests
run under vitest + jsdom. Numbering mirrors the Svelte sibling's §7.

### 7.1 Markup contract (§4.5)

1. Renders a `<select>` (implicit `role="combobox"`).
2. `aria-label` is the supplied `label`.
3. Renders one placeholder `<option>` plus one `<option>` per entry
   in `locales` (`locales.length + 1` total); the `<select>`
   carries the supplied `name` attribute.
4. Each locale `<option>`'s `value` attribute is the locale code, in
   catalog order, preceded by the empty-valued placeholder — the
   full value list is `["", ...locales]`.
4a. The placeholder `<option>` is the first child, carries
    `class="locale-select-option locale-select-placeholder"` and
    `value=""`, renders `label` as its text, and is the selected
    option — `select.value` is `""` — while the resolved initial
    locale is still applied to the target's `lang`.
4b. When the `placeholder` attribute is supplied it overrides
    `label` as the placeholder option's text, while `aria-label`
    still carries `label`.
4c. Choosing an option applies that locale (`lang`, `dir`,
    `localechange`) AND snaps the `<select>` back to the
    placeholder — `select.value` is `""` again, both on the
    pre-existing select reference and on the re-rendered one.
5. Each locale option carries `lang="{tagFor(locale)}"` (BCP 47
   hyphen form); the placeholder option carries no `lang`.
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
16. Selecting a different `<option>` updates `target.lang`, updates
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
    contains a supported locale, the select resolves to it.
21. When `detect-from-navigator` is set and only a language-only
    match is available, the select resolves to that match.

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
  `lily-design-system-html-helpers/lily-design-system-html-locale-select/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
  (or contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
- Canonical locale list: [locales.tsv](../locales.tsv) — 436 codes
  with English names
