# ThemeChooser (Nunjucks helper)

A reusable, headless Nunjucks 3 + vanilla-JS theme chooser that
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

Most theme choosers couple selection, persistence, and styling into
one opinionated widget. This one splits the contract cleanly:

- **Authors** drop theme CSS files (e.g. `light.css`, `dark.css`)
  into a directory served by the app.
- **This helper** owns selection, dynamic loading, persistence, and
  accessibility — via a Nunjucks macro for the markup and a small
  ES module for the runtime.
- **Consumers** own the visual style of the select via the
  `theme-chooser` class hook.

The result is a tiny reusable widget that works in any Nunjucks
host (Eleventy, Express, Cloudflare Workers, plain
`nunjucks.render`) and against any theme catalog — Lily™'s 41
DaisyUI-inspired themes, NHS-aligned themes, or your own bespoke
set.

The helper is a direct port of the Svelte canonical
`lily-design-system-svelte-theme-chooser`. The DOM contract and
behaviour match clause-for-clause; only the framework idioms
differ.

## How the pieces fit

The helper is a **macro + client.js** pair:

- The macro (`theme-chooser.njk`) renders the icon button and the
  listbox markup server-side or at static-site build time.
- The client (`theme-chooser.client.js`) is an ES module the
  consumer loads once per page. It picks up the markup via
  `data-lily-theme-chooser-*` attributes and owns both the listbox
  **interaction** (open / close, focus, keyboard) and the theme
  **lifecycle** (storage, dynamic `<link>` swap, `data-theme` set).

```
Nunjucks render time                 │  Browser runtime
                                      │
{{ themeChooser({…}) }}                │  import { autoInit } from
   │                                  │    "./theme-chooser.client.js";
   ▼                                  │  autoInit();
<div                                  │     │
  class="theme-chooser"                │     ▼
  data-lily-theme-chooser-root         │  finds [data-lily-theme-chooser-root]
  data-lily-theme-chooser-themes-url   │     │
  …>                                  │     ▼
  <input type="hidden" name="theme">  │  wires button + listbox events
  <button class="theme-chooser-button" │     │
          aria-haspopup="listbox">◑   │     ▼
  <ul class="theme-chooser-list"       │  resolves initial value
      role="listbox" hidden>          │     │
    <li role="option">…</li>          │     ▼
  </ul>                               │  applyTheme(slug):
</div>                                │    - swaps <link> href
                                      │    - sets data-theme
                                      │    - writes localStorage
                                      │    - mirrors the hidden input
                                      │      and aria-selected
                                      │    - calls onChange(slug)
```

The button is **inert until the client.js runs** — see
[SSR and the first paint](#ssr-and-the-first-paint).

## Install

The directory ships as a folder-style import. Consumers either copy
the four core files into their project or wire as a workspace
dependency:

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `theme-chooser.njk`         | The Nunjucks macro.                              |
| `theme-chooser.client.js`   | The ES-module runtime.                           |
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
{% from "./lily-design-system-nunjucks-theme-chooser/theme-chooser.njk" import themeChooser %}

{{ themeChooser({
  label: "Theme",
  themesUrl: "/assets/themes/",
  themes: ["light", "dark", "abyss"],
  storageKey: "lily-theme"
}) }}

{# Status region: the closed control is an icon-only button, so it
   never shows the active theme's name. Surface it here instead —
   visibly, for sighted and screen-reader users alike.
   See docs/accessibility.md. #}
<p class="theme-chooser-status" aria-live="polite"></p>
```

3. Load the client.js once per page and keep the status region in
   sync from `onChange`:

```html
<script type="module">
  import { autoInit } from "/path/to/theme-chooser.client.js";

  const THEME_LABELS = { light: "Light", dark: "Dark", abyss: "Abyss" };
  const status = document.querySelector(".theme-chooser-status");

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

On every theme change the client.js performs five steps, in order:

1. **Locate or create** a managed
   `<link rel="stylesheet" data-lily-theme-chooser="{name}">` in
   `document.head`.
2. **Swap the href** to `${themesUrl}${slug}${extension}` so the
   new theme's CSS is fetched and applied. The previous theme's
   CSS is unloaded when the href changes.
3. **Set `data-theme="{slug}"`** on the resolved target element
   (defaults to `document.documentElement`). Theme CSS files match
   this attribute via their `:root[data-theme="…"]` selector.
4. **Persist**: if `storageKey` is set, write to `localStorage`
   (silently swallowing private-mode errors).
5. **Mirror + notify**: write the slug into the hidden input, set
   `aria-selected="true"` on the matching `<li>` (and `"false"` on
   every other), and call `opts.onChange(slug)` if supplied.

All five steps run only on the client. The macro is pure; no DOM
mutation happens during Nunjucks render.

### The icon button and the listbox

The macro renders a `<div>` root holding three things: a hidden input
for form participation, an icon-only button, and a listbox that starts
`hidden`:

```html
<div class="theme-chooser" data-lily-theme-chooser-root …>
  <input type="hidden" name="theme" value="light" data-lily-theme-chooser-input>
  <button type="button" class="theme-chooser-button" aria-label="Theme"
          aria-haspopup="listbox" aria-expanded="false"
          aria-controls="theme-chooser-theme-list"
          data-lily-theme-chooser-button>
    <span class="theme-chooser-icon" aria-hidden="true">&#9681;</span>
  </button>
  <ul class="theme-chooser-list" id="theme-chooser-theme-list" role="listbox"
      aria-label="Theme" tabindex="-1" hidden data-lily-theme-chooser-list>
    <li class="theme-chooser-option" id="theme-chooser-theme-option-0"
        role="option" aria-selected="true" data-value="light">Light</li>
    <li class="theme-chooser-option" id="theme-chooser-theme-option-1"
        role="option" aria-selected="false" data-value="dark">Dark</li>
  </ul>
</div>
```

The default glyph is U+25D1 CIRCLE WITH RIGHT HALF BLACK (`◑`),
wrapped in `aria-hidden="true"`: it is decoration, and the button's
accessible name comes **only** from `aria-label="{label}"`. Because
the button shows a fixed-width glyph rather than the theme name, the
control's width stays constant no matter how long your theme names
are.

The active theme lives in `data-theme` on the target, in the hidden
input, in `aria-selected` on the options, in `localStorage` when
`storageKey` is set, and in the `onChange(slug)` argument.

## Default theme

The default theme is `"light"` whenever `"light"` appears in your
`themes` list. The full resolution order on first `initThemeChooser`
call is:

1. The root's `data-lily-theme-chooser-value` (i.e. the consumer's
   `opts.value`). This attribute is still the only channel by which
   `opts.value` reaches the client — see
   [docs/ssr.md](./docs/ssr.md).
2. `localStorage.getItem(storageKey)` (when `storageKey` is set and
   readable).
3. `matchSystemTheme(themes)` — only when `detectFromSystem` is on.
4. The root's `data-lily-theme-chooser-default-value`
   (i.e. `opts.defaultValue`).
5. `"light"` if present among the rendered option values.
6. The first option value, or `""` if none.

`value` outranking storage is a **change**: the helper used to resolve
storage first, which silently overrode a server-resolved theme with a
stale local one. See the BREAKING entry in
[CHANGELOG.md](./CHANGELOG.md).

The macro also resolves a **server-side** selected option, so the
rendered HTML always marks exactly one `<li>` `aria-selected="true"`
and pre-fills the hidden input. That resolution is
`value or defaultValue or ("light" if present else themes[0])` —
`localStorage` and `matchMedia` are client-only, so the client may
correct the choice after hydration.

The macro never displays the word `"default"`. Option labels
default to the title-cased slug (e.g. `"light"` → `"Light"`,
`"high-contrast"` → `"High Contrast"`); override with
`opts.themeLabels`. That same rule is exported from the client module
as `themeName(slug)`, so you can render a theme's display name outside
the control without re-deriving it.

## Macro parameters

Full table in [spec/index.md §4.1](./spec/index.md#41-macro-parameters).
Required: `label`, `themesUrl`, `themes`. Optional: `value`,
`defaultValue`, `storageKey`, `name`, `extension`, `themeLabels`,
`id`, `classes`, `attributes`.

`id` is the id prefix for the listbox (`{id}-list`) and its options
(`{id}-option-{index}`). It defaults to `"theme-chooser-{name}"`, so
two instances that share a `name` **must** be given distinct `id`s —
Nunjucks macros cannot hold a module-level counter, so an explicit
`id` is this framework's stable-id mechanism.

See [docs/macro-opts-reference.md](./docs/macro-opts-reference.md)
for a field-by-field reference.

## Client.js API

Imports:

```js
import {
    initThemeChooser,
    autoInit,
    normaliseThemesUrl,
    themeHref,
    CIRCLE_WITH_RIGHT_HALF_BLACK,
} from "./theme-chooser.client.js";
```

- `autoInit(opts?)` — find every `[data-lily-theme-chooser-root]`
  on the page and wire it.
- `initThemeChooser(root, opts?)` — wire a single root `<div>`;
  returns `{setTheme, destroy}`.
- `normaliseThemesUrl(url)` — ensure exactly one trailing `/`.
- `themeHref(url, slug, extension)` — build the full href.
- `CIRCLE_WITH_RIGHT_HALF_BLACK` — the default button glyph (`◑`),
  exported so tests and custom renderings can reference it without
  re-typing the code point.

Optional `opts`:

- `onChange(slug)` — fired after every apply.
- `target` — `HTMLElement` receiving `data-theme` (defaults to
  `<html>`).

The returned controller is the imperative escape hatch:

```js
const controller = initThemeChooser(root, { onChange: console.log });
controller.setTheme("dark");   // apply imperatively
controller.destroy();            // remove every listener
```

## Custom rendering

The button's glyph is the one part of the markup the macro hands
over. Nunjucks has no render props, so its equivalent of "children"
is a `{% call %}` block: the block body replaces the default
`<span class="theme-chooser-icon">&#9681;</span>` **inside** the button.

```njk
{% call themeChooser({
    label: "Theme",
    themesUrl: "/assets/themes/",
    themes: ["light", "dark"]
}) %}
<svg class="my-glyph" width="16" height="16" aria-hidden="true" focusable="false">
    <use href="#icon-palette"></use>
</svg>
{% endcall %}
```

Everything else — the root `<div>`, the hidden input, the button's
ARIA attributes, and the listbox with its options — is still
rendered by the macro, so the helper's `data-lily-*` hooks and the
client.js keyboard contract keep working unchanged. Mark your glyph
`aria-hidden="true"`: the accessible name must keep coming from
`aria-label`.

The caller block no longer renders the options; a `{% call %}` body
that emits `<option>` elements is stale markup from the
native-`<select>` era.

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

- The trigger is a `<button type="button">` with
  `aria-haspopup="listbox"`, `aria-expanded`, and `aria-controls`
  pointing at the list. Its accessible name comes only from
  `aria-label="{label}"` — the glyph is `aria-hidden="true"`.
- The list is a `<ul role="listbox" aria-label="{label}" tabindex="-1">`
  whose `<li role="option">` children each carry
  `aria-selected="true"` or `"false"`. Focus moves to the list on
  open; the active option is conveyed with `aria-activedescendant`,
  per the WAI-ARIA APG listbox pattern.
- The active state is exposed in several independent channels:
  `data-theme` on the target, the current `<link>` href, the hidden
  input's value, and `aria-selected`. No colour-only meaning is
  required.
- **Tradeoff, and the default answer to it**: the closed button is
  icon-only, so a screen-reader user hears the control's label but
  not the active theme until the listbox is opened. The examples and
  the quick start therefore ship a visible `.theme-chooser-status`
  region with `aria-live="polite"` next to the control. Treat that
  region as part of the pattern; omitting it is the deliberate
  choice.
- WCAG 2.2 AAA is the target; visible focus styling is the
  consumer's CSS responsibility.

### Keyboard

Implemented entirely by the client.js — none of it works before the
script runs.

| Key                   | Where     | Action                                                            |
| --------------------- | --------- | ----------------------------------------------------------------- |
| `Arrow Down`          | Button    | Open, active option = the selected one (or the first).            |
| `Enter` / `Space`     | Button    | Same as `Arrow Down`.                                             |
| `Arrow Up`            | Button    | Open with the **last** option active.                             |
| `Arrow Down` / `Up`   | Listbox   | Move the active option. Clamps at the ends — no wrapping.         |
| `Home` / `End`        | Listbox   | Jump to the first / last option.                                  |
| `Enter` / `Space`     | Listbox   | Select the active option, apply it, close, refocus the button.    |
| `Escape`              | Listbox   | Close and refocus the button without changing the theme.          |
| `Tab`                 | Listbox   | Close without stealing focus back, so Tab proceeds normally.      |
| Printable characters  | Listbox   | Typeahead over the option labels; the buffer resets after 500 ms. |

Opening moves focus to the `<ul>`. Clicking an option selects it;
clicking outside, or focus leaving the root, closes the listbox.

Topic guide: [`docs/accessibility.md`](./docs/accessibility.md).

## SSR and the first paint

Nunjucks **is** the server side. The macro is pure — same `opts`
in, same HTML out — and it emits a complete, correctly-labelled
control: the collapsed button, the hidden listbox, exactly one
option marked `aria-selected="true"`, and a hidden input pre-filled
with that slug. Your `opts.value` is additionally carried on
`data-lily-theme-chooser-value` for the client to read.

**The server-rendered markup is not fully usable without
JavaScript.** The button will not open the listbox until
`theme-chooser.client.js` has run — open/close, focus movement, and
the whole keyboard contract live in the client. This is a real
regression versus the native `<select>` this helper used to render.
The one no-JS affordance that remains is the hidden input: it is
pre-filled server-side, so a no-JS form submit still carries a
theme. If a fully no-JS theme switcher is a hard requirement, ship a
server-rendered form of links or submit buttons instead of this
helper.

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
both the hidden input's `name` attribute and the discriminator on
the managed `<link>` element (`data-lily-theme-chooser="{name}"`).
Because the default id prefix is derived from `name`, distinct names
also give the two listboxes distinct ids.

If two instances genuinely must share a `name`, give each an
explicit `id` as well — otherwise their listboxes and options
collide on duplicate ids and `aria-controls` /
`aria-activedescendant` resolve to the wrong element.

Example: [`examples/03-multiple-selects.njk`](./examples/03-multiple-selects.njk).

## Styling

The control ships no CSS. Class hooks: `.theme-chooser` on the root
`<div>`, `.theme-chooser-button` on the trigger,
`.theme-chooser-icon` on the default glyph, `.theme-chooser-list` on
the listbox, and `.theme-chooser-option` on each option. The
client.js also sets `data-active` on the active option while the
listbox is open, and toggles the list's `hidden` attribute.

The listbox is a plain in-flow `<ul>` until you style it, so most
consumers position it themselves:

```css
.theme-chooser { position: relative; }
.theme-chooser-list { position: absolute; z-index: 1; }
.theme-chooser-option[data-active] { /* active-option highlight */ }
.theme-chooser-option[aria-selected="true"] { /* selected marker */ }
```

Topic guide: [`docs/styling.md`](./docs/styling.md).

## Recipes

Quick cookbook in [`docs/recipes.md`](./docs/recipes.md):

- Following the OS colour scheme via `prefers-color-scheme`.
- Reading a theme cookie in an Eleventy edge function before render.
- Migrating from a `localStorage`-only select to a cookie-backed one.
- Replacing the button glyph with your own icon.
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
| `theme-chooser.njk`        | The macro.                                       |
| `theme-chooser.client.js`  | The ES-module runtime.                           |
| `theme-chooser.test.ts`    | vitest suite covering every spec §7 item.        |
| `index.md`                | This file.                                       |
| `docs/`                   | Deep-dive topic guides.                          |
| `examples/`               | Runnable Nunjucks templates.                     |
| `CHANGELOG.md`            | Version history.                                 |

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause. Contact
joel@joelparkerhenderson.com for other terms.

---

Lily™ and Lily Design System™ are trademarks.
