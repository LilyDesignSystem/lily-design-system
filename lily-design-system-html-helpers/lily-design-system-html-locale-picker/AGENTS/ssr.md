# SSR — `<locale-picker>` (HTML helper)

The picker runs cleanly under any static-site generator (Eleventy,
Astro, Hugo, Jekyll) and under dynamic SSR (Node + Express,
Cloudflare Workers, any framework that emits plain HTML). This page
lists the recipes; the catalog-wide rules live in
[`../../AGENTS/ssr.md`](../../AGENTS/ssr.md).

## What the picker does on the server

There is no "picker on the server" — `customElements` only exists
in browsers. The SSG / server emits the literal `<locale-picker>`
tag with attributes; the browser constructs the element and runs
`connectedCallback` after parsing the HTML.

## Why this matters

If `<html>` arrives with `lang="en"` and the client picks `ar`, the
page jumps:

1. Browser parses `<html lang="en">` → default LTR layout.
2. Browser fetches CSS, paints English page.
3. JS hydrates, picker's `connectedCallback` runs, reads
   `localStorage["app-locale"] === "ar"`, writes
   `<html lang="ar" dir="rtl">`.
4. Browser repaints in RTL → layout shift.

Steps 2–4 cause a visible flash. Fix by pre-resolving the locale on
the server (or at build time) and inlining `<html lang dir>` to
match the picker's `value` attribute.

## Astro 3 cookie recipe (recommended)

End-to-end code lives in
[`../examples/08-ssr-cookie.html`](../examples/08-ssr-cookie.html)
as a sketch; for a full project use Astro's cookie API:

```astro
---
const locale = Astro.cookies.get("locale")?.value ?? "en";
const RTL = /^(ar|he|fa|ur|ps)/.test(locale);
---
<html lang={locale} dir={RTL ? "rtl" : "ltr"}>
    <head>
        <script type="module" src="/scripts/locale-picker.js"></script>
    </head>
    <body>
        <locale-picker
            label="Language"
            locales="en,fr,ar"
            value={locale}
            storage-key="lily-locale"
        ></locale-picker>
        <slot />
    </body>
</html>
```

The page arrives with the correct `lang` and `dir`. The picker
hydrates and `connectedCallback` sees the supplied `value`, so it
skips the storage/navigator fallbacks and applies the same locale
— no visible change.

When the user changes locales the picker's `localechange` event
posts to a small endpoint that writes the cookie:

```ts
document.querySelector("locale-picker")?.addEventListener("localechange", async (e) => {
    const { locale } = (e as CustomEvent<{ locale: string }>).detail;
    await fetch("/api/locale", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ locale }),
    });
});
```

Next request: the cookie returns the new locale; the loop is closed.

## Eleventy recipe (build-time only)

Eleventy is build-time only and has no request context. The
build-time default is what arrives in the first paint:

```njk
{# _data/locale.js exports { default: "en", available: ["en", "fr", "ar"] } #}
<!doctype html>
<html lang="{{ locale.default }}" dir="ltr">
    <head>
        <script type="module" src="/dist/locale-picker.js"></script>
    </head>
    <body>
        <locale-picker
            label="Language"
            locales="{{ locale.available | join(',') }}"
            value="{{ locale.default }}"
            storage-key="lily-locale"
        ></locale-picker>
    </body>
</html>
```

For user-specific locale on Eleventy you need either a service
worker (intercept the request and rewrite the response) or accept
the FOUT.

## Hugo recipe

Hugo is build-time only:

```html
<!doctype html>
<html lang="{{ .Site.Params.defaultLocale | default "en" }}" dir="ltr">
    <head>
        <script type="module" src="/dist/locale-picker.js"></script>
    </head>
    <body>
        <locale-picker
            label="Language"
            locales="en,fr,ar"
            value="{{ .Site.Params.defaultLocale | default "en" }}"
            storage-key="lily-locale"
        ></locale-picker>
    </body>
</html>
```

## Nunjucks + Eleventy locale recipe

```njk
<html lang="{{ locale.tag }}" dir="{{ locale.dir }}">
    <body>
        <locale-picker
            label="Language"
            locales="en,fr,ar"
            value="{{ locale.code }}"
            storage-key="lily-locale"
        ></locale-picker>
    </body>
</html>
```

Where `locale.tag`, `locale.dir`, and `locale.code` are computed in
`_data/locale.js`.

## URL-prefix strategy

For SEO-friendly URLs (`/en/about`, `/fr/about`), drive the picker
from the URL:

```html
<locale-picker
    label="Language"
    locales="en,fr,ar"
    value="{{ urlLocale }}"
></locale-picker>

<script type="module">
    await customElements.whenDefined("locale-picker");
    document.querySelector("locale-picker")?.addEventListener("localechange", (e) => {
        const { locale } = (e as CustomEvent<{ locale: string }>).detail;
        const newPath = location.pathname.replace(/^\/(en|fr|ar)/, `/${locale}`);
        window.location = newPath;
    });
</script>
```

## Accept-Language strategy

If the SSG / server has access to request headers, resolve from
`Accept-Language` when no cookie has been set:

```ts
const SUPPORTED = ["en", "fr", "ar"];
function pickFromAcceptLanguage(header) {
    if (!header) return "en";
    for (const item of header.split(",")) {
        const tag = item.split(";")[0].trim().toLowerCase();
        if (SUPPORTED.includes(tag)) return tag;
        const base = tag.split("-")[0];
        if (SUPPORTED.includes(base)) return base;
    }
    return "en";
}
```

The picker stays unchanged; only the value of the inlined
`<locale-picker value="…">` attribute differs per request.

## Why we don't auto-resolve from the request

The picker is transport-agnostic. Cookies are right for dynamic
SSR, URL prefixes are right for SEO, Accept-Language is right for
unauthenticated users; the right answer depends on the host. The
picker accepts the resolved value via the `value` attribute and
lets the consumer wire the integration.

## Hydration mismatch (not really)

Custom elements don't "hydrate" in the React / Vue sense. The
`<locale-picker>` host arrives as a plain tag; the browser invokes
its constructor and `connectedCallback` after parsing. There is no
virtual-DOM diff, no warning system, no mismatch concept.

The only "mismatch" possible is visual: the inlined `<html lang>`
differs from the user's stored choice. The picker handles this by
applying the stored choice in `connectedCallback`, replacing the
default. The user sees one frame of the default followed by the
stored choice. Fix by pre-resolving the same value the picker will
read (cookie + server-side resolution).
