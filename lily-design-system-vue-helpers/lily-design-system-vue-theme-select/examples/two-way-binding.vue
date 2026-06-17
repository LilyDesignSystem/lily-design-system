<!--
    Example 2 — Two-way binding + change handler.

    `v-model:value` exposes the active slug to surrounding code. `@change`
    fires after each apply, which is the right hook for analytics, telling
    the server, or notifying a sibling component.
-->
<script setup lang="ts">
import { ref } from "vue";
import ThemeSelect from "../ThemeSelect.vue";

const theme = ref("");

function trackThemeChange(slug: string) {
    // e.g. fetch("/api/preferences", { method: "POST", body: JSON.stringify({ theme: slug }) });
    console.info("theme changed:", slug);
}
</script>

<template>
    <ThemeSelect
        label="Theme"
        themes-url="/assets/themes/"
        :themes="['light', 'dark', 'abyss']"
        v-model:value="theme"
        @change="trackThemeChange"
    />

    <p>Current theme: <strong>{{ theme || "(resolving…)" }}</strong></p>
</template>
