# Eleventy + cookie example

End-to-end recipe for resolving the theme on the server (via a
cookie) so the first paint matches the user's choice — no flicker,
no JavaScript needed for the first frame.

Files in this folder match Eleventy's filesystem-routing
convention plus a Cloudflare Pages Functions middleware.

| File                            | Role                                                      |
| ------------------------------- | --------------------------------------------------------- |
| `_includes/base.njk`            | Eleventy layout that emits `<html data-theme>` + select.  |
| `index.njk`                     | A page that consumes the layout.                          |
| `_data/site.js`                 | Default theme + supported set (Eleventy global data).     |
| `functions/_middleware.js`      | Cloudflare Pages edge middleware that substitutes theme.  |
| `functions/api/theme.js`        | POST endpoint that writes the cookie.                     |

Required setup in your project:

1. Have theme CSS files at `assets/themes/<slug>.css`.
2. Drop the select's `theme-select.njk` + `theme-select.client.js`
   somewhere Eleventy can reach (e.g.
   `_includes/lily/theme-select.njk`).
3. Wire `eleventyConfig.addPassthroughCopy` for both the themes
   directory and the client.js.

## Flow

```
browser → edge: GET /  (Cookie: theme=dark)
                edge runs functions/_middleware.js
                  reads cookie → theme=dark
                  fetches the static HTML
                  replaces __THEME__ placeholders with "dark"
                  responds with the patched HTML
browser receives <html data-theme="dark"> + light.css = no flash
```

When the user changes themes, the select's `onChange` calls
`fetch("/api/theme", { method: "POST", body: { theme } })` so the
next SSR request sees the new cookie.

## SSR caveat

Calling `document.cookie = …` from the browser is enough for the
*current* tab but does not always survive a hard reload across
domains and paths. The POST-endpoint version is more defensive;
the direct `document.cookie` write is fine for SPA-only flows.

## A simpler variant

If you only need client-side persistence and tolerate a one-frame
flash, drop the edge middleware and use `storageKey`. The full
recipe exists for the case where flicker-free first paint matters.
