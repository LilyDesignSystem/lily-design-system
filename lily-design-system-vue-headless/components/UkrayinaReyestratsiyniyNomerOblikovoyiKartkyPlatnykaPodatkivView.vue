<script setup lang="ts">

    // UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView component
    //
    // A headless display for Ukraine's Taxpayer Registration Card Number (RNOKPP).
    // Format: 10 digits: 5 digits encode date of birth as days elapsed since 1 January 1900, 4 digits are a sequence number encoding sex by parity, and the 10th digit is a weighted-sum check digit.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Taxpayer_Identification_Number

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView.vue -->
    <span
        class="ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view"
        :aria-label="label">{{ value }}</span
    >
</template>
