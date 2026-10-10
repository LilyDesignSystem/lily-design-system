<!--
    Example 4 — Custom labels.

    Default labels title-case the slug ("light" → "Light"). Pass
    `themeLabels` to override per-slug — useful for i18n or for slugs that
    don't gracefully title-case (e.g. country-prefixed Lily theme slugs).
-->
<script setup lang="ts">
import ThemePicker from "../ThemePicker.vue";

const labels: Record<string, string> = {
    light: "Clair",
    dark: "Sombre",
    "united-kingdom-national-health-service-england-for-patients": "NHS England (patients)",
    "united-kingdom-national-health-service-england-for-practitioners": "NHS England (practitioners)",
};
</script>

<template>
    <ThemePicker
        label="Thème"
        themes-url="/assets/themes/"
        :themes="[
            'light',
            'dark',
            'united-kingdom-national-health-service-england-for-patients',
            'united-kingdom-national-health-service-england-for-practitioners',
        ]"
        :theme-labels="labels"
    />
</template>
