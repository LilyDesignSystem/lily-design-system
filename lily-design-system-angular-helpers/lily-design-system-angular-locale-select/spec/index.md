# LocaleSelect — Specification

Single source of truth for the
`lily-design-system-angular-locale-select` Angular helper. This file
drives implementation, testing, and documentation in the
spec-driven-development style: anything not in this spec is out of
scope; anything in this spec must be exercised by a test.

Sibling files in this directory:

- `locale-select.component.ts` — the implementation
- `locale-select.component.spec.ts` — vitest spec exercising every clause in §4–§7
- `locales.ts` — built-in locale-code → English-name table and RTL sets,
  derived from `locales.tsv`
- `locales.tsv` — canonical 436-row list of locale codes and English names
- `index.ts` — re-export barrel
- `index.md` — user-facing readme

---

## 1. Goal

Give an Angular 20 application a drop-in, headless locale select that:

1. Renders an accessible native `<select>` of available locales.
2. **Applies the chosen locale** by setting `lang="…"` and
   `dir="ltr|rtl"` on the document root (or on a consumer-supplied
   target).
3. Auto-detects script direction: RTL for locales using Arabic,
   Hebrew, Thaana, Mongolian (traditional), N'Ko, Syriac, or Adlam
   scripts.
4. Optionally persists the chosen locale to `localStorage` so the
   choice survives reload.
5. Optionally falls back to `navigator.language` on first visit when
   no value, storage entry, or default is supplied.
6. Ships zero CSS — the consumer styles every visual aspect via the
   `locale-select` class hook and the `lang` / `dir` attributes.
7. Provides BCP 47-compliant tag output. Underscores in locale codes
   (e.g. `en_US`) are converted to hyphens (`en-US`) when written to
   the `lang` attribute, per RFC 5646.

## 2. Non-goals

- **Translation**. This component does not translate strings. It only
  signals the locale via the `lang` attribute, the `localeChange`
  output, and the bindable `value`.
- **Locale negotiation**. The component does not implement
  `Intl.LocaleMatcher` / RFC 4647 best-fit / lookup.
- **Auto-discovery**. The consumer always supplies the list of
  available locale codes.
- **Bundling translation files**. No JSON / YAML / PO assets ship
  with this helper.
- **Custom default rendering**. The default is a native `<select>`
  for symmetry with `ThemeSelect` and because a native `<select>`
  scales to long locale lists and pops the OS-native picker on
  mobile. Consumers who want radios, buttons, or a combobox bind a
  sibling widget to the same `[(value)]` signal.

## 3. Architectural decisions

- **Standalone signal-based component.** Uses `input<T>()`,
  `input.required<T>()`, `output<T>()`, and `model<string>()`.
- **`OnPush` change detection.**
- **The `lang` attribute is the source of truth.** `dir` is the
  secondary switch derived from the locale.
- **BCP 47 hyphen form on the wire.** Consumer arrays may use either
  `_` or `-`; the DOM write always uses `-`. The two-way bindable
  `value` preserves the consumer form.
- **TypeScript strict** on the public surface.
- **SSR-safe.** DOM side-effects guard on `typeof document`.
- **No dependencies beyond `@angular/core` / `@angular/common`.**
- **Pure helper functions exported** so consumers can reuse them
  outside the component: `bcp47LocaleTag`, `isRtlLocale`,
  `localeName`, `matchNavigatorLanguage`, plus re-exports of
  `defaultLocaleLabels`, `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`.
- **Template-cast pattern**: `$any($event.target).value` (not the
  parenthesised TS-cast form).

## 4. Public API

### 4.1 Inputs / outputs

| Input / output        | Type                                | Required | Default                          | Purpose |
| --------------------- | ----------------------------------- | -------- | -------------------------------- | ------- |
| `label`               | `input.required<string>()`          | yes      | —                                | Accessible name for the `<select>`. |
| `locales`             | `input.required<string[]>()`        | yes      | —                                | Available locale codes. |
| `value`               | `model<string>()`                   | no       | `""`                             | Currently selected locale code. Two-way bindable. |
| `defaultValue`        | `input<string>()`                   | no       | `""`                             | Initial locale when nothing else is supplied. |
| `storageKey`          | `input<string>()`                   | no       | `""`                             | If non-empty, persist the selection to `localStorage` under this key. |
| `detectFromNavigator` | `input<boolean>()`                  | no       | `false`                          | Resolve `navigator.languages` on first visit. |
| `name`                | `input<string>()`                   | no       | `"locale"`                       | `name` attribute of the `<select>`. |
| `target`              | `input<HTMLElement \| null>()`      | no       | `null` (→ `document.documentElement`) | Element that receives `lang` and `dir`. |
| `applyDir`            | `input<boolean>()`                  | no       | `true`                           | If false, the select only writes `lang`. |
| `localeLabels`        | `input<Record<string, string>>()`   | no       | `{}`                             | Optional pretty labels per locale code. |
| `className`           | `input<string>()`                   | no       | `""`                             | Extra CSS class on the `<select>` root. |
| `localeChange`        | `output<string>()`                  | no       | —                                | Emits after the select applies a new locale (consumer-form code). |

### 4.2 DOM contract

- Root element: `<select class="locale-select {className}"
  [attr.aria-label]="label" [name]="name">`.
- Default children: one `<option class="locale-select-option"
  [value]="locale" [attr.lang]="tagFor(locale)">{{ labelFor(locale)
  }}</option>` per locale code.
- Each option carries `lang="{tagFor(locale)}"` so assistive
  technology pronounces option text in the appropriate language.
- `lang="{tagFor(locale)}"` is set on the `target` element on every
  apply.
- If `applyDir` is true, `dir="rtl"` or `dir="ltr"` is set on the
  `target` element on every apply.

### 4.3 Re-exports

`index.ts` exports:

- `LocaleSelect` (the component class)
- `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage` (pure helpers)
- `defaultLocaleLabels`, `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`
  (constants from `locales.ts`)

## 5. Behaviour

### 5.1 BCP 47 tag normalisation

`bcp47LocaleTag(locale)` replaces every `_` with `-`. No case
normalisation is applied.

### 5.2 Initial value resolution

On first effect run in the browser, the initial locale is the first
non-empty value of:

1. `value()` (if a consumer supplied a non-empty string).
2. `localStorage.getItem(storageKey)` (only if `storageKey` is set
   and the read does not throw).
3. `matchNavigatorLanguage(...)` (only if `detectFromNavigator` is
   true).
4. `defaultValue`.
5. `"en"` if present in `locales`, else `locales[0]`.
6. `""` (no apply happens).

### 5.3 Navigator-language matching

`matchNavigatorLanguage(navLangs, locales)` inspects each entry in
order:

1. Exact match (case-insensitive, treating `-` and `_` as
   equivalent).
2. Language-only match: if `nav` is `xx-YY`, try the first `locales`
   entry whose language matches `xx`.

If nothing matches, returns `""`.

### 5.4 Default labels

When `localeLabels[code]` is missing, fall back to:

1. `defaultLocaleLabels[code]` from `locales.ts`.
2. `Intl.DisplayNames` for the navigator's locale, if available.
3. The raw `code`.

### 5.5 Applying a locale

Applying a locale `code` performs, in order:

1. Resolve the target element. If `target()` is null/undefined, use
   `document.documentElement`.
2. Set `target.lang = bcp47LocaleTag(code)`.
3. If `applyDir` is true, set
   `target.dir = isRtlLocale(code) ? "rtl" : "ltr"`.
4. If `storageKey` is set, write `code` to `localStorage` inside a
   try/catch.
5. Emit `localeChange.emit(code)`. The argument is the
   consumer-form code (not the BCP 47-normalised tag).

### 5.6 RTL detection

`isRtlLocale(locale)` returns `true` when:

1. The locale string contains one of the RTL script subtags
   (case-insensitive) as a `-` or `_` separated component: `Arab`,
   `Hebr`, `Mong`, `Nkoo`, `Syrc`, `Thaa`, `Adlm`. **OR**
2. The leading language subtag is one of: `ar`, `arc`, `ckb`, `dv`,
   `fa`, `he`, `iw`, `ji`, `ks`, `ku`, `mzn`, `ps`, `sd`, `ug`,
   `ur`, `yi`.

### 5.7 Reactivity

A single `effect()` re-applies the locale whenever `value()` changes.

### 5.8 SSR

`effect()` runs but the `document`-guard prevents DOM mutation.

## 6. Accessibility

### 6.1 Roles and properties

- `<select>` has an implicit `combobox` role and is the announced
  control.
- `[attr.aria-label]="label"` supplies the accessible name.
- The native `<select>` and its `<option>` children get the
  `combobox` / `option` roles, current-value state, and keyboard
  semantics for free.
- Each option carries `lang` so assistive tech can switch
  pronunciation (WCAG 3.1.2, Language of Parts).
- The document root receives `lang` and (by default) `dir` (WCAG
  3.1.1 / 1.4.10).

### 6.2 Keyboard contract

Provided by the platform (native `<select>`):

| Key                       | Action                                        |
| ------------------------- | --------------------------------------------- |
| `Tab` / `Shift+Tab`       | Move focus to / from the select.              |
| `Arrow Down` / `Arrow Up` | Select the next / previous option.            |
| `Home` / `End`            | Select the first / last option.               |
| Typeahead                 | Type characters to jump to a matching option. |
| `Enter` / `Space`         | Open the option list (platform-dependent).    |
| `Escape`                  | Close the option list.                        |

### 6.3 Internationalisation

- `label`, `localeLabels`, and the consumer-supplied `locales` array
  are passed through verbatim.
- No user-facing strings are hardcoded inside the component.

### 6.4 BCP 47 reference

Language-tag syntax is defined by IETF BCP 47 (RFC 5646). The IANA
Language Subtag Registry is the single authoritative source.

## 7. Testing acceptance criteria

`locale-select.component.spec.ts` must assert every numbered item
below. Tests run under vitest + jsdom + `@angular/core/testing`
`TestBed`.

### 7.1 Markup contract (mirrors §4.2)

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
10. `isRtlLocale("ar")`, `isRtlLocale("he_IL")`, and
    `isRtlLocale("uz_Arab_AF")` are all `true`.
11. `isRtlLocale("en")` and `isRtlLocale("fr_CA")` are both `false`.
12. `localeName("en_US")` returns `"English (United States)"`.

### 7.3 Locale application (mirrors §5.5)

13. After mount, `target.lang` is the BCP 47 form of the resolved
    initial locale.
14. After mount, `target.dir` is `"rtl"` for RTL initial locales and
    `"ltr"` otherwise (when `applyDir` is unspecified / true).
15. When `applyDir` is `false`, the `dir` attribute is not written.
16. Selecting a different option updates `target.lang`, updates
    `target.dir`, and emits `localeChange` with the new locale code
    in its consumer form.
17. A custom `target` element receives `lang` and `dir` instead of
    `document.documentElement`.

### 7.4 Initial-value resolution (mirrors §5.2, §5.3)

18. When `storageKey` is set, the active code is written to
    `localStorage` and read back on a fresh mount.
19. When `value` is supplied as a non-empty input, the
    initial-value resolution skips storage, navigator detection,
    and defaults.
20. When `detectFromNavigator` is true and `navigator.languages`
    contains a supported locale, the select resolves to that
    locale.
21. When `detectFromNavigator` is true and only a language-only
    match is available, the select resolves to the base-language
    locale.

### 7.5 Class hook

22. The consumer's `className` is appended to the root `<select>`
    class list.
23. An `<option>` rendered through the default template receives
    `lang="{tagFor(locale)}"` (validates that `tagFor` works for
    underscored codes).

## 8. Out-of-scope (future, not implemented here)

- A complementary `LocaleView` helper.
- A `LocaleSelect` sibling defaulting to radio-group markup. For
  now a sibling widget bound to the same `[(value)]` signal covers
  that case.
- `Intl.LocaleMatcher` / RFC 4647 integration.
- `Accept-Language` server helper for SSR negotiation.

## 9. Tracking

- Package directory: `lily-design-system-angular-helpers/lily-design-system-angular-locale-select/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
  (or contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
- Canonical locale list: [locales.tsv](../locales.tsv) — 436 codes
  with English names.
