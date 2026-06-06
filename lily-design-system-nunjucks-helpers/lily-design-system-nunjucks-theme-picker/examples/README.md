# Examples

Self-contained Nunjucks examples for
`lily-design-system-nunjucks-theme-picker`. Each file is a
runnable template that can be dropped into any Nunjucks host
(Eleventy page, Express view, plain `nunjucks.render` script).

Every example assumes:

- A directory of theme CSS files served at `/assets/themes/`
  (typically `assets/themes/light.css`,
  `assets/themes/dark.css`, …). The
  [Lily themes](../../../themes/) catalog ships 41 ready-to-use
  themes.
- Each theme CSS file scopes its tokens with
  `:root[data-theme="<slug>"]`.
- The macro file (`../theme-picker.njk`) and the client.js
  (`../theme-picker.client.js`) are reachable from your template
  loader and your static-asset pipeline respectively.

| #  | File                                                              | Demonstrates                                                       |
|----|-------------------------------------------------------------------|--------------------------------------------------------------------|
| 1  | [`01-basic.njk`](./01-basic.njk)                                  | Minimal three-theme picker.                                        |
| 2  | [`02-custom-labels.njk`](./02-custom-labels.njk)                  | `themeLabels` for i18n / display names.                            |
| 3  | [`03-multiple-pickers.njk`](./03-multiple-pickers.njk)            | Two independent pickers in one page via `name` + `target`.         |
| 4  | [`04-persistence.njk`](./04-persistence.njk)                      | `storageKey` survival across reloads.                              |
| 5  | [`05-preloaded.njk`](./05-preloaded.njk)                          | Zero-flicker switching via `<link>` preloading.                    |
| 6  | [`06-system-preference.njk`](./06-system-preference.njk)          | Follow `prefers-color-scheme` (server-side hint).                  |
| 7  | [`07-two-way-binding.njk`](./07-two-way-binding.njk)              | `onChange` callback wiring (the Nunjucks equivalent of `v-model`). |
| 8  | [`08-lily-themes.njk`](./08-lily-themes.njk)                      | All 41 Lily / DaisyUI themes at once.                              |
| 9  | [`09-custom-rendering.njk`](./09-custom-rendering.njk)            | Caller-block custom rendering (swatch buttons).                    |
|    | [`eleventy-cookie/`](./eleventy-cookie/)                          | SSR-resolved theme via a cookie (Eleventy + edge function).        |

## Running the examples

These files are illustrations, not a build. The fastest way to
try one is:

1. Inside any Nunjucks-rendering project (Eleventy, Express,
   plain `nunjucks.render`), drop the example into a route /
   page.
2. Copy a couple of theme CSS files from
   [`../../../themes/`](../../../themes/) into
   `assets/themes/`.
3. Serve the directory and visit the route.

## onChange vs v-model

Nunjucks doesn't have reactive bindings like Svelte / Vue / React.
The closest equivalent is the `onChange` callback on the client.js
init opts, combined with the consumer maintaining whatever store
they want to keep in sync. Example 07 walks through it.

## Naming

Macro keys are camelCase: `themesUrl`, `defaultValue`,
`themeLabels`, `storageKey`. CSS class hooks are kebab-case:
`theme-picker`, `theme-picker-option`, `theme-picker-option-label`.
`data-lily-*` attributes are kebab-case throughout.

## Helper macro for the caller-block example

[`themePickerCustom.njk`](./themePickerCustom.njk) is a fork of
`../theme-picker.njk` that swaps the per-option `{% for %}` body
for `{{ caller() }}`. Example 09 imports it. In a real project,
copy the macro into your own template directory.
