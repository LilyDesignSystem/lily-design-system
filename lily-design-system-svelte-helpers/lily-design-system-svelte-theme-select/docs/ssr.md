# SSR and hydration

The picker is SSR-safe out of the box but does not, on its own,
deliver a flicker-free first paint. This guide explains why and how
to close the gap.

## What the picker does on the server

Under SSR, no `$effect` runs and the picker does not touch the DOM.
The rendered HTML looks like:

```html
<fieldset class="theme-select" role="radiogroup" aria-label="Theme">
  <label class="theme-select-option">
    <input type="radio" name="theme" value="light" />
    <span class="theme-select-option-label">Light</span>
  </label>
  …
</fieldset>
```

No radio is checked unless the consumer supplied a non-empty `value`.

## What happens on hydration

On the client the picker's `$effect` runs once after mount:

1. Resolves the initial slug per
   [spec.md §5.2](../spec.md#52-initial-value-resolution).
2. Writes the resolved slug back to the bindable `value`.
3. Injects / sets the managed `<link>` href.
4. Sets `data-theme` on the target.

If the resolved slug differs from the one that the server rendered
with, the user sees one frame of unstyled (or wrongly-themed) content
before the effect runs. This is the "flash of unstyled theme" (FOUT).

## How to get a flicker-free first paint

The fix is to **resolve the theme on the server** and inline both:

- `<html data-theme="<slug>">` in the document shell, and
- the `<link rel="stylesheet" href="/assets/themes/<slug>.css">`

so that CSS is in place before any pixel is painted. The picker can
then hydrate without changing anything visible.

### SvelteKit recipe

End-to-end code lives in
[`../examples/sveltekit-cookie/`](../examples/sveltekit-cookie/).
The shape is:

1. `hooks.server.ts` reads a `theme` cookie into `event.locals.theme`
   and uses `transformPageChunk` to substitute it into
   `app.html`.
2. `src/app.html` has `<html lang="en" data-theme="%theme%">` so the
   attribute is in place before parsing.
3. The picker is mounted with `value={data.theme}` (forwarded from a
   layout `load` function).
4. When the user picks a new theme, the picker's `onChange` posts to a
   small endpoint that writes the cookie.

### Astro recipe

In an Astro layout:

```astro
---
const theme = Astro.cookies.get("theme")?.value ?? "light";
---
<html lang="en" data-theme={theme}>
  <head>
    <link rel="stylesheet" href={`/assets/themes/${theme}.css`} />
  </head>
  <body>
    <ThemeSelect value={theme} ... />
    <slot />
  </body>
</html>
```

### Plain Vite + Svelte recipe

Without SSR, there is no first-paint problem worth solving — the
picker hydrates from `localStorage` before content renders if you
mount it at the top of `<body>`. Avoid styles depending on
`data-theme` for the first paint, or hard-code the default theme's
`<link>` in `index.html`.

## Why we don't auto-resolve from the cookie

The picker has no opinion about transport (cookie? header? IndexedDB?
URL parameter?). Cookies are the right answer for SvelteKit, but not
for Cloudflare-Workers-based hosts, embedded contexts, or apps that
already have a server-side preference store. The picker stays
transport-agnostic and lets the consumer wire the integration.
