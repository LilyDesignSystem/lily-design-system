<script setup lang="ts">

    // PrathetThaiLekPrajamTuaPrachachonView component
    //
    // A headless display for Thailand's National Identification Number.
    // Format: 13 digits: registration category, district/province office code, a serial number, a Modulus-11 check digit, and 2 further disambiguating digits.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Thai_identity_card

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- PrathetThaiLekPrajamTuaPrachachonView.vue -->
    <span
        class="prathet-thai-lek-prajam-tua-prachachon-view"
        :aria-label="label">{{ value }}</span
    >
</template>
