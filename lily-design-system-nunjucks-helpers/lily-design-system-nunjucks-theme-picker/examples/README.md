# Examples

Self-contained Nunjucks examples for
`lily-design-system-nunjucks-theme-chooser`. Each file is a
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
- The macro file (`../theme-chooser.njk`) and the client.js
  (`../theme-chooser.client.js`) are reachable from your template
  loader and your static-asset pipeline respectively.
- The client.js is actually loaded. It is not optional: the macro
  renders an icon button and a hidden listbox, and the button does
  not open until the client runs. Every example therefore ends with
  a `<script type="module">`. See [`../docs/ssr.md`](../docs/ssr.md)
  for the no-JS picture.

| #  | File                                                              | Demonstrates                                                       |
|----|-------------------------------------------------------------------|--------------------------------------------------------------------|
| 1  | [`01-basic.njk`](./01-basic.njk)                                  | Minimal three-theme chooser.                                        |
| 2  | [`02-custom-labels.njk`](./02-custom-labels.njk)                  | `themeLabels` for i18n / display names.                            |
| 3  | [`03-multiple-selects.njk`](./03-multiple-selects.njk)            | Two independent controls in one page via `name` + `target`.        |
| 4  | [`04-persistence.njk`](./04-persistence.njk)                      | `storageKey` survival across reloads.                              |
| 5  | [`05-preloaded.njk`](./05-preloaded.njk)                          | Zero-flicker switching via `<link>` preloading.                    |
| 6  | [`06-system-preference.njk`](./06-system-preference.njk)          | Follow `prefers-color-scheme` via `detectFromSystem`, plus the flicker-free server-hint path. |
| 7  | [`07-two-way-binding.njk`](./07-two-way-binding.njk)              | `onChange` callback wiring (the Nunjucks equivalent of `v-model`). |
| 8  | [`08-lily-themes.njk`](./08-lily-themes.njk)                      | All 41 Lily / DaisyUI themes at once.                              |
| 9  | [`09-custom-rendering.njk`](./09-custom-rendering.njk)            | `{% call %}` glyph override, inline and via a wrapper macro.       |
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
`theme-chooser`, `theme-chooser-button`, `theme-chooser-icon`,
`theme-chooser-list`, `theme-chooser-option`. `data-lily-*`
attributes are kebab-case throughout.

## Ids

The listbox and its options need ids, for `aria-controls` and
`aria-activedescendant`. They are derived from the `id` opt, which
defaults to `theme-chooser-{name}`.

A Nunjucks macro cannot hold a module-level counter, so — unlike
the Svelte / React / Vue helpers — there is no automatic
per-instance uniqueness. Two controls that share a `name` must be
given distinct `id`s. Examples 03 and 09 both show this.

## Helper macro for the glyph-override example

[`themeChooserCustom.njk`](./themeChooserCustom.njk) is a thin wrapper
around `../theme-chooser.njk` that bakes in a house glyph via a
`{% call %}` block. Example 09 imports it alongside an inline
`{% call %}` for comparison.

It is no longer a fork: the shipped macro supports `{% call %}`
directly, and the block body replaces the button's glyph — it does
not render options. In a real project, copy the wrapper into your
own template directory, or just use `{% call %}` at each call site.
