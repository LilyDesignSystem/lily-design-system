<script setup lang="ts">

    // SlovenijaEmsoView component
    //
    // A headless display for Slovenia's Enotna Matična Številka Občana (EMŠO).
    // Format: 13 digits: the first 7 are the date of birth (DDMMYYY), digits 8-9 the register, 10-12 a sex-and-serial component (000-499 male, 500-999 female), 13 a check digit.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Unique_Master_Citizen_Number

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- SlovenijaEmsoView.vue -->
    <span
        class="slovenija-emso-view"
        :aria-label="label">{{ value }}</span
    >
</template>
