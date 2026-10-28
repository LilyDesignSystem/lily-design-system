<script setup lang="ts">
// EspanaTarjetaSanitariaIndividualView component
//
// A headless display for a España TSI / CIP-SNS in read-only format.

withDefaults(
    defineProps<{
        label: string;
        value?: string;
    }>(),
    {
        value: "",
    },
);
</script>

<template>
    <!-- EspanaTarjetaSanitariaIndividualView.vue -->
    <span
        class="espana-tarjeta-sanitaria-individual-view"
        :aria-label="label"
        >{{ value }}</span
    >
</template>
