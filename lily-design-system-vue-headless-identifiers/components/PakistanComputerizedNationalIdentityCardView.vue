<script setup lang="ts">
// PakistanComputerizedNationalIdentityCardView component
//
// A headless display for Pakistan's Computerized National Identity Card Number (CNIC).
// Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
//
// References:
//   - https://en.wikipedia.org/wiki/Computerized_National_Identity_Card

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
    <!-- PakistanComputerizedNationalIdentityCardView.vue -->
    <span class="pakistan-computerized-national-identity-card-view"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        >{{ value }}</span
    >
</template>
