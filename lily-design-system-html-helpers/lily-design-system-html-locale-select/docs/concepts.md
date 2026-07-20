# Concepts

How `<locale-select>` thinks about locale, where it sits in your
stack, and what it deliberately leaves to you.

## Three orthogonal concerns

A web app changes language across three independent axes:

| Axis                       | What changes                                               | Owner                                  |
| -------------------------- | ---------------------------------------------------------- | -------------------------------------- |
| **Document language**      | The `lang` attribute on `<html>`. Screen readers, search engines, hyphenation, font selection. | `<locale-select>` (this helper).     |
| **Writing direction**      | The `dir` attribute on `<html>`. Bidi text, scrollbar position, flexbox/grid mirror. | `<locale-select>` (auto-detected from the locale; opt out with `apply-dir="false"`). |
| **Translated strings**     | The actual visible words on the page.                      | Your i18n library (FormatJS, i18next, raw `Intl.*`, Polyglot, etc.). |

The helper owns the first two and signals the third via a
`localechange` `CustomEvent` and the `lang` attribute (which most
i18n libraries don't read directly — they react to a current-locale
store).

The split matters because it lets you swap your i18n library
without rewriting the select, and it lets the select stay
headless: zero CSS, zero translation file format, zero
dependencies.

## What "headless" means here

The select:

- Renders semantic HTML — a `<button>` and a `<ul role="listbox">`
  of `<li role="option">` items — wired up per the WAI-ARIA APG
  listbox pattern.
- Carries a stable kebab-case class hook (`locale-select`,
  `locale-select-button`, `locale-select-icon`, `locale-select-list`,
  `locale-select-option`) on every element so your CSS can target it
  without prefixes or specificity tricks.
- Ships **no** colour, spacing, typography, font, icon, or
  animation decisions. You supply all of that — including, notably,
  the dropdown's **positioning**. Until you give the root
  `position: relative` and the list `position: absolute`, the list
  renders in normal flow.
- Ships **no** translated strings. The `label` attribute and
  `locale-labels` attribute are passed through verbatim, and the
  built-in 436-row English-name table is the fallback for option
  labels (not for `label`).

Headless here does **not** mean behaviourless. The keyboard contract
is the one thing the element implements rather than delegates:
because there is no native `<select>` underneath, arrow keys, Home /
End, Enter / Space / Escape / Tab, and typeahead are all its own
JavaScript. See [spec/index.md §4.7](../spec/index.md#47-keyboard-contract).

## The lifecycle

Each instance manages a single bindable `value`:

```
       ┌───────────────────────────────────────────┐
       │   connectedCallback — resolves once        │
       │                                            │
   value (consumer) ─── if empty ───► storage ──► navigator ──► defaultValue ──► "en" ──► locales[0]
       │                                            │
       │  writes back via setAttribute("value", …)  │
       └───────────────────────────────────────────┘
                       │
                       ▼
       ┌───────────────────────────────────────────┐
       │   attributeChangedCallback("value", …)     │
       │                                            │
       │   #syncState()  — attributes, not a rebuild│
       │   target.lang = BCP-47(value)              │
       │   target.dir  = rtl|ltr                    │
       │   localStorage.setItem(...)                │
       │   dispatchEvent("localechange", …)         │
       └───────────────────────────────────────────┘
```

DOM mutation and storage are side effects, so they belong in
lifecycle callbacks, not in property getters.

Note the `#syncState()` step. A `value` change deliberately does
**not** rebuild the rendered DOM: the user selects a locale while the
listbox is open and focused, and a rebuild would destroy the focused
`<ul>` and the element `aria-activedescendant` points at. Only
structural attributes (`locales`, `locale-labels`, `label`, `name`,
`class`) rebuild, and those close the list first.

## Why an icon button and a listbox

The control used to be a native `<select>`. It is now an icon button
that opens a `role="listbox"` dropdown. Two reasons:

1. **Compactness at any locale count.** A glyph-sized trigger stays
   the same width whether you ship 2 locales or 400, and it composes
   into a dense utility bar next to the sibling `<theme-select>`,
   which uses the identical shape.
2. **Full control of the option list's presentation.** A native
   `<select>`'s popup is drawn by the OS and cannot be styled,
   grouped, or annotated. A `<ul>` of `<li>` items is ordinary DOM.

**This trade is not free, and the package does not pretend
otherwise.** A native `<select>` gave combobox semantics, platform
keyboard behaviour, the mobile OS picker, and battle-tested
assistive-technology support at zero cost. A hand-rolled listbox is
well-specified by the APG but has weaker and more variable support,
particularly on mobile screen readers, and gets no native picker. If
that trade is wrong for your audience, render a native `<select>` of
your own against `el.locales` / `el.value` and let this element handle
only the application and persistence — every helper in this catalog
now uses the listbox shape, so there is no longer a native-`<select>`
sibling to copy. The full accounting is in
[accessibility.md](./accessibility.md#tradeoffs).

For custom presentation, subclass: override `renderButtonContent()`
for different button content (safe), or post-process the rendered
children for a different structure (you then own the accessibility
and keyboard contracts). See
[custom-rendering.md](./custom-rendering.md),
`examples/03-buttons.html`, and `examples/10-combobox.html`.

## Why a separate `value` and `target.lang`

The bindable `value` is in **consumer form** — whatever you put
into `locales` (`en_US` or `en-US` or `en`). It round-trips
losslessly through the `value` attribute and the `localechange`
event detail.

The `target.lang` attribute is in **BCP 47 form** — always hyphens
(`en-US`). This is what `<html>` and the HTML spec require.

Keeping them separate means:

- Your existing locale store (CLDR-style `en_US`) stays untouched.
- `<html lang>` is spec-compliant without consumer code touching
  the conversion.
- Round-trips through `value` are lossless.

## Where storage fits in

`storage-key` is optional and opt-in. When set:

- Selection writes synchronously to `localStorage`.
- On a fresh mount with no `value` attribute, the stored value is
  read back.
- Storage errors (private mode, quota) are swallowed silently;
  the select degrades to the default.

If you have a server (Astro SSR, Node + Express, etc.), prefer a
cookie instead — it survives the round-trip and avoids a flash of
default locale on first paint. Pass the cookie value as the initial
`value` attribute. See [docs/ssr.md](./ssr.md).

## Where navigator detection fits in

`detect-from-navigator` is opt-in. When set, the first mount
inspects `navigator.languages` and picks the first entry whose
language matches something in your `locales` list. The match
algorithm is simple (exact first, language-only second) — not
RFC 4647 best-fit. If you need stronger negotiation, run your own
resolver and pass the result as `value`.

## How to test it

Three layers, mirroring the lifecycle:

1. **Pure helpers** — `bcp47LocaleTag`, `isRtlLocale`,
   `localeName`, `matchNavigatorLanguage` are pure functions.
   Unit-test them in isolation.
2. **DOM contract** — after mount, assert
   `document.documentElement.lang` and `.dir`. Drive a selection by
   clicking the button and then an option (there is no `select.value`
   to set) and assert again.
3. **Keyboard contract** — dispatch `keydown` events at the button
   and the `<ul>`, and assert `aria-expanded`, `hidden`,
   `aria-activedescendant`, and `document.activeElement`.
4. **Bindable + change event** — drive `el.value` programmatically
   and assert the same DOM observations; capture the
   `localechange` CustomEvent's detail.

See `../locale-select.test.ts` for the reference suite that covers
every `spec/index.md` §7 acceptance item.

## Custom-element-specific notes

### `setAttribute` vs property assignment

Both work; both feed through `attributeChangedCallback`. The
property setters are convenient because they handle CSV / JSON
encoding for `locales` and `locale-labels`. The attribute form is
right for declarative HTML markup.

### `customElements.whenDefined`

When you want to interact with the select from a script that loads
before the select's module:

```ts
await customElements.whenDefined("locale-select");
const select = document.querySelector("locale-select") as LocaleSelect;
select.value = "fr";
```

Without `whenDefined`, the select might still be a "stub" element
(`HTMLElement` with no methods), in which case `select.value = …`
goes through a generic attribute path.

### `defineModel` vs explicit attribute writes

The select uses `setAttribute` + `attributeChangedCallback` for
attribute changes and a manual setter for property assignments.
There is no framework abstraction; the platform handles
reactivity.

### Why the change event is named `localechange`

The DOM has a `change` event already; emitting `change` from a
custom element would compete with native control events. The
namespaced `localechange` is unambiguous, and parallels the
`themechange` event from `<theme-select>`.

---

Lily™ and Lily Design System™ are trademarks.
