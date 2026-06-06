# Concepts

How `<locale-picker>` thinks about locale, where it sits in your
stack, and what it deliberately leaves to you.

## Three orthogonal concerns

A web app changes language across three independent axes:

| Axis                       | What changes                                               | Owner                                  |
| -------------------------- | ---------------------------------------------------------- | -------------------------------------- |
| **Document language**      | The `lang` attribute on `<html>`. Screen readers, search engines, hyphenation, font selection. | `<locale-picker>` (this helper).     |
| **Writing direction**      | The `dir` attribute on `<html>`. Bidi text, scrollbar position, flexbox/grid mirror. | `<locale-picker>` (auto-detected from the locale; opt out with `apply-dir="false"`). |
| **Translated strings**     | The actual visible words on the page.                      | Your i18n library (FormatJS, i18next, raw `Intl.*`, Polyglot, etc.). |

The helper owns the first two and signals the third via a
`localechange` `CustomEvent` and the `lang` attribute (which most
i18n libraries don't read directly — they react to a current-locale
store).

The split matters because it lets you swap your i18n library
without rewriting the picker, and it lets the picker stay
headless: zero CSS, zero translation file format, zero
dependencies.

## What "headless" means here

The picker:

- Renders semantic HTML (`<fieldset>` + `<input type="radio">`)
  with exactly the ARIA the WAI-ARIA APG specifies for a radio
  group.
- Carries a stable kebab-case class hook (`locale-picker`,
  `locale-picker-option`, `locale-picker-option-label`) on every
  element so your CSS can target it without prefixes or
  specificity tricks.
- Ships **no** colour, spacing, typography, font, icon, or
  animation decisions. You supply all of that.
- Ships **no** translated strings. The `label` attribute and
  `locale-labels` attribute are passed through verbatim, and the
  built-in 436-row English-name table is the fallback for option
  labels (not for `label`).

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
       │   target.lang = BCP-47(value)              │
       │   target.dir  = rtl|ltr                    │
       │   localStorage.setItem(...)                │
       │   dispatchEvent("localechange", …)         │
       └───────────────────────────────────────────┘
```

DOM mutation and storage are side effects, so they belong in
lifecycle callbacks, not in property getters.

## Why `<fieldset role="radiogroup">` by default

Three reasons:

1. **Discoverability**. The full set of options surfaces to
   assistive tech on first focus into the group, while a
   `<select>` requires the user to open the popover before the
   choices are announced.
2. **Symmetry with `<theme-picker>`**. The sibling helper uses the
   same shape, so the two compose visually and semantically
   without surprises.
3. **Escape hatch is one subclass away**. Extending `LocalePicker`
   and overriding the children gives full control — the lifecycle
   stays on the superclass.

For long locale lists (>~12), subclass to render a `<select>` or
combobox. See `examples/02-select.html`.

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
  the picker degrades to the default.

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
   `document.documentElement.lang` and `.dir`. Drive a radio
   change and assert again.
3. **Bindable + change event** — drive `el.value` programmatically
   and assert the same DOM observations; capture the
   `localechange` CustomEvent's detail.

See `../locale-picker.test.ts` for the reference suite that covers
every `spec.md` §7 acceptance item.

## Custom-element-specific notes

### `setAttribute` vs property assignment

Both work; both feed through `attributeChangedCallback`. The
property setters are convenient because they handle CSV / JSON
encoding for `locales` and `locale-labels`. The attribute form is
right for declarative HTML markup.

### `customElements.whenDefined`

When you want to interact with the picker from a script that loads
before the picker's module:

```ts
await customElements.whenDefined("locale-picker");
const picker = document.querySelector("locale-picker") as LocalePicker;
picker.value = "fr";
```

Without `whenDefined`, the picker might still be a "stub" element
(`HTMLElement` with no methods), in which case `picker.value = …`
goes through a generic attribute path.

### `defineModel` vs explicit attribute writes

The picker uses `setAttribute` + `attributeChangedCallback` for
attribute changes and a manual setter for property assignments.
There is no framework abstraction; the platform handles
reactivity.

### Why the change event is named `localechange`

The DOM has a `change` event already; emitting `change` from a
custom element would compete with native control events. The
namespaced `localechange` is unambiguous, and parallels the
`themechange` event from `<theme-picker>`.
