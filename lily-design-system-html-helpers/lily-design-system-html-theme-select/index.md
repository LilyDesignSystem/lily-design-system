# `<theme-select>` (HTML helper)

A reusable, headless vanilla HTML/JS theme select that **loads themes
dynamically at runtime** from a developer-specified directory,
packaged as a **web component (custom element)**.

The single source of truth is [spec.md](./spec.md). This file is the
comprehensive user guide. For topic deep-dives see
[docs/](./docs/) and for working code see [examples/](./examples/).

## Table of contents

- [Why this exists](#why-this-exists)
- [Install](#install)
- [Quick start](#quick-start)
- [How it works](#how-it-works)
- [Default theme](#default-theme)
- [Attributes](#attributes)
- [JS properties](#js-properties)
- [Events](#events)
- [Custom option rendering](#custom-option-rendering)
- [Persistence](#persistence)
- [Accessibility](#accessibility)
- [SSR and static-site generation](#ssr-and-static-site-generation)
- [Preloading for zero-flicker switching](#preloading-for-zero-flicker-switching)
- [Multiple selects in one page](#multiple-selects-in-one-page)
- [Recipes](#recipes)
- [Troubleshooting](#troubleshooting)
- [Testing](#testing)

## Why this exists

Most theme selects couple selection, persistence, and styling into one
opinionated widget. This one splits the contract cleanly:

- **Authors** drop theme CSS files (e.g. `light.css`, `dark.css`) into
  a directory served by the app.
- **This element** owns selection, dynamic loading, persistence, and
  accessibility.
- **Consumers** own the visual style of the select via the
  `theme-select` class hook.

The result is a small reusable widget that works in any HTML host
(static HTML, Eleventy, Astro, Hugo, plain Vite, any framework that
emits HTML) and against any theme catalog — Lily's 41
DaisyUI-inspired themes, NHS-aligned themes, or your own bespoke set.

The element is a direct port of the Svelte canonical
`lily-design-system-svelte-theme-select`. APIs and behaviour match;
only the framework idioms differ. The change-notification path uses
a bubbling `CustomEvent` instead of Svelte's prop callback.

## Install

The directory is published as a folder-style import. Consumers either
copy it into their project or wire it as a workspace dependency. The
only runtime dependency is the browser DOM.

```ts
// One side-effect import registers <theme-select> globally:
import "./lily-design-system-html-theme-select";

// Or grab the class + helpers + types:
import {
    ThemeSelect,
    normalizeThemesUrl,
    themeHref,
    type ThemeSelectProps,
    type ThemeSelectChangeDetail,
} from "./lily-design-system-html-theme-select";
```

The barrel guards registration with
`customElements.get("theme-select")` so re-imports and SSR contexts
don't throw.

## Quick start

1. Drop theme CSS files into a directory served by your app, e.g.
   `public/assets/themes/light.css`,
   `public/assets/themes/dark.css`. Each theme scopes its tokens to
   `:root[data-theme="<slug>"]` (the convention every Lily theme
   uses).
2. Place the custom element in your markup. It renders a
   `<select>` with one `<option>` per theme on `connectedCallback`.

```html
<script type="module" src="/dist/theme-select.js"></script>

<theme-select
    label="Theme"
    themes-url="/assets/themes/"
    themes="light,dark,abyss"
    storage-key="lily-theme"
></theme-select>
```

When the user selects `dark`, the element:

- swaps a managed `<link rel="stylesheet">` in `<head>` to
  `/assets/themes/dark.css`,
- sets `data-theme="dark"` on `<html>`,
- writes `"dark"` to `localStorage["lily-theme"]`,
- dispatches `new CustomEvent("themechange", { detail: { theme: "dark" }, bubbles: true, composed: true })`.

## How it works

On every theme change the select performs four steps, in order:

1. **Locate or create** a managed
   `<link rel="stylesheet" data-lily-theme-select="{name}">` in
   `document.head`.
2. **Swap the href** to `${themesUrl}${slug}${extension}` so the new
   theme's CSS is fetched and applied. The previous theme's CSS is
   unloaded when the href changes.
3. **Set `data-theme="{slug}"`** on the resolved target element
   (defaults to `document.documentElement`). Theme CSS files match
   this attribute via their `:root[data-theme="…"]` selector.
4. **Persist + notify**: if `storage-key` is set, write to
   `localStorage` (silently swallowing private-mode errors); then
   dispatch `themechange` with the slug in `event.detail.theme`.

All four steps are SSR-safe — the element only mutates the DOM inside
`connectedCallback` and `attributeChangedCallback`, which never run
in Node.

## Default theme

The default theme is `"light"` whenever `"light"` appears in your
`themes` list. The full resolution order on first
`connectedCallback` is:

1. `value` attribute (if non-empty)
2. `localStorage[storage-key]` (if `storage-key` is set and readable)
3. `default-value` attribute
4. `"light"` (if present in `themes`)
5. `themes[0]`
6. `""` — nothing is applied; the select waits for user interaction

The select never displays the word `"default"`. Option labels default
to the slug with its first letter upper-cased
(e.g. `"light"` → `"Light"`); override with `theme-labels`
(JSON-encoded object).

## Attributes

The complete table is in [spec.md §4.1](./spec.md#41-observed-attributes).
Highlights:

| Attribute       | Type           | Required | Notes                                      |
| --------------- | -------------- | -------- | ------------------------------------------ |
| `label`         | string         | yes      | `aria-label` on the rendered `<select>`.   |
| `themes-url`    | string         | yes      | Trailing `/` is auto-added.                |
| `themes`        | string (CSV)   | yes      | Available slugs, e.g. `"light,dark"`.      |
| `value`         | string         | no       | Currently selected slug.                   |
| `default-value` | string         | no       | Initial when nothing else applies.         |
| `storage-key`   | string         | no       | `localStorage` persistence.                |
| `name`          | string         | no       | `<select>` `name`; defaults to `"theme"`.  |
| `extension`     | string         | no       | Defaults to `".css"`.                      |
| `theme-labels`  | string (JSON)  | no       | `{ "light": "Bright" }` overrides.         |
| `class`         | string         | no       | Extra class on the rendered `<select>`.    |

See [docs/attributes-reference.md](./docs/attributes-reference.md) for
a field-by-field reference.

## JS properties

Every observed attribute mirrors a JS property of the same name (in
camelCase):

| Property          | Type                     | Notes                                              |
| ----------------- | ------------------------ | -------------------------------------------------- |
| `el.label`        | `string`                 | round-trips with `label` attribute                 |
| `el.themesUrl`    | `string`                 | round-trips with `themes-url`                      |
| `el.themes`       | `string[]`               | CSV-encoded in the `themes` attribute              |
| `el.value`        | `string`                 | round-trips with `value`                           |
| `el.defaultValue` | `string`                 | round-trips with `default-value`                   |
| `el.storageKey`   | `string`                 | round-trips with `storage-key`                     |
| `el.name`         | `string`                 | round-trips with `name`                            |
| `el.extension`    | `string`                 | round-trips with `extension`                       |
| `el.themeLabels`  | `Record<string, string>` | JSON-encoded in `theme-labels`                     |
| `el.target`       | `HTMLElement \| null`    | no attribute form (HTMLElement is not serialisable) |

Array / object properties accept the native form:

```ts
const select = document.querySelector("theme-select") as ThemeSelect;
select.themes = ["light", "dark", "abyss"];
select.themeLabels = { light: "Bright", dark: "Midnight" };
```

## Events

| Event           | Detail              | Bubbles | Composed | When                                                  |
| --------------- | ------------------- | ------- | -------- | ----------------------------------------------------- |
| `themechange`   | `{ theme: string }` | yes     | yes      | After the select applies a new theme.                 |

```ts
const select = document.querySelector("theme-select")!;
select.addEventListener("themechange", (e) => {
    const { theme } = (e as CustomEvent<{ theme: string }>).detail;
    console.log("theme is now", theme);
});
```

Because the event bubbles, event delegation works too:

```ts
document.body.addEventListener("themechange", handleThemeChange);
```

## Custom option rendering

The HTML helpers don't expose Vue scoped slots or Svelte snippets;
the customisation surface is **subclassing**. Extend the class and
override `#render()` to emit your own option markup. The base class
keeps owning the lifecycle (managed `<link>`, `data-theme`,
`themechange`):

```ts
import { ThemeSelect } from "./lily-design-system-html-theme-select";

class SwatchPicker extends ThemeSelect {
    // Override the rendering surface (see docs/custom-rendering.md
    // for the exact extension hook).
}

customElements.define("swatch-picker", SwatchPicker);
```

Working examples: [`examples/09-custom-rendering.html`](./examples/09-custom-rendering.html).
Topic guide: [`docs/custom-rendering.md`](./docs/custom-rendering.md).

## Persistence

Pass a `storage-key` to persist the active slug to `localStorage`.
On a fresh mount the select reads back the stored slug as part of
the initial-value resolution (§ Default theme).

Errors writing to or reading from `localStorage` (private mode,
quota, disabled storage) are silently swallowed — the select
continues to work in-memory.

If you need cookie-based persistence (so SSR can read the theme
before first paint), see [`docs/ssr.md`](./docs/ssr.md) and the
[`examples/eleventy-cookie/`](./examples/eleventy-cookie/) recipe.

## Accessibility

- The rendered root is a `<select>` with the implicit combobox role
  and `aria-label={label}`.
- The native `<select>` gives Tab / Arrow / typeahead semantics for
  free; the select does not override any keyboard behaviour.
- The active state is exposed in three independent channels:
  the selected `<option>`, `data-theme` on the root, and the
  `value` attribute. No colour-only meaning is required.
- WCAG 2.2 AAA is the target; visible focus styling is the
  consumer's CSS responsibility.

Topic guide: [`docs/accessibility.md`](./docs/accessibility.md).

## SSR and static-site generation

The element compiles cleanly under static-site generators (Eleventy,
Astro, Hugo, Jekyll). On the server no lifecycle hook runs and no
DOM is touched; the SSG emits the literal `<theme-select>` tag, and
the browser upgrades it after the JS loads.

For zero-flicker static rendering, resolve the theme at build time
(or via cookie for dynamic SSR) and pre-render two things:

- `<html data-theme="…">` in the document shell
- a matching `<link rel="stylesheet">` for the chosen theme

Then pass the resolved value as the `value` attribute on the host so
the select doesn't re-resolve from storage and clobber the inlined
attribute.

See [`docs/ssr.md`](./docs/ssr.md) and
[`examples/eleventy-cookie/`](./examples/eleventy-cookie/).

## Preloading for zero-flicker switching

By default the select swaps one `<link>` href, so the active theme
is fetched on demand. To switch instantly between themes, preload
them all yourself:

```html
<link rel="stylesheet" href="/assets/themes/light.css">
<link rel="stylesheet" href="/assets/themes/dark.css">
<link rel="stylesheet" href="/assets/themes/abyss.css">
```

The select still mutates `data-theme`, and since every theme's CSS
is scoped to `:root[data-theme="…"]`, the active rules switch
instantly with the attribute change — no network round-trip.

Topic guide: [`docs/preloading.md`](./docs/preloading.md). Working
example: [`examples/05-preloaded.html`](./examples/05-preloaded.html).

## Multiple selects in one page

Pass a distinct `name` attribute to each select. The `name` is used
as both the `<select>` `name` and the discriminator on the managed
`<link>` element (`data-lily-theme-select="{name}"`).

Example: [`examples/03-multiple-selects.html`](./examples/03-multiple-selects.html).

## Recipes

Quick cookbook in [`docs/recipes.md`](./docs/recipes.md):

- Following the OS colour scheme via `prefers-color-scheme`.
- Reading a theme cookie in Eleventy before render.
- Migrating from a `localStorage`-only select to a cookie-backed one.
- Building a flyout / dropdown UI around the select.
- Loading themes from a CDN.

## Troubleshooting

See [`docs/troubleshooting.md`](./docs/troubleshooting.md). Common
pitfalls:

- **CSS does not switch.** Check that each theme file scopes its
  rules to `:root[data-theme="<slug>"]` (not `:root` alone).
- **404 on theme href.** Check the file is served from `themes-url`
  and uses the configured `extension` (defaults to `.css`).
- **Flash of default theme.** Pass a build-time-resolved `value`
  attribute and inline `<html data-theme>` in the SSG output.
- **Theme does not persist.** Confirm `storage-key` is set and that
  `localStorage` is available (not blocked by private mode).

## Testing

```sh
pnpm test
```

Runs the vitest + jsdom suite that exercises every numbered
acceptance criterion in
[spec.md §7](./spec.md#7-testing-acceptance-criteria).

## Files in this directory

| File                  | Purpose                                          |
| --------------------- | ------------------------------------------------ |
| `spec.md`             | Single source of truth — API, behaviour, tests.  |
| `AGENTS.md`           | Fast-index pointer; loads the AGENTS bundle.     |
| `AGENTS/`             | Topic-by-topic agent files.                      |
| `CLAUDE.md`           | `@AGENTS.md`.                                    |
| `theme-select.ts`     | The custom-element class.                        |
| `theme-select.test.ts`| vitest suite covering every spec §7 item.        |
| `index.ts`            | Barrel + side-effectful `customElements.define`. |
| `index.md`            | This file.                                       |
| `docs/`               | Deep-dive topic guides.                          |
| `examples/`           | Runnable `.html` files.                          |
| `CHANGELOG.md`        | Version history.                                 |

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause. Contact
joel@joelparkerhenderson.com for other terms.
