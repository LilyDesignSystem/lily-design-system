<script setup lang="ts">
// ColombiaCedulaDeCiudadaniaView component
//
// A headless display for Colombia's Cedula de Ciudadania Number.
// Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
//
// References:
//   - https://en.wikipedia.org/wiki/Colombian_identity_card

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
    <!-- ColombiaCedulaDeCiudadaniaView.vue -->
    <span class="colombia-cedula-de-ciudadania-view"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        >{{ value }}</span
    >
</template>
