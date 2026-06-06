<!--
    Example 9 — All 41 Lily / DaisyUI themes.

    This is the full catalog shipped in `../../themes/`. Drop them all
    into `public/assets/themes/` and the picker will swap between them.
    "light" remains the default because it is in the list.
-->
<script setup lang="ts">
import ThemePicker from "../ThemePicker.vue";

const themes = [
    "abyss",
    "acid",
    "aqua",
    "autumn",
    "black",
    "bumblebee",
    "business",
    "caramellatte",
    "cmyk",
    "coffee",
    "corporate",
    "cupcake",
    "cyberpunk",
    "dark",
    "dim",
    "dracula",
    "emerald",
    "fantasy",
    "forest",
    "garden",
    "halloween",
    "lemonade",
    "light",
    "lofi",
    "luxury",
    "night",
    "nord",
    "pastel",
    "retro",
    "silk",
    "sunset",
    "synthwave",
    "valentine",
    "winter",
    "wireframe",
    "united-kingdom-national-health-service-england-for-patients",
    "united-kingdom-national-health-service-england-for-practitioners",
    "united-kingdom-national-health-service-scotland-for-patients",
    "united-kingdom-national-health-service-scotland-for-practitioners",
    "united-kingdom-national-health-service-wales-for-patients",
    "united-kingdom-national-health-service-wales-for-practitioners",
];
</script>

<template>
    <ThemePicker
        label="Lily theme"
        themes-url="/assets/themes/"
        :themes="themes"
        storage-key="lily:theme"
    />
</template>
