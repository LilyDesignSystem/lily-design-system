# SvelteKit cookie example

End-to-end recipe for resolving the theme on the server (via a cookie)
so the first paint matches the user's choice — no flicker, no SSR
hydration mismatch.

Files in this folder match SvelteKit's filesystem-routing convention.
Drop them under `src/routes/` in a SvelteKit project.

| File                 | Role                                                |
| -------------------- | --------------------------------------------------- |
| `hooks.server.ts`    | Reads the `theme` cookie into `event.locals.theme`. |
| `+layout.server.ts`  | Exposes the resolved theme to all routes.           |
| `+layout.svelte`     | Renders the picker, reflects `data-theme` on `<html>` before paint via `app.html`. |
| `+page.svelte`       | A trivial page that demonstrates the result.        |
| `app.html.snippet`   | Snippet to inline `data-theme="…"` on `<html>` before first paint. |

Required setup in your project:

1. Have theme CSS files at `static/assets/themes/<slug>.css`.
2. Add `theme: string` to your `App.Locals` interface in
   `src/app.d.ts`.

## Flow

```
browser → server: GET /  (Cookie: theme=dark)
                 hooks.server.ts reads cookie → event.locals.theme = "dark"
                 +layout.server.ts returns { theme: "dark" } to client
                 +layout.svelte renders <html data-theme="dark"> immediately
                 the picker mounts with value="dark" — no flicker
```

When the user changes themes, the picker's `onChange` writes the new
slug to a cookie via `fetch("/api/theme", { method: "POST", … })` so
the next SSR request sees it.
