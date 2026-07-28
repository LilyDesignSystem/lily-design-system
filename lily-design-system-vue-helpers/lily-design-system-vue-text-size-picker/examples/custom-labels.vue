<!--
    Example 4 — Custom labels.

    Default labels title-case the slug ("x-large" → "X Large"). Pass
    `sizeLabels` to override per-slug — useful for i18n or for shorter,
    friendlier display strings than the raw slug.
-->
<script setup lang="ts">
import TextSizePicker from "../TextSizePicker.vue";

const labels: Record<string, string> = {
    small: "Petit",
    medium: "Moyen",
    large: "Grand",
    "x-large": "Très grand",
};
</script>

<template>
    <TextSizePicker
        label="Taille du texte"
        :sizes="['small', 'medium', 'large', 'x-large']"
        :size-labels="labels"
    />
</template>
