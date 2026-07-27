# LocaleChooser — Specification

Single source of truth for the `lily-design-system-vue-locale-chooser`
Vue 3 helper. This file drives implementation, testing, and
documentation in the spec-driven-development style: anything not in
this spec is out of scope; anything in this spec must be exercised by
a test.

Sibling files in this directory:

- `LocaleChooser.vue` — the implementation
- `LocaleChooser.test.ts` — vitest spec exercising every clause in §4–§7
- `locales.ts` — built-in locale-code → English-name table and RTL
  sets, derived from `locales.tsv` (copied verbatim from the Svelte
  canonical helper — framework-agnostic data)
- `locales.tsv` — canonical 436-row list of locale codes and English
  names (copied verbatim from the Svelte canonical helper)
- `index.ts` — re-export barrel
- `index.md` — user-facing readme

The canonical reference for this helper is the Svelte sibling at
`../../lily-design-system-svelte-helpers/lily-design-system-svelte-locale-chooser/`.
This Vue port mirrors the contract and behaviour, swapping in Vue 3
idioms (Composition API, `defineProps`, `defineModel`, `ref`,
`watch`, `onMounted`, slots).

> **Breaking change (unreleased).** The control is no longer a native
> `<select>`. It is now an icon button (🌐, U+1F310 GLOBE WITH
> MERIDIANS) that opens a WAI-ARIA APG listbox. The `placeholder`
> prop is removed — there is no `<select>` left to pin — and the
> default slot now replaces the button glyph rather than the options.
> Everything downstream (`lang` / `dir` application, RTL detection,
> persistence, navigator detection, `change`, initial-value
> resolution, SSR safety, the exported pure helpers) is unchanged.
> The per-option `lang` attribute survives the rewrite: each
> `<li role="option">` still carries its locale's BCP 47 tag, so
> endonyms are still pronounced in their own language (WCAG 3.1.2).

---

## 1. Goal

Give a Vue 3 application a drop-in, headless locale chooser that:

1. Renders an accessible icon button that opens a listbox of
   available locales.
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
   `locale-chooser` class hook and the `lang` / `dir` attributes.
7. Provides BCP 47-compliant tag output. Underscores in locale codes
   (e.g. `en_US`) are converted to hyphens (`en-US`) when written to
   the `lang` attribute, per RFC 5646.

## 2. Non-goals

- **Translation**. This component does not translate strings. It only
  signals the locale to the consumer's i18n library via the `lang`
  attribute, the `change` event, and the `v-model:value` binding.
- **Locale negotiation**. The component does not implement
  `Intl.LocaleMatcher` / RFC 4647 best-fit / lookup.
- **Auto-discovery**. The consumer always supplies the list of
  available locale codes.
- **Bundling translation files**. No JSON / YAML / PO assets ship
  with this helper.
- **Nuxt-only features**. The component only depends on Vue 3 + DOM
  APIs and runs in any Vue 3 host (Nuxt, plain Vite + Vue, Astro,
  Storybook).
- **Custom option rendering**. The listbox, its `<li role="option">`
  children, the keyboard contract, and the apply lifecycle are all
  component-owned. The default slot replaces the button glyph only.
  Consumers who need a different control shape (radios, an
  always-visible button row, a free-text combobox) render their own
  markup and bind it to the same value.

## 3. Architectural decisions

- **The `lang` attribute is the source of truth.** Every Lily helper
  and every i18n library agrees that `document.documentElement.lang`
  is the authoritative signal for current document language.
- **The `dir` attribute is the secondary switch.** Setting `dir` on
  the document root is what causes browsers to mirror layout, scrollbar
  position, and bidi text. The chooser derives it from the locale.
- **BCP 47 hyphen form on the wire.** Locale codes are stored in the
  consumer's array using whichever form they prefer. When the chooser
  writes to the DOM, it normalises to the BCP 47 hyphen form. The
  `v-model:value` mirrors back the original consumer form.
- **TypeScript everywhere.** Public surface is fully typed via a
  `Props` type exported from `LocaleChooser.vue`.
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
| `label`             | `string`                              | yes      | —                        | Accessible name for **both** the button and the listbox. The button is icon-only, so this is its only name. |
| `locales`           | `string[]`                            | yes      | —                        | Available locale codes. |
| `value`             | `string` (`v-model:value`)            | no       | `""`                     | Currently selected locale code. |
| `defaultValue`      | `string`                              | no       | `"en"` if present in `locales`, else first | Initial locale. |
| `storageKey`        | `string`                              | no       | `undefined`              | If set, persist to `localStorage` under this key. |
| `detectFromNavigator` | `boolean`                           | no       | `false`                  | Resolve `navigator.language` on first visit. |
| `name`              | `string`                              | no       | `"locale"`               | `name` of the hidden input that carries the value in a form. |
| `target`            | `HTMLElement \| null`                 | no       | `document.documentElement` | Element that receives `lang` and `dir`. |
| `applyDir`          | `boolean`                             | no       | `true`                   | If false, the chooser only writes `lang` and never touches `dir`. |
| `localeLabels`      | `Record<string, string>`              | no       | `{}`                     | Optional pretty labels per locale code. |
| `class`             | `string`                              | no       | `""`                     | Extra CSS class on the root `<div>`. |

### 4.2 Events

| Event           | Payload          | Purpose                                                |
| --------------- | ---------------- | ------------------------------------------------------ |
| `update:value`  | `string`         | Emitted on selection (drives `v-model:value`).         |
| `change`        | `string`         | Emitted after the chooser applies a new locale (consumer-form code, not BCP 47). |

### 4.3 Slots

Default slot — when provided, replaces the **button glyph**. It does
not render the options: the listbox, its `<li role="option">`
children, the keyboard contract, and the apply lifecycle are all
component-owned. The slot receives the following scoped props:

```ts
type SlotArgs = {
  /** Currently selected locale code (consumer form, not BCP 47-normalised). */
  value: string;
  /** Is the listbox open? */
  open: boolean;
  /** Resolve a locale code to its display label. */
  labelFor: (locale: string) => string;
};
```

`ChildArgs` is exported as an alias of `SlotArgs`, matching the
canonical Svelte helper's type name.

Whatever the slot renders is decorative: the button's accessible name
always comes from `label` via `aria-label`. Slot content should be
`aria-hidden="true"` or text-free so it does not compete with that
name.

### 4.4 DOM contract

```html
<div class="locale-chooser {class}" ...$attrs>
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
        aria-selected="true|false" data-active
        lang="{tagFor(locale)}">{labelFor(locale)}</li>
  </ul>
</div>
```

- Root element: a `<div class="locale-chooser {class}">`. `$attrs`
  falls through to it via the default Vue `inheritAttrs` behaviour.
- The button is icon-only. The glyph is `🌐` (U+1F310 GLOBE WITH
  MERIDIANS, `&#127760;`), exported as `GLOBE_WITH_MERIDIANS`,
  wrapped in `aria-hidden="true"` so it can never become the
  accessible name.
- The hidden input preserves form participation and carries `name`.
- `aria-expanded` tracks the open state; `aria-controls` points at the
  listbox id.
- The listbox carries `hidden` while closed, `tabindex="-1"` so it can
  receive focus on open, and `aria-activedescendant` **only while
  open** — it is removed on close.
- One `<li class="locale-chooser-option" role="option">` per locale
  code, with a stable per-instance `id`, `aria-selected` reflecting
  the active code, and `data-active` on the keyboard-active option.
- Each option carries `lang="{tagFor(locale)}"` so assistive
  technology pronounces the option text in the appropriate language
  even when the document language differs. The button and the
  listbox itself carry **no** `lang` of their own — they are not
  locale-specific.
- Option ids come from an incrementing module counter
  (`nextLocaleChooserId()`), so they are stable and SSR-safe — never
  `Math.random()` or `Date.now()`.
- The selection lives in `value` / `v-model:value`, in the hidden
  input, and in `lang` / `dir` on the target.
- `lang="{tagFor(code)}"` is set on the `target` element on every
  apply.
- If `applyDir` is true, `dir="rtl"` or `dir="ltr"` is set on the
  `target` element on every apply.

### 4.5 Re-exports

`index.ts` exports:

- `default` (the component)
- `LocaleChooser` (named alias)
- `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage`, `defaultLocaleLabels` (pure helpers)
- `nextLocaleChooserId` (per-instance id generator)
- `GLOBE_WITH_MERIDIANS` (the default button glyph)
- `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS` (constants)
- `type Props`, `type SlotArgs`, `type ChildArgs`

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

An externally-supplied `value` is mirrored into an internal `current`
ref, and a `watch` on `current` re-applies the locale whenever it
changes. Other prop changes (`target`, `applyDir`, `localeLabels`)
take effect on the next locale change.

### 5.8 SSR

During server rendering, no `onMounted` / `watch` callback fires and
no DOM is touched.

## 6. Accessibility

### 6.1 Roles and properties

- A `<button aria-haspopup="listbox" aria-expanded aria-controls>` is
  the trigger. Because it is icon-only, `aria-label={label}` is its
  **only** accessible name — the glyph is `aria-hidden="true"`.
- A `<ul role="listbox" aria-label={label}>` holds one
  `<li role="option" aria-selected>` per locale code.
- The active option is conveyed with `aria-activedescendant` on the
  listbox (focus stays on the `<ul>`), per the APG listbox pattern.
- `data-active` mirrors the active option for consumer CSS;
  `aria-selected` mirrors the committed selection for assistive
  technology.
- Each option carries `lang="{tagFor(locale)}"` so assistive
  technology can switch pronunciation for the option text. WCAG 3.1.2
  (Language of Parts). The button and the listbox carry no `lang`.
- The document root receives `lang` and (by default) `dir` — WCAG
  3.1.1 (Language of Page) and 1.4.10 (Reflow).

### 6.2 Keyboard contract

Implemented by the component, following the WAI-ARIA APG listbox
pattern. Focus moves to the `<ul>` on open and returns to the button
on commit or cancel.

On the **button**:

| Key                  | Action                                                        |
| -------------------- | ------------------------------------------------------------- |
| `ArrowDown`          | Open, active option = the selected one (or index 0).          |
| `Enter` / `Space`    | Open, active option = the selected one (or index 0).          |
| `ArrowUp`            | Open, active option = the **last** option.                    |
| `Tab` / `Shift+Tab`  | Move focus away (native).                                     |

On the **listbox**:

| Key                  | Action                                                        |
| -------------------- | ------------------------------------------------------------- |
| `ArrowDown`          | Move the active option down one. **Clamps** — no wrapping.    |
| `ArrowUp`            | Move the active option up one. **Clamps** — no wrapping.      |
| `Home` / `End`       | Jump to the first / last option.                              |
| `Enter` / `Space`    | Select the active option, apply it, close, refocus the button.|
| `Escape`             | Close and refocus the button **without** changing the value.  |
| `Tab`                | Close without stealing focus back.                            |
| Printable characters | Typeahead over the option **labels**, 500 ms buffer reset.    |

Pointer and focus behaviour: clicking an option selects it; clicking
outside the root closes the listbox; focus leaving the root closes it.

### 6.3 Internationalisation

- `label`, `localeLabels`, and the consumer-supplied `locales` array
  are all passed through verbatim.
- No user-facing strings are hardcoded inside the component.
- Each rendered option name appears in its own `lang` context.
- Writing direction inherits from the resolved locale; consumers can
  override by passing `:applyDir="false"`.

## 7. Testing acceptance criteria

`LocaleChooser.test.ts` must assert every numbered item below. Tests
run under vitest + jsdom + `@vue/test-utils`.

### 7.1 Markup contract (mirrors §4.4)

1. Renders a `<button type="button">` with `aria-haspopup="listbox"`,
   `aria-expanded="false"`, and an `aria-controls` pointing at an
   element with `role="listbox"`. The root is a `<div>` carrying the
   `locale-chooser` class hook plus the consumer's `class`. The button
   renders `🌐` (U+1F310) inside
   `<span class="locale-chooser-icon" aria-hidden="true">`.
2. `aria-label` is the supplied `label` on **both** the button and the
   listbox.
3. Renders one `<li class="locale-chooser-option">` per entry in
   `locales`, and a hidden input carrying the supplied `name` and the
   resolved value.
4. The listbox carries `hidden` until the button is activated; then
   `hidden` is dropped and `aria-expanded` becomes `"true"`. Exactly
   one option carries `aria-selected="true"` — the active locale.
5. Each option carries `lang="{tagFor(locale)}"` (BCP 47 hyphen
   form). The button and the listbox carry no `lang` of their own.
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
16. Clicking a different option updates `target.lang`, updates
    `target.dir`, emits `change` with the new locale code in its
    consumer form (not the BCP 47-normalised tag), and round-trips
    `v-model:value`.
17. A custom `target` element receives `lang` and `dir` instead of
    `document.documentElement`.

### 7.4 Initial-value resolution (mirrors §5.2, §5.3)

18. When `storageKey` is set, the active code is written to
    `localStorage` and read back on a fresh mount.
19. When `value` is supplied as a non-empty prop, the initial-value
    resolution skips storage, navigator detection, and defaults.
20. When `detectFromNavigator` is true and `navigator.languages`
    contains a supported locale, the chooser resolves to that locale.
21. When `detectFromNavigator` is true and only a language-only match
    is available, the chooser resolves to the language-only locale.

### 7.5 Spread + custom slot (mirrors §4.1, §4.3)

22. Extra attributes spread through onto the root `<div>` (e.g.
    `data-testid`).
23. A custom default slot replaces the button glyph — the
    `.locale-chooser-icon` span is absent — and receives the `SlotArgs`
    contract (`value`, `open`, `labelFor`). Its `open` flag tracks the
    listbox state.

### 7.6 Keyboard contract (mirrors §6.2)

24. `ArrowDown`, `Enter` and `Space` on the button all open the
    listbox. `ArrowUp` opens with the **last** option active. Opening
    moves focus to the `<ul>`.
25. Opening puts `aria-activedescendant` on the selected option. On
    the listbox, `ArrowDown` / `ArrowUp` move it and clamp at both
    ends rather than wrapping; `Home` / `End` jump to the first / last
    option; exactly one option carries `data-active`.
26. `Enter` selects the active option, applies it, closes the listbox
    (`hidden` returns, `aria-expanded` becomes `"false"`), and returns
    focus to the button. `Space` selects too. `Escape` closes without
    changing the locale. `Tab` closes without stealing focus back.
    `aria-activedescendant` is removed once closed.
27. Printable characters run a typeahead over the option labels.
    Clicking an option selects and applies it. Clicking outside the
    root closes the listbox.

## 8. Out-of-scope (future, not implemented here)

- A complementary `LocaleView` helper that displays the active
  locale's pretty name.
- A `LocaleChooser` sibling that renders an always-visible radio group
  or button row. The default slot no longer covers that case — it
  replaces the button glyph only.
- An `Intl.LocaleMatcher` / RFC 4647 lookup integration.
- A built-in `Accept-Language`-header server helper for SSR locale
  negotiation.

## 9. Tracking

- Package directory:
  `lily-design-system-vue-helpers/lily-design-system-vue-locale-chooser/`
- Spec version: 0.3.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
  (or contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
- Canonical locale list: [locales.tsv](../locales.tsv) — 436 codes
  with English names
