# SSR — Server-side rendering and static-site generation

`<locale-chooser>` is a custom element. The class only runs in the
browser; there is no "select on the server". The static-site
generator (or server-rendered HTML pipeline) emits the literal
`<locale-chooser>` tag with attributes; the browser constructs the
element and runs `connectedCallback` after parsing the HTML.

That means the SSG / server is **always** the right place to
pre-resolve the locale and seed `<html lang>`, `<html dir>`, and
the select's `value` attribute. The client then upgrades into a
matching state without visual flicker.

## TL;DR

| Strategy                | Flash of default locale?  | Survives reload?      | SEO-friendly? |
| ----------------------- | ------------------------- | --------------------- | ------------- |
| `detect-from-navigator` | yes (until client mounts) | only if `storage-key` | no            |
| `localStorage`          | yes (until client mounts) | yes                   | no            |
| Cookie (Astro / Node)   | **no**                    | yes                   | no            |
| URL prefix (`/fr/about`)| **no**                    | yes                   | **yes**       |
| Build-time default (Hugo / Eleventy) | **no** (per build) | yes        | partial       |

Use a **cookie** if you have a request-time server. Use a
**URL prefix** if you need SEO-distinct pages per locale. Use a
**build-time default** for fully-static sites where every visitor
sees the same starting language.

---

## What the select emits before JS upgrade

The rendered HTML before JS upgrade is exactly what the consumer
wrote, plus any pre-resolved attributes:

```html
<locale-chooser
    label="Language"
    locales="en,fr,ar"
    value="fr"
></locale-chooser>
```

No button, no listbox, no `lang` / `dir` writes — those all appear on
hydration.

## What happens on hydration

On the client the element's `connectedCallback` runs once after the
HTML parser hits the closing tag:

1. Resolves the initial locale per
   [spec/index.md §5.2](../spec/index.md). The value attribute wins, then
   `localStorage[storageKey]`, then navigator detection, then
   `default-value`, then `"en"`, then `locales[0]`.
2. Renders the `<div>` root, the hidden `<input>`, the button, and
   the `<ul role="listbox">` children. Option ids come from a
   deterministic module counter, so they match between renders.
3. Writes `<html lang="{tag}" dir="{ltr|rtl}">`.
4. Dispatches `localechange`.

If the resolved value differs from the one the consumer pre-rendered
in `<html lang>`, the user sees one frame of the wrong language
before the lifecycle hook runs. This is the "flash of unstyled
locale".

## How to get a flicker-free first paint

Resolve the locale **on the server / at build time** and inline:

- `<html lang="{tag}" dir="{ltr|rtl}">` in the document shell, and
- `value="{code}"` on the `<locale-chooser>` host.

Pass the resolved value as the `value` attribute so the select
doesn't re-resolve from storage and clobber the inlined attribute.

---

## Eleventy recipe

Eleventy is build-time only; the resolved locale is the same for
every visitor on a given build, unless the consumer uses a service
worker or an inline script to swap per request.

### File layout

```
src/
├── _data/
│   └── site.js               ← default locale, supported list
├── _includes/
│   └── layout.njk            ← inlines <html lang> + select value
├── index.md                  ← per-page front matter
└── _config/
    └── locale-chooser.js      ← writes the helper to /dist/
```

### Front matter

A page can override the locale:

```yaml
---
layout: layout.njk
title: Bienvenue
locale: fr
---
```

### Build-time data

```js
// src/_data/site.js
export default {
    defaultLocale: process.env.LOCALE ?? "en",
    locales: ["en", "fr", "ar"],
};
```

### Layout

```njk
{# src/_includes/layout.njk #}
{% set locale = locale or site.defaultLocale %}
{% set tag = locale | replace("_", "-") %}
{% set dir = "rtl" if locale | regex_match("^(ar|he|fa|ur|ps)") else "ltr" %}
<!doctype html>
<html lang="{{ tag }}" dir="{{ dir }}">
    <head>
        <meta charset="utf-8">
        <title>{{ title }}</title>
        <script type="module" src="/dist/locale-chooser.js"></script>
    </head>
    <body>
        <locale-chooser
            label="Language"
            locales="{{ site.locales | join(',') }}"
            value="{{ locale }}"
            storage-key="locale"
        ></locale-chooser>

        {{ content | safe }}
    </body>
</html>
```

Result: the page arrives with `<html lang="fr" dir="ltr">` already
on the wire. The select mounts already showing the right option
selected, no layout shift.

For per-request locale (cookies) on Eleventy, use a small client-
side `<script>` early in `<head>` that reads `document.cookie` and
writes `<html lang>` before the select upgrades; or migrate to
Astro / Express, both of which see the cookie at request time.

---

## Astro recipe

Astro reads cookies per request. The locale flows through the
server-rendered layout into the select's `value` attribute:

```astro
---
// src/layouts/Base.astro
const cookieLocale = Astro.cookies.get("locale")?.value;
const acceptLang = Astro.request.headers.get("accept-language") ?? "";
const supported = ["en", "fr", "ar"];

function negotiate() {
    if (cookieLocale && supported.includes(cookieLocale)) return cookieLocale;
    for (const item of acceptLang.split(",")) {
        const tag = item.split(";")[0].trim().toLowerCase();
        if (supported.includes(tag)) return tag;
        const base = tag.split("-")[0];
        if (supported.includes(base)) return base;
    }
    return "en";
}

const locale = negotiate();
const dir = /^(ar|he|fa|ur|ps)/.test(locale) ? "rtl" : "ltr";
---
<!doctype html>
<html lang={locale} dir={dir}>
    <head>
        <meta charset="utf-8">
        <script type="module" src="/scripts/locale-chooser.js"></script>
    </head>
    <body>
        <locale-chooser
            label="Language"
            locales={supported.join(",")}
            value={locale}
            storage-key="locale"
        ></locale-chooser>

        <script>
            document
                .querySelector("locale-chooser")
                .addEventListener("localechange", (e) => {
                    document.cookie =
                        `locale=${e.detail.locale}; path=/; max-age=31536000; SameSite=Lax`;
                });
        </script>

        <slot />
    </body>
</html>
```

Subsequent requests find the cookie, render the matching locale,
and never flash.

For static Astro builds (`output: "static"`), cookies are unread —
fall back to the build-time default + client-side upgrade.

---

## Hugo recipe

Hugo is build-time only. The resolved locale is the same for every
visitor on a given build:

```html
{{/* layouts/_default/baseof.html */}}
{{ $locale := .Site.Params.defaultLocale | default "en" }}
{{ $tag := replace $locale "_" "-" }}
{{ $isRtl := in (slice "ar" "he" "fa" "ur" "ps") (index (split $locale "_") 0) }}
{{ $dir := cond $isRtl "rtl" "ltr" }}
<!doctype html>
<html lang="{{ $tag }}" dir="{{ $dir }}">
    <head>
        <meta charset="utf-8">
        <title>{{ .Title }}</title>
        <script type="module" src="/dist/locale-chooser.js"></script>
    </head>
    <body>
        <locale-chooser
            label="Language"
            locales="en,fr,ar"
            value="{{ $locale }}"
            storage-key="locale"
        ></locale-chooser>

        {{ block "main" . }}{{ end }}
    </body>
</html>
```

For user-specific locales on Hugo you need a service worker or
client-side script that reads the cookie before the select
upgrades.

---

## Plain HTML with `localStorage` upgrade

Without an SSG, the FOUL (flash of unstyled locale) window is
unavoidable unless you inline an early-running script that reads
storage and sets `<html lang>` before the select mounts:

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <script>
            // Runs before <body> paints; reads storage and presets <html>.
            try {
                const v = localStorage.getItem("locale");
                if (v) {
                    document.documentElement.lang = v.replace(/_/g, "-");
                    if (/^(ar|he|fa|ur|ps)/.test(v)) {
                        document.documentElement.dir = "rtl";
                    }
                }
            } catch { /* ignore */ }
        </script>
        <script type="module" src="/dist/locale-chooser.js"></script>
    </head>
    <body>
        <locale-chooser
            label="Language"
            locales="en,fr,ar"
            storage-key="locale"
        ></locale-chooser>
    </body>
</html>
```

The blocking inline script runs before the body parses, so the
first paint already has the right `lang` / `dir`. The select's own
write later in `connectedCallback` is idempotent — same value, no
mutation event observers fire.

---

## URL-prefix strategy

For SEO-distinct pages per locale (`/en/about`, `/fr/about`), the
server picks the locale from the URL and seeds `<html>` + `value`
the same way:

```js
// Express
app.use((req, res, next) => {
    const match = req.path.match(/^\/(en|fr|ar)(\/|$)/);
    res.locals.locale = match ? match[1] : "en";
    next();
});
```

The select's `localechange` handler then navigates to the new
prefix:

```html
<script type="module">
    await customElements.whenDefined("locale-chooser");
    document
        .querySelector("locale-chooser")
        .addEventListener("localechange", (e) => {
            const next = e.detail.locale;
            const newPath = location.pathname.replace(/^\/[a-z-]+/, `/${next}`);
            if (newPath !== location.pathname) {
                location.assign(newPath);
            }
        });
</script>
```

---

## Cookie-resolved attribute pattern

The "cookie-resolved attribute" is just the `value=` on the select
plus the matching `lang=` on `<html>`. The browser:

1. Receives `<html lang="fr" dir="ltr">` — first paint is correct.
2. Parses `<locale-chooser value="fr">` — the select constructor
   runs, sees the inlined `value`, skips storage / navigator.
3. Writes `lang="fr"` again (idempotent — same value).
4. Dispatches `localechange` with `{ locale: "fr" }`.

The "rest" of the page (your i18n library, your conditional
rendering) listens to the event and refreshes strings. No flash.

---

## Client upgrade timeline

| Time     | What's in the DOM                                          |
| -------- | ---------------------------------------------------------- |
| 0 ms     | HTML parse begins. `<html lang="fr">` already correct.     |
| ~20 ms   | First Contentful Paint. CSS applied with French typography. |
| ~50 ms   | `<locale-chooser>` tag parsed. Element is "stub" HTMLElement. |
| ~80 ms   | JS bundle finishes loading. `customElements.define` runs.   |
| ~80 ms   | `connectedCallback` runs. Children render. `lang` rewritten (idempotent). |
| ~85 ms   | `localechange` event dispatches. App listeners refresh i18n. |

The 0–80 ms window is when "flash of default locale" could happen.
Pre-seeding `value` and `<html lang>` collapses that window to
zero visible difference.

---

## Streaming SSR considerations

If your server streams the response, the `<html lang>` / `<body>`
preamble is the first chunk; once flushed, downstream chunks
inherit the direction the parser already saw. Use the same cookie
+ pre-seed pattern; streaming doesn't change the select's
behaviour.

If you stream individual components with their own bidi behaviour
(e.g. a chat panel), wrap each with explicit `lang` and `dir` so
the streamed fragment doesn't get the wrong inherited direction
during the race.

---

## Tests for SSR

The select's vitest suite runs in jsdom (client-side). For full
SSR tests:

- **Compile check** — TypeScript catches obvious server-only
  misuses; the implementation never touches `document` until
  `connectedCallback`.
- **End-to-end** — Playwright `page.goto(...)` and `page.content()`
  (which reads the raw HTML before JS hydrates) for snapshot
  assertions like `<html lang="fr" dir="ltr">`.
- **Snapshot** — capture the first 200 bytes of the rendered page
  for each locale.

The select itself has no SSR-specific code path to test beyond
"the constructor doesn't touch `document` or `localStorage`". The
reference test suite verifies the post-hydration DOM state.

---

## Why we don't auto-resolve from the cookie

The select has no opinion about transport (cookie? header?
IndexedDB? URL parameter?). Cookies are the right answer for
Astro / Express, but not for build-time SSG hosts (Hugo,
Eleventy), embedded contexts, or apps that already have a
server-side preference store. The select stays transport-agnostic
and lets the consumer wire the integration.

---

## References

- MDN — `Accept-Language` header:
  <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language>
- MDN — Document cookies:
  <https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies>
- RFC 4647 — Matching of Language Tags:
  <https://www.rfc-editor.org/rfc/rfc4647>
- `@formatjs/intl-localematcher` — RFC 4647 best-fit matcher:
  <https://formatjs.github.io/docs/polyfills/intl-localematcher/>
- Eleventy data cascade:
  <https://www.11ty.dev/docs/data-cascade/>
- Astro middleware and `Astro.cookies`:
  <https://docs.astro.build/en/guides/middleware/>
- Hugo `.Site.Params`:
  <https://gohugo.io/methods/site/params/>

---

Lily™ and Lily Design System™ are trademarks.
