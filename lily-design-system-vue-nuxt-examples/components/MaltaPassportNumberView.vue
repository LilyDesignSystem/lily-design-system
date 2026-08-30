<script setup lang="ts">

    // MaltaPassportNumberView component
    //
    // A headless display for Malta's Malta Passport Number.
    // Format: 7 numerical digits issued by the Civil Registration Directorate.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Maltese_passport

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- MaltaPassportNumberView.vue -->
    <span
        class="malta-passport-number-view"
        :aria-label="label">{{ value }}</span
    >
</template>
