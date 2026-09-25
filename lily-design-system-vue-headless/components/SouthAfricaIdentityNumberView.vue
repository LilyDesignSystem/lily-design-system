<script setup lang="ts">

    // SouthAfricaIdentityNumberView component
    //
    // A headless display for South Africa's Identity Number.
    // Format: Thirteen digits in the form YYMMDDSSSSCAZ: the first six encode date of birth; the next four encode sex (0000-4999 female, 5000-9999 male); the eleventh digit encodes citizenship status (0 citizen, 1 permanent resident, 2 refugee); the twelfth is a legacy field fixed at 8 on modern cards; the thirteenth is a Luhn (Modulus-10) check digit over the preceding twelve.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/South_African_identity_card

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- SouthAfricaIdentityNumberView.vue -->
    <span
        class="south-africa-identity-number-view"
        :aria-label="label">{{ value }}</span
    >
</template>
