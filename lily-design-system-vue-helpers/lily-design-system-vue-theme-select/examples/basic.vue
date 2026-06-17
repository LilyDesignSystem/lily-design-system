<!--
    Example 1 — Basic usage.

    The minimum viable select: a label, a themes directory, and a slug
    list. The select resolves "light" as the initial active theme (since
    "light" is in the list), sets data-theme="light" on <html>, and
    injects a <link rel="stylesheet"> pointing at /assets/themes/light.css.

    The default markup is a native <select class="theme-select"> with one
    <option class="theme-select-option"> per slug.
-->
<script setup lang="ts">
import ThemeSelect from "../ThemeSelect.vue";
</script>

<template>
    <ThemeSelect
        label="Theme"
        themes-url="/assets/themes/"
        :themes="['light', 'dark', 'abyss']"
    />
</template>
