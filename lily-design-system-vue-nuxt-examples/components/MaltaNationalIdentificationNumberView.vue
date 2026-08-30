<script setup lang="ts">

    // MaltaNationalIdentificationNumberView component
    //
    // A headless display for Malta's Malta National Identification Number.
    // Format: 8 characters: 7 digits and a letter (A, B, G, H, L, M, P, or Z) that encodes geographic origin and registration era.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Malta

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- MaltaNationalIdentificationNumberView.vue -->
    <span
        class="malta-national-identification-number-view"
        :aria-label="label">{{ value }}</span
    >
</template>
