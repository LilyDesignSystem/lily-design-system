<script setup lang="ts">
// MauritiusNationalIdentityCardNumberView component
//
// A headless display for Mauritius's National Identity Card number.
// Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
//
// References:
//   - https://arthurdejong.org/python-stdnum/doc/2.2/stdnum.mu.nid

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
    <!-- MauritiusNationalIdentityCardNumberView.vue -->
    <span class="mauritius-national-identity-card-number-view"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        >{{ value }}</span
    >
</template>
