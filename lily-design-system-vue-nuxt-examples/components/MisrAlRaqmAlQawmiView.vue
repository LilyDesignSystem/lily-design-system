<script setup lang="ts">

    // MisrAlRaqmAlQawmiView component
    //
    // A headless display for Egypt's National Number.
    // Format: 14 digits: century of birth, date of birth (YYMMDD), governorate code, a sequence number encoding sex by parity, and a check digit.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Egyptian_National_Identity_Card

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- MisrAlRaqmAlQawmiView.vue -->
    <span
        class="misr-al-raqm-al-qawmi-view"
        :aria-label="label">{{ value }}</span
    >
</template>
