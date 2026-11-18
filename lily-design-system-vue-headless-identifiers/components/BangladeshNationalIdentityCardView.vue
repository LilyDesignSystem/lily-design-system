<script setup lang="ts">
// BangladeshNationalIdentityCardView component
//
// A headless display for Bangladesh's National ID (NID) number.
// Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
//
// References:
//   - https://en.wikipedia.org/wiki/National_identity_card_(Bangladesh)

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
    <!-- BangladeshNationalIdentityCardView.vue -->
    <span class="bangladesh-national-identity-card-view"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        >{{ value }}</span
    >
</template>
