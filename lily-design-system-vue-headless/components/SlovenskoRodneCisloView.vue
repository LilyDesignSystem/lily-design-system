<script setup lang="ts">

    // SlovenskoRodneCisloView component
    //
    // A headless display for Slovakia's Rodné číslo (RČ).
    // Format: 10 digits in the form YYMMDDCCCX where MM is 01-12 for males and 51-62 for females; X is a check digit and the whole number is divisible by 11.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Slovakia

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- SlovenskoRodneCisloView.vue -->
    <span
        class="slovensko-rodne-cislo-view"
        :aria-label="label">{{ value }}</span
    >
</template>
