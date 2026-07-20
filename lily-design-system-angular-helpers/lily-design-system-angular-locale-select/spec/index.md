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

1. Renders an accessible icon button that opens a WAI-ARIA APG
   listbox of available locales.
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
- **Positioning the list**. The listbox is a plain `<ul>` in normal
  document flow. Overlaying it on the page (`position: absolute` on
  the list, `position: relative` on the root) is consumer CSS; this
  package ships none.
- **Combobox / filtering**. The list is a listbox, not a combobox:
  there is no text input and no filtering beyond the APG typeahead.
  Consumers needing a filtered 400-locale picker bind a sibling
  widget to the same `[(value)]` signal.
- **Replacing the list rendering**. The projected `<ng-template>`
  replaces the button glyph only. It does not render options.

## 3. Architectural decisions

- **Standalone signal-based component.** Uses `input<T>()`,
  `input.required<T>()`, `output<T>()`, and `model<string>()`.
- **`OnPush` change detection.**
- **Icon button + APG listbox, not a native `<select>`.** The
  control is a `<button aria-haspopup="listbox">` that toggles a
  `<ul role="listbox">` of `<li role="option">` children. The
  keyboard contract is implemented in the component (§6.2) rather
  than inherited from the platform. The tradeoffs are stated
  plainly in [`../docs/accessibility.md`](../docs/accessibility.md).
- **Form participation via a hidden input.** Because there is no
  `<select>`, a `<input type="hidden" [name] [value]>` carries the
  value into an enclosing `<form>`.
- **Per-instance ids from a module counter.** `nextLocaleSelectId()`
  increments a module-scoped integer. It is deliberately not
  `Math.random()` / `Date.now()` so server and client render the
  same ids and hydration does not mismatch.
- **The projected `<ng-template>` replaces the glyph, nothing more.**
  Angular's answer to the Svelte canonical's `children` snippet. The
  component queries any projected template with
  `contentChild(TemplateRef)`; the exported `LocaleSelectIcon`
  marker directive exists only to give consumers typed `let-`
  variables.
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
  `localeName`, `matchNavigatorLanguage`, plus `nextLocaleSelectId`
  and re-exports of `defaultLocaleLabels`, `RTL_LANGUAGE_TAGS`,
  `RTL_SCRIPT_SUBTAGS`.
- **No template casts.** The catalog-wide `$any($event.target).value`
  idiom does not appear here: there is no `(change)` on a native
  control to read a value from. Every handler takes the typed event
  (`KeyboardEvent`, `FocusEvent`) or an index, and reads state from
  signals.
- **Document / focus listeners are host and template bindings.**
  Outside-click uses a `host: { "(document:click)": … }` binding;
  focus leaving the control uses a `(focusout)` binding on the root
  `<div>`. Neither adds a manual `addEventListener`, so Angular
  unsubscribes both on destroy.

## 4. Public API

### 4.1 Inputs / outputs

| Input / output        | Type                                | Required | Default                          | Purpose |
| --------------------- | ----------------------------------- | -------- | -------------------------------- | ------- |
| `label`               | `input.required<string>()`          | yes      | —                                | Accessible name for the button **and** the listbox. The button is icon-only, so this is its only accessible name. |
| `locales`             | `input.required<string[]>()`        | yes      | —                                | Available locale codes. |
| `value`               | `model<string>()`                   | no       | `""`                             | Currently selected locale code. Two-way bindable. |
| `defaultValue`        | `input<string>()`                   | no       | `""`                             | Initial locale when nothing else is supplied. |
| `storageKey`          | `input<string>()`                   | no       | `""`                             | If non-empty, persist the selection to `localStorage` under this key. |
| `detectFromNavigator` | `input<boolean>()`                  | no       | `false`                          | Resolve `navigator.languages` on first visit. |
| `name`                | `input<string>()`                   | no       | `"locale"`                       | `name` attribute of the hidden input that carries the value into an enclosing form. |
| `target`              | `input<HTMLElement \| null>()`      | no       | `null` (→ `document.documentElement`) | Element that receives `lang` and `dir`. |
| `applyDir`            | `input<boolean>()`                  | no       | `true`                           | If false, the select only writes `lang`. |
| `localeLabels`        | `input<Record<string, string>>()`   | no       | `{}`                             | Optional pretty labels per locale code. |
| `className`           | `input<string>()`                   | no       | `""`                             | Extra CSS class appended to the root `<div>`. |
| `localeChange`        | `output<string>()`                  | no       | —                                | Emits after the select applies a new locale (consumer-form code). |

### 4.2 Content projection

A projected `<ng-template>` replaces the default globe glyph inside
the button. It does **not** render options — the listbox is
component-owned.

```html
<lily-locale-select label="Language" [locales]="locales">
  <ng-template let-args>{{ args.labelFor(args.value) }}</ng-template>
</lily-locale-select>
```

The template receives the `ChildArgs` context both as `$implicit`
and as named properties:

| Context key | Type                            | Meaning |
| ----------- | ------------------------------- | ------- |
| `$implicit` | `ChildArgs`                     | The whole context, for `let-args`. |
| `value`     | `string`                        | Selected locale code, consumer form. |
| `open`      | `boolean`                       | Is the listbox open? |
| `labelFor`  | `(locale: string) => string`    | Resolve a code to its display label. |

The exported `LocaleSelectIcon` marker directive (selector
`ng-template[lilyLocaleSelectIcon]`) is optional. The component
queries any projected `<ng-template>` via `contentChild(TemplateRef)`,
so the marker is for type-checking and readability, not matching.

### 4.3 DOM contract

The rendered tree, with the listbox closed:

```html
<div class="locale-select {className}">
  <input type="hidden" name="{name}" value="{value}" />
  <button type="button" class="locale-select-button" aria-label="{label}"
          aria-haspopup="listbox" aria-expanded="false" aria-controls="{listId}">
    <span class="locale-select-icon" aria-hidden="true">&#127760;</span>
  </button>
  <ul class="locale-select-list" id="{listId}" role="listbox" aria-label="{label}"
      tabindex="-1" hidden>
    <li class="locale-select-option" id="{listId-less base}-option-0" role="option"
        aria-selected="true" data-active lang="en-US">English (United States)</li>
    …
  </ul>
</div>
```

Element by element:

- **Root** — a `<div>` carrying the `locale-select` class hook plus
  the consumer's `className`. It is the click / focus boundary: a
  click outside it, or focus leaving it, closes the listbox.
- **Hidden input** — `<input type="hidden">` carrying `name` and the
  current `value`, so the control participates in an enclosing
  `<form>` exactly as the old `<select>` did.
- **Button** — `type="button"` (never submits), class
  `locale-select-button`, `aria-label="{label}"`,
  `aria-haspopup="listbox"`, `aria-expanded` tracking the open state,
  and `aria-controls` pointing at the list's `id`.
- **Glyph** — `<span class="locale-select-icon" aria-hidden="true">`
  containing U+1F310 GLOBE WITH MERIDIANS (`&#127760;`), exported as
  the constant `GLOBE_WITH_MERIDIANS`. It is hidden from assistive
  technology because `aria-label` on the button already names the
  control. A projected `<ng-template>` (§4.2) replaces this span
  entirely.
- **List** — `<ul class="locale-select-list">` with `role="listbox"`,
  its own `aria-label="{label}"`, `tabindex="-1"` so it can receive
  focus programmatically, and the `hidden` attribute while closed.
  While open it carries `aria-activedescendant` pointing at the
  active option's `id`; while closed the attribute is absent.
- **Options** — one `<li class="locale-select-option" role="option">`
  per locale code, each with a stable per-instance `id`,
  `aria-selected` (`"true"` on the selected locale, `"false"`
  otherwise), `data-active` on the keyboard-active option while open,
  and `lang="{tagFor(locale)}"`.

Further rules:

- **Options carry `lang`; the button and the list do not.** Each
  option's `lang` is the BCP 47 hyphen form of its own code, so
  assistive technology pronounces "Français" with a French voice
  (WCAG 3.1.2, Language of Parts). Putting a `lang` on the button or
  the `<ul>` would mislabel the language of the control's own chrome,
  so neither carries one.
- **Ids are stable and unique per instance.** `nextLocaleSelectId()`
  increments a module-scoped counter to produce a base id; the list
  is `{base}-list` and option *i* is `{base}-option-{i}`. No
  randomness and no clock read, so SSR and client hydration agree.
- **`value` is the single source of truth.** Every downstream
  behaviour (`lang`, `dir`, persistence, `localeChange`) is driven
  from it.
- `lang="{tagFor(locale)}"` is set on the `target` element on every
  apply.
- If `applyDir` is true, `dir="rtl"` or `dir="ltr"` is set on the
  `target` element on every apply.
- The list sits in normal document flow and this package ships zero
  CSS. Overlaying it is consumer CSS — typically `position: absolute`
  on `.locale-select-list` with `position: relative` on
  `.locale-select`.

### 4.4 Re-exports

`index.ts` exports:

- `LocaleSelect` (the component class)
- `LocaleSelectIcon` (the optional icon-template marker directive)
- `GLOBE_WITH_MERIDIANS` (the default button glyph)
- `nextLocaleSelectId` (the per-instance id generator)
- `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage` (pure helpers)
- `defaultLocaleLabels`, `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`
  (constants from `locales.ts`)
- `ChildArgs` (type-only — the projected template's context)

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

`effect()` runs but the `document`-guard prevents DOM mutation. The
listbox renders closed (`hidden`) server-side, and per-instance ids
come from a counter rather than randomness, so the server and client
markup agree.

### 5.9 Open / close and active-option state

Two pieces of internal state drive the listbox: `open` (boolean) and
`activeIndex` (integer, `-1` when closed).

- **Opening** sets `activeIndex` to the index of the currently
  selected locale, or `0` when nothing is selected — except
  `ArrowUp`, which opens with the **last** option active. Focus then
  moves to the `<ul>` on the next microtask, and the active option is
  scrolled into view with `block: "nearest"`.
- **Focus lives on the `<ul>`, not on the options.** The active
  option is conveyed to assistive technology solely by
  `aria-activedescendant`, per the APG listbox pattern. Options are
  never individually focusable.
- **Moving** the active option clamps at both ends rather than
  wrapping (`ArrowDown` on the last option is a no-op).
- **Choosing** an option writes its code to `value`, closes the list,
  and returns focus to the button. The apply pipeline (§5.5) then
  runs from the `value` change.
- **Closing** resets `activeIndex` to `-1` and drops
  `aria-activedescendant`. Focus returns to the button except when
  closing because of `Tab`, an outside click, or focus leaving the
  root — in those cases focus is left where it is.
- **Typeahead** appends the typed character to a buffer, searches
  forward from the active option (wrapping once) for the first
  **label** with that prefix, and clears the buffer 500 ms after the
  last keystroke. It matches against `labelFor(locale)`, not the raw
  code, so typing "f" finds "French". The buffer timer is cleared on
  destroy.

## 6. Accessibility

### 6.1 Roles and properties

The control implements the
[WAI-ARIA APG Listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)
with a collapsing button. Nothing here is inherited from the
platform: every role, state, and key is the component's own.

| Element  | Role / property                                     | Source         |
| -------- | --------------------------------------------------- | -------------- |
| `<div>`  | none (structural; click / focus boundary)            | Component      |
| `<input type="hidden">` | `name`, `value`                       | Component      |
| `<button>` | `aria-label={label}`                              | Consumer input |
| `<button>` | `aria-haspopup="listbox"`                         | Component      |
| `<button>` | `aria-expanded="true|false"`                      | Component      |
| `<button>` | `aria-controls={listId}`                          | Component      |
| `<span>` | `aria-hidden="true"` (the glyph)                     | Component      |
| `<ul>`   | `role="listbox"`, `aria-label={label}`, `tabindex="-1"` | Component  |
| `<ul>`   | `aria-activedescendant={optionId}` (open only)       | Component      |
| `<li>`   | `role="option"`, `aria-selected`                     | Component      |
| `<li>`   | `lang={tagFor(locale)}`                              | Component      |

Notes:

- **The button is icon-only, so `label` is its entire accessible
  name.** The glyph is `aria-hidden`, which means a vague or missing
  `label` leaves the control unusable to screen-reader and
  voice-control users. See
  [`../docs/accessibility.md`](../docs/accessibility.md).
- Each option carries `lang` so assistive tech can switch
  pronunciation (WCAG 3.1.2, Language of Parts). The button and the
  list carry no `lang` of their own.
- The document root receives `lang` and (by default) `dir` (WCAG
  3.1.1 / 1.4.10).
- The closed button never shows the active locale name — only the
  glyph. Consumers surface the active locale separately; the status
  region pattern is in
  [`../docs/accessibility.md`](../docs/accessibility.md).

### 6.2 Keyboard contract

Implemented by the component, following the APG listbox pattern.

On the **button**:

| Key                       | Action                                                     |
| ------------------------- | ---------------------------------------------------------- |
| `Tab` / `Shift+Tab`       | Move focus to / from the button.                           |
| `Enter` / `Space`         | Open the list, active option = the selected one (else 0).  |
| `Arrow Down`              | Open the list, active option = the selected one (else 0).  |
| `Arrow Up`                | Open the list, active option = the **last** one.           |

Opening always moves focus to the `<ul>`.

On the **listbox**:

| Key                       | Action                                                     |
| ------------------------- | ---------------------------------------------------------- |
| `Arrow Down` / `Arrow Up` | Move the active option one step; **clamps**, never wraps.  |
| `Home` / `End`            | Jump to the first / last option.                           |
| `Enter` / `Space`         | Select the active option, apply it, close, refocus button. |
| `Escape`                  | Close and refocus the button; the value is unchanged.      |
| `Tab`                     | Close **without** stealing focus back; the browser moves on. |
| Printable characters      | Typeahead over the option **labels**; buffer clears 500 ms after the last keystroke. |

Pointer and focus equivalents:

| Interaction              | Action                                        |
| ------------------------ | --------------------------------------------- |
| Click the button         | Toggle the list open / closed.                |
| Click an option          | Select it, apply it, and close.               |
| Click outside the root   | Close, leaving focus where it is.             |
| Focus leaves the root    | Close, leaving focus where it is.             |

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

### 7.1 Markup contract (mirrors §4.3)

1. Renders a `<button type="button">` with `aria-haspopup="listbox"`,
   `aria-expanded="false"`, and an `aria-controls` matching the
   `<ul role="listbox">`'s `id`; the root is a `<div>` carrying the
   `locale-select` class hook plus the consumer's `className`; the
   button contains a `.locale-select-icon` span holding U+1F310
   (equal to `GLOBE_WITH_MERIDIANS`) and marked `aria-hidden="true"`.
2. `aria-label` is the supplied `label` on **both** the button and
   the listbox.
3. Renders exactly one `<li role="option">` per entry in `locales`;
   the hidden input carries the supplied `name` and the resolved
   value; option ids are non-empty and unique across two instances
   mounted side by side.
4. The listbox carries `hidden` until the button is activated, after
   which `hidden` is gone and `aria-expanded` is `"true"`; exactly
   one option has `aria-selected="true"`; exactly one option carries
   `data-active` while open.
5. Each option carries `lang="{tagFor(locale)}"` (BCP 47 hyphen
   form); the button and the list carry no `lang` of their own.
6. The visible option text is `localeLabels[code]
   ?? defaultLocaleLabels[code] ?? Intl.DisplayNames ?? code`.

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
16. Choosing a different option updates `target.lang`, updates
    `target.dir`, emits `localeChange` with the new locale code in
    its **consumer** form (`en_US`, not `en-US`), and updates the
    hidden input's `value`.
17. A custom `target` element receives `lang` and `dir` instead of
    `document.documentElement`, which stays untouched.

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

### 7.5 Class hook and custom icon template (mirrors §4.2)

22. The consumer's `className` is appended to the root `<div>`'s
    class list.
23. A projected `<ng-template>` replaces the default glyph inside the
    button — the `.locale-select-icon` span is absent — and receives
    the `ChildArgs` context (`value`, `open`, `labelFor`).

### 7.6 Keyboard contract (mirrors §5.9, §6.2)

24. On the button, `ArrowDown`, `Enter`, and `Space` each open the
    listbox and set `aria-expanded="true"`; opening puts
    `aria-activedescendant` on the selected locale; `ArrowUp` instead
    opens with the **last** option active; opening moves focus to the
    `<ul>`.
25. On the listbox, `ArrowDown` / `ArrowUp` move
    `aria-activedescendant` one step and **clamp** at both ends
    rather than wrapping; `Home` / `End` jump to the first / last
    option.
26. `Enter` selects the active option, applies it (`target.lang`
    updates), closes the list, and returns focus to the button;
    `Space` does the same.
27. `Escape` closes the list without changing the locale and returns
    focus to the button; `Tab` closes the list **without** pulling
    focus back to the button.
28. Printable characters run a typeahead over the option **labels**,
    moving `aria-activedescendant` to the first match; the buffer
    clears 500 ms after the last keystroke, so a later character
    starts a fresh search. Clicking an option selects and applies it
    and closes the list; clicking outside the root closes the list.

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
