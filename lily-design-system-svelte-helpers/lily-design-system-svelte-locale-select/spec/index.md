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

Give a Svelte 5 application a drop-in, headless locale select that:

1. Renders an accessible icon button that opens a WAI-ARIA APG listbox
   of available locales.
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
- **Alternative option renderings**. The listbox markup is
  component-owned. The `children` snippet replaces the button's glyph,
  not the options — consumers who need radios, an always-visible list,
  or an APG Combobox with a text input should read `value` and drive
  their own controls, or use a dedicated combobox primitive.
- **A combobox with a text input.** The control follows the APG
  Listbox pattern; there is no editable field and no autocomplete.

## 3. Architectural decisions

- **Icon button + listbox, not a native `<select>`.** The closed
  control is a single glyph-width button, so it costs the same page
  space whether the app offers three locales or all 436 in
  `locales.tsv`. It is also symmetric with `theme-select`: the two sit
  next to each other in a page header and should read as one set. The
  cost is a hand-rolled listbox; §6 states that tradeoff honestly.
- **The globe glyph forces text presentation**. The constant is
  `"\u{1F310}︎"` — U+1F310 GLOBE WITH MERIDIANS followed by
  U+FE0E VARIATION SELECTOR-15. Without VS15 browsers pick the
  colour-emoji font and the globe renders blue, which does not match
  `theme-select`'s monochrome `◑`. Verified in Chromium.
- **The `lang` attribute is the source of truth**. Every Lily helper
  and every i18n library agrees that `document.documentElement.lang`
  is the authoritative signal for current document language (WCAG
  3.1.1, HTML Living Standard, all major screen readers). The select
  writes there.
- **The `dir` attribute is the secondary switch**. Setting `dir` on
  the document root is what causes browsers to mirror layout, scrollbar
  position, and bidi text. The select derives it from the locale.
- **BCP 47 hyphen form on the wire**. Locale codes are stored in the
  consumer's array using whichever form they prefer (`en_US`, `en-US`,
  or `en`). When the select writes to the DOM, it normalises to the
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
| `label`             | `string`                              | yes      | —                        | Accessible name for **both** the button and the listbox. |
| `locales`           | `string[]`                            | yes      | —                        | Available locale codes (e.g. `["en", "en_US", "fr", "ar"]`). |
| `value`             | `string` (bindable)                   | no       | `""`                     | Currently selected locale code. |
| `defaultValue`      | `string`                              | no       | `"en"` if present in `locales`, else first item | Initial locale when nothing else is supplied. |
| `storageKey`        | `string`                              | no       | `undefined`              | If set, persist the selection to `localStorage` under this key. |
| `detectFromNavigator` | `boolean`                           | no       | `false`                  | If true and no value/storage entry exists, resolve `navigator.languages` to a supported locale. |
| `name`              | `string`                              | no       | `"locale"`               | `name` of the hidden input that carries the value in a form. |
| `target`            | `HTMLElement \| null`                 | no       | `document.documentElement` | Element that receives `lang` and `dir`. |
| `applyDir`          | `boolean`                             | no       | `true`                   | If false, the select only writes `lang` and never touches `dir`. |
| `localeLabels`      | `Record<string, string>`              | no       | `{}`                     | Optional pretty labels per locale code. |
| `children`          | `Snippet<[ChildArgs]>`                | no       | the globe glyph          | **Replaces the glyph inside the button.** It does not render options. |
| `onChange`          | `(locale: string) => void`            | no       | `undefined`              | Fires after the select applies a new locale. |
| `class`             | `string`                              | no       | `""`                     | Extra CSS class on the root `<div>`. |
| `...restProps`      | any HTML attributes                   | no       | —                        | Spread onto the root `<div>`. |

There is **no `placeholder` prop.** It existed in 0.3.0 to name the
pinned option of a native `<select>`; there is no `<select>` and no
pinned option any more.

### 4.2 `ChildArgs`

```ts
type ChildArgs = {
  /** Currently selected locale code (consumer form, not BCP 47-normalised). */
  value: string;
  /** Is the listbox open? */
  open: boolean;
  /** Resolve a locale code to its display label. */
  labelFor: (locale: string) => string;
};
```

The pre-listbox shape — `{ locales, value, setLocale, name, labelFor,
tagFor, isRtl }` — is gone, along with the option-rendering role it
served. `tagFor` and `isRtl` remain available as the exported pure
helpers `bcp47LocaleTag` and `isRtlLocale`.

### 4.3 DOM contract

```html
<div class="locale-select {class}" ...restProps>
  <input type="hidden" name="{name}" value="{value}" />
  <button type="button" class="locale-select-button"
          aria-label="{label}" aria-haspopup="listbox"
          aria-expanded="false" aria-controls="{listId}">
    <span class="locale-select-icon" aria-hidden="true">🌐︎</span>
  </button>
  <ul class="locale-select-list" id="{listId}" role="listbox"
      aria-label="{label}" tabindex="-1" hidden
      aria-activedescendant="{optionId of the active option, only while open}">
    <li class="locale-select-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active lang="en-US">English (United States)</li>
  </ul>
</div>
```

- **Root** is a `<div>` carrying `locale-select` plus the consumer's
  `class`; rest-props spread onto it.
- **Hidden input** preserves form participation, carrying the
  consumer-form code (not the BCP 47 tag) under the `name` prop.
- **Button glyph** is `GLOBE_WITH_MERIDIANS` — U+1F310 GLOBE WITH
  MERIDIANS (`&#127760;`) followed by U+FE0E VARIATION SELECTOR-15,
  which forces monochrome text presentation so the glyph matches
  `theme-select`'s `◑` instead of rendering as a blue colour emoji. It
  is wrapped in `aria-hidden="true"`: the accessible name comes from
  the button's `aria-label`, never from the glyph.
- **`children` replaces the glyph**, not the options. It receives
  `ChildArgs` and renders inside the `<button>`. When it is supplied,
  no `.locale-select-icon` span is emitted.
- **Listbox** is `hidden` while closed. `aria-activedescendant` is
  present only while open with an active option; focus sits on the
  `<ul>` itself (`tabindex="-1"`), per the APG listbox pattern.
- **Options** carry `aria-selected` reflecting the active locale,
  `data-active` (a bare attribute) on the keyboard-active option, and
  `lang="{tagFor(locale)}"` so assistive technology pronounces the
  option text in the appropriate language even when the document
  language differs (WCAG 3.1.2). Neither the button nor the list
  carries a `lang`.
- **Option ids** are unique per instance, generated by an incrementing
  module counter (`nextLocaleSelectId`) — SSR-safe, never
  `Math.random()` / `Date.now()`.
- `lang="{bcp47LocaleTag(code)}"` is set on the `target` element on
  every apply.
- If `applyDir` is true, `dir="rtl"` or `dir="ltr"` is set on the
  `target` element on every apply.
- The package ships zero CSS. **The listbox needs positioning CSS from
  the consumer** — without it the `<ul>` renders in normal flow rather
  than as an overlay. See `docs/styling.md`.

### 4.4 Re-exports

`index.ts` exports:

- `default` (the component)
- `LocaleSelect` (named alias of the default export)
- `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage`, `defaultLocaleLabels` (pure helpers)
- `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS` (constants)
- `type Props`, `type ChildArgs`

`LocaleSelect.svelte`'s module script additionally exports
`GLOBE_WITH_MERIDIANS` (the default glyph constant) and
`nextLocaleSelectId()`; import those from the component file directly.

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
6. `""` (no apply happens — the select waits for user interaction).

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

| Element  | Role / property | Source |
| -------- | --------------- | ------ |
| `<button>` | implicit `role="button"` | Browser |
| `<button>` | `aria-label="{label}"` | Consumer prop |
| `<button>` | `aria-haspopup="listbox"` | Component |
| `<button>` | `aria-expanded="true\|false"` | Component |
| `<button>` | `aria-controls="{listId}"` | Component |
| `<span>` glyph | `aria-hidden="true"` | Component |
| `<ul>`   | `role="listbox"` | Component |
| `<ul>`   | `aria-label="{label}"` | Consumer prop |
| `<ul>`   | `aria-activedescendant="{optionId}"` while open | Component |
| `<li>`   | `role="option"` | Component |
| `<li>`   | `aria-selected="true\|false"` | Component |
| `<li>`   | `lang="{tagFor(locale)}"` | Component |

The control follows the **WAI-ARIA APG Listbox** pattern (button +
popup listbox), not the Combobox pattern: there is no text input and
no autocomplete.

- Each option carries `lang="{tagFor(locale)}"` so assistive technology
  can switch pronunciation for the option text. WCAG 3.1.2 (Language
  of Parts).
- The document root receives `lang` and (by default) `dir` — WCAG
  3.1.1 (Language of Page) and 1.4.10 (Reflow / bidi layout).

### 6.2 Keyboard contract

Implemented by the component — none of this comes from the platform.

On the **button**:

| Key | Action |
| --- | ------ |
| `Tab` / `Shift+Tab` | Move focus to / from the button (one tab stop). |
| `Enter` | Open the listbox with the selected option active (or index 0). |
| `Space` | Same as `Enter`. |
| `Arrow Down` | Same as `Enter`. |
| `Arrow Up` | Open the listbox with the **last** option active. |

Opening moves focus to the `<ul>`; the active option is conveyed by
`aria-activedescendant`, not by moving DOM focus onto the `<li>`.

On the **listbox**:

| Key | Action |
| --- | ------ |
| `Arrow Down` | Move the active option down one. **Clamps** at the last option — it does not wrap. |
| `Arrow Up` | Move the active option up one. Clamps at the first. |
| `Home` | Make the first option active. |
| `End` | Make the last option active. |
| `Enter` | Select the active option, apply it, close, and return focus to the button. |
| `Space` | Same as `Enter`. |
| `Escape` | Close and return focus to the button **without** changing the value. |
| `Tab` | Close without stealing focus back, so focus moves on normally. |
| Printable character | Typeahead over the option **labels**; the buffer resets after 500 ms of inactivity. Search runs forward from the active option and wraps once. |

Typeahead matches the *label*, so with the built-in English names
typing `f` reaches "French"; with `localeLabels={{ fr: "Français" }}`
it still reaches it, but a user typing the English name would not.
Choose labels with the typeahead in mind for long locale lists.

Pointer behaviour: clicking an option selects and applies it; clicking
outside the root closes the listbox; focus leaving the root closes it.

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
- WAI-ARIA APG — Listbox pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/>
- WCAG 2.2 SC 3.1.1 (Language of Page) and 3.1.2 (Language of Parts):
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-page>
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts>

### 6.5 Accessibility tradeoffs

Three costs come with the icon-button-plus-listbox shape. They are
stated in full, with mitigations, in
[`docs/accessibility.md`](../docs/accessibility.md):

1. The control is icon-only, so its accessible name rests entirely on
   `aria-label`. This bites harder here than for `theme-select`: a user
   who has landed on a page in a language they cannot read needs to
   find the language control, and `aria-label` is by definition written
   in *some* language.
2. A hand-rolled listbox has weaker assistive-technology support than a
   native `<select>`.
3. The glyph is a font-dependent character that may substitute or fail
   to render.

## 7. Testing acceptance criteria

`LocaleSelect.test.ts` asserts every clause below, and each `test(...)`
title is prefixed with its clause number so a reviewer can spot a
missing one. Tests run under vitest + jsdom +
`@testing-library/svelte`.

Four untagged pure-helper tests also run: case-insensitive RTL
detection on the script subtag, and the three `matchNavigatorLanguage`
cases (exact match wins, language-only fallback, empty when no match).

### Markup contract (mirrors §4.3)

| Clause | Test asserts |
| ------ | ------------ |
| §7.1 | Renders a `<button type="button">` with `aria-haspopup="listbox"`, `aria-expanded="false"`, and an `aria-controls` pointing at an element whose `role` is `listbox`. |
| §7.1 | The button renders the globe glyph inside `.locale-select-icon` as the two-codepoint sequence `\u{1F310}︎`, carrying `aria-hidden="true"`. |
| §7.2 | `aria-label` names **both** the button and the listbox. |
| §7.3 | One `.locale-select-option` per entry in `locales`; the hidden input carries the supplied `name` and the resolved value. |
| §7.4 | The listbox is `hidden` until the button is activated; activating it clears `hidden` and sets `aria-expanded="true"`. |
| §7.4 | Exactly one option has `aria-selected="true"`, and it is the active locale. |
| §7.5 | Each option carries `lang` in BCP 47 hyphen form (`en`, `en-US`, `zh-Hant-TW`). |
| §7.6 | Visible option text uses the `localeLabels` override when supplied. |
| §7.6 | It falls back to `defaultLocaleLabels` when `localeLabels` has no entry. |

### Pure helpers (mirrors §5.1, §5.6)

| Clause | Test asserts |
| ------ | ------------ |
| §7.7 | `bcp47LocaleTag("en_US")` === `"en-US"`. |
| §7.8 | `bcp47LocaleTag("zh_Hant_TW")` === `"zh-Hant-TW"`. |
| §7.9 | `bcp47LocaleTag("en")` === `"en"`. |
| §7.10 | `isRtlLocale` is `true` for `"ar"`, `"he_IL"`, and `"uz_Arab_AF"`. |
| §7.11 | `isRtlLocale` is `false` for `"en"` and `"fr_CA"`. |
| §7.12 | `localeName("en_US")` returns `"English (United States)"` from the built-in table. |

### Locale application (mirrors §5.5)

| Clause | Test asserts |
| ------ | ------------ |
| §7.13 | `target.lang` is the BCP 47 form of the resolved initial locale. |
| §7.14 | `target.dir` is `"rtl"` for an RTL initial locale. |
| §7.14 | `target.dir` is `"ltr"` for an LTR initial locale. |
| §7.15 | With `applyDir={false}`, `dir` is never written; `lang` still is. |
| §7.16 | Selecting a different option updates `lang` and `dir` and fires `onChange`. |
| §7.16 | `onChange` receives the consumer-form code, not the BCP 47 tag. |
| §7.17 | A custom `target` receives `lang` and `dir`, and the document root is left untouched. |

### Initial-value resolution (mirrors §5.2, §5.3)

| Clause | Test asserts |
| ------ | ------------ |
| §7.18 | With `storageKey` set, the code is written to `localStorage` and read back on a fresh mount. |
| §7.19 | A supplied non-empty `value` prop wins over storage and defaults. |
| §7.20 | `detectFromNavigator` resolves an exact `navigator.languages` match. |
| §7.21 | `detectFromNavigator` falls back to a language-only match (`"fr-CA"` against `["en", "fr"]` → `"fr"`). |

### Spread and custom children (mirrors §4.1, §4.2)

| Clause | Test asserts |
| ------ | ------------ |
| §7.22 | Extra attributes (e.g. `data-testid`) spread onto the root. |
| §7.23 | A `children` snippet **replaces the button glyph**: the custom node renders inside `.locale-select-button`, no `.locale-select-icon` is emitted, and the snippet receives `ChildArgs` (`value`, `open`, `labelFor`). |

### Keyboard contract (mirrors §6.2)

| Clause | Test asserts |
| ------ | ------------ |
| §7.24 | `ArrowDown`, `Enter` and `Space` on the button all open the listbox. |
| §7.24 | `ArrowUp` opens with the **last** option active. |
| §7.25 | Opening puts `aria-activedescendant` on the selected locale. |
| §7.25 | `ArrowDown` / `ArrowUp` move `aria-activedescendant` and clamp at the ends rather than wrapping. |
| §7.25 | `Home` and `End` jump to the first and last option. |
| §7.26 | `Enter` selects the active option, applies it, closes the listbox, and clears `aria-expanded`. |
| §7.26 | `Escape` closes without changing the locale. |
| §7.27 | A printable character runs typeahead over the labels and moves `aria-activedescendant`. |
| §7.27 | Clicking an option selects and applies it, including `dir="rtl"` for an RTL locale. |

## 8. Out-of-scope (future, not implemented here)

- A complementary `LocaleView` helper that displays the active
  locale's pretty name. Would parallel the upstream `ThemeView`.
- A radio-group or always-visible-list rendering. The `children`
  snippet no longer covers this case — it replaces the button glyph.
  Consumers wanting that shape read `value` and drive their own
  controls.
- An APG Combobox with a text input and autocomplete. This is a
  Listbox, not a Combobox; for 400+ locales a real combobox is the
  better pattern and belongs in a dedicated primitive.
- An `Intl.LocaleMatcher` / RFC 4647 lookup integration. Would replace
  the simple two-step navigator match in §5.3.
- A built-in `Accept-Language`-header server helper for SSR locale
  negotiation. Would live in a sibling SvelteKit-only helper.
- Shipped positioning CSS for the listbox. The package stays headless;
  the consumer positions the popup.
- A `prefersReducedMotion` integration. Out of scope for a locale
  select.

## 9. Tracking

- Package directory:
  `lily-design-system-svelte-helpers/lily-design-system-svelte-locale-select/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or
  contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
- Canonical locale list: [locales.tsv](../locales.tsv) — 436 codes with
  English names
