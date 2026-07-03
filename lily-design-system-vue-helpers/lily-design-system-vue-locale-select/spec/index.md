# LocaleSelect — Specification

Single source of truth for the `lily-design-system-vue-locale-select`
Vue 3 helper. This file drives implementation, testing, and
documentation in the spec-driven-development style: anything not in
this spec is out of scope; anything in this spec must be exercised by
a test.

Sibling files in this directory:

- `LocaleSelect.vue` — the implementation
- `LocaleSelect.test.ts` — vitest spec exercising every clause in §4–§7
- `locales.ts` — built-in locale-code → English-name table and RTL
  sets, derived from `locales.tsv` (copied verbatim from the Svelte
  canonical helper — framework-agnostic data)
- `locales.tsv` — canonical 436-row list of locale codes and English
  names (copied verbatim from the Svelte canonical helper)
- `index.ts` — re-export barrel
- `index.md` — user-facing readme

The canonical reference for this helper is the Svelte sibling at
`../../lily-design-system-svelte-helpers/lily-design-system-svelte-locale-select/`.
This Vue port mirrors the contract and behaviour, swapping in Vue 3
idioms (Composition API, `defineProps`, `defineModel`, `ref`,
`watch`, `onMounted`, slots).

---

## 1. Goal

Give a Vue 3 application a drop-in, headless locale select that:

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
  signals the locale to the consumer's i18n library via the `lang`
  attribute, the `change` event, and the `v-model:value` binding.
  Default rendering is a native `<select>` for symmetry with
  `ThemeSelect` and because it scales to long locale lists and pops
  the OS-native picker on mobile. Consumers who want radios, buttons,
  or a combobox use the default slot.
- **Locale negotiation**. The component does not implement
  `Intl.LocaleMatcher` / RFC 4647 best-fit / lookup.
- **Auto-discovery**. The consumer always supplies the list of
  available locale codes.
- **Bundling translation files**. No JSON / YAML / PO assets ship
  with this helper.
- **Nuxt-only features**. The component only depends on Vue 3 + DOM
  APIs and runs in any Vue 3 host (Nuxt, plain Vite + Vue, Astro,
  Storybook).
- **Custom default rendering**. The default is a native `<select>`.
  Consumers who want radios, buttons, or a combobox use the default
  slot.

## 3. Architectural decisions

- **The `lang` attribute is the source of truth.** Every Lily helper
  and every i18n library agrees that `document.documentElement.lang`
  is the authoritative signal for current document language.
- **The `dir` attribute is the secondary switch.** Setting `dir` on
  the document root is what causes browsers to mirror layout, scrollbar
  position, and bidi text. The select derives it from the locale.
- **BCP 47 hyphen form on the wire.** Locale codes are stored in the
  consumer's array using whichever form they prefer. When the select
  writes to the DOM, it normalises to the BCP 47 hyphen form. The
  `v-model:value` mirrors back the original consumer form.
- **TypeScript everywhere.** Public surface is fully typed via a
  `Props` type exported from `LocaleSelect.vue`.
- **SSR-safe.** All DOM mutations happen inside `onMounted` /
  `watch`. No DOM access during server rendering.
- **No dependencies beyond `vue`.** No `Intl.DisplayNames` polyfill,
  no localStorage wrappers.
- **Two-way bindable `value` via `v-model:value`.** Fully controlled
  when `value` is supplied non-empty, uncontrolled otherwise.
- **Pure helper functions are exported** so consumers can reuse them
  outside the component: `bcp47LocaleTag`, `isRtlLocale`,
  `localeName`, `defaultLocaleLabels`, `matchNavigatorLanguage`.

## 4. Public API

### 4.1 Props

| Prop                | Type                                  | Required | Default                  | Purpose |
| ------------------- | ------------------------------------- | -------- | ------------------------ | ------- |
| `label`             | `string`                              | yes      | —                        | Accessible name for the `<select>`. |
| `locales`           | `string[]`                            | yes      | —                        | Available locale codes. |
| `value`             | `string` (`v-model:value`)            | no       | `""`                     | Currently selected locale code. |
| `defaultValue`      | `string`                              | no       | `"en"` if present in `locales`, else first | Initial locale. |
| `storageKey`        | `string`                              | no       | `undefined`              | If set, persist to `localStorage` under this key. |
| `detectFromNavigator` | `boolean`                           | no       | `false`                  | Resolve `navigator.language` on first visit. |
| `name`              | `string`                              | no       | `"locale"`               | `name` attribute of the `<select>`. |
| `target`            | `HTMLElement \| null`                 | no       | `document.documentElement` | Element that receives `lang` and `dir`. |
| `applyDir`          | `boolean`                             | no       | `true`                   | If false, the select only writes `lang` and never touches `dir`. |
| `localeLabels`      | `Record<string, string>`              | no       | `{}`                     | Optional pretty labels per locale code. |
| `class`             | `string`                              | no       | `""`                     | Extra CSS class on the `<select>` root. |

### 4.2 Events

| Event           | Payload          | Purpose                                                |
| --------------- | ---------------- | ------------------------------------------------------ |
| `update:value`  | `string`         | Emitted on selection (drives `v-model:value`).         |
| `change`        | `string`         | Emitted after the select applies a new locale (consumer-form code, not BCP 47). |

### 4.3 Slots

Default slot — when provided, replaces the built-in `<select>` markup.
The slot receives the following scoped props:

```ts
type SlotArgs = {
  /** The locale codes to render as options. */
  locales: string[];
  /** Currently selected locale code (consumer form). */
  value: string;
  /** Apply a locale imperatively (also updates `v-model:value`). */
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

### 4.4 DOM contract

- Root element: `<select class="locale-select {class}"
  aria-label="{label}" name="{name}">`.
- Default children: one `<option class="locale-select-option"
  value="{locale}" lang="{tagFor(locale)}">{labelFor(locale)}</option>`
  per locale code.
- Each option carries `lang="{tagFor(locale)}"` so assistive
  technology pronounces the option text in the appropriate language
  even when the document language differs.
- `lang="{tagFor(slug)}"` is set on the `target` element on every
  apply.
- If `applyDir` is true, `dir="rtl"` or `dir="ltr"` is set on the
  `target` element on every apply.

### 4.5 Re-exports

`index.ts` exports:

- `default` (the component)
- `LocaleSelect` (named alias)
- `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage`, `defaultLocaleLabels` (pure helpers)
- `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS` (constants)
- `type Props`, `type SlotArgs`

## 5. Behaviour

### 5.1 BCP 47 tag normalisation

`bcp47LocaleTag(locale)` replaces every `_` with `-`. No case
normalisation is applied.

### 5.2 Initial value resolution

On `onMounted` in the browser, the initial locale is the first
non-empty value of:

1. `value` (if a consumer supplied a non-empty string).
2. `localStorage.getItem(storageKey)` (only if `storageKey` is set).
3. `matchNavigatorLanguage(locales)` (only if `detectFromNavigator`).
4. `defaultValue`.
5. `"en"` if present in `locales`, else `locales[0]`.
6. `""` (no apply happens — select waits for user interaction).

Resolution emits `update:value` so consumers binding via
`v-model:value` see the resolved value.

### 5.3 Navigator-language matching

When `detectFromNavigator` is true, the helper inspects
`navigator.languages` (falling back to `[navigator.language]`) and
matches each entry against `locales` in order, returning the first
hit. Matching is case-insensitive on the language and region parts
and treats `-` and `_` as equivalent.

For each navigator entry `nav`:

1. Exact match (`locales.includes(nav)` or its underscore form).
2. Language-only match: if `nav` is `xx-YY`, try `xx`. The first
   `locales` entry whose language matches wins.

### 5.4 Default labels

When `localeLabels[code]` is missing, the helper falls back to:

1. `defaultLocaleLabels[code]` from the built-in `locales.ts` table.
2. `Intl.DisplayNames` for the consumer's BCP 47 environment locale,
   if available. (Used opportunistically — never throws.)
3. The raw `code`.

### 5.5 Applying a locale

Applying a locale `code` performs, in order:

1. Resolve the target element. If `target` is `null` or `undefined`,
   use `document.documentElement`.
2. Set `target.lang = bcp47LocaleTag(code)`.
3. If `applyDir` is true, set `target.dir = isRtlLocale(code) ?
   "rtl" : "ltr"`.
4. If `storageKey` is set, write `code` to `localStorage` inside a
   try/catch.
5. Emit `change` with `code` (consumer form, not BCP 47).

### 5.6 RTL detection

`isRtlLocale(locale)` returns `true` when:

1. The locale string contains one of the RTL script subtags as a
   case-insensitive component separated by `-` or `_`:
   `Arab`, `Hebr`, `Mong`, `Nkoo`, `Syrc`, `Thaa`, `Adlm`. **OR**
2. The leading language subtag is one of:
   `ar`, `arc`, `ckb`, `dv`, `fa`, `he`, `iw`, `ji`, `ks`, `ku`,
   `mzn`, `ps`, `sd`, `ug`, `ur`, `yi`.

### 5.7 Reactivity

A single `watch` on `value` re-applies the locale whenever it
changes. Other prop changes (`target`, `applyDir`, `localeLabels`)
take effect on the next locale change.

### 5.8 SSR

During server rendering, no `onMounted` / `watch` callback fires and
no DOM is touched.

## 6. Accessibility

### 6.1 Roles and properties

- `<select>` has an implicit `combobox` role and is the announced
  control.
- `aria-label={label}` supplies the accessible name.
- The native `<select>` and its `<option>` children get the
  `combobox` / `option` roles, current-value state, and keyboard
  semantics for free.
- Each option carries `lang="{tagFor(locale)}"` so assistive
  technology can switch pronunciation for the option text. WCAG 3.1.2
  (Language of Parts).
- The document root receives `lang` and (by default) `dir` — WCAG
  3.1.1 (Language of Page) and 1.4.10 (Reflow).

### 6.2 Keyboard contract

Provided by the platform (native `<select>`):

| Key                       | Action                                      |
| ------------------------- | ------------------------------------------- |
| `Tab` / `Shift+Tab`       | Move focus to / from the select.            |
| `Arrow Down` / `Arrow Up` | Select the next / previous option.          |
| `Home` / `End`            | Select the first / last option.             |
| Typeahead                 | Type characters to jump to a matching option. |
| `Enter` / `Space`         | Open the option list (platform-dependent).  |
| `Escape`                  | Close the option list.                       |

### 6.3 Internationalisation

- `label`, `localeLabels`, and the consumer-supplied `locales` array
  are all passed through verbatim.
- No user-facing strings are hardcoded inside the component.
- Each rendered option name appears in its own `lang` context.
- Writing direction inherits from the resolved locale; consumers can
  override by passing `:applyDir="false"`.

## 7. Testing acceptance criteria

`LocaleSelect.test.ts` must assert every numbered item below. Tests
run under vitest + jsdom + `@vue/test-utils`.

### 7.1 Markup contract (mirrors §4.4)

1. Renders a `<select>` (implicit `combobox` role).
2. `aria-label` is the supplied `label`.
3. Renders one `<option>` per entry in `locales`; the `<select>`
   carries the supplied `name` attribute.
4. Each option's `value` attribute is the locale code.
5. Each option carries `lang="{tagFor(locale)}"` (BCP 47 hyphen
   form).
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

13. After mount, `target.lang` (defaulting to `<html>`) is the BCP 47
    form of the resolved initial locale.
14. After mount, `target.dir` is `"rtl"` for an RTL initial locale
    and `"ltr"` otherwise (when `applyDir` is unspecified / true).
15. When `applyDir` is `false`, the `dir` attribute is not written.
16. Selecting a different option updates `target.lang`, updates
    `target.dir`, and emits `change` with the new locale code in its
    consumer form (not the BCP 47-normalised tag).
17. A custom `target` element receives `lang` and `dir` instead of
    `document.documentElement`.

### 7.4 Initial-value resolution (mirrors §5.2, §5.3)

18. When `storageKey` is set, the active code is written to
    `localStorage` and read back on a fresh mount.
19. When `value` is supplied as a non-empty prop, the initial-value
    resolution skips storage, navigator detection, and defaults.
20. When `detectFromNavigator` is true and `navigator.languages`
    contains a supported locale, the select resolves to that locale.
21. When `detectFromNavigator` is true and only a language-only match
    is available, the select resolves to the language-only locale.

### 7.5 Spread + custom slot (mirrors §4.1, §4.3)

22. Extra attributes spread through onto the `<select>` (e.g.
    `data-testid`).
23. A custom default slot receives `SlotArgs` with `locales`, `name`,
    `tagFor`, and `isRtl` exposed.

## 8. Out-of-scope (future, not implemented here)

- A complementary `LocaleView` helper that displays the active
  locale's pretty name.
- A `LocaleSelect` sibling that defaults to radio-group markup. For
  now the default slot covers that case.
- An `Intl.LocaleMatcher` / RFC 4647 lookup integration.
- A built-in `Accept-Language`-header server helper for SSR locale
  negotiation.

## 9. Tracking

- Package directory:
  `lily-design-system-vue-helpers/lily-design-system-vue-locale-select/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
  (or contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
- Canonical locale list: [locales.tsv](../locales.tsv) — 436 codes
  with English names
