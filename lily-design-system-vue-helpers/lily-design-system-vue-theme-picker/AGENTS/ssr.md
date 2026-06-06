# SSR — ThemePicker (Vue)

The picker runs cleanly under Vue 3 SSR (Nuxt, plain
`vue/server-renderer`, Astro Vue islands). This page lists the
Vue-specific recipes; the canonical rules live in
[`../../AGENTS/ssr.md`](../../AGENTS/ssr.md).

## What the picker does on the server

Under SSR, `onMounted` and `watch` are no-ops. The picker renders:

```html
<fieldset class="theme-picker" role="radiogroup" aria-label="Theme">
    <label class="theme-picker-option">
        <input type="radio" name="theme" value="light" />
        <span class="theme-picker-option-label">Light</span>
    </label>
    …
</fieldset>
```

If the consumer passes `value="light"`, the corresponding radio
gets `checked` rendered server-side.

The managed `<link>` is **not** created on the server. `data-theme`
is **not** written to `<html>` on the server. Those happen on
hydration.

## Why this matters

If `<html>` arrives with no `data-theme` and the theme CSS
references `:root[data-theme="dark"] { … }`, the first paint shows
the default browser styles, then on hydration the picker sets
`data-theme="dark"` and the page repaints. That's the flash of
unstyled theme (FOUT).

Fix: resolve the theme on the server and inline both
`<html data-theme="…">` and a `<link rel="stylesheet">` for the
chosen theme so CSS is in place before any pixel is painted.

## Nuxt 3 cookie recipe

End-to-end code lives in
[`../examples/nuxt-cookie/`](../examples/nuxt-cookie/). The shape:

1. `server/middleware/theme.ts` reads a `theme` cookie into
   `event.context.theme`.
2. `app.vue` (or a layout) calls `useHead({ htmlAttrs: { "data-theme": theme }})`
   so `<html data-theme="…">` arrives in the response.
3. The picker is mounted with `value="…"` (forwarded from the
   middleware via a plugin or `useState`).
4. When the user changes themes, the picker's `change` event writes
   a cookie via `document.cookie = …`.

### Plugin to forward the cookie

```ts
// plugins/theme.ts
export default defineNuxtPlugin(() => {
    const event = useRequestEvent();
    const initial = event?.context?.theme ?? "light";
    return { provide: { initialTheme: initial } };
});
```

### Layout

```vue
<script setup lang="ts">
import ThemePicker from "@/components/ThemePicker.vue";

const { $initialTheme } = useNuxtApp();
const theme = ref<string>($initialTheme);

useHead({ htmlAttrs: { "data-theme": theme } });

function persistCookie(slug: string) {
    document.cookie = `theme=${slug}; path=/; max-age=31536000; SameSite=Lax`;
}
</script>

<template>
    <ThemePicker
        label="Theme"
        themes-url="/assets/themes/"
        :themes="['light', 'dark', 'abyss']"
        v-model:value="theme"
        @change="persistCookie"
    />
    <NuxtPage />
</template>
```

## Astro Vue islands

Astro hydrates with `client:load` / `client:idle` / `client:visible`.
Pre-seed `value` in the Astro frontmatter:

```astro
---
const theme = Astro.cookies.get("theme")?.value ?? "light";
---
<html lang="en" data-theme={theme}>
    <head>
        <link rel="stylesheet" href={`/assets/themes/${theme}.css`} />
    </head>
    <body>
        <ThemePicker
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

## Plain Vue 3 SSR (`vue/server-renderer`)

```ts
import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import ThemePicker from "./ThemePicker.vue";

export async function render(req) {
    const cookieTheme = parseCookie(req.headers.cookie, "theme") ?? "light";
    const app = createSSRApp(ThemePicker, {
        label: "Theme",
        themesUrl: "/assets/themes/",
        themes: ["light", "dark", "abyss"],
        value: cookieTheme,
    });
    const html = await renderToString(app);
    return `<!doctype html>
<html lang="en" data-theme="${cookieTheme}">
    <head>
        <link rel="stylesheet" href="/assets/themes/${cookieTheme}.css" />
    </head>
    <body><div id="app">${html}</div><script src="/client.js"></script></body>
</html>`;
}
```

## Hydration mismatch warnings

If you see a Vue warning like "Hydration node mismatch", the most
common cause is:

- The server rendered no `checked` on any radio (because `value`
  was empty), but the client picked a non-empty value from
  `localStorage`.
- **Fix.** Resolve the theme server-side and pass it as `value`.

A second cause: the consumer wraps the helper in `<ClientOnly>` —
this isolates SSR but prevents the server from rendering anything at
all. Only use `<ClientOnly>` if you accept the FOUC.

## Why not auto-resolve from the cookie?

The picker has no opinion about transport (cookie? header? IndexedDB?
URL parameter?). Cookies are the right answer for Nuxt, but not for
Cloudflare-Workers-based hosts, embedded contexts, or apps that
already have a server-side preference store. The picker stays
transport-agnostic and lets the consumer wire the integration.
