# SSR and hydration

The select is SSR-safe out of the box but does not, on its own,
deliver a flicker-free first paint. This guide explains why and how
to close the gap.

## What the select does on the server

Under SSR, no `onMounted` callback fires and the select does not
touch the DOM. The rendered HTML looks like:

```html
<div class="theme-select">
    <input type="hidden" name="theme" value="light" />
    <button type="button" class="theme-select-button" aria-label="Theme"
            aria-haspopup="listbox" aria-expanded="false"
            aria-controls="theme-select-1-list">
        <span class="theme-select-icon" aria-hidden="true">◑</span>
    </button>
    <ul class="theme-select-list" id="theme-select-1-list" role="listbox"
        aria-label="Theme" tabindex="-1" hidden>
        <li class="theme-select-option" id="theme-select-1-option-0"
            role="option" aria-selected="true">Light</li>
        …
    </ul>
</div>
```

The listbox always renders — closed via the `hidden` attribute, not by
conditional rendering — so the server and client markup match
structurally. No option carries `aria-selected="true"`, and the hidden
input is empty, unless the consumer supplied a non-empty `value`.

## What happens on hydration

On the client the select's `onMounted` callback runs once after mount:

1. Resolves the initial slug per
   [spec/index.md §5.2](../spec/index.md#52-initial-value-resolution).
2. Emits `update:value` (which drives `v-model:value` back to the
   parent) so the bound variable reflects the resolved value.
3. Injects / sets the managed `<link>` href.
4. Sets `data-theme` on the target.

If the resolved slug differs from the one that the server rendered
with, the user sees one frame of unstyled (or wrongly-themed)
content before the lifecycle hook runs. This is the "flash of
unstyled theme" (FOUT).

## How to get a flicker-free first paint

The fix is to **resolve the theme on the server** and inline both:

- `<html data-theme="<slug>">` in the document shell, and
- the `<link rel="stylesheet" href="/assets/themes/<slug>.css">`

so that CSS is in place before any pixel is painted. The select can
then hydrate without changing anything visible.

### Nuxt 3 recipe

End-to-end code lives in
[`../examples/nuxt-cookie/`](../examples/nuxt-cookie/). The shape:

1. `server/middleware/theme.ts` reads a `theme` cookie into
   `event.context.theme`.
2. A plugin forwards the cookie value to the client via
   `useNuxtApp().$initialTheme`.
3. The layout/`app.vue` uses `useHead({ htmlAttrs: { "data-theme": theme }})`
   so `<html data-theme="…">` arrives in the response.
4. The select is mounted with `v-model:value="theme"` plus `:value="theme"`.
5. The select's `change` event posts to a small endpoint (or writes
   `document.cookie` directly) that writes the cookie.

### Astro recipe

In an Astro layout with a Vue island:

```astro
---
const theme = Astro.cookies.get("theme")?.value ?? "light";
---
<html lang="en" data-theme={theme}>
    <head>
        <link rel="stylesheet" href={`/assets/themes/${theme}.css`} />
    </head>
    <body>
        <ThemeSelect
            client:load
            label="Theme"
            themes-url="/assets/themes/"
            :themes={["light", "dark", "abyss"]}
            value={theme}
        />
        <slot />
    </body>
</html>
```

### Plain Vite + Vue recipe

Without SSR, there is no first-paint problem worth solving — the
select hydrates from `localStorage` before content renders if you
mount it at the top of `<body>`. Avoid styles depending on
`data-theme` for the first paint, or hard-code the default theme's
`<link>` in `index.html`.

## Why we don't auto-resolve from the cookie

The select has no opinion about transport (cookie? header?
IndexedDB? URL parameter?). Cookies are the right answer for Nuxt
3, but not for Cloudflare-Workers-based hosts, embedded contexts,
or apps that already have a server-side preference store. The
select stays transport-agnostic and lets the consumer wire the
integration.

## Nuxt-specific tips

- Use `useHead` (auto-imported in Nuxt 3) to write `data-theme` on
  `<html>` from a layout. Don't use `document.documentElement`
  directly in a `<script setup>` top-level — that bypasses SSR.
- `useState` keys are global across the app instance; perfect for
  hoisting the theme ref above a deep tree.
- Prefer `definePageMeta` for per-page theme overrides; the select
  picks them up via the bound `value`.
- For static-site generation (`nuxi generate`), there's no request
  context — the select falls back to `localStorage` like a SPA.

---

Lily™ and Lily Design System™ are trademarks.
