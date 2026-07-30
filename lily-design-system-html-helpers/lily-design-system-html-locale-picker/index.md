# `<locale-picker>` (HTML helper)

A reusable, headless vanilla HTML/JS locale picker that applies the
chosen locale to the document root via `lang` and `dir`, with
optional `localStorage` persistence and `navigator.languages`
detection. Packaged as a **web component (custom element)**.

The control renders an **icon button that opens a dropdown listbox**
(WAI-ARIA APG listbox pattern) — not a native `<select>`.

The single source of truth is [spec/index.md](./spec/index.md). This file is the
comprehensive user guide. For topic deep-dives see [docs/](./docs/)
and for working code see [examples/](./examples/).

## Table of contents

- [Why this exists](#why-this-exists)
- [Install](#install)
- [Quick start](#quick-start)
- [Rendered markup](#rendered-markup)
- [Styling (required reading)](#styling-required-reading)
- [Keyboard](#keyboard)
- [How it works](#how-it-works)
- [Default locale](#default-locale)
- [Attributes](#attributes)
- [JS properties and methods](#js-properties-and-methods)
- [Events](#events)
- [BCP 47 normalisation](#bcp-47-normalisation)
- [RTL auto-detection](#rtl-auto-detection)
- [Built-in locale data](#built-in-locale-data)
- [Custom rendering](#custom-rendering)
- [Persistence](#persistence)
- [Accessibility](#accessibility)
- [SSR and static-site generation](#ssr-and-static-site-generation)
- [Recipes](#recipes)
- [Testing](#testing)

## Why this exists

A web app changes language across three independent axes:

| Axis                   | What changes                          | Owner                                                                |
| ---------------------- | ------------------------------------- | -------------------------------------------------------------------- |
| **Document language**  | The `lang` attribute on `<html>`.     | `<locale-picker>` (this helper).                                    |
| **Writing direction**  | The `dir` attribute on `<html>`.      | `<locale-picker>` (auto-detected; opt out via `apply-dir="false"`). |
| **Translated strings** | The actual visible words on the page. | Your i18n library (FormatJS, i18next, raw `Intl.*`).                 |

The helper owns the first two and signals the third via a
`localechange` `CustomEvent` and the `lang` attribute (which most
i18n libraries don't read directly — they react to a current-locale
ref or store).

The split matters because it lets you swap your i18n library
without rewriting the select, and it lets the select stay headless:
zero CSS, zero string tables (except the built-in English-name
fallback table behind the `Intl`-derived endonym defaults), zero
dependencies.

The element is a direct port of the Svelte canonical
`lily-design-system-svelte-locale-picker`. APIs and behaviour match;
only the framework idioms differ.

## Install

```ts
// One side-effect import registers <locale-picker> globally:
import "./lily-design-system-html-locale-picker";

// Or grab the class + helpers + types:
import {
  LocalePicker,
  bcp47LocaleTag,
  isRtlLocale,
  localeName,
  matchNavigatorLanguage,
  defaultLocaleLabels,
  RTL_LANGUAGE_TAGS,
  GLOBE_WITH_MERIDIANS,
  nextLocalePickerId,
  type LocalePickerProps,
  type LocalePickerChangeDetail,
} from "./lily-design-system-html-locale-picker";
```

The barrel guards registration with
`customElements.get("locale-picker")` so re-imports and SSR contexts
don't throw.

## Quick start

```html
<script type="module" src="/dist/locale-picker.js"></script>

<style>
  /* The package ships no CSS. Without at least this much, the
       dropdown renders in normal flow and pushes the page around. */
  .locale-picker {
    position: relative;
    display: inline-block;
  }
  .locale-picker-list {
    position: absolute;
    inset-inline-start: 0;
    inset-block-start: calc(100% + 0.25rem);
    z-index: 10;
    margin: 0;
    padding: 0.25rem 0;
    list-style: none;
    background: #ffffff;
    border: 1px solid #4c6272;
  }
  .locale-picker-list[hidden] {
    display: none;
  }
  .locale-picker-option[data-active] {
    background: #f0f4f5;
  }
  .locale-picker-option[aria-selected="true"]::after {
    content: " ✓";
  }
</style>

<locale-picker
  label="Language"
  locales="en,en_US,fr,fr_CA,ar,he"
  storage-key="lily-locale"
  detect-from-navigator
></locale-picker>

<p class="locale-picker-status" aria-live="polite">Active language: English</p>

<script type="module">
  import { localeName } from "/dist/locale-picker.js";

  await customElements.whenDefined("locale-picker");

  const status = document.querySelector(".locale-picker-status");

  document
    .querySelector("locale-picker")
    .addEventListener("localechange", (e) => {
      status.textContent = `Active language: ${localeName(e.detail.locale)}`;
    });
</script>
```

**The status line is part of the pattern, not an optional extra.**
The closed control shows only a glyph, so this line is the only place
the current selection is displayed and announced. It also doubles as
the visible label that WCAG 2.5.3 Label in Name wants next to an
icon-only control. `aria-live="polite"` speaks on each change and
stays silent on first paint — which is why the initial text is
authored in the markup rather than written by JS on startup. Making
it visible (rather than `sr-only`) serves sighted and
cognitive-accessibility users too. See
[`docs/accessibility.md`](./docs/accessibility.md) for the full
rationale and the visually-hidden variant.

Note that with `storage-key` or `detect-from-navigator` set, the
resolved initial locale may not be the one authored in the markup.
Render that opening text from the same server-side/build-time value
you pass as the `value` attribute — see
[`docs/ssr.md`](./docs/ssr.md).

When the user picks `ar`, the element:

- sets `lang="ar"` on `<html>`,
- sets `dir="rtl"` on `<html>` (auto-detected from the locale),
- writes `"ar"` to `localStorage["lily-locale"]`,
- dispatches `new CustomEvent("localechange", { detail: { locale: "ar" }, bubbles: true, composed: true })`.

The element does **not** translate strings — that is the consumer's
i18n library. Wire `localechange` (or read `el.value`) to drive
your library:

```ts
const select = document.querySelector("locale-picker")!;
select.addEventListener("localechange", (e) => {
  const { locale } = (e as CustomEvent<{ locale: string }>).detail;
  // i18n.setLocale(locale);
});
```

## Rendered markup

The element renders this into its light DOM:

```html
<locale-picker label="Locale" locales="en,fr,ar">
  <div class="locale-picker">
    <input type="hidden" name="locale" value="en" />
    <button
      type="button"
      class="locale-picker-button"
      aria-label="Locale"
      aria-haspopup="listbox"
      aria-expanded="false"
      aria-controls="locale-picker-1-list"
    >
      <span class="locale-picker-icon" aria-hidden="true"
        >&#127760;&#65038;</span
      >
    </button>
    <ul
      class="locale-picker-list"
      id="locale-picker-1-list"
      role="listbox"
      aria-label="Locale"
      tabindex="-1"
      hidden
    >
      <li
        class="locale-picker-option"
        id="locale-picker-1-option-0"
        role="option"
        aria-selected="true"
        data-active
        lang="en"
      >
        English
      </li>
      <li
        class="locale-picker-option"
        id="locale-picker-1-option-1"
        role="option"
        aria-selected="false"
        lang="fr"
      >
        français
      </li>
      <li
        class="locale-picker-option"
        id="locale-picker-1-option-2"
        role="option"
        aria-selected="false"
        lang="ar"
      >
        العربية
      </li>
    </ul>
  </div>
</locale-picker>
```

Points worth internalising:

- The default glyph is **U+1F310 GLOBE WITH MERIDIANS** followed by
  **U+FE0E VARIATION SELECTOR-15** (which requests the monochrome
  text presentation, matching theme-picker's ◑), exported as
  `GLOBE_WITH_MERIDIANS`. It is `aria-hidden="true"`; the accessible
  name comes from the button's `aria-label` alone.
- `aria-activedescendant` appears on the `<ul>` **only while open**.
- `data-active` is the keyboard-highlighted option; `aria-selected`
  is the applied one. They are different things, and consumer CSS
  should style them differently.
- Default option text is the locale's endonym, and an `<li>` carries
  `lang` only when its text is that derived endonym; the button and
  the `<ul>` never carry `lang`.
- The hidden `<input>` preserves form participation and the `name`
  attribute.
- List and option ids come from an incrementing module counter
  (`nextLocalePickerId()`), so multiple instances never collide and
  ids are stable under SSR.

## Styling (required reading)

The package ships **no CSS at all**, which means **the dropdown has
no positioning**. Until you supply it, the `<ul>` renders in normal
flow and shoves the rest of the page down when it opens.

Class hooks:

| Hook                     | Element                     |
| ------------------------ | --------------------------- |
| `.locale-picker`        | The rendered `<div>` root.  |
| `.locale-picker-button` | The trigger `<button>`.     |
| `.locale-picker-icon`   | The default glyph `<span>`. |
| `.locale-picker-list`   | The `<ul role="listbox">`.  |
| `.locale-picker-option` | Each `<li role="option">`.  |

Plus the state selectors `[data-active]` and `[aria-selected="true"]`.

A minimal working stylesheet:

```css
.locale-picker {
  position: relative;
  display: inline-block;
}

.locale-picker-button {
  font: inherit;
  line-height: 1;
  padding: 0.5rem;
  background: #ffffff;
  border: 1px solid #4c6272;
  border-radius: 4px;
  cursor: pointer;
}

.locale-picker-list {
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: calc(100% + 0.25rem);
  z-index: 10;
  margin: 0;
  padding: 0.25rem 0;
  list-style: none;
  min-inline-size: 12rem;
  max-block-size: 16rem;
  overflow-y: auto;
  background: #ffffff;
  border: 1px solid #4c6272;
  border-radius: 4px;
}

/* The element toggles the `hidden` attribute; never override it away. */
.locale-picker-list[hidden] {
  display: none;
}

.locale-picker-option {
  padding: 0.375rem 0.75rem;
  cursor: pointer;
}
.locale-picker-option[data-active] {
  background: #f0f4f5;
}
.locale-picker-option[aria-selected="true"]::after {
  content: " ✓";
}
```

Use logical properties (`inset-inline-start`, not `left`) so the
dropdown flips correctly when the user picks an RTL locale.

There is no `.locale-picker-placeholder` hook. It belonged to the
0.3.0 native-`<select>` rendering and was removed with it.

## Keyboard

On the button: `ArrowDown` / `Enter` / `Space` open with the selected
option active; `ArrowUp` opens with the last option active. Opening
moves focus to the `<ul>`.

On the listbox: `ArrowDown` / `ArrowUp` move the active option and
clamp (no wrapping); `Home` / `End` jump to the ends; `PageUp` /
`PageDown` move by ten (clamped); `Enter` / `Space` select, apply,
close, and return focus to the button; `Escape` closes without
changing the value; `Tab` puts focus on the button first and then
closes — without cancelling the key, so the default Tab proceeds from
the picker's position; printable characters run a 500 ms typeahead
over the option labels, where a repeated character cycles through its
matches and differing characters refine from the active option.

Full table: [spec/index.md §4.7](./spec/index.md#47-keyboard-contract).

## How it works

On every locale change the select performs four steps, in order:

1. **Resolve the target.** Default is `document.documentElement`
   (the `<html>` tag); override with `el.target` for region-scoped
   localisation.
2. **Write `lang`.** The select normalises the consumer-form code
   to BCP 47 hyphen form (`en_US` → `en-US`) before writing.
3. **Write `dir`.** Auto-detected from the locale's script subtag
   or base language; skipped if `apply-dir="false"`.
4. **Persist + notify**: if `storage-key` is set, write to
   `localStorage`; dispatch `localechange` with the
   consumer-form code.

All four steps are SSR-safe — the element only mutates the DOM
inside `connectedCallback` and `attributeChangedCallback`, which
never run in Node.

A `value` change never rebuilds the rendered DOM; it only updates the
state-carrying attributes (`aria-selected`, `data-active`,
`aria-expanded`, the hidden input) and re-applies. Rebuilding while
the listbox is open would destroy focus and the active descendant.
Structural attributes (`locales`, `locale-labels`, `label`, `name`,
`class`) do rebuild, and close the list first.

## Default locale

The default locale is `"en"` whenever `"en"` appears in your
`locales` list. The full resolution order on first
`connectedCallback` is:

1. `value` attribute (if non-empty)
2. `localStorage[storage-key]` (if `storage-key` is set and readable)
3. `matchNavigatorLanguage(navigator.languages, locales)` (if
   `detect-from-navigator` is present)
4. `default-value` attribute
5. `"en"` (if present in `locales`)
6. `locales[0]`
7. `""` — nothing is applied; the select waits for user interaction

## Attributes

The complete table is in [spec/index.md §4.1](./spec/index.md#41-observed-attributes).
Highlights:

| Attribute               | Type          | Required | Notes                                                |
| ----------------------- | ------------- | -------- | ---------------------------------------------------- |
| `label`                 | string        | yes      | `aria-label` on **both** the button and the listbox. |
| `locales`               | string (CSV)  | yes      | Available codes.                                     |
| `value`                 | string        | no       | Current code (consumer form).                        |
| `default-value`         | string        | no       | Initial when nothing else applies.                   |
| `storage-key`           | string        | no       | `localStorage` persistence.                          |
| `detect-from-navigator` | boolean attr  | no       | Match `navigator.languages`.                         |
| `name`                  | string        | no       | On the hidden `<input>`; defaults to `"locale"`.     |
| `apply-dir`             | boolean attr  | no       | `"false"` suppresses `dir` writes.                   |
| `locale-labels`         | string (JSON) | no       | Per-code label overrides.                            |
| `class`                 | string        | no       | Extra class on the `<div>` root.                     |

There is no `placeholder` attribute; it was removed along with the
native `<select>` it existed to pin.

## JS properties and methods

Every observed attribute mirrors a JS property of the same name in
camelCase. Notable shapes:

```ts
const select = document.querySelector("locale-picker") as LocalePicker;

select.locales = ["en", "fr", "ar"]; // CSV-encoded in attribute
select.localeLabels = { en: "English", fr: "Français", ar: "العربية" };
select.detectFromNavigator = true; // mirrors boolean attribute
select.applyDir = false; // → apply-dir="false"
select.target = document.querySelector("section.panel") as HTMLElement;
```

`el.target` accepts `HTMLElement | null` and has no attribute form
(HTMLElement references are not serialisable).

The listbox surface is public too:

```ts
select.open; // boolean — is the list open?
select.listId; // "locale-picker-1-list"
select.optionId(2); // "locale-picker-1-option-2"
select.openList(); // open with the selected option active
select.openList(0); // open with a specific option active
select.closeList(); // close and refocus the button
select.closeList(false); // close without refocusing
select.labelFor("fr"); // "français" — the endonym, via localeEndonym()
select.tagFor("fr_CA"); // "fr-CA"
select.optionLang("fr"); // "fr" when the label is the endonym, else ""
```

`renderButtonContent(): Node` is the overridable rendering hook — see
[Custom rendering](#custom-rendering).

## Events

| Event          | Detail               | Bubbles | Composed |
| -------------- | -------------------- | ------- | -------- |
| `localechange` | `{ locale: string }` | yes     | yes      |

The detail carries the **consumer-form** code (`en_US` if the
consumer used `en_US`). The `<html lang>` attribute uses the BCP 47
hyphen form (`en-US`).

```ts
select.addEventListener("localechange", (e) => {
  const { locale } = (e as CustomEvent<{ locale: string }>).detail;
  console.log("locale is now", locale);
});
```

Because the event bubbles, `document.body.addEventListener(...)`
also works.

## BCP 47 normalisation

The element accepts whichever form you prefer in the `locales`
attribute (`en_US`, `en-US`, or `en`) and converts to the hyphen
form when writing to the DOM. The `value` attribute / property
preserves your original form so round-trips are lossless.

```ts
bcp47LocaleTag("en_US"); // "en-US"
bcp47LocaleTag("zh_Hant_TW"); // "zh-Hant-TW"
```

Topic guide: [`docs/bcp47.md`](./docs/bcp47.md).

## RTL auto-detection

`isRtlLocale(locale)` returns `true` for any locale whose base
language is one of `ar`, `arc`, `ckb`, `dv`, `fa`, `he`, `iw`, `ji`,
`ks`, `ku`, `mzn`, `ps`, `sd`, `ug`, `ur`, `yi`, OR whose script
subtag is one of `Arab`, `Hebr`, `Thaa`, `Syrc`, `Nkoo`, `Mong`,
`Adlm`.

Pass `apply-dir="false"` if you want full control of `dir` yourself.

Topic guide: [`docs/rtl.md`](./docs/rtl.md).

## Labels: endonyms by default

Default option labels are **endonyms** — each language named in
itself, "Cymraeg" not "Welsh" — resolved by the exported
`localeEndonym()` via `Intl.DisplayNames` asked *in that language*.
The user who needs a language menu is the one who cannot read the
page's language, and the exonym means nothing to them. Resolution
order: your `locale-labels` → the endonym → the built-in English
table → an environment `Intl.DisplayNames` lookup → the raw code.

An option carries a `lang` attribute only when its text is the
derived endonym: `lang` is a claim about the text's language, and the
English word "Arabic" must never be handed to an Arabic speech
engine. Consumer-labelled options carry no `lang`.

## Built-in locale data

`locales.ts` ships 436 codes from `locales.tsv` mapped to English
names; `el.labelFor(code)` falls back to this table when
`locale-labels` has no entry and the runtime has no
`Intl.DisplayNames` data for the endonym.

```ts
import {
  defaultLocaleLabels,
  RTL_LANGUAGE_TAGS,
} from "./lily-design-system-html-locale-picker";

console.log(defaultLocaleLabels["en_US"]); // "English (United States)"
console.log(RTL_LANGUAGE_TAGS.has("ar")); // true
```

## Custom rendering

Light DOM has no `<slot>` (that is a Shadow DOM mechanism), so
**subclassing** is the customisation surface. There are two tiers.

**Tier 1 — override `renderButtonContent()`.** This is the direct
equivalent of the `children` snippet / render prop the Svelte, React,
and Vue helpers accept, and it is the recommended path: the base
class still builds the button and the listbox, so the aria wiring and
the whole keyboard contract keep working.

```ts
import { LocalePicker } from "./lily-design-system-html-locale-picker";

class FlagLocalePicker extends LocalePicker {
  renderButtonContent(): Node {
    const span = document.createElement("span");
    span.textContent = this.labelFor(this.value);
    span.dataset.open = String(this.open);
    return span;
  }
}

customElements.define("flag-locale-picker", FlagLocalePicker);
```

The hook re-runs on structural rebuilds _and_ on every state sync (a
`value` change, each open and close), so button content that depends
on `this.value` or `this.open` — like the example above — stays
current on its own. See
[`docs/custom-rendering.md`](./docs/custom-rendering.md#timing--when-the-hook-re-runs).

**Tier 2 — replace the rendering wholesale** by post-processing after
`super.connectedCallback()`. A subclass that does this takes over the
entire accessibility contract, including the keyboard contract.

Full guide, including the invariants a tier-2 subclass must preserve:
[`docs/custom-rendering.md`](./docs/custom-rendering.md).

Working examples:
[`examples/03-buttons.html`](./examples/03-buttons.html),
[`examples/05-nhs-style.html`](./examples/05-nhs-style.html),
[`examples/10-combobox.html`](./examples/10-combobox.html).

## Persistence

Pass `storage-key` to persist the active code to `localStorage`. On
a fresh mount the select reads back the stored code as part of the
initial-value resolution.

Errors writing to or reading from `localStorage` (private mode,
quota, disabled storage) are silently swallowed.

For cookie-based persistence (so SSR can read the locale before
first paint), see [`docs/ssr.md`](./docs/ssr.md) and
[`examples/08-ssr-cookie.html`](./examples/08-ssr-cookie.html).

## Accessibility

- The trigger is a `<button>` with `aria-label={label}`,
  `aria-haspopup="listbox"`, `aria-expanded`, and `aria-controls`.
  The `<ul>` carries `role="listbox"` and the same `aria-label`.
- Focus sits on the `<ul>` while open; the active option is conveyed
  by `aria-activedescendant`, never by focusing the `<li>`.
- The full APG listbox keyboard contract is implemented in JS — the
  platform provides none of it.
- Each `<li>` carries `lang="…"` so its name is pronounced in the
  right language (WCAG 3.1.2 Language of Parts). The button and the
  `<ul>` carry none.
- The document root carries `lang` (WCAG 3.1.1) and (by default)
  `dir` for bidi layout.
- **Three tradeoffs**, stated in full in
  [`docs/accessibility.md`](./docs/accessibility.md): the control is
  icon-only, so `label` is load-bearing and WCAG 2.5.3 Label in Name
  needs a visible label of your own; a hand-rolled listbox has weaker
  and more variable AT support than the native `<select>` this
  replaced, and gets no native mobile picker; and the Unicode glyph
  renders differently — or not at all — depending on platform fonts.
- The compensating status region shown in
  [Quick start](#quick-start) is the **default pattern** — ship it
  unless you have a specific reason not to.

Topic guide: [`docs/accessibility.md`](./docs/accessibility.md).

## SSR and static-site generation

The element compiles cleanly under static-site generators. On the
server no lifecycle hook runs; the SSG emits the literal
`<locale-picker>` tag, and the browser upgrades it after the JS
loads.

For zero-flicker static rendering, resolve the locale at build time
or via cookie (dynamic SSR) and pre-render `<html lang dir>` plus
the matching `<locale-picker value="…">` host. The select reads the
inlined `value` and applies the same locale without re-resolving.

See [`docs/ssr.md`](./docs/ssr.md) and
[`examples/08-ssr-cookie.html`](./examples/08-ssr-cookie.html).

## Recipes

- Wire to FormatJS, i18next, or raw `Intl.*`. See
  [`docs/i18n-integration.md`](./docs/i18n-integration.md).
- Scope the locale to a region instead of `<html>`. See
  [`examples/09-scoped-target.html`](./examples/09-scoped-target.html).
- Swap the dropdown for a filter-as-you-type combobox. See
  [`examples/10-combobox.html`](./examples/10-combobox.html).

## Testing

```sh
pnpm test
```

Exercises every numbered acceptance criterion in
[spec/index.md §7](./spec/index.md#7-testing-acceptance-criteria).

## Files in this directory

| File                     | Purpose                                          |
| ------------------------ | ------------------------------------------------ |
| `spec/index.md`          | Single source of truth.                          |
| `AGENTS.md`              | Fast-index pointer; loads the AGENTS bundle.     |
| `AGENTS/`                | Topic-by-topic agent files.                      |
| `CLAUDE.md`              | `@AGENTS.md`.                                    |
| `locale-picker.ts`      | The custom-element class.                        |
| `locale-picker.test.ts` | vitest suite.                                    |
| `locales.ts`             | Built-in 436-row code → English name table.      |
| `locales.tsv`            | Canonical source for `locales.ts`.               |
| `index.ts`               | Barrel + side-effectful `customElements.define`. |
| `index.md`               | This file.                                       |
| `docs/`                  | Deep-dive topic guides.                          |
| `examples/`              | Runnable `.html` files.                          |
| `CHANGELOG.md`           | Version history.                                 |

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause. Contact
joel@joelparkerhenderson.com for other terms.

---

Lily™ and Lily Design System™ are trademarks.
