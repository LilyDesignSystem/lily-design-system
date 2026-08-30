<script setup lang="ts">

    // UnitedKingdomNationalInsuranceNumberView component
    //
    // A headless display for United Kingdom's National Insurance Number (NINO).
    // Format: two prefix letters, six digits, and a suffix letter (A, B, C, or D) — e.g. AB123456A; the letters D, F, I, Q, U, V and the prefix-2 letter O are excluded.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_Insurance_number

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- UnitedKingdomNationalInsuranceNumberView.vue -->
    <span
        class="united-kingdom-national-insurance-number-view"
        :aria-label="label">{{ value }}</span
    >
</template>
