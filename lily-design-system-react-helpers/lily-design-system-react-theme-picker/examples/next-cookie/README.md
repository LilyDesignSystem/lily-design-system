# Next.js App Router cookie example

End-to-end recipe for resolving the theme on the server (via a cookie)
so the first paint matches the user's choice — no flicker, no SSR
hydration mismatch.

Files in this folder mirror Next.js App Router conventions. Drop them
into `app/` in a Next.js project.

| File         | Role                                                                         |
| ------------ | ---------------------------------------------------------------------------- |
| `layout.tsx` | Server component. Reads the `theme` cookie via `cookies()` and writes `<html data-theme>` plus the active theme's `<link>`. |
| `page.tsx`   | Client component. Renders the picker; `onChange` writes the cookie back.    |

## Required setup in your project

1. Have theme CSS files at `public/assets/themes/<slug>.css`.
2. Use the App Router (`next` ≥ 13).

## Flow

```
browser → server: GET /  (Cookie: theme=dark)
                 layout.tsx reads cookie → theme = "dark"
                 layout.tsx renders <html data-theme="dark"> with
                   <link rel="stylesheet" href="/assets/themes/dark.css">
                 page.tsx (client) mounts with initialTheme="dark"
                 ThemePicker mounts with value="dark" — no flicker
```

When the user changes themes:

- `page.tsx` calls `setTheme(slug)` to update local state.
- `page.tsx` writes `document.cookie = "theme=..."` so the next SSR
  request sees it.
- ThemePicker swaps the managed `<link>` href and `data-theme`.

For an alternative cookie-write path using a server action, see
[`../../docs/recipes.md`](../../docs/recipes.md) § "Server action for
cookie write".
