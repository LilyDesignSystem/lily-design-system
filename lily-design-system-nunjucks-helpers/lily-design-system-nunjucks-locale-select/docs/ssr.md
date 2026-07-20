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

**Every strategy above still requires JavaScript for the user to
*change* the locale.** The strategies differ only in whether the
correct locale is painted on first byte. See
[Client.js is NOT progressive enhancement any more](#clientjs-is-not-progressive-enhancement-any-more).

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
consumer passes `opts.value="fr"`, the root `<div>` gets
`data-lily-locale-select-value="fr"` rendered server-side, the matching
`<li>` gets `aria-selected="true"`, and the hidden input is pre-filled
with `fr` — see the next section.

### The `opts.value` control flash — still fixed, by the same mechanism

**There is no pre-hydration flash when you pass `opts.value`.** The
`data-lily-locale-select-value` attribute introduced to fix that flash
is still exactly how `opts.value` reaches the client, and it is still
carrying its weight for the same reason: the macro communicates the
value out-of-band rather than baking it into control state the browser
would paint before the client could correct it.

```html
<div class="locale-select" … data-lily-locale-select-value="fr">
  <input type="hidden" name="locale" value="fr" data-lily-locale-select-input>
  <button type="button" class="locale-select-button" aria-label="Language"
          aria-haspopup="listbox" aria-expanded="false"
          aria-controls="locale-select-locale-list">
    <span class="locale-select-icon" aria-hidden="true">&#127760;&#65038;</span>
  </button>
  <ul class="locale-select-list" id="locale-select-locale-list" role="listbox"
      aria-label="Language" tabindex="-1" hidden>
    <li class="locale-select-option" id="locale-select-locale-option-0"
        role="option" aria-selected="false" data-value="en" lang="en">English</li>
    <li class="locale-select-option" id="locale-select-locale-option-1"
        role="option" aria-selected="true" data-value="fr" lang="fr">Français</li>
  </ul>
</div>
```

There is nothing left to flash. The closed control is a glyph, which
looks identical whatever the value is; the listbox is `hidden`, so its
`aria-selected` state is not painted at all. What the server markup
does guarantee is **consistency**: exactly one option carries
`aria-selected="true"`, and the hidden input agrees with it, so the DOM
is never internally contradictory even for the frames before
`initLocaleSelect(root)` runs.

`initLocaleSelect(root)` reads `data-lily-locale-select-value` during
initial-value resolution (step 1 of the order in §5.2) and applies the
locale — mutating `lang` / `dir`, the hidden input, and the options'
`aria-selected`.

The attribute is omitted entirely when `opts.value` is unset, so it
falls through to storage / navigator / `defaultValue` exactly as
before. Pass `opts.value` freely: it costs nothing visually.

Note that the server's own resolution (`value or defaultValue or "en"
or locales[0]`) cannot see `localStorage` or `navigator.languages`.
When those disagree, the client wins and silently re-derives
`aria-selected` — while the listbox is still closed, so no one sees
the correction.

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
- The control mounts showing its globe glyph, with the active locale
  already applied to `<html lang dir>` and marked `aria-selected` in
  the closed listbox.
- User picks `ar`. The control writes `<html lang="ar" dir="rtl">`,
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

## Client.js is NOT progressive enhancement any more

This section used to say the opposite, and it was true: the helper
rendered a native `<select>`, which was a fully functional form
control with or without JavaScript. **That is no longer the case.**

Since the icon-button release the control is a `<button>` plus a
`<ul role="listbox" hidden>`. With JavaScript disabled or broken:

- The button has no handler. Clicking it, or pressing `Enter` /
  `Space` / `ArrowDown` on it, does nothing.
- The listbox stays `hidden`. Nothing server-side removes that
  attribute, so the user cannot see the options at all.
- Therefore **there is no way to change the locale**.

This is a real regression, and it is the price of the icon-sized
control and the fully styleable open list. We are not going to pretend
otherwise: if your users may run without JavaScript, this helper does
not serve them.

What still works with no JS:

- **The correct locale renders**, provided you resolve it server-side
  and write `<html lang dir>` in your layout — see the cookie and URL
  recipes above. The helper's client module is not involved in that.
- **The hidden input submits.** The macro emits
  `<input type="hidden" name="{name}" value="{resolved}">`, pre-filled
  server-side, so a form containing the control still posts a locale.
  That is a submit path, not a choice path: the user cannot change the
  value, only send the one the server already picked.

If you need a genuinely no-JS locale switch, render your own
`<select>` inside a `<form>` and let the server own the cookie. The
client module's pure helpers still do the useful work:

```njk
<form method="POST" action="/api/locale">
    <label for="locale-field">Language</label>
    <select id="locale-field" name="locale">
        {% for code in supported %}
        <option value="{{ code }}" lang="{{ code | replace('_', '-') }}"
                {% if code == locale %}selected{% endif %}>
            {{ localeLabels[code] or code }}
        </option>
        {% endfor %}
    </select>
    <button type="submit">Apply</button>
</form>
```

```js
// Server side: reuse the helper's exported pure functions.
import { bcp47LocaleTag, isRtlLocale } from "./locale-select.client.js";

const lang = bcp47LocaleTag(code);
const dir = isRtlLocale(code) ? "rtl" : "ltr";
```

The user picks an option, clicks Apply, the server sets the cookie and
redirects. Zero JS required — but zero of this helper's markup, too.

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
  `dir` for one frame before the client rewrites them. The control
  itself is unaffected — it shows the same glyph throughout, and its
  listbox is closed.
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
