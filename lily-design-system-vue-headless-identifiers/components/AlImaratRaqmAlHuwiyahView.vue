<script setup lang="ts">
// AlImaratRaqmAlHuwiyahView component
//
// A headless display for the United Arab Emirates' Emirates ID number.
// Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
//
// References:
//   - https://en.wikipedia.org/wiki/Emirates_ID

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
    <!-- AlImaratRaqmAlHuwiyahView.vue -->
    <span class="al-imarat-raqm-al-huwiyah-view"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        >{{ value }}</span
    >
</template>
