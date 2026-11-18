<script setup lang="ts">
// UruguayCedulaDeIdentidadView component
//
// A headless display for Uruguay's Cedula de Identidad Number.
// Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
//
// References:
//   - https://en.wikipedia.org/wiki/C%C3%A9dula_de_identidad

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
    <!-- UruguayCedulaDeIdentidadView.vue -->
    <span class="uruguay-cedula-de-identidad-view"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        >{{ value }}</span
    >
</template>
