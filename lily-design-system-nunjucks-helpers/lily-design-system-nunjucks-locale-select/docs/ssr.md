# SSR — Server-side rendering with Nunjucks

Nunjucks **is** the server side. The macro runs during template
render, before the browser receives a single byte. This is a major
ergonomic win over framework-specific SSR (SvelteKit, Next.js,
Nuxt): there's no "hydration mismatch" risk, because there is no
virtual-DOM diff — only string templating.

This page lists the recipes a Nunjucks-hosting consumer typically
reaches for. The catalog-level [`AGENTS/ssr.md`](../AGENTS/ssr.md)
covers the spec-level rules.

## TL;DR

| Strategy                       | Flash of default locale?    | Survives reload?     | SEO-friendly? |
| ------------------------------ | --------------------------- | -------------------- | ------------- |
| client-only `localStorage`     | yes (until client mounts)   | only with storageKey | no            |
| `detectFromNavigator`          | yes (until client mounts)   | only with storageKey | no            |
| Cookie (Express / Eleventy)    | **no**                      | yes                  | no            |
| URL prefix (Eleventy i18n)     | **no**                      | yes                  | **yes**       |

Use the **cookie** strategy unless you need SEO-distinct pages per
locale; then use **URL prefix**.

## What the macro does at render time

The macro is pure:

```js
import nunjucks from "nunjucks";
const html = nunjucks.render("page.njk", {
    locale: "fr",
    supported: ["en", "fr", "ar"],
});
```

Same `opts` in, same HTML out. It does not touch `localStorage`,
`navigator`, `document.documentElement`, or any DOM API. If the
consumer passes `opts.value="fr"`, the `<select>` root gets
`data-lily-locale-select-value="fr"` rendered server-side; the
`<option lang="fr">` still carries its BCP 47 tag, but no `selected`
attribute — see the next section.

### The `opts.value` selected-option flash — fixed

**There is no longer a pre-hydration flash when you pass
`opts.value`.** Earlier versions communicated `opts.value` to the
client by rendering `selected` on the matching `<option>`. Because the
placeholder option is *also* rendered `selected`, and a browser
resolves two selected options in favour of the **last** one, the closed
control briefly showed the locale name between first paint and
`initLocaleSelect(root)`, then snapped back to the placeholder word.

The macro now passes the value out-of-band instead:

```html
<select class="locale-select" … data-lily-locale-select-value="fr">
  <option class="locale-select-option locale-select-placeholder" value="" selected>Locale</option>
  <option class="locale-select-option" value="en" lang="en">English</option>
  <option class="locale-select-option" value="fr" lang="fr">Français</option>
</select>
```

The placeholder is the only `selected` option in the server HTML no
matter what `opts.value` is, so the closed control reads the
placeholder word from byte zero. `initLocaleSelect(root)` reads
`data-lily-locale-select-value` during initial-value resolution (step 1
of the order in §5.2) and applies the locale — mutating `lang` / `dir`,
never the rendered options.

The attribute is omitted entirely when `opts.value` is unset, so it
falls through to storage / navigator / `defaultValue` exactly as
before. Pass `opts.value` freely: it costs nothing visually.

The macro does **not** write `lang` / `dir` to `<html>`. That
happens in the client.js on hydration. To avoid a first-paint
flash, the layout should write those attributes itself,
substituting from a cookie / header / session value.

## Cookie-resolved value before render

The reference pattern: the Nunjucks layout receives `lang` and
`dir` in the template context, written into `<html>` directly, and
passes the same `lang` as `opts.value` into the macro so the client
resolves the same locale without a round-trip.

### Express + cookie-parser

```js
import express from "express";
import nunjucks from "nunjucks";
import cookieParser from "cookie-parser";
import {
    bcp47LocaleTag,
    isRtlLocale,
} from "./locale-select.client.js";

const app = express();
app.use(cookieParser());
nunjucks.configure("views", { express: app, autoescape: true });

const SUPPORTED = ["en", "fr", "ar"];

app.get("/", (req, res) => {
    const cookie = req.cookies.locale;
    const locale = cookie && SUPPORTED.includes(cookie) ? cookie : "en";
    res.render("index.njk", {
        locale,
        supported: SUPPORTED,
        lang: bcp47LocaleTag(locale),
        dir: isRtlLocale(locale) ? "rtl" : "ltr",
    });
});

app.post("/api/locale", express.json(), (req, res) => {
    const code = String(req.body?.locale ?? "");
    if (!SUPPORTED.includes(code)) return res.status(400).end();
    res.cookie("locale", code, {
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365 * 1000,
    });
    res.status(204).end();
});
```

```njk
{# views/index.njk #}
{% from "lily/locale-select.njk" import localeSelect %}
<!doctype html>
<html lang="{{ lang }}" dir="{{ dir }}">
    <body>
        {{ localeSelect({
            label: "Language",
            locales: supported,
            value: locale,
            storageKey: "lily-locale"
        }) }}

        <script type="module">
            import { autoInit } from "/lily/locale-select.client.js";
            autoInit({
                onChange(code) {
                    fetch("/api/locale", {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({ locale: code }),
                    }).then(() => location.reload());
                },
            });
        </script>
    </body>
</html>
```

Result:

- First paint: `<html lang="fr" dir="ltr">` arrives in the HTML
  response. No flash, no layout shift.
- Select mounts showing the placeholder word (by design), with the
  active locale already applied to `<html lang dir>`.
- User picks `ar`. Select writes `<html lang="ar" dir="rtl">`,
  callback writes the cookie, page reloads. Next request re-paints
  the page in Arabic from the very first byte.

### Eleventy + edge function (Cloudflare Pages)

Eleventy is static at build time, so the cookie has to be applied
post-build via an edge function. See
[`AGENTS/ssr.md`](../AGENTS/ssr.md) for the full recipe.

The short version: build with placeholder strings
(`__LANG__`, `__DIR__`) in your layout, then run an edge
middleware that reads the cookie and substitutes them per request.
The macro is included in the static HTML; only `<html lang dir>`
needs the per-request swap.

## Client.js is progressive enhancement

The select renders without the client.js loading: a `<select>`
is a fully functional `<form>` control. Submit it
inside a `<form method="POST" action="/locale">` and the server
sees `locale=fr` in the body. The client.js layers in
`localStorage`, `navigator.languages`, dynamic `<html lang>`
updates, and the `onChange` callback — it never breaks the
no-JavaScript path.

This is the **single biggest ergonomic difference** vs
SvelteKit / Next: the select is a real HTML form control first,
and a JS-enhanced widget second. Search engines, screen readers
in JS-disabled mode, and curl users all see the `<select>`.

If you want a fully no-JS locale switch, render the select inside
a `<form>` and let the server own the cookie:

```njk
<form method="POST" action="/api/locale">
    {{ localeSelect({
        label: "Language",
        locales: supported,
        value: locale,
        name: "locale"
    }) }}
    <button type="submit">Apply</button>
</form>
```

The user picks an option, clicks Apply, the server sets the cookie
and redirects. Zero JS required.

## Why the macro doesn't auto-resolve cookies

The macro has no opinion about transport (cookie? header? URL
parameter? session store?). Cookies are right for Express,
headers for some Workers setups, URL prefixes for SEO. The macro
stays transport-agnostic and lets the consumer wire the
integration via `opts.value`.

## Hydration consistency

There is no virtual-DOM hydration mismatch in this catalog
because the macro is one-shot HTML, not a diff. The only
cross-render gotcha is:

- The server renders no `data-lily-locale-select-value` (because
  `opts.value=""`), but the client picks a non-empty value from
  `localStorage`. The page therefore paints with the layout's `lang` /
  `dir` for one frame before the client rewrites them. The `<select>`
  itself is unaffected — it reads the placeholder word throughout.
- **Fix.** Resolve the locale server-side (cookie / header / URL /
  session), write `<html lang dir>` in your layout, and pass the code
  as `opts.value`.

## Accept-Language fallback

If you don't have a cookie yet (first visit), use the request's
`Accept-Language` header to pick a default:

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
    const locale = (cookie && SUPPORTED.includes(cookie))
        ? cookie
        : pickFromAcceptLanguage(accept, SUPPORTED);
    res.render("index.njk", { locale, /* … */ });
});
```

The select is unchanged — same `opts.value` pattern.

If you need RFC 4647-quality negotiation, replace the loop with
the `negotiator` npm package or the standards-compliant
`@formatjs/intl-localematcher`.

## Streaming responses

Nunjucks doesn't stream by default; `nunjucks.render` returns the
full HTML string. If you wrap it in a streaming response (e.g.
Express with `res.write`), still flush `<html lang dir>` in the
first chunk so downstream styles cascade correctly.

If you stream individual components with their own bidi behaviour
(e.g. a chat panel), wrap each with explicit `lang` and `dir` so
the streamed fragment doesn't get the wrong inherited direction
during the race.

## See also

- [examples/06-with-eleventy-i18n.njk](../examples/06-with-eleventy-i18n.njk)
- [examples/08-ssr-cookie.njk](../examples/08-ssr-cookie.njk)
- [`AGENTS/ssr.md`](../AGENTS/ssr.md) — full SSR rules and
  Cloudflare Workers recipe.
- MDN — `Accept-Language` header:
  <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language>
- RFC 4647 — Matching of Language Tags:
  <https://www.rfc-editor.org/rfc/rfc4647>
- `@formatjs/intl-localematcher` — RFC 4647 best-fit matcher:
  <https://formatjs.github.io/docs/polyfills/intl-localematcher/>
- MDN — Cookies (`document.cookie`):
  <https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies>

---

Lily™ and Lily Design System™ are trademarks.
