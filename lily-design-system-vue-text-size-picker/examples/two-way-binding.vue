<!--
    Example 2 — Two-way binding + change handler.

    `v-model:value` exposes the active slug to surrounding code. `@change`
    fires after each apply, which is the right hook for analytics, telling
    the server, or notifying a sibling component.
-->
<script setup lang="ts">
import { ref } from "vue";
import TextSizePicker from "../TextSizePicker.vue";

const size = ref("");

function trackSizeChange(slug: string) {
    // e.g. fetch("/api/preferences", { method: "POST", body: JSON.stringify({ textSize: slug }) });
    console.info("text size changed:", slug);
}
</script>

<template>
    <TextSizePicker
        label="Text size"
        :sizes="['small', 'medium', 'large', 'x-large']"
        v-model:value="size"
        @change="trackSizeChange"
    />

    <p>Current text size: <strong>{{ size || "(resolving…)" }}</strong></p>
</template>
