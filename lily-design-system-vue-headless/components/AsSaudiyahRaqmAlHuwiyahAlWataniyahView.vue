<script setup lang="ts">
// AsSaudiyahRaqmAlHuwiyahAlWataniyahView component
//
// A headless display for Saudi Arabia's National Identification Number.
// Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
//
// References:
//   - https://en.wikipedia.org/wiki/National_identity_card

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
    <!-- AsSaudiyahRaqmAlHuwiyahAlWataniyahView.vue -->
    <span class="as-saudiyah-raqm-al-huwiyah-al-wataniyah-view"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        >{{ value }}</span
    >
</template>
