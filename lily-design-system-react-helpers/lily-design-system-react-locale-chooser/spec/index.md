# LocaleChooser — Specification

Single source of truth for the `lily-design-system-react-locale-chooser`
React helper. This file drives implementation, testing, and
documentation in the spec-driven-development style: anything not in
this spec is out of scope; anything in this spec must be exercised by a
test.

Sibling files in this directory:

- `LocaleChooser.tsx` — the implementation
- `LocaleChooser.test.tsx` — vitest spec exercising every clause in §4–§7
- `locales.ts` — built-in locale-code → English-name table and RTL set,
  derived from `locales.tsv`
- `locales.tsv` — canonical 436-row list of locale codes and English names
- `index.ts` — re-export barrel
- `index.md` — user-facing readme

The headless `lily-design-system-react-headless` library does not (yet)
include a canonical `LocaleChooser`; this helper is the opinionated,
reusable counterpart that owns the locale-application lifecycle (the
`lang` and `dir` attributes on the document root) and the persistence
choice.

---

## 1. Goal

Give a React 19 application a drop-in, headless locale chooser that:

1. Renders an accessible icon button that opens a dropdown listbox of
   the available locales (WAI-ARIA APG Listbox pattern).
2. **Applies the chosen locale** by setting `lang="…"` and `dir="ltr|rtl"`
   on the document root (or on a consumer-supplied target).
3. Auto-detects script direction: RTL for locales using Arabic, Hebrew,
   Thaana, Mongolian (traditional), N'Ko, Syriac, or Adlam scripts.
4. Optionally persists the chosen locale to `localStorage` so the choice
   survives reload.
5. Optionally falls back to `navigator.language` on first visit when no
   value, storage entry, or default is supplied.
6. Ships zero CSS — the consumer styles every visual aspect via the
   `locale-chooser` class hooks and the `lang` / `dir` attributes.
   Positioning the listbox is the consumer's job.
7. Provides BCP 47-compliant tag output. Underscores in locale codes
   (e.g. `en_US`) are converted to hyphens (`en-US`) when written to the
   `lang` attribute, per RFC 5646.

## 2. Non-goals

- **Translation**. This component does not translate strings. It only
  signals the locale to the consumer's i18n library (`react-intl`,
  `i18next`, Paraglide, Inlang, Tolgee, custom `Intl.*` calls) via the
  `lang` attribute, the `onChange` callback, and the controlled `value`.
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
- **Next.js-only features**. The component only depends on React 19 +
  DOM APIs and runs in any React host (Next.js, plain Vite + React,
  Remix, Storybook).
- **A native `<select>` rendering**. The control is a button plus a
  custom listbox, not a `<select>`. That buys an icon-sized closed
  control and full styling control over the option list, at the cost of
  reimplementing the keyboard contract (§6.2) and of weaker
  assistive-technology support than the platform gives a native
  `<select>` — see [docs/accessibility.md](../docs/accessibility.md).
- **An editable combobox**. There is no text input and no free-text
  filtering. Typeahead over option labels (§6.2) is the only search
  affordance. Consumers who need a filtering combobox build one on a
  headless Combobox primitive and reuse this package's exported pure
  helpers.
- **A swappable control**. `children` replaces the glyph inside the
  button only (§4.2). It cannot replace the button, the listbox, or the
  options — the component owns those.

## 3. Architectural decisions

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
  BCP 47 hyphen form (`en-US`). The controlled `value` mirrors back the
  original consumer form, so round-trips are lossless.
- **TypeScript everywhere**. Public surface is fully typed via a `Props`
  type exported from `LocaleChooser.tsx` and re-exported from
  `index.ts`.
- **SSR-safe**. The component compiles cleanly under Next.js / Remix
  SSR. All DOM mutations happen inside `useEffect`, which only runs on
  the client.
- **No dependencies beyond `react`**. No `Intl.DisplayNames`
  polyfill, no localStorage wrappers, no UUID library.
  (`Intl.DisplayNames` is used opportunistically if the runtime
  supports it — see §5.4.)
- **Controlled or uncontrolled `value`**. Consumers can pass
  `value` + `onChange` (controlled) or omit `value` and let the
  component manage internal state (uncontrolled). The component
  resolves from storage, navigator, or `defaultValue` when
  uncontrolled.
- **Pure helper functions are exported** so consumers can reuse them
  outside the component: `bcp47LocaleTag`, `isRtlLocale`,
  `localeName`, `defaultLocaleLabels`.

## 4. Public API

### 4.1 Props

| Prop                  | Type                                    | Required | Default                                | Purpose |
| --------------------- | --------------------------------------- | -------- | -------------------------------------- | ------- |
| `label`               | `string`                                | yes      | —                                      | Accessible name (`aria-label`) for both the button and the listbox. |
| `locales`             | `string[]`                              | yes      | —                                      | Available locale codes (e.g. `["en", "en_US", "fr", "ar"]`). |
| `value`               | `string`                                | no       | `undefined` (uncontrolled)             | Currently selected locale code. When supplied, the component is controlled. |
| `defaultValue`        | `string`                                | no       | `"en"` if present in `locales`, else first item | Initial locale when nothing else is supplied. |
| `storageKey`          | `string`                                | no       | `undefined`                            | If set, persist the selection to `localStorage` under this key. |
| `detectFromNavigator` | `boolean`                               | no       | `false`                                | If true and no value/storage entry exists, resolve `navigator.language` to a supported locale. |
| `name`                | `string`                                | no       | `"locale"`                             | `name` attribute on the hidden input that carries the value in a form. |
| `target`              | `HTMLElement \| null`                   | no       | `document.documentElement`             | Element that receives `lang` and `dir`. |
| `applyDir`            | `boolean`                               | no       | `true`                                 | If false, the select only writes `lang` and never touches `dir`. |
| `localeLabels`        | `Record<string, string>`                | no       | `{}`                                   | Optional pretty labels per locale code. |
| `children`            | `(args: ChildArgs) => React.ReactNode`  | no       | `<span class="locale-chooser-icon">🌐</span>` | Render prop that **replaces the glyph inside the button**. It does not render options — the component owns those. |
| `onChange`            | `(locale: string) => void`              | no       | `undefined`                            | Fires after the select applies a new locale. |
| `className`           | `string`                                | no       | `""`                                   | Extra CSS class on the root `<div>`. |
| `...restProps`        | any HTML `<div>` attributes             | no       | —                                      | Spread onto the root `<div>`. |

### 4.2 `ChildArgs`

`children` is a render prop for the **button glyph only**. It receives
three fields:

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

The returned nodes are rendered inside `<button class="locale-chooser-button">`
in place of the default `<span class="locale-chooser-icon">`. Because the
button's accessible name comes from `aria-label={label}`, custom glyph
content should carry `aria-hidden="true"` so it is not announced twice.

### 4.3 DOM contract

The component renders a root `<div>` containing a hidden input, an icon
button, and a listbox:

```html
<div class="locale-chooser {className}" ...restProps>
  <input type="hidden" name="{name}" value="{value}" />
  <button type="button" class="locale-chooser-button"
          aria-label="{label}" aria-haspopup="listbox"
          aria-expanded="false" aria-controls="{listId}">
    <span class="locale-chooser-icon" aria-hidden="true">🌐</span>
  </button>
  <ul class="locale-chooser-list" id="{listId}" role="listbox"
      aria-label="{label}" tabindex="-1" hidden
      aria-activedescendant="{optionId of active, only while open}">
    <li class="locale-chooser-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active lang="en-US">English (United States)</li>
  </ul>
</div>
```

- **Root.** `<div className="locale-chooser {className}">`. All rest
  props spread onto this element.
- **Hidden input.** `<input type="hidden" name="{name}"
  value="{value}">` so the active locale submits with a surrounding
  form.
- **Button.** `type="button"`, class hook `locale-chooser-button`,
  named by `aria-label={label}`, with `aria-haspopup="listbox"`,
  `aria-expanded` tracking open state, and `aria-controls` pointing at
  the list's id.
- **Glyph.** By default `<span class="locale-chooser-icon"
  aria-hidden="true">` holding U+1F310 GLOBE WITH MERIDIANS followed
  by U+FE0E VARIATION SELECTOR-15 (`\u{1F310}\uFE0E`), exported as
  `GLOBE_WITH_MERIDIANS`. VS15 requests text presentation so the globe
  renders monochrome rather than as a colour emoji, matching
  theme-chooser's `\u25D1`. It is hidden from
  assistive technology; the accessible name comes from the button's
  `aria-label`. A `children` render prop replaces this span entirely.
- **Listbox.** `<ul class="locale-chooser-list" role="listbox"
  aria-label="{label}" tabindex="-1">`, carrying the `hidden` attribute
  while closed. Open/close is `hidden` only — the package ships no CSS,
  so positioning the list is the consumer's job.
- **Options.** One `<li class="locale-chooser-option" role="option">`
  per locale code, in `locales` order, with visible text
  `labelFor(locale)`.
  - `aria-selected` is `true` on the active locale and `false` on the rest.
  - `data-active` (valueless) marks the option under the keyboard
    cursor while the list is open. At most one option carries it.
  - `lang="{tagFor(locale)}"` carries the BCP 47 hyphen form so
    assistive technology pronounces the option text in the appropriate
    language even when the document language differs (WCAG 3.1.2).
    Neither the button nor the list carries a `lang` of its own.
- **Ids.** The list id and the option ids derive from React's `useId`,
  so they are stable across server and client render and survive
  hydration. `aria-activedescendant` on the list points at the active
  option's id, and is absent while the list is closed.
- `lang="{tagFor(code)}"` is set on the `target` element on every apply.
- If `applyDir` is true, `dir="rtl"` or `dir="ltr"` is set on the
  `target` element on every apply.

### 4.4 Re-exports

`index.ts` exports:

- `LocaleChooser` (the component, both default and named export)
- `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage`, `defaultLocaleLabels` (pure helpers)
- `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS` (constants)
- `GLOBE_WITH_MERIDIANS` (the default button glyph, U+1F310 + U+FE0E)
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

1. `value` (if a consumer supplied a non-empty string — controlled mode).
2. `localStorage.getItem(storageKey)` (only if `storageKey` is set and
   the read does not throw).
3. `matchNavigatorLanguage(locales)` (only if `detectFromNavigator` is
   true) — see §5.3.
4. `defaultValue`.
5. `"en"` if present in `locales`, else `locales[0]`.
6. `""` (no apply happens — the select waits for user interaction).

When uncontrolled, resolution sets the internal state. When
controlled, the consumer is responsible for updating `value` based on
`onChange`.

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

A single `useEffect` re-applies the locale whenever the resolved value
changes. Other prop changes (`target`, `applyDir`, `localeLabels`) take
effect on the next locale change, not retroactively.

### 5.8 SSR

During server rendering, no effects run and no DOM is touched. The
markup renders with the value supplied by the consumer (if any), the
listbox closed (`hidden`), and `useId`-derived ids that match what the
client will produce, so hydration is clean. Consumers wanting
flicker-free first paint pass a server-resolved `value` (from a cookie,
`Accept-Language` header, etc.).

### 5.9 Open / close and active-option state

The control owns two pieces of interaction state: `open` (is the
listbox expanded?) and `activeIndex` (which option the keyboard cursor
is on, `-1` when closed).

Opening:

1. `activeIndex` is set to the index of the currently-selected locale,
   or `0` when nothing is selected — except for `ArrowUp` on the
   button, which opens with the **last** option active.
2. `open` becomes true, which drops the `hidden` attribute on the list
   and flips `aria-expanded` to `"true"`.
3. Focus moves to the `<ul>` (which is `tabindex="-1"`). The list keeps
   DOM focus while the user navigates; the *active option* is conveyed
   with `aria-activedescendant`, not with focus.

Closing happens on selection, `Escape`, `Tab`, a click outside the
root, focus leaving the root, or a second click on the button.
Selection, `Escape`, and the button toggle return focus to the button;
`Tab`, outside clicks, and focus-out do not (focus is already going
somewhere the user chose).

Selecting an option (`Enter`, `Space`, or a click) calls the same
`setLocale` path the initial resolution uses, so §5.5 applies exactly
once per change.

The active option is kept in view with `scrollIntoView({ block:
"nearest" })` as it moves, guarded so environments without the API
(jsdom) are unaffected.

### 5.10 Typeahead

Printable single characters typed while the listbox is open append to a
typeahead buffer and move the active option to the first label that
starts with the buffer, searching forward from the current active
option and wrapping once. Modifier-held keys (`Ctrl`, `Meta`, `Alt`)
are ignored. The buffer resets after 500 ms of inactivity, and its
pending timer is cleared on unmount. Matching is case-insensitive and
runs against the **labels** (`labelFor`), not the locale codes.

## 6. Accessibility

### 6.1 Roles and properties

- The `<button>` is the announced control: `aria-haspopup="listbox"`,
  `aria-expanded`, and `aria-controls` pointing at the list.
- `aria-label={label}` supplies the accessible name for **both** the
  button and the listbox. The default glyph is `aria-hidden="true"`, so
  `label` is the only source of the button's name — it is required.
- The `<ul role="listbox">` holds `<li role="option">` children with
  `aria-selected` reflecting the active locale.
- The listbox holds DOM focus while open and marks the keyboard cursor
  with `aria-activedescendant`; the options themselves are never
  focused. Ids come from `useId` so they are stable and unique.
- Each option carries `lang="{tagFor(locale)}"` so assistive technology
  can switch pronunciation for the option text. WCAG 3.1.2 (Language
  of Parts). The button and the list carry no `lang`.
- The document root receives `lang` and (by default) `dir` — WCAG
  3.1.1 (Language of Page) and 1.4.10 (Reflow / bidi layout).

### 6.2 Keyboard contract

Implemented by the component, following the WAI-ARIA APG Listbox
pattern. Nothing here comes from the platform.

On the **button**:

| Key                       | Action                                                        |
| ------------------------- | ------------------------------------------------------------- |
| `Tab` / `Shift+Tab`       | Move focus to / from the button (the only tab stop when closed). |
| `ArrowDown` / `Enter` / `Space` | Open the listbox with the currently-selected option active (index 0 when nothing is selected). Focus moves to the list. |
| `ArrowUp`                 | Open the listbox with the **last** option active. Focus moves to the list. |

On the **listbox** (while open):

| Key                       | Action                                                        |
| ------------------------- | ------------------------------------------------------------- |
| `ArrowDown` / `ArrowUp`   | Move the active option down / up. **Clamps** at the ends — it does not wrap. |
| `Home` / `End`            | Jump to the first / last option.                              |
| `Enter` / `Space`         | Select the active option, apply it (§5.5), close, and return focus to the button. |
| `Escape`                  | Close and return focus to the button **without** changing the value. |
| `Tab`                     | Close without stealing focus back, so focus continues to the next element. |
| Printable character       | Typeahead over the option labels (§5.10).                     |

Pointer equivalents: clicking an option selects it, clicking the button
toggles the list, and clicking outside the root — or moving focus out
of it — closes the list without changing the value.

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

Language-tag syntax is defined by the IETF's BCP 47. The latest RFC
describing language-tag syntax is **RFC 5646, Tags for the
Identification of Languages**, and it obsoletes the older RFCs 4646,
3066, and 1766.

References this helper relies on:

- W3C — Language tags in HTML and XML:
  <https://www.w3.org/International/articles/language-tags/>
- RFC 5646 (BCP 47) — Tags for Identifying Languages:
  <https://www.rfc-editor.org/rfc/rfc5646>
- IANA Language Subtag Registry:
  <https://www.iana.org/assignments/language-subtag-registry>
- HTML Living Standard — `lang` attribute:
  <https://html.spec.whatwg.org/multipage/dom.html#the-lang-and-xml:lang-attributes>
- HTML Living Standard — `dir` attribute:
  <https://html.spec.whatwg.org/multipage/dom.html#the-dir-attribute>
- WAI-ARIA APG — Listbox pattern (the pattern this control implements):
  <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/>
- WAI-ARIA APG — Select-Only Combobox example (the button + listbox shape):
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/>
- MDN — `aria-activedescendant`:
  <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-activedescendant>
- WCAG 2.2 SC 3.1.1 / 3.1.2:
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-page>
  <https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts>

## 7. Testing acceptance criteria

`LocaleChooser.test.tsx` must assert every numbered item below. Tests
run under vitest + jsdom + `@testing-library/react`.

### 7.1 Markup contract (mirrors §4.3)

1. Renders a `<button type="button">` with `aria-haspopup="listbox"`,
   `aria-expanded="false"`, and an `aria-controls` id resolving to an
   element with `role="listbox"`. The button holds the globe glyph
   (U+1F310 followed by U+FE0E VARIATION SELECTOR-15) inside
   `.locale-chooser-icon`, marked `aria-hidden="true"`.
   The root is a `<div>` whose class is `locale-chooser {className}`.
2. `aria-label` is the supplied `label`, on both the button and the
   listbox.
3. Renders one `<li role="option">` per entry in `locales` (the count
   is exactly `locales.length` — there is no placeholder), and a hidden
   `<input type="hidden">` carrying the supplied `name` and the
   resolved value.
4. The listbox carries `hidden` until the button is activated; opening
   removes it and flips `aria-expanded` to `"true"`. Exactly one option
   has `aria-selected="true"`, and it is the active locale.
5. Each option carries `lang="{tagFor(locale)}"` (BCP 47 hyphen form).
   Neither the button nor the list carries a `lang` of its own.
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
    contains a supported locale, the select resolves to that locale.
21. When `detectFromNavigator` is true and only a language-only match
    is available (`navigator.language === "fr-CA"`,
    `locales === ["en", "fr"]`), the select resolves to `"fr"`.

### 7.5 Spread + custom children (mirrors §4.1, §4.2)

22. Extra attributes spread through onto the root `<div>` (e.g.
    `data-testid`).
23. A custom `children` render prop replaces the default glyph inside
    `.locale-chooser-button` (no `.locale-chooser-icon` is rendered) and
    receives `ChildArgs` — `value` in consumer form, `labelFor`, and
    `open`, which is `false` while closed and `true` once the listbox
    is expanded.

### 7.6 Keyboard, pointer, and typeahead contract (mirrors §5.9, §5.10, §6.2)

24. On the button, `ArrowDown`, `Enter`, and `Space` all open the
    listbox; `ArrowUp` opens it with the **last** option active; and
    opening moves focus to the `<ul>`.
25. While open, `aria-activedescendant` starts on the selected option;
    `ArrowDown` / `ArrowUp` move it and **clamp** at both ends rather
    than wrapping; `Home` / `End` jump to the first / last option; and
    exactly one option carries `data-active`, tracking the same index.
26. `Enter` selects the active option, applies it to the target's
    `lang`, closes the list (`hidden` returns, `aria-expanded` goes
    back to `"false"`), and returns focus to the button. `Space`
    behaves the same. `Escape` closes and returns focus without
    changing the locale. `Tab` closes without stealing focus back.
27. Typing a printable character moves the active descendant to the
    first matching **label** prefix, and the buffer resets after the
    500 ms idle window. Clicking an option selects and applies it
    (including `dir`); clicking outside closes the list without
    changing the locale; clicking the button again closes it.

## 8. Out-of-scope (future, not implemented here)

- A complementary `LocaleView` helper that displays the active
  locale's pretty name.
- An `Intl.LocaleMatcher` / RFC 4647 lookup integration.
- A built-in `Accept-Language`-header server helper for SSR locale
  negotiation.

## 9. Tracking

- Package directory:
  `lily-design-system-react-helpers/lily-design-system-react-locale-chooser/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or
  contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
- Canonical locale list: [locales.tsv](../locales.tsv) — 436 codes with
  English names
