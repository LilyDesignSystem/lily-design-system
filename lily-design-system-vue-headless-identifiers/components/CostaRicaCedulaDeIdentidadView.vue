<script setup lang="ts">
// CostaRicaCedulaDeIdentidadView component
//
// A headless display for Costa Rica's Cédula de Identidad.
// Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
//
// References:
//   - https://es.wikipedia.org/wiki/C%C3%A9dula_de_identidad_(Costa_Rica)

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
    <!-- CostaRicaCedulaDeIdentidadView.vue -->
    <span class="costa-rica-cedula-de-identidad-view"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        >{{ value }}</span
    >
</template>
