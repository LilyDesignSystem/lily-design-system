# `<locale-chooser>` — Specification

Single source of truth for the `lily-design-system-html-locale-chooser`
HTML helper. This file drives implementation, testing, and
documentation in the spec-driven-development style: anything not in
this spec is out of scope; anything in this spec must be exercised by
a test.

Sibling files in this directory:

- `locale-chooser.ts` — the custom-element implementation
- `locale-chooser.test.ts` — vitest + jsdom spec exercising every clause in §4–§7
- `locales.ts` — built-in code → English-name table and RTL sets
- `locales.tsv` — canonical 436-row source for `locales.ts`
- `index.ts` — re-export barrel (side-effectfully registers the element)
- `index.md` — user-facing readme

The Svelte sibling
(`lily-design-system-svelte-helpers/lily-design-system-svelte-locale-chooser/`)
shares the same numbered acceptance criteria; this spec mirrors §1–§9
re-expressed for the custom-element idiom.

---

## 1. Goal

Give any HTML page a drop-in, headless locale chooser that:

1. Renders an accessible **icon button that opens a dropdown
   listbox** of available locales (WAI-ARIA APG listbox pattern).
2. **Applies the chosen locale** by setting `lang="…"` and
   `dir="ltr|rtl"` on the document root (or on a consumer-supplied
   target).
3. Auto-detects script direction (RTL for Arabic, Hebrew, Thaana,
   Mongolian traditional, N'Ko, Syriac, Adlam scripts).
4. Optionally persists the chosen locale to `localStorage`.
5. Optionally falls back to `navigator.languages` on first visit when
   no value, storage, or default is supplied.
6. Ships zero CSS — the consumer styles every visual aspect via the
   `locale-chooser` class hooks and the `lang` / `dir` attributes.
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
- **Positioning the dropdown**. The package ships no CSS, so the
  rendered `<ul>` sits in normal flow until the consumer gives the
  root `position: relative` and the list `position: absolute`.

## 3. Architectural decisions

- **Custom element extends `HTMLElement`.** The tag is
  `<locale-chooser>`. The class is exported as `LocaleChooser` from
  `locale-chooser.ts` and `index.ts`.
- **Side-effectful registration on import.** `index.ts` calls
  `customElements.define("locale-chooser", LocaleChooser)` on first
  module evaluation, guarded by a `customElements.get(...)` check.
- **Light DOM.** The element renders its `<div>` root, button, and
  listbox as children, not in a shadow root.
- **Icon button + custom listbox, not a native `<select>`.** The
  control is an icon-only `<button>` paired with a
  `<ul role="listbox">`. The keyboard contract (§4.7) is implemented
  in JavaScript following the WAI-ARIA APG listbox pattern; it is not
  inherited from the platform. The accessibility tradeoff this buys
  and costs is stated in `docs/accessibility.md`.
- **A hidden `<input>` preserves form participation.** The rendered
  root contains `<input type="hidden" name="{name}" value="{value}">`
  so the control still submits with a surrounding `<form>`.
- **Stable, SSR-safe ids.** List and option ids come from a
  module-level incrementing counter (`nextLocaleChooserId()`, exported)
  — never `Math.random()` or `Date.now()`.
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
| `label`                | `string`        | yes      | —                                | Accessible name. Applied as `aria-label` to **both** the button and the listbox. The control is icon-only, so this is the only accessible name it has. |
| `locales`              | `string` (CSV)  | yes      | —                                | Available locale codes, comma-separated. The JS property `el.locales` accepts `string[]`. |
| `value`                | `string`        | no       | `""`                             | Currently selected locale code (consumer form). |
| `default-value`        | `string`        | no       | `"en"` if present, else first    | Initial locale when nothing else is supplied. |
| `storage-key`          | `string`        | no       | `undefined`                      | If set, persist the selection to `localStorage` under this key. |
| `detect-from-navigator`| `boolean` attr  | no       | absent / `false`                 | If present (and not `="false"`), resolve `navigator.languages` to a supported locale on first visit. |
| `name`                 | `string`        | no       | `"locale"`                       | `name` attribute on the rendered hidden `<input>`. |
| `apply-dir`            | `boolean` attr  | no       | absent / `true`                  | If set to `"false"`, the select only writes `lang` and never touches `dir`. |
| `locale-labels`        | `string` (JSON) | no       | `"{}"`                           | Pretty labels per locale code, JSON-encoded object. |
| `class`                | `string`        | no       | `""`                             | Extra CSS class on the rendered `<div>` root. |

There is no `placeholder` attribute. It was a 0.3.0 mechanism for
pinning a native `<select>`'s displayed text; there is no `<select>`
left to pin.

### 4.2 JS properties and methods

Every attribute in §4.1 mirrors a camelCase JS property, plus:

| Member                          | Kind          | Purpose |
| ------------------------------- | ------------- | ------- |
| `el.target`                     | property      | `HTMLElement \| null`, default `document.documentElement`; no attribute form (DOM references are not serialisable). |
| `el.open`                       | getter        | Is the listbox currently open? Read-only. |
| `el.listId`                     | getter        | `id` of the rendered `<ul role="listbox">`. |
| `el.optionId(index)`            | method        | `id` of the rendered option at `index`. |
| `el.openList(startIndex?)`      | method        | Open the listbox. `startIndex` overrides which option starts active; the default is the selected option, or index 0. |
| `el.closeList(refocus = true)`  | method        | Close the listbox. Returns focus to the button unless `refocus` is `false`. |
| `el.labelFor(code)`             | method        | Resolve a locale code to its display label (§5.4). |
| `el.tagFor(locale)`             | method        | Resolve a locale code to its BCP 47 tag (§5.1). |
| `el.renderButtonContent()`      | **overridable** | Build the button's content. See §4.8. |

`labelFor`, `tagFor`, and `renderButtonContent` are public so that
subclasses can use and override them; the rest of the rendering is
held in private fields and cannot be overridden (§4.8, tier 2).

### 4.3 Lifecycle callbacks

- `static get observedAttributes()` lists the kebab-case attributes
  in §4.1.
- `connectedCallback()` resolves the initial value (per §5.2),
  renders the children, registers the outside-click listener, and
  applies the locale.
- `attributeChangedCallback(name, _old, _new)` updates the
  corresponding internal field and then either **rebuilds** the DOM
  (`locales`, `locale-labels`, `label`, `name`, `class`) or, for
  `value`, only **syncs state** and re-applies (see §5.7).
- `disconnectedCallback()` removes the document click listener and
  clears the typeahead timer. It does not unset `lang` / `dir` —
  those attributes are author-managed once they have been set.

### 4.4 Events

The element fires a `localechange` `CustomEvent` after every applied
change. `event.detail` is `{ locale: string }` (the consumer-form
code, not the BCP 47-normalised tag). The event bubbles and is
composed.

### 4.5 DOM contract

```html
<locale-chooser label="Locale" locales="en,fr,ar">
  <div class="locale-chooser {class}">
    <input type="hidden" name="locale" value="en" />
    <button type="button" class="locale-chooser-button"
            aria-label="Locale" aria-haspopup="listbox"
            aria-expanded="false" aria-controls="locale-chooser-1-list">
      <span class="locale-chooser-icon" aria-hidden="true">&#127760;&#65038;</span>
    </button>
    <ul class="locale-chooser-list" id="locale-chooser-1-list" role="listbox"
        aria-label="Locale" tabindex="-1" hidden>
      <li class="locale-chooser-option" id="locale-chooser-1-option-0"
          role="option" aria-selected="true" data-active lang="en">English</li>
      <li class="locale-chooser-option" id="locale-chooser-1-option-1"
          role="option" aria-selected="false" lang="fr">French</li>
      <li class="locale-chooser-option" id="locale-chooser-1-option-2"
          role="option" aria-selected="false" lang="ar">Arabic</li>
    </ul>
  </div>
</locale-chooser>
```

Contract points:

- The rendered root is a `<div>` carrying the `locale-chooser` class
  hook plus the consumer's `class` attribute, mirrored from the host.
- The default button glyph is **U+1F310 GLOBE WITH MERIDIANS**
  followed by **U+FE0E VARIATION SELECTOR-15**
  (`&#127760;&#65038;`), exported as `GLOBE_WITH_MERIDIANS`. VS15
  requests the text presentation so the glyph renders monochrome
  rather than as a blue colour emoji, matching theme-chooser's ◑
  (U+25D1, which needs no selector). It is wrapped in
  `<span class="locale-chooser-icon" aria-hidden="true">` so it can
  never become the accessible name; the name comes from the button's
  `aria-label` alone.
- `aria-controls` on the button points at the list's `id`; the list
  carries `role="listbox"`, the same `aria-label`, and `tabindex="-1"`
  (focus moves to the list, never to an individual option).
- The list carries `hidden` while closed and `aria-expanded` on the
  button tracks the same state.
- `aria-activedescendant` appears on the `<ul>` **only while open**
  and points at the active option's `id`.
- `data-active` marks the active (keyboard-highlighted) option;
  `aria-selected` marks the chosen one. **They are different
  things** — the active option follows the arrow keys, the selected
  option is the applied locale.
- Each `<li>` carries `lang="{tagFor(locale)}"` (BCP 47 hyphen form)
  so assistive technology pronounces the option name in its own
  language. The button and the `<ul>` carry **no `lang`** — they are
  not locale-specific.
- Option and list ids come from `nextLocaleChooserId()`, so multiple
  instances on one page never collide.
- The hidden `<input>` carries `name` and the current value, so the
  control participates in form submission.

`lang` and (by default) `dir` are set on the resolved target on every
apply.

### 4.6 Re-exports

`index.ts` exports:

- `LocaleChooser` (the class)
- `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage` (pure helpers)
- `nextLocaleChooserId` (the id counter)
- `GLOBE_WITH_MERIDIANS` (the default button glyph)
- `defaultLocaleLabels`, `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`
  (re-exports from `./locales`)
- `type LocaleChooserProps`, `type LocaleChooserChangeDetail`

### 4.7 Keyboard contract

Implemented in JavaScript per the WAI-ARIA APG listbox pattern. The
platform provides none of it.

On the **button**:

| Key                        | Action                                                                 |
| -------------------------- | ---------------------------------------------------------------------- |
| `Tab` / `Shift+Tab`        | Move focus into / out of the control. The button is the only tab stop. |
| `ArrowDown` / `Enter` / `Space` | Open the listbox with the currently-selected option active (or index 0 when nothing is selected). |
| `ArrowUp`                  | Open the listbox with the **last** option active.                      |

Opening moves focus to the `<ul>`.

On the **listbox**:

| Key                | Action                                                                     |
| ------------------ | -------------------------------------------------------------------------- |
| `ArrowDown` / `ArrowUp` | Move the active option one step. **Clamps** at both ends — no wrapping. |
| `Home` / `End`     | Jump to the first / last option.                                            |
| `Enter` / `Space`  | Select the active option, apply it, close, and return focus to the button.  |
| `Escape`           | Close and return focus to the button **without** changing the value.        |
| `Tab`              | Close without stealing focus back, so focus lands where the user was headed.|
| printable character| Typeahead over the option **labels**; the buffer resets after 500 ms of no typing. Search runs forward from the active option and wraps once. |

Pointer and focus behaviour:

- Clicking an option selects it, applies it, and closes the list.
- Clicking the button toggles the list.
- Clicking outside the rendered root closes the list.
- Focus leaving the rendered root closes the list.

### 4.8 Custom rendering

Light DOM has no `<slot>` (that is a Shadow DOM mechanism), so
subclassing is the customisation surface. There are two tiers; the
full guide is [`../docs/custom-rendering.md`](../docs/custom-rendering.md).

**Tier 1 — override `renderButtonContent(): Node`.** This is the
HTML-helper equivalent of the `children` snippet / render-prop /
`ChildContent` the other frameworks pass. Whatever `Node` it returns
is placed inside the button, replacing the default
`<span class="locale-chooser-icon">`. `this.value`, `this.open`, and
`this.labelFor(...)` stand in for the `ChildArgs` those frameworks
supply. The base class still builds the button and the listbox, so
the aria wiring and the whole keyboard contract keep working. **This
is the recommended path** — it is the only one that cannot break
accessibility.

**Tier 2 — replace the rendering wholesale.** `#render()` is a
private field and genuinely cannot be overridden; a subclass that
wants a different structure must post-process after
`super.connectedCallback()` / `super.attributeChangedCallback()`. A
subclass that does this **takes over the entire accessibility
contract**, including the keyboard contract, because the base class's
handlers are bound to the DOM it built. The invariants such a
subclass must preserve are enumerated in
[`../docs/custom-rendering.md`](../docs/custom-rendering.md).

## 5. Behaviour

### 5.1 BCP 47 tag normalisation

`bcp47LocaleTag(locale)` replaces every `_` with `-`. No case
normalisation is applied. `el.tagFor(locale)` is the public
instance-level wrapper.

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

When `localeLabels[code]` is missing, `el.labelFor(code)` falls back
to:

1. `defaultLocaleLabels[code]` from the built-in `locales.ts` table.
2. `Intl.DisplayNames` for the consumer's environment locale, if
   available and non-empty. (Opportunistic; never throws.)
3. The raw `code`.

The resolved label is both the option's visible text and the string
the typeahead (§4.7) searches.

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

Two distinct update paths:

- **A `value` change never rebuilds the DOM.** Rebuilding while the
  listbox is open would destroy focus and the active descendant, so
  `value` only updates the state-carrying attributes — the hidden
  input's `value`, `aria-expanded`, `hidden`,
  `aria-activedescendant`, and each option's `aria-selected` /
  `data-active` — and then re-applies the locale.
- **A structural change rebuilds.** `locales`, `locale-labels`,
  `label`, `name`, and `class` recreate the rendered children. A
  rebuild cannot preserve focus inside the listbox, so it closes the
  list first.

### 5.8 SSR / no-JS

The element only registers in browsers with `customElements`. Without
JS, the element renders nothing. Consumers wanting flicker-free first
paint should set `lang` / `dir` on the document manually before
upgrade. The id counter is deterministic, so ids do not differ
between a server render and a client upgrade.

## 6. Accessibility

### 6.1 Roles and properties

- The rendered root `<div>` has no role; it is a styling container.
- The `<button>` carries `aria-label={label}`,
  `aria-haspopup="listbox"`, `aria-expanded`, and `aria-controls`.
- The `<ul>` carries `role="listbox"`, `aria-label={label}`,
  `tabindex="-1"`, and — while open — `aria-activedescendant`.
- Each `<li>` carries `role="option"`, a unique stable `id`,
  `aria-selected`, and `lang="{tagFor(locale)}"` (WCAG 3.1.2
  Language of Parts).
- The glyph span is `aria-hidden="true"`.
- The document root receives `lang` (WCAG 3.1.1 Language of Page)
  and `dir` for bidi layout.
- Focus sits on the `<ul>` while the list is open, never on an
  individual option; the active option is conveyed by
  `aria-activedescendant`.

### 6.2 Keyboard contract

See §4.7. It is implemented in JavaScript, not inherited from a
native control.

### 6.3 Known tradeoffs

Three, stated in full in
[`../docs/accessibility.md`](../docs/accessibility.md):

1. **Icon-only control.** The accessible name depends entirely on
   `aria-label`. There is no visible text label, so a vague `label`
   leaves the control unusable to screen-reader users, and the
   control fails WCAG 2.5.3 Label in Name unless the consumer adds a
   visible label of their own.
2. **Custom listbox < native `<select>`.** The previous native
   `<select>` got combobox semantics, platform keyboard behaviour,
   mobile OS pickers, and typeahead for free, battle-tested in every
   AT. A hand-rolled listbox is well-specified by the APG but has
   weaker and more variable support across screen readers and mobile
   browsers, and gets no native mobile picker UI.
3. **Glyph rendering is platform-dependent.** The glyph is a plain
   Unicode character with no bundled font (Lily ships no fonts or
   icon assets). It may render as colour emoji, a monochrome glyph,
   or tofu depending on platform fonts — the globe varies a lot.
   Consumers needing a guaranteed appearance should override
   `renderButtonContent()` with their own SVG.

Because the closed button shows only a glyph, the active locale is
not visible anywhere in the control. Surfacing it in visible text or
a polite live region is the documented default pattern, not an
optional extra.

### 6.4 Internationalisation

- `label`, `localeLabels`, and the consumer-supplied `locales` list
  are all passed through verbatim.
- No user-facing strings are hardcoded.
- Each rendered option name appears in its own `lang` context.

## 7. Testing acceptance criteria

`locale-chooser.test.ts` must assert every numbered item below. Tests
run under vitest + jsdom, and each test name starts with its clause
number. Numbering mirrors the Svelte sibling's §7.

### 7.1 Markup contract (§4.5)

1. The rendered root is a `<div class="locale-chooser">` containing a
   `<button type="button">` with `aria-haspopup="listbox"`,
   `aria-expanded="false"`, and an `aria-controls` that resolves to
   the rendered `<ul role="listbox">`. The button's content is
   `<span class="locale-chooser-icon" aria-hidden="true">` carrying
   U+1F310 GLOBE WITH MERIDIANS + U+FE0E VARIATION SELECTOR-15 (two
   codepoints), and `GLOBE_WITH_MERIDIANS` exports
   that same codepoint.
2. `aria-label` is the supplied `label`, on **both** the button and
   the listbox.
3. One `<li role="option">` per entry in `locales`, and a hidden
   `<input type="hidden">` carrying the supplied `name` and the
   resolved value. No placeholder option and no `<select>` element
   is rendered.
4. The listbox carries `hidden` and `tabindex="-1"` until the button
   is activated, after which `hidden` is gone and `aria-expanded` is
   `"true"`. Exactly one option is `aria-selected="true"` — the
   active locale. Clicking an option selects it, applies it
   (`lang`), closes the list, resets `aria-expanded` to `"false"`,
   and updates the hidden input's value.
5. Each option carries `lang="{tagFor(locale)}"` (BCP 47 hyphen
   form); the button and the `<ul>` carry no `lang`.
6. The visible option text is `localeLabels[code] ??
   defaultLocaleLabels[code] ?? Intl.DisplayNames ?? code`.

### 7.2 Pure helpers (§5.1, §5.6)

7. `bcp47LocaleTag("en_US")` === `"en-US"`.
8. `bcp47LocaleTag("zh_Hant_TW")` === `"zh-Hant-TW"`.
9. `bcp47LocaleTag("en")` === `"en"`.
10. `isRtlLocale("ar")`, `isRtlLocale("he_IL")`, and
    `isRtlLocale("uz_Arab_AF")` are all `true`.
11. `isRtlLocale("en")` and `isRtlLocale("fr_CA")` are both `false`.
12. `localeName("en_US")` returns `"English (United States)"` from
    the built-in table.

`matchNavigatorLanguage`'s exact-match and language-only-fallback
unit tests sit in the same group; they exercise §5.3 directly and
carry no separate clause number.

### 7.3 Locale application (§5.5)

13. After mount, `target.lang` (defaulting to
    `document.documentElement`) is the BCP 47 form of the resolved
    initial locale.
14. After mount, `target.dir` is `"rtl"` for an RTL initial locale
    and `"ltr"` otherwise (default `apply-dir`).
15. When `apply-dir="false"`, the `dir` attribute is not written.
16. Selecting a different option updates `target.lang`, updates
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

### 7.5 Element shape + property API (§4.2)

22. Setting `el.locales` as an array property mirrors the CSV
    attribute and re-renders.
23. Setting `el.localeLabels` as an object property mirrors the JSON
    attribute and re-renders; the consumer's `class` is appended to
    the root class hook (`class="locale-chooser my-picker"`); and
    option ids are unique across multiple instances on one page.

### 7.6 Keyboard contract (§4.7)

24. On the button, `ArrowDown`, `Enter`, and `Space` each open the
    listbox; opening moves focus to the `<ul>` and makes the
    selected option active (`aria-activedescendant` on the list plus
    `data-active` on the option); `ArrowUp` opens with the **last**
    option active.
25. On the listbox, `ArrowDown` / `ArrowUp` move the active
    descendant and **clamp** at both ends without wrapping;
    `Home` / `End` jump to the first / last option.
26. `Enter` selects the active option, applies it, closes the list,
    returns focus to the button, and removes
    `aria-activedescendant`; `Space` does the same.
27. `Escape` closes without changing the locale and returns focus to
    the button; `Tab` closes without stealing focus back to the
    button.
28. A printable character runs a typeahead over the option labels
    and moves the active descendant; a click outside the rendered
    root closes the listbox.

### 7.7 Custom rendering by subclass (§4.8)

29. A subclass overriding `renderButtonContent()` replaces the
    default glyph — the `locale-chooser-icon` span is gone and the
    returned node sits inside `button.locale-chooser-button` — while
    `aria-haspopup`, `aria-label`, and a resolvable `aria-controls`
    all survive, and `this.value`, `this.open`, and
    `this.labelFor(...)` are readable from inside the override. The
    hook re-runs on every structural rebuild **and** on every state
    sync (a `value` change, each open and close), so derived content
    never goes stale. The subclass still fires `localechange`
    through the base lifecycle.

## 8. Out-of-scope (future, not implemented here)

- A `<locale-view>` companion element.
- An `Intl.LocaleMatcher` integration.
- A built-in `Accept-Language` server helper.
- Shipping positioning CSS for the dropdown.

## 9. Tracking

- Package directory:
  `lily-design-system-html-helpers/lily-design-system-html-locale-chooser/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
  (or contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
- Canonical locale list: [locales.tsv](../locales.tsv) — 436 codes
  with English names
