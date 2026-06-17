# SSR — ThemeSelect (Angular)

The picker runs cleanly under Angular SSR (Analog v1 + Nitro,
`@angular/ssr`, Angular Universal). This page lists the
Angular-specific recipes; the canonical rules live in
[`../../AGENTS/ssr.md`](../../AGENTS/ssr.md).

## What the picker does on the server

Under SSR, the `effect()` callback's `typeof document` guard
prevents any DOM mutation. The picker renders:

```html
<select class="theme-select " aria-label="Theme" name="theme">
    <option class="theme-select-option" value="light">Light</option>
    …
</select>
```

If the consumer passes `value="light"`, the matching `<option>` is
rendered selected server-side because Angular binds the `<select>`
value to the resolved slug.

The managed `<link>` is **not** created on the server. `data-theme`
is **not** written to `<html>` on the server. Those happen on
hydration.

## Why this matters

If `<html>` arrives with no `data-theme` and the theme CSS
references `:root[data-theme="dark"] { … }`, the first paint shows
the default browser styles, then on hydration the picker sets
`data-theme="dark"` and the page repaints. That's the flash of
unstyled theme (FOUT).

Fix: resolve the theme on the server and inline both
`<html data-theme="…">` and a `<link rel="stylesheet">` for the
chosen theme so CSS is in place before any pixel is painted.

## Analog v1 cookie recipe

End-to-end code lives in
[`../examples/analog-cookie/`](../examples/analog-cookie/). The
shape:

1. `src/server/middleware/theme.ts` reads a `theme` cookie into
   `event.context.theme`.
2. An injection token bridges the server-resolved value into the
   Angular tree via `inject(REQUEST)`.
3. The root component reads the token and binds it to the picker's
   `value` via `[(value)]`.
4. When the user changes themes, the picker's `(themeChange)` event
   writes a cookie via `document.cookie = …` (or POSTs to a
   `/api/theme` endpoint).

### Injection token

```ts
// src/app/tokens/initial-theme.ts
import { InjectionToken, inject } from "@angular/core";
import { REQUEST } from "@analogjs/router/tokens";

export const INITIAL_THEME = new InjectionToken<string>("INITIAL_THEME", {
    providedIn: "root",
    factory: () => {
        const req = inject(REQUEST, { optional: true });
        if (!req) {
            // Client side — read the cookie directly.
            if (typeof document === "undefined") return "light";
            const match = document.cookie.match(/(?:^|; )theme=([^;]*)/);
            return match ? decodeURIComponent(match[1]) : "light";
        }
        // Server side — read what the middleware stashed.
        const ctx = (req as { context?: { theme?: string } }).context;
        return ctx?.theme ?? "light";
    },
});
```

### Root component

```ts
import { Component, inject, signal } from "@angular/core";
import { ThemeSelect } from "../theme-select.component";
import { INITIAL_THEME } from "./tokens/initial-theme";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [ThemeSelect],
    template: `
        <lily-theme-select
            label="Theme"
            themesUrl="/assets/themes/"
            [themes]="themes"
            [(value)]="theme"
            (themeChange)="persistCookie($event)"
        />
    `,
})
export class App {
    readonly themes = ["light", "dark", "abyss"];
    theme = signal(inject(INITIAL_THEME));

    persistCookie(slug: string): void {
        if (typeof document === "undefined") return;
        document.cookie =
            `theme=${slug}; path=/; max-age=31536000; SameSite=Lax`;
    }
}
```

### Writing `<html data-theme>` server-side

To avoid the FOUC, write `data-theme` to `<html>` on the server too.
Inject `DOCUMENT` inside an APP_INITIALIZER (or a route resolver)
and set the attribute:

```ts
// src/app/app.config.server.ts
import { ApplicationConfig, inject, provideEnvironmentInitializer, mergeApplicationConfig } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { appConfig } from "./app.config";
import { INITIAL_THEME } from "./tokens/initial-theme";

const serverConfig: ApplicationConfig = {
    providers: [
        provideEnvironmentInitializer(() => {
            const doc = inject(DOCUMENT);
            const slug = inject(INITIAL_THEME);
            doc.documentElement.setAttribute("data-theme", slug);
        }),
    ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
```

## `@angular/ssr` (Angular CLI)

The same pattern applies — replace `@analogjs/router/tokens`'s
`REQUEST` with `@angular/ssr`'s `REQUEST` import path. The cookie
parsing and DOM attribute writes are identical.

## Astro Angular islands

Astro's Angular integration hydrates components with `client:load`
/ `client:idle` / `client:visible`. Pre-seed `value` in the Astro
frontmatter:

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

If you see an Angular warning like "NG0500: Hydration: node
mismatch", the most common cause is:

- The server rendered the `<select>` with no selected option
  (because `value` was empty), but the client picked a non-empty
  value from `localStorage`.
- **Fix.** Resolve the theme server-side and pass it as `value`.

A second cause: the consumer renders the helper inside
`@defer { … }` blocks — the deferred block hydrates lazily, which
isolates SSR effects but prevents the first paint from showing the
right theme. Only use `@defer` if you accept the FOUC.

## Why we don't auto-resolve from the cookie

The picker has no opinion about transport (cookie? header?
IndexedDB? URL parameter?). Cookies are the right answer for Analog
and Universal, but not for Cloudflare-Workers-based hosts, embedded
contexts, or apps that already have a server-side preference store.
The picker stays transport-agnostic and lets the consumer wire the
integration.

## Plain Angular CLI (no SSR)

Without SSR there is no first-paint problem worth solving — the
picker hydrates from `localStorage` before content renders if you
mount it at the top of the layout. Avoid styles depending on
`data-theme` for the first paint, or hard-code the default theme's
`<link>` in `index.html`.
