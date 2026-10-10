# Nuxt 3 cookie example

End-to-end recipe for resolving the theme on the server (via a
cookie) so the first paint matches the user's choice — no flicker,
no SSR hydration mismatch.

Files in this folder match Nuxt 3's filesystem-routing convention.
Drop them under the corresponding paths in a Nuxt 3 project.

| File                            | Role                                                      |
| ------------------------------- | --------------------------------------------------------- |
| `server/middleware/theme.ts`    | Reads the `theme` cookie into `event.context.theme`.      |
| `plugins/theme.ts`              | Exposes the resolved theme to the client via `useNuxtApp`. |
| `app.vue`                       | Renders the picker; calls `useHead` to inline `data-theme`. |
| `server/api/theme.post.ts`      | Tiny endpoint that writes the cookie on change.           |

Required setup in your project:

1. Have theme CSS files at `public/assets/themes/<slug>.css`.
2. (Optional) Add `theme: string` to your shared TypeScript types.

## Flow

```
browser → server: GET /  (Cookie: theme=dark)
                 server/middleware/theme.ts reads cookie → event.context.theme = "dark"
                 plugins/theme.ts forwards the value to useNuxtApp
                 app.vue useHead writes <html data-theme="dark">
                 the picker mounts with value="dark" — no flicker
```

When the user changes themes, the picker's `@change` calls
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
flash, drop the server bits and use `storageKey`. The full Nuxt
recipe exists for the case where flicker-free first paint matters.
