<script setup lang="ts">
// HongKongIdentityCardView component
//
// A headless display for Hong Kong's Identity Card Number.
// Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
//
// References:
//   - https://en.wikipedia.org/wiki/Hong_Kong_identity_card

withDefaults(
    defineProps<{
        label: string;
        value?: string;
    }>(),
    {
        value: "",
    },
);
</script>

<template>
    <!-- HongKongIdentityCardView.vue -->
    <span
        class="hong-kong-identity-card-view"
        :aria-label="label"
        >{{ value }}</span
    >
</template>
