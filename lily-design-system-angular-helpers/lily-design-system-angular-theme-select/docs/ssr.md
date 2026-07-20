# SSR and hydration

The select is SSR-safe out of the box but does not, on its own,
deliver a flicker-free first paint. This guide explains why and
how to close the gap.

## What the select does on the server

Under SSR, the `effect()` callback's `typeof document !==
"undefined"` guard prevents any DOM mutation. The select renders:

```html
<div class="theme-select ">
    <input type="hidden" name="theme" value="light" />
    <button type="button" class="theme-select-button" aria-label="Theme"
            aria-haspopup="listbox" aria-expanded="false"
            aria-controls="theme-select-1-list">
        <span class="theme-select-icon" aria-hidden="true">&#9681;</span>
    </button>
    <ul class="theme-select-list" id="theme-select-1-list" role="listbox"
        aria-label="Theme" tabindex="-1" hidden>
        <li class="theme-select-option" id="theme-select-1-option-0"
            role="option" aria-selected="true">Light</li>
        …
    </ul>
</div>
```

The listbox is always closed server-side — open state is user
interaction, and there has been none — so `aria-expanded` is `false`,
`hidden` is present, and `aria-activedescendant` is absent.

**Ids are deterministic.** They come from `nextThemeSelectId()`, an
incrementing module counter, not `Math.random()` or `Date.now()`. That
is precisely so the `id` / `aria-controls` / option-id triple matches
between the server and client renders; random ids would both trip
hydration and silently break the ARIA wiring.

The attributes that *can* differ across the boundary are the ones
derived from `value`: the hidden input's `value`, and which `<li>`
carries `aria-selected="true"`. If the server renders from an empty
`value` while the client resolves one from `localStorage`, they
disagree — see "SSR hydration mismatch" in
[troubleshooting.md](./troubleshooting.md). Passing a server-resolved
`value` fixes it and the flicker at the same time.

## What happens on hydration

On the client the select's `effect()` runs for the first time
shortly after mount:

1. Resolves the initial slug per
   [spec/index.md §5.2](../spec/index.md#52-initial-value-resolution).
2. Writes back to the `value` model signal (which drives `[(value)]`
   back to the parent) so the bound variable reflects the resolved
   value.
3. Injects / sets the managed `<link>` href.
4. Sets `data-theme` on the target.

If the resolved slug differs from the one that the server rendered
with, the user sees one frame of unstyled (or wrongly-themed)
content before the effect runs. This is the "flash of unstyled
theme" (FOUT).

## How to get a flicker-free first paint

The fix is to **resolve the theme on the server** and inline both:

- `<html data-theme="<slug>">` in the document shell, and
- the `<link rel="stylesheet" href="/assets/themes/<slug>.css">`

so that CSS is in place before any pixel is painted. The select
can then hydrate without changing anything visible.

### Analog v1 recipe

End-to-end code lives in
[`../examples/analog-cookie/`](../examples/analog-cookie/). The
shape:

1. `src/server/middleware/theme.ts` reads a `theme` cookie into
   `event.context.theme`.
2. An injection token (`INITIAL_THEME`) bridges the server-resolved
   value into the Angular tree.
3. The root component reads the token and binds it to the select's
   `value` via `[(value)]`.
4. The select's `(themeChange)` writes a cookie via
   `document.cookie = …` (or POSTs to a `/api/theme` endpoint).

### Writing `<html data-theme>` server-side

To avoid the FOUC, write `data-theme` to `<html>` on the server
too. Inject `DOCUMENT` inside a server-only environment
initializer:

```ts
// src/app/app.config.server.ts
import {
    ApplicationConfig,
    inject,
    provideEnvironmentInitializer,
    mergeApplicationConfig,
} from "@angular/core";
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

### `@angular/ssr` recipe (Angular CLI)

The same pattern applies — replace `@analogjs/router/tokens`'s
`REQUEST` with `@angular/ssr`'s `REQUEST` import path. The cookie
parsing and DOM attribute writes are identical.

### Astro recipe

In an Astro layout with an Angular island:

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

### Plain Angular CLI (no SSR)

Without SSR, there is no first-paint problem worth solving — the
select hydrates from `localStorage` before content renders if you
mount it at the top of the layout. Avoid styles depending on
`data-theme` for the first paint, or hard-code the default theme's
`<link>` in `index.html`.

## Why we don't auto-resolve from the cookie

The select has no opinion about transport (cookie? header?
IndexedDB? URL parameter?). Cookies are the right answer for
Analog and Universal, but not for Cloudflare-Workers-based hosts,
embedded contexts, or apps that already have a server-side
preference store. The select stays transport-agnostic and lets
the consumer wire the integration.

## Analog-specific tips

- Use the `REQUEST` injection token from `@analogjs/router/tokens`
  inside an `InjectionToken` factory. Don't reach into Nitro's
  `H3Event` directly — the token gives you the request context that
  middleware populated.
- Server middleware files live under `src/server/middleware/`. The
  Vite plugin auto-registers them.
- For static-site generation (`analog build`), there's no request
  context — the select falls back to `localStorage` like a SPA.
- The `DOCUMENT` token from `@angular/common` returns the
  server-rendered HTMLDocument during SSR, so
  `doc.documentElement.setAttribute("data-theme", …)` works on
  both server and client.

## `@angular/ssr` (Angular CLI) tips

- The Angular CLI's `@angular/ssr` package provides
  `provideServerRendering()` and a `REQUEST` token for accessing
  the express request. The shape is similar to Analog's; only the
  import path differs.
- Use `provideEnvironmentInitializer` (Angular 18+) or the older
  `APP_INITIALIZER` token to run server-only setup.

## Hydration mismatch warnings

If you see an Angular warning like "NG0500: Hydration: node
mismatch", the most common cause is:

- **Not the ids** — `nextThemeSelectId()` is a deterministic counter,
  so `id`, `aria-controls`, and the option ids agree on both sides.
- **Possibly the value-derived attributes** — the hidden input's
  `value` and the `aria-selected` flags. They differ if the server
  rendered from an empty `value` while the client resolved one from
  `localStorage`.
- More likely still, something else in the consumer's template keys
  off the resolved theme with the same empty-vs-resolved split.
- **Fix.** Resolve the theme server-side and pass it as `value`.

A second cause: the consumer renders the helper inside a
`@defer { … }` block — the deferred block hydrates lazily, which
isolates SSR effects but prevents the first paint from showing
the right theme. Only use `@defer` if you accept the FOUC.

## Inside `@defer` blocks

`@defer (on viewport) { <lily-theme-select ... /> }` defers the
select until it enters the viewport. The FOUT window grows because
the effect doesn't run on the first paint. Move the select outside
the `@defer` boundary, or pre-resolve the theme on the server and
pass it as `value`.

---

Lily™ and Lily Design System™ are trademarks.
