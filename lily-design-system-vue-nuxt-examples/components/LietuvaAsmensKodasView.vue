<script setup lang="ts">

    // LietuvaAsmensKodasView component
    //
    // A headless display for Lithuania's Asmens kodas.
    // Format: 11 digits in the format GYYMMDDNNNC: G encodes sex and century (4 or 6 women, 3 or 5 men), YYMMDD is the date of birth, NNN is a serial, C is the check digit.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Lithuania

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- LietuvaAsmensKodasView.vue -->
    <span
        class="lietuva-asmens-kodas-view"
        :aria-label="label">{{ value }}</span
    >
</template>
