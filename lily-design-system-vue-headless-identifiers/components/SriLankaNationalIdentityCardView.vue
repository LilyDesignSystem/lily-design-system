<script setup lang="ts">
// SriLankaNationalIdentityCardView component
//
// A headless display for Sri Lanka's National Identity Card (NIC) number.
// Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
//
// References:
//   - https://en.wikipedia.org/wiki/National_identity_card_(Sri_Lanka)

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
    <!-- SriLankaNationalIdentityCardView.vue -->
    <span class="sri-lanka-national-identity-card-view"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        >{{ value }}</span
    >
</template>
