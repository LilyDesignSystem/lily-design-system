<script setup lang="ts">

    // LiechtensteinNationalIdentityCardNumberView component
    //
    // A headless display for Liechtenstein's Liechtenstein National Identity Card Number.
    // Format: 2 letters followed by 8 digits (e.g. ID022143586); changes with each renewed card.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identity_card

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- LiechtensteinNationalIdentityCardNumberView.vue -->
    <span
        class="liechtenstein-national-identity-card-number-view"
        :aria-label="label">{{ value }}</span
    >
</template>
