# SSR — Lily Vue Helpers

The helpers compile cleanly under Vue 3 SSR (Nuxt, plain
`vue/server-renderer`, Astro Vue islands, Quasar SSR). This page
lists the rules they follow so SSR + hydration stays consistent and
provides the Nuxt-flavoured wiring recipes.

## Rules every helper follows

1. **No DOM access in `<script setup>` top level.** Anything that
   touches `document.*` or `window.*` lives inside `onMounted`,
   `onBeforeMount`, or `watch`.
2. **No `localStorage` read during render.** Storage is only touched
   inside `onMounted` and `watch`, which run client-side only.
3. **Render is deterministic from props.** Given the same props,
   server and client produce the same HTML, avoiding hydration
   warnings.
4. **`value` is the SSR bridge.** When you want a flicker-free first
   paint, resolve the value server-side and pass it as a prop. The
   component renders the matching radio as checked on the server,
   then hydrates without any DOM swap.

## Nuxt 3 cookie strategy (recommended)

Nuxt's `useCookie` + a `server/middleware/locale.ts` hook is the
direct equivalent of SvelteKit's `hooks.server.ts` +
`transformPageChunk`.

### Server middleware

```ts
// server/middleware/locale.ts
import { defineEventHandler, getCookie, setHeader } from "h3";

export default defineEventHandler((event) => {
    const cookie = getCookie(event, "locale") ?? "en";
    event.context.locale = cookie;
});
```

### Plugin to expose the cookie

```ts
// plugins/locale.ts
export default defineNuxtPlugin((nuxtApp) => {
    const event = useRequestEvent();
    const initial = event?.context?.locale ?? "en";
    return { provide: { initialLocale: initial } };
});
```

### Layout

```vue
<script setup lang="ts">
import LocaleSelect from "@/components/LocaleSelect.vue";

const { $initialLocale } = useNuxtApp();
const locale = ref<string>($initialLocale);

useHead({
    htmlAttrs: { lang: locale, dir: /^(ar|he|fa|ur)/.test(locale.value) ? "rtl" : "ltr" },
});

function persistCookie(code: string) {
    document.cookie = `locale=${code}; path=/; max-age=31536000; SameSite=Lax`;
}
</script>

<template>
    <LocaleSelect
        label="Language"
        :locales="['en', 'fr', 'ar']"
        v-model:value="locale"
        :value="locale"
        @change="persistCookie"
    />
</template>
```

`useHead` writes `lang` and `dir` server-side so the document
arrives with the correct attributes before any pixel is painted.

## Nuxt theme cookie strategy

```ts
// server/middleware/theme.ts
import { defineEventHandler, getCookie } from "h3";

export default defineEventHandler((event) => {
    const cookie = getCookie(event, "theme") ?? "light";
    event.context.theme = cookie;
});
```

```vue
<script setup lang="ts">
import ThemeSelect from "@/components/ThemeSelect.vue";

const { $initialTheme } = useNuxtApp();
const theme = ref<string>($initialTheme);

useHead({ htmlAttrs: { "data-theme": theme } });

function persistCookie(slug: string) {
    document.cookie = `theme=${slug}; path=/; max-age=31536000; SameSite=Lax`;
}
</script>

<template>
    <ThemeSelect
        label="Theme"
        themes-url="/assets/themes/"
        :themes="['light', 'dark', 'abyss']"
        v-model:value="theme"
        @change="persistCookie"
    />
</template>
```

The plugin file mirrors `plugins/locale.ts`; substitute `theme` for
`locale` and write the cookie via `setCookie(event, "theme", …)`.

## Plain `renderToString` (no framework)

```ts
import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import ThemeSelect from "./ThemeSelect.vue";

const app = createSSRApp(ThemeSelect, {
    label: "Theme",
    themesUrl: "/themes/",
    themes: ["light", "dark"],
    value: "light",
});
const html = await renderToString(app);
```

The resulting string contains the rendered fieldset with the
`light` radio checked. No DOM touched, no errors thrown.

## Astro Vue islands

Astro hydrates Vue components with `client:load` / `client:idle` /
`client:visible`. The helpers work with all three. Pre-seed the
`value` prop in the Astro frontmatter so the first paint is correct:

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

## Hydration mismatch warnings

If you see a Vue warning like "hydration node mismatch", the most
common cause is:

- The server rendered a default `value` ("") but the client picked
  a non-empty value from `localStorage`.
- **Fix.** Resolve the value server-side (cookie) and pass it as
  `value`.

A second cause: the consumer wraps the helper in `<ClientOnly>` —
this isolates SSR but prevents the server from rendering anything at
all. Only use `<ClientOnly>` if you accept the FOUC.
