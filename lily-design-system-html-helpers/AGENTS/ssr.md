# SSR — Lily HTML Helpers

Custom elements are a runtime browser API: the `customElements`
registry only exists in browsers. The HTML helpers compile cleanly
under static-site generators (Eleventy, Astro, Hugo, Jekyll,
Eleventy Bundler), but the lifecycle (DOM mutation, `localStorage`,
`CustomEvent` dispatch) only runs after the page hydrates with JS.

This page lists the rules the helpers follow so static-site
generation + client upgrade stays consistent, and provides the
canonical recipes for the common SSGs.

## Rules every helper follows

1. **No top-level DOM access.** The custom-element class file
   imports nothing browser-only at module evaluation time. Every
   `document.*` / `localStorage.*` call lives inside
   `connectedCallback`, `attributeChangedCallback`, or
   `disconnectedCallback` — all of which only run once the element
   is in a real document tree.
2. **`customElements.define` is guarded.** `index.ts` checks
   `typeof customElements !== "undefined" && !customElements.get(tag)`
   before registering. Importing the barrel under Node throws no
   error; the registration is simply skipped.
3. **Render is deterministic from attributes.** Given the same
   attributes, the SSG-emitted HTML and the post-hydration HTML
   match — assuming the consumer wires the SSG to pre-render the
   resolved `value`. No hydration mismatch warnings because there
   is no hydration framework — the custom element just inflates the
   first time `connectedCallback` runs.
4. **`value` is the SSR bridge.** When you want flicker-free first
   paint, resolve the value server-side (cookie, header, build-time
   data) and pre-render the matching attribute. The element starts
   in the resolved state instead of resolving from
   `localStorage`/`navigator` after the JS runs.

## What "SSR" means for custom elements

Two distinct flavours:

- **Static site generation (SSG)** — the HTML is written to disk
  at build time and served as a flat file. The custom element's
  client-side JS upgrades it on first visit. Examples: Eleventy,
  Astro, Hugo, Jekyll, Nunjucks + Eleventy.
- **Streaming SSR with declarative shadow DOM** — Node renders
  pre-defined custom elements with a `<template
  shadowrootmode="open">` child so the shadow DOM exists before JS
  loads. The HTML helpers use light DOM, so this flavour does not
  apply; the simpler "static markup + client upgrade" path is the
  canonical strategy.

For this catalog, "SSR" effectively means "static-site generation"
and the recipes assume an SSG host.

## Eleventy (recommended for cookie-free SSG)

End-to-end recipe lives in
`examples/eleventy-cookie/` under each helper. The shape:

### `_data/theme.js`

```js
// Read the theme cookie at build time? No — SSG runs once.
// For cookie-driven theming you need a server (see Astro section).
// For SSG + client upgrade, ship the default theme in the HTML.

module.exports = {
    defaultTheme: "light",
    available: ["light", "dark", "abyss"],
};
```

### `_includes/layout.njk`

```njk
<!doctype html>
<html lang="en" data-theme="{{ theme.defaultTheme }}">
    <head>
        <link rel="stylesheet" href="/assets/themes/{{ theme.defaultTheme }}.css">
        <script type="module" src="/dist/theme-select.js"></script>
    </head>
    <body>
        {{ content | safe }}
        <theme-select
            label="Theme"
            themes-url="/assets/themes/"
            themes="{{ theme.available | join(',') }}"
            value="{{ theme.defaultTheme }}"
            storage-key="lily-theme"
        ></theme-select>
    </body>
</html>
```

The static HTML arrives with `<html data-theme="light">` and the
matching `<link>` in `<head>`. The select upgrades on hydration,
takes over the lifecycle, and reads back `localStorage` on
subsequent visits.

## Astro (cookie or build-time)

Astro can read cookies during the request (in dynamic mode) or
inline build-time data (in static mode).

```astro
---
const theme = Astro.cookies.get("theme")?.value ?? "light";
---
<html lang="en" data-theme={theme}>
    <head>
        <link rel="stylesheet" href={`/assets/themes/${theme}.css`} />
        <script type="module" src="/scripts/theme-select.js"></script>
    </head>
    <body>
        <theme-select
            label="Theme"
            themes-url="/assets/themes/"
            themes="light,dark,abyss"
            value={theme}
            storage-key="lily-theme"
        ></theme-select>
        <slot />
    </body>
</html>
```

Astro renders the literal `<theme-select>` tag with its attributes;
the select upgrades on the client. Because the attributes already
encode the resolved value, the upgrade is invisible — no flash.

## Hugo

Hugo's templates inline data the same way:

```html
<!doctype html>
<html lang="en" data-theme="{{ .Site.Params.defaultTheme | default "light" }}">
    <head>
        <link rel="stylesheet" href="/assets/themes/{{ .Site.Params.defaultTheme | default "light" }}.css">
        <script type="module" src="/dist/theme-select.js"></script>
    </head>
    <body>
        <theme-select
            label="Theme"
            themes-url="/assets/themes/"
            themes="light,dark,abyss"
            value="{{ .Site.Params.defaultTheme | default "light" }}"
        ></theme-select>
    </body>
</html>
```

## Nunjucks + Eleventy locale recipe

```njk
<html lang="{{ locale.tag }}" dir="{{ locale.dir }}">
    <body>
        <locale-select
            label="Language"
            locales="en,fr,ar"
            value="{{ locale.code }}"
            storage-key="lily-locale"
        ></locale-select>
    </body>
</html>
```

The pre-rendered `<html lang dir>` arrives correct. The select
hydrates without changing anything visible.

## Plain HTML (no SSG)

Drop the script tag and the custom element directly into any HTML
file:

```html
<!doctype html>
<html lang="en" data-theme="light">
    <head>
        <link rel="stylesheet" href="/assets/themes/light.css">
        <script type="module" src="/dist/theme-select.js"></script>
    </head>
    <body>
        <theme-select
            label="Theme"
            themes-url="/assets/themes/"
            themes="light,dark,abyss"
        ></theme-select>
    </body>
</html>
```

This is the simplest deployment path; flicker-free first paint
requires that the inline `<html data-theme="light">` matches the
default theme the select will resolve.

## Hydration mismatch (avoided by construction)

The HTML helpers do not hydrate in the Vue / React sense — they
inflate (`connectedCallback` runs once on first attach). The result
is no virtual-DOM diffing and no hydration warning.

The only "mismatch" possible is visual: the pre-rendered HTML
includes `<html data-theme="light">` but the select resolves
`localStorage["theme"] === "dark"` on first visit. The result is
one frame of `light` followed by a re-paint to `dark`. Fix by
having the consumer pre-resolve the same value the select will
read (cookie, build-time data, etc.).

## Why not declarative shadow DOM

Declarative shadow DOM (`<template shadowrootmode="open">`) is the
HTML-spec mechanism for streaming SSR of custom elements that use
Shadow DOM. The HTML helpers use light DOM by contract (see
[`./conventions.md`](./conventions.md) §"Light DOM"), so the
declarative-shadow-DOM machinery is irrelevant. Light DOM + static
attributes is simpler and works in every SSG.

## What "SSG" effectively delivers

- Search-engine-crawlable markup including the `<theme-select>` host.
- Browser-default rendering even if the JS bundle fails to load
  (the host is empty, but the rest of the page is untouched).
- A deterministic initial state (the attributes the SSG wrote).
- Zero flash when the consumer pre-resolves the value and inlines
  the matching `<html data-theme>` / `<html lang dir>` /
  `<link rel="stylesheet">`.

## Why not auto-resolve from the request

The select is transport-agnostic. Cookies, headers, and URL
parameters are all valid transports; the right answer depends on
the host (Eleventy is build-time, Astro can be dynamic, Hugo is
strictly static). The select accepts the resolved value via an
attribute and lets the SSG wire the integration.
