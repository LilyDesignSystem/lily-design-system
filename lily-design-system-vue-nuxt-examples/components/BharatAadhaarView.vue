<script setup lang="ts">

    // BharatAadhaarView component
    //
    // A headless display for India's Aadhaar (आधार).
    // Format: Twelve digits, the first of which is never 0 or 1. The twelfth digit is a check digit computed with the Verhoeff algorithm, a checksum that detects every single-digit error and every adjacent-digit transposition. Issued by the Unique Identification Authority of India (UIDAI).
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Aadhaar

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- BharatAadhaarView.vue -->
    <span
        class="bharat-aadhaar-view"
        :aria-label="label">{{ value }}</span
    >
</template>
