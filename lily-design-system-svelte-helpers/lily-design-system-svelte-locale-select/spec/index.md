# LocaleSelect — Specification

Single source of truth for the `lily-design-system-svelte-locale-select`
Svelte helper. This file drives implementation, testing, and documentation in
the spec-driven-development style: anything not in this spec is out of scope;
anything in this spec must be exercised by a test.

Sibling files in this directory:

- `LocaleSelect.svelte` — the implementation
- `LocaleSelect.test.ts` — vitest spec exercising every clause in §4–§7
- `locales.ts` — built-in locale-code → English-name table and RTL set,
  derived from `locales.tsv`
- `locales.tsv` — canonical 436-row list of locale codes and English names
- `index.ts` — re-export barrel
- `index.md` — user-facing readme

The headless `lily-design-system-svelte-headless` library does not (yet)
include a canonical `LocaleSelect`; this helper is the opinionated,
reusable counterpart that owns the locale-application lifecycle (the
`lang` and `dir` attributes on the document root) and the persistence
choice.

---

## 1. Goal

Give a Svelte 5 application a drop-in, headless locale picker that:

1. Renders an accessible native `<select>` of available locales.
2. **Applies the chosen locale** by setting `lang="…"` and `dir="ltr|rtl"`
   on the document root (or on a consumer-supplied target).
3. Auto-detects script direction: RTL for locales using Arabic, Hebrew,
   Thaana, Mongolian (traditional), N'Ko, Syriac, or Adlam scripts.
4. Optionally persists the chosen locale to `localStorage` so the choice
   survives reload.
5. Optionally falls back to `navigator.language` on first visit when no
   value, storage entry, or default is supplied.
6. Ships zero CSS — the consumer styles every visual aspect via the
   `locale-select` class hook and the `lang` / `dir` attributes.
7. Provides BCP 47-compliant tag output. Underscores in locale codes
   (e.g. `en_US`) are converted to hyphens (`en-US`) when written to the
   `lang` attribute, per RFC 5646.

## 2. Non-goals

- **Translation**. This component does not translate strings. It only
  signals the locale to the consumer's i18n library (`svelte-i18n`,
  Paraglide, Inlang, Tolgee, custom `Intl.*` calls) via the `lang`
  attribute, the `onChange` callback, and the bindable `value`.
- **Locale negotiation**. The component does not implement
  `Intl.LocaleMatcher` / RFC 4647 best-fit / lookup. The consumer is
  expected to pass a list of locales they already support, and the
  optional `navigator.language` fallback uses a simple prefix match
  (see §5.2).
- **Auto-discovery**. The consumer always supplies the list of
  available locale codes — the component does not crawl, fetch, or
  introspect a translation backend.
- **Bundling translation files**. No JSON / YAML / PO assets ship with
  this helper.
- **SvelteKit-only features**. The component only depends on Svelte 5
  + DOM APIs and runs in any Svelte 5 host (SvelteKit, plain Vite +
  Svelte, Astro, Storybook).
- **Custom default rendering**. The default is a native `<select>`
  for symmetry with `ThemeSelect` and because a native `<select>`
  scales to long locale lists and pops the OS-native picker on mobile.
  Consumers who want radios, buttons, or a combobox use the `children`
  snippet — see §4.4.

## 3. Architectural decisions

- **The `lang` attribute is the source of truth**. Every Lily helper
  and every i18n library agrees that `document.documentElement.lang`
  is the authoritative signal for current document language (WCAG
  3.1.1, HTML Living Standard, all major screen readers). The picker
  writes there.
- **The `dir` attribute is the secondary switch**. Setting `dir` on
  the document root is what causes browsers to mirror layout, scrollbar
  position, and bidi text. The picker derives it from the locale.
- **BCP 47 hyphen form on the wire**. Locale codes are stored in the
  consumer's array using whichever form they prefer (`en_US`, `en-US`,
  or `en`). When the picker writes to the DOM, it normalises to the
  BCP 47 hyphen form (`en-US`). The bindable `value` mirrors back the
  original consumer form, so round-trips are lossless.
- **TypeScript everywhere**. Public surface is fully typed via a `Props`
  type exported from `LocaleSelect.svelte` and re-exported from
  `index.ts`.
- **SSR-safe**. The component compiles cleanly under
  `@sveltejs/vite-plugin-svelte` SSR. All DOM mutations happen inside
  `$effect`, which only runs in the browser.
- **No dependencies beyond `svelte`**. No `Intl.DisplayNames`
  polyfill, no localStorage wrappers, no UUID library. (`Intl.DisplayNames`
  is used opportunistically if the runtime supports it — see §5.4.)
- **Two-way bindable `value`**. Consumers can `bind:value` to the
  selected locale code. The component is fully controlled when `value`
  is provided as a non-empty string and uncontrolled (resolves from
  storage, navigator, or `defaultValue`) otherwise.
- **Pure helper functions are exported from the module script** so
  consumers can reuse them outside the component:
  `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `defaultLocaleLabels`.

## 4. Public API

### 4.1 Props

| Prop                | Type                                  | Required | Default                  | Purpose |
| ------------------- | ------------------------------------- | -------- | ------------------------ | ------- |
| `label`             | `string`                              | yes      | —                        | Accessible name for the `<select>`. |
| `locales`           | `string[]`                            | yes      | —                        | Available locale codes (e.g. `["en", "en_US", "fr", "ar"]`). |
| `value`             | `string` (bindable)                   | no       | `""`                     | Currently selected locale code. |
| `defaultValue`      | `string`                              | no       | `"en"` if present in `locales`, else first item | Initial locale when nothing else is supplied. |
| `storageKey`        | `string`                              | no       | `undefined`              | If set, persist the selection to `localStorage` under this key. |
| `detectFromNavigator` | `boolean`                           | no       | `false`                  | If true and no value/storage entry exists, resolve `navigator.language` to a supported locale. |
| `name`              | `string`                              | no       | `"locale"`               | `name` attribute of the `<select>`. |
| `target`            | `HTMLElement \| null`                 | no       | `document.documentElement` | Element that receives `lang` and `dir`. |
| `applyDir`          | `boolean`                             | no       | `true`                   | If false, the picker only writes `lang` and never touches `dir`. |
| `localeLabels`      | `Record<string, string>`              | no       | `{}`                     | Optional pretty labels per locale code. |
| `children`          | `Snippet<[ChildArgs]>`                | no       | default `<option>` markup | Custom rendering of the options. |
| `onChange`          | `(locale: string) => void`            | no       | `undefined`              | Fires after the picker applies a new locale. |
| `class`             | `string`                              | no       | `""`                     | Extra CSS class on the `<select>` root. |
| `...restProps`      | any HTML `<select>` attributes        | no       | —                        | Spread onto the `<select>`. |

### 4.2 `ChildArgs`

```ts
type ChildArgs = {
  /** The locale codes to render as options. */
  locales: string[];
  /** Currently selected locale code (consumer form, not BCP 47-normalised). */
  value: string;
  /** Apply a locale imperatively (also writes back to `value`). */
  setLocale: (locale: string) => void;
  /** `name` attribute of the `<select>`. */
  name: string;
  /** Resolve a locale code to its display label. */
  labelFor: (locale: string) => string;
  /** BCP 47 tag form of a locale code (`en_US` → `en-US`). */
  tagFor: (locale: string) => string;
  /** Is the locale right-to-left? */
  isRtl: (locale: string) => boolean;
};
```

### 4.3 DOM contract

- Root element: `<select class="locale-select {class}"
  aria-label="{label}" name="{name}">`.
- Default children: one `<option class="locale-select-option"
  value="{locale}" lang="{tagFor(locale)}">{labelFor(locale)}</option>`
  per locale code.
- Each option carries `lang="{tagFor(locale)}"` so assistive technology
  pronounces the option text in the appropriate language even when the
  document language differs.
- Custom children: rendered via the `children` snippet with `ChildArgs`.
- `lang="{tagFor(slug)}"` is set on the `target` element on every apply.
- If `applyDir` is true, `dir="rtl"` or `dir="ltr"` is set on the
  `target` element on every apply.

### 4.4 Re-exports

`index.ts` exports:

- `default` (the component)
- `LocaleSelect` (named alias of the default export)
- `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `defaultLocaleLabels` (pure helpers)
- `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS` (constants)
- `type Props`, `type ChildArgs`

## 5. Behaviour

### 5.1 BCP 47 tag normalisation

Per RFC 5646 (BCP 47), locale tags use `-` as the subtag separator. The
TR35 / CLDR-style `_` separator (`en_US`, `zh_Hant_TW`) is widely used
inside applications and inside this helper's `locales.tsv` because it
is unambiguous in identifiers, but the `lang` attribute on HTML
elements must use hyphens.

`bcp47LocaleTag(locale)` performs the conversion: every `_` becomes
`-`. No case normalisation is applied; consumers who want canonical
case (language lowercase, script Title Case, region UPPERCASE) should
pre-normalise their locale codes.

### 5.2 Initial value resolution

On first effect run in the browser, the initial locale is the first
non-empty value of:

1. `value` (if a consumer supplied a non-empty string).
2. `localStorage.getItem(storageKey)` (only if `storageKey` is set and
   the read does not throw).
3. `matchNavigatorLanguage(locales)` (only if `detectFromNavigator` is
   true) — see §5.3.
4. `defaultValue`.
5. `"en"` if present in `locales`, else `locales[0]`.
6. `""` (no apply happens — the picker waits for user interaction).

Resolution writes back to `value` (via the bindable) so consumers
observing the bound variable see the resolved value.

### 5.3 Navigator-language matching

When `detectFromNavigator` is true, the helper inspects
`navigator.languages` (falling back to `[navigator.language]`) and
matches each entry against `locales` in order, returning the first
hit. Matching is case-insensitive on the language and region parts and
treats `-` and `_` as equivalent.

For each navigator entry `nav`:

1. Exact match (`locales.includes(nav)` or its underscore form).
2. Language-only match: if `nav` is `xx-YY`, try `xx`. The first
   `locales` entry whose language matches wins.

If no navigator entry matches, the resolution falls through to step 4
of §5.2.

### 5.4 Default labels

When `localeLabels[code]` is missing, the helper falls back to:

1. `defaultLocaleLabels[code]` from the built-in `locales.ts` table
   derived from `locales.tsv`.
2. `Intl.DisplayNames` for the consumer's BCP 47 environment locale,
   if available and if it returns a non-empty string. (Used
   opportunistically — never throws.)
3. The raw `code`.

### 5.5 Applying a locale

Applying a locale `code` performs, in order:

1. Resolve the target element. If `target` is `null` or `undefined`,
   use `document.documentElement`.
2. Set `target.lang = bcp47LocaleTag(code)`.
3. If `applyDir` is true, set `target.dir = isRtlLocale(code) ?
   "rtl" : "ltr"`.
4. If `storageKey` is set, write `code` to `localStorage` inside a
   try/catch (so private-mode / quota errors are silently swallowed).
5. Call `onChange(code)` if supplied. The argument is the original
   consumer-form code, not the BCP 47-normalised tag.

### 5.6 RTL detection

`isRtlLocale(locale)` returns `true` when:

1. The locale string contains one of the RTL script subtags as a
   case-insensitive component separated by `-` or `_`:
   `Arab`, `Hebr`, `Mong`, `Nkoo`, `Syrc`, `Thaa`, `Adlm`. **OR**
2. The leading language subtag (before the first `-` or `_`) is one of:
   `ar`, `arc`, `ckb`, `dv`, `fa`, `he`, `iw` (legacy Hebrew),
   `ji` (legacy Yiddish), `ks`, `ku`, `mzn`, `pa-Arab`, `ps`, `sd`,
   `ug`, `ur`, `yi`.

This intentionally avoids depending on `Intl.Locale` / CLDR data so the
helper works in older runtimes and during SSR.

### 5.7 Reactivity

A single `$effect` re-applies the locale whenever `value` changes
(including the bind-back from a consumer or from initial-value
resolution). Other prop changes (`target`, `applyDir`, `localeLabels`)
take effect on the next locale change, not retroactively.

### 5.8 SSR

During server rendering, no effects run and no DOM is touched. The
markup renders with the value supplied by the consumer (if any).
Consumers wanting flicker-free first paint pass a server-resolved
`value` (from a cookie, `Accept-Language` header, etc.).

## 6. Accessibility

### 6.1 Roles and properties

- `<select>` has an implicit `combobox` role and is the announced
  control.
- `aria-label={label}` supplies the accessible name.
- The native `<select>` and its `<option>` children get the
  `combobox` / `option` roles, current-value state, and keyboard
  semantics for free.
- Each option carries `lang="{tagFor(locale)}"` so assistive technology
  can switch pronunciation for the option text. WCAG 3.1.2 (Language
  of Parts).
- The document root receives `lang` and (by default) `dir` — WCAG
  3.1.1 (Language of Page) and 1.4.10 (Reflow / bidi layout).

### 6.2 Keyboard contract

Provided by the platform (native `<select>`):

| Key                  | Action                                           |
| -------------------- | ------------------------------------------------ |
| `Tab` / `Shift+Tab`  | Move focus to / from the select.                 |
| `Arrow Down` / `Arrow Up` | Select the next / previous option.          |
| `Home` / `End`       | Select the first / last option.                  |
| Typeahead            | Type characters to jump to a matching option.    |
| `Enter` / `Space`    | Open the option list (platform-dependent).       |
| `Escape`             | Close the option list.                           |

### 6.3 Internationalisation

- `label`, `localeLabels`, and the consumer-supplied `locales` array
  are all passed through verbatim.
- No user-facing strings are hardcoded inside the component.
- Each rendered option name appears in its own `lang` context — a
  screen reader announces "Français" with a French voice even when
  the surrounding page is English.
- Writing direction inherits from the resolved locale; consumers can
  override by passing `applyDir={false}`.

### 6.4 BCP 47 reference

Language-tag syntax is defined by the IETF's BCP 47. BCP stands for
"Best Current Practice", and is a persistent name for a series of
RFCs whose numbers change as they are updated. The latest RFC
describing language-tag syntax is **RFC 5646, Tags for the
Identification of Languages**, and it obsoletes the older RFCs 4646,
3066, and 1766.

Authors used to find subtags by consulting the lists of codes in
various ISO standards (ISO 639 for languages, ISO 15924 for scripts,
ISO 3166-1 for regions, UN M.49 for region groupings). Today every
subtag is published in the IANA Language Subtag Registry, which is
the single authoritative source.

References this helper relies on:

- W3C — Language tags in HTML and XML:
  <https://www.w3.org/International/articles/language-tags/>
- RFC 5646 (BCP 47) — Tags for Identifying Languages:
  <https://www.rfc-editor.org/rfc/rfc5646>
- IANA Language Subtag Registry (landing page):
  <https://www.iana.org/assignments/language-subtag-registry>
- IANA Language Subtag Registry (the registry file itself, plain text,
  authoritative listing of every language, script, region, variant,
  extension, and grandfathered subtag):
  <https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry>
- W3C i18n — When should I use the language attribute?:
  <https://www.w3.org/International/questions/qa-when-lang.html>
- HTML Living Standard — `lang` attribute:
  <https://html.spec.whatwg.org/multipage/dom.html#the-lang-and-xml:lang-attributes>
- HTML Living Standard — `dir` attribute:
  <https://html.spec.whatwg.org/multipage/dom.html#the-dir-attribute>
- HTML Living Standard — the `<select>` element:
  <https://html.spec.whatwg.org/multipage/form-elements.html#the-select-element>
- WCAG 2.2 SC 3.1.1 (Language of Page) and 3.1.2 (Language of Parts):
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-page>
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts>

## 7. Testing acceptance criteria

`LocaleSelect.test.ts` must assert every numbered item below. Tests
run under vitest + jsdom + `@testing-library/svelte`.

### 7.1 Markup contract (mirrors §4.3)

1. Renders a `<select>` (implicit `combobox` role).
2. `aria-label` is the supplied `label`.
3. Renders one `<option>` per entry in `locales`; the `<select>`
   carries the supplied `name` attribute.
4. Each option's `value` attribute is the locale code.
5. Each option carries `lang="{tagFor(locale)}"` (BCP 47 hyphen form).
6. The default rendering shows `localeLabels[code]
   ?? defaultLocaleLabels[code] ?? code` as the visible option text.

### 7.2 Pure helpers (mirrors §5.1, §5.6)

7. `bcp47LocaleTag("en_US")` === `"en-US"`.
8. `bcp47LocaleTag("zh_Hant_TW")` === `"zh-Hant-TW"`.
9. `bcp47LocaleTag("en")` === `"en"`.
10. `isRtlLocale("ar")` and `isRtlLocale("he_IL")` and
    `isRtlLocale("uz_Arab_AF")` are all `true`.
11. `isRtlLocale("en")` and `isRtlLocale("fr_CA")` are both `false`.
12. `localeName("en_US")` returns `"English (United States)"` from the
    built-in table.

### 7.3 Locale application (mirrors §5.5)

13. After mount, `target.lang` (defaulting to `document.documentElement`)
    is the BCP 47 form of the resolved initial locale.
14. After mount, `target.dir` is `"rtl"` for an RTL initial locale and
    `"ltr"` otherwise (when `applyDir` is unspecified / true).
15. When `applyDir` is `false`, the `dir` attribute is not written.
16. Selecting a different option updates `target.lang`, updates
    `target.dir`, and fires `onChange` with the new locale code in its
    consumer form (not the BCP 47-normalised tag).
17. A custom `target` element receives `lang` and `dir` instead of
    `document.documentElement`.

### 7.4 Initial-value resolution (mirrors §5.2, §5.3)

18. When `storageKey` is set, the active code is written to
    `localStorage` and read back on a fresh mount.
19. When `value` is supplied as a non-empty prop, the initial-value
    resolution skips storage, navigator detection, and defaults.
20. When `detectFromNavigator` is true and `navigator.languages`
    contains a supported locale, the picker resolves to that locale.
21. When `detectFromNavigator` is true and only a language-only match
    is available (`navigator.language === "fr-CA"`,
    `locales === ["en", "fr"]`), the picker resolves to `"fr"`.

### 7.5 Spread + custom children (mirrors §4.1, §4.2)

22. Extra attributes spread through onto the `<select>` (e.g.
    `data-testid`).
23. A custom `children` snippet receives `ChildArgs` with `locales`,
    `name`, `tagFor`, and `isRtl` exposed.

## 8. Out-of-scope (future, not implemented here)

- A complementary `LocaleView` helper that displays the active
  locale's pretty name. Would parallel the upstream `ThemeView`.
- A `LocaleSelect` sibling that defaults to radio-group markup. For
  now the `children` snippet covers that case — see
  `index.md` §"Customising the option rendering".
- An `Intl.LocaleMatcher` / RFC 4647 lookup integration. Would replace
  the simple two-step navigator match in §5.3.
- A built-in `Accept-Language`-header server helper for SSR locale
  negotiation. Would live in a sibling SvelteKit-only helper.
- A `prefersReducedMotion` integration. Out of scope for a locale
  picker.

## 9. Tracking

- Package directory:
  `lily-design-system-svelte-helpers/lily-design-system-svelte-locale-select/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or
  contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
- Canonical locale list: [locales.tsv](./locales.tsv) — 436 codes with
  English names
