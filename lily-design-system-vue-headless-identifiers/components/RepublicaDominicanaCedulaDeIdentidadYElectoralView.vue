<script setup lang="ts">
// RepublicaDominicanaCedulaDeIdentidadYElectoralView component
//
// A headless display for the Dominican Republic's Cédula de Identidad y Electoral.
// Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
//
// References:
//   - https://es.wikipedia.org/wiki/Junta_Central_Electoral_(Rep%C3%BAblica_Dominicana)

withDefaults(
    defineProps<{
        label?: string;
        value?: string;
    }>(),
    {
        value: "",
    },
);
</script>

<template>
    <!-- RepublicaDominicanaCedulaDeIdentidadYElectoralView.vue -->
    <span class="republica-dominicana-cedula-de-identidad-y-electoral-view"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        >{{ value }}</span
    >
</template>
