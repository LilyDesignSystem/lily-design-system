# Recipes

Short solutions to common adjacent problems. Each recipe is the
smallest code that solves the problem; production code may want
more error handling.

## Follow the OS colour scheme on first visit

```vue
<script setup lang="ts">
import ThemeChooser from "../ThemeChooser.vue";

const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches;
</script>

<template>
    <ThemeChooser
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
import ThemeChooser from "../ThemeChooser.vue";

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
    <ThemeChooser
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

## Replace the button glyph

The default `◑` (U+25D1) comes from the user's fonts and may render
inconsistently or be missing altogether. The default slot replaces it —
and only it; the listbox stays component-owned:

```vue
<ThemeChooser
    label="Theme"
    themes-url="/assets/themes/"
    :themes="['light', 'dark']"
    v-model:value="theme"
>
    <template #default="{ value, labelFor }">
        <span
            class="theme-chooser-swatch"
            :data-theme="value"
            :title="labelFor(value)"
            aria-hidden="true"
        />
    </template>
</ThemeChooser>
```

Keep slot content `aria-hidden="true"` or text-free — the button's
accessible name comes from `label`. See
[custom-rendering](./custom-rendering.md).

## Build a completely different theme UI

The component owns its listbox; the slot cannot replace it. For swatch
buttons, a segmented control, or a settings-page radio group, render
your own controls and drive the same lifecycle by writing to the
binding:

```vue
<script setup lang="ts">
import { ref } from "vue";
import ThemeChooser from "../ThemeChooser.vue";

const theme = ref("");
const themes = ["light", "dark", "abyss"];
</script>

<template>
    <!--
        Hidden from sight and from assistive technology: your own group
        below is the real control. The chooser keeps owning the apply
        lifecycle (link swap, data-theme, persistence), which is
        script-only and unaffected by being hidden.
    -->
    <ThemeChooser
        class="theme-chooser-headless"
        label="Theme"
        themes-url="/assets/themes/"
        :themes="themes"
        v-model:value="theme"
        aria-hidden="true"
        inert
    />

    <div role="group" aria-label="Theme">
        <button
            v-for="t in themes"
            :key="t"
            type="button"
            class="theme-swatch"
            :data-theme="t"
            :aria-pressed="theme === t"
            @click="theme = t"
        >
            {{ t }}
        </button>
    </div>
</template>
```

`aria-hidden` and `inert` both fall through to the root `<div>`, which
is what makes this safe: without them you ship two controls that both
announce as "Theme" and both change the theme. `.theme-chooser-headless`
is your own hook — `display: none` is fine here precisely *because* the
control is no longer meant to be reachable.

This is the only supported way to fully replace the UI. Do not try to
render options through the default slot; the slot's content goes inside
the trigger button, not inside the listbox.

## Serve themes from a CDN

```vue
<ThemeChooser
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
<ThemeChooser
    themes-url="/assets/themes/"
    :themes="['light', 'dark']"
    extension=".css?v=2025-06-05"
    label="Theme"
/>
```

The extension is concatenated verbatim, so anything that comes
after the slug works.

## Multiple regions with independent themes

See [`../examples/multiple-choosers.vue`](../examples/multiple-choosers.vue).
Each chooser gets a distinct `name` (so the hidden inputs and the managed
`<link>`s don't collide) and a distinct `target` (so `data-theme`
goes on the section root rather than `<html>`). Give each a distinct
`label` too — with icon-only triggers, two buttons both named "Theme"
are indistinguishable to a screen-reader user.

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

The chooser reacts via its `watch` on `props.value`.

## Sync theme across multiple tabs

`localStorage` writes fire a `storage` event in other tabs:

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue";
import ThemeChooser from "../ThemeChooser.vue";

const theme = ref("");

onMounted(() => {
    window.addEventListener("storage", (e) => {
        if (e.key === "my-app:theme" && e.newValue) theme.value = e.newValue;
    });
});
</script>

<template>
    <ThemeChooser
        label="Theme"
        themes-url="/assets/themes/"
        :themes="['light', 'dark']"
        v-model:value="theme"
        storage-key="my-app:theme"
    />
</template>
```

---

Lily™ and Lily Design System™ are trademarks.
