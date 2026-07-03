# `<locale-select>` (HTML helper)

A reusable, headless vanilla HTML/JS locale select that applies the
chosen locale to the document root via `lang` and `dir`, with
optional `localStorage` persistence and `navigator.languages`
detection. Packaged as a **web component (custom element)**.

The single source of truth is [spec/index.md](./spec/index.md). This file is the
comprehensive user guide. For topic deep-dives see [docs/](./docs/)
and for working code see [examples/](./examples/).

## Table of contents

- [Why this exists](#why-this-exists)
- [Install](#install)
- [Quick start](#quick-start)
- [How it works](#how-it-works)
- [Default locale](#default-locale)
- [Attributes](#attributes)
- [JS properties](#js-properties)
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

| Axis                  | What changes                                       | Owner                                                 |
| --------------------- | -------------------------------------------------- | ----------------------------------------------------- |
| **Document language** | The `lang` attribute on `<html>`.                  | `<locale-select>` (this helper).                      |
| **Writing direction** | The `dir` attribute on `<html>`.                   | `<locale-select>` (auto-detected; opt out via `apply-dir="false"`). |
| **Translated strings**| The actual visible words on the page.              | Your i18n library (FormatJS, i18next, raw `Intl.*`).  |

The helper owns the first two and signals the third via a
`localechange` `CustomEvent` and the `lang` attribute (which most
i18n libraries don't read directly — they react to a current-locale
ref or store).

The split matters because it lets you swap your i18n library
without rewriting the select, and it lets the select stay headless:
zero CSS, zero string tables (except the built-in
English-name fallback table), zero dependencies.

The element is a direct port of the Svelte canonical
`lily-design-system-svelte-locale-select`. APIs and behaviour match;
only the framework idioms differ.

## Install

```ts
// One side-effect import registers <locale-select> globally:
import "./lily-design-system-html-locale-select";

// Or grab the class + helpers + types:
import {
    LocaleSelect,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    type LocaleSelectProps,
    type LocaleSelectChangeDetail,
} from "./lily-design-system-html-locale-select";
```

The barrel guards registration with
`customElements.get("locale-select")` so re-imports and SSR contexts
don't throw.

## Quick start

```html
<script type="module" src="/dist/locale-select.js"></script>

<locale-select
    label="Language"
    locales="en,en_US,fr,fr_CA,ar,he"
    storage-key="lily-locale"
    detect-from-navigator
></locale-select>
```

When the user picks `ar`, the element:

- sets `lang="ar"` on `<html>`,
- sets `dir="rtl"` on `<html>` (auto-detected from the locale),
- writes `"ar"` to `localStorage["lily-locale"]`,
- dispatches `new CustomEvent("localechange", { detail: { locale: "ar" }, bubbles: true, composed: true })`.

The element does **not** translate strings — that is the consumer's
i18n library. Wire `localechange` (or read `el.value`) to drive
your library:

```ts
const select = document.querySelector("locale-select")!;
select.addEventListener("localechange", (e) => {
    const { locale } = (e as CustomEvent<{ locale: string }>).detail;
    // i18n.setLocale(locale);
});
```

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

The default rendering is a native HTML `<select>` with one
`<option>` child per locale; each `<option>` carries `lang` for
correct screen-reader pronunciation.

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

| Attribute                | Type           | Required | Notes                                |
| ------------------------ | -------------- | -------- | ------------------------------------ |
| `label`                  | string         | yes      | `aria-label` on the `<select>`.      |
| `locales`                | string (CSV)   | yes      | Available codes.                     |
| `value`                  | string         | no       | Current code (consumer form).        |
| `default-value`          | string         | no       | Initial when nothing else applies.   |
| `storage-key`            | string         | no       | `localStorage` persistence.          |
| `detect-from-navigator`  | boolean attr   | no       | Match `navigator.languages`.         |
| `name`                   | string         | no       | Defaults to `"locale"`.              |
| `apply-dir`              | boolean attr   | no       | `"false"` suppresses `dir` writes.   |
| `locale-labels`          | string (JSON)  | no       | Per-code label overrides.            |
| `class`                  | string         | no       | Extra class on the `<select>`.       |

## JS properties

Every observed attribute mirrors a JS property of the same name in
camelCase. Notable shapes:

```ts
const select = document.querySelector("locale-select") as LocaleSelect;

select.locales = ["en", "fr", "ar"];               // CSV-encoded in attribute
select.localeLabels = { en: "English", fr: "Français", ar: "العربية" };
select.detectFromNavigator = true;                 // mirrors boolean attribute
select.applyDir = false;                           // → apply-dir="false"
select.target = document.querySelector("section.panel") as HTMLElement;
```

`el.target` accepts `HTMLElement | null` and has no attribute form
(HTMLElement references are not serialisable).

## Events

| Event           | Detail                | Bubbles | Composed |
| --------------- | --------------------- | ------- | -------- |
| `localechange`  | `{ locale: string }`  | yes     | yes      |

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
bcp47LocaleTag("en_US");      // "en-US"
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

## Built-in locale data

`locales.ts` ships 436 codes from `locales.tsv` mapped to English
names; the element falls back to this table when `locale-labels`
does not have an entry.

```ts
import {
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
} from "./lily-design-system-html-locale-select";

console.log(defaultLocaleLabels["en_US"]); // "English (United States)"
console.log(RTL_LANGUAGE_TAGS.has("ar"));  // true
```

## Custom rendering

The HTML helpers don't expose Vue scoped slots or Svelte snippets;
the customisation surface is **subclassing**. Extend `LocaleSelect`
and post-process the children after `super.connectedCallback()`:

```ts
import { LocaleSelect } from "./lily-design-system-html-locale-select";

class ButtonLocaleSelect extends LocaleSelect {
    connectedCallback() {
        super.connectedCallback();
        // Replace the rendered <select> with a row of buttons.
    }
}

customElements.define("button-locale-select", ButtonLocaleSelect);
```

Working examples: [`examples/02-select.html`](./examples/02-select.html),
[`examples/03-buttons.html`](./examples/03-buttons.html),
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

- The rendered root is a `<select>` (implicit `role="combobox"`)
  with `aria-label={label}`.
- The native `<select>` gives Arrow / Home / End / typeahead / Tab
  semantics for free.
- Each `<option>` carries `lang="…"` so its name is pronounced in
  the right language (WCAG 3.1.2 Language of Parts).
- The document root carries `lang` (WCAG 3.1.1) and (by default)
  `dir` for bidi layout.

Topic guide: [`docs/accessibility.md`](./docs/accessibility.md).

## SSR and static-site generation

The element compiles cleanly under static-site generators. On the
server no lifecycle hook runs; the SSG emits the literal
`<locale-select>` tag, and the browser upgrades it after the JS
loads.

For zero-flicker static rendering, resolve the locale at build time
or via cookie (dynamic SSR) and pre-render `<html lang dir>` plus
the matching `<locale-select value="…">` host. The select reads the
inlined `value` and applies the same locale without re-resolving.

See [`docs/ssr.md`](./docs/ssr.md) and
[`examples/08-ssr-cookie.html`](./examples/08-ssr-cookie.html).

## Recipes

- Wire to FormatJS, i18next, or raw `Intl.*`. See
  [`docs/i18n-integration.md`](./docs/i18n-integration.md).
- Scope the locale to a region instead of `<html>`. See
  [`examples/09-scoped-target.html`](./examples/09-scoped-target.html).
- Build a combobox / type-ahead for 100+ locales. See
  [`examples/10-combobox.html`](./examples/10-combobox.html).

## Testing

```sh
pnpm test
```

Exercises every numbered acceptance criterion in
[spec/index.md §7](./spec/index.md#7-testing-acceptance-criteria).

## Files in this directory

| File                    | Purpose                                          |
| ----------------------- | ------------------------------------------------ |
| `spec/index.md`               | Single source of truth.                          |
| `AGENTS.md`             | Fast-index pointer; loads the AGENTS bundle.     |
| `AGENTS/`               | Topic-by-topic agent files.                      |
| `CLAUDE.md`             | `@AGENTS.md`.                                    |
| `locale-select.ts`      | The custom-element class.                        |
| `locale-select.test.ts` | vitest suite.                                    |
| `locales.ts`            | Built-in 436-row code → English name table.      |
| `locales.tsv`           | Canonical source for `locales.ts`.               |
| `index.ts`              | Barrel + side-effectful `customElements.define`. |
| `index.md`              | This file.                                       |
| `docs/`                 | Deep-dive topic guides.                          |
| `examples/`             | Runnable `.html` files.                          |
| `CHANGELOG.md`          | Version history.                                 |

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause. Contact
joel@joelparkerhenderson.com for other terms.
