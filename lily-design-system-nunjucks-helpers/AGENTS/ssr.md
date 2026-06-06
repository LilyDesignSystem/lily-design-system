# SSR — Lily Nunjucks Helpers

Nunjucks **is** the server-side / build-time render. There is no
hydration warning to manage — the macro produces a static HTML
string that the browser parses normally. This page documents the
SSR-relevant rules every helper follows and the recipes for common
Nunjucks hosts.

## Rules every helper follows

1. **The macro is pure.** It reads only `opts` and emits text. No
   file system access, no environment lookups, no globals.
2. **The client.js is the only runtime.** It guards every DOM access
   behind `typeof document !== "undefined"` so it can be imported in
   a non-browser environment (e.g. a unit test running in plain
   Node) without side effects.
3. **`value` is the SSR bridge.** When you want a flicker-free first
   paint, resolve the value server-side (cookie, header, session
   store) and pass it as `opts.value`. The macro renders the
   matching radio as `checked`, the client.js notices that on init
   and applies without changing the DOM.
4. **The macro never emits `<script>`.** The consumer loads the
   client.js separately. This keeps the macro output usable even
   when JS is disabled — the user sees a static radio group with
   the right initial selection.

## Eleventy

[Eleventy](https://www.11ty.dev/) is the canonical SSG for Nunjucks
in 2026. The helpers ship as plain `.njk` files; drop them in your
`_includes` (or anywhere `eleventyConfig.addNunjucksFilter` /
`eleventyConfig.addPassthroughCopy` can reach them) and import the
macro from a template.

### Reading a cookie at request time

Eleventy is build-time by default, so "cookie" usually means
serverless edge (Cloudflare Pages Functions, Netlify Edge
Functions, Vercel Edge). The Lily Nunjucks helpers don't have a
dedicated cookie integration because the Nunjucks render itself
doesn't know about HTTP — your host does.

The pattern for edge-rendered Eleventy:

```js
// functions/[path].js (Cloudflare Pages Functions)
import { Eleventy } from "@11ty/eleventy";

export async function onRequest(context) {
    const cookie = context.request.headers.get("cookie") ?? "";
    const theme = /(?:^|; )theme=([^;]+)/.exec(cookie)?.[1] ?? "light";
    const html = await renderEleventyTemplate({ theme });
    return new Response(html, {
        headers: { "content-type": "text/html; charset=utf-8" },
    });
}
```

```njk
{# index.njk #}
{% from "./theme-picker.njk" import themePicker %}
{{ themePicker({
  label: "Theme",
  themesUrl: "/assets/themes/",
  themes: ["light", "dark", "abyss"],
  value: theme,
  storageKey: "lily-theme"
}) }}
```

The macro renders with the cookie's theme already `checked`. On
hydration, the client.js sees the checked radio, runs `applyTheme`,
and the user never sees a flash.

### Adding Eleventy data files

Eleventy makes it trivial to expose constants to templates. Put the
locale labels in `_data/`:

```js
// _data/localeLabels.js
import { defaultLocaleLabels } from "../../lily-design-system-nunjucks-locale-picker/locale-picker.client.js";
export default defaultLocaleLabels;
```

```njk
{{ localePicker({
  label: "Language",
  locales: ["en", "fr", "ar"],
  localeLabels: localeLabels
}) }}
```

### Loading the client.js once per page

Eleventy passthrough copies the client.js to the output:

```js
// .eleventy.js
eleventyConfig.addPassthroughCopy(
    "lily-design-system-nunjucks-theme-picker/theme-picker.client.js",
);
```

Then in your base layout:

```njk
<script type="module">
  import { autoInit } from "/lily-design-system-nunjucks-theme-picker/theme-picker.client.js";
  autoInit();
</script>
```

`autoInit()` wires every `[data-lily-theme-picker-root]` it finds on
the page.

## Express + nunjucks

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
```

In the template, pass `theme` to the macro as `value`. The cookie
write happens client-side (`document.cookie = …`) or via a
companion endpoint (`POST /api/theme`).

## Cloudflare Workers

The Workers runtime is V8 with no Node API. Nunjucks works in
Workers as long as you bundle a pre-loaded environment:

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

Outside any framework:

```js
import nunjucks from "nunjucks";

nunjucks.configure("templates", { autoescape: true });
const html = nunjucks.render("page.njk", { theme: "dark" });
console.log(html);
```

The macro outputs a complete fieldset; no DOM was touched, no
errors thrown.

## Hydration consistency

There is no "hydration mismatch" in this catalog because the macro
is one-shot HTML, not a virtual DOM diff. The only cross-render
gotcha is:

- The server renders `value=""` (no radio checked), but the client
  picks a non-empty value from `localStorage`. The user briefly
  sees an unchecked group, then the chosen radio fills in.
- **Fix.** Resolve the value server-side and pass it as
  `opts.value`.

## Server vs static-site rendering

| Host                          | Where the macro runs           | Recipe                                   |
| ----------------------------- | ------------------------------ | ---------------------------------------- |
| Eleventy (default)            | Build time                     | Pass `opts.value` from a data file or `storageKey`. |
| Eleventy + edge functions     | Per-request edge               | Read cookie/header, pass as `opts.value`. |
| Express + nunjucks            | Per-request server             | Read `req.cookies`, pass as `opts.value`. |
| Cloudflare Workers            | Per-request V8 isolate         | Same as Express, bundle templates.        |
| `nunjucks.render` in CLI tool | One-shot                       | Static config; no cookie story.           |

## Why we don't ship a cookie helper

The catalog has no per-helper cookie integration because every
Nunjucks host (Eleventy, Express, Workers, Vercel, Netlify) has its
own cookie API. The macro accepts a resolved string via
`opts.value`; the consumer's host code does the cookie read.

If you want a single line that "just works" in Eleventy with
Cloudflare Pages, copy the four-line cookie regex above into your
edge function and pass the result. The split is intentional —
helpers don't depend on a hosting platform.
