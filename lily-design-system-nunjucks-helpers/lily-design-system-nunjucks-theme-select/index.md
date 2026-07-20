# ThemeSelect (Nunjucks helper)

A reusable, headless Nunjucks 3 + vanilla-JS theme select that
**loads themes dynamically at runtime** from a developer-specified
directory.

The single source of truth is [spec/index.md](./spec/index.md). This file is
the comprehensive user guide. For topic deep-dives see [docs/](./docs/)
and for working code see [examples/](./examples/).

## Table of contents

- [Why this exists](#why-this-exists)
- [How the pieces fit](#how-the-pieces-fit)
- [Install](#install)
- [Quick start](#quick-start)
- [How it works](#how-it-works)
- [Default theme](#default-theme)
- [Macro parameters](#macro-parameters)
- [Client.js API](#clientjs-api)
- [Custom rendering](#custom-rendering)
- [Persistence](#persistence)
- [Accessibility](#accessibility)
- [Styling](#styling)
- [SSR and the first paint](#ssr-and-the-first-paint)
- [Preloading for zero-flicker switching](#preloading-for-zero-flicker-switching)
- [Multiple selects in one page](#multiple-selects-in-one-page)
- [Recipes](#recipes)
- [Troubleshooting](#troubleshooting)
- [Testing](#testing)

## Why this exists

Most theme selects couple selection, persistence, and styling into
one opinionated widget. This one splits the contract cleanly:

- **Authors** drop theme CSS files (e.g. `light.css`, `dark.css`)
  into a directory served by the app.
- **This helper** owns selection, dynamic loading, persistence, and
  accessibility — via a Nunjucks macro for the markup and a small
  ES module for the runtime.
- **Consumers** own the visual style of the select via the
  `theme-select` class hook.

The result is a tiny reusable widget that works in any Nunjucks
host (Eleventy, Express, Cloudflare Workers, plain
`nunjucks.render`) and against any theme catalog — Lily™'s 41
DaisyUI-inspired themes, NHS-aligned themes, or your own bespoke
set.

The helper is a direct port of the Svelte canonical
`lily-design-system-svelte-theme-select`. The DOM contract and
behaviour match clause-for-clause; only the framework idioms
differ.

## How the pieces fit

The helper is a **macro + client.js** pair:

- The macro (`theme-select.njk`) renders the `<select>` markup
  server-side or at static-site build time.
- The client (`theme-select.client.js`) is an ES module the
  consumer loads once per page. It picks up the markup via
  `data-lily-theme-select-*` attributes and owns the browser-side
  lifecycle (storage, dynamic `<link>` swap, `data-theme` set).

```
Nunjucks render time                 │  Browser runtime
                                      │
{{ themeSelect({…}) }}                │  import { autoInit } from
   │                                  │    "./theme-select.client.js";
   ▼                                  │  autoInit();
<select                               │     │
  class="theme-select"                │     ▼
  name="theme"                        │  finds [data-lily-theme-select-root]
  data-lily-theme-select-root         │     │
  data-lily-theme-select-themes-url   │     ▼
  …>                                  │  resolves initial value
  <option value="…">…</option>        │     │
  …                                   │     ▼
</select>                             │  applyTheme(slug):
                                      │    - swaps <link> href
                                      │    - sets data-theme
                                      │    - writes localStorage
                                      │    - calls onChange(slug)
```

## Install

The directory ships as a folder-style import. Consumers either copy
the four core files into their project or wire as a workspace
dependency:

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `theme-select.njk`         | The Nunjucks macro.                              |
| `theme-select.client.js`   | The ES-module runtime.                           |
| `index.ts` (optional)      | Re-export of the client.js for ESM imports.      |
| `spec/index.md` / `index.md`     | Documentation.                                   |

Runtime dependencies: `nunjucks` ≥ 3 server-side and standard DOM
APIs client-side. No bundler required.

## Quick start

1. Drop theme CSS files into a directory served by your app, e.g.
   `static/assets/themes/light.css`,
   `static/assets/themes/dark.css`. Each theme scopes its tokens to
   `:root[data-theme="<slug>"]` (the convention every Lily theme
   uses).
2. Render the macro in your Nunjucks template:

```njk
{% from "./lily-design-system-nunjucks-theme-select/theme-select.njk" import themeSelect %}

{{ themeSelect({
  label: "Theme",
  themesUrl: "/assets/themes/",
  themes: ["light", "dark", "abyss"],
  storageKey: "lily-theme"
}) }}

{# Status region: the closed <select> shows the placeholder word
   ("Theme"), never the active theme, so the active theme is surfaced
   here instead — visibly, for sighted and screen-reader users alike.
   See docs/accessibility.md. #}
<p class="theme-select-status" aria-live="polite"></p>
```

3. Load the client.js once per page and keep the status region in
   sync from `onChange`:

```html
<script type="module">
  import { autoInit } from "/path/to/theme-select.client.js";

  const THEME_LABELS = { light: "Light", dark: "Dark", abyss: "Abyss" };
  const status = document.querySelector(".theme-select-status");

  autoInit({
    onChange(slug) {
      // aria-live="polite" announces mutations only, so this is silent
      // on first paint and speaks on each subsequent change.
      status.textContent = `Active theme: ${THEME_LABELS[slug] ?? slug}`;
    },
  });
</script>
```

Keep the status region **visible** by default: it helps sighted and
cognitive-accessibility users too, and WCAG 2.2 AAA favours it. If your
design genuinely can't spare the space, make it visually hidden rather
than dropping it — recipe in
[docs/styling.md](./docs/styling.md).

When the user picks `dark`, the client:

- swaps a managed `<link rel="stylesheet">` in `<head>` to
  `/assets/themes/dark.css`,
- sets `data-theme="dark"` on `<html>`,
- writes `"dark"` to `localStorage["lily-theme"]`,
- calls the optional `opts.onChange("dark")` callback.

## How it works

On every theme change the client.js performs four steps, in order:

1. **Locate or create** a managed
   `<link rel="stylesheet" data-lily-theme-select="{name}">` in
   `document.head`.
2. **Swap the href** to `${themesUrl}${slug}${extension}` so the
   new theme's CSS is fetched and applied. The previous theme's
   CSS is unloaded when the href changes.
3. **Set `data-theme="{slug}"`** on the resolved target element
   (defaults to `document.documentElement`). Theme CSS files match
   this attribute via their `:root[data-theme="…"]` selector.
4. **Persist + notify**: if `storageKey` is set, write to
   `localStorage` (silently swallowing private-mode errors); then
   snap the `<select>` back to its placeholder option
   (`select.value = ""`) and call `opts.onChange(slug)` if supplied.

All four steps run only on the client. The macro is pure; no DOM
mutation happens during Nunjucks render.

### The always-visible placeholder

The macro renders a component-owned placeholder as the first
`<option>` of the `<select>`:

```html
<select class="theme-select" aria-label="Theme" name="theme" …>
  <option class="theme-select-option theme-select-placeholder" value="" selected>Theme</option>
  <option class="theme-select-option" value="light">Light</option>
  <option class="theme-select-option" value="dark">Dark</option>
</select>
```

The closed control therefore always reads the placeholder word
("Theme" by default, or `opts.placeholder` when you supply it) rather
than the name of the active theme, so the control's width stays
constant no matter how long your theme names are. After each change
the client resets `select.value` to `""`.

This means **the `<select>`'s own value is not the active theme**. The
active theme lives in `data-theme` on the target, in `localStorage`
when `storageKey` is set, and in the `onChange(slug)` argument. If a
consumer `change` listener reads `event.target.value` it will see
`""` — use `onChange` instead.

## Default theme

The default theme is `"light"` whenever `"light"` appears in your
`themes` list. The full resolution order on first `initThemeSelect`
call is:

1. `localStorage.getItem(storageKey)` (when `storageKey` is set and
   readable).
2. The `<select>`'s `data-lily-theme-select-value` (i.e. the
   consumer's `opts.value`). The macro emits this attribute instead
   of rendering `selected` on the matching option, so the closed
   control never flashes the theme name before the client runs — see
   [docs/ssr.md](./docs/ssr.md).
3. The `<select>`'s `data-lily-theme-select-default-value`
   (i.e. `opts.defaultValue`).
4. `"light"` if present among the rendered option values.
5. The first option value, or `""` if none.

The macro never displays the word `"default"`. Option labels
default to the slug with its first letter upper-cased
(e.g. `"light"` → `"Light"`); override with `opts.themeLabels`.

## Macro parameters

Full table in [spec/index.md §4.1](./spec/index.md#41-macro-parameters).
Required: `label`, `themesUrl`, `themes`. Optional: `placeholder`,
`value`, `defaultValue`, `storageKey`, `name`, `extension`,
`themeLabels`, `classes`, `attributes`.

See [docs/macro-opts-reference.md](./docs/macro-opts-reference.md)
for a field-by-field reference.

## Client.js API

Imports:

```js
import {
    initThemeSelect,
    autoInit,
    normaliseThemesUrl,
    themeHref,
} from "./theme-select.client.js";
```

- `autoInit(opts?)` — find every `[data-lily-theme-select-root]`
  on the page and wire it.
- `initThemeSelect(root, opts?)` — wire a single `<select>`; returns
  `{setTheme, destroy}`.
- `normaliseThemesUrl(url)` — ensure exactly one trailing `/`.
- `themeHref(url, slug, extension)` — build the full href.

Optional `opts`:

- `onChange(slug)` — fired after every apply.
- `target` — `HTMLElement` receiving `data-theme` (defaults to
  `<html>`).

The returned controller is the imperative escape hatch:

```js
const controller = initThemeSelect(root, { onChange: console.log });
controller.setTheme("dark");   // apply imperatively
controller.destroy();            // remove the change listener
```

## Custom rendering

The default macro body emits a native `<select>` with `<option>`
children. When you need a different visual — swatch buttons, a flyout
— use the `{% call %}` caller-block pattern:

```njk
{% call themeSelect({
    label: "Theme",
    themesUrl: "/assets/themes/",
    themes: ["light", "dark"]
}) %}
<button type="button" data-theme="light" aria-pressed="false">Light</button>
<button type="button" data-theme="dark" aria-pressed="false">Dark</button>
{% endcall %}
```

The macro wraps the caller's markup in the same `<select>` root so
the helper's `data-lily-*` hooks still apply. You wire button clicks
to the client.js via `initThemeSelect(root, { onChange: … })` and call
`controller.setTheme(slug)`.

Topic guide: [`docs/custom-rendering.md`](./docs/custom-rendering.md).

## Persistence

Pass a `storageKey` to persist the active slug to `localStorage`.
On a fresh page load the client.js reads back the stored slug as
the first step of initial-value resolution (§ Default theme).

Errors writing to or reading from `localStorage` (private mode,
quota, disabled storage) are silently swallowed — the select
continues to work in-memory.

If you need cookie-based persistence (so the server can read the
theme before first paint), see [`docs/ssr.md`](./docs/ssr.md) and
the [`examples/eleventy-cookie/`](./examples/eleventy-cookie/)
recipe.

## Accessibility

- The root is a `<select>` (implicit `combobox` role) with
  `aria-label="{label}"`; each `<option>` has the implicit `option`
  role.
- The native `<select>` gives Arrow / Home / End / typeahead / Tab
  semantics for free; the helper does not override any keyboard
  behaviour.
- The active state is exposed in two independent channels:
  `data-theme` on the root and the current `<link>` href. No
  colour-only meaning is required.
- **Tradeoff, and the default answer to it**: the closed control always
  reads the placeholder, so a screen-reader user no longer hears the
  active theme announced as the combobox value. The examples and the
  quick start therefore ship a visible `.theme-select-status` region
  with `aria-live="polite"` next to the select. Treat that region as
  part of the pattern; omitting it is the deliberate choice.
- WCAG 2.2 AAA is the target; visible focus styling is the
  consumer's CSS responsibility.

Topic guide: [`docs/accessibility.md`](./docs/accessibility.md).

## SSR and the first paint

Nunjucks **is** the server side. The macro is pure — same `opts`
in, same HTML out. The browser sees a static native select showing
the placeholder word, with your `opts.value` carried on
`data-lily-theme-select-value` (never as a `selected` option, so
there is no pre-hydration flash). The client.js then takes over for
the runtime lifecycle.

For zero-flicker first paint, read the cookie or session value in
your Nunjucks host (Eleventy edge function, Express middleware,
Cloudflare Workers handler) and pass it as `opts.value`. See
[`docs/ssr.md`](./docs/ssr.md) and the
[`examples/eleventy-cookie/`](./examples/eleventy-cookie/) recipe.

## Preloading for zero-flicker switching

By default the select swaps one `<link>` href, so the active theme
is fetched on demand. To switch instantly between themes, preload
them all in your layout `<head>`:

```html
<link rel="stylesheet" href="/assets/themes/light.css">
<link rel="stylesheet" href="/assets/themes/dark.css">
<link rel="stylesheet" href="/assets/themes/abyss.css">
```

The select still mutates `data-theme`, and since every theme's CSS
is scoped to `:root[data-theme="…"]`, the active rules switch
instantly with the attribute change — no network round-trip.

Topic guide: [`docs/preloading.md`](./docs/preloading.md). Working
example: [`examples/05-preloaded.njk`](./examples/05-preloaded.njk).

## Multiple selects in one page

Pass a distinct `name` to each macro call. The `name` is used as
both the `<select>` `name` attribute and the discriminator on the
managed `<link>` element (`data-lily-theme-select="{name}"`).

Example: [`examples/03-multiple-selects.njk`](./examples/03-multiple-selects.njk).

## Styling

The select ships no CSS. Class hooks: `.theme-select` on the root,
`.theme-select-option` on each option, `.theme-select-placeholder` on
the leading placeholder option. Because the closed control always
shows the placeholder word, you can cap its width:

```css
.theme-select {
    field-sizing: content;  /* Chrome 123+: size to the shown option */
    width: auto;
    max-width: 12ch;        /* fallback for Firefox / Safari */
}
```

Topic guide: [`docs/styling.md`](./docs/styling.md).

## Recipes

Quick cookbook in [`docs/recipes.md`](./docs/recipes.md):

- Following the OS colour scheme via `prefers-color-scheme`.
- Reading a theme cookie in an Eleventy edge function before render.
- Migrating from a `localStorage`-only select to a cookie-backed one.
- Building a flyout / dropdown UI around the select.
- Loading themes from a CDN.

## Troubleshooting

See [`docs/troubleshooting.md`](./docs/troubleshooting.md). Common
pitfalls:

- **CSS does not switch.** Check that each theme file scopes its
  rules to `:root[data-theme="<slug>"]` (not `:root` alone).
- **404 on theme href.** Check the file is served from `themesUrl`
  and uses the configured `extension`.
- **Flash of unstyled theme.** Pass a server-resolved `opts.value`
  (cookie) so the SSR markup matches what the client.js will set.
- **Theme does not persist.** Confirm `storageKey` is set and that
  `localStorage` is available.

## Testing

`pnpm test` under a vitest + jsdom setup exercises every numbered
acceptance criterion in
[spec/index.md §7](./spec/index.md#7-testing-acceptance-criteria).

## Files in this directory

| File                      | Purpose                                          |
| ------------------------- | ------------------------------------------------ |
| `spec/index.md`                 | Single source of truth — API, behaviour, tests.  |
| `AGENTS.md`               | Fast-index pointer; loads the AGENTS bundle.     |
| `AGENTS/`                 | Topic-by-topic agent files.                      |
| `CLAUDE.md`               | `@AGENTS.md`.                                    |
| `theme-select.njk`        | The macro.                                       |
| `theme-select.client.js`  | The ES-module runtime.                           |
| `theme-select.test.ts`    | vitest suite covering every spec §7 item.        |
| `index.md`                | This file.                                       |
| `docs/`                   | Deep-dive topic guides.                          |
| `examples/`               | Runnable Nunjucks templates.                     |
| `CHANGELOG.md`            | Version history.                                 |

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause. Contact
joel@joelparkerhenderson.com for other terms.

---

Lily™ and Lily Design System™ are trademarks.
