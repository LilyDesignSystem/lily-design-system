<script setup lang="ts">

    // TurkiyeTcKimlikNumarasiView component
    //
    // A headless display for Turkey's T.C. Kimlik Numarasi.
    // Format: 11 digits, the first never zero: the 10th digit is derived from weighted odd/even digit sums, the 11th is the (always even) sum of the first ten digits.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Turkish_Identification_Number

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- TurkiyeTcKimlikNumarasiView.vue -->
    <span
        class="turkiye-tc-kimlik-numarasi-view"
        :aria-label="label">{{ value }}</span
    >
</template>
