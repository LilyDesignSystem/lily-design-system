<!--
    All 63 Lily themes.

    This is the full catalog shipped in `../../themes/`. Drop them all
    into `public/assets/themes/` and the select will swap between them.
    "light" remains the default because it is in the list.
-->
<script setup lang="ts">
import ThemePicker from "../ThemePicker.vue";

const themes = [
    "abyss",
    "acid",
    "adobe-spectrum",
    "ant-design",
    "aqua",
    "atlassian",
    "australia-agriculture-design-system",
    "autumn",
    "black",
    "brazil-padrao-digital-de-governo",
    "bumblebee",
    "business",
    "canada-government-of-canada-design-system",
    "cappuccino",
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
    "european-union-europa-component-library",
    "excel",
    "fantasy",
    "fluent",
    "forest",
    "garden",
    "github-primer",
    "halloween",
    "ibm-carbon",
    "japan-digital-agency-design-system",
    "lemonade",
    "light",
    "linear",
    "lofi",
    "luxury",
    "mozilla-protocol",
    "night",
    "nord",
    "notion",
    "pastel",
    "retro",
    "salesforce",
    "sap-fiori",
    "silk",
    "singapore-government-design-system",
    "sunset",
    "synthwave",
    "valentine",
    "vercel",
    "winter",
    "wireframe",
    "united-kingdom-government-digital-service",
    "united-kingdom-national-health-service-england-for-patients",
    "united-kingdom-national-health-service-england-for-practitioners",
    "united-kingdom-national-health-service-scotland-for-patients",
    "united-kingdom-national-health-service-scotland-for-practitioners",
    "united-kingdom-national-health-service-wales-for-patients",
    "united-kingdom-national-health-service-wales-for-practitioners",
    "united-states-web-design-system",
    "valentine",
    "winter",
    "wireframe",
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
