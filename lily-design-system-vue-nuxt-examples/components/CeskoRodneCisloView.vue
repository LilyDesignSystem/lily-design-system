<script setup lang="ts">

    // CeskoRodneCisloView component
    //
    // A headless display for Czech Republic's Rodné číslo (RČ).
    // Format: nine or ten digits in the format YYXXDD/SSSC where XX=MM for males and MM+50 for females; the ten-digit form ends in a check digit and is usually divisible by 11.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Czech_Republic

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- CeskoRodneCisloView.vue -->
    <span
        class="cesko-rodne-cislo-view"
        :aria-label="label">{{ value }}</span
    >
</template>
