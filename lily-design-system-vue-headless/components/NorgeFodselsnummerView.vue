<script setup lang="ts">

    // NorgeFodselsnummerView component
    //
    // A headless display for Norway's Fødselsnummer.
    // Format: 11 digits where the first 6 represent the date of birth (DDMMYY).
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Norway

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- NorgeFodselsnummerView.vue -->
    <span
        class="norge-fodselsnummer-view"
        :aria-label="label">{{ value }}</span
    >
</template>
