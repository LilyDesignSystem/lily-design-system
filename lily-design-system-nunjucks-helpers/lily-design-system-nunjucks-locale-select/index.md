# LocaleSelect (Nunjucks helper)

A reusable, headless Nunjucks 3 + vanilla-JS locale select that
applies the chosen locale to the document root via `lang` and
`dir`, with optional `localStorage` persistence and
`navigator.languages` detection.

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
- [Custom rendering](#custom-rendering)
- [Accessibility](#accessibility)
- [SSR and the first paint](#ssr-and-the-first-paint)
- [i18n library integration](#i18n-library-integration)
- [Recipes](#recipes)
- [Testing](#testing)

## Why this exists

Most locale selects couple selection, persistence, and string
translation into one opinionated widget. This one splits the
contract cleanly:

- **This helper** owns the `lang` / `dir` lifecycle, accessibility,
  and persistence — via a Nunjucks macro for the markup and a
  small ES module for the runtime.
- **Your i18n library** (i18next, gettext, eleventy-plugin-i18n,
  etc.) owns the actual string translation. It picks up the
  `lang` attribute or the `onChange` callback.
- **Consumers** own the visual style of the select via the
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

- The macro (`locale-select.njk`) renders the `<select>` markup
  server-side or at static-site build time, including each
  option's `lang="…"` attribute (BCP 47 hyphen form).
- The client (`locale-select.client.js`) is an ES module the
  consumer loads once per page. It picks up the markup via
  `data-lily-locale-select-*` hooks and owns the browser-side
  lifecycle (storage, navigator detection, `lang` / `dir` apply,
  change events).

```
Nunjucks render time                 │  Browser runtime
                                      │
{{ localeSelect({…}) }}               │  import { autoInit } from
   │                                  │    "./locale-select.client.js";
   ▼                                  │  autoInit();
<select                               │     │
  class="locale-select"               │     ▼
  aria-label="Language"               │  finds [data-lily-locale-select-root]
  name="locale"                       │     │
  data-lily-locale-select-root        │     ▼
  data-lily-locale-select-*           │  resolves initial code
  …>                                  │     │
  <option value="en" lang="en">       │     ▼
    English                           │  applyLocale(code):
  </option>                           │    - target.lang = bcp47(code)
  …                                   │    - target.dir = rtl|ltr
</select>                             │    - localStorage.setItem(...)
                                      │    - opts.onChange(code)
```

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
```

2. Load the client.js once per page:

```html
<script type="module">
    import { autoInit } from "/path/to/locale-select.client.js";
    autoInit();
</script>
```

When the user picks `ar`, the client:

- sets `lang="ar"` on `<html>`,
- sets `dir="rtl"` on `<html>` (auto-detected from the locale),
- writes `"ar"` to `localStorage["lily-locale"]`,
- fires `onChange("ar")` if provided.

The select does NOT translate strings — that is the consumer's
i18n library's job. Wire `onChange` (or `MutationObserver` on
`<html lang>`) to your library so it loads the right messages.

## How it works

On every locale change the client.js performs five steps:

1. **Resolve target** — defaults to `document.documentElement`;
   overridable via `initLocaleSelect(root, { target })`.
2. **Set `target.lang`** to the BCP 47 hyphen form of the code
   (`en_US` → `en-US`).
3. **Set `target.dir`** to `"rtl"` or `"ltr"` based on
   `isRtlLocale(code)` — skipped when `opts.applyDir=false`.
4. **Persist** the consumer-form code to `localStorage` if
   `storageKey` is set.
5. **Notify** — set the `<select>` value so the matching option is
   selected and call `opts.onChange(code)` if supplied.

The code passed to `onChange` is the **consumer form**
(`en_US` if you passed `en_US` in `locales`). The DOM `lang`
attribute is in the BCP 47 hyphen form (`en-US`). See [BCP 47
normalisation](#bcp-47-normalisation).

## Initial locale

The initial code on `initLocaleSelect(root)` resolves to the first
non-empty value of:

1. The `value` of any `<option>` the macro rendered with `selected`
   (i.e. `opts.value`).
2. `localStorage.getItem(storageKey)` (when set and readable).
3. `matchNavigatorLanguage(navigator.languages, locales)` (when
   `detectFromNavigator=true`).
4. The `<select>`'s `data-lily-locale-select-default-value`
   (i.e. `opts.defaultValue`).
5. `"en"` if present among the rendered option values.
6. The first option value, or `""` if none.

## Macro parameters

Full table in [spec/index.md §4.1](./spec/index.md#41-macro-parameters).
Required: `label`, `locales`. Optional: `value`, `defaultValue`,
`storageKey`, `detectFromNavigator`, `name`, `applyDir`,
`localeLabels`, `classes`, `attributes`.

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
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
} from "./locale-select.client.js";
```

- `autoInit(opts?)` — find every
  `[data-lily-locale-select-root]` and wire it.
- `initLocaleSelect(root, opts?)` — wire a single `<select>`;
  returns `{setLocale, destroy}`.
- Pure helpers: `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage`.
- Built-in data: `defaultLocaleLabels` (436 rows),
  `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`.

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

## Custom rendering

The default macro emits a native `<select>`. When you
need a button group or combobox instead, two
patterns apply:

1. **Caller block** — wrap the macro with `{% call %}` to supply
   replacement markup.
2. **Hand-written markup** — skip the macro entirely and write
   the `<select>` by hand with the same `data-lily-locale-select-*`
   attributes; the client.js works against any conforming DOM.

See [docs/concepts.md](./docs/concepts.md#custom-rendering) and
the [examples/](./examples/) directory.

## Accessibility

- `<select aria-label="…">` is the announced combobox container.
- The native `<select>` gives Arrow / Home / End / typeahead / Tab
  semantics for free.
- Each `<option>` carries `lang="…"` (WCAG 3.1.2, Language
  of Parts).
- The document root carries `lang` and (by default) `dir` (WCAG
  3.1.1, Language of Page, and 1.4.10, Reflow / bidi).

Topic guide: [`docs/accessibility.md`](./docs/accessibility.md).

## SSR and the first paint

Nunjucks **is** the server side. The macro is pure: same `opts`
in, same HTML out. For zero-flicker first paint, read the cookie
or session value in your Nunjucks host (Eleventy edge function,
Express middleware, Cloudflare Workers handler) and pass it as
`opts.value`. See [`docs/ssr.md`](./docs/ssr.md).

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
- Wiring the select to a button group for short lists.
- Wiring the select to a combobox + `<datalist>` for long lists.

## Testing

`pnpm test` under a vitest + jsdom setup exercises every numbered
acceptance criterion in
[spec/index.md §7](./spec/index.md#7-testing-acceptance-criteria).

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
