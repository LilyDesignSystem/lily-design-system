<!--
    Example 1 — Basic usage.

    The minimum viable picker: a label, a themes directory, and a slug
    list. The picker resolves "light" as the initial active theme (since
    "light" is in the list), sets data-theme="light" on <html>, and
    injects a <link rel="stylesheet"> pointing at /assets/themes/light.css.
-->
<script setup lang="ts">
import ThemePicker from "../ThemePicker.vue";
</script>

<template>
    <ThemePicker
        label="Theme"
        themes-url="/assets/themes/"
        :themes="['light', 'dark', 'abyss']"
    />
</template>
