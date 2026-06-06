<!--
    Example 8 — Follow the OS `prefers-color-scheme`.

    The picker has no opinion about light vs. dark; it just owns the
    selection contract. To make the first-visit default follow the OS,
    resolve the media query yourself and pass the resolved slug as
    `defaultValue`. The user can still pick anything they like
    afterwards, and the choice persists via `storageKey`.

    If you want the picker to *track* the OS preference over time (re-
    apply when the user toggles their system setting), add a
    `matchMedia.addEventListener("change", …)` listener and write to the
    `v-model:value`-bound ref.
-->
<script setup lang="ts">
import { ref } from "vue";
import ThemePicker from "../ThemePicker.vue";

const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches;

const theme = ref("");
</script>

<template>
    <ThemePicker
        label="Theme"
        themes-url="/assets/themes/"
        :themes="['light', 'dark']"
        :default-value="prefersDark ? 'dark' : 'light'"
        v-model:value="theme"
        storage-key="my-app:theme"
    />
</template>
