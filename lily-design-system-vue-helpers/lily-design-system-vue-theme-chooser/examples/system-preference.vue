<!--
    Example — Follow the OS `prefers-color-scheme`.

    Set `detect-from-system` and the select resolves the first-visit
    theme from `matchMedia("(prefers-color-scheme: dark)")`, mapping the
    result to the `dark` / `light` slug when that slug is in `themes`.
    It sits between storage and `defaultValue` in the resolution order:

        value > storage > detect-from-system > defaultValue > "light" > themes[0]

    So a returning user's stored pick still wins, and detection only
    decides the very first visit. If the OS preference maps to a slug
    that is not in `themes`, detection yields nothing and resolution
    falls through to `defaultValue`.

    This mirrors `detect-from-navigator` on locale-chooser.

    If you want the select to *track* the OS preference over time (re-
    apply when the user toggles their system setting), add a
    `matchMedia.addEventListener("change", …)` listener and write to the
    `v-model:value`-bound ref, as below.
-->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import ThemeChooser from "../ThemeChooser.vue";

const theme = ref("");

// Optional: keep following the OS after the first visit. Drop this
// block if the first-visit default is all you need.
let media: MediaQueryList | undefined;
function onSystemChange(event: MediaQueryListEvent): void {
    theme.value = event.matches ? "dark" : "light";
}

onMounted(() => {
    media = window.matchMedia?.("(prefers-color-scheme: dark)");
    media?.addEventListener("change", onSystemChange);
});

onBeforeUnmount(() => {
    media?.removeEventListener("change", onSystemChange);
});
</script>

<template>
    <ThemeChooser
        label="Theme"
        themes-url="/assets/themes/"
        :themes="['light', 'dark']"
        detect-from-system
        v-model:value="theme"
        storage-key="my-app:theme"
    />
</template>
