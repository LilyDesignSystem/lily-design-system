<script setup lang="ts">

    // EspanaCodigoDeIdentificacionFiscalView component
    //
    // A headless display for Spain's Código de Identificación Fiscal (CIF).
    // Format: 9 characters: 8 numbers and a control letter (the letters I, Ñ, O, and U are not used).
    //
    // References:
    //   - https://en.wikipedia.org/wiki/VAT_identification_number#Spain

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- EspanaCodigoDeIdentificacionFiscalView.vue -->
    <span
        class="espana-codigo-de-identificacion-fiscal-view"
        :aria-label="label">{{ value }}</span
    >
</template>
