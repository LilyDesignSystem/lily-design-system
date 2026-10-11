<script setup lang="ts">

    // RossiyaSnilsView component
    //
    // A headless display for Russia's SNILS (Individual Insurance Account Number).
    // Format: 11 digits as NNN-NNN-NNN CC: a 9-digit account number followed by a Modulus-101 weighted check value.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/SNILS_(Russia)

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- RossiyaSnilsView.vue -->
    <span
        class="rossiya-snils-view"
        :aria-label="label">{{ value }}</span
    >
</template>
