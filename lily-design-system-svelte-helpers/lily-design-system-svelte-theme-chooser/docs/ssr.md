# SSR and hydration

The select is SSR-safe out of the box but does not, on its own,
deliver a flicker-free first paint. This guide explains why and how
to close the gap.

## What the select does on the server

Under SSR, no `$effect` runs and the select does not touch the DOM.
The rendered HTML looks like:

```html
<div class="theme-chooser">
  <input type="hidden" name="theme" value="" />
  <button type="button" class="theme-chooser-button" aria-label="Theme"
          aria-haspopup="listbox" aria-expanded="false" aria-controls="theme-chooser-1-list">
    <span class="theme-chooser-icon" aria-hidden="true">&#9681;</span>
  </button>
  <ul class="theme-chooser-list" id="theme-chooser-1-list" role="listbox"
      aria-label="Theme" tabindex="-1" hidden>
    <li class="theme-chooser-option" id="theme-chooser-1-option-0"
        role="option" aria-selected="false">Light</li>
    …
  </ul>
</div>
```

No option is `aria-selected` and the hidden input is empty unless the
consumer supplied a non-empty `value`.

Option ids come from an incrementing module counter
(`nextThemeChooserId`), not from `Math.random()` or `Date.now()`, so the
server and the client generate the same ids in the same mount order and
hydration matches.

## What happens on hydration

On the client the select's `$effect` runs once after mount:

1. Resolves the initial slug per
   [spec/index.md §5.2](../spec/index.md#52-initial-value-resolution).
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

so that CSS is in place before any pixel is painted. The select can
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
3. The select is mounted with `value={data.theme}` (forwarded from a
   layout `load` function).
4. When the user picks a new theme, the select's `onChange` posts to a
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
    <ThemeChooser value={theme} ... />
    <slot />
  </body>
</html>
```

### Hydration mismatch

If Svelte logs a `hydration_mismatch` warning, the usual cause is that
the server rendered with an empty `value` while the client resolved a
non-empty one from `localStorage`, `detectFromSystem`, or
`defaultValue` — so `aria-selected` and the hidden input's `value`
differ between the two passes.

The fix is the same as for the flash: resolve the theme on the server
and pass it as `value`.

Note that `detectFromSystem` can only ever run on the client —
`matchMedia` does not exist on the server — so enabling it guarantees a
client-side resolution step unless `value` or storage short-circuits
it first.

### Plain Vite + Svelte recipe

Without SSR, there is no first-paint problem worth solving — the
select hydrates from `localStorage` before content renders if you
mount it at the top of `<body>`. Avoid styles depending on
`data-theme` for the first paint, or hard-code the default theme's
`<link>` in `index.html`.

## Why we don't auto-resolve from the cookie

The select has no opinion about transport (cookie? header? IndexedDB?
URL parameter?). Cookies are the right answer for SvelteKit, but not
for Cloudflare-Workers-based hosts, embedded contexts, or apps that
already have a server-side preference store. The select stays
transport-agnostic and lets the consumer wire the integration.

---

Lily™ and Lily Design System™ are trademarks.
