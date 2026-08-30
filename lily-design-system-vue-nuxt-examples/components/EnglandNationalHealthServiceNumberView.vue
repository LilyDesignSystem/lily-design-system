<script setup lang="ts">

    // EnglandNationalHealthServiceNumberView component
    //
    // A headless display for England's National Health Service Number (NHS).
    // Format: 10 digits in 3-3-4 format with a Modulus-11 check digit, allocated through the Personal Demographics Service.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/NHS_number

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- EnglandNationalHealthServiceNumberView.vue -->
    <span
        class="england-national-health-service-number-view"
        :aria-label="label">{{ value }}</span
    >
</template>
