<script setup lang="ts">

    // RomaniaCodNumericPersonalView component
    //
    // A headless display for Romania's Cod Numeric Personal (CNP).
    // Format: 13 digits: gender and century (1/3/5/7 male; 2/4/6/8 female; 9 foreigner), date of birth (YYMMDD), country zone (01-52, or 99 for Bucharest sectors), serial (3 digits), and a Modulus-11 checksum digit.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Romania

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- RomaniaCodNumericPersonalView.vue -->
    <span
        class="romania-cod-numeric-personal-view"
        :aria-label="label">{{ value }}</span
    >
</template>
