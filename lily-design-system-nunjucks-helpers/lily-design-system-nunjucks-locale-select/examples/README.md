# Examples

Self-contained Nunjucks examples for
`lily-design-system-nunjucks-locale-select`. Each file is a
runnable template that can be dropped into any Nunjucks host
(Eleventy page, Express view, plain `nunjucks.render` script,
Cloudflare Workers).

Every example assumes:

- The macro file (`../locale-select.njk`) and the client.js
  (`../locale-select.client.js`) are reachable from your
  template loader and your static-asset pipeline respectively.
- The locale codes referenced in each example are valid BCP 47
  (or BCP 47-ish — `en_US` is auto-normalised to `en-US` when
  written to the `lang` attribute).
- The consumer styles the `locale-select` CSS class hook. The
  helper ships zero CSS.

| #  | File                                                              | Demonstrates                                                       |
|----|-------------------------------------------------------------------|--------------------------------------------------------------------|
| 1  | [`01-radios.njk`](./01-radios.njk)                                | Default native `<select>` via `{{ localeSelect({...}) }}`.         |
| 2  | [`02-select.njk`](./02-select.njk)                                | Default `<select>` with a long list and `localeLabels`.           |
| 3  | [`03-buttons.njk`](./03-buttons.njk)                              | Button group + `aria-pressed` via the `{% call %}` block.         |
| 4  | [`04-rtl-demo.njk`](./04-rtl-demo.njk)                            | RTL locales (ar, he, fa, ur, ps) showing `dir` flipping.           |
| 5  | [`05-nhs-style.njk`](./05-nhs-style.njk)                          | Kebab-case `locale-select` class + NHS-style language banner.      |
| 6  | [`06-with-eleventy-i18n.njk`](./06-with-eleventy-i18n.njk)        | Eleventy i18n plugin pattern (URL-prefixed locales).               |
| 7  | [`07-with-intl.njk`](./07-with-intl.njk)                          | Native `Intl.DateTimeFormat` / `NumberFormat` client-side update.  |
| 8  | [`08-ssr-cookie.njk`](./08-ssr-cookie.njk)                        | Eleventy / Express + cookie-resolved initial value before render.  |
| 9  | [`09-scoped-target.njk`](./09-scoped-target.njk)                  | `target` option pointing to a specific element.                    |
| 10 | [`10-combobox.njk`](./10-combobox.njk)                            | Combobox / listbox pattern via `{% call %}` block.                 |
|    | [`localeSelectCustom.njk`](./localeSelectCustom.njk)              | Forked helper macro for the caller-block examples.                 |

## Running the examples

These files are illustrations, not a build. The fastest way to
try one is:

1. Inside any Nunjucks-rendering project (Eleventy, Express,
   Cloudflare Workers, plain `nunjucks.render`), drop the example
   into a route / page.
2. Serve the static-asset directory containing
   `locale-select.client.js` and `locales.js` (the compiled JS
   form of the `locales.ts` source).
3. Visit the route. The macro renders the `<select>`; the
   client.js mounts and applies `lang` / `dir` to `<html>` on
   first paint.

## onChange vs v-model / bind:value

Nunjucks doesn't have reactive bindings like Svelte / Vue /
React. The closest equivalent is the `onChange` callback on
`initLocaleSelect(root, opts)` (and on `autoInit(opts)`),
combined with the consumer maintaining whatever store they want
to keep in sync. Every example past `01-radios.njk` shows the
pattern.

## Caller block

The shipped `locale-select.njk` does not inspect `caller` — the
default rendering is a native `<select>`. Examples 03, 05, and 10
use a forked macro
[`localeSelectCustom.njk`](./localeSelectCustom.njk) that replaces
the macro body with `{{ caller() }}`. Copy this fork into your
project when you need a control the default `<select>` can't be.

The fork emits a `<div role="group">` carrying all the
`data-lily-locale-select-*` hooks, so the client.js's
`initLocaleSelect(root)` still wires the lifecycle. Your caller
block renders whatever markup you want (a button group, a combobox
input, a swatch grid); you wire click / change events to
`ctrl.setLocale(code)` from inline JS.

## Naming

- Macro keys are camelCase: `locales`, `defaultValue`,
  `localeLabels`, `storageKey`, `detectFromNavigator`, `applyDir`.
- CSS class hooks are kebab-case: `locale-select`,
  `locale-select-option`.
- `data-lily-locale-select-*` attributes are kebab-case
  throughout.

## See also

- [../index.md](../index.md) — user-facing readme.
- [../spec.md](../spec.md) — canonical contract.
- [../docs/concepts.md](../docs/concepts.md) — macro / client.js
  split, lifecycle, persistence.
- [../docs/i18n-integration.md](../docs/i18n-integration.md) —
  Eleventy i18n, native `Intl.*`, i18next, ICU MessageFormat.
- [../docs/rtl.md](../docs/rtl.md) — RTL detection and the
  CSS implications.
- [../docs/ssr.md](../docs/ssr.md) — Nunjucks IS server-side;
  cookie-resolved value before render.
- [../docs/bcp47.md](../docs/bcp47.md) — BCP 47 tag composition.
- [../docs/accessibility.md](../docs/accessibility.md) —
  WCAG 2.2 AAA + native `<select>` accessibility.
