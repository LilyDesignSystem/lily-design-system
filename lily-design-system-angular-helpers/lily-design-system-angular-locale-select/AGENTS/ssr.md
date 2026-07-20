# SSR — LocaleSelect (Angular)

The select runs cleanly under Angular SSR (Analog v1 + Nitro,
`@angular/ssr` for Angular CLI, Astro Angular islands). This page
lists the Angular-specific recipes; the canonical rules live in
[`../../AGENTS/ssr.md`](../../AGENTS/ssr.md).

## What the select does on the server

Under SSR, `effect()` callbacks may run but the `typeof document
!== "undefined"` guard prevents any DOM mutation. The select
renders:

```html
<select class="locale-select" aria-label="Language" name="locale">
    <option class="locale-select-option locale-select-placeholder" value="" selected>Language</option>
    <option class="locale-select-option" value="en" lang="en">English</option>
    …
</select>
```

The placeholder option is the selected one server-side and
client-side alike, whatever `value` is — the `<select>` is not bound
to `value`. So the control's own DOM never differs between server and
client render.

The `lang` and `dir` attributes on the document root are **not**
written on the server unless the consumer pre-sets them via a
server-only environment initializer.

## Why this matters

If `<html>` arrives with `lang="en"` and the client picks `ar`,
the page jumps:

1. Browser parses `<html lang="en">` → default LTR layout.
2. Browser fetches CSS, paints English page.
3. JS hydrates, select's `effect()` runs, reads
   `localStorage["app-locale"] === "ar"`, writes
   `<html lang="ar" dir="rtl">`.
4. Browser repaints in RTL → layout shift.

Steps 2–4 cause a visible flash. Fix by pre-resolving the locale
server-side.

## Analog v1 cookie recipe (recommended)

End-to-end code lives in
[`../examples/08-ssr-cookie.component.ts`](../examples/08-ssr-cookie.component.ts).
The shape:

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

### Root component

```ts
import { Component, inject, signal } from "@angular/core";
import { LocaleSelect } from "../locale-select.component";
import { INITIAL_LOCALE } from "./tokens/initial-locale";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [LocaleSelect],
    template: `
        <lily-locale-select
            label="Language"
            [locales]="['en', 'fr', 'ar']"
            [(value)]="locale"
            (localeChange)="persistLocaleCookie($event)"
        />
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

### Writing `<html lang>` / `<html dir>` server-side

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
import { bcp47LocaleTag, isRtlLocale } from "../locale-select.component";

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

Result: first paint arrives with the right `lang` and `dir`. The
select hydrates without writing anything visible.

## Analog URL-prefix strategy

For SEO-friendly URLs (`/en/about`, `/fr/about`), use Analog's
file-based dynamic routes. Define `[locale]/*` route segments,
validate in middleware, and drive the select from the route param:

```ts
import { Component, computed, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LocaleSelect } from "../locale-select.component";

@Component({
    standalone: true,
    imports: [LocaleSelect],
    template: `
        <lily-locale-select
            label="Language"
            [locales]="['en', 'fr', 'ar']"
            [value]="current()"
            (localeChange)="navigate($event)"
        />
    `,
})
export class Layout {
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    current = signal(this.route.snapshot.params["locale"] ?? "en");

    navigate(next: string): void {
        const path = this.router.url.replace(/^\/(en|fr|ar)/, `/${next}`);
        this.router.navigateByUrl(path);
    }
}
```

## Accept-Language strategy

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

## Astro Angular islands

```astro
---
const locale = Astro.cookies.get("locale")?.value ?? "en";
---
<html lang={locale} dir={/^(ar|he|fa|ur)/.test(locale) ? "rtl" : "ltr"}>
    <body>
        <lily-locale-select
            client:load
            label="Language"
            [locales]={["en", "fr", "ar"]}
            value={locale}
        />
        <slot />
    </body>
</html>
```

## Hydration mismatch warnings

If you see an Angular warning like "NG0500: Hydration: node
mismatch", the most common cause is:

- The server rendered no selected `<option>` (because `value`
  was empty), but the client picked a non-empty value from
  `localStorage`.
- **Fix.** Resolve the locale server-side and pass it as `value`.

## Plain Angular CLI (no SSR)

Without SSR there is no first-paint problem worth solving — the
select hydrates from `localStorage` (or detects from
`navigator.languages` if `detectFromNavigator=true`) and applies
`lang`/`dir` before content renders if you mount it at the top of
the layout.
