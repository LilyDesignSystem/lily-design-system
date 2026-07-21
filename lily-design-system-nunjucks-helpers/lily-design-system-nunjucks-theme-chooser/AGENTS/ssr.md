# SSR — ThemeChooser (Nunjucks)

Nunjucks is the server side: the macro **is** the SSR render. This
file lists the Nunjucks-host-specific recipes; the catalog-wide
rules live in [`../../AGENTS/ssr.md`](../../AGENTS/ssr.md).

## What the macro does at render time

The macro is pure: same `opts` in, same HTML out. It does not
touch `localStorage`, `navigator`, `document.head`, or any DOM
API.

What it does emit server-side:

- The root `<div>` with every `data-lily-theme-chooser-*` config
  attribute. If the consumer passes `opts.value="dark"`, the root
  gets `data-lily-theme-chooser-value="dark"`; the attribute is
  omitted entirely when `value` is empty.
- A collapsed `<button aria-expanded="false">` and a `<ul
  role="listbox" hidden>`.
- A server-resolved selected option:
  `value or defaultValue or ("light" if present else themes[0])`.
  Exactly one `<li>` carries `aria-selected="true"`.
- A hidden `<input>` pre-filled with that same slug.

The managed `<link>` is **not** created at render time.
`data-theme` is **not** written to `<html>` at render time. Those
happen when the client.js runs in the browser. Neither is the
server's choice final: `localStorage` and `matchMedia` are both
client-only, so the client may correct `aria-selected` and the hidden
input on hydration. What it will **not** override is an explicit
`opts.value` — that is the first input in the client's resolution
order, ahead of storage and detection alike, so a server-resolved
theme survives hydration intact.

## The no-JS regression (read this before promising progressive enhancement)

The macro used to render a native `<select>`, which worked without
JavaScript. It no longer does. The control is an icon button plus a
listbox, and **every** interactive behaviour — opening, closing,
focus movement, arrow keys, typeahead, selection — lives in
`theme-chooser.client.js`. Server-rendered markup alone gives the
user a button that does nothing.

The single no-JS affordance that survives is the hidden input: it is
pre-filled server-side, so a form that wraps the control still
submits a theme value. That is the whole of it.

Consequences worth stating plainly to consumers:

- Do not describe this helper as progressively enhanced beyond the
  hidden input.
- If a working no-JS theme switcher is a hard requirement, render a
  form of links or submit buttons instead of this helper, and let
  the server set the cookie.
- The zero-flicker recipes below are about the *first paint*, not
  about no-JS operation. They make the page look right before
  hydration; they do not make the button work before hydration.

## Why this matters

If `<html>` arrives with no `data-theme` and the theme CSS
references `:root[data-theme="dark"] { … }`, the first paint shows
the default browser styles, then on hydration the client.js sets
`data-theme="dark"` and the page repaints. That's the flash of
unstyled theme (FOUT).

Fix: resolve the theme on the server and inline both
`<html data-theme="…">` and a `<link rel="stylesheet">` for the
chosen theme so CSS is in place before any pixel is painted.

## Eleventy recipe (build time)

End-to-end code lives in
[`../examples/eleventy-cookie/`](../examples/eleventy-cookie/) and
[`../examples/04-persistence.njk`](../examples/04-persistence.njk).
The build-time pattern:

1. List the available themes in `_data/themes.js`.
2. Set a default in `_data/site.js` (e.g. `defaultTheme: "light"`).
3. Render the macro with `opts.value = defaultTheme` in the layout.
4. Set `data-theme="{{ defaultTheme }}"` on `<html>` in the same
   layout so the first paint matches.
5. Load the client.js once per page. On every navigation, the
   `localStorage` value (if any) takes precedence over the cookie /
   default.

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
            import { autoInit } from "/lily-design-system-nunjucks-theme-chooser/theme-chooser.client.js";
            autoInit();
        </script>
    </body>
</html>
```

## Eleventy edge function recipe (per-request)

For per-request theme resolution (so a returning user's choice
survives reload without `localStorage` flicker), pair Eleventy
with Cloudflare Pages Functions or Netlify Edge Functions:

```js
// functions/_middleware.js (Cloudflare Pages)
export async function onRequest(context) {
    const cookie = context.request.headers.get("cookie") ?? "";
    const theme = /(?:^|; )theme=([^;]+)/.exec(cookie)?.[1] ?? "light";
    const response = await context.next();
    const html = await response.text();
    // Substitute the placeholder in the layout:
    return new Response(html.replace("__THEME__", theme), response);
}
```

This is one of several approaches; pick the one that matches your
hosting. See the catalog-wide
[`../../AGENTS/ssr.md`](../../AGENTS/ssr.md) for more.

## Express + nunjucks recipe

```js
import express from "express";
import nunjucks from "nunjucks";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
nunjucks.configure("views", { express: app, autoescape: true });

app.get("/", (req, res) => {
    const theme = req.cookies.theme ?? "light";
    res.render("index.njk", { theme });
});

app.post("/api/theme", express.json(), (req, res) => {
    const theme = String(req.body?.theme ?? "");
    if (!["light", "dark", "abyss"].includes(theme)) return res.status(400).end();
    res.cookie("theme", theme, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365 * 1000,
    });
    res.status(204).end();
});
```

The template passes `theme` into the macro as `opts.value`:

```njk
{{ themeChooser({
    label: "Theme",
    themesUrl: "/assets/themes/",
    themes: ["light", "dark", "abyss"],
    value: theme,
    storageKey: "lily-theme"
}) }}
```

On every theme change in the browser, the client.js calls
`onChange`, which `fetch("/api/theme", { method: "POST", body: …
})`s so the next request gets the new cookie.

## Cloudflare Workers recipe

The Workers runtime is V8 with no Node API. Nunjucks works in
Workers via a precompiled-loader setup:

```js
import nunjucks from "nunjucks";
import templates from "./templates.json"; // pre-bundled at build time

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

The helpers don't ship a precompiled loader; build your own with
`nunjucks-precompile`.

## Plain `nunjucks.render`

For a script that produces a static HTML file:

```js
import nunjucks from "nunjucks";

nunjucks.configure("templates", { autoescape: true });
const html = nunjucks.render("page.njk", {
    theme: "dark",
});
require("node:fs").writeFileSync("dist/index.html", html);
```

The macro outputs the complete root `<div>` — hidden input, button,
listbox — carrying `data-lily-theme-chooser-value="dark"`; no DOM
touched, no errors thrown. The written file needs the client.js
loaded alongside it to be interactive.

## Why the macro doesn't auto-resolve cookies

The macro has no opinion about transport (cookie? header? URL
parameter? session store?). Cookies are the right answer for some
hosts, headers for others, query strings for embeds. The macro
stays transport-agnostic and lets the consumer wire the
integration via `opts.value`.

## Loading the client.js once per page

Put a single `<script type="module">` near the bottom of `<body>`:

```html
<script type="module">
    import { autoInit } from "/lily-design-system-nunjucks-theme-chooser/theme-chooser.client.js";
    autoInit();
</script>
```

The browser deduplicates module imports, so multiple select
instances on the same page only fetch the script once.

To run a custom `onChange` callback across all selects:

```html
<script type="module">
    import { autoInit } from "/lily-design-system-nunjucks-theme-chooser/theme-chooser.client.js";
    autoInit({
        onChange(slug) {
            // analytics, server sync, etc.
            navigator.sendBeacon?.("/api/theme", new Blob([JSON.stringify({ theme: slug })]));
        },
    });
</script>
```
