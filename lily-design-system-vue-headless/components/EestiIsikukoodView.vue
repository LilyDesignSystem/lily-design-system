<script setup lang="ts">

    // EestiIsikukoodView component
    //
    // A headless display for Estonia's Isikukood (IK).
    // Format: 11 digits in the form GYYMMDDSSSC: G is sex and century (odd male, even female; 1-2 19th c., 3-4 20th c., 5-6 21st c.), SSS distinguishes persons born the same day, C is a checksum.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Estonia

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- EestiIsikukoodView.vue -->
    <span
        class="eesti-isikukood-view"
        :aria-label="label">{{ value }}</span
    >
</template>
