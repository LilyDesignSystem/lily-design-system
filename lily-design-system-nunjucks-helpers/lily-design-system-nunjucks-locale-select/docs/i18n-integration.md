# i18n integration

`LocaleSelect` is intentionally not an i18n library. It changes the
document language and tells you when the user changed it; the actual
string substitution is your i18n library's job.

This page shows how to wire the select to the four most common
Nunjucks-rendering i18n stacks: **eleventy-i18n** (the Eleventy
plugin), **native `Intl.*`**, **gettext via `i18next-server`**, and
generic **ICU MessageFormat APIs**.

The wiring pattern is always the same:

1. Render the select with `opts.value` set to the server-resolved
   locale (so the right `<option>` is `selected` on first paint).
2. In `initLocaleSelect(root, { onChange })`, push the chosen code
   into your i18n runtime (often via a cookie + reload, sometimes
   via an in-page state update).
3. Optionally also persist via `opts.storageKey` so client-only
   apps survive reloads.

---

## eleventy-i18n (Eleventy plugin)

[eleventy-i18n](https://www.11ty.dev/docs/plugins/i18n/) (the
`@11ty/eleventy-plugin-i18n` plugin) ships first-party support for
URL-prefixed locales: `/en/about/`, `/fr/about/`, `/ar/about/`.
Each page automatically exposes the current `lang` via Eleventy's
`page` data cascade.

```js
// .eleventy.js
import EleventyI18nPlugin from "@11ty/eleventy-plugin-i18n";

export default function (eleventyConfig) {
    eleventyConfig.addPlugin(EleventyI18nPlugin, {
        defaultLanguage: "en",
        errorMode: "allow-fallback",
    });
    eleventyConfig.addPassthroughCopy("src/lily");
}
```

The select drives URL navigation from the `onChange` handler:

```njk
{# _includes/base.njk #}
{% from "lily/locale-select.njk" import localeSelect %}

<!doctype html>
<html lang="{{ page.lang }}" dir="{{ page.lang | localeDir }}">
    <body>
        {{ localeSelect({
            label: "Language",
            locales: ["en", "fr", "ar"],
            value: page.lang
        }) }}

        {{ content | safe }}

        <script type="module">
            import { autoInit } from "/lily/locale-select.client.js";
            autoInit({
                onChange(code) {
                    // Eleventy renders each locale at /<lang>/<rest>/.
                    const next = location.pathname.replace(
                        /^\/[a-z-]+/, `/${code}`
                    );
                    location.assign(next);
                },
            });
        </script>
    </body>
</html>
```

Eleventy's `i18n` filter then resolves messages per locale:

```njk
<h1>{{ "home.heading" | i18n }}</h1>
<p>{{ "home.body" | i18n }}</p>
```

Define your own `localeDir` filter to derive `rtl` / `ltr` from a
language tag — or skip it and let the select write `dir` to
`<html>` on hydration via the client.js (accepting a one-frame
flash).

See [examples/06-with-eleventy-i18n.njk](../examples/06-with-eleventy-i18n.njk).

---

## Native `Intl.*` formatters

For apps with a handful of strings and no formal i18n library,
store the locale and pass it to `Intl` formatters directly. The
select still owns the `lang` / `dir` lifecycle:

```njk
{% from "lily/locale-select.njk" import localeSelect %}

{{ localeSelect({
    label: "Language",
    locales: ["en", "en-US", "en-GB", "fr", "fr-CA", "ar"],
    value: locale,
    storageKey: "app-locale"
}) }}

<p>Today: <span id="today"></span></p>
<p>Balance: <span id="balance"></span></p>
<p>Population: <span id="population"></span></p>

<script type="module">
    import { autoInit } from "/lily/locale-select.client.js";

    function format(code) {
        const dateFmt = new Intl.DateTimeFormat(
            code.replace(/_/g, "-"), { dateStyle: "long" },
        );
        const currencyFmt = new Intl.NumberFormat(
            code.replace(/_/g, "-"),
            { style: "currency", currency: "GBP" },
        );
        const numFmt = new Intl.NumberFormat(code.replace(/_/g, "-"));
        document.getElementById("today").textContent =
            dateFmt.format(new Date());
        document.getElementById("balance").textContent =
            currencyFmt.format(1234.56);
        document.getElementById("population").textContent =
            numFmt.format(67_330_000);
    }

    autoInit({ onChange: format });
</script>
```

`Intl.*` formatters accept both `en_US` and `en-US`; they normalise
internally. The select's `onChange` fires with the consumer-form
code, so call `.replace(/_/g, "-")` if you need the BCP 47 form.

See [examples/07-with-intl.njk](../examples/07-with-intl.njk).

---

## gettext via i18next-server (or similar)

[i18next](https://www.i18next.com/) is the most common Node
gettext/ICU bridge. Pair it with Express + Nunjucks for a classic
SSR stack:

```js
// server.js
import express from "express";
import nunjucks from "nunjucks";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import cookieParser from "cookie-parser";

await i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
        fallbackLng: "en",
        preload: ["en", "fr", "ar"],
        backend: { loadPath: "./locales/{{lng}}/{{ns}}.json" },
        detection: { order: ["cookie", "header"], lookupCookie: "locale" },
    });

const app = express();
app.use(cookieParser());
app.use(middleware.handle(i18next));
nunjucks.configure("views", { express: app, autoescape: true });

app.get("/", (req, res) => {
    res.render("index.njk", {
        locale: req.language,
        t: (key, params) => req.t(key, params),
    });
});

app.post("/api/locale", express.json(), (req, res) => {
    const code = String(req.body?.locale ?? "");
    if (!["en", "fr", "ar"].includes(code)) {
        return res.status(400).end();
    }
    res.cookie("locale", code, {
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365 * 1000,
    });
    res.status(204).end();
});
```

```njk
{# views/index.njk #}
{% from "lily/locale-select.njk" import localeSelect %}
<html lang="{{ locale }}">
    <body>
        {{ localeSelect({
            label: t("language.label"),
            locales: ["en", "fr", "ar"],
            value: locale,
            localeLabels: {
                en: t("language.en"),
                fr: t("language.fr"),
                ar: t("language.ar")
            }
        }) }}

        <h1>{{ t("home.heading") }}</h1>
        <p>{{ t("home.body") }}</p>

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

The `location.reload()` is intentional: i18next's middleware runs
on the next request and re-renders the page with the new
`req.language`. No client-side message bundles need to ship.

For sites that prefer to swap strings client-side without a
reload, use [`i18next` in the browser](https://www.i18next.com/overview/getting-started)
and call `i18next.changeLanguage(code)` from `onChange` instead.

---

## ICU MessageFormat APIs

Apps that need plurals, gender, and ordinal handling typically use
ICU MessageFormat (`messageformat`, `@formatjs/intl-messageformat`,
or `@messageformat/runtime`). The select is unchanged; you just
swap which message function you call:

```njk
{# Server-side: pre-resolve and embed the message bundle. #}
{% from "lily/locale-select.njk" import localeSelect %}

{{ localeSelect({
    label: "Language",
    locales: ["en", "fr", "ar"],
    value: locale,
    storageKey: "app-locale"
}) }}

<p id="cart-summary"></p>

<script type="module">
    import MessageFormat from "@messageformat/core";
    import { autoInit } from "/lily/locale-select.client.js";

    const messages = {
        en: "{count, plural, one {# item} other {# items}} in cart.",
        fr: "{count, plural, one {# article} other {# articles}} dans le panier.",
        ar: "{count, plural, one {# عنصر} other {# عناصر}} في السلة.",
    };

    function render(code) {
        const mf = new MessageFormat(code.replace(/_/g, "-"));
        const fn = mf.compile(messages[code] || messages.en);
        document.getElementById("cart-summary").textContent = fn({ count: 3 });
    }

    autoInit({ onChange: render });
</script>
```

The select fires `onChange` once on mount (with the resolved
initial locale) and again on every change. The pattern handles
both.

---

## Picking the right strategy

| Need                                       | Strategy                                |
| ------------------------------------------ | --------------------------------------- |
| Static site, English + French + Arabic     | Eleventy + eleventy-i18n + URL prefixes |
| One page with a few `Intl.*` formatters    | `onChange` + native `Intl.DateTimeFormat` |
| Existing JSON gettext bundles              | i18next + Express + cookie + reload     |
| Plurals, gender, ordinal                   | ICU MessageFormat + in-page swap        |
| Multi-tenant, locale per panel             | Multiple selects with `target` option   |
| SEO-friendly URLs per locale               | Eleventy URL prefix (above)             |
| No FOUC, cookie-backed, server-rendered    | Cookie + Express / Eleventy edge function (see [./ssr.md](./ssr.md)) |

The select is the same in every case. Only the `onChange` body and
the i18n runtime change.

## What if my i18n library writes `lang` itself?

Some libraries (notably `i18next-browser-languagedetector` with
`detection.caches: ["htmlTag"]`) write the `lang` attribute on
`<html>` themselves. Two paths:

1. **Let the select win.** Don't enable the htmlTag cache in the
   library; the select writes `lang` on every change.
2. **Let the library win.** Pass `applyDir: false` to suppress the
   select's `dir` write, and the library writes both. The select
   still fires `onChange` for any other side effects.

There is no race in practice — the select's `applyLocale` is
synchronous, and the consumer's `onChange` runs after, so whoever
runs last wins.
