# SSR — `<theme-chooser>` (HTML helper)

The select runs cleanly under any static-site generator (Eleventy,
Astro, Hugo, Jekyll, Nunjucks + Eleventy) and under server-rendered
HTML (Node + Express, Cloudflare Workers, any framework that emits
plain HTML). This page lists the recipes; the catalog-wide rules
live in [`../../AGENTS/ssr.md`](../../AGENTS/ssr.md).

## What the select does on the server

There is no "select on the server" — `customElements` only exists
in browsers. The SSG / server emits the literal
`<theme-chooser>` tag with attributes; the browser runtime
constructs the element and runs `connectedCallback` after parsing
the HTML.

If the consumer pre-renders `<theme-chooser value="dark">`, the
select's first `connectedCallback` sees `value="dark"` and skips
the storage / default fallbacks — it immediately applies `dark`.

## Why this matters

If `<html>` arrives with no `data-theme` and the theme CSS references
`:root[data-theme="dark"] { … }`, the first paint shows the default
browser styles, then on hydration the select sets `data-theme="dark"`
and the page repaints. That's the flash of unstyled theme (FOUT).

Fix: resolve the theme on the server (build time for SSG, request
time for dynamic SSR) and inline both:

- `<html data-theme="…">` in the document shell, and
- the matching `<link rel="stylesheet" href="/assets/themes/<slug>.css">`

so that CSS is in place before any pixel is painted. Pre-render the
`value` attribute on the `<theme-chooser>` host so the select doesn't
re-resolve from storage and clobber the inlined `data-theme`.

## Eleventy recipe

End-to-end code lives in
[`../examples/eleventy-cookie/`](../examples/eleventy-cookie/). The
shape:

### `_data/theme.js`

```js
// At build time, freeze the default theme. Per-user themes resolve
// on the client via localStorage; the build-time default is what
// arrives in the first paint.
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
        <script type="module" src="/dist/lily-design-system-html-theme-chooser.js"></script>
    </head>
    <body>
        {{ content | safe }}
        <theme-chooser
            label="Theme"
            themes-url="/assets/themes/"
            themes="{{ theme.available | join(',') }}"
            value="{{ theme.defaultTheme }}"
            storage-key="lily-theme"
        ></theme-chooser>
    </body>
</html>
```

Result: pages arrive with `<html data-theme="light">` and the
matching `<link>`. The select upgrades on hydration, reads back
`localStorage["lily-theme"]` on subsequent visits, and only repaints
if the stored slug differs from the build-time default.

## Astro recipe (dynamic)

Astro renders on the server per request, so it can read cookies:

```astro
---
const theme = Astro.cookies.get("theme")?.value ?? "light";
---
<html lang="en" data-theme={theme}>
    <head>
        <link rel="stylesheet" href={`/assets/themes/${theme}.css`} />
        <script type="module" src="/scripts/theme-chooser.js"></script>
    </head>
    <body>
        <theme-chooser
            label="Theme"
            themes-url="/assets/themes/"
            themes="light,dark,abyss"
            value={theme}
            storage-key="lily-theme"
        ></theme-chooser>
        <slot />
    </body>
</html>
```

The cookie-resolved value arrives in the HTML response; the select
upgrades without any visual change.

## Hugo recipe

```html
<!doctype html>
<html lang="en" data-theme="{{ .Site.Params.defaultTheme | default "light" }}">
    <head>
        <link rel="stylesheet" href="/assets/themes/{{ .Site.Params.defaultTheme | default "light" }}.css">
        <script type="module" src="/dist/theme-chooser.js"></script>
    </head>
    <body>
        <theme-chooser
            label="Theme"
            themes-url="/assets/themes/"
            themes="light,dark,abyss"
            value="{{ .Site.Params.defaultTheme | default "light" }}"
        ></theme-chooser>
    </body>
</html>
```

## Plain HTML (no SSG)

Just drop the script tag and host element into any HTML file:

```html
<!doctype html>
<html lang="en" data-theme="light">
    <head>
        <link rel="stylesheet" href="/assets/themes/light.css">
        <script type="module" src="/dist/theme-chooser.js"></script>
    </head>
    <body>
        <theme-chooser
            label="Theme"
            themes-url="/assets/themes/"
            themes="light,dark,abyss"
        ></theme-chooser>
    </body>
</html>
```

## When the select has no SSR alternative

Pre-rendering Shadow DOM is the framework-flavoured trick (declarative
shadow DOM). The HTML helpers use light DOM by contract; the
pre-rendering happens through the host attributes, not the rendered
children. The children are recreated on every `connectedCallback`.

This is *fine*: the first paint shows the consumer's CSS applied to
the un-upgraded `<theme-chooser>` host (empty), then the element
upgrades and the rendered button appears. The visible change is the
appearance of one icon button, not a re-paint of the rest of the
page — because the inlined `<html data-theme>` is unchanged. It is
also a small change: reserve space for the button in your CSS
(`theme-chooser { display: inline-block; min-inline-size: … }`) to
avoid a layout shift when it appears.

Element ids are generated from a module-level counter
(`nextThemeChooserId()`), never from `Math.random()` or `Date.now()`,
so nothing in the rendered markup differs between runs or between
server and client.

## Hydration mismatch (not really)

Custom elements don't "hydrate" in the Vue / React sense. There is
no virtual-DOM diff, no warning system. The element either upgrades
correctly or doesn't — and `connectedCallback` is robust to running
once after the parser finishes.

The only "mismatch" possible is visual: the build-time default theme
differs from the user's stored choice. The select handles this by
applying the stored choice in `connectedCallback`, replacing the
default. The user sees one frame of `light` (the default) followed
by `dark` (the stored choice). Fix by pre-resolving the same value
the select will read (cookie + server-side resolution).

## Why we don't auto-resolve from the cookie

The select is transport-agnostic. Cookies are right for dynamic SSR
(Astro, Node + Express), but build-time SSG (Eleventy, Hugo) has no
request context. The select accepts the resolved value via the
`value` attribute and lets the host wire the integration.

## Service-worker / offline

The select plays well with service-worker offline caches: every URL
it generates (`themesUrl + slug + extension`) is a normal HTTP GET
that service workers can intercept and cache. Pre-cache the full
theme catalog and the select switches instantly even offline.
