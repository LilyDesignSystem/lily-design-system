# SSR — LocaleChooser (Nunjucks)

Nunjucks is the server side: the macro **is** the SSR render.
This file lists the Nunjucks-host-specific recipes; the
catalog-wide rules live in
[`../../AGENTS/ssr.md`](../../AGENTS/ssr.md).

## What the macro does at render time

The macro is pure: same `opts` in, same HTML out. It does not
touch `localStorage`, `navigator`, `document.documentElement`,
or any DOM API. If the consumer passes `opts.value="fr"`, the root
`<div>` gets `data-lily-locale-chooser-value="fr"` rendered
server-side, the `<li lang="fr">` option is marked
`aria-selected="true"`, and the hidden input is pre-filled with
`fr`.

The macro resolves that server-side selection as
`value or defaultValue or ("en" if listed else locales[0])`. It is a
best effort: `localStorage` and `navigator.languages` are client-only
signals the macro cannot see, so the client re-resolves on init and
may correct both the `aria-selected` option and the hidden input.

The macro does **not** write `lang` / `dir` to `<html>`. That
happens in the client.js on hydration. To avoid a first-paint
flash, the layout should write those attributes itself,
substituting from a cookie / header / session value.

## The no-JS regression, stated plainly

The server-rendered markup is not a working control. The button
carries `aria-expanded="false"` and the listbox is `hidden`, and
nothing changes that until `locale-chooser.client.js` loads and runs:
open / close, focus movement, the keyboard contract, and typeahead
all live in the client module. The earlier native `<select>` worked
with script disabled; this one does not. Do not describe the output
as progressively enhanced.

The single no-JS affordance is the hidden input. It is pre-filled
server-side with the resolved locale, so a `<form>` submitted without
JS still carries a locale to the server. Consumers who must serve
script-off users should render a plain `<form>` of links or submit
buttons alongside this control.

## Why this matters

If `<html>` arrives with `lang="en"` and the client picks `ar`,
the page jumps:

1. Browser parses `<html lang="en">` → default LTR layout.
2. Browser fetches CSS, paints the page in English / LTR.
3. JS hydrates, select's client.js reads `localStorage["app-locale"]
   === "ar"`, writes `<html lang="ar" dir="rtl">`.
4. Browser repaints in RTL → layout shift.

Steps 2–4 cause a visible flash. Fix by pre-resolving the locale
server-side.

## Eleventy + cookie recipe (recommended)

End-to-end pattern:

```js
// .eleventy.js
import { readFileSync } from "node:fs";
import { join } from "node:path";

export default function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/lily/locale-chooser.client.js");
    eleventyConfig.addPassthroughCopy("src/lily/locale-chooser.njk");
    eleventyConfig.addGlobalData("supportedLocales", ["en", "fr", "ar"]);
}
```

```njk
{# _includes/base.njk #}
<!doctype html>
<html lang="__LANG__" dir="__DIR__">
    <head>
        <meta charset="utf-8">
        <title>{{ title }}</title>
    </head>
    <body>
        {% from "lily/locale-chooser.njk" import localeChooser %}
        {{ localeChooser({
            label: "Language",
            locales: supportedLocales,
            value: "__LANG__",
            storageKey: "lily-locale"
        }) }}

        {{ content | safe }}

        <script type="module">
            import { autoInit } from "/lily/locale-chooser.client.js";
            autoInit({
                onChange(code) {
                    fetch("/api/locale", {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({ locale: code }),
                    }).catch(() => {});
                },
            });
        </script>
    </body>
</html>
```

```js
// functions/_middleware.js (Cloudflare Pages)
const RTL = /^(ar|he|fa|ur|ps|yi|iw|ji|ckb|ku|dv|sd|ug|mzn|ks)/;

export async function onRequest(context) {
    const response = await context.next();
    if (!response.headers.get("content-type")?.startsWith("text/html")) {
        return response;
    }
    const cookie = context.request.headers.get("cookie") ?? "";
    const lang = /(?:^|; )locale=([^;]+)/.exec(cookie)?.[1] ?? "en";
    const dir = RTL.test(lang) ? "rtl" : "ltr";
    const html = await response.text();
    return new Response(
        html.replaceAll("__LANG__", lang).replaceAll("__DIR__", dir),
        response,
    );
}
```

```js
// functions/api/locale.js
const SUPPORTED = new Set(["en", "fr", "ar"]);

export async function onRequestPost({ request }) {
    const body = await request.json().catch(() => ({}));
    const code = String(body?.locale ?? "");
    if (!SUPPORTED.has(code)) return new Response("Bad code", { status: 400 });
    return new Response(null, {
        status: 204,
        headers: {
            "set-cookie": `locale=${code}; Path=/; Max-Age=31536000; SameSite=Lax`,
        },
    });
}
```

Result: first paint arrives with the right `lang` and `dir`. The
select hydrates without writing anything visible.

## Express + cookie-parser recipe

```js
import express from "express";
import nunjucks from "nunjucks";
import cookieParser from "cookie-parser";
import {
    bcp47LocaleTag,
    isRtlLocale,
} from "./locale-chooser.client.js";

const app = express();
app.use(cookieParser());
nunjucks.configure("views", { express: app, autoescape: true });

const SUPPORTED = new Set(["en", "fr", "ar"]);

app.get("/", (req, res) => {
    const cookie = req.cookies.locale;
    const locale = cookie && SUPPORTED.has(cookie) ? cookie : "en";
    res.render("index.njk", {
        locale,
        lang: bcp47LocaleTag(locale),
        dir: isRtlLocale(locale) ? "rtl" : "ltr",
    });
});

app.post("/api/locale", express.json(), (req, res) => {
    const code = String(req.body?.locale ?? "");
    if (!SUPPORTED.has(code)) return res.status(400).end();
    res.cookie("locale", code, {
        path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 * 1000,
    });
    res.status(204).end();
});
```

```njk
<html lang="{{ lang }}" dir="{{ dir }}">
    <body>
        {{ localeChooser({
            label: "Language",
            locales: ["en", "fr", "ar"],
            value: locale,
            storageKey: "lily-locale"
        }) }}
        …
    </body>
</html>
```

## URL-prefix strategy (SEO-friendly)

```js
app.get("/:lang/*", (req, res) => {
    const lang = req.params.lang;
    if (!SUPPORTED.has(lang)) return res.status(404).end();
    res.render(req.params[0] || "index.njk", {
        locale: lang,
        lang: bcp47LocaleTag(lang),
        dir: isRtlLocale(lang) ? "rtl" : "ltr",
    });
});
```

The select's `onChange` handler navigates:

```html
<script type="module">
    import { autoInit } from "/lily/locale-chooser.client.js";
    autoInit({
        onChange(code) {
            const path = location.pathname.replace(/^\/[^/]+/, `/${code}`);
            location.assign(path);
        },
    });
</script>
```

## `Accept-Language` server-side parsing

When no cookie is set, fall back to the request's
`Accept-Language` header:

```js
function pickFromAcceptLanguage(header, supported) {
    if (!header) return supported[0];
    for (const item of header.split(",")) {
        const tag = item.split(";")[0].trim().toLowerCase();
        if (supported.includes(tag)) return tag;
        const base = tag.split("-")[0];
        if (supported.includes(base)) return base;
    }
    return supported[0];
}

app.get("/", (req, res) => {
    const cookie = req.cookies.locale;
    const accept = req.headers["accept-language"];
    const locale = cookie || pickFromAcceptLanguage(accept, ["en", "fr", "ar"]);
    res.render("index.njk", { locale });
});
```

## Cloudflare Workers

```js
import nunjucks from "nunjucks";
import templates from "./templates.json";

const env = new nunjucks.Environment(new nunjucks.PrecompiledLoader(templates));

export default {
    async fetch(request) {
        const cookie = request.headers.get("cookie") ?? "";
        const locale = /(?:^|; )locale=([^;]+)/.exec(cookie)?.[1] ?? "en";
        const html = env.render("index.njk", { locale });
        return new Response(html, {
            headers: { "content-type": "text/html; charset=utf-8" },
        });
    },
};
```

## Plain `nunjucks.render`

```js
import nunjucks from "nunjucks";
nunjucks.configure("templates", { autoescape: true });
const html = nunjucks.render("page.njk", { locale: "fr" });
```

The macro outputs a complete button + listbox carrying
`data-lily-locale-chooser-value="fr"`; no DOM touched, no errors
thrown.

## Why the macro doesn't auto-resolve cookies

The macro has no opinion about transport (cookie? header? URL
parameter? session store?). Cookies are right for Express,
headers for some Workers setups, URL prefixes for SEO. The
macro stays transport-agnostic and lets the consumer wire the
integration via `opts.value`.

## Hydration consistency

There is no virtual-DOM hydration mismatch in this catalog
because the macro is one-shot HTML, not a diff. The only
cross-render gotcha is:

- The server renders no `data-lily-locale-chooser-value` (because
  `opts.value=""`), but the client picks a non-empty value from
  `localStorage`. The page paints with the layout's `lang` / `dir` for
  one frame before the client rewrites them.
- **Fix.** Resolve the locale server-side and pass it as
  `opts.value`.

One more render-time gotcha: option and listbox ids are derived from
`opts.id`, which defaults to `"locale-chooser-{name}"`. A layout that
renders the control twice (say, in the header and the footer) with
the same `name` emits duplicate ids and a broken `aria-controls` /
`aria-activedescendant` pair. Pass an explicit `id` to at least one
instance. Nunjucks macros cannot hold a module-level counter, so
there is no automatic uniqueness to fall back on.
