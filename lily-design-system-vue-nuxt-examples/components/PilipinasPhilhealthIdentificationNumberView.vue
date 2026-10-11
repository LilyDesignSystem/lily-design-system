<script setup lang="ts">

    // PilipinasPhilhealthIdentificationNumberView component
    //
    // A headless display for the Philippines' PhilHealth Identification Number (PIN).
    // Format: Twelve-digit number assigned by the Philippine Health Insurance Corporation (PhilHealth) to every enrolled member, commonly displayed grouped as NN-NNNNNNNNN-N. No published check-digit algorithm; correctness is confirmed against PhilHealth's own membership records.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/PhilHealth

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- PilipinasPhilhealthIdentificationNumberView.vue -->
    <span
        class="pilipinas-philhealth-identification-number-view"
        :aria-label="label">{{ value }}</span
    >
</template>
