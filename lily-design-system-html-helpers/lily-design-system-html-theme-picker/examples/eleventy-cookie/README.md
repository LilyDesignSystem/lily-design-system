# Eleventy build-time-default recipe

End-to-end recipe for inlining the default theme at build time so
the first paint matches the build-time default — no flash, no FOUT
on first visit.

For per-user persistence, the picker still uses `localStorage` on
the client. On subsequent visits the picker reads the stored slug
in `connectedCallback` and applies it; if it differs from the
build-time default the user sees one frame of the default followed
by the stored theme. (Eleventy is build-time only and has no request
context, so per-request cookie resolution is not possible — switch
to Astro or a dynamic SSR pipeline if you need cookie-driven theming.)

Files in this folder match Eleventy's filesystem convention. Drop
them under the corresponding paths in an Eleventy project.

| File                            | Role                                                      |
| ------------------------------- | --------------------------------------------------------- |
| `_data/theme.js`                | Build-time default theme.                                 |
| `_includes/layout.njk`          | Layout that inlines `<html data-theme>` and the matching `<link>`. |
| `index.njk`                     | A page that uses the layout.                              |

Required setup in your project:

1. Have theme CSS files at `public/assets/themes/<slug>.css` (or
   wherever Eleventy serves static assets — typically `passthrough`
   copy from `assets/themes/`).
2. Build a copy of the theme-picker module at `/dist/theme-picker.js`.

## Flow

```
build:  Eleventy reads _data/theme.js → renders layout with theme.defaultTheme
        page.html arrives with <html data-theme="light"> and matching <link>
        <theme-picker value="light"> rendered with the resolved attribute
visit:  browser parses HTML, applies <link>, loads /dist/theme-picker.js
        picker upgrades, reads localStorage["lily-theme"]
          - if stored = "light": no change, no flash
          - if stored = "dark":  one frame of light, then dark
```

For zero flash on every visit (cookie-driven), use Astro or a
dynamic SSR pipeline instead of Eleventy.
