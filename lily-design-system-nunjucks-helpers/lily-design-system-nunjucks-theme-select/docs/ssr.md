# SSR and the first paint

Nunjucks **is** the server side. The macro produces a static HTML
string at render time; the browser parses and paints it; the
client.js then takes over for the runtime lifecycle. This file
explains how to wire the macro into different Nunjucks hosts for a
flicker-free first paint.

## What the macro does on the server

The macro is pure: same `opts` → same string. It does **not**
touch:

- `localStorage`
- `navigator`
- `document.head`
- the file system
- environment variables

If the consumer passes `opts.value="dark"`, the `<select>` root gets
`data-lily-theme-select-value="dark"` rendered server-side. The
rendered `<option>`s are unaffected — see the next section.

The managed `<link>` is not created on the server. `data-theme`
is not written to `<html>` on the server. Those happen on the
client.

## What happens on first paint

If `<html>` arrives with no `data-theme` and the theme CSS
references `:root[data-theme="dark"] { … }`, the first paint
shows the default browser styles, then on hydration the client.js
sets `data-theme="dark"` and the page repaints. That's the FOUT.

The fix is to **resolve the theme on the server** and inline both:

- `<html data-theme="<slug>">` in the document shell, and
- the `<link rel="stylesheet" href="/assets/themes/<slug>.css">`

so that CSS is in place before any pixel is painted.

### The `opts.value` selected-option flash — fixed

**There is no longer a pre-hydration flash when you pass
`opts.value`.** Earlier versions communicated `opts.value` to the
client by rendering `selected` on the matching `<option>`. Because the
placeholder option is *also* rendered `selected`, and a browser
resolves two selected options in favour of the **last** one, the closed
control briefly showed the theme name between first paint and
`initThemeSelect(root)`, then snapped back to the placeholder word.

The macro now passes the value out-of-band instead:

```html
<select class="theme-select" … data-lily-theme-select-value="dark">
  <option class="theme-select-option theme-select-placeholder" value="" selected>Theme</option>
  <option class="theme-select-option" value="light">Light</option>
  <option class="theme-select-option" value="dark">Dark</option>
</select>
```

The placeholder is the only `selected` option in the server HTML no
matter what `opts.value` is, so the closed control reads the
placeholder word from byte zero. `initThemeSelect(root)` reads
`data-lily-theme-select-value` during initial-value resolution (step 2
of the order in §5.2) and applies the theme — mutating `data-theme`
and the managed `<link>`, never the rendered options.

The attribute is omitted entirely when `opts.value` is unset, so it
falls through to `defaultValue` / `"light"` / first-option exactly as
before. Pass `opts.value` freely: it costs nothing visually.

## Eleventy (build time)

For sites where the default theme is acceptable on first paint:

```njk
{# _includes/layouts/base.njk #}
<!doctype html>
<html lang="en" data-theme="{{ site.defaultTheme }}">
    <head>
        <link rel="stylesheet" href="/assets/themes/{{ site.defaultTheme }}.css">
        <title>{{ title }}</title>
    </head>
    <body>
        {% block content %}{% endblock %}
        <script type="module">
            import { autoInit } from "/lily-design-system-nunjucks-theme-select/theme-select.client.js";
            autoInit();
        </script>
    </body>
</html>
```

The select still flips to the user's `localStorage` value when
the client.js runs, so returning users see a one-frame flash
unless you also store the choice in a cookie or use the edge
function pattern below.

## Eleventy edge function (Cloudflare Pages)

For per-request resolution:

```js
// functions/_middleware.js
export async function onRequest(context) {
    const cookie = context.request.headers.get("cookie") ?? "";
    const theme = /(?:^|; )theme=([^;]+)/.exec(cookie)?.[1] ?? "light";
    const response = await context.next();
    if (!response.headers.get("content-type")?.startsWith("text/html")) {
        return response;
    }
    const html = await response.text();
    const out = html
        .replace("__THEME__", theme)
        .replace("data-theme=\"PLACEHOLDER\"", `data-theme="${theme}"`);
    return new Response(out, response);
}
```

The Eleventy layout uses placeholders the function substitutes:

```njk
<html lang="en" data-theme="PLACEHOLDER">
    <head>
        <link rel="stylesheet" href="/assets/themes/__THEME__.css">
        …
    </head>
```

Companion file
[`../examples/eleventy-cookie/`](../examples/eleventy-cookie/)
ships the full pattern.

## Express + cookie-parser

```js
import express from "express";
import nunjucks from "nunjucks";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
nunjucks.configure("views", { express: app, autoescape: true });

const SUPPORTED = new Set(["light", "dark", "abyss"]);

app.get("/", (req, res) => {
    const cookie = req.cookies.theme;
    const theme = cookie && SUPPORTED.has(cookie) ? cookie : "light";
    res.render("index.njk", { theme });
});

app.post("/api/theme", express.json(), (req, res) => {
    const theme = String(req.body?.theme ?? "");
    if (!SUPPORTED.has(theme)) return res.status(400).end();
    res.cookie("theme", theme, {
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365 * 1000,
    });
    res.status(204).end();
});
```

```njk
<html lang="en" data-theme="{{ theme }}">
    <head>
        <link rel="stylesheet" href="/assets/themes/{{ theme }}.css">
        …
    </head>
    <body>
        {{ themeSelect({
            label: "Theme",
            themesUrl: "/assets/themes/",
            themes: ["light", "dark", "abyss"],
            value: theme,
            storageKey: "lily-theme"
        }) }}

        <script type="module">
            import { autoInit } from "/path/to/theme-select.client.js";
            autoInit({
                onChange(slug) {
                    fetch("/api/theme", {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({ theme: slug }),
                    });
                },
            });
        </script>
    </body>
</html>
```

## Cloudflare Workers

The Workers runtime has no Node API. Nunjucks needs a precompiled
loader:

```js
import nunjucks from "nunjucks";
import templates from "./templates.json";

const env = new nunjucks.Environment(
    new nunjucks.PrecompiledLoader(templates),
);

export default {
    async fetch(request) {
        const cookie = request.headers.get("cookie") ?? "";
        const theme = /(?:^|; )theme=([^;]+)/.exec(cookie)?.[1] ?? "light";
        const html = env.render("index.njk", { theme });
        return new Response(html, {
            headers: { "content-type": "text/html; charset=utf-8" },
        });
    },
};
```

Build templates.json with `nunjucks-precompile`.

## Why the macro doesn't auto-resolve cookies

The macro has no opinion about transport (cookie? header? URL
parameter? session store?). Cookies are right for Express,
headers for some Workers setups, query strings for embeds. The
macro stays transport-agnostic and lets the consumer wire the
integration via `opts.value`.

## Hydration consistency

There is no virtual-DOM hydration mismatch in this catalog
because the macro is one-shot HTML, not a diff. The only
cross-render gotcha is:

- The server renders no `data-lily-theme-select-value`, but the client
  picks a non-empty value from `localStorage`. The page therefore
  paints unthemed for one frame before `data-theme` and the managed
  `<link>` land. The `<select>` itself is unaffected — it reads the
  placeholder word throughout.
- **Fix.** Resolve the value server-side, write `<html data-theme>`
  and the theme `<link>` into the shell yourself, and pass the slug as
  `opts.value`.

## Plain `nunjucks.render`

```js
import nunjucks from "nunjucks";
nunjucks.configure("templates", { autoescape: true });
const html = nunjucks.render("page.njk", { theme: "dark" });
require("node:fs").writeFileSync("dist/index.html", html);
```

Static-site output works without any hosting glue. The user gets
the chosen theme on first paint; `localStorage` overrides if
present.

---

Lily™ and Lily Design System™ are trademarks.
