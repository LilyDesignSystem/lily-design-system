# SSR — Lily Angular Helpers

The helpers compile cleanly under Angular SSR (Analog v1 + Nitro,
Angular Universal, Angular CLI's built-in `@angular/ssr`). This page
lists the rules they follow so SSR + hydration stays consistent and
provides the Analog-flavoured wiring recipes.

## Rules every helper follows

1. **No DOM access in field initialisers or constructor bodies.**
   Anything that touches `document.*` or `window.*` lives inside an
   `effect()` callback and guards on
   `typeof document !== "undefined"`.
2. **No `localStorage` read during initial render.** Storage is only
   touched inside `effect()`, which runs lazily once a tracked
   signal is read on the browser tick.
3. **Render is deterministic from inputs.** Given the same inputs,
   server and client produce the same HTML, avoiding hydration
   mismatches.
4. **`value` is the SSR bridge.** When you want a flicker-free first
   paint, resolve the value server-side and pass it as a
   model-signal input. The component renders the matching `<option>`
   as selected on the server, then hydrates without any DOM swap.

## Analog v1 cookie strategy (recommended)

Analog's server middleware + `injectRequest()` is the direct
equivalent of SvelteKit's `hooks.server.ts` +
`transformPageChunk`. Nitro's `defineEventHandler` powers the
middleware.

### Server middleware

```ts
// src/server/middleware/locale.ts
import { defineEventHandler, getCookie } from "h3";

export default defineEventHandler((event) => {
    const cookie = getCookie(event, "locale") ?? "en";
    event.context.locale = cookie;
});
```

### Resolver token

```ts
// src/app/tokens/initial-locale.ts
import { InjectionToken, inject, makeEnvironmentProviders } from "@angular/core";
import { REQUEST } from "@analogjs/router/tokens";

export const INITIAL_LOCALE = new InjectionToken<string>("INITIAL_LOCALE", {
    providedIn: "root",
    factory: () => {
        const req = inject(REQUEST, { optional: true });
        // On the client, REQUEST is null; fall back to the cookie via document.
        if (!req) {
            if (typeof document === "undefined") return "en";
            const match = document.cookie.match(/(?:^|; )locale=([^;]*)/);
            return match ? decodeURIComponent(match[1]) : "en";
        }
        // On the server, read from event.context.
        const ctx = (req as { context?: { locale?: string } }).context;
        return ctx?.locale ?? "en";
    },
});
```

### Layout component

```ts
import { Component, inject, signal } from "@angular/core";
import { LocaleSelect } from "@/locale-select.component";
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
            (localeChange)="persistCookie($event)"
        />
    `,
})
export class App {
    locale = signal(inject(INITIAL_LOCALE));

    persistCookie(code: string): void {
        if (typeof document === "undefined") return;
        document.cookie =
            `locale=${code}; path=/; max-age=31536000; SameSite=Lax`;
    }
}
```

The token's factory resolves on the server (from `event.context`) so
the picker mounts with the right value on the first paint. On the
client, the same token reads `document.cookie` directly — no
round-trip needed.

### Writing `lang` and `dir` server-side

The picker writes `lang` and `dir` to `<html>` once mounted, but on
the very first SSR pass nothing has mounted yet. To avoid the FOUC,
write them on the server via Analog's `Meta` / `Title` services or
via a route resolver:

```ts
// src/app/app.config.server.ts
import { provideServerRendering, withRoutes } from "@angular/ssr";
import { inject, isDevMode, mergeApplicationConfig } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { appConfig } from "./app.config";
import { INITIAL_LOCALE } from "./tokens/initial-locale";

export default mergeApplicationConfig(appConfig, {
    providers: [
        provideServerRendering(),
        {
            provide: "SET_HTML_ATTRS",
            useFactory: () => {
                const doc = inject(DOCUMENT);
                const code = inject(INITIAL_LOCALE);
                doc.documentElement.setAttribute("lang", code);
            },
            multi: true,
        },
    ],
});
```

This is roughly the Angular equivalent of Vue Nuxt's `useHead`.

## Angular Universal (legacy)

The same rules apply: never touch `document` at field-init time, use
`effect()` for all DOM writes, and bridge SSR-resolved values
through inputs. The `REQUEST` token import path is
`@nguniversal/express-engine/tokens` instead of
`@analogjs/router/tokens`; otherwise the recipe is identical.

## Plain Angular CLI (no SSR)

Without SSR there is no first-paint problem worth solving — the
picker mounts and immediately runs its `effect()`, reading
`localStorage` and applying the saved selection before the user
sees the page. The catalog ships no Universal-specific code paths.

## Astro Angular islands

Astro's Angular integration mounts components with `client:load` /
`client:idle` / `client:visible`. The helpers work with all three.
Pre-seed `value` in the Astro frontmatter so the first paint is
correct:

```astro
---
const theme = Astro.cookies.get("theme")?.value ?? "light";
---
<html lang="en" data-theme={theme}>
    <head>
        <link rel="stylesheet" href={`/assets/themes/${theme}.css`} />
    </head>
    <body>
        <lily-theme-select
            client:load
            label="Theme"
            themesUrl="/assets/themes/"
            themes={["light", "dark", "abyss"]}
            value={theme}
        />
        <slot />
    </body>
</html>
```

## Hydration mismatch warnings

If you see an Angular warning like
"NG0500: Hydration: component mismatch", the most common cause is:

- The server rendered a default `value` ("") but the client picked
  a non-empty value from `localStorage`.
- **Fix.** Resolve the value server-side (cookie) and pass it as
  `value`.

A second cause: the consumer wraps the helper in a `client:only`
island — this isolates SSR but prevents the server from rendering
anything at all. Only use it if you accept the FOUC.

## Why not auto-resolve from the cookie?

The helpers stay transport-agnostic. Cookies are the right answer
for Analog and Universal, but not for Cloudflare-Workers-based
hosts, embedded contexts, or apps that already have a server-side
preference store. The picker stays transport-agnostic and lets the
consumer wire the integration.

## What we do NOT use

- **`afterNextRender` / `afterRender`.** These hooks fire only on
  the browser side, which sounds ideal for DOM writes — but they
  fire after the *first* tick, not on every signal change. `effect()`
  with a `typeof document` guard is the cleaner primitive because
  it reacts to value changes naturally.
- **`@HostBinding('attr.lang')`.** Host bindings update on every
  change-detection tick and don't compose with the SSR cookie
  bridge cleanly. The helpers write to `document.documentElement`
  imperatively inside `effect()` instead.
- **`HttpClient`.** The helpers never fetch anything; the managed
  `<link>` is browser-driven.
