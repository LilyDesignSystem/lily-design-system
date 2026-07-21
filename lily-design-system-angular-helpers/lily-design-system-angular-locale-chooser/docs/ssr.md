# SSR — Server-side rendering, cookies, and Accept-Language

The select compiles cleanly under Angular SSR (Analog v1 + Nitro,
`@angular/ssr` for Angular CLI, Astro Angular islands) but renders
nothing locale-specific on the server unless the consumer
pre-resolves the locale. This page covers the four resolution
strategies, ordered by quality.

## TL;DR

| Strategy                | Flash of default locale?  | Survives reload?      | SEO-friendly? |
| ----------------------- | ------------------------- | --------------------- | ------------- |
| `detectFromNavigator`   | yes (until client mounts) | only if `storageKey`  | no            |
| `localStorage`          | yes (until client mounts) | yes                   | no            |
| Cookie (Analog)         | **no**                    | yes                   | no            |
| URL prefix (`/fr/about`)| **no**                    | yes                   | **yes**       |

Use the **cookie** strategy unless you need SEO-distinct pages
per locale; then use **URL prefix**.

---

## Why SSR matters here

Analog (and Angular CLI with `@angular/ssr`, Astro Angular
islands) render the HTML on the server before the JS bundle
hydrates. If your `<html>` arrives with `lang="en"` and the
client picks `ar`, the page jumps:

1. Browser parses `<html lang="en">` → default LTR layout.
2. Browser fetches CSS, paints English page (FOUC-style flash).
3. JS hydrates, `LocaleChooser` runs its `effect()`, reads
   `localStorage["app-locale"] === "ar"`, writes
   `<html lang="ar" dir="rtl">`.
4. Browser repaints in RTL → layout shift.

Steps 2–4 cause a visible flash. The select can't avoid it on its
own because `localStorage` and `navigator.languages` aren't
accessible server-side. The consumer fixes it by pre-resolving
the locale on the server and seeding `value`.

---

## Strategy 1: Analog v1 cookie (recommended)

Analog's middleware + `REQUEST` injection token gives the cleanest
server→client bridge.

### Server middleware

```ts
// src/server/middleware/locale.ts
import { defineEventHandler, getCookie } from "h3";

export default defineEventHandler((event) => {
    const cookie = getCookie(event, "locale") ?? "en";
    event.context.locale = cookie;
});
```

### Injection token

```ts
// src/app/tokens/initial-locale.ts
import { InjectionToken, inject } from "@angular/core";
import { REQUEST } from "@analogjs/router/tokens";

export const INITIAL_LOCALE = new InjectionToken<string>("INITIAL_LOCALE", {
    providedIn: "root",
    factory: () => {
        const req = inject(REQUEST, { optional: true });
        if (!req) {
            if (typeof document === "undefined") return "en";
            const match = document.cookie.match(/(?:^|; )locale=([^;]*)/);
            return match ? decodeURIComponent(match[1]) : "en";
        }
        const ctx = (req as { context?: { locale?: string } }).context;
        return ctx?.locale ?? "en";
    },
});
```

### Server-only environment initializer

```ts
// src/app/app.config.server.ts
import {
    ApplicationConfig,
    inject,
    mergeApplicationConfig,
    provideEnvironmentInitializer,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { appConfig } from "./app.config";
import { INITIAL_LOCALE } from "./tokens/initial-locale";
import { bcp47LocaleTag, isRtlLocale } from "../locale-chooser.component";

export const config = mergeApplicationConfig(appConfig, {
    providers: [
        provideEnvironmentInitializer(() => {
            const doc = inject(DOCUMENT);
            const code = inject(INITIAL_LOCALE);
            doc.documentElement.setAttribute("lang", bcp47LocaleTag(code));
            doc.documentElement.setAttribute(
                "dir",
                isRtlLocale(code) ? "rtl" : "ltr",
            );
        }),
    ],
});
```

### Root component

```ts
import { Component, inject, signal } from "@angular/core";
import { LocaleChooser } from "../locale-chooser.component";
import { INITIAL_LOCALE } from "./tokens/initial-locale";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [LocaleChooser],
    template: `
        <lily-locale-chooser
            label="Language"
            [locales]="['en', 'fr', 'ar']"
            [(value)]="locale"
            (localeChange)="persistLocaleCookie($event)"
        />
        <router-outlet />
    `,
})
export class App {
    locale = signal(inject(INITIAL_LOCALE));

    async persistLocaleCookie(code: string): Promise<void> {
        if (typeof fetch === "undefined") return;
        await fetch("/api/locale", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ locale: code }),
        });
    }
}
```

### POST endpoint

```ts
// src/server/routes/api/locale.post.ts
import { defineEventHandler, readBody, setCookie } from "h3";

const SUPPORTED = new Set(["en", "fr", "ar"]);

export default defineEventHandler(async (event) => {
    const body = (await readBody<{ locale?: string }>(event)) ?? {};
    const code = String(body.locale ?? "");
    if (!SUPPORTED.has(code)) {
        event.node.res.statusCode = 400;
        return { error: "Unknown locale" };
    }
    setCookie(event, "locale", code, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
    });
    event.node.res.statusCode = 204;
    return null;
});
```

Result:

- First paint: `<html lang="fr" dir="ltr">` arrives in the HTML
  response. No flash, no layout shift.
- Select mounts as a closed icon button (it always does); the
  active locale is `locale()`, hydrated from `INITIAL_LOCALE`, and
  marked `aria-selected="true"` on its option in the hidden list.
- User picks `ar`. The fetch writes the cookie and the select's
  `effect()` writes `<html lang="ar" dir="rtl">`. Next request
  re-paints the page in Arabic from the very first byte.

---

## Strategy 2: `@angular/ssr` (Angular CLI)

The same pattern applies — replace `@analogjs/router/tokens`'s
`REQUEST` with `@angular/ssr`'s `REQUEST` import path. The cookie
parsing and DOM attribute writes are identical.

---

## Strategy 3: URL prefix (SEO-friendly)

URLs like `/en/about` and `/fr/about` are crawlable by search
engines and shareable as locale-specific links. Define `[locale]/*`
route segments:

```
src/app/pages/
├── [locale]/
│   ├── index.page.ts
│   └── about.page.ts
```

Set `<html lang dir>` from the route param via a server-side
middleware that inspects the URL, and drive the select from
`useRoute().params.locale` (Analog) or `ActivatedRoute.params`
(Angular CLI):

```ts
@Component({
    standalone: true,
    imports: [LocaleChooser],
    template: `
        <lily-locale-chooser
            label="Language"
            [locales]="['en', 'fr', 'ar']"
            [value]="current()"
            (localeChange)="navigate($event)"
        />
        <router-outlet />
    `,
})
export class Layout {
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    current = signal<string>(
        this.route.snapshot.paramMap.get("locale") ?? "en",
    );

    navigate(next: string): void {
        const path = this.router.url.replace(/^\/(en|fr|ar)/, `/${next}`);
        this.router.navigateByUrl(path);
    }
}
```

---

## Strategy 4: client-only (`localStorage` / navigator)

The fallback when there is no server. The select flickers
(default paints first, then the resolved locale takes over) but
everything else works.

```html
<lily-locale-chooser
    label="Language"
    [locales]="['en', 'fr', 'ar']"
    [(value)]="locale"
    storageKey="app-locale"
    [detectFromNavigator]="true"
/>
```

Acceptable for:

- Angular CLI SPAs with no SSR.
- Storybook / docs sites where the flash is invisible.
- Embedded widgets inside another app where the host owns `<html>`.

---

## Hydration considerations

Angular's hydration matcher compares the SSR DOM to the client
virtual DOM and warns on any mismatch. The select is safe by
default because:

- `effect()` callbacks honour the `typeof document` guard, so no
  DOM writes happen server-side.
- `aria-selected` and the hidden input's `value` are rendered from
  `value`, which the consumer controls and which is identical on both
  sides as long as it's seeded from the same source (cookie / route
  param / server-resolved state).
- The list renders closed (`hidden`, `aria-expanded="false"`) on both
  sides, so the open/close state cannot mismatch.
- Element ids come from the `nextLocaleChooserId()` module counter, not
  `Math.random()` or `Date.now()`, so `aria-controls`, the list `id`,
  and every option `id` match byte-for-byte across the boundary.

The two cases that produce hydration warnings:

1. Something in the consumer's template keys off the resolved
   locale — a visible "active locale" label, say. The server
   rendered it from `value=""` but the client `effect()` resolved
   `value="fr"` from `localStorage`. Fix by pre-seeding `value` on
   the server. The same divergence also flips `aria-selected` and the
   hidden input's `value` inside the control itself.
2. The consumer uses `[value]="someServerOnlyComputed"` whose
   result differs between SSR and client. Fix by ensuring the
   source is serialisable across the boundary (cookie, route
   param, transfer state).

---

## Astro Angular islands

```astro
---
const locale = Astro.cookies.get("locale")?.value ?? "en";
const RTL = /^(ar|he|fa|ur|ps)/.test(locale);
---
<html lang={locale} dir={RTL ? "rtl" : "ltr"}>
    <body>
        <lily-locale-chooser
            client:load
            label="Language"
            [locales]={["en", "fr", "ar"]}
            value={locale}
        />
        <slot />
    </body>
</html>
```

`client:load` mounts the select on the client. Because the
surrounding `<html>` already has the right `lang`/`dir`, there's
no flash.

---

## Accept-Language fallback

If no cookie has been set yet, fall back to the request's
`Accept-Language` header:

```ts
// src/server/middleware/locale.ts
import { defineEventHandler, getCookie, getRequestHeader } from "h3";

const SUPPORTED = ["en", "fr", "ar"];

function pickFromAcceptLanguage(header: string | undefined): string {
    if (!header) return "en";
    for (const item of header.split(",")) {
        const tag = item.split(";")[0].trim().toLowerCase();
        if (SUPPORTED.includes(tag)) return tag;
        const base = tag.split("-")[0];
        if (SUPPORTED.includes(base)) return base;
    }
    return "en";
}

export default defineEventHandler((event) => {
    const cookie = getCookie(event, "locale");
    event.context.locale = cookie ?? pickFromAcceptLanguage(
        getRequestHeader(event, "accept-language"),
    );
});
```

The select stays unchanged.

---

## Tests for SSR

The select's vitest suite runs in jsdom (client-side). For full
SSR tests:

- **Compile check** — `tsc` will catch invalid SSR usage (e.g.
  touching `document` outside the `effect()` guard).
- **End-to-end** — Playwright with `page.goto(…)` and check the
  raw HTML response (`page.content()` before JS) contains
  `<html lang="fr" dir="ltr">`.
- **Snapshot** — render a sample tree via
  `renderApplication` from `@angular/platform-server` and
  snapshot the first 200 bytes of the output.

The select itself has no SSR-specific code path to test beyond
"the component compiles in SSR mode and applies the seeded `value`".
The reference test suite covers that under jsdom by asserting that
`value` drives the `lang` / `dir` writes on mount, and that the
resolved locale is the one option carrying `aria-selected="true"`.

---

## References

- Analog v1 — Server middleware:
  <https://analogjs.org/docs/features/server/api-routes>
- `@analogjs/router/tokens` `REQUEST`:
  <https://github.com/analogjs/analog/blob/main/packages/router/src/lib/tokens.ts>
- `@angular/ssr`:
  <https://angular.dev/guide/ssr>
- `DOCUMENT` injection token (Angular):
  <https://angular.dev/api/common/DOCUMENT>
- MDN — `Accept-Language` header:
  <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language>
- RFC 4647 — Matching of Language Tags:
  <https://www.rfc-editor.org/rfc/rfc4647>
- `@formatjs/intl-localematcher` — RFC 4647 best-fit matcher:
  <https://formatjs.github.io/docs/polyfills/intl-localematcher/>

---

Lily™ and Lily Design System™ are trademarks.
