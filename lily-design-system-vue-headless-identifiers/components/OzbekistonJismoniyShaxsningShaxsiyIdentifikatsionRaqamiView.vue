<script setup lang="ts">
// OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView component
//
// A headless display for Uzbekistan's Personal identification number (JShShIR / PINFL).
// Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
//
// References:
//   - https://kun.uz/en/news/2026/01/26/how-to-find-your-pinfl

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
    <!-- OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView.vue -->
    <span class="ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        >{{ value }}</span
    >
</template>
