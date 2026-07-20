# SSR and the first paint

Nunjucks **is** the server side. The macro produces a static HTML
string at render time; the browser parses and paints it; the
client.js then takes over for the runtime lifecycle. This file
explains how to wire the macro into different Nunjucks hosts for a
flicker-free first paint.

## Read this first: the control does not work without JavaScript

The server-rendered markup paints correctly, but it is **not
operable** until `theme-select.client.js` runs. Specifically:

- The button has no handler. Clicking it, or pressing `Enter` /
  `Space` / `ArrowDown` on it, does nothing.
- The listbox is rendered with the `hidden` attribute and nothing
  server-side removes it. The user cannot see the options at all.
- Therefore, with JavaScript disabled or broken, **there is no way to
  change the theme**.

This is a real regression. Until the icon-button release this helper
rendered a native `<select>`, which was fully operable with no
JavaScript whatsoever — the browser itself opened the list, moved
through it, and fired `change`. Moving to a custom listbox traded that
away for an icon-sized control and full styling control over the open
list. We are not going to pretend otherwise: if your users may run
without JavaScript, this helper does not serve them.

What still works with no JS:

- The correct theme paints, provided you resolve it server-side and
  write `<html data-theme>` plus the theme `<link>` into your shell
  (see below). The helper's own `<link>` swap is client-only, but your
  shell's stylesheet is not.
- The hidden `<input name="{name}">` is pre-filled server-side with the
  resolved slug, so a form containing the control still submits a
  theme. That is the only no-JS affordance the control itself offers,
  and it is a submit path, not a choice path — the user cannot change
  the value.

If no-JS operability is a hard requirement, use the headless catalog's
plain `theme-select` container
(`lily-design-system-nunjucks-headless/components/theme-select/`),
which is a native `<select>` with `<option>` children, and wire the
lifecycle yourself.

## What the macro does on the server

The macro is pure: same `opts` → same string. It does **not**
touch:

- `localStorage`
- `matchMedia` / `navigator`
- `document.head`
- the file system
- environment variables

If the consumer passes `opts.value="dark"`, the root `<div>` gets
`data-lily-theme-select-value="dark"` rendered server-side, the
matching `<li>` gets `aria-selected="true"`, and the hidden input is
pre-filled with `dark` — see the next section.

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

### The `opts.value` control flash — still fixed, by the same mechanism

**There is no pre-hydration flash when you pass `opts.value`.** The
`data-lily-theme-select-value` attribute introduced to fix that flash
is still exactly how `opts.value` reaches the client, and it is still
carrying its weight for the same reason: the macro communicates the
value out-of-band rather than baking it into control state the browser
would paint before the client could correct it.

```html
<div class="theme-select" … data-lily-theme-select-value="dark">
  <input type="hidden" name="theme" value="dark" data-lily-theme-select-input>
  <button type="button" class="theme-select-button" aria-label="Theme"
          aria-haspopup="listbox" aria-expanded="false"
          aria-controls="theme-select-theme-list">
    <span class="theme-select-icon" aria-hidden="true">&#9681;</span>
  </button>
  <ul class="theme-select-list" id="theme-select-theme-list" role="listbox"
      aria-label="Theme" tabindex="-1" hidden>
    <li class="theme-select-option" id="theme-select-theme-option-0"
        role="option" aria-selected="false" data-value="light">Light</li>
    <li class="theme-select-option" id="theme-select-theme-option-1"
        role="option" aria-selected="true" data-value="dark">Dark</li>
  </ul>
</div>
```

There is nothing left to flash. The closed control is a glyph, which
looks identical whatever the value is; the listbox is `hidden`, so its
`aria-selected` state is not painted at all. What the server markup
does guarantee is **consistency**: exactly one option carries
`aria-selected="true"`, and the hidden input agrees with it, so the
DOM is never internally contradictory even for the frames before
`initThemeSelect(root)` runs.

`initThemeSelect(root)` reads `data-lily-theme-select-value` during
initial-value resolution (step 2 of the order in §5.2) and applies the
theme — mutating `data-theme`, the managed `<link>`, the hidden input,
and the options' `aria-selected`.

The attribute is omitted entirely when `opts.value` is unset, so it
falls through to `defaultValue` / `"light"` / first-option exactly as
before. Pass `opts.value` freely: it costs nothing visually.

Note that the server's own resolution (`value or defaultValue or
"light" or themes[0]`) cannot see `localStorage` or `matchMedia`. When
those disagree, the client wins and silently re-derives
`aria-selected` — while the listbox is still closed, so no one sees the
correction.

**`opts.value` is not one of the things the client overrides.** It is
the first input in the runtime resolution order, ahead of storage and
system detection alike, so a theme you resolved server-side survives
hydration intact. This is a change: the helper previously resolved
storage first, which meant a stale local entry silently beat the value
you passed — the precise failure mode this whole section exists to
avoid. See the BREAKING entry in [../CHANGELOG.md](../CHANGELOG.md).

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

With no `opts.value` passed, the select still flips to the user's
`localStorage` value when the client.js runs, so returning users see a
one-frame flash unless you also store the choice in a cookie or use the
edge function pattern below. (Pass `opts.value` and storage no longer
enters into it — value wins.)

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
  `<link>` land. The control itself is unaffected — it shows the same
  glyph throughout, and its listbox is closed.
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

Static-site output works without any hosting glue. The user gets the
chosen theme on first paint. If the render passed the slug through as
`opts.value`, it stays applied; if it only baked the slug into the
document shell without passing `opts.value`, a stored choice takes over
when the client runs.

---

Lily™ and Lily Design System™ are trademarks.
