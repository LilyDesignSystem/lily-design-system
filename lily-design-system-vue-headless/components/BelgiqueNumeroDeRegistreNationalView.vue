<script setup lang="ts">

    // BelgiqueNumeroDeRegistreNationalView component
    //
    // A headless display for Belgium's Numéro de Registre National / Rijksregisternummer (NRN).
    // Format: 11 digits where the first 6 are the date of birth (YYMMDD), the next 3 are an ordering number (uneven for men, even for women) and the last 2 a check digit.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Belgium

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- BelgiqueNumeroDeRegistreNationalView.vue -->
    <span
        class="belgique-numero-de-registre-national-view"
        :aria-label="label">{{ value }}</span
    >
</template>
