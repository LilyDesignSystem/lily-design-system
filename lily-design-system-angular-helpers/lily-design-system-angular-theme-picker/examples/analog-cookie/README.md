# Analog v1 cookie example

End-to-end recipe for resolving the theme on the server (via a
cookie) so the first paint matches the user's choice — no flicker,
no SSR hydration mismatch.

Files in this folder match Analog v1's filesystem-routing
convention. Drop them under the corresponding paths in an Analog
project.

| File                                    | Role                                                          |
| --------------------------------------- | ------------------------------------------------------------- |
| `src/server/middleware/theme.ts`        | Reads the `theme` cookie into `event.context.theme`.          |
| `src/app/tokens/initial-theme.ts`       | Injection token bridging SSR + client.                        |
| `src/app/app.component.ts`              | Renders the select; subscribes to `(themeChange)` for cookie. |
| `src/app/app.config.server.ts`          | Writes `<html data-theme>` via DOCUMENT during SSR.           |
| `src/server/routes/api/theme.post.ts`   | Tiny endpoint that writes the cookie on change.               |

Required setup in your project:

1. Have theme CSS files at `public/assets/themes/<slug>.css`.
2. (Optional) Add `theme: string` to your shared TypeScript types
   for `event.context.theme`.

## Flow

```
browser → server: GET /  (Cookie: theme=dark)
                 src/server/middleware/theme.ts reads cookie
                   → event.context.theme = "dark"
                 INITIAL_THEME factory reads context → "dark"
                 app.config.server.ts writes <html data-theme="dark">
                 app.component.ts seeds theme signal with "dark"
                 select mounts with value="dark" — no flicker
```

When the user changes themes, the select's `(themeChange)` calls
`fetch("/api/theme", { method: "POST", body: { theme } })` so the
next SSR request sees the new cookie.

## SSR caveat

Calling `document.cookie = …` from the browser is enough for the
*current* tab but does not write a server-readable cookie when the
page is rendered server-side on the next request unless the path,
SameSite, and Max-Age match. The endpoint version is more
defensive; the direct `document.cookie` write is fine for SPA-only
flows.

## A simpler variant

If you only need client-side persistence and tolerate a one-frame
flash, drop the server bits and use `storageKey`. The full Analog
recipe exists for the case where flicker-free first paint matters.

## Why the Analog-specific equivalent of SvelteKit's
   `transformPageChunk`?

Analog's middleware runs before the Angular render. The
`INITIAL_THEME` factory uses the `REQUEST` injection token to read
what the middleware stashed; the same factory falls back to
`document.cookie` on the client. One token, two implementations,
zero special-case code in the component.
