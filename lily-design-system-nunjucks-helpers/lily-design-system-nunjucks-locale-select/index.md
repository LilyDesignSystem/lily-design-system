# LocaleSelect (Nunjucks helper)

A reusable, headless Nunjucks 3 + vanilla-JS locale select — an
icon button that opens a listbox of locales — that applies the
chosen locale to the document root via `lang` and `dir`, with
optional `localStorage` persistence and `navigator.languages`
detection.

The single source of truth is [spec/index.md](./spec/index.md). This file is
the comprehensive user guide. For topic deep-dives see
[docs/](./docs/) and for working code see [examples/](./examples/).

## Table of contents

- [Why this exists](#why-this-exists)
- [How the pieces fit](#how-the-pieces-fit)
- [Install](#install)
- [Quick start](#quick-start)
- [How it works](#how-it-works)
- [Initial locale](#initial-locale)
- [Macro parameters](#macro-parameters)
- [Client.js API](#clientjs-api)
- [Pretty labels from the built-in table](#pretty-labels-from-the-built-in-table)
- [BCP 47 normalisation](#bcp-47-normalisation)
- [RTL auto-detection](#rtl-auto-detection)
- [Custom glyph](#custom-glyph)
- [Accessibility](#accessibility)
- [Keyboard](#keyboard)
- [Styling](#styling)
- [SSR and the first paint](#ssr-and-the-first-paint)
- [i18n library integration](#i18n-library-integration)
- [Recipes](#recipes)
- [Testing](#testing)

## Why this exists

Most locale selects couple selection, persistence, and string
translation into one opinionated widget. This one splits the
contract cleanly:

- **This helper** owns the `lang` / `dir` lifecycle, the listbox
  interaction, accessibility, and persistence — via a Nunjucks
  macro for the markup and a small ES module for the runtime.
- **Your i18n library** (i18next, gettext, eleventy-plugin-i18n,
  etc.) owns the actual string translation. It picks up the
  `lang` attribute or the `onChange` callback.
- **Consumers** own the visual style of the control via the
  `locale-select` class hook.

The result is a small reusable widget that works in any Nunjucks
host (Eleventy, Express, Cloudflare Workers, plain
`nunjucks.render`) and against any locale catalog — your supported
set or the built-in 436-row BCP 47 table.

The helper is a direct port of the Svelte canonical
`lily-design-system-svelte-locale-select`. The DOM contract and
behaviour match clause-for-clause; only the framework idioms
differ.

## How the pieces fit

The helper is a **macro + client.js** pair:

- The macro (`locale-select.njk`) renders the button + listbox
  markup server-side or at static-site build time, including each
  option's `lang="…"` attribute (BCP 47 hyphen form) and a hidden
  input pre-filled with the server-resolved locale.
- The client (`locale-select.client.js`) is an ES module the
  consumer loads once per page. It picks up the markup via
  `data-lily-locale-select-*` hooks and owns both the listbox
  interaction (open / close, focus, the APG keyboard contract,
  typeahead) and the browser-side lifecycle (storage, navigator
  detection, `lang` / `dir` apply, change callbacks).

```
Nunjucks render time                 │  Browser runtime
                                      │
{{ localeSelect({…}) }}               │  import { autoInit } from
   │                                  │    "./locale-select.client.js";
   ▼                                  │  autoInit();
<div class="locale-select"            │     │
  data-lily-locale-select-root        │     ▼
  data-lily-locale-select-*>          │  finds [data-lily-locale-select-root]
  <input type="hidden" name="locale"  │     │
    value="en">                       │     ▼
  <button class="locale-select-button"│  wires button + listbox events
    aria-haspopup="listbox"           │     │
    aria-expanded="false">🌐</button> │     ▼
  <ul class="locale-select-list"      │  resolves initial code
    role="listbox" hidden>            │     │
    <li role="option" data-value="en" │     ▼
      lang="en">English</li>          │  applyLocale(code):
    …                                 │    - target.lang = bcp47(code)
  </ul>                               │    - target.dir = rtl|ltr
</div>                                │    - localStorage.setItem(...)
                                      │    - hidden input .value = code
                                      │    - aria-selected sync
                                      │    - opts.onChange(code)
```

The button does **nothing** until the client module runs. See
[SSR and the first paint](#ssr-and-the-first-paint).

## Install

The directory ships as a folder-style import. Copy the four core
files into your project or wire as a workspace dependency:

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `locale-select.njk`        | The Nunjucks macro.                              |
| `locale-select.client.js`  | The ES-module runtime.                           |
| `locales.ts` / `locales.js`| Built-in 436-row label table + RTL sets.         |
| `locales.tsv`              | Canonical source for `locales.ts`.               |

Runtime dependencies: `nunjucks` ≥ 3 server-side and standard DOM
APIs client-side. The `locales.ts` file is TypeScript; bundlers
resolve it at test time, browsers consume the compiled
`locales.js`.

## Quick start

1. Render the macro in your Nunjucks template:

```njk
{% from "./lily-design-system-nunjucks-locale-select/locale-select.njk" import localeSelect %}

{{ localeSelect({
    label: "Language",
    locales: ["en", "en_US", "fr", "fr_CA", "ar", "he"],
    storageKey: "lily-locale",
    detectFromNavigator: true
}) }}

{# Status region: the closed control is an icon-only button showing
   a globe glyph, never the active locale, so the active locale is
   surfaced here instead — visibly, for sighted and screen-reader
   users alike. See docs/accessibility.md. #}
<p class="locale-select-status" aria-live="polite"></p>
```

2. Load the client.js once per page and keep the status region in
   sync from `onChange`:

```html
<script type="module">
    import {
        autoInit,
        localeName,
    } from "/path/to/locale-select.client.js";

    const status = document.querySelector(".locale-select-status");

    autoInit({
        onChange(code) {
            // aria-live="polite" announces mutations only, so this is
            // silent on first paint and speaks on each later change.
            status.textContent = `Active language: ${localeName(code)}`;
        },
    });
</script>
```

`localeName(code)` resolves the human name from the built-in 436-row
table (`en_US` → "English (United States)"), so the region shows a
real language name rather than a raw code.

Keep the status region **visible** by default: it helps sighted and
cognitive-accessibility users too, and WCAG 2.2 AAA favours it. If your
design genuinely can't spare the space, make it visually hidden rather
than dropping it — recipe in
[docs/styling.md](./docs/styling.md).

When the user picks `ar`, the client:

- sets `lang="ar"` on `<html>`,
- sets `dir="rtl"` on `<html>` (auto-detected from the locale),
- writes `"ar"` to `localStorage["lily-locale"]`,
- fires `onChange("ar")` if provided.

The select does NOT translate strings — that is the consumer's
i18n library's job. Wire `onChange` (or `MutationObserver` on
`<html lang>`) to your library so it loads the right messages.

## How it works

On every locale change the client.js performs six steps:

1. **Resolve target** — defaults to `document.documentElement`;
   overridable via `initLocaleSelect(root, { target })`.
2. **Set `target.lang`** to the BCP 47 hyphen form of the code
   (`en_US` → `en-US`).
3. **Set `target.dir`** to `"rtl"` or `"ltr"` based on
   `isRtlLocale(code)` — skipped when `opts.applyDir=false`.
4. **Persist** the consumer-form code to `localStorage` if
   `storageKey` is set.
5. **Mirror** the consumer-form code into the hidden input (so an
   enclosing `<form>` submits it) and set `aria-selected="true"` on
   the matching `<li role="option">`, `"false"` on the rest.
6. **Notify** — call `opts.onChange(code)` if supplied.

### The icon button and the listbox

The macro renders a `<div>` root holding three things: a hidden
input, an icon-only trigger button, and a listbox of options.

```html
<div class="locale-select" data-lily-locale-select-root …>
  <input type="hidden" name="locale" value="en" data-lily-locale-select-input>
  <button type="button" class="locale-select-button" aria-label="Locale"
          aria-haspopup="listbox" aria-expanded="false"
          aria-controls="locale-select-locale-list"
          data-lily-locale-select-button>
    <span class="locale-select-icon" aria-hidden="true">&#127760;&#65038;</span>
  </button>
  <ul class="locale-select-list" id="locale-select-locale-list" role="listbox"
      aria-label="Locale" tabindex="-1" hidden data-lily-locale-select-list>
    <li class="locale-select-option" id="locale-select-locale-option-0"
        role="option" aria-selected="true" data-value="en" lang="en">English</li>
    <li class="locale-select-option" id="locale-select-locale-option-1"
        role="option" aria-selected="false" data-value="ar" lang="ar">العربية</li>
  </ul>
</div>
```

The button's glyph is U+1F310 GLOBE WITH MERIDIANS followed by U+FE0E
VARIATION SELECTOR-15 (the selector requests the monochrome text
presentation, so the globe does not render as a blue colour emoji),
wrapped in `aria-hidden="true"`, so the control's width stays constant no
matter how long your locale names are. The accessible name comes
solely from the button's `aria-label`.

This means **the closed control never displays the active locale**.
The active locale lives in `lang` / `dir` on the target, in the
hidden input's value, in `localStorage` when `storageKey` is set, in
the option that carries `aria-selected="true"`, and in the
`onChange(code)` argument.

The macro resolves a selected option server-side —
`value or defaultValue or ("en" if listed else the first locale)` —
marks exactly one `<li>` `aria-selected="true"`, and pre-fills the
hidden input with it. The client may correct that after hydration,
because storage and `navigator` are client-only.

The code passed to `onChange` is the **consumer form**
(`en_US` if you passed `en_US` in `locales`). The DOM `lang`
attribute is in the BCP 47 hyphen form (`en-US`). See [BCP 47
normalisation](#bcp-47-normalisation).

## Initial locale

The initial code on `initLocaleSelect(root)` resolves to the first
non-empty value of:

1. The root's `data-lily-locale-select-value` (i.e. `opts.value`).
   This attribute is the only channel by which `opts.value` reaches
   the client — see [docs/ssr.md](./docs/ssr.md).
2. `localStorage.getItem(storageKey)` (when set and readable).
3. `matchNavigatorLanguage(navigator.languages, locales)` (when
   `detectFromNavigator=true`).
4. The root's `data-lily-locale-select-default-value`
   (i.e. `opts.defaultValue`).
5. `"en"` if present among the rendered option values.
6. The first option value, or `""` if none.

## Macro parameters

Full table in [spec/index.md §4.1](./spec/index.md#41-macro-parameters).

| Key                   | Type                    | Required | Default                    |
| --------------------- | ----------------------- | -------- | -------------------------- |
| `label`               | `string`                | yes      | —                          |
| `locales`             | `array<string>`         | yes      | —                          |
| `value`               | `string`                | no       | `""`                       |
| `defaultValue`        | `string`                | no       | `""`                       |
| `storageKey`          | `string`                | no       | `""`                       |
| `detectFromNavigator` | `boolean`               | no       | `false`                    |
| `name`                | `string`                | no       | `"locale"`                 |
| `applyDir`            | `boolean`               | no       | `true`                     |
| `localeLabels`        | `object<string,string>` | no       | `{}`                       |
| `id`                  | `string`                | no       | `"locale-select-{name}"`   |
| `classes`             | `string`                | no       | `""`                       |
| `attributes`          | `object`                | no       | `{}`                       |

`label` is the `aria-label` on both the button and the listbox; the
button is icon-only, so this is its only accessible name. `name` is
the hidden input's `name`.

`id` is the prefix for the listbox id (`{id}-list`) and each option
id (`{id}-option-{index}`). A Nunjucks macro cannot hold a module
counter, so this is the framework's stable-id mechanism: if you
render two instances that share a `name`, pass a distinct `id` to at
least one of them or their ids will collide.

See [docs/concepts.md](./docs/concepts.md) for the mental model
and the catalog-wide reference.

## Client.js API

```js
import {
    initLocaleSelect,
    autoInit,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    defaultLocaleLabels,
    GLOBE_WITH_MERIDIANS,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
} from "./locale-select.client.js";
```

- `autoInit(opts?)` — find every
  `[data-lily-locale-select-root]` and wire it.
- `initLocaleSelect(root, opts?)` — wire a single root `<div>`;
  returns `{setLocale, destroy}`.
- Pure helpers: `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage`.
- Built-in data: `defaultLocaleLabels` (436 rows),
  `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`,
  `GLOBE_WITH_MERIDIANS` (the default button glyph, `"\u{1F310}"`).

Optional `opts`:

- `onChange(code)` — fired after every apply; receives the
  consumer-form code.
- `target` — element receiving `lang` and `dir` (defaults to
  `<html>`).

## Pretty labels from the built-in table

`locales.ts` ships a 436-row code → English-name map. To populate
option labels at macro time, pass `defaultLocaleLabels` (or any
subset) as `localeLabels`. In Eleventy, expose it as a global data
file:

```js
// _data/localeLabels.js
import { defaultLocaleLabels } from "../lily-design-system-nunjucks-locale-select/locale-select.client.js";
export default defaultLocaleLabels;
```

```njk
{{ localeSelect({
    label: "Language",
    locales: ["en", "fr", "ar"],
    localeLabels: localeLabels
}) }}
```

## BCP 47 normalisation

The `lang` attribute on HTML elements must use hyphens
(`en-US`), while many applications carry locale identifiers with
underscores (`en_US`). The select accepts either form in
`locales` and converts to the hyphen form when writing to the
DOM. `onChange` receives the consumer-form code.

```js
bcp47LocaleTag("en_US");      // "en-US"
bcp47LocaleTag("zh_Hant_TW"); // "zh-Hant-TW"
bcp47LocaleTag("en");         // "en"
```

See [docs/bcp47.md](./docs/bcp47.md) for the full primer.

## RTL auto-detection

`isRtlLocale(locale)` returns `true` for any locale whose base
language is one of `ar`, `arc`, `ckb`, `dv`, `fa`, `he`, `iw`,
`ji`, `ks`, `ku`, `mzn`, `ps`, `sd`, `ug`, `ur`, `yi`, OR whose
script subtag is one of `Arab`, `Hebr`, `Thaa`, `Syrc`, `Nkoo`,
`Mong`, `Adlm`.

Pass `applyDir: false` in the macro `opts` if you want full
control of `dir` yourself.

See [docs/rtl.md](./docs/rtl.md) for the full table and the CSS
authoring guide.

## Custom glyph

The button renders a globe glyph by default. Nunjucks's equivalent
of "children" is a `{% call %}` block, and its body replaces that
glyph **inside the button**:

```njk
{% call localeSelect({
    label: "Language",
    locales: ["en", "fr", "ar"]
}) %}
    <svg class="my-globe" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" />
    </svg>
{% endcall %}
```

The call block does **not** render options — the listbox still comes
from `opts.locales`. Keep your replacement `aria-hidden="true"`: the
button's accessible name is its `aria-label`, and visible glyph text
would compete with it.

If you need a control the macro cannot render at all, write the DOM
by hand with the same `data-lily-locale-select-*` hooks
(`-root`, `-button`, `-list`, `-input`) plus `role="option"` +
`data-value` on each choice; `initLocaleSelect(root)` works against
any conforming DOM.

See [docs/concepts.md](./docs/concepts.md#custom-rendering) and
the [examples/](./examples/) directory.

## Accessibility

- The button carries `aria-label="{label}"`, `aria-haspopup="listbox"`,
  `aria-expanded`, and `aria-controls` pointing at the listbox id. It
  is icon-only, so `aria-label` is its **only** accessible name.
- The glyph is wrapped in `aria-hidden="true"` so assistive
  technology never reads it.
- The `<ul role="listbox">` carries the same `aria-label`, is
  `tabindex="-1"`, and receives focus while open; the active option
  is conveyed with `aria-activedescendant`, per the WAI-ARIA APG
  listbox pattern. Exactly one option is `aria-selected="true"`.
- Each locale `<li role="option">` carries `lang="…"` (WCAG 3.1.2,
  Language of Parts). The button and the `<ul>` do not — they are
  chrome, not content.
- The document root carries `lang` and (by default) `dir` (WCAG
  3.1.1, Language of Page, and 1.4.10, Reflow / bidi).
- **Tradeoff, and the default answer to it**: because the closed
  control shows only a glyph, a screen-reader user hears the label
  but not the active locale. The examples and the quick start
  therefore ship a visible `.locale-select-status` region with
  `aria-live="polite"` next to the control. Treat that region as
  part of the pattern; omitting it is the deliberate choice.

Topic guide: [`docs/accessibility.md`](./docs/accessibility.md).

## Keyboard

Every key below is implemented in `locale-select.client.js`; none of
it works before that module loads.

| Key                      | Where       | Action                                                            |
| ------------------------ | ----------- | ----------------------------------------------------------------- |
| Enter / Space / ArrowDown| Button      | Open, with the selected option active (or the first).             |
| ArrowUp                  | Button      | Open, with the **last** option active.                            |
| ArrowDown / ArrowUp      | Listbox     | Move the active option. Clamps at the ends; does not wrap.        |
| Home / End               | Listbox     | Jump to the first / last option.                                  |
| Enter / Space            | Listbox     | Select the active option, apply it, close, refocus the button.    |
| Escape                   | Listbox     | Close and refocus the button **without** changing the locale.     |
| Tab                      | Listbox     | Close without stealing focus back.                                |
| Printable characters     | Listbox     | Typeahead over option labels; the buffer resets after 500 ms.     |

Opening moves focus to the `<ul>`. Clicking an option selects it;
clicking outside, or focus leaving the root, closes the listbox.

## Styling

The control ships no CSS. Class hooks: `.locale-select` on the root
`<div>`, `.locale-select-button` on the trigger,
`.locale-select-icon` on the default glyph span,
`.locale-select-list` on the `<ul role="listbox">`, and
`.locale-select-option` on each `<li>`. Style open / closed state
from `[aria-expanded]` on the button and `[hidden]` on the list; the
client marks the active option with `data-active` and the applied one
with `aria-selected="true"`.

```css
.locale-select { position: relative; display: inline-block; }
.locale-select-list[hidden] { display: none; }
.locale-select-option[data-active] { outline: 2px solid currentColor; }
.locale-select-option[aria-selected="true"] { font-weight: 700; }
```

Topic guide: [`docs/styling.md`](./docs/styling.md).

## SSR and the first paint

Nunjucks **is** the server side. The macro is pure: same `opts`
in, same HTML out. For zero-flicker first paint, read the cookie
or session value in your Nunjucks host (Eleventy edge function,
Express middleware, Cloudflare Workers handler) and pass it as
`opts.value`. See [`docs/ssr.md`](./docs/ssr.md).

**The server-rendered markup is not fully usable before the client
JS loads.** The button will not open the listbox without JS, because
every open / close / keyboard / typeahead behaviour lives in
`locale-select.client.js`. This is a real regression from the earlier
native `<select>`, which worked unenhanced. The one no-JS affordance
that survives is the hidden input: it is pre-filled server-side with
the resolved locale, so a form submitted without JS still carries a
locale. If unenhanced locale switching is a hard requirement for your
audience, render a plain `<form>` of links or submit buttons
alongside (or instead of) this helper.

## i18n library integration

The select doesn't translate strings — your i18n library does.
See [`docs/i18n-integration.md`](./docs/i18n-integration.md) for
recipes with:

- `@11ty/eleventy-plugin-i18n`
- Raw `Intl.*` formatters
- `gettext` via `i18next-server`

## Recipes

- Setting initial locale from `Accept-Language` header.
- Cookie-based persistence so the next request paints in the
  right language.
- URL-prefix locales (`/en/about`, `/fr/about`) with the select
  driving navigation.
- Replacing the globe glyph with your own icon via `{% call %}`.
- Scoping the applied `lang` / `dir` to one panel with `target`.

## Testing

`pnpm test` under a vitest + jsdom setup exercises every numbered
acceptance criterion in
[spec/index.md §7](./spec/index.md#7-testing-acceptance-criteria).

## Topic guides

| Guide | Covers |
| ----- | ------ |
| [`docs/macro-opts-reference.md`](./docs/macro-opts-reference.md) | Every `localeSelect(opts)` key, field by field. |
| [`docs/concepts.md`](./docs/concepts.md) | The macro / client.js split, lifecycle, persistence. |
| [`docs/bcp47.md`](./docs/bcp47.md) | Tag composition, normalisation, `Intl.*` compatibility. |
| [`docs/rtl.md`](./docs/rtl.md) | RTL detection, `dir`, logical properties. |
| [`docs/i18n-integration.md`](./docs/i18n-integration.md) | Eleventy i18n, `Intl.*`, i18next, ICU MessageFormat. |
| [`docs/ssr.md`](./docs/ssr.md) | Render-time vs runtime; cookie-resolved `value`. |
| [`docs/accessibility.md`](./docs/accessibility.md) | WCAG 2.2 AAA, the APG listbox contract, the tradeoffs. |
| [`docs/styling.md`](./docs/styling.md) | Class hooks and state selectors. |
| [`docs/custom-rendering.md`](./docs/custom-rendering.md) | Glyph override, CSS-only styling, hand-written DOM. |
| [`docs/recipes.md`](./docs/recipes.md) | Task-shaped solutions: status region, cookies, `Intl`, scoped targets. |
| [`docs/troubleshooting.md`](./docs/troubleshooting.md) | Symptoms, causes, fixes. |

## Files in this directory

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`                  | Single source of truth — API, behaviour, tests.  |
| `AGENTS.md`                | Fast-index pointer; loads the AGENTS bundle.     |
| `AGENTS/`                  | Topic-by-topic agent files.                      |
| `CLAUDE.md`                | `@AGENTS.md`.                                    |
| `locale-select.njk`        | The macro.                                       |
| `locale-select.client.js`  | The ES-module runtime.                           |
| `locale-select.test.ts`    | vitest suite covering every spec §7 item.        |
| `locales.ts`               | Built-in code → English-name map + RTL sets.     |
| `locales.tsv`              | Canonical 436-row source.                        |
| `index.md`                 | This file.                                       |
| `docs/`                    | Deep-dive topic guides.                          |
| `examples/`                | Runnable Nunjucks templates.                     |
| `CHANGELOG.md`             | Version history.                                 |

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause. Contact
joel@joelparkerhenderson.com for other terms.

---

Lily™ and Lily Design System™ are trademarks.
