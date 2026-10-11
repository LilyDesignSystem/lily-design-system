<script setup lang="ts">

    // OsterreichSozialversicherungsnummerView component
    //
    // A headless display for Austria's Sozialversicherungsnummer (SVNR).
    // Format: 10 digits as NNNN DDMMYY: a 3-digit serial number, a Modulus-11 check digit, then date of birth (DDMMYY).
    //
    // References:
    //   - https://de.wikipedia.org/wiki/Sozialversicherungsnummer

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- OsterreichSozialversicherungsnummerView.vue -->
    <span
        class="osterreich-sozialversicherungsnummer-view"
        :aria-label="label">{{ value }}</span
    >
</template>
