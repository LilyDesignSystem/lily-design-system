# SvelteKit cookie example

End-to-end recipe for resolving the text size on the server (via a
cookie) so the first paint matches the user's choice — no flash of the
wrong size, no SSR hydration mismatch, no reflow of body text after
hydration.

This matters more for a text-size picker than it does for
`theme-picker`'s colour swap: a late-applied `data-text-size` doesn't
just repaint colours, it reflows layout — headings, line counts, and
scroll position can all shift the instant `localStorage` is read on the
client. Resolving it on the server avoids that reflow entirely.

Files in this folder match SvelteKit's filesystem-routing convention.
Drop them under `src/routes/` in a SvelteKit project.

| File                 | Role                                                       |
| -------------------- | ----------------------------------------------------------- |
| `hooks.server.ts`    | Reads the `text-size` cookie into `event.locals.textSize`.  |
| `+layout.server.ts`  | Exposes the resolved size to all routes.                    |
| `+layout.svelte`     | Renders the picker, reflects `data-text-size` on `<html>` before paint via `app.html`. |
| `+page.svelte`       | A trivial page that demonstrates the result.                |
| `app.html.snippet`   | Snippet to inline `data-text-size="…"` on `<html>` before first paint. |

Required setup in your project:

1. Have the `[data-text-size="<slug>"]` font-size rules in your global
   stylesheet — see [`../../index.md`](../../index.md).
2. Add `textSize: string` to your `App.Locals` interface in
   `src/app.d.ts`.

## Flow

```
browser → server: GET /  (Cookie: text-size=large)
                 hooks.server.ts reads cookie → event.locals.textSize = "large"
                 +layout.server.ts returns { textSize: "large" } to client
                 +layout.svelte renders <html data-text-size="large"> immediately
                 the picker mounts with value="large" — no reflow
```

When the user changes sizes, the picker's `onChange` writes the new
slug to a cookie via `fetch("/api/text-size", { method: "POST", … })`
so the next SSR request sees it.

Note this recipe uses a cookie instead of the component's own
`storageKey` (`localStorage`). The two are not mutually exclusive —
`storageKey` alone is enough for a client-rendered app that can tolerate
one post-hydration reflow; the cookie is for when that reflow itself is
the thing you're trying to eliminate.
