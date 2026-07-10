# SSR and static-site generation

The select is SSR-safe out of the box but does not, on its own,
deliver a flicker-free first paint. This guide explains why and how
to close the gap.

## What the select does on the server

There is no "select on the server" — `customElements` only exists
in browsers. The static-site generator (or server-rendered HTML
pipeline) emits the literal `<theme-select>` tag with attributes;
the browser constructs the element and runs `connectedCallback`
after parsing the HTML.

The rendered HTML before JS upgrade looks like:

```html
<theme-select
    label="Theme"
    themes-url="/assets/themes/"
    themes="light,dark,abyss"
    value="dark"
></theme-select>
```

No `<select>`, no options, no `<link>` in `<head>` — those all
appear on hydration.

## What happens on hydration

On the client the element's `connectedCallback` runs once after the
HTML parser hits the closing tag:

1. Resolves the initial slug per
   [spec/index.md §5.2](../spec/index.md#52-initial-value-resolution).
2. Renders the `<select>` and options as children.
3. Injects the managed `<link>` into `<head>` (or reuses an
   existing one).
4. Sets `data-theme` on the target.

If the resolved slug differs from the one the consumer pre-rendered
in `<html data-theme>`, the user sees one frame of the wrong theme
before the lifecycle hook runs. This is the "flash of unstyled
theme" (FOUT).

## How to get a flicker-free first paint

The fix is to **resolve the theme on the server / at build time**
and inline both:

- `<html data-theme="<slug>">` in the document shell, and
- the `<link rel="stylesheet" href="/assets/themes/<slug>.css">`

so that CSS is in place before any pixel is painted. Pass the
resolved value as the `value` attribute on the host so the select
doesn't re-resolve from storage and clobber the inlined attribute.

### Eleventy recipe

End-to-end code lives in
[`../examples/eleventy-cookie/`](../examples/eleventy-cookie/). The
shape:

1. `_data/theme.js` exposes the build-time default theme.
2. `_includes/layout.njk` inlines `<html data-theme>` and the
   matching `<link>`.
3. The `<theme-select>` host is rendered with
   `value="{{ theme.defaultTheme }}"`.
4. On the client, the select reads `localStorage` and may apply a
   different theme — but only if the user has previously chosen
   one.

### Astro recipe (dynamic)

Astro can read cookies per request:

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

### Hugo recipe

Hugo is build-time only; the resolved theme is the same for every
visitor on a given build:

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

For user-specific themes on Hugo you need a service worker or
client-side script that reads `localStorage` before the select
upgrades; see [recipes.md](./recipes.md).

### Plain HTML

Without an SSG, the FOUT window is unavoidable unless you inline an
early-running script that reads `localStorage` and sets
`<html data-theme>` before the select mounts:

```html
<!doctype html>
<html lang="en">
    <head>
        <script>
            // Inline so it runs before the body paints.
            const t = localStorage.getItem("lily-theme") || "light";
            document.documentElement.dataset.theme = t;
            document.write(`<link rel="stylesheet" href="/assets/themes/${t}.css">`);
        </script>
        <script type="module" src="/dist/theme-select.js"></script>
    </head>
    <body>
        <theme-select
            label="Theme"
            themes-url="/assets/themes/"
            themes="light,dark,abyss"
            storage-key="lily-theme"
        ></theme-select>
    </body>
</html>
```

`document.write` is unfashionable but it's the only way to inject a
stylesheet *before* the rest of the body parses. Use it sparingly.

## Why we don't auto-resolve from the cookie

The select has no opinion about transport (cookie? header? IndexedDB?
URL parameter?). Cookies are the right answer for Astro and Node
servers, but not for build-time SSG hosts (Hugo, Eleventy), embedded
contexts, or apps that already have a server-side preference store.
The select stays transport-agnostic and lets the consumer wire the
integration.

## Eleventy-specific tips

- Use `_data/*.js` for build-time data computation; the default
  theme can be hardcoded or read from an environment variable.
- For per-page theme overrides, use front matter:
  ```yaml
  ---
  theme: dark
  ---
  ```
  And read `page.data.theme` in the layout.
- Eleventy has no request context, so cookie-based theming requires
  a service worker or an inline script.

## Astro-specific tips

- Use `Astro.cookies.get(...)` to read the cookie at request time.
- For static sites (`output: "static"`), cookies aren't available at
  build time; fall back to the build-time default + client-side
  upgrade.
- `client:load` is fine for the select; the upgrade timing doesn't
  affect the first-paint theme because the consumer pre-rendered
  `<html data-theme>`.

## Hydration mismatch (not really)

Custom elements don't "hydrate" in the React / Vue sense. The
`<theme-select>` host arrives as a plain tag; the browser invokes
its constructor and `connectedCallback` after parsing. There is no
virtual-DOM diff, no warning system, no mismatch concept.

The only "mismatch" possible is visual: the inlined
`<html data-theme>` differs from the user's stored choice. The
select handles this by applying the stored choice in
`connectedCallback`, replacing the default. The user sees one frame
of the default followed by the stored choice. Fix by pre-resolving
the same value the select will read (cookie + server-side resolution).

## Plain `vue/server-renderer`-style use

There is no equivalent for the HTML helpers — the class file is the
HTML template, not a render function. SSG hosts simply render the
host tag verbatim. The `customElements.define` call in `index.ts`
is skipped under Node (the guard reads `typeof customElements !==
"undefined"`).

---

Lily™ and Lily Design System™ are trademarks.
