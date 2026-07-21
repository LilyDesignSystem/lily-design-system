# SSR — LocaleChooser (Angular)

The select runs cleanly under Angular SSR (Analog v1 + Nitro,
`@angular/ssr` for Angular CLI, Astro Angular islands). This page
lists the Angular-specific recipes; the canonical rules live in
[`../../AGENTS/ssr.md`](../../AGENTS/ssr.md).

## What the select does on the server

Under SSR, `effect()` callbacks may run but the `typeof document
!== "undefined"` guard prevents any DOM mutation. The select
renders:

```html
<div class="locale-chooser">
    <input type="hidden" name="locale" value="en" />
    <button type="button" class="locale-chooser-button" aria-label="Language"
            aria-haspopup="listbox" aria-expanded="false"
            aria-controls="locale-chooser-1-list">
        <span class="locale-chooser-icon" aria-hidden="true">&#127760;</span>
    </button>
    <ul class="locale-chooser-list" id="locale-chooser-1-list" role="listbox"
        aria-label="Language" tabindex="-1" hidden>
        <li class="locale-chooser-option" id="locale-chooser-1-option-0" role="option"
            aria-selected="true" lang="en">English</li>
        …
    </ul>
</div>
```

The list renders closed (`hidden`, `aria-expanded="false"`) on both
sides, so the open/close state can never mismatch.

Ids come from the `nextLocaleChooserId()` module counter, not
`Math.random()` or `Date.now()`, so `aria-controls`, the list `id`,
and every option `id` are identical server-side and client-side.
That is the whole reason the counter exists — swapping it for
randomness would reintroduce hydration mismatches on every mount.

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
[`../examples/analog-cookie.component.ts`](../examples/analog-cookie.component.ts).
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

Result: first paint arrives with the right `lang` and `dir`. The
select hydrates without writing anything visible.

## Analog URL-prefix strategy

For SEO-friendly URLs (`/en/about`, `/fr/about`), use Analog's
file-based dynamic routes. Define `[locale]/*` route segments,
validate in middleware, and drive the select from the route param:

```ts
import { Component, computed, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LocaleChooser } from "../locale-chooser.component";

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

## Hydration mismatch warnings

If you see an Angular warning like "NG0500: Hydration: node
mismatch", the most common cause is:

- The server resolved a different locale than the client did — e.g.
  the server had no cookie and fell back to `"en"`, while the client
  read `"ar"` from `localStorage`. The `aria-selected`, `data-active`,
  and hidden-input `value` attributes then differ.
- **Fix.** Resolve the locale server-side and pass it as `value`.

Ids are not a source of mismatch here (see above), but they become
one if two different component trees mount in a different order on
the server and the client, since the counter is per-module and
increments in construction order.

## Plain Angular CLI (no SSR)

Without SSR there is no first-paint problem worth solving — the
select hydrates from `localStorage` (or detects from
`navigator.languages` if `detectFromNavigator=true`) and applies
`lang`/`dir` before content renders if you mount it at the top of
the layout.
