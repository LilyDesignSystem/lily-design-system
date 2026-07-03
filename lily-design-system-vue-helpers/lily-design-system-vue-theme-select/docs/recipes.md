# Recipes

Short solutions to common adjacent problems. Each recipe is the
smallest code that solves the problem; production code may want
more error handling.

## Follow the OS colour scheme on first visit

```vue
<script setup lang="ts">
import ThemeSelect from "../ThemeSelect.vue";

const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches;
</script>

<template>
    <ThemeSelect
        label="Theme"
        themes-url="/assets/themes/"
        :themes="['light', 'dark']"
        :default-value="prefersDark ? 'dark' : 'light'"
        storage-key="my-app:theme"
    />
</template>
```

The user's explicit choice (via `storageKey`) wins on later visits.

## Track OS colour scheme changes live

```vue
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import ThemeSelect from "../ThemeSelect.vue";

const theme = ref("");

let mql: MediaQueryList | undefined;
function handler(e: MediaQueryListEvent) {
    theme.value = e.matches ? "dark" : "light";
}

onMounted(() => {
    mql = window.matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener("change", handler);
});

onBeforeUnmount(() => {
    mql?.removeEventListener("change", handler);
});
</script>

<template>
    <ThemeSelect
        label="Theme"
        themes-url="/assets/themes/"
        :themes="['light', 'dark']"
        v-model:value="theme"
    />
</template>
```

## Read a theme cookie before render (Nuxt 3)

See [`../examples/nuxt-cookie/`](../examples/nuxt-cookie/) for the
full recipe.

## Migrate from a localStorage-only select to a cookie-backed one

1. Keep `storageKey` for now so existing users don't lose their
   preference.
2. In the `change` handler, also `fetch("/api/theme", { method: "POST", body: ... })`
   to write the cookie.
3. On the server, prefer the cookie. On the client, prefer the
   server-supplied value via `value` (which short-circuits the
   storage read).

## Build a flyout / dropdown UI

Use [custom-rendering](./custom-rendering.md) to swap the native
`<select>` for a button-triggered popover. Render the popover
*trigger* with its own `aria-label` so screen readers still hear the
control's name, and call `setTheme` from your wrapper.

## Serve themes from a CDN

```vue
<ThemeSelect
    themes-url="https://cdn.example.com/lily-themes/"
    :themes="['light', 'dark', 'abyss']"
    label="Theme"
/>
```

The CDN must allow cross-origin stylesheet loading (a stylesheet
served from a different origin does not need CORS, but a `<link
crossorigin="…">` attribute is needed if you also need
`document.styleSheets[].cssRules` access from the same origin).

## Cache-bust a theme

```vue
<ThemeSelect
    themes-url="/assets/themes/"
    :themes="['light', 'dark']"
    extension=".css?v=2025-06-05"
    label="Theme"
/>
```

The extension is concatenated verbatim, so anything that comes
after the slug works.

## Multiple regions with independent themes

See [`../examples/multiple-selects.vue`](../examples/multiple-selects.vue).
Each select gets a distinct `name` (so the `<select>`s and managed
`<link>`s don't collide) and a distinct `target` (so `data-theme`
goes on the section root rather than `<html>`).

## Programmatically switch themes from a sibling component

The bindable `value` is the simplest channel. Hoist `theme` to a
shared `provide`/`inject` or to a Pinia store, and write to it from
anywhere:

```ts
// in a sibling
import { inject } from "vue";
const themeRef = inject<Ref<string>>("theme");
function goNight() { themeRef!.value = "dark"; }
```

The select reacts via its `watch` on `props.value`.

## Sync theme across multiple tabs

`localStorage` writes fire a `storage` event in other tabs:

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue";
import ThemeSelect from "../ThemeSelect.vue";

const theme = ref("");

onMounted(() => {
    window.addEventListener("storage", (e) => {
        if (e.key === "my-app:theme" && e.newValue) theme.value = e.newValue;
    });
});
</script>

<template>
    <ThemeSelect
        label="Theme"
        themes-url="/assets/themes/"
        :themes="['light', 'dark']"
        v-model:value="theme"
        storage-key="my-app:theme"
    />
</template>
```
