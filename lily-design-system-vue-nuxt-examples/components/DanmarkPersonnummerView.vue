<script setup lang="ts">

    // DanmarkPersonnummerView component
    //
    // A headless display for Denmark's Personnummer (CPR-nummer) (CPR).
    // Format: 10 digits in the format DDMMYYXXXX where the first 6 are the date of birth (DDMMYY).
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Personal_identification_number_(Denmark)

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- DanmarkPersonnummerView.vue -->
    <span
        class="danmark-personnummer-view"
        :aria-label="label">{{ value }}</span
    >
</template>
